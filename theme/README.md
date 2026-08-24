# Wellshave — homepage in het thema

Werkwijze en stand van zaken voor het live zetten van de ontworpen homepage.

## De design-artifact

De homepage staat ook als ontwerpbeeld op
<https://claude.ai/code/artifact/d4943559-5f56-4b4b-a466-4040947f74b3> —
"Wellshave homepage-redesign". Daar staan de blokken op desktop en mobiel naast
elkaar, met onderaan een verantwoording van wat er sinds het oorspronkelijke
ontwerp is veranderd.

**Die moet mee bij elke wijziging.** Het thema is de bron, de artifact is het
beeld ernaast; loopt hij achter, dan gaat iemand naar een verouderd ontwerp
kijken. Het bestand staat in `artifacts/wellshave-homepage.html`. Bijwerken doe
je door dat bestand aan te passen en het opnieuw te publiceren met dezelfde
URL — dan blijft de link werken. Publiceren gaat via een bestandspad, dus dat is
goedkoop, ook al is het bestand 3,7 MB aan ingebedde beelden.

Twee dingen wijken bewust af van het thema: blok 8 — het assortiment per zone —
zit niet in de artifact, en de Trustpilot-carrousel is daar nagebouwd omdat een
echte TrustBox alleen op de winkel zelf laadt.

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
  en dat is een ID-selector: die wint van elke klasse. Staat de instelling op 0
  — de standaard — dan wordt de boven- en ondermarge van de sectie op nul
  gezet, hoeveel er ook in de CSS staat. Boven- en ondermarge dus altijd via
  `desk_indent_top`, `desk_indent_bottom`, `mob_indent_top` en
  `mob_indent_bottom` in `index.json`, voor **elke** sectie. De waarden daar
  zijn gelijk aan wat de CSS bedoelde; de CSS-regel blijft staan als terugval
  en voor de linker- en rechtermarge, die de snippet niet aanraakt.
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
* **Het monogram in blok 3.** Bedoeld als hover-detail, maar op een telefoon is
  er geen hover. Eerst mobiel weggehaald, daarna op verzoek teruggezet: zonder
  muis staat het er permanent en zacht (opacity .1), met muis komt het pas bij
  hover tevoorschijn (.22). Het hangt aan `@media (hover:none),(pointer:coarse)`
  en niet aan de schermbreedte, zodat een tablet met aanraakscherm hem ook
  krijgt.
* **De vier zekerheden in blok 11 hingen half buiten beeld.** Een veegbare rij
  van 58% brede kaarten knipte de tweede kaart middenin een woord af. Ze staan
  nu twee bij twee.

## De zones

Blok 5 en blok 8 werken per zone, en een zone is een collectie. Vier daarvan
bestonden al; voor gezicht en hoofd waren ze er niet, want een scheerapparaat is
geen baardtrimmer en een head shaver geen tondeuse.

| Zone | Collectie | Waar hij van vult |
|---|---|---|
| Lichaam | `bodygroomers` | handmatig |
| Gezicht & baard | `zone-gezicht` | tag `zone:gezicht` |
| Hoofd | `zone-hoofd` | tag `zone:hoofd` |
| Neus & oren | `neustrimmers` | tag/type |

`zone-gezicht` en `zone-hoofd` zijn slimme collecties: ze vullen zichzelf uit
een tag op het product. Een nieuw apparaat komt in de juiste zone door er
`zone:gezicht` of `zone:hoofd` op te zetten, en verder niets.

Wat er getagd is:

* **`zone:gezicht`** — de 5 baardtrimmers, de 4 face shavers (Sentinel PRO,
  Blade Baron, Gentleman Shaver, Elegant 4-in-1) en de 5 safety razors.
* **`zone:hoofd`** — de 4 tondeuses en de Head Shaver Deluxe.

Losse scheerkoppen en mesjes zijn niet getagd: dat zijn accessoires, geen
apparaten, en ze zouden de telling opblazen.

De homepage telt met `all_products_count`, en dat telt alleen wat in de Online
Store staat. Vier getagde producten staan op archief — Safety Razor Rosé,
Silver en Matt Grey, en Tondeuse Pro™ — dus de winkel toont 11 en 4 waar de
beheeromgeving 14 en 5 zegt. Dat is goed: een bezoeker hoort geen apparaten
geteld te zien die hij niet kan kopen. Haal je er een uit het archief, dan komt
hij vanzelf in de juiste zone terecht.

## De reviews in blok 2

**De acht reviews die er nu in staan zijn geen gecontroleerde Trustpilot-reviews.**
Het zijn de acht teksten die tijdens de ontwerpfase van de bestaande site zijn
overgenomen, en ze dragen alle acht het Trustpilot-logo. Voor het live gaat moet
elke review woordelijk uit het Trustpilot Business-account komen, of moet het
logo eraf. De ontwerpnotitie in `audits/blok-02-pijnpunt.template.html`
waarschuwde hier al voor, inclusief dat drie ervan met een vrouwennaam zijn
ondertekend — op een merk voor mannen ondermijnt dat de geloofwaardigheid.

Trustpilot laat zich niet scrapen (403 op de reviewpagina), en dat is ook niet
de bedoeling. Er zijn drie nette routes:

1. **De officiële TrustBox-carrousel.** De Trustpilot-app draait al op de winkel
   en het widget-script laadt al mee; de business unit is
   `63c511d4e1339e2200c204a1`. Altijd actueel en gelicentieerd, maar het is
   Trustpilots eigen vormgeving — blauw-groen midden in ons crème-en-goud.
2. **De Trustpilot Reviews API in onze eigen kaarten.** Geeft tekst, sterren,
   naam, datum én de profielfoto. Vraagt een API-sleutel uit het
   Business-account en een plek om de sync te draaien.
3. **Handmatig woordelijk overnemen.** Geen sleutel nodig, volledig in ons
   ontwerp, maar het veroudert: iemand moet het bijhouden.

**Gekozen: route 1 voor allebei.** Blok 2 heeft nu twee velden waar een
TrustBox in gaat:

* **Widgetcode voor de score** — vervangt de ingetypte regel "4,5 uit 950+
  beoordelingen" rechtsboven. Dat cijfer veroudert anders stilletjes.
* **Widgetcode voor de band** — vervangt de reviewkaarten door Trustpilots
  eigen carrousel.

De carrousel van Trustpilot **schuift niet vanzelf door**. Er is geen
data-attribuut voor, en aansturen van buitenaf kan niet: de widget draait in een
iframe op een ander domein, dus zijn pijltjes zijn voor onze JavaScript
onbereikbaar. Wie een band wil die vanzelf beweegt, moet de **Slider**-TrustBox
pakken; die doet het van huis uit.

**Let op bij het controleren.** `scripts.trustpilot.com` is vanuit deze
werkomgeving niet bereikbaar (502 op de proxy), en dat is precies de loader die
de widgetbootstrap injecteert. De widgets zijn hier dus niet te renderen: het
vak blijft leeg en er verschijnt een JS-fout. Op de live winkel werkt dezelfde
bedrading wel — daar laadt de bootstrap en staan er vier widgets met een iframe
in. Controleren van de TrustBoxen doe je dus in een echte browser, niet via
`mirror.mjs`.

Beide velden leeg laten geeft de oude situatie terug; de reviewkaarten blijven
als blok bewaard. Alleen het `<div class="trustpilot-widget" …>`-deel plakken:
de bootstrap laadt al via de Trustpilot-app op de winkel. In de sectie zit een
klein script dat `Trustpilot.loadFromElement` opnieuw aanroept, want anders
blijft het vak leeg zodra de thema-editor de sectie herlaadt.

Het reviewblok is daarnaast voor route 2 en 3 klaargemaakt. Per review kun je nu instellen:
citaat, **sterren** (niet elke echte review is er vijf), naam, **foto van de
klant**, product, **datum** en **bron**. Laat je de bron leeg, dan verdwijnt de
bronvermelding — zo kan een review die niet van Trustpilot komt daar ook niet
het logo van dragen.

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
