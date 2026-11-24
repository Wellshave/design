#!/usr/bin/env python3
"""Zet een Bloggle-artikelbody om naar schone HTML in de Wellshave-blogstijl (#wsb).

  python3 migreer_bloggle.py articles.json uitmap/ [--products products.json]

articles.json: Admin-API-uitvoer met data.articles.nodes[] {handle, body}. Alleen artikelen met
Bloggle-opmaak worden omgezet. Per artikel komt er <uitmap>/<handle>.html, de volledige nieuwe body.

Wat er gebeurt:
- scripts, stylesheets en Bloggle-stijlen eruit (die laden van Bloggle's eigen CDN en vallen weg
  zodra de app weg is);
- tekstblokken worden gewone p, h2, h3, ul; de losse <span style> en <br> tussen blokken verdwijnen;
- beelden: data-src (alleen via Bloggle's lazyload-script zichtbaar) wordt een gewone src;
- productblokken (door Bloggle met JavaScript gevuld) worden een vaste .wsb-product-kaart met
  naam, beeld en eerste zin uit de productfeed;
- links naar dode adressen worden vervangen door de eindbestemming (zie VERVANG).
"""
import json, re, sys, html, pathlib
from bs4 import BeautifulSoup, NavigableString, Tag

SKILL = pathlib.Path(__file__).resolve().parent.parent
CONFIG = json.loads((SKILL / "data" / "config.json").read_text(encoding="utf-8"))
W = "https://wellshave.com"
VERVANG = {
    "/nl-de/blogs/huidverzorging/bodygroomer-mannen-trimmen": "/blogs/nieuws/bodygroomer-gebruiken-handleiding",
    "/blogs/huidverzorging/bodygroomer-mannen-trimmen": "/blogs/nieuws/bodygroomer-gebruiken-handleiding",
    "/blogs/5-tips-voor-het-gebruik-van-een-scheerapparaat-voor-een-perfecte-scheerbeurt": "/blogs/nieuws/de-beste-bodygroomer-voor-mannen",
    "/nl-de/blogs/5-tips-voor-het-gebruik-van-een-scheerapparaat-voor-een-perfecte-scheerbeurt": "/blogs/nieuws/bodygroomer-gebruiken-handleiding",
    "/blogs/hoe-gebruik-je-een-neustrimmer-correct-hier-een-stapsgewijze-handleiding-voor-jou": "/blogs/nieuws/bodygroomer-gebruiken-handleiding",
    "/nl-de/blogs/huidverzorging/beste-scheerapparaat-mannen": "/blogs/nieuws/beste-scheerapparaat-2026-keuzegids",
    "/nl-de/products/wellshave-baardtrimmer-perfection": "/products/groom-guard-pro",
    "/products/detailtrimmer-sharpline": "/products/detailtrimmer-sharpline%E2%84%A2",
    "/blogs/huidverzorging/hoe-onderhoud-je-je-baard": "/blogs/nieuws/hoe-trim-je-baard-halslijn",
    "/products/wellshave-6-in-1-baardtrimmer-supreme": "/products/6-in-1-baardtrimmer-supreme",
    "/blogs/huidverzorging/het-beste-scheerapparaat-voor-de-gevoelige-huid": "/blogs/nieuws/het-beste-scheerapparaat-voor-de-gevoelige-huid",
    "/blogs/huidverzorging/wat-is-een-safety-razor": "/collections/safetyrazors-scheren-scheermes",
}
TOEGESTAAN = {"p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "b", "em", "i", "a", "br", "table", "thead",
              "tbody", "tr", "th", "td"}

def schone_href(h):
    h = h.strip()
    pad = re.sub(r"^https?://(www\.)?wellshave\.(com|nl)", "", h)
    pad = pad.split("?")[0].rstrip("/") if pad.startswith("/") else pad
    if pad in VERVANG:
        return W + VERVANG[pad]
    if pad.startswith("/nl-de/"):
        pad = pad[6:]
    return W + pad if pad.startswith("/") else h

def inline(el):
    """Platte inline-HTML van een element: alleen strong/em/a, geen spans."""
    uit = []
    for c in el.children:
        if isinstance(c, NavigableString):
            uit.append(html.escape(str(c), quote=False))
        elif isinstance(c, Tag):
            if c.name in ("strong", "b"):
                t = inline(c).strip()
                if t: uit.append(f"<strong>{t}</strong>")
            elif c.name in ("em", "i"):
                t = inline(c).strip()
                if t: uit.append(f"<em>{t}</em>")
            elif c.name == "a" and c.get("href"):
                t = inline(c)
                lead = " " if t[:1].isspace() else ""
                uit.append(f'{lead}<a href="{html.escape(schone_href(c["href"]))}">{t.strip()}</a>')
            elif c.name == "br":
                uit.append(" ")
            else:
                uit.append(inline(c))
    return re.sub(r"\s+", " ", "".join(uit))

def blok(el, uit):
    for c in el.children:
        if not isinstance(c, Tag):
            continue
        n = c.name
        if n in ("p", "h3", "h4"):
            t = inline(c).strip()
            if t:
                tag = "h3" if n == "h4" else n
                uit.append(f"<{tag}>{t}</{tag}>")
        elif n == "h2":
            t = inline(c).strip()
            if t: uit.append(f"<h2>{t}</h2>")
        elif n in ("ul", "ol"):
            items = [inline(li).strip() for li in c.find_all("li", recursive=False)]
            items = [i for i in items if i]
            if items:
                uit.append(f"<{n}>" + "".join(f"<li>{i}</li>" for i in items) + f"</{n}>")
        elif n == "table":
            uit.append(str(c))
        elif n == "div":
            blok(c, uit)

def productkaart(handle, prods):
    p = prods.get(handle)
    if not p:
        return ""
    tekst = re.sub(r"<[^>]+>", " ", p.get("body_html") or "")
    tekst = re.sub(r"\s+", " ", html.unescape(tekst)).strip()
    zin = re.split(r"(?<=[.!?])\s", tekst)[0][:220] if tekst else ""
    img = p["images"][0]["src"].split("?")[0] + "?width=600" if p.get("images") else ""
    naam = html.escape(p["title"])
    return (f'<div class="wsb-product"><img src="{img}" alt="{naam}" loading="lazy" width="600" height="600">'
            f'<div><span class="wsb-eyebrow">Uit dit artikel</span><p class="naam">{naam}</p>'
            + (f"<p>{html.escape(zin)}</p>" if zin else "")
            + f'<a class="wsb-knop goud" href="{W}/products/{handle}">Bekijk de {naam}</a>'
            f'<p class="gerust">100 dagen proberen &middot; 2 jaar garantie</p></div></div>')

def migreer(body, prods):
    soup = BeautifulSoup(body, "html.parser")
    for t in soup(["script", "style", "link", "button"]):
        t.decompose()
    uit, gezien = [], set()

    def verwerk(el):
        if not isinstance(el, Tag):
            return
        cls = " ".join(el.get("class", []))
        if "bggle_spacer" in cls or "bggle_line" in cls:
            return
        if el.name == "h2" or "bggle_title" in cls:
            t = inline(el).strip()
            if t: uit.append(f"<h2>{t}</h2>")
        elif el.name == "img" or "bggle_image" in cls:
            img = el if el.name == "img" else el.find("img")
            if img and "bloggle_product--img" not in " ".join(img.get("class", [])):
                src = (img.get("data-src") or img.get("src") or "").split("?")[0]
                if src:
                    if src.startswith("//"): src = "https:" + src
                    alt = html.escape(img.get("alt", "").strip())
                    uit.append(f'<figure><img src="{src}?width=1200" alt="{alt}" loading="lazy" width="1200" height="900"></figure>')
        elif "bggle_product" in cls or el.get("bggle-product-handle") or \
                (el.name == "a" and "bggle_button-link" in cls):
            hs = [el.get("bggle-product-handle")] + [x.get("bggle-product-handle") for x in el.find_all(attrs={"bggle-product-handle": True})]
            links = ([el] if el.name == "a" else []) + el.find_all("a", class_="bggle_button-link")
            hs += [a["href"].split("?")[0].rstrip("/").rsplit("/", 1)[-1] for a in links if "/products/" in a.get("href", "")]
            for h in hs:
                if h and h not in gezien:
                    gezien.add(h)
                    k = productkaart(h, prods)
                    if k: uit.append(k)
        elif el.name in ("p", "h3", "h4", "ul", "ol", "table"):
            tmp = BeautifulSoup("<div></div>", "html.parser").div
            blok_el = el
            if el.name in ("ul", "ol") and el.find(["div", "img"]):
                for c in el.children: verwerk(c)
                return
            blok(BeautifulSoup(f"<div>{el}</div>", "html.parser").div, uit)
        elif el.name in ("div", "section", "span", "li", "a") or el.get("id") == "bloggy--article":
            if el.name == "a" or el.name == "span":
                t = inline(el).strip()
                if t: uit.append(f"<p>{t}</p>")
                return
            for c in el.children:
                verwerk(c)

    for el in soup.find_all(recursive=False):
        verwerk(el)
    inhoud = "".join(uit)
    inhoud = re.sub(r"<h3>\s*</h3>|<p>\s*</p>", "", inhoud)
    return (f'<link rel="stylesheet" href="{CONFIG["css_url"]}">'
            f'<div id="wsb" class="ws-blog">{inhoud}</div>')

def main():
    bron, doel = sys.argv[1], pathlib.Path(sys.argv[2])
    prods = {}
    if "--products" in sys.argv:
        prods = {p["handle"]: p for p in json.load(open(sys.argv[sys.argv.index("--products") + 1]))["products"]}
    doel.mkdir(parents=True, exist_ok=True)
    data = json.load(open(bron, encoding="utf-8"))
    nodes = data["data"]["articles"]["nodes"] if "data" in data else data
    for a in nodes:
        b = a.get("body") or ""
        if "bggle" not in b and "bloggy" not in b:
            continue
        nieuw = migreer(b, prods)
        (doel / f'{a["handle"]}.html').write_text(nieuw, encoding="utf-8")
        oud_tekst = re.sub(r"\s+", " ", BeautifulSoup(b, "html.parser").get_text(" ")).strip()
        nieuw_tekst = re.sub(r"\s+", " ", BeautifulSoup(nieuw, "html.parser").get_text(" ")).strip()
        print(f'{a["handle"]}: {len(b)} -> {len(nieuw)} tekens, tekst {len(oud_tekst.split())} -> {len(nieuw_tekst.split())} woorden')

if __name__ == "__main__":
    main()
