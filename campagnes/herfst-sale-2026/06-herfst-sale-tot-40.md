# 6. Herfst Sale tot 40%: slogan en omzetting van de website

> Opgesteld op 24 september 2026. De bestaande Summer Sale ("tot 40%") wordt omgezet naar
> de Herfst Sale. De prijzen en van-prijzen blijven zoals ze zijn. Het hardcase-aanbod uit
> de eerdere documenten zit hier niet in: dat is nog niet gebouwd.

---

## 6.1 De slogan

**Aanbeveling:**

> **Wij snoeien de prijzen. Jij de rest.**
> Campagnewoord: **Het is snoeitijd.**

Waarom deze:

- **"Snoeien" doet drie dingen tegelijk.** De herfst is snoeitijd, trimmen is precies wat
  de apparaten doen, en "snoeien in de prijzen" is gewoon Nederlands voor prijzen verlagen.
  De korting krijgt zo een reden die een klant kan navertellen.
- **Niemand anders kan hem zo gebruiken.** Een kledingzaak of elektronicawinkel heeft niets
  met snoeien. Voor een trimmermerk is het vanzelfsprekend.
- **Hij sluit aan op de huidige kop.** Nu staat er "Jij wilt verzorgd de deur uit. Wij
  regelen de rest." De nieuwe kop gebruikt hetzelfde wij/jij-ritme, dus hij voelt als
  Wellshave en niet als een losse actie.
- **Hij lacht mét de klant**, over het onderwerp dat bij bodygroomers altijd een beetje
  ongemakkelijk is, zonder iets uit te spellen.

**Alternatieven:**

| Slogan | Sterk | Zwak |
|---|---|---|
| De bladeren vallen. De prijzen ook. | Iedereen snapt hem meteen | Veel winkels gebruiken hem al |
| Het wordt kouder. Jij blijft scherp. | Premium, past bij het merk | Zegt niet dat er korting is |

---

## 6.2 Wat er op de website verandert

### In het thema

Klaargezet in de themakopie **"Herfst Sale 2026 (kopie van v5 LIVE)"**. Die kopie staat
niet live.

| # | Plek | Nu | Wordt |
|---|---|---|---|
| 1 | Bovenbalk | Summer Deals tot 40%. Link naar `winter-sale` ("Voorjaar Sale") | Herfst Sale tot 40%. Link naar de sale-collectie |
| 2 | Homepagebanner, badge | Summer Sale · tot 40% korting | Herfst Sale · tot 40% korting |
| 3 | Homepagebanner, kop | Jij wilt verzorgd / de deur uit. Wij / **regelen de rest.** | Wij snoeien / de prijzen. / **Jij de rest.** |
| 4 | Homepagebanner, subregel | Kies het apparaat voor… | Het is snoeitijd. Kies het apparaat voor… |
| 5 | Homepagebanner, knop | Shop Wellshave → alle producten | Shop de Herfst Sale → sale-collectie |
| 6 | Megamenu, promotegel | Summer Sale | Herfst Sale |
| 7 | Mobiel menu, gouden balk | Summer Sale · tot 40% korting | Herfst Sale · tot 40% korting |
| 8 | Productpagina, pil | SUmmer Sale | Herfst Sale |
| 9 | Icoon in badge en mobiele balk | Zonnetje | Herfstblad |

Waar in de thema-editor, voor wie het met de hand wil doen:

| # | Veld |
|---|---|
| 1 | Header → Announcement → Label |
| 2 t/m 5 | Homepage → sectie ws-hero → Badge, Kop, Sub, Knop 1 tekst en link |
| 6 | Header → menu-item SHOP → Banner kicker |
| 7 | Header → Mobiel menu → Actietekst |
| 8 | Productsjabloon (standaard) → koopvak → Pil, rechterdeel |
| 9 | Kan alleen in de code: `sections/ws-hero.liquid` en `snippets/ws-megamenu-sprite.liquid` |

### In de winkeldata

Dit gaat direct live, los van het thema. Pas doen als het thema gepubliceerd wordt.

| # | Plek | Nu | Wordt |
|---|---|---|---|
| 10 | Collectie `summer-sale-deals`, titel | SUMMER SALE | HERFST SALE |
| 11 | Collectie, omschrijving | Summer Sale (2x) | Herfst Sale |
| 12 | Collectie, Google-titel en -omschrijving | Summer Sale | Herfst Sale |
| 13 | Aanbodblok op ongeveer 50 productpagina's (metaobject `voorjaar-sale`) | **Summer Sale**: profiteer tot **40% korting** op je bestelling. | **Herfst Sale**: tot **40% korting** op geselecteerde apparaten. |

De URL van de collectie blijft `summer-sale-deals`, zodat links in advertenties blijven
werken.

Bij punt 13 gaat "op je bestelling" eruit. Die tekst staat op elke productpagina, ook bij
producten zonder korting, en wekt de indruk dat er 40% van de hele bestelling af gaat.

---

## 6.3 Klopt "tot 40%"?

Nagerekend op de 19 producten in de sale-collectie, op dezelfde manier als het thema het
kortingslabel berekent:

- **The Gentleman Shaver™: 41%.** Daarmee is "tot 40%" waar.
- Essential Flex Bundel: 40%, maar uitverkocht.
- De rest zit tussen 7% en 37%.
- **Barber Bro 2.0 zit in de sale-collectie maar heeft geen korting**: van-prijs en prijs
  zijn allebei €109,95. Uit de collectie halen of een van-prijs geven.

---

## 6.4 Nog op te letten

- **Einddatum.** De kortingen hangen aan vaste van-prijzen. Noem alleen een einddatum als
  de prijzen daarna echt omhooggaan. Anders is het een nepdeadline, en die vallen onder
  de regels van de ACM.
- **Achtergrondbeeld in het aanbod-metaobject** toont nog "SUMMER SALE" met palmbladeren.
  Het huidige thema laat dat beeld nergens zien, maar een volgend thema misschien wel.
- **Thema "v6 (IN PROGRESS)".** Gaat die later live, dan moeten deze teksten daar ook in.
- **Publiceren** kan alleen in Shopify-admin: Online Store → Themes → de kopie → Publish.
  Terugdraaien is hetzelfde, met het oude thema.

---

## 6.5 Stand op 25 september

### Wat er nu in de kopie staat

Themakopie **"Herfst Sale 2026 (kopie van v5 LIVE)"** (niet gepubliceerd), preview:
`https://wellshave.com/?preview_theme_id=206433747276`

Door een andere sessie gezet, 25 september 14.53 uur:

- De naam Herfst Sale op plek 1, 2, 6, 7 en 8 uit 6.2.
- CRO-aanpassingen: de bezorgregel "Ma t/m vr voor 23:59 besteld, morgen in huis",
  reviewregels met Trustpilot of Wellshave erbij, "Vergelijk de opties", 1000+ reviews,
  en wijzigingen in de code van het koopvak, de productkaart en de winkelwagen.

Daarna door deze sessie gezet:

| Plek | Wat |
|---|---|
| Menu | "SALE" heet nu "HERFST SALE" |
| Bovenbalk | Afteltimer achter "Herfst Sale tot 40%", bijvoorbeeld "Nog 35d 09u 12m", op mobiel zonder minuten |
| Homepagebanner | Nieuwe herfstfoto, kop "Wij snoeien de prijzen. Jij de rest.", "Het is snoeitijd." en knop "Shop de Herfst Sale" |
| Megamenu | Herfstfoto in de Herfst Sale-tegel |
| Badge en mobiele balk | Herfstblad in plaats van zonnetje |
| Productpagina (standaardsjabloon) | Aanbodblok staat weer aan |
| Productpagina, aanbodbalk | Herfstkleuren: verloop van donkerbruin naar roest, gouden accenten en een blad rechts (zie hieronder) |
| Salespagina | Herfstfoto, eyebrow "Herfst Sale · tot 40% korting", kop "Wij snoeien de prijzen. Jij de rest.", einddatum in de onderregel, bij "In de Herfst Sale" en in de vraag "Hoelang loopt deze actie?" |

Foto's, gemaakt met GPT Image 2.5 via Higgsfield en opgeslagen in Shopify Files:
`herfst-sale-2026-hero.png` (herfstversie van de bestaande homepagefoto) en
`herfst-sale-2026-banner.png` (scheerapparaat en bodygroomer op marmer met herfstbladeren).

### De timer

- De timer telt af naar de einddatum die al in het campagneplan stond: **vrijdag 30 oktober,
  23.59 uur**. Dat staat in de bovenbalk onder "Actie stopt op" en is daar aan te passen.
- De timer rekent niet per bezoeker en begint nooit opnieuw. Na het eindmoment verdwijnt
  hij.
- De salespagina zei eerst "Er staat geen einddatum op". Die tekst is aangepast, anders
  sprak de pagina de timer tegen.
- **Voorwaarde:** op 30 oktober om 23.59 uur moet de actie ook echt stoppen. Blijven de
  van-prijzen daarna gewoon staan, dan is het een nepdeadline, en die vallen onder de
  regels van de ACM.

### De tekst van het aanbodblok

De tekst komt uit het metaobject `voorjaar-sale` (type `limited_offer`). Op 25 september
is die op verzoek omgezet naar Herfst Sale. Dat geldt direct voor alle productpagina's,
ook in het huidige live thema, waar de bovenbalk nog "Summer Deals" zegt tot de kopie
gepubliceerd is.

| Veld | Was | Is nu |
|---|---|---|
| product_title | Summer Sale 40% | Herfst Sale tot 40% |
| offer_title | **Summer Sale**: profiteer tot **40% korting** op je bestelling. | **Herfst Sale**: tot **40% korting** op geselecteerde apparaten. |
| popup_title | Tijdelijke Vaderdag Sale | Herfst Sale |
| popup_subtitle | Zolang de voorraad strekt | Tot en met 30 oktober, zolang de voorraad strekt |

### De aanbodbalk in herfstkleuren

De balk boven "In winkelwagen" was zand met een gouden rand. In de kopie is hij nu:

- **Grond:** een verloop van donkerbruin naar roest, met een dunne gouden rand en een
  zachte schaduw eronder.
- **Tekst:** de titel in crème, "Herfst Sale" en "40% korting" in goud, de onderregel in
  lichte zandkleur.
- **Icoon:** het ronde 40%-icoon kreeg een gouden ring, anders verdwijnt het donkere
  icoon in de donkere balk.
- **Blad:** rechts een blad, iets donkerder dan de grond. Loopt er tekst overheen, zoals op
  mobiel, dan wordt die alleen beter leesbaar.

Leesbaarheid is getoetst tegen het lichtste stuk van het verloop, omdat de tekst op
mobiel tot de rand loopt: titel 6,2:1, gouden woorden 4,8:1, onderregel 5,2:1. Alles haalt
de norm van 4,5:1 voor kleine tekst.

**Terugzetten:** in de thema-editor, productsjabloon, koopvak, onder Cadeau: "Aanbodbalk
kleur" op Zand. Dat kan per sjabloon, zonder code. Herfst is de standaard in deze kopie.

Code: `assets/ws-pdp-koopvak.css` (blok onderaan, klasse `ws-gift--herfst`) en
`sections/ws-pdp-koopvak.liquid` (de instelling `aanbod_kleur`).

### Twee kopieën

Er staat ook een kopie **"CRO-fixes 25-09"**. Daarin staan dezelfde CRO-aanpassingen, met
"Sale" in plaats van "Herfst Sale", plus één extra instelling (`rev_winkelcijfer`) en een
andere versie van de koopvak-code. Publiceer er één. Wat alleen in de andere kopie staat,
gaat dan niet live.
