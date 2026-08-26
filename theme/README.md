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

## Tien blokken

1. **Hero** — donker, tekst links, beeld rechts achter een sluier. Knop, reden­regel
   en teller eronder.
2. **Wat er voor jou verandert** — donkere band die aan de hero vastzit: drie
   uitkomsten, elk met een cijfer én de bron eronder.
3. **Het verhaal** — licht en open: twee foto's uit de installateurstijd links,
   een ondertekend stuk rechts. Bewust zónder kader, zodat het naast blok 5
   als een ander soort blok leest.
4. **De reis** — donkere tijdlijn, vijf fasen met jaartallen.
5. **De drie vragen** — licht, in een gouden kader: jouw probleem, wat je al
   probeerde, waar je uit wilt komen.
6. **De werkwijze** — donker met gouden gloed, drie genummerde stappen.
7. **Wat klanten zeggen** — licht: drie echte reviews en de scores per product.
8. **Wel en niet beloven** — twee panelen naast elkaar, donker en licht, met
   één kritische review onder het lichte paneel.
9. **De mensen** — donker: zes namen en rollen, met een initiaal waar geen foto is.
10. **Afsluiter** — donker met gloed en twee knoppen.

Zes bloktypes zijn herhaalbaar in de thema-editor: `uitkomst`, `vraag`, `fase`,
`stap`, `stem` en `mens`. Al het overige is een instelling.

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

## Waar de opbouw vandaan komt

Acht Over ons-pagina's uit dezelfde hoek van de markt zijn naast elkaar
gelegd: Dore & Rose, Cloudpillo, Meroda, Hears, MAE, Moov, Manscaped en
Achaté. Wat daaruit is overgenomen, en waarom:

| Patroon | Hoeveel van de acht | Wat wij ermee deden |
| --- | --- | --- |
| CTA boven de vouw | 6 | Knop in blok 1, met "100 dagen thuis proberen" ernaast |
| Uitkomsten in cijfers | 3 | Blok 2 — maar mét een bron onder elk cijfer |
| Oprichtersverhaal | 5 | Blok 3, al aanwezig, ondertekend |
| Tijdlijn | 1 | Blok 4, jaartallen uit de winkel zelf |
| Drie kernwaarden | 6 | Blok 5 en 6 deden dit al, concreter |
| Team met namen | 4 | Blok 9, met initiaal waar geen foto is |
| Reviews als eigen blok | 3 | Blok 7, echte reviews |
| **Eerlijk over grenzen** | **0** | Blok 8 — het enige dat niemand van de acht doet |

Twee dingen zijn bewust **niet** overgenomen. Meroda plakt een productgrid en
een Instagram-feed op zijn Over ons; dat maakt er een tweede winkelpagina van.
En de missiezinnen van Dore & Rose en Hears ("we're on a mission to elevate
sleep into a true wellness experience") zeggen bij nalezen niets.

De vergelijking staat als tabel in `over-ons.artifact.html`.

## Waar de cijfers vandaan komen

Niets op deze pagina is geschat. De bronnen, allemaal opvraagbaar:

| Wat | Waar het vandaan komt |
| --- | --- |
| 4,9 uit 192 · Groom Guard™ | metafield `loox.avg_rating` / `loox.num_reviews` |
| 4,9 uit 150 · Shave Package Ultimate™ | idem |
| 4,4 uit 768 · Neustrimmer Advance™ | idem |
| 2022 · eerste eigen apparaat | `createdAt` van Groom Guard™, 15-08-2022 |
| 2023 · de neustrimmers | `createdAt`, 24-03-2023 |
| 2025 · foil shaver en tassen | `createdAt`, sept/okt 2025 |
| 74 apparaten | `productsCount` |
| 180.000+ bestellingen sinds 2021 | instelling `ws-hero.tel_label` op de homepage |
| 100 dagen · 2 jaar · €30 | winkelvoorwaarden, ook op de homepage |

De drie klantcitaten in blok 7 en het kritische citaat in blok 8 zijn
letterlijk overgenomen uit `loox.reviews`, met de naam zoals de klant hem
zelf heeft achtergelaten.

### Eén citaat is vervangen

In stap 01 stond eerder een citaat van "Maarten A." dat nergens in de winkel
terug te vinden was. Dat is weggehaald en vervangen door een echte review —
en bewust een kritische, want de stap gaat over luisteren:

> "Jammer dat de oplaadstekker er niet standaard bij zit. Wel de USB. Anders
> was ie 5 sterren waard." — Hellmondje · Groom Guard™

### En één review van drie sterren staat er expres in

Onder "wat wij niet beloven" staat een echte review die zegt dat het niet
altijd pijnloos is. Geen van de acht vergeleken merken laat zoiets zien, en
dat is precies waarom het werkt. Weg te halen met één leeg veld
(`tegen_tekst`) als dat toch niet gewenst is.

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
  weegt (0,1,1) en wint van een losse klasse (0,1,0). `.ws-ov__afreden` en
  `.ws-ov__mensslot` kregen daardoor hun bovenmarge niet; ze staan nu als
  `.ws-ov p.ws-ov__…`. Zet je een marge op een `<p>`, doe dat ook.
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
* **Teamfoto's.** Blok 9 noemt Dustin, Willem, Yvonne, Aaron, Virgil en Tom
  met hun rol, maar zonder foto — dan vult de cirkel zich met de initiaal. Zes
  portretjes maken het blok een stuk warmer. Elk blok heeft er een
  `image_picker` voor.
* **De rollen zijn overgenomen van `over-wellshave`** en niet nagekeken. Klopt
  er een niet meer, of is er iemand bij of weg, dan is dat één blok in de editor.
* **`team-1.webp` t/m `-3`** worden niet meer gebruikt: de naamloze rij in blok 8
  is weg nu blok 9 er staat. De instellingen ervoor zijn blijven staan, dus
  vul je `team_titel` weer in, dan komt de rij terug.
