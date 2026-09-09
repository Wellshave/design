# Wellshave-productpagina

De productpagina, als eigen bouwwerk. `wellshave-merklaag.md` blijft leidend voor tokens,
letter, knoppen en het tweeslags-kopapparaat; dit bestand beschrijft wat alléén voor de
productpagina geldt: de sectiestapel, de beeldbanden, en hoe je hem in het thema bouwt en
test zonder de winkel te raken.

**Regel bij het uitbreiden:** hier komt alleen wat bij de vólgende productpagina ook nog
geldt. Copy over één apparaat, prijzen en bestandsnamen horen bij dat project, niet hier.

---

## 1. De stapel

De volgorde die de referentiepagina's in deze categorie aanhouden, en die wij overnemen:

| # | Blok | Sectie | Waar de inhoud vandaan komt |
|---|---|---|---|
| 1 | Koopvak | `ws-pdp-koopvak` | Product, varianten, metafields |
| 2 | Persstrook | `logo-marquee` | Logoblokken in het sjabloon |
| 3 | Bundel & bespaar | `ws-bundels` | Blokken met een productverwijzing |
| 4 | Reviewrij | `trustpilot-reviews` | Trustpilot-widget |
| 5 | Beeldbanden | `ws-pdp-banden` | Eigen bandfotografie, of een productfoto op nummer |
| 6 | Wat zit er in de doos | `whats-included` | `custom.included_box` |
| 7 | In de praktijk | `ws-pdp-praktijk` | `custom.image_with_text` |
| 8 | UGC | `ws-pdp-ugc` | `custom.ugc_video_list` |
| 9 | FAQ | `faq` | Vraagblokken in het sjabloon |
| 10 | Geruststrook | `ws-pdp-belofte` | `custom.store_usp` |

**Wat metafield-gedreven is, hoef je per product niet opnieuw te zetten.** Blok 6, 7, 8 en 10
vullen zichzelf; een nieuw product met gevulde metafields krijgt die blokken gratis. Blok 2,
3 en 9 staan in het sjabloon en zijn dus per pagina werk. Weeg dat mee als je een tweede
product op deze opzet zet: de FAQ is het enige blok dat echt overgetypt moet worden.

**Het ritme.** Koopvak wit, persstrook zand, bundels wit, reviews zand, banden carbon,
doos wit, praktijk zand, UGC wit, FAQ wit, geruststrook wit. De bandenstapel is het enige
lange donkere blok en zit precies op de plek waar de lezer overtuigd moet raken. Zet er geen
tweede donker blok vlak naast; dan verliest de stapel zijn plek in het ritme.

---

## 2. De beeldbanden

Rand-tot-rand beeld met één tweeslagskop eroverheen, vier tot zeven keer gestapeld zonder
tussenruimte. Dit is de sectie die de productpagina zijn karakter geeft.

### Dit is een uitzondering, en waarom hij mag

`wellshave-merklaag.md` deel 9 zegt: hooguit één beeldband over de volle breedte per pagina,
want een tweede maakt het effect ongedaan. Op een landingspagina klopt dat, want daar staat
de band tussen kolommen tekst en breekt hij het ritme.

Op de productpagina is de stapel z&eacute;lf de sectie. Hij mag omdat hij drie dingen doet die
een losse band niet doet:

- **Elke band heeft een eigen onderwerp.** Niet vijf sfeerbeelden van hetzelfde apparaat, maar
  vijf keer het onderdeel waar die band over gaat: het mes, het water, de kammen, het licht,
  de kabel. Dat maakt de stapel een opsomming in plaats van een herhaling.
- **De schaal wisselt.** De ene band is een macro waarin het mes het hele frame vult, de
  volgende een overzicht met het apparaat en vier kammen naast elkaar. Vijf keer dezelfde
  afstand tot het onderwerp is een diavoorstelling.
- **Hij staat op &eacute;&eacute;n grond.** Carbon van boven tot onder, geen tussenruimte, geen
  afronding. Daardoor leest de hele stapel als &eacute;&eacute;n beweging in plaats van als vijf
  losse platen.

Haal je &eacute;&eacute;n van die drie weg, dan geldt de oude regel gewoon weer.

**Over de plek van de kop.** Een eerdere versie liet de kop van kant wisselen, links, rechts,
midden. Dat was nodig toen de beelden lifestyle waren en het apparaat in de ene helft stond.
Met productcinema staat het onderwerp horizontaal en centraal, en dan hoort de kop
gecentreerd bovenin, op elke band gelijk. Dat is geen slordigheid: het is dezelfde keuze die
de referentiemerken maken, en het maakt van de stapel een specificatiereeks. De afwisseling
zit dan in het onderwerp en de schaal, niet in de tekstpositie.

### Copy per band

Eén kenmerk, één tweeslagskop, één zin. Niet meer.

- **Bovenregel** is het kenmerk zelf, in kapitalen: `IPX7 WATERDICHT`, `LED-VERLICHTING`.
  Dat is het feit; de kop hoeft het dan niet te herhalen.
- **Eerste kopregel stelt vast**, de **tweede levert de opluchting** in goud. De emotie staat
  achteraan. "Mee onder de douche." / "Spoel hem daarna af."
- **De zin eronder** zegt wat het kenmerk voor de lezer doet, niet wat het is.

**Elke kopregel past op &eacute;&eacute;n regel, of de band klopt niet meer.** Dit is geen
smaakregel maar een maatregel. Het tekstblok staat in de lege helft van de foto; groeit het,
dan zakt het het onderwerp in. Twee kopregels plus een zin van twee regels eindigde bij de
Groom Guard op 301px, met het onderwerp vanaf 380px: ruim genoeg. Vier kopregels eindigde op
411px, dwars door de waterspetters heen.

**De ruimte hangt af van de uitlijning, en dat verschil is groot genoeg om je erin te laten
lopen.** Een gecentreerd tekstblok is 40em breed, een links- of rechtsuitgelijnd 34em. Bij een
kop van 54px is dat 640px tegen 544px, oftewel ongeveer 27 tekens tegen 22. Drie koppen die op
een gecentreerde band prima pasten, liepen op een zijkantband alsnog over drie regels. Meet
per band, met de uitlijning die die band heeft.

Meet het, schat het niet: dezelfde zin van 26 tekens paste wel en een van 27 niet, want de
letterbreedte verschilt. Zet een onzichtbare `span` met `white-space:nowrap` in de
kopelement-stijl, lees de breedte, en houd alles onder de `max-width` van dat tekstblok. Blijkt
een regel te lang, kort dan de copy in. Verklein de kop niet en verhoog de band niet: de
banden delen &eacute;&eacute;n ritme, en &eacute;&eacute;n afwijkende band is meteen zichtbaar.

### De sluier

Een witte kop op een lichte foto is onleesbaar. De sluier volgt de kant waar de tekst staat,
zodat het beeld aan de andere kant open blijft.

**Met productcinema heb je hem nauwelijks nodig.** De kop staat op de lege zwarte bovenhelft
van het beeld zelf, dus 30 procent, de ondergrens van de instelling, is genoeg. Draai je hem
hoger, dan verlies je precies het contrast waar de opname het van moet hebben. Bij een
lifestyle-achtergrond ligt dat anders: reken daar op 70 tot 85 procent.

**Botst de tekst met het onderwerp, verplaats dan de tekst, niet de sluier.** Bij de LED-band
liep de onderregel dwars door de lichtbundel. Meer sluier had de bundel gedood, en die is nu
juist het onderwerp.

---

## 3. Beeld: productcinema, niet lifestyle

**Dit is de belangrijkste les van dit project, en hij kostte drie rondes.** De banden vragen
geen sfeerbeeld van iemand in een badkamer. Ze vragen het onderdeel waar de band over gaat,
liggend en groot in beeld, geschoten als een autoreclame. Dat is wat de referentiemerken in
deze categorie doen, en het is de reden dat hun pagina's duur ogen.

Het verschil is niet subtiel. Een man die zich in de douche staat te scheren is een
lifestylefoto; hij vertelt een situatie. Een macro waarin de stalen meskam horizontaal door
het frame loopt vertelt het product. Op een band met &eacute;&eacute;n kenmerk als kop wint het
tweede altijd.

### Elke band een eigen wereld

**Productcinema alleen is niet genoeg, en dat was de tweede les.** Vijf banden, allemaal
hetzelfde zwart, hetzelfde licht, hetzelfde onderwerp op dezelfde afstand: technisch in orde
en toch vlak. De referentiemerken geven elke band een eigen wereld, en dat is precies waar het
verschil in zit. Naast elkaar gelegd:

| | Referentie | Vlakke stapel |
|---|---|---|
| Ondergrond | wisselt per band | vijf keer hetzelfde zwart |
| Idee | een rekwisiet of verschijnsel per band | geen, alleen het product uitgelicht |
| Diepte | echte bokeh, voor- en achtergrond gescheiden | alles even scherp, alles even ver |
| Camera | macro, wijd, laag, van boven | vijf keer dezelfde ooghoogte |
| Mensen | een enkele band met een mens erin | geen |

Vier dingen om per band te bepalen, voordat je ook maar een prompt schrijft:

- **De ondergrond wisselt.** Bij de Groom Guard: vier banden op carbon, drie op zand of
  cr&egrave;me. Geen zwart-wit-zwart-wit; laat het per band uit het onderwerp volgen. Water en
  laden willen daglicht, messen en LED willen nacht.
- **Elke band heeft een idee, geen opstelling.** Een gestolde waterboog om het apparaat heen,
  een lint van goud licht dat door het donker krult, vier kammen op een diagonaal van
  voorgrond naar achtergrond. Het idee mag abstract zijn; het moet alleen over dit kenmerk
  gaan.
- **Vraag om echte scherptediepte.** "Alleen de voorste rij tanden scherp, de rest lost op in
  bokeh" levert diepte; "macro" alleen niet. Zet ook de camera per band anders: een macro, een
  wijde, een lage.
- **De schaal varieert.** Op de ene band vult het onderwerp de hele breedte, op de andere staat
  het klein in een groot leeg vlak. Dat verschil draagt het ritme van de stapel.

**Twee lifestylebanden tussen de productbanden.** De referentiemerken doen het en het werkt:
de productbanden leveren het bewijs, de lifestylebanden het gevoel. Zet ze op posities waar de
stapel anders lang hetzelfde doet, en houd ze veilig voor het contentfilter (zie hieronder):
een man van borsthoogte opwaarts in een spiegel, of iemand op de rand van een bed, gekleed en
op afstand. Niet de scheerhandeling zelf.

### Tekstkleur volgt de opname, niet de smaak

Zodra de gronden wisselen, wisselt de tekstkleur mee. Wit op cr&egrave;me is onleesbaar en meer
sluier is geen oplossing: die vreet precies de helderheid weg waar de lichte band het van moet
hebben. Dus twee standen in de sectie:

- **Licht** op een carbon of nachtelijke opname: witte kop, tweede regel in het goudverloop.
- **Donker** op een zand- of cr&egrave;mekleurige opname: kop in inkt, tweede regel in
  **brons** (`#BC813E`), niet in goud. Het lichte goud van de merklaag verdwijnt op licht; het
  bronsverloop draagt daar wel.

De sluier draait dan mee: op een lichte band verloopt hij naar cr&egrave;me in plaats van naar
zwart. Zelfde richting, omgekeerde kleur.

### De compositie-afspraak

Dit is wat de sectie bruikbaar maakt. Wijk hier niet van af:

- **16:9.** Breed genoeg voor de desktopband, en op de telefoon toonbaar zonder te snijden.
- **Het onderwerp ligt horizontaal en vult de breedte**, in de **onderste helft** van het
  frame.
- **De bovenste 45 procent is leeg, onbelicht bijna-zwart.** Niets: geen product, geen
  highlight, geen verloop, geen textuur. Daar komt de kop te staan. Dit moet je in de prompt
  als eis &eacute;n als negatief zetten, anders vult het model de ruimte alsnog.
- **Studio, geen ruimte.** Naadloze bijna-zwarte achtergrond, geen badkamer, geen mensen,
  geen handen. Dat houdt de serie consistent en omzeilt bovendien het contentfilter.
- **&Eacute;&eacute;n lichtopstelling over de hele set.** Een harde scherende randlichtbron van
  links die de silhouetten tekent, een zachte invulling van boven, diepe schaduwen, echte
  zwarten. Mat zwart leest als satijn, nooit als spiegel. Leg dat vast in een vaste aanhef en
  varieer alleen het onderwerp.

### De prompt

Volg deel 14 van de merklaag: `gpt_image_2`, `quality:"high"`. **Gebruik de referentiebeelden
die al in Higgsfield staan**, niet een packshot van de webshop: daar staat het apparaat vaak
op wit en met minder detail. Kijk eerst in de bibliotheek voordat je iets importeert.

**Vraag om meerdere hoeken van hetzelfde apparaat.** Wat het verschil maakte was niet
&eacute;&eacute;n mooie referentie maar een setje: het apparaat met en zonder opzetkam, van
opzij, van voren, en de lader los. Met drie referenties per beeld, telkens een andere hoek,
kwamen de vorm-eigenaardigheden er wel uit die het model anders gladstrijkt: de taille in de
body en de V-vorm van de schouder onder de meskop. Met &eacute;&eacute;n referentie kreeg je
een generieke trimmer die er alleen ongeveer zo uitzag.

Staat zo'n set er nog niet, vraag er dan om in plaats van er omheen te werken. `media_upload_widget`
zet de uploadknop in het gesprek; de gebruiker krijgt er media-id's voor terug die je
rechtstreeks als referentie meegeeft.

Vier dingen daar bovenop, elk uit een misser die werkelijk gebeurde:

- **Benoem het materiaal van onderdelen expliciet.** Het model maakte het mes goud omdat de
  rest van het beeld warm was. "Geborsteld staal, niet goud, niet brons", in de prompt &eacute;n
  in het negatief.
- **Beschrijf de branding, anders komt hij er niet op.** Het model levert een gaaf maar
  volledig blanco apparaat. Schrijf uit wat er van boven naar beneden op de body staat, en zet
  "geen blanco body" in het negatief.
- **Verbied verzonnen opschriften op accessoires.** Op de opzetkammen zette het model uit
  zichzelf maatlabels: "3.5mm 1/7", "4.5mm 3/16". Die cijfers klopten niet eens met elkaar en
  zijn nergens na te wijzen. Verzonnen specificaties op een productfoto zijn hetzelfde als een
  verzonnen review. Zet "geen cijfers, geen maten, geen letters op de accessoires" als harde
  eis in het negatief.
- **Laat het merkteken weg waar het niet rechtop kan staan.** Bij een macro van het mes lag
  het apparaat op zijn kant en kwam het monogram gekanteld en vervormd in beeld. Een verkeerd
  weergegeven merkteken is erger dan geen merkteken; de referentiemerken zetten op zo'n
  detailmacro ook geen logo.

### Controleren voordat je kiest

Per beeld, niet per serie: in dezelfde set kunnen drie beelden het monogram wel goed hebben en
twee niet. Snijd het beeld uit rond het woordmerk en kijk op ware grootte of er letters
verhaspeld zijn, en of er ergens tekst staat die je niet gevraagd hebt.

### Waar het contentfilter op afketst

Een bodygroomer plus huid plus een donkere scene wordt geweigerd, ook met een onderarm als
onderwerp. Met de studio-aanpak speelt dat niet meer, want daar komt geen huid in voor. Loop
er niet in vast als je toch huid nodig hebt: kies dan het beeld dat je al hebt en verplaats de
tekst, in plaats van te blijven herformuleren.

### Wat het kost

Op `gpt_image_2`, 4k, high is het 11 credits per beeld. Een stapel van zeven banden vraagt er
veertien, want liggend en staand zijn twee opnames: ongeveer 155 credits per volledige ronde.
Reken op twee rondes: &eacute;&eacute;n set, dan de een of twee die je afkeurt opnieuw met de
fout benoemd. Afkeuren is de werkwijze, geen tegenvaller.

Doe de liggende set eerst en keur die goed voordat je de staande maakt. Anders betaal je de
staande helft van een richting die je alsnog afkeurt.

Twee dingen die tijd kosten en niets opleveren: **de referentiebeelden vergeten mee te geven**
(dan krijg je een generiek apparaat terug en gooi je de hele batch weg), en **meer dan acht
jobs tegelijk indienen** (de limiet op het ultra-abonnement; de rest komt terug als
`submission_failed` en die moet je opnieuw wegzetten).

### De telefoon vraagt een tweede opname

**Maak per band ook een staande versie op 2:3.** De referentiemerken vullen op de telefoon de
hele band met een staande foto en leggen de tekst eroverheen, boven of onder. Dat leest een
stuk sterker dan een strook van 16:9 met een kop eronder, want de foto krijgt de hele hoogte.

Het kost wel een tweede opname per band, en dat is geen keuze: **een liggende 16:9 staand
uitsnijden werkt niet.** De compositie-afspraak legt het onderwerp horizontaal door het frame;
snijd je hem staand uit, dan vallen de uiteinden van het product eruit, precies waar het beeld
voor gemaakt is. Schrijf de staande prompt als dezelfde sc&egrave;ne, verticaal gecomponeerd,
met de lege helft boven of onder in plaats van links of rechts.

Waar de tekst staat volgt uit waar de opname leeg is, en dat wissel je af over de stapel. Meet
het per beeld in zesden: bij de Groom Guard hadden de donkere banden hun bovenste drie zesden
op nul en de lichte banden hun onderste twee zesden vlak, dus tekst boven op de donkere en
onder op de lichte.

De sectie heeft daarom een aparte beeldkiezer voor de telefoon. Blijft die leeg, dan valt de
band terug op het oude gedrag: liggend beeld ongesneden, kop eronder op de grond. Zo blijft
dezelfde sectie werken op een product waarvoor nog geen staande set bestaat.

**E&eacute;n `<picture>`, geen twee beelden.** Twee `<img>`'s met `display:none` erop laat de
browser allebei ophalen, en dan betaalt de telefoon voor een liggend beeld van 2000px dat ze
nooit laat zien. Een `<source media="(max-width: 820px)">` op dezelfde grens als de CSS lost
dat op.

Let op bij het lokaal spiegelen: een spiegelscript dat `srcset` wegstript om alleen de lokale
`src` te laten tellen, sloopt daarmee stilletjes de `<source>` van de telefoon. Je fotografeert
dan op 390px het liggende beeld en denkt dat het klopt. Vervang de `srcset` van een `<source>`
door het lokale bestand in plaats van hem te verwijderen.

## 4. Bouwen en testen in het thema

Een productpagina is geen losse pagina maar een **alternatief sjabloon**. Dat is ook meteen
de veilige testroute.

1. **Bouw in een ongepubliceerd thema.** De API weigert schrijven naar het live thema, en dat
   is maar goed ook. Neem het werkthema, niet het live thema.
2. **Maak `templates/product.<naam>.json`.** Laat het bestaande `product.json` met rust; dat
   draagt elk ander product.
3. **Bekijk hem met `?view=<naam>&preview_theme_id=<id>`.** Let op: die parameters zetten een
   cookie. Haal je de pagina met `curl` op, gebruik dan een cookiejar (`-c`/`-b`), anders
   krijg je stilletjes het standaardsjabloon terug — dat ziet er normaal uit en kost je een
   ronde voordat je het doorhebt.
4. **Koppel het sjabloon pas aan het product als je live wilt.** Het sjabloonachtervoegsel
   staat op het product zelf en geldt dus voor élk thema. Zet je het nu, dan zoekt het live
   thema een sjabloon dat het niet heeft en breekt de pagina die nu geld verdient.
5. **Lees achteraf terug.** Haal de gerenderde pagina op en tel secties, banden, beelden en
   knoppen. Vergelijk de MD5 van wat je uploadde met wat er staat.

### Wat je controleert voor je het oplevert

- Render op 1440 en 390 breed: geen horizontale overloop, alle beelden geladen.
- Elke band heeft een beeld. Een band zonder beeld is een zwart vlak met een kop erop.
- Geen ingebakken bijschrift zichtbaar, op géén van beide breedtes.
- Scroll de pagina helemaal door voordat je een schermafdruk maakt. De koppen komen met een
  inloop in beeld; zonder scrollen fotografeer je lege banden en denk je dat er iets stuk is.
- Tel de vragen in de FAQ en de items in de doos: die komen uit verschillende bronnen en
  vallen stil weg als een metafield leeg is.

---

## 5. Wat deze laag nog niet weet

- Of de bandenstapel het beter doet dan de huidige pagina. Er is nog niets gemeten.
- Of gegenereerde bandfotografie het houdt naast echte merkfotografie. Deze set is
  gegenereerd omdat er niets bruikbaars lag; dat is illustreren, geen bewijs, en dus
  toegestaan. Komt er ooit een echte shoot, dan wint die.
- Hoeveel banden optimaal is. Vijf voelt goed, vier waarschijnlijk ook; boven de zes is het
  niet geprobeerd.
- Hoe de stapel werkt met video in plaats van foto. De sectie kan het, het is niet gebruikt.
