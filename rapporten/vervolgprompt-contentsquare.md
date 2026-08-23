# ContentSquare-meting — uitgevoerd op 21 augustus 2026

Deze vervolgprompt is gedraaid. De uitkomst staat in
`rapporten/productpagina-redesign.html`, deel 06. Hieronder kort wat eruit kwam,
zodat niemand hem nog een keer draait.

## Uitkomst

Connector werkt. Project **Wellshave**, id `955088`, datavenster 30 juli –
21 augustus 2026 (22 dagen, rollend).

Vier van de vijf vragen bleven dicht:

| blokkade | gevolg |
|---|---|
| Geen page mappings (`searchMappings` → `[]`) | Scrolldiepte, funnel, journey en paginavergelijking eisen allemaal een `mappingId`. **Mappings zitten pas vanaf Growth** — op gratis toont Analysis setup alleen Segments en MCP, dus dit is niet op te lossen door iets aan te maken. |
| Geen conversiedoelen (`searchGoals` → `[]`) | De twee tools die conversieverlies aan fouten koppelen eisen een `goalId`. |
| Error Analysis niet in het abonnement | JS-/API-foutsplitsing per apparaat dicht sinds de proef afliep. |
| Frustration Score niet in het abonnement | Rage clicks niet meetbaar via ContentSquare. |

Daarbovenop: **rage clicks, dead clicks, quickbacks en klikkaarten zitten
helemaal niet in het API-oppervlak van ContentSquare** — dat is zoning-analyse
in de interface. Ook op een betaald plan waren vraag 2, 3 en 5 hierlangs niet te
beantwoorden. Die aanname in de oorspronkelijke prompt klopte niet.

Het project staat ook op `isEcommerce: false`, dus omzet en winkelwagenwaarde
blijven leeg. Dat is een tagging-instelling, geen abonnementskwestie.

**Let op:** het account staat op «Trial ended» — dit is geen permanent gratis
plan maar een afgelopen proefperiode (19,03K van 200K sessies, teller reset
30 augustus). De weigeringen zijn dus een aankoopbeslissing, geen muur.

**En:** het gratis plan bevat Heatmaps (scroll, click, zoning), Session Replay
(10K replays/maand), funnels, dashboards en de MCP-koppeling. Vraag 1, 4 en 5
zijn daarmee vandaag te beantwoorden zonder Clarity en zonder upgrade — via de
interface, niet via de API.

Wat wél binnenkwam: sitemetrics per platform en per browser. Zie deel 06 voor de
tabellen. Het bruikbaarste cijfer is dat het diepe desktopbezoek volledig in
Safari zit (6% van desktop) terwijl Chrome 80% is en zich gewoon gedraagt — de
desktop-defectthese wordt dus *niet* bevestigd, en de Clarity-opnames moeten op
Chrome desktop gefilterd worden.

Verbruik: 11 tool calls van de 300 per maand.

## Wat er nog wél te doen is

1. **Maak een scroll-heatmap** op `/products/groom-guard-pro`, apart voor mobiel
   en desktop. Heatmaps → New Heatmap → type «Scroll». Zit in het gratis plan.
   Lees de lijn «AVERAGE FOLD» af en het percentage dat «Veilig trimmen waar het
   telt» bereikt. Dat is de vraag die de volgorde-omzetting van deel 05 bewijst
   of onderuithaalt. **Niet** via een mapping proberen — die zitten pas vanaf
   Growth.
2. **Maak een click- of zoning-map** op dezelfde pagina voor het koopblok
   (vraag 5), en pak **tien Session Replay-opnames** van afgebroken
   desktop-checkouts, gefilterd op Chrome (vraag 4). Beide zitten in het gratis
   plan.
3. **Vraag een Clarity-token aan** — Clarity → Instellingen → Data Export →
   Generate new API token. Dat dekt vraag 1, 2 en 3.
   `scripts/clarity-pdp-insights.py` staat klaar en wacht alleen op
   `CLARITY_API_TOKEN` in de omgeving (**niet in de repo**).
4. **Of zet ContentSquare uit.** Het draait nu mee in 797 KB met nul mappings,
   nul doelen en de twee interessantste featuresets buiten het abonnement.

`scripts/contentsquare-pdp-insights.py` blijft staan voor als er ooit een
Growth-plan komt; de Export API zit daar pas vanaf.
