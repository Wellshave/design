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

**Zorg dat elk matchpaneel precies één combinatie wint.** Wint een apparaat
niets, dan staat het er voor de vorm bij — dat is een bevinding over de
collectie, geen reden om een vraag te verzinnen.

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
2. **Templates koppelen aan collecties.** In de theme-editor stel je per
   collectie het template in. Dat is een instelling op de collectie zélf en werkt
   door in álle thema's, dus die zet je pas om als het ontwerp live mag:

   | Collectie | Template |
   |---|---|
   | `bodygroomers` | `zone-lichaam` |
   | `zone-gezicht` | `zone-gezicht` |
   | `zone-hoofd` | `zone-hoofd` |
   | `neustrimmers` | `zone-neus` |
   | `all` | `overzicht` |
   | `baardtrimmers` · `scheerapparaten` · `tondeuses` · `safetyrazors-scheren-scheermes` | `type-…` |

3. **Het menu.** "Shop Alles" gaat van negen productcategorieën naar vier zones,
   plus Bundels, Accessoires en Ladyshaves. Doe dat **pas na publiceren**: het menu
   is één menu voor alle thema's, dus zolang het live thema het oude
   collectietemplate gebruikt, wijzen die links naar pagina's zonder dit ontwerp.

4. **Eén product dat een bezoeker wél ziet staan.** `vervanging-neustrimmer-opzetstuk`
   is actief met voorraad 0 en staat dus met een koopknop in `/collections/all`.
   Op concept zetten of bijbestellen — dat is een keuze over het assortiment, geen
   ontwerpkeuze.

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
