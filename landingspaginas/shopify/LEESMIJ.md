# Wat er in Shopify staat

Pagina: **7 redenen waarom mannen stoppen met het mesje op hun hoofd**
- URL: https://wellshave.com/pages/head-shaver-redenen
- Handle: `head-shaver-redenen` (ligt vast, advertenties wijzen hierheen)
- Page-ID: `gid://shopify/Page/734968349004`
- Gepubliceerd: 4 september 2026, zichtbaar in de winkel
- Sjabloon: standaard paginasjabloon, dus met themaheader en -footer

## De twee bestanden hier

`ws-listicle-head-shaver-1.css` is de stylesheet zoals die op de CDN staat:
https://cdn.shopify.com/s/files/1/0573/5743/4923/files/ws-listicle-head-shaver-1.css?v=1788540407

Wijzigt de opmaak, upload dan onder een **nieuwe naam** (`-2`, `-3`) en pas de
`<link>` in de body aan. Een bestaande naam overschrijven levert cachegedoe op.

`head-shaver-redenen.body.html` is exact de body van de pagina: de `<link>`
naar die stylesheet, de markup, en het script eronder. Zonder de
ontwikkelnotities, die staan in `../listicle-head-shaver-deluxe.html`.

## Controle na publiceren

Teruggelezen van de live pagina, en geteld:

| | verwacht | live |
|---|---|---|
| secties | 12 | 12 |
| genummerde redenen | 7 | 7 |
| beelden | 13 | 13 |
| pakketkaarten | 4 | 4 |
| winkelwagenknoppen | 5 | 5 |
| Trustpilot-widgets | 2 | 2 |
| reviewcitaten | 6 | 6 |
| FAQ-items | 6 | 6 |
| tabelrijen | 8 | 8 |
| meeschuivende balk | 1 | 1 |

Er is niets stilzwijgend opgeschoond: de `<link>`, de markup en het `<script>`
staan er alle drie nog.

De cascade is daarna lokaal nagespeeld met de echte themabestanden van de live
pagina, op 390 en 1440 breed: geen horizontale overloop, de dubbele themakop is
verborgen, geen extra marge om `.gg-lp`, geen thema-bullets in de eigen lijsten,
en Montserrat laadt. De inhoud staat in de container van het thema, dus de
donkere secties lopen niet tot de schermrand maar tot de containerrand.

## Nog open

De zes reviewcitaten staan met "Geverifieerde koper" in plaats van een naam en
datum. De citaten zelf zijn echt.
