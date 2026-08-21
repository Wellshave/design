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
| Geen page mappings (`searchMappings` → `[]`) | Scrolldiepte, funnel, journey en paginavergelijking eisen allemaal een `mappingId`. |
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

**En:** Session Replay, Heatmaps en Voice of customer staan gewoon in de
linkernavigatie van het account. Vraag 4 en 5 zijn daarmee mogelijk zonder
Clarity te beantwoorden. Onbevestigd of die schermen na de proef nog data tonen.

Wat wél binnenkwam: sitemetrics per platform en per browser. Zie deel 06 voor de
tabellen. Het bruikbaarste cijfer is dat het diepe desktopbezoek volledig in
Safari zit (6% van desktop) terwijl Chrome 80% is en zich gewoon gedraagt — de
desktop-defectthese wordt dus *niet* bevestigd, en de Clarity-opnames moeten op
Chrome desktop gefilterd worden.

Verbruik: 11 tool calls van de 300 per maand.

## Wat er nog wél te doen is

1. **Maak één page mapping aan** in de ContentSquare-interface, met een groep
   «Productpagina» op `/products/*`. Kost tien minuten, kost niets, en er is geen
   API-tool voor — dit is handwerk. Daarna zijn `scrollRate`, `pageHeight`,
   `foldHeight` en `activityRate` beschikbaar (basismetrics, zitten in gratis) en
   is de scrolldiepte-vraag alsnog te beantwoorden. Dat is de vraag die de
   volgorde-omzetting van deel 05 bewijst of onderuithaalt.
2. **Zet een conversiedoel op** als je iets met de fout-tools wil, al blijven die
   op gratis achter de betaalmuur.
3. **Klik één keer op Session Replay** en kijk of er data staat of een
   upgrade-muur. Staat het open, dan zijn de desktop-opnames (vraag 4) en de
   klikkaart (vraag 5) direct te doen in ContentSquare en heb je Clarity alleen
   nog nodig voor vraag 2 en 3.
4. **Vraag een Clarity-token aan** — Clarity → Instellingen → Data Export →
   Generate new API token. Dat dekt vraag 1, 2 en 3.
   `scripts/clarity-pdp-insights.py` staat klaar en wacht alleen op
   `CLARITY_API_TOKEN` in de omgeving (**niet in de repo**).
5. **Of zet ContentSquare uit.** Het draait nu mee in 797 KB met nul mappings,
   nul doelen en de twee interessantste featuresets buiten het abonnement.

`scripts/contentsquare-pdp-insights.py` blijft staan voor als er ooit een
Growth-plan komt; de Export API zit daar pas vanaf.
