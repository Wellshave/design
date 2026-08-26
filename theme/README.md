# Wellshave — Over ons in het thema

De Over ons-pagina, gebouwd in dezelfde taal als de homepage-secties uit
PR #2 (`claude/homepage-analysis-redesign-u38dwu`).

## Wat hier staat

| Wat | Waar |
| --- | --- |
| De sectie | `sections/ws-overons.liquid` |
| De opmaak | `assets/ws-overons.css` |
| Het paginasjabloon | `templates/page.ws-overons.json` |
| De markup, één bron | `blokken.mjs` |
| Voorbeeld om naar te kijken | `over-ons.preview.html` (`preview.mjs`) |
| Ontwerpbeeld | `over-ons.artifact.html` (`artifact.mjs`) |
| De merkfotografie | `beeld/` |

De pagina komt in Shopify onder Pagina's → "Over ons", handle `over-ons`,
sjabloon `ws-overons`. Nu leidt `/pages/over-ons` nog om naar de homepage.

## De beelden

In `beeld/` staan de bestanden die het voorbeeld en het ontwerpbeeld inbedden.
Het zijn dezelfde bestanden als op de homepage-tak in `audits/assets`:

| Bestand | Waar |
| --- | --- |
| `hero-portrait.jpg` | de hero |
| `hero-logo.png` | het monogram, drie keer: hero, kader, paneel |
| `team-1.webp` … `team-3.webp` | de teamrij in blok 4 |

Het monogram staat op donkere grond met `filter:brightness(0) invert(1)` en op
lichte grond zonder filter — één bestand, twee behandelingen, net als in
`ws-garantie.css` op de homepage.

## Vijf blokken

1. **Hero** — donker, tekst links, beeld rechts achter een sluier, met de teller.
2. **De drie vragen** — licht, in een gouden kader: jouw probleem, wat je al
   probeerde, waar je uit wilt komen.
3. **De werkwijze** — donker met gouden gloed, drie genummerde stappen.
4. **Wel en niet beloven** — twee panelen naast elkaar, donker en licht.
5. **Afsluiter** — donker met gloed en twee knoppen.

De drie vragen en de drie stappen zijn blokken, dus in de thema-editor te
herordenen of aan te vullen. Alle overige teksten zijn instellingen.

## Afspraken die uit de homepage zijn overgenomen

* **Boven- en ondermarge komen uit de sectie-instellingen**, niet uit de CSS.
  Het thema zet `#shopify-section-ID > * { padding }` via `snippets/indent-settings`,
  en dat is een ID-selector die van elke klasse wint. Vandaar `desk_indent_top`
  en de drie andere in het sjabloon.
* **Mobiel is één echte media query** op `max-width: 749px`.
* **Elke klasse begint met `ws-`** zodat thema-CSS er niet doorheen lekt.
* **Elk element dat zijn eigen achtergrond zet, zet ook zijn eigen `color`.**
* **Het aantal kolommen gaat via `--ws-kol`**, niet via een inline stijl: een
  inline stijl wint van elke media query.
* **`|br|` in een tekstinstelling** wordt een regeleinde.

## Het voorbeeld bijwerken

```
node theme/preview.mjs
```

De copy komt uit `templates/page.ws-overons.json` en de opmaak uit
`assets/ws-overons.css`, allebei ongewijzigd — alleen de markup staat in
`preview.mjs` een tweede keer, net als in `audits/build-preview.mjs` op de
homepage-tak. Verbouw je de sectie, verbouw dan dit bestand mee.

## Wat er nog moet gebeuren

* **De bestandsnamen in Shopify Files controleren.** De sectie pakt eerst de
  `image_picker`; staat die leeg, dan valt hij terug op `ws-hero-portrait.jpg`,
  `ws-hero-logo.png` en `ws-team-1.webp` tot `-3`. Dat zijn de namen die de
  homepage-README noemt (`ws-…`), maar ze zijn hier niet nagekeken tegen de
  echte winkel. Klopt er een niet, dan blijft dat beeld weg — de rest van het
  blok blijft staan. Pas dan de bestandsnaam aan in de instelling ernaast, of
  kies het beeld gewoon in de editor.
* **De cijfers.** 180.000+ bestellingen sinds 2021 en de 100 dagen, 2 jaar en
  €30 komen uit de homepage-instellingen; ze staan hier als tekstveld, dus ze
  lopen niet vanzelf mee als de winkel verandert.
