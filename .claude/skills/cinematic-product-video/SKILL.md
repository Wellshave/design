---
name: cinematic-product-video
description: Produceer een cinematische commercial van een product met Higgsfield MCP en Seedance 2.5, plus een merkeigen annotatielaag die lokaal wordt ingebrand en nul credits kost. Dekt de hele run — product en formaat kiezen, referentiefoto's verzamelen en per shot toewijzen, de shotlijst schrijven, de credits vooraf aftasten, shot voor shot genereren met omni-reference zodat het product identiek blijft, elke clip zelf bekijken voordat je hem goedkeurt, en tot slot monteren met USP-teksten in Montserrat en het merkgoud. ALWAYS use this skill when someone wants a cinematic, commercial or product film made — even when they never mention Higgsfield or Seedance. Trigger on "maak een cinematic video", "cinematische productvideo", "commercial video van [product]", "productfilm", "macro video van ons product", "video met Seedance", "Higgsfield video", "video van de [product] maken", "voeg USP's toe aan de video", "tekst over de video", "annotaties in de video", "ons font over de video", "make a cinematic product video", "commercial film for [product]", "hero video for the product page", "add our USPs as text over the video", "brand this video with our font and colours". Gebruik hem ook bij het opnieuw monteren, hermonteren of uitbreiden van een bestaande cinematic film, en bij het maken van een verticale 9:16-versie. Werkt voor elk Wellshave-product; de merklaag levert kleur en typografie. Bilingual (Nederlands/English): reply in the user's language.
---

# Cinematische productvideo

Een commercial van 30 seconden waarin het product de hoofdrol speelt en verder niemand. Veel
macro, kleine bewegingen, één feature per shot, een opening die nieuwsgierig maakt en een
eindshot waar de merknaam landt. Geen presentator, geen voice-over, geen UGC — daarvoor
bestaan andere werkwijzen.

Antwoord in de taal van de gebruiker (Nederlands → Nederlands, English → English).

## De twee regels die alles bepalen

**Beeld kost credits, tekst niet.** Elk gegenereerd shot kost geld en elke mislukte poging ook.
Tekst, montage, timing en kleur doe je lokaal met ffmpeg: onbeperkt herzien voor nul credits.
Laat Seedance daarom nooit tekst maken. Het model verhaspelt letters, en het heeft het
Wellshave-woordmerk in de praktijk al gespiegeld weergegeven — precies het soort fout dat een
commercial onbruikbaar maakt.

**Nooit een shot goedkeuren dat je niet gezien hebt.** Een voltooide job betekent alleen dat er
een bestand is, niet dat het klopt. Download elke clip, trek er frames uit en kijk ernaar
voordat je iets zegt over de kwaliteit. In de eerste run van deze werkwijze zaten twee van de
zes shots fout — verkleurende behuizing en een gespiegeld woordmerk — en beide waren onzichtbaar
in de statusmelding.

## De merklaag geldt ook hier

Kleur en typografie staan al vast in
`.claude/skills/sanwarwala-landing-pages/references/wellshave-merklaag.md`. **Lees §2 Tokens en
§3 Typografie voordat je een annotatie ontwerpt, en §10 Cijfers en claims voordat je copy
schrijft.** Neem die waarden hier niet over — één bron, anders lopen ze uit elkaar.

Wat er voor video het meest toe doet: `--gold:#F5D18A` is het accent op donker, en cinematische
beelden zijn per definitie donker. `--bronze:#BC813E` is het accent op licht en hoort hier dus
vrijwel nooit. Montserrat is het enige merkfont.

## De werkwijze

### 1. Bepaal product, formaat en lengte

Vraag dit voordat je iets uitgeeft. Het verandert de hele film, en gokken kost credits.

Haal het product daarna op uit Shopify (`search_products`, of `graphql_query` op `title:*Naam*`
als de zoekterm genegeerd wordt) **en haal ook de live productpagina op**. Dat tweede is geen
dubbel werk: de omschrijving in Shopify is verkoopproza, terwijl de pagina een specificatielijst
draagt met de dingen die je nodig hebt — hoe de opzetstukken officieel heten, welke onderdelen
er zijn, wat er op het display staat. In de Flex Guard-film stond "LED display" alleen in die
lijst en nergens in de omschrijving.

Samen zijn ze je **enige bron voor claims** — zie stap 7. Noteer prijs, de namen van de
opzetstukken in de volgorde waarin ze horen, en de features die het product echt heeft.

### 2. Verzamel en herken de referentiefoto's

Bijlagen uit de Claude-chat zijn onleesbaar voor remote MCP-tools. Roep
`media_upload_widget` aan; de browser van de gebruiker uploadt dan rechtstreeks naar Higgsfield.
Werkt de widget niet, vraag dan een publieke https-URL en gebruik `media_import_url`.

Wat een goede set is: één schone studiofoto van het hele product, één close-up per opzetstuk of
uitgelicht detail, en minstens één achterkant. Geen foto's met bestaande tekstoverlays of
prijsbadges — het model neemt die over.

**Bekijk daarna elke foto zelf** (`show_medias` voor de ID's, dan downloaden en openen) en maak
een tabel van media-ID naar shot. Zonder die stap koppel je de neustrimmer aan het shot over de
scheerkop, en dat merk je pas als de credits op zijn.

### 3. Schrijf de shotlijst

Lees `references/shotgrammatica.md`. Daar staat de beatstructuur, waar het brede shot hoort,
waarom vrijwel alles macro is, en hoe je tempo maakt zonder te jagen.

Leg de lijst voor aan de gebruiker voordat je genereert. Een shotlijst herzien is gratis, een
gegenereerd shot niet.

### 4. Tast de kosten af en meld ze

`get_cost:true` op één representatief shot verstuurt geen job en kost niets. Vermenigvuldig met
het aantal shots, zet het naast het saldo uit `balance`, en meld beide voordat je genereert.

### 5. Genereer

Lees `references/seedance-prompts.md` voor het promptrecept, de parameters en de
mislukkingspatronen die zich in de praktijk hebben voorgedaan. Verstuur met
`generate_video_batch`, wacht met `jobs_wait` in groepen van maximaal twaalf, en toon het
resultaat met precies één `show_generation_by_ids`.

### 6. Keur elk shot af of goed

Download alle clips en trek per clip drie frames — begin, midden, eind — als contactstrook:

```bash
ffmpeg -i shot.mp4 -vf "select='eq(n\,2)+eq(n\,60)+eq(n\,118)',scale=640:-1,tile=3x1" \
  -frames:v 1 strook.jpg
```

Kijk naar elke strook. Let op verkleurende behuizing, morfende vormen, tekst die kantelt, en
compositie die wegdrijft van waar je hem wilde hebben. Draai fout materiaal opnieuw met de fout
expliciet benoemd in de prompt.

Lukt het tweemaal niet, stop dan met gokken. Meld wat er misgaat, wat het nog een poging kost,
en kap het onbruikbare deel weg in de montage. Twee mislukte pogingen op dezelfde fout zijn een
patroon, geen pech.

### 7. Schrijf de annotatiecopy

Lees `references/annotatielaag.md` voor de opmaak, en `wellshave-merklaag.md` §10 voor de
claimdiscipline.

Elke annotatie is een goud labeltje plus één witte regel, en moet twee toetsen doorstaan.

**Is de claim waar?** Alles moet herleidbaar zijn tot de bronnen uit stap 1. Zet de bron per
regel in je verantwoording naar de gebruiker. Geen batterijduur, geen scheertijden, geen
materialen die bij een ander artikel horen.

**Gaat het shot eronder over die claim?** Een juiste claim boven het verkeerde beeld is alsnog
fout, en dit is de toets die het makkelijkst wordt overgeslagen omdat de eerste geslaagd is.
Zet de shotlijst en de copy naast elkaar voordat je rendert.

### 8. Monteer en brand in

```bash
scripts/monteer.sh --uit film.mp4 --ass annotaties.ass shot1.mp4 shot2.mp4 ...
```

Het script plakt de shots aan elkaar, brandt de annotatielaag in met de meegeleverde
fontgewichten en levert H.264 8-bit. Zie `scripts/monteer.sh --help` voor het inkorten van losse
shots.

### 9. Lever op

Drie dingen, want de gebruiker gaat hier verder mee werken:

- de gemonteerde film met annotaties
- dezelfde film zonder tekst, om zelf mee te monteren
- de annotatiekit: `annotaties.ass`, de twee fontbestanden en een leesmij met het
  render-commando, zodat teksten aangepast kunnen worden zonder credits en zonder jou

Seedance levert HEVC 10-bit, wat niet overal soepel afspeelt; lever daarom altijd ook H.264.
Let op de uploadlimiet van 30 MB per bestand — splits een te grote map op.

## Wat dit kost

Eén shot van 5 seconden op 1080p met `bitrate_mode:"high"` kostte 45 credits. Zes shots plus
twee herkansingen kwamen uit op 360. Reken op ongeveer 300–400 credits voor een film van 30
seconden, en op nul voor alle tekst, montage en herzieningen daarna.

Een verticale 9:16-versie kost het volledige bedrag opnieuw. Bijsnijden van 16:9 is geen
alternatief: de macro's zijn op de breedte gekadreerd en verliezen hun compositie.

## Bestanden in deze skill

| Pad | Wanneer lezen |
|---|---|
| `references/shotgrammatica.md` | Bij stap 3, voordat je de shotlijst schrijft |
| `references/seedance-prompts.md` | Bij stap 5, voordat je genereert |
| `references/annotatielaag.md` | Bij stap 7, voordat je copy of opmaak maakt |
| `scripts/monteer.sh` | Bij stap 8 |
| `scripts/maak-fonts.py` | Alleen als het merkfont op de site verandert |
| `assets/fonts/` | Montserrat 500 en 600, OFL 1.1 — licentie ligt ernaast |
| `assets/annotaties-sjabloon.ass` | Als vertrekpunt voor een nieuwe annotatielaag |

## Waar dit woont

Bron: `Wellshave/design` → `.claude/skills/cinematic-product-video/`. Deze repo is **openbaar** —
zet er geen commerciële cijfers, marges of interne afspraken in.

`scripts/sync-skill.sh` in de repowortel spiegelt op dit moment alleen de landingspagina-skill.
Wil je deze skill ook naar `wellshave-marketing` spiegelen, breid dat script dan uit in plaats
van een tweede te schrijven.

## Wat deze werkwijze nog niet weet

- **Eén product, één run.** Alles hierboven komt uit de Flex Guard-film. Of de beatstructuur
  net zo werkt voor een klein product zoals een neustrimmer is niet gebleken.
- **Geen prestatiecijfers.** Er is niet gemeten of deze films beter converteren dan bestaande
  advertenties. Zodra daar cijfers over zijn, horen ze hier te staan.
- **Alleen 16:9 gedraaid.** De verticale variant is beredeneerd, niet getest.
- **Geen geluid.** Elke clip wordt zonder audio gegenereerd, omdat losse generaties elk hun
  eigen ruistapijt opleveren. Hoe de muzieklaag eronder komt is nog niet vastgelegd.
- **Het model haalt niet elk productdetail.** In de Flex Guard-film werd de vlakke foilkop een
  gebogen gaastrommel. Wanneer dat acceptabel is en wanneer niet, is een oordeel dat per film
  opnieuw gemaakt moet worden.
