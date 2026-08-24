# Wellshave — Groom Guard PRO

Cinematische scroll-site voor de Wellshave Groom Guard PRO (6600 RPM SkinSafe
bodygroomer met foil shaver kop). Scrollen scrubt één onafgebroken pass van
droog trimmen, via de douche, naar een volledig donkere badkamer waar alleen
het LED-licht van het apparaat zelf nog brandt.

## Draaien

```bash
cd site && python3 -m http.server 8080   # → http://localhost:8080
```

## Verifiëren

```bash
npm link playwright        # eenmalig, gebruikt de globale installatie
node scripts/verify.mjs    # drijft de pagina in Chromium
```

De verificatie controleert onder meer of het toerental in de HUD de
scrollpositie volgt (max afwijking 4,4 RPM over negen meetpunten), of de
hoofdstukrail overeenkomt met het beeld dat op dat moment getekend wordt, of
de configurator de hero-still én de accentkleur wisselt, en of de reservering
een herlaadbeurt overleeft. Screenshots komen in `scripts/shots/`.

## Hoe het beeld gemaakt is

Alles via Higgsfield MCP, 720p bron, 16:9, zonder audio.

**Elke generatie vertrekt vanaf de echte productfoto uit Shopify** (via
`media_import_url`), zodat de behuizing, het gouden WELLSHAVE-woordmerk, het
schildlogo en het accudisplay kloppen. Genereren vanaf alleen een tekst-
beschrijving levert een verzonnen apparaat op — dat is één keer misgegaan en
kostte de hele keten.

| Stap | Model | Instelling |
|---|---|---|
| 1. Hero-still | `gpt_image_2` | 16:9, 2k, quality high, echte productfoto als `image` |
| 2. Opening (12s) | `seedance_2_5` | `mode: omni_reference`, hero als `start_image` |
| 3a. Extensie (12s) | `seedance_2_5` | `mode: video_extension`, `extension_mode: forward` |
| 3b. Extensie (12s) | `seedance_2_5` | idem, geketend op 3a |
| 4. Upscale | `bytedance_video_upscale` | preset `aigc`, 2K, 24 fps |

De extensies leveren per aanroep alleen het nieuwe segment van 12s, dus de
drie delen worden lokaal aan elkaar geplakt tot `media/drive-full.mp4` (36,04s)
en daarna als geheel geüpscaled naar `media/drive-2k.mp4` (2560×1440).

Naadcontrole: het laatste frame van elk segment en het eerste frame van het
volgende zijn naast elkaar vergeleken — identieke framing, belichting en
druppelpatroon, geen zichtbare overgang. Daarnaast is per segment gecontroleerd
of het merk (logo, woordmerk, accudisplay) intact blijft.

De drie hoofdstukken volgen echte producteigenschappen: droog trimmen, IPX7
onder de douche, en het LED-precisielicht dat vooruit schijnt. Dat laatste is
een gericht lampje bij de kop — geen gloeiring rond de behuizing.

### Frames snijden

```bash
python3 scripts/slice.py media/drive-2k.mp4 site/frames 150
```

Schrijft 150 JPG's van 1600px breed plus een `manifest.json` die de site
inleest. De drie hoofdstukken (DE TRIM / ONDER DE DOUCHE / LED PRECISIE) vallen
exact samen met de drie segmenten van 12 seconden, dus de framemapping is
bewust lineair: met easing loopt het label uit de pas met het beeld.

## Wat er niet in de repo staat

De losse Seedance-segmenten, de 720p-concat en de bron-PNG's staan in
`.gitignore`. De hero-still (`media/hero.png`) en de 2K-master
(`media/drive-2k.mp4`) gaan wel mee; de afgeleide site-assets staan in
`site/assets/`.
