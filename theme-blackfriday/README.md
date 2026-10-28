# Black Friday-thema 2026 (kopie van v9)

Shopify-thema 209168925004, "Black Friday 2026 (kopie van v9)". Gemaakt op
28 oktober 2026 als kopie van v9 (209131700556), met daarover de Black
Friday-aanpassingen uit het eerste BF-thema (209034117452, "kopie van v7").
Het oude BF-thema blijft staan; dit thema vervangt het. Publiceren doe je zelf.

Deze map bevat alleen de bestanden die in het BF-thema anders zijn dan in
`theme/` (v9). Alle andere bestanden zijn gelijk aan `theme/`.

## Overgenomen uit het oude BF-thema

* `assets/ws-pdp-koopvak.css`, `assets/ws-spaar.css`
* `sections/header-group.json` (menu en aankondigingsbalk met Black Friday)
* `sections/ws-collectie-kop.liquid`, `sections/ws7-banners.liquid`,
  `sections/ws7-hero.liquid` (de BF-versies van die secties)
* `templates/collection.bundels.json`, `templates/collection.sale.json`

## Samengevoegd: v9 + BF

* `layout/theme.liquid`: body-class `ws-bf`.
* `config/settings_schema.json`, `config/settings_data.json`: de BF-instellingen
  (`gift_eind` 27 november, `gift_klok_tekst`) plus alles uit v9 (cadeaukeuze
  `gift_1_keuze`, reserves, vervangers). Alia staat aan (stond in het oude
  BF-thema uit).
* `sections/ws-pdp-koopvak.liquid`: de witte Black Friday-kaart met klok en
  cadeaus, plus alles uit v9 (pre-order, keuzelijst voor het cadeau, Klarna-kader,
  zekerheden met vinkjes, blauw vinkje). De klok op de kaart toont dagen/uur/min/sec
  in de taal van de pagina.
* `snippets/cart-drawer.liquid`, `snippets/cart-rewards-bar.liquid`: de
  cadeauklok uit BF en de cadeaukeuze uit v9. Klok: "u" in het Nederlands, "h" in
  en/de/fr; dagen "j" in het Frans.
* `sections/announcement.liquid`: BF-versie met aftelklok, eenheden per taal.
* `snippets/ws-cadeau.liquid`, `snippets/ws-cadeau-opties.liquid`: de BF-regel
  "nooit twee neustrimmers" (cadeau 2 is de Neustrimmer Platinum) geldt ook voor
  de keuze. Daarom kies je bij €65 hier tussen de washbag en de travelbag; de
  Neustrimmer Basic valt weg, ook als iemand hem via het winkelwagenkenmerk
  probeert te kiezen. Gevolg (zoals in het oude BF-thema): de Shave Package
  Ultimate, met washbag en travelbag al in de doos, krijgt bij €65 geen cadeau.
* `templates/index.json`: de BF-homepage.
* `templates/product.json`: v9 met de BF-teksten (`aanbod_eind` 30 november,
  `cad_kies_regel` "Kies zelf je cadeau · gratis vanaf [bedrag], t/m Black Friday").

## Vertalingen (en/de/fr)

Opnieuw vertaald in dit thema: de Black Friday-teksten in menu en
aankondigingsbalk (stonden in beide BF-thema's nog op "Autumn Sale") en op de
productpagina (BF-kaart, cadeauregels, `pil_z`, `tier_cadeau_vanaf`,
`cad_kies_regel`). De homepage en de collectiepagina's bundels en sale zijn in
geen enkel thema vertaald (ook live niet); daar zien en/de/fr Nederlands.
