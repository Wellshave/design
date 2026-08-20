---
name: cinematic-product-video
description: Produceer een cinematische commercial van een product met Higgsfield MCP en Seedance 2.5, plus een merkeigen annotatielaag die lokaal wordt ingebrand en nul credits kost. Dekt de hele run — product en formaat kiezen, referentiefoto's verzamelen en per shot toewijzen, de shotlijst schrijven, de credits vooraf aftasten, shot voor shot genereren met omni-reference zodat het product identiek blijft, elke clip zelf bekijken voordat je hem goedkeurt, en tot slot monteren met USP-teksten in Montserrat en het merkgoud. ALWAYS use this skill when someone wants a cinematic, commercial or product film made — even when they never mention Higgsfield or Seedance. Trigger on "maak een cinematic video", "cinematische productvideo", "commercial video van [product]", "productfilm", "macro video van ons product", "video met Seedance", "Higgsfield video", "video van de [product] maken", "voeg USP's toe aan de video", "tekst over de video", "annotaties in de video", "ons font over de video", "make a cinematic product video", "commercial film for [product]", "hero video for the product page", "add our USPs as text over the video", "brand this video with our font and colours". Gebruik hem ook bij het opnieuw monteren, hermonteren of uitbreiden van een bestaande cinematic film, en bij het maken van een verticale 9:16-versie. Trigger ook op een vage of onvolledige opening — "ik wil een video van [product]", "kun je een video maken", "video voor de productpagina", "iets moois met dit product", "we hebben beeld nodig voor de ads" — want de skill begint met een intake die de ontbrekende gegevens ophaalt en een verkeerd gestelde vraag bijstuurt naar de juiste werkwijze. Trigger eveneens wanneer iemand vraagt om productbeeld te laten genereren zonder eigen referentiefoto's aan te leveren: de skill dringt daar juist op aan, omdat het model anders een product verzint dat niet bestaat. Werkt voor elk Wellshave-product; de merklaag levert kleur en typografie. Bilingual (Nederlands/English): reply in the user's language.
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
`.claude/skills/sanwarwala-landing-pages/references/wellshave-merklaag.md`. **Lees §3 Tokens en
§4 Typografie voordat je een annotatie ontwerpt, en §11 Cijfers en claims voordat je copy
schrijft.** Neem die waarden hier niet over — één bron, anders lopen ze uit elkaar.

Wat er voor video het meest toe doet: `--gold:#F5D18A` is het accent op donker, en cinematische
beelden zijn per definitie donker. `--bronze:#BC813E` is het accent op licht en hoort hier dus
vrijwel nooit. Montserrat is het enige merkfont.

## Stap 0 — De intake, vóór alles

Drie dingen moeten vaststaan voordat er één credit weggaat: **welk product**, **welk formaat en
welke lengte**, en **referentiefoto's van de gebruiker zelf**. Ontbreekt er één, vraag ernaar.
Gokken is hier duurder dan vragen: een shotlijst herzien is gratis, een gegenereerd shot niet.

Een brief komt zelden compleet binnen, en dat is normaal. Het is jouw werk om hem compleet te
maken zonder de gebruiker het gevoel te geven dat hij het verkeerd vroeg. Stel de ontbrekende
vragen in één keer, met een aanbeveling erbij, in plaats van er drie beurten over te doen.

### Openingen die bijsturing vragen

| Wat er binnenkomt | Wat je doet |
|---|---|
| "Maak een video van [product]" — verder niets | Vraag formaat en lengte, en open het uploadvenster voor foto's. Begin niet met genereren op basis van alleen een productnaam. |
| "Gebruik gewoon de foto's van de website" | Kan, maar controleer ze eerst: winkelfoto's dragen vaak prijsbadges, tekstoverlays of vergelijkingsbalken, en het model neemt die over. Vraag de schone studiobestanden. |
| "Maak hem lekker traag en sfeervol" | Cinematisch is niet traag. Leg uit dat een stilvallende camera in een commercial leest als een hapering, en werk met doorlopende beweging op gematigd tempo. |
| "Zet onze USP's erin met AI" | Tekst wordt niet gegenereerd maar lokaal ingebrand — scherper, in het merkfont, en gratis te herzien. Zie `annotatielaag.md`. |
| "Snijd hem bij naar 9:16 voor TikTok" | Bijsnijden werkt niet: de macro's zijn op de breedte gekadreerd. Een verticale versie is opnieuw genereren, tegen het volle bedrag. |
| "Doe er iemand bij die hem vasthoudt" | Dit is een productfilm zonder mensen. Wil de gebruiker een presentator, unboxing of review, wijs dan naar `higgsfield-content-factory`. |
| "Maak zoveel mogelijk shots" | Noem de prijs per shot en stel zes tot acht voor. Meer shots maakt een commercial niet beter, alleen langer. |
| Eén foto aangeleverd | Werkbaar, maar zeg wat het kost: minder hoeken betekent meer kans dat het model de vorm herziet. Vraag of er meer zijn. |
| Een sfeerfoto van iemand die het product gebruikt | Onbruikbaar als referentie. Het model neemt de omgeving en de handen over. Vraag een productfoto op een schone achtergrond. |

Twijfel je of een verzoek binnen deze werkwijze valt: de toets is of het **product de hoofdrol
speelt en er verder niemand in beeld is**. Zo niet, dan is dit de verkeerde skill en zeg je dat.

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

**Bied altijd zelf het uploadvenster aan, ook als de gebruiker niet over foto's begint.** Dit is
de belangrijkste foutpreventie in de hele werkwijze. Zonder eigen referentie verzint het model
een apparaat dat er ongeveer zo uitziet, en dan staat er een product in je commercial dat niet
bestaat. Ga er nooit van uit dat Shopify of de website genoeg is: die beelden zijn gekozen om te
verkopen, niet om een model mee te sturen, en dragen vaak badges en overlays.

Roep `media_upload_widget` aan — bijlagen uit de Claude-chat zijn onleesbaar voor remote
MCP-tools, dus vraag daar niet om. De browser van de gebruiker uploadt rechtstreeks naar
Higgsfield. Werkt de widget niet in hun client, vraag dan een publieke https-URL en gebruik
`media_import_url`.

Wil de gebruiker echt zonder eigen foto's door, zeg dan expliciet wat dat betekent voor de
gelijkenis met het echte product en laat hen kiezen. Doe dat niet stilzwijgend.

Wat een goede set is: één schone studiofoto van het hele product, één close-up per opzetstuk of
uitgelicht detail, en minstens één achterkant. Geen foto's met bestaande tekstoverlays of
prijsbadges — het model neemt die over.

**Bekijk daarna elke foto zelf** (`show_medias` voor de ID's, dan downloaden en openen) en maak
een tabel van media-ID naar shot. Zonder die stap koppel je de neustrimmer aan het shot over de
scheerkop, en dat merk je pas als de credits op zijn.

**Leid het materiaal van een onderdeel nooit af uit een sfeerfoto.** Een studiofoto met hard
strijklicht is gemaakt om vorm te laten zien, niet om kleur af te lezen. Bij de Blade Baron las
ik de zwarte magnetische beschermkap als doorzichtig, omdat het gouden licht er langs schoot
naar de scheerkop eronder en de glansstrepen op het glanzende plastic op reflecties in glas
leken. Het shot kwam er precies zo uit, en de gebruiker moest melden dat de kap gewoon zwart is.

De controle kost niets. Snijd het onderdeel uit en krik de helderheid op:

```bash
ffmpeg -i referentie.png -vf "crop=760:620:130:20,eq=brightness=0.25:contrast=1.4" op.jpg
```

Blijft het zwart, dan is het zwart. Zie je er ineens iets doorheen, dan was het doorzichtig.
Twijfel je nog steeds over kleur, materiaal of hoe een onderdeel beweegt: **vraag het**, samen
met de shotlijst. De gebruiker heeft het product in handen en jij hebt een render.

En als een onderdeel dekt in het echt ook dekt in beeld, zeg dan in de prompt wat het onderdeel
tegen de achtergrond aftekent, anders verdwijnt zwart op zwart:

> What defines its shape against the dark background is a crisp white specular highlight running
> along its curved top edge and down its rounded corner, exactly as in the reference photograph.

**Kijk daarbij ook naar het woordmerk op het product.** Een gespiegeld merk is niet altijd iets
wat het model ervan maakt — het kan al in de aangeleverde render zitten. Bij de Blade Baron
stond de logodecal in twee van de tien foto's gespiegeld op het bovenvlak, terwijl het display
op diezelfde foto's gewoon goed om las en het vooraanzicht wél klopte. Voer je zo'n foto in als
referentie, dan brandt het model die fout in je commercial.

Zoom in voordat je het gelooft: snijd het logogebied uit op volle resolutie en leg het naast
dezelfde foto horizontaal gespiegeld. Zit de fout er inderdaad in, kies dan een uitsnede die
het woordmerk buiten beeld laat in plaats van de hele foto te spiegelen — spiegelen zet
namelijk het display en de poorten verkeerd om. Upload die uitsnede als eigen media
(`media_upload`, bytes naar de presigned URL, dan `media_confirm`) en gebruik hem voor dat ene
shot. Meld de fout ook aan de gebruiker: die renders staan doorgaans ook op de productpagina.

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

Download alle clips en trek per clip vier frames — begin, twee keer midden, eind — als
contactstrook. Een clip van vijf seconden komt terug als **121** frames op 24 fps, niet 120:

```bash
ffmpeg -i shot.mp4 -vf "select='eq(n\,2)+eq(n\,40)+eq(n\,78)+eq(n\,117)',scale=470:-1,tile=2x2" \
  -frames:v 1 strook.jpg
```

**Controleer eerst of ffmpeg er is.** In een verse websessie staat het er niet, en zonder
ffmpeg kun je geen enkel shot beoordelen en niets monteren. Installeren duurt een halve minuut:
`apt-get update -qq && apt-get install -y -qq ffmpeg`. Doe dat vóór je gaat genereren, niet
erna — anders staan er clips klaar die je niet kunt bekijken.

Kijk naar elke strook. Let op verkleurende behuizing, morfende vormen, tekst die kantelt, en
compositie die wegdrijft van waar je hem wilde hebben. Draai fout materiaal opnieuw met de fout
expliciet benoemd in de prompt.

Lukt het tweemaal niet, stop dan met gokken. Meld wat er misgaat, wat het nog een poging kost,
en kap het onbruikbare deel weg in de montage. Twee mislukte pogingen op dezelfde fout zijn een
patroon, geen pech.

### 7. Schrijf de annotatiecopy

Lees `references/annotatielaag.md` voor de opmaak, en `wellshave-merklaag.md` §11 voor de
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

Eén shot van 5 seconden op 1080p met `bitrate_mode:"high"` kostte 45 credits, in beide runs tot
nu toe. Beide films kwamen met zes shots plus twee herkansingen op 360. Reken op ongeveer
300–400 credits voor een film van 30 seconden, en op nul voor alle tekst, montage en
herzieningen daarna.

Van die vier herkansingen ging er één over een fout van het model en drie over een fout in de
opdracht: te veel goud gevraagd, en een onderdeel verkeerd beschreven omdat de referentiefoto
verkeerd gelezen was. De rekening valt dus vooral lager uit door beter kijken vooraf, niet door
betere prompts achteraf.

Een door een preset onderschepte inzending kost niets: bij de Blade Baron werden vijf van de zes
shots teruggestuurd en het saldo bewoog pas bij de tweede inzending. Controleer dat na afloop
door `balance` voor en na te vergelijken — het verschil hoort precies het aantal geslaagde
generaties maal 45 te zijn.

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

- **Twee producten, twee runs.** De Flex Guard-film en de Blade Baron-film. De beatstructuur
  hield stand bij een klein, compact product, met één aanpassing: de Blade Baron heeft geen
  opzetstukken, dus beat 6 (de reeks) verviel en de heropvoering ging naar een shot van de
  beschermkap. Of het ook werkt voor iets zonder bewegende delen is nog niet gebleken.
- **Geen prestatiecijfers.** Er is niet gemeten of deze films beter converteren dan bestaande
  advertenties. Zodra daar cijfers over zijn, horen ze hier te staan.
- **Alleen 16:9 gedraaid.** De verticale variant is beredeneerd, niet getest.
- **Geen geluid.** Elke clip wordt zonder audio gegenereerd, omdat losse generaties elk hun
  eigen ruistapijt opleveren. Hoe de muzieklaag eronder komt is nog niet vastgelegd.
- **Het model haalt niet elk productdetail.** In de Flex Guard-film werd de vlakke foilkop een
  gebogen gaastrommel. Wanneer dat acceptabel is en wanneer niet, is een oordeel dat per film
  opnieuw gemaakt moet worden.
