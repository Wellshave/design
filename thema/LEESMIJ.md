# Collectiepagina in het thema `wellshave/claude-design`

De vijf collectiepagina-ontwerpen zijn hier omgezet naar echte Liquid-secties en
staan in het thema `wellshave/claude-design` (id `204178161996`, unpublished).
Het live thema `wellshave-redesign/live` is niet aangeraakt.

## Wat er in het thema staat

| Bestand | Wat het is |
|---|---|
| `assets/ws-collectie.css` | Eén stijllaag voor alle vijf de secties, gescopeerd op `.wsc` |
| `assets/ws-collectie.js` | Keuzehulp, filter, vergelijker, snel-bekijken en de uitklapvragen |
| `sections/ws-collectie-kop.liquid` | Blok 1 — kop, bewijskaart, keuzehulp en zonebalk |
| `sections/ws-collectie-raster.liquid` | Blok 2 — het raster, in groepen |
| `sections/ws-collectie-uitleg.liquid` | Blok 3 — over deze categorie (het SEO-blok) |
| `sections/ws-collectie-bewijs.liquid` | Blok 4 — beoordelingen, verankerd aan het product |
| `sections/ws-collectie-slot.liquid` | Blok 5 — garanties, vragen en de andere zones |
| `templates/collection.zone-lichaam.json` | Zone Lichaam & schaamstreek |
| `templates/collection.zone-gezicht.json` | Zone Gezicht & baard |
| `templates/collection.zone-hoofd.json` | Zone Hoofd |
| `templates/collection.zone-neus.json` | Zone Neus & oren |
| `templates/collection.overzicht.json` | De overkoepelende pagina |
| `templates/collection.type-*.json` | Vier typepagina's: baardtrimmers, scheerapparaten, tondeuses, safety razors |

`templates/collection.json` is bewust ongewijzigd gelaten: dat is de standaard
voor élke collectie in dit thema.

## Alles wat een getal is, komt uit Shopify

In het raster staat niets vast. Naam, prijs, vanprijs, besparing, voorraad,
score, aantal beoordelingen en het aantal onderdelen in de doos komen live uit
het product en zijn metavelden (`loox.avg_rating`, `loox.num_reviews`,
`custom.subtitle`, `custom.product_usp`, `custom.included_box`). Staat een
product op nul beoordelingen, dan komt er geen standaardcijfer maar
"nieuw · nog geen beoordelingen"; is het niet leverbaar, dan wordt de kaart grijs
met een eerlijke regel. Dat was de kern van elke audit en het is nu niet meer te
omzeilen.

Wat wél redactie is, staat per groep in één veld: het lintje op een kaart, op
handle (`neustrimmer-4in1-ultra = Best verkocht`).

## De keuzehulp

De sectie `ws-collectie-kop` bevat een beslistabel als tekstveld:

```
klus=kaal, set=los > hs
klus=kaal, set=set > skull3
```

Links de antwoorden per vraag, rechts het id van het matchpaneel dat wint. De
eerste regel die past wint; `*` betekent "maakt niet uit". De tabel gaat als JSON
naar `ws-collectie.js`, dat er ook het raster mee aanstuurt: de kaart met
"Beste match" volgt de keuzehulp, en dat werkt over secties heen.

**Het matchpaneel en het raster praten via de producthandle.** De beslistabel werkt met
korte id's (`elite`), de kaarten in het raster staan op de producthandle
(`neustrimmer-2in1-elite`). Het paneel draagt allebei: `data-id` en `data-handle`, en
`zetMatch()` vertaalt van het één naar het ander. Dat ontbrak, waardoor het lintje **Beste
match** in het raster nooit verscheen — het paneel klopte, de kaart bleef onaangeraakt.
Kom je hier ooit terug: test niet alleen of het paneel verschijnt, maar ook of er precies
één kaart `.wsk.match` krijgt.

**Zorg dat elk matchpaneel precies één combinatie wint.** Wint een apparaat
niets, dan staat het er voor de vorm bij — dat is een bevinding over de
collectie, geen reden om een vraag te verzinnen.

### De vragen lopen als stappen, niet als een lijst

Alle vragen tegelijk laten staan werd op de telefoon een muur. Ze lopen nu als
stappen: stap 1 staat open, de rest staat gedempt en is niet aanklikbaar. Wie
antwoordt, ziet die vraag dichtklappen tot één regel — een gouden vinkje, de
vraag, het antwoord als zwarte pil en een potlood — en de volgende vraag opent.
Het aantal stappen volgt vanzelf uit het aantal `vraag`-blokken; `zone-gezicht`
heeft er drie, de rest twee, en vier zou net zo goed werken.

Belangrijke gevolgen om te onthouden:

- **De instelling `start` drukt geen antwoord meer voor.** De wizard begint leeg,
  anders staat stap 1 al af voordat de klant iets gedaan heeft. `start` blijft in
  de blokken staan maar doet niets meer.
- **Het matchpaneel verschijnt pas als álle vragen beantwoord zijn.** Daarvoor
  zou het advies meeschuiven bij elke klik, wat het advies goedkoop maakt.
- **De bollen in de stapper horen bij hun eigen rij.** Ze werden eerst gevuld op
  het aantal beantwoorde vragen; wie dan stap 1 heropende terwijl stap 2 al af
  was, zag de verkeerde bol vollopen. `stapper()` loopt nu rij voor rij.
- **De kop wisselt mee** via `data-open` / `data-af` op `.kiescard-kop` en
  `.kiescard-sub`, en onderaan komt "Opnieuw beginnen" tevoorschijn.

Op de telefoon houdt een dichtgeklapte vraag een eigen regel voor het antwoord:
de vraagtekst en de pil naast elkaar persen wordt onleesbaar smal. Alles
eromheen is wel zo krap mogelijk (bol 28px, kleinere pil). Meten op 390px,
`zone-gezicht`: de kaart is 429px bij het laden en zakt naar 422px terwijl je
antwoordt — antwoorden maakt het blok dus nooit hoger, tot de match verschijnt.

### Het matchpaneel op de telefoon

Op het brede scherm staat het paneel in drie kolommen (beeld, tekst, prijs +
knop). Op de telefoon werd dat één lange kolom. Het is nu beeld naast tekst,
met prijs, voorraad en knop als één blok eronder achter een streepje.

Let op bij `.mp-koop`: de kolommen moeten `auto minmax(0,1fr)` zijn. Met
`auto auto` plus `justify-content:start` is de rij precies zo breed als de
prijs, en dan valt de knop op volle breedte samen met zijn eigen pijl — die is
absoluut gepositioneerd op `right:8px`. Dat zag je terug als een pijl bovenop
het woord "MATCH".

## Blok 3 heeft geen tekening — en kan er ook geen meer krijgen

Dit is twee keer misgegaan en staat hier zodat het geen derde keer gebeurt.

Eerst stonden er getekende lichamen en gezichten in blok 3. Die zijn eruit gehaald:
een met de hand getekende mens leest als slordig zodra de anatomie niet perfect is.
De regel werd daarop *"wel een mechanisme, geen mens"*, en gezicht, neus en lichaam
kregen een SVG-doorsnede van een scheerkop, een neuskap en een trimmerkam. Ook die
zijn eruit, met hetzelfde oordeel: **een met de hand gezette lijntekening leest als
een schets naast de studiofoto's van hetzelfde product in het raster erboven.**

Het `tekening`-veld is daarom **weg uit het schema** van `ws-collectie-uitleg`. Er is
alleen nog `beeld` (een échte foto) met een `bijschrift`. Wil je iets uitleggen, doe
het in de tekst.

Dat kostte niets aan inhoud. Bij alle drie de pagina's bleek het bijschrift onder de
tekening woordelijk terug te komen in de lopende tekst — bij bodygroomers stond er
"de kam maakt contact met de huid en leidt het haar naar het mes" onder de tekening
en "de afgeronde kam rust op de huid en leidt de haren naar het bewegende mes" in de
alinea erboven. Tekening en bijschrift zijn allebei geschrapt.

Zonder beeld krijgt de sectie `.cat.solo`: één kolom, zo'n 70 tekens per regel, met
de vergelijkingstabel en de tips daaronder over de volle breedte. Dat is geen
noodgreep — `/collections/all` en de hoofdpagina stonden er altijd al zo bij, en de
drie zonepagina's zien er nu hetzelfde uit. Alle vijf de pagina's met blok 3 zijn nu
`solo`; nagemeten op de negen pagina's: nul tekeningen, nul `figure`-elementen.

De iconen in de interface blijven wél: de vinkjes, chevrons en de pictogrammen op de
filterknoppen komen uit een sprite en zijn symbolen, geen illustraties. Hetzelfde
geldt voor de gegenereerde zone-iconen in het megamenu.

## De blauwe geverifieerd-badge

Naast het citaat in de kop stond een blauw rondje met een vinkje erin. Dat is niet
de badge die mensen kennen. Het is nu de echte vorm: een rozet met acht lobben in
`#1D9BF0` met een wit vinkje, als sprite-symbool `wsc-badge`.

De rozet is **uitgerekend, niet getekend**: `r(t) = 10,5 + 0,95·cos(8t)`, op 32 punten
bemonsterd en via Catmull-Rom als bezierkromme uitgeschreven. Daardoor zijn alle acht
lobben exact gelijk — met de hand zetten levert altijd één scheve lob op. Wil je de
badge aanpassen, pas dan de formule aan en genereer het pad opnieuw; ga niet in het
pad zelf zitten schuiven.

De kleur en het vinkje zitten in het symbool, dus `.pk-badge` in de CSS zet alleen
nog de maat (19px). Er is geen achtergrondcirkel meer.

## De achtergrond van de kop

De kop is **zwart met een gradient naar iets lichter**:
`--grad-kop: linear-gradient(158deg,#000 0%,#0C0B0A 38%,#211F1D 100%)`. Zwart
linksboven waar de eyebrow en de kop staan, iets lichter naar rechtsonder.

`--grad-dark` is met rust gelaten: dat token wordt ook door `.donker` in andere blokken
gebruikt, dus de kop heeft een eigen token gekregen.

**Wat hier eerst stond en waarom het weg is.** Dit blok is drie keer veranderd, en dat
is het onthouden waard:

1. Een vlakke donkere gradient met een monogram-**S** van 330px erin. Afgekeurd: de S
   moest weg.
2. Een achtergrondfoto per categorie met een instelbare donkere sluier eroverheen. Ook
   afgekeurd — *"ik ben hier toch geen fan van, maak deze achtergrond gewoon zwart."*
   Het hele mechanisme is eruit: de `<img>`-laag, de sluier, de instellingen
   `achtergrond` en `achter_donker`, en de sleutels in alle negen sjablonen.
3. Nu dus: zwart met een gradient, en verder niets.

Er staat bewust **geen instelling** meer voor een achtergrondbeeld. Wil je er ooit toch
weer iets achter, doe dat dan als een bewuste nieuwe keuze en niet door een halve
voorziening te laten staan.

De foto in de kolom (`foto`, verhouding 16:8) is iets anders en staat er nog — zie
hieronder.

## De herofoto per categorie

Elke collectiepagina heeft in de kop een liggende fotoband van ongeveer 2:1 (457×228
op het brede scherm, 354×199 op de telefoon), `object-fit:cover` met
`object-position:50% 40%`. De foto komt uit de instelling `foto` op
`ws-collectie-kop`.

Zes van de negen sjablonen hadden er geen. Vier zijn nu gevuld uit de eigen
beeldbank — de lifestyle-shoot van september staat als
`Wellshavesept25lifestyle_lowres-*` in de bestanden:

| sjabloon | foto | waarom die |
|---|---|---|
| `zone-gezicht` | `gg-sfeer-geprobeerd.jpg` | mesje, baardtrimmer en schaar naast elkaar: precies de drie families in die zone |
| `overzicht` | `…lowres-2-34.jpg` | de tas en de zakjes in de badkamernissen — de hele collectie, geen los product |
| `type-baardtrimmers` | `…lowres-2-38.jpg` | een trimmer wordt uit de tas gepakt |
| `type-scheerapparaten` | `…lowres-2-43.jpg` | een scheerapparaat met roterende kop wordt uit de tas gepakt |

**`type-tondeuses` en `type-safetyrazors` staan bewust leeg.** De beeldbank heeft van
die twee alleen uitgeknipte studiofoto's op wit. Nagemeten in de echte band: een
2:1-uitsnede daarvan wordt een fel wit blok met een stuk apparaat erin, en dat is
precies de klacht waarmee dit begon — een foto die niet bij de categorie past. Een
losse flatlay van een tondeuse en van een safety razor op dezelfde warme ondergrond
als `gg-sfeer-geprobeerd` vult beide in één keer.

## Zone ordent, type benoemt

De winkel is opgebouwd rond producttypes, het ontwerp rond zones. Die twee vechten
niet met elkaar: **de zone is de bestemming, het type is een gefilterde blik erop.**

Twee van de vier zones bestaan al als typecollectie, één op één — er hoefde dus geen
enkele nieuwe collectie te komen:

| Zone | Collectie | Storefront |
|---|---|---|
| Lichaam & schaamstreek | `bodygroomers` | 4 apparaten (de 2 MIJU-kopieën zijn unlisted en tonen niet) |
| Gezicht & baard | `zone-gezicht` | 11 (de 3 gearchiveerde razors tonen niet) |
| Hoofd | `zone-hoofd` | 4 (de gearchiveerde Tondeuse Pro toont niet) |
| Neus & oren | `neustrimmers` | 8 |

De vier typecollecties die niet één op één op een zone vallen, houden hun URL en
krijgen dezelfde secties met één groep en een link omhoog naar hun zone. Ze kosten
bijna niets en je gooit geen zoekposities weg. Het raster leest daar de collectie
zelf uit: zet **"Gebruik de producten van deze collectie"** aan op de groep en de
lijst vult zichzelf.

`scheerapparaten` is de uitzondering: daar zitten vier gezichtsscheerapparaten, één
hoofdscheerder en twee losse scheerkoppen in. Die pagina wijst daarom naar de
overkoepelende pagina in plaats van naar één zone, en zegt dat ook.

## Wat nog handmatig moet

1. **Twee foto's ontbreken.** De kop van de zone Gezicht & baard en van de
   overkoepelende pagina hebben geen foto: die twee stonden nog niet als
   shop-image in Shopify. Hoofd en Neus gebruiken `ws-ugc-hoofd.webp` en
   `ws-use-neustrimmer.jpg`, die er al waren. Het monogram (`ws-mark.png`) staat
   overal goed.
2. ~~Templates koppelen aan collecties.~~ **Gedaan.** Alle negen collecties hebben
   hun template-suffix. Dat is een instelling op de collectie zélf en werkt dus door
   in álle thema's — maar het live thema heeft alleen `collection.json`, en Shopify
   valt terug op dat standaardtemplate als de variant er niet is. Nagemeten op
   `zone-hoofd`, `bodygroomers` en `all`: de winkel toont nog precies dezelfde
   pagina's als eerst. Op het moment dat je `wellshave/claude-design` publiceert,
   schakelen alle negen tegelijk om.

   | Collectie | Template |
   |---|---|
   | `bodygroomers` | `zone-lichaam` |
   | `zone-gezicht` | `zone-gezicht` |
   | `zone-hoofd` | `zone-hoofd` |
   | `neustrimmers` | `zone-neus` |
   | `all` | `overzicht` |
   | `baardtrimmers` · `scheerapparaten` · `tondeuses` · `safetyrazors-scheren-scheermes` | `type-…` |

3. ~~Het menu.~~ **Gedaan, en het bleek geen menu te zijn.** De header gebruikt geen
   Shopify-menu maar een eigen `collection_list` in `sections/header-group.json`.
   Dat bestand hoort bij het thema, dus de wijziging raakt het live thema niet — de
   waarschuwing hierboven over "één menu voor alle thema's" gold hier niet.

4. **Eén product dat een bezoeker wél ziet staan.** `vervanging-neustrimmer-opzetstuk`
   is actief met voorraad 0 en staat dus met een koopknop in `/collections/all`.
   Op concept zetten of bijbestellen — dat is een keuze over het assortiment, geen
   ontwerpkeuze.

5. ~~Twee zonecollecties hebben geen collectiefoto.~~ **Opgelost, en anders dan
   gedacht.** Zie het hoofdstuk over de zone-iconen hieronder.

6. **Ladyshaves staat niet in de winkel.** `/collections/ladyshave` stuurt door naar
   de homepage, dus de collectie is niet gepubliceerd op het Online Store-kanaal.
   Daarom valt die tegel uit het megamenu weg — óók in het live thema, dus dit
   bestond al. De handle staat wel in de lijst: publiceer je de collectie, dan
   verschijnt de tegel vanzelf.

## De kop van de pagina: zonekiezer en filterpaneel

De bovenkant is opnieuw ontworpen naar een schets van Dustin. Twee blokken veranderden.

**De zonekiezer** (blok 1) was een rij pillen, en is nu vier tegels: het gouden lijnicoon
van de zone, een scheidingslijntje, de naam, het aantal in een rondje en een pijl. De zone
waar je op staat is zwart met een gouden voet en een gevuld rondje. Daaronder staat de
bevestigingsregel met een vinkje in een gouden schijfje. Het zone-blok heeft daarvoor een
`icoon`-veld gekregen; in alle negen templates staan de vier iconen ingevuld.

**Het filterpaneel** (blok 2) heeft twee regels. Boven: het label *Toon mij*, de vier
categorieknoppen — elk met een eigen icoon en zijn aantal in een badge — het aantal
resultaten, de vergelijkknop en de sorteerlijst. Onder: *Jouw keuzes* met de gemaakte
keuzes als losse chips, *Wis alles*, en rechts een tip.

Op de knop Bundels kan een lintje staan (`bundel_lint`, standaard "Meeste waarde") dat
boven de rand uitsteekt. Op mobiel heeft de knoppenrij daarom extra ruimte tussen de
rijen, anders botst het lintje tegen de knop erboven.

### "Alle zones" hoort in de rij

Hetzelfde geldt voor het megamenu onder **SHOP**. Daar stond *Alle producten* wél, maar
onderaan de tweede groep *Of zoek op type* — terwijl "alles" geen type is. Die tegel staat
nu vooraan in de eerste groep *Kies je zone* en heet daar ook **Alle zones**, zodat het
menu en de zonekiezer op de pagina precies hetzelfde zeggen:

| groep | tegels |
|---|---|
| Kies je zone | Alle zones · Lichaam & schaamstreek · Gezicht & baard · Hoofd · Neus & oren |
| Of zoek op type | Scheerapparaten · Baardtrimmers · Tondeuses · Safety Razors · Accesoires · Bundels |

Drie dingen die daarvoor moesten gebeuren, in `header-group.json` (een bestand per thema,
dus live blijft ongemoeid):

- `all` vooraan in `megamenu_collections`;
- `megamenu_zones` van 4 naar 5 — dat getal bepaalt waar de eerste groep ophoudt;
- `megamenu_labels` van `all=Alle producten` naar `all=Alle zones`.

En één in de winkel zelf: de collectie `all` had geen `custom.zone_icon` en viel dus terug
op `custom.megamenu_image`, een productfoto. Tussen vier gouden lijniconen was dat de
vreemde eend. Hij heeft nu hetzelfde 2×2-icoon als de tegel op de pagina's. Dat metafield
kent alleen dit thema — het live thema leest `megamenu_image` — dus daar verandert niets;
nagemeten op de live pagina: geen "Alle zones", geen van beide groepskoppen.

De zonekiezer had vier tegels: de vier zones. Sta je op een zonepagina en wil je gewoon
álles zien, dan was daar in de rij niets voor. De routes die er wél waren, zaten buiten
beeld: *SHOP* in de header en *Bekijk de hele collectie* helemaal onderaan het raster —
allebei niet waar je op dat moment aan het klikken bent.

Er staat nu op **elke** pagina een vijfde tegel **Alle zones** (27), vooraan, met het
2×2-icoon. Op `/collections/all` is dat de huidige staat (geen link), elders een link
naar `/collections/all`. Vooraan en op elke pagina in dezelfde volgorde, zodat de tegels
niet verspringen terwijl je tussen zones heen en weer klikt.

Vijf tegels passen niet zomaar in het raster van vier. De kolommen lopen nu mee met het
aantal tegels via `:has(.zkaart:nth-child(5))`, met twee dingen om te onthouden:

- **De `:has()`-regel moet binnen een breedteband staan.** Hij is specifieker dan
  `.wsc .zonekiezer` in de containerquery's eronder en overrulede anders óók de
  tabletkolommen en de telefoonscroller. Dat ging hier eerst mis.
- **Tussen 981 en 1180px is vijf naast elkaar te smal.** "schaamstreek" is met 84px het
  langste woord in de rij; bij vijf kolommen houdt de naamkolom daar minder dan dat over
  en breekt het woord middenin. In die band staan er daarom drie op een rij (3 + 2).

De ladder is dus: ≥1181px vijf naast elkaar · 981–1180px drie · ≤980px twee ·
≤700px de horizontale strip met ronde iconen. Nagemeten op negen breedtes maal vier
pagina's: nergens breekt een naam nog midden in een woord.

### Op de telefoon schuift het opzij in plaats van omlaag

Vier zonetegels onder elkaar plus vier filterknoppen in twee rijen kostte bijna een half
scherm voordat de eerste productkaart in beeld kwam. Op de telefoon zijn het daarom twee
horizontale strips.

De zones worden een rij ronde iconen met de naam eronder en het aantal als badge op de
cirkel; de zone waar je staat is een donkere cirkel met een gouden ring. De filterknoppen
staan naast elkaar en schuiven opzij. Beide alleen met opmaak — de markup is op elke
breedte dezelfde, dus er is niets dat uit de pas kan gaan lopen.

Twee dingen om te weten als je hieraan sleutelt. Een scroller snijdt af wat erboven
uitsteekt, dus de knoppenstrip heeft `padding-top` nodig voor het lintje op Bundels — en die
ruimte moet **minstens zo hoog zijn als het lintje zelf**. Dat ging de eerste keer mis: het
lintje was 23,6px en de strip reserveerde er 14, dus werd de bovenkant van *Meeste waarde*
weggesneden. `overflow-x:auto` snijdt namelijk ook verticaal af; `overflow-y:visible` helpt
niet, de browser maakt daar `auto` van. Het lintje is nu strakker gezet (`line-height:1.15`,
17,8px hoog) en de strip reserveert 20px. Meet het na als je aan een van beide komt — de
test hiervoor staat verderop. En een
zonetegel zonder icoon heeft geen cirkel om het badge boven te hangen; die valt terug op
`position:static` (`:not(:has(.zkaart-ico))`), zodat het aantal nooit op de naam belandt.
De tegel *Alle zones* op de overzichtspagina had geen icoon en liep daarop stuk; die heeft
er nu een van zichzelf — de vier zone-iconen in een 2×2, `ws-zone-icoon-alles.png`.

Los daarvan: een lange zonenaam liep in het tegelformaat buiten zijn vak en kwam onder het
rondje. `overflow-wrap:anywhere` op de naam houdt hem binnen.

### De onderste regel van de filterbalk is weg

Onder de knoppenrij stond een tweede regel: *Jouw keuzes* met een chip per beantwoorde
vraag, een knop *Wis alles*, en een tip. Die is er in zijn geheel uit — markup, CSS, JS,
instellingen en de sleutels in de negen sjablonen. **"Het creëert alleen maar meer chaos
en ruis."**

Er gaat niets aan bediening verloren: een losse vraag terugdraaien doe je met het potlood
in de keuzehulp zelf, en alles terugzetten met *Opnieuw beginnen*. Die twee stonden er al
en zitten dichter bij de vraag waar het over gaat.

Met de chips vervielen ook `chips()` en `wisGroep()` in de JS, de sprite-symbolen
`wsr-fonkel` en `wsr-kruis`, en de terugval die de regel op typepagina's verborg.

### De regel "Je bekijkt … " is ook weg

Onder de zonekiezer stond *Je bekijkt Neus & oren — 8 verdeeld over twee lijnen…*, met een
gouden vinkje ervoor. Zelfde oordeel, en terecht: de eyebrow zegt al **NEUS & OREN · 8
MODELLEN** en de kop eronder gaat over niets anders. Twee keer hetzelfde bevestigen leest
als ruis.

Daarmee vervielen `zonemelding`, `zone_aantal`, `.zm-vink`, en het stukje JS dat `.zn` en
`.za` bijwerkte als je op een zonetegel klikte.

### De iconen

De vier grote zone-iconen zijn de gegenereerde gouden lijniconen. De acht kleine
UI-iconen — raster, trimmer, cadeau, mes, regelaars, fonkeling, kruisje, chevron — zijn
met de hand als SVG in de sprite gezet, in dezelfde lijntaal als de bestaande (24×24,
`stroke-width` 2.1, ronde uiteinden). Dat is bewust geen generatie: ze moeten
`currentColor` erven — wit op de zwarte knop, donker op de rest — en scherp zijn op 16px.
Een bitmap kan geen van beide.

### Een naambotsing om te onthouden

De slotsectie gebruikte `.zk` al voor zijn zonekaarten. Mijn eerste versie van de
zonekiezer gebruikte diezelfde naam; die kaarten staan in een donkere sectie met
`flex-direction:column`, en dat lekte in de nieuwe tegels voor elke eigenschap die ik niet
zelf zette. De zonekiezer heet daarom `.zkaart`. Controleer bij een nieuwe klasse of hij
elders in dit bestand al bestaat.

## De vergelijker en het sorteren

Twee knoppen in de filterbalk deden niets. Verschillende oorzaken.

**Vergelijken.** De CSS (`.vgl-uit`, `.vgl`) en de JS (`vgltel`, `toonVergelijking`)
waren wél overgezet uit het ontwerp, maar de markup van het paneel niet. De knop werd
dus keurig actief bij twee vinkjes en er gebeurde vervolgens niets, want er was niets
om te openen. Het paneel staat nu onderaan de rastersectie en wordt gevuld uit dezelfde
productgegevens als de kaarten: foto, titel, sterren en aantal uit Loox, prijs,
`custom.included_box` als aantal onderdelen, tot drie regels uit `custom.product_usp`,
en de leverbaarheid. Niets ervan staat vast in het sjabloon.

Alleen apparaten komen erin — dat zijn ook de enige kaarten met een vinkje. Maximaal
drie tegelijk; bij drie gaan de overige vinkjes op slot.

### Een venster en een balk, geen paneel onderaan

Het paneel stond onder aan de rastersectie. Wie twee vinkjes zette werd dus naar
beneden gestuurd, en om te vergelijken moest hij eerst weer omhoog naar de knop in de
filterbalk. Dat is nu anders:

- **De keuzebalk** komt onder in beeld zodra er één vinkje staat, met het aantal, een
  *Wis* en de knop *Vergelijk* (uit tot er twee staan). Je hoeft nergens meer heen.
- **De vergelijking** opent als een venster over de pagina, met een waas erachter.
  Sluiten kan met het kruisje, met Escape en door naast het venster te klikken; de
  focus keert terug naar de knop waarmee je het opende en de pagina eronder scrollt
  niet mee. De keuze blijft na het sluiten staan.

Op de telefoon is het venster een blad dat van onderen komt en schuiven de kaarten
opzij; op het brede scherm staan ze gecentreerd naast elkaar.

**Twee valkuilen die hier tijd kostten — lees dit voordat je iets toevoegt.**

1. **`position:fixed` werkt niet binnen `.wsc`.** Die heeft `container-type:inline-size`
   en dat maakt het element het containing block voor vast gepositioneerde kinderen: een
   vaste laag erbinnen krijgt een vak van **0×0**. De popup en de balk staan daarom in
   een aparte `<div class="wsc-laag">` ná het sluiten van `.wsc`. Die laag erft de
   tokens (het tokenblok geldt voor `.wsc, .wsc-laag`) maar is zelf `display:contents`,
   dus hij is geen container en genereert geen vak.
2. **Dit thema heeft een globale regel `div:empty{display:none}`.** De waas achter het
   venster is een lege `<div>` en was daardoor onzichtbaar én niet aanklikbaar, zonder
   dat er iets in de eigen CSS stond. `.vgl-waas` zet zijn `display` nu expliciet terug.
   Geldt voor elke lege div die je hier toevoegt.

Verder stond de kop **Waarvoor** binnen de lus over de drie eigenschappen, waardoor hij
drie keer boven elkaar verscheen. Nu één kop met drie regels eronder.

De oude CSS voor het paneel (`.wsc .vergelijk`, `.wsc .vgl…`) en voor een balk die nooit
markup heeft gehad (`.wsc .vgl-balk` met `.vb-ico`, `.vgl-knop`) is weggehaald. Twee
definities van `.vgl` naast elkaar laten staan is precies hoe de botsing met `.zk`
eerder ontstond.

**Sorteren.** "Meest relevant" was een `<button>` zonder opties en zonder handler; kale
opmaak. Het is nu een echte `<select>` met de knopopmaak eroverheen — zo blijft het
uiterlijk gelijk, maar krijgt de bezoeker op mobiel de systeemkiezer en werkt hij met
het toetsenbord. Vier keuzes: meest relevant, prijs op, prijs af, best beoordeeld.

Er wordt **per groep** gesorteerd, niet over de hele pagina. Een groep is een keuze van
de redactie ("Scheren tot glad", "Trimmen, lengte en lijnen") en die volgorde wil je
niet door elkaar husselen. De oorspronkelijke volgorde wordt bij het laden op elke
kaart vastgelegd in `data-volgorde`, zodat "Meest relevant" er exact naar terugkeert —
en zodat kaarten met dezelfde prijs hun redactionele volgorde houden. Producten zonder
beoordeling komen achteraan bij "best beoordeeld": geen beoordeling is geen slechte
beoordeling.

De categoriefilters (Alles / Apparaten / Bundels / Onderdelen) werkten al; nagelopen en
in orde, inclusief de telling.

Getest in een browser op de echte pagina: elf vinkjes, knop uit bij nul en één, aan bij
twee, overige acht op slot bij drie, paneel opent met precies de drie gekozen apparaten
en sluit weer. Sorteren: 3995-4995-4995-8995 oplopend, omgekeerd aflopend, 4,7-4,7-4,6-0
op beoordeling, en exact terug naar de redactionele volgorde.

## De lintjes op de kaarten

Er stond op sommige kaarten een lint als `NIEUW ·MET STATIONWELLSHAVE-SCHEERAPPARAAT-ELITE`,
half onder de vergelijk-knop door. Dat waren twee losse fouten die elkaar versterkten.

**De data.** Het veld `labels` was in het schema als `"type": "text"` gedeclareerd —
een enkelregelig veld — terwijl de inhoud één regel per product is. Shopify gooit de
regeleindes dan weg, dus `…station\nwellshave-scheerapparaat-elite = …` werd één lange
regel en de splitsing op `=` leverde het lint van de één plús de handle van de volgende.
Het veld is nu `textarea`. Alle andere meerregelige velden (`opties`, `tabel`) waren al
goed; ik heb ze allemaal nagelopen.

Daarbij accepteert de parser nu alleen een regel met **precies één** `=`. Raken de
regeleindes ooit opnieuw kwijt, dan valt het lint gewoon weg in plaats van dat er een
handle in verschijnt.

**De opmaak.** Het lint stond linksboven op de foto en de vergelijk-knop rechtsboven.
Op een kaart van rond de 160px — mobiel én in het vierkolomsraster — passen die niet
samen: het lint is er zo'n 120px en de knop 71px. Ruimte reserveren helpt niet, dan
wordt élk lint afgekapt. De vergelijk-knop staat nu op de onderrand, links van het oog,
en het lint heeft de hele bovenrand. Wat dan nóg te lang is, krijgt een beletselteken
in plaats van door te schieten.

Onderweg bleek het raster van twee kolommen ineens naar vier te springen, waardoor een
kaart tussen 700 en 1040px maar 153px breed was — smaller dan op een telefoon. Daar
zitten nu drie kolommen tussen.

**Houd een lint onder de twintig tekens.** Er was er één die eroverheen ging,
`Laagste prijs van het paar`; die is `Zelfde set, goedkoper` geworden, wat het lint van
de Gold (`Zelfde set, in goud`) spiegelt. In het matchpaneel is ruimte zat, daar mag de
lange versie blijven staan.

Nagemeten in een browser over negen pagina's en vijf breedtes (390, 600, 768, 1024,
1440): 485 lintjes, nul botsingen, nul die buiten de kaart vallen, nul afgekapt.

## Het megamenu: zone boven, type eronder

De SHOP-knop opende een platte rij van tien collecties. Die is nu in twee groepen
gesplitst, met dezelfde regel als de pagina's: **zone ordent, type benoemt.**

```
Kies je zone      Lichaam & schaamstreek · Gezicht & baard · Hoofd · Neus & oren
Of zoek op type   Scheerapparaten · Baardtrimmers · Tondeuses · Safety Razors ·
                  Ladyshaves · Accesoires · Bundels · Alle producten
```

Daar zijn drie bestanden voor:

- `sections/header.liquid` — de tegellijst is opgesplitst op `megamenu_zones`, het
  aantal tegels in de eerste groep. Staat dat op 0, dan krijg je exact de oude,
  ongegroepeerde rij terug; het blijft dus bruikbaar voor elk ander menu-item.
- `snippets/ws-megamenu-tegel.liquid` — één tegel, voor desktop en mobiel, zodat de
  opmaak niet vier keer in het bestand staat.
- `assets/ws-megamenu.css` — alleen de koppen en de groepafstand. Los van
  `header.css` gehouden, zodat het basisthema onaangeroerd blijft.

Met `megamenu_labels` zet je een andere naam op een tegel: één regel per collectie,
`handle=Naam`. Zo staat er **Lichaam & schaamstreek** boven een collectie die
`Bodygroomers` heet, zonder dat de collectie zelf hernoemd hoeft te worden — die
titel staat ook in de winkel, in zoekresultaten en in Google.

`thema/origineel/header.liquid` is de versie van vóór deze wijziging (MD5
`21cd95adcd673171001927eae1b517a5`), voor als je terug wilt.

## De zone-iconen

De vier zonetegels in het megamenu zijn géén productfoto's maar gouden
lijniconen: een romp, een gezicht met baard, een kaal hoofd, een neus met oor.
Dat is niet alleen een gat vullen — het maakt het verschil tussen de twee groepen
pas zichtbaar. Een rij productfoto's boven een rij productfoto's leest als één
lange lijst; een icoon zegt "dit is een plek op je lichaam", een foto zegt "dit is
een apparaat". Bijkomend voordeel: Hoofd en Tondeuses toonden anders bijna
hetzelfde apparaat.

Gemaakt met Higgsfield (nano-banana), als één beeld met alle vier de iconen naast
elkaar — zo is de lijndikte over de set gelijk. De bronbeelden staan in
`thema/beeld/bron-iconenset-*.png`. De uiteindelijke set komt uit twee runs: de
romp uit de tweede (de eerste tekende twee losse armen), de andere drie uit de
eerste (de tweede gaf ze ogen en baardarcering, te druk op tegelformaat). De romp
is daarna drie keer verdikt zodat de mediane lijnbreedte op alle vier gelijk is —
8 pixels op een tegel van 278×220.

**Dit is een icoon, geen tekening van een mens.** Dat onderscheid is de reden dat
dit wél mag en de getekende lichaamskaart uit blok 3 niet: een pictogram is een
symbool en wordt ook zo gelezen, een illustratie doet zich voor als een afbeelding
van iemand. Blijf aan die kant van de streep als je de set ooit uitbreidt.

### Waarom een eigen metafield

De iconen zitten in `custom.zone_icon`, niet in `custom.megamenu_image`.
`bodygroomers` en `neustrimmers` staan namelijk óók in het megamenu van het live
thema; had ik hun `megamenu_image` overschreven, dan waren de gouden iconen
meteen live verschenen. `ws-megamenu-tegel.liquid` kiest `zone_icon` eerst en valt
anders terug op `megamenu_image`, en het live thema kent `zone_icon` niet. Zo zien
de twee thema's iets anders zonder dat er iets gekopieerd hoeft te worden.

Een tegel met een icoon krijgt `.is-icoon`: `object-fit: contain` in plaats van
`cover`, zodat het lijnwerk niet wordt afgesneden.

## Het megamenu onder SHOP

Het menu is opnieuw opgebouwd naar het ontwerp: drie kolommen naast elkaar in
plaats van twee rijen tegels.

| kolom | wat erin staat |
|---|---|
| **Shop op zone** | vier grote tegels met een ondertitel; daaronder de link *Bekijk alle zones* |
| **Shop op type** | zeven compacte regels met een pictogram; daaronder, achter een streep, de uitgelichte kaart *Bundels* met het label *Meeste waarde* |
| **Promo's** | twee donkere kaarten: de Summer Sale met foto en gouden knop, en Bundels als tekstkaart |

Bestanden: `sections/header.liquid` (opmaak en schema),
`assets/ws-megamenu.css` (alle stijl), `snippets/ws-megamenu-tegel.liquid`
(één regel, in drie soorten), `snippets/ws-megamenu-promo.liquid` (één
promokaart) en `snippets/ws-megamenu-sprite.liquid` (de pictogrammen).
`header.css` van het basisthema is niet aangeraakt: alles binnen `.wsmm` staat
in ons eigen bestand, alleen het paneel zelf (positie, achtergrond, openklappen)
komt nog van het thema.

### Instellingen

De twee kolommen hebben elk hun eigen collectielijst (`mm_zones`, `mm_types`),
zodat dezelfde collectie in beide kolommen mag staan met een andere naam —
`bodygroomers` heet links *Lichaam & schaamstreek* en rechts *Bodygroomers*.
Daarom ook twee labelvelden. De regels hebben de vorm
`handle=Naam|Ondertitel`; de ondertitel is optioneel.

`mm_zone_licht` is de handle van de tegel die de zand-gouden achtergrond krijgt
(nu `bodygroomers`). `mm_type_licht` is de handle die uit de typelijst wordt
gehaald en onderaan als kaart verschijnt (nu `bundels`), met
`mm_type_licht_badge` als gouden label.

### Pictogrammen

Zones houden hun gouden lijnicoon uit `custom.zone_icon`. Types krijgen een
pictogram uit de sprite; de koppeling handle → pictogram staat in
`ws-megamenu-tegel.liquid`. Productfoto's zijn hier niet bruikbaar: op 34 px in
een rondje worden `redesign_header_collection_*.png` onleesbaar.

Bij het hertekenen bleek 24×24 met streek 2,1 te zwaar voor 18 px: *Tondeuses*
en *Neustrimmers* werden een vlek. De regel die wél werkt: streek 1,9, vormen
die het raster vullen, en minstens vier rastereenheden tussen twee lijnen.
*Bodygroomers* en *Baardtrimmers* zijn uit elkaar te houden op silhouet — breed
en gedrongen tegenover smal en lang — niet op detail; detail overleeft 18 px
niet.

### Twee dingen die tijd kostten

**Shopify gooit onbekende instellingen weg.** `header.liquid` en
`header-group.json` in één `themeFilesUpsert` zetten werkt niet: de JSON wordt
gekeurd tegen het schema dat op dat moment nog in het thema staat, en alles wat
daar niet in voorkomt verdwijnt zonder foutmelding. `mm_zones`, `mm_types` en de
tweede banner waren zo meteen weg, terwijl `megamenu_kop_1` — die al bestond —
wel bleef. Eerst het `.liquid` erin zetten, daarna pas de `.json`.

**Een lege `<div>` als scheidingslijn wordt niet getekend.** Het thema heeft een
globale regel `div:empty{display:none}`. Die is specifieker (0,1,1) dan een losse
klasse (0,1,0), dus `display:block` erbij zetten helpt niet — hij wint ongeacht
de volgorde. De streep boven de bundelkaart is daarom een `::before` op de kaart
zelf.

### Maten

Onder 1200 px blijven de drie kolommen staan; alleen de promokolom wordt smaller
(258 px). De kaarten eronder schuiven maakte het paneel ~220 px hoger, en dan
moest het op een 800 px hoog scherm scrollen. Het paneel houdt nu op elke maat
tussen 992 en 1600 px dezelfde hoogte van ±550 px en past zonder scrollen; het
basispaneel kreeg daarvoor 40 px lucht in plaats van 56.

Gemeten over acht schermmaten (1600×900 tot 992×700), veertien controles per
maat: aantallen, lege links, overlappende regels, afgekapte tekst, iets buiten
het paneel, de scheidingslijn, scrollen en horizontale overloop — 112 van 112
goed. De mobiele lade is op 390 en 360 px gecontroleerd: vier zonetegels met
ondertitel, zeven typeregels, de bundelkaart en de link, niets afgekapt.

### Wat afwijkt van het ontwerp

- Het ontwerp noemt een rij *Mesjes & koppen*. Die collectie bestaat niet;
  `accesoires` (16 producten: mesjes, scheerkoppen, opzetstukken, tassen) dekt
  precies dat, en heet in het menu *Mesjes & accessoires*.
- `ladyshave` staat niet meer in het menu. Die collectie is niet gepubliceerd op
  het Online Store-kanaal, dus de tegel bleef altijd leeg — ook in het live thema.
- *Alle zones* is geen tegel meer maar de link *Bekijk alle zones* onder de
  zonekolom, zoals in het ontwerp.
- "Tot 40% korting" is nagerekend: de grootste korting in `summer-sale-deals` is
  de Essential Flex Bundel, €79,95 tegen €133,25 — precies 40,0%. "Minder dan
  wanneer je alles los koopt" staat op alle vijftien bundels als
  compare-at-prijs.

## De mobiele lade

Naar het tweede ontwerp is niet alleen het SHOP-submenu vervangen, maar de hele
lade. Twee niveaus:

**Hoofdmenu** — zwarte kop met het merkteken, een sluitknop en het mandje; een
gouden actiebalk; vijf menuregels met een gouden pictogram, een ondertitel en
een chevron, waarvan BUNDELS zandkleurig oplicht met het label *Meeste waarde*;
de donkere keuzehulpkaart; de Trustpilot-widget met de taal- en accountregel; en
onderaan *100 dagen proberen*.

**SHOP-submenu** — zwarte kop `‹ MENU | SHOP | ✕`; de promokaart; de zones; de
link *Bekijk alle zones*; de types; de bundelkaart; een compacte keuzehulpkaart.

Bestanden: `snippets/ws-lade-rij.liquid` (één menuregel) en
`snippets/ws-lade-hulp.liquid` (de keuzehulpkaart), plus het `wsl-`-deel van
`assets/ws-megamenu.css`. De lade zelf blijft van `header.css`; met
`:has(.wsl-kop)` wordt hij fullscreen en verdwijnt de losse ronde sluitknop,
zodat een lade zonder deze opbouw zijn oude maten houdt.

### Instellingen

Per menu-item: `mob_icoon` (keuze uit de sprite), `mob_sub`, `mob_sub_goud`,
`mob_licht` en `mob_badge`. Op sectieniveau: `mob_merk`, `mob_actie_tekst` en
`mob_actie_link`, de vier `mob_hulp_*`-velden en `mob_belofte`.

### Drie dingen die niet konden zoals getekend

**"Vijf vragen. Direct persoonlijk advies. · 60 sec" is niet waar.** De
keuzehulp staat bovenaan de collectiepagina's en stelt twee vragen op
`/collections/all` en twee tot drie op de zonepagina's; een aparte quizpagina
bestaat niet. Er staat nu *"Twee vragen, en je ziet wat bij je past."* met de
knop *Start de keuzehulp*, zonder tijdsclaim. Komt er ooit een echte quiz, dan
is de tekst een instelling.

**"Uitstekend · 4,6 · 650+ reviews" is niet overgenomen als tekst.** Dat zijn
cijfers die verlopen. De Trustpilot-widget die er al stond blijft staan en toont
de actuele score.

**Het ingestelde logo is donker.** `redesign_header_logo.webp` heeft een
gemiddelde helderheid van 63/255 en valt weg op de zwarte kop. De kop toont nu
`ws-mark.png` (het gouden S-teken) plus het woordmerk als tekst. Een lichte
logovariant kan later in `mob_merk`.

### Twee kolommen alleen waar ze passen

Het ontwerp zet zones en types in twee kolommen. Gemeten met het themalettertype
is "schaamstreek" 83 px en "Scheerapparaten" 96 px breed, terwijl een halve
tegel op een 360 px scherm 68 respectievelijk 73 px overlaat — dan breekt het
woord middenin. Zones gaan daarom naar twee kolommen vanaf 400 px, types vanaf
420 px; daaronder één kolom. Een oneven laatste tegel neemt de volle breedte.

Gecontroleerd op 430, 390, 375 en 360 px: 52 van 52 controles goed (aantallen,
niets buiten de rand, geen botsende onderdelen, geen afgekapte tekst, geen
horizontale overloop) en op alle vier de maten breekt geen enkel woord middenin.

De koppen heten op beide niveaus *Shop op zone* en *Shop op type*; het mobiele
ontwerp zei *Kies je zone*. Ze komen uit dezelfde instelling als op desktop, dus
één naam per kop — een tweede veld leek meer beheerwerk dan het waard is.

## De review en de belofteregel zijn weg

Onder de herotekst stonden een proefkaart (Trustpilot-score plus een citaat met
de blauwe geverifieerde badge) en een regel met *100 dagen proberen · 2 jaar
garantie · Morgen in huis*. Die zijn verwijderd — op de telefoon stonden ze
tussen de kop en de keuzehulp in, precies waar de bezoeker verder wil.

Verwijderd op alle schermen, niet alleen mobiel: opmaak, CSS, de vier sprites
die er alleen voor waren (`wsc-badge`, `wsc-retour`, `wsc-schild`, `wsc-truck`),
negen instellingen en dezelfde negen sleutels uit alle negen templates. De
blauwe geverifieerde badge verdwijnt daarmee ook; die zat alleen op dat citaat.
De garantiebelofte staat nog wel onderaan de mobiele lade en in de slotsectie.

## Vier vragen op /collections/all

De keuzehulp op de overzichtspagina stelde twee vragen (zone en los/set) en had
acht uitkomsten. Voor een collectie van deze omvang is dat te grof. Nu vier:

| # | sleutel | vraag | opties |
|---|---|---|---|
| 1 | `zone`  | Waar wil je aan de slag? | lichaam · gezicht & baard · hoofd · neus & oren |
| 2 | `klus`  | Wat moet het apparaat vooral doen? | glad scheren · kort houden · precies bijwerken |
| 3 | `breed` | Gebruik je hem ook ergens anders? | alleen hier · ook elders |
| 4 | `vorm`  | Eén apparaat, of een complete set? | één apparaat · complete set |

Dat zijn 4 × 3 × 2 × 2 = 48 combinaties, gedekt door 26 beslisregels en
26 matchpanelen.

**De teksten zijn niet nieuw geschreven.** Elk matchpaneel draagt een naam, een
badge, een zin en drie redenen — waaronder getallen als "4,9 uit 192
beoordelingen". Die zijn letterlijk overgenomen uit de matchpanelen die al op de
zonepagina's stonden; er is geen enkele nieuwe claim bijgekomen. Drie panelen
van de zonepagina's vielen af omdat geen enkele combinatie erop uitkomt
(`bgold`, `basic`, `prem`, `adv`); die blijven op hun eigen zonepagina staan.

De opzet is met een script gecontroleerd: geen combinatie zonder uitkomst, geen
regel die naar een ontbrekend paneel wijst, geen paneel dat onbereikbaar is.
Daarna in de browser 28 combinaties doorgeklikt — alle 28 komen op het
verwachte product uit, en de stapper telt 4 van 4.

### Het wordt niet langer bovenaan

De zorg bij vier vragen is dat de kaart de pagina overneemt. Gemeten op 390 px:
491 px bij aanvang, en tijdens het invullen 487, 484 en 528 px. De kaart groeit
dus niet mee met het aantal vragen, want een beantwoorde vraag klapt dicht tot
één regel met het antwoord en een potlood. Pas na de laatste vraag wordt hij
1041 px, en dat is het advies zelf.

Met 26 panelen in de opmaak laden de matchfoto's nu lui (`loading: lazy`); ze
staan verborgen tot er een match is.

## Vier vragen op de zonepagina's

Dezelfde stap voor de vier zones. Elke vierde vraag staat op een verschil dat
letterlijk in de bestaande producttekst staat, zodat er geen claim bij komt.

| zone | vragen | combinaties | panelen |
|---|---|---|---|
| Lichaam | afwerken · neushaar · onder de douche · los of set | 16 | 6 |
| Gezicht & baard | klus · los of set · neushaar · ook glad afwerken | 32 | 9 |
| Hoofd | klus · los of set · ook de baard · mee op reis | 24 | 6 |
| Neus & oren | wenkbrauwen · shaver · ook elders · nieuwste lijn of prijs | 24 | 8 |

Waar de nieuwe vragen op staan:

- **onder de douche** — de Groom Guard PRO en de Flex Guard zijn IPX7
  waterdicht, de Groom Guard en de Dual Groomer niet.
- **ook glad afwerken** — de Supreme 6-in-1 heeft een micro shaver "die de
  5-in-1 niet heeft"; dat staat al in zijn eigen tekst.
- **mee op reis** — de Skull Deal 3.0 heeft "tas én harde koffer".
- **ook elders** (neus) — de Ultra noemt de baardlijn, de Ultimate het
  bodygroomer-opzetstuk. Dat was tot nu toe het enige echte verschil tussen die
  twee, en het werd niet uitgevraagd.

Bij neus is de oude vraag "wat wil je bijwerken?" uit elkaar getrokken in drie
losse vragen (wenkbrauwen, shaver, ook elders). Daardoor loopt de bezoeker de
ladder van opzetstukken nu stap voor stap af in plaats van 'm in een keer te
moeten overzien.

### Hoe diep elke vraag werkelijk snijdt

Niet elke vraag splitst overal — het assortiment biedt niet voor elke zone vier
onderscheidende assen. Geteld over alle combinaties, het aantal situaties waarin
die vraag het advies verandert:

| zone | vraag 1 | vraag 2 | vraag 3 | vraag 4 |
|---|---|---|---|---|
| Lichaam | 2 | 3 | 2 | 4 |
| Gezicht | 5 | 4 | 3 | **1** |
| Hoofd | 4 | 5 | **1** | **1** |
| Neus | 2 | 4 | 6 | 3 |

Geen enkele vraag is loos, maar op de hoofdpagina doen "ook de baard" en "mee op
reis" elk maar een splitsing, en op de gezichtpagina geldt dat voor "ook glad
afwerken". Dat wordt vanzelf beter zodra er een product bijkomt dat op die as
verschilt; het alternatief was een vraag stellen die niets doet.

Gecontroleerd met een script (geen combinatie zonder uitkomst, geen regel naar
een ontbrekend paneel, geen onbereikbaar paneel) en daarna in de browser: alle
96 combinaties over de vier pagina's komen op het product uit dat de tabel
voorschrijft, en de stapper telt overal 4 van 4.

Op 390 px blijft de kaart tijdens het invullen tussen 379 en 528 px — net als op
de overzichtspagina groeit hij niet mee met het aantal vragen.

### Waar `breed` niets doet

Bij `zone=hoofd` splitst de derde vraag niets: de zes hoofdproducten hangen aan
`klus` en `vorm`. De vraag wordt daar wel gesteld maar verandert het advies
niet. Dat kan later scherper met een apart product voor "ook elders".

## Bekijken zonder te publiceren

Open eerst deze link, daarna werkt elke collectiepagina in dezelfde browser:

```
https://wellshave.com/?preview_theme_id=204178161996
```

## Wat géén werk bleek te zijn

In een eerdere ronde noemde ik "dertien producten uit `/collections/all` halen" en
"de zonetags compleet maken" als voorwaarden. Dat klopte niet, en het is beter dan
gedacht:

- `/collections/all` is een **automatische** collectie (regel: variantprijs > €6).
  Je kunt er dus niets met de hand uit halen — en dat hoeft ook niet, want Shopify
  toont gearchiveerde, concept- en unlisted producten sowieso niet in de winkel.
  Van die dertien is er precies één die een bezoeker ziet: het uitverkochte
  neustrimmer-opzetstuk.
- `zone-gezicht` en `zone-hoofd` zijn ook **automatisch**, op tag. De aantallen die
  ik "fout" noemde (14 en 5) zijn de admin-tellingen inclusief archief; de winkel
  toont al de juiste 11 en 4.
- Er hoeft dus geen `zone:lichaam` of `zone:neus` te komen: `bodygroomers` en
  `neustrimmers` doen dat werk al.

## De generator

`zg_engine.py` en de vijf `zd_*.py`-bestanden zijn de bron van de artifacts;
`maak_templates.py` zet zo'n config om in een zonetemplate en `maak_typepaginas.py`
maakt de vier typepagina's. Pas de tekst
dus liever daar aan en genereer opnieuw, dan blijven ontwerp en thema gelijk.
