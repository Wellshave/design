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
| 5 | Beeldbanden | `ws-pdp-banden` | Productfoto's, per band een nummer |
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
zodat het beeld aan de andere kant open blijft. Sterkte per band: 75% op een donkere foto,
85% op een normale, hoger op een lichte. Kijk ernaar, reken het niet uit.

---

## 3. Beeld: controleer eerst of er al tekst in zit

**Dit is de val waar deze pagina in liep.** De featurefoto's van Wellshave zijn vierkant en
dragen hun eigen kop in een hoek gebakken: "Skin-Safe Keramische Bladen", "100% Waterproof",
"LED precizie licht". Ze zijn gemaakt als tegels voor de galerij, niet als achtergrond.

Zet je zo'n foto full-bleed neer, dan staan er twee koppen door elkaar: die van de foto en
die van jou, in verschillende letters en verschillende maten. Dat leest als een fout.

Wat dat betekent voor de uitsnede:

| Breedte | Verhouding van de band | Wat er wegvalt |
|---|---|---|
| Desktop | Ongeveer 2,3:1 | Boven en onder gaan er ruim af; een bijschrift in een hoek verdwijnt vanzelf |
| Telefoon | Staand, als je tekst over beeld zet | Alleen de zijkanten; het bijschrift blijft staan |

Daarom heeft de sectie een **aparte uitsnedekeuze voor de telefoon**. Staat het bijschrift
boven in de foto, kies dan Onder; staat het onderin, kies Boven. En daarom zakt de kop op de
telefoon onder het beeld: met een liggende uitsnede is er te weinig hoogte over om een kop
overheen te zetten, en een liggende uitsnede is het enige wat het bijschrift wegneemt.

**Controleer dit vóórdat je de banden vult.** Zet de productfoto's naast elkaar en kijk welke
schoon zijn. Kost dat te veel banden, meld het als gat en stel brede fotografie zonder
ingebakken tekst voor — dat is de echte oplossing, niet een slimmere uitsnede.

Komt die fotografie er, dan kan de telefoon terug naar tekst-over-beeld; in
`assets/ws-pdp-banden.css` staat bij het telefoonblok precies welke drie regels dat zijn.

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
- Hoeveel banden optimaal is. Vijf voelt goed, vier waarschijnlijk ook; boven de zes is het
  niet geprobeerd.
- Hoe de stapel werkt met video in plaats van foto. De sectie kan het, het is niet gebruikt.
