# -*- coding: utf-8 -*-
"""Bouwt theme/snippets/ws-voordeel-icoon.liquid + een proefvel (HTML).

Iconen uit Lucide (ISC) plus eigen tekeningen, allemaal omgezet naar paden
met pathLength="1" zodat ze in het koopvak kunnen intekenen.

Gebruik:
  LUCIDE=pad/naar/lucide-static/icons python3 scripts/voordeel-iconen.py \
      theme/snippets/ws-voordeel-icoon.liquid proefvel.html
"""
import re, sys, os, html
L = os.path.join(os.environ.get('LUCIDE', 'lucide'), '')

def num(a, k, d=0.0):
    m = re.search(r'\b%s="([^"]+)"' % k, a); return float(m.group(1)) if m else d
def f(x): s = ('%.3f' % x).rstrip('0').rstrip('.'); return s if s not in ('-0',) else '0'

def rond_rect(x, y, w, h, r):
    if r <= 0: return f"M{f(x)} {f(y)}h{f(w)}v{f(h)}h{f(-w)}z"
    r = min(r, w/2, h/2)
    return (f"M{f(x+r)} {f(y)}h{f(w-2*r)}a{f(r)} {f(r)} 0 0 1 {f(r)} {f(r)}v{f(h-2*r)}"
            f"a{f(r)} {f(r)} 0 0 1 {f(-r)} {f(r)}h{f(-(w-2*r))}a{f(r)} {f(r)} 0 0 1 {f(-r)} {f(-r)}"
            f"v{f(-(h-2*r))}a{f(r)} {f(r)} 0 0 1 {f(r)} {f(-r)}z")
def cirkel(cx, cy, rx, ry=None):
    ry = rx if ry is None else ry
    return f"M{f(cx-rx)} {f(cy)}a{f(rx)} {f(ry)} 0 1 0 {f(2*rx)} 0a{f(rx)} {f(ry)} 0 1 0 {f(-2*rx)} 0"

def lucide(naam):
    s = open(L + naam + '.svg').read()
    s = s[s.index('>', s.index('<svg')) + 1:]
    uit = []
    for tag, a in re.findall(r'<(path|circle|rect|line|polyline|polygon|ellipse)\b([^>]*)/?>', s):
        if tag == 'path': uit.append(re.search(r'\bd="([^"]+)"', a).group(1))
        elif tag == 'circle': uit.append(cirkel(num(a,'cx'), num(a,'cy'), num(a,'r')))
        elif tag == 'ellipse': uit.append(cirkel(num(a,'cx'), num(a,'cy'), num(a,'rx'), num(a,'ry')))
        elif tag == 'rect': uit.append(rond_rect(num(a,'x'), num(a,'y'), num(a,'width'), num(a,'height'), num(a,'rx', num(a,'ry'))))
        elif tag == 'line': uit.append(f"M{f(num(a,'x1'))} {f(num(a,'y1'))}L{f(num(a,'x2'))} {f(num(a,'y2'))}")
        else:
            pts = re.search(r'points="([^"]+)"', a).group(1).split()
            d = 'M' + ' L'.join(p.replace(',', ' ') for p in pts)
            uit.append(d + ('z' if tag == 'polygon' else ''))
    return uit

ICONEN = [
 # sleutel, label, bron
 ('schild', 'Veilig voor je huid', lucide('shield-check')),
 ('veer', 'Pijnloos, zacht', lucide('feather')),
 ('glad', 'Glad resultaat', lucide('sparkles')),
 ('haar', 'Trekt niet aan je haar', ['M7 21c-1.6-2.8 1.6-5.2 0-8s1.6-5.2 0-8', 'M12 21c-1.6-2.8 1.6-5.2 0-8s1.6-5.2 0-8', 'M17 21c-1.6-2.8 1.6-5.2 0-8s1.6-5.2 0-8']),
 ('licht', 'LED-licht', lucide('lightbulb')),
 ('druppel', 'Waterdicht, nat en droog', lucide('droplet')),
 ('douche', 'Onder de douche, afspoelen', lucide('shower-head')),
 ('accu', 'Accu, looptijd', lucide('battery-full')),
 ('opladen', 'Opladen, USB-C', lucide('plug-zap')),
 ('station', 'Oplaad- of reinigingsstation', [rond_rect(9, 2.5, 6, 11.5, 1.5), 'M11 5.5h2', 'M4.5 14h15v4.5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2z', 'M10.5 17.5h3']),
 ('scherm', 'Display, accustand', lucide('monitor')),
 ('klok', 'Snel klaar, tijd', lucide('timer')),
 ('motor', 'Krachtige motor', lucide('gauge')),
 ('knop', 'Eén druk op de knop', lucide('power')),
 ('opzetstukken', 'Opzetstukken, alles in één', lucide('layout-grid')),
 ('kam', 'Lengtes en kammen', [rond_rect(2.5, 5, 19, 4.5, 1.5), 'M5.5 9.5v9', 'M9 9.5v6.5', 'M12.5 9.5v9', 'M16 9.5v6.5', 'M19.5 9.5v9']),
 ('fade', 'Fade, overgang', ['M4 5h16', 'M4 9.5h16', 'M4 14h10.5', 'M4 18.5h5']),
 ('precisie', 'Precisie, strakke lijn', lucide('crosshair')),
 ('draai', 'Beweegt mee, volgt je contouren', lucide('rotate-3d')),
 ('foil', 'Foil shaver, glad afwerken', [rond_rect(4.5, 3, 15, 6.5, 2.2), 'M7.5 5.4h9', 'M7.5 7.1h9', 'M8 9.5l.8 10.2a1.5 1.5 0 0 0 1.5 1.3h3.4a1.5 1.5 0 0 0 1.5-1.3L16 9.5', 'M12 13v2.5']),
 ('mes', 'Mesjes, scherp', [rond_rect(2.5, 7.5, 19, 9, 1.5), 'M8 12h8', 'M5.5 12h.01', 'M18.5 12h.01']),
 ('magneet', 'Magnetische kop', lucide('magnet')),
 ('neustrimmer', 'Neus en oren', [rond_rect(9.5, 2.5, 5, 4, 1.2), 'M10.5 4.5h3', 'M9 6.5h6v13a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 9 19.5z', 'M12 10.5v2.5']),
 ('baard', 'Baard en snor', ['M5 5v5c0 6.1 3.1 11 7 11s7-4.9 7-11V5', 'M5 9.5c1.6 1.4 3.2 2 4.8 2', 'M19 9.5c-1.6 1.4-3.2 2-4.8 2', 'M8.5 13.8c1.3-1.1 2.4-1.1 3.5 0 1.1-1.1 2.2-1.1 3.5 0', 'M10.5 17h3']),
 ('hoofd', 'Hoofd, schedel', ['M8 21v-2.6c0-1.2-.5-2.3-1.3-3.2A7 7 0 1 1 19 10.5l1.7 2.6a.6.6 0 0 1-.3.9l-1.4.5v2a1.5 1.5 0 0 1-1.5 1.5h-2V21', 'M9.6 6.4A4 4 0 0 1 12.5 5']),
 ('lichaam', 'Lichaam', ['M8 3c-1.8.6-3.4 1.4-4.5 2.4.6 2.4 1.5 4.6 2.2 6.6.4 1.2.3 2.6-.2 3.9L5 21h14l-.5-5.1c-.5-1.3-.6-2.7-.2-3.9.7-2 1.6-4.2 2.2-6.6C19.4 4.4 17.8 3.6 16 3c-.9 1.2-2.3 2-4 2s-3.1-.8-4-2z', 'M8.8 11.5c1.1.8 2.2.8 3.2 0 1 .8 2.1.8 3.2 0']),
 ('kapper', 'Barber, zelf knippen', lucide('scissors')),
 ('stil', 'Stil, geruisloos', lucide('volume-x')),
 ('tas', 'Toilettas, compact', lucide('briefcase')),
 ('reis', 'Mee op reis', lucide('luggage')),
 ('doos', 'Complete set', lucide('package')),
 ('cadeau', 'Cadeau', lucide('gift')),
 ('medaille', 'Kwaliteit, gaat lang mee', lucide('award')),
 ('vink', 'Standaard', lucide('circle-check')),
]

def snippet():
    r = ['{%- comment -%}',
         '  Iconen bij de voordelen in het koopvak. Kies er een met de sleutel uit',
         '  het veld icoon van een voordeel (metaobject ws_voordeel). Onbekende of',
         '  lege sleutel = vink.',
         '',
         '  Alles is een <path> met pathLength="1". Daardoor kan de CSS elke lijn',
         '  van 0 naar 1 laten tekenen (stroke-dasharray/-offset), ongeacht hoe lang',
         '  hij echt is: zo tekenen de iconen zichzelf als het koopvak in beeld komt.',
         '  Kleur via currentColor.',
         '',
         '  Een deel van de vormen komt uit Lucide (https://lucide.dev), ISC-licentie,',
         '  copyright Lucide Contributors; cirkels en rechthoeken zijn daarbij naar',
         '  <path> omgezet. De rest is eigen tekenwerk op hetzelfde raster van 24.',
         '',
         '  Sleutels: ' + ', '.join(k for k, _, _ in ICONEN),
         '{%- endcomment -%}',
         '{%- capture paden -%}',
         '{%- case icoon -%}']
    for k, label, ds in ICONEN:
        if k == 'vink': continue
        r.append(f"  {{%- when '{k}' -%}}" + ''.join(f'<path pathLength="1" d="{d}"/>' for d in ds))
    vink = next(ds for k, _, ds in ICONEN if k == 'vink')
    r.append("  {%- else -%}" + ''.join(f'<path pathLength="1" d="{d}"/>' for d in vink))
    r += ['{%- endcase -%}', '{%- endcapture -%}',
          '<svg class="{{ klasse }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{{ paden }}</svg>', '']
    return '\n'.join(r)

def proefvel():
    cel = []
    for k, label, ds in ICONEN:
        p = ''.join(f'<path pathLength="1" d="{d}"/>' for d in ds)
        cel.append(f'<div class="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">{p}</svg><b>{k}</b><span>{html.escape(label)}</span></div>')
    return ('<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#F2EEE7;font-family:Montserrat,Arial,sans-serif;padding:28px}'
            '.g{display:grid;grid-template-columns:repeat(7,1fr);gap:12px}.c{background:#fff;border-radius:12px;padding:18px 10px 14px;text-align:center;box-shadow:0 1px 2px rgba(20,18,15,.06)}'
            'svg{width:30px;height:30px;color:#B0742A;display:block;margin:0 auto 10px}b{display:block;font-size:12px;color:#14120F}span{display:block;font-size:10px;color:rgba(20,18,15,.6);margin-top:3px}</style>'
            '<div class="g">' + ''.join(cel) + '</div>')

if __name__ == '__main__':
    open(sys.argv[1], 'w', encoding='utf-8').write(snippet())
    open(sys.argv[2], 'w', encoding='utf-8').write(proefvel())
    print(len(ICONEN), 'iconen')
