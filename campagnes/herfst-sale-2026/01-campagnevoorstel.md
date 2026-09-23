# 1. Campagnevoorstel Herfst Sale 2026

> Alle productgegevens hieronder komen rechtstreeks uit de live Shopify-catalogus van
> wellshave.com, uitgelezen op 22 september 2026. Niets is geschat of verzonnen.

---

## 1.1 Het aanbod

**Koop een losse bodygroomer, krijg de Wellshave hardcase gratis.**

| Regel | Invulling |
|---|---|
| Wat je krijgt | 1× The Hard Case, normaal €14,95 |
| Waarvoor | Per gekochte losse bodygroomer |
| Bij twee apparaten | Twee hardcases |
| Bundels | Vallen erbuiten |
| Kortingscode | Geen. Het cadeau wordt automatisch toegevoegd |
| Prijzen | Blijven zoals ze nu in de winkel staan. Geen extra korting |
| Looptijd | wo 23 september 2026 t/m vr 30 oktober 2026, 23.59 uur |

Let op bij het inplannen: de zomertijd eindigt op zondag 25 oktober 2026. Het einde van de
actie valt dus in wintertijd. 30 oktober 23.59 uur Nederlandse tijd is **30 oktober 22.59 UTC**.
De start op 23 september 00.00 uur valt nog in zomertijd, dat is **22 september 22.00 UTC**.

---

## 1.2 De deelnemende producten

Dit zijn alle losse bodygroomers die nu zichtbaar in de winkel staan, uit de collectie
`bodygroomers`.

| Apparaat | Handle | Variant-ID | Prijs | Van-prijs | Kortingslabel | Voorraad |
|---|---|---|---|---|---|---|
| Dual Groomer™ 2-in-1 | `wellshave-2-in-1-bodygroomer-mannen` | 48543344099660 | €39,95 | €79,92 | 50% Korting | 119 |
| Groom Guard™ | `wellshave-bodygroomer-groom-guard` | 40343701946411 | €49,95 | €71,35 | 29% Korting | 164 |
| Groom Guard™ PRO | `groom-guard-pro` | 53384928395596 | €59,95 | €85,65 | 30% Korting | 164 |
| Flex Guard™ 3-in-1 | `wellshave-flex-guard™` | 55880465580364 | €59,95 | €85,65 | 30% Korting | 158 |

Samen **605 stuks op voorraad**.

De kortingspercentages zijn de percentages die het thema zelf uitrekent uit prijs en van-prijs
(`snippets/ws-spaar.liquid`, naar beneden afgerond). Die staan er dus al, los van deze actie.

### Twee verborgen producten in dezelfde collectie

De collectie `bodygroomers` bevat nog twee producten met status `UNLISTED`:

- Groom Guard™ PRO (MIJU kopie , ADD SET , 003)
- Groom Guard™ PRO (MIJU kopie , ADD SET , 004)

Ze staan niet in de winkel, maar zijn wel bereikbaar via een directe link, en dat is precies
wat kopieën als deze meestal zijn: landingspagina-varianten voor advertenties. **Beslissing
nodig:** doen die mee met de cadeauactie of niet? Als er advertentieverkeer op staat en ze
doen niet mee, dan krijgt een deel van de kopers het cadeau niet terwijl de advertentie het
wel belooft.

---

## 1.3 Het cadeau, en de vraag die er nog onder ligt

| Veld | Waarde |
|---|---|
| Product | The Hard Case |
| Handle | `wellshave-hard-case` |
| Product-ID | 15530717839692 |
| Variant-ID | 56529000268108 |
| SKU | 8720938021497 |
| Prijs | €14,95 (van €21,95) |
| Voorraad | 873, voorraad wordt bijgehouden |
| Beeld | Twee foto's, allebei van een gesloten case |
| Omschrijving | **Leeg** |
| Ondertitel | "Breng je Wellshave mee" |

**Er is één hardcase in de hele catalogus.** "Een passende hardcase per model" betekent dus
in de praktijk: één universele case voor alle vier de apparaten.

### Dit is het belangrijkste open punt

De hardcase heeft **geen omschrijving, geen afmetingen en geen compatibiliteitslijst** in
Shopify. Bij geen van de vier bodygroomers staat een `included_in_the_box`-veld ingevuld. Er
is dus nergens vastgelegd welk apparaat erin past.

Dat is geen detail. De Flex Guard™ 3-in-1 wordt geleverd met een oplaadstandaard en twee
extra opzetkoppen; de Dual Groomer™ is een stuk kleiner. Dat die allebei in dezelfde case
passen is aannemelijk noch bewezen.

**Actie:** leg de vier apparaten fysiek in de case en noteer per model of hij past, en of de
opzetstukken mee kunnen. Pas daarna kun je "gratis hardcase" bij alle vier zetten. Past hij
niet bij een model, dan haal je dat model uit de actie, dat is één tag verwijderen.

---

## 1.4 Wat er buiten valt: de bundels

Deze producten bevatten een bodygroomer maar doen **niet** mee:

| Bundel | Handle | Prijs | Tags in Shopify |
|---|---|---|---|
| Body & Nose Bundel | `wellshave-shave-package-2-0` | €59,95 | Bodygroomer, Bundel |
| Shave Package 3.0 | `wellshave-shave-package-3-0` | €64,95 | Bodygroomer, Bundel |
| Shave Package Ultimate™ | `shave-package-ultimate` | €89,95 | Bodygroomer, Bundel |
| Flex-line Bundel | `body-beard-kit` | €89,95 | baardtrimmer, Bodygroomer, Bundel |
| Essential Flex Bundel | `essential-flex-bundel` | €79,95 | **geen tags** |

> **Val op te letten:** de Essential Flex Bundel heeft géén tag `Bundel` en ook geen
> producttype. Zou je bundels uitsluiten via "alles zonder de tag Bundel", dan glipt deze er
> doorheen en krijgt een bundelkoper alsnog een gratis case.
>
> Het implementatieplan lost dit op door het om te draaien: niet uitsluiten maar **insluiten**.
> Alleen producten die je zelf de tag `herfst-cadeau` geeft, doen mee. Een bundel die je die
> tag niet geeft, kan er per definitie niet doorheen glippen.

---

## 1.5 De aankooproute

1. **Advertentie, e-mail of directe bezoeker** komt binnen op de homepage of op
   `/collections/bodygroomers`.
2. **Bovenbalk** meldt het aanbod op elke pagina, desktop en mobiel.
3. **Homepagebanner** draagt de belofte: "Het wordt kouder. Jij blijft scherp." met één knop
   naar de bodygroomers.
4. **Collectiepagina bodygroomers** toont vier kaarten, elk met het label "Gratis hardcase".
5. **Productpagina** toont direct boven de bestelknop een blok met de case in beeld, de
   waarde, en de regel dat hij automatisch wordt toegevoegd.
6. **In winkelwagen** → de lade opent, de hardcase staat er al bij op €0,00 met het label
   "Gratis cadeau", en een melding bevestigt het.
7. **Afrekenen** → de hardcase staat als eigen regel van €0,00 op de bon.

De route is bewust kort: er is geen extra keuzemoment, geen popup en geen code om te
onthouden. Het cadeau is er gewoon.

---

## 1.6 Advies over stapeling met de bestaande cadeaus

De briefing vroeg dit expliciet na te lopen. De huidige situatie, uitgelezen uit het thema:

| Drempel | Cadeau | Werkt het? |
|---|---|---|
| Vanaf €65 | The Washbag™ | **Ja.** Hij ligt er als apart artikel van €0,00 in |
| Vanaf €90 | Neustrimmer Ultimate™ 4-in-1 | **Nee.** De klant betaalt er €29,95 voor |

Het waarom staat in [`05-bevindingen-webshop.md`](05-bevindingen-webshop.md), met de test
erbij.

### Advies, in volgorde

**1. Repareer of zet de €90-drempel uit vóór 23 september.** Dit is losstaand van de Herfst
Sale en het kan niet wachten: er lopen nu bestellingen doorheen waarin een als gratis
aangekondigd artikel gewoon wordt afgerekend. Er zijn nog maar 7 stuks van de Neustrimmer
Ultimate op voorraad, dus hem laten staan is sowieso geen optie voor 38 dagen actie.
Aanbeveling: zet de drempel uit, of hang hem om naar een neustrimmer met echte voorraad
(Basic 472, Premium 693) **en** maak daar een €0,00-duplicaat van, net als bij de washbag.

**2. Laat de washbag vanaf €65 gewoon doorlopen naast de hardcase.** Drie redenen:

- De briefing zegt bestaande acties niet stilzwijgend te wijzigen. Terecht.
- De overlap is klein. Geen enkele losse bodygroomer haalt in zijn eentje de €65: de duurste
  staat op €59,95. Iemand krijgt dus pas allebei als hij twee apparaten koopt of er iets bij
  legt, en dat is precies het mandje dat je wilt belonen.
- De gratis hardcase telt niet mee voor de €65. Het thema rekent de drempel uit over de
  artikelen zonder cadeaumarkering, dus een cadeauregel van €0,00 duwt niemand kunstmatig
  over de drempel. Dat is nagekeken in `snippets/cart-rewards-bar.liquid` en in de
  bijbehorende JavaScript.

**3. Het eerdere idee om de washbagdrempel te verlagen is vervallen**, zoals afgesproken.
Er verandert dus niets aan de €65.

### Samenloop met kortingscodes

De hardcase gaat als artikel van €0,00 de winkelwagen in en is dus **geen korting**. Dat is
niet alleen eenvoudiger, het voorkomt een concreet probleem: Shopify past standaard maar één
automatische korting per bestelling toe, en er lopen er al drie (Groom Guard Upgrade, 2
Knifes / 15% off, Groomer & Nosetrimmer Basic). Een vierde zou met die drie gaan concurreren.

Daarnaast staan er vijftien actieve kortingscodes, waarvan een deel op "niet combineren met
andere kortingen" staat (WELCOME15, THANKYOU10, LUCA10 en andere). Zou het cadeau een korting
zijn, dan zou het invullen van zo'n code het cadeau kunnen wegdrukken, of andersom. Met een
€0,00-artikel speelt dat niet: de klant houdt het cadeau én kan gewoon zijn code gebruiken.

---

## 1.7 Wat nog gecontroleerd of besloten moet worden

### Blokkeert de livegang

| # | Punt | Wie |
|---|---|---|
| 1 | **Past de hardcase op alle vier de modellen?** Fysiek testen, per model vastleggen | Product |
| 2 | **De €90-cadeaubalk repareren of uitzetten.** Zie `05-bevindingen-webshop.md` | Development |
| 3 | **Foto van een geopende hardcase met apparaat.** Bestaat nog niet | Creatie |

### Nodig vóór livegang, maar niet blokkerend voor de opzet

| # | Punt | Wie |
|---|---|---|
| 4 | **Inkoopprijs van de hardcase** en het effect op de marge per bodygroomer. Niet in Shopify te zien | Finance |
| 5 | **Verkoopprognose** voor 38 dagen. 873 cases tegenover 605 bodygroomers op voorraad: het dekt nu, maar bij bijbestellen van apparaten schuift dat | Finance / Inkoop |
| 6 | **Hoeveel cases reserveren** voor de actie, zodat de losse verkoop van de case niet leegloopt | Inkoop |
| 7 | **Doen de twee UNLISTED MIJU-kopieën mee?** | Marketing |
| 8 | **Retourregel:** stuurt de klant de hardcase mee terug, of verrekenen we €14,95? | Klantenservice |
| 9 | Mag "t.w.v. €14,95" in de teksten staan? Het is de echte winkelprijs, maar zet het even langs de juridische lat | Marketing |

### Open vraag waar ik zelf geen antwoord op kon vinden

Het metaobject `limited_offer` met handle `voorjaar-sale` draagt nu drie seizoenen tegelijk:
de handle zegt voorjaar, de titel zegt "Summer Sale 40%", en de pop-uptitel zegt "Tijdelijke
Vaderdag Sale". Ik weet niet welke productpagina's eraan hangen buiten The Hard Case.
Uitzoeken vóór je hem hergebruikt, anders verandert er meer dan je bedoelt. Het plan gaat er
daarom van uit dat je een **nieuw** metaobject maakt en het oude laat staan.
