# Wat er live staat

## Variant B, gepubliceerd in de Shopify-shop

- **URL:** https://wellshave.com/pages/ze-zegt-er-niets-van-b
- **Page ID:** `gid://shopify/Page/734955241804`
- **Handle:** `ze-zegt-er-niets-van-b`
- **Bron in deze repo:** `groom-guard-ze-zegt-er-niets-van-b.html`
- **Stylesheet:** `https://cdn.shopify.com/s/files/1/0573/5743/4923/files/ws-gg-variant-b-6.css`
  (versies 1 tot en met 5 staan er nog, maar worden niet meer gebruikt)

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

## Het Trustpilot-merkteken

Onder de hero staat een smalle balk met **Uitstekend &middot; 4,4 uit 5 &middot; groene ster
Trustpilot**, en daaronder klein waar dat cijfer over gaat. Die vorm verving de regel
"4,4 uit ruim 1.000 Trustpilot-beoordelingen van Wellshave", die waar was en niets zei.

- **Uitstekend is niet ons woord.** Het komt uit `starsString` van de widget-data, in de
  locale die je opvraagt. Verandert de score van band, dan verandert dat woord mee: haal
  het opnieuw op in plaats van het over te typen.
- **De ster is `#00B67A`,** het groen van Trustpilot. Geen merkgoud eroverheen: het moet
  er niet van ons uitzien.
- **De noot eronder blijft staan.** Zonder die regel leest een bedrijfsbrede score als een
  oordeel over de Groom Guard. In de verantwoording onderaan staat bovendien dat het woord
  van Trustpilot komt.
- **Onder de carrousel staat hetzelfde merkteken als link,** maar alleen als terugval: het
  zit in de widget-div, dus zodra het Trustpilot-script draait vervangt de carrousel het.
  Dat is de bedoeling; de carrousel heeft zijn eigen merkregel.

## De Trustpilot-carrousel

In het bewijsblok staat de Trustpilot-carrousel: template `53aa8912dec7e10d38f59f36`,
businessunit `63c511d4e1339e2200c204a1`, gefilterd op vier en vijf sterren en
Nederlandstalige beoordelingen. De widget heeft het bootstrap-script nodig; dat staat
onderaan de pagina en laadt `async`.

Twee dingen die bewust zo zijn:

- **`data-style-height` staat op `360px`** in plaats van `100%`. Met een percentage
  moet de container een vaste hoogte hebben, en dan klapt de terugval dicht.
- **In de widget-div staat de statische score als terugval.** Trustpilot vervangt de
  inhoud van die div zodra het script draait. Wordt het script geblokkeerd, door een
  adblocker of een strenge CSP, dan blijft de score met de link naar Trustpilot staan
  in plaats van een leeg gat.

Onder de carrousel staat wat hij wel en niet toont: vier en vijf sterren, terwijl de
4,4 over alle beoordelingen gaat. Zonder die regel zou de pagina een selectie tonen en
een gemiddelde claimen.

Het bootstrap-script activeert ook de kleine sterrenwidget die het thema zelf al in de
pagina zet en die op dit sjabloon niet laadde. Dat is geen bijwerking om weg te halen,
maar wel iets om te weten.

### Aantal beoordelingen

Op 4 september 2026 stond de teller op 1.004, score 4,4. De pagina schrijft
"ruim 1.000": een ondergrens blijft waar terwijl de teller oploopt. Live na te vragen:

```
https://widget.trustpilot.com/trustbox-data/5419b6ffb0d04a076446a9af?businessUnitId=63c511d4e1339e2200c204a1&locale=nl-NL
```

### Teruggelezen na publicatie

9 secties, 10 beelden, 3 pakketkaarten, 3 winkelwagenlinks, de vaste balk, de
tabbalk, de twee schuifstrips met teller en bolletjes, en beide scripts staan er
allemaal in. Gerenderd met `base.css` en `richtext.css` van
het thema ervoor en deze stylesheet erachter: geen horizontale overloop op 1440
en 390, Montserrat laadt, de dubbele themakop is verborgen en de rail houdt
1140px.

## Het mobiele ontwerp

Vanaf versie 4 van de stylesheet gaat op mobiel opzij wat gescand wordt. Wat er
per blok gebeurt en waarom staat in deel 17 van de merklaag; hier alleen wat er
op deze pagina zit en waar je op moet letten als je hem aanpast.

| Blok | Onder 760px |
|---|---|
| Geruststrook | doorlopende ticker, met de vier items verdubbeld in de HTML |
| Tintkaarten | tabpaar **Het probleem / De oplossing**, elk een schuifstrip |
| Pakketkaarten | schuifstrip van drie, 86% breed, met snap |
| Kenmerkkaarten | 2 &times; 2 |
| Garantieregel | 2 &times; 2 tegels met een icoon |
| Aanbodstroken | beeld en tekst op een rij, prijs en knop eronder |
| Vaste balk | productbeeld erbij, prijs en knop |

Boven elke schuifstrip staat een veegrij: veeghint links, teller rechts. Eronder
staan bolletjes waar je op kunt tikken. Die worden gevuld door een scriptje
onderaan de pagina; zonder javascript blijven de strips gewoon veegbaar.

Drie dingen die stuk gaan als je ze aanraakt:

1. **De radio's moeten broer blijven van `.tabbalk` en `.kaarten3`.** De tabs
   werken op `#tt-probleem:checked ~ .kaarten3 .tk.oplossing{display:none}`. Zet je
   ze in een extra `<div>`, dan bijt die selector niet meer en zie je alle drie de
   kaarten door elkaar.
2. **Shopify minificeert de stylesheet bij het uploaden.** Dat gaat goed, ook met
   de `:checked ~` selectors en `[aria-current="true"]`, maar controleer het na een
   upload: haal het bestand van de CDN en grep op die twee.
3. **De pagina-editor van Shopify laat de `<input type="radio">` staan.** Dat is
   nagekeken op de live pagina; ga er niet blind van uit bij een volgende sjabloon.
4. **Zet de maat van een inline svg buiten de media-query.** Zet je `width` en `height`
   alleen in de mobiele regel, dan valt een svg op desktop terug op zijn eigen
   standaardformaat en staat een hele regel scheef. Dat gebeurde hier met de
   garantieregel. Controle die het vangt: alle `svg` in `.gg-lp` opmeten op 1440, 900
   en 390 en afkeuren wat boven de 40px uitkomt.

Op 390px is de pagina 12.757 pixels hoog, tegen 15.976 in de eerste versie, zonder
dat er een woord uit is gegaan.

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
