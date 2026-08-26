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
sjabloon `ws-overons`. Nu leidt `/pages/over-ons` nog om naar de homepage; de
Over ons-pagina die er vandaag staat heeft handle **`over-wellshave`**.

## De beelden

In `beeld/` staan de bestanden die het voorbeeld en het ontwerpbeeld inbedden.
Allemaal eigen materiaal — het monogram en de teamrij komen van de
homepage-tak (`audits/assets`), de drie foto's uit de winkel zelf.

| Bestand | Waar | Herkomst |
| --- | --- | --- |
| `founder-magazijn.jpg` | de hero, en de ronde pasfoto in blok 2 | Shopify Files |
| `verhaal-1.jpg` | de grote foto in blok 2 | Shopify Files |
| `verhaal-2.jpg` | de kleine foto over de rand in blok 2 | Shopify Files |
| `hero-logo.png` | het monogram, drie keer: hero, kader, paneel | homepage-tak |
| `team-1.webp` … `team-3.webp` | de teamrij in blok 5 | homepage-tak |

De hero gebruikt **niet** het portret van de homepage. Dat stond er in de
vorige ronde wel, en dan lees je op twee pagina's achter elkaar hetzelfde
beeld. De drie foto's hierboven staan al in de winkel: `verhaal-1` en
`verhaal-2` bij het artikel *Van loodgieter naar scheermerk*,
`founder-magazijn` bij de bestellingen-alinea daarin.

Het monogram staat op donkere grond met `filter:brightness(0) invert(1)` en op
lichte grond zonder filter — één bestand, twee behandelingen, net als in
`ws-garantie.css` op de homepage.

## Zes blokken

1. **Hero** — donker, tekst links, beeld rechts achter een sluier, met de teller.
2. **Het verhaal** — licht en open: twee foto's uit de installateurstijd links,
   een ondertekend stuk rechts. Bewust zónder kader, zodat het naast blok 3
   als een ander soort blok leest.
3. **De drie vragen** — licht, in een gouden kader: jouw probleem, wat je al
   probeerde, waar je uit wilt komen.
4. **De werkwijze** — donker met gouden gloed, drie genummerde stappen.
5. **Wel en niet beloven** — twee panelen naast elkaar, donker en licht.
6. **Afsluiter** — donker met gloed en twee knoppen.

### Waarom blok 2 in de ik-vorm staat

De rest van de pagina zegt *wij*. Blok 2 zegt *ik*, en is ondertekend. Dat is
geen slordigheid: een persoonlijk verhaal in de wij-vorm klinkt als een
bedrijfsprofiel, en dat is precies wat de huidige Over ons-pagina in de winkel
doet. De regel voor dit blok is dat elke zin over vroeger eindigt bij de lezer.
"Ik was installateur" is er alleen omdat de zin erna is: *verkeerd gereedschap
laat je geloven dat jij degene bent die het niet kan*. De les uit dat vak —
goed gereedschap bepaalt het resultaat, niet de man die het vasthoudt — is
dezelfde belofte die de hero erboven doet.

Het verhaal draagt geen bewijslast. Er staat geen getal in, en het claimt
niets over het product; dat gebeurt in blok 4 en 5, met de instellingen uit de
homepage erachter.

De drie vragen en de drie stappen zijn blokken, dus in de thema-editor te
herordenen of aan te vullen. Alle overige teksten — het verhaal inbegrepen,
alinea voor alinea — zijn instellingen.

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
`blokken.mjs` een tweede keer, want een Liquid-renderer hebben we hier niet.
Dat ene bestand voedt zowel het voorbeeld als het ontwerpbeeld, zodat die twee
niet uit elkaar lopen. Verbouw je `sections/ws-overons.liquid`, verbouw dan
`blokken.mjs` mee.

## Wat er nog moet gebeuren

* **De bestandsnamen in Shopify Files controleren.** De sectie pakt eerst de
  `image_picker`; staat die leeg, dan valt hij terug op `ws-founder-magazijn.jpg`,
  `ws-verhaal-1.jpg`, `ws-verhaal-2.jpg`, `ws-hero-logo.png` en `ws-team-1.webp`
  tot `-3`. Dat is de `ws-…`-naamgeving uit de homepage-README; de drie foto's
  van blok 1 en 2 staan in de winkel nu nog onder hun oude naam
  (`founder-bestellingen.jpg`, `dustin-loodgieter-1.jpg`, `-2.jpg`), dus die
  moeten óf onder de `ws-`-naam opnieuw geüpload worden, óf in de editor
  gekozen. Klopt er een niet, dan blijft dat beeld weg — de rest van het
  blok blijft staan. Pas dan de bestandsnaam aan in de instelling ernaast, of
  kies het beeld gewoon in de editor.
* **De cijfers.** 180.000+ bestellingen sinds 2021 en de 100 dagen, 2 jaar en
  €30 komen uit de homepage-instellingen; ze staan hier als tekstveld, dus ze
  lopen niet vanzelf mee als de winkel verandert.
* **Eén getal spreekt zichzelf tegen.** De homepage zegt **180.000+**
  bestellingen en **950+** beoordelingen. De twee artikelen in de winkel
  (*Van loodgieter naar scheermerk* en *Een gewoonte uit de loodgietersjaren*)
  zeggen **184.000+** en **800+ Trustpilot**. Op deze pagina staat het cijfer
  van de homepage. Welke van de twee klopt, moet één keer worden vastgesteld —
  daarna moeten de artikelen mee.
* **De huidige Over ons-pagina spreekt deze tegen.** In de winkel staat nog
  `over-wellshave`: die noemt Wellshave én Wellshine en richt zich expliciet
  ook op vrouwen en ladyshave, terwijl de homepage en deze pagina alleen
  mannen aanspreken. Vervangen of naast elkaar laten bestaan is een keuze die
  nog gemaakt moet worden.
* **Het team met naam.** `over-wellshave` noemt Willem, Yvonne, Aaron, Virgil
  en Tom. Blok 5 zegt nu alleen "klantenservice en magazijn". Namen erbij maakt
  het warmer, maar dan moet de rij bijgehouden worden als iemand weggaat.
