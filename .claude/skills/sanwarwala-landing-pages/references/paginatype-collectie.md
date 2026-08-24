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
   wat de categorie is, hoe de apparaten zich tot elkaar verhouden, en het mechanisme waarom het
   werkt op déze plek. Haal de inhoud voor dat mechanisme uit de reviews: waar goede en slechte
   ervaringen uiteenlopen, zit een uitlegfout die vóór de aankoop hoort.
5. **Bewijs uit deze zone** &mdash; donker. De score per apparaat, en drie beoordelingen gekozen op
   het bezwaar dat ze wegnemen.
6. **Compleet maken** &mdash; donker. De bundel die al bestaat, plus de losse messen en koppen.
7. **Slotband** &mdash; donker. De garanties als smalle strook, vijf vragen over déze apparaten, en
   daaronder de andere zones voor wie hier verkeerd zit.

Blok 1, 2, 3 en 7 zijn verplicht. De keuzehulp in blok 1 en het mechanisme in blok 4 zijn dat
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
- **Knoppen die rechtstreeks in de winkelwagen leggen, alleen bij onderdelen.** Bij een apparaat
  valt er nog te kiezen; daar is de productpagina de volgende stap, geen omweg.
