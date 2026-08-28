# -*- coding: utf-8 -*-
"""Bouwt rapporten/productpagina.html uit de drie brondocumenten.

Draai vanuit de wortel van de repo:  python3 scripts/bouw-productpagina.py

De drie delen hebben elk hun eigen stylesheet met overlappende klassenamen
(.note, .shead, .duo, :root). Daarom krijgt elk deel zijn eigen scope
(#deel-plan, #deel-boven, #deel-onder) en wordt elke selector geprefixt.
Zonder dat wint de laatste stylesheet en breken de eerste twee delen.

"""
import re
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cssscope import split_rules, prefix_sel, scope_css

# -*- coding: utf-8 -*-
import sys, io, re, html



DELEN=[('schermen','rapporten/schermen.html',                                  u'Beide schermen', u'Elk getekend blok twee keer: desktop op 1440 px en mobiel op 390 px.'),
       ('meting','rapporten/meting.html',                                    u'De meting',     u'Wat Clarity en Shopify zeggen over waar het verkeer blijft steken.'),
       ('volgorde','rapporten/volgorde.html',                                u'De volgorde',   u'Alle zeventien blokken op een rij, met grond, klasse en wat er al getekend is.'),
       ('plan',  'rapporten/pdp-plan.html',                                  u'Het plan',      u'De kaart: vier regels, drie producttypes, zeventien blokken.'),
       ('boven', 'rapporten/blokken/01-above-the-fold-v2-donker.html',       u'Boven de vouw', u'Het koopvak, de seizoensdeal, het sociale bewijs, de beweging.'),
       ('onder', 'rapporten/blokken/02-omschrijving-specs-upsell-betaling.html', u'Onder de vouw', u'Het productblad, de aanvulling, de betaalrij.')]

def tekst(h):
    h=re.sub(r'<span class="b">', u' ', h)
    h=re.sub(r'<[^>]+>', '', h)
    return html.unescape(re.sub(r'\s+',' ',h)).strip()

css_uit=[]; body_uit=[]; toc=[]; scripts=[]
for sleutel,pad,naam,onder in DELEN:
    s=io.open(pad,encoding='utf-8').read()
    css=s[s.index('<style>')+7:s.index('</style>')]
    rest=s[s.index('</style>')+8:]
    for m in re.finditer(r'<script>(.*?)</script>', rest, re.S):
        scripts.append(m.group(1))
    rest=re.sub(r'<script>.*?</script>', '', rest, flags=re.S)
    # de eigen h1 wordt een deelkop
    css=css.replace('.mast h1{', '.mast h2{')
    rest=rest.replace('<h1>','<h2>',1)
    i=rest.find('</h1>')
    if i>=0: rest=rest[:i]+'</h2>'+rest[i+5:]
    scope='#deel-'+sleutel
    css_uit.append(u'/* ===== '+naam+u' ===== */\n'+scope_css(css,scope))

    # secties nummeren en de inhoudsopgave opbouwen
    kinderen=[]
    teller=[0]
    def merk(m):
        teller[0]+=1
        return '<section id="%s-%d">'%(sleutel,teller[0])
    rest=re.sub(r'<section>', merk, rest)
    for m in re.finditer(r'<section id="('+sleutel+r'-\d+)">(.{0,900}?)</div>', rest, re.S):
        blok=m.group(2)
        sn=re.search(r'<span class="snum">(.*?)</span>', blok, re.S)
        h2=re.search(r'<h2 class="duo">(.*?)</h2>', blok, re.S)
        if sn and h2:
            kinderen.append((m.group(1), tekst(sn.group(1)), tekst(h2.group(1))))
    toc.append((sleutel,naam,onder,kinderen))
    body_uit.append(u'<div id="deel-%s" class="deel">\n%s\n</div>'%(sleutel,rest.strip()))

BASIS = u"""
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:76px}
body{margin:0;background:#F5F1EA;color:#111;
  font-family:"Montserrat",-apple-system,BlinkMacSystemFont,Arial,sans-serif;
  -webkit-font-smoothing:antialiased}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}

/* ---- kop van het dossier ---- */
.dossier{background:#0B0B0A;color:#fff;padding:66px 24px 58px;position:relative;overflow:hidden}
.dossier .rail{max-width:1140px;margin:0 auto;position:relative;z-index:1}
.dossier .eyebrow{font-size:10.5px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(245,209,138,.75)}
.dossier h1{margin:14px 0 0;font-size:clamp(32px,5vw,54px);font-weight:700;letter-spacing:-.035em;
  line-height:1.04;text-wrap:balance;max-width:16em}
.dossier h1 b{display:block;font-weight:700;
  background-image:linear-gradient(100deg,#F5D18A 0%,#BC813E 100%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:#F5D18A}
.dossier p{margin:18px 0 0;max-width:660px;font-size:16.5px;line-height:1.62;color:rgba(255,255,255,.72)}
.dossier .bogen{position:absolute;inset:0;opacity:.3;pointer-events:none;
  -webkit-mask-image:linear-gradient(180deg,#000,transparent 82%);mask-image:linear-gradient(180deg,#000,transparent 82%)}

/* ---- inhoudsopgave ---- */
.inhoud{max-width:1140px;margin:0 auto;padding:44px 24px 8px}
.inhoud > h2{margin:0 0 18px;font-size:10.5px;font-weight:800;letter-spacing:.2em;
  text-transform:uppercase;color:#BC813E}
.kolommen{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.kol{background:#fff;border:1px solid rgba(17,17,17,.10);border-radius:18px;padding:22px 22px 18px;
  display:flex;flex-direction:column;min-width:0}
.kol > a{text-decoration:none;color:#111;font-size:19px;font-weight:700;letter-spacing:-.025em;
  display:flex;align-items:baseline;gap:9px}
.kol > p{margin:6px 0 14px;font-size:13.5px;line-height:1.5;color:rgba(17,17,17,.6)}
.kol ol{list-style:none;margin:0;padding:0;border-top:1px solid rgba(17,17,17,.10)}
.kol li{border-bottom:1px solid rgba(17,17,17,.08)}
.kol li:last-child{border-bottom:0}
.kol li a{display:flex;flex-direction:column;gap:3px;padding:10px 0;text-decoration:none;
  color:rgba(17,17,17,.8);font-size:13px;line-height:1.42;transition:color .18s ease}
.kol li a:hover,.kol li a:focus-visible{color:#BC813E}
.kol li a span{font-size:9px;font-weight:800;letter-spacing:.13em;color:rgba(17,17,17,.38);
  text-transform:uppercase;line-height:1}

/* ---- wat er nieuw is ---- */
/* Veertig hoofdstukken zijn er te veel om te onthouden waar iets bij kwam.
   Dit paneel staat boven de inhoudsopgave en linkt rechtstreeks naar de
   plek zelf; de gouden stip markeert wat van de laatste ronde is. */
.wijz{max-width:1140px;margin:0 auto;padding:38px 24px 0}
.wijz-doos{background:#111;color:#fff;border-radius:18px;padding:22px 24px 10px}
.wijz-kop{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;
  margin-bottom:4px}
.wijz-ey{font-size:10.5px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#F5D18A}
.wijz-kop > p{margin:0;font-size:12.5px;color:rgba(255,255,255,.55)}
.wijz-lijst{list-style:none;margin:0;padding:0}
.wijz-lijst li{border-top:1px solid rgba(255,255,255,.12)}
.wijz-lijst a{display:grid;grid-template-columns:96px minmax(0,1fr);gap:16px;align-items:baseline;
  padding:13px 0;text-decoration:none;color:#fff;transition:color .18s ease}
.wijz-lijst a:hover,.wijz-lijst a:focus-visible{color:#F5D18A}
.wijz-dat{font-size:11px;font-weight:700;letter-spacing:.03em;color:rgba(255,255,255,.5);
  white-space:nowrap;display:flex;align-items:center;gap:7px}
.wijz-dat i{width:6px;height:6px;border-radius:50%;background:transparent;flex:none}
.wijz-lijst li.vers .wijz-dat i{background:#F5D18A}
.wijz-lijst li.vers .wijz-dat{color:#F5D18A}
.wijz-tx b{display:block;font-size:14.5px;font-weight:700;letter-spacing:-.015em;line-height:1.3}
.wijz-tx span{display:block;margin-top:3px;font-size:13px;line-height:1.45;color:rgba(255,255,255,.62)}

/* de vlag op het hoofdstuk zelf, zodat je weet dat je goed geland bent */
.nieuwvlag{flex:none;font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;
  color:#3A2708;background:#F5D18A;border-radius:100px;padding:4px 9px;white-space:nowrap;
  position:relative;top:-1px}
/* en in de inhoudsopgave */
.kol li a em{font-style:normal;font-size:8.5px;font-weight:800;letter-spacing:.12em;
  text-transform:uppercase;color:#8A5A1E;background:rgba(245,209,138,.42);
  border-radius:100px;padding:2px 7px;margin-left:7px}

/* de knop in de meelopende balk */
.balk a.naarnieuw{background:#F5D18A;color:#3A2708;font-weight:800}
.balk a.naarnieuw:hover,.balk a.naarnieuw:focus-visible{background:#E9BE72;color:#3A2708}

@media (max-width:700px){
  .wijz{padding:26px 20px 0}
  .wijz-doos{padding:18px 18px 8px;border-radius:16px}
  .wijz-lijst a{grid-template-columns:minmax(0,1fr);gap:4px}
}

/* ---- meelopende balk ---- */
.balk{position:sticky;top:0;z-index:40;background:rgba(245,241,234,.92);
  -webkit-backdrop-filter:saturate(1.6) blur(12px);backdrop-filter:saturate(1.6) blur(12px);
  border-bottom:1px solid rgba(17,17,17,.10)}
.balk .rail{max-width:1140px;margin:0 auto;padding:0 24px;display:flex;align-items:center;
  gap:6px;height:56px;overflow-x:auto;scrollbar-width:none}
.balk .rail::-webkit-scrollbar{display:none}
.balk .lg{font-weight:800;font-size:13px;letter-spacing:.02em;color:#111;white-space:nowrap;margin-right:auto}
.balk .lg i{color:#BC813E;font-style:normal}
.balk a{padding:8px 14px;border-radius:100px;text-decoration:none;white-space:nowrap;
  font-size:12px;font-weight:700;color:rgba(17,17,17,.6);transition:background-color .18s ease,color .18s ease}
.balk a:hover,.balk a:focus-visible{color:#111;background:rgba(17,17,17,.06)}
.balk a[aria-current="true"]{background:#111;color:#F5D18A}

/* ---- scheiding tussen de delen ---- */
.deel{scroll-margin-top:70px}
.deel + .deel{border-top:1px solid rgba(17,17,17,.12)}
#deel-boven .mast,#deel-onder .mast,#deel-plan .mast{padding-top:52px}

a:focus-visible,button:focus-visible{outline:2px solid #BC813E;outline-offset:3px}

@media (max-width:900px){.kolommen{grid-template-columns:1fr}}
@media (max-width:700px){.dossier{padding:46px 20px 40px}.inhoud{padding:32px 20px 4px}}
"""

# ---------------------------------------------------------------------------
# Wat er in de laatste sessies is veranderd.
#
# Het dossier is inmiddels veertig hoofdstukken lang; zonder deze lijst moet
# je zoeken waar er iets bij is gekomen. Gesleuteld op (deel, snum-label) en
# niet op het sectienummer, want dat nummer schuift zodra er ergens in het
# midden een hoofdstuk bij komt. Staat een label hier verkeerd, dan valt de
# bouw om -- beter dan een dode link in het rapport.
#
# Nieuwste bovenaan. Alles met de datum van NIEUW_OP krijgt een vlag.
# ---------------------------------------------------------------------------
NIEUW_OP = u'28 augustus'
WIJZIGINGEN = [
 (u'28 augustus', 'boven', u'KOOPVAK',
  u'Het bespaarde bedrag staat achter de prijs; de pil zegt wat dit is.'),
 (u'28 augustus', 'boven', u'OFF-WHITE',
  u'Driekwart van het eerste scherm is spierwit \u2014 drie richtingen, met het cadeaublok erin.'),
 (u'28 augustus', 'boven', u'KORTINGEN',
  u'Vijf geldsignalen boven de vouw, teruggebracht naar twee \u2014 met de spreiding erbij.'),
 (u'28 augustus', 'boven', u'MARINE',
  u'Marine met goud, op halve maat, met verloop, en eindelijk het juiste lettertype.'),
 (u'28 augustus', 'boven', u'DRIE VARIANTEN',
  u'Drie ontwerpen voor het cadeauveld naast elkaar, elk in zijn echte buurt.'),
 (u'27 augustus', 'boven', u'CADEAUS',
  u'Het cadeaublok: eerst gebouwd, daarna herbouwd rond de som en de doorstreping.'),
 (u'27 augustus', 'boven', u'BLOK 02',
  u'De geruststrook onder het koopvak: vier beloftes van de winkel.'),
 (u'27 augustus', 'boven', u'HET PLAATJE',
  u'Het label &laquo;meest gekozen&raquo; blokkeert de listingfoto niet meer.'),
 (u'27 augustus', 'boven', u'TALEN',
  u'Waarom een instelling die niet in het sjabloon staat onvertaalbaar is.'),
 (u'27 augustus', 'boven', u'LICHT',
  u'Het koopvak van zwart naar zand, en daarna naar neutraal.'),
]

def zoek_ids(toc):
    """Zet (deel, label) om in het sectie-id dat de bouw net heeft uitgedeeld."""
    kaart = {}
    for sleutel, _, _, kinderen in toc:
        for i, sn, _ in kinderen:
            kaart[(sleutel, sn)] = i
    uit = []
    for datum, deel, label, om in WIJZIGINGEN:
        if (deel, label) not in kaart:
            raise SystemExit('WIJZIGINGEN: geen sectie "%s" in deel %s' % (label, deel))
        uit.append((datum, kaart[(deel, label)], label, om))
    return uit

wijz = zoek_ids(toc)
nieuw_ids = set(i for d,i,_,_ in wijz if d == NIEUW_OP)
springnaar = wijz[0][1] if wijz else None

# de vlag in de kop van elk vers hoofdstuk
for n, blok in enumerate(body_uit):
    for i in nieuw_ids:
        blok = re.sub(r'(<section id="%s">\s*<div class="shead">\s*<span class="snum">.*?</span>)' % i,
                      r'\1<span class="nieuwvlag">Nieuw</span>', blok, count=1, flags=re.S)
    body_uit[n] = blok

regels = u''
for datum, i, label, om in wijz:
    regels += (u'<li%s><a href="#%s"><span class="wijz-dat"><i></i>%s</span>'
               u'<span class="wijz-tx"><b>%s</b><span>%s</span></span></a></li>'
               % (u' class="vers"' if datum == NIEUW_OP else u'', i, datum, html.escape(label.capitalize()), om))
WIJZBLOK = (u'<div class="wijz"><div class="wijz-doos"><div class="wijz-kop">'
            u'<span class="wijz-ey">Laatst gewijzigd</span>'
            u'<p>Veertig hoofdstukken. Dit zijn de zes waar het laatst aan gewerkt is.</p>'
            u'</div><ol class="wijz-lijst">' + regels + u'</ol></div></div>\n')

kolommen=u''
for sleutel,naam,onder,kinderen in toc:
    li=u''.join(u'<li><a href="#%s"><span>%s</span>%s%s</a></li>'
                %(i,html.escape(sn),html.escape(t),u'<em>nieuw</em>' if i in nieuw_ids else u'')
                for i,sn,t in kinderen)
    kolommen+=(u'<div class="kol"><a href="#deel-%s">%s</a><p>%s</p><ol>%s</ol></div>'
               %(sleutel,html.escape(naam),html.escape(onder),li))

BOGEN=(u'<svg class="bogen" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">'
 u'<defs><linearGradient id="dg" x1="0" y1="1" x2="1" y2="0">'
 u'<stop offset="0%" stop-color="#F5D18A" stop-opacity="0"/>'
 u'<stop offset="45%" stop-color="#F5D18A" stop-opacity=".5"/>'
 u'<stop offset="100%" stop-color="#BC813E" stop-opacity="0"/></linearGradient></defs>'
 u'<path d="M-40 280 C 300 220 700 140 1240 20" stroke="url(#dg)" stroke-width="1.4" fill="none"/>'
 u'<path d="M-40 320 C 340 270 760 190 1240 70" stroke="url(#dg)" stroke-width="1" fill="none"/>'
 u'<path d="M180 340 C 460 280 820 220 1240 130" stroke="url(#dg)" stroke-width=".7" fill="none"/></svg>')

NAVLINKS=u''.join(u'<a href="#deel-%s" data-deel="%s">%s</a>'%(k,k,html.escape(n)) for k,n,_,_ in toc)
if springnaar:
    NAVLINKS += u'<a class="naarnieuw" href="#%s">Nieuw &rarr;</a>' % springnaar

SCRIPT_NAV = u"""
(function(){
  var links = Array.prototype.slice.call(document.querySelectorAll('.balk a[data-deel]'));
  var delen = links.map(function(a){ return document.getElementById('deel-'+a.dataset.deel); });
  function zet(actief){
    links.forEach(function(a,i){
      if (delen[i] === actief) a.setAttribute('aria-current','true');
      else a.removeAttribute('aria-current');
    });
  }
  function meten(){
    var beste = delen[0], grens = window.innerHeight * 0.45;
    delen.forEach(function(d){ if (d && d.getBoundingClientRect().top <= grens) beste = d; });
    zet(beste);
  }
  meten();
  var wacht = false;
  window.addEventListener('scroll', function(){
    if (wacht) return; wacht = true;
    window.requestAnimationFrame(function(){ meten(); wacht = false; });
  }, {passive:true});
})();
"""

SCRIPT_SPRING = u"""
(function(){
  // Een anker in dit dossier landde structureel te hoog. De plaatjes zijn
  // ingebakken base64 en decoderen door nadat de sprong al berekend is, dus
  // de opmaak boven het doel groeit onder je handen. Bij het nieuwste
  // hoofdstuk scheelde dat vierduizend pixels.
  //
  // Daarom: springen doen we zelf, hard in plaats van glijdend -- over
  // vijftigduizend pixels is glijden toch geen dienst -- en daarna
  // corrigeren we twee keer na, als de opmaak is uitgegroeid.
  var MARGE = 76;
  function naar(el){
    var y = el.getBoundingClientRect().top + window.pageYOffset - MARGE;
    window.scrollTo({ top: y < 0 ? 0 : y, behavior: 'instant' });
  }
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    naar(el);
    setTimeout(function(){ naar(el); }, 250);
    setTimeout(function(){ naar(el); history.replaceState(null, '', '#' + id); }, 900);
  });
})();
"""

doc = (u'<meta charset="utf-8">\n'
 u'<title>De nieuwe productpagina</title>\n'
 u'<link rel="preconnect" href="https://fonts.googleapis.com">\n'
 u'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
 u'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap">\n'
 u'<style>'+BASIS+u'\n'+u'\n'.join(css_uit)+u'</style>\n'
 u'<header class="dossier">'+BOGEN+u'<div class="rail">'
 u'<span class="eyebrow">Wellshave &middot; herontwerp productpagina &middot; 23 augustus 2026</span>'
 u'<h1>Eén sjabloon in plaats van tien,<b>voor achtenvijftig producten.</b></h1>'
 u'<p>Je 58 actieve producten draaien vandaag op tien verschillende sjablonen. Dit is het ene dat ze vervangt: het plan met de zeventien blokken, het koopvak boven de vouw, en het productblad met de aanvulling en de betaalrij eronder. Wat nog niet is uitgetekend staat in het plan beschreven maar hier nog niet in beeld.</p>'
 u'</div></header>\n'
 u'<nav class="balk" aria-label="Delen"><div class="rail"><span class="lg">WELL<i>SHAVE</i></span>'+NAVLINKS+u'</div></nav>\n'
 + WIJZBLOK +
 u'<div class="inhoud"><h2>Inhoud</h2><div class="kolommen">'+kolommen+u'</div></div>\n'
 + u'\n'.join(body_uit) + u'\n<script>'+u'\n'.join(scripts)+SCRIPT_NAV+SCRIPT_SPRING+u'</script>\n')

io.open('rapporten/productpagina.html','w',encoding='utf-8').write(doc)
print('geschreven', len(doc), 'bytes;', sum(len(k[3]) for k in toc), 'secties in de inhoudsopgave')
