# Wat er live staat

## Variant B, gepubliceerd in de Shopify-shop

- **URL:** https://wellshave.com/pages/ze-zegt-er-niets-van-b
- **Page ID:** `gid://shopify/Page/734955241804`
- **Handle:** `ze-zegt-er-niets-van-b`
- **Bron in deze repo:** `groom-guard-ze-zegt-er-niets-van-b.html`
- **Stylesheet:** `https://cdn.shopify.com/s/files/1/0573/5743/4923/files/ws-gg-variant-b.css`

De pagina draait binnen het themasjabloon. Ten opzichte van het bestand in deze
repo zijn drie dingen anders, en dat is bewust:

1. De meldbalk en de merkbalk zijn eruit; die levert het thema zelf.
2. De opmaak zit in een los CSS-bestand op de CDN in plaats van in een
   `<style>`-blok, met Montserrat via een `@import` bovenaan.
3. Onderaan die stylesheet staat de verdediging tegen de themalaag: de
   dubbele paginatitel verbergen, de opgelegde `border-radius` op beelden
   terugdraaien, de bullets uit de eigen lijsten halen en de marge onder de
   wikkellaag weghalen.

### Wijzig je de pagina

Pas het bestand in deze repo aan, bouw daarna de themaversie opnieuw en upload
de stylesheet **onder een nieuwe naam** (`-2`, `-3`); een bestaande naam
overschrijven levert cachegedoe op. Werk daarna de `<link>` in de pagina bij.

### Teruggelezen na publicatie

9 secties, 10 beelden, 3 pakketkaarten, 3 winkelwagenlinks, de vaste balk en
het script staan er allemaal in. Gerenderd met `base.css` en `richtext.css` van
het thema ervoor en deze stylesheet erachter: geen horizontale overloop op 1440
en 390, Montserrat laadt, de dubbele themakop is verborgen en de rail houdt
1140px.

## Beelden op de eigen CDN

| Bestand | Waar |
|---|---|
| `ws-gg-badkamerdeur.jpg` | hero van variant B |
| `ws-gg-slaapkamer.jpg` | bij de opening van variant B |
| `ws-gg-die-blik.jpg` | beeldband van variant B |
| `ws-gg-oude-tools.jpg` | wat de lezer eerder probeerde, beide varianten |
| `ws-gg-shirt-uit.jpg` | het verlangenblok, beide varianten |

Alle vijf staan onder `https://cdn.shopify.com/s/files/1/0573/5743/4923/files/`.

## Variant A

Nog niet gepubliceerd in Shopify. Bron: `groom-guard-ze-zegt-er-niets-van.html`.
De handle `ze-zegt-er-niets-van` is daarvoor vrijgehouden.
