# -*- coding: utf-8 -*-
from zg_engine import W, RETOUR, SCHILDV, TRUCK, KLOK

P = W + '/products/'
C = W + '/collections/'
SVG_ZONES = open('svg_alles.txt', encoding='utf-8').read()

def app(**k):
    k.setdefault('chips', [])
    return k

LICHAAM = [
 app(id='gg', img='gg_los', naam='Groom Guard&trade;', tag='37&times; deze maand',
     wat='De basis voor lichaam en schaamstreek, met licht waar je kijkt.',
     score=4.9, aantal=192, chips=['SkinSafe&trade;', 'LED-licht'], prijs=44.95, van=71.35,
     url=P + 'wellshave-bodygroomer-groom-guard',
     redenen=['SkinSafe&trade; keramische kop', 'LED-licht waar je kijkt', 'Opzetkammen voor de lengte']),
 app(id='ggpro', img='ggpro_los', naam='Groom Guard&trade; PRO', tag='Ook glad afwerken',
     wat='Trimmen &eacute;n glad afwerken in dezelfde routine.',
     score=4.6, aantal=442, chips=['Foil-kop', '6.600 rpm'], prijs=59.95, van=85.65,
     url=P + 'groom-guard-pro',
     redenen=['SkinSafe&trade; keramische kop', 'Foil-kop voor de gladde finish', 'Waterdicht &mdash; IPX7']),
 app(id='flex', img='flex_los', naam='Flex Guard&trade; 3-in-1', tag='Meest veelzijdig',
     wat='Bodytrimmer, neustrimmer en foil-kop in &eacute;&eacute;n.',
     score=4.6, aantal=551, chips=['3-in-1', '6 in de doos'], prijs=54.95, van=85.65,
     url=P + 'wellshave-flex-guard%E2%84%A2',
     redenen=['Drie opzetstukken in &eacute;&eacute;n', '7.000 toeren, LED-display', 'Waterdicht &mdash; IPX7']),
 app(id='dual', img='dual_los', naam='Dual Groomer&trade; 2-in-1', tag='Laagste prijs',
     wat='Lichaam en neushaar in &eacute;&eacute;n apparaat, in twee snelheden.',
     score=4.9, aantal=145, chips=['2-in-1', '2 snelheden'], prijs=39.95, van=79.92,
     url=P + 'wellshave-2-in-1-bodygroomer-mannen',
     redenen=['SkinSafe&trade; mes', 'Neusopzetstuk meegeleverd', 'Twee snelheden']),
]

GEZICHT = [
 app(id='sentinel', img='sentinel', naam='The Sentinel PRO', tag='Nieuw &middot; met station',
     wat='Reinigt en laadt zichzelf op in het station.',
     chips=['Reinigingsstation', '6 in de doos'], prijs=89.95, van=109.95, url=P + 'the-sentinel-pro',
     geenscore='Nieuw &middot; nog geen beoordelingen',
     redenen=['Automatisch reinigen en opladen', 'Reinigingsvloeistof meegeleverd', 'Zes onderdelen in de doos']),
 app(id='gentleman', img='gentleman', naam='The Gentleman Shaver&trade;', tag='26&times; deze maand',
     wat='Scheren, baardtrimmen en neushaar op &eacute;&eacute;n standaard.',
     score=4.6, aantal=460, chips=['Oplaadstandaard', '7 in de doos'], prijs=49.95, van=85.65,
     url=P + 'wellshave-scheerapparaat-elite',
     redenen=['Neus- en oorhaaropzetstuk in de doos', 'Baardtrimmer en kammen 3-6-9 mm', 'LCD en oplaadstandaard']),
 app(id='baron', img='baron', naam='4 Foil Blade Baron&trade;', tag='Compact',
     wat='Foilkop voor korte stoppels, nat en droog.',
     score=4.7, aantal=639, chips=['4D-bladen', '3 in de doos'], prijs=49.95, van=73.50,
     url=P + 'wellshave-blade-baron',
     redenen=['Meerdere bladen grijpen meer haar', 'Nat en droog te gebruiken', 'Past in elke toilettas']),
 app(id='elegant', img='elegant4', naam='Scheerapparaat Elegant&trade; 4-in-1', tag='Meeste voor je geld',
     wat='Scheren, neushaar, sidetrimmer en baardtrimmer.',
     score=4.7, aantal=655, chips=['4-in-1', '6 in de doos'], prijs=39.95, van=79.92,
     url=P + 'wellshave-4-in-1-scheerapparaat',
     redenen=['Neus- en oorhaaropzetstuk in de doos', 'Sidetrimmer voor de bakkebaarden', 'Baardtrimmer erbij']),
 app(id='supreme', img='supreme', naam='Men Shaper Supreme&trade; 6-in-1', tag='Meest compleet',
     wat='Zes opzetstukken, inclusief micro shaver en neushaar.',
     score=4.6, aantal=219, chips=['6 opzetstukken', '12 in de doos'], prijs=39.95, van=71.35,
     url=P + '6-in-1-baardtrimmer-supreme',
     redenen=['T-Blade, precisietrimmer en micro shaver', 'Neus- en oorhaaropzetstuk', 'Verstelbaar 1&ndash;9 mm']),
 app(id='msiced', img='msiced', naam='Men Shaper Iced&trade; 5-in-1', tag='Laagste prijs van het paar',
     wat='Vijf opzetstukken, elf onderdelen, in de Iced-afwerking.',
     score=4.6, aantal=768, chips=['5 opzetstukken', '11 in de doos'], prijs=33.95, van=57.15,
     url=P + 'wellshave-5-in-1-baardtrimmer-man-shaper-iced',
     redenen=['T-Blade en precisietrimmer', 'Neus- en oorhaaropzetstuk', 'Standaard en travelbag erbij']),
 app(id='msgold', img='msgold', naam='Men Shaper Gold&trade; 5-in-1', tag='Zelfde set, in goud',
     wat='Exact dezelfde elf onderdelen als de Iced, in goud.',
     score=4.6, aantal=493, chips=['5 opzetstukken', '11 in de doos'], prijs=36.95, van=79.92,
     url=P + 'wellshave-5-in-1-baardtrimmer-men-shaper',
     redenen=['Dezelfde vijf opzetstukken als de Iced', 'Neus- en oorhaaropzetstuk', 'Gouden afwerking']),
 app(id='dial', img='dialmaster', naam='The Dial Master', tag='Nieuw',
     wat='Twintig lengtestanden op &eacute;&eacute;n draaiknop.',
     chips=['20 standen', 'IPX7'], prijs=34.95, van=54.95, url=P + 'the-dial-master',
     geenscore='Nieuw &middot; nog geen beoordelingen',
     redenen=['20 nauwkeurige lengtestanden', 'Geen kammen wisselen', 'IPX7 met LED-display']),
 app(id='edge', img='edgeblade', naam='Edge Blade', tag='Voor de lijnen',
     wat='4D-flexkop met korte kammen: 1, 2, 3 en 5 mm.',
     score=4.6, aantal=98, chips=['4D-flexkop', '1&ndash;5 mm'], prijs=33.95, van=54.95,
     url=P + 'wellshave-edge-blade',
     redenen=['Flexkop volgt kaaklijn en hals', 'Kammen van 1 tot 5 mm', 'Volledig waterdicht']),
 app(id='bgold', img='bgold', naam='Blade Guard Gold', tag='Klassiek',
     wat='Klassiek scheermes met wisselbare mesjes.',
     chips=['Skin-Safe', '3 in de doos'], prijs=19.95, van=21.58,
     url=P + 'wellshave-safety-razor-gold', geenscore='Nog geen beoordelingen',
     redenen=['Geen batterij, geen oplader', 'Mesjes los verkrijgbaar', 'Gouden uitvoering']),
 app(id='bblack', img='bblack', naam='Blade Guard Black', tag='Zelfde mes, in zwart',
     wat='Dezelfde drie onderdelen, in zwart, voor dezelfde prijs.',
     chips=['Skin-Safe', '3 in de doos'], prijs=19.95, van=21.58,
     url=P + 'wellshave-safety-razor-black', geenscore='Nog geen beoordelingen',
     redenen=['Dezelfde inhoud als de Gold', 'Zwarte uitvoering', 'Zelfde prijs']),
]

HOOFD = [
 app(id='hs', img='headshaver', naam='Head Shaver Deluxe', tag='Meest gekozen',
     wat='Zeven roterende koppen die de bolling van je schedel volgen.',
     score=4.8, aantal=351, chips=['7D-kop', '7.000 rpm'], prijs=54.95, van=64.95,
     url=P + 'wellshave-5-in-1-scheerapparaat-mannen-deluxe',
     redenen=['7D-scheerkop volgt de contouren', 'SkinSafe tegen wondjes', 'Krachtige 7.000 rpm-motor']),
 app(id='ele', img='tonelegant', naam='Tondeuse Elegant&trade;', tag='Kapperskwaliteit',
     wat='Fades en contouren met een verstelbare hendel.',
     score=4.8, aantal=260, chips=['Fade-hendel', 'Metalen huis'], prijs=59.95, van=92.79,
     url=P + 'wellshave-tondeuse-elegant',
     redenen=['Verstelbare fade-hendel', 'Knipt zonder trekken', 'Robuuste metalen behuizing']),
 app(id='sharp', img='sharpline', naam='Detailtrimmer Sharpline&trade;', tag='Voor de lijnen',
     wat='Strakke randen, nek- en baardlijn in &eacute;&eacute;n haal.',
     score=4.7, aantal=139, chips=['3 opzetstukken', 'Smal mes'], prijs=49.95, van=85.65,
     url=P + 'detailtrimmer-sharpline%E2%84%A2',
     redenen=['Strakke lijnen in enkele bewegingen', 'Snijdt door dik en stug haar', 'Drie opzetstukken']),
 app(id='del', img='tondeluxe', naam='Tondeuse Deluxe&trade;', tag='Tijdelijk uitverkocht',
     uitverkocht=True, wat='Dezelfde fade-hendel, met een brushless motor.',
     score=4.8, aantal=321, chips=['Brushless', 'Fade-hendel'], prijs=69.95, van=99.95,
     url=P + 'wellshave-tondeuse-mannen-deluxe',
     voet='Tijdelijk niet leverbaar &mdash; hij neemt drie Barber Bro-sets met zich mee',
     redenen=['Brushless 2838-motor', 'Verstelbare fade-hendel', 'Metalen behuizing']),
]

NEUS = [
 app(id='ultra', img='nsultra', naam='Neustrimmer 4in1 Ultra&trade;', tag='Best verkocht',
     wat='Neus, oren, wenkbrauwen, kort scheren &eacute;n de baardlijn.',
     chips=['4 opzetstukken', '6 in de doos'], prijs=32.95, van=36.95, url=P + 'neustrimmer-4in1-ultra',
     redenen=['57&times; besteld in 30 dagen', 'SkinGuard tegen wondjes', 'Baardtrimmer-opzetstuk erbij']),
 app(id='plat', img='nsplatinum', naam='Neustrimmer 3in1 Platinum&trade;', tag='Nieuwe lijn',
     wat='Plus een shaver-opzetstuk voor kort haar.',
     chips=['3 opzetstukken', '5 in de doos'], prijs=29.95, van=32.95, url=P + 'neustrimmer-3in1-platinum',
     redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen', 'Shaver-opzetstuk']),
 app(id='elite', img='nselite', naam='Neustrimmer 2in1 Elite&trade;', tag='Nieuwe lijn',
     wat='Plus een detailtrimmer voor wenkbrauwen en lijntjes.',
     chips=['2 opzetstukken', '4 in de doos'], prijs=23.95, van=29.95, url=P + 'neustrimmer-2in1-elite',
     redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen', 'USB-C, compact']),
 app(id='ess', img='nsessential', naam='Neustrimmer Essential&trade;', tag='Instap, nieuwe lijn',
     wat='Alleen neus en oren, zonder extra opzetstukken.',
     chips=['1 opzetstuk', '3 in de doos'], prijs=19.95, van=23.95, url=P + 'neustrimmer-essential',
     redenen=['Neus- en oorhaar zonder trekken', 'E&eacute;n knop', 'USB-C oplaadbaar']),
 app(id='ultimate', img='nsultimate', naam='Neustrimmer Ultimate&trade; 4-in-1', tag='Grootste voordeel',
     wat='Neus, wenkbrauwen, kort scheren &eacute;n lichaamshaar.',
     chips=['4 opzetstukken', '6 in de doos'], prijs=29.95, van=50.00,
     url=P + 'wellshave-4-in-1-neustrimmer-ultimate',
     redenen=['Bodygroomer-opzetstuk erbij', 'SkinGuard tegen wondjes', 'Zes onderdelen in de doos']),
 app(id='adv', img='nsadvance', naam='Neustrimmer Advance&trade; 3-in-1', tag='Vertrouwde lijn',
     wat='Neustrimmer, detailtrimmer en shaver in &eacute;&eacute;n.',
     chips=['3 opzetstukken', '5 in de doos'], prijs=24.95, van=48.25,
     url=P + 'wellshave-3-in-1-neustrimmer-advance',
     redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen', 'Shaver-opzetstuk']),
 app(id='prem', img='nspremium', naam='Neustrimmer Premium&trade; 2-in-1', tag='Vertrouwde lijn',
     wat='Neustrimmer met detailtrimmer voor wenkbrauwen.',
     chips=['2 opzetstukken', '4 in de doos'], prijs=19.95, van=35.65,
     url=P + 'wellshave-2-in-1-neustrimmer-premium',
     redenen=['Neus- en oorhaar zonder trekken', 'Detailtrimmer voor wenkbrauwen', 'USB oplaadbaar']),
 app(id='basic', img='nsbasic', naam='Neustrimmer Basic&trade;', tag='Laagste prijs',
     wat='Alleen neus en oren, en verder niets.',
     chips=['1 opzetstuk', '3 in de doos'], prijs=16.95, van=29.92,
     url=P + 'wellshave-neustrimmer-basic',
     redenen=['Neus- en oorhaar zonder trekken', 'E&eacute;n druk op de knop', 'USB-C oplaadbaar']),
]

SETS = [
 dict(id='spult', img='spult_los', naam='Shave Package Ultimate&trade;', tag='Duurste set', doos=8,
      prijs=89.95, van=142.80, url=P + 'shave-package-ultimate',
      wat='Lichaam, neus en detailwerk in &eacute;&eacute;n doos.'),
 dict(id='flexbundel', img='flexbundel_los', naam='Flex-line Bundel', tag='Grootste voordeel', doos=9,
      prijs=89.95, van=156.60, url=P + 'body-beard-kit',
      wat='Flex Guard met foilkop, neushaaropzetstuk en de Sharpline-detailtrimmer.'),
 dict(img='essflex', naam='Essential Flex Bundel', tag='Bundel', doos=8, prijs=79.95, van=133.25,
      url=P + 'essential-flex-bundel',
      wat='Flex Guard met foilkop, extra Skin-Safe mes, toilettas en hard case.'),
 dict(id='sp30', img='sp30_los', naam='Shave Package 3.0', tag='Bundel', doos=9, prijs=64.95, van=99.95,
      url=P + 'wellshave-shave-package-3-0',
      wat='Verzorgingsbundel met neustrimmer en alle vier de opzetstukken.'),
 dict(img='bnbundel_los', naam='Body &amp; Nose Bundel', tag='Bundel', doos=7, prijs=59.95, van=85.65,
      url=P + 'wellshave-shave-package-2-0', wat='De neustrimmer samen met een bodygroomer.'),
 dict(img='skull1', naam='Skull Deal 1.0', tag='Hoofdset', doos=6, prijs=59.95, van=69.95,
      url=P + 'skull-shaver-deluxe-extra-magnetische-scheerkop',
      wat='De Head Shaver met een extra magnetische scheerkop.'),
 dict(img='skull2', naam='Skull Deal 2.0', tag='Hoofdset', doos=7, prijs=64.95, van=74.96,
      url=P + 'skull-deal-2-0', wat='Van stoppels naar glad, met opbergtas erbij.'),
 dict(img='skull3', naam='Skull Deal 3.0', tag='Hoofdset', doos=8, prijs=69.95, van=79.95,
      url=P + 'skull-deal-3-0', wat='De ruimste hoofdset: extra kop, tas en hard case.'),
 dict(img='bpack1', naam='Barber Pack 1.0', tag='Barberset', doos=8, prijs=99.95, van=109.95,
      url=P + 'barber-pack-1-0', wat='Tondeuse Elegant en detailtrimmer, voor haar en lijnen.'),
 dict(img='bpack2', naam='Barber Pack 2.0', tag='Barberset', doos=10, prijs=114.95, van=124.95,
      url=P + 'barber-pack-2-0', wat='Met foil shaver erbij voor de gladde afwerking.'),
 dict(id='bpack3', img='bpack3', naam='Barber Pack 3.0', tag='Meest compleet', doos=11,
      prijs=124.95, van=134.95, url=P + 'barber-pack-3-0',
      wat='De all-in set: haar, baard, fades, afwerking en neushaar.'),
 dict(img='bbro1', naam='Barber Bro 1.0', tag='Tijdelijk uitverkocht', uitverkocht=True, doos=7,
      prijs=89.95, van=99.95, url=P + 'barber-bro-1-0',
      wat='Dezelfde set als de Barber Pack, maar met de Tondeuse Deluxe.',
      voet='Wacht op de Tondeuse Deluxe'),
 dict(img='bbro2', naam='Barber Bro 2.0', tag='Tijdelijk uitverkocht', uitverkocht=True, doos=9,
      prijs=99.95, van=109.95, url=P + 'barber-bro-2-0',
      wat='Met foil shaver erbij, rond de Tondeuse Deluxe gebouwd.',
      voet='Wacht op de Tondeuse Deluxe'),
 dict(img='bbro3', naam='Barber Bro 3.0', tag='Tijdelijk uitverkocht', uitverkocht=True, doos=11,
      prijs=109.95, van=119.95, url=P + 'barber-bro-3-0',
      wat='De ruimste Bro-set, inclusief neustrimmer.',
      voet='Wacht op de Tondeuse Deluxe'),
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
 dict(img='kop7d', naam='Head Shaver&trade; 7D Scheerkop', kicker='Scheerkop',
      wat='Voor de Head Shaver Deluxe en de Skull Deals.', prijs=14.95, van=29.92,
      url=P + 'wellshave-scheerkop-7d-vervanging', voet='18&times; besteld in de afgelopen 30 dagen'),
 dict(img='gskop', naam='The Gentlemen Shaver&trade; Scheerkop', kicker='Scheerkop',
      wat='Vervangende kop voor The Gentleman Shaver.', prijs=19.95, van=28.50,
      url=P + 'elite-scheerkop'),
 dict(img='foil_los', naam='Foil shaver Groom Guard', kicker='Scheerkop',
      wat='Foil-opzetkop voor de Groom Guard&trade;-lijn.', prijs=14.95, van=21.58,
      url=P + 'foil-shaver-groom-guard'),
 dict(img='bgblades', naam='Blade Guard Blades', kicker='Mesjes',
      wat='Vijf reservemesjes voor de Blade Guard.', prijs=9.95, van=9.92,
      url=P + 'wellshave-safety-razor-blades'),
 dict(img='cleanup', naam='CleanUp Bar', kicker='Schoonmaak',
      wat='Veegt de wastafel schoon na het trimmen of scheren.', prijs=12.95, van=29.92,
      url=P + 'wellshave-baardbar'),
 dict(img='hardcase', naam='The Hard Case', kicker='Opbergen',
      wat='Harde koffer voor apparaat, koppen en kabel.', prijs=14.95, van=21.95,
      url=P + 'wellshave-hard-case'),
 dict(img='washbag', naam='The Washbag&trade;', kicker='Opbergen',
      wat='Toilettas voor apparaat, koppen en kabel.', prijs=19.95, van=28.50,
      url=P + 'toiletry-bag'),
 dict(img='travelbag', naam='Travelbag', kicker='Opbergen',
      wat='Zachte tas voor onderweg.', prijs=8.95, van=10.95, url=P + 'travelbag'),
]

ZONE = dict(
 titel='Collectie Alle producten',
 kicker='Collectiepagina-redesign &middot; de hele collectie',
 h1='Zesenzestig producten, waarvan er drieënvijftig te koop zijn',
 sub='De overkoepelende pagina heeft een andere taak dan een zonepagina: niet kiezen tussen vier '
     'apparaten die op elkaar lijken, maar de bezoeker in &eacute;&eacute;n scherm naar de juiste zone '
     'brengen. Daarom staat hier een zonekiezer in plaats van een productkeuzehulp, en is het raster in '
     'vier zones gesorteerd in plaats van in &eacute;&eacute;n rij van drieënvijftig. '
     'Alles komt uit de collectie <code>all</code> in Shopify, uitgelezen op 24 augustus.',

 auditkop='Wat er op /collections/all niet klopt',
 auditintro='Uitgelezen op de collectie <code>all</code> (66 producten, <code>sortOrder: MANUAL</code>) '
            'met status, voorraad en tags per product. Elk punt hieronder is de reden dat er iets in dit '
            'ontwerp staat &mdash; of juist niet.',
 audit=[
  ('Dertien van de 66 producten horen er niet te staan', 'Vijf zijn <b>gearchiveerd</b> (Barber Bundel 2.0, '
   'Wellshave Tondeuse Pro en drie oude Safety Razors: Ros&eacute;, Silver en Matt Grey), vijf staan op '
   '<b>concept</b> (twee Women Shapers en drie neustrimmer-opzetstukken), twee zijn de '
   '<b>MIJU-testkopie&euml;n</b> van de Groom Guard PRO, en &eacute;&eacute;n is het losse '
   'neustrimmer-opzetstuk met voorraad&nbsp;0. Ze zijn niet allemaal zichtbaar in de winkel, maar ze '
   'zitten wel in de collectie en tellen dus mee in elke telling die je erop baseert.'),
  ('Twee van de vier zones bestaan niet als tag', 'Er is een <code>zone:gezicht</code> en een '
   '<code>zone:hoofd</code>. Voor lichaam en voor neus is er niets: die draaien op de oude productlabels '
   '<code>Bodygroomer</code> en <code>Neushaar trimmer</code>. En de vier nieuwste neustrimmers &mdash; '
   'Ultra, Platinum, Elite en Essential &mdash; hebben <b>helemaal geen tags</b>, net als de Essential '
   'Flex Bundel, Barber Bro 1.0 en 2.0 en de Flex Guard Trio Pack. Op de huidige tags is dit ontwerp dus '
   'niet te bouwen; die moeten eerst compleet.'),
  ('De zonecollecties die er w&eacute;l zijn, tellen verkeerd', 'De collectie '
   '<code>zone-gezicht</code> staat op <b>14 producten</b>, waarvan er drie gearchiveerd zijn: het '
   'antwoord is 11, en de homepage rekent op zijn beurt met 8. <code>zone-hoofd</code> staat op '
   '<b>5</b>, inclusief de gearchiveerde Tondeuse Pro: het antwoord is 4. Twee zonepagina&rsquo;s, twee '
   'verkeerde tellingen, en een homepage die er weer andere getallen naast zet.'),
  ('Zestien collecties, met overlap en een verkeerde naam', 'Naast <code>all</code> staan er vijftien '
   'collecties, waaronder <code>bodygroomers</code>&nbsp;(6, inclusief de twee MIJU-testkopie&euml;n), '
   '<code>neustrimmers</code>&nbsp;(8 &mdash; die is dus w&eacute;l compleet en kan meteen als zone '
   'dienen), en drie overlappende salecollecties: <code>deals-bundels</code>&nbsp;(59), '
   '<code>summer-sale-deals</code>&nbsp;(19) en <code>winter-sale</code>&nbsp;(24), die '
   '&ldquo;Voorjaar Sale&rdquo; hei&euml;t. Voordat de zonestructuur erbij komt, hoort deze lijst '
   'opgeruimd te worden.'),
  ('E&eacute;n uitverkocht apparaat neemt er vier mee', 'De <b>Tondeuse Deluxe</b> staat op '
   'voorraad&nbsp;&minus;3. Alle drie de <b>Barber Bro-sets</b> zijn rond precies die tondeuse gebouwd en '
   'staan daarom ook op &minus;3. Vier verkoopbare kaarten die geen van alle leverbaar zijn, zonder dat '
   'de pagina dat toont.'),
  ('De sortering staat met de hand vast', '<code>sortOrder: MANUAL</code> over 66 producten. De '
   '<b>Neustrimmer 4in1 Ultra</b> is met 57 bestellingen in dertig dagen het best verkopende apparaat van '
   'de hele collectie en staat op plek 52. De volgorde beweegt niet mee met verkoop, voorraad of seizoen.'),
  ('Drie hoofdsets staan als gezichtsproduct', 'Skull Deal 1.0, 2.0 en 3.0 dragen de tag '
   '<code>Scheerapparaat gezicht</code>, terwijl het sets rond de hoofdscheerder zijn. Wie op gezicht '
   'filtert krijgt drie hoofdsets; wie op hoofd filtert mist ze.'),
  ('Er ligt een hele productlijn klaar op concept', 'De <b>Women Shaper 4-in-1 en 5-in-1</b> staan op '
   'concept met 209 stuks voorraad elk. Dat is geen collectiefout, maar het is wel de grootste post in '
   'deze telling die nog niets doet.'),
  ('Cijfers verlopen, dus ze horen niet vast te staan', 'De <b>Flex Guard 3-in-1</b> stond bij het ontwerp '
   'van de bodygroomerpagina nog op nul beoordelingen en staat nu op <b>4,6 uit 551</b>. Precies daarom '
   'moeten score, aantal, voorraad en verkoopaantallen in de bouw live uit Shopify en Loox komen.'),
 ],

 bloknotities=[
  ('Kop, zonekiezer en zonebalk',
   'Hier staat <b>geen productkeuzehulp maar een zonekiezer</b>: op deze pagina is de vraag niet '
   '&ldquo;welke van deze vier&rdquo; maar &ldquo;waar wil ik beginnen&rdquo;. Twee vragen &mdash; de zone '
   'en of je &eacute;&eacute;n apparaat of een complete set zoekt &mdash; leiden naar acht uitkomsten: '
   'per zone het best verkopende apparaat, of de ruimste set. '
   'De foto is een band van vier eigen foto&rsquo;s, &eacute;&eacute;n per zone, in plaats van '
   '&eacute;&eacute;n beeld dat de collectie niet dekt. <b>Speel met de vragen.</b>'),
  ('Het raster',
   'Zes groepen: de vier zones, de sets en de onderdelen. Elke zonegroep heeft een eigen kop met een link '
   'naar de zonepagina, want daar staat de keuzehulp die binnen die zone kiest. '
   '<b>Geen vergelijker op deze pagina:</b> vergelijken hoort binnen &eacute;&eacute;n zone, tussen '
   'apparaten die hetzelfde werk doen &mdash; een Head Shaver naast een neustrimmer leggen helpt niemand. '
   '<b>De Tondeuse Deluxe en de drie Barber Bro&rsquo;s staan grijs</b>, met de reden erbij. '
   'De kaart, de hover en het monogram komen letterlijk uit <code>assets/ws-bestsellers.css</code>.'),
  ('Waar begin je',
   'De uitleg semantisch: &eacute;&eacute;n <code>&lt;section&gt;</code>, een <code>h2</code> met de vraag, '
   'twee <code>h3</code>&rsquo;s, echte alinea&rsquo;s, een <code>&lt;ol&gt;</code> voor de tips en '
   'beschrijvende links naar de vier zonecollecties. De tekening is een kaart van de vier zones op '
   '&eacute;&eacute;n figuur &mdash; dat is precies wat deze pagina moet uitleggen en wat geen enkele '
   'zonepagina kan tonen.'),
  ('Wat kopers schrijven',
   'Drie beoordelingen uit drie verschillende zones, elk aan het apparaat waar hij over gaat, met foto, '
   'link en de score van d&aacute;t apparaat. Op de overkoepelende pagina is de spreiding het punt: '
   'de bezoeker weet nog niet waar hij hoort, dus het bewijs moet uit meer dan &eacute;&eacute;n hoek komen.'),
  ('Zekerheden, vragen en de vier zones',
   'De afsluitende band: de garanties met icoon (op mobiel een schuifstrip, op desktop &eacute;&eacute;n '
   'rij van vier), vijf vragen die over de hele collectie gaan, en de vier zones als uitgang. '
   '<b>De vragen klappen open.</b>'),
 ],

 openvragen=[
  '<b>De zones eerst compleet maken.</b> Er is geen <code>zone:lichaam</code> en geen '
  '<code>zone:neus</code>, en de vier nieuwste neustrimmers hebben helemaal geen tag. De collectie '
  '<code>neustrimmers</code> klopt wel (8 producten) en kan meteen als zone dienen; voor lichaam moet '
  '<code>bodygroomers</code> eerst van de twee MIJU-kopie&euml;n af. Zonder dat kan geen van de vier '
  'zonepagina&rsquo;s automatisch gevuld worden.',
  '<b>Dertien producten uit de collectie halen.</b> Vijf gearchiveerd, vijf concept, twee MIJU-kopie&euml;n '
  'en &eacute;&eacute;n uitverkocht opzetstuk. Zolang ze erin zitten, klopt geen enkele telling.',
  '<b>De sortering.</b> <code>MANUAL</code> over 66 producten betekent dat het best verkopende apparaat op '
  'plek 52 staat. Op verkoop of op voorraad sorteren is hier de grootste winst met de minste moeite.',
  '<b>De Tondeuse Deluxe.</b> Zolang die op &minus;3 staat, staan er vier onverkoopbare kaarten in de '
  'collectie. Bijbestellen, of de Barber Bro&rsquo;s tijdelijk verbergen.',
  '<b>De Women Shaper-lijn.</b> Twee producten op concept met 209 stuks voorraad elk. Publiceren zou een '
  'vijfde zone opleveren; dit ontwerp gaat er nog niet van uit.',
  '<b>Gratis verzending: &euro;30 of &euro;50.</b> De balk zegt &euro;30, de SEO-tekst &euro;50. Ik heb '
  '&euro;30 aangehouden, gelijk aan de vier zonepagina&rsquo;s.',
 ],

 # ── blok 1
 eyebrow='Alle producten &middot; 27 apparaten in 4 zones',
 h1a='Alles wat eraf moet.',
 h1b='Per plek, niet per merk.',
 lede='Vier zones, ieder met eigen gereedschap: trimmen zonder wondjes, scheren of op lengte houden, '
      'het hoofd, en het detailwerk. Zeg waar je wilt beginnen en je staat meteen op de goede plek.',
 heroalt='Vier Wellshave-apparaten in gebruik: bodygroomer, baardtrimmer, hoofdscheerder en neustrimmer',
 zonescore=4.6,
 zonescoretekst='4,6/5',
 zonescorebron='Groom Guard&trade; PRO (442)',
 quote='Was een beetje bunzig om mijn zak te scheren, maar met deze groomer is dat appeltje eitje. '
       'Geen wondjes en een glad resultaat. En dat voor de eerste keer.',
 quotebron='Makketakker &middot; geverifieerde koper &middot; Groom Guard&trade; PRO',
 geruststellers=[(RETOUR, '100 dagen proberen'), (SCHILDV, '2 jaar garantie'), (TRUCK, 'Morgen in huis')],
 kaartkop='Waar wil je beginnen?',
 kaartsub='2 keuzes &middot; direct de goede zone',
 kaartvraag='Zeg waar, dan zoeken wij het uit.',
 vragen=[
  dict(groep='zone', start='lichaam', vraag='Waar wil je aan de slag?',
       opties=[('lichaam', 'Lichaam'), ('gezicht', 'Gezicht &amp; baard'),
               ('hoofd', 'Hoofd'), ('neus', 'Neus &amp; oren')]),
  dict(groep='vorm', start='los', vraag='Wat zoek je?',
       opties=[('los', 'E&eacute;n apparaat'), ('set', 'Een complete set')]),
 ],
 woord={'zone': {'lichaam': 'lichaam', 'gezicht': 'gezicht en baard', 'hoofd': 'hoofd',
                 'neus': 'neus en oren'},
        'vorm': {'los': 'één apparaat', 'set': 'complete set'}},
 tabel=[
  {'w': {'zone': 'lichaam', 'vorm': 'los'}, 'id': 'gg'},
  {'w': {'zone': 'lichaam', 'vorm': 'set'}, 'id': 'spult'},
  {'w': {'zone': 'gezicht', 'vorm': 'los'}, 'id': 'gentleman'},
  {'w': {'zone': 'gezicht', 'vorm': 'set'}, 'id': 'flexbundel'},
  {'w': {'zone': 'hoofd', 'vorm': 'los'}, 'id': 'hs'},
  {'w': {'zone': 'hoofd', 'vorm': 'set'}, 'id': 'bpack3'},
  {'w': {'zone': 'neus', 'vorm': 'los'}, 'id': 'ultra'},
  {'w': {'zone': 'neus', 'vorm': 'set'}, 'id': 'sp30'},
 ],
 standaardmatch='gg',
 matches=[
  dict(id='gg', img='gg_los', naam='Groom Guard&trade;', badge='37&times; besteld in 30 dagen',
       zin='De meest verkochte bodygroomer: keramische kop achter een kam, met licht waar je kijkt.',
       redenen=['SkinSafe&trade; keramische kop', 'LED-licht waar je kijkt', '4,9 uit 192 beoordelingen'],
       prijs=44.95, van=71.35, url=P + 'wellshave-bodygroomer-groom-guard'),
  dict(id='spult', img='spult_los', naam='Shave Package Ultimate&trade;', badge='Acht onderdelen',
       zin='Lichaam, neus en detailwerk in &eacute;&eacute;n doos &mdash; samen goedkoper dan los.',
       redenen=['Acht onderdelen in de doos', 'Bodygroomer &eacute;n neustrimmer',
                'De ruimste set in de collectie'],
       prijs=89.95, van=142.80, url=P + 'shave-package-ultimate'),
  dict(id='gentleman', img='gentleman', naam='The Gentleman Shaver&trade;', badge='26&times; besteld in 30 dagen',
       zin='Roterend scheren, met een neus- en oorhaaropzetstuk en een baardtrimmer in dezelfde doos.',
       redenen=['Neus- en oorhaaropzetstuk meegeleverd', 'Baardtrimmer en kammen 3-6-9 mm',
                'LCD-display en oplaadstandaard'],
       prijs=49.95, van=85.65, url=P + 'wellshave-scheerapparaat-elite'),
  dict(id='flexbundel', img='flexbundel_los', naam='Flex-line Bundel', badge='Grootste voordeel',
       zin='Negen onderdelen voor gezicht, baard en lichaam, inclusief de Sharpline-detailtrimmer.',
       redenen=['Flex Guard met foilkop', 'Sharpline-detailtrimmer erbij',
                'Negen onderdelen in de doos'],
       prijs=89.95, van=156.60, url=P + 'body-beard-kit'),
  dict(id='hs', img='headshaver', naam='Head Shaver Deluxe', badge='Best beoordeeld',
       zin='Zeven roterende koppen die de bolling van je schedel volgen, ook aan de achterkant.',
       redenen=['7D-kop volgt de contouren', '4,8 uit 351 beoordelingen', '7.000 rpm-motor'],
       prijs=54.95, van=64.95, url=P + 'wellshave-5-in-1-scheerapparaat-mannen-deluxe'),
  dict(id='bpack3', img='bpack3', naam='Barber Pack 3.0', badge='Meest compleet',
       zin='Tondeuse, detailtrimmer, foil shaver en neustrimmer &mdash; alles voor haar, baard en fades.',
       redenen=['Elf onderdelen in de doos', 'Foil shaver voor de afwerking',
                'Ook een neustrimmer erbij'],
       prijs=124.95, van=134.95, url=P + 'barber-pack-3-0'),
  dict(id='ultra', img='nsultra', naam='Neustrimmer 4in1 Ultra&trade;', badge='Best verkocht van de collectie',
       zin='Het meest bestelde apparaat van de afgelopen dertig dagen, met vier opzetstukken.',
       redenen=['57&times; besteld in 30 dagen', 'Neus, oren, wenkbrauwen en baardlijn',
                'SkinGuard tegen wondjes'],
       prijs=32.95, van=36.95, url=P + 'neustrimmer-4in1-ultra'),
  dict(id='sp30', img='sp30_los', naam='Shave Package 3.0', badge='Negen onderdelen',
       zin='De neustrimmer met alle vier de opzetstukken, plus de verzorging eromheen.',
       redenen=['Negen onderdelen in de doos', 'Alle vier de neusopzetstukken',
                'Voordeliger dan los samengesteld'],
       prijs=64.95, van=99.95, url=P + 'wellshave-shave-package-3-0'),
 ],
 zonenaam='Alle zones',
 aantal='27',
 zoneslot='plus 14 sets en 12 onderdelen.',
 tellingen=[('Alle zones', '27', '#'), ('Lichaam &amp; schaamstreek', '4', '#'),
            ('Gezicht &amp; baard', '11', '#'), ('Hoofd', '4', '#'), ('Neus &amp; oren', '8', '#')],

 vergelijken=False,

 # ── blok 2
 filters=[('alles', 'Alles', 53), ('app', 'Apparaten', 27), ('bundel', 'Sets', 14),
          ('mes', 'Onderdelen', 12)],
 startregel='lichaam &middot; &eacute;&eacute;n apparaat',
 totaal=53,
 groepen=[
  dict(cat='app', soort='app', kop='Lichaam &amp; schaamstreek',
       sub='Vier bodygroomers met een keramisch mes achter een kam.',
       link=('Alles in deze zone', C + 'bodygroomers'), items=LICHAAM),
  dict(cat='app', soort='app', kop='Gezicht &amp; baard',
       sub='Elf apparaten: scheren tot glad, trimmen op lengte, of klassiek met een mesje.',
       link=('Alles in deze zone', C + 'zone-gezicht'), items=GEZICHT),
  dict(cat='app', soort='app', kop='Hoofd',
       sub='Vier apparaten voor kaal scheren, kort knippen en de rand.',
       link=('Alles in deze zone', C + 'zone-hoofd'), items=HOOFD),
  dict(cat='app', soort='app', kop='Neus &amp; oren',
       sub='Acht modellen op twee ladders, van &eacute;&eacute;n opzetstuk tot vier.',
       noot='<b>4,5 uit 5</b> bij deze lijn. Loox toont bij alle acht grotendeels dezelfde '
            'beoordelingenstroom met de productnaam vervangen, dus er is geen aparte score per model.',
       link=('Alles in deze zone', C + 'neustrimmers'), items=NEUS),
  dict(cat='bundel', soort='bundel', kop='Sets en bundels',
       sub='Veertien complete sets. Drie ervan wachten op de Tondeuse Deluxe.', items=SETS),
  dict(cat='mes', soort='mes', kop='Blijf scherp',
       sub='Vervang alleen wat slijt &mdash; niet het hele apparaat.', items=ONDERDELEN),
 ],
 aanbod=dict(img='spult_los', naam='Shave Package Ultimate&trade;', eyebrow='De ruimste set in de collectie',
             zin='Acht onderdelen voor lichaam, neus en detailwerk &mdash; samen goedkoper dan los.',
             prijs=89.95, van=142.80, url=P + 'shave-package-ultimate', knop='Bekijk de set'),

 # ── blok 3
 categorie=dict(
  h2a='Waar begin je in een collectie',
  h2b='van drieënvijftig artikelen?',
  alineas=[
   'Bij de plek, niet bij het apparaat. Lichaamshaar, baardhaar, hoofdhaar en neushaar groeien anders, '
   'zitten op een andere huid en vragen daarom om ander gereedschap. Een apparaat dat op je kaaklijn '
   'prima werkt, hobbelt over je schedel; een kop die veilig is in je neus komt nergens anders bij. '
   'De hele collectie is daarom in vier zones verdeeld, en elke zone heeft zijn eigen pagina met een '
   'keuzehulp die b&iacute;nnen die zone kiest.',
   'De tweede vraag is of je &eacute;&eacute;n apparaat wilt of een set. Een los apparaat doet '
   '&eacute;&eacute;n ding goed en is bijna altijd goedkoper. Een set legt er opzetstukken, een '
   'standaard, een tas en soms een tweede apparaat bij, en is per onderdeel voordeliger &mdash; maar '
   'alleen als je die onderdelen ook gebruikt. In het raster hierboven staat bij elke set hoeveel '
   'onderdelen er in de doos zitten, zodat je dat zelf kunt narekenen.',
  ],
  h3lijst='De vier zones',
  lijst=[
   ('Lichaam &amp; schaamstreek', C + 'bodygroomers',
    'Vier bodygroomers met een keramisch mes achter een kam, voor borst, rug en schaamstreek.'),
   ('Gezicht &amp; baard', C + 'zone-gezicht',
    'Elf apparaten: roterend of foil scheren, trimmen op lengte, of klassiek met een mesje.'),
   ('Hoofd', C + 'zone-hoofd',
    'Vier apparaten voor kaal scheren, kort knippen met een fade-hendel en de rand.'),
   ('Neus &amp; oren', C + 'neustrimmers',
    'Acht modellen waarvan het verschil in het aantal opzetstukken zit, niet in de motor.'),
  ],
  slotalinea='Wat slijt is de kop, niet het apparaat. Alle messen, scheerkoppen en opzetkoppen staan los '
             'in het raster hierboven en in de <a href="' + C + 'accesoires">accessoirecollectie</a>. '
             'Merk je dat een kop trekt of minder pakt, dan hoef je geen nieuw apparaat te kopen.',
  svg=SVG_ZONES,
  bijschrift='Vier zones, vier soorten gereedschap: het hoofd, de kaaklijn, het detailwerk in het midden '
             'van het gezicht, en alles van borst tot heup.',
  h3tips='Drie dingen die in elke zone gelden',
  tips=[
   ('Begin bij de langste stand', 'Je kunt altijd korter, nooit langer. Wie met de kortste kam begint, '
    'komt daar in &eacute;&eacute;n haal achter.'),
   ('Druk niet harder', 'Meer druk maakt het resultaat niet gladder, wel roder. Laat de kam of de kop op '
    'de huid rusten en beweeg rustig.'),
   ('Maak hem schoon voor je hem wegle', 'Haar tussen de messen is de eerste reden dat een apparaat gaat '
    'trekken. Uitspoelen of uitborstelen scheelt maanden.'),
  ],
 ),

 # ── blok 4
 bewijskop='Drie beoordelingen uit drie verschillende zones.',
 bewijsbron='Elke regel is een echte beoordeling bij het apparaat dat ernaast staat, geschreven door een '
            'geverifieerde koper. <b>Let op bij het lezen:</b> Loox toont bij verwante modellen soms '
            'dezelfde beoordelingenstroom met de productnaam vervangen, dus ik heb alleen regels gekozen '
            'die inhoudelijk over d&iacute;t apparaat gaan.',
 bewijs=[
  dict(img='ggpro_los', tag='Lichaam &mdash; over de eerste keer',
       tekst='Was een beetje bunzig om mijn zak te scheren, maar met deze groomer is dat appeltje eitje. '
             'Geen wondjes en een glad resultaat. En dat voor de eerste keer.',
       naam='Makketakker', product='Groom Guard&trade; PRO', url=P + 'groom-guard-pro',
       score=4.6, aantal=442),
  dict(img='headshaver', tag='Hoofd &mdash; over hoe lang het duurt',
       tekst='Vele uitvoeringen gezien, gekozen voor deze. N fijne machine die goed zijn taken verricht. '
             'Voorheen stond ik n 20 minuten met n tondeuse te scheren, nu in nog geen 8 min n strak hoofd.',
       naam='Bretb', product='Head Shaver Deluxe',
       url=P + 'wellshave-5-in-1-scheerapparaat-mannen-deluxe', score=4.8, aantal=351),
  dict(img='nsplatinum', tag='Neus &amp; oren &mdash; over het trekken',
       tekst='Prima ding. Doet wat hij moet doen, geruisloos en precies. Ook geen last van pijn door '
             'haartjes die worden uitgetrokken.',
       naam='MarkA83', product='Neustrimmerlijn', url=P + 'neustrimmer-3in1-platinum',
       bijschrift='beoordeling bij de lijn'),
 ],

 # ── blok 5
 zekerheden=[
  (RETOUR, '100 dagen thuis proberen', 'Niet goed? Je krijgt je geld terug.'),
  (SCHILDV, '2 jaar garantie', 'Op elk apparaat in de collectie.'),
  (TRUCK, 'Gratis verzending vanaf &euro;30', 'Naar Belgi&euml; gratis vanaf &euro;49,95.'),
  (KLOK, 'Morgen in huis', 'Besteld voor 23:59.'),
 ],
 faqkop='Vragen over de collectie',
 faqh2a='Alles wat je',
 faqh2b='wilt weten.',
 faq=[
  ('Ik weet nog niet waar ik moet zijn. Waar begin ik?',
   'Bij de plek. Wil je iets aan je <b>lichaam of schaamstreek</b>, dan is dat een bodygroomer; aan je '
   '<b>gezicht of baard</b> een scheerapparaat of een trimmer; aan je <b>hoofd</b> een hoofdscheerder of '
   'een tondeuse; en <b>neus- en oorhaar</b> is een eigen categorie met een afgeschermde kop. '
   'Bovenaan staat een zonekiezer die het in twee vragen voor je doet, en elke zone heeft daarna een eigen '
   'pagina met een keuzehulp die b&iacute;nnen die zone kiest.'),
  ('Kan ik niet gewoon &eacute;&eacute;n apparaat voor alles nemen?',
   'Dat kan tot op zekere hoogte. De <b>Flex Guard 3-in-1</b>, de <b>Neustrimmer Ultra</b> en de '
   '<b>Men Shaper Supreme</b> doen elk drie tot zes dingen. Maar een apparaat dat alles doet, doet meestal '
   '&eacute;&eacute;n ding goed en de rest erbij: een neusopzetstuk op een bodygroomer is geen '
   'volwaardige neustrimmer, en een bodygroomer-opzetstuk op een neustrimmer is geen bodygroomer. '
   'Doe je twee zones vaak, dan is een <b>set</b> meestal voordeliger dan twee losse apparaten.'),
  ('Wat is het verschil tussen een trimmer en een scheerapparaat?',
   'Een <b>scheerapparaat</b> brengt de huid terug naar glad en kent geen lengtes. Een <b>trimmer</b> laat '
   'juist lengte staan en heeft daar opzetkammen of een draaiknop voor. In de zone Gezicht &amp; baard '
   'staan ze naast elkaar; op de zonepagina staat een tekening die de twee soorten scheerkoppen &mdash; '
   'roterend en foil &mdash; naast elkaar zet.'),
  ('Hoe vaak moet ik een mes of scheerkop vervangen?',
   'Merk je dat hij trekt of minder pakt, dan is het zover; bij dagelijks gebruik is dat ergens tussen zes '
   'en twaalf maanden. <b>Alle messen en koppen liggen los op voorraad vanaf &euro;9,95</b> en staan in '
   'het raster hierboven onder &ldquo;Blijf scherp&rdquo;. Een bot mes kost je dus geen nieuw apparaat.'),
  ('Wat als het me toch niet bevalt?',
   'Je hebt 100 dagen om het thuis te proberen, zonder reden op te geven. Je meldt de retour aan en hebt '
   'daarna veertien dagen om te versturen; <b>de verzendkosten van de retour zijn voor jou</b>, het '
   'aankoopbedrag krijg je binnen veertien dagen terug.'),
 ],
 anderezones=[
  ('Lichaam &amp; schaamstreek', 'Trimmen zonder wondjes.', '4 apparaten &rarr;', C + 'bodygroomers'),
  ('Gezicht &amp; baard', 'Scheren, trimmen en randen zetten.', '11 apparaten &rarr;', C + 'zone-gezicht'),
  ('Hoofd', 'Tondeuses en hoofdscheerders.', '4 apparaten &rarr;', C + 'zone-hoofd'),
  ('Neus &amp; oren', 'Detailwerk zonder trekken.', '8 apparaten &rarr;', C + 'neustrimmers'),
 ],
)
