// Zet de mockups uit de blokdocumenten om naar één doorlopende homepage-preview.
// Neemt alleen de mockup-CSS en de mockup-markup over — niet het documentchroom
// van de audits zelf — zodat de blokken hier staan zoals ze op de pagina komen.
import { readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('.', import.meta.url).pathname;
const read = (n) => readFileSync(`${dir}${n}`, 'utf8');

const MOCKUP_START = '/* ══ MOCKUP';
const MOCKUP_END = '/* ── annotaties ── */';

function mockupCss(html) {
  const s = html.indexOf(MOCKUP_START), e = html.indexOf(MOCKUP_END);
  if (s < 0 || e < 0) throw new Error('mockup-CSS niet gevonden');
  return html.slice(s, e).trim();
}

// pakt één element inclusief zijn nesting, vanaf de openingstag
function element(html, openTag, tagName) {
  const start = html.indexOf(openTag);
  if (start < 0) throw new Error(`niet gevonden: ${openTag}`);
  const open = new RegExp(`<${tagName}\\b`, 'g');
  const close = new RegExp(`</${tagName}>`, 'g');
  open.lastIndex = close.lastIndex = start;
  let depth = 0, i = start;
  for (;;) {
    open.lastIndex = close.lastIndex = i;
    const o = open.exec(html), c = close.exec(html);
    if (!c) throw new Error(`geen sluittag voor ${openTag}`);
    if (o && o.index < c.index) { depth++; i = o.index + 1; }
    else { depth--; i = c.index + 1; if (depth === 0) return html.slice(start, c.index + c[0].length); }
  }
}

const hero = read('blok-01-hero.html');
const proof = read('blok-02-pijnpunt.html');
const best = read('blok-03-bestsellers.html');
const mech = read('blok-04-mechanisme.html');

// blok 1 en blok 2 delen drie Trustpilot-klassen met verschillende waarden.
// In de preview staan ze op één pagina, dus krijgt blok 1 een eigen naam.
const rename = (s) => s
  .replace(/\btp-stars\b/g, 'h-tp-stars')
  .replace(/\btp-brand\b/g, 'h-tp-brand')
  .replace(/(\.|")half\b/g, '$1h-half');

// De kop van blok 1 zit in het auditdocument achter een wisselaar met drie
// richtingen; die wordt daar door script ingevuld. Hier is de keuze gemaakt,
// dus bakken we de vastgestelde richting in de markup.
const VARIANT = 'uitkomst';
function bakeCopy(markup, source) {
  const block = source.slice(source.indexOf(`${VARIANT}:{`));
  const copy = {};
  for (const key of ['h1m', 'subm', 'h1', 'sub']) {
    const m = block.match(new RegExp(`\\b${key}:"((?:[^"\\\\]|\\\\.)*)"`));
    if (!m) throw new Error(`koptekst ${key} niet gevonden`);
    copy[key] = m[1];
  }
  return markup.replace(/(data-slot="(h1m|subm|h1|sub)"[^>]*>)(<\/)/g,
    (_, open, slot, close) => open + copy[slot] + close);
}

const sprite = element(proof, '<svg width="0" height="0"', 'svg');

// Sommige blokken hebben eigen gedrag nodig — blok 4 heeft een tijdlijn die
// vanzelf doorschuift. Dat script staat in het blokdocument achter een
// sentinel; hier wordt het opgehaald zodat de preview zich net zo gedraagt.
function mockupScript(html) {
  const sentinel = '/* ══ MOCKUP-SCRIPT ══ */';
  const s = html.indexOf(sentinel);
  if (s < 0) return '';
  const e = html.indexOf('</script>', s);
  if (e < 0) throw new Error('mockup-script niet afgesloten');
  return html.slice(s, e);
}

const blocks = [
  { id: 'blok1', naam: 'Blok 1 — Hero',
    desk: bakeCopy(rename(element(hero, '<div class="ws">', 'div')), hero),
    mob:  bakeCopy(rename(element(hero, '<div class="ws ws-m">', 'div')), hero) },
  { id: 'blok2', naam: 'Blok 2 — Autoriteit en bewijs',
    desk: element(proof, '<section class="pf"><div class="pf-in">', 'section'),
    mob:  element(proof, '<section class="pf pf-m"><div class="pf-in">', 'section') },
  { id: 'blok3', naam: 'Blok 3 — Bestsellers',
    desk: element(best, '<section class="bs"><div class="bs-in">', 'section'),
    mob:  element(best, '<section class="bs bs-m"><div class="bs-in">', 'section') },
  { id: 'blok4', naam: 'Blok 4 — Het mechanisme',
    desk: element(mech, '<section class="mc">', 'section'),
    mob:  element(mech, '<section class="mc mc-m">', 'section') },
];

const css = `:root{--bg:#FBFAF9;--surface:#fff;--fg:#1A1A1A;--fg-soft:#6B6560;--rule:#E6E1DC;--gold:#BC813E}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#131211;--surface:#1B1A18;--fg:#F3F0EC;--fg-soft:#9E968E;--rule:#2E2B28}}
:root[data-theme="dark"]{--bg:#131211;--surface:#1B1A18;--fg:#F3F0EC;--fg-soft:#9E968E;--rule:#2E2B28}

body{margin:0;background:var(--bg);color:var(--fg);
  font-family:"Montserrat",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  -webkit-font-smoothing:antialiased}
.shell{max-width:1280px;margin:0 auto;padding:38px 22px 70px}
.lede{border-bottom:1px solid var(--rule);padding-bottom:22px;margin-bottom:30px}
.lede p.kicker{font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--gold);margin:0 0 9px}
.lede h1{font-size:clamp(25px,4vw,36px);line-height:118%;letter-spacing:-.022em;font-weight:600;margin:0}
.lede p.sub{font-size:15.5px;line-height:160%;color:var(--fg-soft);margin:12px 0 0;max-width:64ch}
.blok{margin:0 0 44px}
.blok-h{display:flex;align-items:baseline;justify-content:space-between;gap:16px;
  flex-wrap:wrap;margin:0 0 12px}
.blok-h h2{font-size:17px;font-weight:600;letter-spacing:-.01em;margin:0}
.blok-h span{font-size:10.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;
  color:var(--fg-soft)}
.views{display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:26px;align-items:start}
@media (max-width:940px){.views{grid-template-columns:minmax(0,1fr)}
  .views .mobcol{max-width:390px}}
.devicecap{font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:var(--fg-soft);margin:0 0 7px}
.scaler{width:100%;overflow:hidden;border:1px solid var(--rule);border-radius:5px;background:#111}
.scaler > .inner{transform-origin:top left}
.desk-scaler > .inner{width:1440px}
.phone-scaler{border-radius:15px}
.phone-scaler > .inner{width:390px}
footer{border-top:1px solid var(--rule);padding-top:20px;color:var(--fg-soft);font-size:13px;
  line-height:165%}
footer b{color:var(--fg);font-weight:600}
footer p{margin:0;max-width:72ch}

/* deze twee staan in de blokdocumenten buiten het mockup-blok, dus ze komen
   niet mee met de CSS hierboven — zonder deze regels blijft de reviewband
   bewegen bij bewegingsreductie en is toetsenbordfocus onzichtbaar */
:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
@media (prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
  .revtrack{width:auto;overflow-x:auto}}

/* ── blok 1 ── */
${rename(mockupCss(hero))}

/* de hero is getekend op een vast kader van 728px hoog; in deze doorlopende
   preview mag hij zijn eigen hoogte bepalen */
.ws{height:auto;min-height:728px}
.ws.ws-m{min-height:800px}

/* ── blok 2 ── */
${mockupCss(proof)}

/* ── blok 3 ── */
${mockupCss(best)}

/* ── blok 4 ── */
${mockupCss(mech)}`;

const body = blocks.map(b => `
  <section class="blok">
    <div class="blok-h"><h2>${b.naam}</h2><span>Ontwerp — nog niets live</span></div>
    <div class="views">
      <div>
        <p class="devicecap">Desktop — 1440px</p>
        <div class="scaler desk-scaler"><div class="inner">${b.desk}</div></div>
      </div>
      <div class="mobcol">
        <p class="devicecap">Mobiel — 390px</p>
        <div class="scaler phone-scaler"><div class="inner">${b.mob}</div></div>
      </div>
    </div>
  </section>`).join('\n');

const out = `<title>Wellshave homepage-redesign</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap">
<style>
${css}
</style>
${sprite}
<div class="shell">
  <div class="lede">
    <p class="kicker">Homepage-redesign · 4 van 12 blokken</p>
    <h1>De nieuwe blokken, zoals ze op de pagina komen te staan</h1>
    <p class="sub">Beide blokken draaien hier echt: de reviewband loopt, de knoppen reageren, en het
      mobiele beeld is de werkelijke opmaak op 390&nbsp;px — niet een verkleinde desktopversie.
      Alle prijzen, voorraadstanden en beoordelingen komen uit Shopify en Trustpilot.</p>
  </div>
${body}
  <footer>
    <p><b>Nog niets hiervan staat live.</b> Dit is de ontwerpversie; pas na jouw akkoord gaat het naar
      Shopify. De voorraadstand in het bundelblok is nu een vast getal en moet in de bouw live meelopen.</p>
  </footer>
</div>
<script>
${[hero, proof, best, mech].map(mockupScript).filter(Boolean).join('\n')}
</script>
<script>
function fit(){
  document.querySelectorAll('.scaler').forEach(s=>{
    const inner=s.firstElementChild;
    const w=parseFloat(getComputedStyle(inner).width);
    const scale=s.clientWidth/w;
    inner.style.transform='scale('+scale+')';
    s.style.height=Math.ceil(inner.offsetHeight*scale)+'px';
  });
}
document.fonts&&document.fonts.ready.then(fit);
window.addEventListener('resize',fit);
new ResizeObserver(fit).observe(document.body);
window.addEventListener('load',fit); fit();
</script>`;

writeFileSync(`${dir}homepage-preview.html`, out);
console.log(`geschreven: homepage-preview.html (${Math.round(out.length/1024)} kB)`);
