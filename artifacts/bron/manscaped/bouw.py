# Wellshave-homepage in de opbouw van manscaped.com: crème, brons, zware serif, smalle hoofdletters
import json,os,urllib.parse
B=os.path.dirname(os.path.abspath(__file__)); V6=os.path.join(B,'..','v6'); HS=os.path.join(B,'..','hs')
UIT=os.environ.get('WS_UIT','/home/user/design/artifacts/wellshave-manscaped-stijl.html')
img=json.load(open(f'{V6}/beelden.json')); img2=json.load(open(f'{V6}/beelden2.json')); img3=json.load(open(f'{HS}/beelden.json')); img4=json.load(open(f'{B}/beelden.json'))
L=json.load(open(os.environ.get('WS_LOGOS',f'{B}/../grijs/logos.json')))

eur=lambda x:'€'+f'{x:.2f}'.replace('.',',')
def pct(nu,van): n,v=round(nu*100),round(van*100); return (v-n)*100//v
PIJL='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
KLEIN='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"/></svg>'
IC={
 'schild':'<svg viewBox="0 0 24 24"><path d="M12 3.5 19 6v5.6c0 4.3-2.9 7.6-7 8.9-4.1-1.3-7-4.6-7-8.9V6z"/><path d="m8.8 12.2 2.2 2.2 4.2-4.4"/></svg>',
 'bus':'<svg viewBox="0 0 24 24"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7z"/><circle cx="6.5" cy="17.5" r="1.7"/><circle cx="16.5" cy="17.5" r="1.7"/></svg>',
 'klok':'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
}
# ── live uit Shopify, 26 oktober 2026 ──
UITGELICHT=[  # zes producten voor lichaam en schaamstreek, live uit Shopify
 ('p-ggpro','Groom Guard™ PRO','Bodygroomer met foil shaver',59.95,85.65),
 ('p-flex','Flex Guard™ 3-in-1','Lichaam en schaamstreek',59.95,85.65),
 ('p-gg','Groom Guard™','Bodygroomer',49.95,71.35),
 ('p-dual','Dual Groomer™ 2-in-1','Bodygroomer',39.95,79.92),
 ('s-ult','Shave Package Ultimate™','Groom Guard PRO, neustrimmer en twee tassen',89.95,142.80),
 ('s-sp3','Shave Package 3.0','Bodygroomer, neustrimmer en oplaadstation',64.95,99.95),
]
VOORTGANG='<div class="voortgang" aria-hidden="true"><i></i></div>'
PLEKKEN=[('c-lichaam','Lichaam'),('c-gezicht','Gezicht &amp; baard'),('c-hoofd','Hoofd'),('c-neus','Neus &amp; oren'),('c-sets','Sets')]
BANNERS=[  # beeld, regel 1, regel 2 in brons, tekst, licht/donker, tekst links/rechts
 ('ban-lading','Groom Guard™','Bodygroomer','SkinSafe-messen, vier opzetkammen en een oplaadstandaard.','licht','links'),
 ('ban-herfst','De Herfst','Sale','Tot 40% korting op geselecteerde apparaten. Tot en met 30 oktober.','donker','links'),
 ('ban-kammen','Vier kammen.','Eén lijn.','Van 1,5 tot 4,5 mm: jij kiest hoe kort, de Groom Guard doet de rest.','donker','rechts'),
]
TECH=[  # innovatie, uitleg uit de productomschrijvingen in Shopify, met het product erbij getagd
 ('t-messen','SkinSafe-messen','Keramische mesjes die je huid nooit blootleggen, ook niet in je gevoelige zones. Trimmen zonder de sneetjes en ingegroeide haren van een gewoon mesje.','p-ggpro','Groom Guard™ PRO',59.95),
 ('t-water','Waterdicht tot IPX7','Gewoon mee onder de douche. IPX7 betekent dat hij zelfs tegen kort onderdompelen kan.','p-gg','Groom Guard™',49.95),
 ('t-led','Geïntegreerd LED-licht','Een lampje bij het mes laat elk haartje zien, voor precisie op plekken die je zelf slecht ziet.','p-flex','Flex Guard™ 3-in-1',59.95),
 ('t-7d','Flexibele 7D-scheerkop','Zeven koppen die los bewegen en iedere contour van je hoofd volgen. Snel en gelijkmatig glad.','p-hsd','Head Shaver Deluxe',54.95),
]
PRODUCTEN=[
 ('p-flex','Flex Guard™ 3-in-1','Lichaam en schaamstreek',59.95,85.65),
 ('p-gg','Groom Guard™','Bodygroomer',49.95,71.35),
 ('p-ggpro','Groom Guard™ PRO','Bodygroomer met foil shaver',59.95,85.65),
 ('p-adv','Neustrimmer Advance™','3-in-1',24.95,48.25),
 ('p-ult4','Neustrimmer Ultimate™','4-in-1',29.95,50.00),
 ('p-gent','The Gentleman Shaver™','Gezicht en baard',49.95,85.65),
 ('s-sp3','Shave Package 3.0','Set',64.95,99.95),
]
LOGO=[('ad','AD',30),('mh',"Men's Health",21),('ed','Eindhovens Dagblad',27),('mm','MediaMarkt',18),('kk','Kieskeurig.nl',20),('bol','bol',23),('bcc','BCC',22)]

def zeker(): return ('<div class="zeker"><span>'+IC['schild']+'100 dagen proberen</span><span>'+IC['bus']+'Gratis verzending vanaf €30</span><span>'+IC['klok']+'Morgen in huis</span></div>')
def kaart(k,naam,wat,nu,van,groot=False):
    return (f'<a class="kaart{" groot" if groot else ""}" href="#"><span class="tegel"><span class="foto im-{k}"></span><span class="label">{pct(nu,van)}% Korting</span></span>'
            f'<b>{naam}</b><span class="wat">{wat}</span><span class="prijs"><strong>{eur(nu)}</strong><s>{eur(van)}</s></span></a>')

s=''
s+=('<div class="balk">Herfst Sale: tot 40% korting op geselecteerde apparaten. <u>Shop nu</u></div>'
    '<header class="nav"><a class="logo" href="#" aria-label="Wellshave"></a><div class="rechts"><span>Hulp</span><span>NL · €</span>'
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.3 7.5-5.3s6.3 1.7 7.5 5.3"/></svg>'
    '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg></div></header>'
    '<nav class="nav2"><a>Sets</a><a>Lichaam</a><a>Gezicht &amp; baard</a><a>Hoofd</a><a>Neus &amp; oren</a><a>Messen &amp; accessoires</a><a class="zoek">Zoeken</a></nav>')
s+=('<section class="hero"><a class="h-groot" href="#"><span class="h-tekst"><span class="oog">Herfst Sale · tot 40%</span><span class="h-kop">Jouw huid.<br>Jouw lijn. <span class="b">Wellshave.</span></span>'
    f'<span class="h-sub">In beeld: de 4 Foil Blade Baron™, vier foil-koppen voor je gezicht.</span><span class="knop">Shop nu</span></span></a>'
    '<div class="h-rechts"><a class="h-tegel im-r-herfst" href="#"><span>Shop de Herfst Sale</span></a><a class="h-tegel im-r-water" href="#"><span>Shop bodygroomers</span></a></div></section>')
s+=zeker()
s+=('<section class="sec creme"><h2 class="serif">Glad tot in <span class="b">de kleinste hoek.</span></h2><p class="sub">Gemaakt voor je gevoeligste plekken.</p>'
    '<div class="schuif"><div class="plekken rij-kaarten" tabindex="0" aria-label="Producten, schuif opzij">'+''.join(kaart(*p,groot=True) for p in UITGELICHT)+'</div>'+VOORTGANG+'</div></section>')
s+=('<section class="sec creme midden"><h2 class="serif">Verzorgd <span class="b">van top tot teen.</span></h2><a class="knop" href="#">Shop alles</a>'
    '<div class="schuif"><div class="plekken" tabindex="0" aria-label="Plekken, schuif opzij">'+''.join(f'<a class="plek" href="#"><span class="pbeeld im-{k}"></span><b>{n}</b><span class="nu">Shop nu {PIJL}</span></a>' for k,n in PLEKKEN)+'</div>'
    +VOORTGANG+'</div></section>')
s+=''.join(f'<section class="ban {lt} {kant} im-{k}"><div class="ban-tekst"><span class="merkteken" aria-hidden="true"></span><h3 class="ban-kop">{a} <span class="b">{b}</span></h3><p>{p}</p><span class="knop">Shop nu</span></div></section>' for k,a,b,p,lt,kant in BANNERS)
s+=('<section class="sec creme midden"><span class="oog brons">Innovatie</span><h2 class="serif">Anders dan de rest. <span class="b">Dit is waarom.</span></h2>'
    '<div class="schuif"><div class="plekken tech" tabindex="0" aria-label="Innovaties, schuif opzij">'+''.join(
    f'<div class="t"><div class="tbeeld im-{k}"><a class="tag" href="#"><span class="tag-foto im-{pk}" aria-hidden="true"></span><span class="tag-t"><b>{pn}</b><small>{eur(pp)}</small></span>'
    f'<span class="tag-plus" aria-label="In winkelwagen">+</span></a></div><b class="t-kop">{t}</b><p>{p}</p></div>' for k,t,p,pk,pn,pp in TECH)
    +'</div>'+VOORTGANG+'</div></section>')
rij=''.join(f'<span class="lg lg-{k}" style="--h:{h}" role="img" aria-label="{n}"></span>' for k,n,h in LOGO)
s+=f'<section class="pers"><div class="pers-rij">{rij}</div></section>'
s+=('<section class="sec creme midden"><span class="oog brons">Onze bestsellers</span><h2 class="serif">Alles wat je <span class="b">nodig hebt.</span></h2>'
    '<div class="rij7">'+''.join(kaart(*p) for p in PRODUCTEN)+'</div></section>')
s+=('<section class="club"><span class="club-merk" aria-hidden="true"></span><span class="club-oog">Wellshave</span><h2 class="serif wit">Kies. Probeer. <span class="b">Houd hem.</span></h2>'
    '<p>Je bestelt vandaag, probeert honderd dagen in je eigen badkamer en houdt hem alleen als hij bevalt.</p><div class="club-rij">'
    '<div><b>100 dagen</b><span>proberen, anders geld terug</span></div><div><b>2 jaar</b><span>garantie op het apparaat</span></div><div><b>Voor 23:59</b><span>besteld, morgen in huis</span></div></div>'
    '<a class="knop" href="#">Vind jouw apparaat</a><span class="club-link">Doe de quiz</span></section>')
s+=('<footer class="voet">'+zeker()+'<div class="voet-raster">'
    '<div><h4>Wellshave</h4><ul><li>Ons verhaal</li><li>Blog</li><li>Pers</li></ul></div>'
    '<div><h4>Klantenservice</h4><ul><li>Vragen</li><li>Verzending</li><li>Retourneren</li><li>Garantie</li><li>Contact</li></ul></div>'
    '<div><h4>Juridisch</h4><ul><li>Voorwaarden</li><li>Privacy</li><li>Cookies</li></ul></div>'
    '<div class="nieuws"><h4>Als eerste nieuwe producten</h4><div class="veld"><span>jouw@e-mail.nl</span></div><span class="knop klein">Aanmelden</span><p>10% korting op je eerste bestelling.</p></div></div>'
    '<div class="voet-onder"><span class="logo wit" aria-hidden="true"></span><span>© 2026 Wellshave · Helmond</span></div></footer>')

beeld={**{k:img2[k] for k in ['p-flex','p-gg','p-ggpro','p-adv','s-ult','s-sp3','c-lichaam','c-gezicht','c-hoofd','c-neus']},**{k:img3[k] for k in ['p-ult4','p-gent']},**img4}
css_beeld=''.join(f'.im-{k}{{background-image:url({v})}}\n' for k,v in beeld.items())
css_logo=''.join(f'.lg-{k}{{aspect-ratio:{L[k]["asp"]};background-image:url({L[k]["src"]})}}\n' for k,_,_ in LOGO)
t=open(f'{B}/pagina.template.html',encoding='utf-8').read()
for k,v in {'{{site}}':f'<div class="site">{s}</div>','{{beeld_css}}':css_beeld,'{{logo_css}}':css_logo,'{{kop_r}}':f'{img["kop_r"]:.3f}',
            '{{kop}}':f'url({img["kop"]})','{{hero_d}}':f'url({img["hero_d"]})','{{hero_m}}':f'url({img["hero_m"]})','{{merk}}':f'url({img2["ws-mark"]})'}.items():
    t=t.replace(k,v)
assert '{{' not in t, t[t.find('{{')-60:t.find('{{')+60]
open(UIT,'w',encoding='utf-8').write(t)
print(len(t.encode())//1024,'KB')
