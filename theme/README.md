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
| De fotografie | `beeld/` |

De pagina komt in Shopify onder Pagina's → "Over ons", handle `over-ons`,
sjabloon `ws-overons`. Nu leidt `/pages/over-ons` nog om naar de homepage; de
Over ons-pagina die er vandaag staat heeft handle **`over-wellshave`**.

## Zeven blokken

1. **Hero** — halve foto, halve tekst. Wie we zijn, met de missie en de visie
   als twee gelabelde regels. Geen knop, geen teller, geen watermerk.
2. **Het verhaal** — licht en open: twee foto's uit de installateurstijd links,
   een ondertekend stuk rechts. Bewust zónder kader, zodat het naast blok 3
   als een ander soort blok leest.
3. **De drie vragen** — licht, in een gouden kader: jouw probleem, wat je al
   probeerde, waar je uit wilt komen.
4. **Trustpilot** — een carrousel met zes beoordelingen en de TrustScore.
5. **Wel en niet beloven** — twee panelen naast elkaar, donker en licht, met
   één kritische review onder het lichte paneel.
6. **Het team** — één foto van alle zes, met de namen erin.
7. **Afsluiter** — donker met gloed en twee knoppen.

Drie bloktypes zijn herhaalbaar in de thema-editor: `vraag`,
`review` en `mens`. Al het overige is een instelling.

### Er stonden er tien

Een eerdere ronde voegde vier blokken toe uit de vergelijking hieronder: een
resultaatband met drie uitkomsten, een tijdlijn, een werkwijze in drie stappen
en een scorebalk met drie productcijfers. Los van elkaar waren ze te
verdedigen, maar samen maakten ze er een pagina van tien blokken van. Een Over
ons-pagina die je moet uitzitten leest niemand. Ze zijn er allemaal weer uit,
plus de knop in de hero.

**Dat een patroon bij zes van de acht vergeleken merken voorkomt, is een
argument — geen verplichting.**

### Waarom blok 2 in de ik-vorm staat

De rest van de pagina zegt *wij*. Blok 2 zegt *ik*, en is ondertekend. Een
persoonlijk verhaal in de wij-vorm klinkt als een bedrijfsprofiel, en dat is
precies wat de huidige Over ons-pagina in de winkel doet. De regel voor dit
blok is dat elke zin over vroeger eindigt bij de lezer. "Ik was installateur"
is er alleen omdat de zin erna is: *verkeerd gereedschap laat je geloven dat
jij degene bent die het niet kan.*

### Hoe de carrousel werkt

Het spoor is een grid met `scroll-snap-type: x mandatory`. De pijlen en de
stippen kijken allebei naar `scrollLeft`, dus vegen en klikken lopen niet uit
de pas. Werkt het JavaScript niet, dan blijft het spoor gewoon veegbaar en
gaat er niets stuk; de nav verbergt zichzelf als alles in één scherm past.

Twee dingen om te weten als je eraan sleutelt:

* De stapgrootte gebruikt **`offsetWidth`**, niet `getBoundingClientRect()`.
  Dat laatste wordt beïnvloed door een `transform: scale()`, en het
  ontwerpbeeld schaalt elk vak — dan klopt de sprong niet meer.
* Het spoor wordt gezocht via `nav.parentElement`, niet via een id. Zo botsen
  twee carrousels niet als de sectie twee keer op één pagina staat.

### Waarom de namen niet bij de gezichten staan

De eerste opzet was een label per gezicht. In Shopify Files staan losse
portretten met de naam in de bestandsnaam (`team_dustin.png` en de vijf
andere), en daarmee zijn vier van de zes met zekerheid te herkennen — maar
twee niet. Een collega onder de verkeerde naam publiceren is erger dan geen
label. De namen staan daarom als een rij ín de foto, maar niet aan een gezicht
vast. Wie weet wie wie is, kan er alsnog labels van maken.

## De beelden

| Bestand | Waar | Herkomst |
| --- | --- | --- |
| `founder-magazijn.jpg` | de hero, en de ronde pasfoto in blok 2 | Shopify Files |
| `verhaal-1.jpg` | de grote foto in blok 2 | Shopify Files |
| `verhaal-2.jpg` | de kleine foto over de rand in blok 2 | Shopify Files |
| `teamfoto.jpg` | blok 6 | Shopify Files |
| `hero-logo.png` | het monogram, twee keer: kader en paneel | homepage-tak |

De hero gebruikt **niet** het portret van de homepage — dan lees je op twee
pagina's achter elkaar hetzelfde beeld.

Alle vier de foto's zijn opnieuw gecodeerd op de breedte die ze werkelijk
krijgen, want ze worden in het voorbeeld en het ontwerpbeeld als data-URI
ingebed. De teamfoto ging van 7,4 MB naar 173 KB. Vervang je er een, doe dat
dan ook (`sharp` of iets vergelijkbaars, breedte 1000–1600, kwaliteit 80).

## Waar de cijfers vandaan komen

Niets op deze pagina is geschat.

| Wat | Waar het vandaan komt |
| --- | --- |
| TrustScore 4,4 uit 985 | `nl.trustpilot.com/review/wellshave.nl` |
| De zes reviews in blok 4 | dezelfde pagina, woord voor woord, met naam en datum |
| De kritische review in blok 5 | idem, een beoordeling van vier sterren |
| 100 dagen · 2 jaar · €30 | winkelvoorwaarden, ook op de homepage |

**De TrustScore loopt.** 4,4 uit 985 is de stand van 29 augustus. Het is een
tekstveld, dus hij loopt niet mee — af en toe bijwerken, samen met de reviews.

## Waar de opbouw vandaan komt

Acht Over ons-pagina's uit dezelfde hoek van de markt zijn naast elkaar
gelegd: Dore & Rose, Cloudpillo, Meroda, Hears, MAE, Moov, Manscaped en
Achaté.

| Patroon | Van de acht | Wij |
| --- | :-: | --- |
| CTA boven de vouw | 6 | geprobeerd, er weer uit |
| Uitkomsten in cijfers | 3 | geprobeerd, er weer uit |
| Oprichtersverhaal | 5 | blok 2 |
| Tijdlijn | 1 | geprobeerd, er weer uit |
| Drie kernwaarden | 6 | blok 3 doet dit concreter |
| Team met namen | 4 | blok 6 |
| Reviews als eigen blok | 3 | blok 4, nu van Trustpilot |
| **Eerlijk over grenzen** | **0** | blok 5 — het enige dat niemand doet |

Twee dingen zijn bewust **niet** overgenomen. Meroda plakt een productgrid en
een Instagram-feed op zijn Over ons; dat maakt er een tweede winkelpagina van.
En de missiezinnen van Dore & Rose en Hears ("we're on a mission to elevate
sleep into a true wellness experience") zeggen bij nalezen niets.

De vergelijking staat als tabel in `over-ons.artifact.html`.

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
* **Marge op een `<p>` heeft een sterkere selector nodig.** `.ws-ov p{margin:0}`
  weegt (0,1,1) en wint van een losse klasse (0,1,0). Zet je een marge op een
  `<p>`, schrijf dan `.ws-ov p.ws-ov__…`.
* **`|br|` in een tekstinstelling** wordt een regeleinde.

## Het voorbeeld bijwerken

```
node theme/preview.mjs     # over-ons.preview.html
node theme/artifact.mjs    # over-ons.artifact.html
```

De copy komt uit `templates/page.ws-overons.json` en de opmaak uit
`assets/ws-overons.css`, allebei ongewijzigd — alleen de markup staat in
`blokken.mjs` een tweede keer, want een Liquid-renderer hebben we hier niet.
Dat ene bestand voedt zowel het voorbeeld als het ontwerpbeeld, zodat die twee
niet uit elkaar lopen. Het carrousel-script wordt er letterlijk uit de sectie
geknipt, dus dat kan niet uit de pas gaan lopen. Verbouw je
`sections/ws-overons.liquid`, verbouw dan `blokken.mjs` mee.

## Wat er nog moet gebeuren

* **De bestandsnamen in Shopify Files controleren.** De sectie pakt eerst de
  `image_picker`; staat die leeg, dan valt hij terug op `ws-founder-magazijn.jpg`,
  `ws-verhaal-1.jpg`, `ws-verhaal-2.jpg`, `ws-teamfoto.jpg` en `ws-hero-logo.png`.
  Dat is de `ws-…`-naamgeving uit de homepage-README; de vier foto's staan er nu
  nog onder hun oude naam. Dus óf opnieuw uploaden onder de `ws-`-naam, óf in de
  editor kiezen. Klopt er een niet, dan blijft dat beeld weg en blijft de rest
  van het blok staan.
* **De rollen in blok 6 zijn overgenomen van `over-wellshave`** en niet
  nagekeken. Klopt er een niet meer, of is er iemand bij of weg, dan is dat één
  blok in de editor.
* **De TrustScore en de reviews verlopen.** Zie hierboven.
* **Het groene stericoon bij de TrustScore** is de kleur van Trustpilot
  (#00B67A), zodat het blok herkenbaar is als hun beoordeling. Het is geen
  nagemaakt logo. Wil je in plaats daarvan hun officiële widget, dan vervangt
  die het hele kopblok.
* **De huidige Over ons-pagina spreekt deze tegen.** `over-wellshave` noemt
  Wellshave én Wellshine en richt zich expliciet ook op vrouwen en ladyshave,
  terwijl de homepage en deze pagina alleen mannen aanspreken.
* **Eén getal spreekt zichzelf tegen.** De homepage zegt 180.000+ bestellingen
  en 950+ beoordelingen; de twee artikelen in de winkel zeggen 184.000+ en
  800+ Trustpilot. Op deze pagina staat nu geen van beide — de teller is uit de
  hero verdwenen — maar op de homepage staat het nog wel.
