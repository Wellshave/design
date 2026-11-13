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

## Klaar voor livegang (13 november)

* **Automatische korting aangemaakt** in Shopify: "Black Friday 2026: 30% op elk
  2e artikel (goedkoopste)", koop 1 krijg 1 met 30%, op de collectie Alle
  Producten (zonder de €0-cadeaus), zonder maximum per bestelling. Loopt van
  13 november tot en met maandag 30 november 23:59. Bij 2 artikelen krijgt het
  goedkoopste 30%, bij 4 de twee goedkoopste, bij 6 de drie goedkoopste, enz.
  Combineert met andere kortingen (zoals vorig jaar de 50%-actie). Getest met
  een conceptbestelling van 5 artikelen: de twee goedkoopste (€19,95) kregen 30%.
* In de repo gezet wat alleen nog in Shopify stond (29 oktober):
  `sections/ws-bf-tweede.liquid` ("Kies je 2e artikel" in de Black Friday-kaart),
  `assets/ws-bfb.css`, de aanroep in `layout/theme.liquid` en het laatste deel
  van `assets/ws-spaar.css` (menubanner en kortingslabels in rood).
* `config/settings_data.json`: de sectie `ws-bf-tweede` heeft nu eigen
  instellingen. "Accessoires tellen mee" staat aan, gelijk aan de korting in
  Shopify (die geldt voor alle producten). De teksten staan erin zodat ze
  vertaalbaar zijn; en/de/fr zijn vertaald (16 teksten per taal).
* Vergeleken met v9 (live): alle gedeelde bestanden zijn gelijk; pre-order
  (18–21 november) en verwijderbare upsells zitten erin.

## Kies je aanbieding naast elkaar, knop "Bestel nu" (13 november)

* `sections/ws-pdp-koopvak.liquid`: nieuwe instelling `tier_naast` (standaard aan).
  De keuzes staan als smalle kaarten naast elkaar: foto groot en gecentreerd
  bovenaan, rondje linksboven, dan naam, omschrijving, levering, wat erin zit
  en de prijs. De cadeaus staan één keer onder de kaarten (kop `tier_cad_kop`,
  "Gratis bij je bestelling") en volgen de gekozen kaart; de keuzelijst voor het
  cadeau werkt daar zoals voorheen. Drie of meer keuzes op een telefoon: een rij
  die je opzij veegt. De css staat in de sectie zelf, alleen als `tier_naast`
  aan staat, zodat de gedeelde ws7-pdp.css gelijk blijft aan v9.
  Ontwerp: artifact "Kies je aanbieding · Black Friday", voorstel A.
* `templates/product.json`: `pre_knop` "Bestel nu" (was "Pre-order nu"), voor
  alle pre-order producten (Barber Bro, Barber Packs, Sharpline, Tondeuse Deluxe,
  Body & Beard Kit). De leverregel op de kaart blijft. Vertaald: Order now /
  Jetzt bestellen / Commander; de cadeaukop: Free with your order / Gratis zu
  deiner Bestellung / Offert avec ta commande.
* De 2e-artikelkorting combineert niet meer met kortingscodes of andere
  product- en orderkortingen; alleen met verzendkortingen.
* Knop direct onder de prijs (instelling `knop_onder_prijs`, standaard aan):
  Totaal → Bestel nu → "Al 200.000+ bestellingen" → Klarna → vinkjes. Alleen
  css-volgorde (ProductPrice krijgt display: contents); de html en de scripts
  blijven gelijk.
