# Seedance 2.5 — parameters, promptrecept en valkuilen

## Parameters

```json
{
  "model": "seedance_2_5",
  "mode": "omni_reference",
  "duration": 5,
  "resolution": "1080p",
  "aspect_ratio": "16:9",
  "bitrate_mode": "high",
  "generate_audio": false,
  "use_unlim": false,
  "medias": [{ "role": "image_references", "value": "<media_id>" }]
}
```

**`mode: "omni_reference"`** is wat het product identiek houdt over alle shots. Zonder
referentiefoto verzint het model een apparaat dat er ongeveer zo uitziet, en dan verschilt het
per shot.

**`generate_audio: false`.** Elke generatie is onafhankelijk, dus zes shots leveren zes
verschillende ruistapijten op die in de montage tegen elkaar in botsen. Onder een commercial
hoort één muziekspoor, achteraf gelegd.

**`use_unlim: false` expliciet meegeven.** Laat je het weg, dan kan de server midden in een
batch een `unlim_choice`-vraag teruggeven en ligt de run stil.

**Eén tot drie referenties per shot.** Meer verwart het model. Kies de foto die het onderwerp
van dít shot toont, eventueel plus één ondersteunende hoek voor de driedimensionale vorm.

## Het promptrecept

Zes onderdelen, in deze volgorde. Weglaten van het laatste blok is de meest voorkomende oorzaak
van onbruikbaar materiaal.

1. **Shottype** — "Extreme macro commercial shot" / "Cinematic commercial product film"
2. **Onderwerp**, met verwijzing naar de referentie — "the matte black body groomer from the
   reference"
3. **Camerabeweging plus tempo** — "the camera glides laterally at a steady moderate continuous
   speed"
4. **Licht** — sleutellicht, randlicht, achtergrond, nevel
5. **Lens en korrel** — "macro probe lens, extremely shallow depth of field, anamorphic 35mm
   lens look, fine film grain"
6. **Trouwclausule plus verbodsclausule** — zie hieronder

### De trouwclausule

Zonder deze zin drijft de vorm weg tijdens het shot.

> Product geometry, proportions, colour and finish must match the reference exactly.

Bij een shot waarin het product eerder al morfde, scherper:

> The product silhouette, the shape of its cutting head and its proportions stay fixed and
> identical to the reference throughout, never morphing between frames.

### De verbodsclausule

Sluit elke prompt hiermee af:

> No text, no captions, no subtitles, no added logos, no hands, no people.

Tekst laat je nooit door het model maken — zie `annotatielaag.md`. Handen zijn een aparte
valkuil: gegenereerde vingers rond een klein apparaat gaan vaak mis en één slechte hand maakt
het hele shot onbruikbaar.

## Valkuilen die zich in de praktijk voordeden

### De preset onderschept je job

Donkere, sfeervolle prompts kunnen worden beantwoord met een preset-aanbeveling in plaats van
een job: `"Preset \"IN THE DARK\" was recommended instead of submitting a job."` Er is dan niets
gegenereerd en niets afgeschreven.

Dien opnieuw in met dezelfde prompt plus het preset-ID dat je terugkreeg:

```json
{ "declined_preset_id": "24bae836-2c4a-48e0-89b6-49fcc0b21612" }
```

In een batch gebeurt dit **per item, niet per batch**. Bij de Blade Baron werden vijf van de zes
shots onderschept en ging de zesde gewoon door. Lees dus het antwoord regel voor regel: dien
alleen de items met `submission_failed` opnieuw in, en laat het item dat wél een `job_id` kreeg
met rust. Draai je de hele batch over, dan betaal je dat ene shot dubbel.

Het is hetzelfde preset-ID bij elke onderschepping tot nu toe. Zet het bij een donkere film dus
meteen in de eerste inzending — dat scheelt een ronde.

### De behuizing verkleurt naar goud

Vraag je een warm randlicht zonder begrenzing, dan kleurt het model het hele apparaat
champagne. Begrens het licht en verbied de verkleuring apart:

> Its body is matte black and dark gunmetal grey and stays matte black and dark gunmetal grey
> for the entire shot: the housing never turns gold, bronze, champagne, tan or warm metallic at
> any moment. […] one thin warm rim highlight confined strictly to the outer edge of the
> silhouette.

**Tel hoe vaak je goud noemt, inclusief je referentiefoto's.** Bij de Blade Baron ging het mis
op een shot waar drie dingen tegelijk goud duwden: een `hard gold key light`, `gold light
streaking along the transparent plastic`, én een referentiefoto die zelf een goudverlicht
sfeerbeeld was. Het resultaat was niet alleen een bronzen behuizing — de doorzichtige
beschermkap was een massief gouden kap geworden.

Een product dat écht gouden accenten heeft maakt dit lastiger, want je kunt goud niet simpelweg
verbieden. Begrens het dan bij naam, per onderdeel:

> No gold spreads beyond the existing thin gold band around its middle and the thin gold ring
> around the circular power button.

En verbied verkleuring apart voor elk doorzichtig of andersgekleurd onderdeel, want de
behuizingsclausule dekt die niet:

> That cap stays clear, colourless and fully see-through for the entire shot: it never becomes
> gold, bronze, brass, champagne, metallic, tinted, opaque or solid, and the metal foil blades
> stay visible straight through it the whole time.

Zet het sleutellicht in zo'n shot op **koel wit** en laat het goud alleen in het randlicht
zitten. Dat was de herkansing die het wél haalde.

### Tekst kantelt in spiegelbeeld

Het woordmerk op de behuizing kan halverwege het shot omklappen. Dit is **niet betrouwbaar op te
lossen met een instructie** — twee pogingen met een expliciet verbod gaven hetzelfde resultaat.

Behandel het daarom als een montageprobleem: zoek op de contactstrook het frame waar het
omslaat, en kap het shot daarvoor af. Een korte, hard landende afsluiter is beter dan een lange
met een gespiegeld logo. Meld de inkorting aan de gebruiker, met het alternatief erbij.

### Een lampje verschijnt op de verkeerde plek

Vraag je om een oplichtende LED, een display of een indicator zonder te zeggen waar die zit, dan
verzint het model een locatie — of laat het halve apparaat gloeien. Dat is dodelijk voor een
productfilm, want dan klopt je product niet meer.

**Zoek eerst fysiek op waar het onderdeel zit.** De referentiefoto's zijn doorgaans 4000×4000;
snijd het gebied uit en zoom in tot je het echt ziet:

```bash
ffmpeg -i referentie.png -vf "crop=1400:900:1450:800,scale=1000:-1" zoom.jpg
```

Bij de Flex Guard bleek de LED een klein matwit rechthoekig venstertje onderin de schuine
uitsparing onder de snijkop, net boven het woordmerk, identiek bij alle drie de opzetstukken.
Zonder inzoomen was het niet meer dan een lichte vlek.

**Beschrijf daarna drie dingen, in deze volgorde:** waar het venster zit ten opzichte van
herkenbare onderdelen, dat het de enige lichtbron op het product is, en waar het licht heen
gaat. Som vervolgens expliciet op wat **niet** mag oplichten — dat laatste doet het meeste werk:

> That window is the only light source on the product and the only place light comes out of it.
> […] Nothing else on the housing lights up: no glow from the control panel, no illuminated ring
> around the button, no glowing digits, no light running along the edges of the body, and no
> light coming from the blade itself.

Dezelfde aanpak werkt voor elk onderdeel dat op een vaste plek hoort te zitten: een knop die
indrukt, een klepje dat opengaat, een indicator die verspringt. Eerst opzoeken, dan positie
beschrijven, dan opsommen wat er niet mag gebeuren.

### Detailgeometrie wordt herzien

Een vlakke foilkop met twee stroken werd een gebogen geperforeerde gaastrommel. Mooi beeld,
verkeerd product. In extreme macro valt het zelden op, maar het is wel een afwijking — meld het
en laat de gebruiker beslissen of het opnieuw moet.

## Werkwijze bij genereren

`generate_video_batch` met één item per shot, `index` gelijk aan het shotnummer. Daarna
`jobs_wait` in groepen van maximaal twaalf tot `all_terminal` waar is, en tot slot **precies
één** `show_generation_by_ids` met de volledige set. Niet `show_generations`, en niet
`job_display` per shot.

Een batch van zes shots op 1080p duurde ongeveer tien minuten. Herkansingen kunnen langer duren
dan de eerste ronde.

## De zeven prompts uit de Flex Guard-film

Bewaard als werkend vertrekpunt. Vervang het onderwerp, houd de structuur.

**1 — Opening, onthulling uit het donker**
> Cinematic commercial product film. The body groomer from the reference stands upright, rear
> facing, on a polished black stone surface in near darkness. Its body is matte black and dark
> gunmetal grey and stays matte black and dark gunmetal grey for the entire shot: the housing
> never turns gold, bronze, champagne, tan or warm metallic at any moment. A single hard white
> light sweeps from left to right across it, revealing the sculpted silhouette and the fine
> ribbed edge along its side. The camera pushes in steadily and confidently at a moderate
> continuous pace while craning down slightly, settling into a tighter three quarter framing.
> The product silhouette, the shape of its cutting head and its proportions stay fixed and
> identical to the reference throughout, never morphing between frames. Deep crushed blacks,
> cool steel blue key light, one thin warm rim highlight confined strictly to the outer edge of
> the silhouette, volumetric haze in the air. Shallow depth of field, anamorphic 35mm lens look,
> fine film grain. No text, no captions, no subtitles, no added logos, no hands, no people.

**2 — Macro materiaal met waterdruppels**
> Extreme macro commercial shot. The camera glides laterally along the ribbed rubber side grip
> of the matte black body groomer from the reference, tracking at a steady moderate continuous
> speed, almost skimming the surface. Fine water droplets cling between the ridges and a single
> droplet runs down across them. A hard raking light travels along the grip so every ridge
> catches a bright specular edge in sequence. Very shallow depth of field, the background
> falling away into pure black. Warm gold highlights, cool blue shadows. Macro probe lens look,
> crisp micro detail, fine film grain. Surface texture, ribbing pattern and finish must match
> the reference exactly. No text, no captions, no subtitles, no added logos, no hands, no people.

**3 — Macro bedieningspaneel dat aanspringt**
> Extreme macro commercial shot, tight on the glossy black control panel of the body groomer
> from the reference: the gold outlined button carrying the light bulb icon and the power icon,
> with the digital number display below it. The camera moves in smoothly at a moderate
> continuous pace, then a quick decisive rack focus snaps from the vertical wordmark down to the
> button as the display ignites and its white digits glow to life. A soft gold glow blooms out
> of the button outline. Reflections slide across the glossy panel as the camera moves. Dark
> set, one hard key light, cool rim light. Shallow depth of field, macro lens, fine film grain.
> The panel layout, the icons, the gold outline and the digits must match the reference exactly
> and stay unchanged. No new text, no captions, no subtitles, no added logos, no hands, no
> people.

**4 — Macro werkend deel**
> Extreme macro commercial shot. The camera travels along the perforated metal foil shaving head
> of the body groomer from the reference at a steady continuous moderate speed, skimming just
> above the surface. Hard light rakes across the micro perforations so the metal mesh glitters
> point by point as the camera passes, then the focus shifts smoothly to the black guard bar at
> the edge of the head. Pure black background, deep contrast, one warm gold specular streak
> crossing the metal. Macro probe lens, extremely shallow depth of field, crisp micro detail,
> fine film grain. Head geometry, guard shape and mesh pattern must match the reference exactly.
> No text, no captions, no subtitles, no added logos, no hands, no people.

**5 — De reeks onderdelen**
> Cinematic macro commercial shot. Three interchangeable attachment heads taken from the
> references stand upright in a row on a polished black surface in darkness: the perforated
> metal foil shaving head, the wide skin safe blade head with its comb teeth, and the small
> pointed nose trimmer head. The camera glides low past them from left to right at a steady
> moderate continuous pace, each head passing through a hard beam of light and flaring with a
> gold specular highlight as it enters the beam. Shallow depth of field so only the head at the
> centre of frame is sharp while the others soften. Deep blacks, gold key light, cool blue rim,
> faint atmospheric haze. Anamorphic lens look, fine film grain. Each head must match its
> reference exactly in shape, scale and finish. No text, no captions, no subtitles, no added
> logos, no hands, no people.

**6 — Eindshot met vrije ruimte**
> Cinematic commercial end shot. The matte black body groomer from the reference stands seated
> upright in its matching charging stand on a polished black surface. The product is positioned
> in the left third of the frame and stays anchored in the left third of the frame for the
> entire shot, never drifting toward the centre or the right. The empty negative space is on the
> right side of the frame and grows wider as the shot progresses. The camera pulls straight back
> smoothly at a moderate continuous pace while rising very slightly, without orbiting or
> rotating around the product. As the camera pulls back the lighting builds: a thin warm gold
> rim light traces down the edge of the body, the gold emblem on the front of the stand catches
> the light, and the digital display glows. The body itself stays matte black, never turning
> gold or bronze. Background deep black with soft haze and a faint reflection on the surface
> below. Anamorphic 35mm lens look, shallow depth of field, fine film grain. No text, no
> captions, no subtitles, no added logos, no hands, no people.

**7 — Een feature die oplicht (LED-lamp)**
> Extreme macro commercial shot of the matte black body groomer from the reference, framed
> tightly on the front face of the body just below its cutting head. Set into the bottom of the
> recessed sloping channel directly beneath the cutting head, immediately above the vertical
> WELLSHAVE wordmark, sits one small frosted white rectangular LED window. That window is the
> only light source on the product and the only place light comes out of it. During the shot the
> LED switches on and throws a soft warm white beam upward and forward past the cutting blade
> onto the dark surface in front of the head, so a small pool of light opens up ahead of the
> blade while the rest of the frame stays in near darkness. Nothing else on the housing lights
> up: no glow from the control panel, no illuminated ring around the button, no glowing digits,
> no light running along the edges of the body, and no light coming from the blade itself. The
> camera drifts in at a steady moderate continuous pace, keeping the lit LED window and the
> blade above it in frame. The housing stays matte black and dark gunmetal grey for the entire
> shot and never turns gold, bronze or champagne. Deep crushed blacks, one cool rim light
> tracing the silhouette, faint haze in the air catching the LED beam. Macro lens, very shallow
> depth of field, anamorphic look, fine film grain. Product geometry, the exact position and
> shape of the LED window, and the wordmark must match the reference exactly. No text, no
> captions, no subtitles, no added logos, no hands, no people.
