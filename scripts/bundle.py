#!/usr/bin/env python3
"""Bundel de site tot één zelfstandig HTML-bestand.

Frames, assets en fonts gaan als data-URI's mee, zodat de pagina zonder
webserver of losse bestanden opent. Bedoeld om te delen, niet om te
ontwikkelen — daarvoor blijft site/ met losse bestanden de bron.

Gebruik: python3 scripts/bundle.py [framedir] [uit.html]
"""
import base64
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "site")
FRAMEDIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(SITE, "frames")
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, "groom-guard-pro.html")


def data_uri(path, mime):
    with open(path, "rb") as fh:
        return f"data:{mime};base64," + base64.b64encode(fh.read()).decode()


def read(*parts):
    with open(os.path.join(SITE, *parts), encoding="utf-8") as fh:
        return fh.read()


# ---------- css: fonts inline ----------
css = read("css", "app.css")
for name in ("oswald", "archivo"):
    css = css.replace(
        f"url('../fonts/{name}.woff2')",
        "url('%s')" % data_uri(os.path.join(SITE, "fonts", f"{name}.woff2"), "font/woff2"),
    )

# ---------- assets ----------
assets = {
    os.path.basename(p): data_uri(p, "image/jpeg")
    for p in sorted(glob.glob(os.path.join(SITE, "assets", "*.jpg")))
}

# ---------- frames ----------
frames = [data_uri(p, "image/jpeg") for p in sorted(glob.glob(os.path.join(FRAMEDIR, "*.jpg")))]
if not frames:
    raise SystemExit(f"geen frames gevonden in {FRAMEDIR}")

# ---------- js: los van het bestandssysteem trekken ----------
js = read("js", "app.js")

js = js.replace(
    """  function loadSequence() {
    return fetch('frames/manifest.json')
      .then(r => r.json())
      .then(m => {
        manifest = m;
        return Promise.all(m.frames.map((src, i) => new Promise(res => {
          const img = new Image();
          img.decoding = 'async';
          img.onload = img.onerror = () => {
            loaded++;
            const pct = Math.round(loaded / m.frames.length * 100);
            $('#loaderFill').style.width = pct + '%';
            $('#loaderPct').textContent = pct;
            res();
          };
          img.src = 'frames/' + src;
          frames[i] = img;
        })));
      });
  }""",
    """  function loadSequence() {
    const srcs = window.__GGP.frames;
    return Promise.all(srcs.map((src, i) => new Promise(res => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => {
        loaded++;
        const pct = Math.round(loaded / srcs.length * 100);
        $('#loaderFill').style.width = pct + '%';
        $('#loaderPct').textContent = pct;
        res();
      };
      img.src = src;
      frames[i] = img;
    })));
  }""",
)

js = js.replace("src=\"assets/${m.file}\"", "src=\"${window.__GGP.assets[m.file]}\"")
js = re.sub(r"img: 'assets/([a-z-]+\.jpg)'", lambda m: "img: window.__GGP.assets['%s']" % m.group(1), js)

if "manifest" in js:
    js = js.replace("let manifest = null, loaded = 0", "let loaded = 0")

for marker in ("window.__GGP.frames", "window.__GGP.assets[m.file]", "window.__GGP.assets['config-foil.jpg']"):
    if marker not in js:
        raise SystemExit(f"patch mislukt: {marker} ontbreekt")

# ---------- html ----------
html = read("index.html")
body = html.split("<body>", 1)[1].split("</body>", 1)[0]
body = body.replace('<script src="js/app.js"></script>', "")
title = re.search(r"<title>(.*?)</title>", html).group(1)
desc = re.search(r'<meta name="description" content="(.*?)">', html).group(1)

out = f"""<title>{title}</title>
<meta name="description" content="{desc}">
<style>
{css}
</style>
{body}
<script>
window.__GGP = {{
  frames: {json.dumps(frames)},
  assets: {json.dumps(assets)}
}};
</script>
<script>
{js}
</script>
"""

with open(OUT, "w", encoding="utf-8") as fh:
    fh.write(out)

print(f"{OUT} · {len(frames)} frames · {len(assets)} assets · {os.path.getsize(OUT)/1e6:.1f} MB")
