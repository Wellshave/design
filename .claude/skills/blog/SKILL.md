---
name: blog
description: Schrijf, bouw en zet SEO-blogartikelen voor de Wellshave-blog (wellshave.com/blogs/nieuws) klaar in Shopify, vier per week, met keywordonderzoek, het huisstijl-ontwerp, FAQ-schema en altijd een passend Wellshave-product als advies. ALWAYS use this skill when the user asks for a blog, blogartikel, blogpost, SEO-artikel, kennisbankartikel, vergelijkingsblog, "de blogs van deze week", "maak de vier blogs", "contentplan", "keywordonderzoek voor de blog", or wants an existing Wellshave blog article rewritten, extended or audited. Trigger ook op "schrijf iets over scheerbultjes / ingegroeide haren / baardgroei / [probleem]" als het om de website gaat, en op de wekelijkse geplande taak die om nieuwe blogs vraagt. Niet voor advertorials of landingspagina's bij een advertentie; daarvoor zijn `design-advertorial` en `nieuwsartikel`.
---

# Wellshave-blog

Elke week vier artikelen die gevonden worden op wat mannen werkelijk intypen, die het probleem
eerlijk oplossen, en die eindigen bij een Wellshave-product dat dat probleem aanpakt. Ze komen als
**concept** in Shopify; publiceren doet een mens.

Wat specifiek Wellshave is (kleuren, toon, cijferregels, beeld) staat in de merklaag:
`../sanwarwala-landing-pages/references/wellshave-merklaag.md`. Lees deel 3 tot 5, 11, 12 en 13
voor je schrijft. Bij tegenspraak wint de merklaag, behalve waar dit bestand iets blogspecifieks
zegt.

## Bestanden

| Pad | Wat |
|---|---|
| `blogs/contentplan.md` (repo-root) | Planning per week, status, en de lijst van wat al bestaat |
| `blogs/<jaar>-w<week>/<onderwerp>.html` | Bron per artikel: `<!--meta {json}-->` plus de inhoud |
| `scripts/keywords.py` | Zoekvraag ophalen uit Google-autocomplete (NL) |
| `scripts/bouw.py` | Bouwt body, preview en payload, en controleert alles |
| `scripts/linkcheck.py` | 404-controle op alle gepubliceerde artikelen, ook omleidingen naar de homepage |
| `assets/wellshave-blog.css` | Alle componenten, op de Shopify-CDN als `wellshave-blog-N.css` |
| `data/config.json` | CSS-URL op de CDN, blog-ID, auteur, sjabloon |
| `data/seeds.txt`, `data/keywords-*.json` | Zaadwoorden en ruwe zoekdata |

**Begin bij een bestaand artikel uit `blogs/2026-w48/`, niet bij nul.** Die vier tonen elk
component in gebruik; kopieer de structuur en vervang de inhoud.

## De wekelijkse werkwijze

1. **Pak de week uit `blogs/contentplan.md`.** Staat de week er niet in, kies dan vier onderwerpen
   uit de keyworddata: drie probleemgedreven, één vergelijking. Check eerst of het onderwerp al
   bestaat (lijst onderaan het plan, en `blog.articles` in Shopify). Geen kannibalisatie: twee
   artikelen op hetzelfde hoofdkeyword concurreren met elkaar.
2. **Haal de zoekvraag op** voor elk hoofdkeyword:
   `python3 scripts/keywords.py --diep "scheerirritatie" > /tmp/kw.json`. Kies het hoofdkeyword en
   vijf tot acht varianten. Varianten met een vraagvorm ("wat te doen", "hoe lang", "gaat niet
   weg") worden H2's of FAQ-vragen.
3. **Haal de productfeiten live op**, nooit uit je geheugen: `wellshave.com/products.json?limit=250`
   en de productpagina. Alleen kenmerken die daar staan mogen in de productkaart. Kies per artikel
   één hoofdproduct en hooguit één tweede, en het product moet het probleem uit het artikel echt
   aanpakken.
4. **Schrijf de bron** (zie de opbouw hieronder) in `blogs/<jaar>-w<week>/`.
5. **Bouw en controleer:** `python3 scripts/bouw.py blogs/.../x.html --links`. Exitcode 1 is een
   harde fout; "let op" zijn aandachtspunten. Los fouten op, wegen de waarschuwingen.
6. **Bekijk de preview** op 390px en 1200px (`dist/<handle>.preview.html`): geen horizontale
   overloop, beelden laden, productkaart en tabel leesbaar.
7. **Zet in Shopify als concept** met `articleCreate`, input uit `dist/<handle>.payload.json`
   (`isPublished:false`). Stuur de body als UTF-8 (de entiteitenversie is voor plakken in de
   editor, niet nodig via de API).
8. **Lees terug** via de API en vergelijk de body met wat je stuurde (witruimte tussen tags
   negeren: Shopify formatteert die). Tel H2's, productkaarten, FAQ's, beelden en links.
9. **Werk het contentplan bij** (status `concept`), commit, en meld de admin-links:
   `https://admin.shopify.com/store/wellshave/content/articles/<numeriek id>`.
10. **Draai de 404-controle** op de live blog: `python3 scripts/linkcheck.py`. Meld alles wat
    `KAPOT` of `HOMEPAGE` is, met het artikel waarin het staat. Repareer een dood adres bij voorkeur
    met een omleiding naar de best passende pagina (`urlRedirectUpdate` als er al een omleiding
    naar `/#gbaid…` staat, anders `urlRedirectCreate`). Een omleiding vangt ook externe links op en
    overleeft het opnieuw opslaan van een artikel in Bloggle.

## Opbouw van een artikel

In deze volgorde. Het sjabloon `bloggle-custom` zet de titel (H1), datum, leestijd en het
artikelbeeld er zelf boven; begin de body dus nooit met een H1 of een eigen hero.

1. `p.wsb-lede`: twee, drie zinnen die de situatie van de lezer herkenbaar maken.
2. `div.wsb-answer` "Kort antwoord": het antwoord in 40 tot 80 woorden, met een korte lijst. Dit
   blok is wat Google en AI-overzichten oppakken. Het hoofdkeyword staat erin.
3. `<!--toc-->`: wordt bij het bouwen de inhoudsopgave uit de H2's.
4. Vier tot zeven H2-secties, elk in het tweeslagsformaat:
   `<h2>Kop met keyword<span class="b">tweede regel met de opluchting.</span></h2>`. De eerste regel
   draagt het zoekwoord, want alleen die komt in de inhoudsopgave.
5. Ten minste één `div.wsb-product`, op de plek waar het probleem net is uitgelegd en de oplossing
   logisch volgt. Nooit als eerste blok.
6. FAQ: `div.wsb-faq` met vier tot zes `details/summary`. Het bouwscript maakt er FAQPage-schema
   van. Vragen woordelijk uit de autocompletedata waar dat kan.
7. `h2.wsb-skip` "Verder lezen" met `ul.wsb-related` (vier interne links).
8. `div.wsb-end` afsluiter op donker met een knop.
9. `div.wsb-bron`: bronnen en, bij gezondheid, "vervangt geen medisch advies".

Componenten om te gebruiken waar ze passen: `wsb-tints` (probleem, probleem, oplossing),
`wsb-steps` (genummerde stappen), `wsb-tabel` (vergelijking, met `td.wij` voor de Wellshave-kolom),
`wsb-keuze` (kies dit als / kies dat als), `wsb-note` (wanneer naar de huisarts), `figure`.

## Harde regels

Het bouwscript bewaakt de meeste; de rest is aan jou.

- **Lengte en structuur:** minimaal 1.100 woorden, vier H2's, vier FAQ's, twee interne bloglinks,
  een productlink, een productkaart en een kort-antwoordblok.
- **SEO-titel max 60 tekens, meta-omschrijving 110 tot 158**, hoofdkeyword in titel, in de eerste
  120 woorden en in de omschrijving.
- **Geen em-dash** (huisregel: gebruik een komma). Geen H1 in de body.
- **Garantie is 2 jaar, proefperiode 100 dagen.** Niet "levenslang": dat staat foutief in een ouder
  artikel en mag niet worden overgenomen. Trustpilot alleen als "4,5/5 (Wellshave, 1.000+
  reviews)", met het bereik erbij, zoals op de site.
- **Geen prijzen van Wellshave-producten in de tekst.** Ze wisselen met acties en het artikel blijft
  jaren staan. De productpagina toont de actuele prijs. Prijzen van een concurrent alleen met maand
  en bron erbij.
- **Geen tijdelijke acties** (Black Friday, kortingscodes) in een evergreen artikel.
- **Productknoppen gaan naar de productpagina**, niet naar een winkelwagenpermalink. Een bloglezer
  is aan het oriënteren; op een landingspagina na een advertentie is dat anders.
- **Gezondheid:** leg het mechanisme uit in gewone woorden, beloof geen genezing, noem wanneer naar
  de huisarts, en verzin geen medische cijfers. Bronnen erbij.
- **Vergelijkingen met een concurrent:** alleen controleerbare feiten, bron erbij, merkvermelding en
  "niet verbonden aan" in de bronregel, en zeg eerlijk waar het andere product sterk is. Dat maakt
  het advies geloofwaardig en houdt het binnen de regels voor vergelijkende reclame.
- **Toon (merklaag deel 12):** pijn zonder schaamte. Het gereedschap is het probleem, niet de lezer.
  "Vergevend" werkt beter dan "veilig".
- **Beeld:** eigen fotografie uit Shopify Files of de productbeelden. Geen beelden met ingebakken
  advertentietekst in de lopende tekst. Nooit gegenereerd beeld als bewijs (voor-en-na, huid).
  Bekijk een beeld voordat je het gebruikt; de bestandsnaam zegt niets.

## Omleidingen en 404's

- **Een app zet dode adressen om naar de homepage** (doel `/#gbaid…`). Op 24 november 2026 waren dat
  er 5.470 van de 5.715. Google behandelt dat als soft 404 en de bezoeker komt nergens; de
  `linkcheck` meldt het als `HOMEPAGE`. Alles onder `/blogs/` is toen naar een passend artikel of
  een passende collectie gezet; de rest (vooral producten, oude talen en adressen met
  trackingparameters) is nog niet nagelopen.
- **Een omleiding mag niet naar een adres wijzen dat zelf omgeleid wordt.** Shopify weigert dat.
  `/collections/ladyshave` is zo'n adres (niet online), dus daar `/collections/all`.
- **Taalvoorvoegsels** (`/nl-de/…`) volgen de omleiding van het kale pad, behalve waar er een eigen
  omleiding voor het voorvoegselpad bestaat.
- **Bloggle-artikelen** worden opnieuw gegenereerd als iemand ze in de Bloggle-app bewaart. Een
  wijziging die je via de API in de body zet, kan dan verdwijnen. Zet linkreparaties daarom liever
  in een omleiding, en controleer na een Bloggle-bewerking of de tekst nog klopt.

## Auteur

Alle artikelen staan op naam van **Team Wellshave**, ook de oudere. Gebruik geen persoonsnaam.

## Technisch

- **De stylesheet** staat op de CDN (`data/config.json`). Wijzig je `assets/wellshave-blog.css`,
  upload dan onder een nieuwe naam (`wellshave-blog-2.css`) via `stagedUploadsCreate`, POST,
  `fileCreate`, en zet de nieuwe URL in de config. Oude artikelen houden hun oude link; dat is de
  bedoeling.
- **Alles hangt onder `#wsb`.** Het ID wint van de `.bloggle_rte p`-regel van het thema (14px) en
  laat de rest van de winkel ongemoeid.
- **Sjabloon `bloggle-custom`** geeft dezelfde kop, datum, leestijd en artikelbeeld als de
  bestaande artikelen. Het artikelbeeld (liggend) is het `image`-veld, niet een beeld in de body.
- **Links naar artikelen uit dezelfde week** geven een 404 tot ze live staan; het bouwscript slaat
  die over. Publiceer een week dus in zijn geheel, of haal de link weg.
- **SEO-velden** gaan als metafields `global.title_tag` en `global.description_tag`.

## Wat deze skill nog niet weet

- **Geen zoekvolumes.** Autocomplete laat zien wat gezocht wordt, niet hoe vaak. Met Ahrefs of
  Search Console erbij kan het contentplan op volume en moeilijkheid worden gerangschikt.
- **Geen resultaten.** Na vier tot acht weken: Search Console per artikel (vertoningen, positie,
  klikken) en Shopify-analytics (sessies vanaf blog naar product). Wat wint, hoort hier.
