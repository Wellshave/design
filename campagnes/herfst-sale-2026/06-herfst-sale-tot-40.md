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
