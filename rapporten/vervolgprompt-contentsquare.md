# Vervolgprompt — ContentSquare-meting

Plak onderstaande blok in een nieuwe chat. De ContentSquare-connector moet
aanstaan én aangezet zijn voor die chat; tools worden bij sessiestart geladen.

---

Repo `Wellshave/design`, branch `claude/product-page-redesign-gzb7s9`. Werk daarop verder.

De ContentSquare-connector staat nu aan. Draai de meting die in `rapporten/productpagina-redesign.html` deel 06 als blinde vlek gemarkeerd staat, en vul dat deel met echte cijfers.

**Context die al vaststaat — niet opnieuw ophalen.**

Wellshave (wellshave.com, Shopify, NL/EUR) verkoopt bodygroomers. De productpagina's zijn volledig op metafields gebouwd: ~20 `custom.*` velden plus metaobjects, één sjabloon voor alle producten. Dat is de hefboom — één sjabloonwijziging raakt het hele assortiment.

Shopify-funnel, laatste 90 dagen (winkelbreed, niet per product):

| | sessies | ATC | checkout | aankoop | CVR |
|---|---|---|---|---|---|
| mobiel | 36.830 | 1.635 (4,44%) | 1.156 | 815 | 2,21% |
| desktop | 9.267 | 349 (3,77%) | 270 | 121 | 1,31% |
| tablet | 769 | 35 (4,55%) | 22 | 17 | 2,21% |

Twee lekken, allebei bevestigd:
1. **Sessie → ATC is 4,31%** tegen een norm van 8–12%. Dat is de productpagina zelf.
2. **Desktop checkout-afronding 44,8%** (121/270) tegen mobiel 70,5% en een norm van 65%+. Ruikt naar een technisch defect, niet naar een ontwerpkeuze.

Op de heldenpagina `/products/groom-guard-pro` (€59,95, was €85,65) is in de ruwe HTML geverifieerd:
- 4× `Lorem ipsum dolor sit amet.` en 5× prijs `0,00` live in het aanbevelingsblok
- 2× `EMPTY DOM REMOVE PROTECTOR` — themacode lekt naar de pagina
- drie verschillende reviewaantallen: 950+, 650+ en 431, terwijl Loox er werkelijk **442** telt (4.6)
- `levenslang jaar garantie` naast `2 jaar garantie`
- Duits in de meta-description (`Messgeräte`, `120 Min. Batterie`) op een Nederlandse pagina
- 70 van de 161 `<img>` zonder alt-tekst
- sectievolgorde zet specificaties vóór de bewijs- en mechanismeblokken

**Wat ik van je wil.**

Beantwoord met de ContentSquare-tools deze vijf vragen, in deze volgorde van belang:

1. **Scrolldiepte per pagina en apparaat.** Het mechanismeblok begint rond 55–65% van de pagina. Ligt de mediane scrolldiepte daaronder, dan is dat blok voor de helft van je bezoek onzichtbaar en is het naar voren halen een reparatie, geen smaakkwestie. Dit is de vraag die de hele redesign-these bevestigt of onderuithaalt — begin hier.
2. **Waar zitten rage clicks en frustratie op de PDP?** Toets specifiek of het kapotte aanbevelingsblok meetbaar schade doet.
3. **Quickbacks** — sluit de pagina aan op de advertentie die de klik opleverde?
4. **Desktop-checkout**: is die 44,8% een JS- of API-fout? Splits foutindicatoren per apparaat.
5. **Klikgedrag op het koopblok** — wordt er geklikt op dingen die niet klikbaar zijn?

Relevante tools: `computeSiteMetrics`, `computeFunnel`, `getTopPageGroupsByLostConversions`, `getTopPagesBySessionsWithErrors`, `getTopErrorsByImpactOnGoal`.

**Randvoorwaarden.**

- Gratis plan: **300 tool calls per maand**, teller stond op 18,71K/200K sessies. Begroot ~5–10 calls, niet meer. Zeg vooraf welke je gaat doen.
- Gratis plan geeft **1 maand historie**. Vraag niets daarbuiten.
- `scripts/contentsquare-pdp-insights.py` staat in de repo maar vereist een betaald plan (de Export API zit pas vanaf Growth). Niet gebruiken, staat er voor later.
- **Verzin geen cijfers.** Lukt een meting niet, zeg dat dan. Het rapport is nu eerlijk over wat het niet weet; houd dat zo.
- Nederlands, en schrijf voor iemand die de pagina zelf gebouwd heeft.

Werk daarna deel 06 van het rapport bij, commit en push naar dezelfde branch.
