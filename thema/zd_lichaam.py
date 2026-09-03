# -*- coding: utf-8 -*-
from zg_engine import W, RETOUR, SCHILDV, TRUCK, KLOK, vergelijker

P = W + '/products/'
C = W + '/collections/'
SVG_LICHAAM = open('svg_lichaam.txt', encoding='utf-8').read()

APP = [
 dict(id='pro', img='ggpro_los', naam='Groom Guard&trade; PRO', tag='Ook glad afwerken',
      wat='Trimmen &eacute;n glad afwerken in dezelfde routine.',
      score=4.6, aantal=442, chips=['Foil-kop', '6.600 rpm'], prijs=59.95, van=85.65,
      url=P + 'groom-guard-pro',
      redenen=['SkinSafe&trade; keramische kop', 'Foil-kop voor de gladde finish',
               'Waterdicht &mdash; IPX7'],
      vgl=[('Waarvoor gemaakt', 'Trimmen en daarna glad afwerken, in dezelfde beurt.'),
           ('Wat hij extra kan', 'De foil-kop die de gewone Groom Guard niet heeft.'),
           ('Wat hij niet doet', 'Geen neusopzetstuk in de doos.')]),
 dict(id='gg', img='gg_los', naam='Groom Guard&trade;', tag='37&times; deze maand',
      wat='De basis voor lichaam en schaamstreek, met licht waar je kijkt.',
      score=4.9, aantal=192, chips=['SkinSafe&trade;', 'LED-licht'], prijs=44.95, van=71.35,
      url=P + 'wellshave-bodygroomer-groom-guard',
      redenen=['SkinSafe&trade; keramische kop', 'LED-licht waar je kijkt',
               'Opzetkammen voor de lengte'],
      vgl=[('Waarvoor gemaakt', 'De basis voor lichaam en schaamstreek.'),
           ('Wat hij extra kan', 'LED-licht dat bijschijnt waar je kijkt, met opzetkammen.'),
           ('Wat hij niet doet', 'Alleen trimmen &mdash; geen neustrimmer, geen foil-kop.')]),
 dict(id='flex', img='flex_los', naam='Flex Guard&trade; 3-in-1', tag='Meest veelzijdig',
      wat='Bodytrimmer, neustrimmer en foil-kop in &eacute;&eacute;n.',
      score=4.6, aantal=551, chips=['3-in-1', '6 in de doos'], prijs=54.95, van=85.65,
      url=P + 'wellshave-flex-guard%E2%84%A2',
      redenen=['Drie opzetstukken in &eacute;&eacute;n', '7.000 toeren, LED-display',
               'Waterdicht &mdash; IPX7'],
      vgl=[('Waarvoor gemaakt', 'Alles in &eacute;&eacute;n: trimmen, neushaar en glad afwerken.'),
           ('Wat hij extra kan', 'Als enige alle drie de koppen in dezelfde doos.'),
           ('Wat hij niet doet', 'Geen los oplaadstation.')]),
 dict(id='dual', img='dual_los', naam='Dual Groomer&trade; 2-in-1', tag='Laagste prijs',
      wat='Lichaam en neushaar in &eacute;&eacute;n apparaat, in twee snelheden.',
      score=4.9, aantal=145, chips=['2-in-1', '2 snelheden'], prijs=39.95, van=79.92,
      url=P + 'wellshave-2-in-1-bodygroomer-mannen',
      redenen=['SkinSafe&trade; mes', 'Neusopzetstuk meegeleverd', 'Twee snelheden'],
      vgl=[('Waarvoor gemaakt', 'Lichaam en neushaar met &eacute;&eacute;n apparaat.'),
           ('Wat hij extra kan', 'Twee snelheden en een neustrimmer-opzetstuk.'),
           ('Wat hij niet doet', 'Geen foil-kop &mdash; glad afwerken gaat hier niet mee.')]),
]

BUNDELS = [
 dict(id='spult', img='spult_los', naam='Shave Package Ultimate&trade;', tag='Meest compleet', doos=8,
      prijs=89.95, van=142.80, url=P + 'shave-package-ultimate',
      wat='Lichaam, neus en detailwerk in &eacute;&eacute;n doos.'),
 dict(img='flexbundel_los', naam='Flex-line Bundel', tag='Grootste voordeel', doos=9,
      prijs=89.95, van=156.60, url=P + 'body-beard-kit',
      wat='Flex Guard met foilkop, neushaaropzetstuk en de Sharpline-detailtrimmer.'),
 dict(img='essflex', naam='Essential Flex Bundel', tag='Bundel', doos=8,
      prijs=79.95, van=133.25, url=P + 'essential-flex-bundel',
      wat='Flex Guard met foilkop, extra Skin-Safe mes, toilettas en hard case.'),
 dict(id='sp30', img='sp30_los', naam='Shave Package 3.0', tag='Bundel', doos=9,
      prijs=64.95, van=99.95, url=P + 'wellshave-shave-package-3-0',
      wat='Alles voor een gladde verzorging van top tot teen.'),
 dict(img='bnbundel_los', naam='Body &amp; Nose Bundel', tag='Bundel', doos=7,
      prijs=59.95, van=85.65, url=P + 'wellshave-shave-package-2-0',
      wat='Complete verzorging voor lichaam en neus.'),
]

ONDERDELEN = [
 dict(img='blade_los', naam='Groom Guard&trade; Blade', kicker='Mes',
      wat='Voor Groom Guard&trade; en Groom Guard&trade; PRO.', prijs=14.95, van=29.92,
      url=P + 'vervanging-bodygroomer-mes', voet='31&times; besteld in de afgelopen 30 dagen'),
 dict(img='trio_los', naam='Groom Guard&trade; Blade &mdash; Trio Pack', kicker='Mes',
      wat='Drie messen, voor twee jaar vooruit.', prijs=24.95, van=44.95,
      url=P + 'trio-pack-groom-guard'),
 dict(img='flexblade_los', naam='Flex Guard&trade; Blade', kicker='Mes',
      wat='Vervangmes voor de Flex Guard&trade; 3-in-1.', prijs=14.95, van=29.92,
      url=P + 'flex-guard-blade-vervanging'),
 dict(img='flextrio', naam='Flex Guard&trade; Blade &mdash; Trio Pack', kicker='Mes',
      wat='Drie vervangmessen voor de Flex Guard&trade;.', prijs=24.95, van=44.95,
      url=P + 'trio-pack'),
 dict(img='foil_los', naam='Foil shaver Groom Guard', kicker='Scheerkop',
      wat='Foil-opzetkop voor de Groom Guard&trade;-lijn.', prijs=14.95, van=21.58,
      url=P + 'foil-shaver-groom-guard'),
]

ZONE = dict(
 titel='Collectie Lichaam &amp; schaamstreek',
 kicker='Collectiepagina-redesign &middot; zone Lichaam &amp; schaamstreek',
 h1='Vier bodygroomers, en het verschil ertussen',
 sub='De zone waar dit project mee begon, nu uit dezelfde generator als de andere vier.',
 auditkop='Wat er in deze zone niet klopt', auditintro='',
 audit=[], bloknotities=[], openvragen=[],

 eyebrow='Lichaam &amp; schaamstreek &middot; 4 apparaten',
 h1a='Trim waar het spannend wordt.',
 h1b='Zonder wondjes.',
 lede='Van snel bijwerken tot volledig glad: vier waterdichte bodygroomers met een '
      'SkinSafe&trade; keramische kop die het haar pakt, niet je huid.',
 heroalt='Groom Guard in gebruik op het lichaam',
 zonescore=4.6,
 zonescoretekst='4,6/5',
 zonescorebron='Groom Guard&trade; PRO (442)',
 quote='Was een beetje bunzig om mijn zak te scheren, maar met deze groomer is dat appeltje eitje. '
       'Geen wondjes en een glad resultaat. En dat voor de eerste keer.',
 quotebron='Makketakker &middot; geverifieerde koper &middot; Groom Guard&trade; PRO',
 geruststellers=[(RETOUR, '100 dagen proberen'), (SCHILDV, '2 jaar garantie'), (TRUCK, 'Morgen in huis')],
 kaartkop='Jouw bodygroomer in 20 seconden',
 kaartsub='2 keuzes &middot; direct een match',
 kaartvraag='Wat past bij jouw routine?',
 vragen=[
  dict(groep='glad', start='ja', vraag='Hoe wil je afwerken?',
       opties=[('nee', 'Alleen trimmen'), ('ja', 'Ook volledig glad')]),
  dict(groep='neus', start='nee', vraag='Ook neushaar met hetzelfde apparaat?',
       opties=[('nee', 'Niet nodig'), ('ja', 'Ja, graag')]),
 ],
 woord={'glad': {'ja': 'glad afwerken', 'nee': 'alleen trimmen'},
        'neus': {'ja': 'ook neushaar', 'nee': 'geen extra detail'}},
 tabel=[
  {'w': {'glad': 'ja', 'neus': 'ja'}, 'id': 'flex'},
  {'w': {'glad': 'ja', 'neus': 'nee'}, 'id': 'pro'},
  {'w': {'glad': 'nee', 'neus': 'ja'}, 'id': 'dual'},
  {'w': {'glad': 'nee', 'neus': 'nee'}, 'id': 'gg'},
 ],
 standaardmatch='pro',
 matches=[
  dict(id='pro', img='ggpro_los', naam='Groom Guard&trade; PRO', badge='Meest gekozen',
       zin='Voor lichaam &eacute;n schaamstreek, met foil-kop voor een gladde afwerking.',
       redenen=['SkinSafe&trade; keramische kop', 'Waterdicht &mdash; IPX7',
                'Trimmen &eacute;n glad afwerken'],
       prijs=59.95, van=85.65, url=P + 'groom-guard-pro'),
  dict(id='gg', img='gg_los', naam='Groom Guard&trade;', badge='37&times; besteld in 30 dagen',
       zin='De basis voor lichaam en schaamstreek, met licht op de plek waar je kijkt.',
       redenen=['SkinSafe&trade; keramische kop', 'LED-licht waar je kijkt',
                'Opzetkammen voor de lengte'],
       prijs=44.95, van=71.35, url=P + 'wellshave-bodygroomer-groom-guard'),
  dict(id='flex', img='flex_los', naam='Flex Guard&trade; 3-in-1', badge='Meest veelzijdig',
       zin='Trimmen, neushaar en glad afwerken met &eacute;&eacute;n apparaat &mdash; ook in de koffer.',
       redenen=['Drie opzetstukken in &eacute;&eacute;n', '7.000 toeren, LED-display',
                'Waterdicht &mdash; IPX7'],
       prijs=54.95, van=85.65, url=P + 'wellshave-flex-guard%E2%84%A2'),
  dict(id='dual', img='dual_los', naam='Dual Groomer&trade; 2-in-1', badge='Laagste prijs',
       zin='Lichaam en neushaar in &eacute;&eacute;n apparaat, in twee snelheden.',
       redenen=['SkinSafe&trade; mes', 'Neusopzetstuk meegeleverd', 'Twee snelheden'],
       prijs=39.95, van=79.92, url=P + 'wellshave-2-in-1-bodygroomer-mannen'),
 ],
 zonenaam='Lichaam &amp; schaamstreek',
 aantal='4',
 zoneslot='apparaten, plus de bundels en de messen die je later vervangt.',
 tellingen=[('Lichaam &amp; schaamstreek', '4', C + 'bodygroomers'),
            ('Gezicht &amp; baard', '11', C + 'zone-gezicht'),
            ('Hoofd', '4', C + 'zone-hoofd'),
            ('Neus &amp; oren', '8', C + 'neustrimmers')],

 filters=[('alles', 'Alles', 14), ('app', 'Apparaten', 4), ('bundel', 'Bundels', 5),
          ('mes', 'Onderdelen', 5)],
 startregel='glad afwerken &middot; geen extra detail',
 totaal=14,
 groepen=[
  dict(cat='app', soort='app', kop='Vind jouw bodygroomer',
       sub='Vier apparaten, ieder voor een andere routine.', vergelijk=True,
       items=APP, na=vergelijker(APP)),
  dict(cat='bundel', soort='bundel', kop='Maak je routine compleet',
       sub='Voordeliger samengesteld; geen losse onderdelen zoeken.', items=BUNDELS),
  dict(cat='mes', soort='mes', kop='Blijf scherp',
       sub='Vervang alleen wat slijt &mdash; niet het hele apparaat.', items=ONDERDELEN),
 ],
 aanbod=dict(img='spult_los', naam='Shave Package Ultimate&trade;', eyebrow='Alles in &eacute;&eacute;n set',
             zin='Acht onderdelen voor lichaam, neus en detailwerk &mdash; samen goedkoper dan los.',
             prijs=89.95, van=142.80, url=P + 'shave-package-ultimate', knop='Bekijk de set'),

 categorie=dict(
  h2a='Welke bodygroomer past bij',
  h2b='jouw lichaam en schaamstreek?',
  alineas=[
   'Een bodygroomer is een trimmer die speciaal is gemaakt voor lichaamshaar. Waar een baardtrimmer '
   'vooral is ontworpen voor stevige gezichtsharen en een vlakke huid, moet een bodygroomer veilig '
   'kunnen bewegen over je borst, oksels, buik, rug en schaamstreek. Op die plekken is de huid zachter, '
   'beweeglijker en gevoeliger voor trekken, irritatie en sneetjes.',
   'De vier Wellshave-bodygroomers gebruiken daarom een <b>SkinSafe&trade; keramische kop</b>. De '
   'afgeronde kam rust op de huid en leidt de haren naar het bewegende mes. Het snijvlak blijft achter '
   'de kam, waardoor het niet rechtstreeks over de huid schuurt. Dat helpt de kans op sneetjes en een '
   'trekkend gevoel tijdens het trimmen te verkleinen.',
  ],
  h3lijst='De vier bodygroomers vergeleken',
  lijst=[
   ('Groom Guard&trade;', P + 'wellshave-bodygroomer-groom-guard',
    'De toegankelijke keuze voor het regelmatig trimmen van lichaam en schaamstreek.'),
   ('Groom Guard&trade; PRO', P + 'groom-guard-pro',
    'Voegt een foil-kop toe, waarmee je na het trimmen bepaalde plekken gladder afwerkt.'),
   ('Dual Groomer&trade; 2-in-1', P + 'wellshave-2-in-1-bodygroomer-mannen',
    'Combineert lichaamshaar en neus- en detailhaar in &eacute;&eacute;n compact apparaat.'),
   ('Flex Guard&trade; 3-in-1', P + 'wellshave-flex-guard%E2%84%A2',
    'De uitgebreidste keuze, met koppen voor trimmen, glad afwerken en detailwerk.'),
  ],
  slotalinea='Alle modellen zijn waterproof en kunnen onder de douche worden gebruikt en afgespoeld. '
             'De <a href="' + C + 'accesoires">messen en opzetkoppen</a> zijn los verkrijgbaar. Daardoor '
             'hoef je bij een bot of versleten mes niet direct een compleet nieuw apparaat te kopen.',
  svg=SVG_LICHAAM,
  bijschrift='De kam maakt contact met de huid en leidt het haar naar het mes; het snijvlak blijft '
             'erachter en raakt de huid niet.',
  h3tips='Hoe gebruik je een bodygroomer veilig?',
  tips=[
   ('Trek losse huid voorzichtig strak', 'Zo kan de kam gelijkmatiger over het oppervlak bewegen.'),
   ('Houd de kop vlak op de huid', 'Te schuin of te hard drukken zorgt niet voor een gladder resultaat.'),
   ('Begin met de haargroei mee', 'Wil je daarna korter of gladder afwerken, beweeg dan rustig en zonder '
    'extra druk tegen de groeirichting in.'),
  ],
 ),

 bewijskop='Drie bezwaren, beantwoord door iemand die hier al doorheen is.',
 bewijsbron='Elke regel is een echte beoordeling bij het apparaat dat ernaast staat, geschreven door een '
            'geverifieerde koper. De score erachter is die van d&aacute;t apparaat.',
 bewijs=[
  dict(img='ggpro_los', tag='Over de eerste keer',
       tekst='Was een beetje bunzig om mijn zak te scheren, maar met deze groomer is dat appeltje '
             'eitje. Geen wondjes en een glad resultaat. En dat voor de eerste keer.',
       naam='Makketakker', product='Groom Guard&trade; PRO', url=P + 'groom-guard-pro',
       score=4.6, aantal=442),
  dict(img='gg_los', tag='Over de gevoelige plek',
       tekst='Scheert pijnloos, ook in gevoelige zones. Mooi design, ligt goed in de hand en maakt '
             'weinig geluid. Aanrader.',
       naam='boomereros74', product='Groom Guard&trade;',
       url=P + 'wellshave-bodygroomer-groom-guard', score=4.9, aantal=192),
  dict(img='blade_los', tag='Over wat het over twee jaar kost',
       tekst='Het skinsafe snijmesje heeft zijn beste tijd gehad. Dit onderdeel blijkt los leverbaar '
             'bij Wellshave. Een mooie meevaller, want ik rekende al op de aanschaf van een nieuwe '
             'bodygroomer.',
       naam='Kick1921', product='Groom Guard&trade; Blade', url=P + 'vervanging-bodygroomer-mes',
       bijschrift='los verkrijgbaar'),
 ],

 zekerheden=[
  (RETOUR, '100 dagen thuis proberen', 'Niet goed? Je krijgt je geld terug.'),
  (SCHILDV, '2 jaar garantie', 'Op elk apparaat in deze zone.'),
  (TRUCK, 'Gratis verzending vanaf &euro;30', 'Naar Belgi&euml; gratis vanaf &euro;49,95.'),
  (KLOK, 'Morgen in huis', 'Besteld voor 23:59.'),
 ],
 faqkop='Vragen over deze vier',
 faqh2a='Alles wat je',
 faqh2b='wilt weten.',
 faq=[
  ('Welke van de vier moet ik hebben?',
   'Wil je alleen trimmen, dan is de <b>Groom Guard</b> genoeg. Wil je daarna glad afwerken, dan neem '
   'je de <b>Groom Guard PRO</b> met foil-kop. Wil je je neushaar in hetzelfde apparaat, dan is dat de '
   '<b>Dual Groomer</b>, of de <b>Flex Guard</b> als je alle drie de opzetstukken wilt. Bovenaan staat '
   'een keuzehulp die het in twee vragen voor je doet.'),
  ('Kan ik hem in de schaamstreek gebruiken?',
   'Daar zijn ze voor gemaakt. Het keramische mes zit achter een kam, zodat het je huid niet raakt. '
   'Houd het mes vlak en je huid strak; dat is in de beoordelingen het verschil tussen '
   '&ldquo;appeltje eitje&rdquo; en voorzichtig aandoen.'),
  ('Hoe vaak moet ik het mes vervangen?',
   'Bij dagelijks gebruik gaat een kop zes tot twaalf maanden mee. Merk je dat hij trekt of minder pakt, '
   'dan is het zover. <b>De koppen liggen apart op voorraad vanaf &euro;14,95</b>, dus een bot mes kost '
   'je geen nieuw apparaat.'),
  ('Wat zit er in de doos?',
   'Het apparaat, opzetkammen voor de lengte, een reinigingsborstel en een USB-C-kabel. Wat er per model '
   'precies bij zit verschilt &mdash; dat staat op de productpagina, bij de bundels inclusief het '
   'oplaadstation en de extra messen.'),
  ('Wat als het me toch niet bevalt?',
   'Je hebt 100 dagen om hem thuis te proberen, zonder reden op te geven. Je meldt de retour aan en hebt '
   'daarna veertien dagen om te versturen; <b>de verzendkosten van de retour zijn voor jou</b>, het '
   'aankoopbedrag krijg je binnen veertien dagen terug.'),
 ],
 anderezones=[
  ('Gezicht &amp; baard', 'Scheren, trimmen en randen zetten.', '11 apparaten &rarr;', C + 'zone-gezicht'),
  ('Hoofd', 'Tondeuses en hoofdscheerders.', '4 apparaten &rarr;', C + 'zone-hoofd'),
  ('Neus &amp; oren', 'Detailwerk zonder trekken.', '8 apparaten &rarr;', C + 'neustrimmers'),
  ('Alles bij elkaar', 'De hele collectie, per zone gesorteerd.', 'Bekijk alles &rarr;', C + 'all'),
 ],
)
