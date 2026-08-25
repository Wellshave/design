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
| `popup_decision` op de definitie `compare_info` | De beslisregel onder de tabel. Per product &eacute;&eacute;n korte vraag; het antwoord is de naam van dat product. Gevuld voor de Groom Guards en de vier neustrimmers. Leeg bij alle producten betekent: geen beslisregel. |
| Vierde `store_usp`: Morgen in huis | De voetbalk van de pop-up toont wat er in `custom.store_usp` staat, en dat waren er drie. Nieuw metaobject met een icoon in dezelfde stijl als de andere drie (20 bij 20, streek `#BC813E`), toegevoegd aan de lijst op de Groom Guard en de PRO. |

Let op bij die laatste. `custom.store_usp` wordt ook gelezen door het
`store_usp`-blok van `main-product` in het live thema. Op wellshave.com staat er
op die twee producten nu dus een vierde item in de geruststrook. Terugdraaien is
het metafield weer op de oorspronkelijke drie zetten: `1859112894796`
(100 dagen proef), `1859112763724` (2 jaar garantie), `1859112698188`
(gratis verzending).

## Nog open

* **`custom.buybox_quote` is alleen op de Groom Guard PRO gevuld.** Op de andere
  producten valt het citaat terug op de sectie-instelling en staat er dus overal
  hetzelfde. Van de honderd recentste Nederlandse Trustpilot-reviews gaan er vijf
  over een product; waar er geen is, hoort het citaat leeg te blijven &mdash; dan valt
  de kaart weg.
* **De pop-upteksten staan nog niet op elke productfamilie.** `popup_main_title`,
  `popup_lead`, `popup_winst`, `best_for` en `popup_decision` in `compare_info`
  zijn gevuld voor de Groom Guards en de neustrimmers. De families `flex-*`, `shave-package-*`,
  `tondeuse-*` en `head-shaver-*` hebben nog de Engelse `popup_main_title`
  ("Compare ...") en geen lead of winstbalk.
* **De prijsopmaak van de winkel heeft geen €-teken** (`moneyFormat` staat op
  `{{amount_with_comma_separator}}`). De sectie volgt de winkel, dus er staat
  `59,95`. Wordt de instelling aangepast, dan komt het teken er overal bij.
* **Blok 02 (de geruststrook) en blok 07 (maak het compleet) hebben nog geen
  sectie.** In het voorbeeldsjabloon staan ze daarom niet.
* De secties onder de vouw staan in `product.ws-pdp.json` met lege instellingen,
  dus met hun eigen standaardwaarden. Ze zijn nog niet ingericht.
