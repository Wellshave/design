# Wellshave-homepage in de rustige stijl van hears.com: wit, kleine letters, goud alleen als verloop
import json,os
B=os.path.dirname(os.path.abspath(__file__))
V6=os.path.join(B,'..','v6')
UIT=os.environ.get('WS_UIT','/home/user/design/artifacts/wellshave-rustig.html')
img=json.load(open(f'{V6}/beelden.json')); img2=json.load(open(f'{V6}/beelden2.json')); img3=json.load(open(f'{B}/beelden.json'))
L=json.load(open(os.environ.get('WS_LOGOS',f'{B}/../grijs/logos.json')))

eur=lambda x:'€'+f'{x:.2f}'.replace('.',',')
def pct(nu,van): n,v=round(nu*100),round(van*100); return (v-n)*100//v
PIJL='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
KLEIN='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"/></svg>'
STER='M6 .6l1.6 3.4 3.7.5-2.7 2.6.7 3.7L6 9 2.7 10.8l.7-3.7L.7 4.5l3.7-.5z'

# ── live uit Shopify, 26 oktober 2026 ── (beeld, naam, wat, prijs, van-prijs)
PRODUCTEN=[
 ('p-flex','Flex Guard™ 3-in-1','Lichaam en schaamstreek',59.95,85.65),
 ('p-gg','Groom Guard™','Bodygroomer',49.95,71.35),
 ('p-ggpro','Groom Guard™ PRO','Bodygroomer met foil shaver',59.95,85.65),
 ('p-adv','Neustrimmer Advance™','3-in-1, neus en details',24.95,48.25),
 ('p-ult4','Neustrimmer Ultimate™','4-in-1, neus, oren, wenkbrauw',29.95,50.00),
 ('p-gent','The Gentleman Shaver™','Gezicht en baard',49.95,85.65),
]
MOMENTEN=[('c-lichaam','Trimmers voor je lichaam'),('c-hoofd','Scheren voor je hoofd'),('c-neus','Detailwerk voor neus en oren')]
KENMERKEN=[
 ('f-messen','SkinSafe-messen','Afgeronde messen die een verkeerde hoek vergeven, zodat je minder snel een sneetje krijgt.'),
 ('f-water','Mee onder de douche','De meeste apparaten zijn waterdicht. Per apparaat staat het op de productpagina.'),
 ('f-trio','Messen los te bestellen','Een botte kop kost geen nieuw apparaat. De koppen liggen apart op voorraad.'),
]
REVIEWS=[
 ('p-gg','Maarten A.','Groom Guard™','Doet wat hij moet doen','Ook bij de edele delen kun je zonder wondjes gaan trimmen. Ligt ook goed in de hand. Zeker goeie prijs kwaliteit.'),
 ('p-ggpro','Barend P.','Groom Guard™ PRO','Geen wondjes bij de schaamstreek','Door de keramische bladen geen wondjes bij de schaamstreek. Scheermesjes? Prullenbak in!'),
 ('s-ult','Rik T.','Shave Package Ultimate™','Had ik eerder moeten kopen','Geweldig pakket. Scheren gaat moeiteloos en zonder wondjes, zelfs de schaamstreek wordt super glad.'),
 ('p-flex','Lisa Z.','Flex Guard™ 3-in-1','Fijn apparaat, werkt naar behoren','Als je de mesjes goed plat over de huid laat gaan kun je met een gerust hart scheren.'),
]
UGC=[('u-hoofd','6 sec'),('u-borst','10 sec'),('u-neus','8 sec')]
LOGO=[('ad','AD',30),('mh',"Men's Health",21),('ed','Eindhovens Dagblad',27),('mm','MediaMarkt',18),('kk','Kieskeurig.nl',20),('bol','bol',23),('bcc','BCC',22),('review','Review.nl',20)]

def kop(h,rechts=''):
    return f'<div class="kop"><h2>{h}</h2>{rechts}</div>'
def link(t): return f'<a class="klein-link" href="#">{t}{KLEIN}</a>'

s=''
# meldbalk, kop, hero
s+=('<div class="balk">Gratis verzending vanaf €30 · 100 dagen proberen · Morgen in huis</div>'
    '<header class="nav"><nav class="links"><a href="#">Shop</a><a href="#">Sets</a><a href="#">Over ons</a><a class="sale" href="#">Herfst Sale</a></nav>'
    '<a class="logo" href="#" aria-label="Wellshave"></a>'
    '<div class="rechts"><a href="#">Hulp</a><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>'
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.3 7.5-5.3s6.3 1.7 7.5 5.3"/></svg>'
    '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg></span></div></header>'
    '<section class="hero" role="img" aria-label="Man in een bruine trui met de Blade Baron, herfstbomen achter het raam">'
    '<div class="hero-tekst"><span class="hero-logo" aria-hidden="true"></span><p>Herfst Sale · tot 40% korting op geselecteerde apparaten</p></div>'
    f'<a class="pil licht" href="#">Shop de Herfst Sale {PIJL}</a><span class="stippen" aria-hidden="true"><i class="aan"></i><i></i><i></i></span></section>')
# bestsellers
s+=('<section class="sec">'+kop('Bestsellers',link('Bekijk alles'))+'<div class="rij6">'+''.join(
    f'<a class="prod" href="#"><span class="tegel"><span class="foto im-{k}"></span><span class="badge">{pct(nu,van)}% Korting</span></span>'
    f'<b>{naam}</b><span class="wat">{wat}</span><span class="prijs">{eur(nu)} <s>{eur(van)}</s></span></a>' for k,naam,wat,nu,van in PRODUCTEN)+'</div></section>')
# momenten
s+=('<section class="sec">'+kop('Ontdek per plek')+'<div class="rij3">'+''.join(
    f'<a class="moment" href="#"><span class="beeld im-{k}"></span><span class="onder">{t}{PIJL}</span></a>' for k,t in MOMENTEN)+'</div></section>')
# beeldband
s+='<section class="sec"><div class="band im-band" role="img" aria-label="Het LED-licht van de Groom Guard verlicht de huid in het donker"></div></section>'
# kenmerken
s+=('<section class="sec ken"><div class="ken-l"><h2>Wellshave maakt je routine <span class="g">makkelijker</span></h2>'
    f'<a class="pil" href="#">Vind jouw apparaat {PIJL}</a></div><div class="ken-r">'+''.join(
    f'<div class="kenmerk"><div><h3>{t}</h3><p>{p}</p></div><span class="duim im-{k}"></span></div>' for k,t,p in KENMERKEN)+'</div></section>')
# bento
s+=('<section class="sec"><div class="bento">'
    '<a class="b b-groot im-b-herfst" href="#"><span>De Herfst Sale</span></a>'
    '<a class="b b-klein im-s-ult" href="#"><span>Shave Package Ultimate™</span></a>'
    '<a class="b b-klein im-s-sd3" href="#"><span>Skull Deal 3.0</span></a>'
    '<a class="b b-breed im-b-kammen" href="#"><span>Groom Guard: vier kammen</span></a></div></section>')
# reviews
s+=('<section class="sec">'+'<div class="kop midden"><h2>Word deel van de Wellshave-familie</h2>'
    '<p class="sub">4,5 uit 5 op Trustpilot, uit 1.088 reviews. Dit is wat klanten schreven.</p></div><div class="rij4">'+''.join(
    f'<figure class="rev"><span class="tegel"><span class="foto im-{k}"></span></span><figcaption><span class="naam">{naam} <em>Trustpilot</em></span>'
    f'<span class="prod-n">{prod}</span><i class="sterren" aria-label="5 van 5 sterren"></i><b>{t}</b><span class="tekst">{q}</span></figcaption></figure>' for k,naam,prod,t,q in REVIEWS)
    +'</div></section>')
# pers
rij=''.join(f'<span class="lg lg-{k}" style="--h:{h}" role="img" aria-label="{n}"></span>' for k,n,h in LOGO)
s+=f'<section class="sec pers"><div class="pers-baan"><div class="pers-rij">{rij}{rij}</div></div></section>'
# donkere band
s+=('<section class="sec"><div class="donker"><div class="d-tekst"><span class="d-label">Review.nl-testpanel</span>'
    '<p class="d-cijfer"><b>8,5</b> voor de Neustrimmer 4in1 Ultra™</p><p class="d-klein">Twintig testers gebruikten hem van 18 mei tot 5 juni 2026.</p>'
    f'<a class="pil licht klein" href="#">Bekijk de Ultra {PIJL}</a></div><span class="d-foto im-ultra" role="img" aria-label="Neustrimmer 4in1 Ultra met verpakking"></span></div></section>')
# vervaagde zin
zin='<span>Verzorgd. Elke dag.</span>'*4
s+=f'<section class="zin" aria-hidden="true"><div class="zin-rij">{zin}{zin}</div></section>'
# zekerheid
s+=('<section class="sec zek"><div class="zek-l"><h2>Zeker voor je bestelt</h2><p>Je probeert rustig thuis, je hebt twee jaar garantie, en als je ergens niet uitkomt krijg je antwoord van een echt mens.</p>'
    f'<a class="klein-link goud" href="#">Lees hoe het werkt{KLEIN}</a></div><div class="zek-r">'
    '<div class="z z-hoog im-z-ochtend"><span>100 dagen proberen. Bevalt hij niet, dan krijg je je geld terug.</span></div>'
    '<div class="z im-z-lading"><span>2 jaar garantie op het apparaat</span></div>'
    '<div class="z z-licht im-z-trio"><span>Bot mes? De kop ligt los op voorraad.</span></div></div></section>')
# community
s+=('<section class="sec">'+'<div class="kop midden"><h2>#wellshavefamilie</h2><p class="sub">Hun routine, zelf gefilmd. Met toestemming van de maker.</p></div><div class="rij-ugc">'+''.join(
    f'<a class="ugc im-{k}" href="#" aria-label="Video, {d}"><span class="play"><svg viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z"/></svg></span><span class="duur">{d}</span></a>' for k,d in UGC)
    +f'</div><div class="midden-knop"><a class="pil omlijnd" href="#">Bekijk Instagram</a></div></section>')
# voet
s+=('<footer class="voet"><div class="voet-raster">'
    '<div><h4>Shop</h4><ul><li>Alle producten</li><li>Sets</li><li>Bodygroomers</li><li>Scheerapparaten</li><li>Neustrimmers</li><li>Baardtrimmers</li></ul></div>'
    '<div><h4>Hulp</h4><ul><li>Vragen</li><li>Verzending</li><li>Retourneren</li><li>Garantie</li><li>Contact</li></ul></div>'
    '<div><h4>Wellshave</h4><ul><li>Ons verhaal</li><li>Blog</li><li>Voorwaarden</li><li>Privacy</li></ul></div>'
    '<div class="nieuws"><h4>Blijf op de hoogte</h4><div class="veld"><span>jouw@e-mail.nl</span><b>Aanmelden</b></div>'
    '<p>10% korting op je eerste bestelling. Afmelden kan altijd.</p></div></div>'
    '<div class="voet-onder"><span class="logo klein" aria-hidden="true"></span><span>© 2026 Wellshave · Helmond</span></div></footer>')

beeld={**{k:img2[k] for k in ['p-flex','p-gg','p-ggpro','p-adv','s-ult','s-sd3','c-lichaam','c-hoofd','c-neus','u-hoofd','u-borst','u-neus']},**img3}
css_beeld=''.join(f'.im-{k}{{background-image:url({v})}}\n' for k,v in beeld.items())
css_logo=''.join(f'.lg-{k}{{aspect-ratio:{L[k]["asp"]};background-image:url({L[k]["src"]})}}\n' for k,_,_ in LOGO)
import urllib.parse
sterren='url("data:image/svg+xml,'+urllib.parse.quote("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 11'>"+''.join(f"<path transform='translate({i*13},0)' d='{STER}'/>" for i in range(5))+'</svg>',safe=" =:/',.-")+'")'
t=open(f'{B}/pagina.template.html',encoding='utf-8').read()
for k,v in {'{{site}}':f'<div class="site">{s}</div>','{{beeld_css}}':css_beeld,'{{logo_css}}':css_logo,'{{kop_r}}':f'{img["kop_r"]:.3f}',
            '{{kop}}':f'url({img["kop"]})','{{hero_d}}':f'url({img["hero_d"]})','{{hero_m}}':f'url({img["hero_m"]})',
            '{{sterren}}':sterren}.items():
    t=t.replace(k,v)
assert '{{' not in t, t[t.find('{{')-60:t.find('{{')+60]
open(UIT,'w',encoding='utf-8').write(t)
print(len(t.encode())//1024,'KB')
