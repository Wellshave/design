# 4. Planning en lanceerchecklist

> **Over de datum.** De briefing vraagt dat de actie op **23 september 2026** live kán. Het
> voorbereidende werk hieronder is af, maar drie dingen zijn niet met een toetsenbord op te
> lossen: de pasvorm van de hardcase moet fysiek getest, de kapotte €90-cadeaubalk moet eerst
> weg, en de foto van de open case bestaat nog niet. De planning is daarom opgeschreven in
> dagen vóór de livegang, zodat hij klopt op welke dag je ook start.

---

## 4.1 Planning

### Dag , 3: beslissen

| Wat | Wie |
|---|---|
| **Pasvormtest.** Leg alle vier de bodygroomers in The Hard Case. Noteer per model: past het apparaat, passen de opzetstukken mee. Maak er foto's bij | Product |
| Beslis over de twee UNLISTED MIJU-kopieën: meedoen of niet | Marketing |
| Beslis de retourregel voor het cadeau, en lever de zin aan | Klantenservice |
| Bepaal hoeveel van de 873 hardcases je voor de actie reserveert | Inkoop |
| Marge doorrekenen met de inkoopprijs van de case | Finance |
| **Fotoshoot open hardcase** met apparaat, warm herfstlicht, zwarte achtergrond | Creatie |

### Dag , 2: bouwen

| Wat | Wie |
|---|---|
| **De €90-cadeaubalk repareren of uitzetten.** Zie `05-bevindingen-webshop.md` | Development |
| Kopie maken van het live thema → `wellshave/herfst-sale` | Development |
| De vijf codestappen uit `03-implementatieplan.md` § 3.3 | Development |
| Cadeau-artikel `gift-the-hard-case` aanmaken, €0,00, unlisted, voorraad bijhouden | E-commerce |
| Metaobject `gratis-hardcase` (badge) aanmaken | E-commerce |
| Metaobject `herfst-sale-hardcase` (limited offer) aanmaken | E-commerce |
| Pagina `/pages/herfst-sale-voorwaarden` aanmaken | E-commerce |
| Nieuwe sleutels in `locales/nl.json` | Development |

### Dag , 1: testen

| Wat | Wie |
|---|---|
| Voorbeeldlink van het themakopie delen | Development |
| **De volledige testlijst uit § 4.3 aflopen**, desktop én mobiel | E-commerce + Marketing |
| Twee proefbestellingen tot en met betaling, zie § 4.4 | E-commerce |
| Voorraadwaarschuwing instellen op The Hard Case | Inkoop |
| Alle gevonden punten oplossen en opnieuw testen | Development |

### Dag 0: live

| Tijd | Wat | Wie |
|---|---|---|
| 08.00 | Thema publiceren | Development |
| 08.15 | Tag `herfst-cadeau` op de vier producten zetten | E-commerce |
| 08.20 | Metaobjecten koppelen aan de vier producten | E-commerce |
| 08.30 | `enable_product_gift` aanzetten, met start- en einddatum ingevuld | Development |
| 08.35 | Alle teksten uit § 4.2 vervangen | Marketing |
| 09.00 | **Rookproef op de echte winkel**, desktop en mobiel | Iedereen |
| 09.30 | Advertenties en e-mail aanzetten | Marketing |
| Hele dag | Bestellingen meekijken: staat de cadeauregel erbij en op €0,00? | E-commerce |

### Tijdens de actie

| Wanneer | Wat |
|---|---|
| Elke ochtend, eerste week | Vijf verse bestellingen nakijken op de cadeauregel |
| Wekelijks | Voorraad hardcase tegen het verbruik |
| **di 27 oktober** | Slotboodschap plaatsen, teksten uit `02-websiteteksten.md` § 2.8 |
| **vr 30 oktober, 23.59** | Einde. Het thema stopt zelf, zie § 4.5 |
| **za 31 oktober** | Alles terugdraaien, zie § 4.5 |

---

## 4.2 Alle Summer Sale-vermeldingen vervangen

Elf plekken. Het mobiele menu staat er expliciet bij, want dat wordt het vaakst vergeten.

| ✓ | # | Plek | Staat er nu | Moet worden |
|---|---|---|---|---|
| ☐ | 1 | **Bovenbalk** (`announcement.settings.label`) | "Summer Deals tot 40%." + link naar `/collections/winter-sale` | Tekst uit § 2.1, link naar `/collections/bodygroomers` |
| ☐ | 2 | Megamenu, kicker (`banner_kicker`) | "Summer Sale" | `Herfst Sale` |
| ☐ | 3 | Megamenu, titel (`banner_title`) | "Tot 40% korting" | `Gratis hardcase` |
| ☐ | 4 | Megamenu, subtekst (`banner_subtitle`) | "Voordeel op geselecteerde apparaten en complete sets." | `Bij elke losse bodygroomer. T/m 30 oktober.` |
| ☐ | 5 | Megamenu, knop (`banner_btn_label` + `_link`) | "Shop de sale" → summer-sale-deals | `Bekijk de bodygroomers` → `/collections/bodygroomers` |
| ☐ | 6 | Hoofdmenu (`menu_item_2.label` + `link`) | "SALE" → summer-sale-deals | `HERFST SALE` → `/collections/bodygroomers` |
| ☐ | 7 | **Mobiel menu, actiebalk** (`header.settings.mob_actie_tekst`) | "Summer Sale · tot 40% korting" | `Herfst Sale · gratis hardcase` |
| ☐ | 8 | **Mobiel menu, actiebalk link** (`mob_actie_link`) | summer-sale-deals | `/collections/bodygroomers` |
| ☐ | 9 | **Mobiel menu, subregel** (`menu_item_2.mob_sub`) | "Tot 40%" | `Gratis hardcase` |
| ☐ | 10 | Homepagebanner, sectie `ws-hero` | badge "Summer Sale", kop "Jij wilt verzorgd…" | Teksten uit § 2.2 |
| ☐ | 11 | Productpagina's, `custom.limited_offer` | metaobject `voorjaar-sale` | nieuw `herfst-sale-hardcase` op de vier apparaten |

### Ook nakijken

| ✓ | Wat |
|---|---|
| ☐ | Het zonnetje-icoon in de mobiele actiebalk (`#wsm-zon`) vervangen door het cadeau-icoon (`#wsm-cadeau`). Dat bestaat al in het thema |
| ☐ | Het hero-icoon `#ws-h-zon` idem |
| ☐ | Klaviyo: lopende e-mails en flows met Summer Sale erin |
| ☐ | Advertenties: creatives en teksten met "tot 40%" |
| ☐ | Collectie `summer-sale-deals`: blijft die bestaan, of wordt hij omgezet? De kortingen op die 19 producten blijven sowieso staan, die hangen aan van-prijzen |
| ☐ | Banner-afbeelding `redesign_header_banner.webp` vervangen door herfstbeeld |

---

## 4.3 Testlijst, desktop en mobiel

Loop dit af op de voorbeeldlink van het themakopie, **en daarna nog eens op de echte winkel**
na de livegang.

### Zichtbaarheid

| ✓ | Test | Desktop | Mobiel |
|---|---|---|---|
| ☐ | Bovenbalk toont de Herfst Sale-tekst en breekt niet af | ☐ | ☐ |
| ☐ | Bovenbalk-link komt uit op `/collections/bodygroomers` | ☐ | ☐ |
| ☐ | Homepagebanner toont kop, subtekst en knop | ☐ | ☐ |
| ☐ | Mobiel menu: actiebalk zegt Herfst Sale, met cadeau-icoon | , | ☐ |
| ☐ | Mobiel menu: de SALE-regel zegt "Gratis hardcase" | , | ☐ |
| ☐ | Collectie bodygroomers: kop en intro kloppen | ☐ | ☐ |
| ☐ | **Alle vier** de kaarten tonen het label "Gratis hardcase" | ☐ | ☐ |
| ☐ | Op de Groom Guard staan twee badges zonder overlap | ☐ | ☐ |
| ☐ | Bundels tonen het label **niet** | ☐ | ☐ |
| ☐ | Productpagina: cadeaublok staat boven de bestelknop | ☐ | ☐ |
| ☐ | Mobiel: cadeaublok valt binnen het eerste scherm | , | ☐ |
| ☐ | Sticky koopbalk zegt "+ gratis hardcase" | , | ☐ |
| ☐ | Bij 390 px breed geen horizontale schuifbalk | , | ☐ |

### Gedrag van het cadeau

| ✓ | Test | Verwacht |
|---|---|---|
| ☐ | 1× Groom Guard in de wagen | 1 hardcase op €0,00, melding "Gelukt…" |
| ☐ | Aantal naar 2 | 2 hardcases, melding met het aantal |
| ☐ | Aantal terug naar 1 | 1 hardcase |
| ☐ | Groom Guard verwijderen | Hardcase verdwijnt, melding wordt de uitnodiging |
| ☐ | Groom Guard + Flex Guard | 2 hardcases |
| ☐ | Alleen Shave Package Ultimate (bundel) | Geen cadeau, bundelmelding |
| ☐ | **Alleen Essential Flex Bundel** (heeft geen tags) | Geen cadeau. Dit is de val uit § 1.4 |
| ☐ | Bundel + losse Groom Guard | 1 hardcase |
| ☐ | Alleen een neustrimmer | Geen cadeau |
| ☐ | Klant probeert het cadeau te verwijderen | Kan niet, knoppen zijn verborgen |
| ☐ | Klant probeert het aantal te wijzigen | Kan niet |
| ☐ | Wagen legen | Geen cadeauregels meer |
| ☐ | Pagina verversen met cadeau in de wagen | Blijft precies één cadeau, niet twee |
| ☐ | Twee tabbladen tegelijk openen en toevoegen | Geen dubbele cadeaus |
| ☐ | Naar `/cart` in plaats van de lade | Cadeau staat er ook, en synchroniseert |

### Samenloop

| ✓ | Test | Verwacht |
|---|---|---|
| ☐ | Groom Guard + Flex Guard = €109,90 | 2 hardcases **plus** de washbag van €65 |
| ☐ | Telt de gratis hardcase mee voor de €65? | **Nee** |
| ☐ | Telt de gratis hardcase mee voor gratis verzending vanaf €30? | **Nee** |
| ☐ | Kortingscode WELCOME15 invullen met cadeau in de wagen | Code werkt, cadeau blijft €0,00 |
| ☐ | Kortingscode BUNDEL10 idem | Idem |
| ☐ | Twee Groom Guards (de "Groom Guard Upgrade"-korting) | Korting werkt, cadeau blijft |
| ☐ | Hardcase óók los toevoegen | Betaalde + gratis case. Bewuste keuze, zie § 3.5 |

### Uitverkocht en datum

| ✓ | Test | Verwacht |
|---|---|---|
| ☐ | Zet de voorraad van het cadeau-artikel tijdelijk op 0 | Strook verdwijnt, geen belofte meer |
| ☐ | Zet hem op 1 en leg 3 bodygroomers in de wagen | 1 hardcase, geen foutmelding |
| ☐ | Zet de einddatum op gisteren | Blok verdwijnt helemaal |
| ☐ | Zet de startdatum op morgen | Blok verschijnt nog niet |
| ☐ | Zet beide goed terug | |

> Zet de voorraad na de test terug op het juiste aantal. Noteer wat het was vóór je iets
> wijzigt.

---

## 4.4 Proefbestellingen

Twee echte bestellingen tot en met betaling, want alleen op de afrekenpagina zie je wat de
klant werkelijk betaalt. Dat is precies waar de €90-drempel al vier maanden misgaat.

**Proefbestelling 1, het gewone geval**

1. Groom Guard™ (€49,95) in de wagen
2. Controleer in de lade: hardcase op €0,00, melding, subtotaal €49,95
3. Doorklikken naar afrekenen
4. **Controleer op de afrekenpagina: staat de hardcase op €0,00 en is het totaal €49,95
   plus verzending?**
5. Afrekenen
6. Controleer de bestelling in Shopify: twee regels, SKU van de case erbij, waarde €0,00
7. Controleer de bevestigingsmail: staat de case erop?

**Proefbestelling 2, het samenloopgeval**

1. Groom Guard™ + Flex Guard™ = €109,90
2. Verwacht: 2 hardcases van €0,00 **en** de gratis washbag
3. Vul kortingscode WELCOME15 in
4. **Controleer het eindbedrag tot op de cent**
5. Afrekenen en de bestelling nakijken

| ✓ | Extra controle |
|---|---|
| ☐ | Pakbon: herkent het magazijn de gratis case? SKU is gelijk aan het betaalde artikel |
| ☐ | Wordt de voorraad van de echte hardcase goed afgeboekt? |
| ☐ | Klantenservice weet wat te doen bij een retour van alleen het apparaat |

---

## 4.5 Terugdraaien op 31 oktober

Het thema stopt zichzelf om 30 oktober 23.59.59 dankzij de einddatum. Alles wat een
metaobject of een tekst is, gaat niet vanzelf weg.

| ✓ | Wat | Waar |
|---|---|---|
| ☐ | `enable_product_gift` uit | Thema-instellingen |
| ☐ | Tag `herfst-cadeau` van de vier producten af | Shopify, producten |
| ☐ | Metaobject `gratis-hardcase` loskoppelen van `custom.tags` | Vier producten |
| ☐ | `custom.limited_offer` leegmaken | Vier producten |
| ☐ | Bovenbalk terug | Thema-editor |
| ☐ | Homepagebanner terug naar de vaste versie | Thema-editor |
| ☐ | Megamenu en mobiele actiebalk terug | Thema-editor |
| ☐ | Campagne-alinea uit de collectieomschrijving | Shopify, collectie |
| ☐ | Cadeau-artikel `gift-the-hard-case` op draft | Shopify, producten |
| ☐ | Gereserveerde voorraad terug naar de losse verkoop | Shopify, voorraad |
| ☐ | Voorwaardenpagina op verborgen | Shopify, pagina's |
| ☐ | Advertenties en e-mails uit | Meta, Klaviyo |

**Laat staan:** het metaobject `gratis-hardcase` zelf, het cadeau-artikel en de code in het
thema. Die zijn volgende keer in vijf minuten weer aan te zetten. Het hele punt van de
instellingen in § 3.3 is dat de volgende cadeauactie geen nieuw maatwerk hoeft te zijn.

---

## 4.6 Wat wanneer fout kan gaan

| Signaal | Waarschijnlijke oorzaak | Wat te doen |
|---|---|---|
| Cadeau verschijnt niet | Tag niet gezet, of `enable_product_gift` uit | Tag en instelling nakijken |
| Cadeau verschijnt dubbel | Twee `syncGiftProduct`-rondes overlappen | `syncingGiftProduct`-vlag nakijken |
| Cadeau blijft na verwijderen apparaat | `want` wordt niet 0 | Rendert de sectie opnieuw na de wijziging? |
| Cadeau kost geld op de afrekenpagina | Verkeerde variant gekoppeld, of prijs staat niet op €0,00 | **Actie direct pauzeren**, dit is de fout uit § 5.1 |
| Bundelkoper krijgt een cadeau | Bundel draagt de tag | Tag weghalen |
| "Sold out" bij het toevoegen | Cadeauvoorraad op | Strook verdwijnt vanzelf; voorraad bijvullen of actie stoppen |

Bij het vierde signaal: eerst `enable_product_gift` uitzetten, dan pas uitzoeken. Een cadeau
dat niet verschijnt kost omzet, een cadeau dat geld kost bij het afrekenen kost vertrouwen.
