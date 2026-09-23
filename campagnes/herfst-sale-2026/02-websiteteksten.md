# 2. Definitieve Nederlandse websiteteksten

> Klaar om te plakken. Per blok staat erbij **waar** in Shopify het veld zit.
> Zie de teksten ook staan in de preview: https://claude.ai/artifact/RAigYGoe6ZjKJDtgYJnhub

**De lijn:** het wordt kouder buiten, jij blijft scherp. Nuchter, geen uitroeptekens, geen
"MEGA DEAL". Het cadeau doet het werk, de tekst hoeft niet te schreeuwen.

---

## 2.1 De bovenbalk

**Waar:** Thema-editor → Header → sectie *Announcement* → veld `label`.
In het thema is dat `sections/header-group.json`, `sections.announcement.settings.label`.

### Tekst

```
Herfst Sale · gratis hardcase bij elke losse bodygroomer. <a href="/collections/bodygroomers"><strong>Shop nu →</strong></a>
```

Zonder opmaak, voor wie hem ergens anders nodig heeft:
**Herfst Sale · gratis hardcase bij elke losse bodygroomer. Shop nu →**

### Korter, als hij op mobiel afbreekt

```
Herfst Sale · gratis hardcase bij elke bodygroomer
```

> **Let op, hier zit nu een fout.** De balk zegt vandaag "Summer Deals tot 40%" maar linkt
> naar `/collections/winter-sale`, een collectie die "Voorjaar Sale" heet. Tekst, link en
> collectienaam wijzen alle drie een andere kant op. Zet de link deze keer naar
> `/collections/bodygroomers`, dan komt de bezoeker uit waar het cadeau ligt.

---

## 2.2 De homepagebanner

**Waar:** Thema-editor → Homepage → sectie `ws-hero`.

| Onderdeel | Tekst |
|---|---|
| Badge | `Herfst Sale · t/m 30 oktober` |
| Kop, regel 1 | `Het wordt kouder.` |
| Kop, regel 2 (goud) | `Jij blijft scherp.` |
| Subtekst | `Bij elke losse bodygroomer leggen we de Wellshave hardcase er gratis bij. Hij verschijnt vanzelf in je winkelwagen, je hoeft geen code in te vullen.` |
| Knop | `Kies jouw bodygroomer` |
| Tekstlink ernaast | `Bekijk de actievoorwaarden` |
| Geruststellers | `100 dagen proberen` · `2 jaar garantie` · `Gratis verzending vanaf €30` |

### Kortere subtekst voor mobiel

```
Bij elke losse bodygroomer leggen we de hardcase er gratis bij. Vanzelf in je winkelwagen, geen code nodig.
```

### Het huidige hero-beeld

De bestaande hero-koptekst is "Jij wilt verzorgd de deur uit. Wij regelen de rest." Die kan
blijven staan als je de banner niet wilt vervangen, maar dan draagt de homepage het aanbod
niet. Aanbeveling: wel vervangen voor de looptijd, en op 31 oktober terugzetten.

---

## 2.3 De bodygroomercollectie

**Waar:** Shopify-beheer → Producten → Collecties → Bodygroomers → omschrijving.
Plus de sectie `ws-collectie-kop` in het sjabloon `collection.zone-lichaam`.

### Kop en intro

| Onderdeel | Tekst |
|---|---|
| Eyebrow | `Bodygroomers · Herfst Sale t/m 30 oktober` |
| Kop, regel 1 | `Kies je bodygroomer.` |
| Kop, regel 2 (goud) | `De hardcase krijg je erbij.` |

**Intro:**

```
Elke losse bodygroomer hieronder komt deze actie met een gratis Wellshave hardcase. Hij wordt
automatisch toegevoegd zodra je apparaat in je winkelwagen ligt, dus je hoeft geen code in te
vullen. Koop je er twee, dan liggen er ook twee cases klaar. Bundels vallen buiten deze actie.
```

### Het cadeaukaartje naast de kop

```
Gratis The Hard Case
t.w.v. €14,95, bij elke losse bodygroomer
Geen kortingscode. Eén case per bodygroomer. Zolang de voorraad strekt.
```

### Alinea om bovenaan de bestaande collectieomschrijving te zetten

De huidige omschrijving over mesjes, waterdichtheid, verzending en retour blijft staan. Zet
dit erboven en haal het er op 31 oktober weer af:

```
Tijdens de Herfst Sale krijg je bij elke losse bodygroomer hieronder een gratis Wellshave
hardcase, t.w.v. €14,95. Hij wordt automatisch aan je winkelwagen toegevoegd, zonder
kortingscode. De actie loopt tot en met 30 oktober 2026. Bundels vallen erbuiten.
```

### Voetregel onder het raster

```
Prijzen zoals ze nu in de winkel staan. De Herfst Sale voegt geen extra korting toe, alleen de gratis hardcase.
```

---

## 2.4 Het label "Gratis hardcase" op productkaarten

**Waar:** Shopify-beheer → Inhoud → Metaobjecten → *Product badge* (type `tag`).
Nieuw metaobject aanmaken, daarna koppelen aan het veld `custom.tags` van de vier
bodygroomers. Het thema rendert dit al, er is geen code voor nodig.

| Veld | Waarde |
|---|---|
| Handle | `gratis-hardcase` |
| `label` | `Gratis hardcase` |
| `background` | `#191816` |
| `color` | `#F5D18A` |

**Waarom donker met goud en niet brons met wit.** De bestaande "Best Seller"-badge is brons
(`#BC813E`) met witte letters. Dat haalt een contrast van ongeveer 3,4 op 1, en dat is voor
een pil van 10 px te weinig. Donker met goud haalt ruim 10 op 1, is op elke productfoto
leesbaar, en onderscheidt zich meteen van de rode NIEUW-badge en de bronzen Best Seller. Op
de Groom Guard staan straks twee badges onder elkaar; die combinatie staat in de preview.

**Kortere variant** als de pil op mobiel te breed wordt: `Gratis case`.

---

## 2.5 Het cadeauonderdeel bij de bestelknop

**Waar:** Shopify-beheer → Inhoud → Metaobjecten → *Limited Offer* (type `limited_offer`).
Nieuw metaobject aanmaken, koppelen aan `custom.limited_offer` van de vier bodygroomers.

Het thema toont dit blok al als `.ws-gift`, **direct boven de bestelknop**. Gecontroleerd op
de live pagina van The Hard Case. Geen code nodig.

| Veld | Waarde |
|---|---|
| Handle | `herfst-sale-hardcase` |
| `product_title` | `Herfst Sale, gratis hardcase` |
| `image` | Foto van The Hard Case (of het nieuwe open-case-beeld) |
| `offer_title` (rich text) | **Gratis hardcase** bij dit apparaat, t.w.v. **€14,95**. |
| `popup_subtitle` | `Automatisch toegevoegd. Geen code nodig.` |
| `popup_title` | `Gratis hardcase bij je bodygroomer` |
| `popup_description` | `Bij elke losse bodygroomer leggen we een Wellshave hardcase gratis in je winkelwagen. Je hoeft er niets voor te doen en geen code in te vullen. Koop je twee bodygroomers, dan krijg je twee cases. De actie loopt tot en met vrijdag 30 oktober 2026, 23.59 uur, en geldt zolang de voorraad strekt.` |

### De kleine regel onder de knop

```
Herfst Sale, t/m vrijdag 30 oktober 2026, 23.59 uur. Eén hardcase per losse bodygroomer, zolang de voorraad strekt.
```

### Voor de mobiele sticky koopbalk

Onder de productnaam, boven de prijs:

```
+ gratis hardcase
```

---

## 2.6 De winkelwagen

**Waar:** `locales/nl.json`, blok `cart_drawer`. De bestaande sleutel `gift_tag` staat al op
"Gratis cadeau" en kan blijven.

### De melding boven in de lade, cadeau toegekend

```
Gelukt, je gratis hardcase is toegevoegd.
```

Met opmaak, zoals de bestaande sleutels dat doen:

```
Gelukt, je <strong>gratis hardcase</strong> is toegevoegd.
```

### De gratis cadeauregel in de lijst

| Onderdeel | Tekst |
|---|---|
| Titel | `The Hard Case` |
| Prijs | `€0,00` met `€14,95` doorgestreept ernaast |
| Onderregel | `Hoort bij je Groom Guard™` (naam van het gekochte apparaat) |
| Label | `Gratis cadeau` |

Staan er twee cases in, dan is de onderregel: `Hoort bij je bodygroomers`.

### De andere toestanden van de cadeaustrook

| Situatie | Tekst |
|---|---|
| Nog geen bodygroomer in de wagen | `Voeg een losse bodygroomer toe, dan leggen we de hardcase gratis bij je bestelling.` |
| Twee losse bodygroomers | `2 gratis hardcases toegevoegd, één per bodygroomer.` |
| Alleen een bundel in de wagen | `In een bundel zit al meer dan één apparaat, daar geldt de cadeauactie niet voor.` |
| Hardcase uitverkocht | Geen tekst. De strook verdwijnt helemaal, zie het implementatieplan |

### Zetje onderin de lade

```
Nog een bodygroomer erbij? Dan leggen we er ook een tweede hardcase bij.
```

### Nieuwe sleutels voor `locales/nl.json`

```json
"gift_product_added_html": "Gelukt, je <strong>gratis hardcase</strong> is toegevoegd.",
"gift_product_added_multi_html": "<strong>{{ count }} gratis hardcases</strong> toegevoegd, één per bodygroomer.",
"gift_product_prompt_html": "Voeg een losse bodygroomer toe, dan leggen we de <strong>hardcase gratis</strong> bij je bestelling.",
"gift_product_bundle_note": "In een bundel zit al meer dan één apparaat, daar geldt de cadeauactie niet voor.",
"gift_product_belongs_to": "Hoort bij je {{ title }}",
"gift_product_nudge": "Nog een bodygroomer erbij? Dan leggen we er ook een tweede hardcase bij."
```

---

## 2.7 Korte actievoorwaarden

**Waar:** nieuwe pagina `/pages/herfst-sale-voorwaarden`, en als inklapblok op de
collectiepagina. Link ernaartoe vanuit de banner en vanonder de bestelknop.

```
Herfst Sale, gratis hardcase

• De actie loopt van woensdag 23 september 2026 tot en met vrijdag 30 oktober 2026,
  23.59 uur Nederlandse tijd.
• Je krijgt één gratis The Hard Case bij elke losse bodygroomer die je koopt:
  Dual Groomer™ 2-in-1, Groom Guard™, Groom Guard™ PRO en Flex Guard™ 3-in-1.
• Koop je twee bodygroomers, dan krijg je twee hardcases.
• Bundels en sets vallen buiten deze actie, ook als er een bodygroomer in zit.
• De hardcase wordt automatisch aan je winkelwagen toegevoegd. Je hebt geen kortingscode
  nodig, en je kunt hem ook niet met een code aanvragen.
• Haal je de bodygroomer weer uit je winkelwagen, dan verdwijnt de gratis hardcase mee.
• Op = op. Is de hardcase uitverkocht, dan stopt de actie en halen we hem van de pagina's af.
• De hardcase is niet inwisselbaar voor geld of korting.
• De prijzen in de winkel blijven zoals ze zijn. De Herfst Sale voegt geen extra korting toe.
```

**Nog één regel toe te voegen, zodra de keuze gemaakt is:** wat er met het cadeau gebeurt bij
een retour binnen de 100 dagen. Kies er één en zet hem erbij:

> *Stuur je de bodygroomer binnen 100 dagen terug, stuur dan ook de hardcase mee terug.*

of

> *Stuur je de bodygroomer binnen 100 dagen terug en houd je de hardcase, dan verrekenen we €14,95 met je terugbetaling.*

Ik heb deze niet zelf ingevuld, want het raakt de retourvoorwaarden en dat is geen
marketingkeuze.

---

## 2.8 De afsluitende campagneboodschap, 27 t/m 30 oktober

Vanaf dinsdag 27 oktober tot en met vrijdag 30 oktober.

### Bovenbalk

```
Laatste dagen · gratis hardcase bij elke losse bodygroomer, t/m 30 oktober. <a href="/collections/bodygroomers"><strong>Shop nu →</strong></a>
```

### Homepagebanner

| Onderdeel | Tekst |
|---|---|
| Badge | `Laatste dagen · t/m 30 oktober, 23.59 uur` |
| Kop, regel 1 | `Het wordt kouder.` |
| Kop, regel 2 (goud) | `Dit is je laatste week.` |
| Subtekst | `Tot en met vrijdag 30 oktober leggen we bij elke losse bodygroomer de hardcase er gratis bij. Daarna kost hij weer €14,95.` |
| Knop | `Kies jouw bodygroomer` |

### Mobiele menubalk

```
Laatste dagen · gratis hardcase
```

### Regel onder de bestelknop op productpagina's

```
Laatste dagen. De gratis hardcase loopt t/m vrijdag 30 oktober, 23.59 uur.
```

De kop houdt bewust de eerste regel van de campagne vast en verandert alleen de tweede. Wie
de banner in september zag, herkent hem in oktober meteen, en de urgentie zit in de regel die
verandert.

---

## 2.9 Wat er op 31 oktober terug moet

| Plek | Terug naar |
|---|---|
| Bovenbalk | Wat er vóór 23 september stond, of de volgende actie |
| Homepagebanner | De vaste banner "Jij wilt verzorgd de deur uit. Wij regelen de rest." |
| Collectieomschrijving | De campagne-alinea eruit, de rest laten staan |
| Productkaartlabel | Metaobject `gratis-hardcase` loskoppelen van de vier apparaten |
| Cadeaublok productpagina | `custom.limited_offer` leegmaken bij de vier apparaten |
| Winkelwagen | Cadeau uitzetten in de thema-instellingen |
| Mobiel menu | Actiebalk terug naar de vaste tekst |

De volledige lijst met vinkjes staat in [`04-planning-en-checklist.md`](04-planning-en-checklist.md).
