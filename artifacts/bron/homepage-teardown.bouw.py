import json, html
SC='/tmp/claude-0/-home-user-design/0e25b6a7-7bd5-5ff3-a896-b7a39de57caa/scratchpad'
t=open(f'{SC}/teardown.template.html',encoding='utf-8').read()
img=json.load(open(f'{SC}/img/beelden.json'))
namen={'header':'menu','ws_hero':'Hero','ws_bundels':'Sets','ws_bestsellers':'Bestsellers','ws_belofte':'Belofte',
 'ws_tijdlijn':'Tijdlijn','ws_zonekiezer':'Zonekiezer','ws_familie':'Familie','ws_garantie':'Garantie + vragen',
 'ws_afsluiter':'Afsluiter','footer':'Footer'}
def strook(data, x, w, top, H, avg, fold, labels):
    tot=data['total']; s=H/tot; out=[]
    blokken=[o for o in data['out'] if o['h'] and o['naam']!='announcement']
    for i,o in enumerate(blokken):
        y=top+o['top']*s; h=o['h']*s
        if o['naam']=='header': y=top; h=(o['top']+o['h'])*s
        fill='var(--band-a)' if i%2==0 else 'var(--band-b)'
        out.append(f'<rect x="{x}" y="{y:.1f}" width="{w}" height="{h:.1f}" style="fill:{fill}"/>')
        if labels and o['naam']!='header':
            out.append(f'<text x="{x+w+10}" y="{y+h/2+4:.1f}" style="fill:var(--ink-2)" font-size="11.5" font-family="Montserrat,sans-serif">{html.escape(namen.get(o["naam"],o["naam"]))}</text>')
    ya=top+avg*H
    out.append(f'<rect x="{x}" y="{ya:.1f}" width="{w}" height="{top+H-ya:.1f}" style="fill:var(--unseen)" opacity=".82"/>')
    yf=top+fold*s
    out.append(f'<line x1="{x}" x2="{x+w}" y1="{yf:.1f}" y2="{yf:.1f}" style="stroke:var(--ink-3)" stroke-width="1" stroke-dasharray="3 3"/>')
    out.append(f'<line x1="{x-4}" x2="{x+w+4}" y1="{ya:.1f}" y2="{ya:.1f}" style="stroke:var(--accent)" stroke-width="2.5"/>')
    return out, ya, yf
m=json.load(open(f'{SC}/home-390.json')); d=json.load(open(f'{SC}/home-1440.json'))
H=560; top=26
a,yam,yfm=strook(m,0,64,top,H,0.194,705,True)
b,yad,yfd=strook(d,236,40,top,H*d['total']/m['total'],0.28,858,False)
svg=[f'<svg viewBox="0 0 290 {top+H+34}" role="img" aria-label="Mobiele homepage op schaal: de gemiddelde bezoeker scrolt tot 19 procent, halverwege het blok Sets. Desktop tot 28 procent.">',
 f'<text x="0" y="14" style="fill:var(--ink-3)" font-size="10.5" font-family="IBM Plex Mono,monospace" letter-spacing=".06em">MOBIEL</text>',
 f'<text x="236" y="14" style="fill:var(--ink-3)" font-size="10.5" font-family="IBM Plex Mono,monospace" letter-spacing=".06em">DESKTOP</text>']
svg+=a+b
svg.append(f'<text x="74" y="{yam+16:.1f}" style="fill:var(--accent)" font-size="11" font-weight="700" font-family="Montserrat,sans-serif">gemiddeld tot hier · 19%</text>')
svg.append(f'<text x="256" y="{yad+15:.1f}" style="fill:var(--accent)" font-size="11" font-weight="700" font-family="Montserrat,sans-serif" text-anchor="middle">28%</text>')
svg.append(f'<text x="0" y="{top+H+22}" style="fill:var(--ink-3)" font-size="10.5" font-family="Montserrat,sans-serif">stippellijn = vouw · licht = gemiddeld niet gezien</text>')
svg.append('</svg>')
t=t.replace('{{paginakaart}}','\n'.join(svg))
rijen=[('Label in kapitalen boven de kop',[0,1,1,1,1,1,1,1,1]),('Kop met gouden tweede regel',[1,1,1,1,1,1,1,1,1]),
 ('Goudverloop op knop, pil of ring',[1,1,0,1,0,1,1,1,1]),('Iconen in een rondje',[1,0,1,0,0,1,1,1,0]),
 ('Lijst met vinkjes',[0,1,1,1,1,0,0,0,0]),('Watermerk van het monogram',[0,0,0,1,0,1,1,1,1]),
 ('Carrousel met teller',[0,0,0,0,1,0,1,0,0]),('Avatarstapel',[0,0,0,0,0,0,1,1,0])]
tr=[]
for naam,v in rijen:
    cellen=''.join('<td><span class="dot" aria-label="ja"></span></td>' if x else '<td><span class="nil" aria-label="nee"></span></td>' for x in v)
    tr.append(f'<tr><th scope="row">{naam}</th>{cellen}<td class="n">{sum(v)}</td></tr>')
som=[sum(r[1][i] for r in rijen) for i in range(9)]
tr.append('</tbody><tfoot><tr><th scope="row">Middelen per blok</th>'+''.join(f'<td>{x}</td>' for x in som)+f'<td>{sum(som)}</td></tr></tfoot><tbody>')
t=t.replace('{{matrix}}','\n'.join(tr))
for k,v in img.items(): t=t.replace('{{img:%s}}'%k, v['src'])
assert '{{' not in t, t[t.index('{{'):t.index('{{')+40]
open('/home/user/design/artifacts/homepage-teardown.html','w',encoding='utf-8').write(t)
print(len(t.encode())//1024,'KB', 'per blok', som)
