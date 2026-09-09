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

Op de productpagina is de stapel zélf de sectie. Hij mag omdat hij drie dingen doet die een
losse band niet doet:

- **Hij wisselt van kant.** Links, rechts, midden, en weer terug. Een stapel op één kant leest
  vlak en dan komt het ritmeprobleem alsnog terug.

  De gecentreerde band doet hier meer werk dan hij lijkt te doen. Het beeld bepaalt de kant:
  staat het apparaat rechts, dan moet de kop links. Bij vijf banden liggen daarmee vier
  kanten vast, en alleen de gecentreerde band kan de vijfde plek opvullen zonder dat er twee
  dezelfde naast elkaar komen. Kan het beeld daar geen gecentreerde kop dragen -- omdat er
  precies in het midden iets licht staat -- dan is er geen goede kant meer over en krijg je
  onvermijdelijk één herhaling. Kies dan de plek waar de twee beelden het meest van elkaar
  verschillen in helderheid en hoogte; dat maakt de herhaling onzichtbaar. Ga niet de tekst
  op de verkeerde kant zetten om het schema te redden.
- **Hij wisselt van hoogte.** Compact, normaal, hoog. Vijf banden van precies dezelfde hoogte
  is een diavoorstelling.
- **Hij staat op één grond.** Carbon van boven tot onder, geen tussenruimte, geen afronding.
  Daardoor leest de hele stapel als één beweging in plaats van als vijf losse platen.

Haal je één van die drie weg, dan geldt de oude regel gewoon weer.

### Copy per band

Eén kenmerk, één tweeslagskop, één zin. Niet meer.

- **Bovenregel** is het kenmerk zelf, in kapitalen: `IPX7 WATERDICHT`, `LED-VERLICHTING`.
  Dat is het feit; de kop hoeft het dan niet te herhalen.
- **Eerste kopregel stelt vast**, de **tweede levert de opluchting** in goud. De emotie staat
  achteraan. "Neem hem mee de douche in." / "Spoel hem daarna gewoon af."
- **De zin eronder** zegt wat het kenmerk voor de lezer doet, niet wat het is.

### De sluier

Een witte kop op een lichte foto is onleesbaar. De sluier volgt de kant waar de tekst staat,
zodat het beeld aan de andere kant open blijft. Sterkte per band, als richtlijn: 70 tot 80%
op beeld dat al donker is, 85% en hoger op een lichte foto, en zo laag als 45 tot 55% wanneer
het beeld zelf de sfeer draagt en je hem niet dood wilt drukken. Kijk ernaar, reken het niet
uit: de kop moet leesbaar zijn en de foto moet nog iets te zeggen hebben.

**Botst de tekst met het onderwerp, verplaats dan de tekst, niet de sluier.** Bij de
LED-band liep de onderregel dwars door de lichtbundel. Meer sluier had de bundel gedood, en
die is nu juist het onderwerp. De oplossing was de band hoger maken en de tekst bovenin
zetten, zodat kop en bundel elkaar niet meer raken.

---

## 3. Beeld: de banden vragen hun eigen fotografie

**De bestaande featurefoto's zijn hier niet geschikt voor, en dat kost je een ronde als je
het niet vooraf checkt.** Ze zijn vierkant en dragen hun eigen kop in een hoek gebakken:
"Skin-Safe Keramische Bladen", "100% Waterproof", "LED precizie licht". Als tegel in de
galerij klopt dat. Full-bleed onder je eigen kop staan er twee koppen door elkaar, in twee
verschillende letters, en dat leest als een fout. Zet de productfoto's naast elkaar en kijk
welke schoon zijn voordat je iets vult.

### De compositie-afspraak

Genereer de banden liever zelf, tegen deze afspraak. Hij is wat de sectie bruikbaar maakt:

- **16:9.** Breed genoeg voor de desktopband (die snijdt boven en onder weg) en smal genoeg
  om op de telefoon nog een liggende uitsnede te zijn. 21:9 past de desktop perfect maar
  laat op de telefoon niets heel.
- **Het apparaat in de ene helft, de andere helft leeg.** Niet "rustig", maar leeg: geen
  schouder, geen arm, geen prop, geen highlight. Daar komt de kop te staan, en alles wat er
  wel staat vecht ermee. Dit moet je in de prompt herhalen en als negatief benoemen, anders
  vult het model de ruimte alsnog.
- **Wissel de kant af** over de stapel heen, en houd één band met het onderwerp laag in
  beeld voor de gecentreerde variant.
- **Alles uit één lichtopstelling.** Vijf beelden die niet als één shoot ogen zijn erger dan
  vijf middelmatige die dat wel doen. Leg de opstelling, het palet en de lens vast in een
  vaste aanhef en varieer alleen het onderwerp.

### De prompt

Volg deel 14 van de merklaag: `gpt_image_2`, `quality:"high"`, met een schone packshot als
referentie zodat het apparaat klopt. Twee dingen daar bovenop, die dit werk opleverde:

- **Benoem het materiaal van onderdelen expliciet.** Het model maakte het mes goud omdat de
  rest van het beeld warm was. "Geborsteld staal, niet goud, niet brons" in de prompt én in
  het negatief loste dat op. Een dramatisch beeld met een verkeerd weergegeven onderdeel is
  netto verlies.
- **Beschrijf de branding, anders komt hij er niet op.** Dit is de misser die het vaakst
  voorkwam: het model levert een gaaf maar volledig blanco apparaat. Een referentiebeeld is
  niet genoeg. Schrijf uit wat er van boven naar beneden op de body staat -- monogram, dan
  het woordmerk, dan de knop, dan het display -- en zet "geen blanco body" in het negatief.
- **Controleer de merknaam op ware grootte.** Snijd het beeld uit rond het woordmerk en het
  monogram en kijk of er geen letters verhaspeld zijn. Dat is de op een na meest voorkomende
  misser, en op een band over de volle breedte staat hij groot. Doe deze controle op elk
  beeld apart: in dezelfde serie kunnen drie beelden het monogram wel hebben en twee niet.

### Waar het contentfilter op afketst

Een bodygroomer plus huid plus een donkere scene wordt geweigerd. Twee formuleringen zijn
hierop stukgelopen, ook met een onderarm als onderwerp. Loop daar niet in vast: haal de huid
uit het beeld, of houd het bij een hand met het apparaat en laat het licht op een oppervlak
vallen. Kun je de boodschap niet vertellen zonder huid, kies dan het beeld dat je al hebt en
verplaats de tekst, in plaats van te blijven herformuleren.

### Wat het kost

Vijf banden op 4k/high is ongeveer 55 credits en twee rondes: één set, dan de een of twee
die je afkeurt opnieuw met de fout benoemd. Reken op afkeuren; dat is geen tegenvaller maar
de werkwijze.

### Waarom de kop op de telefoon toch onder het beeld blijft

Ook met deze fotografie. De compositie-afspraak is liggend: apparaat links of rechts, de
andere helft leeg. Snijd je die staand uit om tekst over beeld te zetten, dan valt of het
apparaat of de lege helft weg. Dus op de telefoon een liggende uitsnede en de kop eronder,
met de uitsnedekeuze voor de telefoon naar de kant waar het apparaat staat.

---

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
