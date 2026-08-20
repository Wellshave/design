# De annotatielaag

Tekst over de film: USP's, tussentitels en de eindkaart. Kost nul credits en is onbeperkt te
herzien.

## Waarom lokaal en niet gegenereerd

Een videomodel dat tekst tekent, tekent tekst die er *bijna* uitziet als tekst. Letters vallen
om, spaties verspringen, en het merkwoord dat op de behuizing staat kan halverwege het shot in
spiegelbeeld kantelen. Bovendien kost elke herziening opnieuw credits.

Ingebrande vectortekst is scherp, frame-accuraat getimed, exact in de merkkleur, en gratis te
wijzigen. Er is geen situatie waarin je het anders zou willen.

## Waarom ASS en niet drawtext

`drawtext` in ffmpeg kent geen letterspatiëring, en Wellshave-typografie leunt juist op ruime
tracking in kapitalen. Een ASS-ondertitelbestand kent wel `Spacing`, plus in- en uitvloeiers
(`\fad`), exacte positionering (`\pos`) en tekenprimitieven voor het gouden lijntje. Inbranden
gaat met het `subtitles`-filter.

## Het variabele-font-probleem

Het themabestand van wellshave.com is een variabel Montserrat met de as `wght` van 100 tot 900,
en **standaardinstantie 100**. libass kan variabele assen niet aansturen en rendert dus Thin —
haarfijn en op video onleesbaar.

Daarom staan er twee statische instanties in `assets/fonts/`: Medium (500) voor de regels en
SemiBold (600) voor de labels. `scripts/maak-fonts.py` leidt ze opnieuw af als het merkfont op
de site verandert.

Het bestand heet `.ttf` maar is in werkelijkheid WOFF2; het script pakt dat uit.

## Kleuren omrekenen

ASS schrijft kleuren als `&HAABBGGRR` — alfa vooraan en **de kanalen omgekeerd** ten opzichte
van hex. `00` betekent volledig dekkend.

| Merktoken | Hex | ASS |
|---|---|---|
| `--gold` | `#F5D18A` | `&H008AD1F5` |
| `--paper` | `#FFFFFF` | `&H00FFFFFF` |
| `--ink` | `#111111` | `&H00111111` |

Goud is in de merklaag gedefinieerd als het accent op donker, en cinematisch beeld is donker.
`--bronze` (`#BC813E`) is het accent op licht en hoort hier vrijwel nooit.

## De opmaak

Twee regels plus een lijntje, linksonder, op 1920×1080:

| Element | Stijl | Grootte | Tracking | Kleur | Positie |
|---|---|---|---|---|---|
| Lijntje | rechthoek 56×2 | — | — | goud | x 130, y 838 |
| Label | SemiBold, kapitaal | 26 | 4.5 | goud | x 130, y 862 |
| Regel | Medium, zinshoofdletter | 56 | 1.2 | wit | x 130, y 900 |

Eindkaart rechts in de vrije ruimte: SemiBold 64 wit op y 470, daaronder SemiBold-klein 30 goud
met ruime tracking op y 562.

Geen kader, geen balk achter de tekst — dat leest goedkoop. `\shad2` volstaat op donker beeld.
Valt een annotatie toch over een verlicht vlak, verplaats hem dan naar linksboven (lijntje 140,
label 164, regel 202) in plaats van er een balk onder te leggen.

**Timing per shot:** verschijnen 0,65 s na de cut, verdwijnen 0,40 s ervoor, met `\fad(300,300)`.
Label en regel komen 0,08 s na elkaar binnen, zodat het oog van boven naar beneden meeleest.

## De copy

Elke annotatie is één goud label plus één witte regel.

- **Label:** de feature, in kapitalen, twee tot vier woorden. `SKIN SAFE-TECHNOLOGIE`, `3-IN-1`
- **Regel:** wat het voor de kijker betekent, één korte zin zonder punt. Vijf woorden leest in
  vier seconden, twaalf niet.

Het label noemt wat het ís, de regel wat het dóét. Twee keer hetzelfde zeggen is een gemiste
annotatie.

**Elke claim moet herleidbaar zijn tot de productomschrijving.** Dit is dezelfde discipline als
§10 van de merklaag, en het geldt hier extra: een regel over beeld leest als vaststaand feit.
Geen batterijduur, geen scheertijden, geen materialen die bij een ander artikel horen. Zet de
bron per regel in je verantwoording naar de gebruiker.

Voorbeeld uit de Flex Guard-film, met de bronzin ernaast:

| Label | Regel | Bron in de productomschrijving |
|---|---|---|
| NAT OF DROOG | Gewoon mee de douche in | "Gebruik hem nat of droog" |
| LED-LICHT | Je ziet precies wat je doet | "het geïntegreerde LED-licht voor ultieme precisie" |
| SKIN SAFE-TECHNOLOGIE | Geen sneetjes, geen irritatie | "voorkomt irritatie & sneetjes" |
| CONSTANTE KRACHT | Een motor die niet hapert | "constante kracht zonder hapering" |

## Renderen

```bash
ffmpeg -i film-schoon.mp4 \
  -vf "subtitles=annotaties.ass:fontsdir=assets/fonts" \
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p uit.mp4
```

`fontsdir` is niet optioneel — zonder die verwijzing vindt libass de merkgewichten niet en valt
het terug op een systeemfont. Controleer na het renderen altijd één frame per annotatie, want
die terugval geeft geen foutmelding.

`-pix_fmt yuv420p` is nodig omdat Seedance HEVC 10-bit levert en dat lang niet overal afspeelt.

## Meeleveren aan de gebruiker

Naast de gemonteerde film ook de schone versie zonder tekst, het `.ass`-bestand, de twee
fontbestanden en een leesmij met het render-commando hierboven. Dan kan de copy worden
aangepast zonder credits en zonder jou.
