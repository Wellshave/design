# 3. Implementatieplan

> Gebaseerd op het live thema **wellshave/claude-design v5 (LIVE)**, uitgelezen op
> 22 september 2026. Er is niets gewijzigd; dit is het plan, niet de uitvoering.

---

## 3.1 De kern van de keuze: een artikel van €0,00, geen korting

De hardcase gaat als **eigen product met prijs €0,00** de winkelwagen in. Niet als korting
op het bestaande artikel.

Dat is geen smaakkwestie. Drie redenen, alle drie nagekeken in de live winkel:

**1. Shopify past standaard maar één automatische korting per bestelling toe.** Er lopen er
al drie: Groom Guard Upgrade, 2 Knifes / 15% off en Groomer & Nosetrimmer Basic. Een vierde
gaat daarmee concurreren, en welke wint hangt af van het mandje.

**2. Vijftien actieve kortingscodes, waarvan een flink deel niet combineert.** WELCOME15,
THANKYOU10, LUCA10, Evelien10 en de Collabs-codes staan alle op "combineert niet met andere
kortingen". Zou het cadeau een korting zijn, dan kiest Shopify er één en verliest de klant
óf zijn code óf zijn cadeau. Met een €0,00-artikel speelt dat niet: het cadeau is geen
korting, dus het blokkeert geen enkele code.

**3. De huidige €90-cadeaubalk laat precies zien wat er misgaat als de gratis-heid van een
korting afhangt.** Die korting is op 10 juni verlopen en sindsdien rekent de winkel €29,95
voor een als gratis aangekondigde neustrimmer. Zie
[`05-bevindingen-webshop.md`](05-bevindingen-webshop.md). De washbag bij €65 werkt wél, en
dat is precies omdat die als €0,00-artikel in de catalogus staat.

De winkel heeft dus al een werkend patroon (`gift-the-washbag`). We doen hetzelfde.

---

## 3.2 Wat er in Shopify moet, zonder één regel code

### A. Het cadeau-artikel

Dupliceer **The Hard Case** naar een cadeauversie, precies zoals `gift-the-washbag` nu is
opgebouwd:

| Veld | Waarde | Waarom |
|---|---|---|
| Titel | `The Hard Case` | Zo staat hij ook op de bon |
| Handle | `gift-the-hard-case` | |
| Status | **Unlisted** | Niet vindbaar, niet in collecties, wel via ID toe te voegen |
| Producttype | `Gift` | Zelfde als de cadeauwashbag |
| Prijs | `0,00` | Geen van-prijs invullen |
| SKU | `8720938021497` | Zelfde als het echte artikel, zodat pick & pack hem herkent |
| Afbeelding | Die van The Hard Case | |

> **Zet hem niet in een collectie** en geef hem **niet** de tag uit stap B.

### B. De tag die bepaalt wie meedoet

Geef deze vier producten de producttag **`herfst-cadeau`**:

- `wellshave-2-in-1-bodygroomer-mannen` (Dual Groomer™ 2-in-1)
- `wellshave-bodygroomer-groom-guard` (Groom Guard™)
- `groom-guard-pro` (Groom Guard™ PRO)
- `wellshave-flex-guard™` (Flex Guard™ 3-in-1)

**Waarom insluiten en niet uitsluiten.** Je zou bundels kunnen uitsluiten met "alles zonder
de tag Bundel". Dat gaat mis: de Essential Flex Bundel (€79,95) heeft helemaal geen tags en
zou er dan doorheen glippen. Met insluiten kan dat niet: wie de tag niet heeft, doet niet mee.
Een nieuw product of een nieuwe bundel die er tijdens de actie bijkomt, doet vanzelf niet mee
tenzij iemand hem bewust de tag geeft.

Het is ook de goedkoopste noodrem: past de case toch niet op één model, dan haal je daar de
tag weg en de rest loopt door.

### C. Het label op productkaarten

Nieuw metaobject, type `tag` (heet in het beheer *Product badge*):

```
handle:      gratis-hardcase
label:       Gratis hardcase
background:  #191816
color:       #F5D18A
```

Koppel hem aan het veld `custom.tags` van de vier producten. **Voeg toe, vervang niet:** de
Groom Guard draagt al `bestseller`.

`snippets/product-card.liquid` rendert `custom.tags` al als pillen. Geen code nodig.

### D. Het blok bij de bestelknop

Nieuw metaobject, type `limited_offer`, met de inhoud uit
[`02-websiteteksten.md`](02-websiteteksten.md#25-het-cadeauonderdeel-bij-de-bestelknop).
Koppel het aan `custom.limited_offer` van de vier producten.

Het thema toont dit al als `.ws-gift`, **direct boven** `.ws-vorm` met de bestelknop.
Gecontroleerd op de live productpagina van The Hard Case. Geen code nodig.

> Maak een **nieuw** metaobject. Het bestaande `voorjaar-sale` hergebruiken is riskant: de
> handle zegt voorjaar, de titel zegt Summer Sale en de pop-uptitel zegt Vaderdag. Het hangt
> mogelijk aan meer productpagina's dan je denkt.

---

## 3.3 Wat er in het thema moet

Hier zit het echte werk, en het is beperkt. De bestaande cadeaubalk werkt op een
**besteedbedrag** (`total >= threshold`). De Herfst Sale werkt op **wat er in de wagen ligt**.
Dat kan de huidige code niet, en de hoeveelheid ook niet: `syncGifts` legt altijd precies
één stuk neer.

Daarom komt er een derde cadeaublok naast de twee bestaande drempels, met eigen instellingen.
De twee bestaande drempels blijven ongemoeid.

### Stap 1: instellingen, `config/settings_schema.json`

Naast het bestaande blok met `gift_1_*` en `gift_2_*`:

```json
{
  "type": "header",
  "content": "Cadeau bij product"
},
{ "type": "checkbox", "id": "enable_product_gift", "label": "Cadeau bij product aan", "default": false },
{ "type": "text",     "id": "product_gift_tag",    "label": "Producttag die meedoet", "default": "herfst-cadeau" },
{ "type": "product",  "id": "product_gift_product","label": "Het cadeau (het €0,00-artikel)" },
{ "type": "text",     "id": "product_gift_label",  "label": "Naam van het cadeau", "default": "Gratis hardcase" },
{ "type": "text",     "id": "product_gift_start",  "label": "Start (2026-09-23T00:00:00+02:00)" },
{ "type": "text",     "id": "product_gift_end",    "label": "Einde (2026-10-30T23:59:59+01:00)" }
```

Vul start en einde **met de tijdzone erbij**. De zomertijd eindigt op 25 oktober, dus start
staat op `+02:00` en het einde op `+01:00`. Zonder die offsets loopt de actie er een uur
naast.

### Stap 2: nieuw bestand `snippets/cart-gift-product.liquid`

```liquid
{% comment %}
  Cadeau bij product. Anders dan cart-rewards-bar, die op een besteedbedrag werkt,
  kijkt dit blok naar WAT er in de wagen ligt.

  Meedoen = de producttag uit settings.product_gift_tag dragen. Insluiten dus, niet
  uitsluiten: een bundel zonder die tag kan er per definitie niet doorheen glippen.

  Toevoegen en verwijderen doet CartDrawer.syncGiftProduct in base.js.
{% endcomment %}
{% liquid
  assign pg_var = settings.product_gift_product.selected_or_first_available_variant

  assign pg_on = false
  if settings.enable_product_gift and settings.product_gift_product != blank and settings.product_gift_tag != blank and pg_var.available
    assign pg_on = true
  endif

  # Binnen de looptijd. Leeg laten betekent: geen grens aan die kant.
  if pg_on
    assign nu = 'now' | date: '%s' | plus: 0
    if settings.product_gift_start != blank
      assign pg_start = settings.product_gift_start | date: '%s' | plus: 0
      if nu < pg_start
        assign pg_on = false
      endif
    endif
    if settings.product_gift_end != blank
      assign pg_eind = settings.product_gift_end | date: '%s' | plus: 0
      if nu > pg_eind
        assign pg_on = false
      endif
    endif
  endif

  # Hoeveel cadeaus horen er te liggen, hoeveel liggen er, en waar horen ze bij.
  assign pg_want = 0
  assign pg_have = 0
  assign pg_key = ''
  assign pg_bron = ''
  assign pg_bundel = false
  if pg_on
    for item in cart.items
      if item.properties._gift_product
        assign pg_have = pg_have | plus: item.quantity
        assign pg_key = item.key
      elsif item.product.tags contains settings.product_gift_tag
        assign pg_want = pg_want | plus: item.quantity
        if pg_bron == blank
          assign pg_bron = item.product.title
        endif
      elsif item.product.tags contains 'Bundel'
        assign pg_bundel = true
      endif
    endfor
  endif

  # Nooit meer beloven dan er ligt.
  assign pg_max = 99
  if pg_var.inventory_management != blank and pg_var.inventory_policy != 'continue'
    assign pg_max = pg_var.inventory_quantity
    if pg_max < 0
      assign pg_max = 0
    endif
  endif
  if pg_want > pg_max
    assign pg_want = pg_max
  endif
%}

{%- if pg_on -%}
  <div class="cart-drawer__gift" data-gift-strip>
    {%- if pg_have > 0 -%}
      <p class="cart-drawer__gift-label body-md is-ok">
        {%- if pg_have > 1 -%}
          {{- 'cart_drawer.gift_product_added_multi_html' | t: count: pg_have -}}
        {%- else -%}
          {{- 'cart_drawer.gift_product_added_html' | t -}}
        {%- endif -%}
      </p>
    {%- elsif pg_bundel -%}
      <p class="cart-drawer__gift-label body-md">{{ 'cart_drawer.gift_product_bundle_note' | t }}</p>
    {%- else -%}
      <p class="cart-drawer__gift-label body-md">{{ 'cart_drawer.gift_product_prompt_html' | t }}</p>
    {%- endif -%}
  </div>

  <script type="application/json" data-gift-product>
    {"variant":{{ pg_var.id }},"want":{{ pg_want }},"have":{{ pg_have }},"key":{{ pg_key | json }},"tag":{{ settings.product_gift_tag | json }}}
  </script>
{%- endif -%}
```

**Waarom de teller server-side wordt uitgerekend.** `/cart.js` levert geen producttags mee,
dus de JavaScript kán niet zelf zien welke regel een bodygroomer is. Daarom rekent Liquid
`want` uit, en leest de JavaScript alleen het verschil af. Dat werkt omdat elke
winkelwagenwijziging de sectie `cart-drawer` opnieuw laat renderen; het getal is dus altijd
vers.

### Stap 3: de JavaScript, naast `syncGifts` in `assets/base.js`

```js
syncGiftProduct() {
  if (this.syncingGiftProduct) { this.pendingGiftProduct = true; return; }

  const node = this.querySelector('[data-gift-product]');
  if (!node || this.giftProductUnavailable) return;

  let d;
  try { d = JSON.parse(node.textContent); } catch { return; }
  if (d.want === d.have) return;

  this.syncingGiftProduct = true;
  this.pendingGiftProduct = false;

  let endpoint, body;
  if (d.have === 0) {
    endpoint = 'cart/add.js';
    body = { items: [{ id: d.variant, quantity: d.want, properties: { _gift_product: d.tag } }] };
  } else {
    // ook quantity 0, dat haalt de regel weg
    endpoint = 'cart/change.js';
    body = { id: d.key, quantity: d.want };
  }
  body.sections = ['cart-drawer'];
  body.sections_url = window.location.pathname;

  return this.enqueueCart(() =>
    fetch(window.Shopify.routes.root + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(r => r.json())
      .then(r => {
        this.syncingGiftProduct = false;
        if (r.sections) {
          this.renderContent(r.sections);
        } else {
          // voorraad weg of geweigerd: niet blijven proberen deze sessie
          this.giftProductUnavailable = true;
        }
      })
      .catch(err => {
        this.syncingGiftProduct = false;
        console.error('Gift product sync error:', err);
      })
  );
}
```

Roep hem aan op dezelfde plek waar `renderContent` nu `this.syncGifts()` aanroept:

```js
this.syncGifts();
this.syncGiftProduct();
```

De lus stopt vanzelf: na de wijziging rendert de sectie opnieuw, staat `want === have`, en
doet de functie niets meer.

### Stap 4: drie kleine wijzigingen in bestaande bestanden

**`snippets/cart-drawer.liquid`**, de cadeauregel mag geen aantalknoppen krijgen:

```diff
-{%- unless item.properties._gift_tier -%}
+{%- unless item.properties._gift_tier or item.properties._gift_product -%}
```

**`snippets/cart-drawer.liquid`**, het subtotaal telt cadeaus niet mee:

```diff
-if item.properties._gift_tier
+if item.properties._gift_tier or item.properties._gift_product
```

**`snippets/cart-rewards-bar.liquid`**, de €65- en €90-drempels tellen het cadeau niet mee:

```diff
-unless item.properties._gift_tier
+unless item.properties._gift_tier or item.properties._gift_product
```

Die laatste is belangrijk: zonder die regel zou een gratis artikel kunnen meetellen voor de
washbagdrempel. Met €0,00 maakt het rekenkundig niets uit, maar het blijft juister, en het
voorkomt gedoe als het cadeau ooit een prijs krijgt.

### Stap 5: `snippets/cart-drawer.liquid`, het blok inhangen

Direct onder `{%- render 'cart-rewards-bar' -%}`:

```liquid
{%- render 'cart-gift-product' -%}
```

---

## 3.4 De vragen uit de briefing, één voor één beantwoord

### Automatisch toevoegen en verwijderen

**Toevoegen.** Zodra er een product met de tag `herfst-cadeau` in de wagen ligt, rekent
Liquid `want = 1` uit en legt de JavaScript het €0,00-artikel erbij. Dat gebeurt bij dezelfde
serverronde als het toevoegen zelf, dus de klant ziet de lade opengaan met het cadeau er al
in.

**Verwijderen.** Haalt de klant de bodygroomer weg, dan wordt `want = 0` en zet de JavaScript
de cadeauregel op hoeveelheid 0. De regel verdwijnt. De klant kan het cadeau niet zelf
verwijderen of ophogen: de aantalknoppen en de knop Verwijderen zijn voor cadeauregels
verborgen.

### Het juiste aantal bij meerdere bodygroomers

`want` telt `item.quantity` op over alle regels met de tag. Twee Groom Guards, of één Groom
Guard plus één Flex Guard, geeft allebei `want = 2`, en de cadeauregel gaat naar hoeveelheid 2.

Dit is precies wat de bestaande drempelcode níét kan, want die zet altijd hoeveelheid 1 neer.

### Uitsluiting van bundels

Bundels dragen de tag niet, dus ze tellen niet mee. Ligt er alleen een bundel in de wagen,
dan meldt de strook waarom er geen cadeau komt. Een bundel plus een losse bodygroomer levert
één cadeau op, namelijk voor die losse bodygroomer.

### Als de hardcase niet beschikbaar is

Drie lagen, van vroeg naar laat:

1. **Bij het renderen.** Is `pg_var.available` onwaar, dan staat `pg_on` op onwaar en rendert
   het hele blok niet. Geen strook, geen belofte. De winkel belooft dus niets wat hij niet kan
   leveren.
2. **Bij het aantal.** `pg_want` wordt afgetopt op de resterende voorraad. Zijn er nog 3 en
   koopt iemand 5 bodygroomers, dan komen er 3 cases bij in plaats van een mislukte poging.
3. **Als Shopify de regel alsnog weigert** (race tussen twee klanten), zet de JavaScript
   `giftProductUnavailable` en probeert het deze sessie niet meer. Zo hetzelfde mechanisme
   als het bestaande `unavailableTiers`.

Het label op de productkaarten en het blok op de productpagina zijn metaobjecten en
verdwijnen **niet** vanzelf. Zet daarom een voorraadwaarschuwing op de hardcase: zie
[`04-planning-en-checklist.md`](04-planning-en-checklist.md).

### Samenloop met bestaande cadeaus, kortingen en kortingscodes

| Wat | Gebeurt er iets? |
|---|---|
| Washbag vanaf €65 | Loopt gewoon door. De gratis hardcase telt niet mee voor die €65 |
| Cadeau vanaf €90 | **Eerst repareren of uitzetten.** Zie `05-bevindingen-webshop.md` |
| De drie lopende automatische kortingen | Geen samenloop. Het cadeau is geen korting |
| De vijftien kortingscodes | Geen samenloop. De klant houdt cadeau én code |
| Verzekerde verzending (€2,95) | Los artikel, raakt dit niet |
| Gratis verzending vanaf €30 | Het cadeau van €0,00 telt niet mee voor die €30 |

### Start en einde van de actie

Twee sloten op de deur:

1. **Het thema kijkt zelf naar de datum** via `product_gift_start` en `product_gift_end`,
   met tijdzone. Na 30 oktober 23.59.59 rendert het blok niet meer, ook als niemand iets
   uitzet.
2. **De knop `enable_product_gift`** gaat handmatig aan op 23 september en uit op 31 oktober.

Het thema stopt dus vanzelf, en er ligt een handmatige controle bovenop. Precies andersom als
bij de €90-drempel, die op één verlopen korting leunde en dat vier maanden lang niet meldde.

De metaobjecten, de tags en de teksten moeten wél met de hand terug. Die lijst staat in
[`04-planning-en-checklist.md`](04-planning-en-checklist.md).

---

## 3.5 Drie dingen om in de gaten te houden

**1. Een klant die de hardcase ook los koopt.** Wie een bodygroomer én een betaalde hardcase
in de wagen legt, krijgt er een gratis bij en heeft er dus twee. Dat is te verdedigen, maar
niet wat hij bedoelde. Overweeg een regel in de strook, of laat het zo en vang het op bij de
klantenservice. Ik heb dit niet ingebouwd, want het is een keuze, geen bug.

**2. Directe afrekenknoppen slaan de winkelwagen over.** Het cadeau wordt door de
winkelwagenlade toegevoegd. Staat er ergens een Shop Pay- of andere versnelde afrekenknop op
een productpagina, dan gaat de klant daar langs de lade heen en krijgt hij geen cadeau. Op de
productpagina van de Groom Guard staat op dit moment alleen een gewone
`In winkelwagen`-knop, dus daar speelt het niet. **Controleer of dat op alle vier de
productpagina's zo is**, en of er geen app een versnelde knop bijzet.

**3. De lade moet op elke pagina bestaan.** Staat iemand op `/cart` in plaats van in de lade,
dan moet de synchronisatie daar ook draaien. Dit staat als testpunt in de checklist.

---

## 3.6 Volgorde van uitvoeren

Werk in een **kopie van het thema**, niet in het live thema.

1. Kopie maken van `wellshave/claude-design v5 (LIVE)`, bijvoorbeeld
   `wellshave/herfst-sale`.
2. In de kopie: de vijf codestappen uit 3.3.
3. In Shopify: het €0,00-artikel, de tag, de twee metaobjecten en de teksten. Die staan los
   van het thema en zijn meteen zichtbaar. **Zet `enable_product_gift` nog niet aan.**
4. Voorbeeldlink van de kopie delen en de testlijst uit
   [`04-planning-en-checklist.md`](04-planning-en-checklist.md) aflopen.
5. Pas als alles groen is: thema publiceren en `enable_product_gift` aanzetten.

De metaobjecten en tags uit stap 3 zijn zichtbaar zodra je ze koppelt, ook in het live thema.
Koppel ze dus pas op de ochtend van de livegang, of accepteer dat het label alvast zichtbaar
is.
