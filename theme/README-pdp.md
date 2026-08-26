# Wellshave — productpagina in het thema

De homepage staat beschreven in `theme/README.md` (tak `claude/homepage-analysis-redesign-u38dwu`).
Dit bestand gaat over de productpagina.

## Waar het staat

| | |
|---|---|
| Live thema | `wellshave-redesign/live` — **niet aankomen**, schrijven is aan de API-kant geblokkeerd |
| Testthema | `wellshave/claude-design` (id 204178161996) |
| Voorbeeld | https://wellshave.com/products/groom-guard-pro?view=ws-pdp&preview_theme_id=204178161996 |

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
* **Twee typefouten staan live in `included_box`.** De scheerkop heet
  `Scheerkoop 7D` (2062199554380) en bij de Skull Deals `2x Scheerkoop 7D`
  (3067926511948); de Tondeuse Deluxe heeft een item `Tonduese`
  (2062996799820). Die namen staan in de dropdown &laquo;wat zit er in de doos&raquo;
  op de productpagina, ook in het live thema, en `Tonduese` zit ook in de doos
  van elke Barber Bro. Niet aangeraakt: het is live
  klantcopy buiten de opdracht. Verbeteren betekent ook de en / de / fr
  opnieuw registreren.
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
* **De prijsopmaak van de winkel heeft geen €-teken** (`moneyFormat` staat op
  `{{amount_with_comma_separator}}`). De sectie volgt de winkel, dus er staat
  `59,95`. Wordt de instelling aangepast, dan komt het teken er overal bij.
* **Blok 02 (de geruststrook) en blok 07 (maak het compleet) hebben nog geen
  sectie.** In het voorbeeldsjabloon staan ze daarom niet.
* De secties onder de vouw staan in `product.ws-pdp.json` met lege instellingen,
  dus met hun eigen standaardwaarden. Ze zijn nog niet ingericht.
