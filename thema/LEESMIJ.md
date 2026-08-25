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

## De tekening in blok 3

De uitlegsectie heeft een `tekening`-veld voor een SVG. Dat veld is **alleen voor
een mechanisme** — een doorsnede van een scheerkop, een blad, een trimmerkam.
Lichaam, gezicht en hoofd hadden zo'n tekening ook, en die zijn eruit: een met de
hand getekende mens leest als slordig zodra de anatomie niet perfect is, en dat
straalt af op een pagina die het juist van geloofwaardigheid moet hebben. Er is
niets voor in de plaats gekomen — ook geen AI-foto van een persoon, want die
ondergraaft hetzelfde argument een stap verder; de zones staan bovenaan al als
echte foto's.

Laat het veld leeg als er geen mechanisme uit te leggen valt. De sectie krijgt dan
`.cat.solo` en de tekst wordt één brede kolom van zo'n 70 tekens per regel. Zo
staan `collection.overzicht.json` en `collection.zone-hoofd.json` er nu bij;
gezicht, neus en lichaam houden hun doorsnede.

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
