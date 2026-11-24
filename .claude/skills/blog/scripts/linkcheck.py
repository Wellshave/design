#!/usr/bin/env python3
"""404-controle op alle gepubliceerde artikelen van de Wellshave-blog.

  python3 linkcheck.py                 # blog nieuws, alle gepubliceerde artikelen
  python3 linkcheck.py --json uit.json # ook als JSON wegschrijven

Leest de artikellijst uit de openbare Atom-feed, haalt elk artikel op en controleert elke link en
elk beeld in de artikeltekst. Rapporteert:

  KAPOT     4xx/5xx of niet bereikbaar
  HOMEPAGE  een omleiding die op de homepage eindigt. Dat is een verwijderde pagina die een app
            naar / stuurt; Google ziet dat als soft 404 en de lezer komt nergens.
  OMWEG     een interne link die via een omleiding op een andere pagina uitkomt. Werkt, maar zet de
            eindbestemming in de link.

Geen Admin-toegang nodig. Exitcode 1 als er iets KAPOT of HOMEPAGE is.
"""
import concurrent.futures as cf, html, json, re, sys, urllib.parse, urllib.request

BLOG = "https://wellshave.com/blogs/nieuws"
UA = {"User-Agent": "Mozilla/5.0 (linkcheck wellshave-blog)"}

def get(url, method="GET"):
    req = urllib.request.Request(url, method=method, headers=UA)
    return urllib.request.urlopen(req, timeout=25)

def artikelen():
    urls, pagina = [], 1
    while True:
        xml = get(f"{BLOG}.atom?page={pagina}").read().decode("utf-8", "replace")
        nieuw = re.findall(r'<link rel="alternate" type="text/html" href="([^"]+/blogs/nieuws/[^"]+)"', xml)
        nieuw = [u for u in nieuw if u not in urls]
        if not nieuw:
            return urls
        urls += nieuw
        pagina += 1

def links_in(url):
    pagina = get(url).read().decode("utf-8", "replace")
    # alleen de artikeltekst, niet de themaheader en -footer
    m = re.search(r'id="bloggle_rte"(.*?)(?:id="bloggle--blog-item-goback"[^>]*class="bloggle--goback-bottom"|<footer)', pagina, re.S)
    stuk = m.group(1) if m else pagina
    uit = set()
    for u in re.findall(r'(?:href|src|data-src)="([^"#][^"]*)"', stuk):
        u = html.unescape(u).strip()
        if u.startswith("//"): u = "https:" + u
        elif u.startswith("/"): u = "https://wellshave.com" + u
        host = urllib.parse.urlparse(u).netloc
        # alleen eigen pagina's en eigen beeld; deelknoppen, tracking en login tellen niet mee
        if host in ("wellshave.com", "www.wellshave.com", "cdn.shopify.com") and \
                not urllib.parse.urlparse(u).path.startswith(("/account", "/cart")):
            uit.add(u)
    return uit

def status(u):
    for m in ("HEAD", "GET"):
        try:
            r = get(u, m)
            return r.status, r.geturl()
        except urllib.error.HTTPError as e:
            if m == "HEAD" and e.code in (403, 405):
                continue
            return e.code, u
        except Exception as e:
            if m == "GET":
                return 0, str(e)[:80]
    return 0, u

def main():
    uitvoer = "--json" in sys.argv and sys.argv[sys.argv.index("--json") + 1]
    arts = artikelen()
    per_link = {}
    for a in arts:
        for u in links_in(a):
            per_link.setdefault(u, set()).add(a.rsplit("/", 1)[-1])
    with cf.ThreadPoolExecutor(12) as ex:
        res = dict(zip(per_link, ex.map(status, per_link)))
    rapport = []
    for u, (code, eind) in sorted(res.items()):
        pad = urllib.parse.urlparse(eind).path if eind.startswith("http") else ""
        if code != 200:
            soort = "KAPOT"
        elif "wellshave" in u and pad in ("", "/") and urllib.parse.urlparse(u).path not in ("", "/"):
            soort = "HOMEPAGE"
        elif "wellshave.com" in u and "cdn.shopify" not in u and \
                urllib.parse.unquote(eind.split("?")[0].split("#")[0]).rstrip("/") != \
                urllib.parse.unquote(u.split("?")[0].split("#")[0]).rstrip("/"):
            soort = "OMWEG"
        else:
            continue
        rapport.append({"soort": soort, "code": code, "url": u, "eind": eind, "artikelen": sorted(per_link[u])})
    print(f"{len(arts)} artikelen, {len(per_link)} links gecontroleerd")
    for r in rapport:
        print(f"{r['soort']:9} {r['code']} {r['url']}\n          -> {r['eind']}\n          in: {', '.join(r['artikelen'])}")
    if not rapport:
        print("Geen kapotte links.")
    if uitvoer:
        json.dump(rapport, open(uitvoer, "w"), ensure_ascii=False, indent=1)
    sys.exit(1 if any(r["soort"] in ("KAPOT", "HOMEPAGE") for r in rapport) else 0)

if __name__ == "__main__":
    main()
