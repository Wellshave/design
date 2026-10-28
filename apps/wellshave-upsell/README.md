# Wellshave Upsell

Eigen vervanger van Aftersell (aanbod na betaling) en Upsell.com/ReConvert (bedankpagina).
De instellingen komen uit de Upsell Studio: https://claude.ai/artifact/EVuUKTYyaZnyzLBndpMrDk

## Waarom zelf

In de 90 dagen tot 27 oktober 2026 betaalde 82% van de klanten met iDEAL, Klarna of Bancontact.
Shopify toont de pagina na betaling alleen bij kaart, Shop Pay en PayPal. Aftersell voegde bij
iDEAL het product eerst toe en vroeg pas daarna om betaling: 17 van de 33 upsells vervielen
na 65 minuten. Deze app laat de klant meteen betalen, of er verandert niets.

## Hoe het werkt

| Betaalmethode | Waar | Wat er gebeurt na "Ja" |
|---|---|---|
| Kaart, Shop Pay, PayPal | Pagina na betaling (`post-purchase-offer`) | Eén tik: de server ondertekent de wijziging, Shopify schrijft direct af en voegt toe aan dezelfde order. |
| iDEAL, Klarna, Bancontact, Apple Pay | Bovenaan de bedankpagina (`thank-you-offer`) | De knop gaat naar `/api/thank-you/go`. De server maakt een unieke code (één keer bruikbaar, alleen voor deze klant, 30 minuten geldig, gratis verzending) en stuurt door naar een checkout met alles al ingevuld. |

Daarna:

- **Tweede order koppelen:** de webhook `orders/create` herkent de tweede order aan het kenmerk `_ws_parent` en tagt beide orders met `upsell-bundel-<ordernummer>`.
- **Weg is weg:** wegklikken, verlopen of accepteren zet de regel in het klantprofiel (`wellshave_upsell.dismissed`). Die regel komt voor die klant nooit meer terug.
- **Klok:** de klok start bij de eerste keer tonen en staat op de server. Herladen zet hem niet terug.
- **Bedankpagina:** toont nooit de producten die al na betaling werden aangeboden.
- **Herinnering:** "Ja, herinner mij" stuurt het Klaviyo-event `Herinnering vervangmesjes aangevraagd` met de datum `herinner_op`.

## Onderdelen

```
extensions/upsell-discount     Shopify Function: korting op de gekozen producten + gratis verzending, alleen via de unieke code
extensions/thank-you-offer     Bedankpagina (Preact, checkout-componenten)
extensions/post-purchase-offer Pagina na betaling (React)
server/functions/api.mjs       Netlify-functie: installatie, aanbod, codes, ondertekenen, webhooks
server/lib/                    JWT, regels, Shopify Admin API
config/upsell-config.json      Export uit de Upsell Studio
scripts/sync-config.mjs        Zet de instellingen in de shop-metafield wellshave_upsell.config
```

Testen: `npm test` (regels, JWT, checkout-link, kortingsfunctie).

## Live zetten

Deze stappen vragen een inlog die alleen jij hebt.

1. **App aanmaken.** In het Shopify Dev Dashboard een app "Wellshave Upsell" aanmaken voor de eigen winkel. Daarna in deze map: `npm install`, `npx shopify app config link` (vult `client_id` in) en `npx shopify app deploy`.
2. **Server.** Draait al op https://wellshave-upsell.netlify.app (Netlify-project `wellshave-upsell`). Nog toevoegen onder Project configuration > Environment variables:
   - `SHOPIFY_API_KEY` en `SHOPIFY_API_SECRET` uit het Dev Dashboard
   - `STORE_DOMAIN=wellshave.com`
   - `KLAVIYO_PRIVATE_KEY` (alleen nodig voor de herinnering)

   Klopt het adres niet met `wellshave-upsell.netlify.app`, pas het dan aan in `shopify.app.toml` en in de twee extensies (`APP_URL`).
3. **Installeren.** Open `https://wellshave-upsell.netlify.app/auth?shop=wellshave.myshopify.com` en keur de app goed.
4. **Instellingen.** Zet de instellingen in de winkel met `npm run sync-config`.
5. **Bedankpagina.** In Instellingen > Checkout > Aanpassen > Bedankpagina het blok "Wellshave aanbod en bedankt" bovenaan zetten. Het blok van Upsell.com/ReConvert daar weghalen.
6. **Pagina na betaling.** Toegang aanvragen bij Shopify (vereist voor live winkels). Daarna in Instellingen > Checkout > Pagina na aankoop deze app kiezen in plaats van Aftersell.
7. **Klaviyo.**
   - Een flow maken op het event `Herinnering vervangmesjes aangevraagd`, wachtend tot `herinner_op`.
   - De flow voor verlaten checkouts uitsluiten voor checkouts met het kenmerk `_ws_parent`. Anders komt het aanbod via de mail toch terug, en dat beloven we de klant niet.
8. **Magazijn.** Navragen bij Lyra dat orders met dezelfde tag `upsell-bundel-…` in één pakket gaan.
9. **Testorder.** Twee testorders doen: één met iDEAL en één met kaart. Per order controleren:
   - de korting
   - verzending €0
   - de tags op beide orders
   - dat het aanbod daarna niet terugkomt

## Daarna uitzetten

Pas als stap 9 goed is:

- **Aftersell:** de-installeren.
- **Upsell.com (ex ReConvert):** de-installeren.
- **Selleasy en Kaching Popup:** eerst controleren wat ze nu nog doen in de winkelwagen of op de productpagina. Die plekken vervangt deze app niet.

## Instellingen wijzigen

Pas de regels aan in de Upsell Studio. Vraag Claude daarna om te synchroniseren: die werkt `config/upsell-config.json` bij en zet het in de winkel. Je kunt het ook zelf doen met `npm run sync-config`.
