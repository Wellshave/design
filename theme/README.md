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

* `theme/sections/*.liquid` — de elf secties, één bestand per blok.
* `theme/assets/ws-*.css` — het stijlblad per sectie. Alleen blok 12 heeft zijn
  CSS in een `{% stylesheet %}`-blok in de sectie zelf.
* `theme/snippets/ws-vanaf.liquid` — de laagste prijs uit een collectie; een
  collectie heeft zelf geen `price_min`.
* `theme/templates/index.json` — de opbouw van de homepage: welke secties in
  welke volgorde, met hun instellingen en blokken.

De repo en het thema zijn nu gelijk. Haal een bestand op met een
`theme(id).files`-query voor je het hier aanpast, want de thema-editor kan het
intussen veranderd hebben. Let op: de CSS die de winkel uitserveert is
geminificeerd — die is geen bron, de commentaren staan er niet meer in.

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
| 1 — hero | `ws-hero` | staat erin, desktop en mobiel gecontroleerd |
| 2 — zonder risico | `ws-belofte` | staat erin, prijs/voorraad live uit het product, mobiel gecontroleerd |
| 3 — bestsellers | `ws-bestsellers` | staat erin, prijzen live uit de producten, mobiel gecontroleerd |
| 4 — upgradetijdlijn | `ws-tijdlijn` | staat erin, carrousel werkt, mobiel gecontroleerd |
| 5 — zonekiezer | `ws-zonekiezer` | staat erin, desktop en mobiel gecontroleerd |
| 6 — koopblok | `ws-koopblok` | staat erin, koopknop getest, mobiel gecontroleerd |
| 7 — proposities | `ws-proposities` | staat erin, desktop en mobiel gecontroleerd |
| 8 — zonerooster | `ws-zonerooster` | staat erin, desktop en mobiel gecontroleerd |
| 9 — de familie (UGC) | `ws-familie` | staat erin, video's zelf in te vullen, mobiel gecontroleerd |
| 11 — goed geregeld | `ws-garantie` | staat erin, desktop en mobiel gecontroleerd |
| 12 — de afsluiter | `ws-afsluiter` | staat erin, desktop en mobiel gecontroleerd |

Alle elf blokken zijn op 390 pixels met eigen ogen nagelopen. Wat daar nog
misstond is gerepareerd:

* **Blok 7 en 8 stonden mobiel in vier smalle kolommen.** Het aantal kolommen
  stond als `style`-attribuut op het element, en een inline stijl wint van elke
  media query. Het gaat nu via `--ws-kol`, die de media query wél kan
  overschrijven.
* **Het monogram in blok 3 stond mobiel permanent op de achtergrond.** Het was
  bedoeld als hover-detail, maar op een telefoon is er geen hover. Op mobiel is
  het weg, op desktop werkt de hover als vanouds.
* **De vier zekerheden in blok 11 hingen half buiten beeld.** Een veegbare rij
  van 58% brede kaarten knipte de tweede kaart middenin een woord af. Ze staan
  nu twee bij twee.

## Beelden

Alle beelden uit `audits/assets` staan als bestand in Shopify onder de naam
`ws-…`. Ze gaan er met `stagedUploadsCreate` + `fileCreate` in; de bytes lopen
via curl rechtstreeks van schijf naar Shopify.

## Wat opviel in de winkel

* **De prijsopmaak van de winkel heeft geen €-teken.** `moneyFormat` staat op
  `{{amount_with_comma_separator}}`, dus overal op de site staat `79,95` en niet
  `€79,95`. Onze secties volgen dat, zodat ze niet uit de toon vallen. Wordt de
  instelling aangepast, dan komt het teken er vanzelf overal bij.
* **De naam van de klantenservicemedewerker is uit blok 2 gehaald**; daar staat
  nu "ons eigen team".
