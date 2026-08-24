# -*- coding: utf-8 -*-
from zg_engine import W, RETOUR, SCHILDV, TRUCK, KLOK, vergelijker

P = W + '/products/'
SVG_GEZICHT = open('svg_gezicht.txt', encoding='utf-8').read()

SCHEREN = [
 dict(id='sentinel', img='sentinel', naam='The Sentinel PRO', tag='Nieuw &middot; met station',
      wat='Reinigt en laadt zichzelf op in het station.',
      chips=['Reinigingsstation', '6 in de doos'], prijs=89.95, van=109.95,
      url=P + 'the-sentinel-pro', geenscore='Nieuw &middot; nog geen beoordelingen',
      redenen=['Automatisch reinigen en opladen in het station',
               'Reinigingsvloeistof meegeleverd', 'Zes onderdelen in de doos'],
      vgl=[('Waarvoor gemaakt', 'Elke dag glad scheren zonder er iets voor te hoeven doen.'),
           ('Wat hij extra kan', 'Het station reinigt de kop &eacute;n laadt hem op.'),
           ('Wat hij niet doet', 'Geen neus- of oorhaaropzetstuk in de doos.')]),
 dict(id='gentleman', img='gentleman', naam='The Gentleman Shaver&trade;', tag='26&times; deze maand',
      wat='Scheren, baardtrimmen en neushaar op &eacute;&eacute;n standaard.',
      score=4.6, aantal=460, chips=['Oplaadstandaard', '7 in de doos'], prijs=49.95, van=85.65,
      url=P + 'wellshave-scheerapparaat-elite',
      redenen=['Neus- en oorhaaropzetstuk in de doos', 'Baardtrimmer en opzetkammen (3-6-9 mm)',
               'LCD-display en oplaadstandaard'],
      vgl=[('Waarvoor gemaakt', 'Glad scheren met het detailwerk erbij.'),
           ('Wat hij extra kan', 'Neus- en oorhaaropzetstuk, baardtrimmer en drie opzetkammen.'),
           ('Wat hij niet doet', 'Geen reinigingsstation &mdash; de standaard laadt alleen op.')]),
 dict(id='baron', img='baron', naam='4 Foil Blade Baron&trade;', tag='Compact',
      wat='Foilkop voor korte stoppels, nat en droog.',
      score=4.7, aantal=639, chips=['4D-bladen', '3 in de doos'], prijs=49.95, van=73.50,
      url=P + 'wellshave-blade-baron',
      redenen=['Meerdere bladen grijpen meer haar tegelijk', 'Volledig waterdicht, nat en droog',
               'Drie onderdelen &mdash; past in elke toilettas'],
      vgl=[('Waarvoor gemaakt', 'Stoppels en korte baard strak en egaal wegscheren.'),
           ('Wat hij extra kan', 'Compact genoeg om altijd mee te nemen.'),
           ('Wat hij niet doet', 'Geen opzetstukken &mdash; alleen scheren.')]),
 dict(id='elegant', img='elegant4', naam='Scheerapparaat Elegant&trade; 4-in-1', tag='Meeste voor je geld',
      wat='Scheren, neushaar, sidetrimmer en baardtrimmer.',
      score=4.7, aantal=655, chips=['4-in-1', '6 in de doos'], prijs=39.95, van=79.92,
      url=P + 'wellshave-4-in-1-scheerapparaat',
      redenen=['Neus- en oorhaaropzetstuk in de doos', 'Sidetrimmer voor de bakkebaarden',
               'Baardtrimmer-opzetstuk erbij'],
      vgl=[('Waarvoor gemaakt', 'De hele gezichtsroutine met &eacute;&eacute;n apparaat.'),
           ('Wat hij extra kan', 'Vier koppen voor scheren, neushaar, zijkanten en baard.'),
           ('Wat hij niet doet', 'Geen station op het blad.')]),
]

TRIMMEN = [
 dict(id='supreme', img='supreme', naam='Men Shaper Supreme&trade; 6-in-1', tag='Meest compleet',
      wat='Zes opzetstukken, inclusief micro shaver en neushaar.',
      score=4.6, aantal=219, chips=['6 opzetstukken', '12 in de doos'], prijs=39.95, van=71.35,
      url=P + '6-in-1-baardtrimmer-supreme',
      redenen=['T-Blade, precisietrimmer en micro shaver', 'Neus- en oorhaaropzetstuk in de doos',
               'Verstelbaar opzetstuk 1&ndash;9 mm plus kammen'],
      vgl=[('Waarvoor gemaakt', 'Baard, lijnen, neushaar en lichaam met &eacute;&eacute;n set.'),
           ('Wat hij extra kan', 'Als enige een micro shaver voor de gladde afwerking.'),
           ('Wat hij niet doet', 'Scheert je gezicht niet zo glad als een echt scheerapparaat.')]),
 dict(id='msiced', img='msiced', naam='Men Shaper Iced&trade; 5-in-1', tag='Laagste prijs van het paar',
      wat='Vijf opzetstukken, elf onderdelen, in de Iced-afwerking.',
      score=4.6, aantal=768, chips=['5 opzetstukken', '11 in de doos'], prijs=33.95, van=57.15,
      url=P + 'wellshave-5-in-1-baardtrimmer-man-shaper-iced',
      redenen=['T-Blade en precisietrimmer voor de lijnen', 'Neus- en oorhaaropzetstuk in de doos',
               'Opbergstandaard en travelbag erbij'],
      vgl=[('Waarvoor gemaakt', 'Je baard op lengte houden en de lijnen zetten.'),
           ('Wat hij extra kan', 'Elf onderdelen, inclusief standaard en travelbag.'),
           ('Wat hij niet doet', 'Geen micro shaver &mdash; die zit alleen op de Supreme.')]),
 dict(id='msgold', img='msgold', naam='Men Shaper Gold&trade; 5-in-1', tag='Zelfde set, in goud',
      wat='Exact dezelfde elf onderdelen als de Iced, in goud.',
      score=4.6, aantal=493, chips=['5 opzetstukken', '11 in de doos'], prijs=36.95, van=79.92,
      url=P + 'wellshave-5-in-1-baardtrimmer-men-shaper',
      redenen=['Dezelfde vijf opzetstukken als de Iced', 'Neus- en oorhaaropzetstuk in de doos',
               'Gouden afwerking, &euro;3,00 meer dan de Iced'],
      vgl=[('Waarvoor gemaakt', 'Hetzelfde als de Iced.'),
           ('Wat hij extra kan', 'Niets &mdash; het verschil is de afwerking.'),
           ('Wat hij niet doet', 'Niets minder ook; hij kost wel &euro;3,00 meer.')]),
 dict(id='dial', img='dialmaster', naam='The Dial Master', tag='Nieuw',
      wat='Twintig lengtestanden op &eacute;&eacute;n draaiknop.',
      chips=['20 standen', 'IPX7'], prijs=34.95, van=54.95, url=P + 'the-dial-master',
      geenscore='Nieuw &middot; nog geen beoordelingen',
      redenen=['20 nauwkeurige lengtestanden', 'Verstelbare draaiknop, geen kammen wisselen',
               'IPX7 waterdicht, met LED-display'],
      vgl=[('Waarvoor gemaakt', 'E&eacute;n baardlengte die je precies wilt kunnen herhalen.'),
           ('Wat hij extra kan', 'De draaiknop staat op twintig standen; je wisselt geen kammen.'),
           ('Wat hij niet doet', 'Geen neushaar, geen scheerkop &mdash; vier onderdelen, meer niet.')]),
 dict(id='edge', img='edgeblade', naam='Edge Blade', tag='Voor de lijnen',
      wat='4D-flexkop met korte kammen: 1, 2, 3 en 5 mm.',
      score=4.6, aantal=98, chips=['4D-flexkop', '1&ndash;5 mm'], prijs=33.95, van=54.95,
      url=P + 'wellshave-edge-blade',
      redenen=['4D-flexkop volgt kaaklijn en hals', 'Kammen van 1, 2, 3 en 5 mm',
               'Volledig waterdicht'],
      vgl=[('Waarvoor gemaakt', 'Korte stoppels en scherpe randen, op gezicht en lichaam.'),
           ('Wat hij extra kan', 'De flexkop kantelt mee over kaak en hals.'),
           ('Wat hij niet doet', 'Geen lange baardlengtes &mdash; de kammen gaan tot 5 mm.')]),
]

MESJES = [
 dict(id='bgold', img='bgold', naam='Blade Guard Gold', tag='Klassiek',
      wat='Klassiek scheermes met wisselbare mesjes.',
      chips=['Skin-Safe', '3 in de doos'], prijs=19.95, van=21.58,
      url=P + 'wellshave-safety-razor-gold', geenscore='Nog geen beoordelingen',
      redenen=['E&eacute;n mesje, geen accu, geen oplader', 'Mesjes los verkrijgbaar',
               'Gouden uitvoering'],
      vgl=[('Waarvoor gemaakt', 'Glad scheren met een klassiek mes.'),
           ('Wat hij extra kan', 'Geen batterij nodig; de mesjes vervang je los.'),
           ('Wat hij niet doet', 'Geen trimmen, geen lengte instellen.')]),
 dict(id='bblack', img='bblack', naam='Blade Guard Black', tag='Zelfde mes, in zwart',
      wat='Dezelfde drie onderdelen, in zwart, voor dezelfde prijs.',
      chips=['Skin-Safe', '3 in de doos'], prijs=19.95, van=21.58,
      url=P + 'wellshave-safety-razor-black', geenscore='Nog geen beoordelingen',
      redenen=['Dezelfde inhoud als de Gold', 'Zwarte uitvoering', 'Zelfde prijs'],
      vgl=[('Waarvoor gemaakt', 'Hetzelfde als de Gold.'),
           ('Wat hij extra kan', 'Niets &mdash; het verschil is de kleur.'),
           ('Wat hij niet doet', 'Niets minder ook.')]),
]

BUNDELS = [
 dict(img='flexbundel_los', naam='Flex-line Bundel', tag='Grootste voordeel', doos=9,
      prijs=89.95, van=156.60, url=P + 'body-beard-kit',
      wat='Flex Guard met foilkop, neushaaropzetstuk &eacute;n de Sharpline-detailtrimmer.'),
 dict(img='essflex', naam='Essential Flex Bundel', tag='Bundel', doos=8,
      prijs=79.95, van=133.25, url=P + 'essential-flex-bundel',
      wat='Flex Guard met foilkop, extra Skin-Safe mes, toilettas en hard case.'),
 dict(img='sp30_los', naam='Shave Package 3.0', tag='Bundel', doos=9,
      prijs=64.95, van=99.95, url=P + 'wellshave-shave-package-3-0',
      wat='Verzorgingsbundel met neustrimmer en alle vier de opzetstukken.'),
]

ONDERHOUD = [
 dict(img='gskop', naam='The Gentlemen Shaver&trade; Scheerkop', kicker='Scheerkop',
      wat='Vervangende kop voor The Gentleman Shaver.',
      prijs=19.95, van=28.50, url=P + 'elite-scheerkop'),
 dict(img='bgblades', naam='Blade Guard Blades', kicker='Mesjes',
      wat='Vijf reservemesjes voor de Blade Guard.',
      prijs=9.95, van=9.92, url=P + 'wellshave-safety-razor-blades'),
 dict(img='washbag', naam='The Washbag&trade;', kicker='Opbergen',
      wat='Toilettas voor apparaat, koppen en kabel.',
      prijs=19.95, van=28.50, url=P + 'toiletry-bag'),
 dict(img='hardcase', naam='The Hard Case', kicker='Opbergen',
      wat='Harde koffer die tegen een koffer kan.',
      prijs=14.95, van=21.95, url=P + 'wellshave-hard-case'),
]

ZONE = dict(
 titel='Collectie Gezicht &amp; baard',
 kicker='Collectiepagina-redesign &middot; zone Gezicht &amp; baard',
 h1='Elf apparaten, en twee die alleen in kleur verschillen',
 sub='Dezelfde vijf blokken als de bodygroomerpagina, gevuld met wat er in de zone Gezicht &amp; baard '
     'werkelijk staat. Dit is de grootste zone van de vier en de enige waar de bezoeker eerst een '
     'ander soort keuze moet maken: scheren of trimmen, en daarbinnen roterend of foil. '
     'Prijzen, voorraad, doosinhoud en beoordelingen komen uit Shopify en Loox.',

 auditkop='Wat er in deze zone niet klopt',
 auditintro='Geteld in de Admin API op de producten met de zonetag Gezicht &amp; baard, op 24 augustus, '
            'inclusief de <code>custom.included_box</code>-metavelden per product. Elk punt hieronder is '
            'de reden dat er iets in dit ontwerp staat.',
 audit=[
  ('Twee apparaatparen verschillen alleen in kleur', 'De <b>Men Shaper Gold</b> en de <b>Men Shaper Iced</b> '
   'hebben exact dezelfde elf onderdelen en dezelfde vijf opzetstukken; alleen de afwerking verschilt, en '
   'de Gold kost &euro;3,00 meer. Bij de <b>Blade Guard Gold</b> en <b>Black</b> is het verschil '
   'de kleur, bij precies dezelfde prijs. Op de huidige pagina staan ze als vier losse keuzes naast '
   'elkaar, wat de bezoeker vier keer laat afwegen wat in werkelijkheid twee keer een kleur is.'),
  ('Elf apparaten in &eacute;&eacute;n ongesorteerde rij', 'Roterende scheerapparaten, foilscheerders, '
   'baardtrimmerkits, een lengtetrimmer en twee klassieke scheermessen staan door elkaar. Dat zijn vier '
   'verschillende soorten gereedschap; de bezoeker moet eerst weten w&eacute;lk soort hij zoekt.'),
  ('De doosinhoud is het echte verschil en staat nergens', 'De Baron heeft drie onderdelen, de Gentleman '
   'Shaver zeven, de Supreme twaalf. Dat staat in <code>custom.included_box</code> en op geen enkele '
   'collectiekaart. Terwijl juist dat de vraag beantwoordt of je er ook je neushaar mee doet.'),
  ('Twee apparaten hebben nog geen beoordelingen', 'De <b>Sentinel PRO</b> en <b>The Dial Master</b> staan '
   'op nul. Op de huidige pagina krijgen ze net als alles &ldquo;4.5 uit 5&rdquo; mee. Hier staat wat er '
   'is: &ldquo;nieuw, nog geen beoordelingen&rdquo;.'),
  ('De scores zijn goed en worden niet gebruikt', 'Zeven van de elf apparaten zijn beoordeeld, met scores '
   'van 4,6 tot 4,7 en tussen de 98 en 768 beoordelingen per apparaat. E&eacute;n vlak getal van 4.5 op '
   'elke kaart maakt de goede apparaten slechter dan ze zijn.'),
  ('De Sentinel PRO belooft in de tekst iets wat niet in de doos zit', 'De productteksten noemen '
   '&ldquo;inclusief precisietrimmer en neustrimmer&rdquo;, maar de doosinhoud noemt shaver, scheerkop, '
   'reinigingsstation, reinigingsvloeistof, kabel en borstel. E&eacute;n van beide moet worden '
   'gecorrigeerd; in dit ontwerp houd ik de doosinhoud aan.'),
 ],

 bloknotities=[
  ('Kop, keuzehulp en zonebalk',
   'Boven de vouw: de belofte, een foto van het apparaat in gebruik uit de eigen bibliotheek, de score met '
   'de bron erbij, en de keuzehulp. <b>Drie vragen, negen uitkomsten.</b> De eerste kiest het soort '
   'gereedschap, de tweede of je &eacute;&eacute;n apparaat of een set wilt, de derde of het neus- en '
   'oorhaar meeneemt &mdash; alle drie na te kijken in <code>custom.included_box</code>. '
   '<b>Twee apparaten winnen bewust niets:</b> de Men Shaper Gold en de Blade Guard Black zijn dezelfde '
   'set als hun tweelingbroer in een andere afwerking, dus de keuzehulp wijst de goedkoopste aan en het '
   'raster legt uit waarom de ander bestaat. <b>Speel met de vragen.</b>'),
  ('Het raster',
   'Vier groepen in plaats van &eacute;&eacute;n rij van elf: scheerapparaten, trimmers, klassieke '
   'scheermessen en de onderdelen, plus de bundels. Op elke kaart staat het aantal onderdelen in de doos '
   'en het aantal opzetstukken, want d&aacute;t onderscheidt de apparaten &mdash; en de echte score, of '
   '&ldquo;nog geen beoordelingen&rdquo; als die er niet is. De kaart, de hover en het monogram komen '
   'letterlijk uit <code>assets/ws-bestsellers.css</code>. <b>Wat werkt:</b> het filter, de vergelijker, '
   'het oogje en de plusknop bij de onderdelen &mdash; en de kaart met &ldquo;Beste match&rdquo; volgt de '
   'keuzehulp hierboven.'),
  ('Over deze categorie',
   'De uitleg semantisch: &eacute;&eacute;n <code>&lt;section&gt;</code>, een <code>h2</code> met de vraag, '
   'twee <code>h3</code>&rsquo;s, echte alinea&rsquo;s, een <code>&lt;ol&gt;</code> voor de tips en '
   'beschrijvende links naar de productpagina&rsquo;s. De tekening zet de twee scheerkoppen naast elkaar, '
   'want roterend of foil is de eerste vraag die niemand beantwoordt. '
   '<b>Zonder getallen die ik niet kan nakijken:</b> geen percentages, geen testresultaten &mdash; alleen '
   'wat er in de doos zit en wat de kop mechanisch doet.'),
  ('Wat kopers schrijven',
   'Drie beoordelingen, elk aan het apparaat waar hij over gaat, met foto, link en de score van d&aacute;t '
   'apparaat. <b>De eerste is bewust een genuanceerde:</b> iemand die na vijftig jaar met een mes '
   'overstapt en schrijft dat het niet sneller gaat, maar wel net zo glad. Dat is precies het bezwaar '
   'waarop deze categorie wordt gekocht of niet.'),
  ('Zekerheden, vragen en de andere zones',
   'De afsluitende band: de garanties met icoon (op mobiel een schuifstrip, op desktop &eacute;&eacute;n '
   'rij van vier), vijf vragen die over d&eacute;ze apparaten gaan, en de andere zones. '
   '<b>De vragen klappen open.</b>'),
 ],

 openvragen=[
  '<b>Gold naast Iced, Gold naast Black.</b> Twee paren die alleen in afwerking verschillen. Als kleur de '
  'bedoeling is, hoort dat een variant op &eacute;&eacute;n productpagina te zijn in plaats van twee '
  'producten in de collectie.',
  '<b>De Sentinel PRO-tekst.</b> De USP noemt een neustrimmer die niet in de doosinhoud staat. '
  'E&eacute;n van beide klopt niet.',
  '<b>De zonetelling.</b> De tags geven elf apparaten in deze zone; de homepage rekent met acht. '
  'E&eacute;n telling moet winnen.',
  '<b>Beoordelingen bij nieuwe apparaten.</b> Sentinel PRO en Dial Master staan op nul. Zolang dat zo is, '
  'hoort er &ldquo;nieuw&rdquo; te staan en geen standaardcijfer.',
  '<b>Gratis verzending: &euro;30 of &euro;50.</b> De balk zegt &euro;30, de SEO-tekst &euro;50. '
  'Ik heb &euro;30 aangehouden, gelijk aan de andere zonepagina&rsquo;s.',
 ],

 # ── blok 1
 eyebrow='Gezicht &amp; baard &middot; 11 apparaten',
 h1a='Glad, stoppels of vol.',
 h1b='Jouw gezicht, jouw lengte.',
 lede='Roterende en foilscheerapparaten voor glad, trimmerkits voor de baard en de lijnen, en twee '
      'klassieke scheermessen. Wat je nodig hebt hangt af van wat je doet &mdash; niet van de prijs.',
 heroalt='Man trimt zijn baard met een Wellshave-trimmer voor de spiegel',
 zonescore=4.6,
 zonescoretekst='4,6/5',
 zonescorebron='7 van 11 beoordeeld',
 quote='Moet nog wennen denk ik na 50 jaar met mes scheren. Gaat niet vlugger wat veel mensen zeggen. '
       'Wel net zo glad het eindresultaat.',
 quotebron='John N. &middot; geverifieerde koper &middot; The Gentleman Shaver',
 geruststellers=[(RETOUR, '100 dagen proberen'), (SCHILDV, '2 jaar garantie'), (TRUCK, 'Morgen in huis')],
 kaartkop='Jouw gezichtsapparaat in 30 seconden',
 kaartsub='3 keuzes &middot; direct een match',
 kaartvraag='Wat doe je het vaakst?',
 vragen=[
  dict(groep='klus', start='scheren', vraag='Wat is de klus?',
       opties=[('scheren', 'Glad scheren'), ('baard', 'Baard op lengte'),
               ('lijnen', 'Lijnen &amp; stoppels'), ('mes', 'Klassiek met een mesje')]),
  dict(groep='set', start='los', vraag='Alleen het apparaat, of een set?',
       opties=[('los', 'Alleen het apparaat'), ('set', 'Set met opzetstukken')]),
  dict(groep='neus', start='geen', vraag='Ook neus- en oorhaar erbij?',
       opties=[('geen', 'Niet nodig'), ('neus', 'Ja, graag')]),
 ],
 woord={'klus': {'scheren': 'glad scheren', 'baard': 'baard op lengte', 'lijnen': 'lijnen en stoppels',
                 'mes': 'klassiek mesje'},
        'set': {'los': 'alleen het apparaat', 'set': 'set met opzetstukken'},
        'neus': {'geen': 'geen neushaar', 'neus': 'ook neushaar'}},
 tabel=[
  {'w': {'klus': 'mes'}, 'id': 'bgold'},
  {'w': {'klus': 'lijnen'}, 'id': 'edge'},
  {'w': {'klus': 'scheren', 'set': 'los', 'neus': 'geen'}, 'id': 'baron'},
  {'w': {'klus': 'scheren', 'set': 'los', 'neus': 'neus'}, 'id': 'gentleman'},
  {'w': {'klus': 'scheren', 'set': 'set', 'neus': 'geen'}, 'id': 'sentinel'},
  {'w': {'klus': 'scheren', 'set': 'set', 'neus': 'neus'}, 'id': 'elegant'},
  {'w': {'klus': 'baard', 'set': 'los'}, 'id': 'dial'},
  {'w': {'klus': 'baard', 'set': 'set', 'neus': 'geen'}, 'id': 'msiced'},
  {'w': {'klus': 'baard', 'set': 'set', 'neus': 'neus'}, 'id': 'supreme'},
 ],
 standaardmatch='baron',
 matches=[
  dict(id='baron', img='baron', naam='4 Foil Blade Baron&trade;', badge='Compact',
       zin='Foilkop voor korte stoppels, waterdicht, drie onderdelen in de doos.',
       redenen=['Meerdere bladen grijpen meer haar tegelijk', 'Nat en droog te gebruiken',
                'Past in elke toilettas'],
       prijs=49.95, van=73.50, url=P + 'wellshave-blade-baron'),
  dict(id='gentleman', img='gentleman', naam='The Gentleman Shaver&trade;', badge='26&times; besteld in 30 dagen',
       zin='Roterend scheren, met een neus- en oorhaaropzetstuk en een baardtrimmer in dezelfde doos.',
       redenen=['Neus- en oorhaaropzetstuk meegeleverd', 'Baardtrimmer en kammen 3-6-9 mm',
                'LCD-display en oplaadstandaard'],
       prijs=49.95, van=85.65, url=P + 'wellshave-scheerapparaat-elite'),
  dict(id='sentinel', img='sentinel', naam='The Sentinel PRO', badge='Nieuw in de lijn',
       zin='Zet hem terug in het station en hij reinigt en laadt zichzelf.',
       redenen=['Reinigingsstation met reinigingsvloeistof', 'Zes onderdelen in de doos',
                'Comfortabel scheren zonder irritatie'],
       prijs=89.95, van=109.95, url=P + 'the-sentinel-pro', voorraad='Op voorraad &middot; nieuw'),
  dict(id='elegant', img='elegant4', naam='Scheerapparaat Elegant&trade; 4-in-1', badge='Meeste voor je geld',
       zin='Vier koppen: scheren, neushaar, bakkebaarden en de baardtrimmer.',
       redenen=['Neus- en oorhaaropzetstuk meegeleverd', 'Sidetrimmer voor de bakkebaarden',
                'Zes onderdelen in de doos'],
       prijs=39.95, van=79.92, url=P + 'wellshave-4-in-1-scheerapparaat'),
  dict(id='dial', img='dialmaster', naam='The Dial Master', badge='Nieuw in de lijn',
       zin='Twintig lengtestanden op &eacute;&eacute;n draaiknop &mdash; je wisselt geen kammen meer.',
       redenen=['20 nauwkeurige lengtestanden', 'Verstelbare draaiknop', 'IPX7 waterdicht, LED-display'],
       prijs=34.95, van=54.95, url=P + 'the-dial-master', voorraad='Op voorraad &middot; nieuw'),
  dict(id='msiced', img='msiced', naam='Men Shaper Iced&trade; 5-in-1', badge='Laagste prijs van het paar',
       zin='Vijf opzetstukken en elf onderdelen &mdash; dezelfde set als de Gold, voor &euro;3,00 minder.',
       redenen=['T-Blade en precisietrimmer voor de lijnen', 'Verstelbaar opzetstuk 1&ndash;9 mm',
                'Opbergstandaard en travelbag erbij'],
       prijs=33.95, van=57.15, url=P + 'wellshave-5-in-1-baardtrimmer-man-shaper-iced'),
  dict(id='supreme', img='supreme', naam='Men Shaper Supreme&trade; 6-in-1', badge='Meest compleet',
       zin='Zes opzetstukken en twaalf onderdelen, met een micro shaver voor de gladde afwerking.',
       redenen=['Micro shaver die de 5-in-1 niet heeft', 'Neus- en oorhaaropzetstuk meegeleverd',
                'T-Blade, precisietrimmer en bodygroomer'],
       prijs=39.95, van=71.35, url=P + '6-in-1-baardtrimmer-supreme'),
  dict(id='edge', img='edgeblade', naam='Edge Blade', badge='Voor de lijnen',
       zin='4D-flexkop die meekantelt over kaak en hals, met kammen van 1 tot 5 mm.',
       redenen=['Kammen van 1, 2, 3 en 5 mm', 'Flexkop volgt kaaklijn en hals',
                'Volledig waterdicht, ook voor het lichaam'],
       prijs=33.95, van=54.95, url=P + 'wellshave-edge-blade'),
  dict(id='bgold', img='bgold', naam='Blade Guard Gold', badge='Geen accu nodig',
       zin='Een klassiek scheermes met wisselbare mesjes &mdash; ook in het zwart, voor dezelfde prijs.',
       redenen=['Geen batterij, geen oplader', 'Mesjes los verkrijgbaar',
                'Drie onderdelen in de doos'],
       prijs=19.95, van=21.58, url=P + 'wellshave-safety-razor-gold'),
 ],
 zonenaam='Gezicht &amp; baard',
 aantal='11',
 zoneslot='verdeeld over vier soorten, plus bundels en de onderdelen die je later vervangt.',
 tellingen=[('Lichaam &amp; schaamstreek', '4', '#'), ('Gezicht &amp; baard', '11', '#'),
            ('Hoofd', '4', '#'), ('Neus &amp; oren', '8', '#')],

 # ── blok 2
 filters=[('alles', 'Alles', 18), ('app', 'Apparaten', 11), ('bundel', 'Bundels', 3),
          ('mes', 'Onderdelen', 4)],
 startregel='glad scheren &middot; alleen het apparaat &middot; geen neushaar',
 totaal=18,
 groepen=[
  dict(cat='app', soort='app', kop='Scheren tot glad',
       sub='Vier scheerapparaten: drie roterend, &eacute;&eacute;n met een foilkop.', vergelijk=True,
       items=SCHEREN, na=vergelijker(SCHEREN + TRIMMEN)),
  dict(cat='app', soort='app', kop='Trimmen, lengte en lijnen',
       sub='Vijf apparaten voor wie lengte wil houden of randen wil zetten.',
       noot='<b>De Iced en de Gold zijn dezelfde set.</b> Elf onderdelen, vijf opzetstukken, alleen de '
            'afwerking verschilt &mdash; en de Gold kost &euro;3,00 meer. Wil je goud, dan is dat de '
            'reden; wil je het apparaat, neem dan de Iced.',
       items=TRIMMEN),
  dict(cat='app', soort='app', kop='Klassiek met een mesje',
       sub='Twee scheermessen zonder accu, voor wie het liever met de hand doet.',
       noot='Ook hier: <b>Gold en Black zijn hetzelfde mes</b> met dezelfde drie onderdelen, voor exact '
            'dezelfde prijs. Kies op kleur.',
       items=MESJES),
  dict(cat='bundel', soort='bundel', kop='Of pak het in &eacute;&eacute;n keer compleet',
       sub='Voordeliger samengesteld dan de losse onderdelen.', items=BUNDELS),
  dict(cat='mes', soort='mes', kop='Blijf scherp',
       sub='Vervang alleen wat slijt &mdash; niet het hele apparaat.', items=ONDERHOUD),
 ],
 aanbod=dict(img='flexbundel_los', naam='Flex-line Bundel', eyebrow='Grootste voordeel in deze zone',
             zin='Negen onderdelen voor gezicht, baard en lichaam, inclusief de Sharpline-detailtrimmer.',
             prijs=89.95, van=156.60, url=P + 'body-beard-kit', knop='Bekijk de bundel'),

 # ── blok 3
 categorie=dict(
  h2a='Roterend of foil,',
  h2b='scheren of trimmen?',
  alineas=[
   'De grootste zone van de collectie begint met een vraag die geen enkele productpagina stelt: wil je '
   'het h&aacute;&aacute;r weg, of wil je het op een lengte houden? Een scheerapparaat brengt je huid '
   'terug naar glad en kent geen lengtes. Een trimmer laat juist lengte staan en heeft daar kammen of '
   'een draaiknop voor. Een apparaat dat allebei zegt te doen, doet meestal &eacute;&eacute;n van de twee '
   'goed en het andere er een beetje bij.',
   'Kies je voor scheren, dan volgt de tweede vraag: <b>roterend of foil</b>. Een roterende kop heeft drie '
   'ronde messen die onafhankelijk kantelen; ze volgen de bolling van je kaak, kin en hals en werken goed '
   'als je baardgroei alle kanten op staat. Een foilkop heeft rechte messen die onder een geperforeerd '
   'vlak heen en weer gaan; dat werkt het snelst op een vlak stuk huid met korte stoppels. Geen van beide '
   'is beter &mdash; ze passen bij een ander gezicht en een ander ritme.',
   'Ga je trimmen, dan zit het verschil niet in de motor maar in de doos. Een 5-in-1-kit heeft vijf '
   'opzetstukken en elf onderdelen; de 6-in-1 heeft er een micro shaver bij. Wil je juist &eacute;&eacute;n '
   'ding heel precies kunnen herhalen, dan is een draaiknop met vaste standen praktischer dan een la vol '
   'kammen.',
  ],
  h3lijst='De elf apparaten, per soort',
  lijst=[
   ('The Sentinel PRO', P + 'the-sentinel-pro',
    'Roterend, met een station dat de kop reinigt en het apparaat oplaadt.'),
   ('The Gentleman Shaver&trade;', P + 'wellshave-scheerapparaat-elite',
    'Roterend, met neus- en oorhaaropzetstuk, baardtrimmer en oplaadstandaard.'),
   ('Scheerapparaat Elegant&trade; 4-in-1', P + 'wellshave-4-in-1-scheerapparaat',
    'Roterend, met neustrimmer, sidetrimmer en baardtrimmer erbij.'),
   ('4 Foil Blade Baron&trade;', P + 'wellshave-blade-baron',
    'De foilkop van de vier: kort, snel en compact genoeg voor onderweg.'),
   ('Men Shaper Supreme&trade; 6-in-1', P + '6-in-1-baardtrimmer-supreme',
    'De ruimste trimmerkit: zes opzetstukken en twaalf onderdelen.'),
   ('Men Shaper Iced&trade; 5-in-1', P + 'wellshave-5-in-1-baardtrimmer-man-shaper-iced',
    'Vijf opzetstukken en elf onderdelen, in de Iced-afwerking.'),
   ('Men Shaper Gold&trade; 5-in-1', P + 'wellshave-5-in-1-baardtrimmer-men-shaper',
    'Dezelfde set als de Iced, in goud, voor &euro;3,00 meer.'),
   ('The Dial Master', P + 'the-dial-master',
    'Twintig lengtestanden op &eacute;&eacute;n draaiknop, zonder kammen te wisselen.'),
   ('Edge Blade', P + 'wellshave-edge-blade',
    'Flexkop voor korte stoppels en scherpe randen, met kammen van 1 tot 5 mm.'),
   ('Blade Guard Gold', P + 'wellshave-safety-razor-gold',
    'Klassiek scheermes met wisselbare mesjes, zonder accu.'),
   ('Blade Guard Black', P + 'wellshave-safety-razor-black',
    'Hetzelfde mes in het zwart, voor dezelfde prijs.'),
  ],
  slotalinea='Wat slijt is de kop, niet het apparaat. De '
             '<a href="' + P + 'elite-scheerkop">scheerkop van de Gentleman Shaver</a> en de '
             '<a href="' + P + 'wellshave-safety-razor-blades">mesjes van de Blade Guard</a> zijn los te '
             'bestellen, net als de <a href="' + W + '/collections/accesoires">tassen en koffers</a>. '
             'Merk je dat een kop trekt of minder pakt, dan hoef je geen nieuw apparaat te kopen.',
  svg=SVG_GEZICHT,
  bijschrift='Een roterende kop heeft drie ronde messen die apart kantelen en de bolling van je gezicht '
             'volgen; een foilkop heeft rechte messen onder een geperforeerd vlak, voor korte stoppels op '
             'een vlak stuk huid.',
  h3tips='Hoe haal je er het meeste uit?',
  tips=[
   ('Geef jezelf twee weken', 'Stap je over van een mes, dan voelt elektrisch scheren de eerste dagen '
    'anders en soms minder glad. Je huid en je routine hebben tijd nodig; in de beoordelingen komt dat '
    'telkens terug.'),
   ('Beweeg tegen de groeirichting in', 'Bij een roterende kop maak je rustige, kleine rondjes; bij een '
    'foilkop rechte halen. Harder drukken maakt het resultaat niet gladder, wel roder.'),
   ('Maak de kop na elke beurt schoon', 'Haar en huidschilfers tussen de messen zijn de eerste reden dat '
    'een apparaat gaat trekken. Spoelen of uitborstelen is genoeg; het station doet het zelf.'),
  ],
 ),

 # ── blok 4
 bewijskop='Drie dingen die je wilt weten voordat je op elektrisch overstapt.',
 bewijsbron='Elke regel is een echte beoordeling bij het apparaat dat ernaast staat, geschreven door een '
            'geverifieerde koper. <b>Let op bij het lezen:</b> Loox toont bij verwante modellen soms '
            'dezelfde beoordelingenstroom met de productnaam vervangen, dus ik heb alleen regels gekozen '
            'die inhoudelijk over d&iacute;t apparaat gaan.',
 bewijs=[
  dict(img='gentleman', tag='Over de overstap van mes naar apparaat',
       tekst='Moet nog wennen denk ik na 50 jaar met mes scheren. Gaat niet vlugger wat veel mensen '
             'zeggen. Wel net zo glad het eindresultaat.',
       naam='John N.', product='The Gentleman Shaver&trade;',
       url=P + 'wellshave-scheerapparaat-elite', score=4.6, aantal=460),
  dict(img='baron', tag='Over meenemen',
       tekst='Ik ben er erg tevreden over. Doet wat het hoort te doen, namelijk glad scheren. Fijn met '
             'usb-c. Compact vorm gegeven dus ook makkelijk mee te nemen. Ligt prettig in de hand.',
       naam='reviewvanSjors', product='4 Foil Blade Baron&trade;',
       url=P + 'wellshave-blade-baron', score=4.7, aantal=639),
  dict(img='msiced', tag='Over hoe lang hij meegaat',
       tekst='Produkt doet wat het moet doen. Gebruik het al meer dan een jaar en geen problemen mee. '
             'Batterij gaat zeer lang mee en verschillende opzetkammen mogelijk.',
       naam='Krstof001', product='Men Shaper Iced&trade; 5-in-1',
       url=P + 'wellshave-5-in-1-baardtrimmer-man-shaper-iced', score=4.6, aantal=768),
 ],

 # ── blok 5
 zekerheden=[
  (RETOUR, '100 dagen thuis proberen', 'Niet goed? Je krijgt je geld terug.'),
  (SCHILDV, '2 jaar garantie', 'Op elk apparaat in deze zone.'),
  (TRUCK, 'Gratis verzending vanaf &euro;30', 'Naar Belgi&euml; gratis vanaf &euro;49,95.'),
  (KLOK, 'Morgen in huis', 'Besteld voor 23:59.'),
 ],
 faqkop='Vragen over deze elf',
 faqh2a='Alles wat je',
 faqh2b='wilt weten.',
 faq=[
  ('Roterend of foil &mdash; wat past bij mij?',
   'Een <b>roterende</b> kop heeft drie ronde messen die apart kantelen en de bolling van kaak, kin en '
   'hals volgen; die werkt goed als je baardgroei alle kanten op staat. Een <b>foilkop</b> heeft rechte '
   'messen onder een geperforeerd vlak en is het snelst op vlakke huid met korte stoppels. Drie van de '
   'vier scheerapparaten hier zijn roterend; de 4 Foil Blade Baron is de foil.'),
  ('Wat is het verschil tussen de Men Shaper Gold en de Iced?',
   'De afwerking, en verder niets. Beide hebben dezelfde vijf opzetstukken en dezelfde elf onderdelen in '
   'de doos: T-Blade, standaardtrimmer, neus- en oorhaaropzetstuk, precisietrimmer, bodygroomer, een '
   'verstelbaar opzetstuk van 1 tot 9 mm, opzetkammen, kabel, opbergstandaard en travelbag. '
   '<b>De Gold kost &euro;3,00 meer.</b> Hetzelfde geldt voor de Blade Guard Gold en Black, die zelfs '
   'even duur zijn.'),
  ('Kan ik er ook mijn neushaar mee doen?',
   'Bij vijf van de elf zit een neus- en oorhaaropzetstuk in de doos: de Gentleman Shaver, de '
   'Scheerapparaat Elegant 4-in-1 en alle drie de Men Shapers. Bij de Baron, de Sentinel PRO, de Dial '
   'Master, de Edge Blade en de Blade Guards niet. De keuzehulp bovenaan heeft daar een aparte vraag voor.'),
  ('Hoe vaak moet ik de scheerkop vervangen?',
   'Merk je dat hij trekt of minder pakt, dan is het zover. De <b>scheerkop van de Gentleman Shaver ligt '
   'apart op voorraad vanaf &euro;19,95</b> en de <b>mesjes van de Blade Guard vanaf &euro;9,95</b>. '
   'Een bot mes kost je dus geen nieuw apparaat.'),
  ('Wat als het me toch niet bevalt?',
   'Je hebt 100 dagen om het thuis te proberen, zonder reden op te geven. Je meldt de retour aan en hebt '
   'daarna veertien dagen om te versturen; <b>de verzendkosten van de retour zijn voor jou</b>, het '
   'aankoopbedrag krijg je binnen veertien dagen terug.'),
 ],
 anderezones=[
  ('Lichaam &amp; schaamstreek', 'Trimmen zonder wondjes.', '4 apparaten &rarr;', '#'),
  ('Hoofd', 'Tondeuses en hoofdscheerders.', '4 apparaten &rarr;', '#'),
  ('Neus &amp; oren', 'Detailwerk zonder trekken.', '8 apparaten &rarr;', '#'),
  ('Alles bij elkaar', 'De hele collectie, per zone gesorteerd.', 'Bekijk alles &rarr;', W + '/collections/all'),
 ],
)
