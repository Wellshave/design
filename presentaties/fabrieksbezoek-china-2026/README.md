# Fabrieksbezoek China 2026

Introductiedecks voor de bezoeken in China, in het Engels met vereenvoudigd Chinees eronder.
Huisstijl van wellshave.com: zand, carbon, brons en goud, Montserrat.

- **Global Best Way en Fanke** bezoeken we tegelijk, dus zij krijgen samen één deck van 12 slides.
- **iClipper** heeft een eigen deck van 9 slides.

## Global Best Way en Fanke

| Slide | Inhoud |
|---|---|
| 1 | Cover met beide bedrijven (Engels en Chinees), Jenny Huang en He Ting, en een foto van de Elite |
| 2 | Over Wellshave: opgericht 2021 in Helmond, NL + BE, bol.com en webshop, Trustpilot |
| 3 | Het team: Dustin Gibson, Willem de Groot, Leo |
| 4 | Waarom we komen, in vier stappen |
| 5 | Hun producten bij Wellshave: foto, verkochte stuks en retourpercentage per product |
| 6 | Elite: batterij voorop ("Many customers report a broken battery"), klachten en onze vraag |
| 7 | Neustrimmers |
| 8 | Baardtrimmers: Pro 8188 en Supreme 8988 |
| 9 | Scheerapparaten: Head Shaver Deluxe en Blade Baron |
| 10 | Bodygroomers: Groom Guard en Flex Guard |
| 11 | Drie verbeterpunten: kwaliteit (batterijen, adapter met vaste kabel), prijs, nieuwe modellen |
| 12 | Samples en aanraders, en bedankt |

Het deck toont alleen producten die we bij deze twee partijen inkopen. Het zegt niet welk
product via welke partij loopt.

Elke productslide heeft dezelfde opbouw:

- foto, model, verkochte stuks, retourpercentage en aantal kritische reviews;
- één focuspunt: batterijproblemen staan altijd in een donker vlak, zodat ze eruit springen;
- de drie meest genoemde klachten;
- wat we van de fabriek vragen.

## iClipper

| Slide | Inhoud |
|---|---|
| 1 | Cover met de volledige bedrijfsnaam (Engels en Chinees) en de contactpersoon |
| 2 | Over Wellshave |
| 3 | Assortiment in zes categorieën |
| 4 | Het team |
| 5 | Waarom we komen |
| 6 | Hun producten bij Wellshave: verkochte stuks en retourpercentage in 2026 |
| 7 | Wat klanten zeggen: kritische reviews per thema met een citaat |
| 8 | Drie verbeterpunten |
| 9 | Samples en aanraders, en bedankt |

## Wat staat waar

- `uitvoer/` bevat per deck een `.pptx` en een `.pdf`.
- `fabrieken.json` bevat per bezoek:
  - de bedrijven en contactpersonen;
  - de producten met verkoopcijfers, foto, focuspunt, klachten en vragen;
  - welke producten samen op een slide staan.
- `bouw-deck.js` bouwt de decks.
- `assets/` bevat:
  - het logo en de coverfoto's;
  - de productfoto's van wellshave.com, of van bol.com waar de webshop een ander model toont
    (Head Shaver Deluxe, G-Series).

## Waar de cijfers vandaan komen

- **Leverancier per product:** de productlijst en de lijst met open orders van WeSourcely
  op Drive (`All produts list-WellShave`, `Wellshave Open order`), gekoppeld op EAN.
- **Verkochte stuks en retouren:** bol.com via MarktMentor, 1 januari t/m 15 oktober 2026.
  De webshop zit er niet in.
- **Klachten per product:** alle bol.com-reviews met 1 tot 3 sterren op de EAN's van dat
  product in dezelfde periode, met de hand ingedeeld.
  - Een review kan onder meer klachten vallen.
  - De citaten zijn vertaald uit het Nederlands.
- **Batterij bij de Elite:** de kop "Many customers report a broken battery" komt van Dustin,
  op basis van de klantmeldingen. In de bol.com-reviews van 2026 gaan 3 van de 28 kritische
  reviews over de batterij; de meeste gaan over het scheerresultaat. De drie citaten op de
  slide komen uit die reviews.

## Opnieuw bouwen

```bash
npm install
node bouw-deck.js                       # alle decks
node bouw-deck.js GlobalBestWay-Fanke   # alleen deze
```

De PDF maak je met LibreOffice: `soffice --headless --convert-to pdf --outdir uitvoer uitvoer/*.pptx`.

## Lettertypen

Montserrat is gratis via Google Fonts, maar moet geïnstalleerd zijn op de laptop waarop je
presenteert. Zonder het font valt PowerPoint terug op een ander lettertype en klopt de opmaak
niet meer. In de PDF zitten de lettertypen ingebakken; presenteer bij twijfel vanuit de PDF.

Het Chinees staat in Microsoft YaHei. Op een Mac zonder dat font valt het terug op PingFang,
wat er vrijwel hetzelfde uitziet.

## Nog open

- Prognose 2027 per fabriek. Het deck zegt nu dat die in het gesprek gedeeld wordt.
- Slide 2 noemt de omzet van 2026, ongeveer €2,5M via bol.com en €0,6M via de webshop.
  Haal die twee tegels weg als je die cijfers niet met fabrieken wilt delen.
- Elite: heeft de klantenservice een aantal of percentage kapotte batterijen? Dan kan dat
  getal in de kop op slide 6.
