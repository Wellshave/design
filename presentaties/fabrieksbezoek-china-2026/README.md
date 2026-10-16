# Fabrieksbezoek China 2026

Introductiedeck van 9 slides voor de bezoeken aan Global Best Way, iClipper en FANKE, in het
Engels met vereenvoudigd Chinees eronder. Huisstijl van wellshave.com: zand, carbon, brons en
goud, Montserrat. Elk deck is gepersonaliseerd voor de partij die we bezoeken.

| Slide | Inhoud |
|---|---|
| 1 | Cover met de volledige bedrijfsnaam (Engels en Chinees) en de contactpersoon |
| 2 | Over Wellshave: opgericht 2021 in Helmond, NL + BE, bol.com en webshop, Trustpilot |
| 3 | Assortiment in zes categorieën |
| 4 | Het team: Dustin Gibson, Willem de Groot, Leo |
| 5 | Waarom we komen, in vier stappen |
| 6 | Hun producten bij Wellshave: verkochte stuks en retourpercentage in 2026 |
| 7 | Wat klanten zeggen: kritische reviews op hun producten, per thema met een citaat |
| 8 | Drie verbeterpunten: kwaliteit (batterijen, adapter met vaste kabel), prijs, nieuwe modellen |
| 9 | Samples en aanraders, en bedankt |

Elk deck toont alleen de producten die we via die partij inkopen.

## Wat staat waar

- `uitvoer/` bevat per fabriek een `.pptx` en een `.pdf`.
- `fabrieken.json` bevat per fabriek de bedrijfsnamen, de contactpersoon, de producten met
  verkoopcijfers en de reviewthema's.
- `bouw-deck.js` bouwt de decks.
- `assets/` bevat het logo, de coverfoto en de productfoto's, allemaal van wellshave.com.

## Waar de cijfers vandaan komen

- **Leverancier per product:** de productlijst en de lijst met open orders van WeSourcely
  op Drive (`All produts list-WellShave`, `Wellshave Open order`), gekoppeld op EAN.
- **Verkochte stuks en retouren:** bol.com via MarktMentor, 1 januari t/m 15 oktober 2026.
  De webshop zit er niet in.
- **Reviewthema's:** alle bol.com-reviews met 1 tot 3 sterren op de EAN's van die fabriek
  in dezelfde periode, met de hand ingedeeld. Een review kan onder meer thema's vallen. De
  citaten zijn vertaald uit het Nederlands.

## Opnieuw bouwen

```bash
npm install
node bouw-deck.js                  # alle fabrieken
node bouw-deck.js Global-Bestway   # alleen deze
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
