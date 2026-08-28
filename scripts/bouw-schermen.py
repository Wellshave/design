# -*- coding: utf-8 -*-
"""Bouwt rapporten/schermen.html: elk getekend blok twee keer, op 1440 en op 390.

De mockups komen uit de blokdocumenten zelf, dus er is maar een bron. Twee
dingen moeten daarvoor gebeuren:

  1. De mockups van blok 02 gebruiken @media-regels, en die kijken naar het
     venster. In een kadertje van 390 px op een breed scherm vuren ze dus niet.
     Daarom worden de breedte-media-queries omgezet naar @container-queries en
     krijgt elk kadertje container-type:inline-size.
  2. Beide blokdocumenten hebben klassenamen die botsen (.kop, .lead, .kaart).
     Daarom krijgt elk document zijn eigen scope, .br1 en .br2.
"""
import io, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cssscope import scope_css

BRON1 = 'rapporten/blokken/01-above-the-fold-v2-donker.html'
BRON2 = 'rapporten/blokken/02-omschrijving-specs-upsell-betaling.html'

# blok, naam, bron, wortelklasse desktop, wortelklasse mobiel, bijschrift
BLOKKEN = [
 ('01', u'Koopblok',            1, 'screen v6', 'p6',    u'zand · kern',        False),
 ('03', u'UGC-band',            2, 'ugc',       'ugc',   u'donker · uitbreiding', True),
 ('05', u'Het aanbodblok',      2, 'lad',       'lad',   u'donker · kern',      True),
 ('07', u'Maak het compleet',   2, 'erbij',     'erbij', u'wit · uitbreiding', True),
 ('08', u'De reviewmuur',       2, 'tpm',       'tpm',   u'zand · kern',         True),
 ('07b', u'Vergelijkingspop-up', 2, 'vglpop', 'vglpop', u'hoort bij het koopvak', False),
 (u'—', u'De film — buiten de negen', 2, 'film', 'film', u'af, maar niet ingedeeld', True),
 (u'—', u'Accordeon: omschrijving en specificaties', 2, 'blad', 'blad', u'zit in blok 01',   True),
 (u'—', u'Betaalmethoden', 2, 'betaal',    'betaal', u'onderdeel van blok 01 en 18', True),
]

def haal_style(s):
    return s[s.index('<style>')+7 : s.index('</style>')]

def pak_element(s, klasse):
    """Geeft het element met class="<klasse>" terug, met een div-teller."""
    m = re.search(r'<div class="%s"' % re.escape(klasse), s)
    assert m, 'niet gevonden: ' + klasse
    start = m.start(); i = start; diepte = 0
    while True:
        o = s.find('<div', i); c = s.find('</div>', i)
        assert c != -1, 'geen einde voor ' + klasse
        if o != -1 and o < c:
            diepte += 1; i = o + 4
        else:
            diepte -= 1; i = c + 6
            if diepte == 0:
                return s[start:i]

def naar_container(css):
    """@media met een breedte -> @container. Voorkeuren blijven @media."""
    def vervang(m):
        cond = m.group(1)
        if 'width' in cond and 'prefers' not in cond and 'hover' not in cond:
            return '@container ' + cond.strip() + '{'
        return '@media ' + cond + '{'
    return re.sub(r'@media([^{]*)\{', vervang, css)

SCHIL = u"""
:root{--bg:#FBFAF9;--surface:#fff;--fg:#1A1A1A;--fg-soft:#6B6560;--rule:#E6E1DC;--gold:#BC813E}
body{background:var(--bg);color:var(--fg)}
.shell{max-width:1280px;margin:0 auto;padding:38px 22px 70px}
.lede{border-bottom:1px solid var(--rule);padding-bottom:22px;margin-bottom:30px}
.lede p.kicker{font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;
  color:var(--gold);margin:0 0 9px}
.lede h1,.lede h2{font-size:clamp(25px,4vw,36px);line-height:118%;letter-spacing:-.022em;font-weight:700;margin:0}
.lede p.sub{font-size:15.5px;line-height:160%;color:var(--fg-soft);margin:12px 0 0;max-width:64ch}
.lede code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;
  background:var(--surface);border:1px solid var(--rule);border-radius:4px;padding:1px 6px}
.blok{margin:0 0 44px}
.blok-h{display:flex;align-items:baseline;justify-content:space-between;gap:16px;
  flex-wrap:wrap;margin:0 0 12px}
.blok-h h2{font-size:17px;font-weight:700;letter-spacing:-.01em;margin:0}
.blok-h span{font-size:10.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--fg-soft)}
.views{display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:26px;align-items:start}
.devicecap{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:var(--fg-soft);margin:0 0 7px}
.scaler{width:100%;overflow:hidden;border:1px solid var(--rule);border-radius:5px;background:#F5F1EA}
.scaler > .inner{transform-origin:top left;container-type:inline-size}
.desk-scaler > .inner{width:1440px}
.phone-scaler{border-radius:15px}
.phone-scaler > .inner{width:390px}
.rail{max-width:1140px;margin:0 auto;padding:34px 24px}
.phone-scaler .rail{padding:18px 16px}
.br1,.br2{background:#F5F1EA}
footer.sch{border-top:1px solid var(--rule);padding-top:20px;color:var(--fg-soft);font-size:13px;
  line-height:165%}
footer.sch b{color:var(--fg);font-weight:700}
footer.sch p{margin:0 0 10px;max-width:72ch}
.wijz{display:grid;grid-template-columns:repeat(auto-fill,minmax(268px,1fr));gap:14px;margin:0 0 26px}
.wijz-kaart{background:var(--surface);border:1px solid var(--rule);border-radius:10px;padding:18px 20px}
.wijz-kaart h3{font-size:14px;font-weight:700;letter-spacing:-.005em;margin:0 0 7px;color:var(--gold)}
.wijz-kaart p{font-size:13.5px;line-height:160%;color:var(--fg-soft);margin:0}
.wijz-kaart b{color:var(--fg);font-weight:700}
@media (max-width:940px){.views{grid-template-columns:minmax(0,1fr)}.views .mobcol{max-width:390px}}
"""

SCRIPT = u"""
(function(){
  function fit(){
    document.querySelectorAll('#deel-schermen .scaler').forEach(function(s){
      var inner = s.firstElementChild;
      if (!inner) return;
      var w = parseFloat(getComputedStyle(inner).width);
      if (!w) return;
      var scale = s.clientWidth / w;
      inner.style.transform = 'scale(' + scale + ')';
      s.style.height = Math.ceil(inner.offsetHeight * scale) + 'px';
    });
  }
  window.wsFit = fit;
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  try { new ResizeObserver(fit).observe(document.body); } catch(e){}
  setTimeout(fit, 60); setTimeout(fit, 400); fit();
})();
"""

def main():
    b1 = io.open(BRON1, encoding='utf-8').read()
    b2 = io.open(BRON2, encoding='utf-8').read()
    css1 = scope_css(naar_container(haal_style(b1)), '.br1')
    css2 = scope_css(naar_container(haal_style(b2)), '.br2')

    secties = []
    for nr, naam, bron, kd, km, bij, rail in BLOKKEN:
        s = b1 if bron == 1 else b2
        br = 'br1' if bron == 1 else 'br2'
        d = pak_element(s, kd)
        m = d if km == kd else pak_element(s, km)
        def wikkel(inhoud, met_rail):
            return (u'<div class="rail">%s</div>' % inhoud) if met_rail else inhoud
        titel = (u'Blok %s — %s' % (nr, naam)) if nr != u'—' else naam
        secties.append(
          u'  <section class="blok">\n'
          u'    <div class="blok-h"><h2>%s</h2><span>%s</span></div>\n'
          u'    <div class="views">\n'
          u'      <div>\n        <p class="devicecap">Desktop — 1440 px</p>\n'
          u'        <div class="scaler desk-scaler"><div class="inner %s">%s</div></div>\n      </div>\n'
          u'      <div class="mobcol">\n        <p class="devicecap">Mobiel — 390 px</p>\n'
          u'        <div class="scaler phone-scaler"><div class="inner %s">%s</div></div>\n      </div>\n'
          u'    </div>\n  </section>\n'
          % (titel, bij, br, wikkel(d, rail), br, wikkel(m, rail)))

    doc = (u'<title>Beide schermen</title>\n'
      u'<link rel="preconnect" href="https://fonts.googleapis.com">\n'
      u'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
      u'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap">\n'
      u'<style>' + SCHIL + u'\n' + css1 + u'\n' + css2 + u'</style>\n'
      u'<div class="shell">\n'
      u'  <div class="lede">\n'
      u'    <p class="kicker">Productpagina · ontwerpbeeld · 24 augustus 2026</p>\n'
      u'    <h1>De getekende blokken, op allebei de schermen</h1>\n'
      u'    <p class="sub">Links de desktopweergave op 1440&nbsp;px, rechts de mobiele op 390&nbsp;px. '
      u'Het zijn geen schermafbeeldingen: beide kolommen tonen dezelfde opmaak, live opgebouwd, '
      u'ingekrompen om op de pagina te passen. Zeventig procent van je verkeer ziet de rechterkolom.</p>\n'
      u'    <p class="sub"><b>Nog niets hiervan staat live.</b> De bron zijn de blokdocumenten in dit '
      u'dossier; de andere delen — <code>De meting</code>, <code>De volgorde</code>, '
      u'<code>Het plan</code> — leggen uit waarom elk blok eruitziet zoals het eruitziet.</p>\n'
      u'  </div>\n'
      + u''.join(secties) +
      u'  <footer class="sch">\n'
      u'    <div class="wijz">\n'
      u'      <div class="wijz-kaart"><h3>Waarom twee kolommen</h3><p>De vouw ligt op de telefoon op '
      u'<b>769&nbsp;px</b> en op desktop veel lager. Een blok dat op een breed scherm rustig oogt kan '
      u'op 390&nbsp;px drie schermen lang zijn. Naast elkaar zie je dat meteen.</p></div>\n'
      u'      <div class="wijz-kaart"><h3>Waarom het echt meeschaalt</h3><p>De mobiele kolom is geen '
      u'verkleinde desktop. De breedte-regels van elk blok zijn omgezet naar <b>container-queries</b>, '
      u'zodat het kadertje van 390&nbsp;px dezelfde opmaak krijgt als een echte telefoon.</p></div>\n'
      u'      <div class="wijz-kaart"><h3>Wat er nog niet in staat</h3><p>Tien van de achttien blokken '
      u'zijn nog niet getekend. Ze staan wel in <b>De volgorde</b> met hun plek, hun grond en het veld '
      u'waar ze uit komen.</p></div>\n'
      u'    </div>\n'
      u'    <p>Prijzen, voorraad en beoordelingen komen uit Shopify en Trustpilot, opgehaald op '
      u'24 augustus 2026. De macro-render in blok 04 is gegenereerd; de UGC-stills komen uit je eigen '
      u'Files-bibliotheek.</p>\n'
      u'  </footer>\n'
      u'</div>\n'
      u'<script>' + SCRIPT + u'</script>\n')
    # alles buiten ASCII als entiteit, net als de andere blokdocumenten
    doc = doc.encode('ascii', 'xmlcharrefreplace').decode('ascii')
    io.open('rapporten/schermen.html', 'w', encoding='utf-8').write(doc)
    print('schermen.html geschreven:', len(doc), 'bytes,', len(secties), 'blokken')

main()
