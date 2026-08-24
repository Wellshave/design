# -*- coding: utf-8 -*-
from zg_engine import W, RETOUR, SCHILDV, TRUCK, KLOK, vergelijker

P = W + '/products/'

SVG_FADE = '''<svg viewBox="0 0 460 372" style="width:100%;height:auto" fill="none"
   stroke-linecap="round" stroke-linejoin="round" role="img"
   aria-label="Kaart van het hoofd: bovenop bepaalt de tondeuse de lengte, op de zijkant en de nek maakt de fade-hendel de overgang van kort naar lang, en langs de haarlijn zet de detailtrimmer de rand.">
<title>Kaart van het hoofd: bovenop bepaalt de tondeuse de lengte, op de zijkant en de nek maakt de fade-hendel de overgang van kort naar lang, en langs de haarlijn zet de detailtrimmer de rand.</title>
<text x="0" y="14" font-family="Montserrat" font-size="10.5" font-weight="800" letter-spacing="1.8" fill="rgba(17,17,17,.4)">WIE DOET WELK STUK</text>
<path d="M286 10h14" stroke="#BC813E" stroke-width="2.6"/>
<text x="306" y="14" font-family="Montserrat" font-size="10.5" font-weight="700" fill="rgba(17,17,17,.55)">de fade-zone</text>

<path d="M198 68c-46 2-74 36-76 70 -1 10-10 16-14 24 -4 8 4 14 10 17 2 11-2 20 5 25 4 10 10 24 23 36 16 14 38 20 56 18 24-4 48-26 60-52 12-26 16-52 12-80 -6-38-30-64-76-58z"
      stroke="#111" stroke-width="2.3"/>
<ellipse cx="198" cy="178" rx="11" ry="15" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M232.6 220.9L233.6 222.6" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M238.3 217.6L239.4 219.3" stroke="#BC813E" stroke-width="2.1"/>
<path d="M243.6 213.8L245.0 215.6" stroke="#BC813E" stroke-width="2.1"/>
<path d="M248.6 209.6L250.3 211.4" stroke="#BC813E" stroke-width="2.1"/>
<path d="M253.2 205.0L255.3 206.9" stroke="#BC813E" stroke-width="2.1"/>
<path d="M257.5 200.0L260.0 202.0" stroke="#BC813E" stroke-width="2.1"/>
<path d="M261.3 194.7L264.3 196.7" stroke="#BC813E" stroke-width="2.1"/>
<path d="M264.6 189.1L268.2 191.0" stroke="#BC813E" stroke-width="2.1"/>
<path d="M267.5 183.2L271.7 185.1" stroke="#BC813E" stroke-width="2.1"/>
<path d="M269.8 177.1L274.7 178.8" stroke="#BC813E" stroke-width="2.1"/>
<path d="M271.7 170.9L277.3 172.3" stroke="#BC813E" stroke-width="2.1"/>
<path d="M273.0 164.5L279.4 165.5" stroke="#BC813E" stroke-width="2.1"/>
<path d="M273.8 158.0L280.9 158.5" stroke="#BC813E" stroke-width="2.1"/>
<path d="M274.0 151.5L281.9 151.4" stroke="#BC813E" stroke-width="2.1"/>
<path d="M273.7 144.9L282.4 144.1" stroke="#BC813E" stroke-width="2.1"/>
<path d="M272.8 138.5L282.2 136.8" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M271.4 132.1L281.5 129.4" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M269.5 125.8L280.2 122.0" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M267.0 119.8L278.3 114.7" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M264.1 113.9L275.7 107.4" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M260.7 108.4L272.6 100.4" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M256.8 103.1L268.8 93.5" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M252.5 98.2L264.5 86.8" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M247.8 93.7L259.5 80.5" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M242.7 89.5L254.0 74.4" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M237.3 85.9L248.0 68.8" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M231.7 82.6L241.4 63.7" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M225.7 79.9L234.3 59.0" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M219.6 77.7L226.8 54.9" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M213.3 75.9L218.9 51.3" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M206.9 74.8L210.6 48.4" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M200.4 74.1L201.9 46.1" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M193.8 74.0L193.0 44.6" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M187.3 74.5L183.9 43.7" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M180.8 75.5L174.5 43.6" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M174.5 77.0L165.1 44.3" stroke="rgba(17,17,17,.4)" stroke-width="2.1"/>
<path d="M186 40h-88" stroke="rgba(17,17,17,.22)" stroke-width="1.6" stroke-dasharray="3 4"/>
<text x="8" y="36" font-family="Montserrat" font-size="11.5" font-weight="800" fill="#111">Tondeuse</text>
<text x="8" y="52" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">bovenop bepaal je</text>
<text x="8" y="66" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">de lengte</text>

<path d="M288 186h62" stroke="#BC813E" stroke-width="1.6" stroke-dasharray="3 4"/>
<path d="M356 150v72M350 150h12M350 222h12" stroke="#BC813E" stroke-width="2"/>
<text x="372" y="172" font-family="Montserrat" font-size="11.5" font-weight="800" fill="#BC813E">Fade-hendel</text>
<text x="372" y="189" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">op de zijkant en</text>
<text x="372" y="203" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">de nek loopt kort</text>
<text x="372" y="217" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">naar lang</text>

<path d="M232 262h100" stroke="rgba(17,17,17,.22)" stroke-width="1.6" stroke-dasharray="3 4"/>
<text x="338" y="258" font-family="Montserrat" font-size="11.5" font-weight="800" fill="#111">Detailtrimmer</text>
<text x="338" y="275" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">de rand: de</text>
<text x="338" y="289" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">haarlijn in de nek</text>
<text x="338" y="303" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">en om het oor</text>

<path d="M96 306C82 214 92 116 148 72" stroke="rgba(17,17,17,.3)" stroke-width="2.1" stroke-dasharray="4 5"/>
<path d="M138 70l11 1 1 11" stroke="rgba(17,17,17,.3)" stroke-width="2.1"/>
<text x="8" y="326" font-family="Montserrat" font-size="11.5" font-weight="800" fill="#111">Of alles eraf</text>
<text x="8" y="342" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">het hoofdscheerapparaat</text>
<text x="8" y="356" font-family="Montserrat" font-size="11" font-weight="600" fill="rgba(17,17,17,.55)">doet het hele vlak in banen</text>
</svg>'''

APP = [
 dict(id='hs', img='headshaver', naam='Head Shaver Deluxe', tag='Meest gekozen',
      wat='Zeven roterende koppen die de bolling van je schedel volgen.',
      score=4.8, aantal=351, chips=['7D-kop', '7.000 rpm'], prijs=54.95, van=64.95,
      url=P + 'wellshave-5-in-1-scheerapparaat-mannen-deluxe',
      redenen=['7D-scheerkop volgt de contouren van je hoofd',
               'SkinSafe-technologie tegen wondjes en irritatie',
               'Krachtige 7.000 rpm-motor'],
      vgl=[('Waarvoor gemaakt', 'Je hoofd volledig glad scheren, ook zonder spiegel achter je.'),
           ('Wat hij extra kan', 'Zes onderdelen in de doos, waaronder opzetstukken voor gezicht en detail.'),
           ('Wat hij niet doet', 'Geen opzetkammen &mdash; hij scheert glad, hij knipt geen lengte.')]),
 dict(id='ele', img='tonelegant', naam='Tondeuse Elegant&trade;', tag='Kapperskwaliteit',
      wat='Fades en contouren met een verstelbare hendel.',
      score=4.8, aantal=260, chips=['Fade-hendel', 'Metalen huis'], prijs=59.95, van=92.79,
      url=P + 'wellshave-tondeuse-elegant',
      redenen=['Verstelbare fade-hendel voor elke lengte',
               'Krachtige motor, knipt zonder trekken of haperen',
               'Robuuste metalen behuizing'],
      vgl=[('Waarvoor gemaakt', 'Je haar op lengte houden en fades zetten, thuis of in de stoel.'),
           ('Wat hij extra kan', 'De fade-hendel valt tussen twee opzetkammen in, waar de overgang zit.'),
           ('Wat hij niet doet', 'Scheert niet glad &mdash; er blijft altijd lengte staan.')]),
 dict(id='sharp', img='sharpline', naam='Detailtrimmer Sharpline&trade;', tag='Voor de lijnen',
      wat='Strakke randen, nek- en baardlijn in &eacute;&eacute;n haal.',
      score=4.7, aantal=139, chips=['3 opzetstukken', 'Smal mes'], prijs=49.95, van=85.65,
      url=P + 'detailtrimmer-sharpline%E2%84%A2',
      redenen=['Strakke lijnen in enkele precieze bewegingen',
               'Snijdt door dik en stug haar',
               'Drie opzetstukken voor kort, medium en langer'],
      vgl=[('Waarvoor gemaakt', 'De rand: nek, oren, slapen en de baardlijn.'),
           ('Wat hij extra kan', 'Het smalle mes komt bij de contour waar een tondeuse te breed is.'),
           ('Wat hij niet doet', 'Geen apparaat om je hele hoofd mee te doen.')]),
 dict(id='del', img='tondeluxe', naam='Tondeuse Deluxe&trade;', tag='Tijdelijk uitverkocht',
      uitverkocht=True,
      wat='Dezelfde fade-hendel, met een brushless motor.',
      score=4.8, aantal=321, chips=['Brushless', 'Fade-hendel'], prijs=69.95, van=99.95,
      url=P + 'wellshave-tondeuse-mannen-deluxe',
      voet='Tijdelijk niet leverbaar &mdash; laat je e-mailadres achter op de productpagina',
      redenen=['Brushless 2838-motor, sneller door elk haartype',
               'Verstelbare fade-hendel',
               'Metalen behuizing'],
      vgl=[('Waarvoor gemaakt', 'Hetzelfde werk als de Elegant, met een sterkere motor.'),
           ('Wat hij extra kan', 'De brushless motor blijft op toeren in dik haar.'),
           ('Wat hij niet doet', 'Op dit moment niets &mdash; hij is tijdelijk uitverkocht.')]),
]

SETS = [
 dict(img='skull1', naam='Skull Deal 1.0', tag='Set', doos=6, prijs=59.95, van=69.95,
      url=P + 'skull-shaver-deluxe-extra-magnetische-scheerkop',
      wat='De Head Shaver met een extra magnetische scheerkop.'),
 dict(img='skull2', naam='Skull Deal 2.0', tag='Set', doos=7, prijs=64.95, van=74.96,
      url=P + 'skull-deal-2-0', wat='Van stoppels naar glad, met opbergtas erbij.'),
 dict(id='skull3', img='skull3', naam='Skull Deal 3.0', tag='Set', doos=8, prijs=69.95, van=79.95,
      url=P + 'skull-deal-3-0', wat='De ruimste hoofdset: extra kop, tas en hard case.'),
 dict(img='bpack1', naam='Barber Pack 1.0', tag='Set', doos=8, prijs=99.95, van=109.95,
      url=P + 'barber-pack-1-0', wat='Tondeuse en detailtrimmer samen, voor haar en lijnen.'),
 dict(id='bpack2', img='bpack2', naam='Barber Pack 2.0', tag='Set', doos=10, prijs=114.95, van=124.95,
      url=P + 'barber-pack-2-0', wat='Tondeuse, detailtrimmer en foil shaver voor de afwerking.'),
 dict(id='bpack3', img='bpack3', naam='Barber Pack 3.0', tag='Meest compleet', doos=11, prijs=124.95, van=134.95,
      url=P + 'barber-pack-3-0', wat='De all-in set: haar, baard, fades, afwerking en neushaar.'),
]

ONDERHOUD = [
 dict(img='kop7d', naam='Head Shaver&trade; 7D Scheerkop', kicker='Scheerkop',
      wat='Vervangkop voor de Head Shaver Deluxe en de Skull Deals.',
      prijs=14.95, van=29.92, url=P + 'wellshave-scheerkop-7d-vervanging',
      voet='18&times; besteld in de afgelopen 30 dagen'),
 dict(img='hardcase', naam='The Hard Case', kicker='Opbergen',
      wat='Harde koffer voor apparaat, koppen en kabel.',
      prijs=14.95, van=21.95, url=P + 'wellshave-hard-case'),
 dict(img='travelbag', naam='Travelbag', kicker='Opbergen',
      wat='Zachte tas voor onderweg.', prijs=8.95, van=10.95, url=P + 'travelbag'),
]

ZONE = dict(
 titel='Collectie Hoofd',
 kicker='Collectiepagina-redesign &middot; zone Hoofd',
 h1='Vier apparaten, drie verschillende klussen',
 sub='Dezelfde vijf blokken als de bodygroomerpagina, gevuld met wat er in de zone Hoofd '
     'werkelijk staat. Deze zone is de kleinste van de vier en dat verandert twee dingen: '
     'de keuzehulp stelt twee vragen in plaats van drie, omdat een derde vraag hier decoratie zou '
     'zijn, en het raster leunt zwaarder op de sets dan op de losse apparaten. '
     'Prijzen, voorraad, productstatus en beoordelingen komen uit Shopify en Loox.',

 auditkop='Wat er in deze zone niet klopt',
 auditintro='Geteld in de Admin API op de producten met de zonetag Hoofd, op 24 augustus. '
            'Elk punt hieronder is de reden dat er iets in dit ontwerp staat &mdash; of juist niet.',
 audit=[
  ('De Tondeuse Pro staat op archief, maar telt mee', 'Het apparaat heeft status <code>ARCHIVED</code> '
   'met 34 stuks voorraad en &euro;86,95 zonder vanprijs. Hij is niet te koop, dus hij staat niet in '
   'dit raster. Wie op de zone rekent met vijf apparaten, telt hem nog mee.'),
  ('De Tondeuse Deluxe is uitverkocht en ziet er niet zo uit', 'Voorraad staat op &minus;2 terwijl het '
   'product actief is. In dit ontwerp krijgt hij een grijze kaart met &ldquo;tijdelijk uitverkocht&rdquo; '
   'in plaats van een gewone koopknop; nu is er niets dat je waarschuwt.'),
  ('De Sharpline is een baardlijntrimmer met een hoofdtag', 'Zijn eigen productteksten gaan over de '
   'baardlijn, niet over je schedel. In de beoordelingen wordt hij w&eacute;l voor fades gebruikt. '
   'Hij hoort hier, maar dan als het apparaat voor de r&aacute;nd &mdash; niet als vierde tondeuse.'),
  ('Alle drie de Barber Bro&rsquo;s zijn uitverkocht', 'Barber Bro 1.0, 2.0 en 3.0 staan alle drie op '
   '&minus;2. Ze staan hier daarom niet in het raster. De Barber Packs zijn wel leverbaar en dekken '
   'dezelfde behoefte.'),
  ('Loox deelt beoordelingen tussen verwante modellen', 'Van de honderd zichtbare beoordelingen bij de '
   'Tondeuse Elegant staan er 38 ook bij de Detailtrimmer Sharpline, met de productnaam vervangen. '
   'Bij de Head Shaver Deluxe en de 4 Foil Blade Baron is dat 22. Daarom staat er hierboven '
   '&eacute;&eacute;n score met &eacute;&eacute;n bron, en geen opgetelde zonescore.'),
  ('De zonetelling wijkt af van de homepage', 'De tags geven vier apparaten in deze zone; de homepage '
   'rekent met drie. E&eacute;n telling moet winnen, anders spreken twee pagina&rsquo;s elkaar tegen.'),
 ],

 bloknotities=[
  ('Kop, keuzehulp en zonebalk',
   'Boven de vouw: de belofte, een foto van het apparaat in gebruik uit de eigen bibliotheek, de score '
   'met de bron erbij, en de keuzehulp. <b>Twee vragen, geen drie.</b> Er staan vier apparaten in deze '
   'zone en &eacute;&eacute;n daarvan is uitverkocht; een derde vraag zou alleen maar bewegen zonder de '
   'uitkomst te veranderen. De twee vragen die er staan leiden naar zes verschillende uitkomsten, '
   'allemaal op voorraad. <b>Speel met de vragen</b> &mdash; het lintje, de reden en de prijs wisselen mee.'),
  ('Het raster',
   'Drie groepen: de vier apparaten, de zes sets en de onderdelen. De sets zijn hier belangrijker dan in '
   'de andere zones, want een hoofdroutine bestaat zelden uit &eacute;&eacute;n apparaat. De kaart, de '
   'hover en het monogram komen letterlijk uit <code>assets/ws-bestsellers.css</code>. '
   '<b>De Tondeuse Deluxe staat er grijs bij</b> omdat hij op &minus;2 staat. '
   '<b>Wat werkt:</b> het filter, de vergelijker, het oogje en de plusknop bij de onderdelen &mdash; en '
   'de kaart met &ldquo;Beste match&rdquo; volgt de keuzehulp hierboven.'),
  ('Over deze categorie',
   'De uitleg die anders als SEO-tekst onderaan verdwijnt, hier semantisch: '
   '&eacute;&eacute;n <code>&lt;section&gt;</code>, een <code>h2</code> met de vraag, twee '
   '<code>h3</code>&rsquo;s, echte alinea&rsquo;s, een <code>&lt;ol&gt;</code> voor de tips en '
   'beschrijvende links naar de vier productpagina&rsquo;s. De doorsnede legt uit wat de fade-hendel doet, '
   'want dat is precies het verschil tussen een tondeuse en een tondeuse. '
   '<b>Zonder getallen die ik niet kan nakijken:</b> de hendel staat als &ldquo;kort&rdquo; en '
   '&ldquo;langer&rdquo;, niet in millimeters.'),
  ('Wat kopers schrijven',
   'Drie beoordelingen, elk aan het apparaat waar hij over gaat, met foto, link en de score van d&aacute;t '
   'apparaat. Ik heb alleen regels gekozen die inhoudelijk over d&iacute;t apparaat gaan, omdat Loox bij '
   'verwante modellen dezelfde beoordelingenstroom toont met de productnaam vervangen &mdash; dat staat '
   'ook in de bronregel boven de citaten.'),
  ('Zekerheden, vragen en de andere zones',
   'De afsluitende band: de garanties met icoon (op mobiel een schuifstrip, op desktop &eacute;&eacute;n '
   'rij van vier), vijf vragen die over d&eacute;ze apparaten gaan, en de andere zones voor wie hier '
   'verkeerd zit. <b>De vragen klappen open.</b>'),
 ],

 openvragen=[
  '<b>De Tondeuse Pro.</b> Archief met 34 stuks voorraad: uit de zone halen, of weer activeren? Zolang '
  'dat niet beslist is, klopt geen enkele telling.',
  '<b>De Tondeuse Deluxe.</b> Voorraad &minus;2 op een actief product. Bijbestellen, of tijdelijk '
  'verbergen? In dit ontwerp staat hij er grijs bij, met een eerlijke regel.',
  '<b>De zonetelling.</b> Tags zeggen 4, de homepage zegt 3. E&eacute;n getal kiezen.',
  '<b>De Barber Bro-lijn.</b> Alle drie uitverkocht. Terug, of uit de zone?',
  '<b>Gratis verzending: &euro;30 of &euro;50.</b> De balk zegt &euro;30, de SEO-tekst &euro;50. '
  'Ik heb &euro;30 aangehouden, gelijk aan de bodygroomerpagina.',
 ],

 # ── blok 1
 eyebrow='Hoofd &middot; 4 apparaten',
 h1a='Glad, kort of strak.',
 h1b='Drie klussen, drie apparaten.',
 lede='Een scheerapparaat dat de bolling van je schedel volgt, een tondeuse met een fade-hendel voor '
      'de lengte, en een smalle trimmer voor de rand. Wat je nodig hebt hangt af van welke je doet.',
 heroalt='Man scheert zijn hoofd met de Head Shaver Deluxe',
 zonescore=4.8,
 zonescoretekst='4,8/5',
 zonescorebron='Head Shaver Deluxe (351)',
 quote='Voorheen stond ik n 20 minuten met n tondeuse te scheren, nu in nog geen 8 min n strak hoofd.',
 quotebron='Bretb &middot; geverifieerde koper &middot; Head Shaver Deluxe',
 geruststellers=[(RETOUR, '100 dagen proberen'), (SCHILDV, '2 jaar garantie'), (TRUCK, 'Morgen in huis')],
 kaartkop='Jouw hoofdapparaat in 20 seconden',
 kaartsub='2 keuzes &middot; direct een match',
 kaartvraag='Wat ga je precies doen?',
 vragen=[
  dict(groep='klus', start='kaal', vraag='Wat is de klus?',
       opties=[('kaal', 'Kaal scheren'), ('kort', 'Kort knippen'), ('rand', 'Randen &amp; lijnen')]),
  dict(groep='set', start='los', vraag='E&eacute;n apparaat, of een complete set?',
       opties=[('los', 'E&eacute;n apparaat'), ('set', 'Complete set')]),
 ],
 woord={'klus': {'kaal': 'kaal scheren', 'kort': 'kort knippen', 'rand': 'randen en lijnen'},
        'set': {'los': '&eacute;&eacute;n apparaat', 'set': 'complete set'}},
 tabel=[
  {'w': {'klus': 'kaal', 'set': 'los'}, 'id': 'hs'},
  {'w': {'klus': 'kaal', 'set': 'set'}, 'id': 'skull3'},
  {'w': {'klus': 'kort', 'set': 'los'}, 'id': 'ele'},
  {'w': {'klus': 'kort', 'set': 'set'}, 'id': 'bpack3'},
  {'w': {'klus': 'rand', 'set': 'los'}, 'id': 'sharp'},
  {'w': {'klus': 'rand', 'set': 'set'}, 'id': 'bpack2'},
 ],
 standaardmatch='hs',
 matches=[
  dict(id='hs', img='headshaver', naam='Head Shaver Deluxe', badge='Meest gekozen',
       zin='Zeven roterende koppen die de bolling van je schedel volgen, ook aan de achterkant.',
       redenen=['7D-kop volgt de contouren', 'SkinSafe tegen wondjes', '7.000 rpm-motor'],
       prijs=54.95, van=64.95, url=P + 'wellshave-5-in-1-scheerapparaat-mannen-deluxe'),
  dict(id='skull3', img='skull3', naam='Skull Deal 3.0', badge='Acht onderdelen',
       zin='Dezelfde scheerkop, plus een extra magnetische kop, een tas en een hard case.',
       redenen=['Extra magnetische scheerkop', 'Tas &eacute;n harde koffer', 'Acht onderdelen in de doos'],
       prijs=69.95, van=79.95, url=P + 'skull-deal-3-0'),
  dict(id='ele', img='tonelegant', naam='Tondeuse Elegant&trade;', badge='Kapperskwaliteit',
       zin='Fades en contouren met een hendel die tussen twee opzetkammen in valt.',
       redenen=['Verstelbare fade-hendel', 'Knipt zonder trekken of haperen', 'Metalen behuizing'],
       prijs=59.95, van=92.79, url=P + 'wellshave-tondeuse-elegant'),
  dict(id='bpack3', img='bpack3', naam='Barber Pack 3.0', badge='Meest compleet',
       zin='Tondeuse, detailtrimmer, foil shaver en neustrimmer &mdash; alles voor haar, baard en fades.',
       redenen=['Elf onderdelen in de doos', 'Foil shaver voor de afwerking',
                'Ook een neustrimmer voor neus &amp; oorhaar'],
       prijs=124.95, van=134.95, url=P + 'barber-pack-3-0'),
  dict(id='sharp', img='sharpline', naam='Detailtrimmer Sharpline&trade;', badge='Voor de lijnen',
       zin='Het smalle mes komt bij de nek, de slapen en de baardlijn waar een tondeuse te breed is.',
       redenen=['Strakke lijnen in enkele bewegingen', 'Snijdt door dik en stug haar',
                'Drie opzetstukken voor kort tot langer'],
       prijs=49.95, van=85.65, url=P + 'detailtrimmer-sharpline%E2%84%A2'),
  dict(id='bpack2', img='bpack2', naam='Barber Pack 2.0', badge='Tien onderdelen',
       zin='Tondeuse, detailtrimmer en foil shaver: de lengte, de lijn en de gladde afwerking.',
       redenen=['Tondeuse voor fades, haar en baard', 'Foil shaver voor de gladde afwerking',
                'Tien onderdelen in de doos'],
       prijs=114.95, van=124.95, url=P + 'barber-pack-2-0'),
 ],
 zonenaam='Hoofd',
 aantal='4',
 zoneslot='plus zes sets en de onderdelen die je later vervangt.',
 tellingen=[('Lichaam &amp; schaamstreek', '4', '#'), ('Gezicht &amp; baard', '11', '#'),
            ('Hoofd', '4', '#'), ('Neus &amp; oren', '8', '#')],

 # ── blok 2
 filters=[('alles', 'Alles', 13), ('app', 'Apparaten', 4), ('bundel', 'Sets', 6), ('mes', 'Onderdelen', 3)],
 startregel='kaal scheren &middot; &eacute;&eacute;n apparaat',
 totaal=13,
 groepen=[
  dict(cat='app', soort='app', kop='Vind jouw hoofdapparaat',
       sub='Vier apparaten, drie verschillende klussen.', vergelijk=True, items=APP,
       na=vergelijker(APP)),
  dict(cat='bundel', soort='bundel', kop='Of pak het in &eacute;&eacute;n keer compleet',
       sub='Een hoofdroutine bestaat zelden uit &eacute;&eacute;n apparaat.', items=SETS),
  dict(cat='mes', soort='mes', kop='Blijf scherp',
       sub='Vervang alleen wat slijt &mdash; niet het hele apparaat.', items=ONDERHOUD),
 ],
 aanbod=dict(id='bpack3', img='bpack3', naam='Barber Pack 3.0', eyebrow='De ruimste set in deze zone',
             zin='Elf onderdelen voor haar, baard, fades en de afwerking &mdash; samen goedkoper dan los.',
             prijs=124.95, van=134.95, url=P + 'barber-pack-3-0', knop='Bekijk de set'),

 # ── blok 3
 categorie=dict(
  h2a='Scheren, knippen of bijwerken:',
  h2b='wat heb je voor je hoofd nodig?',
  alineas=[
   'Je hoofd is geen gezicht. De huid ligt strak over het bot, de vorm is bol in twee richtingen '
   'tegelijk en het grootste deel ervan zie je niet terwijl je bezig bent. Een apparaat dat op je '
   'kaaklijn prima werkt, hobbelt daardoor over je schedel en laat plekken staan die je pas voelt '
   'als je erover wrijft.',
   'Daarom bestaat deze zone uit drie soorten apparaten. Een <b>hoofdscheerapparaat</b> heeft meerdere '
   'roterende koppen die onafhankelijk kantelen, zodat ze de bolling volgen zonder dat jij de hoek hoeft '
   'te zoeken. Een <b>tondeuse</b> laat juist lengte staan en heeft een verstelbare hendel waarmee je '
   'die lengte fijner regelt dan met de opzetkammen alleen. Een <b>detailtrimmer</b> heeft een smal mes '
   'dat bij de nek, de slapen en de baardlijn komt, waar een tondeuse te breed is.',
  ],
  h3lijst='De apparaten in deze zone naast elkaar',
  lijst=[
   ('Head Shaver Deluxe', P + 'wellshave-5-in-1-scheerapparaat-mannen-deluxe',
    'Zeven roterende koppen voor een volledig glad hoofd, ook aan de achterkant.'),
   ('Tondeuse Elegant&trade;', P + 'wellshave-tondeuse-elegant',
    'Voor wie lengte wil houden: fades en contouren met een verstelbare hendel.'),
   ('Detailtrimmer Sharpline&trade;', P + 'detailtrimmer-sharpline%E2%84%A2',
    'Het smalle mes voor de rand: nek, oren, slapen en de baardlijn.'),
   ('Tondeuse Deluxe&trade;', P + 'wellshave-tondeuse-mannen-deluxe',
    'Dezelfde hendel met een brushless motor &mdash; op dit moment uitverkocht.'),
  ],
  slotalinea='De scheerkoppen slijten sneller dan de rest van het apparaat. De '
             '<a href="' + P + 'wellshave-scheerkop-7d-vervanging">7D-scheerkop is los verkrijgbaar</a>, '
             'net als de <a href="' + W + '/collections/accesoires">koffers en tassen</a>. Merk je dat de '
             'kop trekt of minder pakt, dan hoef je geen nieuw apparaat te kopen.',
  svg=SVG_FADE,
  bijschrift='Drie stukken, drie apparaten: de tondeuse bepaalt de lengte bovenop, de fade-hendel maakt '
             'de overgang op de zijkant, en de detailtrimmer zet de rand langs nek en oren.',
  h3tips='Hoe scheer of knip je je eigen hoofd?',
  tips=[
   ('Werk in banen, niet in rondjes', 'Leg de kop plat neer en trek rustige, overlappende banen van '
    'voor naar achter. Rondjes draaien voelt sneller, maar laat plekken staan.'),
   ('Doe de achterkant op gevoel', 'Je ziet hem toch niet. Ga met je vrije hand mee en voel waar het '
    'nog stroef aanvoelt; dat is waar nog haar staat.'),
   ('Zet de rand als laatste', 'Eerst de lengte over het hele hoofd, dan pas de nek- en oorlijn met de '
    'detailtrimmer. Andersom moet je de rand twee keer zetten.'),
  ],
 ),

 # ── blok 4
 bewijskop='Drie dingen die je je afvraagt voordat je je eigen hoofd doet.',
 bewijsbron='Elke regel is een echte beoordeling bij het apparaat dat ernaast staat, geschreven door een '
            'geverifieerde koper. <b>Let op bij het lezen:</b> Loox toont bij verwante modellen dezelfde '
            'beoordelingenstroom met de productnaam vervangen, dus ik heb alleen regels gekozen die '
            'inhoudelijk over d&iacute;t apparaat gaan.',
 bewijs=[
  dict(img='headshaver', tag='Over hoe lang het duurt',
       tekst='Vele uitvoeringen gezien, gekozen voor deze. N fijne machine die goed zijn taken verricht. '
             'Voorheen stond ik n 20 minuten met n tondeuse te scheren, nu in nog geen 8 min n strak hoofd.',
       naam='Bretb', product='Head Shaver Deluxe',
       url=P + 'wellshave-5-in-1-scheerapparaat-mannen-deluxe', score=4.8, aantal=351),
  dict(img='tonelegant', tag='Over dik haar',
       tekst='Nog nooit een tondeuse gehad die zo goed werkte als deze. Zeer mooie afwerking van de haren '
             'en geen haperingen door dik haar. Zeer tevreden.',
       naam='Roosnmgn', product='Tondeuse Elegant&trade;',
       url=P + 'wellshave-tondeuse-elegant', score=4.8, aantal=260),
  dict(img='sharpline', tag='Over de fade',
       tekst='Super makkelijk te gebruiken en de trimmer voelt stevig aan. Het fijne vind ik vooral de '
             'verschillende standen wat resulteert in een strakke fade.',
       naam='MikaStas93', product='Detailtrimmer Sharpline&trade;',
       url=P + 'detailtrimmer-sharpline%E2%84%A2', score=4.7, aantal=139),
 ],

 # ── blok 5
 zekerheden=[
  (RETOUR, '100 dagen thuis proberen', 'Niet goed? Je krijgt je geld terug.'),
  (SCHILDV, '2 jaar garantie', 'Op elk apparaat in deze zone.'),
  (TRUCK, 'Gratis verzending vanaf &euro;30', 'Naar Belgi&euml; gratis vanaf &euro;49,95.'),
  (KLOK, 'Morgen in huis', 'Besteld voor 23:59.'),
 ],
 faqkop='Vragen over deze zone',
 faqh2a='Alles wat je',
 faqh2b='wilt weten.',
 faq=[
  ('Scheerapparaat of tondeuse &mdash; wat moet ik hebben?',
   'Wil je <b>glad</b>, dan is dat de <b>Head Shaver Deluxe</b>: zeven roterende koppen die de bolling '
   'volgen. Wil je <b>lengte houden</b>, dan is dat de <b>Tondeuse Elegant</b> met de fade-hendel. '
   'Wil je alleen de <b>rand</b> bijwerken, dan is dat de <b>Detailtrimmer Sharpline</b>. '
   'Bovenaan staat een keuzehulp die het in twee vragen voor je doet.'),
  ('Kan ik de achterkant zelf doen?',
   'Dat is precies waarvoor het hoofdscheerapparaat een ronde vorm en zeven kantelende koppen heeft: '
   'je hoeft de hoek niet te zoeken. In de beoordelingen komt dat terug &mdash; &ldquo;kan nu zijn hoofd '
   'zelf bijhouden, zonder al te veel moeite&rdquo;. Werk in banen en voel met je vrije hand na waar het '
   'nog stroef is.'),
  ('Wat doet die fade-hendel precies?',
   'Hij schuift het bovenmes een klein stukje over het ondermes. Daardoor knipt de tondeuse '
   'korter of langer dan de opzetkam die erop zit, en kun je de overgang tussen twee lengtes vloeiend '
   'maken. Dat is het verschil tussen een rand en een echte fade.'),
  ('Hoe vaak moet ik de scheerkop vervangen?',
   'Merk je dat hij trekt of minder pakt, dan is het zover. <b>De 7D-scheerkop ligt apart op voorraad '
   'vanaf &euro;14,95</b> &mdash; hij ging de afgelopen dertig dagen achttien keer over de toonbank, dus '
   'een bot mes kost je geen nieuw apparaat.'),
  ('Wat als het me toch niet bevalt?',
   'Je hebt 100 dagen om het thuis te proberen, zonder reden op te geven. Je meldt de retour aan en hebt '
   'daarna veertien dagen om te versturen; <b>de verzendkosten van de retour zijn voor jou</b>, het '
   'aankoopbedrag krijg je binnen veertien dagen terug.'),
 ],
 anderezones=[
  ('Lichaam &amp; schaamstreek', 'Trimmen zonder wondjes.', '4 apparaten &rarr;', '#'),
  ('Gezicht &amp; baard', 'Scheren, trimmen en randen zetten.', '11 apparaten &rarr;', '#'),
  ('Neus &amp; oren', 'Detailwerk zonder trekken.', '8 apparaten &rarr;', '#'),
  ('Alles bij elkaar', 'De hele collectie, per zone gesorteerd.', 'Bekijk alles &rarr;', W + '/collections/all'),
 ],
)
