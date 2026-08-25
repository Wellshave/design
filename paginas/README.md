# Pagina's

Afgebouwde pagina's, gemaakt volgens de merklaag in
`.claude/skills/sanwarwala-landing-pages/references/wellshave-merklaag.md`.

De skill ernaast beschrijft *hoe* je bouwt; deze map bevat *wat* er gebouwd is.
Landingspagina's per campagne horen hier niet thuis &mdash; die leven bij de campagne.
Hier staan alleen vaste pagina's van de winkel.

| Bestand | Waar hij heen gaat | Status |
|---|---|---|
| `over-ons.html` | `wellshave.com/pages/over-ons` | nog niet gepubliceerd |

## Hoe deze pagina's zijn opgezet

Alles zit in `<div class="gg-lp">` en elke CSS-selector is daarbinnen gescoopt
(merklaag deel 16). Daardoor kan de pagina binnen het Shopify-thema draaien zonder
de themaheader en -footer te raken. Meldbalk en navigatie zitten er bewust niet in:
het thema levert die al.

Er staan geen letterlijke accenten of typografische tekens in de HTML, alleen
entiteiten. Dat is nodig omdat tekensets omvallen bij het plakken van een grote lap
HTML in de Shopify-editor.

## Voor het publiceren

1. Zet de stylesheet als los `.css`-bestand op de Shopify-CDN, onder een nieuwe naam
   bij elke wijziging (`-2`, `-3`). Een bestaande naam overschrijven levert cachegedoe op.
2. Beelden wijzen nu naar de bestaande Shopify-CDN van wellshave.com. Vervang ze door
   eigen merkfotografie waar die scherper aansluit.
3. Lees na het opslaan de inhoud terug via de API en tel de secties, beelden en knoppen.
   De editor schoont ongeldige markup stil op, en dat zie je niet in de bewerker.
