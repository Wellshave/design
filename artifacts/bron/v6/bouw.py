import json,os,urllib.parse
B=os.path.dirname(os.path.abspath(__file__))
UIT=os.environ.get('WS_UIT','/home/user/design/artifacts/wellshave-v6-hero.html')
img=json.load(open(f'{B}/beelden.json'))
img2=json.load(open(f'{B}/beelden2.json'))
L=json.load(open(os.environ.get('WS_LOGOS',f'{B}/../grijs/logos.json')))
t=open(f'{B}/hero.template.html',encoding='utf-8').read()
site=open(f'{B}/site.html',encoding='utf-8').read()
css=open(f'{B}/blokken.css',encoding='utf-8').read()

# ── Gezien bij ──
volgorde=[('ad','AD',38),('bol','bol',29),('mh',"Men's Health",26),('ed','Eindhovens Dagblad',34),('mm','MediaMarkt',22),
          ('kk','Kieskeurig.nl',25),('dor','De Ondernemer',30),('bcc','BCC',27),('review','Review.nl',25),
          ('blokker','Blokker',28),('baard','Baardtips.com',17),('dbw','De Betere Wereld',20)]
rij=''
for k,naam,h in volgorde:
    if k=='dor':
        rij+=f'<span class="m-do"><span class="m-lg lg-{k}" style="--h:{h}" aria-hidden="true"></span><b>De Ondernemer</b></span>'
    else:
        rij+=f'<span class="m-lg lg-{k}" style="--h:{h}" role="img" aria-label="{naam}"></span>'
logo_css=''.join(f'.lg-{k}{{aspect-ratio:{L[k]["asp"]};background-image:url({L[k]["src"]})}}\n' for k,_,_ in volgorde)

# ── Live uit Shopify, 25 oktober 2026 (prijs, van-prijs, beoordeling, aantal) ──
BESTSELLERS=[  # top 4 apparaten op bestellingen, laatste 30 dagen
 ('p-flex','Flex Guard™ 3-in-1',59.95,85.65,4.6,559,['SkinSafe-messen','Nat of droog','LED-licht']),
 ('p-gg','Groom Guard™',49.95,71.35,4.8,196,['SkinSafe-messen','IPX7 waterdicht','4 opzetkammen']),
 ('p-ggpro','Groom Guard™ PRO',59.95,85.65,4.5,452,['Extra foil shaver','6.600 toeren','IPX7 waterdicht']),
 ('p-adv','Neustrimmer Advance™ 3-in-1',24.95,48.25,4.4,770,['3 opzetstukken','Nat en droog','USB-oplaadbaar']),
]
SETS=[
 ('s-bb3','Barber Bro 3.0',129.95,189.90,None,None,'Knippen, trimmen en glad afwerken, voor haar en baard.',['Tondeuse','Foil shaver','Neustrimmer']),
 ('s-ult','Shave Package Ultimate™',89.95,142.80,4.9,150,'Lichaam glad, neus en details erbij, alles in een tas.',['Groom Guard PRO','Neustrimmer','Twee tassen']),
 ('s-sp3','Shave Package 3.0',64.95,99.95,4.5,101,'Bodygroomer en neustrimmer op één oplaadstation.',['Extra scheerblad','Neustrimmer','Oplaadstation']),
 ('s-sd3','Skull Deal 3.0',74.95,110.00,None,None,'Je hoofd en gezicht glad, thuis en onderweg.',['7D-scheerkop','Extra scheerkop','Travelbag']),
]
ZONES=[('z-lichaam','Lichaam',4,39.95),('z-gezicht','Gezicht &amp; baard',14,16.19),('z-hoofd','Hoofd',5,49.95),('z-neus','Neus &amp; oren',8,16.95)]
REVIEWS=[  # echte Trustpilot-quotes zoals ze nu op de homepage staan
 ('Doet wat hij moet doen. Ook bij de edele delen kun je zonder wondjes gaan trimmen. Ligt ook goed in de hand. Zeker goeie prijs kwaliteit.','Maarten A.','Groom Guard™'),
 ('Door de keramische bladen geen wondjes bij de schaamstreek. Scheermesjes? Prullenbak in!','Barend P.','Groom Guard™ PRO'),
 ('Geweldig pakket, had ik eerder moeten kopen. Scheren gaat moeiteloos en zonder wondjes, zelfs de schaamstreek wordt super glad.','Rik T.','Shave Package Ultimate™'),
 ('Hele fijne en stille trimmer met accudisplay, dus nooit meer een lege batterij. Direct op de huid te gebruiken zonder sneetjes.','Aiden M.','Shave Package 3.0'),
 ('Merk was nieuw voor mij, maar door de veelzijdigheid en reviews toch besteld. Snel geleverd en netjes verpakt. Scheerresultaat boven verwachting.','Britt J.','The Gentleman Shaver™'),
 ('Prettig apparaat, klein en ligt goed in de hand. Ik gebruik hem om mijn hoofd kaal te scheren, doet wat het belooft.','Emma B.','Head Shaver Deluxe'),
 ('Fijn apparaat, werkt naar behoren. Als je de mesjes goed plat over de huid laat gaan kun je met een gerust hart scheren.','Lisa Z.','Flex Guard™ 3-in-1'),
 ('Neustrim-opzetstuk kwijtgeraakt en kosteloos nageleverd door de klantenservice.','Aiden M.','Shave Package 3.0'),
]
def titel(q):  # eerste zin van de klant zelf, ingekort zoals Trustpilot
    z=q.split('. ')[0].rstrip('.!')
    return z if len(z)<=44 else z[:42].rsplit(' ',1)[0]+'…'
def rkaart(q,naam,prod):
    return (f'<figure class="rw"><span class="rw-prod">{prod}</span><h3>{titel(q)}</h3><blockquote>{q}</blockquote>'
            f'<figcaption><span class="rw-av" aria-hidden="true">{naam[0]}</span>{naam}<i class="tp-sterren rw-st" style="--r:5" role="img" aria-label="5 van 5 sterren"></i></figcaption></figure>')
UGC=[('u-hoofd','6 sec','Hoofd scheren'),('u-borst','10 sec','Borst trimmen'),('u-neus','8 sec','Neus trimmen')]
VRAGEN=[
 ('Wat als het me toch niet bevalt?','Je hebt 100 dagen om het apparaat thuis te proberen. Bevalt het niet? Stuur het terug en ontvang het volledige aankoopbedrag. Je hoeft geen reden op te geven.'),
 ('Wanneer is mijn bestelling binnen?','Bestel je van maandag tot en met vrijdag vóór 23:59, dan ligt je pakket de volgende dag in huis in Nederland en België. Bestel je in het weekend, dan gaat hij maandag op de post.'),
 ('Wat kost verzending?','Vanaf €30 is verzending gratis, daaronder betaal je €4,95. Naar België precies hetzelfde, zonder toeslag.'),
 ('Kan ik het apparaat onder de douche gebruiken?','Niet allemaal. De meeste apparaten zijn waterdicht, maar niet alle. Op de productpagina staat per apparaat of hij nat gebruikt mag worden.'),
 ('Hoe vaak moet ik het mes vervangen?','Gemiddeld gaat een kop zes tot twaalf maanden mee, afhankelijk van hoe vaak je hem gebruikt. De koppen liggen apart op voorraad, dus een botte kop kost geen nieuw apparaat.'),
 ('Wat valt er onder de garantie?','Twee jaar op het apparaat zelf. Scheerkoppen en messen zijn slijtdelen en vallen daarbuiten; die zijn los te bestellen.'),
 ('Hoe stuur ik iets terug?','Stuur ons een bericht, dan krijg je van ons de instructies. De verzendkosten van de retour zijn voor jou, het aankoopbedrag krijg je volledig terug.'),
]

eur=lambda x:'€'+f'{x:.2f}'.replace('.',',')
def pct(nu,van):  # zoals ws-spaar.liquid: centen, gehele deling, dus naar beneden
    n,v=round(nu*100),round(van*100); return (v-n)*100//v
PIJL='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
def kop(oog,h2,rechts):
    return f'<div class="s-kop"><p class="s-oog">{oog}</p><h2 class="s-h2">{h2}</h2>{rechts}</div>'
def link(tekst): return f'<a class="s-link" href="#"><span>{tekst}</span>{PIJL}</a>'
TP_SCORE='4,5'  # Trustpilot TrustScore, live gecontroleerd op 26 oktober 2026 (1.088 reviews)
def ster(r,n):  # Trustpilot-regel zoals hun Micro TrustScore-widget, gelijk op elke kaart
    return (f'<p class="k-tp"><b>{TP_SCORE}</b> uit 5 <span class="k-tp-m"><svg viewBox="0 0 12 11" aria-hidden="true">'
            '<path d="M6 .6l1.6 3.4 3.7.5-2.7 2.6.7 3.7L6 9 2.7 10.8l.7-3.7L.7 4.5l3.7-.5z"/></svg>Trustpilot</span></p>')
def kaart(k,naam,nu,van,r,n,chips,inhoud=''):
    return (f'<a class="k{" k-set" if inhoud else ""}" href="#"><div class="k-beeld"><span class="k-golf"></span><span class="k-foto im-{k}" role="img" aria-label="{naam}"></span></div>'
            f'<div class="k-body">{ster(r,n)}<h3 class="k-naam">{naam}</h3>'
            + (f'<p class="k-inhoud">{inhoud}</p>' if inhoud else '') +
            f'<p class="k-prijs"><b>{eur(nu)}</b><s>{eur(van)}</s><span class="k-pil"><span class="p-pct">{pct(nu,van)}% Korting</span><span class="p-eur">Bespaar {eur(van-nu)}</span></span></p>'
            '<ul class="k-chips">'+''.join(f'<li>{c}</li>' for c in chips)+'</ul></div></a>')

s=''
s+=('<section class="s">'+kop('Bestsellers','Wat onze klanten het vaakst kiezen',link('Shop alle bestsellers'))
    +'<div class="k-raster k-scroll">'+''.join(kaart(*p) for p in BESTSELLERS)+'</div></section>')
s+=('<section class="s" style="padding-top:0">'+kop('Kies jouw plek','Waar wil je trimmen?',link('Twijfel je? Doe de quiz'))
    +'<div class="z-raster">'+''.join(
        f'<a class="z" href="#"><span class="z-foto im-{k}" aria-hidden="true"></span><span class="z-tekst"><b class="z-naam">{naam}</b>'
        f'<span class="z-meta"><span>{aantal} apparaten</span><span>vanaf {eur(vanaf)}</span></span></span><span class="z-pijl">{PIJL}</span></a>' for k,naam,aantal,vanaf in ZONES)
    +'</div></section>')
kolA=''.join(rkaart(*r) for r in REVIEWS[0::2]); kolB=''.join(rkaart(*r) for r in REVIEWS[1::2])
muur=('<section class="s s-muur"><div class="rw-paneel"><div class="rw-links"><p class="s-oog">Reviews</p><h2 class="s-h2">Wat klanten zeggen over Wellshave</h2>'
    '<div class="rw-tp"><b>Uitstekend</b><i class="tp-sterren" style="--r:4.5" role="img" aria-label="4,5 van 5 sterren"></i>'
    '<span class="rw-merk"><svg viewBox="0 0 12 11" aria-hidden="true"><path d="M6 .6l1.6 3.4 3.7.5-2.7 2.6.7 3.7L6 9 2.7 10.8l.7-3.7L.7 4.5l3.7-.5z"/></svg>Trustpilot</span></div>'
    '<p class="rw-score">TrustScore 4,5 uit 5 · 1.088 reviews</p><a class="rw-link" href="#">Lees alle reviews op Trustpilot</a></div>'
    f'<div class="rw-muur"><div class="rw-kol"><div class="rw-baan">{kolA}{kolA}</div></div><div class="rw-kol rw-terug"><div class="rw-baan">{kolB}{kolB}</div></div></div></div></section>')
s+=('<section class="s s-video"><div class="u-raster"><div class="u-tekst"><h3>Mannen zoals jij. Hun routine, zelf gefilmd.</h3>'
    '<p>Elke video staat er met toestemming van de maker. #wellshavefamilie</p><a href="#">Bekijk Instagram</a></div>'
    +''.join(f'<a class="u im-{k}" href="#" aria-label="Video: {wat}, {duur}"><span class="u-play"><svg viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z"/></svg></span><span class="u-duur">{duur}</span></a>' for k,duur,wat in UGC)
    +'</div></section>')
s+=('<section class="s">'+kop('Sets','Voordeliger in één set',link('Bekijk alle sets'))
    +'<div class="k-raster">'+''.join(kaart(k,naam,nu,van,r,n,chips,inhoud) for k,naam,nu,van,r,n,inhoud,chips in SETS)+'</div></section>')
s+=('<section class="s s-zand"><div class="v"><div><div class="s-kop"><p class="s-oog">Vragen</p><h2 class="s-h2">Wat je wilt weten voordat je bestelt.</h2></div>'
    '<p class="v-intro">Staat jouw vraag er niet bij? Je krijgt binnen één werkdag antwoord van een echt mens, geen chatbot. Ook als je nog twijfelt welk apparaat je nodig hebt.</p>'
    f'<div class="v-hulp"><a class="k-knop" href="#">Stuur een bericht {PIJL}</a><span class="v-mail">contact@wellshave.com</span></div></div>'
    '<div class="v-lijst">'+''.join(f'<details{" open" if i==0 else ""}><summary>{v}<i aria-hidden="true"></i></summary><p>{a}</p></details>' for i,(v,a) in enumerate(VRAGEN))
    +'</div></div></section>')
s+=('<section class="a"><div class="a-blok"><p class="s-oog">Nog één stap</p><h2>Kies het apparaat voor de plek waar jij iets weg wilt hebben.</h2>'
    '<p>Weet je welke je wilt? Bestel hem vandaag. Twijfel je nog, dan kiest de quiz in een paar vragen, voor jezelf of als cadeau.</p>'
    f'<div class="m-acties"><a class="m-knop" href="#">Vind jouw apparaat {PIJL}</a><a class="m-link" href="#">Laat de quiz kiezen</a></div>'
    '<p class="a-klein">Vandaag beslissen kost je niets: je hebt honderd dagen om van gedachten te veranderen.</p></div>'
    '<footer class="f"><div class="f-nieuws"><span class="f-logo" role="img" aria-label="Wellshave"></span><h3>10% korting op je eerste bestelling</h3><p>Plus tips die je echt gebruikt. Afmelden kan altijd.</p>'
    '<div class="f-veld"><span>jouw@e-mail.nl</span><b>Aanmelden</b></div></div>'
    '<div class="f-kol"><h4>Shop</h4><ul><li>Alle producten</li><li>Sets</li><li>Bodygroomers</li><li>Scheerapparaten</li><li>Neustrimmers</li><li>Baardtrimmers</li></ul></div>'
    '<div class="f-kol"><h4>Hulp</h4><ul><li>Vragen</li><li>Verzending</li><li>Retourneren</li><li>Contact</li></ul></div>'
    '<div class="f-kol"><h4>Wellshave</h4><ul><li>Ons verhaal</li><li>Blog</li><li>Voorwaarden</li><li>Privacy</li></ul></div></footer>'
    '<div class="f-onder"><span>© 2026 Wellshave · Helmond</span><span>Nederland (EUR €)</span></div></section>')
na=s.index('<section',1)  # reviewmuur direct onder de bestsellers
site=site.replace('{{rij}}',rij).replace('{{secties}}',s[:na]+muur+s[na:])

def svg(x): return 'url("data:image/svg+xml,'+urllib.parse.quote(x,safe=' =:/\',.-')+'")'
golf=svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' preserveAspectRatio='none'><rect width='400' height='400' fill='#F6F0E7'/>"
 "<path d='M0 128C78 92 150 176 236 140S352 74 400 98V400H0Z' fill='#F3E8DA'/>"
 "<path d='M0 214C92 170 170 262 262 222S362 162 400 182V400H0Z' fill='#ECDCC7'/>"
 "<path d='M0 296C96 256 184 334 282 296S368 250 400 266V400H0Z' fill='#E4CFB4'/>"
 "<path d='M0 176C96 134 178 228 274 186S368 120 400 140' fill='none' stroke='#D9BF9B' stroke-width='1.3'/>"
 "<path d='M0 256C92 214 176 302 270 262S366 204 400 222' fill='none' stroke='#F7F3EE' stroke-width='1.3'/></svg>")
STER='M6 .6l1.6 3.4 3.7.5-2.7 2.6.7 3.7L6 9 2.7 10.8l.7-3.7L.7 4.5l3.7-.5z'
sterren=svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 11'>"+''.join(f"<path transform='translate({i*13},0)' d='{STER}'/>" for i in range(5))+"</svg>")
vakjes=svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 19'>"+''.join(f"<rect x='{i*20.25}' width='19' height='19'/>" for i in range(5))+"</svg>")
tpster=svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 19'>"+''.join(f"<path fill='#fff' transform='translate({i*20.25+3.5},3.6) scale(1)' d='{STER}'/>" for i in range(5))+"</svg>")
beeld_css=''.join(f'.im-{k}{{background-image:url({v})}}\n' for k,v in img2.items() if k!='ws-mark')
css=css.replace('{{kop_r}}',f'{img["kop_r"]:.3f}').replace('{{kop_bg}}',f'url({img["kop"]})').replace('{{golf}}',golf).replace('{{merk}}','url('+img2['ws-mark']+')').replace('{{sterren}}',sterren).replace('{{vakjes}}',vakjes).replace('{{tpster}}',tpster)+beeld_css

for k,v in {'{{kop_r}}':f'{img["kop_r"]:.3f}','{{kop_bg}}':f'url({img["kop"]})','{{hero_d_bg}}':f'url({img["hero_d"]})',
            '{{hero_m_url}}':f'url({img["hero_m"]})','{{logo_css}}':logo_css,'{{blokken_css}}':css,'{{site}}':site}.items():
    t=t.replace(k,v)
assert '{{' not in t, t[t.find('{{')-80:t.find('{{')+80]
open(UIT,'w',encoding='utf-8').write(t)
print(len(t.encode())//1024,'KB')
