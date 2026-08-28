---
name: nieuwsartikel
description: Bouw een Wellshave Dossier-artikel — een gesponsorde bijdrage in de vorm van een eigen online magazine, met masthead, rubrieken, redactionele kop, zijkolom met feitenblokken, genoemd-in-strook, lezersaanbiedingen en een aanbodpaneel onderaan. Dit is de nieuwsartikel-tak van de twee landingspagina-takken. ALWAYS use this skill when the user asks for a "nieuwsartikel", "nieuwsartikeladvertentie", "dossier-artikel", "advertorial die als artikel leest", "sponsored article", "informatieve pagina bij een creative", or shows a magazine-style article layout as the target. Trigger on "maak er een nieuwsartikel van", "bouw een dossier-pagina", "artikel bij deze advertentie", "informatiepagina bij deze creative", "news article version", "magazine layout voor deze ad". Voor een gedesignde landingspagina in de webshopstijl met hero, geruststrook en aanbodblok hoort de `design-advertorial` skill; die twee zijn bewust gescheiden. Bilingual NL/EN: reply in the user's language.
---

# Nieuwsartikel: Wellshave Dossier

Dit is de nieuwsartikel-tak. De pagina doet zich voor als een aflevering van **Wellshave
Dossier**, een eigen online magazine van het merk: masthead met rubrieken, redactionele kop
met leestijd en publicatiedatum, een artikel met zijkolom, en het aanbod pas onderaan, netjes
aangekondigd als aanbod.

De zusterskill `design-advertorial` bouwt de andere tak: de landingspagina in de webshopstijl,
met hero, geruststrook, aanbodblok en meerdere knoppen. **Kies er &eacute;&eacute;n en meng ze
niet.** Half is te commercieel om als artikel te lezen en te redactioneel om als winkel te
overtuigen.

Startbestand: `.claude/skills/nieuwsartikel/references/startbestand-dossier.html`

---

## 1. Wanneer deze tak, en wanneer de andere

| | Nieuwsartikel (deze skill) | Design-advertorial |
|---|---|---|
| Frame | Een uitgave: Wellshave Dossier | Een landingspagina van de winkel |
| De advertentie belooft | Informatie, uitleg, een verhaal | Een product, een aanbod, een resultaat |
| Kop | Serif, redactioneel, zonder productnaam | Tweeslags met goudverloop |
| Boven de vouw | Rubrieken, kicker, leestijd, deelknoppen | Hero met beeld en koopknop |
| Verkoopmomenten | Twee lezersaanbiedingen in de tekst, aanbod onderaan | Vanaf de hero, door de hele pagina |
| Zijkolom | Ja: in het kort, feiten, verdieping | Nee |
| Doel | Vertrouwen winnen en dan pas verkopen | Verkopen |

**De toets:** haal de twee aanbiedingsstroken en het aanbodpaneel weg. Blijft er een stuk over
dat iemand zou lezen zonder iets te willen kopen? Zo nee, dan is het geen dossier-artikel maar
een landingspagina met een serif, en dan bouw je beter de andere tak.

Vraag dit bij de start expliciet, ook als je denkt het al te weten uit de creative. Achteraf
omzetten kost de hele pagina: de takken delen bijna geen bouwstenen.

## 2. Wat je vooraf moet weten

Vijf dingen, en je begint niet zonder:

1. **De creative en de letterlijke belofte erin.** De kop en de eerste twee alinea's
   beantwoorden die belofte in dezelfde woorden.
2. **Het onderwerp, niet het product.** Waar gaat het stuk over als je het product weglaat?
3. **Welk bewijs mag, en waar het over gaat.** Reviews per apparaat, cijfers met hun bron,
   persvermeldingen die je kunt aanwijzen.
4. **Het aanbod:** welke pakketten, welke prijzen, en of de winkelwagenlink het cadeau ook echt
   meelevert. Controleer dat met `cart.js` voor je hem plaatst.
5. **Wie de spreker is.** Een dossier-artikel zonder mens erin leest als een folder.

## 3. De vaste opbouw

```
datumbalk -> masthead WELLSHAVE DOSSIER -> rubriekenbalk
-> kicker (advertorial, in samenwerking met) -> kop -> standfirst
-> auteursregel met portret + publicatiedatum en leestijd -> deelknoppen
-> [artikel | zijkolom]
   artikel: heldenbeeld met bijschrift en fotobron -> intro met initiaal
            -> genoemd-in-strook -> sectiekop -> genummerde punten
            -> beeld tussen de punten -> klein kader -> lezersaanbieding
            -> resterende punten -> twee verantwoordingsbakken -> vergelijkingstabel
            -> tweede lezersaanbieding
   zijkolom: in het kort -> feiten en cijfers -> verdiep je verder
-> aanbodpaneel op zandvlak: twee pakketkaarten + waarom-lijst + Trustpilot
-> drie kopersreacties -> voetnoot met de volledige verantwoording
```

Wat elk onderdeel doet, en waar het misgaat als je het weglaat:

- **Datumbalk en masthead.** Zonder deze twee is het geen uitgave maar een losse pagina. De
  naam staat in een serif, met `DOSSIER` in het merkgoud.
- **Rubriekenbalk.** Vier rubrieken, in kapitalen. Ze hoeven niet te linken naar bestaande
  overzichten, maar liegen mag niet: gebruik rubrieken die bij het merk passen.
- **Kicker.** `Advertorial &middot; in samenwerking met Wellshave`, in goud, boven de kop. Dit
  is de vermelding boven de vouw en die is niet onderhandelbaar.
- **Kop en standfirst.** De kop noemt het onderwerp, niet het merk. De standfirst is twee tot
  drie zinnen en mag een citaat bevatten.
- **Auteursregel.** `Redactie Wellshave Dossier`, met daaronder wie er aan het woord is. Het
  portret is van de ge&iuml;nterviewde, niet van een verzonnen journalist. Rechts de
  publicatiedatum en de leestijd.
- **Deelknoppen.** Facebook, WhatsApp en e-mail, met echte deel-URL's. Geen nepknoppen zoals
  opslaan of reageren als die nergens heen gaan.
- **Heldenbeeld** met bijschrift en `| Foto: Wellshave`.
- **Intro met initiaal**, twee alinea's, geen productnaam.
- **Genoemd-in-strook.** Titels die eerder over het merk schreven, tussen twee lijnen. Alleen
  echte vermeldingen; zie de eerlijkheidsregels.
- **Genummerde punten** met een serif-kop en 100 tot 160 woorden. Vijf tot acht punten.
- **Klein kader** met een praktische vraag ("Hoe vaak vervangen?"), niet met een verkoopzin.
- **Twee verantwoordingsbakken:** waar het stuk op gebaseerd is, en wat er tegenvalt. Deze twee
  dragen de geloofwaardigheid van het hele stuk. De tweede bak noemt echte nadelen.
- **Vergelijkingstabel** in gewone tabelopmaak, met een regel waar het alternatief wint.
- **Zijkolom:** in het kort (drie vragen), feiten en cijfers (drie getallen met bron), verdiep
  je verder (drie tot vier links die echt bestaan).
- **Aanbodpaneel** op zandvlak, aangekondigd met een kop als "Van artikel naar aanbod": twee
  pakketkaarten en een lijstje met de voorwaarden.
- **Voetnoot** met de volledige verantwoording.

## 4. Opmaak

- **Letters:** Source Serif 4 voor masthead, koppen en cijfers; de systeemletter voor lopende
  tekst. Geen Montserrat: dat is de winkel, en die moet je hier juist niet zijn.
- **Kleuren:** papier `#FBF9F5`, inkt `#141210`, tekst `#3A3733`, grijs `#7A7469`, hairline
  `#E3DFD7`, zandvlak `#F3EFE7`, goud `#A87C33`. Het goud alleen in de kicker, de cijfers, de
  knoppen en het woord `DOSSIER`.
- **Raster:** artikelkolom plus zijkolom van 280px, samen maximaal 1080px. Onder 980px valt de
  zijkolom onder het artikel.
- **Tekstmaat:** 15px basis, 14,5px in de punten, regelafstand 1,7. Bewust kleiner dan een
  landingspagina; dat is wat het een uitgave laat lijken.
- **Geen** goudverloop, geen schaduwen, geen ronde hoeken op kaarten, geen plakkende koopbalk,
  geen aftelklok, geen animatie bij het scrollen. Kaders hebben rechte hoeken en een hairline.
- **Beeld zonder ingebrande verkooptekst.** Het assortiment op de Shopify-CDN bestaat voor een
  groot deel uit winkelcreatives met koppen in het beeld ("IPX6 Waterdicht", "Glad Resultaat",
  "Al meer dan 125.000+ tevreden klanten") en uit infographics met callouts. Die horen hier
  niet: een foto met een reclamekop erin verraadt de vorm in &eacute;&eacute;n oogopslag, en de
  cijfers erop spreken je eigen tekst soms tegen. Gebruik documentaire foto's en schone
  studiobeelden, en controleer elk beeld door het te openen voordat je het plaatst.
- **Het bijschrift beschrijft wat er echt te zien is.** Een bijschrift dat iets anders beweert
  dan het beeld toont, is een fout van dezelfde soort als een verkeerd cijfer.
- **Beeld naast de tekst**, ongeveer 46% breed, om en om links en rechts, met het bijschrift
  eronder. Vol-de-breedte beelden horen bij het heldenbeeld, niet bij de punten.

## 5. Verkopen binnen de vorm

Verkopen mag hier, maar altijd aangekondigd:

- **Twee lezersaanbiedingen** in de tekst, als een strook tussen twee lijnen, met het label
  erboven en &eacute;&eacute;n knop. Nooit meer dan twee, en nooit voor het derde punt.
- **Het aanbodpaneel onderaan** staat op een zandvlak en heeft een eigen kop, zodat zichtbaar
  is dat het artikel ophoudt en het aanbod begint.
- **Twee pakketten**, niet drie. De ladder van drie hoort bij de andere tak.
- **Prijzen alleen in de aanbiedingsstroken en het paneel**, niet in de lopende tekst.
- **Kortingen zijn echt.** Noem een van-prijs alleen als die klopt met de winkel. Verzin nooit
  een percentage.

## 6. Eerlijkheidsregels

Deze vorm leent het gezag van een redactie. Daarom liegt hij sneller dan een winkelpagina, ook
zonder dat je iets onwaars schrijft.

- **De vermelding staat boven de vouw**, in de kicker, en komt terug in de voetnoot.
- **Verzin geen journalist.** De auteursregel is `Redactie Wellshave Dossier`. Wil de klant een
  naam, dan moet het een echt persoon zijn die dit stuk ook echt geschreven heeft.
- **Claim geen redactionele onafhankelijkheid.** Zinnen als "de redactie behoudt zich
  journalistieke eindverantwoordelijkheid voor" horen bij een uitgever, niet bij een merk dat
  zijn eigen dossier volschrijft. De voetnoot zegt gewoon dat het dossier een uitgave van het
  merk is en dat de inhoud betaald en samengesteld is door het merk.
- **De publicatiedatum is de echte datum.** Geen datum verzinnen, en geen "laatste update" die
  er niet is.
- **Persvermeldingen zijn berichtgeving, geen aanbeveling.** Alleen titels die je kunt
  aanwijzen, en de voetnoot zegt erbij dat het geen aanbeveling van dit artikel is.
- **Reviews zijn echt en letterlijk overgenomen**, met vermelding van het apparaat. Een
  gemiddelde score over het assortiment is geen score over &eacute;&eacute;n apparaat.
- **Bestellingen zijn geen personen.** Schrijf "184.000 bestellingen", nooit "184.000 mannen".
- **Noem het nadeel.** De bak "wat er tegenvalt" is geen sierstuk. Een stuk dat alleen
  voordelen kent, leest als reclame en verliest precies wat deze vorm moest opleveren.

## 7. Schrijfregels

- **Eerst de scene, dan de uitleg.** Begin bij een mens of een moment.
- **Feiten in plaats van bijvoeglijke naamwoorden.** "184.000 bestellingen" doet werk,
  "enorm populair" doet niets.
- **E&eacute;n idee per punt.** Wil een punt twee dingen zeggen, dan zijn het er twee.
- **Nederlands zonder verkooptaal** in de artikeltekst: geen uitroeptekens, geen "ontdek",
  geen "revolutionair". In de aanbiedingsstrook mag verkooptaal wel, daar hoort het.
- **De oprichter is een vakman, geen held.**

## 8. Publiceren

De regels uit deel 16 van
`.claude/skills/sanwarwala-landing-pages/references/wellshave-merklaag.md` gelden onverkort:

- Wikkel alles in `<div class="gg-art">` en scoop elke selector daarbinnen, anders sloopt de
  reset de themaheader en -footer.
- **Nooit base64.** Beelden naar de Shopify CDN en verwijzen met de CDN-URL.
- Alleen geldige HTML: `dt`/`dd` in een `dl`, `li` in `ul`/`ol`, en niets anders.
- Elk teken buiten het basisalfabet als `&#nnn;`.
- Lees na publicatie via de API terug wat is opgeslagen en tel secties, beelden en knoppen.

Controleer voor oplevering op 1440, 1024 en 390 breed: geen horizontale overloop, alle beelden
geladen, tags in balans, geen JavaScript-fouten, en elke knop en zijkolomlink naar een bestaande
bestemming.

## 9. Wat deze tak nog mist

- **Geen conversiedata.** Het dossier-artikel is nooit tegen de gedesignde landingspagina
  getest op hetzelfde verkeer. De zuivere test: dezelfde advertenties, alleen de URL verschilt,
  binnen dezelfde campagne.
- **Onbekend wat de zijkolom doet.** Aannemelijk dat hij de vorm compleet maakt, ongemeten of
  hij gelezen wordt.
- **Onbekend hoeveel de twee aanbiedingsstroken opleveren** tegenover alleen het paneel
  onderaan.
- **Er is nog geen aflevering buiten grooming.** Alle ervaring komt van scheren.
