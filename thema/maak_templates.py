# -*- coding: utf-8 -*-
"""Zet een zoneconfig om in een Shopify-collectietemplate voor wellshave/claude-design."""
import json, re, html, urllib.parse

def handle(url):
    if not url or url == '#':
        return ''
    pad = urllib.parse.urlparse(url).path
    h = pad.rstrip('/').split('/')[-1]
    return urllib.parse.unquote(h)

def tekst(s):
    """HTML-entiteiten terug naar tekens; Shopify-instellingen zijn platte tekst."""
    return html.unescape(s or '')

def rijk(s):
    """Alinea's voor een richtext-instelling."""
    if isinstance(s, (list, tuple)):
        return ''.join('<p>%s</p>' % tekst(p) for p in s)
    return '<p>%s</p>' % tekst(s)

MONOGRAM = 'shopify://shop_images/ws-mark.png'

def bouw(z, hero=None, svg=None):
    S, B, orde = {}, {}, []

    # ── blok 1
    vragen, matches, zones = {}, {}, {}
    vorde = []
    for i, v in enumerate(z['vragen'], 1):
        opts = []
        for waarde, label in v['opties']:
            woord = z['woord'].get(v['groep'], {}).get(waarde, '')
            opts.append('%s|%s|%s' % (waarde, tekst(label), tekst(woord)))
        vragen['vraag_%d' % i] = {'type': 'vraag', 'settings': {
            'groep': v['groep'], 'vraag': tekst(v['vraag']),
            'opties': '\n'.join(opts), 'start': v['start']}}
        vorde.append('vraag_%d' % i)
    for i, m in enumerate(z['matches'], 1):
        vragen['match_%d' % i] = {'type': 'match', 'settings': {
            'id': m['id'], 'product': handle(m['url']), 'naam': tekst(m['naam']),
            'badge': tekst(m['badge']), 'zin': tekst(m['zin']),
            'reden_1': tekst(m['redenen'][0]), 'reden_2': tekst(m['redenen'][1]),
            'reden_3': tekst(m['redenen'][2])}}
        vorde.append('match_%d' % i)
    for i, (naam, aantal, url) in enumerate(z['tellingen'], 1):
        vragen['zone_%d' % i] = {'type': 'zone', 'settings': {
            'naam': tekst(naam), 'aantal': aantal,
            'url': url if url != '#' else '',
            'huidig': tekst(naam) == tekst(z['zonenaam'])}}
        vorde.append('zone_%d' % i)

    heel = int(z['zonescore'])
    S['kop'] = {'type': 'ws-collectie-kop', 'blocks': vragen, 'block_order': vorde, 'settings': {
        'eyebrow': tekst(z['eyebrow']),
        'kop_1': tekst(z['h1a']), 'kop_2': tekst(z['h1b']),
        'lede': tekst(z['lede']),
        'foto': hero or '',
        'foto_alt': tekst(z['heroalt']),
        'monogram_letter': 'S',
        'score': tekst(z['zonescoretekst']),
        'sterren': heel, 'halve_ster': (z['zonescore'] - heel) >= 0.25,
        'score_bron': tekst(z['zonescorebron']),
        'quote': tekst(z['quote']), 'quote_bron': tekst(z['quotebron']),
        'gerust_1': tekst(z['geruststellers'][0][1]),
        'gerust_2': tekst(z['geruststellers'][1][1]),
        'gerust_3': tekst(z['geruststellers'][2][1]),
        'kaartkop': tekst(z['kaartkop']), 'kaartsub': tekst(z['kaartsub']),
        'kaartvraag': tekst(z['kaartvraag']),
        'tabel': '\n'.join(
            '%s > %s' % (', '.join('%s=%s' % kv for kv in r['w'].items()), r['id'])
            for r in z['tabel']),
        'standaard': z['standaardmatch'],
        'kruimel': tekst(z['zonenaam']), 'zone_aantal': z['aantal'],
        'zonemelding': tekst(z['zoneslot']),
        'desk_indent_top': 0, 'desk_indent_bottom': 0,
        'mob_indent_top': 0, 'mob_indent_bottom': 0}}
    orde.append('kop')

    # ── blok 2
    groepen, gorde = {}, []
    for i, g in enumerate(z['groepen'], 1):
        labels = []
        for p in g['items']:
            if p.get('tag') and not p.get('uitverkocht'):
                labels.append('%s = %s' % (handle(p['url']), tekst(p['tag'])))
        groepen['groep_%d' % i] = {'type': 'groep', 'settings': {
            'kop': tekst(g['kop']), 'sub': tekst(g['sub']), 'cat': g['cat'],
            'producten': [handle(p['url']) for p in g['items']],
            'noot': tekst(g.get('noot', '')),
            'kicker': 'Onderdeel' if g['cat'] == 'mes' else '',
            'labels': '\n'.join(labels),
            'link_label': tekst(g['link'][0]) if g.get('link') else '',
            'link_url': g['link'][1] if g.get('link') else ''}}
        gorde.append('groep_%d' % i)

    a = z.get('aanbod') or {}
    S['raster'] = {'type': 'ws-collectie-raster', 'blocks': groepen, 'block_order': gorde, 'settings': {
        'filter_alles': 'Alles', 'filter_app': tekst(z['filters'][1][1]),
        'filter_bundel': tekst(z['filters'][2][1]) if len(z['filters']) > 2 else 'Sets',
        'filter_mes': tekst(z['filters'][3][1]) if len(z['filters']) > 3 else 'Onderdelen',
        'vergelijken': z.get('vergelijken', True),
        'sorteer_label': 'Meest relevant',
        'keuzeregel': 'Afgestemd op jouw keuzes:',
        'keuzeregel_start': tekst(z['startregel']),
        'wis_label': 'Wis keuzes',
        'monogram': MONOGRAM,
        'geen_score': 'Nieuw · nog geen beoordelingen',
        'uitverkocht_label': 'Tijdelijk uitverkocht',
        'uitverkocht_voet': 'Tijdelijk niet leverbaar',
        'blik_voet': '100 dagen proberen · 2 jaar garantie',
        'mes_voet': 'Vandaag besteld, morgen in huis',
        'aanbod_product': handle(a.get('url', '')) if a else '',
        'aanbod_eyebrow': tekst(a.get('eyebrow', '')),
        'aanbod_zin': tekst(a.get('zin', '')),
        'aanbod_knop': tekst(a.get('knop', 'Bekijk de set')),
        'slot_tekst': 'in deze zone · elk apparaat 100 dagen te proberen',
        'slot_link_label': 'Bekijk de hele collectie',
        'slot_link': 'shopify://collections/all',
        'desk_indent_top': 0, 'desk_indent_bottom': 0,
        'mob_indent_top': 0, 'mob_indent_bottom': 0}}
    orde.append('raster')

    # ── blok 3
    c = z['categorie']
    ub, uorde = {}, []
    for i, (naam, url, t) in enumerate(c['lijst'], 1):
        h = handle(url)
        eigen = '' if '/products/' in url else url
        ub['item_%d' % i] = {'type': 'item', 'settings': {
            'product': h if '/products/' in url else '',
            'naam': tekst(naam), 'url': eigen, 'tekst': tekst(t)}}
        uorde.append('item_%d' % i)
    for i, (kop, t) in enumerate(c['tips'], 1):
        ub['tip_%d' % i] = {'type': 'tip', 'settings': {'kop': tekst(kop), 'tekst': tekst(t)}}
        uorde.append('tip_%d' % i)
    S['uitleg'] = {'type': 'ws-collectie-uitleg', 'blocks': ub, 'block_order': uorde, 'settings': {
        'eyebrow': 'Over deze categorie',
        'h2_1': tekst(c['h2a']), 'h2_2': tekst(c['h2b']),
        'inleiding': rijk(c['alineas']),
        'h3_lijst': tekst(c['h3lijst']),
        'slotalinea': rijk(c['slotalinea']),
        'tekening': svg or c['svg'],
        'bijschrift': tekst(c['bijschrift']),
        'h3_tips': tekst(c['h3tips']),
        'desk_indent_top': 0, 'desk_indent_bottom': 0,
        'mob_indent_top': 0, 'mob_indent_bottom': 0}}
    orde.append('uitleg')

    # ── blok 4
    bb, borde = {}, []
    for i, b in enumerate(z['bewijs'], 1):
        bb['citaat_%d' % i] = {'type': 'citaat', 'settings': {
            'product': handle(b['url']) if '/products/' in b['url'] else '',
            'url': '' if '/products/' in b['url'] else b['url'],
            'tag': tekst(b['tag']), 'tekst': tekst(b['tekst']),
            'naam': tekst(b['naam']), 'product_naam': tekst(b['product']),
            'toon_score': bool(b.get('score')),
            'bijschrift': tekst(b.get('bijschrift', ''))}}
        borde.append('citaat_%d' % i)
    S['bewijs'] = {'type': 'ws-collectie-bewijs', 'blocks': bb, 'block_order': borde, 'settings': {
        'eyebrow': 'Uit de beoordelingen',
        'kop': tekst(z['bewijskop']),
        'bron': rijk(z['bewijsbron']),
        'koper_label': 'geverifieerde koper',
        'desk_indent_top': 0, 'desk_indent_bottom': 0,
        'mob_indent_top': 0, 'mob_indent_bottom': 0}}
    orde.append('bewijs')

    # ── blok 5
    sb, sorde = {}, []
    iconen = ['retour', 'schild', 'truck', 'klok']
    for i, (_, kop, t) in enumerate(z['zekerheden'], 1):
        sb['zeker_%d' % i] = {'type': 'zekerheid', 'settings': {
            'icoon': iconen[i - 1], 'kop': tekst(kop), 'tekst': tekst(t)}}
        sorde.append('zeker_%d' % i)
    for i, (v, an) in enumerate(z['faq'], 1):
        sb['vraag_%d' % i] = {'type': 'vraag', 'settings': {
            'vraag': tekst(v), 'antwoord': rijk(an)}}
        sorde.append('vraag_%d' % i)
    for i, (naam, t, slot, url) in enumerate(z['anderezones'], 1):
        sb['zone_%d' % i] = {'type': 'zone', 'settings': {
            'naam': tekst(naam), 'tekst': tekst(t), 'slot': tekst(slot),
            'url': url if url != '#' else ''}}
        sorde.append('zone_%d' % i)
    S['slot'] = {'type': 'ws-collectie-slot', 'blocks': sb, 'block_order': sorde, 'settings': {
        'eyebrow': tekst(z['faqkop']),
        'h2_1': tekst(z['faqh2a']), 'h2_2': tekst(z['faqh2b']),
        'mail_regel': '<p>Staat je vraag er niet bij? Mail <b>contact@wellshave.com</b> — je krijgt '
                      'antwoord van iemand uit het team, binnen één werkdag.</p>',
        'zones_eyebrow': 'Andere plek in gedachten?',
        'desk_indent_top': 0, 'desk_indent_bottom': 0,
        'mob_indent_top': 0, 'mob_indent_bottom': 0}}
    orde.append('slot')

    return {'sections': S, 'order': orde}


if __name__ == '__main__':
    import zd_hoofd, zd_neus, zd_gezicht, zd_alles
    opdrachten = [
        ('collection.zone-hoofd.json',  zd_hoofd.ZONE,  'shopify://shop_images/ws-ugc-hoofd.webp'),
        ('collection.zone-neus.json',   zd_neus.ZONE,   'shopify://shop_images/ws-use-neustrimmer.jpg'),
        ('collection.zone-gezicht.json', zd_gezicht.ZONE, ''),
        ('collection.overzicht.json',   zd_alles.ZONE,  ''),
    ]
    for naam, z, hero in opdrachten:
        t = bouw(z, hero=hero)
        pad = 'theme/' + naam
        json.dump(t, open(pad, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        n = sum(len(s.get('blocks', {})) for s in t['sections'].values())
        import os
        print('%-32s %6.1f kB  %d secties, %d blokken' % (naam, os.path.getsize(pad)/1024, len(t['sections']), n))
