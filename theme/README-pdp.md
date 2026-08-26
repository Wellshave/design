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
| Vier nieuwe `compare_info`-invoeren | `neustrimmer-essential`, `-elite`, `-platinum` en `-ultra` bestonden niet, dus daar deed de vergelijkingsknop niets. Aangemaakt met dezelfde opzet en gekoppeld via `custom.compare_info`; `custom.compare_products` zet elke pagina naast de 4in1 Ultra, en de Ultra naast de Platinum. **Dit is zichtbaar op de live site**: die vier productpagina&rsquo;s hadden geen vergelijkblok en hebben dat nu wel. Terugdraaien is beide metafields daar weer leegmaken. |
| `not_an_upgrade` op de definitie `compare_info` | Een duurder model erft in de vergelijkingstabel nu automatisch alles van een goedkopere kolom &mdash; anders is het geen upgrade. Dit vinkje is de uitzondering, voor rijen die een gemeten waarde zijn. Aangezet op `tondeuse-deluxe`. Verving `includes_previous`, dat de omgekeerde standaard had en dus op elk nieuw product opnieuw aangezet moest worden. |
| `Pro` &rarr; `PRO` op `groom-guard-pro` | `product_title` en `toggle_title` van dat metaobject schreven `Groom Guard&trade; Pro`, terwijl `popup_title` en de producttitel zelf `PRO` schrijven. De tabelkop en de knoppen in de pop-up lezen `toggle_title`, dus daar stond &laquo;Pro&raquo;. Nu overal PRO. |
| `popup_decision` op de definitie `compare_info` | De beslisregel onder de tabel. Per product &eacute;&eacute;n korte vraag; het antwoord is de naam van dat product. Gevuld voor de Groom Guards en de vier neustrimmers. Leeg bij alle producten betekent: geen beslisregel. |
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
* **De prijsopmaak van de winkel heeft geen €-teken** (`moneyFormat` staat op
  `{{amount_with_comma_separator}}`). De sectie volgt de winkel, dus er staat
  `59,95`. Wordt de instelling aangepast, dan komt het teken er overal bij.
* **Blok 02 (de geruststrook) en blok 07 (maak het compleet) hebben nog geen
  sectie.** In het voorbeeldsjabloon staan ze daarom niet.
* De secties onder de vouw staan in `product.ws-pdp.json` met lege instellingen,
  dus met hun eigen standaardwaarden. Ze zijn nog niet ingericht.
