# -*- coding: utf-8 -*-
"""Bouwt een collectiepagina-artifact per zone uit de gedeelde onderdelen."""
import json, re, io, base64, os

B = 'build/'
PIJL = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'
VINK = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
VINK2 = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.2 5.2L20 6.9"/></svg>'
OOG = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/></svg>'
DOOS = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-4 9 4v8l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v8"/></svg>'
TRUCK = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>'
RETOUR = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v4h-4"/></svg>'
SCHILD = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/></svg>'
SCHILDV = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="M9.2 12.2l2 2 3.6-3.8"/></svg>'
KLOK = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>'
WEEG = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M7 20h10M5 8h14M5 8l-3 6h6zM19 8l3 6h-6z"/></svg>'
PLUS = '<svg viewBox="0 0 24 24" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'

W = 'https://wellshave.com'
VERGELIJKEN = True


def eu(x):
    return '&euro;' + ('%.2f' % x).replace('.', ',')


def sterren(score, klasse='sterren5'):
    heel = int(score)
    half = (score - heel) >= 0.25
    s = '<i></i>' * heel
    if half: s += '<i class="half"></i>'
    s += '<i class="leeg"></i>' * (5 - heel - (1 if half else 0))
    return '<span class="%s">%s</span>' % (klasse, s)


def sterrenrij(score):
    heel = int(score)
    half = (score - heel) >= 0.25
    uit = '<i><span></span></i>' * heel
    if half: uit += '<i class="half"><span></span></i>'
    uit += '<i class="leeg"><span></span></i>' * (5 - heel - (1 if half else 0))
    return uit


def score_span(p):
    if not p.get('score'):
        if 'geenscore' not in p and 'score' not in p:
            return ''
        return '<span class="wsk-score leeg">%s</span>' % p.get('geenscore', 'Nieuw &middot; nog geen beoordelingen')
    return '<span class="wsk-score">%s<b>%s</b> (%s)</span>' % (
        sterren(p['score']), ('%.1f' % p['score']).replace('.', ','), p['aantal'])


def prijsblok(p):
    uit = '<span class="wsk-prijs"><b>%s</b>' % eu(p['prijs'])
    if p.get('van') and p['van'] > p['prijs']:
        uit += ' <s>%s</s>' % eu(p['van'])
    uit += '</span>'
    if p.get('van') and p['van'] > p['prijs']:
        uit += '<span class="wsk-save">Bespaar %s</span>' % eu(p['van'] - p['prijs'])
    return uit


def kaart(p, soort='app'):
    """soort: app | bundel | mes"""
    tag = ''
    if p.get('tag'):
        tag = '<span class="wsk-tag%s">%s</span>' % (' zacht' if soort == 'app' else '', p['tag'])
    extra = ''
    if soort == 'app':
        blik = ''.join('<li>%s<span>%s</span></li>' % (VINK2, r) for r in p['redenen'][:3])
        vgl = ('<label class="wsk-vgl"><input type="checkbox" data-naam="%s"><span>Vergelijk</span></label>'
               % re.sub('<[^>]+>', '', p['naam']).replace('&trade;', '')) if VERGELIJKEN else ''
        extra = (vgl +
                 '<button class="wsk-oog" title="Snel bekijken">%s</button>'
                 '<span class="wsk-blik"><b>Snel bekijken</b><ul>%s</ul>'
                 '<span style="font-size:12px;color:var(--ink-60)">100 dagen proberen &middot; 2 jaar garantie</span></span>'
                 ) % (OOG, blik)

    body = '<span class="wsk-naam">%s</span><span class="wsk-wat">%s</span>' % (p['naam'], p['wat'])
    if soort == 'mes':
        body = '<span class="wsk-kicker">%s</span>' % p.get('kicker', 'Onderdeel') + body
    if soort == 'app':
        chips = ''.join('<i>%s</i>' % c for c in p.get('chips', [])[:2])
        body += score_span(p) + ('<span class="wsk-chips">%s</span>' % chips if chips else '')
    if soort == 'bundel':
        body += '<span class="wsk-onderdelen">%s<span>%s onderdelen in de doos</span></span>' % (DOOS, p['doos'])
    body += prijsblok(p)

    cta_tekst = {'app': 'Bekijk product', 'bundel': 'Bekijk bundel', 'mes': 'Bekijk'}[soort]
    if soort == 'mes':
        body += ('<span class="wsk-rij"><a class="wsk-cta" href="%s">%s%s</a>'
                 '<button class="wsk-plus snel" title="Direct in de winkelwagen">%s</button></span>'
                 '<span class="wsk-voet">%s<span>%s</span></span>'
                 ) % (p['url'], cta_tekst, PIJL, PLUS, TRUCK, p.get('voet', 'Vandaag besteld, morgen in huis'))
    else:
        body += '<a class="wsk-cta" href="%s">%s%s</a>' % (p['url'], cta_tekst, PIJL)
        if p.get('voet'):
            body += '<span class="wsk-voet">%s<span>%s</span></span>' % (TRUCK, p['voet'])

    return ('<article class="wsk%s" data-id="%s"><span class="wsk-shot">'
            '<span class="wsk-mark"></span>'
            '<img class="wsk-pack" src="{{IMG:%s}}" alt="%s">%s%s</span>'
            '<span class="wsk-body">%s</span></article>'
            ) % (' op' if p.get('uitverkocht') else '', p.get('id', ''), p['img'],
                 re.sub('<[^>]+>', '', p['naam']).replace('&trade;', '').replace('&amp;', 'en'),
                 tag, extra, body)


def groep(g):
    kop = '<div class="groep-kop"><div><h2>%s</h2><p>%s</p></div>%s</div>' % (
        g['kop'], g['sub'],
        '<button class="groep-link vgl-open">Bekijk vergelijking%s</button>' % PIJL if g.get('vergelijk')
        else ('<a class="groep-link" href="%s">%s%s</a>' % (g['link'][1], g['link'][0], PIJL) if g.get('link') else ''))
    if g.get('noot'):
        kop += '<p class="groep-noot">%s</p>' % g['noot']
    kaarten = ''.join(kaart(p, g['soort']) for p in g['items'])
    return '<div class="groep" data-cat="%s">%s<div class="kaarten">%s</div>%s</div>' % (
        g['cat'], kop, kaarten, (g.get('na') or ''))


def vergelijker(items):
    kaarten = ''
    for p in items:
        rijen = ''.join('<dt>%s</dt><dd%s>%s</dd>' % (k, ' class="nee"' if k.startswith('Wat hij niet') else '', v)
                        for k, v in p['vgl'])
        sc = ('<span class="score"><span class="ster"></span>%s <em>(%s)</em></span>'
              % (('%.1f' % p['score']).replace('.', ','), p['aantal'])) if p.get('score') else \
             '<span class="score">Nog geen beoordelingen</span>'
        pr = '<p class="vgl-prijs"><b>%s</b>%s</p>' % (
            eu(p['prijs']), ' <s>%s</s>' % eu(p['van']) if p.get('van') and p['van'] > p['prijs'] else '')
        kaarten += ('<article class="vgl" data-id="%s"><div class="vgl-beeld">'
                    '<img src="{{IMG:%s}}" alt="%s"></div><div class="vgl-body"><h3>%s</h3>%s%s<dl>%s</dl>'
                    '</div></article>') % (p['id'], p['img'],
                                           re.sub('<[^>]+>', '', p['naam']).replace('&trade;', ''),
                                           p['naam'], sc, pr, rijen)
    return ('<div class="vgl-balk"><div class="vb-tekst"><span class="vb-ico">%s</span>'
            '<span><b>Twijfel tussen twee modellen?</b>'
            '<span>Vink &lsquo;Vergelijk&rsquo; aan op maximaal drie kaarten.</span></span></div>'
            '<button class="vgl-knop vgl-open">Open vergelijker</button></div>'
            '<div class="vgl-uit"><button class="vgl-sluit">'
            '<svg viewBox="0 0 24 24" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
            '<span>Sluit de vergelijking</span></button><div class="vergelijk">%s</div></div>') % (WEEG, kaarten)


def matchpaneel(m):
    chips = ''.join('<span>%s%s</span>' % (VINK, c) for c in m['redenen'][:3])
    return ('<div class="matchpaneel" data-id="%s"><div class="mp-kop"><b>Jouw match</b>'
            '<span class="mp-badge">%s</span></div><div class="mp-body">'
            '<img src="{{IMG:%s}}" alt="%s"><div class="mp-info"><h3>%s</h3><p>%s</p>'
            '<p class="mp-waarom">Waarom deze match</p><div class="mp-chips">%s</div></div>'
            '<div class="mp-koop"><span class="mp-prijs">%s%s</span>'
            '<a class="mp-knop" href="%s">Bekijk jouw match<i>%s</i></a>'
            '<span class="mp-voorraad">%s</span></div></div></div>'
            ) % (m['id'], m['badge'], m['img'],
                 re.sub('<[^>]+>', '', m['naam']).replace('&trade;', ''), m['naam'], m['zin'], chips,
                 eu(m['prijs']), '<s>%s</s>' % eu(m['van']) if m.get('van') and m['van'] > m['prijs'] else '',
                 m['url'], PIJL, m.get('voorraad', 'Op voorraad &middot; morgen in huis'))


def vraagrij(i, v):
    knoppen = ''.join('<button class="keuze" data-v="%s"%s>%s</button>'
                      % (k, ' aria-pressed="true"' if k == v['start'] else '', t)
                      for k, t in v['opties'])
    return ('<div class="vraagrij"><span class="stapbol">%02d</span><p>%s</p>'
            '<div class="keuzes" data-groep="%s">%s</div></div>') % (i, v['vraag'], v['groep'], knoppen)


def zonebalk(z, tellingen):
    knoppen = ''
    for naam, aantal, href in tellingen:
        hier = naam == z['zonenaam']
        knoppen += ('<button class="zone"%s data-zone="%s" data-app="%s">%s <span>%s</span></button>'
                    % (' aria-current="true"' if hier else '', naam, aantal, naam, aantal))
    return ('<section class="zonebalk"><div class="rail">'
            '<p class="kruimel">Home <span>/</span> <b>%s</b></p>'
            '<div class="zones" role="tablist">%s</div>'
            '<p class="zonemelding">Je bekijkt <b class="zn">%s</b> &mdash; <b class="za">%s</b> apparaten, %s</p>'
            '</div></section>') % (z['zonenaam'], knoppen, z['zonenaam'], z['aantal'], z['zoneslot'])


def b1(z):
    ger = ''.join('<div>%s%s</div>' % (i, t) for i, t in z['geruststellers'])
    vragen = ''.join(vraagrij(i + 1, v) for i, v in enumerate(z['vragen']))
    panelen = ''.join(matchpaneel(m) for m in z['matches'])
    return ('<template data-tpl="b1"><div class="w"><section class="kop">'
            '<span class="kop-merk" aria-hidden="true">S</span><div class="rail kop-grid">'
            '<div class="kop-copy"><p class="eyebrow on-dark">%s</p>'
            '<h1 class="duo on-dark klein">%s<span class="b">%s</span></h1>'
            '<p class="lead on-dark kort">%s</p>'
            '<figure class="kop-foto"><img src="{{IMG:hero}}" alt="%s"></figure>'
            '<div class="proefkaart"><div class="pk-score">'
            '<div class="sterrenrij" aria-hidden="true">%s</div><b>%s <em>%s</em></b></div>'
            '<div class="pk-quote"><span class="pk-vink">%s</span><div><p>&ldquo;%s&rdquo;</p>'
            '<span>%s</span></div></div></div>'
            '<div class="gerustrij">%s</div></div>'
            '<div class="kiescard"><div class="kaartkop"><p class="eyebrow">%s</p><span>%s</span></div>'
            '<h2>%s</h2><div class="stappen-lijst">%s</div>%s</div>'
            '</div></section>%s</div></template>'
            ) % (z['eyebrow'], z['h1a'], z['h1b'], z['lede'], z['heroalt'],
                 sterrenrij(z['zonescore']),
                 z['zonescoretekst'], z['zonescorebron'], VINK, z['quote'], z['quotebron'], ger,
                 z['kaartkop'], z['kaartsub'], z['kaartvraag'], vragen, panelen,
                 zonebalk(z, z['tellingen']))


def b2(z):
    filters = ''.join('<button class="filter" data-cat="%s"%s>%s <span>%s</span></button>'
                      % (c, ' aria-pressed="true"' if c == 'alles' else '', t, n)
                      for c, t, n in z['filters'])
    groepen = ''.join(groep(g) for g in z['groepen'])
    aanbod = ''
    if z.get('aanbod'):
        a = z['aanbod']
        aanbod = ('<aside class="aanbod"><img src="{{IMG:%s}}" alt="%s"><div class="aanbod-tekst">'
                  '<p class="eyebrow">%s</p><h3>%s</h3><p>%s</p></div>'
                  '<div class="aanbod-koop"><span class="aanbod-prijs">%s%s</span>'
                  '<a class="tekstlink" href="%s">%s</a></div></aside>'
                  ) % (a['img'], re.sub('<[^>]+>', '', a['naam']).replace('&trade;', ''),
                       a['eyebrow'], a['naam'], a['zin'], eu(a['prijs']),
                       ' <s>%s</s>' % eu(a['van']) if a.get('van') else '', a['url'], a['knop'])
    return ('<template data-tpl="b2"><div class="w">'
            '<section class="sectie zand" id="raster" style="padding-top:28px"><div class="rail">'
            '<div class="filterbalk"><div class="fb-rij"><div class="filters" data-groep="cat">%s</div>'
            '<div class="fb-acties">%s'
            '<button class="fb-knop">Meest relevant'
            '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
            '</button></div></div>'
            '<p class="fb-keuzes">Afgestemd op jouw keuzes: <b class="keuzeregel">%s</b>'
            '<button class="fb-wis">Wis keuzes</button></p></div>'
            '%s%s<div class="rasterslot"><span><b class="telling">%s artikelen</b> in deze zone &middot; '
            'elk apparaat 100 dagen te proberen</span>'
            '<a class="tekstlink" href="%s/collections/all">Bekijk de hele collectie &mdash; 28 apparaten</a>'
            '</div></div></section></div></template>'
            ) % (filters,
                 '<button class="fb-knop vgl-open" disabled>%sVergelijk<span class="vgl-tel"></span></button>'
                 % WEEG if VERGELIJKEN else '',
                 z['startregel'], groepen, aanbod, z['totaal'], W)


def b3(z):
    c = z['categorie']
    lijst = ''.join('<li><a href="%s">%s</a><span>%s</span></li>' % (u, n, t) for n, u, t in c['lijst'])
    tips = ''.join('<li class="stapkort"><b>%s</b><span>%s</span></li>' % (k, v) for k, v in c['tips'])
    alinea = ''.join('<p>%s</p>' % p for p in c['alineas'])
    return ('<template data-tpl="b3"><div class="w">'
            '<section class="sectie zand" id="over-deze-categorie" aria-labelledby="cat-kop"><div class="rail">'
            '<div class="cat"><div class="cat-tekst"><p class="eyebrow">Over deze categorie</p>'
            '<h2 class="duo" id="cat-kop">%s <span class="b">%s</span></h2>%s'
            '<h3>%s</h3><ul class="cat-lijst">%s</ul><p>%s</p></div>'
            '<figure class="mech-plaat">%s<figcaption>%s</figcaption></figure></div>'
            '<h3 class="cat-h3-breed">%s</h3><ol class="stappenrij">%s</ol>'
            '</div></section></div></template>'
            ) % (c['h2a'], c['h2b'], alinea, c['h3lijst'], lijst, c['slotalinea'],
                 c['svg'], c['bijschrift'], c['h3tips'], tips)


def b4(z):
    rijen = ''
    for b in z['bewijs']:
        bron = '<b>%s</b><span>geverifieerde koper</span><a href="%s">%s</a>' % (b['naam'], b['url'], b['product'])
        if b.get('score'):
            bron += '<span class="wsk-score">%s<b>%s</b> (%s)</span>' % (
                sterren(b['score']), ('%.1f' % b['score']).replace('.', ','), b['aantal'])
        else:
            bron += '<span class="bwr-vanaf">%s</span>' % b.get('bijschrift', '')
        rijen += ('<blockquote class="bwr"><img src="{{IMG:%s}}" alt="%s"><div class="bwr-tekst">'
                  '<p class="bwr-tag">%s</p><p>&ldquo;%s&rdquo;</p></div>'
                  '<footer class="bwr-bron">%s</footer></blockquote>'
                  ) % (b['img'], re.sub('<[^>]+>', '', b['product']).replace('&trade;', ''),
                       b['tag'], b['tekst'], bron)
    return ('<template data-tpl="b4"><div class="w"><section class="sectie wit"><div class="rail">'
            '<div class="bewijs-kop"><div><p class="eyebrow">Uit de beoordelingen</p>'
            '<h2 class="bewijs-h2">%s</h2></div><p class="bewijs-bron">%s</p></div>'
            '<div class="bewijsrijen">%s</div></div></section></div></template>'
            ) % (z['bewijskop'], z['bewijsbron'], rijen)


def b5(z):
    zeker = ''.join('<div><span class="zeker-ico">%s</span><div class="zeker-tekst"><b>%s</b>'
                    '<span>%s</span></div></div>' % (i, k, v) for i, k, v in z['zekerheden'])
    vragen = ''.join('<div class="vitem%s"><button class="vknop">%s%s</button>'
                     '<div class="vantwoord">%s</div></div>'
                     % (' open' if i == 0 else '', v, PLUS, a)
                     for i, (v, a) in enumerate(z['faq']))
    andere = ''.join('<a class="zk" href="%s"><b>%s</b><span>%s</span><em>%s</em></a>' % (u, n, t, e)
                     for n, t, e, u in z['anderezones'])
    return ('<template data-tpl="b5"><div class="w"><section class="sectie donker"><div class="rail">'
            '<div class="zekerstrook">%s</div>'
            '<div class="slotfaq"><div><p class="eyebrow on-dark">%s</p>'
            '<h2 class="duo on-dark" style="font-size:clamp(24px,2.3cqw,34px);margin:8px 0 12px">'
            '%s<span class="b">%s</span></h2>'
            '<p class="lead on-dark" style="font-size:14px">Staat je vraag er niet bij? Mail '
            '<b>contact@wellshave.com</b> &mdash; je krijgt antwoord van iemand uit het team, binnen '
            '&eacute;&eacute;n werkdag.</p></div><div class="vraaglijst">%s</div></div>'
            '<div style="margin-top:40px;padding-top:30px;border-top:1px solid rgba(255,255,255,.12)">'
            '<p class="eyebrow on-dark">Andere plek in gedachten?</p>'
            '<div class="zonekaarten" style="margin:16px 0 0">%s</div></div>'
            '</div></section></div></template>') % (zeker, z['faqkop'], z['faqh2a'], z['faqh2b'], vragen, andere)


EXTRA_CSS = """<style>
.w .sterren5 i.leeg{opacity:.17}
.w .sterrenrij i.leeg{background:rgba(255,255,255,.2)}
.w .sterrenrij i.leeg span{background:#191816}
.w .wsk.op .wsk-pack{filter:grayscale(.55);opacity:.68}
.w .wsk.op .wsk-cta{opacity:.55;pointer-events:none}
.w .wsk-tag.op{background:rgba(17,17,17,.72);color:#fff}
.w .wsk-mark{aspect-ratio:1;background:url("{{IMG:mark}}") center/contain no-repeat}
.w a.groep-link{text-decoration:none}
.w .groep-noot{font-size:12.5px;line-height:1.6;color:var(--ink-60);max-width:74ch;
  margin:-12px 0 20px;padding-left:13px;border-left:2px solid var(--bronze)}
.w .groep-noot b{color:var(--ink);font-weight:700}
.w .pk-score{flex:0 1 auto;max-width:50%}
.w .pk-score b{white-space:normal}
.w .pk-score b em{display:block;margin-top:3px}
@container (max-width:760px){.w .pk-score{max-width:none}}
</style>"""


def js(z):
    """De gedeelde scriptlaag, met de keuzetabel van deze zone erin."""
    bron = open(B + 'part10.html', encoding='utf-8').read()
    tabel = json.dumps(z['tabel'], ensure_ascii=False)
    woord = json.dumps(z['woord'], ensure_ascii=False)
    standaard = json.dumps(z['standaardmatch'])
    oud_start = bron.index('  var MATCH={')
    oud_eind = bron.index('  /* ── blok 2: het raster ── */')
    nieuw = """  var TABEL=%s, WOORD=%s, STANDAARD=%s;

  /* ── blok 1: de keuzehulp ── */
  function kies(root){
    if(!root.querySelector('.keuzes')) return;
    var nu={};
    root.querySelectorAll('.keuzes').forEach(function(rij){
      var b=rij.querySelector('.keuze[aria-pressed="true"]');
      if(b) nu[rij.dataset.groep]=b.dataset.v;
    });
    var id=STANDAARD;
    for(var i=0;i<TABEL.length;i++){
      var r=TABEL[i], raak=true;
      for(var k in r.w){ if(r.w[k]!=='*' && nu[k]!==r.w[k]){ raak=false; break; } }
      if(raak){ id=r.id; break; }
    }
    root.querySelectorAll('.matchpaneel').forEach(function(k){k.classList.toggle('aan',k.dataset.id===id)});
    var woorden=[];
    for(var g in nu){ if(WOORD[g] && WOORD[g][nu[g]]) woorden.push(WOORD[g][nu[g]]); }
    document.dispatchEvent(new CustomEvent('ws:keuze',{detail:{id:id,regel:woorden.join(' \\u00b7 ')}}));
  }

""" % (tabel, woord, standaard)
    return EXTRA_CSS + bron[:oud_start] + nieuw + bron[oud_eind:]


def blokken(z):
    uit = ''
    for nr, (titel, note) in enumerate(z['bloknotities'], 1):
        uit += ('<section class="blok" data-tpl="b%d"><div class="blok-h"><h2>Blok %d &mdash; %s</h2>'
                '<span>Ontwerp &mdash; nog niets live</span></div>'
                '<p class="blok-note">%s</p></section>') % (nr, nr, titel, note)
    return uit


def bouw(z, naam):
    global VERGELIJKEN
    VERGELIJKEN = z.get('vergelijken', True)
    delen = [open(B + p, encoding='utf-8').read() for p in
             ('part1.html', 'part2.html', 'part3.html', 'part3b.html', 'part3c.html')]
    doc = ''.join(delen)
    doc = doc.replace('<title>De collectiepagina</title>', '<title>%s</title>' % z['titel'], 1)

    audit = ''.join('<li><b>%s</b><span>%s</span></li>' % (k, v) for k, v in z['audit'])
    open_vragen = ''.join('<li>%s</li>' % v for v in z['openvragen'])
    shell = ('<div class="shell"><div class="lede"><p class="kicker">%s</p><h1>%s</h1>'
             '<p class="sub">%s</p></div>'
             '<div class="audit"><h2>%s</h2><p class="intro">%s</p><ol>%s</ol></div>'
             '%s<footer><p><b>Nog niets hiervan staat live.</b> Dit is de ontwerpversie van de '
             'collectiepagina voor deze zone, gebouwd op hetzelfde sjabloon als de bodygroomerpagina. '
             'Wat in de bouw uit Shopify moet komen in plaats van vast te staan: voorraad, '
             'beoordelingen, verkoopaantallen en de sorteervolgorde.</p>'
             '<p><b>Wat eerst een besluit vraagt:</b></p><ul>%s</ul>'
             '<p>Bronnen: de Admin API voor prijzen, voorraad, productstatus, '
             '<code>custom.included_box</code> en de Loox-metavelden, en de beoordelingsteksten '
             'letterlijk uit het <code>loox.reviews</code>-veld van de betreffende producten.</p>'
             '</footer></div>') % (z['kicker'], z['h1'], z['sub'], z['auditkop'], z['auditintro'],
                                   audit, blokken(z), open_vragen)

    doc += shell + b1(z) + b2(z) + b3(z) + b4(z) + b5(z) + js(z)

    imgs = json.load(open('img/imgs-%s.json' % naam, encoding='utf-8'))
    ontbreekt = set(re.findall(r'\{\{IMG:([a-z0-9_]+)\}\}', doc)) - set(imgs)
    if ontbreekt:
        raise SystemExit('ontbrekende afbeeldingen in %s: %s' % (naam, sorted(ontbreekt)))
    doc = re.sub(r'\{\{IMG:([a-z0-9_]+)\}\}', lambda m: imgs[m.group(1)], doc)
    pad = 'collectie-%s.html' % naam
    open(pad, 'w', encoding='utf-8').write(doc)
    print('%-9s %7.2f MB  %s' % (naam, len(doc.encode()) / 1048576, pad))
    return pad
