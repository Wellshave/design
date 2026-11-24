#!/usr/bin/env python3
"""Bouwt een Wellshave-blogartikel uit een bronbestand en controleert het.

  python3 bouw.py blogs/2026-w48/scheerbultjes.html [--links]

Bron: HTML met bovenaan een <!--meta {json} --> blok (voorbeelden in blogs/2026-w48/).
Uitvoer, naast de bron in een map dist/:
  <handle>.body.html     de body zoals hij in Shopify gaat (entiteiten, CSS-link, FAQ-schema)
  <handle>.preview.html  lokaal te openen, met de bloggle-kop en de themaregel nagebootst
  <handle>.payload.json  input voor articleCreate / articleUpdate

--links  controleert elke link en elk beeld met een statuscode (traag, wel doen voor publiceren).
Stopt met exitcode 1 als een harde regel faalt.
"""
import json, re, sys, html, pathlib, urllib.request, unicodedata

SKILL = pathlib.Path(__file__).resolve().parent.parent
CONFIG = json.loads((SKILL / "data" / "config.json").read_text(encoding="utf-8"))
BLOG_URL = "https://wellshave.com/blogs/nieuws/"

def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]

def tekst(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()

def entiteiten(s):
    return "".join(c if ord(c) < 128 else f"&#{ord(c)};" for c in s)

def status(url):
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status, r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, url
    except Exception as e:
        return 0, str(e)

def main():
    bron = pathlib.Path(sys.argv[1]).resolve()
    links = "--links" in sys.argv
    raw = bron.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--meta\s*(\{.*?\})\s*-->\s*", raw, re.S)
    if not m:
        sys.exit("Geen <!--meta {...} --> blok bovenaan.")
    meta = json.loads(m.group(1))
    inhoud = raw[m.end():]

    fouten, waarsch = [], []

    # koppen: id's en inhoudsopgave
    toc = []
    def kop(mm):
        attrs, binnen = mm.group(1), mm.group(2)
        eerste = re.split(r"<span", binnen)[0]
        i = slug(tekst(eerste))
        toc.append((i, tekst(eerste).rstrip(',:')))
        if "id=" in attrs:
            return mm.group(0)
        return f'<h2 id="{i}"{attrs}>{binnen}</h2>'
    inhoud = re.sub(r"<h2([^>]*)>(.*?)</h2>", kop, inhoud, flags=re.S)
    # afsluiter-h2 hoort niet in de inhoudsopgave
    toc = [t for t in toc if t[0] in re.findall(r'<h2 id="([^"]+)"(?![^>]*wsb-skip)', inhoud)]
    toc = [t for t in toc if not re.search(rf'<div class="wsb-end">\s*<h2 id="{t[0]}"', inhoud)]
    tochtml = ('<nav class="wsb-toc" aria-label="Inhoud"><span class="wsb-eyebrow">In dit artikel</span><ol>'
               + "".join(f'<li><a href="#{i}">{html.escape(t)}</a></li>' for i, t in toc)
               + "</ol></nav>")
    inhoud = inhoud.replace("<!--toc-->", tochtml)

    # FAQ-schema uit de details-blokken
    faq = []
    for q, a in re.findall(r"<details>\s*<summary>(.*?)</summary>\s*<div>(.*?)</div>\s*</details>", inhoud, re.S):
        faq.append({"@type": "Question", "name": tekst(q),
                    "acceptedAnswer": {"@type": "Answer", "text": tekst(a)}})
    schema = ""
    if faq:
        schema = ('<script type="application/ld+json">'
                  + json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faq},
                               ensure_ascii=False) + "</script>")

    body = (f'<link rel="stylesheet" href="{CONFIG["css_url"]}">\n'
            f'<div id="wsb" class="ws-blog">\n{inhoud.strip()}\n</div>\n{schema}\n')

    # ---------------- controles
    platte = tekst(inhoud)
    woorden = len(platte.split())
    pk = meta["primary_keyword"].lower()
    st, sd = meta["seo_title"], meta["seo_description"]
    if len(st) > 60: fouten.append(f"seo_title is {len(st)} tekens, max 60")
    if not (110 <= len(sd) <= 158): fouten.append(f"seo_description is {len(sd)} tekens, 110-158")
    if pk not in meta["title"].lower() and pk not in st.lower():
        fouten.append("primair keyword staat niet in titel of seo_title")
    norm = lambda x: re.sub(r"[^\w\s]", " ", x.lower()).split()
    def dekt(kw, woorden, venster=7):
        # alle woorden van het keyword binnen een venster: "ingegroeide haren in je baard" telt
        k = norm(kw)
        for i in range(len(woorden)):
            stuk = woorden[i:i + len(k) + venster - 1]
            if stuk[:1] == k[:1] and all(t in stuk for t in k):
                return True
        return False
    alle_woorden = norm(platte)
    if not dekt(pk, alle_woorden[:120]):
        fouten.append("primair keyword niet in de eerste 120 woorden")
    if not dekt(pk, norm(sd)): waarsch.append("primair keyword niet in de meta-omschrijving")
    if woorden < 1100: fouten.append(f"te kort: {woorden} woorden (min 1100)")
    if len(toc) < 4: fouten.append(f"maar {len(toc)} H2's (min 4)")
    if "wsb-product" not in inhoud: fouten.append("geen productaanbeveling (.wsb-product)")
    if "wsb-answer" not in inhoud: fouten.append("geen kort-antwoordblok (.wsb-answer)")
    if len(faq) < 4: fouten.append(f"maar {len(faq)} FAQ-vragen (min 4)")
    intern = set(re.findall(r'href="(https://wellshave\.com/blogs/nieuws/[^"#]+)"', inhoud))
    if len(intern) < 2: fouten.append(f"maar {len(intern)} interne bloglinks (min 2)")
    prod = set(re.findall(r'href="(https://wellshave\.com/(?:products|collections)/[^"#]+)"', inhoud))
    if not prod: fouten.append("geen link naar een product of collectie")
    for verboden, waarom in [("—", "em-dash (huisregel: komma gebruiken)"),
                             ("levenslang", "levenslange garantie bestaat niet, het is 2 jaar"),
                             ("<h1", "h1 in de body; het sjabloon zet de titel al als h1")]:
        if verboden in raw[m.end():]: fouten.append(f"bevat {waarom}")
    for k in meta.get("keywords", []):
        if not dekt(k, alle_woorden): waarsch.append(f"secundair keyword ontbreekt letterlijk: {k}")
    imgs = re.findall(r'<img[^>]+>', inhoud)
    for im in imgs:
        if 'alt="' not in im or 'alt=""' in im: fouten.append("beeld zonder alt-tekst")
        if 'loading="lazy"' not in im: waarsch.append("beeld zonder loading=lazy")
    if links:
        alle = sorted(set(re.findall(r'(?:href|src)="(https?://[^"]+)"', inhoud)) | {meta["image"]["url"]})
        # artikelen uit dezelfde batch bestaan pas na publicatie
        batch = set()
        for f in bron.parent.glob("*.html"):
            mm = re.match(r"\s*<!--meta\s*(\{.*?\})\s*-->", f.read_text(encoding="utf-8"), re.S)
            if mm: batch.add(BLOG_URL + json.loads(mm.group(1))["handle"])
        for u in alle:
            if u in batch:
                continue
            code, eind = status(u)
            if code != 200: fouten.append(f"link {code}: {u}")
            elif eind.split("?")[0].rstrip("/") != u.split("?")[0].rstrip("/") and "cdn.shopify" not in u:
                waarsch.append(f"omleiding: {u} -> {eind}")

    # ---------------- uitvoer
    dist = bron.parent / "dist"; dist.mkdir(exist_ok=True)
    h = meta["handle"]
    (dist / f"{h}.body.html").write_text(entiteiten(body), encoding="utf-8")
    payload = {
        "blogId": CONFIG["blog_id"], "title": meta["title"], "handle": h,
        "author": {"name": CONFIG["author"]}, "body": entiteiten(body),
        "summary": meta["summary"], "tags": meta["tags"], "templateSuffix": CONFIG["template_suffix"],
        "image": {"url": meta["image"]["url"], "altText": meta["image"]["alt"]},
        "isPublished": False,
        "metafields": [
            {"namespace": "global", "key": "title_tag", "type": "single_line_text_field", "value": st},
            {"namespace": "global", "key": "description_tag", "type": "single_line_text_field", "value": sd},
        ],
    }
    (dist / f"{h}.payload.json").write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    css = (SKILL / "assets" / "wellshave-blog.css").read_text(encoding="utf-8")
    preview = f"""<!doctype html><html lang="nl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(meta['title'])}</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>body{{margin:0;font-family:Montserrat,sans-serif;background:#fff}}
.kop{{text-align:center;padding:28px 16px 8px;max-width:820px;margin:0 auto}}
.kop h1{{font-size:clamp(26px,4vw,38px);line-height:1.15;font-weight:800;color:#111;margin:10px 0}}
.kop small{{color:#777;font-size:13px}} .kop img{{width:100%;border-radius:0;margin-top:18px}}
.bloggle_rte{{padding:0 16px 60px}}
/* nagebootste themaregels, om te zien dat #wsb ze wint */
.bloggle_rte p:not(.bggle-font){{font-size:14px;line-height:1.6em}}
.rte img{{border-radius:12px}} .rte ul{{list-style:disc}}
{css}</style>
<meta name="description" content="{html.escape(sd)}"></head><body>
<div class="kop"><small>&larr; Ga terug</small><h1>{html.escape(meta['title'])}</h1>
<small>Wellshave Grooming Blog &middot; {woorden // 220 + 1} min lezen</small>
<img src="{meta['image']['url']}" alt="{html.escape(meta['image']['alt'])}"></div>
<div class="bloggle_rte rte">{body.replace(f'<link rel="stylesheet" href="{CONFIG["css_url"]}">', '')}</div></body></html>"""
    (dist / f"{h}.preview.html").write_text(preview, encoding="utf-8")

    print(f"{h}: {woorden} woorden, {len(toc)} H2, {len(faq)} FAQ, {len(intern)} bloglinks, "
          f"{len(prod)} productlinks, {len(imgs)} beelden")
    for w in waarsch: print("  let op:", w)
    for f in fouten: print("  FOUT:", f)
    sys.exit(1 if fouten else 0)

if __name__ == "__main__":
    main()
