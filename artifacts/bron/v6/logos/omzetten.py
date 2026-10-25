from PIL import Image, ImageChops
import numpy as np, json, base64, io
L='logo'; L2='logo2'
GRIJS=(58,55,52)   # donkergrijs, warm, past bij de inkt van de site
def laad(p): return np.asarray(Image.open(p).convert('RGBA')).astype(np.float32)/255.0
def wit(a): # 0..1 hoe wit een pixel is
    rgb=a[...,:3]; mn=rgb.min(axis=2); mx=rgb.max(axis=2)
    return np.clip((mn-0.55)/0.4,0,1)*np.clip(1-(mx-mn)/0.25,0,1)
def masker(naam,a,regel):
    al=a[...,3]
    if regel=='alpha': m=al
    elif regel=='niet-wit': m=al*(1-wit(a))
    elif regel=='wit': m=al*wit(a)
    elif regel=='donker': lum=a[...,:3]@np.array([.299,.587,.114]); m=al*np.clip((0.75-lum)/0.55,0,1)
    return m
bronnen=[
 ('ad',      f'{L2}/ad.png','niet-wit',None),
 ('ed',      f'{L2}/ed.jpg','niet-wit',None),
 ('bol',     f'{L2}/bol.jpg','niet-wit',None),
 ('mh',      f'{L}/l4.png','alpha',None),
 ('mm',      f'{L}/l2.png','alpha',None),
 ('bcc',     f'{L}/l1.png','alpha',None),
 ('blokker', f'{L}/l3.png','alpha',None),
 ('baard',   f'{L}/l5.png','alpha',None),
 ('review',  f'{L2}/review.png','alpha',None),
 ('dbw',     f'{L2}/dbw.png','alpha',None),
 ('dor',     f'{L2}/dor.png','donker',None),
 ('kk',      f'{L2}/kk_label.png','wit',(0,1240,800,1460)),
]
uit={}
for naam,pad,regel,crop in bronnen:
    a=laad(pad)
    if crop: a=a[crop[1]:crop[3],crop[0]:crop[2]]
    m=masker(naam,a,regel)
    ys,xs=np.where(m>0.08)
    y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    m=m[y0:y1,x0:x1]
    h,w=m.shape; asp=w/h; dicht=float((m>0.5).mean())
    img=np.zeros((h,w,4),np.uint8); img[...,0],img[...,1],img[...,2]=GRIJS; img[...,3]=(m*255).astype(np.uint8)
    im=Image.fromarray(img,'RGBA')
    doel_h=112
    if h>doel_h: im=im.resize((round(w*doel_h/h),doel_h),Image.LANCZOS)
    im.save(f'grijs/{naam}.png')
    b=io.BytesIO(); im.save(b,'PNG',optimize=True)
    uit[naam]={'src':'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode(),'asp':round(asp,3),'dicht':round(dicht,3),'px':im.size}
    print(f'{naam:8s} asp {asp:5.2f} dichtheid {dicht:.2f} -> {im.size}  {len(b.getvalue())//1024} KB')
json.dump(uit,open('grijs/logos.json','w'))
