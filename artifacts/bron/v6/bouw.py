import json,re
B='/tmp/claude-0/-home-user-design/0e25b6a7-7bd5-5ff3-a896-b7a39de57caa/scratchpad/v6'
img=json.load(open(f'{B}/beelden.json'))
t=open(f'{B}/hero.template.html',encoding='utf-8').read()
site=open(f'{B}/site.html',encoding='utf-8').read()
rij=('<span class="m-lg lg2" role="img" aria-label="MediaMarkt"></span><span class="m-tx krant">AD</span>'
     '<span class="m-lg lg4" role="img" aria-label="Men\'s Health"></span><span class="m-tx krant">ED</span>'
     '<span class="m-lg lg1" role="img" aria-label="BCC"></span><span class="m-tx">De Ondernemer</span>'
     '<span class="m-lg lg3" role="img" aria-label="Blokker"></span><span class="m-lg lg5" role="img" aria-label="Baardtips.com"></span>')
site=site.replace('{{rij}}',rij)
css=''.join(f'.lg{i}{{aspect-ratio:{img[f"logo{i}_r"]:.3f};background-image:url({img[f"logo{i}"]})}}\n' for i in range(1,6))
for k,v in {'{{kop_r}}':f'{img["kop_r"]:.3f}','{{kop_bg}}':f'url({img["kop"]})','{{hero_d_bg}}':f'url({img["hero_d"]})',
            '{{hero_m_url}}':f'url({img["hero_m"]})','{{logo_css}}':css,'{{site}}':site}.items():
    t=t.replace(k,v)
assert '{{' not in t
open('/home/user/design/artifacts/wellshave-v6-hero.html','w',encoding='utf-8').write(t)
print(len(t.encode())//1024,'KB')
