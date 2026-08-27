# Wellshave — productpagina in het thema

De homepage staat beschreven in `theme/README.md` (tak `claude/homepage-analysis-redesign-u38dwu`).
Dit bestand gaat over de productpagina.

## Waar het staat

| | |
|---|---|
| **Live thema** | `wellshave/claude-design` (id **204178161996**) — sinds 26 augustus gepubliceerd. Dit wás het testthema; **niet meer rechtstreeks in schrijven** |
| **Werkthema** | `wellshave/claude-design-werk` (id **204412977484**) — kopie van het live thema, gemaakt 26 augustus 17:23. **Hierin gaan alle nieuwe aanpassingen** |
| Voorbeeld | https://wellshave.com/products/groom-guard-pro?preview_theme_id=204412977484 |
| Oud | `wellshave-redesign/live` (200936096076) is niet meer gepubliceerd |

De kopie is op het moment van maken gelijk aan het live thema: sectie, stylesheet,
snippet en beide productsjablonen hebben daar dezelfde checksums. Wie hier verder
werkt, schrijft dus naar **204412977484** en publiceert die pas als het af is.

## Het standaardsjabloon draagt alles, niet een apart sjabloon

`templates/product.json` is de plek. Daar staat het koopvak als `main` en de
UGC-band als `ugc`, en elk product in de winkel komt daar uit. Het aparte
`templates/product.ws-pdp.json` blijft alleen als schoon voorbeeld bestaan
(`?view=ws-pdp`): koopvak en UGC-band zonder de oude secties eromheen. Er hangt
geen product aan.

**Waarom dat voor élk product geldt, ook met een eigen sjabloonachtervoegsel.**
Negenentwintig producten dragen nog een `templateSuffix` uit het oude thema:
`improved-template` (zestien stuks), `wellshave-groom-guard`,
`wellshave-shave-package-3`, `dual-groomer`, `men-shaper-gold`, drie
`safetyrazor-*`, vier `gp-template-*` en `free-gift`. Geen van die sjablonen
bestaat in dit thema — het thema heeft alleen `product.json` en
`product.ws-pdp.json`. Shopify valt dan terug op het standaardsjabloon.

Nagemeten op de storefront, niet aangenomen: de Groom Guard&trade;
(`templateSuffix: wellshave-groom-guard`) rendert in het werkthema de secties
`main`, `logos`, `ugc`, `trustpilot_reviews`, `product_media_with_text`,
`compare_table`, `whats_included`, `featured` en `faq` — precies de inhoud van
`product.json`. **Er hoeft dus niets aan de producten zelf te veranderen.** Was
het andersom, dan zouden de suffixen leeggehaald moeten worden, en dat is
productdata: dat raakt het live thema meteen mee.

### Twee oude secties staan uit

* **`ugc-videos`** &mdash; de oude UGC-carrousel. Vervangen door `ws-pdp-ugc`;
  twee carrousels onder elkaar is geen keuze.
* **`ss_payment_icons_Qi6V9R`** &mdash; de app-sectie die zichzelf met JavaScript
  achter de koopknop plakte. Het koopvak rendert de betaalmethoden zelf met
  `{% raw %}{% render 'payments' %}{% endraw %}`, server-side en zonder sprong.

Ze staan op `disabled`, niet verwijderd: aanzetten in de theme-editor kan
altijd nog.

`?view=ws-pdp` rendert `templates/product.ws-pdp.json` zonder dat er een
`templateSuffix` op een product gezet hoeft te worden. Er verandert dus niets
aan de producten zelf en niets aan het live thema.

## Wat erin staat

| Bestand | Wat |
|---|---|
| `sections/ws-pdp-koopvak.liquid` | Blok 01, alles boven de vouw |
| `assets/ws-pdp-koopvak.css` | De opmaak, overgenomen uit de mockup |
| `templates/product.ws-pdp.json` | De volgorde van de pagina |

## Afspraken die deze sectie volgt

* **De wortel is `<main-product>`.** De bestaande `base.js` hangt zich vast aan
  de id-voorvoegsels `ProductForm-`, `ProductSubmit-`, `ProductOptions-` en
  `ProductPrice-`. Daardoor werkt de winkelwagenlade en werkt de variantwissel
  zonder één regel nieuwe JavaScript. Die voorvoegsels niet hernoemen.
* **Geen `data-action`.** De klikafhandeling in `base.js` doet
  `this.querySelector('[id^="ProductLightbox-"]').querySelector(...)` zonder
  controle op `null`; zonder lightbox in de sectie gooit elke `data-action`-klik
  een fout. De gallerij heeft daarom zijn eigen script van twintig regels.
* **Padding via de sectie-instellingen**, niet via de CSS —
  `desk_indent_top` en `mob_indent_top`, gerenderd door `snippets/indent-settings`.
* **Mobiel is `max-width: 749px`**, de grens die het thema zelf aanhoudt. Daar
  wisselt het koopvak van volgorde: de knop komt vóór de reviewkaart te staan,
  precies zoals in het telefoonontwerp.
* **Elke klasse begint met `ws-`.**
* **Prijzen via `snippets/price-formated`**, zodat ze de winkelinstelling volgen.

## Wat uit het product komt en wat uit de sectie

| Uit het product | Uit de sectie-instellingen |
|---|---|
| titel, prijs, doorgestreepte prijs, voorraad | campagnelabel (terugval), Trustpilot-score, cadeauregel |
| `custom.subtitle` of `custom.hero_promise` | knoptekst, leverregel, teller |
| `custom.product_usp` | de vier accordeontitels, en de tekst van 3 en 4 |
| `custom.specification`, `product.description` | het klantcitaat, zolang `custom.buybox_quote` nog niet bestaat |
| `custom.included_box` | |
| `custom.limited_offer` → `product_title` | |
| `custom.shipping_information` | |

## Bestanden het thema in krijgen

Niet via de tekst van het bestand in een API-aanroep. Grote bestanden raken
onderweg beschadigd of worden geweigerd met `FILE_VALIDATION_ERROR`. De route
die wel werkt laat de bytes rechtstreeks van schijf naar Shopify gaan:

1. `stagedUploadsCreate` (`resource: FILE`) geeft een doel-URL met parameters
2. `curl -F 'file=@<pad>'` met die parameters &rarr; HTTP 201
3. `themeFilesUpsert` met `body: { type: URL, value: <resourceUrl> }`

Daarna controleren op `checksumMd5`, niet alleen op `size`: een vervanging van
gelijke lengte valt anders niet op.

Twee dingen die daarbij opvallen:

* **Volgorde telt.** Shopify controleert sectieverwijzingen bij het schrijven.
  Een sjabloon dat naar `ws-pdp-koopvak` wijst wordt geweigerd zolang het
  sectiebestand er nog niet staat. Dus: sectie eerst, sjabloon daarna.
* **Lezen loopt achter op schrijven.** Een afwijkende checksum vlak na een
  upsert betekent niet meteen dat de upload mislukt is. Komt de checksum
  overeen met een v&oacute;&oacute;rgaande versie van het bestand, dan is het leesvertraging
  en is opnieuw opvragen het juiste antwoord &mdash; niet opnieuw uploaden. Alleen
  een checksum die met g&eacute;&eacute;n enkele versie overeenkomt wijst op beschadiging.

## Als een upload niets doet

De URL-route schrijft w&eacute;l, maar slikt validatiefouten in: `themeFilesUpsert`
geeft dan `upsertedThemeFiles: []` met een lege `userErrors`, en het bestand in
het thema blijft onveranderd. Precies hetzelfde antwoord als bij een geslaagde
schrijfactie, dus daar valt niets aan te zien.

**`upsertedThemeFiles: []` is geen bewijs van mislukken.** De URL-route geeft
die lege lijst inmiddels ook terug bij een gelukte schrijfactie &mdash; getest met
een bestand van 23 bytes zonder schema, dat gewoon landde. Het antwoord van
`themeFilesUpsert` zegt dus niets; **haal de `checksumMd5` op** en vergelijk met
`md5sum` op het bestand hier. Alleen dat bewijst of de upload gelukt is.

### Een sjabloon en zijn sectie gaan niet in dezelfde upload

Shopify toetst de opgeslagen instellingen in een `templates/*.json` aan het
schema van de sectie, en gooit wat het niet kent er stil uit. Zet je de sectie
m&eacute;t een nieuwe instelling en het sjabloon d&aacute;t die instelling gebruikt in
&eacute;&eacute;n `themeFilesUpsert`, dan wordt het sjabloon nog tegen het oude schema
getoetst en verdwijnt de waarde. Geen foutmelding, alleen een checksum die niet
klopt.

Betrapt bij `vertrouwd` in de UGC-band: het sjabloon landde zonder die regel.
**Upload eerst de sectie, verifieer de checksum, en pas daarna het sjabloon.**

### Rijke tekst print je niet uit, die render je

Een `rich_text_field` dat je rechtstreeks uitprint geeft de ruwe JSON van het
veld op het scherm &mdash; `{"type":"root","children":[...]}`. Dat gebeurde bij
`limited_offer.offer_title` in de aanbodbalk en bij `included_box.description`
in de uitklapper &laquo;wat zit er in de doos&raquo;. De oplossing is beide keren
`| metafield_tag`. Let er dan op dat de opmaak van de omhullende `div` en de
`p` daarbinnen ook geregeld is; die brengen hun eigen marges mee.

**Schrijft een upload niet, doe hem dan &eacute;&eacute;n keer over met `type: TEXT`.** Die
route valideert en geeft de fout w&eacute;l terug. Zo kwam bijvoorbeeld boven water:

> `FILE_VALIDATION_ERROR` &mdash; Invalid schema: setting with id="tp_score" label is
> too long (max 70 characters)

Een `label` in het sectieschema mag maximaal **70 tekens** zijn; die van ons was
er 71. Voor `info` en de inhoud van een `paragraph` geldt die grens niet, dus
lange uitleg hoort daar en niet in het label.

Twee dingen die daar nog omheen zitten:

* **Een sjabloon bewaart alleen instellingen die het schema kent.** Wordt de
  sectie geweigerd en het sjabloon niet, dan verdwijnen precies de instellingen
  die bij de nieuwe sectie horen &mdash; stilletjes. Sectie eerst laten landen,
  daarna het sjabloon opnieuw sturen.
* **Zet in een `{% stylesheet %}`-blok nooit een procentteken direct tegen een
  sluitende accolade.** Liquid leest die twee tekens als het einde van een tag.
  Dus `border-radius:50% }` met een spatie.

## Omschrijving en specificaties zijn twee accordeons

Ze stonden samen in &eacute;&eacute;n accordeon: vijf alinea's plus veertien
specificatieregels. Wie hem opende kreeg een muur van bijna 800 pixels. Nu
zijn het er twee, met `acc1_titel` en `spec_kop` als titels, en staan de
specificaties in **twee kolommen** (`columns:2` op de wikkel die
`metafield_tag` maakt). Dat blok gaat daarmee van ongeveer 470 naar 177
pixels op 390 px breed.

Twee regels blijven over twee regels lopen omdat ze te lang zijn voor een
halve kolom; een hangende inspringing kan niet, want met `white-space:
pre-line` geldt `text-indent` alleen voor de eerste regel van de alinea en
niet voor elke regel erin. Daarvoor zouden de regels echte `li`-elementen
moeten worden, en daarvoor moet het veld eerst uit rijke tekst gehaald
worden.

`acc1_titel` staat in `templates/product.json` en
`templates/product.ws-pdp.json` opgeslagen, dus daar is de waarde ook
aangepast: van &laquo;Omschrijving &amp; specificaties&raquo; naar &laquo;Omschrijving&raquo;,
met `spec_kop` erbij. Een gewijzigde standaardwaarde in het schema doet
niets zolang het sjabloon de oude waarde bewaart.

## De doos-lijst is een accordeon in een accordeon

Zes artikelen met elk drie regels omschrijving is op een telefoon een muur
tekst. Daarom staat in &laquo;wat zit er in de doos&raquo; alleen de naam met zijn
foto in beeld en komt de omschrijving pas bij een tik: een `details` per
artikel, binnen de `details` van de accordeon zelf. Op 390 px scheelt dat
ruim de helft in hoogte, en er gaat geen tekst verloren.

Let op bij het opmaken: `.ws-acc details`, `.ws-acc summary` en
`.ws-acc details[open] summary i` erven door naar de binnenste `details`.
De regels onder `.ws-doos` draaien die opmaak terug. Het pijltje van de
binnenste rij is daarom een `em` en geen `i` &mdash; anders krijgt hij het
plusteken van de buitenste accordeon.

## Elk rijketekstveld heeft `metafield_tag` nodig

Drukt de sectie een rijketekstveld rechtstreeks af, dan staat de ruwe JSON op
het scherm: `{"type":"root","children":[{"type":"paragraph" ...`. Dat is nu
drie keer gebeurd &mdash; bij `limited_offer.offer_title`, bij
`included_box.description` en bij `custom.specification`. De regel is dus:
**elk veld van het type rijke tekst gaat door `| metafield_tag`.**

Controleren kan met een blik op de accordeon: staat er ergens `"type":"root"`
op de pagina, dan mist er een filter.

`custom.specification` heeft daarbij nog iets eigens: het hele veld is
&eacute;&eacute;n alinea met harde regeleindes erin. HTML vouwt die dicht tot een
doorlopende muur tekst, dus de stylesheet zet er `white-space:pre-line` op.

## Een nieuw metaobject staat op draft en is dan onzichtbaar

`metaobjectCreate` zet de `publishable`-capability standaard op **DRAFT**, en de
storefront geeft voor een draft-metaobject niets terug: `product.metafields
.custom.compare_info.value` is dan leeg. De metafield *verwijst* wel correct &mdash;
`reference` in de Admin API geeft gewoon het metaobject terug &mdash; dus aan de
API-kant lijkt alles goed.

Wat je in de pop-up ziet als het misgaat: de kaart en de knop tonen nog wel de
juiste naam en prijs, want die vallen terug op `cp.title` en de variantprijs.
Maar de vier voordeelrijen van die kolom ontbreken in de tabel, er staat geen
onderregel op de kaart, geen &laquo;Beste voor&raquo;, en de beslisregel mist zijn
tweede zin. Een tabel die alleen de rijen van het goedkoopste model laat zien,
allemaal met twee vinkjes, is dus geen ontdubbelingsfout maar dit.

Aanmaken hoort dus zo:

```graphql
metaobjectCreate(metaobject: {
  type: "compare_info",
  handle: "...",
  capabilities: { publishable: { status: ACTIVE } },
  fields: [...]
})
```

Controleren kan met:

```graphql
{ metaobjects(type:"compare_info", first:60){
    nodes{ handle capabilities{ publishable{ status } } } } }
```

Alle 29 `compare_info`-invoeren staan nu op ACTIVE.

## Blok 03: de UGC-band

`sections/ws-pdp-ugc.liquid` plus `assets/ws-pdp-ugc.css`. Staat in
`templates/product.ws-pdp.json` onder het koopvak.

De band leest twee bronnen, in deze volgorde:

1. **`custom.ugc_videos`** &mdash; een lijst metaobjecten van het nieuwe type
   `ugc_video` (definitie `46105985356`, metafield `520597799244`). Die dragen
   naast het bestand ook `name`, `line`, `verified` en `featured`.
2. **`custom.ugc_video_list`** &mdash; de kale lijst videobestanden die er al lag.
   Geen tekst, dus alleen beeld, duur en speelknop, en de eerste tegel is de
   brede. Zo werkt de band vandaag al op de Groom Guard (14), de PRO (10), de
   Head Shaver Deluxe (9) en de drie Men Shapers.

**De poster en de duur komen uit het bestand zelf** en hoeft niemand in te
typen: `video.preview_image` en `video.duration` (in milliseconden, dus delen
door duizend). De tegels staan op 9:16; een vierkante of afwijkende video wordt
bijgesneden met `object-fit:cover`.

De `video` staat op `preload="none"` met de poster erop, dus er wordt niets
gedownload tot iemand op de speelknop tikt. Dan gaan de sluier, de knop, de duur
en het tekstvak weg, en komen de eigen bedieningsknoppen van de browser
tevoorschijn. Speelt er al een video, dan wordt die gepauzeerd: twee video's
tegelijk horen is het snelste wat een bezoeker wegjaagt.

De teller en de voortgangsbalk volgen de **scrollpositie**, niet een eigen
index. Vegen met de vinger telt dan net zo goed mee als de pijlen.

### De kop is drie gezichten en &eacute;&eacute;n regel

Boven de kop staan drie ronde foto's die elkaar overlappen, met een blauw
vinkje rechtsboven, en daarnaast `Vertrouwd door 200.000+`. Meer niet. De
bovenregel, de lead en de telregel zijn eruit: de tegels eronder vertellen het
verhaal al, en drie tekstregels boven een videoband is drie te veel.

De drie foto's komen uit `foto1`, `foto2` en `foto3`. **Staan die leeg, dan
pakt de sectie de posters van de eerste drie video's** &mdash; dat werkt zonder dat
iemand iets hoeft te uploaden, maar een poster is een willekeurig eerste beeld
en dat is vaker een hand of een apparaat dan een gezicht. Drie echte portretjes
in die drie velden maken het verschil.

Het vinkje is `--u-blauw` (`#3B7DF0`) met een rand in de cr&egrave;mekleur van de
sectie, zodat het los van de foto's staat. Het is decoratie, dus het staat op
`aria-hidden`: het zegt niets wat de regel ernaast niet al zegt.

**Geen sterren per product.** Het ontwerp had er vier en een half plus &laquo;4,4&raquo;
bij de koopstrook staan. Die score bestaat niet per product &mdash; na het weghalen
van Loox is er alleen nog een winkelbrede Trustpilot-score. De strook toont nu
`4,4 uit 970+ Trustpilot-reviews` als winkelbrede regel, instelbaar in de sectie.

### Het reviewaantal staat op &eacute;&eacute;n plek, met een plus

Trustpilot stond op 23 augustus op 966 reviews, op 24 augustus op 968 en op
26 augustus op 975. Een exact getal in een tekstveld is dus de week erna al
fout. Daarom staat er `970+ reviews`: vandaag waar, en waar het blijft, want
het aantal loopt maar &eacute;&eacute;n kant op. Rond bij het bijwerken altijd naar beneden
af op een tiental.

De sectie las het aantal eerst uit `custom.compare_info.reviews_label` en pas
daarna uit de instelling. Dat betekende 33 metaobjecten met elk drie
vertalingen bijwerken voor &eacute;&eacute;n winkelbreed getal. Sinds nu wint de
sectie-instelling `tp_score` en is `reviews_label` alleen nog de terugval als
die leeg is. De regel in de vergelijkingspop-up staat los in `pop_reviewregel`
en moet met de hand mee.

Echt meebewegen kan Liquid niet: het rendert op de server en kan Trustpilot
onderweg niet bellen. Wil je dat wel, dan is de nette route een shop-metafield
dat een nachtelijke taak vult uit
`https://widget.trustpilot.com/trustbox-data/5419b6a8b0d04a076446a9ad?businessUnitId=63c511d4e1339e2200c204a1&locale=nl-NL`,
en dat de sectie leest in plaats van de instelling. Dat is nog niet gebouwd.

## Blok 05: in de praktijk

`sections/ws-pdp-praktijk.liquid` plus `assets/ws-pdp-praktijk.css`. Vervangt
`product-media-with-text`, die in beide sjablonen op `disabled` staat.

Leest `custom.image_with_text`: een lijst metaobjecten met `title`,
`description` (rijke tekst), `image` **of** `video`, en het nieuwe veld
`label`. Vier genummerde kaarten met beeld om en om links en rechts.

**De alinea en de lijst uit &eacute;&eacute;n veld.** De rijke tekst bevat een alinea plus
een `<ul>` met drie punten. De alinea wordt de uitleg, de lijstpunten worden
de vinkjes &mdash; dat is CSS (`li::before` met een ingebakken SVG), geen tweede
veld en geen parseerwerk.

**Het watermerknummer lijnt uit op de tekst, niet op de rand.** `right` staat
gelijk aan de rechterpadding van het tekstvlak (34 px, op de telefoon 20 px)
en het staat 26 px van de bovenkant. Stond het dichter op de rand, dan leek
het eraf te vallen in plaats van erachter te liggen.

**Het label is nieuw.** Veld `label` op de definitie `image_with_text`
(`34553495884`), &eacute;&eacute;n woord naast het volgnummer. Leeg laten mag: dan staat
er alleen `01`. Op de Groom Guard&trade; PRO staan er vier ingevuld, met en/de/fr
erbij.

**`media_position` wordt niet meer gelezen.** Dat veld stond als ingetypte
tekst (&laquo;Left&raquo;/&laquo;Right&raquo;) op elk metaobject &mdash; handwerk dat per product fout kan
staan. De kaarten wisselen nu automatisch om en om; de sectie-instelling
`beeld_links` bepaalt alleen waar de eerste begint.

**De video's spelen vanzelf, maar pas in beeld.** Een `IntersectionObserver`
op 40% zichtbaarheid zet `preload` op `auto` en start het afspelen; scrollt de
kaart eruit, dan pauzeert hij. Daarv&oacute;&oacute;r staat de video op `preload="none"`
met alleen zijn poster, dus er komt geen byte binnen voor een kaart die
niemand ziet. De oude sectie had `autoplay` als attribuut en haalde alle vier
de bestanden op bij het laden van de pagina.

Het zwarte plaatje linksonder is een **etiket, geen knop** (`aria-hidden`).
Lukt automatisch afspelen niet &mdash; beweging uitgezet, geen
`IntersectionObserver`, of de browser weigert met `NotAllowedError` &mdash; dan
maakt het script van het beeldvlak alsnog een echte knop, met `role="button"`,
`tabindex` en een naam.

E&eacute;n valkuil zit erin verwerkt: `play()` geeft een belofte die met
**`AbortError`** breekt als je `pause()` aanroept voordat het afspelen begonnen
is. Dat gebeurt bij snel doorscrollen. Die fout mag dus niet als weigering
gelden, anders krijgt elke kaart waar je langs scrolt een speelknop over het
beeld. Alleen een andere fout dan `AbortError` schakelt de knop in.

De kop telt zichzelf: `[aantal]` in de instelling wordt het aantal kaarten als
woord (&laquo;Vier momenten&raquo;), zodat een product met drie kaarten geen vier belooft.
De bovenregel staat leeg in beide sjablonen; het veld blijft bestaan, dus
invullen zet het randje terug.

**De strook naast het beeld wisselt om en om van zandtint**: oneven kaarten
`#FBF8F1`, even kaarten `#F0E8D8`, allebei instelbaar als kleur in de sectie
(`zand_a` en `zand_b`). Dat is `:nth-of-type(even)` op de kaart &mdash; het beeld
dekt zijn eigen helft af, dus de kleur van de kaart is precies de strook
ernaast. Vier kaarten in dezelfde tint lezen als één vlak; zo is elke kaart
een eigen stap.

### Een sectienaam is maximaal 25 tekens

`"name": "Wellshave PDP — In de praktijk"` is er dertig, en dan weigert
Shopify het bestand **zonder foutmelding**: `themeFilesUpsert` geeft een lege
`userErrors` terug en de sectie staat er gewoon niet. De checksum vergelijken
is het enige wat het aan het licht brengt. Nu heet hij
`Wellshave PDP — Praktijk` (24). Dezelfde grens geldt voor de presetnaam.

## De reviewkaart in het koopvak

Rechtsboven staat nu **Alle reviews &rarr;** naar het Trustpilot-profiel; het
vinkje &laquo;Geverifieerde koper&raquo; is naar de voetregel verhuisd, naast de naam.
Die plek rechtsboven is meer waard als uitgang dan als keurmerk, en het
vinkje hoort inhoudelijk bij de persoon.

Twee instellingen: `rev_alle_label` en `rev_alle_url`. Het profiel is
**`https://nl.trustpilot.com/review/wellshave.nl`** &mdash; op `.nl`, niet op
`.com`. Dat staat zo in `links.profileUrl` van de widget zelf.

### Een `url`-instelling mag geen `default`

De sectie werd stil geweigerd zolang er
`{ "type": "url", ..., "default": "https://..." }` in het schema stond:
`themeFilesUpsert` gaf een lege `userErrors` en de checksum bleef op de oude
staan. Shopify staat geen standaardwaarde toe op `url`. De waarde staat nu in
beide sjablonen in plaats van in het schema.

### Het citaat was geen fout maar een knipsel

In `custom.buybox_quote` van de Groom Guard&trade; PRO stond
&laquo;Erg fijne trimmer die z'n werk goed doet **(&hellip;)** zeker een
aanrader&hellip;&raquo;. Dat leest als een weggelaten bezwaar. De echte review van
Yven (8 juli 2026, vijf sterren) is heel: er was een tussenzin uitgeknipt.
Nu staat het citaat woordelijk, alleen de spaties binnen de haakjes zijn
rechtgezet.

**Er is geen tweede review over de Groom Guard.** De widget geeft maximaal
ongeveer 108 van de 975 reviews terug &mdash; alle sjablonen en pagina's samen
leveren dezelfde poel op. Daarin gaan er precies twee over het lichaam, en
Yven is de enige die echt over dit apparaat gaat. Productreviews per artikel
zitten in Loox, en die zijn niet via een open eindpunt op te halen.

## De upgrade-pop-up bij het toevoegen aan de winkelwagen

Klikt iemand op **In winkelwagen** en heeft het product
`custom.upgrade_products`, dan komt er eerst een pop-up met de duurdere
varianten. Kiest hij er een, dan gaat *die* in de winkelwagen; kiest hij
&laquo;nee dank je&raquo;, dan het product zelf. Er wordt niets toegevoegd v&oacute;&oacute;r die
keuze.

**Openen doet `base.js` zelf.** Het thema had dit altijd al ingebouwd: in
`MainProduct` staat

```js
this.productUpgradePopup = this.querySelector('[id^="ProductUpgrade-"]')
```

en `onFormSubmit(event, skipUpgrade)` opent dat element in plaats van toe te
voegen zolang `skipUpgrade` niet waar is. Het oude sjabloon rendeerde zo'n
element; ons koopvak niet, en daarom was de pop-up weg. We renderen hem nu
weer, met exact die id.

**Sluiten en kiezen doen we zelf, en dat moet ook.** `initClickListeners` in
`base.js` begint bij *elke* klik op een `data-action` met

```js
this.productGallery.querySelector('slider-component')
this.querySelector('[id^="ProductLightbox-"]').querySelector('slider-component')
```

onvoorwaardelijk, nog v&oacute;&oacute;r de `switch`. Dit koopvak heeft geen galerij en geen
lightbox met die id's, dus daar loopt iedere klik stuk op
`Cannot read properties of null`. De sectie luistert daarom zelf op de pop-up,
roept `stopPropagation()` aan zodat die klik `base.js` niet meer bereikt, en
gebruikt alleen zijn winkelwagenlogica:

| knop | wat de sectie doet |
|---|---|
| `data-action="add-product"` | `hoofd.addToCart({items:[{id: data-variant, quantity:1}], sections:['cart-drawer']})` |
| `data-action="skip-upgrade"` | `hoofd.onFormSubmit(false, true)` |
| `data-action="close-popup"` | alleen sluiten |

`hoofd` is `wortel.querySelector('main-product')`, **niet** `wortel` zelf: die
wijst naar de sectiewikkel `shopify-section-…`, en daar zitten die methodes
niet op. Dat kostte een ronde.

`base.js` zet bij het openen de paginascroll vast met zijn eigen
`togglePageScroll()`; die functie staat niet op `window`, dus bij het sluiten
zet de sectie `document.documentElement.style.overflow` zelf weer leeg.

**Wat er in de kaarten staat komt uit de doos.** Per upgrade tonen we de
voorwerpen uit `custom.included_box` die *niet* in de doos van dit product
zitten, met een maximum van vier plus een telregel. Geen apart tekstveld, en
het klopt vanzelf zodra een doos verandert. De meerprijs is het verschil
tussen de twee varianten.

Alleen upgrades die **duurder** zijn en **op voorraad** staan komen erin. Is er
daarna niets over, dan bestaat het element niet en gaat de knop rechtstreeks
naar de winkelwagen &mdash; geen pop-up om niets.

**Nagemeten** met de echte `base.js` in een browser: bij het indienen opent de
pop-up en gaat er nog niets naar de winkelwagen; &laquo;Kies deze&raquo; op de Ultimate
stuurt precies &eacute;&eacute;n verzoek naar `/cart/add.js` met variant
`53414664929612`; &laquo;Nee dank je&raquo; stuurt er &eacute;&eacute;n met `53384928395596`, de PRO
zelf.

## Het koopvak staat op zand, niet meer op zwart

Sinds 27 augustus draait `assets/ws-pdp-koopvak.css` in
`wellshave/claude-design-werk` in de lichte variant. Alleen de stylesheet is
gewisseld: geen regel Liquid, geen instelling, geen sjabloon. Het donkere
koopvak is dus één bestand terugzetten — de vorige versie staat in de
geschiedenis van de tak, en `rapporten/blokken/01-above-the-fold-v2-donker.html`
laat beide naast elkaar zien in het hoofdstuk «LICHT».

De **live winkel staat er los van**: `wellshave/claude-design` is niet
aangeraakt.

Waarom licht: de apparaten zijn zwart en waren op `#0B0B0A` niet te zien. Dat
is de reden dat het blok twee gronden had — lichte fotokant, donkere koopkant.
Op zand draagt één grond allebei de kanten.

Drie dingen waren bij het omzetten niet mechanisch:

* **Goud is op licht geen tekstkleur.** `#EBC77E` haalt op `#0B0B0A` een
  contrast van 11,3 : 1 en op `#FBF8F1` nog 1,64 : 1. Elke gouden *letter*
  werd daarom brons `#8A5A1E` (5,59 : 1) — dezelfde kleur die de bovenregels
  van blok 05 al gebruiken. Goud blijft goud waar het een *vulling* is: de
  knop, de pil, het zegel.
* **Het vak verliest zijn vanzelfsprekende rand.** Crème `#FBF8F1` op zand
  `#EFE7D8` scheelt 1,16 : 1. Het koopvak heeft daarom een bronzen haarlijn
  (22%) en een zachte schaduw gekregen.
* **Niet alles zit óp het vak.** Het plaatje «meest gekozen», de galerijpijlen
  en de betaallogo's staan op hun eigen grond en houden hun donkere of witte
  behandeling. Klap je die mee om, dan verdwijnen ze in het beeld.

### Wat wél wit moet blijven

Bij het omzetten van `color:#fff` naar inkt gingen drie dingen mee die dat niet
hadden gemogen, omdat ze hun eigen gekleurde ondergrond hebben:

* de ster in het **groene Trustpilot-vierkant** (`.ws-tp .ws-st svg`);
* dezelfde ster in de **reviewkaart** (`.ws-rev .ws-kop .ws-lk .ws-st svg`);
* het **«−30%» op het rode plaatje** (`.ws-prijs .ws-off`).

Alle drie staan weer op `#fff`. De vuistregel: kijk niet naar de kleur die
verandert maar naar de grond eronder. Alleen wat op het koopvak zelf staat
klapt om.

### De tinten ertussen zijn dieper gezet

Wit dat vervaagt op zwart en inkt die vervaagt op zand doen dat niet even snel.
Dezelfde percentages gaven op licht een tint die te bleek was, dus de twee
onderste treden zijn dieper gezet: `--ws-w52` van `.52` naar `.64`, `--ws-w38`
van `.38` naar `.60`. Ze liggen daardoor dichter bij elkaar dan op zwart — op
licht is er tussen inkt en onzichtbaar nu eenmaal minder ruimte.

Nagemeten met een script dat elk stuk tekst in het koopvak door de browser
laat uitrekenen (werkelijke kleur, werkelijke grond eronder, contrast
daartussen):

* **Het donkere vak haalde de norm op drie plekken niet.** De doorgestreepte
  van-prijs en «zolang de voorraad strekt» op 3,52 : 1, en het witte «−30%» op
  `#E5342A` op 4,32 : 1.
* **Het lichte vak haalt hem overal**, mede doordat het rood een stap donkerder
  ging naar `#C8281F`.

### Vier bijstellingen na de eerste blik

* **De pil is half zo groot.** Van 321 × 36 px naar 245 × 22 px — in oppervlak
  precies de helft. Hij was een kop geworden terwijl het een merkteken is.
* **De prijs ademt.** `letter-spacing` van `-.035em` naar `-.012em`; op 38 px
  drukte dat de komma tegen de cijfers aan.
* **Er staat een euroteken voor de prijs.** Nieuwe instelling `munt`
  (standaard `€`), gebruikt op vier plekken: `.ws-nu`, `.ws-was`, `.ws-besp` en
  de koopknop. De winkel zet zelf geen teken — `moneyFormat` staat op
  `{{amount_with_comma_separator}}`, dus `| money` geeft kaal `59,95`. Wil je
  het teken winkelbreed, dan is dat de instelling in Shopify zelf; die raakt
  ook de kassa en de bonnen, dus dat is een aparte beslissing.
* **«Vergelijk de modellen» is een knop geworden.** Eigen bronzen vulling,
  rand van 1,5 px, een randje eronder dat hem optilt, en een pijl die meeschuift.
  In brons, niet in goud: hij mag opvallen maar niet de strijd aangaan met
  «in winkelwagen».

## De aanbodbalk sprak Engels: stale vertalingen, geen bug in het blok

**Nederlands is de brontaal van de winkel** (`shopLocales`: nl primair, en/de/fr
gepubliceerd). Het metaobject `limited_offer` → `voorjaar-sale` heeft dus
Nederlandse broninhoud, en op de Nederlandse pagina stond gewoon «Summer Sale:
profiteer tot 40% korting». De vertalingen naar en/de/fr dateerden nog van de
vóórgaande campagne en zeiden alle drie *Spring Sale*. Wie op `/en`, `/de` of
`/fr` uitkwam — waar een browser met een andere taalvoorkeur vanzelf terechtkomt
— las het oude aanbod.

Alle vijf de velden (`product_title`, `offer_title`, `popup_title`,
`popup_subtitle`, `popup_description`) zijn met `translationsRegister` opnieuw
gezet in de drie talen en nagekeken op de winkel zelf.

Twee dingen om te onthouden:

* **Vertalingen horen bij de winkel, niet bij een thema.** Deze correctie geldt
  dus ook meteen voor de live winkel. Dat is hier de bedoeling — er stond
  verkeerde campagnetekst — maar het is wél een uitzondering op «alles blijft
  in het werkthema».
* **Het Nederlandse `popup_title` zegt nog «Tijdelijke Vaderdag Sale»** terwijl
  de rest Summer Sale zegt. Dat is broninhoud, geen vertaling, dus onaangeroerd
  gelaten. De drie vertalingen staan wel op Summer Sale.

Het tweede metaobject (`groom-guard`, de gratis Skin-Safe Blade) is nagekeken en
loopt wél gelijk met zijn bron.

### De grond onder het koopvak is dieper dan die van blok 05

Het koopvak staat op `#EFE7D8`, blok 05 op `#F7F3EB`. Dat verschil is er met
opzet: boven de vouw ligt er een paneel op de grond dat moet kunnen zweven, en
daaronder niet. Wil je het gelijktrekken, dan is `--ws-cream` de enige knop.

## Wat er aan de winkel zelf is veranderd

Dit staat los van het thema: het is productdata en geldt dus voor elk thema,
ook het live thema.

| Wat | Waarom |
|---|---|
| `custom.buybox_quote` en `custom.buybox_quote_author` | Nieuwe velddefinities. Het klantcitaat in het koopvak stond anders op elk product hetzelfde. Gevuld op de Groom Guard PRO. |
| `best_for` op de definitie `compare_info` | De regel "Beste voor: ..." in de pop-up had geen veld. Gevuld voor de Groom Guard en de PRO. |
| `popup_lead` en `popup_winst` op de definitie `compare_info` | De kop, de lead en de winstbalk van de pop-up stonden in sectie-instellingen en waren dus winkelbreed: een neustrimmer kreeg de Groom Guard-tekst te zien. Nu per product. Gevuld voor de Groom Guard-familie en de vier neustrimmers. |
| Vertalingen en / de / fr | De winkel heeft vier gepubliceerde talen; nl is de hoofdtaal. De sectie drukt af wat de winkel teruggeeft voor de taal waarin je kijkt, dus op `/en` staat de Engelse vertaling. `popup_lead`, `popup_winst`, `best_for` en `popup_decision` waren nieuw en hadden nog geen vertaling &mdash; de Engelse pagina was daardoor half Nederlands. Vertaald voor de Groom Guards en de vier neustrimmers, plus het label van `morgen-in-huis`. |
| Engelse kop van de PRO stond op een ander product | `popup_main_title` in het Engels was &laquo;Compare Wellshave Flex Guard PRO&raquo; op een Groom Guard-pagina. Nu &laquo;Which Groom Guard suits you?&raquo; in en / de / fr, gelijk aan het Nederlands. Ook `product_title`, `toggle_title` en `popup_title` stonden daar nog op &laquo;Pro&raquo;. |
| `custom.shipping_information` herschreven | Er stond &laquo;Voor 23:59 besteld = morgen in huis&raquo;; dat gelijkteken is een notitie, geen zin. Nu &laquo;vandaag v&oacute;&oacute;r 23:59 besteld, morgen in huis&raquo;, op alle 41 actieve producten die het veld hebben. **Zichtbaar op de live site**, want het live thema leest hetzelfde veld. De Flex Guard 3-in-1 en de Essential Flex Bundel noemen 23:00 en hebben hun eigen tijd gehouden. |
| `custom.hero_promise` en `custom.hero_lead` | Nieuwe velddefinities voor de twee regels onder de productnaam: de gouden belofte en de grijze zin eronder. Gevuld op de Groom Guard en de PRO. Bestonden nog niet, dus geen enkel thema leest ze &mdash; dit is niet zichtbaar op de live site. |
| Neustrimmers Basic&ndash;Ultimate herschreven | De vier voordeeltitels per model waren losse marketingregels, dus de tabel ontdubbelde nergens. Nu een gedeelde woordenlijst van zeven rijen, `includes_previous` aan bij Premium, Advance en Ultimate, en `toggle_subtitle`, `best_for`, `popup_decision`, `popup_lead` en `popup_winst` opnieuw geschreven. In nl, en, de en fr. |
| Vier nieuwe `compare_info`-invoeren | `neustrimmer-essential`, `-elite`, `-platinum` en `-ultra` bestonden niet, dus daar deed de vergelijkingsknop niets. Aangemaakt met dezelfde opzet en gekoppeld via `custom.compare_info`; `custom.compare_products` zet elke pagina naast de 4in1 Ultra, en de Ultra naast de Platinum. Ze stonden na het aanmaken op **draft** en renderden daardoor niet; sinds vandaag staan ze op ACTIVE. **Nu zichtbaar op de live site**: die vier productpagina&rsquo;s hadden geen vergelijkblok en hebben dat nu wel. Terugdraaien is beide metafields daar weer leegmaken. |
| Tondeuse Elegant en Deluxe herschreven | De rijen waren gemeten waarden die de eigen specificatie tegenspraken: 6500 en 7000 RPM staan nergens in de productdata, en beide tondeuses hebben volgens `specification` 240 minuten gebruikstijd, niet 2 en 3 uur. Nu vier gedeelde rijen uit de specificatie plus de 2838 brushless motor als het enige verschil. `not_an_upgrade` kon daardoor weer uit. |
| `SkinSafe&trade;` als enige schrijfwijze | Het mes heette op zes plekken `Skin-Safe mes`, `SkinSafe mes` of `Skin Safe mes`. Nu overal `SkinSafe&trade;-mes`: in `compare_info` van de Groom Guard, de PRO, de Flex Guard, de Essential Flex Bundel en beide Shave Packages, in het `included_in_the_box`-item en in `product_usp` van de Body &amp; Nose Bundel. In alle vier de talen. De neustrimmers houden `SkinGuard`, dat is een andere naam uit hun eigen specificatie. |
| Flex-familie opgeschoond | `USB C opladen` op de Flex Guard was `USB-C opladen` op de Essential Flex Bundel. E&eacute;n streepje verschil, dus twee losse rijen, dus een streepje bij de Flex Guard op iets dat hij gewoon heeft. Gelijkgetrokken. `Decorative base` staat nu in het Nederlands. `popup_main_title` zei bij alle drie &laquo;Compare Wellshave Flex ...&raquo; als Nederlandse waarde; nu &laquo;Welke Flex past bij jou?&raquo;. En de Engelse vertaling van `SkinSafe mes` was **`SkinSafe month`** &mdash; een machine had &laquo;mes&raquo; voor een maand aangezien. |
| `not_an_upgrade` op de definitie `compare_info` | Een duurder model erft in de vergelijkingstabel nu automatisch alles van een goedkopere kolom &mdash; anders is het geen upgrade. Dit vinkje is de uitzondering, voor rijen die een gemeten waarde zijn. Aangezet op `tondeuse-deluxe`. Verving `includes_previous`, dat de omgekeerde standaard had en dus op elk nieuw product opnieuw aangezet moest worden. |
| `Pro` &rarr; `PRO` op `groom-guard-pro` | `product_title` en `toggle_title` van dat metaobject schreven `Groom Guard&trade; Pro`, terwijl `popup_title` en de producttitel zelf `PRO` schrijven. De tabelkop en de knoppen in de pop-up lezen `toggle_title`, dus daar stond &laquo;Pro&raquo;. Nu overal PRO. |
| `popup_decision` op de definitie `compare_info` | De beslisregel onder de tabel. Per product &eacute;&eacute;n korte vraag; het antwoord is de naam van dat product. Gevuld voor de Groom Guards en de vier neustrimmers. Leeg bij alle producten betekent: geen beslisregel. |
| Bundels herschreven op doosinhoud | De vijf Groom Guard-pagina&rsquo;s (Groom Guard, PRO, Body &amp; Nose Bundel, Shave Package 3.0 en Ultimate) vulden hun vier voordeelvelden met unique selling points, die per product anders geformuleerd waren. Nu is elke rij een voorwerp uit `custom.included_box` van dat product: bodygroomer, SkinSafe&trade;-mes, oplaadstation, opzetkammen, Foil Shaver-opzetstuk, neustrimmer, detailtrimmer- en shaveropzetstuk, opbergtas. Acht namen, letterlijk gelijk, dus de tabel ontdubbelt. Plus `toggle_subtitle`, `best_for`, `popup_main_title`, `popup_lead`, `popup_winst` en `popup_decision`, in nl, en, de en fr. |
| `compare_products` van de PRO en de Body &amp; Nose Bundel | De PRO stond naast zichzelf en de Body &amp; Nose naast zichzelf. Nu allebei naast de Shave Package Ultimate, de duurste. De Groom Guard blijft naast de PRO, de 3.0 en de Ultimate blijven naast elkaar. |
| `Travelbag` en `Toilettas` heten allebei `Opbergtas` | De Shave Package 3.0 heeft in `included_box` een Travelbag, de Ultimate een Toilettas &mdash; twee metaobjecten met twee namen. Als losse rijen zou de Ultimate onder de erfregel een vinkje krijgen bij allebei, dus twee tassen. Beide rijen heten nu `Opbergtas`. **Alleen in `compare_info`**; de metaobjecten in `included_box` houden hun eigen naam en foto. |
| Head shavers op doosinhoud, plus twee nieuwe invoeren | De Head Shaver Deluxe had oordelen als rijen (&laquo;Snel en comfortabel scheren&raquo;, &laquo;Ergonomisch design&raquo;) en een Engelse `popup_main_title`. Nu vier rijen uit `included_box`: 7D scheerapparaat, scheerkop, haartrimmer-/neus-/oorhaaropzetstuk, gezichtsmassager en reinigingsborstel. De extra&rsquo;s zijn de trap: extra scheerkop &rarr; toilettas &rarr; travelbag. `skull-deal-2-0` (3172045226316) en `skull-deal-3-0` (3172045521228) zijn **nieuw aangemaakt**; die twee pagina&rsquo;s hadden geen `compare_info`, dus daar deed de vergelijkingsknop niets. **Zichtbaar op de live site.** Terugdraaien is `custom.compare_info` daar weer leegmaken. |
| Skull Deal 1.0 heette in de pop-up nog anders | `product_title`, `toggle_title` en `popup_title` van `head-shaver-deluxe-extra-scheerkop` stonden op &laquo;Head Shaver Deluxe + Extra Scheerkop&raquo;, de naam van v&oacute;&oacute;r de hernoeming van het product. De tabelkop en de knoppen lezen die velden. Nu Skull Deal 1.0. De handle van het metaobject blijft de oude. |
| `compare_products` van de head shavers | Elke pagina staat nu naast de Skull Deal 3.0, de duurste (69,95). De 3.0 zelf staat naast de 2.0, want naast zichzelf kan niet &mdash; dezelfde uitzondering als bij de neustrimmer Ultra. |
| Tondeuses op doosinhoud | Elegant en Deluxe hebben **identieke** `included_box`: tondeuse, 6 opzetkammen, kapperscape, kam, oplaadkabel. Er zit dus niets extra&rsquo;s bij en het verschil is alleen de motor. Vier rijen per model; `best_for` en `popup_decision` waren leeg en zijn gevuld. In nl, en, de en fr. |
| De tondeuses vergelijken niet meer met elkaar, maar met hun set | Elegant en Deluxe naast elkaar geeft vijf rijen met &eacute;&eacute;n verschil &mdash; correct, maar geen upgrade. `compare_products` zet nu de **Tondeuse Elegant naast het Barber Pack 3.0** (124,95) en de **Tondeuse Deluxe naast de Barber Bro 3.0** (109,95). Welke set bij welke tondeuse hoort komt uit `included_box`: de Packs bevatten `2062480015692` (Tondeuse Elegant), de Bro&rsquo;s `2062996799820` (Tondeuse Deluxe). Zeven rijen, drie verschillen. |
| Zes nieuwe `compare_info`-invoeren voor de Barber-lijnen | `barber-pack-1-0` (3172061249868), `-2-0` (3172061282636), `-3-0` (3172061315404), `barber-bro-1-0` (3172061446476), `-2-0` (3172061479244), `-3-0` (3172061512012). Alle zes hadden niets, dus daar deed de vergelijkingsknop niets. Trap per lijn: detailtrimmer &rarr; + shaver &rarr; + neustrimmer. Elke pagina naast de 3.0 van zijn eigen lijn, de 3.0 naast de 2.0. **Zichtbaar op de live site.** Terugdraaien is `custom.compare_info` daar weer leegmaken. |
| Vier losse apparaten naast hun bundel | Uit `included_box` is per voorwerp een `product_title` te lezen, en daarmee is uit te rekenen welke bundel welk apparaat bevat. Dat gaf vier paren die nog ontbraken: **The Gentleman Shaver** (49,95) &rarr; Barber Bundel 2.0 (164,95), **Detailtrimmer Sharpline** (49,95) &rarr; Barber Pack 3.0, **4 Foil Blade Baron** (49,95) &rarr; Barber Pack 3.0, en de **Flex-line Bundel** (89,95) &rarr; Flex Guard. Nieuwe invoeren: `detailtrimmer-sharpline` (3172189569356), `blade-baron` (3172189602124), `gentleman-shaver` (3172189700428), `barber-bundel-2-0` (3172189733196). **Zichtbaar op de live site.** |
| Flex-familie op doosinhoud | `flex-guard`, `essential-flex-bundel` en `flex-line-bundel` hadden losse verkoopargumenten als rijen. Nu voorwerpen uit `included_box`, met &eacute;&eacute;n woordenlijst. De Flex Guard blijft naast de Essential Flex Bundel staan, zoals afgesproken. |
| `compare_products` van de Flex-line Bundel | Daar stonden de Flex Guard en de **Essential** Flex Bundel &mdash; de Flex-line kwam in zijn eigen pop-up niet voor. Nu Flex Guard + Flex-line. Niet naast de Essential: die twee zijn geen trap (de Essential heeft twee tassen en geen detailtrimmer, de Flex-line andersom), dus de erfregel zou de Flex-line tassen toeschrijven die er niet in zitten. |
| Onderregels van de Flex-familie | `toggle_subtitle` van de Flex Guard en de Essential Flex Bundel stond op &laquo;Veilig lichaam trimmen&raquo;, Groom Guard-copy bij een 3-in-1 die ook scheert. Nu &laquo;Trimmen, scheren en neushaar&raquo; en &laquo;Flex Guard + toilettas en hard case&raquo;. `reviews_label` van de Essential stond op 800+ terwijl alle andere 650+ zeggen; gelijkgetrokken. De Flex-line heette in `compare_info` &laquo;Flex Line Bundel&raquo;, het product heet &laquo;Flex-line Bundel&raquo;. |
| Typefouten in `included_box` verbeterd | `Scheerkoop 7D` &rarr; `Scheerkop 7D`, `2x Scheerkoop 7D` &rarr; `2x Scheerkop 7D`, `Tonduese` &rarr; `Tondeuse`. **Zichtbaar op de live site**, want de doos-dropdown leest deze titels. De Engelse vertaling van `Tonduese` was **`Toning device`** &mdash; een machine had er een toningapparaat van gemaakt. Alle drie opnieuw vertaald in en / de / fr. |
| `Skin Safe Mes` en `Foil Shaver Head` in de Flex-doos | Het mes heette in `included_box` van de Flex Guard nog `Skin Safe Mes`, met in het Duits **`Hautfreundliche Mes`** en in het Frans **`Peau S&ucirc;re Mes`** &mdash; de merknaam vertaald, het Nederlandse &laquo;mes&raquo; blijven staan. Nu `SkinSafe&trade;-mes` in alle vier de talen, met een omschrijving die niet twee keer &laquo;Skin Safe&raquo; zegt. `Foil Shaver Head` is `Foil Shaver-opzetstuk`; dat item zit ook in de Shave Package Ultimate en de twee Flex-bundels, dus die pagina&rsquo;s veranderen mee. |
| Nieuw metaobjecttype `ugc_video` | Definitie `46105985356`, met `product_title`, `video`, `name`, `line`, `verified` en `featured`. Publiceerbaar, dus **nieuwe invoeren meteen op ACTIVE zetten**. |
| Nieuw metafield `custom.ugc_videos` | `520597799244`, lijst van `ugc_video`. Leeg laten betekent: de band valt terug op `custom.ugc_video_list`. Geen enkel product heeft dit nu gevuld, dus er verandert nog niets aan wat er te zien is. |
| Voorraadregel en aanbod gewisseld | De voorraadregel zat in `.ws-vorm` en werd op de telefoon met `order:-1` boven de knop getrokken; het aanbod stond daarboven. Nu staat `.ws-vrd` als eigen kind van `.ws-bb` **v&oacute;&oacute;r** het aanbod, en is de omkeertruc weg. Volgorde op beide breedtes: USP-strook &rarr; voorraad &rarr; aanbod &rarr; knop. Een voorwaarde hoort voor een verleiding. De marges tussen die drie staan op 14 tot 18 px, want tegen elkaar aan lezen ze als &eacute;&eacute;n blok. |
| Vierde `store_usp`: Morgen in huis | De voetbalk van de pop-up toont wat er in `custom.store_usp` staat, en dat waren er drie. Nieuw metaobject met een icoon in dezelfde stijl als de andere drie (20 bij 20, streek `#BC813E`), toegevoegd aan de lijst op de Groom Guard en de PRO. |

Let op bij die laatste. `custom.store_usp` wordt ook gelezen door het
`store_usp`-blok van `main-product` in het live thema. Op wellshave.com staat er
op die twee producten nu dus een vierde item in de geruststrook. Terugdraaien is
het metafield weer op de oorspronkelijke drie zetten: `1859112894796`
(100 dagen proef), `1859112763724` (2 jaar garantie), `1859112698188`
(gratis verzending).

## De appblokken in het koopvak

In `templates/product.json` staan drie appblokken in de sectie. Ze staan alle
drie op `"disabled": true`, dus ze renderen niet:

| Blok | App | Wat het deed |
|---|---|---|
| `section_store_block_product_addons_3AFn8F` | Section Store | Toiletry bag en travelbag als aanvinkbare extra's. Stond al uit. |
| `selleasy_lb_upsell_addon_block_GeTTn7` | Selleasy | &laquo;Vaak samen gekocht&raquo; met de Blade en de Trio Pack. Uitgezet op verzoek: het was een witte kaart midden in het donkere koopvak. |
| `klarna_on_site_messaging_app_block_kMpXVH` | Klarna | Achteraf betalen bij de prijs. Stond al uit. |

Ze blijven in het sjabloon staan, dus in de thema-editor zijn ze met &eacute;&eacute;n klik
weer aan te zetten. Wat de Selleasy-kaart deed, hoort in blok 07
&mdash; &laquo;maak het compleet&raquo; &mdash; en dan in de opmaak van de pagina zelf.

## Nog open

* **`custom.buybox_quote` is alleen op de Groom Guard PRO gevuld.** Op de andere
  producten valt het citaat terug op de sectie-instelling en staat er dus overal
  hetzelfde. Van de honderd recentste Nederlandse Trustpilot-reviews gaan er vijf
  over een product; waar er geen is, hoort het citaat leeg te blijven &mdash; dan valt
  de kaart weg.
* **Productmetafields worden in deze winkel niet vertaald.** `subtitle`,
  `product_usp`, `hero_promise`, `hero_lead` en `shipping_information` staan
  in elke taal in het Nederlands; alleen titel, omschrijving en de
  metaobjectvelden hebben vertalingen. Dat is bestaand gedrag, geen nieuw
  gat, maar het valt op zodra de rest w&eacute;l vertaald is.
* **Essential, Elite en Platinum zijn in de tabel niet van elkaar te
  onderscheiden.** Hun specificaties noemen alle drie dezelfde zones &mdash; neus,
  oren en wenkbrauwen &mdash; terwijl ze 1-, 2- en 3-in-1 heten. Wat het tweede en
  het derde opzetstuk d&aacute;n zijn, staat nergens. Daarom staat elk van die drie in
  de pop-up naast de Ultra en niet naast elkaar. Worden die opzetstukken
  benoemd, dan zijn het twee extra rijen en kan het wel.
* **Twee dingen uit de specificaties die we bewust niet in de tabel zetten.**
  De Elite heeft een 8000 RPM-motor tegenover 7000 bij de andere drie, terwijl
  de Platinum duurder is. En de luxe cadeauverpakking staat bij drie modellen
  w&eacute;l en bij de Ultra niet. Onduidelijk of dat verschillen zijn of omissies.
* **De pop-upteksten staan nog niet op elke productfamilie.** `popup_main_title`,
  `popup_lead`, `popup_winst`, `best_for` en `popup_decision` in `compare_info`
  zijn gevuld voor de Groom Guards en de neustrimmers, in alle vier de talen. De
  families `flex-*`, `shave-package-*`, `tondeuse-*` en `head-shaver-*` hebben nog
  de Engelse `popup_main_title` ("Compare ...") en geen lead of winstbalk.
* **De sprong van de Shave Package 3.0 naar de Ultimate is &eacute;&eacute;n opzetstuk.**
  64,95 tegenover 89,95, en volgens `included_box` koop je daarvoor het Foil
  Shaver-opzetstuk, dat los 14,95 kost. De tabel toont dat eerlijk: vijf rijen,
  &eacute;&eacute;n verschil. Zit er meer in de Ultimate dan er nu in `included_box` staat,
  dan hoort dat erbij.
* **De `included_box` van de Ultimate noemt geen oplaadstation en geen
  oplaadkabel**, terwijl de 3.0 die w&eacute;l noemt en het apparaat hetzelfde is.
  In de tabel komt dat goed omdat de duurdere kolom erft, maar het veld zelf
  klopt niet.
* **De omschrijvingen in `included_box` zijn nog verkooppraat.** &laquo;Uitermate
  geschikt voor het lichaam, intieme zones en dagelijks onderhoud&raquo; beschrijft
  niet w&aacute;t er in de doos ligt. Een regel per artikel die zegt wat het is en
  waarvoor je het gebruikt, leest sneller. De namen zijn nu opgeschoond; de
  omschrijvingen niet.
* **De Barber Packs kosten meer dan de Barber Bro&rsquo;s en hebben toch de
  goedkopere tondeuse.** Volgens `included_box` zit in de Packs de Elegant
  (59,95) en in de Bro&rsquo;s de Deluxe (69,95), terwijl de Packs op elke trede
  10 tot 15 euro duurder zijn. Het enige andere verschil is een
  schoonmaakborstel bij Pack 1.0 en 2.0. Of de tondeuses staan omgewisseld op
  de bundels, of de prijzen staan verkeerd om. De vergelijking volgt de
  doosinhoud, dus dit is de moeite van het nakijken waard.
* **De omschrijving van het Barber Pack 3.0 belooft een head shaver** die niet
  in `included_box` staat. De tabel volgt de doos.
* **De Barber Bundel 2.0 (164,95) valt buiten beide trappen**: die bevat de
  Gentleman Shaver plus de Elegant en de Sharpline. Andere combinatie, geen
  trede in een reeks, dus nog geen vergelijking.
* **Zeven apparaten zitten in geen enkele bundel** en hebben dus niets om
  naast te zetten: The Sentinel PRO, The Dial Master, Edge Blade, Dual Groomer,
  Scheerapparaat Elegant 4-in-1 en de drie Men Shapers.
* **De neustrimmers blijven binnen hun eigen reeks.** De Neustrimmer Basic
  (16,95) zit w&eacute;l in de Shave Package Ultimate (89,95), maar dat is meer dan
  vijf keer de prijs; dat is geen upgrade meer.
* **De UGC-tegels hebben nog geen naam en geen regel.** De band draait nu op
  `custom.ugc_video_list`, en daar zit alleen het bestand in. De uitgelichte
  tegel met een citaat is het sterkste deel van het ontwerp en die kan pas
  staan als er per video een naam en een regel is. Dat is invulwerk: per video
  drie velden, en het vinkje &laquo;geverifieerde koper&raquo; alleen aanzetten als die
  persoon dit product ook echt gekocht heeft.
* **Het watermerk in de doos is leeg.** De sectie heeft er een instelling voor
  (`merk`); zonder afbeelding tekent hij niets.
* **De prijsopmaak van de winkel heeft geen €-teken** (`moneyFormat` staat op
  `{{amount_with_comma_separator}}`). De sectie volgt de winkel, dus er staat
  `59,95`. Wordt de instelling aangepast, dan komt het teken er overal bij.
* **Blok 02 (de geruststrook) en blok 07 (maak het compleet) hebben nog geen
  sectie.** In het voorbeeldsjabloon staan ze daarom niet.
* De secties onder de vouw staan in `product.ws-pdp.json` met lege instellingen,
  dus met hun eigen standaardwaarden. Ze zijn nog niet ingericht.
