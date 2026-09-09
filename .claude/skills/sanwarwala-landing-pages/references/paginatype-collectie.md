# Paginatype: collectiepagina

Voor de pagina's van de winkel zelf: de hele collectie en elke deelcollectie. Lees eerst
`wellshave-merklaag.md` &mdash; tokens, koppen, knoppen en beeldregels gelden hier onverkort.
Dit bestand beschrijft alleen wat een collectiepagina anders maakt dan een landingspagina.

## Wanneer dit type

| | Landingspagina | Collectiepagina |
|---|---|---|
| Verkeer | betaald, uit één advertentie | navigatie in de winkel, en Google |
| Doel | één handeling | de bezoeker bij het juiste apparaat brengen |
| Navigatie | eruit slopen | juist versterken; wisselen van plek is de kernhandeling |
| Ruggengraat | de belofte van de creative | de plek op het lichaam |

De bezoeker komt hier niet met een belofte in zijn hoofd maar met een vraag: *welke van deze
moet ik hebben.* Elke sectie hoort daar antwoord op te geven of eruit te gaan.

## De ruggengraat: zone leidt, type filtert

Het assortiment is opgebouwd per plek &mdash; lichaam en schaamstreek, gezicht en baard, hoofd,
neus en oren. De collectiepagina volgt die indeling en zet het producttype (bodygroomer,
tondeuse, neustrimmer) eronder als filter. Zo sluit hij aan op de zonekiezer van de homepage;
wie daar op een plek klikt, komt hier in dezelfde taal terecht.

**Eén zone is één pagina, ook als twee plekken hetzelfde apparaat delen.** Twee collecties met
identieke producten leveren dubbele content op. Verschilt de aanleiding wel (lichaam versus
schaamstreek), laat dat dan in de hero terugkomen, niet in een tweede collectie.

**Tel één keer.** De aantallen in de zonebalk, in de hero en op de homepage komen uit dezelfde
telling. Twee pagina's die elkaar tegenspreken over hoeveel apparaten er zijn, kosten meer dan
ze opleveren. Controleer de zonetags voordat je een getal opschrijft, en meld apparaten zonder
tag als gat.

## De sectievolgorde

**De keuzehulp hoort boven de vouw, niet onder een hero.** Een collectiepagina heeft geen
advertentie te continueren; de bezoeker is er al uit dat hij zoiets wil en zit met de vraag
welke. Een schermvullende hero met een groot beeld duwt precies het gereedschap weg dat die
vraag beantwoordt. Houd de kop kort en zet de keuzehulp ernaast, zodat kop, keuze, match en
navigatie samen in de eerste schermhoogte staan en het raster één scroll verderop begint.

**Houd de pagina kort.** Elke sectie die niet kiest, uitlegt of bewijst, gaat eruit. Zes blokken
is ruim genoeg; wat detail is, hoort achter een uitklap in plaats van in een eigen sectie.

1. **Kop met keuzehulp** &mdash; donker en compact. Links: eyebrow met de collectie en het aantal
   modellen, een korte tweeslags kop, één regel lede, een foto van het apparaat in gebruik, een
   bewijskaart (score met het aantal beoordelingen én één echt citaat van een geverifieerde koper)
   en de geruststellers met icoon. Rechts een lichte kaart met twee of drie genummerde vragen en
   het matchpaneel eronder: foto, naam, één zin, drie redenen, prijs, knop en voorraadregel. Bouw
   de keuzehulp zo dat elk apparaat precies één combinatie wint; wint een apparaat niets, dan staat
   het er voor de vorm bij en hoort het uit de collectie. Alles in het matchpaneel wisselt mee met
   de keuze, ook het lintje: geef elk apparaat een lintje dat waar is (meest gekozen, laagste
   prijs, nieuw) in plaats van overal hetzelfde.

   **De foto staat als plaat in de kolom, niet als volle achtergrondband.** Een band over de hele
   breedte is ongeveer 5:1; van een 16:9-foto blijft daarin een strook over waarin geen apparaat
   meer te herkennen is, hoe je de uitsnede ook verschuift. In een kolom van ruwweg 450&nbsp;px past
   de hele scene wél. Wil je toch een achtergrond over de volle breedte, dan moet de foto daar
   speciaal voor geschoten of gegenereerd zijn.

   **Zet geen apparaten op een rij als productsilhouetten.** Het oogt als een catalogusblad, het
   valt op mobiel uit elkaar, en het raster eronder toont dezelfde apparaten al mét naam en prijs.
   Eén foto van het apparaat in gebruik doet meer dan vier vrijstaande silhouetten naast elkaar.

2. **Zonebalk** &mdash; plakkend, direct onder de kop. Kruimelpad, de zones met hun aantal, en één
   regel die zegt wat je bekijkt. Dit vervangt de kale titel met chips.
3. **Het raster** &mdash; meteen na de zonebalk, en opgedeeld in drie groepen met een eigen kop:
   de apparaten waar je uit kiest, de bundels die goedkoper zijn dan los, en de messen en koppen
   die je later nodig hebt. Eén lange rij van twaalf kaarten leest als een magazijn; drie groepen
   van vier lezen als een winkel. Boven het raster staat een balk met de typefilters, de sortering
   en een vergelijkknop; daaronder een regel die laat zien op welke antwoorden uit de keuzehulp
   de pagina is afgestemd, met een manier om die te wissen.

   De kaart draagt: label linksboven, vergelijkvinkje rechtsboven, de eigen beoordeling mét
   aantal (of eerlijk 'nog geen reviews'), twee kenmerkchips, prijs met doorgestreepte vanprijs,
   de besparing als aparte pil, en een volle knop. Bij een bundel vervangt het aantal onderdelen
   uit de doos de beoordeling; bij een mes of kop komt er een snelknop naast die rechtstreeks in
   de winkelwagen legt. De volledige vergelijking &mdash; waarvoor gemaakt, wat hij extra kan, wat
   hij niet doet &mdash; zit in een uitklap die opent vanuit de vergelijkknop en alleen de
   aangevinkte apparaten toont.

   **De kaart komt uit het thema, niet uit een nieuw ontwerp.** `assets/ws-bestsellers.css` bevat
   de kaart met het monogram achter de packshot dat bij hover naar voren komt (0,62s,
   `cubic-bezier(.22,.61,.36,1)`, van `scale(1.14)` naar 1, packshot 1,035×). Neem die waarden
   letterlijk over, inclusief de twee uitzonderingen die er al in zitten: op een apparaat zonder
   muis staat het monogram zacht aan omdat hover daar nergens vandaan komt, en bij
   `prefers-reduced-motion` vervallen de overgangen. De kaart die de keuzehulp aanwijst, krijgt
   het monogram permanent.

   **Het monogram werkt alleen achter een vrijstaande packshot.** Staat de productfoto op zijn
   eigen lichte vlak, dan dekt dat vlak het monogram af en zie je bij hover hooguit een randje
   goud — het effect lijkt stuk terwijl de CSS klopt. Maak de packshots dus vrij (zie de
   werkwijze bij blok 1) en laat de tegel zelf de kleur dragen: neutraal grijs in rust, een warm
   zandverloop bij hover. Dat verloop van koel naar warm is de helft van het effect; het monogram
   alleen is te subtiel, zeker in een verkleinde weergave.
4. **Over deze categorie** &mdash; zand. De uitleg die anders als SEO-tekst onderaan verdwijnt:
   wat de categorie is, waarin ze verschilt van de buurcategorie, hoe de apparaten zich tot elkaar
   verhouden, het mechanisme waarom het werkt op déze plek, hoe je het veilig gebruikt en wat je
   los kunt vervangen. Haal de inhoud voor dat mechanisme uit de reviews: waar goede en slechte
   ervaringen uiteenlopen, zit een uitlegfout die vóór de aankoop hoort.

   Dit blok is ook het SEO-blok, en dat stelt eisen aan de vórm, niet alleen aan de tekst:
   één `<section>`, een `<h2>` met de vraag die de bezoeker stelt, `<h3>`'s boven de vergelijking
   en de gebruikstips, echte alinea's, een echte `<ol>` voor de stappen, en beschrijvende links
   naar de productpagina's — nooit "klik hier". De tekst staat gewoon zichtbaar in de HTML: niet
   achter een accordeon, niet in een afbeelding, niet door JavaScript ingeladen. Zoek de routes op
   in de winkel en controleer ze; een verzonnen URL kost meer dan een ontbrekende link.

   Zet de leesregel op 65 tot 70 tekens (`max-width` in `ch`) en laat de illustratie in een
   `<figure>` staan met een bijschrift dat het mechanisme in één zin herhaalt. Een getekende
   doorsnede krijgt `role="img"` met dezelfde beschrijving als alt, zodat hij niet als lege plek
   in een schermlezer valt.
5. **Bewijs uit deze zone** &mdash; licht en kort. Drie beoordelingen, gekozen op het bezwaar dat ze
   wegnemen. **Hang elk citaat aan het apparaat waar het over gaat:** foto, een link naar die
   productpagina, de score van dát apparaat en het feit dat de schrijver een geverifieerde koper is.
   Een los citaat van een gebruikersnaam staat op de laagste trede van de geloofwaardigheidsladder;
   met de bron erbij klimt het twee treden, zonder dat er iets verzonnen wordt. Een aparte rij met
   scores erboven kan dan weg &mdash; die cijfers staan al op de kaarten in het raster.
6. **Slotband** &mdash; donker. De garanties, vijf vragen over déze apparaten, en daaronder de
   andere zones voor wie hier verkeerd zit. Geef elke garantie een icoon: vier tekstjes onder
   elkaar lezen als kleine lettertjes, terwijl dit juist de regels zijn die de aarzeling wegnemen.
   Op desktop staan ze als één rij van vier in een omlijnde strook; op mobiel worden het vier
   kaarten in een schuifstrip van ongeveer 72% breed, zodat de rand van de volgende zichtbaar
   blijft. Een raster van twee bij twee maakt er een grijs vierkant van dat niemand leest.

Blok 1, 2, 3 en 6 zijn verplicht. De keuzehulp in blok 1 en het mechanisme in blok 4 zijn dat
zodra de producten in een collectie op elkaar lijken. Verwijder wat een zone niet heeft in plaats
van het te vullen.

## Wat per collectie verandert, en wat niet

Vast: de vorm, de volgorde, de componenten en het ritme licht-donker. Anders per collectie:
de kop en de lede, het herobeeld, de vragen en uitkomsten van de keuzehulp, de gekozen reviews,
het mechanisme, de FAQ en de SEO-tekst. Een collectiesjabloon dat overal dezelfde tekst toont,
is precies de pagina die je aan het vervangen bent.

## Regels die hier vaker fout gaan

- **Eén cijfer boven de vouw mag, maar zeg waar het over gaat.** Een score bij een aantal
  beoordelingen is het sterkste bewijs dat er is en dus ook het gevaarlijkste om af te ronden.
  Reken het gewogen gemiddelde uit over de producten die op de pagina staan en zet erbij dat het
  daarover gaat; plak er geen platformlogo bij als het cijfer niet van dat platform komt. Het
  citaat ernaast is een echte review met de naam erbij &mdash; een verzonnen koper is verzonnen
  bewijs, ook als hij precies zegt wat je nodig hebt.
- **Toon de eigen beoordeling per product, met het aantal erbij.** Eén afgerond winkelcijfer op
  elke kaart maakt van 779 beoordelingen één vlak getal, en zet een score bij een product dat er
  geen heeft. Heeft een product nog geen beoordelingen, schrijf dat dan op.
- **De hele zone hoort op de pagina.** Messen, koppen en bundels staan vaak in een andere
  collectie terwijl ze bij dezelfde plek horen en goed verkopen.
- **De keuzehulp en het raster horen aan elkaar vast.** Het antwoord bovenaan bepaalt welke kaart
  het label 'beste match' krijgt en staat als leesbare regel boven het raster, met een knop om het
  te wissen. Anders is de keuzehulp een speeltje dat losstaat van de pagina eronder.
- **Geen absolute belofte over sneetjes.** Schrijf dat het ontwerp de káns op sneetjes en trekken
  helpt verkleinen, of dat het daarvoor gemaakt is. "Nooit meer wondjes" is niet waar te maken,
  staat haaks op de reviews die er zelf over schrijven, en is precies het soort claim waarop een
  bezoeker de rest van de pagina afrekent. Een klant mag het in zijn review wel zo zeggen; wij niet.
- **Geen prijzen in de categorietekst.** Prijzen staan op de kaarten en veranderen; een prijs in
  lopende tekst veroudert stil.
- **Getallen op een bundelkaart komen uit `included_box`.** Het aantal onderdelen dat de
  productpagina toont, is hetzelfde aantal dat hier hoort te staan; iets anders tellen levert twee
  pagina's op die elkaar tegenspreken.
- **Controleer de achtergrond van elke productfoto voordat je ze naast elkaar zet.** Setfoto's
  staan door elkaar op wit en op zwart; in één raster springt dat eruit. Er is meestal een
  lichte variant van dezelfde set.
- **Eén verzendgrens, één reviewgetal, op de hele pagina.** Koptekst, FAQ en SEO-tekst lopen in
  de praktijk uit elkaar; zoek ze alle drie op voordat je publiceert.
- **Testproducten en kopieën horen niet in een collectie.** Ze zijn onzichtbaar in de winkel maar
  tellen wel mee in het aantal.
- **Een collectiepagina hoeft geen aanbod te pushen.** Er is er al één: het raster. Wil je toch een
  aanbod tonen, neem dan de duurste complete set &mdash; die zet de rest van de prijzen in
  verhouding &mdash; en houd het bij één smalle strook onder het raster: foto, naam, wat erin zit,
  prijs met vanprijs, en een link. Geen gouden plaat, geen kortingsbadge, geen aparte sectie. Een
  volwaardig aanbodblok hoort op een landingspagina, niet hier; het maakt de scroll langer op de
  plek waar de bezoeker juist aan het kiezen is.
- **Knoppen die rechtstreeks in de winkelwagen leggen, alleen bij onderdelen.** Bij een apparaat
  valt er nog te kiezen; daar is de productpagina de volgende stap, geen omweg.

## Hetzelfde sjabloon over meerdere zones uitrollen

Zodra de eerste zonepagina staat en is goedgekeurd, is het sjabloon vast en verandert alleen de
inhoud. Bouw de volgende zones dan uit één generator met een inhoudsbestand per zone, niet door
het HTML-bestand te kopiëren: de kaart, de keuzehulp, het raster en de slotband zijn dan
gegarandeerd identiek, en een correctie landt in één keer op alle pagina's. Wat per zone
verschilt is inhoud, en dat hoort in een `dict` te staan — niet in de opmaak.

- **Controleer eerst status en voorraad, dan pas tel je.** `status:ARCHIVED` met voorraad erop
  betekent dat het product niet te koop is maar wel in elke telling meeloopt; negatieve voorraad
  op een actief product betekent uitverkocht zonder dat de winkel dat toont. Beide zijn een
  bevinding voor de audit én een reden om de kaart anders te tonen. Laat de keuzehulp nooit
  uitkomen op iets wat niet leverbaar is; geef zo'n apparaat een grijze kaart met een eerlijke
  regel in plaats van een koopknop.
- **`custom.included_box` is de beste bron voor "wat kan dit apparaat".** Zoek de metaobjecten op
  in plaats van op de marketingtekst te vertrouwen: daar staat letterlijk of er een neus- en
  oorhaaropzetstuk, een reinigingsstation of een travelbag in de doos zit. Spreken de USP en de
  doosinhoud elkaar tegen, houd dan de doosinhoud aan en meld het verschil.
- **Laat het aantal vragen de zone volgen.** Drie vragen is geen wet. Een zone met vier apparaten
  waarvan één uitverkocht heeft genoeg aan twee vragen; een zone die uit twee parallelle
  productlijnen bestaat wordt het scherpst met één vraag van vier opties (de trede) maal één van
  twee (de lijn), zodat elk apparaat precies één combinatie wint. Een derde vraag die niets
  verandert is decoratie, en de bezoeker merkt dat.
- **Twee producten die alleen in afwerking verschillen zijn een bevinding, geen keuze.** Staan er
  twee varianten met dezelfde doosinhoud en alleen een andere kleur, dan laat je de keuzehulp de
  goedkoopste aanwijzen en zet je de ander ernaast in het raster met de reden waarom hij bestaat.
  Vier losse kaarten die in werkelijkheid twee keer een kleur zijn, laten de bezoeker vier keer
  afwegen wat hij één keer moet kiezen. Meld het in de audit: dit hoort een variant op één
  productpagina te zijn.
- **Beoordelingen worden bij verwante producten gedeeld.** Loox toont bij gegroepeerde producten
  grotendeels dezelfde stroom, met de productnaam ín de tekst vervangen — dezelfde recensie
  verschijnt dan onder twee apparaten met een ander woord erin. Meet dat vóór je een cijfer
  opschrijft: vergelijk de namen en de eerste tekens van de teksten tussen twee producten. Bij
  noemenswaardige overlap tel je de aantallen niet bij elkaar op maar noem je één apparaat met
  zijn eigen aantal, of je zet de score één keer boven de groep met de uitleg erbij. Kies citaten
  die inhoudelijk over dát apparaat gaan, en schrijf in de bronregel wat er aan de hand is: dat is
  geloofwaardiger dan acht keer hetzelfde cijfer op acht kaarten — precies het gebrek waar de
  redesign mee begon.
- **Teken niets.** Geen mens, en ook geen mechanisme. Dit is twee keer misgegaan: eerst met
  getekende lichamen en gezichten, daarna — nadat de regel was aangescherpt tot "wel een
  mechanisme, geen mens" — met met de hand gezette SVG-doorsneden van een scheerkop, een
  trimmerkam en een neuskap. Ook die zijn eruit gehaald, met hetzelfde oordeel: *dit ziet er
  gewoon echt niet uit.* Een met de hand geschreven lijntekening leest als een schets naast
  studiofoto's van hetzelfde product, en op een pagina die het van geloofwaardigheid moet
  hebben straalt dat af op de rest.

  Wat wél mag: pictogrammen in de interface (een vinkje, een chevron, een cadeautje op een
  filterknop) en gegenereerde icoontjes in de huisstijl, zoals de zone-iconen in het megamenu.
  Dat zijn symbolen, geen illustraties.

  Valt er iets uit te leggen, leg het uit **in de tekst**. Bij alle drie de pagina's bleek het
  bijschrift onder de tekening al woordelijk in de lopende tekst te staan — de tekening voegde
  dus niets toe wat de alinea niet al zei. Zonder beeld wordt het blok één brede kolom
  (`.cat.solo`), precies zoals de overzichtspagina er altijd al uitzag, en dat leest prima. Zet
  er ook geen AI-gegenereerde foto voor in de plaats. De echte productfoto's staan al in het
  raster erboven.
- **Houd lintjes op kaarten kort.** Meer dan ongeveer twintig tekens wordt afgekapt in de tegel;
  het aantal bestellingen hoort dan in het matchpaneel of in de audit, niet op de kaart.

## De overkoepelende collectiepagina

`/collections/all` is hetzelfde sjabloon met een andere taak. Een zonepagina helpt kiezen tussen
apparaten die op elkaar lijken; de overkoepelende pagina moet de bezoeker in één scherm naar de
juiste zone brengen. Dat verandert vier dingen, en verder niets — wijk niet verder af, want het
is dezelfde collectie en dezelfde kaart.

- **Een zonekiezer in plaats van een productkeuzehulp.** De vraag is hier niet "welke van deze
  vier" maar "waar wil ik beginnen". Twee vragen — de zone, en of het één apparaat of een set
  moet zijn — leiden naar één uitkomst per zone per vorm. Kies als uitkomst het best verkopende
  apparaat van die zone en de ruimste set, niet het duurste.
- **Het raster sorteert op zone, niet op categorie.** Eén groep per zone met een eigen kop en een
  link naar de zonepagina, daarna de sets en de onderdelen. Eén rij van vijftig kaarten leest als
  een magazijn; vier zones met een uitgang lezen als een winkel.
- **Geen vergelijker.** Vergelijken hoort binnen één zone, tussen apparaten die hetzelfde werk
  doen. Een hoofdscheerder naast een neustrimmer leggen helpt niemand. Laat dan ook de
  vergelijkvinkjes en de knop in de filterbalk weg — een knop die niets doet is erger dan een
  knop die er niet is.
- **De foto is een band van vier.** Eén beeld dekt vier zones niet. Zet vier eigen foto's naast
  elkaar als verticale sneden in dezelfde 16:8-plaat, één per zone, met een smalle tussenruimte.
  Dat toont de hele collectie zonder dat er iets gegenereerd hoeft te worden.

**Lees de collectie uit, niet de tags.** De collectie is wat de bezoeker ziet, en die bevat
doorgaans meer dan de winkel verkoopt: gearchiveerde producten, concepten, testkopieën en
uitverkochte onderdelen tellen mee in elk getal dat je erop baseert. Vraag daarom per product
`status`, `totalInventory` en `tags` op, plus `sortOrder` van de collectie zelf — een handmatige
sortering over tientallen producten betekent bijna altijd dat het best verkopende artikel ergens
onderaan staat. Tel daarna twee keer: wat er in de collectie zit, en wat je er werkelijk van kunt
kopen. Het verschil tussen die twee getallen is de kop van de audit.

**Let op sets die op één onderdeel wachten.** Staat een apparaat op negatieve voorraad, controleer
dan welke bundels het in de doos hebben; die staan dan meestal ook stil. Eén uitverkocht apparaat
dat vier verkoopbare kaarten meeneemt, is een bevinding die niemand ziet zolang je per product
kijkt.
