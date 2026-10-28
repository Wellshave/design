# Zet de productbeelden om naar kleine webp data-URI's voor de mockup
import base64,io,json,os
from PIL import Image
B=os.path.dirname(os.path.abspath(__file__))
bron={
 'p-flex':('flex-guard-compare-69bd2fa4ad0759a7beb32e99.webp',640),
 'p-gg':('groom-guard-69bd309ead0759a7beb32efe.webp',640),
 'p-ggpro':('groom-guard-pro-69bd309ead0759a7beb32eff.webp',640),
 'p-adv':('advance-compare-69bd31a6ad0759a7beb32f37.webp',640),
 's-bb3':('ChatGPTImage6aug2026_13_48_14.png',640),
 's-sp3':('Gemini_Generated_Image_85xxs185xxs185xx.png',640),
 's-sd3':('ChatGPTImage12aug2026_15_19_48.png',640),
 's-ult':('Gemini_Generated_Image_da7jpeda7jpeda7j.png',640),
 'z-lichaam':('ws-zone-lichaam.webp',520),
 'z-gezicht':('ws-zone-gezicht.webp',520),
 'z-hoofd':('ws-zone-hoofd.webp',520),
 'z-neus':('ws-zone-neus-v3.png',520),
 'u-hoofd':('ws-ugc-hoofd.webp',520),
 'u-borst':('ws-ugc-borst.webp',520),
 'u-neus':('ws-ugc-neus.webp',520),
}
uit={}
for k,(f,w) in bron.items():
    im=Image.open(f'{B}/img/{f}')
    alfa=k.startswith('z-')
    im=im.convert('RGBA' if alfa else 'RGB')
    if not alfa and im.mode=='RGB' and f.endswith('.png'):
        pass
    im.thumbnail((w,w),Image.LANCZOS)
    buf=io.BytesIO(); im.save(buf,'WEBP',quality=80,method=6)
    uit[k]='data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()
    print(k,im.size,len(buf.getvalue())//1024,'KB')
json.dump(uit,open(f'{B}/beelden2.json','w'))
