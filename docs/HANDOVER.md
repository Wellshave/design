# Overdracht — Wellshave Flex Guard™ 3-in-1

Alles om in een nieuwe chat verder te bouwen. Opgemaakte versie:
`docs/handover.html`.

---

## 1. Lees dit eerst — de pagina volgt de merklaag niet

De pagina is gebouwd naar de briefing "near-black, één verzadigd accent, zwaar
display-font". Die botst met `.claude/skills/sanwarwala-landing-pages/references/wellshave-merklaag.md`,
die pas ná het bouwen op `main` landde (`0d10f26`, `79d917e`, `64902c4`) en
expliciet geldt voor productpagina's.

| Onderdeel | Merklaag op main | Deze pagina |
|---|---|---|
| Grond | zand `#F5F1EA`, wit, carbon `#191816` | near-black `#07080A` |
| Accent | brons `#BC813E` / goud `#F5D18A`, altijd verloop | effen goud `#FFBE2E` |
| Typografie | uitsluitend Montserrat 400–900 | Anton + IBM Plex Mono + Inter |
| Koppen | tweeslags `.duo`, tweede regel in verloop | één regel, Anton |
| Knoppen | pillen, `border-radius:100px` | rechthoekig, radius 0 |
| Radius | 12 / 18 / 26px | 0 overal |
| Rail | 1140px | 1440px |
| Startpunt | `references/startbestand.html` | vanaf nul gebouwd |

**Advies:** je hoeft niet te kiezen. De merklaag staat donkere secties toe
("carbon of `--grad-dark` waar het serieus wordt"). Bouw dus op zand vanuit het
startbestand en houd de filmische blokken — scroll-hero, 360°-viewer, macro —
als donkere secties daarbinnen. Montserrat, pillen, het tweeslags-kopapparaat
en de radiusschaal neem je wél volledig over.

---

## 2. Wat er ligt

- **Code** — branch `claude/wellshave-sentinel-pro-site-5dm277`, map `site/`.
  Losse `index.html` / `styles.css` / `app.js`. Geen build, geen dependencies.
- **Media** — 2 productbeelden, 3 clips (MP4 + WebM), 72 spinframes. 18 MB.
- **Test** — `verify.mjs`, 30 Playwright-asserties.
- **Live** — https://wellshave-sentinel-pro.netlify.app

---

## 3. De interacties, en waar ze stukgaan

**Scroll-scrub hero.** `video.currentTime = voortgang × duur`, geëased via rAF,
sticky stage in een 420vh sectie.
- De video kan `loadedmetadata` vuren vóórdat je listener hangt → scrub blijft
  dood. Check ook `readyState >= 1` bij init.
- Zonder all-intra encoding (`keyint=1`) springt het beeld naar keyframes.

**360°-sleepviewer.** 72 JPEG's op canvas, autodraai tot de eerste aanraking.
- Ga er niet vanuit dat de clip precies één omwenteling is. Meten: frame 240 gaf
  0,75 gemiddeld absoluut verschil tegen frame 0, tegenover 5,41 halverwege.

**Koopblokkade.** Niets voorgeselecteerd; toevoegen weigert zichtbaar tot er een
bundel gekozen is. Knop schudt én er verschijnt tekst — alleen schudden leest
als een bug, alleen tekst wordt gemist.

**Codecs.** Chromium zonder propriëtaire codecs speelt geen H.264; de video
laadt dan niet en de scrub lijkt kapot. Elke clip staat er dubbel op, MP4 en
WebM/VP9, met twee `<source>`-tags. Houd dat zo.

---

## 4. Harde data (uit `products.json`, niet overgetypt)

| Product | Handle | Prijs | Van | Variant-ID |
|---|---|---|---|---|
| Flex Guard™ 3-in-1 | `wellshave-flex-guard™` | €54,95 | €85,65 | 55880465580364 |
| Essential Flex Bundel | `essential-flex-bundel` | €79,95 | €133,25 | 56588785746252 |
| Flex-line Bundel | `body-beard-kit` | €89,95 | €156,60 | 56569863864652 |

Alle drie `available: true` — daarom staan er géén nep-uitverkochte opties op de
pagina, ook al vroeg de oorspronkelijke briefing daarom.

De **Flex-line Bundel staat nog niet op de pagina**. Die bestaat wel (Detailtrimmer
Sharpline + de 3-in-1). Niet toegevoegd omdat er nog geen beeld van is.

Specs: 7000 tpm, 90 min gebruik, 800 mAh, IPX7, 100 dagen proef, 2 jaar
garantie, 4,5/5 uit 800+ reviews. Geen cijfer gebruiken dat hier niet in staat.

---

## 5. Naar Shopify

- Wordt een **custom Liquid-sectie** met `schema`, niet een geüploade HTML.
- **De bundels zijn losse producten, geen varianten.** Belangrijkste val: geen
  enkele variantkiezer. Toevoegen via `POST /cart/add.js` met de variant-ID.
- **Media in Files, niet Assets** — verwijs naar `cdn.shopify.com`.
- **72 frames = 72 requests.** Lui laden, of op mobiel terugvallen op 36.
- **Prijzen uit Liquid**, niet uit `app.js`, anders lopen ze uit de pas bij acties.

```js
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items: [{ id: gekozenVariantId, quantity: 1 }] })
})
```

---

## 6. Beeld

De packshot uit de Drive-map "Flex Guard Content" ging als referentie naar
GPT Image 2 → hero op zwarte spiegelvloer. Dat hero-job-ID ging als
`start_image` naar alle drie de Seedance 2.5-clips (`omni_reference`, 720p,
16:9, zonder audio), dus het bewegende beeld is hetzelfde object als de stills.
De bundelfoto komt uit diezelfde hero. Alles hangt aan één hero-ID: vervang die
en de hele keten draait opnieuw.
