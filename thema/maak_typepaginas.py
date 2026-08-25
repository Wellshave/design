# -*- coding: utf-8 -*-
"""Een typecollectie als één-groep-pagina: kop zonder keuzehulp, raster dat de
   collectie zelf uitleest, en de slotband. De uitleg en het bewijs staan op de
   zonepagina — een typepagina is een gefilterde blik, geen tweede bestemming."""
import json
from zg_engine import W

C = W + '/collections/'
ZONES = [('Lichaam &amp; schaamstreek', '4', C + 'bodygroomers'),
         ('Gezicht &amp; baard', '11', C + 'zone-gezicht'),
         ('Hoofd', '4', C + 'zone-hoofd'),
         ('Neus &amp; oren', '8', C + 'neustrimmers')]

ZEKER = [('retour', '100 dagen thuis proberen', 'Niet goed? Je krijgt je geld terug.'),
         ('schild', '2 jaar garantie', 'Op elk apparaat in de collectie.'),
         ('truck', 'Gratis verzending vanaf €30', 'Naar België gratis vanaf €49,95.'),
         ('klok', 'Morgen in huis', 'Besteld voor 23:59.')]


def typepagina(t):
    zoneblokken, zorde = {}, []
    for i, (naam, aantal, url) in enumerate(ZONES, 1):
        zoneblokken['zone_%d' % i] = {'type': 'zone', 'settings': {
            'naam': naam.replace('&amp;', '&'), 'aantal': aantal, 'url': url,
            'huidig': naam.replace('&amp;', '&') == t.get('zone_naam', '')}}
        zorde.append('zone_%d' % i)

    slotzones, sorde = {}, []
    for i, (icoon, kop, tekst) in enumerate(ZEKER, 1):
        slotzones['zeker_%d' % i] = {'type': 'zekerheid', 'settings': {
            'icoon': icoon, 'kop': kop, 'tekst': tekst}}
        sorde.append('zeker_%d' % i)
    for i, (naam, aantal, url) in enumerate(ZONES, 1):
        slotzones['zone_%d' % i] = {'type': 'zone', 'settings': {
            'naam': naam.replace('&amp;', '&'), 'tekst': t['zonekaarten'][i - 1],
            'slot': '%s apparaten →' % aantal, 'url': url}}
        sorde.append('zone_%d' % i)

    return {'sections': {
        'kop': {'type': 'ws-collectie-kop', 'blocks': zoneblokken, 'block_order': zorde, 'settings': {
            'eyebrow': t['eyebrow'], 'kop_1': t['kop_1'], 'kop_2': t['kop_2'],
            'lede': t['lede'], 'foto': '', 'foto_alt': '', 'monogram_letter': 'S',
            'score': '', 'sterren': 4, 'halve_ster': True, 'score_bron': '',
            'quote': '', 'quote_bron': '',
            'gerust_1': '100 dagen proberen', 'gerust_2': '2 jaar garantie',
            'gerust_3': 'Morgen in huis',
            'kaartkop': '', 'kaartsub': '', 'kaartvraag': '', 'tabel': '', 'standaard': '',
            'kruimel': t['kruimel'], 'zone_aantal': t['aantal'],
            'zonemelding': t['zonemelding'],
            'desk_indent_top': 0, 'desk_indent_bottom': 0,
            'mob_indent_top': 0, 'mob_indent_bottom': 0}},
        'raster': {'type': 'ws-collectie-raster',
                   'blocks': {'groep_1': {'type': 'groep', 'settings': {
                       'kop': t['groepkop'], 'sub': t['groepsub'], 'cat': 'app',
                       'uit_collectie': True, 'producten': [],
                       'noot': t.get('noot', ''), 'kicker': '', 'labels': t.get('labels', ''),
                       'link_label': t['linklabel'], 'link_url': t['linkurl']}}},
                   'block_order': ['groep_1'], 'settings': {
                       'filter_alles': 'Alles', 'filter_app': 'Apparaten',
                       'filter_bundel': 'Sets', 'filter_mes': 'Onderdelen',
                       'vergelijken': False, 'sorteer_label': '',
                       'keuzeregel': '', 'keuzeregel_start': '', 'wis_label': 'Wis keuzes',
                       'monogram': 'shopify://shop_images/ws-mark.png',
                       'geen_score': 'Nieuw · nog geen beoordelingen',
                       'uitverkocht_label': 'Tijdelijk uitverkocht',
                       'uitverkocht_voet': 'Tijdelijk niet leverbaar',
                       'blik_voet': '100 dagen proberen · 2 jaar garantie',
                       'mes_voet': 'Vandaag besteld, morgen in huis',
                       'aanbod_product': '', 'aanbod_eyebrow': '', 'aanbod_zin': '',
                       'aanbod_knop': 'Bekijk de set',
                       'slot_tekst': t['slottekst'],
                       'slot_link_label': t['linklabel'], 'slot_link': t['linkurl'],
                       'desk_indent_top': 0, 'desk_indent_bottom': 0,
                       'mob_indent_top': 0, 'mob_indent_bottom': 0}},
        'slot': {'type': 'ws-collectie-slot', 'blocks': slotzones, 'block_order': sorde, 'settings': {
            'eyebrow': '', 'h2_1': '', 'h2_2': '',
            'mail_regel': '', 'zones_eyebrow': t['zonesEyebrow'],
            'desk_indent_top': 0, 'desk_indent_bottom': 0,
            'mob_indent_top': 0, 'mob_indent_bottom': 0}},
    }, 'order': ['kop', 'raster', 'slot']}


TYPES = {
 'collection.type-baardtrimmers.json': dict(
   zone_naam='Gezicht & baard', kruimel='Baardtrimmers', aantal='5',
   eyebrow='Onderdeel van Gezicht & baard',
   kop_1='Je baard op de lengte', kop_2='die je zelf kiest.',
   lede='Drie kits met opzetstukken, één draaiknop met twintig standen en één flexkop voor korte '
        'stoppels. Ze horen allemaal bij de zone Gezicht & baard.',
   zonemelding='baardtrimmers, uit de zone Gezicht & baard.',
   groepkop='Baardtrimmers', groepsub='Vijf apparaten om je baard op lengte te houden.',
   noot='<b>De Iced en de Gold zijn dezelfde set.</b> Elf onderdelen, vijf opzetstukken, alleen de '
        'afwerking verschilt — en de Gold kost €3,00 meer.',
   labels='wellshave-5-in-1-baardtrimmer-man-shaper-iced = Zelfde set, goedkoper\n'
          'wellshave-5-in-1-baardtrimmer-men-shaper = Zelfde set, in goud\n'
          '6-in-1-baardtrimmer-supreme = Meest compleet\nthe-dial-master = Nieuw',
   linklabel='Bekijk de hele zone Gezicht & baard', linkurl=C + 'zone-gezicht',
   slottekst='in deze categorie · onderdeel van de zone Gezicht & baard',
   zonesEyebrow='Of ga naar de zone',
   zonekaarten=['Trimmen zonder wondjes.', 'Scheren, trimmen en randen zetten.',
                'Tondeuses en hoofdscheerders.', 'Detailwerk zonder trekken.']),

 'collection.type-scheerapparaten.json': dict(
   zone_naam='', kruimel='Scheerapparaten', aantal='7',
   eyebrow='Scheren tot glad',
   kop_1='Scheren tot glad.', kop_2='Roterend of foil.',
   lede='Vier scheerapparaten voor het gezicht, één voor het hoofd, en de twee scheerkoppen die je '
        'later vervangt. Deze categorie valt daarmee in twee zones.',
   zonemelding='artikelen, verdeeld over de zones Gezicht & baard en Hoofd.',
   groepkop='Scheerapparaten', groepsub='Zeven artikelen uit twee zones.',
   noot='<b>Deze categorie valt niet op één zone.</b> De Head Shaver Deluxe hoort bij Hoofd, de andere '
        'vier bij Gezicht & baard, en de twee scheerkoppen zijn onderdelen. Kies hieronder de zone die '
        'bij je vraag past.',
   labels='the-sentinel-pro = Nieuw · met station\nwellshave-scheerapparaat-elite = 26× deze maand\n'
          'wellshave-blade-baron = Compact\nwellshave-5-in-1-scheerapparaat-mannen-deluxe = Voor het hoofd',
   linklabel='Bekijk alle zones', linkurl=C + 'all',
   slottekst='in deze categorie · verdeeld over twee zones',
   zonesEyebrow='Kies de zone die bij je vraag past',
   zonekaarten=['Trimmen zonder wondjes.', 'Scheren, trimmen en randen zetten.',
                'Tondeuses en hoofdscheerders.', 'Detailwerk zonder trekken.']),

 'collection.type-tondeuses.json': dict(
   zone_naam='Hoofd', kruimel='Tondeuses', aantal='3',
   eyebrow='Onderdeel van Hoofd',
   kop_1='Kort houden,', kop_2='met controle over de lengte.',
   lede='Tondeuses met een verstelbare fade-hendel, plus de smalle detailtrimmer voor de rand. '
        'Ze horen bij de zone Hoofd.',
   zonemelding='tondeuses, uit de zone Hoofd.',
   groepkop='Tondeuses', groepsub='Voor wie lengte wil houden en de rand wil zetten.',
   labels='wellshave-tondeuse-elegant = Kapperskwaliteit\ndetailtrimmer-sharpline™ = Voor de lijnen',
   linklabel='Bekijk de hele zone Hoofd', linkurl=C + 'zone-hoofd',
   slottekst='in deze categorie · onderdeel van de zone Hoofd',
   zonesEyebrow='Of ga naar de zone',
   zonekaarten=['Trimmen zonder wondjes.', 'Scheren, trimmen en randen zetten.',
                'Tondeuses en hoofdscheerders.', 'Detailwerk zonder trekken.']),

 'collection.type-safetyrazors.json': dict(
   zone_naam='Gezicht & baard', kruimel='Safety Razors', aantal='3',
   eyebrow='Onderdeel van Gezicht & baard',
   kop_1='Klassiek met een mesje.', kop_2='Geen accu nodig.',
   lede='Twee scheermessen die alleen in kleur verschillen, en de reservemesjes ervoor. '
        'Ze horen bij de zone Gezicht & baard.',
   zonemelding='artikelen, uit de zone Gezicht & baard.',
   groepkop='Safety Razors', groepsub='Scheren met een mesje, zonder batterij of oplader.',
   noot='<b>Gold en Black zijn hetzelfde mes</b> met dezelfde drie onderdelen, voor exact dezelfde '
        'prijs. Kies op kleur.',
   labels='wellshave-safety-razor-gold = Klassiek\nwellshave-safety-razor-black = Zelfde mes, in zwart',
   linklabel='Bekijk de hele zone Gezicht & baard', linkurl=C + 'zone-gezicht',
   slottekst='in deze categorie · onderdeel van de zone Gezicht & baard',
   zonesEyebrow='Of ga naar de zone',
   zonekaarten=['Trimmen zonder wondjes.', 'Scheren, trimmen en randen zetten.',
                'Tondeuses en hoofdscheerders.', 'Detailwerk zonder trekken.']),
}

if __name__ == '__main__':
    import os
    from maak_templates import bouw
    import zd_lichaam
    t = bouw(zd_lichaam.ZONE, hero='shopify://shop_images/ws-ugc-borst.webp')
    json.dump(t, open('theme/collection.zone-lichaam.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=2)
    print('%-38s %6.1f kB' % ('collection.zone-lichaam.json',
                              os.path.getsize('theme/collection.zone-lichaam.json') / 1024))
    for naam, cfg in TYPES.items():
        json.dump(typepagina(cfg), open('theme/' + naam, 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=2)
        print('%-38s %6.1f kB' % (naam, os.path.getsize('theme/' + naam) / 1024))
