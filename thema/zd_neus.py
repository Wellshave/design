# -*- coding: utf-8 -*-
from zg_engine import W, RETOUR, SCHILDV, TRUCK, KLOK, vergelijker

P = W + '/products/'
SVG_NEUS = open('svg_neus.txt', encoding='utf-8').read()

NIEUW = [
 dict(id='ultra', img='nsultra', naam='Neustrimmer 4in1 Ultra&trade;', tag='Best verkocht',
      wat='Neus, oren, wenkbrauwen, kort scheren &eacute;n de baardlijn.',
      chips=['4 opzetstukken', '6 in de doos'], prijs=32.95, van=36.95,
      url=P + 'neustrimmer-4in1-ultra',
      redenen=['Neus- en oorhaar zonder trekken', 'SkinGuard tegen wondjes en irritatie',
               'Baardtrimmer-opzetstuk erbij'],
      vgl=[('Waarvoor gemaakt', 'De hele detailroutine met &eacute;&eacute;n apparaat.'),
           ('Wat hij extra kan', 'Als enige van de nieuwe lijn een baardtrimmer-opzetstuk.'),
           ('Wat hij niet doet', 'Geen bodygroomer-opzetstuk &mdash; dat zit op de Ultimate.')]),
 dict(id='plat', img='nsplatinum', naam='Neustrimmer 3in1 Platinum&trade;', tag='Nieuwe lijn',
      wat='Plus een shaver-opzetstuk voor kort haar.',
      chips=['3 opzetstukken', '5 in de doos'], prijs=29.95, van=32.95,
      url=P + 'neustrimmer-3in1-platinum',
      redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen en lijntjes',
               'Shaver-opzetstuk voor kort haar'],
      vgl=[('Waarvoor gemaakt', 'Detailwerk plus glad scheren van kleine vlakken.'),
           ('Wat hij extra kan', 'Het shaver-opzetstuk dat de Elite niet heeft.'),
           ('Wat hij niet doet', 'Geen baardtrimmer-opzetstuk.')]),
 dict(id='elite', img='nselite', naam='Neustrimmer 2in1 Elite&trade;', tag='Nieuwe lijn',
      wat='Plus een detailtrimmer voor wenkbrauwen en lijntjes.',
      chips=['2 opzetstukken', '4 in de doos'], prijs=23.95, van=29.95,
      url=P + 'neustrimmer-2in1-elite',
      redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen',
               'USB-C, compact genoeg voor de toilettas'],
      vgl=[('Waarvoor gemaakt', 'Neus, oren en de wenkbrauwen.'),
           ('Wat hij extra kan', 'Het detailopzetstuk voor strakke lijntjes.'),
           ('Wat hij niet doet', 'Scheert niet, en doet je baard niet.')]),
 dict(id='ess', img='nsessential', naam='Neustrimmer Essential&trade;', tag='Instap, nieuwe lijn',
      wat='Alleen neus en oren, zonder extra opzetstukken.',
      chips=['1 opzetstuk', '3 in de doos'], prijs=19.95, van=23.95,
      url=P + 'neustrimmer-essential',
      redenen=['Neus- en oorhaar zonder trekken', 'E&eacute;n knop, verder niets te bedenken',
               'USB-C oplaadbaar'],
      vgl=[('Waarvoor gemaakt', 'Precies &eacute;&eacute;n ding: neus- en oorhaar.'),
           ('Wat hij extra kan', 'Niets &mdash; en dat is hier het punt.'),
           ('Wat hij niet doet', 'Geen wenkbrauwen, geen scheren, geen baard.')]),
]

OUD = [
 dict(id='ultimate', img='nsultimate', naam='Neustrimmer Ultimate&trade; 4-in-1', tag='Grootste voordeel',
      wat='Neus, wenkbrauwen, kort scheren &eacute;n lichaamshaar.',
      chips=['4 opzetstukken', '6 in de doos'], prijs=29.95, van=50.00,
      url=P + 'wellshave-4-in-1-neustrimmer-ultimate',
      redenen=['Neus- en oorhaar zonder trekken', 'SkinGuard tegen wondjes en irritatie',
               'Bodygroomer-opzetstuk erbij'],
      vgl=[('Waarvoor gemaakt', 'Detailwerk plus lichaamshaar met &eacute;&eacute;n apparaat.'),
           ('Wat hij extra kan', 'Als enige een bodygroomer-opzetstuk.'),
           ('Wat hij niet doet', 'Geen baardtrimmer-opzetstuk &mdash; dat zit op de Ultra.')]),
 dict(id='adv', img='nsadvance', naam='Neustrimmer Advance&trade; 3-in-1', tag='Vertrouwde lijn',
      wat='Neustrimmer, detailtrimmer en shaver in &eacute;&eacute;n.',
      chips=['3 opzetstukken', '5 in de doos'], prijs=24.95, van=48.25,
      url=P + 'wellshave-3-in-1-neustrimmer-advance',
      redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen',
               'Shaver-opzetstuk voor kort haar'],
      vgl=[('Waarvoor gemaakt', 'Detailwerk plus glad scheren van kleine vlakken.'),
           ('Wat hij extra kan', 'Hetzelfde als de Platinum, voor vijf euro minder.'),
           ('Wat hij niet doet', 'Geen bodygroomer-opzetstuk.')]),
 dict(id='prem', img='nspremium', naam='Neustrimmer Premium&trade; 2-in-1', tag='Vertrouwde lijn',
      wat='Neustrimmer met detailtrimmer voor wenkbrauwen.',
      chips=['2 opzetstukken', '4 in de doos'], prijs=19.95, van=35.65,
      url=P + 'wellshave-2-in-1-neustrimmer-premium',
      redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen',
               'USB oplaadbaar'],
      vgl=[('Waarvoor gemaakt', 'Neus, oren en de wenkbrauwen.'),
           ('Wat hij extra kan', 'Hetzelfde als de Elite, voor vier euro minder.'),
           ('Wat hij niet doet', 'Scheert niet, en doet je baard niet.')]),
 dict(id='basic', img='nsbasic', naam='Neustrimmer Basic&trade;', tag='Laagste prijs',
      wat='Alleen neus en oren, en verder niets.',
      chips=['1 opzetstuk', '3 in de doos'], prijs=16.95, van=29.92,
      url=P + 'wellshave-neustrimmer-basic',
      redenen=['Neus- en oorhaar zonder trekken', 'E&eacute;n druk op de knop', 'USB-C oplaadbaar'],
      vgl=[('Waarvoor gemaakt', 'Precies &eacute;&eacute;n ding, voor de laagste prijs in de collectie.'),
           ('Wat hij extra kan', 'Niets.'),
           ('Wat hij niet doet', 'Geen wenkbrauwen, geen scheren, geen baard.')]),
]

BUNDELS = [
 dict(img='sp30_los', naam='Shave Package 3.0', tag='Bundel', doos=9, prijs=64.95, van=99.95,
      url=P + 'wellshave-shave-package-3-0',
      wat='Neustrimmer met alle vier de opzetstukken, plus verzorging.'),
 dict(img='bnbundel_los', naam='Body &amp; Nose Bundel', tag='Bundel', doos=7, prijs=59.95, van=85.65,
      url=P + 'wellshave-shave-package-2-0',
      wat='De neustrimmer samen met een bodygroomer.'),
]

ZONE = dict(
 titel='Collectie Neus &amp; oren',
 kicker='Collectiepagina-redesign &middot; zone Neus &amp; oren',
 h1='Acht modellen, twee lijnen, &eacute;&eacute;n ladder',
 sub='Dezelfde vijf blokken als de bodygroomerpagina, gevuld met wat er in de zone Neus &amp; oren '
     'werkelijk staat. Deze zone heeft het grootste probleem van alle vier: acht modellen die op de '
     'foto vrijwel hetzelfde zijn, met acht keer bijna hetzelfde cijfer eronder. '
     'Het ontwerp lost dat op door de twee lijnen naast elkaar te zetten en per model te tonen wat er '
     'in de doos zit, in plaats van een score te herhalen die geen model onderscheidt.',

 auditkop='Wat er in deze zone niet klopt',
 auditintro='Geteld in de Admin API op de producten met de zonetag Neus &amp; oren, op 24 augustus. '
            'Elk punt hieronder is de reden dat er iets in dit ontwerp staat &mdash; of juist niet.',
 audit=[
  ('Acht modellen delen &eacute;&eacute;n beoordelingenstroom', 'De acht neustrimmers tonen 4,5 uit 5 met '
   '744, 745, 745, 747, 754, 765, 768 en 774 beoordelingen. Dat zijn niet acht meningen over acht '
   'apparaten: het is grotendeels d&eacute;zelfde stroom, met de productnaam in de tekst vervangen. '
   'Een score per kaart zou hier suggereren dat de modellen zich in kwaliteit onderscheiden, terwijl het '
   'cijfer over de lijn gaat. <b>Daarom staat de score hier &eacute;&eacute;n keer boven de groep, met de '
   'bron erbij, en niet acht keer op een kaart.</b>'),
  ('De echte ladder staat nergens', 'Basic, Premium, Advance en Ultimate verschillen precies in het '
   'aantal opzetstukken: 1, 2, 3 en 4. Elite, Platinum en Ultra doen hetzelfde in de nieuwe lijn. '
   'Dat is het enige wat de bezoeker hier moet weten, en het staat op geen enkele collectiekaart.'),
  ('Twee lijnen zonder uitleg naast elkaar', 'De Nose Sculptor-lijn (Essential, Elite, Platinum, Ultra) '
   'en de oudere lijn (Basic, Premium, Advance, Ultimate) staan door elkaar in de collectie. De oude lijn '
   'is bij elke trede goedkoper; de nieuwe lijn heeft bovenaan een baardtrimmer-opzetstuk waar de oude '
   'een bodygroomer-opzetstuk heeft. Dat verschil is een keuze, geen ruis &mdash; maar dan moet je het '
   'wel kunnen zien.'),
  ('Het losse opzetstuk is niet leverbaar', 'De <code>vervanging-neustrimmer-opzetstuk</code> staat op '
   'voorraad&nbsp;0 met voorraadregistratie aan. Daarom heeft deze zone geen groep &ldquo;onderdelen&rdquo;: '
   'er is niets te vervangen. Bij de andere zones is dat juist de groep die het vaakst wordt besteld.'),
  ('De Ultra is het best verkopende model en staat nergens vooraan', 'De Neustrimmer 4in1 Ultra ging de '
   'afgelopen dertig dagen 57 keer over de toonbank &mdash; het meest van alle apparaten in deze zone. '
   'De collectie sorteert daar niet op.'),
 ],

 bloknotities=[
  ('Kop, keuzehulp en zonebalk',
   'Boven de vouw: de belofte, een foto van het apparaat in gebruik uit de eigen bibliotheek, de score '
   'met de bron erbij, en de keuzehulp. <b>Twee vragen, acht uitkomsten</b> &mdash; precies '
   '&eacute;&eacute;n per apparaat: de eerste vraag kiest de trede op de ladder, de tweede kiest de lijn. '
   'Zo wint elk model precies &eacute;&eacute;n combinatie, wat de eis is uit het merkboek. '
   '<b>Speel met de vragen</b> en kijk hoe het matchpaneel meebeweegt.'),
  ('Het raster',
   'Twee groepen apparaten in plaats van &eacute;&eacute;n hoop van acht: de nieuwe Nose Sculptor-lijn en '
   'de vertrouwde lijn, elk op volgorde van de ladder. <b>Geen score op de kaarten</b> &mdash; die staat '
   '&eacute;&eacute;n keer boven de groep, met de uitleg dat de acht modellen dezelfde beoordelingenstroom '
   'delen. Wat er w&eacute;l per kaart staat is het aantal opzetstukken en het aantal onderdelen in de '
   'doos, want d&aacute;t onderscheidt ze. De kaart, de hover en het monogram komen letterlijk uit '
   '<code>assets/ws-bestsellers.css</code>. <b>Wat werkt:</b> het filter, de vergelijker en het oogje.'),
  ('Over deze categorie',
   'De uitleg semantisch: &eacute;&eacute;n <code>&lt;section&gt;</code>, een <code>h2</code> met de vraag, '
   'twee <code>h3</code>&rsquo;s, echte alinea&rsquo;s, een <code>&lt;ol&gt;</code> voor de tips en '
   'beschrijvende links naar de acht productpagina&rsquo;s. De doorsnede laat zien waarom een '
   'neustrimmer niet trekt: het mes draait binnen een gesloten kap. '
   '<b>Geen absolute belofte:</b> er staat dat het ontwerp de k&aacute;ns op trekken en irritatie helpt '
   'verkleinen, en de derde beoordeling hieronder laat zien dat het niet bij iedereen zo uitpakt.'),
  ('Wat kopers schrijven',
   'Drie beoordelingen, waarvan &eacute;&eacute;n kritisch. Dat is hier geen dapperheid maar noodzaak: '
   'de klacht die in deze categorie het vaakst terugkomt is irritatie na gebruik, en een pagina die dat '
   'verzwijgt wordt door de eerste beoordeling op de productpagina alsnog tegengesproken. '
   '<b>De bron staat er eerlijk bij:</b> de acht modellen delen &eacute;&eacute;n beoordelingenstroom, dus '
   'deze regels hangen aan de lijn en niet aan &eacute;&eacute;n model.'),
  ('Zekerheden, vragen en de andere zones',
   'De afsluitende band: de garanties met icoon (op mobiel een schuifstrip, op desktop &eacute;&eacute;n '
   'rij van vier), vijf vragen die over d&eacute;ze apparaten gaan, en de andere zones. '
   '<b>De vragen klappen open.</b>'),
 ],

 openvragen=[
  '<b>Het losse opzetstuk.</b> Voorraad 0 met registratie aan. Bijbestellen, of uit de collectie? '
  'Zolang het er niet is, heeft deze zone geen onderdelengroep.',
  '<b>Twee lijnen naast elkaar.</b> Blijft de oude lijn staan naast de Nose Sculptor-lijn, of loopt hij '
  'uit? Dat bepaalt of dit raster twee groepen houdt of &eacute;&eacute;n wordt.',
  '<b>De beoordelingen.</b> Acht modellen die &eacute;&eacute;n stroom delen is een instelling in Loox. '
  'Zo laten en het eerlijk labelen, of per model splitsen? Dit ontwerp gaat uit van het eerste.',
  '<b>Sorteervolgorde.</b> De Ultra verkoopt het best en staat niet vooraan. De sortering hoort op '
  'verkoop te staan, niet op invoerdatum.',
  '<b>Gratis verzending: &euro;30 of &euro;50.</b> De balk zegt &euro;30, de SEO-tekst &euro;50. '
  'Ik heb &euro;30 aangehouden, gelijk aan de andere zonepagina&rsquo;s.',
 ],

 # ── blok 1
 eyebrow='Neus &amp; oren &middot; 8 modellen',
 h1a='Eruit halen zonder',
 h1b='eraan te trekken.',
 lede='Acht modellen die op dezelfde manier werken: het mes draait binnen een gesloten kap. '
      'Wat ze onderscheidt is niet het cijfer eronder, maar hoeveel opzetstukken erbij zitten.',
 heroalt='Man werkt zijn neushaar bij met een Wellshave-neustrimmer',
 zonescore=4.5,
 zonescoretekst='4,5/5',
 zonescorebron='&eacute;&eacute;n stroom over de hele lijn',
 quote='Prima ding. Doet wat hij moet doen, geruisloos en precies. Ook geen last van pijn door haartjes '
       'die worden uitgetrokken.',
 quotebron='MarkA83 &middot; geverifieerde koper &middot; neustrimmerlijn',
 geruststellers=[(RETOUR, '100 dagen proberen'), (SCHILDV, '2 jaar garantie'), (TRUCK, 'Morgen in huis')],
 kaartkop='Jouw neustrimmer in 20 seconden',
 kaartsub='2 keuzes &middot; acht mogelijke uitkomsten',
 kaartvraag='Hoe ver wil je gaan?',
 vragen=[
  dict(groep='doel', start='neus', vraag='Wat wil je bijwerken?',
       opties=[('neus', 'Alleen neus &amp; oren'), ('wenk', 'Ook wenkbrauwen'),
               ('scheer', 'Ook kort scheren'), ('body', 'Ook baard of lichaam')]),
  dict(groep='lijn', start='nieuw', vraag='Wat weegt zwaarder?',
       opties=[('nieuw', 'De nieuwste lijn'), ('prijs', 'De scherpste prijs')]),
 ],
 woord={'doel': {'neus': 'neus & oren', 'wenk': 'ook wenkbrauwen', 'scheer': 'ook kort scheren',
                 'body': 'ook baard of lichaam'},
        'lijn': {'nieuw': 'nieuwste lijn', 'prijs': 'scherpste prijs'}},
 tabel=[
  {'w': {'doel': 'neus', 'lijn': 'nieuw'}, 'id': 'ess'},
  {'w': {'doel': 'neus', 'lijn': 'prijs'}, 'id': 'basic'},
  {'w': {'doel': 'wenk', 'lijn': 'nieuw'}, 'id': 'elite'},
  {'w': {'doel': 'wenk', 'lijn': 'prijs'}, 'id': 'prem'},
  {'w': {'doel': 'scheer', 'lijn': 'nieuw'}, 'id': 'plat'},
  {'w': {'doel': 'scheer', 'lijn': 'prijs'}, 'id': 'adv'},
  {'w': {'doel': 'body', 'lijn': 'nieuw'}, 'id': 'ultra'},
  {'w': {'doel': 'body', 'lijn': 'prijs'}, 'id': 'ultimate'},
 ],
 standaardmatch='ess',
 matches=[
  dict(id='ess', img='nsessential', naam='Neustrimmer Essential&trade;', badge='Instap, nieuwe lijn',
       zin='E&eacute;n opzetstuk, &eacute;&eacute;n knop: neus- en oorhaar en verder niets.',
       redenen=['Neus- en oorhaar zonder trekken', 'Drie onderdelen in de doos', 'USB-C oplaadbaar'],
       prijs=19.95, van=23.95, url=P + 'neustrimmer-essential'),
  dict(id='basic', img='nsbasic', naam='Neustrimmer Basic&trade;', badge='Laagste prijs in de collectie',
       zin='Hetzelfde werk uit de vertrouwde lijn, voor drie euro minder.',
       redenen=['Neus- en oorhaar zonder trekken', 'Drie onderdelen in de doos', 'E&eacute;n druk op de knop'],
       prijs=16.95, van=29.92, url=P + 'wellshave-neustrimmer-basic'),
  dict(id='elite', img='nselite', naam='Neustrimmer 2in1 Elite&trade;', badge='Nieuwe lijn',
       zin='Met het detailopzetstuk erbij, voor wenkbrauwen en strakke lijntjes.',
       redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen',
                'Vier onderdelen in de doos'],
       prijs=23.95, van=29.95, url=P + 'neustrimmer-2in1-elite'),
  dict(id='prem', img='nspremium', naam='Neustrimmer Premium&trade; 2-in-1', badge='Zelfde trede, lagere prijs',
       zin='Dezelfde twee opzetstukken uit de vertrouwde lijn.',
       redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen',
                'Vier onderdelen in de doos'],
       prijs=19.95, van=35.65, url=P + 'wellshave-2-in-1-neustrimmer-premium'),
  dict(id='plat', img='nsplatinum', naam='Neustrimmer 3in1 Platinum&trade;', badge='Nieuwe lijn',
       zin='Plus het shaver-opzetstuk, voor kort haar op kleine vlakken.',
       redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen',
                'Shaver-opzetstuk voor kort haar'],
       prijs=29.95, van=32.95, url=P + 'neustrimmer-3in1-platinum'),
  dict(id='adv', img='nsadvance', naam='Neustrimmer Advance&trade; 3-in-1', badge='Zelfde trede, lagere prijs',
       zin='Dezelfde drie opzetstukken uit de vertrouwde lijn.',
       redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen',
                'Shaver-opzetstuk voor kort haar'],
       prijs=24.95, van=48.25, url=P + 'wellshave-3-in-1-neustrimmer-advance'),
  dict(id='ultra', img='nsultra', naam='Neustrimmer 4in1 Ultra&trade;', badge='57&times; besteld in 30 dagen',
       zin='De bovenste trede van de nieuwe lijn, met een baardtrimmer-opzetstuk erbij.',
       redenen=['Vier opzetstukken, zes onderdelen', 'Ook je baardlijn met hetzelfde apparaat',
                'SkinGuard tegen wondjes en irritatie'],
       prijs=32.95, van=36.95, url=P + 'neustrimmer-4in1-ultra'),
  dict(id='ultimate', img='nsultimate', naam='Neustrimmer Ultimate&trade; 4-in-1', badge='Grootste voordeel',
       zin='De bovenste trede van de vertrouwde lijn, met een bodygroomer-opzetstuk erbij.',
       redenen=['Vier opzetstukken, zes onderdelen', 'Ook lichaamshaar met hetzelfde apparaat',
                'SkinGuard tegen wondjes en irritatie'],
       prijs=29.95, van=50.00, url=P + 'wellshave-4-in-1-neustrimmer-ultimate'),
 ],
 zonenaam='Neus &amp; oren',
 aantal='8',
 zoneslot='verdeeld over twee lijnen, plus twee bundels.',
 tellingen=[('Lichaam &amp; schaamstreek', '4', '#'), ('Gezicht &amp; baard', '11', '#'),
            ('Hoofd', '4', '#'), ('Neus &amp; oren', '8', '#')],

 # ── blok 2
 filters=[('alles', 'Alles', 10), ('app', 'Apparaten', 8), ('bundel', 'Bundels', 2)],
 startregel='neus &amp; oren &middot; nieuwste lijn',
 totaal=10,
 groepen=[
  dict(cat='app', soort='app', kop='De Nose Sculptor-lijn',
       sub='De nieuwste vier, van &eacute;&eacute;n opzetstuk tot vier.', vergelijk=True,
       noot='<b>4,5 uit 5</b> bij deze lijn. Loox toont bij alle acht neustrimmers grotendeels dezelfde '
            'beoordelingenstroom van ruim 740 beoordelingen, met de productnaam in de tekst vervangen. '
            'Er is dus g&eacute;&eacute;n aparte score per model &mdash; daarom staat het cijfer hier '
            '&eacute;&eacute;n keer, en niet acht keer op een kaart.',
       items=NIEUW, na=vergelijker(NIEUW + OUD)),
  dict(cat='app', soort='app', kop='De vertrouwde lijn',
       sub='Dezelfde vier tredes, elk een paar euro voordeliger.',
       noot='Zelfde ladder, andere generatie. Het verschil zit bovenaan: de Ultimate heeft een '
            '<b>bodygroomer</b>-opzetstuk, de Ultra een <b>baardtrimmer</b>-opzetstuk.',
       items=OUD),
  dict(cat='bundel', soort='bundel', kop='Of neem het mee in een bundel',
       sub='Voordeliger samengesteld dan de losse onderdelen.', items=BUNDELS),
 ],
 aanbod=dict(img='spult_los', naam='Shave Package Ultimate&trade;', eyebrow='Alles in &eacute;&eacute;n set',
             zin='Acht onderdelen voor lichaam, neus en detailwerk &mdash; samen goedkoper dan los.',
             prijs=89.95, van=142.80, url=P + 'shave-package-ultimate', knop='Bekijk de set'),

 # ── blok 3
 categorie=dict(
  h2a='Welke neustrimmer heb je nodig,',
  h2b='en waarin verschillen de acht?',
  alineas=[
   'Neus- en oorhaar zit op de lastigste plek van je hele lichaam: in een nauwe holte, met dunne huid '
   'eromheen die snel bloedt en snel irriteert. Daarom werkt geen enkele neustrimmer met een blootliggend '
   'mes. Het mes draait binnen een gesloten kap met gleuven: de haren komen door de gleuven naar binnen '
   'en worden daar afgeknipt, terwijl de huid buiten de kap blijft. Dat helpt de kans op wondjes en op '
   'het trekkende gevoel van uitgetrokken haartjes te verkleinen.',
   'Omdat alle acht modellen dat op dezelfde manier doen, zit het verschil ergens anders: in het aantal '
   'opzetstukken. E&eacute;n opzetstuk betekent neus en oren. Twee betekent daarnaast een detailtrimmer '
   'voor wenkbrauwen en lijntjes. Drie voegt een shaver-opzetstuk toe voor kort haar op kleine vlakken. '
   'Vier gaat verder: bij de nieuwe lijn met een baardtrimmer, bij de vertrouwde lijn met een bodygroomer. '
   'Meer opzetstukken maken de trimmer niet beter in de neus &mdash; ze maken hem breder inzetbaar.',
  ],
  h3lijst='De acht modellen op volgorde van de ladder',
  lijst=[
   ('Neustrimmer Essential&trade;', P + 'neustrimmer-essential',
    'E&eacute;n opzetstuk voor neus en oren, uit de nieuwe lijn.'),
   ('Neustrimmer Basic&trade;', P + 'wellshave-neustrimmer-basic',
    'Dezelfde eerste trede uit de vertrouwde lijn, voor de laagste prijs.'),
   ('Neustrimmer 2in1 Elite&trade;', P + 'neustrimmer-2in1-elite',
    'Met detailtrimmer erbij voor wenkbrauwen en strakke lijntjes.'),
   ('Neustrimmer Premium&trade; 2-in-1', P + 'wellshave-2-in-1-neustrimmer-premium',
    'Dezelfde twee opzetstukken uit de vertrouwde lijn.'),
   ('Neustrimmer 3in1 Platinum&trade;', P + 'neustrimmer-3in1-platinum',
    'Met shaver-opzetstuk voor kort haar op kleine vlakken.'),
   ('Neustrimmer Advance&trade; 3-in-1', P + 'wellshave-3-in-1-neustrimmer-advance',
    'Dezelfde drie opzetstukken uit de vertrouwde lijn.'),
   ('Neustrimmer 4in1 Ultra&trade;', P + 'neustrimmer-4in1-ultra',
    'De bovenste trede, met een baardtrimmer-opzetstuk erbij.'),
   ('Neustrimmer Ultimate&trade; 4-in-1', P + 'wellshave-4-in-1-neustrimmer-ultimate',
    'De bovenste trede van de vertrouwde lijn, met een bodygroomer-opzetstuk.'),
  ],
  slotalinea='Alle acht laden op met een USB-C-kabel en zijn compact genoeg voor de toilettas. '
             'Wil je meer dan alleen detailwerk, kijk dan naar de '
             '<a href="' + W + '/collections/all">hele collectie</a>: de bovenste trede van deze ladder '
             'doet je baardlijn of je lichaamshaar erbij, maar een echte bodygroomer of baardtrimmer '
             'doet dat werk beter.',
  svg=SVG_NEUS,
  bijschrift='Het ronddraaiende mes zit achter een gesloten kap; de haren komen door de gleuven naar '
             'binnen en je huid raakt het mes niet.',
  h3tips='Hoe gebruik je een neustrimmer zonder irritatie?',
  tips=[
   ('Werk droog en schoon', 'Snuit je neus eerst en gebruik hem op een droge binnenkant. Vocht plakt '
    'haartjes aan elkaar, en dan trekt de kap in plaats van te knippen.'),
   ('Draai, duw niet', 'Breng de punt een klein stukje naar binnen en draai hem rustig rond. Verder naar '
    'binnen duwen levert niets op en is precies waar irritatie ontstaat.'),
   ('Spoel hem na elke beurt om', 'De kap loopt vol met haartjes en dat is wat de motor laat zwoegen. '
    'Een paar seconden onder de kraan is genoeg.'),
  ],
 ),

 # ── blok 4
 bewijskop='Drie beoordelingen, waarvan &eacute;&eacute;n die je liever niet leest.',
 bewijsbron='<b>Let op bij het lezen:</b> de acht neustrimmers delen bij Loox grotendeels '
            '&eacute;&eacute;n beoordelingenstroom, met de productnaam in de tekst vervangen. Deze regels '
            'horen dus bij de l&iacute;jn en niet bij &eacute;&eacute;n model; het apparaat ernaast is het '
            'model waar de beoordeling op stond. Alle drie zijn geverifieerde kopers.',
 bewijs=[
  dict(img='nsplatinum', tag='Over het trekken',
       tekst='Prima ding. Doet wat hij moet doen, geruisloos en precies. Ook geen last van pijn door '
             'haartjes die worden uitgetrokken.',
       naam='MarkA83', product='Neustrimmerlijn', url=P + 'neustrimmer-3in1-platinum',
       bijschrift='beoordeling bij de lijn'),
  dict(img='nsultimate', tag='Over de opzetstukken',
       tekst='Doet alles wat het belooft. Echt. Beste trimmer voor lichaam, baard, neus en oor. '
             'Ook voor glad scheren van de bovenlip. Zeer blij mee.',
       naam='Lucas0412', product='Neustrimmer Ultimate&trade; 4-in-1',
       url=P + 'wellshave-4-in-1-neustrimmer-ultimate', bijschrift='beoordeling bij de lijn'),
  dict(img='nsbasic', tag='Over wat er ook gebeurt',
       tekst='Doet wat het moet doen. Geeft bij mij wel irritatie in de neus na gebruik.',
       naam='Stratocaster', product='Neustrimmerlijn', url=P + 'wellshave-neustrimmer-basic',
       bijschrift='beoordeling bij de lijn'),
 ],

 # ── blok 5
 zekerheden=[
  (RETOUR, '100 dagen thuis proberen', 'Niet goed? Je krijgt je geld terug.'),
  (SCHILDV, '2 jaar garantie', 'Op elk apparaat in deze zone.'),
  (TRUCK, 'Gratis verzending vanaf &euro;30', 'Naar Belgi&euml; gratis vanaf &euro;49,95.'),
  (KLOK, 'Morgen in huis', 'Besteld voor 23:59.'),
 ],
 faqkop='Vragen over deze acht',
 faqh2a='Alles wat je',
 faqh2b='wilt weten.',
 faq=[
  ('Welke van de acht moet ik hebben?',
   'Kies eerst hoe ver je wilt gaan: alleen <b>neus en oren</b> is de Essential of de Basic; '
   '<b>ook wenkbrauwen</b> is de Elite of de Premium; <b>ook kort scheren</b> is de Platinum of de '
   'Advance; <b>ook je baard of lichaam</b> is de Ultra of de Ultimate. Kies daarna de lijn: de nieuwe is '
   'nieuwer, de vertrouwde is bij elke trede een paar euro goedkoper. Bovenaan staat een keuzehulp die '
   'het in twee vragen voor je doet.'),
  ('Waarom staat er bij elk model hetzelfde cijfer?',
   'Omdat het cijfer over de l&iacute;jn gaat en niet over het losse model: bij alle acht toont Loox '
   'grotendeels dezelfde beoordelingenstroom, met de productnaam in de tekst vervangen. Daarom staat de '
   'score op deze pagina &eacute;&eacute;n keer boven de groep, met die uitleg erbij, in plaats van acht '
   'keer op een kaart waar hij niets onderscheidt.'),
  ('Doet het pijn?',
   'Het mes draait binnen een gesloten kap met gleuven, zodat de huid het mes niet raakt en de haren '
   'worden afgeknipt in plaats van uitgetrokken. Dat helpt de kans op wondjes en trekken te verkleinen. '
   '<b>Het is geen garantie:</b> in de beoordelingen staat ook &ldquo;geeft bij mij wel irritatie in de '
   'neus na gebruik&rdquo;. Werk droog, draai rustig en duw hem niet verder naar binnen dan nodig.'),
  ('Wat is het verschil tussen de Ultra en de Ultimate?',
   'Allebei vier opzetstukken en zes onderdelen in de doos. Het vierde opzetstuk verschilt: bij de '
   '<b>Ultra</b> is dat een <b>baardtrimmer</b>, bij de <b>Ultimate</b> een <b>bodygroomer</b>. '
   'De Ultimate is het goedkoopst van de twee.'),
  ('Wat als het me toch niet bevalt?',
   'Je hebt 100 dagen om het thuis te proberen, zonder reden op te geven. Je meldt de retour aan en hebt '
   'daarna veertien dagen om te versturen; <b>de verzendkosten van de retour zijn voor jou</b>, het '
   'aankoopbedrag krijg je binnen veertien dagen terug.'),
 ],
 anderezones=[
  ('Lichaam &amp; schaamstreek', 'Trimmen zonder wondjes.', '4 apparaten &rarr;', '#'),
  ('Gezicht &amp; baard', 'Scheren, trimmen en randen zetten.', '11 apparaten &rarr;', '#'),
  ('Hoofd', 'Tondeuses en hoofdscheerders.', '4 apparaten &rarr;', '#'),
  ('Alles bij elkaar', 'De hele collectie, per zone gesorteerd.', 'Bekijk alles &rarr;', W + '/collections/all'),
 ],
)
