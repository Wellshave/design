// Bouwt het ontwerpbeeld: elk blok op desktop en op mobiel naast elkaar, met
// onderaan een verantwoording. Zelfde opzet als het homepage-artefact.
//
// De mobiele kolom staat niet in een iframe: de media query van de sectie wordt
// hieronder automatisch omgezet naar regels onder .ws-m. Zie mobieleCss().
//
//   node theme/artifact.mjs
import { writeFileSync } from 'node:fs';
import { BLOKKEN, css, s } from './blokken.mjs';

const dir = new URL('.', import.meta.url).pathname;
// ── de mobiele kolom ──
// De sectie gebruikt één echte media query op 749px, en die kijkt naar de
// breedte van het vénster — niet naar die van zijn vak. Naast elkaar op één
// pagina zou de mobiele kolom dus gewoon de desktopopmaak tonen.
//
// Daarom wordt die query hier automatisch omgezet naar regels onder .ws-m.
// Afgeleid, niet overgetypt: verbouw je de media query in het stijlblad, dan
// verandert deze kolom vanzelf mee. Dat is het verschil met de .xx-m-klassen
// uit de oude mockups, die met de hand bijgehouden moesten worden.
function haalBlok(bron, vanaf) {
  const open = bron.indexOf('{', vanaf);
  let diepte = 0;
  for (let i = open; i < bron.length; i++) {
    if (bron[i] === '{') diepte++;
    else if (bron[i] === '}' && --diepte === 0) return bron.slice(open + 1, i);
  }
  throw new Error('ongesloten blok in de CSS');
}

function mobieleCss(bron) {
  const merk = '@media (max-width:749px)';
  const i = bron.indexOf(merk);
  if (i < 0) throw new Error('de mobiele media query is niet gevonden');
  return haalBlok(bron, i)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/([^{}]+)\{/g, (_, sel) =>
      sel
        .split(',')
        .map((x) => '.ws-m ' + x.trim())
        .join(',') + '{'
    );
}

const MOBIEL = mobieleCss(css);

// het venster waarin een blok getoond wordt
const venster = (html, klas, mobiel) =>
  `<div class="scaler ${klas}"><div class="inner${mobiel ? ' ws-m' : ''}">${html}</div></div>`;

const blokken = BLOKKEN.map(
  (b) => `<section class="blok">
  <div class="blok-h">
    <h2>${b.naam}</h2>
    <span>${b.bij}</span>
  </div>
  <div class="views">
    <div><p class="devicecap">Desktop &middot; 1440</p>${venster(b.html(), 'desk-scaler', false)}</div>
    <div class="mobcol"><p class="devicecap">Mobiel &middot; 390</p>${venster(b.html(), 'phone-scaler', true)}</div>
  </div>
</section>`
).join('\n');

const WIJZ = [
  ['Verkeerd systeem, opnieuw begonnen', 'De eerste versie stond in het landingspagina-systeem uit de merklaag: tweeslags koppen met een tekstverloop, zand, een los HTML-bestand. Dat systeem is voor verkeer <b>ná een advertentie</b>. Een Over ons-pagina hoort bij de winkel, en dus bij de taal van de homepage.'],
  ['Koppen zonder verloop', 'De merklaag zet de tweede kopregel in een goudverloop op gewicht 900. De homepage doet het anders: gewicht 600 tot 700, en het accent in <b>&lt;b&gt;</b> in een effen kleur — brons op licht, goud op donker. Dat is hier overgenomen.'],
  ['Donker is #0B0B0A, niet #191816', 'De merklaag gebruikt carbon. De homepage gebruikt een diepere zwarttint met een radiale goudgloed erachter. Dezelfde behandeling zit nu onder blok 4 en blok 6.'],
  ['Licht is een paneel, geen vlak', 'Waar de merklaag een zandvlak neerzet, zet de homepage een warm verloop in een dun gouden kader. Blok 3 en het rechterpaneel van blok 5 volgen dat.'],
  ['Eén breekpunt in plaats van drie', 'De merklaag breekt op 980, 760 en 520. Het thema houdt <b>749px</b> aan, de grens die het thema zelf gebruikt. Alle mobiele regels staan nu in die ene query.'],
  ['Ander beeld dan de homepage', 'De vorige versie leende de herofoto van de homepage: dezelfde man met dezelfde handdoek. Dat leest als een herhaling. De hero staat nu in het <b>eigen magazijn</b>, tussen de rolcontainers met bestellingen — hetzelfde verhaal als de teller ernaast. Blok 2 gebruikt de twee foto\'s uit de installateurstijd. Allemaal eigen materiaal, niets van de CDN geleend.'],
  ['Een persoonlijk begin, omgedraaid naar jou', 'Blok 2 is nieuw. Het vertelt in tien regels waar Wellshave vandaan komt — Dustin was installateur voordat hij scheerapparaten maakte — maar elke zin landt bij de lezer, niet bij de oprichter. De les uit dat vak (<b>goed gereedschap bepaalt het resultaat, niet de man die het vasthoudt</b>) is precies de belofte die de hero erboven doet, nu met een herkomst erbij.'],
  ['Het verhaal draagt geen bewijslast', 'Het persoonlijke stuk staat er om te laten zien wáárom wij dit maken, niet om iets te bewijzen. De enige getallen op de pagina staan in de teller en in blok 5, en die komen uit de instellingen van de homepage.'],
  ['Marge uit de instellingen', 'Het thema zet <b>#shopify-section-ID &gt; *</b> via <b>snippets/indent-settings</b>, en dat is een ID-selector die van elke klasse wint. Boven- en ondermarge gaan daarom via <b>desk_indent_top</b> en de drie andere, niet via de CSS.'],
  ['Kolommen via --ws-kol', 'Het aantal kolommen staat in een variabele en niet als inline stijl op het element: een inline stijl wint van elke media query, ook van de mobiele. Dat ging op de homepage bij blok 7 en 8 een keer mis.'],
  ['Twee cijfers rechtgezet', 'De vorige versie hield 700+ beoordelingen aan en noemde geen startjaar. De homepage zegt <b>950+</b> en <b>sinds 2021</b>, allebei in eigen instellingen. De teller noemt nu 180.000+ bestellingen sinds 2021.'],
  ['Alles is een instelling', 'Elke tekst op deze pagina is een veld in de thema-editor, en de drie vragen en drie stappen zijn blokken. Wie de copy wil bijstellen heeft geen code nodig.'],
];

const html = `<title>Wellshave Over ons-redesign</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap">
<style>
:root{--bg:#FBFAF9;--surface:#fff;--fg:#1A1A1A;--fg-soft:#6B6560;--rule:#E6E1DC;--gold:#BC813E}
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
.lede p.sub b{color:var(--fg);font-weight:600}
.lede code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;
  background:var(--surface);border:1px solid var(--rule);border-radius:4px;padding:1px 6px}
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
.scaler{width:100%;overflow:hidden;border:1px solid var(--rule);border-radius:5px;background:#0B0B0A}
.phone-scaler{border-radius:15px}
.scaler > .inner{transform-origin:top left}
.desk-scaler > .inner{width:1440px}
.phone-scaler > .inner{width:390px}

/* de sectie zelf, plus de mobiele regels onder .ws-m */
${css}
${MOBIEL}
.scaler .ws-ov{font-family:"Montserrat",sans-serif}
.scaler .ws-ov *{margin:0;padding:0}
.scaler .ws-ov img{max-width:100%;height:auto;display:block}
.scaler .ws-ov ul{list-style:none}
footer{border-top:1px solid var(--rule);padding-top:20px;color:var(--fg-soft);font-size:13px;
  line-height:165%}
footer b{color:var(--fg);font-weight:600}
footer p{margin:0 0 18px;max-width:72ch}
.wijz{display:grid;grid-template-columns:repeat(auto-fill,minmax(268px,1fr));gap:14px}
.wijz-kaart{background:var(--surface);border:1px solid var(--rule);border-radius:10px;padding:18px 20px}
.wijz-kaart h3{font-size:14px;font-weight:600;letter-spacing:-.005em;margin:0 0 7px;color:var(--gold)}
.wijz-kaart p{font-size:13.5px;line-height:160%;color:var(--fg-soft);margin:0}
.wijz-kaart b{color:var(--fg);font-weight:600}
:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
</style>

<div class="shell">

  <header class="lede">
    <p class="kicker">Wellshave &middot; ontwerpbeeld</p>
    <h1>Over ons, in de taal van de homepage</h1>
    <p class="sub">Zes blokken, elk op desktop en op mobiel. De pagina is een themasectie
      (<code>ws-overons</code>) met een eigen stijlblad en een paginasjabloon — geen los
      HTML-bestand. Elk venster hieronder is een echte weergave op 1440 en op 390 pixels,
      dus de mobiele kolom laat zien wat de media query op 749px werkelijk doet.</p>
    <p class="sub">Nieuw sinds de vorige ronde: <b>blok 2</b>, een kort persoonlijk verhaal dat
      meteen wordt omgedraaid naar de lezer, en <b>ander beeldmateriaal</b> dan de homepage.</p>
  </header>

  ${blokken}

  <footer>
    <p>De eerste versie van deze pagina stond in het <b>landingspagina-systeem</b> uit de
      merklaag. Dat systeem is gemaakt voor het verkeer ná een advertentie: één pad naar de
      winkelwagen, geen navigatie, koppen in twee slagen met een tekstverloop. Een Over
      ons-pagina hoort bij de winkel zelf, en dus bij de taal van de homepage. Hieronder wat er
      daardoor is veranderd.</p>
    <div class="wijz">
      ${WIJZ.map(([k, t]) => `<div class="wijz-kaart"><h3>${k}</h3><p>${t}</p></div>`).join('')}
    </div>
  </footer>

</div>

<script>
// Schaal elk venster naar de breedte van zijn kolom. Een blok van 1440px past
// niet in een kolom van 830, en de telefoonkolom is precies 390 breed.
(function(){
  function meet(box){
    var inner = box.querySelector('.inner');
    if (!inner) return;
    var w = inner.offsetWidth;
    if (!w) return;
    var s = Math.min(1, box.clientWidth / w);
    inner.style.transform = s < 1 ? 'scale(' + s + ')' : 'none';
    box.style.height = Math.ceil(inner.offsetHeight * s) + 'px';
  }
  function alles(){ document.querySelectorAll('.scaler').forEach(meet); }
  addEventListener('resize', alles);
  // het webfont komt na de eerste opmaak binnen en verandert de hoogte
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alles);
  var n = 0, tik = setInterval(function(){ alles(); if (++n > 12) clearInterval(tik); }, 250);
  alles();
})();
</script>
`;

writeFileSync(`${dir}over-ons.artifact.html`, html);
console.log('geschreven: theme/over-ons.artifact.html (' + Math.round(html.length / 1024) + ' KB)');
