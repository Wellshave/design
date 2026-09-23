# 5. Bevindingen uit de live webshop

> Onderzoek op 22 september 2026, via de Shopify Admin API en de openbare winkel.
> Alleen gelezen en getest met een gastwinkelwagen. Er is niets gewijzigd en er is geen
> bestelling geplaatst.

---

## 5.1 De €90-cadeaubalk rekent €29,95 door. Dit draait nu live.

**Dit is het belangrijkste dat ik gevonden heb, en het staat los van de Herfst Sale.**

### Wat de winkel belooft

De winkelwagenlade toont een voortgangsbalk met twee cadeaus:

| Drempel | Cadeau | Wat de balk zegt |
|---|---|---|
| €65 | The Washbag™ | "Luxe washbag" |
| €90 | Neustrimmer Ultimate™ 4-in-1 | "Neustrimmer Ultimate" |

### Wat er werkelijk gebeurt

Het thema legt bij €65 het artikel `gift-the-washbag` neer. Dat is een apart product met
prijs **€0,00**. Dat klopt dus.

Bij €90 legt het thema variant `47890142527820` neer. Dat is de **gewone** Neustrimmer
Ultimate™ 4-in-1 van **€29,95**. Gratis werd hij door een automatische korting, en die
korting is **op 10 juni 2026 verlopen**.

Alle vier de cadeaukortingen staan op `EXPIRED`:

| Korting | Status | Geëindigd |
|---|---|---|
| Gift bar , Free Washbag (€65) | EXPIRED | 10 juni 2026 |
| Gift bar , Free Neustrimmer (€90) | EXPIRED | 10 juni 2026 |
| Gift bar , Free Washbag (€65) v2 | EXPIRED | 10 juni 2026 |
| Gift bar , Free Neustrimmer Elite | EXPIRED | 10 juni 2026 |

Het commentaar in `snippets/cart-rewards-bar.liquid` zegt het zelf:
*"Free via automatic discount at go-live."* Die korting is er niet meer.

### De test

Gastwinkelwagen op wellshave.com, 22 september 2026. Eerst twee apparaten toegevoegd, daarna
precies gedaan wat `CartDrawer.syncGifts` doet: beide cadeauvarianten toevoegen met de
eigenschap `_gift_tier`.

```
Groom Guard™                    €49,95
Flex Guard™ 3-in-1              €59,95
The Washbag™        [cadeau 1]   €0,00   ← klopt
Neustrimmer Ultimate [cadeau 2] €29,95   ← zou €0,00 moeten zijn

total_discount: €0,00
TOTAAL DAT DE KLANT BETAALT:   €139,85
```

### Waarom het niemand opvalt

`snippets/cart-drawer.liquid` trekt cadeauregels van het getoonde subtotaal af:

```liquid
assign display_subtotal = cart.total_price | minus: gift_total
```

De lade toont dus keurig **€109,90**, terwijl de klant bij het afrekenen **€139,85** betaalt.
Het verschil van €29,95 wordt pas op de afrekenpagina zichtbaar.

Er staat een review bij de Groom Guard die hier waarschijnlijk op slaat:
*"Goed scheermachine om de intieme zone mee te scheren. Jammer dat ik het beloofd cadeau niet
bij kreeg."*

### Er komt nog iets bij

Van de Neustrimmer Ultimate™ 4-in-1 zijn er nog **7 op voorraad**. Zelfs als de korting
gerepareerd wordt, is hij binnen een paar dagen op en verdwijnt de tweede drempel alsnog uit
de balk.

### Wat ik zou doen

Kies er één, vóór 23 september:

**A. Uitzetten.** Zet `gift_2_product` leeg in de thema-instellingen. De balk toont dan
alleen nog gratis verzending en de washbag. Klaar in twee minuten, geen risico.

**B. Repareren en omhangen.** Maak een €0,00-duplicaat van een neustrimmer die wél voorraad
heeft (Neustrimmer Basic™ 472 stuks, of Neustrimmer Premium™ 2-in-1 693 stuks), precies zoals
`gift-the-washbag` is opgebouwd, en zet `gift_2_product` daarop. Dan werkt de drempel weer,
zonder afhankelijkheid van een korting die kan verlopen.

Mijn voorkeur is **B**, want de €90-drempel is een goede reden om het mandje op te hogen, en
hem uitzetten vlak voor een campagne kost omzet. Maar A is beter dan hem zo laten staan.

> Hoe dan ook: dit is precies de reden dat de Herfst Sale in
> [`03-implementatieplan.md`](03-implementatieplan.md) met een €0,00-artikel werkt en niet
> met een korting. Een korting kan verlopen zonder dat iemand het merkt. Een prijs van €0,00
> staat er gewoon.

---

## 5.2 De bovenbalk wijst naar de verkeerde collectie

`sections/header-group.json`, `sections.announcement.settings.label`:

```html
Summer Deals tot 40%.   － <a href="/collections/winter-sale" title="Winter Sale"><strong>Shop nu →</strong></a>
```

De tekst zegt **Summer**, de link gaat naar **winter-sale**, en die collectie heet in Shopify
**"Voorjaar Sale"**. Drie seizoenen in één regel van dertig woorden.

Ondertussen linken het menu, de megamenu-promotegel en de mobiele actiebalk allemaal naar
`/collections/summer-sale-deals`, een vierde collectie die "SUMMER SALE" heet.

Bij de Herfst Sale wordt dit rechtgetrokken: alles wijst naar `/collections/bodygroomers`.

---

## 5.3 Waar de Summer Sale nu overal staat

Elf plekken. De volledige lijst met vinkjes staat in
[`04-planning-en-checklist.md`](04-planning-en-checklist.md); dit is waar ze in het thema
zitten.

| # | Plek | Precieze locatie |
|---|---|---|
| 1 | Bovenbalk | `header-group.json` → `sections.announcement.settings.label` |
| 2 | Megamenu, kicker | `header.blocks.menu_item_1.settings.banner_kicker` = "Summer Sale" |
| 3 | Megamenu, titel | `...banner_title` = "Tot 40% korting" |
| 4 | Megamenu, subtekst | `...banner_subtitle` |
| 5 | Megamenu, knop | `...banner_btn_label` + `banner_btn_link` |
| 6 | Hoofdmenu | `header.blocks.menu_item_2.settings.label` = "SALE" |
| 7 | **Mobiel menu, actiebalk** | `header.settings.mob_actie_tekst` = "Summer Sale · tot 40% korting" |
| 8 | Mobiel menu, subregel | `menu_item_2.settings.mob_sub` = "Tot 40%" |
| 9 | Homepagebanner | sectie `ws-hero` in `templates/index.json`, badge "Summer Sale" |
| 10 | Collectie | `SUMMER SALE`, handle `summer-sale-deals`, 19 producten |
| 11 | Productpagina's | metaobject `limited_offer` / `voorjaar-sale` |

### Seizoensresten die er ook nog staan

- Metaobject `voorjaar-sale`: handle zegt voorjaar, `product_title` zegt "Summer Sale 40%",
  `popup_title` zegt **"Tijdelijke Vaderdag Sale"**.
- Drie ongebruikte badge-metaobjecten: `vaderdag-tip`, `vaderdag-favoriet`, `vaderdag-keuze`.
- Collectie "Voorjaar Sale" met handle `winter-sale`.

Niet dringend, maar het is het opruimen waard nu je er toch bent. Elke volgende campagne
struikelt anders over dezelfde drie namen.

---

## 5.4 Hoe de cadeaumechaniek nu in elkaar zit

Handig om te weten, want de Herfst Sale bouwt erop voort.

**Het zit in het thema, niet in een app.** Bestanden:

- `snippets/cart-rewards-bar.liquid` , rekent de drempels uit en tekent de balk
- `assets/base.js` , `CartDrawer.syncGifts()` legt het cadeau neer en haalt het weg
- `config/settings_data.json` , de instellingen

**Hoe het werkt:**

1. Liquid rekent het besteedbedrag uit over alle regels **zonder** de markering
   `_gift_tier`, en zet per drempel een JSON-blokje in de pagina.
2. `syncGifts()` haalt `/cart.js` op, vergelijkt het bedrag met de drempel, en doet per ronde
   één wijziging: toevoegen met `properties: {_gift_tier: '1'}`, of hoeveelheid 0.
3. Mislukt het toevoegen, dan onthoudt hij die drempel in `unavailableTiers` en probeert het
   deze sessie niet meer. Dat is de vangnetregel bij uitverkocht.

**Wat het niet kan, en daarom bijgebouwd moet worden:**

| Nodig voor de Herfst Sale | Kan de huidige code? |
|---|---|
| Kijken naar wát er in de wagen ligt, niet naar het bedrag | Nee, alleen `total >= threshold` |
| Meer dan één cadeau | Nee, `quantity: 1` staat vast |
| Bundels uitsluiten | Nee, dat begrip bestaat er niet |
| Meer dan twee cadeaus tegelijk | Nee, er zijn precies twee drempelplekken |

Vandaar het derde, aparte blok in [`03-implementatieplan.md`](03-implementatieplan.md).

---

## 5.5 Het bewezen patroon voor een gratis artikel

`gift-the-washbag` laat zien hoe Wellshave dit al doet, en het werkt:

| Veld | Het echte artikel | De cadeauversie |
|---|---|---|
| Handle | `toiletry-bag` | `gift-the-washbag` |
| Status | Active | **Unlisted** |
| Producttype | Accesoire | **Gift** |
| Prijs | €19,95 | **€0,00** |
| SKU | 8720938021411 | 8720938021411 (gelijk) |
| Voorraad | Wordt bijgehouden | **Wordt niet bijgehouden** |

Eén ding om bewust over te beslissen: bij de washbag staat de voorraad op *niet bijhouden*.
Daardoor kan het cadeau altijd worden toegevoegd, ook als de echte washbag op is. Dat is
prettig (nooit een mislukte poging) en riskant (je verkoopt door terwijl er niets ligt).

Voor de hardcase staat het advies in
[`03-implementatieplan.md`](03-implementatieplan.md): voorraad **wél** bijhouden met een
gereserveerd aantal, zodat de actie vanzelf stopt als de case op is. Dat is precies wat de
briefing vraagt bij "gedrag wanneer een hardcase niet beschikbaar is". Het kost wel een
beslissing over hoeveel stuks je apart zet van de 873.

---

## 5.6 Wat er nergens vastligt

- **The Hard Case heeft geen omschrijving.** Geen afmetingen, geen materiaal, geen
  compatibiliteit.
- **Geen van de vier bodygroomers heeft een `included_in_the_box`-veld ingevuld.**
- **Beide foto's van de hardcase tonen hem dicht.** Er is geen beeld van een open case, ook
  niet in de bestandenbibliotheek van Shopify.
- **De hardcase heeft 1 review** (Loox, 5,0). Te weinig om als bewijs te gebruiken.

Dat laatste is meteen het antwoord op "verzin geen reviews": die zijn er simpelweg niet voor
dit artikel.
