#!/usr/bin/env python3
"""
Haalt gedragsdata van de Wellshave-productpagina's uit Microsoft Clarity.

Beantwoordt drie van de vijf vragen uit rapporten/productpagina-redesign.html:
scrolldiepte per apparaat, rage- en dead clicks, en quickbacks. De andere twee
(sessie-opnames en de klikkaart) zitten niet in de API en blijven handwerk in
de Clarity-interface.

Token: Clarity -> Instellingen -> Data Export -> Generate new API token.
Alleen projectbeheerders kunnen er een maken.

    export CLARITY_API_TOKEN='...'
    python3 scripts/clarity-pdp-insights.py

Zet de token NOOIT in de repo. De API staat 10 verzoeken per project per dag
toe; dit script gebruikt er 4 en laat er dus 6 over voor handmatig werk.
Clarity bewaart via de API maar 1 tot 3 dagen, dus draai dit met een cron als
je een reeks wilt opbouwen.
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ENDPOINT = "https://www.clarity.ms/export-data/api/v1/project-live-insights"
DAYS = "3"  # maximum dat de API toestaat

# Welke pagina's ons aangaan. Alles wat hier niet in voorkomt filteren we weg.
PDP_MARKERS = ("/products/",)

# 4 van de 10 dagelijkse verzoeken. Elk verzoek beantwoordt een eigen vraag.
QUERIES = [
    {
        "naam": "pagina x apparaat",
        "vraag": "Haalt iemand het mechanisme-blok? En waar wordt woedend geklikt?",
        "params": {"dimension1": "URL", "dimension2": "Device"},
    },
    {
        "naam": "apparaat",
        "vraag": "Basislijn per apparaat, om het desktop-gat te plaatsen.",
        "params": {"dimension1": "Device"},
    },
    {
        "naam": "browser x apparaat",
        "vraag": "Is de kapotte desktop-checkout browserspecifiek?",
        "params": {"dimension1": "Browser", "dimension2": "Device"},
    },
    {
        "naam": "bron x apparaat",
        "vraag": "Komt slecht scrollgedrag uit een bepaalde advertentiebron?",
        "params": {"dimension1": "Source", "dimension2": "Device"},
    },
]

# Metrics waarbij een hoge waarde slecht nieuws is.
ALARM = {
    "RageClickCount",
    "DeadClickCount",
    "QuickbackClick",
    "ScriptErrorCount",
    "ErrorClickCount",
    "ExcessiveScroll",
}


def fetch(token, params):
    """Eén API-verzoek. Geeft (data, foutmelding) terug; precies één is None."""
    qs = urllib.parse.urlencode({"numOfDays": DAYS, **params})
    req = urllib.request.Request(
        f"{ENDPOINT}?{qs}",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8")), None
    except urllib.error.HTTPError as e:
        uitleg = {
            401: "token ontbreekt, is ongeldig of verlopen",
            403: "token mag deze bewerking niet uitvoeren",
            400: "ongeldige parameters",
            429: "dagelijkse limiet van 10 verzoeken bereikt - morgen weer",
        }.get(e.code, "onverwachte fout")
        return None, f"HTTP {e.code} - {uitleg}"
    except (urllib.error.URLError, TimeoutError) as e:
        return None, f"netwerkfout: {e}"


def is_pdp(rij):
    url = str(rij.get("Url") or rij.get("URL") or "")
    return any(m in url for m in PDP_MARKERS)


def toon(blokken, alleen_pdp):
    """Print de metrics per blok, eventueel gefilterd op productpagina's."""
    for blok in blokken:
        naam = blok.get("metricName", "?")
        rijen = blok.get("information") or []
        if alleen_pdp and rijen and any("rl" in k.lower() for k in rijen[0]):
            rijen = [r for r in rijen if is_pdp(r)]
        if not rijen:
            continue

        vlag = "  <-- let op" if naam.replace(" ", "") in ALARM else ""
        print(f"\n  {naam}{vlag}")
        for rij in rijen[:15]:
            paren = ", ".join(f"{k}={v}" for k, v in rij.items())
            print(f"    {paren[:190]}")
        if len(rijen) > 15:
            print(f"    ... nog {len(rijen) - 15} rijen (zie het JSON-bestand)")


def main():
    token = os.environ.get("CLARITY_API_TOKEN", "").strip()
    if not token:
        sys.exit(
            "CLARITY_API_TOKEN ontbreekt.\n\n"
            "  Clarity -> Instellingen -> Data Export -> Generate new API token\n"
            "  export CLARITY_API_TOKEN='...'\n\n"
            "Zet de token niet in de repo."
        )

    stempel = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")
    alles, mislukt = {}, []

    print(f"Clarity - laatste {DAYS} dagen - {stempel}")
    print(f"{len(QUERIES)} van de 10 dagelijkse verzoeken\n" + "=" * 68)

    for q in QUERIES:
        print(f"\n[{q['naam']}] {q['vraag']}")
        data, fout = fetch(token, q["params"])
        if fout:
            print(f"  MISLUKT: {fout}")
            mislukt.append((q["naam"], fout))
            if "429" in fout:
                print("\n  Limiet bereikt; de rest wordt overgeslagen.")
                break
            continue
        alles[q["naam"]] = data
        toon(data, alleen_pdp=(q["params"].get("dimension1") == "URL"))

    if alles:
        pad = f"clarity-{stempel}.json"
        with open(pad, "w", encoding="utf-8") as f:
            json.dump(alles, f, ensure_ascii=False, indent=2)
        print(f"\n{'=' * 68}\nRuwe data: {pad}")

    if mislukt:
        print("\nNiet opgehaald:")
        for naam, fout in mislukt:
            print(f"  - {naam}: {fout}")

    print(
        "\nNiet via de API te krijgen, dus handwerk in Clarity:\n"
        "  - Opnames van desktop-sessies die de checkout bereikten maar afbraken\n"
        "  - De klikkaart van het koopblok"
    )
    return 1 if mislukt else 0


if __name__ == "__main__":
    sys.exit(main())
