# UpPromote, ingestelde en besloten configuratie

Wat er in het affiliateprogramma staat, en waarom. Bedoeld zodat de teksten in
`affiliate-gids-nl.html` en `bedankpagina-teksten.md` kloppen met de app, en zodat
een volgende wijziging niet opnieuw uitgezocht hoeft te worden.

Bijwerken zodra er iets in UpPromote verandert. Een gids die iets anders belooft dan
de app doet, is erger dan geen gids.

## Programma: Standaardprovisie voor affiliates (actief)

| Instelling | Waarde |
| --- | --- |
| Commissie | 15% van de verkoop, eenvoudige vaste commissie |
| Grondslag | exclusief productbelasting, verzending, verzendbelasting en fooi |
| Speciale productcommissie | inactief |
| Nieuwe klantencommissie | uit |
| Levenslange commissies | uit |
| Speciale couponcommissie | uit |
| Uitgesloten producten of collecties | geen |
| Zelfverwijzingen uitsluiten | uit, affiliates mogen dus via hun eigen link kopen |

Levenslange commissie staat uit: er is commissie op de doorverwezen bestelling, niet
op latere aankopen van dezelfde klant.

## Korting voor de klant

Automatische kortingsregel "Korting voor klant" staat actief, voor alle affiliates,
op basis van de affiliate coupon. Klikt iemand op een affiliatelink, dan staat de code
van die affiliate al in de winkelwagen.

Let op de afhankelijkheid: die regel werkt alleen als de affiliate ook echt een code
heeft. Automatisch coupon genereren stond inactief, waardoor nieuwe aanmeldingen zonder
code binnenkwamen. Bij het aanzetten geldt:

- de kortingswaarde komt bovenop de 15% commissie, dus 10% korting maakt de totale
  kosten 25% van de productomzet
- houd dezelfde waarde aan als de handmatig uitgedeelde codes, anders krijgen nieuwe
  affiliates iets anders dan de bestaande
- bestaande affiliates krijgen meestal geen code met terugwerkende kracht, dus de
  affiliatelijst nalopen

## Uitbetaling

Gekozen route: affiliates vragen zelf uitbetaling aan, wij keuren goed.

| Instelling | Waarde |
| --- | --- |
| Betaalmethoden | PayPal, bankoverschrijving, debitcard |
| Standaard betaalmethode | geen, iedere affiliate kiest zelf |
| Minimum voor een aanvraag | EUR 25 |
| Extra bedrag aanvragen | uit |
| Affiliate factuur | toestaan, niet verplichten |
| Automatisch betalingsschema | uit |

Automatisch uitbetalen bewust niet aangezet. Het betaalt ongeverifieerde verwijzingen
zonder dat iemand ernaar kijkt, en zolang zelfverwijzingen zijn toegestaan is dat een
open deur. Heroverwegen na een paar maanden schone data.

De PayPal- en Wise-koppeling staan nog op setup, dus goedgekeurde aanvragen worden
handmatig overgemaakt.

## Links en tracking

| Instelling | Waarde |
| --- | --- |
| Winkel-URL | https://wellshave.com |
| Tracking via coupon | aan |
| Partners mogen couponnaam bewerken | uit |
| Partners mogen aangepaste link bewerken | uit |
| Bit.ly-verkorting | uit |

UTM-instellingen. Alle drie de schakelaars aan, ook die voor productlinks en voor
links met een eigen bron, anders blijft een deel van het verkeer ongetagd.

| Veld in UpPromote | Waarde |
| --- | --- |
| Campagnebron | `{affiliate_name}` |
| Campagnemedium | `affiliate` |
| Campagnenaam | `standaardprovisie` |
| Campagnetermijn | leeg |
| Campagne-inhoud | `{affiliate_id}` |

`utm_medium` moet exact `affiliate` zijn, kleine letters en enkelvoud, anders valt het
verkeer buiten de standaard kanaalgroep Affiliates van GA4. Nooit `referral` of `cpc`.
De voorbeelden die UpPromote onder dat veld toont zijn generiek en sturen de verkeerde
kant op.

De naam staat in de bron omdat een rapport dan leesbaar is zonder opzoekwerk. Het ID
staat in campagne-inhoud als exacte sleutel, want affiliatenamen kunnen spaties en
hoofdletters bevatten en GA4 is hoofdlettergevoelig.

Bij een tweede programma moet de campagnenaam heroverwogen worden: de UTM-instelling
geldt voor alle partnerlinks, dus een vaste waarde klopt dan niet meer.

GA4 en UpPromote gaan niet gelijklopen: GA4 rekent op last-non-direct, UpPromote op zijn
eigen cookie. Dat is geen fout, ze meten iets anders.

## Nog open

- Cookieduur, staat onder Settings > General. Ontbreekt nog in stap 2 van de gids.
- Goedkeuringstermijn in dagen. De gids beschrijft hem nu zonder getal, wat klopt,
  maar met getal is het concreter.
- Kortingswaarde van de automatisch gegenereerde coupon. Zodra bekend hoort die in de
  gids, want dan weet een affiliate wat hij te bieden heeft.
- Beleid: bieden op de merknaam in zoekadvertenties, ja of nee.
- Beleid: kortingscode- en cashbacksites, ja of nee.
- Beleid: zelfverwijzingen staan aan. Bewust? En zo ja, benoemen in de gids of niet?
