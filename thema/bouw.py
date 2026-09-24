import subprocess, re, sys, os, urllib.parse
handle, uit = sys.argv[1], sys.argv[2]
import time
# cache-buster: zonder deze parameter kreeg ik na een upload nog de vorige opmaak terug
url = 'https://wellshave.com/collections/%s?preview_theme_id=204178161996&_=%d' % (handle, int(time.time()))
r = subprocess.run(['curl','-sSL','-b','jar.txt','-c','jar.txt',
                    '-H','User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
                    url], capture_output=True, text=True)
h = r.stdout
print('opgehaald:', len(h), 'tekens')

def haal(u):
    if u.startswith('//'): u = 'https:' + u
    q = subprocess.run(['curl','-sSL','-b','jar.txt', u], capture_output=True, text=True)
    return q.stdout

# alle theme-stylesheets inlinen
def css(m):
    u = m.group(1)
    if 'cdn/shop' not in u and 'cdn.shopify' not in u: return ''
    body = haal(u)
    if not body.strip(): return ''
    return '<style>%s</style>' % body
h = re.sub(r'<link[^>]+rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>', css, h)
h = re.sub(r'<link[^>]+href=["\']([^"\']+)["\'][^>]*rel=["\']stylesheet["\'][^>]*>', css, h)

# ws-collectie.js achteraan inlinen (defer-gedrag nabootsen)
m = re.search(r'<script[^>]+src=["\']([^"\']*ws-collectie\.js[^"\']*)["\'][^>]*>\s*</script>', h)
js = ''
if m:
    js = haal(m.group(1))
    h = h.replace(m.group(0), '')
    h = h.replace('</body>', '<script>%s</script></body>' % js)
    print('js ingevoegd:', len(js))
else:
    print('LET OP: ws-collectie.js niet gevonden')
open(uit,'w').write(h)
print('geschreven:', uit, os.path.getsize(uit))
