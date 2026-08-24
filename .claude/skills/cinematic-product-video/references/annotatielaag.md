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

## Bijzondere tekens

ASS kent geen HTML-entiteiten. `&#176;` en `&#8482;` komen letterlijk in beeld te staan. Schrijf
`°`, `™` en `é` gewoon als UTF-8 in het bestand; libass rendert ze correct uit de meegeleverde
fontgewichten.

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

Is ook linksboven verlicht — bij een macro die het hele kader vult, gebeurt dat — wijk dan uit
naar rechtsboven op `x 1060` met dezelfde y-waarden als linksboven. De langste regel blijft dan
ruim binnen het kader. In de Gentleman Shaver-film gold dat voor het materiaalshot: het gouden
paneel veegde door de linkeronderhoek.

### Kies die positie met een meting, niet met je oog

Een hoek die op een stilstaand frame donker lijkt, kan halverwege het shot vollopen. Meet de
gemiddelde helderheid van het annotatievlak op drie momenten per shot en vergelijk de hoeken:

```python
from PIL import Image, ImageStat
zones = {'linksonder': (100,810,900,970), 'linksboven': (100,110,900,240),
         'rechtsonder': (1020,810,1820,970), 'rechtsboven': (1020,110,1820,240)}
im = Image.open('frame.png').convert('L')
for naam, vak in zones.items():
    print(naam, round(ImageStat.Stat(im.crop(vak)).mean[0], 1))
```

Onder de 45 op een schaal van 255 leest witte tekst met `\shad2` moeiteloos; boven de 90 niet
meer. Het materiaalshot mat 24 aan het begin en 112 halverwege — precies het geval dat je op één
frame mist.

**Timing per shot:** verschijnen 0,65 s na de cut, verdwijnen 0,40 s ervoor, met `\fad(300,300)`.
Label en regel komen 0,08 s na elkaar binnen, zodat het oog van boven naar beneden meeleest.

## De copy

Elke annotatie is één goud label plus één witte regel.

- **Label:** de feature, in kapitalen, twee tot vier woorden. `SKIN SAFE-TECHNOLOGIE`, `3-IN-1`
- **Regel:** wat het voor de kijker betekent, één korte zin zonder punt. Vijf woorden leest in
  vier seconden, twaalf niet.

Het label noemt wat het ís, de regel wat het dóét. Twee keer hetzelfde zeggen is een gemiste
annotatie.

**Elke claim moet herleidbaar zijn tot de productpagina.** Dit is dezelfde discipline als §10
van de merklaag, en het geldt hier extra: een regel over beeld leest als vaststaand feit. Geen
batterijduur, geen scheertijden, geen materialen die bij een ander artikel horen. Zet de bron
per regel in je verantwoording naar de gebruiker.

**En de claim moet passen bij wat er op dát moment in beeld is.** Dit is de tweede toets, en de
makkelijkste om over te slaan. In de eerste versie van de Flex Guard-film stond boven het shot
van het bedieningspaneel "LED-LICHT — je ziet precies wat je doet". Volkomen waar, netjes te
herleiden tot de productomschrijving, en tóch fout: het shot toont het display met het
batterijpercentage, niet het lampje dat de huid verlicht. De kijker leest de regel en zoekt in
beeld naar iets wat er niet is.

Loop daarom elke annotatie twee keer na: klopt de claim, en gaat het shot eronder daadwerkelijk
over die claim. Een juiste claim op het verkeerde shot is alsnog een fout, en hij kost je niets
om te herstellen — dus er is geen excuus om hem te laten staan.

Voorbeeld uit de Flex Guard-film, met de bronzin ernaast:

| Label | Regel | Bron op de productpagina |
|---|---|---|
| NAT OF DROOG | Gewoon mee de douche in | "Geschikt voor nat en droog trimmen" |
| LED-DISPLAY | Je ziet precies hoeveel er nog in zit | "LED display" in de specificaties |
| SKIN SAFE-TECHNOLOGIE | Geen sneetjes, geen irritatie | "voorkomt irritatie & sneetjes" |
| 3-IN-1 | Trimmen, scheren, neushaar verwijderen | "Bodytrimmer / Foil shaver / Neustrimmer opzetstuk" |
| CONSTANTE KRACHT | Een motor die niet hapert | "constante kracht zonder hapering" |

Let bij dat laatste voorbeeld op de volgorde: noem de opzetstukken in de volgorde waarin ze in
beeld staan, en gebruik de namen die de productpagina zelf hanteert. "Detailleren" klinkt
aantrekkelijker dan "neushaar verwijderen", maar het is niet wat het opzetstuk is en niet wat de
klant koopt.

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
