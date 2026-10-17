# Fabrieksbezoek China 2026

Introductiedecks voor de bezoeken in China, in het Engels met vereenvoudigd Chinees eronder.
Huisstijl van wellshave.com: zand, carbon, brons en goud, Montserrat.

- **Global Best Way en Fanke** bezoeken we tegelijk, dus zij krijgen samen één deck van 16 slides.
- **iClipper** heeft een eigen deck van 9 slides.

## Global Best Way en Fanke

| Slide | Inhoud |
|---|---|
| 1 | Cover met beide bedrijven (Engels en Chinees), Jenny Huang en He Ting, en een foto van de Elite |
| 2 | Over Wellshave: opgericht 2021 in Helmond, NL + BE, bol.com en webshop, Trustpilot |
| 3 | Het team: Dustin Gibson, Willem de Groot, Leo |
| 4 | Waarom we komen, in vier stappen |
| 5 | Hun producten bij Wellshave: foto, verkochte stuks en retourpercentage per product |
| 6 | Klantenservice: de accu is defect nummer 1 (146 van de 215 defectmeldingen in 2026) |
| 7 | Elite: accu voorop, 37 van de 54 defectmeldingen gaan over de accu of het opladen |
| 8 | Neustrimmers |
| 9 | Baardtrimmers: Pro 8188 en Supreme 8988 |
| 10 | Scheerapparaten: Head Shaver Deluxe en Blade Baron |
| 11 | Bodygroomers: Groom Guard en Flex Guard |
| 12 | Drie verbeterpunten: kwaliteit (veilige mesjes, scheerkoppen voor een baard van drie dagen, accu), prijs, nieuwe modellen (slim lcd-display en nieuwe printplaat, legering, USB-C met siliconen klepje) |
| 13 | De Wellshave-standaard voor elk product: adapter die past bij het apparaat, accu, veilig laden, USB-C met siliconen klepje, complete doos, testen, plus de documenten die we vragen |
| 14 | Upgrade-ideeën voor scheerapparaten en baardtrimmers: eerst oplossen, dan toevoegen of verbeteren |
| 15 | Upgrade-ideeën voor bodygroomers en neustrimmers, met een schets van het nieuwe veilige mesje |
| 16 | Samples en aanraders, en bedankt |

Het deck toont alleen producten die we bij deze twee partijen inkopen. Het zegt niet welk
product via welke partij loopt.

Elke productslide heeft dezelfde opbouw:

- foto, model, verkochte stuks, retourpercentage en aantal defectmeldingen;
- één focuspunt: batterijproblemen staan altijd in een donker vlak, zodat ze eruit springen;
- naast elkaar de drie grootste defecten uit de klantenservice en de drie meest genoemde
  klachten uit de bol.com-reviews;
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
- **Defectmeldingen:** het defectenlogboek van de klantenservice (Service Desk), 1 januari
  t/m 15 oktober 2026, klanten van de webshop en bol.com samen.
  - Per melding is de categorie bepaald uit de klachttekst: accu of opladen, start niet of
    valt uit, aan/uit-problemen, kop of onderdeel kapot, motor of trekken, overig.
  - Staat er iets over laden, accu, batterij of het percentage in, dan telt de melding als
    accu of opladen.
  - De citaten in de donkere vlakken komen uit die meldingen, vertaald uit het Nederlands.
  - Mediaan van aankoop tot accumelding: 5 maanden bij de Elite, tot 13 maanden bij de Pro.

- **Accuspecificaties:** de proforma van Fanke (FK20260702001): Elite 600 mAh Li-ion met 60 minuten,
  Supreme 600 mAh Li-ion met 80 minuten, Pro 8188 een NiMH-accu van 2,4 V met 5 uur laadtijd.

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
- Slide 13 noemt de nieuwe EU-batterijverordening: vanaf 18 februari 2027 moeten accu's in nieuwe
  producten vervangbaar zijn. Voor apparaten die nat worden gelden uitzonderingen, en er ligt een
  wijziging klaar. Laat de precieze eisen voor scheerapparaten en trimmers checken.
- De Elite wordt verkocht met 90 minuten looptijd, maar de fabriek geeft 60 minuten op. Pas de
  listing aan of laat de accu vergroten.
- Slide 6 zegt dat we bij 97% van de defectmeldingen een nieuw apparaat sturen. Dat is een
  sterk argument voor betere kwaliteit, maar haal die tegel weg als je dat niet wilt delen.
