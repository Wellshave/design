import json,re
B='/tmp/claude-0/-home-user-design/0e25b6a7-7bd5-5ff3-a896-b7a39de57caa/scratchpad/v6'
img=json.load(open(f'{B}/beelden.json'))
t=open(f'{B}/hero.template.html',encoding='utf-8').read()
site=open(f'{B}/site.html',encoding='utf-8').read()
L=json.load(open('/tmp/claude-0/-home-user-design/0e25b6a7-7bd5-5ff3-a896-b7a39de57caa/scratchpad/grijs/logos.json'))
volgorde=[('ad','AD',38),('bol','bol',29),('mh',"Men's Health",26),('ed','Eindhovens Dagblad',34),('mm','MediaMarkt',22),
          ('kk','Kieskeurig.nl',25),('dor','De Ondernemer',30),('bcc','BCC',27),('review','Review.nl',25),
          ('blokker','Blokker',28),('baard','Baardtips.com',17),('dbw','De Betere Wereld',20)]
rij=''
for k,naam,h in volgorde:
    if k=='dor':
        rij+=f'<span class="m-do"><span class="m-lg lg-{k}" style="--h:{h}" aria-hidden="true"></span><b>De Ondernemer</b></span>'
    else:
        rij+=f'<span class="m-lg lg-{k}" style="--h:{h}" role="img" aria-label="{naam}"></span>'
site=site.replace('{{rij}}',rij)
css=''.join(f'.lg-{k}{{aspect-ratio:{L[k]["asp"]};background-image:url({L[k]["src"]})}}\n' for k,_,_ in volgorde)
for k,v in {'{{kop_r}}':f'{img["kop_r"]:.3f}','{{kop_bg}}':f'url({img["kop"]})','{{hero_d_bg}}':f'url({img["hero_d"]})',
            '{{hero_m_url}}':f'url({img["hero_m"]})','{{logo_css}}':css,'{{site}}':site}.items():
    t=t.replace(k,v)
assert '{{' not in t
open('/home/user/design/artifacts/wellshave-v6-hero.html','w',encoding='utf-8').write(t)
print(len(t.encode())//1024,'KB')
