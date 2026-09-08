# Bedankpagina na aanmelding (UpPromote, thank you page)

Teksten voor het tabblad **Inhoud** van de bedankpagina. De pagina die iemand ziet
direct na het invullen van het registratieformulier, terwijl hij nog moet bevestigen.

Dit is een afhaakmoment: de aanmelding staat er, maar telt pas als de verificatiemail
wordt geopend. De teksten hieronder zijn erop gericht dat die mail gevonden wordt.

## Nog invullen

- `[afzendernaam]` en `[onderwerpregel]`: meld je een keer aan met een eigen adres en
  neem letterlijk over wat er binnenkomt. Nooit gokken, een verkeerde onderwerpregel
  maakt het zoeken juist moeilijker.
- `[jullie e-mailadres]`: hetzelfde adres als in de affiliategids.

## De pagina

**Kop**

    Bevestig je e-mailadres

**Alinea 1**

    We hebben je een verificatielink gestuurd. Klik erop en je aanmelding is compleet.

**Alinea 2, afzender en onderwerp**

    De mail komt van [afzendernaam], met als onderwerp "[onderwerpregel]". Zie je hem
    niet in je inbox, zoek dan op die naam en kijk even in je map met spam, updates
    of promoties.

**Alinea 3, de uitweg**

    Lukt het daarna nog steeds niet? Stuur de mail hieronder opnieuw, of mail ons op
    [jullie e-mailadres]. Dan zetten we je account handmatig klaar. Je hoeft je niet
    opnieuw aan te melden.

**Knop**

    Stuur de mail opnieuw

## Wat er is gewijzigd ten opzichte van de standaardtekst

- "Klik gewoon op de link" is eruit. Dat "gewoon" suggereert dat het simpel is, en juist
  op het moment dat iemand de mail niet kan vinden werkt dat averechts.
- De losse regel "Kun je de e-mail nog steeds niet vinden?" is opgegaan in de laatste
  alinea. Hij stond er als vraag zonder antwoord, terwijl de knop eronder hem beantwoordt.
- De knoptekst staat in het Nederlands. "Resend email" was de enige Engelse tekst op een
  verder Nederlandse pagina. Staat hij niet in Inhoud, dan staat hij onder Translation.

## Ontwerp-tab, bijbehorende instellingen

Geen CSS nodig voor deze drie:

| Veld | Van | Naar | Waarom |
| --- | --- | --- | --- |
| Lettertype | Open Sans | Montserrat | huisletter, staat mogelijk in de keuzelijst |
| Achtergrondkleur | `#363636` | `#191816` | Wellshave-carbon in plaats van neutraal app-grijs |
| Knopkleur | `#ecc987` | `#E5BC77` | tint uit de merkgradiënt |
| Knoptekstkleur | `#000000` | `#1A1408` | zachter op goud dan puur zwart |

Wel CSS nodig: een maximumbreedte op de tekst (de regels lopen nu over de volle breedte
van het donkere vlak) en het tekstgewicht terug naar normaal, want nu is alles vet.

    h1, h2, h3, p { max-width: 520px; margin-left: auto; margin-right: auto; }
    p, p strong, p b { font-weight: 400 !important; line-height: 1.6; color: #E6E2DA; }
    h1, h2 { font-weight: 800; color: #FFFFFF; }
