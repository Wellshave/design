# Beelden voor de Manscaped-variant, als webp data-URI's
import base64,io,json,os
from PIL import Image
B=os.path.dirname(os.path.abspath(__file__)); H=os.path.join(B,'..','hs','img'); V=os.path.join(B,'..','v6')
def enc(im,q=78):
    b=io.BytesIO(); im.save(b,'WEBP',quality=q,method=6); return 'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
def fit(p,w,h,cx=.5,cy=.5):
    im=Image.open(p).convert('RGB'); W,Hh=im.size; r=w/h
    if W/Hh>r: nw=int(Hh*r); x=int(max(0,min(W-nw,cx*W-nw/2))); im=im.crop((x,0,x+nw,Hh))
    else: nh=int(W/r); y=int(max(0,min(Hh-nh,cy*Hh-nh/2))); im=im.crop((0,y,W,y+nh))
    return enc(im.resize((w,h),Image.LANCZOS))
uit={
 'r-herfst':fit(f'{H}/herfst-sale-2026-banner.png',720,420,.6,.5),
 'r-water':fit(f'{H}/gg-cine-2-waterdicht.jpg',720,420,.55,.55),
 'ban-lading':fit(f'{H}/gg-c2-5-lading.jpg',1440,560,.45,.5),
 'ban-herfst':fit(f'{H}/herfst-sale-2026-banner.png',1440,560,.42,.5),
 'ban-kammen':fit(f'{H}/gg-c2-4-kammen.jpg',1440,560,.42,.5),
 't-messen':fit(f'{H}/gg-c2-1-messen.jpg',800,450,.5,.6),
 't-water':fit(f'{H}/gg-cine-2-waterdicht.jpg',800,450,.5,.55),
 't-led':fit(f'{H}/gg-band-4-led.jpg',800,450,.45,.5),
 'p-dual':fit(f'{H}/dual.webp',560,560),
 't-7d':fit(f'{H}/7d.jpg',800,450,.5,.5),
 'p-hsd':fit(f'{H}/hsd.jpg',300,300),
 'c-sets':fit(f'{V}/img/Gemini_Generated_Image_da7jpeda7jpeda7j.png',600,600),
}
json.dump(uit,open(f'{B}/beelden.json','w'))
print({k:len(v)//1024 for k,v in uit.items()})
