# De muzieklaag

Eén spoor onder de hele film, achteraf gelegd. Net als de tekst kost het nul credits en is het
onbeperkt te herzien.

## Waarom achteraf en niet uit het model

Elke clip wordt met `generate_audio: false` gegenereerd. Zet je dat aan, dan levert elke
generatie zijn eigen ruistapijt op, en zes tot acht van die tapijten botsen in de montage tegen
elkaar. Een commercial heeft één doorlopende muzieklaag, geen acht stukjes sfeer.

De gebruiker levert de track aan. Vraag ernaar als er geen is — dit is niets om zelf te
verzinnen, en het is een rechtenkwestie die niet bij jou ligt.

## Kies het fragment op de vorm van de film

Een cinematische productfilm heeft een vaste boog: donker begin, macro's ertussen, hero en
merknaam aan het eind. De muziek hoort diezelfde boog te lopen. Zoek dus geen "mooi stuk", maar
een stuk dat **stijgt** over precies de lengte van je film.

Meet daarvoor de energie van de hele track per vijf seconden:

```python
import numpy as np
sr = 22050                                   # decodeer eerst: ffmpeg -i track.mp3 -ac 1 -ar 22050 -f f32le mono.raw
x = np.fromfile('mono.raw', dtype=np.float32)
h = sr // 2
rms = np.array([np.sqrt(np.mean(x[i*h:(i+1)*h]**2)) for i in range(len(x)//h)])
db = 20*np.log10(np.maximum(rms, 1e-6))
for s in range(0, int(len(x)/sr), 5):
    print(f'{s:>4}s {db[s*2:(s+5)*2].mean():6.1f}')
```

Wat je zoekt is een venster ter lengte van de film waarin die waarde oploopt. In de Gentleman
Shaver-film was dat 60,55 tot 96,76 seconde: de heringang vlak na een breakdown, waarna de track
doorbouwt. Onder de opening zat de muziek op −16 dB, onder het eindshot op −11,6 dB.

**Begin bij voorkeur op een heringang.** Een breakdown gevolgd door een inzet geeft je precies
wat de opening nodig heeft: stilte, dan iets dat begint. Zoek die plek met dezelfde meting op
halve seconden.

## Laat één cut op de muziek vallen

Alle cuts op de beat leggen is een andere manier van monteren en vraagt dat je de shotlengtes
aan de maat aanpast. Dat hoeft niet. Eén cut goed leggen levert het meeste op, en dat is de cut
naar het eindshot — daar landt de merknaam.

Zoek de frasegrenzen door de aanzetten te detecteren en hun onderlinge afstand te bekijken:

```python
hop = 256
env = np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2)) for i in range(len(x)//hop)])
on = np.maximum(0, np.diff(env))
fps = sr / hop
drempel = on.mean() + 2.2*on.std()
```

Aanzetten komen in trosjes; de **afstand tussen de trosjes** is je frase. In Valence was dat
ongeveer vier seconden. Verschuif vervolgens niet de muziek maar de cut: verleng het hero-shot
met het verschil en kort het eindshot met evenveel in, dan blijft de film even lang. In deze
film was dat 0,43 seconde.

De zwaarste klap in een trosje ligt vaak een fractie ná de frase-start. Dat is geen probleem —
de kaart komt toch pas 0,65 seconde na de cut in beeld.

## Niveau

Normaliseer naar **−14 LUFS** met een ware piek van −1,5 dBTP. Dat is de gangbare norm voor web
en advertentieplatforms; luider inleveren levert je niets op, want die platforms draaien het
terug.

Doe het in twee gangen, anders raadt `loudnorm` de correctie en klopt hij niet:

```bash
# 1. meten
ffmpeg -ss START -t LENGTE -i track.mp3 -vn \
  -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary -f null -

# 2. de gemeten waarden terugvoeren, linear=true om de dynamiek te sparen
ffmpeg -ss START -t LENGTE -i track.mp3 -vn \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=..:measured_TP=..:measured_LRA=..:measured_thresh=..:linear=true,afade=t=out:st=UIT:d=1.80,aresample=48000" \
  -c:a pcm_s16le bed.wav
```

`linear=true` werkt zolang de LRA van het fragment onder je doel-LRA ligt. Zit hij erboven, dan
valt `loudnorm` terug op dynamische correctie en gaat de muziek ademen — hoorbaar, en niet mooi.

Vloei uit over ongeveer **1,8 seconde**. Korter klinkt als een stekker eruit, langer eet de
eindkaart op.

## Onder de film leggen

```bash
ffmpeg -i film.mp4 -i bed.wav -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart uit.mp4
```

`-c:v copy` is belangrijk: het beeld is al twee keer gecodeerd (generatie en montage) en een
derde ronde levert alleen verlies op.

**Maak het bed exact even lang als het beeld.** Meet de videoduur met `ffprobe` en gebruik díé
waarde, niet de lengte die je bedoeld had. De `trim`-filters in `monteer.sh` werken op tijd en
kunnen er een frame naast zitten; in deze film werd 36,17 s uiteindelijk 36,2083 s. Wijkt het
bed af, dan lopen beeld en geluid aan het eind uit elkaar, en `-shortest` kapt dan stilletjes
een frame beeld weg.

## Controleer met een meting, niet met vertrouwen

Draai na afloop dezelfde energiemeting op de audio ván de film, opgedeeld langs je cuts. Je wilt
zien dat de waarde stijgt richting het eindshot. Loopt hij terug, dan heb je het verkeerde
fragment gekozen en is dat gratis te herstellen.

## Wat dit nog niet weet

- **Eén track, één film.** Valence is instrumentaal en bouwt gestaag. Hoe dit werkt bij een
  track met zang of met een harde drop, is niet gebleken.
- **Geen ducking, geen sound design.** Er zit geen voice-over onder deze films en er zijn geen
  effecten toegevoegd. Of een klik bij het uitklappen van de trimmer de film beter maakt, is
  niet geprobeerd.
