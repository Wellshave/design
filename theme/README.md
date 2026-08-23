# Wellshave — homepage in het thema

Werkwijze en stand van zaken voor het live zetten van de ontworpen homepage.

## Waar het staat

| | |
|---|---|
| Live thema | `wellshave-redesign/live` — **niet aankomen** |
| Testthema | `wellshave/homepage-test` (id 204178161996), duplicaat van live |
| Preview | https://wellshave.com/?preview_theme_id=204178161996 |

Schrijven naar het live thema is aan de API-kant geblokkeerd; alle bestanden
gaan alleen naar het duplicaat.

## Wat hier in de repo staat

* `theme/sections/*.liquid` — de secties, één bestand per blok, met de CSS in
  een `{% stylesheet %}`-blok eronder. Dit is de bron; wat in Shopify staat is
  een kopie ervan.
* `theme/templates/index.json` — de opbouw van de homepage: welke secties in
  welke volgorde, met hun instellingen.

## Afspraken die uit blok 12 zijn gekomen

* **Padding komt uit de sectie-instellingen, niet uit de CSS.** Het thema zet
  `#shopify-section-ID > * { padding-top/bottom }` via `snippets/indent-settings`,
  en dat wint van een klasse. Boven- en ondermarge dus altijd via
  `desk_indent_top` en `mob_indent_top` in `index.json`.
* **Mobiel is een echte media query** (`max-width: 749px`, de grens die het
  thema zelf aanhoudt), niet de `.xx-m`-klasse uit de mockups.
* **Alle teksten zijn instellingen**, zodat ze in de thema-editor aanpasbaar
  zijn. Openstaande vragen uit het ontwerp kunnen zo ingevuld worden zonder
  dat er code aan te pas komt.
* **Elke klasse begint met `ws-`** zodat thema-CSS er niet doorheen lekt.
* **Controleren doe je op de echte pagina**, niet op de mockup:
  `node mirror.mjs "/" uit.png 1440 ".ws-af"` haalt de preview op en maakt er
  een schermafdruk van.

## Stand

| Blok | Sectie | Status |
|---|---|---|
| 12 — de afsluiter | `ws-afsluiter` | staat in het testthema, desktop en mobiel gecontroleerd |
