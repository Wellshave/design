# -*- coding: utf-8 -*-
"""Bouwt collection.bundels.json. Alle getallen komen uit de winkel:
   het aantal onderdelen uit custom.included_box, prijs en vanprijs uit het
   product zelf. In de teksten staat geen claim die daar niet uit volgt."""
import json

# ── de elf bundels waar de keuzehulp op uit kan komen ────────────────
# De drie Barber Bro's staan er bewust niet bij: availableForSale is false.
NIEUW = {
 'bodynose': dict(id='bodynose', product='wellshave-shave-package-2-0',
   naam='Body & Nose Bundel', badge='Instap van de lijn',
   zin='Bodygroomer met oplaadstation en vier opzetkammen, plus een losse neustrimmer.',
   reden_1='Zeven onderdelen in de doos', reden_2='Opzetkammen 1,5 tot 4,5 mm',
   reden_3='Losse neustrimmer erbij'),
 'essflex': dict(id='essflex', product='essential-flex-bundel',
   naam='Essential Flex Bundel', badge='Tas én harde koffer',
   zin='Trimmer met foilkop en SkinSafe-mes, met een toilettas en een harde koffer erbij.',
   reden_1='Acht onderdelen in de doos', reden_2='Foilkop voor de gladde afwerking',
   reden_3='Toilettas én hard case'),
 'bpack1': dict(id='bpack1', product='barber-pack-1-0',
   naam='Barber Pack 1.0', badge='Instap van de Barber-lijn',
   zin='Tondeuse en detailtrimmer met twee sets opzetkammen, een kapperscape en een borstel.',
   reden_1='Acht onderdelen in de doos', reden_2='Opzetkammen 1,5 tot 13 mm',
   reden_3='Kapperscape en schoonmaakborstel'),
 'skull1': dict(id='skull1', product='skull-shaver-deluxe-extra-magnetische-scheerkop',
   naam='Skull Deal 1.0', badge='Instap van de Skull-lijn',
   zin='Het 7D-scheerapparaat met een tweede scheerkop, een haartrimmer en een gezichtsmassager.',
   reden_1='Zes onderdelen in de doos', reden_2='Tweede 7D-scheerkop erbij',
   reden_3='Haartrimmer 3,5 en 7 mm'),
 'skull2': dict(id='skull2', product='skull-deal-2-0',
   naam='Skull Deal 2.0', badge='Met toilettas',
   zin='Dezelfde set als de 1.0, met een toilettas erbij.',
   reden_1='Zeven onderdelen in de doos', reden_2='Tweede 7D-scheerkop erbij',
   reden_3='Toilettas voor onderweg'),
}

VRAGEN = [
 ('waar', 'Waar is de set voor?', [
    ('lichaam', 'Lichaam & schaamstreek', 'lichaam en schaamstreek'),
    ('haar',    'Haar, fades & baard',    'haar en baard'),
    ('hoofd',   'Het hoofd kaal',         'het hoofd kaal')]),
 ('glad', 'Alleen trimmen, of ook glad afwerken?', [
    ('trim', 'Alleen trimmen',    'alleen trimmen'),
    ('glad', 'Ook glad afwerken', 'ook glad afwerken')]),
 ('extra', 'Moet er nog iets bij?', [
    ('niets',  'Nee, dit is genoeg',   'niets extra'),
    ('neus',   'Een losse neustrimmer','losse neustrimmer'),
    ('lijnen', 'Een detailtrimmer',    'detailtrimmer')]),
 ('mee', 'Hoe berg je hem op?', [
    ('niets',  'Geen tas nodig',       'geen tas'),
    ('tas',    'Een tas erbij',        'met tas'),
    ('koffer', 'Tas én harde koffer',  'tas en koffer')]),
]

TABEL = [
 'waar=lichaam, glad=trim > bodynose',
 'waar=lichaam, extra=lijnen > flexbundel',
 'waar=lichaam, mee=koffer > essflex',
 'waar=lichaam, extra=neus, mee=tas > spult',
 'waar=lichaam, extra=neus > sp30',
 'waar=lichaam > flexbundel',
 'waar=haar, extra=neus > bpack3',
 'waar=haar, glad=glad > bpack2',
 'waar=haar > bpack1',
 'waar=hoofd, mee=koffer > skull3',
 'waar=hoofd, mee=tas > skull2',
 ' > skull1',
]

GROEPEN = [
 dict(kop='Lichaam & schaamstreek', cat='bundel',
   sub='Vijf sets rond een bodygroomer. Ze verschillen in de afwerking, de neustrimmer en wat er meegaat op reis.',
   producten=['wellshave-shave-package-2-0','wellshave-shave-package-3-0','shave-package-ultimate',
              'essential-flex-bundel','body-beard-kit'],
   labels='body-beard-kit = Meeste onderdelen\nwellshave-shave-package-2-0 = Instap van de lijn'),
 dict(kop='Haar, fades & baard', cat='bundel',
   sub='Drie kapperssets rond een tondeuse, oplopend van kammen en detailtrimmer tot een shaver en een neustrimmer.',
   producten=['barber-pack-1-0','barber-pack-2-0','barber-pack-3-0'],
   labels='barber-pack-3-0 = Meeste onderdelen'),
 dict(kop='Het hoofd kaal', cat='bundel',
   sub='Drie treden van dezelfde 7D-set. Het verschil zit in wat er meegaat, niet in het apparaat.',
   producten=['skull-shaver-deluxe-extra-magnetische-scheerkop','skull-deal-2-0','skull-deal-3-0'],
   labels='skull-deal-3-0 = Tas en travelbag'),
 dict(kop='Barber Bro-lijn', cat='bundel',
   sub='Dezelfde opbouw als de Barber Packs, met een andere tondeuse.',
   noot='Deze drie zijn op dit moment niet leverbaar. Ze staan hier zodat je ze kunt vergelijken met de Barber Packs hierboven, die wel op voorraad zijn.',
   producten=['barber-bro-1-0','barber-bro-2-0','barber-bro-3-0'], labels=''),
]
