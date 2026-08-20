# Shotgrammatica

Hoe een cinematische productcommercial is opgebouwd, en waarom in die volgorde.

## De beatstructuur

Zes tot acht shots. Één brede opening, één brede afsluiter, en daartussen niets dan macro.
Een commercial die alleen maar het hele product laat zien is een catalogusfoto die beweegt;
een commercial die alleen macro is, laat de kijker nooit weten wat hij koopt. De verhouding
maakt het verschil: het brede shot vertelt *wat het is*, de macro's vertellen *waarom het goed
is*.

| # | Beat | Functie |
|---|---|---|
| 1 | **Opening** — product uit het donker, één lichtstreep glijdt eroverheen | Nieuwsgierigheid vóór herkenning |
| 2 | **Materiaal** — oppervlak vult het frame, licht schuift over de textuur | Kwaliteit voelbaar maken |
| 3 | **Bediening** — de knop, het lampje, het display dat aanspringt | Het tastbare moment |
| 4 | **Het werkende deel** — mesjes, kam, gaas, in beweging | De feature, zonder erover te praten |
| 5 | **Wat oplicht** — een LED, display of indicator die aanspringt in het donker | Techniek zichtbaar maken |
| 6 | **De reeks** — opzetstukken of onderdelen die één voor één door het licht gaan | Wat je allemaal krijgt |
| 7 | **Hero** — het hele product opnieuw, nu vol in het licht | Ademhalen voor de landing |
| 8 | **Eindshot** — product met vrije ruimte ernaast | Merknaam en claim landen |

Beat 2 tot en met 6 zijn inwisselbaar en uitbreidbaar; laat er gerust een weg als het product hem
niet heeft. Beat 1, 7 en 8 liggen vast.

Beat 5 verdient een eigen plek omdat een lampje dat in het donker aanspringt het enige moment is
waarop de film techniek *toont* in plaats van beweert. Zie `seedance-prompts.md` over het
lokaliseren van zo'n onderdeel voordat je het prompt.

## Waar het brede shot hoort

Niet twee brede shots achter elkaar aan het begin. Dat vertraagt precies daar waar je de kijker
moet vangen. Eén opening, dan direct de macro's in, en het tweede brede shot als
**heropvoering** vlak voor het einde. Daar werkt het: na vier of vijf close-ups is de kijker het
totaalbeeld even kwijt, en dat brede shot geeft het terug op het moment dat het ertoe doet.

## Tempo

Vijf seconden per shot bij 24 fps. Zes shots is dan precies dertig seconden; acht shots komt met
een ingekorte opening en afsluiter op ruim vijfendertig uit.

Het is verleidelijk om cinematisch te vertalen naar traag. Doe dat niet. Een shot waarin de
camera stilvalt voelt in een commercial als een haperende video, niet als rust. Schrijf in de
prompt altijd een **doorlopende** beweging met een **gematigd** tempo — niet "very slow", maar
"steady moderate continuous pace". De beweging moet aan het eind van de vijf seconden nog steeds
gaande zijn, zodat de cut hem afbreekt in plaats van opvangt.

Harde cuts, geen dissolves. Een dissolve tussen twee macro's leest als een diavoorstelling.

## Bewegingstaal per beat

| Beat | Camera |
|---|---|
| Opening | Push-in met lichte daling, eindigt strakker gekadreerd |
| Materiaal | Zijwaartse slider langs het oppervlak, ondiepe scherptediepte |
| Bediening | Kleine push, dan één snelle rack focus naar het detail |
| Werkend deel | Meelopen met de lengte van het onderdeel, dan focusverschuiving naar de rand |
| Wat oplicht | Trage drift naar binnen, camera stil genoeg om het aanspringen te laten landen |
| Reeks | Lage glide langs de onderdelen, elk vangt om beurten het licht |
| Hero | Trage orbit of stilstaand met bewegend licht |
| Eindshot | Rechte pull-back met minimale stijging, **niet** orbiten |

Die laatste is belangrijk. Een orbit op het eindshot laat het product door het kader wandelen,
en dan staat je vrije ruimte aan het eind aan de verkeerde kant.

## Het eindshot en de vrije ruimte

Het eindshot moet plek overhouden voor de merknaam. Schrijf expliciet in welke helft van het
kader het product staat én dat het daar blijft — anders drijft het naar het midden en heb je
nergens ruimte.

Kies de kant bewust: tekst rechts leest natuurlijker in het Latijnse schrift, maar als het
product van links belicht wordt, staat het beter andersom. Controleer achteraf op de
contactstrook aan welke kant de ruimte werkelijk is uitgekomen, niet aan welke kant je hem
gevraagd hebt.

## Licht

Eén harde sleutellichtbron, diep zwarte achtergrond, en een dun warm randlicht dat de vorm
aftekent. Nevel in de lucht maakt de lichtbundel zichtbaar en geeft diepte.

Houd het randlicht **strikt op de rand**. Vraag je om een gouden randlicht zonder die
beperking, dan trekt het model de hele behuizing goudkleurig, en een mat zwart product wordt
champagne. Schrijf het er letterlijk bij: het randlicht raakt alleen de contour, de behuizing
blijft de kleur die hij is.

## Compositie versus annotatie

De annotatielaag komt standaard linksonder. Kadreer daar dus geen belangrijk detail, en
controleer per shot of dat hoekje donker genoeg is. Is het dat niet — een verlichte steenplaat,
een lichte reflectie — verplaats dan de annotatie van dát shot naar linksboven in plaats van de
opname over te doen. Een annotatie verplaatsen is gratis, een shot opnieuw draaien kost credits.
