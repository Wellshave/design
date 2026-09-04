---
name: design-advertorial
description: Bouw een gedesignde Wellshave-landingspagina bij een advertentie — advertorial, listicle of merkverhaal — in de huisstijl, met hero, bewijsblokken, vergelijking, aanbodblok en FAQ. Dit is de tak met branding en verkoopkracht. ALWAYS use this skill when the user asks for a "landingspagina", "advertorial", "listicle", "pagina bij deze creative", "designed advertorial", "verkooppagina", "pagina met aanbod", or wants an existing Wellshave landing page redesigned, audited or extended. Trigger on "bouw een landingspagina bij deze ad", "maak een advertorial voor deze creative", "designde advertorial", "pagina met aanbodblok", "redesign deze landingspagina", "voeg een aanbod toe aan de pagina", "landing page for this creative". Voor een nieuwsartikeladvertentie die als aflevering van het eigen magazine Wellshave Dossier moet lezen, met masthead, zijkolom en lezersaanbiedingen, hoort de `nieuwsartikel` skill; die twee zijn bewust gescheiden. Bilingual NL/EN: reply in the user's language.
---

# Design-advertorial

Dit is de gedesignde tak: een landingspagina die er als Wellshave uitziet en die verkoopt.
Huisletter, goudaccenten, hero met knop, geruststrook, bewijsblokken, aanbodblok met ladder,
FAQ en afsluiter.

De zusterskill `nieuwsartikel` doet het andere frame: **Wellshave Dossier**, een eigen online
magazine met masthead, rubrieken, zijkolom, genoemd-in-strook en lezersaanbiedingen, waarbij het
aanbod pas onderaan komt. **Kies er &eacute;&eacute;n en meng ze niet.** Half is te commercieel
om als artikel te lezen en te redactioneel om als winkel te overtuigen.

---

## 1. Eerst: is dit wel de goede tak

| | Design-advertorial (deze skill) | Nieuwsartikel (Wellshave Dossier) |
|---|---|---|
| Frame | Een landingspagina van de winkel | Een uitgave met masthead en rubrieken |
| De advertentie belooft | Een product, een aanbod, een resultaat | Informatie, uitleg, een verhaal |
| Opmaak | Montserrat, kaarten, goudaccenten | Source Serif, hairlines, zandvlakken |
| Boven de vouw | Hero met beeld en koopknop | Kicker, leestijd, deelknoppen |
| Verkoopmomenten | Vanaf de hero, door de hele pagina | Twee stroken in de tekst, aanbod onderaan |
| Zijkolom | Nee | Ja: in het kort, feiten, verdieping |
| Doel | De lezer laten kopen | Vertrouwen winnen en dan pas verkopen |

**De toets:** haal het aanbod eruit. Blijft er een stuk over dat iemand zou lezen zonder iets
te willen kopen? Zo ja, overweeg dan het nieuwsartikel. Zo nee, dan hoor je hier.

Vraag dit bij de start expliciet, ook als je denkt het al te weten uit de creative. Achteraf
omzetten kost de hele pagina; de twee takken delen bijna geen bouwstenen.

## 2. De intake, en die sla je niet over

Vijf vragen, in &eacute;&eacute;n keer gesteld, en je begint niet zonder antwoord:

1. **De creative en de letterlijke belofte erin.** De pagina zet die belofte door in
   dezelfde woorden.
2. **Het product en de pakketladder**, plus of de winkelwagenlink het cadeau ook echt
   meelevert. Controleer dat met `cart.js` voordat je hem op de pagina zet.
3. **Welk bewijs mag, en waar het over gaat.** Een score over het assortiment is geen score
   over &eacute;&eacute;n apparaat.
4. **De bestemming**, en of de pagina binnen het thema draait.
5. **Het paginatype.** Zie hieronder; laat je keuze bevestigen voor je een regel copy of CSS
   schrijft.

## 3. Het paginatype bepaalt de ruggengraat

| Type | Kies als | Lees |
|---|---|---|
| Advertorial | Er is &eacute;&eacute;n mechanisme dat eerst uitgelegd moet worden; de volgorde ligt vast | `references/paginatype-advertorial.md` |
| Listicle | De punten zijn omwisselbaar; de lezer kent het probleem al | `references/paginatype-listicle.md` |
| Merkverhaal | Er is geen apparaat dat de pagina draagt; het gaat over het merk of de oprichter | `references/paginatype-merkverhaal.md` |

Twee toetsen, in deze volgorde. **Eerst:** gaat de creative over een apparaat of over het merk
en de oprichter? Geen apparaat dat de pagina draagt, dan is het een merkverhaal. **Daarna:**
kun je de punten omwisselen zonder dat het betoog omvalt? Kan dat, dan listicle; kan dat niet,
dan advertorial.

## 4. Waar het systeem staat

Alles hierboven is een samenvatting. De uitwerking staat in de bestaande skill, en die lees je
voordat je bouwt:

- `.claude/skills/sanwarwala-landing-pages/references/wellshave-merklaag.md` &mdash; de merklaag:
  workflow, tokens, typografie, knoppen, kaarten, beweging, bewijsregels, aanbodblok en
  publiceren. Volg hem vanaf stap 1.
- `.claude/skills/sanwarwala-landing-pages/references/paginatype-*.md` &mdash; de ruggengraat
  per type, en wat exclusief bij dat type hoort.
- `.claude/skills/sanwarwala-landing-pages/references/startbestand-*.html` &mdash; het skelet met
  blokhaken, per type. Begin daar, bouw niet vanaf nul.
- `.claude/skills/sanwarwala-landing-pages/references/redactioneel-register.md` &mdash; de
  redactionele variant binnen deze tak: serifkop, krantenbalk, persstrook, aanbod onderaan.
  Het merkverhaal staat daar altijd in. Wil je het volledige magazineframe met masthead,
  rubrieken en zijkolom, dan is dat de `nieuwsartikel` skill.
- `.claude/skills/sanwarwala-landing-pages/SKILL.md` &mdash; de conversielaag eronder: psychologie,
  anatomie, aanbodstructuur, onderzoek en testen.

## 5. Wat nooit mag afwijken

- **Tokens en letter.** Montserrat, `--sand:#F5F1EA`, `--ink:#111111`, `--bronze:#BC813E`,
  `--gold:#F5D18A`, `--carbon:#191816`. Het redactionele register is de enige uitzondering en
  argumenteert die zelf.
- **Nooit base64.** Beelden en stylesheet naar de Shopify CDN.
- **Alles in `<div class="gg-lp">`** en elke selector daarbinnen gescoopt, anders sloopt de
  reset de themaheader en -footer.
- **Alle niet-ASCII als `&#nnn;`** voor je plakt.
- **Op mobiel gaat wat gescand wordt opzij.** Geruststrook als doorlopende ticker,
  tintkaarten als tabpaar probleem/oplossing, pakketkaarten als schuifstrip met de rand
  van de volgende in beeld, kenmerkkaarten en de garantieregel 2 &times; 2. Boven elke
  strip een veegrij met een teller (`1 / 3`), eronder bolletjes waar je op kunt tikken.
  Lopende tekst, mechaniek en FAQ blijven een kolom, want die moet je lezen. Alles onder
  elkaar schuiven levert een pagina van vijftienduizend pixels op; meet de hoogte op
  390px voordat je oplevert. De regel en de CSS staan in deel 17 van de merklaag, de
  markup en het scriptje zitten al in de startbestanden.
- **Winkelwagenlinks geverifieerd**, inclusief de cadeauvariant, voordat ze op de pagina staan.
- **Elk cijfer nagewezen.** Bestellingen zijn geen personen, en bij elke review staat om welk
  apparaat het gaat.

## 6. Opleveren

Render op 1440 en 390 breed en controleer: geen horizontale overloop, alle beelden geladen,
tags in balans, geen JavaScript-fouten, en elke knop naar de juiste bestemming. Publiceer je
binnen het thema, lees dan achteraf via de API terug wat er opgeslagen is en tel de secties,
beelden, knoppen en kaarten; de editor schoont ongeldige markup stil op.
