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

Rand-tot-rand beeld met één tweeslagskop eroverheen, vier tot zes keer gestapeld zonder
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
  achteraan. "Neem hem mee de douche in." / "Spoel hem daarna gewoon af."
- **De zin eronder** zegt wat het kenmerk voor de lezer doet, niet wat het is.

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

Vijf banden op 4k/high is ongeveer 55 credits per ronde. Reken op twee rondes: &eacute;&eacute;n
set, dan de een of twee die je afkeurt opnieuw met de fout benoemd. Afkeuren is de werkwijze,
geen tegenvaller.

### De telefoon

Het beeld gaat daar **ongesneden** mee, op 16:9, met de kop eronder op de grond. De
compositie-afspraak is liggend; snijd je hem staand uit, dan vallen de uiteinden van het
product eruit. Er is dan ook geen sluier nodig, want de kop staat niet meer op de foto.

De gecentreerde uitlijning loopt door naar de telefoon: de regel voor de gecentreerde band is
specifieker dan de linkslijning in het telefoonblok en wint dus. Dat is hier gewenst, want
gecentreerd onder een gecentreerde opname leest rustig. Wil je het ooit anders, dan moet die
regel expliciet overschreven worden, niet met een breder selectorpad omzeild.

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
