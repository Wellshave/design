# Fabrieksbezoek China 2026

Introductiedeck van 8 slides voor de bezoeken aan Global Bestway, iClipper en FANKE, in het
Engels met vereenvoudigd Chinees eronder. Huisstijl van wellshave.com: zand, carbon, brons en
goud, Montserrat.

| Slide | Inhoud |
|---|---|
| 1 | Cover, met de naam van de fabriek |
| 2 | Over Wellshave: opgericht 2021, NL + BE, bol.com en webshop, Trustpilot |
| 3 | Assortiment in zes categorieën |
| 4 | Het team: Dustin, Willem, Leo |
| 5 | Waarom we komen, in vier stappen |
| 6 | Drie verbeterpunten: kwaliteit (batterijen, adapter met vaste kabel), prijs, nieuwe modellen |
| 7 | Onze producten bij deze fabriek, met volumes 2026 en prognose 2027 |
| 8 | Samples en aanraders, en bedankt |

## Wat staat waar

- `uitvoer/` bevat per fabriek een `.pptx` en een `.pdf`.
- `fabrieken.json` bevat de fabrieken, de bezoekmaand en per fabriek de producten en volumes.
- `bouw-deck.js` bouwt de decks.
- `assets/` bevat het logo, de coverfoto en de productfoto's, allemaal van wellshave.com.

## Producten en volumes invullen

Vul per fabriek `producten` in `fabrieken.json`, in de vorm van `voorbeeld_product`, en bouw
opnieuw:

```bash
npm install
node bouw-deck.js                  # alle fabrieken
node bouw-deck.js Global-Bestway   # alleen deze
```

Zolang `producten` leeg is, staan op slide 7 gemarkeerde invulvelden. Vul de kolom `focus`
tweetalig in (`"Battery life · 电池续航"`), want de fabriek leest het Chinees.

De PDF maak je met LibreOffice: `soffice --headless --convert-to pdf --outdir uitvoer uitvoer/*.pptx`.

## Lettertypen

Montserrat is gratis via Google Fonts, maar moet geïnstalleerd zijn op de laptop waarop je
presenteert. Zonder het font valt PowerPoint terug op een ander lettertype en klopt de opmaak
niet meer. In de PDF zitten de lettertypen ingebakken; presenteer bij twijfel vanuit de PDF.

Het Chinees staat in Microsoft YaHei. Op een Mac zonder dat font valt het terug op PingFang,
wat er vrijwel hetzelfde uitziet.

## Nog open

- Producten en volumes per fabriek (slide 7).
- Slide 2 noemt de omzet van 2026, ongeveer €2,5M via bol.com en €0,6M via de webshop.
  Haal die twee tegels weg als je die cijfers niet met fabrieken wilt delen.
