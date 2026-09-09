# -*- coding: utf-8 -*-
"""Meta title en description per collectie.

Techniek:
  - de zoekterm waarop de pagina kans maakt staat vooraan in de title
  - één onderscheidend kenmerk erachter, merk als laatste
  - de description is geen samenvatting maar een reden om te klikken:
    wat er staat, waarin het verschilt, en één feit dat de drempel verlaagt
  - geen prijzen (die verouderen); de verzendgrens mag wel, die is stabiel
  - elke claim is nagerekend: 100 dagen proberen staat 9x op de live site,
    gratis verzending vanaf 30 euro komt uit de verzendinstelling zelf
"""

SEO = {
 'all': dict(
   id='gid://shopify/Collection/641435402572',
   title='Grooming voor mannen — alle apparaten | Wellshave',
   desc='Bodygroomers, baardtrimmers, scheerapparaten en neustrimmers op één plek. Kies je plek, zie welk apparaat erbij past. 100 dagen proberen.'),

 'bodygroomers': dict(
   id='gid://shopify/Collection/275093684267',
   title='Bodygroomer mannen kopen — SkinSafe, IPX7 | Wellshave',
   desc='Bodygroomers met een keramisch mes achter een kam, voor borst, rug en schaamstreek. Waterdicht, met LED-licht. 100 dagen proberen.'),

 'zone-gezicht': dict(
   id='gid://shopify/Collection/691468042572',
   title='Gezicht & baard: scheren en trimmen | Wellshave',
   desc='Scheerapparaten, baardtrimmers en safety razors voor je gezicht. Van strak afgetekend tot glad geschoren. 100 dagen thuis proberen.'),

 'zone-hoofd': dict(
   id='gid://shopify/Collection/691468075340',
   title='Je hoofd zelf scheren of knippen | Wellshave',
   desc='Head shavers met koppen die de bolling van je schedel volgen, en tondeuses met een fade-hendel. 100 dagen thuis proberen.'),

 'neustrimmers': dict(
   id='gid://shopify/Collection/626911215948',
   title='Neustrimmer kopen — neus, oren, wenkbrauw | Wellshave',
   desc='Neustrimmers die neus- en oorhaar wegnemen zonder te trekken. Ook voor wenkbrauwen en de baardlijn. 100 dagen thuis proberen.'),

 'scheerapparaten': dict(
   id='gid://shopify/Collection/627558580556',
   title='Elektrisch scheerapparaat mannen | Wellshave',
   desc='Elektrische scheerapparaten voor een gladde huid: roterend of met foilkop, met neusopzetstuk of reinigingsstation. 100 dagen proberen.'),

 'baardtrimmers': dict(
   id='gid://shopify/Collection/626906595660',
   title='Baardtrimmer mannen kopen — 1 tot 9 mm | Wellshave',
   desc='Baardtrimmers met opzetkammen van 1 tot 9 mm en een precisietrimmer voor de lijnen. Waterdicht. 100 dagen thuis proberen, 2 jaar garantie.'),

 'tondeuses': dict(
   id='gid://shopify/Collection/626911117644',
   title='Tondeuse kopen — fades en kort knippen | Wellshave',
   desc='Tondeuses met opzetkammen van 1,5 tot 13 mm en een verstelbare hendel voor fades. Knippen zonder trekken. 100 dagen thuis proberen.'),

 'safetyrazors-scheren-scheermes': dict(
   id='gid://shopify/Collection/626956075340',
   title='Safety razor kopen — klassiek nat scheren | Wellshave',
   desc='Safety razors van roestvrij staal met wisselbare mesjes. Geen accu, geen oplader — alleen het mesje vervangen. 100 dagen proberen.'),

 'bundels': dict(
   id='gid://shopify/Collection/650036412748',
   title='Grooming set kopen — alles in één doos | Wellshave',
   desc='Complete sets rond één apparaat, met de opzetstukken erbij. Op elke set staat hoeveel onderdelen erin zitten. 100 dagen proberen.'),

 'accesoires': dict(
   id='gid://shopify/Collection/657992679756',
   title='Mesjes, scheerkoppen en opzetstukken | Wellshave',
   desc='Vervangende mesjes, scheerkoppen en opzetstukken voor je Wellshave-apparaat, plus tassen. Gratis verzending vanaf €30.'),
}

# claims die niet meer kloppen en dus nergens in mogen staan
VERBODEN = ['30 dagen proef', '30 dagen', 'vanaf €50', 'vanaf 50', '€49,95', '2,95',
            'nooit meer', 'onmogelijk', 'gegarandeerd glad', 'beste ']
