# Wellshave — productpagina in het thema

De homepage staat beschreven in `theme/README.md` (tak `claude/homepage-analysis-redesign-u38dwu`).
Dit bestand gaat over de productpagina.

## Waar het staat

Dit schuift door: telkens als het werkthema gepubliceerd wordt, is het de winkel
en moet er een verse kopie komen. Wie dat niet weet, schrijft per ongeluk op de
storefront &mdash; of denkt dat de api stuk is terwijl hij juist zijn werk doet.

| | |
|---|---|
| **Live thema** | `Herfst Sale 2026 (kopie van v5 LIVE)` (id **206433747276**) &mdash; rol MAIN sinds 26 september. **Niet in schrijven** |
| **Werkthema** | `wellshave/claude-design v7 (IN PROGRESS)` (id **207339848012**) &mdash; kopie van het live thema, gemaakt 7 oktober. **Hierin gaan alle nieuwe aanpassingen** |
| Voorbeeld | https://wellshave.com/products/groom-guard-pro?preview_theme_id=207339848012 |
| Niet als basis gebruiken | `v6 (IN PROGRESS)` (206262862156) is v5 van 10 september en mist de CRO-fixes van 25 september en de Herfst Sale. `CRO-fixes 25-09` (206464352588) is een tussenstap |
| Vorige | v5 (205230309708), v4 (204845515084), v3 (204575310156), v2 (204412977484) en v1 (204178161996) staan klaar als terugval |
| Oud | `wellshave-redesign/live` (200936096076) is niet meer gepubliceerd |

De kopie is op het moment van maken gelijk aan het live thema: sectie, stylesheet
en productsjabloon hebben daar dezelfde checksums. Wie hier verder werkt,
schrijft dus naar **207339848012** en laat die pas publiceren als het af is.

`config/settings_data.json` hoort er ook bij. Dat is een themabestand, dus de
cadeau-instellingen van de winkelwagen zijn op een gepubliceerd thema alleen via
de theme-editor te veranderen, niet via de api.

### De MCP blokkeert schrijven naar het live thema

Dat is geen storing maar een vangnet: `themeFilesUpsert` wordt geweigerd zodra de
doel-id de rol MAIN heeft. De weigering is schoon &mdash; er komt geen halve staat op
de winkel. Loop je ertegenaan, dan is het antwoord niet forceren maar dupliceren:

```graphql
mutation { themeDuplicate(id: "gid://shopify/OnlineStoreTheme/<live>",
                          name: "wellshave/claude-design v4 (IN PROGRESS)") {
  newTheme { id name role } userErrors { field message } } }
```

De kopie komt binnen als UNPUBLISHED en is **even leeg**: `files` geeft een lege
lijst terug zolang Shopify nog kopieert. Wacht tot de checksums van het live
thema erin staan v&oacute;&oacute;rdat je iets upsert, anders schrijf je in een half thema.

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

### Loox is w&eacute;l de bron, via het metaveld

De reviewteksten staan gewoon in de winkel: `loox.reviews` draagt per product
de laatste honderd, met naam en tekst. Over alle actieve producten samen zijn
dat 2.489 teksten op 38 producten. Wel met twee haken:

* **Ze zijn niet allemaal exclusief.** Van de 1.269 unieke teksten staan er
  782 bij precies &eacute;&eacute;n product en 487 bij twee of meer. De acht
  neustrimmers delen &eacute;&eacute;n poel &mdash; de Advance heeft nul eigen
  teksten. Een gedeelde review is niet aan een model toe te schrijven en gaat
  er dus af.
* **Bol plakt de listingtitel aan de tekst.** &laquo;Prima groomer | Scheren
  zonder wondjesGoed formaat&hellip;&raquo;. Knippen op de laatste
  kleine-letter-naar-hoofdletter-grens in de eerste zestig tekens haalt de
  titel eraf.

### Naam zonder datum

Loox bewaart geen datum bij de tekst, dus de voetregel is alleen de naam.
Verzinnen is geen optie en half doen ook niet: de Groom Guard&trade; PRO stond
als enige op &laquo;Yven &middot; 8 juli 2026&raquo; en is teruggebracht naar
&laquo;Yven&raquo;. Bijkomend voordeel: een naam hoeft niet vertaald, een
Nederlandse maandnaam op de Duitse pagina wel.

### De kop is het winkelcijfer, niet de afzender

De groene blokjes met **Trustpilot** en **4,4** in de kop van de reviewkaart
gaan over de winkel, niet over het citaat eronder. Dat onderscheid moet in
beeld blijven: de teksten komen uit Loox en van bol.com, en zouden die kop de
afzender zijn, dan zegt de kaart iets over hun herkomst dat niet klopt. Twee
dingen houden het recht:

* **Het cijfer staat naast het merk.** `Trustpilot 4,4` leest als een
  beoordeling van de winkel; `Trustpilot` alleen leest als een afzender. Haal
  je `tp_cijfer` weg, dan verdwijnt precies dat verschil.
* **Het citaat draagt zijn eigen naam.** De voetregel is de naam plus
  &laquo;Geverifieerde koper&raquo;, en met `custom.buybox_quote_source` (of de
  terugval `citaat_bron`) kun je daar per product de herkomst bij zetten. Die
  regel staat onderaan, niet in de kop.

`custom.buybox_quote_url` overschrijft `rev_alle_url` als **Alle reviews
&rarr;** ergens anders heen moet.

### Vier hele sterren en een halve

Trustpilot rondt een TrustScore af op halve sterren: een 4,4 laat de widget
zien als 4,5 ster. Vijf volle blokjes zeggen dus meer dan het cijfer waarmaakt.
`tp_sterren` staat op `4,5`; het lege deel is `#DCDCE6`, het grijs dat
Trustpilot zelf voert. Het vlak loopt via `--ws-ster-vlak`, zodat de drie
plekken waar de sterren staan &mdash; de regel boven de titel, de reviewkaart en
de upgrade-pop-up &mdash; hun eigen formaat houden. Verandert de score, verzet dan
`tp_cijfer` **en** `tp_sterren`.

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

## De andere talen: alleen wat in het sjabloon staat is te vertalen

Op `/en`, `/de` en `/fr` stond de chroom van onze blokken nog in het Nederlands
— «Op voorraad», «In winkelwagen», «Vergelijk de modellen», «Al door 200.000+
mannen gekozen», de accordeontitels. De productinhoud (metafields) was al wel
vertaald; onze sectie-instellingen niet.

**De regel die je moet onthouden:** Shopify maakt van een sectie-instelling
alleen een vertaalbaar veld als de waarde in `templates/product.json` staat.
Een `default` in het sectieschema komt *niet* in de vertaaleditor terecht — die
wordt bij het renderen ingevuld en is dan onzichtbaar voor het vertaalsysteem.

Tien instellingen van het koopvak stonden alleen als schemastandaard
(`tp_cijfer`, `proberen_label`, `munt` en alle zeven `upg_*`). Die zijn nu
expliciet in het sjabloon gezet. Zichtbaar veranderde er niets — de opgeslagen
waarde is dezelfde als de standaard — maar ze zijn nu wél te vertalen én staan
in de tak.

De vertaalbron is `ONLINE_STORE_THEME_JSON_TEMPLATE`, en die is **per thema**:

```
gid://shopify/OnlineStoreThemeJsonTemplate/product?theme_id=204412977484
```

`translatableResources(resourceType: ONLINE_STORE_THEME_JSON_TEMPLATE)` geeft
alleen het live thema terug. Wil je het werkthema, vraag de bron dan
rechtstreeks op met `translatableResource(resourceId: ...)` en de `theme_id` in
de query-string. Verder: de sleutel bevat een instantie-achtervoegsel
(`...main.knop_label:1t994ydlfadu5`) en de `digest` is een apart veld — die twee
niet verwarren.

57 sleutels × 3 talen geregistreerd voor `main`, `praktijk` en `ugc`.

### Telwoorden stonden vastgetimmerd in het Nederlands

`ws-pdp-praktijk.liquid` had `'nul,Eén,Twee,Drie,Vier,...'` in de Liquid staan,
dus op de Engelse pagina stond «**Vier** moments. One effortless routine.» Die
lijst is nu de instelling `telwoorden`, staat in het sjabloon, en is per taal
vertaald. Nu: «Four moments.», «Vier Momente.», «Quatre moments.»

### Wat een taalwissel niet mag raken

Bij het vertalen van cijfers en scheidingstekens:

* `tp_cijfer` «4,4» wordt in het Engels «4.4», in het Duits en Frans blijft de
  komma staan.
* `tel_waarde` «200.000+» wordt «200,000+» (en) en «200 000+» (fr).
* `rev_alle_url` wijst per taal naar het juiste Trustpilot-domein:
  `nl.` / `www.` / `de.` / `fr.trustpilot.com/review/wellshave.nl`.
* De volgorde van `tel_voor` + `tel_waarde` + `tel_na` verschilt per taal. In
  het Duits staat het werkwoord achteraan («Bereits von 200.000+ Männern
  **gewählt**»), in het Engels niet («Already chosen by 200,000+ men»). Dat is
  op te lossen doordat alle drie de delen apart vertaalbaar zijn.

### Twee metafields stonden nog in het Nederlands

`hero_promise` en `hero_lead` zijn maar op twee producten gezet — de Groom
Guard en de Groom Guard PRO — en hadden geen vertalingen. Vier metafields,
in drie talen gezet.

### Wat met opzet Nederlands blijft

Het klantcitaat in de reviewkaart (`buybox_quote` en `buybox_quote_author`) is
een échte Trustpilot-review van een Nederlandse klant. Die vertalen zou woorden
in iemands mond leggen. Wil je op de Engelse pagina een Engelstalige review,
dan is dat een andere review kiezen, geen vertaling. Datzelfde geldt voor de
datum «8 juli 2026».

### Nog open, buiten de productpagina

Op `/en` staan nog twee Nederlandse regels uit een ander blok (klasse `wsl-`,
dus de landingspagina-secties): «100 dagen proberen» en «Vier vragen, en je
ziet wat bij je past.» Die zitten in een sectiegroep, een eigen vertaalbron
(`ONLINE_STORE_THEME_SECTION_GROUP`), en vallen buiten dit blok.

En de Engelse vertaling van de verzendregel op de producten zegt nog «Order by
11:59 PM = delivered tomorrow» — met het gelijkteken dat in het Nederlands al
weg is. Dat is een aparte veegbeurt over de productmetafields.

## Het plaatje «meest gekozen» staat alleen nog op de eerste foto

De eerste foto is een pakshot: alleen het apparaat op een egale grond. Vanaf de
tweede zijn het listingbeelden met tekst erin gebrand — en daar lag de zwarte
pil linksboven precies overheen.

Twee dingen zijn veranderd:

* **Hij verdwijnt zodra je doorbladert.** Het script hangt aan de scroll van
  `.ws-baan` (met een `requestAnimationFrame`-rem, en `passive: true`) en zet
  `ws-weg` op `.ws-tg` zodra `scrollLeft > 8`. `naarDia()` doet het meteen,
  zonder op het scrollen te wachten, dus bij een klik op een pijl of miniatuur
  is hij al weg voordat de foto aankomt. Ga je terug naar de eerste, dan komt
  hij terug. Fade van 0,22s, uitgezet bij `prefers-reduced-motion`.
* **Hij is melkglas geworden.** Was een dicht zwart vlak van 180 × 36 px, nu
  een doorschijnende chip van 119 × 24: `rgba(255,255,255,.78)` met
  `backdrop-filter: blur(9px)`, een bronzen haarlijn en inkt als tekst. Dat
  werkt op een lichte pakshot én op een donkere foto, want het is wit met
  donkere letters — geen van beide verdwijnt in de achtergrond.

Nagemeten in een echte browser op de opgehaalde voorvertoning: bij het laden
zichtbaar (opacity 1), na één keer «volgende» weg (opacity 0), na een klik op
miniatuur 4 weg, terug op de eerste weer zichtbaar, en ook bij handmatig
scrollen weg.

Let bij dat naspelen op `scroll-snap-type: x mandatory` op `.ws-baan`: zet je
`scrollLeft` op minder dan een halve dia, dan trekt de snap hem terug naar nul
en lijkt er niets te gebeuren. Schuif voorbij het midden.

### Een proefbestand moet de sectiewikkel meenemen

`scripts` in de scratchpad bouwden eerst een proef van alleen `<main-product>`.
Dan doet de galerij niets: het script van het koopvak zoekt zichzelf op via
`document.getElementById('shopify-section-<id>')` en stopt als die er niet is.
De hele `<section id="shopify-section-...">` meenemen, niet alleen het
custom element.

## Blok 02: de geruststrook

`sections/ws-pdp-belofte.liquid` + `assets/ws-pdp-belofte.css`. Staat in
`templates/product.json` als sleutel `belofte`, direct onder `main`. Vier
beloftes van de winkel op één rij: proberen, garantie, verzending, levertijd.

Leest `custom.store_usp` — een lijst metaobjecten met `label`, `sublabel` en
`icon`. Dat veld staat op het product maar de inhoud is winkelbreed, dus de
strook ziet er op elk product hetzelfde uit. Is het veld leeg, dan rendert de
sectie niets.

* **De iconen zijn SVG's van 20 × 20** met de bronzen lijnkleur `#BC813E` er al
  in gebakken. `image_url` schaalt geen SVG, dus die gaan rechtstreeks via hun
  `url`; alleen niet-SVG's lopen door `image_url`.
* **De rij telt zichzelf.** Vier items geeft vier kolommen, drie geeft er drie
  (`ws-n3`), enzovoort. Zo blijft hij kloppen als de winkel er ooit een
  weghaalt.
* **Op de telefoon wordt het twee bij twee.** Vier naast elkaar op 390 px geeft
  kolommen van 80 pixels en daar past geen enkel label in. Onder 380 px valt de
  onderregel weg: beter één regel die past dan twee die afbreken.
* **De bovenregel «Bij elke bestelling» is er met opzet.** Zonder die regel
  lezen vier iconen op een rij als productkenmerken, en dan concurreren ze met
  de vier vinkjes die twintig pixels hoger in het koopvak staan.

### `sublabel` is nieuw op het metaobject

De definitie `store_usp` had alleen `label` en `icon`. Er is een veld
`sublabel` bij gekomen, gevuld voor alle vier, en vertaald naar en/de/fr. Een
label alleen is een claim; de onderregel haalt de twijfel weg.

### Eén van de vier stond op DRAFT

«Morgen in huis» (`morgen-in-huis`, het nieuwste van de vier) stond op DRAFT en
werd daarom **niet** door de storefront meegegeven — de strook rende met drie
items en de vierde ontbrak zonder foutmelding. Precies de val uit het hoofdstuk
hierboven over `metaobjectCreate`. Nu ACTIVE.

Dit is het waard om te onthouden: een lijst met metaobject-verwijzingen laat
draft-items stilletjes weg. Klopt het aantal niet, kijk dan eerst naar
`capabilities.publishable.status` en niet naar je Liquid.

### De verzendbelofte klopte niet

De accordeon zei «Gratis verzending binnen Nederland en België», zonder
drempel. Het echte verzendprofiel (`deliveryProfiles`) zegt:

* **onder €30:** €4,95 — «Ma-Vr voor 23:59 besteld, morgen in huis»
* **vanaf €30:** gratis — zelfde voorwaarde

`acc3_tekst` is daarop bijgesteld in alle vier de talen, en de onderregels in
de strook noemen de drempel en de werkdagen ook.

**Nog open:** de voorraadregel boven de koopknop zegt nog «vandaag vóór 23:59
besteld, morgen in huis» zonder «ma t/m vr». Die komt uit een metafield op het
product, op 41 producten, dus dat is een aparte veegbeurt. De klok klopt; de
dagen niet.

## Van zand naar neutraal: kleur mag weer iets betekenen

De grond was de merkkleur. Daardoor betekende de merkkleur niets meer: er
stonden **elf goudwasjes in het koopvak alleen** — de gloed op het podium, de
bespaarchip, de vinkrondjes, de voorraadregel, de cadeaukaart, de
vergelijkknop, de aangevinkte variantknop — plus de zandgrond eronder. Als
alles een beetje goud is, betekent de gouden koopknop niets.

De grond is nu bijna kleurloos en de panelen zijn wit:

| rol | zand | neutraal |
|---|---|---|
| paginagrond | `#EFE7D8` | `#F4F2EE` |
| podium | `#FBF8F3` | `#FFFFFF` |
| koopvak | `#FBF8F1` | `#FFFFFF` |
| kaarten erin | `#F3EADA` | `#F6F4F0` |
| kaarten blok 05 | `#FBF8F1` / `#F0E8D8` | `#FFFFFF` / `#F8F6F2` |

### Drie dingen mogen schreeuwen, elk met een ander middel

Dit is de kern. Drie accenten die alle drie goud zijn vechten om dezelfde
aandacht; drie accenten met een ander mechanisme vormen een volgorde.

* **De aanbodkaart** is een warm gouden *vlak*
  (`linear-gradient(180deg, rgba(233,190,114,.20), .10)` met een gouden rand).
  Een veld leest anders dan een knop, dus het valt op zonder dat je erop wilt
  drukken.
* **De koopknop** houdt het goudverloop en is de enige verzadigde *knop*.
* **«Vergelijk de modellen»** is inkt geworden (`#14120F`, wit erop). Even
  hard, maar kleurloos — dus goud blijft van het kopen en het aanbod alleen.

Brons overleeft alleen nog als détailkleur: de plus in de accordeon, de
vinkrondjes, de bespaarchip, de iconen in blok 02.

### De ondertitel is inkt geworden

`.ws-sub` stond in brons. Op een neutrale grond is dat een derde accent dat
niets doet; de regel is nu gewoon inkt.

## Lichtere letters: 600 voor de koppen, 500 voor de prijs

`.ws-h1` en `.ws-sub` gingen van **800 naar 600**, `.ws-prijs .ws-nu` van
**900 naar 500**, en `.ws-was` van 600 naar 500 (anders was de van-prijs even
zwaar geworden als de prijs). De koppen van blok 05 volgden naar 600.

Het omslagpunt zit tussen 600 en 500, niet tussen 800 en 600: op een klein
plaatje lijken 800 en 600 sterk op elkaar. Onder de 500 wordt een productnaam
een bijschrift.

Ik had 600 voor de prijs geadviseerd — cijfers hebben iets meer stam nodig dan
letters om op afstand af te lezen — maar de keuze is 500 geworden. Op 38px
draagt het formaat het bedrag ruim, en het leest nu als een rustig feit in
plaats van als een uitroep.

**Nagemeten op de langste productnamen** bij het nieuwe gewicht, breed en op
390 px: nergens loopt de kop over zijn vak heen. Alleen «The Gentlemen
Shaver™ Scheerkop» breekt op een breed scherm over twee regels; op de telefoon
doen de meeste namen dat, en dat deden ze in 800 ook.

### Let op bij het naspelen: een proefbestand mist de sectie-stylesheets

De `{% stylesheet %}`-blokken uit een sectie komen niet in
`assets/<naam>.css` terecht maar in `cdn/shop/t/79/compiled_assets/styles.css`.
Haalt je proefscript alleen de `ws-pdp-*`-bladen op, dan mist onder andere de
normalisatie `.ws-pdp .ws-gift b *{display:inline;font-size:inherit}` — en dan
rendert de kop van de aanbodkaart als een gewone `h2`, drie keer te groot.
Dat lijkt op een kapot blok terwijl er niets mis is. `compiled_assets` hoort
in de lijst.

## Blok 03 mee naar neutraal

De band stond al op een crèmegrond; wat donker was, was de **doos** eromheen
(`.ws-ugc-doos`, `#0B0B0A`). Die is wit geworden met een haarlijn en een zachte
schaduw, net als het koopvak.

**Wat wit blijft, blijft wit.** De tokens `--u-w72/52/38` zijn níét omgeklapt:
die horen bij tekst die op vídeo ligt — de naam, het citaat, de duur, het
vinkje «geverifieerde koper». Daar is de ondergrond een filmbeeld en dus altijd
donker. Voor de chroom van de doos zijn er nieuwe tokens bij gekomen:
`--u-b72/52/38` in inkt. Dezelfde regel als bij het plaatje op de foto in blok
01: kijk naar de grond eronder, niet naar de kleur die verandert.

De gouden speelknoppen op de tegels blijven goud — die moeten op elk filmframe
zichtbaar zijn — en de koopknop houdt het goudverloop.

De tweede kopregel («Gewoon hun badkamer.») blijft brons. Dat is geen decoratie
maar structuur: de kleurwissel op de tweede regel is precies waar de zin kantelt.

**Het euroteken ontbrak.** De koopstrook in de band gebruikte
`price-formated` zonder teken, terwijl boven de vouw wél `€ 59,95` staat. Twee
keer hetzelfde bedrag anders geschreven op één pagina. De sectie heeft nu
dezelfde instelling `munt` als het koopvak.

## De cadeaus staan nu in het koopvak

Boven een bepaald bedrag legt de winkel er een cadeau bij. Dat gebeurde tot nu
toe pas in de winkelwagen: je zag het als je al besloten had. Nu staat het in
het koopvak, onder de koopknop, zodat het meeweegt in het besluit zelf.

### Het loopt via de thema-instellingen, niet via de kortingen

Dit is het punt waar ik er eerst naast zat, dus het staat hier expliciet. Er is
**geen Shopify-korting** in het spel en er hoeft er ook geen te komen. Het
mechanisme zit in de thema-instellingen:

| Instelling | Waarde nu |
| --- | --- |
| `enable_gift_rewards` | aan |
| `gift_1_threshold` / `gift_1_product` / `gift_1_label` | 65 / `gift-the-washbag` / «Gratis Washbag» |
| `gift_2_threshold` / `gift_2_product` / `gift_2_label` | 90 / `gift-neustrimmer-ultra` / «Gratis Neustrimmer» |

`syncGifts()` in `base.js` haalt `/cart.js` op, telt de `original_line_price`
van alle regels **zonder** `properties._gift_tier` bij elkaar, en zet het
cadeauproduct in of uit de wagen zodra die som de drempel passeert. De twee
cadeauproducten staan op **UNLISTED** en kosten **€ 0,00**. Er valt dus niets
af te trekken; het artikel is al gratis. Vandaar geen korting.

Dat het cadeau als artikel bestaat is precies waarom het blok in het koopvak
mag staan: de pagina belooft niets wat de winkelwagen niet zelf uitvoert.

### Waarom de sectie de instellingen leest en niet zijn eigen tekst

De regels in `.ws-cad` komen rechtstreeks uit `settings.gift_1_*` en
`settings.gift_2_*` — dezelfde bron waar `syncGifts()` uit put. Was het een
eigen sectie-instelling geweest, dan had de pagina «gratis bij € 90» kunnen
beloven terwijl de winkelwagen op € 100 stond. Nu kán dat niet uit elkaar
lopen: één bron, twee lezers.

De sectie voegt er alleen presentatie aan toe: `cad_kop` («Gratis bij deze
bestelling»), `cad_waarde` («t.w.v.») en `cad_chip` («Gratis»). Die drie staan
in `templates/product.json` en zijn dus vertaalbaar — zie het hoofdstuk over
de andere talen voor waarom dat moet.

### Twee drempels, niet één

De vraag was «bij producten boven de 90 euro», maar zo staat het niet in de
winkel. Het zijn er twee: **€ 65** voor de Washbag en **€ 90** voor de
Neustrimmer. Tussen 65 en 90 krijg je er dus één. Het blok toont daarom per
product alleen de cadeaus die dat product op eigen kracht haalt, en verdwijnt
helemaal als het er geen haalt.

Nagelopen op vier prijspunten:

| Prijs | Wat het blok toont |
| --- | --- |
| 114,95 | beide |
| 89,95 | alleen de Washbag |
| 64,95 | niets |
| 59,95 | niets |

**Er zit een cluster op 89,95** — Shave Package Ultimate, Flex-line Bundel,
The Sentinel PRO, Barber Bro 1.0 — dat vijf cent onder de tweede drempel valt.
Die krijgen de Washbag en niet de Neustrimmer. Dat is geen fout in het blok,
maar het is wel het soort grens waar je een keer bewust naar wilt kijken.

### Tweede ronde: het viel niet op

De eerste versie was een witte lijst op een witte grond met een omlijnd groen
chipje. Netjes, en precies daarom onzichtbaar. Naar aanleiding van drie
referenties van andere winkels is het blok opnieuw opgezet. Wat daarvan is
overgenomen, en waarom:

| Wat | Waarom |
| --- | --- |
| **Een som in de kop** | «€ 57,85 aan extra's cadeau». Eén getal onthoud je; twee losse bedragen van twintig en dertig euro lezen als kleingeld. |
| **Doorstrepen in plaats van «t.w.v.»** | De doorgestreepte prijs met «Gratis» ernaast leest als honderd procent korting. Het woord «t.w.v.» maakte er een productkenmerk van. |
| **Een massief chipje** | Wit op vol groen. Het omlijnde chipje verdween in de kaart eromheen. |
| **Verzending als vierde regel** | Telt mee in de som en staat in hetzelfde blok. Elk product dat een cadeau ontgrendelt zit ruim boven de € 30-grens, dus die regel is altijd waar. Daarmee gaat € 52,90 naar € 57,85. |
| **Een regel onderaan** | «Automatisch inbegrepen. Geen code of selectie nodig.» Anders is de eerstvolgende vraag of je nog iets moet aanvinken. |

**Groen en niet goud.** Goud is in dit koopvak al twee keer bezet: de
aanbodbalk is een goud véld, de koopknop een gouden knóp. Een derde gouden
vlak ertussen maakt alle drie minder waard. Groen was al de kleur van «gratis»
in dit ontwerp, dus dat is nu het hele veld. Goud is de korting, groen is wat
je erbij krijgt, inkt is vergelijken.

**Twee kaarten naast elkaar, of één die ligt.** Bij twee cadeaus staan de
kaarten naast elkaar met de foto erboven. Bij één cadeau — de band tussen
€ 65 en € 90 — zou die ene kaart een halve rij breed zijn en lijken alsof er
iets ontbreekt. Dan krijgt het blok de klasse `ws-cad-alleen` en gaat de kaart
liggen, in hetzelfde ritme als de verzendregel eronder.

**Wat het kost.** Het blok groeide van 145 px naar 289 px op de telefoon; de
koopknop van het Barber Pack 2.0 schoof van 1295 px naar 1439 px. Die knop
stond al ruim onder de vouw — de galerij vult daar het eerste scherm — maar er
komt 144 px scrollen bij. Wil je dat terug, dan is de cadeaulijst op de
telefoon *onder* de knop zetten de enige plek die niets anders verschuift.

**Een botsing in mijn eigen CSS.** Het euroteken in de kop kwam kleiner uit dan
de rest van de regel: de regel voor de onderregel (`.ws-cad-kop span`) pakte
ook het teken dat in de `<b>` erboven zit. Opgelost door de onderregel op een
direct kind te richten (`.ws-cad-kop .ws-cad-tx > span`) en het teken zijn maat
te laten erven. Gevonden door de berekende `font-size` op te vragen, niet door
naar de schermafdruk te turen.

**Nieuwe instellingen:** `cad_kop_na`, `cad_sub_voor`, `cad_chip`,
`cad_verzend_tonen`, `cad_verzend_label`, `cad_verzend_cent` (495 = € 4,95),
`cad_voet`. `cad_kop` en `cad_waarde` zijn vervallen. Alle tekstvelden staan in
`templates/product.json` en zijn in en/de/fr geregistreerd.

### De waarde moest ergens vandaan komen

Een cadeauregel zonder bedrag zegt weinig; «t.w.v. € 32,95» maakt het concreet.
Maar het artikel kost € 0,00, dus die € 32,95 stond nergens. In plaats van het
bedrag in de sectie te typen — waar het meteen zou verouderen — staat het nu
als `compareAtPrice` op de cadeauvarianten zelf: **€ 19,95** op de Washbag,
**€ 32,95** op de Neustrimmer 4in1 Ultra. Het blok toont die regel alleen als
er een `compare_at_price` is. Verandert de waarde, dan verandert de pagina mee.

### De naam van het cadeau was in elke taal Nederlands

`gift_1_label` en `gift_2_label` zijn thema-instellingen, en die zijn
vertaalbaar via een eigen bron: `ONLINE_STORE_THEME_SETTINGS_CATEGORY`, met de
sleutels `general.gift_1_label` en `general.gift_2_label` onder de categorie
**Cart drawer**. Let op de vorm van de id — die heeft naast `theme_id` ook een
`first_setting_id` nodig:

```
gid://shopify/OnlineStoreThemeSettingsCategory/Cart+drawer?theme_id=204412977484&first_setting_id=enable_free_shipping
```

De productnamen zelf (`The Washbag™`, `Neustrimmer 4in1 Ultra™`) blijven in
elke taal staan; alleen «Gratis» is vertaald. Frans zet het achteraan, dus daar
is het «Washbag offerte» en «Neustrimmer offert». Omdat het thema-instellingen
zijn, valt de winkelwagen in dezelfde correctie mee.

### Waar het blok stilvalt

De Neustrimmer 4in1 Ultra heeft **19 stuks op voorraad** met
`inventoryPolicy: DENY`. Op nul is de variant niet meer beschikbaar, en dan
slaat het blok die regel over — netjes, zonder foutmelding, maar ook zonder
signaal. De Washbag staat op 167. Wie de tweede drempel wil laten staan, moet
die voorraad in de gaten houden.

Verder slaat het blok een regel over als het cadeau het product zélf is (een
cadeauproduct opent nooit zijn eigen cadeaublok), en rendert het niets als er
na dat filteren niets overblijft.

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

## Vierde versie: marine met goud

Het ontwerp is aangeleverd, niet door mij bedacht. Marineblauw vlak met een
gouden rand, een crèmekaart met de cadeaus erin, gouden haarlijnen ertussen,
een omlijnd stempel «Automatisch toegevoegd», en een vinkje onder de rij.

**Waarom het naast het goud werkt.** Het contrast met de crèmegrond zit in de
*waarde* en niet in de tint: donker tegen licht. Daardoor vecht het niet met
de gouden koopknop, want die twee claimen niet dezelfde plek in je oog. En
juist omdat het vlak zelf geen kleur opeist, mag goud er wél in terugkomen —
als rand, bovenregel, stempel en vinkje. Op de knop is goud een vlak; hier is
goud een lijn.

**Drie afwijkingen van de tekening**, elk met een reden:

| Tekening | Wat er staat | Waarom |
| --- | --- | --- |
| «Cadeau bij deze set» | «Cadeau bij deze bestelling» | Eén sjabloon, 58 producten; de meeste zijn geen set. De onderregel noemt het product toch al bij naam. |
| «Luxe washbag» | idem | Het winkellabel was «Gratis Washbag» en dat zet naast een plaatje met «Gratis» hetzelfde woord twee keer. Het label is omgezet in Winkelinstellingen. |
| Altijd drie kolommen | zoveel kolommen als er cadeaus zijn | Tussen € 65 en € 90 zijn het er twee; drie kolommen zou een gat geven. |

**De naam komt weer uit één bron.** Eerst stond de weergavenaam in een
sectie-instelling (`cad_naam_1` / `cad_naam_2`) omdat het winkellabel «Gratis
Washbag» was. Daarna is dat label zelf omgezet naar «Luxe washbag» en
«Neustrimmer Ultra», dus de sectie-instellingen staan nu leeg en het
koopvak leest weer rechtstreeks `settings.gift_N_label`. De velden blijven in
het schema als noodgreep: leeg = winkellabel, en anders de producttitel. Twee
bronnen die hetzelfde zeggen kunnen alleen maar gaan verschillen.

Omdat het een thema-instelling is, verandert de winkelwagen mee — daar stond
«Gratis Washbag» naast een regel van € 0,00, wat net zo goed dubbelop was.

### settings_data.json overschrijven zonder het te slopen

Dat bestand bevat naast de cadeau-instellingen ook elke app-embed van de
winkel (Klaviyo, Clarity, Triple Whale, Loox, TikTok, PageFly, Hotjar,
UpPromote…). `themeFilesUpsert` vervangt het hele bestand, dus een tikfout in
één app-UUID zet stilletjes een pixel uit.

Drie dingen die hierbij tegenvielen:

* **De `checksumMd5` die het thema meldt hoort niet bij de inhoud die de API
  teruggeeft.** Voor dit bestand meldt het thema 3550 bytes terwijl `body.content`
  4620 bytes is; geen enkele opmaakvariant van diezelfde data komt op die
  checksum uit. Shopify slaat het kennelijk anders genormaliseerd op. Voor
  `.liquid`, `.css` en `.json`-sjablonen klopt de checksum wél — daar blijft
  het de goede controle.
* **Dus is de controle hier een diff, geen checksum.** Inhoud ophalen vóór de
  upload, bewaren, na de upload opnieuw ophalen en diffen. Verwacht: precies
  twee gewijzigde regels. Dat is een sterkere controle dan een checksum, want
  het zegt ook wát er veranderd is.
* **De inhoud haal je op zonder over te tikken.** Een GraphQL-antwoord dat te
  groot is voor het venster wordt naar een bestand geschreven; door de query
  bewust groot te maken (het bestand plus een grote `translatableResource`)
  komt `body.content` op schijf te staan en haal je hem er met `jq -r` byte-exact
  uit. Overtikken uit een transcript is hier geen optie.

### Twee dingen die ik moest meten

**De foto's liepen over de namen heen.** `max-height:100%` lost op een
grid-item niet betrouwbaar op: de foto bleef 140 px hoog in een vak van 88.
Vaste hoogte in pixels erin en het klopte. Gevonden door de doos en de foto op
te meten in de browser, niet door naar de schermafdruk te turen.

**De doorgestreepte prijzen zakten door de contrasteis.** Marine op 55%
dekking op de crèmekaart haalde 3,42:1. Uitgerekend vanaf welke dekking het
4,5 haalt — 65% — en op 68% gezet.

### Te groot, en het lettertype klopte niet

De eerste uitvoering was 383 px op de desktop en 482 op de telefoon — meer
aandacht dan de koopknop eronder. Nu: **217 en 241**, dus op de telefoon
precies de helft, en korter dan de 289 van de groene versie ervoor.

Het meeste won ik zonder iets weg te laten: de doorgestreepte prijs en het
plaatje «gratis» stonden onder elkaar en staan nu naast elkaar. Twee dingen
mochten wél weg omdat ze dubbel waren — het stempel «automatisch toegevoegd»
en de voetregel zeiden hetzelfde. De voetregel is ingekort tot «Geen code of
selectie nodig.» en op de telefoon, waar het stempel toch op een eigen regel
viel en vijftig pixels kostte, staat alleen de voetregel.

### Twee verlopen

Het vlak loopt diagonaal van iets lichter marine (`#1E3A69`) linksboven naar
dieper (`#101F3A`) rechtsonder. Dat licht valt waar het plaatje en de
bovenregel staan en dooft waar de crèmekaart begint, dus die kaart komt naar
voren zonder extra rand.

De rand is een goudglans in plaats van één tint — goud is nooit één kleur, en
de koopknop eronder heeft datzelfde verloop al. Een `border` kan geen verloop
dragen, dus het zijn twee lagen in één `background`: de eerste `padding-box`,
de tweede `border-box`, met `border-color:transparent`.

**Let op de valkuil.** De `background`-verkorting zet `background-color` op
transparant. Dat kost het vangnet voor een browser zonder verloop, en het
maakt het blok onmeetbaar: een contrastmeter die de achtergrondkleur van de
ouders optelt leest dan de crèmegrond van de pagina in plaats van marine, en
meldt dat alles goed is. Daarom staat `background-color:var(--cad-marine)`
er expliciet achteraan.

**Reken bij een verloop op de lichtste stop**, niet op het gemiddelde. Op
`#1E3A69`: wit 11,3:1, goud 5,7:1, de voetregel 7,3:1.

### Het lettertype: drie lagen diep

| Laag | Wat er aan de hand was |
| --- | --- |
| Mijn CSS | Vroeg om «Montserrat». Die naam bestaat op de pagina, maar de winkel laadt daarvan **alleen gewicht 400**. Elke 600/700/800 werd dus een door de browser opgeblazen 400, en op plekken viel hij terug op Arial. |
| Het thema | Heeft wél een goede: `MontserratEG`, variabel 100–900, in de thema-assets en netjes als `@font-face` gedeclareerd. |
| `base.css` | Zet `--font-family` daarna op «Montserrat», waardoor die goede font wel geladen maar nooit gebruikt wordt. Volgen van de variabele werkt dus niet. |

Alle vier mijn stylesheets — koopvak, geruststrook, aanbodblok en UGC-band —
zetten nu `'MontserratEG'` vooraan. Nagemeten in de browser: `MontserratEG
100–900` is geladen en in gebruik. Daarna moesten mijn letterafstanden terug,
want die waren afgestemd op de Arial-terugval.

**Dit raakt de hele winkel.** Elke andere pagina draait nog op Montserrat 400
met nep-vetjes. Eén regel in `base.css` trekt dat overal recht, maar dat raakt
elke sjabloon en hoort dus niet bij dit blok.

**Waarom ik het niet eerder zag.** Mijn proefbestanden namen alleen de
gekoppelde stylesheets mee, niet de inline `<style>` in de head — en juist
daar staan de `@font-face`-regels en de `:root`-variabelen. Elk proefbestand
rende dus in Arial, en daarin ziet een nep-vet er precies zo uit als een
echte. `proef2.py` haalt die blokken nu wél op, inclusief de fontbestanden
zelf.

**Nieuwe instellingen:** `cad_ey`, `cad_auto`, `cad_naam_1`, `cad_naam_2`.
`cad_sub_voor` en `cad_voet` hebben nieuwe tekst. Alles staat in
`templates/product.json` en is in en/de/fr geregistreerd.


## De kortingszone boven de vouw

Op de Barber Pack 3.0 stonden **vijf losse geldsignalen** boven de vouw: de
gouden pil «Bespaar 7%», de rode «−7%» badge, het kader «Je bespaart €10,00»,
de Summer Sale-balk «tot 40% korting» en het cadeaublok. Drie daarvan dragen
hetzelfde getal.

**Het probleem is niet de drukte maar de tegenspraak.** Van de 53 producten
met een van-prijs is de Barber Pack 3.0 de **laagste van allemaal** (7,4%).
De mediaan ligt op 33%, negentien producten zitten op 40% of hoger. Op je
duurste product zegt de pagina dus «tot 40% korting» en toont vervolgens 7%.

| | |
| --- | --- |
| Producten met een van-prijs | 53 |
| Mediaan | 33% |
| Op of boven 40% | 19 |
| Onder 20% | 17 — vrijwel al je pakketten |
| Barber Pack 3.0 | 7,4%, plek 1 van 53 |

**De oorzaak zit in de prijsstelling, niet in de pagina.** Alle Barber Packs,
Barber Bro's en Skull Deals krijgen precies € 10,00 korting, ongeacht de
prijs. Hoe duurder het pakket, hoe magerder het percentage: Bro 1.0 haalt 10%,
Pack 3.0 zakt naar 7%. De losse apparaten hebben echte percentages van 30 tot
57. De pagina maakt dat alleen zichtbaar.

**En het sterkste getal staat onderaan.** Op dit product staat € 57,85 aan
cadeaus — bijna zes keer de € 10 korting — onder vier labels die over die
tien euro gaan.

### Het voorstel: een drempel, geen knopje per product

Eén sjabloon bedient 58 producten, en een product met 7% en een product met
54% vragen het tegenovergestelde. Daarom een kortingsdrempel:

* **Onder de drempel** treedt de korting terug: alleen de doorgestreepte
  van-prijs, geen badge, geen spaarkader, geen Summer Sale-balk (die adverteert
  daar een beter aanbod dat je op dit product niet krijgt). Het cadeaublok doet
  het werk.
* **Boven de drempel** mag de korting voorop: badge blijft, de balk klopt.

Bij 25% valt de scheiding ongeveer tussen de pakketten en de losse apparaten.
Dat getal hoort een thema-instelling te zijn.

**Twee dingen vallen buiten de drempel** en kunnen op elk product: de rode
badge weg (die zegt exact wat de doorgestreepte prijs al zegt) en het
percentage uit de gouden pil (die hoort te zeggen wát dit is).

### Over de grafiek in het rapport

Een beeswarm van 53 punten, met de Barber Pack 3.0 in rood en de 40%-claim als
gouden lijn. Drie dingen die het bruikbaar maken:

* **Het palet is doorgerekend, niet geschat.** Rood tegen goud haalt ΔE 10,1
  onder deuteranopie en 16,9 bij normaal zicht; beide boven de eis.
* **Losse trefvlakken werkten niet.** Bij 53 punten overlappen trefvlakken van
  24 px elkaar en wordt de helft onbereikbaar — de test liep vast op precies
  dat. Er ligt nu één vanglaag die het dichtstbijzijnde punt zoekt.
* **Het label botste.** «Barber Pack 3.0 — 7%» stond naast de stip en liep
  dwars door de bolletjes bij 8 tot 18 procent. Het staat nu linksboven als
  merkje. Gevonden door ernaar te kijken; de validator controleert kleur, geen
  meetkunde.

Onder de grafiek staat de volledige tabel met alle 53 producten, zodat geen
enkel getal alleen via een tooltip bereikbaar is.


## Van vijf geldsignalen naar drie

Doorgevoerd in het werkthema:

* **De rode `−X%` badge is vervangen door het bedrag.** Op dezelfde plek achter
  de prijs staat nu «Je bespaart € 10,00». Een euro is concreter dan een
  procent, en het losse kader dat er eerst ónder stond is vervallen — hetzelfde
  getal stond er twee keer.
* **De gouden pil zegt wat dit is, niet wat je bespaart.** Nieuwe instelling
  `pil_z`, standaard «Meest gekozen», vrij tekstveld, vertaald in en/de/fr. De
  oude `besparing_label` is vervallen.

De aanbodbalk en het cadeaublok bleven ongemoeid.

**Op de telefoon** zakt het label onder de prijs in plaats van ernaast, en het
breekt als geheel af (`white-space:nowrap`) — nooit middenin de zin. Het
percentage stond daar trouwens al op `display:none`; die badge zag je alleen
op de desktop.

**Vals alarm bij het nameten:** `.ws-bb` meldt `scrollWidth > clientWidth`.
Dat is de decoratieve gouden streep (`.ws-strepen`, `right:-10%`) die door
`overflow:hidden` wordt geknipt. Bestond al, geen overloop.


## Boven de vouw is driekwart spierwit

Gemeten op 1440×900: het galerijpodium beslaat **34,8%** van het eerste scherm
en het koopvak **39,5%**, allebei op `#FFFFFF`. Samen **74,3%** puur wit. Het
zand dat er al is (`--ws-cream: #F4F2EE`) zie je alleen in de goot ertussen.

**De verhouding staat omgekeerd.** De grote vlakken zijn wit en de kleine
binnenkaarten zijn zand (`--ws-kaart: #F6F4F0`). Daardoor heeft niets een rand
en zweeft alles in dezelfde helderheid.

| Token | Nu | A · zacht papier | B · zand |
| --- | --- | --- | --- |
| `--ws-cream` (grond) | `#F4F2EE` | `#F4F2EE` | `#EAE4D9` |
| `--ws-cream2` (podium) | `#FFFFFF` | `#FAF8F4` | `#F2EEE7` |
| `--ws-zwart` (koopvak) | `#FFFFFF` | `#FAF8F4` | `#F2EEE7` |
| `--ws-kaart` (binnenkaart) | `#F6F4F0` | `#FFFFFF` | `#FFFFFF` |

Allebei draaien ze de verhouding om: het grote vlak wordt warm, het kleine
licht op. A laat de grond staan en raakt dus blok 02 en blok 05 niet; B zet het
door naar echt zand en vraagt dat blok 02 meegaat, want dat staat nu op wit.

### De foto's zijn hier geen bezwaar, en dat is niet vanzelfsprekend

De eerste vraag bij een gekleurd podium is of er een witte rechthoek om het
product komt. De fotoachtergronden zijn **niet gelijk** — bemonsterd:
`#f0f0f0`, `#f2f2f0`, `#f4f4f3`, `#f6f6f6`, en de Neustrimmer 4in1 op puur
`#ffffff`. Op het huidige witte podium zie je dus al een flauwe rand bij de
meeste foto's.

**Maar de galerij staat op `mix-blend-mode: multiply`** (regel 53 in
`ws-pdp-koopvak.css`), en dat maakt wit doorzichtig. Nagespeeld op alle vier de
kandidaat-gronden: het product zakt naadloos in elke tint en de zwarte
apparaten blijven zwart. Het podium mag dus gekleurd worden zonder dat de
fotografie opnieuw moet.

Keerzijde: multiply werkt twee kanten op. Hoe dieper het podium, hoe meer de
foto meekleurt. Daarom houdt B het podium op `#F2EEE7` en zakt alleen de grond
naar `#EAE4D9`.

Contrast van alle tekst in beide varianten nagemeten tegen zijn eigen grond;
alles haalt 4,5:1. Op zand is de marge krapper dan op wit, dus wie hier aan de
tinten draait moet opnieuw langs de meter.


## Het rapport: waar staat wat er nieuw is

Het dossier is veertig hoofdstukken lang. Zonder hulp moet je zoeken waar er
iets bij is gekomen, en dat is precies wat er gebeurde. Er zitten nu vier
dingen in, allemaal uit één lijst gevoed:

**De lijst zelf** staat in `scripts/bouw-productpagina.py` onder
`WIJZIGINGEN`, nieuwste bovenaan, met `NIEUW_OP` als de datum die de vlag
krijgt. Elke regel is `(datum, deel, snum-label, omschrijving)`.

**Gesleuteld op het label, niet op het nummer.** De sectie-ids (`boven-12`)
worden bij het bouwen op volgorde uitgedeeld, dus ze schuiven zodra er ergens
in het midden een hoofdstuk bij komt. Het snum-label («CADEAUS», «BLOK 02»)
blijft staan. Twee labels komen in twee delen voor — `BLOK 05` en `BLOK 07` —
vandaar dat het deel er ook bij moet. Staat een label er verkeerd in, dan valt
de bouw om met een melding; dat is beter dan een dode link in het rapport.

Daaruit komen: het paneel **Laatst gewijzigd** boven de inhoudsopgave, een
**vlag** in de kop van elk vers hoofdstuk, een **merkje** in de
inhoudsopgave, en de gouden knop **Nieuw →** in de meelopende balk. Die knop
is goud en niet zwart, want zwart is in die balk al bezet door de sectie waar
je staat.

### Ankers landden structureel te hoog

Bij het testen van die knop bleek iets dat er al langer zat: een sprong naar
een anker kwam **vierduizend pixels** te hoog uit. De plaatjes in dit dossier
zijn ingebakken base64 en decoderen door nádat de browser de eindpositie al
berekend heeft, dus de opmaak boven het doel groeit onder je handen. Bij korte
sprongen valt dat niet op, bij een sprong van vijftigduizend pixels wel.

De sprong gebeurt nu in JavaScript, hard in plaats van glijdend — over die
afstand is glijden toch geen dienst — met twee nacorrecties op 250 en 900 ms.
Nagemeten op drie doelen verspreid door het document: alle drie landen op
76 px, precies onder de balk. Dit repareert ook elke link in de
inhoudsopgave, niet alleen de nieuwe knop.


## Variant B staat live: het zand doorgetrokken

Van de drie varianten uit het rapport is **B** gekozen. Dat betekende vier
bestanden en niet twee, want een grond veranderen raakt alles wat erop ligt.

| bestand | wat er veranderde |
| --- | --- |
| `assets/ws-pdp-koopvak.css` | `--ws-cream` naar `#EAE4D9`, `--ws-cream2` en `--ws-zwart` naar `#F2EEE7`, de lijnen naar `.14`/`.22`, de reviewkaart naar `--ws-kaart` |
| `assets/ws-pdp-belofte.css` | de icoontegel van `#F4F2EE` naar wit, de rand van `.07` naar `.09` |
| `assets/ws-pdp-ugc.css` | alleen het groen, zie hieronder |
| `templates/product.json` | `belofte.grond` naar `#EAE4D9`, `pil_z` naar &laquo;Bestseller&raquo; |

`--ws-zwart` heet nog steeds naar de donkere versie, maar is nu gewoon de kleur
van het koopvak. Hernoemen zou elke regel in het bestand raken; de naam is de
prijs die de geschiedenis vraagt.

### Blok 02 krijgt dezelfde grond, met opzet

De geruststrook staat direct onder het koopvak. Als die een andere tint zand
krijgt, ontstaat er een naad op een plek waar de bezoeker geen grens verwacht:
hij leest de twee als &eacute;&eacute;n band. Daarom `#EAE4D9`, precies de grond van de
vouw erboven, en tilt de icoontegel zichzelf op met wit in plaats van met een
inktwas. Een was van `rgba(20,18,15,.035)` **zakt** op zand; op zwart tilde
diezelfde was juist op. Hetzelfde recept, omgekeerd resultaat.

### De reviewkaart moest omgekeerd worden

Om die reden ook: de kaart had een inktwas als achtergrond. Op de donkere
versie lichtte die op, op zand zakt hij weg en gaat de kaart eruitzien als een
gat. Nu staat er `--ws-kaart` (wit) in, en tilt hij.

### Het groen zakte door de eis heen

De tekstkleuren waren al eerder dieper gezet en halen op zand allemaal 4,5:1 &mdash;
de dofste trede (`.60` inkt) komt uit op 4,66 in het koopvak en 4,51 op de
paginagrond. Dat was het risico dat ik vooraf had opgeschreven en het viel mee.

Wat er w&eacute;l doorheen zakte was `--ws-groen`, de vierkante tegel achter de
sterren. Dat is geen tekst, dus de eis is 3:1 en niet 4,5:1 &mdash; maar op wit
haalde `#00A06C` nog 3,36 en op zand nog maar **2,66**. Verlaagd naar
`#008859`: 3,56 op de krapste grond, met genoeg ruimte om ook stand te houden
als het zand ooit een tint dieper gaat.

Dat groen zit ook in blok 03 (`--u-groen`, het vinkje in de UGC-band). Daar was
het niet stuk, want die band staat op `#F4F2EE` en wit. Toch meeveranderd: twee
blokken onder elkaar met twee verschillende groenen is slordig, en de UGC-band
gaat er alleen op vooruit (3,36 naar 4,50).

### Twee labels zeiden hetzelfde

Toen `pil_z` op &laquo;Meest gekozen&raquo; ging, stond die claim ineens twee keer in
dezelfde vouw: linksboven op de foto (`tag`, die stond er al) en in de gouden
pil ernaast. Twee instellingen, geen van beide fout, samen een dubbeling.

De pil staat nu op &laquo;Bestseller&raquo; &mdash; het tweede woord uit de opdracht &mdash; en het
fotolabel blijft wat het was. De `info` bij `pil_z` waarschuwt nu voor de
botsing, zodat de volgende die dit veld invult het weet. Vertalingen opnieuw
geregistreerd: en/de `Bestseller`, fr `Meilleure vente`.

### Op de telefoon past het bespaarlabel niet naast de prijs

Op desktop staat &laquo;Je bespaart &euro;&nbsp;10,00&raquo; naast de prijs, zoals gevraagd. Op
390&nbsp;px is er 358&nbsp;px ruimte en vraagt de rij er ongeveer 430: de prijs op
38&nbsp;px is alleen al zo'n 175. Het label valt daarom op de regel direct
eronder. Dat is de bedoeling van de `flex-wrap` en niet een fout &mdash; het
alternatief is de prijs een derde kleiner maken, en dat is een slechtere ruil.

### Het proefbestand miste een viewport-meta

`scratchpad/proef2.py` schreef geen `<meta name="viewport">`. Een proef op
390&nbsp;px rekende daardoor met een bureaubladbreedte en meldde ooit 2121&nbsp;px
hoogte. Staat er nu wel in; elke mobiele meting hierna klopt.


## De gouden bogen terug: gratis op zwart, niet gratis op zand

De bogen in het koopvak waren er nog, maar onzichtbaar. Het verloop liep over
`#F5D18A` op `opacity:.16`: een piek van ongeveer 11% licht goud. Op zwart was
dat een gloed, op zand is het contrast **1,03** en zie je niets.

Drie dingen moesten om:

1. **Dieper goud.** `#BC813E` op `.34` komt uit op **1,40** tegen het koopvak en
   **1,37** tegen de paginagrond. Vrijwel gelijk, en dat is de winst: dezelfde
   lijn leest hetzelfde waar hij ook overheen loopt. Hoger dan dit en het gaat
   met de tekst concurreren; dit is textuur, geen inhoud.
2. **`vector-effect="non-scaling-stroke"`.** Met `preserveAspectRatio="none"`
   rekt de streekdikte mee met de doos. Over de volle hoogte werd de lijn
   onderin een balk in plaats van een haarlijn.
3. **S-bochten in plaats van enkele bogen.** Een gewone C-curve staat na de rek
   over de volle hoogte onderin loodrecht en leest dan als een tabelrand. De
   terugslag houdt hem een sweep.

### Op de telefoon moesten ze opzij

Op 390&nbsp;px is de doos smal en hoog, dus dezelfde bocht staat er bijna
loodrecht en snijdt dwars door de USP-regels. Daar staan ze nu smaller en verder
naar rechts (`right:-8%;width:56%`), zodat ze langs de regeleinden lopen in
plaats van erdoor. Ik heb dat gemeten en niet geschat: bij `right:-26%` viel het
zichtbare deel terug op 110&nbsp;px en waren de bogen wéér weg, precies het
probleem dat ik aan het oplossen was.

### Wat het kostte: goud op goud op goud

Een boog achter tekst verandert de grond onder die tekst. Ik heb elke tekst in
het koopvak geometrisch getoetst &mdash; elk pad afgelopen in schermco&ouml;rdinaten en
gekeken welke tekstkaders het raakt, met de dichte accordeons eruit &mdash; en er
zakten er twee door de eis, allebei op de Summer Sale-kaart:

| tekst | zonder boog | met boog |
| --- | --- | --- |
| de gouden kop `#8A5A1E`, 13&nbsp;px | 4,85 | **3,65** |
| &laquo;Zolang de voorraad strekt&raquo;, 11&nbsp;px | 4,57 | **4,11** |

Die kaart had een d&oacute;&oacute;rschijnende gouden achtergrond, dus de boog scheen erdoor:
goud op goud op goud. Zachtere bogen repareren dat niet &mdash; zelfs op `.18` haalt
die 11&nbsp;px-regel het niet, want hij had zelf maar 0,07 marge. En de gouden kop
is een vaste kleur; daar helpt geen dekking aan.

De oplossing zit dus niet in de bogen maar in de stapeling. Dezelfde twee
tinten staan nu al tegen `#F2EEE7` uitgerekend (`#F0E4D0` &rarr; `#F1E9DB`) en zijn
d&aacute;&aacute;rmee dekkend. Het ziet er identiek uit, maar de boog loopt er nu
&aacute;chterlangs. Elke tekst op die kaart heeft zijn eigen contrast terug, en de
onderregel ging van `.60` naar `.64` omdat 4,57 op 11&nbsp;px te krap is om te laten
staan.

Na de reparatie is het slechtste geval op de hele pagina **4,65** (`.64` inkt op
12,5&nbsp;px, met een boog erachter).

### Waarom de boog bij een paneel afbreekt

Bij het cadeaublok en de Summer Sale-kaart houdt de lijn op en loopt eronder
verder. Dat is geen fout: die panelen zijn dekkend en de boog ligt erachter.
Precies dat maakt het diepte in plaats van decoratie.

### Waarom dit op zwart geen probleem was

Witte tekst op zwart heeft enorme marge; een flauwe gouden lijn erachter kost
niets. Doffe inkt op zand heeft die marge niet &mdash; tussen inkt en onzichtbaar zit
op licht nu eenmaal minder ruimte. Hetzelfde effect, andere prijs.


## De vergelijk-pop-up stuurde je naar de homepage

Op &laquo;Kies Barber Pack 3.0&raquo; drukken deed twee dingen: het product ging in de
winkelwagen, en je stond op de homepage. Dat laatste is geen keuze geweest maar
een gat: de formulieren postten naar `/cart/add` z&oacute;nder doel, en dan zet Shopify
je op de root.

Er zitten nu twee lagen op.

**Het vangnet.** Beide formulieren dragen
`return_to={{ routes.cart_url | replace: '/cart', '/checkout' }}`. Dat levert
`/checkout` in het Nederlands en `/en/checkout`, `/de/checkout`,
`/fr/checkout` in de andere talen &mdash; de taalprefix komt mee, dat is nagemeten op
alle vier.

**De echte weg.** Een handler onderschept de verzending en doet het via de
cart-drawer. Dat m&oacute;&eacute;t, en daar zit het hele punt: `syncGifts()` leest de
winkelwagen, voegt per ronde &eacute;&eacute;n cadeau toe en roept zichzelf daarna opnieuw
aan. Meteen na het toevoegen wegnavigeren slaat dat over, en dan komt de klant
z&oacute;nder cadeau in de kassa aan. Bij de Barber Pack 3.0 is dat **&euro;52,90** die
stilletjes verdwijnt.

`syncGifts` zet `syncingGifts` synchroon op `true` v&oacute;&oacute;rdat hij gaat ophalen, en
pas op `false` als een ronde niets meer te doen vindt. Wachten tot dat vlaggetje
zakt is dus het signaal dat de cadeaus staan. Er zit een uiterste termijn van
vijf seconden op, zodat een hangende aanroep de klant niet vasthoudt; loopt het
mis, dan gaat hij alsn&oacute;g naar de kassa &mdash; het product zit dan in elk geval in de
winkelwagen, en een dode knop is erger.

Nagespeeld met een nagemaakte cart-drawer die twee cadeaurondes doet. De
volgorde klopt: toevoegen &rarr; cadeau 1 &rarr; cadeau 2 &rarr; cadeaus klaar &rarr; pas d&aacute;n
naar `/en/checkout`.

### Wat hier niet getoetst is

Een echte bestelling, van klik tot kassa met een levende winkelwagen. Daarvoor
is een sessie op de winkel zelf nodig en die heb ik hier niet. Wat w&eacute;l is
nagegaan: de opmaak op de pagina, de taalprefix in alle vier de talen, dat de
handler bindt, en de volgorde met een nagemaakte drawer.

## De meelopende koopbalk

Van de drie referenties was de derde de favoriet &mdash; naam, ondertitel, prijs met
doorhaling, bespaarlabel, compact &mdash; maar hij viel te weinig op. Wat daar
ontbrak was een knop die je ziet: er stond een rond icoontje. Dus: die indeling,
met de gouden knop van de pagina zelf erin.

### De knop is geen tweede formulier

Hij klikt de echte koopknop aan. Daarmee erft hij alles wat daaraan hangt: de
AJAX-toevoeging, het synchroniseren van de cadeaus, de upgrade-pop-up, de
uitverkocht-staat. Een tweede formulier zou dat allemaal moeten nadoen en
vroeg of laat uit de pas gaan lopen.

Om dezelfde reden wordt de prijs niet opnieuw uitgeschreven maar overgenomen uit
`#ProductPrice-<sectie>`, met een `MutationObserver` erop. Anders werkt een
variantwissel maar de helft van het scherm bij en staat er onderin een bedrag
dat niet meer klopt. De uitverkocht-staat van de knop gaat op dezelfde manier
mee.

### Hij verschijnt pas als de koopknop voorbij is

Niet zodra die uit beeld is. Op de telefoon staat de knop ver onder de vouw, dus
met die regel zou de balk meteen bij het laden verschijnen en het scherm
opeten voordat de bezoeker iets gezien heeft &mdash; precies wat er niet moest
gebeuren. De maatstaf is `rect.bottom < 0`: de knop is v&oacute;&oacute;rbij, niet alleen weg.

### Op 390 px gaan drie dingen eruit

De miniatuur, de naam en het bespaarlabel. Dat is geen bezuiniging maar een
keuze: met alles erin bleef er voor de naam ongeveer 30&nbsp;px over en stond er
&laquo;Barber ...&raquo;, wat slechter is dan niets. Wie deze balk ziet staat op de pagina
van dat product; de naam is het minst nodige van de vier. Prijs en knop krijgen
de ruimte.

De balk is daarmee **56&nbsp;px** hoog op de telefoon en 59 op de desktop, plus de
veilige zone onderaan. Dat is het hele punt: hoger en hij begint het scherm op
te eten.

### Twee dingen die eerst gecontroleerd zijn

`position: fixed` breekt op een voorouder met `transform`, `filter`,
`perspective` of `contain`. De keten is `body &gt; main#MainContent &gt; section`; geen
van de thema-stylesheets zet daar zoiets op, dus de balk pint netjes aan het
scherm. En er is geen andere v&aacute;ste balk onderaan waar hij tegenaan botst.

### Maar &laquo;de pop-up dekt hem wel af&raquo; hield geen stand

Dat schreef ik hier eerst, en het klopte alleen op kleur. De sluier van de
vergelijk-pop-up is `rgba(11,11,10,.62)`; daar doorheen wordt de zandkleurige
balk `#63615E` tegen een omgeving van `#605D59`, een verschil van 1,06. Zelfs de
gouden knop komt niet verder dan 1,21. Onzichtbaar, zou je zeggen.

Maar op de telefoon staat de eigen knoppenbalk van de pop-up
(`.ws-pop-balk`, `position: sticky; bottom: 0`) &oacute;&oacute;k onderaan, en die overlapte
de onze met **36&nbsp;px**. In beeld zag je de gouden knop achter de afgeronde hoek
van de pop-up vandaan piepen. Twee koopbalken op elkaar, en de verkeerde
onderop.

De winkelwagenlade was erger. Die staat op `z-index: 6` en deze balk op `90`,
dus we tekenden er dwars overheen &mdash; inclusief zijn eigen afrekenknop. Dat is
geen schoonheidsfoutje maar een knop die je bedekt op het moment dat hij telt.

### Hoe de balk nu wijkt

Hij krijgt `ws-wijk` zodra een laag het scherm overneemt, en de zichtbare staat
is daarom `.ws-in:not(.ws-wijk)` en niet een regel die het van zijn volgorde in
het bestand moet hebben.

Het signaal is tweeledig. Er hangt een waarnemer op de klasse van elke bekende
laag (`.ws-pop`, `.ws-upg`, `cart-drawer`, `.header__search`), &eacute;n op
`document.documentElement`. Dat tweede is het belangrijkste: **elke** laag in dit
thema zet de pagina op slot via `documentElement.style.overflow = 'hidden'`, en
dat element bestaat altijd. Een waarnemer op de lade zelf mist het namelijk als
die lade door een andere sectie later in de DOM komt &mdash; dat is precies wat er in
mijn eerste toets gebeurde, en het is geen gekunsteld geval.

De keerzijde: zet iets anders ooit `overflow: hidden` op `<html>` om een andere
reden, dan verdwijnt de balk mee. In dit thema is dat slot alleen voor lagen in
gebruik, dus dat is een prijs die ik nu accepteer.


## Het bespaarbedrag: heen en weer, en weer terug

Even naast de knop gezet, naar het voorbeeld waarin prijs, doorgehaalde prijs,
bespaarbedrag en knop op &eacute;&eacute;n regel staan. **Teruggedraaid**: hij hoort achter de
doorgehaalde prijs, en daar staat hij nu weer.

Wat die omweg heeft opgeleverd is een stukje kennis dat blijft gelden: **het
thema vervangt bij een variantwissel de `innerHTML` van &aacute;lles wat op
`[id^="ProductPrice-"]` matcht.** Zolang de chip in het prijsblok zit, houdt het
thema hem dus vanzelf bij. Wil je hem ooit ergens anders neerzetten, dan moet
die plek een eigen `ProductPrice-`id krijgen &eacute;n altijd worden uitgeschreven,
ook zonder korting &mdash; het thema haakt namelijk af zodra het aantal knopen v&oacute;&oacute;r
en n&aacute; de wissel niet gelijk is, en dan werkt ook de pr&iacute;js niet meer bij.

Om dezelfde reden leest de meelopende balk weer &eacute;&eacute;n knoop in plaats van twee.

### Het label zelf: kleiner, gevuld, zonder icoon

Het was een omlijning met een prijskaartje-icoontje en gouden letters. Nu een
gevuld pilletje van 129&times;22&nbsp;px, 11&nbsp;px op 600, zonder icoon. Het tag-symbool
in de SVG-sprite is meeverwijderd &mdash; die chip was de enige gebruiker.

De vulling is `--ws-tekstgoud` (`#8A5A1E`): dezelfde brons die hier eerst de
l&eacute;tters had, nu als vlak. Geen nieuwe kleur dus, dezelfde omgekeerd.

**Waarom niet het lichte goud van de knop.** Dat leek het voor de hand liggende
merkantwoord, maar het meet slecht:

| vulling | letters | op het koopvak | naast de knop |
| --- | --- | --- | --- |
| `#8A5A1E` brons | 5,33 (cr&egrave;me) | **5,10** | **3,39** |
| `#E9BE72` licht goud | 9,98 (inkt) | 1,50 | **1,00** |
| `#008859` groen | 4,50 (wit) | 3,89 | 2,59 |
| `#C8281F` rood | 5,56 (wit) | 4,81 | 3,19 |

In de meelopende balk staan de chip en de gouden knop n&aacute;&aacute;st elkaar. Licht goud
komt daar op 1,00 uit &mdash; de chip zou letterlijk in de knop verdwijnen. Groen en
rood halen het wel, maar groen is hier een vreemde eend en rood is de
foutkleur van dit blok; allebei lezen ze bovendien als uitverkoop, niet als
merk.

E&eacute;n ding om te weten als je hem verder aanpast: **geef de tekst een eigen
`line-height`.** Zonder erfde hij die van het koopvak en werd het pilletje
32&nbsp;px hoog in plaats van 22 &mdash; dat is bijna de helft erbij, op een label dat
juist kleiner moest.

### Wat niet is teruggedraaid

Het bedrag is uit de knop gebleven. Die zei &laquo;In winkelwagen &mdash; &euro;&nbsp;124,95&raquo;,
het derde bedrag op &eacute;&eacute;n scherm. Terugzetten is een regel als het toch moet.

## Alles stond op vet: de gewichtschaal

23 van de 41 gewichtsregels stonden op 700 of 800, inclusief lopende tekst. De
checkpoints onder de prijs stonden op 700, de knop op 800, de accordeons op
700, de beloftes van blok 02 op 800. Als alles schreeuwt is er geen hi&euml;rarchie
meer, alleen volume &mdash; en dat leest als dropshipping, niet als een merk.

De schaal staat nu bovenaan `ws-pdp-koopvak.css`:

| | |
| --- | --- |
| &ge; 23 px koppen | 500 &mdash; de grootte draagt de hi&euml;rarchie al |
| 17-23 px ondertitels | 400 &mdash; moeten wijken voor de kop erboven |
| 12-16 px koppen | 500 &mdash; tweede orde: accordeons, kaartnamen |
| 12-16 px lopende tekst | 400 &mdash; checkpoints, beschrijvingen |
| &le; 11 px microlabels | 700 &mdash; klein en gespatieerd, daaronder verdwijnen ze |
| knoppen | 600 &mdash; kapitaal met spatiering draagt al |
| getallen | 500 &mdash; prijs, aantallen, bedragen |

Twee vloeren: onder 11&nbsp;px nooit lichter dan 500, en wit op bewegend beeld (de
UGC-tegels) blijft 600-700, want daar is licht niet leesbaar. **Boven 700 staat
nu niets meer.**

52 regels aangepast over alle vier de stylesheets. Blok 03 en 05 zijn
meegegaan hoewel de opmerking over de vouw ging: als blok 01 en 02 naar 500
zakken en de rest op 800 blijft staan, valt de pagina in twee helften uiteen.

### Wat er bewust bleef

De prijs blijft 500 &mdash; die mag dicht, dat was expliciet. En de doorgehaalde
prijs ging naar 400 omdat hij bijzaak is naast het bedrag dat je betaalt.

### Dit raakt het contrast niet

Gewicht zit niet in de WCAG-som: de kleuren zijn niet veranderd, dus alle eerder
gemeten verhoudingen staan nog. E&eacute;n grens is er wel &mdash; tekst van 18,66&nbsp;px
&eacute;n vet valt onder de soepelere eis van 3:1. In dit blok zit niets in die band
dat op die uitzondering leunde: alles tussen 18 en 24&nbsp;px is volle inkt op
16:1. De dofste tekst zit op 12,5&nbsp;px en die is nooit vet geweest.


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
* **Blok 07 (maak het compleet) heeft nog geen sectie.** In het
  voorbeeldsjabloon staat het daarom niet. Blok 02 staat er inmiddels wel.
* **De Neustrimmer 4in1 Ultra heeft nog 19 stuks** met `inventoryPolicy: DENY`.
  Op nul verdwijnt de tweede cadeauregel zonder waarschuwing van de
  productpagina.
* **Vier producten staan op 89,95** &mdash; Shave Package Ultimate, Flex-line
  Bundel, The Sentinel PRO, Barber Bro 1.0 &mdash; en vallen daarmee vijf cent
  onder de tweede cadeaudrempel.
* De secties onder de vouw staan in `product.ws-pdp.json` met lege instellingen,
  dus met hun eigen standaardwaarden. Ze zijn nog niet ingericht.

## Eerste foto op de productpagina, kaartfoto in de collectie

Twee productvelden, allebei een afbeelding en allebei optioneel:

| Veld | Wat het doet | Leeg |
|---|---|---|
| `custom.pdp_hoofdfoto` (*Productpagina — eerste foto*) | De foto waarmee de productpagina opent, bijvoorbeeld een sfeerbeeld. Is het een van de productfoto's, dan staat hij niet nog eens verderop in de rij. | De eerste productfoto |
| `custom.collectie_foto` (*Collectie — kaartfoto*) | De foto op de productkaart in het collectieraster (`ws-collectie-raster`) en op de gewone kaart (`product-card`: aanbevelingen, zoeken). | De eerste productfoto |

De eerste productfoto zelf blijft de rechttoe-rechtaan pakshot. Die gebruiken
ook de winkelwagen, de structured data en de productfeed voor Google en Meta,
en daar hoort een rustige foto op wit. Daarom wordt de volgorde van de
productfoto's niet aangeraakt; de velden zetten er alleen iets voor.

Voor de kaartfoto: kies een vrijstaande pakshot op licht. De tegel in het
collectieraster mengt wit weg tegen zijn achtergrond (`mix-blend-mode:multiply`)
en zet het monogram erachter; een sfeerfoto wordt daar donker en vlekkerig.

Dubbel wordt herkend aan het bestandspad, niet aan het id: een foto die je uit
de productfoto's kiest is hetzelfde bestand en dus hetzelfde pad.

Op 7 oktober staat de Groom Guard™ PRO als voorbeeld op de handdoekfoto als
eerste foto. Weghalen = het veld leegmaken.

## Reviewwand

`sections/ws-pdp-reviewwall.liquid` + `assets/ws-pdp-reviewwall.css`, naar het
voorbeeld van Well-Shine. Links het Trustpilot-winkelcijfer, rechts twee
kolommen echte Trustpilot-reviews die tegen elkaar in schuiven; op de telefoon
twee rijen die zijwaarts lopen. Staat in het productsjabloon op de plek van de
oude Trustpilot-widget (`trustpilot_reviews`), die uit staat maar niet weg is.

* **De reviews zijn blokken in de sectie**, één per review, overgenomen van
  Trustpilot met titel, tekst en naam zoals de klant ze schreef. Alleen de
  witruimte is opgeschoond. Begint de tekst met dezelfde woorden als de titel,
  dan blijft de titel leeg; Trustpilot maakt titels vaak van de eerste woorden.
* **Gekozen op 7 oktober** uit de honderd recentste Nederlandse vijfsterren-
  reviews: twaalf die over het apparaat gaan (tondeuse, bodygroomer,
  scheerapparaat, neustrimmer), niet over een defect dat daarna is opgelost.
  Servicereviews zijn eerlijk en goed, maar op een productpagina zet een
  kapotte scheerkop in de eerste zin het verkeerde beeld neer.
* **De reviews zijn Nederlands, in elke taal.** De kop, het cijfer, de link en
  de knop zijn vertaald (en/de/fr); de reviews niet, want het zijn de woorden
  van een klant. De oude widget liet per taal reviews in die taal zien.
* **Bewegen is CSS.** Elke kolom staat er twee keer in, de tweede voor
  schermlezers verborgen, en schuift precies één lijst op. Stil bij hover en
  focus; de knop *Pauzeer* zet hem helemaal stil (WCAG 2.2.2). Bij
  *minder beweging* in het systeem een gewone scrollbare lijst.
* **Het cijfer** (4,4, 4,5 ster, 1000+) staat in deze sectie los van het
  koopvak. Verandert de score, pas dan beide aan.

## Uploaden: wat stil mislukt

* **Een sectienaam mag maximaal 25 tekens zijn**, en `"default": ""` mag ook
  niet. Een upload via een URL (staged upload) die op zo'n schemafout stuit,
  wordt zonder foutmelding genegeerd: `userErrors` blijft leeg en het bestand
  blijft oud. Altijd de checksum vergelijken. Een upload als `TEXT` geeft de
  fout wel terug, dus bij twijfel het schema los als `TEXT` proberen.
* **Screenshots van de preview**: Chromium in deze omgeving vertrouwt het
  proxycertificaat niet. Haal de pagina met curl (met cookiejar en
  `preview_theme_id`) en laat Node de overige bestanden ophalen via
  `page.route` en `fetch` met `NODE_USE_ENV_PROXY=1`; Node vertrouwt het
  certificaat wel. TLS-controle uitzetten is geen optie.

## Prijs groter, Klarna in drie delen eronder

De prijs stond eerst op 50 px (was 38), op de telefoon op 40. Op 25 oktober
op verzoek ongeveer gehalveerd: 26 px op de computer, 24 op de telefoon en 23
onder 390 px. Streepprijs (14 / 13 px) en bespaarlabel (10 / 9,5 px) zijn mee
verkleind; de prijs in de meelopende balk (19 px) is ongewijzigd. Prijs,
streepprijs en label blijven op één regel, ook op 320 px; gemeten met
€89,95 / €142,80 / 37%.

Daaronder een eigen Klarna-regel: het roze Klarna-plaatje en *Of betaal in 3
rentevrije delen van €19,99*. Het Klarna-appblok (*on-site messaging*) dat in
het koopvak stond, rendert niets; deze regel komt uit het koopvak zelf.

* **Het bedrag** is de prijs gedeeld door drie, **naar boven** afgerond op een
  cent. Klarna legt een restcent bij de eerste termijn, dus dat is het bedrag
  dat de klant als eerste betaalt.
* Staat in `ProductPrice-…` en verandert dus mee met de variant. De meelopende
  koopbalk kopieert dat blok; daar is de regel verborgen.
* **Instellingen** in het koopvak, kop *Klarna in drie delen*: aan/uit, de tekst
  (`[bedrag]` wordt het bedrag), en vanaf/tot en met in euro (35 en 1500).
  Alleen aanzetten als *Betaal in 3 termijnen* echt in de kassa staat, en de
  grenzen gelijk houden aan wat Klarna voor dit account hanteert.
* Tekst vertaald in en/de/fr. Het woord voor het bedrag zit er met een harde
  spatie aan vast, anders staat op de telefoon het bedrag alleen op regel twee.
* **Op de telefoon blijft de regel op één regel.** De letter schaalt met de
  schermbreedte (12,4 px op 390, 11,8 op 375, 10 op 320) en het Klarna-plaatje
  schaalt in em mee. Gemeten in alle vier de talen van 320 tot 414 px. Engels
  en Duits zijn daarvoor ingekort: *Or 3 interest-free payments of €19,99* en
  *Oder in 3 zinsfreien Raten à €19,99*. Maak je de zin in de editor langer,
  meet dan opnieuw: de rekensom in de CSS gaat uit van de Nederlandse lengte.

## Praktijk: bijna paginabreed, beeld en tekst als losse tegels

`ws-pdp-praktijk` naar het voorbeeld van Well-Shine:

* De rail is 1360 px (was 1840, en daarvoor 1000); aan de zijkant 12 tot
  56 px marge. Op 25 oktober versmald en vooral verlaagd naar het voorbeeld
  van Achaté.
* Beeld en tekst zijn twee tegels met een naad van 24 px en hoeken van 22 px.
  Het beeld krijgt 5 van de 13 kolommen en is vierkant (ruim 500 px, nooit
  hoger dan 540 px of 70% van het scherm), de tekst 8. Om en om wisselt de
  kant. Gemeten: op 1920 px beeld 514×514 en tekst 822 breed (was 748×748
  en 1048); op 1440 px 511 hoog (was 559).
* In het tekstvlak staat het **merkteken** groot en toon-op-toon, rechts en
  half over de rand: brons op 5,5%. Het grote volgnummer dat daar stond is
  weg; het nummer staat al klein in de regel boven de kop.
* Het merkteken komt uit `snippets/ws-merkteken.liquid`: de S uit het
  logobestand `Group_2.svg`, als vector in één kleur (`currentColor`). Het
  oude `ws-mark.png` is 160 px en wordt wazig zodra het groter staat.
* Nieuwe instellingen: achtergrond van de sectie (wit), de twee zandtinten van
  de tekstvlakken (#F2EEE7 en #EAE4D9) en het merkteken aan/uit.

## Voordelen als kaartjes met een eigen icoon

Onder de prijs stonden de voordelen als vinkjeslijst (`product_usp`, vier
zinnen met een gedachtestreepje). Nu zijn het **kaartjes**: een korte kop, een
regel tekst eronder en per voordeel een eigen icoon. Op de computer twee naast
elkaar, op de telefoon ook twee, met het icoon boven de tekst.

### Waar de tekst staat

* **Metaobject `ws_voordeel`**, velden `icoon` (sleutel, zie hieronder), `kop`
  en `tekst`. Vertaalbaar, en zichtbaar voor de winkel. Eén voordeel kan bij
  meerdere producten horen: *Nat of droog* staat er één keer in.
* **Productmetaveld `custom.voordelen`**: een lijst van zulke voordelen, in de
  volgorde waarin ze op de pagina staan. Er worden er maximaal vier getoond.
* **Ingevuld voor 43 producten**, met in totaal 120 voordelen. De teksten zijn
  herschreven uit `product_usp`: korter en met de kop als belofte, niet als
  kenmerk (*Raakt je huid niet*, niet *SkinSafe-mesjes*). Daarbij ging er bij
  twee producten iets mis dat nu klopt: bij het Flex Guard Trio-mes stond
  *Groom Guard*, en *Bruibaar* is weg.
* **Vertaald** in en/de/fr (kop en tekst), gecontroleerd op de preview in alle
  drie de talen.
* **Valt terug** op `product_usp` als `custom.voordelen` leeg is: elke zin wordt
  een kaartje, de tekst voor het gedachtestreepje de kop, de rest de regel
  eronder, met het vinkje als icoon. Een nieuw product zonder kaartjes ziet er
  dus niet kaal uit.
* *Snel bekijken* in de collectie en de vergelijktabel lezen nog `product_usp`.
  Pas je daar een voordeel aan, doe het dan in beide.

### De iconen

`snippets/ws-voordeel-icoon.liquid`, met de sleutel als parameter. Lijnen van
1,75 op een raster van 24, in brons (#A76F28). Een deel komt uit Lucide
(ISC-licentie, de vermelding staat in het snippet), de rest is getekend voor
deze producten.

| Sleutel | Voor |
|---|---|
| `schild` | veilig, geen sneetjes, SkinSafe |
| `veer` | zacht, geen irritatie, trekt niet |
| `glad` | glad resultaat |
| `haar` | haar, haarsoort |
| `licht` | LED-lampje |
| `druppel`, `douche` | waterdicht, onder de douche |
| `accu`, `opladen`, `station`, `scherm`, `klok` | accu, laden, laadstation, display, looptijd |
| `motor`, `knop`, `stil` | vermogen, bediening, stil |
| `opzetstukken`, `kam`, `fade`, `draai` | opzetstukken, kamlengtes, fade-hendel, lengte draaien |
| `precisie`, `foil`, `mes`, `magneet` | precisietrimmer, folieblad, mesje, magnetische koppen |
| `neustrimmer`, `baard`, `hoofd`, `lichaam`, `kapper` | per zone of toepassing |
| `tas`, `reis`, `doos`, `cadeau`, `medaille` | toilettas, op reis, complete set, cadeau, kwaliteit |
| `vink` | standaard, ook bij een onbekende sleutel |

Een nieuw icoon toevoegen: tekenen in `scripts/voordeel-iconen.py` en het
snippet opnieuw laten bouwen (gebruik staat bovenin het script). Het script
schrijft ook een proefvel met alle iconen naast elkaar.

### Het intekenen

Elk icoon is opgebouwd uit `<path pathLength="1">`. Daardoor is elke lijn,
hoe lang ook, voor de CSS precies 1 lang, en kan `stroke-dashoffset` hem van
1 naar 0 laten lopen: het icoon tekent zichzelf.

* Een klein script in het koopvak zet de klasse `ws-vd-wacht` op de lijst en
  wacht tot een derde ervan in beeld is (`IntersectionObserver`). Dan komt
  `ws-in` erbij en begint het tekenen: 0,9 s per icoon, elk kaartje 0,12 s na
  het vorige. De tekst schuift tegelijk zacht in.
* **Zonder JavaScript, of bij *minder beweging*, staat alles meteen getekend.**
  De iconen zijn alleen onzichtbaar zolang `ws-vd-wacht` erop staat, en die
  zet het script alleen als het ook het tekenen kan starten.

### Uploaden en vullen: wat niet mocht

* **Een GraphQL-document mag maximaal 16.384 tekens zijn.** Vertalingen voor
  twintig metaobjecten in één keer passen er niet in. De teksten gaan daarom
  in variabelen (`$t0`, `$t1`, …), die tellen niet mee.
* **`bulkOperationRunMutation` wordt door de MCP geweigerd.** In plaats
  daarvan: één verzoek met tot 25 mutaties met een alias (`a0:`, `a1:`, …).

## Pil en prijskaartje weg

* **De pil boven de titel** (productnaam links, *Herfst sale* rechts) staat
  uit. Hij zit nog in de code achter de instelling *Pil tonen* in het koopvak
  (standaard uit), zodat hij zonder code terug kan.
* **Het prijskaartje in het bespaarlabel** is weg; het label is nu alleen
  *Je bespaart 30%*, met gelijke binnenruimte links en rechts. Op de telefoon
  stond het kaartje al uit, dus daar verandert niets aan de breedte.

## Modelkeuze: een keuzelijst in plaats van tegels

De twee modellen onder de Herfst Sale-balk zagen eruit als de voordeelkaartjes
erboven: twee witte tegels naast elkaar, een klein beeld, een vette kop en een
grijze regel. Daardoor las de keuze als nog meer uitleg. Nu is het een lijst
waaruit je kiest:

* **Een kop erboven**, *Kies je model* (instelling *Kop boven de modelkeuze*,
  vertaald in en/de/fr).
* **Onder elkaar**, elk model op één regel: keuzerondje, productbeeld, naam
  met ondertitel, en rechts **de prijs** met de streepprijs eronder. Prijs en
  rondje staan nergens anders in het koopvak; daaraan zie je dat het een keuze
  is. De goedkoopste staat boven.
* **Het model dat je bekijkt** heeft een gevuld goud rondje, een goudrand en
  een warm wit vlak. Het andere model heeft geen vlak, alleen een haarlijn.
  Het label *Je bekijkt nu* is daarmee overbodig; het wordt alleen nog
  voorgelezen.
* **Meest gekozen** staat als goud label achter de naam, en alleen bij het
  andere model. In de gegevens (`compare_info.is_popuplar`) staan beide modellen
  op populair, dus anders stond het label er twee keer.
* Onder 360 px valt het productbeeld weg, anders liep *Shave Package Ultimate*
  over drie regels.
* De link *Vergelijk de opties* eronder is gebleven.

Bij het uploaden van het sjabloon heeft Shopify een uitgeschakeld appblok van
Section Store (*product add-ons*, toilettas en travelbag) uit `product.json`
gehaald. Het stond uit en deed niets; het sjabloon in de repo is gelijk
getrokken met v7.

## Add-ons onder de knop: *Maak het compleet*

Onder *In winkelwagen*, na de leverregel en de betaalmethoden, staan twee à
drie accessoires, elk met een eigen knop **Toevoegen**. Die zet het accessoire
meteen in de winkelwagen; daarna staat er een vinkje en *Toegevoegd*. De
lade gaat **niet** open, de klant blijft op de pagina. De lade wordt op de
achtergrond ververst, inclusief het aantal in de menubalk en de cadeaus. Naam en beeld linken naar de pagina van het accessoire.

* **Eerst stond het blok boven de knop**, als vinkjes die meegingen met het
  apparaat. Daardoor zakte *In winkelwagen* zo'n 270 px de pagina in. Op
  verzoek staat het nu eronder. Een vinkje onder de knop heeft geen zin (wie
  van boven naar beneden leest, heeft dan al op de knop gedrukt), dus elk
  accessoire is nu zelf toe te voegen, voor of na het apparaat.
* `base.js` is daarvoor niet meer aangepast: de wijziging voor de vinkjes is
  teruggedraaid naar de v7-versie. Het blok heeft een eigen klein script dat
  `cart/add.js` aanroept en de lade op de achtergrond ververst.
* **Welke accessoires.** Uit het productveld `custom.pdp_addons`
  (*PDP add-ons*, lijst van producten). Is dat leeg, dan uit
  `custom.cart_upsell`, dezelfde lijst die de winkelwagenlade al gebruikt.
  Maximaal drie (instelling *Hoeveel maximaal*). Overgeslagen: niet
  leverbaar, het product zelf, en zolang de cadeaus aan staan alles uit
  *upsell_uitsluiten* (de washbag, die je vanaf een bedrag gratis krijgt).
* **De regel onder de naam** is de kop van het eerste voordeel van dat
  accessoire (`custom.voordelen`). Zonder voordelen alleen de naam.
* De knop is omlijnd in brons en wordt pas gevuld na toevoegen, zodat hij niet
  concurreert met de gouden *In winkelwagen*. Onder 390 px staat alleen het
  plusje; de voorleesnaam blijft *Toevoegen: [naam]*.
* Kop en knopteksten vertaald in en/de/fr.

### Wat klanten nu al samen kopen (7–25 oktober, 250 orders)

| Apparaat | Orders | Meest meegekocht |
|---|---|---|
| Flex Guard 3-in-1 | 39 | mesje 9, Hard Case 8, Washbag 8 |
| Groom Guard PRO | 33 | mesje 3, Hard Case 1 |
| Barber Bro 2.0 | 21 | Neustrimmer Ultimate 3 |
| The Gentleman Shaver | 10 | scheerkop 4 |

Bij de Flex Guard koopt bijna een kwart een extra mesje mee, bij de Groom
Guard PRO één op de elf. Het mesje staat daarom bij de Groom Guard PRO
bovenaan. De Shave Package-orders (Groom Guard, foil shaver, neustrimmer,
tassen en mesje samen) zijn pakketten en niet meegeteld.

### PDP add-ons ingevuld (25 oktober)

Op basis van 1.000 orders van 17 augustus tot 25 oktober. Pakketten die als
losse regels binnenkomen zijn eruit gefilterd: de Shave Package (Groom Guard,
foil shaver, neustrimmer en tassen samen) en de Essential Flex Bundel (Flex
Guard, mesje, Hard Case en washbag samen, herkenbaar aan de verlaagde
Flex Guard-prijs; 39 van de 48 keer dat die vier samen voorkwamen). Wat
overblijft, wordt echt los meegekocht:

| Apparaat | Los meegekocht |
|---|---|
| Barber Bro 2.0 / 3.0, Barber Pack 3.0 | Neustrimmer Ultimate 20–24% (volle prijs) |
| Groom Guard PRO | Groom Guard-mesje 12% |
| The Gentleman Shaver | Scheerkop 13% |
| Flex Guard | mesje 5%, Hard Case 1% |

Volgorde per product: eerst het onderdeel dat slijt (mesje, scheerkop), dan
de Hard Case, dan de washbag (wordt overgeslagen zolang hij een cadeau is),
dan een aanvullend apparaat. Uitverkochte accessoires vallen vanzelf weg.

| Product | PDP add-ons |
|---|---|
| Groom Guard PRO, Groom Guard | Groom Guard-mesje, Hard Case, Washbag, Neustrimmer Basic |
| Flex Guard | Flex Guard-mesje, Hard Case, Washbag, Sharpline |
| The Gentleman Shaver | Scheerkop, Hard Case, Washbag, Travelbag |
| Skull Deal 1.0, Head Shaver Deluxe | 7D-scheerkop, Washbag, Travelbag |
| Tondeuse Deluxe, Tondeuse Elegant | Sharpline, Blade Baron |
| The Dial Master | Hard Case |
| Neustrimmer Ultimate | Hard Case, Washbag, Travelbag |
| Barber Bro 1.0–3.0, Barber Pack 1.0–3.0 | Neustrimmer Ultimate, Washbag |

Niet ingevuld (die vallen terug op `cart_upsell`): de rest. De Elegant
4-in-1 wordt vaak samen met de Gentleman Shaver gekocht (30%), maar de
Gentleman staat daar al als upgrade in de pop-up; als add-on zou hij met die
upgrade concurreren. Om dezelfde reden staat de losse foil shaver niet bij de
Groom Guard: Groom Guard plus foil shaver kost meer dan de Groom Guard PRO.

Op 25 oktober op de preview gecontroleerd: Groom Guard PRO toont mesje,
Hard Case en Neustrimmer Basic; Flex Guard mesje en Hard Case (Sharpline is
uitverkocht); Barber Bro 2.0 de Neustrimmer Ultimate; Gentleman Shaver
scheerkop, Hard Case en Travelbag. Tondeuse Deluxe is zelf uitverkocht en
toont dan geen add-ons.

## Uitklapblokken openen geleidelijk

*Omschrijving*, *Specificaties*, *Wat zit er in de doos* en de rest klapten
in één frame open en dicht. Een klein script direct na het blok laat de
hoogte van elk `<details>` meegroeien en krimpen (ongeveer een halve seconde,
gelijkmatig, `cubic-bezier(.4,0,.2,1)`), ook voor de blokjes binnen *Wat zit er
in de doos*. De inhoud komt er zacht bij en vervaagt bij dichtgaan; het plusje
draait in hetzelfde tempo. Zonder JavaScript of bij *minder beweging* werken ze
als gewone uitklapblokken, zonder overgang. Gemeten op 390 px: het eerste blok
groeit van 51 naar 561 px in ongeveer 400 ms.

## Aankondigingsbalk blijft bovenaan staan

De gouden balk (*Herfst Sale tot 40%. – Shop nu → | Nog …*) blijft bij het
scrollen bovenaan staan; de menubalk zet zich er direct onder vast. Dit geldt
voor de hele winkel, niet alleen de productpagina, want de balk zit in de
header-groep.

* `sections/announcement.liquid`: nieuwe instelling *Balk bovenaan
  vastzetten* (standaard aan). De sectie zelf is `position: sticky` (niet de
  balk erin, anders blijft hij niet over de hele pagina staan), z-index 5,
  gelijk aan de header. De header staat later in de pagina en wint dus waar
  ze overlappen, zodat het mobiele menu over de balk valt. Eerst stond hier
  z-index 4; dan schoven de miniaturen en pijlen van de productgalerij over de
  balk (gemeld op de telefoon). De galerij (`.ws-stg`) heeft nu bovendien
  `isolation: isolate`, zodat de z-index van pijlen (5) en miniaturen (4)
  alleen binnen de galerij geldt. Gecontroleerd op 390 px met de miniaturen
  precies onder de balk: overal ligt de balk bovenop.
  Een klein script zet de hoogte van de balk in `--ws-balk-h` (42 px; op een
  smal scherm met twee regels houdt een ResizeObserver dat bij).
* `assets/header.css`: `.header.sticky` staat op `top: var(--ws-balk-h)` in
  plaats van 0, en het megamenu rekent de balk mee in zijn maximale hoogte.
  De overgang op `top` is weg: daardoor schoof de header bij het vastzetten
  eerst over de balk heen.
* Alles wat onder de header blijft hangen telt de balk erbij op: de galerij
  op de productpagina (`ws-pdp-koopvak.css`, `.ws-stg`) en de galerij van het
  oude productsjabloon (`main-product.css`).
* De donkere Trustpilot-balk eronder scrolt gewoon weg, onder de gouden balk
  door.
* Gemeten op 1440 en 390 px: balk 0–42 px op elke scrollhoogte, header vast
  op 42 px zodra je voorbij de balk bent.
* De drie themabestanden stonden nog niet in de repo; de ongewijzigde
  v7-versies zijn eerst apart vastgelegd.
* Niet aangepast: de filterkolom op de collectiepagina (`ws-collectie.css`,
  `top: 24px`) rekende al niet met de header en valt nu ook onder de balk.

## Tekst in de uitklapblokken

De tekst in *Omschrijving*, *Verzending & retour* en *Garantie en proberen*
was groter dan de titels erboven: 16 px tegen 13 px. Het thema zet `p` en `ul`
op 16 px (`base.css`), waardoor de 12,5 px van het blok niet doorkwam. Nu
volgt alles binnen een uitklapblok de maat van het blok (12,5 px, regelhoogte
1,55); `li` kreeg van het thema bovendien regelhoogte 1, ook dat is weg.

*Specificaties* werd met `white-space: pre-line` afgedrukt, terwijl
`metafield_tag` al een `<br>` achter elke regel zet: er stond een lege regel
tussen elk punt, op de telefoon in twee smalle kolommen. Nu is het een echte
lijst: per regel een punt, het getypte bolletje (•, -, *) eraf en een klein
bronzen puntje ervoor. Twee kolommen op de computer, één op de telefoon.
Gemeten op de Shave Package Ultimate: titels 13 px, tekst en specificaties
12,5 px, twaalf punten.

## v7: de nieuwe opmaak, voor elk product hetzelfde

Eén `templates/product.json` voor alle producten. Wat per product verschilt,
komt uit metafields; staat een veld leeg, dan valt het blok weg in plaats van
leeg te tonen. Aan en uit met de instelling *v7* in het koopvak (header
"v7: de nieuwe opmaak"); uit is de oude opmaak, ongewijzigd.

### Boven de vouw: het koopvak (`ws-pdp-koopvak`)

* Titel met de belofte (`hero_promise`) in goud, vinkjes, voorraadregel met
  aftelklok tot 23:59 (op werkdagen), aanbodbalk met aftelklok tot
  `aanbod_eind`.
* **Tiers** ("Kies je aanbieding"): het product zelf plus de upgrades uit
  `custom.upgrade_products` (beschikbaar en duurder, hoogstens `tier_max`).
  Per upgrade wat je erbij krijgt uit `custom.upgrade_extras`
  (`{"<product-id>": ["handle", …]}`), en de cadeaus die bij die prijs horen
  volgens de cadeaudrempels in de thema-instellingen. De keuze zet het
  formulier-id, de totaalprijs, Klarna, de sticky balk en de afsluiter.
  Het script zoekt het formulier pas op bij het kiezen: het formulier staat
  verderop in de pagina dan het script, eerder opzoeken gaf `null` en dan
  ging bij Ultimate toch de PRO de winkelwagen in.
* Zonder upgrades worden de andere modellen uit `custom.compare_products`
  de kaarten, in de volgorde van dat veld (Barber Bro 2.0 naast 3.0, Shave
  Package 3.0 naast Ultimate). "Upgrade naar" en "Voor € extra" staan alleen
  op een duurdere keuze. Een los product zonder andere keuze krijgt één kaart
  zodra zijn prijs een cadeau haalt, zonder kop. Het oude cadeaublok, de
  zwarte modelkeuze en de upgrade-pop-up komen alleen nog als er geen kaart
  is (`toon_tiers`). "Meest gekozen" staat op de duurste kaart die in
  `compare_info` populair is.
* Elke kaart toont wat hij méér heeft dan de goedkoopste kaart, uit
  `custom.upgrade_extras` van die goedkoopste (`{"<id duurdere>": [handles]}`).
  Zo staat bij de Barber Bro 3.0 ook op zijn eigen pagina "+ Neustrimmer
  Essential": dat staat vastgelegd bij de Barber Bro 2.0. Bij upgrades is de
  goedkoopste het product zelf, dus daar verandert niets. De vergelijking
  gebruikt dezelfde regel: zo'n kolom krijgt alle punten van de goedkoopste.
* Add-ons met combikorting uit `custom.combi_korting` (`{"handle": pct}`);
  het percentage moet overeenkomen met een echte automatische korting.
* **Bundels** onderaan de buybox uit `custom.pdp_bundels`; het product zelf
  en producten die al als tier staan vallen weg.

### Onder de vouw: de `ws7-pdp-*` secties

| Sectie | Bron |
|---|---|
| `ws7-pers` (van de homepage) | 12 logoblokken in het sjabloon |
| `ws7-pdp-stappen` | `custom.pdp_stappen` (metaobject `ws_pdp_stappen`) |
| `ws7-pdp-kenmerken` | `image_with_text`-kaarten van het product |
| `ws7-pdp-doos` | `included_box_image`, `included_box`, `custom.kerncijfers` |
| `ws7-pdp-vergelijk` | `custom.compare_products` + `compare_info` |
| `ws-pdp-ugc` (v7 aan) | `ugc_video_list` |
| `ws7-pdp-reviews` | blokken; *Alleen bij* hangt een review aan producten |
| `ws7-pdp-vragen` | `custom.faq` |
| `ws7-pdp-ook` | `pdp_addons`, dan `pdp_bundels`, dan `upgrade_products` |
| `ws7-pdp-afsluiter` | blokken; de knop klikt de echte koopknop |

De vergelijking geeft een upgrade-kaart ook alle punten van het product zelf:
de Ultimate *is* de PRO plus drie dingen, maar de vier voordelen in zijn
`compare_info` noemen alleen de extra's, waardoor de PRO-punten eerst als
"niet inbegrepen" bij de Ultimate stonden.

Gedeelde homepagebestanden (`ws7.css`, `ws7.js`, `ws7-kop`, `ws7-kaart`, …)
worden alleen gebruikt, niet aangepast. Wat op de productpagina anders moet,
staat in `ws7-pdp.css`, dat alleen het koopvak laadt. Voorbeeld: de marges
van `.ws7-pers` en `.ws7-slot` lieten het wit van de pagina doorschijnen;
`.ws7p{display:flow-root}` en `.ws7.ws7-pers{margin-top:0}` lossen dat hier
op zonder de homepage te raken.

### Maximaal 25 secties per sjabloon

Met de negen nieuwe secties kwam `product.json` op 27. De upload gaf geen
fout, de taak was "klaar", en het bestand bleef gewoon het oude. Weggehaald
zijn de acht secties die al vóór v7 uit stonden (oude betaaliconen, UGC-,
Trustpilot-, use-case-, media- en vergelijkingssecties en een lege
app-sectie); ze staan nog in het live thema en in de git-geschiedenis. De
secties die v7 vervangt (belofte, logos, praktijk, reviewwall,
whats_included, featured, faq) staan uit maar staan er nog.

### Vertalen: een standaardwaarde is niet te vertalen

Een instelling die alleen als `default` in het schema staat, verschijnt niet
in de vertaalbare inhoud van het sjabloon en blijft in elke taal Nederlands.
Daarom staan alle v7-teksten van het koopvak expliciet in `product.json`.
Daarna zijn 69 teksten geregistreerd in en, de en fr; de digest is de sha256
van de Nederlandse tekst. Ook vertaald: de metaobjecten `ws_kerncijfer` en
`ws_pdp_stappen`. De eenheden van de aftelklok zijn een instelling
(`klok_eenheden`, "d u m"; en "d h m", de "T h m", fr "j h min").
Het Engelse Trustpilot-cijfer stond nog op 4.4; nu 4.5 zoals in het
Nederlands. Reviewteksten blijven Nederlands: het zijn letterlijke citaten.

De link onder de vragen krijgt zelf het voorvoegsel van taal en markt
(`routes.root_url`, bijvoorbeeld `/en` of `/de-de`), zodat één waarde in
elke markt werkt.

### Extra's zonder los product

Staat er voor een kaart niets in `upgrade_extras`, dan toont hij wat in zijn
`compare_info` staat en niet in die van de goedkoopste, zonder prijs (Barber
Bro 1.0 → 3.0: shaver en neustrimmer; de shaver is niet los te koop). Een
lege lijst in `upgrade_extras` (`{"<id>": []}`) betekent: "heeft alles van de
goedkoopste", zodat de vergelijking die kolom ook alle punten geeft.

### De galerij

De fotobaan heeft binnenruimte (de witte kaart). Een snap-punt lijnt uit op
de rand van de scrollport, niet op de binnenrand; zonder `scroll-padding`
schoof elke foto 10 px op en stak de volgende rechts uit. Nu staat
`scroll-padding-inline` gelijk aan de binnenruimte. Pijlen en miniaturen
rekenen met de gemeten stap tussen twee foto's in plaats van met vaste
12/16 px uit de oude opmaak. De miniaturen staan op elke breedte op één
horizontaal scrollbare rij (desktop zes en een half vak; de actieve schuift
mee in beeld).

### Cadeaus: nooit een cadeau dat niet op voorraad is

Er is geen korting die cadeaus gratis maakt: een cadeau is gratis omdat het
cadeauproduct zelf €0 kost (`gift-…`, type Gift, Unlisted). Die producten
houden geen voorraad bij, dus zonder meer stonden ze altijd "op voorraad".

* Elk cadeauproduct wijst met het metaveld `custom.cadeau_voorraad` naar het
  echte product. Is dat op, dan telt het cadeau als niet op voorraad.
  gift-the-washbag → toiletry-bag, gift-neustrimmer-ultimate →
  wellshave-4-in-1-neustrimmer-ultimate, gift-neustrimmer-ultra →
  neustrimmer-4in1-ultra, gift-neustrimmer-elite → neustrimmer-2in1-elite,
  gift-neustrimmer-basic → wellshave-neustrimmer-basic, gift-travelbag →
  travelbag.
* Per drempel een reservelijst in de thema-instellingen (`gift_1_reserve`,
  `gift_2_reserve`, Cart drawer → Gift 1/2), goedkoop in inkoop eerst. Nu
  voor beide: gift-neustrimmer-basic (inkoop €2,87), dan gift-travelbag
  (€0,50). Die twee zijn hiervoor aangemaakt, in dezelfde opzet als de
  bestaande cadeauproducten.
* Snippet `ws-cadeau` kiest: het cadeauproduct, anders de eerste reserve op
  voorraad, anders niets (dan valt de drempel weg). Cadeau 2 slaat over wat
  cadeau 1 al is. De cadeaubalk in de winkelwagen (`cart-rewards-bar`), het
  automatisch toevoegen en de productpagina gebruiken alle drie deze keuze.
* Ligt er al een cadeau in de winkelwagen dat niet meer gekozen is, dan ruilt
  `syncGifts` (base.js) het om: eerst het oude eruit, dan het nieuwe erin. Is
  er helemaal niets meer, dan gaat het cadeau eruit.
* Wat dit product al als cadeau krijgt (zijn prijs haalt de drempel), staat
  niet ook onder "Maak het compleet".
* Cadeau 2 is `gift-neustrimmer-ultimate` (€0): het gratis exemplaar van wat
  het al was. Het stond op het betaalde product van €29,95.

Getest door de washbag en de Neustrimmer Ultimate tijdelijk aan een
uitverkocht product te koppelen: Barber Bro 3.0 kreeg Neustrimmer Basic en
Travelbag, op de pagina, in de balk en in wat er wordt toegevoegd; een
winkelwagen met de oude washbag werd omgeruild. Daarna teruggezet.

### Nog open
* De Ultimate kost €89,95, net onder de drempel van €90 voor cadeau 2.
* Bij de Ultimate staat de washbag zowel als inhoud als als cadeau.
* `pdp_stappen`, `kerncijfers`, `pdp_bundels` en `combi_korting` zijn gevuld
  voor de Groom Guard PRO en de Groom Guard; andere producten tonen die
  blokken pas als hun velden gevuld zijn.

## De pagina volgt de keuze, ook bij uitverkocht

* Kies je een bundel of upgrade, dan krijgen galerij, miniaturen, naam en
  belofte die van dat product (een `<template>` per kaart, pas geladen bij het
  kiezen). Terug, of een andere variant kiezen, zet alles terug.
* Is het product zelf uitverkocht maar zijn er alternatieven (upgrades of
  `compare_products`), dan staan die als kaart. Het product zelf staat er grijs
  met "Uitverkocht" en is niet te kiezen; het eerste alternatief is gekozen en
  de knop staat aan. Geen alternatief: geen kaarten en nooit een cadeau voor
  een product dat niet te koop is.

## Alle productpagina's nagelopen

62 actieve producten op 1440 en 390 px: geen horizontaal scrollen, nergens
een uitstekende tweede foto, miniaturen overal op één rij, geen JS-fouten.
De enige afwijking was de uitverkochte Tondeuse Deluxe (oud cadeaublok en
zwarte modelkeuze); die is hierboven opgelost.

## Geen cadeau dat al in de bestelling zit

* Metaveld `custom.bevat` (lijst van producten) op een pakket: wat er al in
  zit. Nu: Shave Package Ultimate (washbag, Neustrimmer Advance, Travelbag),
  Essential Flex Bundel (washbag, Hard Case), Skull Deal 2.0 (washbag),
  Skull Deal 3.0 (washbag, Travelbag), Shave Package 3.0 (Neustrimmer
  Advance, Travelbag).
* Zit het cadeau al in de bestelling, dan komt eerst het vervangcadeau uit
  `gift_N_dubbel` (thema-instellingen, Cart drawer → Gift 1/2), anders een
  reserve; nooit iets wat er al in zit. Cadeau 1: `gift-neustrimmer-advance`
  (€0, adviesprijs €24,95, inkoop €3,74, gekoppeld aan de echte Advance).
* De winkelwagen kijkt naar alles wat erin ligt (de producten en hun
  `bevat`), de productpagina per aanbiedingskaart naar dat pakket.
* Uitkomst nu: Essential Flex Bundel en Skull Deal → Neustrimmer Advance;
  Shave Package Ultimate (heeft de Advance al) → Neustrimmer Basic; alleen
  de Flex Guard → Luxe washbag. Getest op de pagina's en in een echte
  preview-winkelwagen.
* `cart-rewards-bar.liquid` en `base.js` worden ook door de homepage-sessie
  aangepast (winkelwagen v7). Mijn regels daarin: het blok `al_in` en de
  parameter `al:` in de cadeaubalk, en `giftVariants` in `syncGifts`.

## Voordelen onder de titel: meer nadruk

De vier voordelen onder de titel (`ul.ws-vinkjes` in `ws-pdp-koopvak`) zijn
het eerste wat je leest na de belofte en vallen nu meer op, zonder druk te worden:

* een gevuld rondje met het merkgoud (`--goud`) en een donker vinkje in plaats
  van alleen een bronzen streepje;
* tekst in inkt (`--ink`) in medium gewicht, 13,5 px in plaats van 12,5 px;
* iets meer ruimte tussen de regels (11 × 20 px).

Een versie met alleen het eerste deel vet ("**Echt glad**, niet kort") is
geprobeerd. Die gaf een ongelijk beeld, omdat de meeste voordelen geen komma
hebben. De snippet `snippets/ws-voordeel-regel.liquid` van die versie wordt niet
meer gebruikt. Hij staat nog in v7, omdat de MCP-koppeling geen themabestanden mag
verwijderen. Je kunt hem verwijderen in de code-editor, en daarna ook hier.

## Metafields opgeruimd (26 oktober 2026)

Ik heb gescand welke metafields het live thema, v6 en v7 echt lezen. Ik telde
alleen code die op een pagina staat en geen commentaar is, plus de dynamische
bronnen in de sjablonen. Tien `custom`-velden werden nergens gelezen. Die zijn
verwijderd, samen met hun 182 waarden:

* product: `upgrade`, `ugc_gallery_id`, `video`, `use_case_cards`,
  `use_case_title`, `compare_table`, `new_inventory_label`, `delivery_returns`
  en `upgrade_details`;
* collectie: `megamenu_image`.

Daarnaast zijn zes metaobjecttypes verwijderd die alleen aan die velden hingen:
Upgrade info, Use Case Card, Compare Table, Compare Table Row, Inventory label
en Upgrade details. Samen waren dat 196 items.

De back-up staat in `backups/metafields-opruimen-2026-10-26.json`, met de
definities, alle waarden en alle metaobjecten. Video's en beelden zelf staan nog
in Files; alleen de koppeling is weg.

Ik heb niets aangeraakt in de namespaces van apps en Shopify (loox, reviews,
shopify, mm-google-shopping, mc-facebook, ecomposer, intelligems, blockify,
addresshero) en ook niet de SEO-velden `global.title_tag` en
`global.description_tag`.

De losse waarden van verwijderde apps zijn daarna ook weggehaald: judgeme,
GEMPAGES, reelUpProductReels, debutify en gp_discount, samen 31 waarden. Geen
thema las ze. De back-up staat in `backups/app-resten-2026-10-26.json`.

## In de doos: nieuw ontwerp

`ws7-pdp-doos` is kaal, zoals bij Balzac. Bovenaan staat de kop, gecentreerd.
Daaronder staan alleen de losse onderdelen (`included_box`): een grote foto
direct op de zandkleurige achtergrond, de naam en maximaal drie regels uitleg,
alles gecentreerd. De doosfoto (`included_box_image`) en het label met het aantal
onderdelen zijn er weer uit; de instelling `teller` is verwijderd uit de sectie
en uit product.json.

* Vier kolommen, of drie als de rijen dan voller zijn (bij 3, 5, 6 en 9
  onderdelen). Een onvolle laatste rij staat in het midden. Tussen 900 en
  1099 px drie kolommen, mobiel twee.
* De achtergrond blijft zand: foto's met een net-niet-witte achtergrond vallen
  daar weg, op wit zie je die randjes.
* De kerncijfers staan, als ze er zijn, in een witte balk onder de onderdelen.

## Witte secties

`.ws7p-wit` (twee stappen, vragen) heeft nu een dubbele klasse:
`.ws7.ws7p-wit{background:#fff}`. ws7.css van de homepage laadt later en zette
`.ws7` op zand, waardoor de zandkleurige kaarten van de twee stappen wegvielen.

## Secties die alleen verschijnen als de inhoud er is

"Twee stappen" (`pdp_stappen`) is alleen ingevuld voor de Groom Guard PRO; de
kerncijfers (`kerncijfers`) voor de Groom Guard en de Groom Guard PRO. Bij alle
andere producten blijven die secties weg.

## Film in plaats van twee stappen

`ws7-pdp-film` (naar Hears) vervangt `ws7-pdp-stappen` in product.json, op
dezelfde plek: direct onder de pers-strook. In een donker vlak staan links de
kop, een korte tekst en de eerste drie voordelen (`custom.voordelen`) met hun
icoon. Rechts loopt de productfilm zonder geluid in een lus en loopt aan de
linkerrand zacht over in het vlak (mask-image). De film start pas als hij in
beeld is en stopt erbuiten; bij "minder beweging" start hij niet vanzelf en
krijg je de knoppen. Mobiel: de film staat boven de tekst (16:9) en de
voordelen staan onder elkaar.

* Data: metaobject `ws_pdp_film` (film, kop, kop_goud, tekst), gekoppeld via
  `custom.pdp_film`. Zonder film blijft de sectie weg.
* Gevuld voor 15 producten, met de films die eerder in het verwijderde veld
  `custom.video` stonden: Groom Guard, Groom Guard PRO, Shave Package 2.0, 3.0
  en Ultimate, Head Shaver Deluxe (ook met extra kop), Skull Deal 2.0 en 3.0,
  neustrimmers Basic, Premium, Advance en Ultimate, Baardtrimmer Supreme en
  Tondeuse Elegant. Kop en tekst zijn vertaald in en, de en fr.
* De tekst in de films zelf is Nederlands, ook op de en-, de- en fr-pagina's.
* `ws7-pdp-stappen` en `custom.pdp_stappen` (alleen gevuld voor de PRO) staan
  niet meer op de pagina; de sectie blijft beschikbaar in de editor.

### Flex Guard: een film zonder tekst, gemonteerd uit losse shots

De Flex Guard had geen film. Uit acht losse shots zonder tekst (Shopify Files)
is een lus van 16,8 s gemonteerd met ffmpeg: zachte overgangen (xfade, 0,6 s)
en het eerste shot nog eens aan het eind, zodat het laatste beeld naadloos op
het eerste aansluit. Geen geluid, H.264 crf 24, faststart, 4,3 MB. In Files als
`gid://shopify/Video/77433854165324`. De film met ingebrande annotaties die ook
is geüpload, is bewust niet gebruikt.

* `film-flex-guard`: "Trimmen, scheren / en neushaar in één." voor de Flex Guard.
* `film-essential-flex-bundel`: dezelfde film, met een kop over de toilettas
  en de hard case, voor de Essential Flex Bundel.
* Beide vertaald in en, de en fr. Omdat er geen tekst in beeld staat, klopt
  deze film in elke taal.

## Wit als basis, zand alleen als accent

De pagina had te veel zand. Nu is wit de grond: `.ws-pdp7`, `.ws7.ws7p`,
`.ws7.ws7-pers` en de UGC-band (`.ws-ugc.ws-ugc--v7`, dubbele klasse omdat
ws-pdp-ugc.css later laadt). Kaarten die eerst los stonden door zand eromheen,
krijgen een dunne rand en een zachte schaduw. Zand blijft alleen als accent:
de iconvakjes van de voordelen, de tegels achter de onderdelen in "In de doos"
en de kerncijfersbalk. "In de doos" zelf blijft een zandvlak, zodat er ritme in
de pagina zit.

### The Gentleman Shaver: de tekst eruit gesneden in plaats van eroverheen

De aangeleverde film (36 s) had ingebrande Nederlandse teksten: in vijf shots
een regel linksonder (y ≈ 72–87 %), in het watershot rechtsboven, plus een
eindtitel. Gemaakt is een lus van 22,8 s zonder die teksten:

* Opening en held in goudlicht: het hele beeld (daar staat geen tekst).
* Waterdruppel, display, koppen, precisietrimmer, opzetstukken: per shot een
  16:9-kader uitgesneden dat de tekstregel mist (bovenste 70 %, voor het
  watershot de onderste 73 %), terug opgeschaald naar 1080p.
* Eindtitel weggelaten; de opening komt aan het eind terug, zodat de lus
  naadloos sluit (PSNR eerste/laatste beeld 35,7 dB).
* Files: `gid://shopify/Video/77434103791948`, metaobject
  `film-gentleman-shaver`, vertaald in en, de en fr.

Waarom niet de tekst gewoon laten staan: op desktop valt het linkerdeel van de
film weg in het donkere vlak, dus de regels zouden half afgesneden zijn; en
op en-, de- en fr-pagina's zou de tekst Nederlands zijn.

## Terug naar om en om: de praktijkkaarten in plaats van de schuifrij

Op verzoek staat `ws-pdp-praktijk` (beeld en tekst om en om) weer op de pagina,
op de plek van `v7_kenmerken`, direct onder de film. Instellingen gelijk aan
de live site: geen kop, tekstvlakken wit (`#FFFFFF`) en heel licht zand
(`#F8F6F2`), merkteken aan. `v7_kenmerken` (de schuifrij "Gemaakt voor de
lastige plekken.") staat uitgeschakeld in product.json en kan in de editor
terug aangezet worden. Beide lezen dezelfde gegevens: `custom.image_with_text`.

### Op de telefoon: een rij om opzij te vegen

Tot 820 px staan de praktijkkaarten niet meer onder elkaar maar in een rij die
je opzij veegt (`.ws-prk-lijst`, scroll-snap). Elke kaart is 84 % breed, zodat
de rand van de volgende in beeld staat; beeld boven, tekst eronder, en de
tekstvlakken rekken mee tot de hoogste kaart. Onder de rij staan stippen (bij
twee of meer kaarten); de actieve stip volgt de kaart in beeld. Video's spelen
alleen als hun kaart in beeld is, net als eerst. Desktop is ongewijzigd: om en
om. Getest op de Essential Flex Bundel (vier kaarten): geen horizontaal
schuiven van de pagina, stippen kloppen tot en met de laatste kaart.

## De bewegende reviewwand terug, upsells erachter

`ws-pdp-reviewwall` staat weer op de pagina, op de plek van `v7_reviews` (die
staat uitgeschakeld): links het Trustpilot-cijfer, rechts twee kolommen reviews
die langs elkaar schuiven (telefoon: twee rijen zijwaarts), met pauzeknop.
Paneel nu `#F8F6F2` in plaats van `#F2EEE7` (minder zand). Direct daaronder
`v7_ook` ("Past goed bij je …", de upsells), en pas daarna de vragen.

Volgorde: … ugc › reviewwall › v7_ook › v7_vragen › apps › v7_afsluiter.

### Reviews per product, en toch altijd een volle wand

Elke review heeft nu een instelling **Alleen bij** (productlijst), overgenomen
van `v7_reviews`, plus de twee Groom Guard PRO-reviews. De wand vult in drie
rondes: eerst reviews over dit product, dan de algemene, en alleen als hij dan
onder de zeven kaarten zit reviews over andere producten (de PRO-reviews staan
achteraan, die noemen te specifieke dingen). Getest:

* Gentleman Shaver: 4 eigen + 3 algemene, geen aanvulling.
* Neustrimmer Basic: 2 eigen + 3 algemene + 2 aanvulling.
* Groom Guard PRO: 3 eigen + 3 algemene + 1 aanvulling.

Reviewteksten blijven Nederlands in elke taal (letterlijke citaten). De twee
verouderde vertalingen met 4,4 (sterrenlabel en scoreregel) staan nu op 4,5.

## Lanceercheck v7 (27 oktober 2026)

Volledige check van v7 tegen live: 460 pagina's (alle producten, collecties,
pagina's, blog, winkelwagen, zoeken, 404) × nl/en/de/fr, browsertests op
desktop en mobiel, de koopflow tot in de checkout, en een vergelijking van alle
themabestanden en app-embeds met het live thema.

### Wat werkt
* Alle pagina's 200 op v7; geen Liquid-fouten van het thema (de enige fout komt
  uit het TikTok-pixelblok en staat live ook).
* Geen JavaScript-fouten uit het thema, geen kapotte afbeeldingen, geen
  horizontaal scrollen (1440 en 390 px).
* Koopflow: in winkelwagen → drawer open → cadeau (The Washbag) komt er vanaf
  €65 vanzelf bij → Afrekenen opent de checkout. Desktop en mobiel.
* Interne links: alleen twee dode links in één blogartikel (bestond al).

### In v7 gerepareerd tijdens de check
* EComposer-secties (quickview, voorspellend zoeken) gelijkgetrokken met live:
  live kreeg op 26 oktober een beveiligingsfix (zoekterm ge-escaped) en eigen
  assets; die stonden niet in v7.
* `locales/de.json` en `fr.json`: 17 nieuwe sleutels van de winkelwagen
  ontbraken; de Duitse en Franse winkelwagen toonde Nederlands.
* Verouderde vertalingen op de productpagina (o.a. "Bestseller" i.p.v. Herfst
  Sale, levertijd zonder "ma t/m vr vóór 23:59") en in de winkelwagen
  (4,4 → 4,5, verzekerde verzending ontbrak) bijgewerkt.
* Collecties: "4,5 out of 5" op de Nederlandse pagina → "uit 5" (en/de/fr:
  out of / von / sur 5).
* Praktijkkaarten, reviewwand en klantvideo's op de productpagina: Montserrat →
  Inter met Inter Tight voor koppen, zoals de rest van v7.
* FAQ-antwoorden met "30 dagen proef" (Shave Package 2.0 en Ultimate,
  Gentleman Shaver, Skull Shaver Deluxe, föhn) → 100 dagen, met vertalingen.
  Dit zijn winkelgegevens, dus ook live meteen goed.

### Niet via de API te doen
* App-embeds **UpPromote** (affiliate) en **Hotjar** staan live aan maar
  ontbreken in v7. Shopify laat app-embeds alleen via de thema-editor aanzetten
  (een upload van settings_data.json met die blokken wordt stil genegeerd).
* De Booster-cookiebanner (ScriptTag) geeft een 404 maar kan alleen door de app
  zelf worden verwijderd.
* Vijf advertorials (loodgieter-naar-scheermerk, gewoonte-uit-loodgietersjaren,
  groom-guard-ballon, ze-zegt-er-niets-van-b, head-shaver-redenen) noemen
  Trustpilot 4,4; groom-guard-ballon ook "958 reviews". Op verzoek blijven
  de advertorials zoals ze zijn.

## Collectiepagina's in v7-stijl

`assets/ws7-collectie.css` is een laag over `ws-collectie.css`. Die laatste
regelt de opbouw, filters, keuzehulp en vergelijking; de nieuwe laag alleen het
uiterlijk. Elke `ws-collectie-*`-sectie laadt hem direct na ws-collectie.css.
ws7.css en de ws7-homepagebestanden zijn niet aangeraakt.

* Inter voor tekst, Inter Tight voor koppen en prijzen; gewicht 500–600 in
  plaats van 800–900. Bovenregels in #9A6A2E met .14em spatiëring.
* Geen zwarte "Bekijk"-knoppen op de kaarten, zoals op de homepage: de hele
  kaart is de link (de naam spant er met ::after overheen). Vergelijk, snel
  bekijken, de foto en de ronde plusknop bij onderdelen liggen erboven.
* De bovenkant ligt op wit; de hero is een afgeronde kaart (26px, mobiel 18px).
* Raster op wit; de kaart zoals `.ws7-kaart`: geen rand maar een ring met
  schaduw, de packshot op een zandvlak met eigen hoeken.
* Labels zoals `.ws7-label`: klein, zwart, 3px afgerond. Het kortingslabel
  (`.ws-spaar` uit het gedeelde ws-spaar.css) is op de collecties zwart in
  plaats van goud; `.wsc` ervoor houdt dat binnen de collecties.
* Keuzehulp en aanbodstrook op zand als accent.
* `ws-collectie-raster` kreeg twee schakelaars, beide standaard uit:
  `eigen_kaartfoto` (de eigen kaartfoto uit het metafield in plaats van de
  packshot) en `stickers` (de ronde bestseller- en herfststicker). Uit toont de
  kaart de packshot en een plat label, zoals op de homepage.
* De actieve zonetegel op mobiel houdt zijn eigen stijl uit ws-collectie.css;
  een carbon achtergrond daarop maakte er een zwart blok van.

Gecontroleerd op desktop en mobiel: bodygroomers, all, bundels, winter-sale.

## Overige punten uit de lanceercheck

Winkelgegevens (dus ook live meteen goed):
* Shave Package 2.0: de specificaties beschreven een ander apparaat; nu die van
  de Groom Guard, met vertalingen.
* Footermenu's in het Nederlands (Veelgestelde vragen, Verzendbeleid,
  Retourbeleid, Privacybeleid, Algemene voorwaarden, Contact, Retourneren;
  Ons verhaal, Blog), met en/de/fr.
* SEO: titels voor ±26 producten zonder titel; Gentleman Shaver, Flex Guard en
  Ultimate bijgewerkt; "30 dagen" → 100 dagen in drie omschrijvingen; Duitse
  en Engelse resten uit twee omschrijvingen gehaald.
* Redirects: `/products/detailtrimmer-sharpline` en een verwijderd
  blogartikel wezen naar "/#…" van een SEO-app; nu naar het product en de blog.

Thema v7:
* Footer: de nieuwsbriefregel was Engels ("By filling in your email…"); nu
  Nederlands met links naar privacybeleid en contact (`sections/footer-group.json`).
* Header en footer volledig vertaald in en/de/fr: aankondigingsbalk (Herfst
  Sale, Trustpilot 4,5, levertijd), megamenu (zones, typen, banners), mobiel
  menu. De oude Engelse vertalingen spraken nog van "Spring Deals" en 4.4.
* Homepage, collecties en pagina's houden voor en/de/fr deels Nederlandse
  tekst: samen ±1.300 unieke zinnen bij ±1% van het verkeer uit DE en vrijwel
  niets uit FR of Engelstalige landen. Niet vertaald; de kop en voet van elke
  pagina zijn dat wel.

Na de Herfst Sale (eindigt 30 oktober) moeten de sale-teksten in de
aankondigingsbalk, het megamenu en het menu-item HERFST SALE worden
vervangen, net als de vertalingen daarvan.

## Film Tondeuse Deluxe

Bron: "Tondeuse Deluxe - cinematic v4 FINAL tekst en logo" (40 s, Shopify Files).
De teksten staan linksonder vanaf y=838; elk shot met tekst is uitgesneden op
1440×810 (bovenkant van het beeld) en teruggeschaald naar 1080p. Eindkaart met
logo niet gebruikt. Lus van 13,5 s: staand in de mist → natte steen → druppel
op goud → druppels op het mes → display → lengtehendel → met opzetkam →
opzetkam op de steen → door het haar → motor → staand in de rook → terug.

* Video `gid://shopify/Video/77452395151692` (tondeuse-deluxe-film-loop.mp4)
* Metaobject `film-tondeuse-deluxe` (3681938309452), gekoppeld via
  `custom.pdp_film` op Tondeuse Deluxe™; kop, gouden kop en tekst vertaald.
* De tekst noemt geen motortype: de video zegt "koolstof motor 9000 RPM", de
  productspecificatie "2838 Brushless motor".

Dezelfde video staat ook op de drie Barber Bro-sets (daar zit de Tondeuse
Deluxe in), elk met een eigen filmblok en tekst die bij de set past, vertaald:
* `film-barber-bro-1-0` (3682006958412): met de precisietrimmer.
* `film-barber-bro-2-0` (3682007023948): met de foil shaver.
* `film-barber-bro-3-0` (3682007056716): met foil shaver en neustrimmer.

## Maak het compleet: onderdelen en accessoires, niets wat al in de set zit

Aanleiding: op de Tondeuse Deluxe stonden de Sharpline en de Blade Baron onder
de knop, terwijl die in de Barber Bro-sets zitten die je erboven kiest.

* `custom.pdp_addons` opnieuw gevuld voor 40 producten: alleen vervangonderdelen
  van het apparaat zelf en de accessoires The Hard Case, The Washbag en
  Travelbag; geen apparaten meer. Per groep:
  Groom Guard (en Body & Nose, Shave Package 3.0) → Groom Guard Blade;
  Groom Guard PRO en Ultimate → Blade en foil-opzetstuk; Flex Guard en
  Flex-line → Flex Guard Blade; Essential Flex → Blade en Trio Pack;
  Head Shaver Deluxe en Skull Deals → 7D Scheerkop; Gentleman → scheerkop;
  vier neustrimmers → neusopzetstuk (nu uitverkocht, dus overgeslagen);
  de rest (baardtrimmers, tondeuses, scheerapparaten, Barber Pack/Bro) →
  alleen de drie accessoires. Live gebruikt dit veld niet; cart_upsell
  (de winkelwagenlade, ook live) is ongemoeid.
* De washbag blijft weg zolang de cadeaus aan staan (upsell_uitsluiten): hij is
  vanaf €65 gratis, en wie hem bij een goedkoper apparaat koopt, gaat over de
  €65 en krijgt hem dan nog eens cadeau.
* Koopvak: elke keuzekaart draagt `data-weg` (het product, alles uit
  custom.bevat en de cadeaus die die prijs haalt). Kies je een kaart, dan
  verdwijnt wat erin zit uit Maak het compleet en schuift de volgende door;
  daarvoor worden er drie rijen meer gemaakt dan er te zien zijn (data-max).
  Op het pakket zelf slaat de lijst custom.bevat ook over.
* `ws7-pdp.css`: verborgen rijen en blok `display:none`; de scheidingslijn
  telt alleen zichtbare rijen.

### Winkelwagenlade: dezelfde regel

* `custom.cart_upsell` (de lade, **ook live**) voor dezelfde 40 producten gelijk
  gezet aan pdp_addons: onderdelen en hard case, washbag, travelbag. Weg zijn de
  safety razors en de apparaten (Blade Baron, Sharpline, Flex Guard, Gentleman,
  Neustrimmer Basic, Tondeuse Elegant, Flex-line Bundel). De oude waarden staan
  in `backups/cart_upsell-voor-2026-10-27.json`. De washbag blijft in beide
  thema's weg via upsell_uitsluiten.
* `snippets/cart-drawer.liquid` (v7): de lade slaat over wat al in de
  winkelwagen ligt of in een pakket daarin zit (custom.bevat). Met een Flex
  Guard en een Hard Case in de wagen biedt hij geen tweede Hard Case meer aan;
  bij de Essential Flex Bundel geen Hard Case (die zit erin).

## Na de livegang (27 oktober): v8 en het Black Friday-thema

Het live thema is niet via de API te beschrijven. Daarom is er
"wellshave/claude-design v8" (209050108236), een kopie van live v7 met deze
twee fixes, klaar om te publiceren. Dezelfde twee staan ook in
"Black Friday 2026 (kopie van v7)" (209034117452).
* `ws7-pdp.css`: de vier vinkjes in het koopvak onder elkaar op elke
  telefoon (grens 419 → 749 px; brede iPhones zijn 430 px).
* Alia (popup "Mystery Korting") blijft aan; alleen het label is aangepast.
  `assets/ws-alia.css`, ingeladen in `layout/theme.liquid`: Alia's brede strook
  rechts midden in beeld (60×202 px over foto en koopvak) wordt een smal donker
  lipje tegen de linkerrand (31×158 px), tekst van onder naar boven, op 74vh,
  zoals bij Hears. Alleen het label wordt geraakt (Alia zet dan `rotate(90deg)`
  op zijn root); de open popup blijft zoals Alia hem maakt.
* Afrekenknop in de winkelwagenlade: wit, gevuld slotje vóór de tekst (het
  pijltje erachter is weg) en "Veilig afrekenen" in plaats van "Afrekenen".
  `cart_drawer.checkout_button_label` in nl/en/de/fr: Veilig afrekenen,
  Secure checkout, Sicher bezahlen, Paiement sécurisé; de geregistreerde
  vertalingen (en/de/fr) zijn bijgewerkt. In v8 en het Black Friday-thema;
  in het BF-thema op zijn eigen cart-drawer (die heeft een cadeauklok extra).
* Hotjar en UpPromote: hun app-embeds staan in het oude thema, maar Shopify
  rendert ze daar al niet meer ("app block path … does not exist"): beide apps
  zijn niet meer geïnstalleerd. Daarom laat Shopify ze ook vallen als ze via de
  API in v8 worden gezet. Hotjar terug = de app opnieuw installeren, of de
  trackingcode met het Hotjar-site-ID in layout/theme.liquid.

## Tweede cadeau (vanaf €90): Neustrimmer 3in1 Platinum (28 oktober)

* Nieuw cadeauproduct `gift-neustrimmer-platinum` (Product 16239487156556):
  kopie van Neustrimmer 3in1 Platinum met dezelfde SKU 8720938021343, prijs €0,
  waarde €29,95, UNLISTED, type Gift, voorraad niet bijgehouden,
  custom.cadeau_voorraad → de echte Platinum (15794293473612).
* settings_data in v8 en het BF-thema: gift_2_product → gift-neustrimmer-platinum,
  gift_2_label → "Neustrimmer Platinum" (en/de/fr: Nose Trimmer Platinum,
  Nasenhaartrimmer Platinum, Tondeuse nez Platinum).
* Getest op beide previews: Barber Bro 2.0 via In winkelwagen → Washbag en
  Platinum komen er voor €0 bij. Het live thema (v7) geeft tot de publicatie
  van v8 nog de Ultimate.

## Pre-order Barber Bro 1.0 / 2.0 / 3.0 met 10% extra (28 oktober)

* Nieuwe productvelden: `custom.preorder_datum` (datum) en `custom.preorder_korting`
  (geheel getal). Op de drie Barber Bro's: 2026-11-09 en 10. Ze staan op
  "doorgaan met verkopen", dus bestellen kan gewoon.
* Snippet `ws-preorder`: geeft "9 november" zolang de datum in de toekomst ligt,
  anders niets. Na 9 november verdwijnt de pre-order dus vanzelf; leeg maken van
  het veld kan ook.
* Koopvak (v8 en BF): de groene leverregel wordt een gouden "Pre-order |
  levering vanaf 9 november", daaronder een bonusstrook "Pre-order nu en krijg 10%
  extra korting, automatisch verrekend bij het afrekenen", de knop en de balk zeggen
  "Pre-order nu", en op elke keuzekaart staat "Pre-order · vanaf 9 november".
  Kiest iemand een kaart (ook de voorgekozen Barber Bro op de uitverkochte Tondeuse
  Deluxe), dan schakelt het script alles mee (data-pre op de kaart).
* De regel gaat als eigenschap mee in winkelwagen en bestelling:
  "Levering: Pre-order, vanaf 9 november". Daarvoor stuurt base.js nu ook de
  `properties[...]` uit het formulier mee (stond er niet in).
* Teksten in product.json (pre_*), vertaald in en/de/fr; Duits krijgt "9. November"
  via pre_datum "[dag]. [maand]".
* De korting zelf: automatische korting "Pre-order Barber Bro: 10% extra"
  (DiscountAutomaticNode/2290792300876), 10% op de drie Barber Bro's, van
  28 okt 12:00 tot 9 nov 00:00, niet stapelbaar met andere product-/orderkortingen,
  wel met verzending. Die werkt meteen, ook in het live thema; de teksten op de
  pagina pas als v8 live staat.
* Getest: Barber Bro 2.0 €109,95 → €98,96 in cart.js, Barber Bro 3.0 €129,95 →
  €116,96 in de lade, eigenschap zichtbaar in de lade, nl/de/fr, BF-thema, en
  Groom Guard Pro ongewijzigd.

## Rustigere actie, grotere totaalprijs (28 oktober)

* Totaalregel ongeveer 20% groter (ws7-pdp.css): prijs 19 → 23px, doorgestreept
  12,5 → 15px, "Totaal" 13 → 15,5px, kortingslabel 10 → 12px. De meelopende balk
  houdt zijn eigen maten.
* Herfst Sale-balk (`.ws-gift`, v8 en BF): geen zwart blok meer maar een regel
  met een dunne rand, tekst in inkt en brons, klok in grijs.
* Black Friday-kaart (`assets/ws-bfb.css`, alleen in het BF-thema): wit met
  dunne rand in plaats van zwart met rondlopende rood-gouden rand; geen glans,
  puls of tikkende seconden meer; deal 32 → 22px in inkt; rood alleen nog in het
  label; klok in kleine zandkleurige vakjes; cadeauvak op zand, "Gratis" groen
  zoals in de keuzekaarten.

## v8 live (28 oktober, 12:00)

* v8 (209050108236) is nu MAIN; v7 (207339848012) staat ongepubliceerd als terugval.
* Gecontroleerd op wellshave.com: homepage, collectie, Barber Bro 3.0 (pre-order,
  "Pre-order nu", totaalprijs 23px, rustige aanbodregel), Groom Guard Pro (gewoon
  "In winkelwagen"), Duits (ab 9. November). Geen JS-fouten. Alia: launcher.js en
  ws-alia.css laden; of het tabje verschijnt bepaalt Alia zelf per bezoeker.
* Het live thema is via de API niet te wijzigen: nieuwe aanpassingen gaan naar een
  kopie (v9) of het Black Friday-thema.

## Fout: dubbele washbag bij pakketten met een washbag (28 oktober) → v9

* Gemeld op live v8: Shave Package Ultimate (washbag zit erin) kreeg in de
  winkelwagen toch de washbag als cadeau, terwijl de pagina de Neustrimmer Basic
  beloofde.
* Oorzaak: base.js `renderContent` ververste de balk (labels, punten) maar liet de
  `[data-gift-tier]`-gegevens staan van de eerste render. Bij een lege winkelwagen
  is cadeau 1 de washbag; de keuze voor het vervangcadeau (ws-cadeau met `al:`)
  kwam dus nooit bij `syncGifts` aan.
* Oplossing: na elke render de `[data-gift-tier]`-scripts vervangen door de nieuwe.
* v9 (209131700556) = kopie van live v8 + deze fix; ook in het BF-thema.
  Getest op v9: Shave Package Ultimate → Neustrimmer Basic; Barber Bro 2.0 →
  washbag + Platinum; Groom Guard Pro → geen cadeau (onder €65).
* BF-thema heeft geen gift_1_dubbel en geen gift_1_reserve: daar krijgt een pakket
  met een washbag geen eerste cadeau (pagina en winkelwagen zijn het wel eens).

## Klant kiest zelf zijn cadeau vanaf €65 (28 oktober, v9)

* Thema-instelling `gift_1_keuze` (De klant kiest zelf uit): washbag, Neustrimmer
  Basic, travelbag. Leeg of één cadeau = geen keuze, alles zoals voorheen.
* De keuze staat als winkelwagenkenmerk `_cadeau_1` (met underscore, dus niet
  zichtbaar in de kassa; het cadeau zelf staat wel als regel in de bestelling).
* `ws-cadeau` krijgt `keuze:`: is de gekozen handle een keuzecadeau, op voorraad en
  niet al in de bestelling, dan wint hij; anders de gewone volgorde (hoofdcadeau,
  vervangcadeau, reserve). Gebruikt door cart-rewards-bar, de keuzekaarten en het
  cadeaublok, dus pagina en winkelwagen blijven gelijk.
* Snippet `ws-cadeau-opties`: de knoppen met foto, naam en van-prijs; met `al:` valt
  weg wat al in de bestelling zit.
* Productpagina: "Wijzig" naast het cadeau van €65 op elke keuzekaart (alleen als er
  voor dat pakket twee of meer opties over zijn). De lijst klapt onder de kaart open;
  kiezen werkt alle kaarten bij, zet het kenmerk en ververst de lade. "Maak het
  compleet" laat het gekozen cadeau weg (data-weg1).
* Lade: "Wijzig" onder het cadeau, met de opties die voor deze winkelwagen kunnen;
  kiezen wisselt het cadeau meteen om (syncGifts).
* Script in base.js (Cadeau kiezen), opmaak in ws7-pdp.css en `ws-cadkeuze.css`
  (lade). Teksten: koopvak `cad_wijzig`, `cad_kies_kop`; locales
  `cart_drawer.gift_change`, `cart_drawer.gift_choose`; nl/en/de/fr.
* Getest op v9: Barber Bro 2.0 → Wijzig → Neustrimmer Basic → in winkelwagen komen
  Basic + Platinum; in de lade gewisseld naar travelbag → travelbag + Platinum.
  Shave Package Ultimate: washbag en travelbag zitten erin, dus geen Wijzig, cadeau
  Neustrimmer Basic.
* Nog niet in het BF-thema (eigen koopvak en lade van de andere chat).

### Keuzelijst in plaats van "Wijzig" (28 oktober)

* Het cadeau van €65 is op de keuzekaarten een keuzevak: wit met een dunne gouden
  rand en een pijltje, het voorgekozen cadeau erin, eronder in brons
  "Kies zelf je cadeau · gratis vanaf €65" (`cad_kies_regel`). De hele regel is
  klikbaar (`.ws-tx-dd`); de lijst klapt er direct onder open met per cadeau foto,
  naam, doorgestreepte prijs en een groen "Gratis"-label; de gekozen rij is
  lichtgoud. Onderaan "*Je cadeau komt vanzelf in je winkelwagen" (`cad_kies_voet`).
  Klik ernaast of Escape sluit de lijst.
* Lade: label "Cadeau naar keuze vanaf €65" (`gift_from_choice`) en eronder een
  keuzevak "Kies een ander cadeau" met dezelfde lijst (`gift_change`, `gift_free`).
* Zonder keuzekaarten: knop "Kies je cadeau" onder het cadeau (`cad_wijzig`).
