# Extra beelden voor de Hears-stijl, als kleine webp data-URI's
import base64,io,json,os
from PIL import Image
B=os.path.dirname(os.path.abspath(__file__))
def enc(im,q=78):
    b=io.BytesIO(); im.save(b,'WEBP',quality=q,method=6); return 'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
def fit(f,w,h,cx=.5,cy=.5):
    im=Image.open(f'{B}/img/{f}').convert('RGB'); W,H=im.size; r=w/h
    if W/H>r: nw=int(H*r); x=int(max(0,min(W-nw,cx*W-nw/2))); im=im.crop((x,0,x+nw,H))
    else: nh=int(W/r); y=int(max(0,min(H-nh,cy*H-nh/2))); im=im.crop((0,y,W,y+nh))
    return enc(im.resize((w,h),Image.LANCZOS))
uit={
 'p-ult4':fit('ultimate-compare-69bd31a6ad0759a7beb32f38.webp',560,560),
 'p-gent':fit('Wellshave_Images-29.jpg',560,560),
 'band':fit('gg-band-4-led.jpg',1400,620,.45,.5),
 'f-messen':fit('gg-c2-1-messen.jpg',240,240,.5,.75),
 'f-water':fit('gg-cine-2-waterdicht.jpg',240,240,.42,.6),
 'f-trio':fit('ws-gen-flextrio.webp',240,240),
 'b-herfst':fit('herfst-sale-2026-banner.png',900,620,.55,.5),
 'b-kammen':fit('gg-c2-4-kammen.jpg',900,360,.5,.6),
 'z-ochtend':fit('gg-c2m-7-ochtend.jpg',600,760,.5,.45),
 'z-lading':fit('gg-c2-5-lading.jpg',560,400,.62,.5),
 'z-trio':fit('ws-gen-flextrio.webp',400,400),
 'ultra':fit('ultra.png',560,560),
}
json.dump(uit,open(f'{B}/beelden.json','w'))
print({k:len(v)//1024 for k,v in uit.items()})
