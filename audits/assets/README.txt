Aangeleverd beeldmateriaal voor het homepage-redesign.

Plaats hier bestanden die van Dustin komen en nog niet in Shopify staan,
bijvoorbeeld essential-flex-bundel.png voor het koopblok in blok 2.

De blok-bestanden verwijzen niet rechtstreeks naar deze map: bij het bouwen
worden beelden als data-URI in de .html gezet, terwijl de bijbehorende
.template.html placeholders houdt (__BUNDLEBIG__, __USE__, __MARK__).
Zo blijft de bron leesbaar en zijn beelden vervangbaar.

Snijd beelden altijd bij op hun eigen verhouding en controleer daarna met
audits/verify-layout.mjs of niets overloopt of vervormt.
