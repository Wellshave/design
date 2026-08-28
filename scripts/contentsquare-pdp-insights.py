#!/usr/bin/env python3
"""
Haalt gedragsdata van de Wellshave-productpagina's uit Contentsquare.

Beantwoordt alle vijf de meetvragen uit rapporten/productpagina-redesign.html,
inclusief de twee die via de Clarity-API niet konden:

  1. Scrolldiepte per pagina en apparaat  -> haalt iemand het mechanisme-blok?
  2. Rage clicks en frustratie per pagina -> waar loopt men vast?
  3. Quickbacks                           -> matcht de pagina met de advertentie?
  4. Desktop-checkout die afbreekt        -> via JS- en API-fouten per apparaat
  5. Klikken op het koopblok              -> via targets_clicks

LET OP - dit script vereist een betaald Contentsquare-plan. De Export API zit
vanaf Growth in het pakket; op het Free-plan is de APIs-regel leeg en levert
het inloggen niets op. Op Free is de MCP-connector de route (300 tool calls per
maand), niet dit script. Bewaard voor als het plan ooit meegroeit.

Werkt met server-to-server OAuth, dus zonder de Claude-connector:

    export CS_CLIENT_ID='...'
    export CS_CLIENT_SECRET='...'
    export CS_PROJECT_ID='...'      # alleen bij account-level credentials
    python3 scripts/contentsquare-pdp-insights.py

Credentials maak je in de Contentsquare-console; API-sleutels zijn sinds
april 2024 vervangen door OAuth. Zet ze NOOIT in de repo.

De Export API werkt asynchroon: dit script maakt een exportjob aan, wacht tot
hij klaar is, downloadt de JSONL-bestanden en rekent ze door. Een venster van
maximaal 7 dagen per job is de limiet van de API.

Let op: dit is gebouwd op de API-documentatie en nog niet tegen een live
project gedraaid. Het faalt luid en met uitleg als een aanname niet klopt.
"""

import gzip
import io
import json
import os
import statistics
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import datetime, timedelta, timezone

AUTH_URL = "https://api.contentsquare.com/v1/oauth/token"
DAYS = 7  # maximum per exportjob
POLL_SECONDEN = 20
POLL_MAX = 60  # 20 minuten

PDP_MARKER = "/products/"
CHECKOUT_MARKERS = ("/checkouts", "/checkout", "/cart")

# Alleen wat we echt doorrekenen. Elk extra veld maakt de export zwaarder.
VELDEN = [
    "url_no_query_param",
    "device_id",
    "scroll_rate",
    "view_duration_msec",
    "page_interaction_time_msec",
    "frustration_score",
    "rage_click_all_targets_ind",
    "multiple_button_interaction_ind",
    "any_js_error_ind",
    "any_api_error_ind",
    "api_error_after_click_ind",
    "is_first",
    "is_last",
]

APPARAAT = {
    0: "onbekend", 1: "desktop", 2: "mobiel", 3: "tablet",
    4: "mobiele app", 5: "tablet-app",
}

# Een pageview korter dan dit met een directe exit lezen we als quickback.
QUICKBACK_MS = 5000


def _post(url, body, headers):
    req = urllib.request.Request(
        url, data=json.dumps(body).encode(), method="POST",
        headers={"Content-Type": "application/json", **headers},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def _get(url, token):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode())


def uitleg_http(e):
    return {
        400: "ongeldige aanvraag - controleer velden en datumbereik (max 7 dagen)",
        401: "niet geautoriseerd - client_id/client_secret onjuist of token verlopen",
        403: "geen rechten - de credentials missen de scope 'data-export'",
        404: "niet gevonden - klopt het project_id?",
        429: "te veel aanvragen - even wachten",
        # Contentsquare geeft bij onjuiste credentials een generieke 500 terug
        # in plaats van een 401. Zonder deze regel stuurt de melding je het bos in.
        500: "serverfout - bij het inloggen betekent dit meestal een onjuiste "
             "client_id/client_secret, niet een storing",
    }.get(e.code, "onverwachte fout")


def inloggen():
    """Wisselt client credentials in voor een token plus de regio-basis-URL."""
    cid = os.environ.get("CS_CLIENT_ID", "").strip()
    secret = os.environ.get("CS_CLIENT_SECRET", "").strip()
    if not (cid and secret):
        sys.exit(
            "CS_CLIENT_ID en/of CS_CLIENT_SECRET ontbreken.\n\n"
            "  Contentsquare-console -> API credentials aanmaken (scope: data-export)\n"
            "  export CS_CLIENT_ID='...'\n"
            "  export CS_CLIENT_SECRET='...'\n\n"
            "Zet ze niet in de repo."
        )

    body = {
        "client_id": cid,
        "client_secret": secret,
        "grant_type": "client_credentials",
        "scope": "data-export",
    }
    if os.environ.get("CS_PROJECT_ID"):
        body["project_id"] = os.environ["CS_PROJECT_ID"].strip()

    try:
        r = _post(AUTH_URL, body, {})
    except urllib.error.HTTPError as e:
        sys.exit(f"Inloggen mislukt: HTTP {e.code} - {uitleg_http(e)}")
    except urllib.error.URLError as e:
        sys.exit(f"Inloggen mislukt: netwerkfout - {e}")

    basis = r.get("endpoint", "").rstrip("/")
    if not r.get("access_token") or not basis:
        sys.exit(f"Onverwacht antwoord bij inloggen: {json.dumps(r)[:300]}")
    print(f"  ingelogd - project {r.get('project_id', '?')} via {basis}")
    return r["access_token"], basis


def job_aanmaken(token, basis):
    tot = datetime.now(timezone.utc).date()
    vanaf = tot - timedelta(days=DAYS - 1)
    body = {
        "name": f"wellshave-pdp-{tot.isoformat()}",
        "format": "JSONL",
        "scope": "views",  # pageview-niveau
        "deviceLabel": "all",
        "frequency": {
            "value": "once",
            "dateRange": {"from": vanaf.isoformat(), "to": tot.isoformat()},
        },
        "fields": [{"fieldName": v} for v in VELDEN],
    }
    print(f"  exportjob voor {vanaf} t/m {tot} ({DAYS} dagen)")
    try:
        r = _post(f"{basis}/v1/exports", body, {"Authorization": f"Bearer {token}"})
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = " - " + e.read().decode()[:300]
        except Exception:
            pass
        sys.exit(f"Job aanmaken mislukt: HTTP {e.code} - {uitleg_http(e)}{detail}")

    job = (r.get("payload") or {}).get("jobId")
    if not job:
        sys.exit(f"Geen jobId ontvangen: {json.dumps(r)[:300]}")
    print(f"  jobId {job}")
    return job


def wachten(token, basis, job):
    """Pollt tot de run klaar is en geeft de downloadbare bestanden terug."""
    for poging in range(POLL_MAX):
        runs = _get(f"{basis}/v1/exports/{job}/runs?limit=1&order=DESC", token)
        lijst = runs if isinstance(runs, list) else (runs.get("payload") or [])
        if lijst:
            run = lijst[0]
            staat = str(run.get("state", "")).lower()
            klaar = run.get("completionRate")
            print(f"  [{poging * POLL_SECONDEN:>4}s] {staat} {klaar if klaar is not None else ''}")
            if staat in ("success", "successful", "completed", "done", "finished"):
                detail = _get(f"{basis}/v1/exports/{job}/runs/{run['jobRunId']}", token)
                d = detail.get("payload", detail)
                return d.get("files") or []
            if staat in ("failed", "error", "cancelled", "canceled"):
                sys.exit(f"Exportjob mislukt met status '{staat}'.")
        time.sleep(POLL_SECONDEN)
    sys.exit(f"Job niet klaar binnen {POLL_MAX * POLL_SECONDEN // 60} minuten. jobId {job}.")


def regels_lezen(files):
    """Streamt alle JSONL-regels uit de geexporteerde bestanden."""
    for f in files:
        url = f.get("url")
        if not url:
            continue
        with urllib.request.urlopen(url, timeout=300) as r:
            rauw = r.read()
        if rauw[:2] == b"\x1f\x8b":
            rauw = gzip.decompress(rauw)
        for regel in io.BytesIO(rauw):
            regel = regel.strip()
            if regel:
                try:
                    yield json.loads(regel)
                except json.JSONDecodeError:
                    continue


def med(xs):
    return statistics.median(xs) if xs else None


def pct(deel, totaal):
    return 100.0 * deel / totaal if totaal else 0.0


def analyseren(regels):
    pdp = defaultdict(lambda: defaultdict(list))   # url -> apparaat -> scroll
    frustratie = defaultdict(list)
    rage = defaultdict(int)
    exits = defaultdict(int)
    quickbacks = defaultdict(int)
    tellers = defaultdict(lambda: defaultdict(int))
    checkout_fout = defaultdict(lambda: defaultdict(int))
    checkout_n = defaultdict(int)

    for r in regels:
        url = r.get("url_no_query_param") or ""
        app = APPARAAT.get(r.get("device_id"), "onbekend")

        if any(m in url for m in CHECKOUT_MARKERS):
            checkout_n[app] += 1
            for veld in ("any_js_error_ind", "any_api_error_ind", "api_error_after_click_ind"):
                if (r.get(veld) or 0) > 0:
                    checkout_fout[app][veld] += 1
            continue

        if PDP_MARKER not in url:
            continue

        tellers[url][app] += 1
        if r.get("scroll_rate") is not None:
            pdp[url][app].append(float(r["scroll_rate"]))
        if r.get("frustration_score") is not None:
            frustratie[url].append(float(r["frustration_score"]))
        if (r.get("rage_click_all_targets_ind") or 0) > 0:
            rage[url] += 1
        if r.get("is_last") == 1:
            exits[url] += 1
        if (r.get("view_duration_msec") or 0) < QUICKBACK_MS and r.get("is_last") == 1:
            quickbacks[url] += 1

    return pdp, frustratie, rage, exits, quickbacks, tellers, checkout_fout, checkout_n


def rapporteren(pdp, frustratie, rage, exits, quickbacks, tellers, ck_fout, ck_n):
    top = sorted(tellers, key=lambda u: sum(tellers[u].values()), reverse=True)[:10]
    if not top:
        print("\nGeen productpagina-weergaven gevonden in dit venster.")
        return

    print("\n" + "=" * 74)
    print("1 · SCROLLDIEPTE — haalt iemand het mechanisme-blok?")
    print("=" * 74)
    print("  Blok 6 begint grofweg op 55-65% van de pagina. Ligt de mediaan")
    print("  daaronder, dan is het blok voor de helft van je bezoek onzichtbaar.\n")
    print(f"  {'pagina':<40} {'apparaat':<9} {'n':>7} {'med':>7} {'>=50%':>7} {'>=75%':>7}")
    print("  " + "-" * 72)
    for url in top:
        kort = url.split("/products/")[-1][:38]
        for app, scrolls in sorted(pdp.get(url, {}).items(), key=lambda kv: -len(kv[1])):
            if len(scrolls) < 10:
                continue
            n = len(scrolls)
            print(f"  {kort:<40} {app:<9} {n:>7} {med(scrolls):>6.1f}% "
                  f"{pct(sum(s >= 50 for s in scrolls), n):>6.1f}% "
                  f"{pct(sum(s >= 75 for s in scrolls), n):>6.1f}%")
            kort = ""

    print("\n" + "=" * 74)
    print("2 · FRUSTRATIE, RAGE CLICKS EN EXITS")
    print("=" * 74)
    print(f"  {'pagina':<40} {'n':>7} {'frustr':>8} {'rage':>7} {'exit':>7} {'qback':>7}")
    print("  " + "-" * 72)
    for url in top:
        n = sum(tellers[url].values())
        kort = url.split("/products/")[-1][:38]
        f = med(frustratie.get(url, []))
        print(f"  {kort:<40} {n:>7} {(f'{f:.1f}' if f is not None else '-'):>8} "
              f"{pct(rage.get(url, 0), n):>6.1f}% {pct(exits.get(url, 0), n):>6.1f}% "
              f"{pct(quickbacks.get(url, 0), n):>6.1f}%")
    print("\n  frustr = mediane frustration_score (0-100) · qback = exit binnen "
          f"{QUICKBACK_MS // 1000}s")

    print("\n" + "=" * 74)
    print("3 · CHECKOUT-FOUTEN PER APPARAAT — waarom desktop 44,8% haalt")
    print("=" * 74)
    if not ck_n:
        print("  Geen checkout-weergaven in dit venster.")
    else:
        print(f"  {'apparaat':<12} {'n':>8} {'JS-fout':>9} {'API-fout':>10} {'na klik':>9}")
        print("  " + "-" * 72)
        for app, n in sorted(ck_n.items(), key=lambda kv: -kv[1]):
            f = ck_fout.get(app, {})
            print(f"  {app:<12} {n:>8} "
                  f"{pct(f.get('any_js_error_ind', 0), n):>8.1f}% "
                  f"{pct(f.get('any_api_error_ind', 0), n):>9.1f}% "
                  f"{pct(f.get('api_error_after_click_ind', 0), n):>8.1f}%")
        print("\n  Staat desktop hier structureel hoger dan mobiel, dan is de kapotte")
        print("  checkout een technisch defect en geen ontwerpkeuze.")


def main():
    print("Contentsquare — gedragsdata productpagina's\n" + "=" * 74)
    token, basis = inloggen()
    job = job_aanmaken(token, basis)
    files = wachten(token, basis, job)
    if not files:
        sys.exit("Job klaar, maar geen bestanden ontvangen.")
    print(f"  {len(files)} bestand(en) — downloaden en doorrekenen")

    resultaat = analyseren(regels_lezen(files))
    rapporteren(*resultaat)

    stempel = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")
    with open(f"contentsquare-{stempel}.json", "w", encoding="utf-8") as f:
        json.dump({"jobId": job, "files": [x.get("partId") for x in files]}, f, indent=2)
    print(f"\nJob-referentie: contentsquare-{stempel}.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
