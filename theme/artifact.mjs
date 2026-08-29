// Bouwt het ontwerpbeeld: elk blok op desktop en op mobiel naast elkaar, met
// onderaan een verantwoording. Zelfde opzet als het homepage-artefact.
//
// De mobiele kolom staat niet in een iframe: de media query van de sectie wordt
// hieronder automatisch omgezet naar regels onder .ws-m. Zie mobieleCss().
//
//   node theme/artifact.mjs
import { writeFileSync } from 'node:fs';
import { BLOKKEN, css, s, script } from './blokken.mjs';

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
  `<div class="scaler ${klas}"><div class="inner ws-ov${mobiel ? ' ws-m' : ''}">${html}</div></div>`;

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

// De acht vergeleken Over ons-pagina's. Een vinkje is: het patroon staat er
// herkenbaar op. Een streepje: het ontbreekt. Een tilde: het zit erin, maar
// niet als eigen blok. Manscaped blokkeert het ophalen van zijn pagina; die
// rij komt uit hun eigen merkverhaal op het blog.
const MERKEN = [
  ['Dore &amp; Rose', 'doreandrose.com', ['–', '–', '–', '–', '✓', '–', '–', '–']],
  ['Cloudpillo', 'cloudpillo.com', ['✓', '✓', '✓', '✓', '–', '✓', '✓', '–']],
  ['Meroda', 'merodacosmetics.nl', ['✓', '–', '–', '–', '✓', '–', '✓', '–']],
  ['Hears', 'hears.com', ['✓', '–', '~', '–', '–', '✓', '–', '–']],
  ['MAE', 'maeofficial.com', ['–', '–', '✓', '~', '✓', '–', '–', '–']],
  ['Moov', 'moovmore.com', ['✓', '✓', '✓', '~', '✓', '✓', '–', '–']],
  ['Manscaped', 'manscaped.com', ['✓', '–', '✓', '~', '✓', '–', '–', '–']],
  ['Achaté', 'achate.com', ['✓', '✓', '✓', '–', '✓', '✓', '✓', '–']],
];
const KOLOMMEN = [
  ['CTA boven de vouw', 'Een knop naar de winkel vóór je hoeft te scrollen.'],
  ['Uitkomsten in cijfers', 'Drie genummerde dingen die voor de klant veranderen.'],
  ['Oprichtersverhaal', 'Een naam, een gezicht, en waarom hij begon.'],
  ['Tijdlijn', 'De reis van het merk in fasen, met jaartallen.'],
  ['Drie kernwaarden', 'Waar het merk voor zegt te staan, in drieën.'],
  ['Team met namen', 'Gezichten met een naam en een rol eronder.'],
  ['Reviews als eigen blok', 'Klantcitaten in een eigen sectie, niet in de voettekst.'],
  ['Eerlijk over grenzen', 'Wat het merk uitdrukkelijk níét belooft.'],
];
const tel = (i) => MERKEN.filter((m) => m[2][i] === '✓').length;

const vergelijking = `<section class="verg">
  <div class="blok-h"><h2>De acht pagina&rsquo;s naast elkaar</h2>
    <span>Wat vaak terugkomt, en wat niemand doet</span></div>
  <div class="tabelwrap"><table class="tabel">
    <thead><tr><th scope="col">Merk</th>
      ${KOLOMMEN.map(([k, u]) => `<th scope="col"><abbr title="${u}">${k}</abbr></th>`).join('')}
    </tr></thead>
    <tbody>
      ${MERKEN.map(
        ([naam, host, rij]) => `<tr><th scope="row">${naam}<em>${host}</em></th>${rij
          .map((v) => `<td class="v${v === '✓' ? ' ja' : v === '~' ? ' half' : ''}">${v}</td>`)
          .join('')}</tr>`
      ).join('')}
      <tr class="ons"><th scope="row">Wellshave<em>deze pagina</em></th>
        ${['–', '–', '✓', '–', '✓', '✓', '✓', '✓']
          .map((v) => `<td class="v${v === '✓' ? ' ja' : ''}">${v}</td>`)
          .join('')}</tr>
    </tbody>
    <tfoot><tr><th scope="row">Hoeveel van de acht</th>
      ${KOLOMMEN.map((_, i) => `<td class="v">${tel(i)}/8</td>`).join('')}</tr></tfoot>
  </table></div>
  <p class="verg-bij">De laatste kolom is de enige waar alle acht een streepje
    hebben. Geen van deze merken schrijft op wat het níét waarmaakt, en geen laat
    een kritische review zien. Dat blok hadden wij al, en dat blijft.</p>
  <p class="verg-bij">Vier patronen zijn er na één ronde weer <b>uit</b>: de knop
    in de hero, de drie uitkomsten in cijfers, de tijdlijn en de werkwijze. Ze
    stonden er, ze werkten los van elkaar, maar samen maakten ze er een pagina
    van tien blokken van — en een Over ons-pagina die je moet uitzitten leest
    niemand. Dat een patroon bij zes van de acht voorkomt is een argument, geen
    verplichting. Wat overblijft zijn <b>zeven blokken</b> en ongeveer de helft
    van de tekst.</p>
</section>`;

const WIJZ = [
  ['Van tien blokken naar zeven', 'De vorige ronde voegde vier blokken toe uit de vergelijking hierboven. Los van elkaar waren ze te verdedigen; bij elkaar werd het een pagina die je moest uitzitten. Eruit: de resultaatband, de tijdlijn, de werkwijze en de scorebalk met drie productcijfers. De pagina is nu ongeveer <b>40% korter</b>.'],
  ['De hero is halve foto, halve tekst', 'Er stond een sluier overheen, een watermerk erachter, een schuine gouden streep op de naad, een knop en een teller met 180.000+ bestellingen. Dat is een aanbieding, geen kennismaking. Nu: <b>1&#8239;:&#8239;1</b>, foto rechts, tekst links, en verder niets.'],
  ['De kop gaat nu over Wellshave', 'De hero zei <b>&#34;jij bent niet het probleem, je gereedschap is dat wel&#34;</b>. Dat is een productbelofte; hij hoort op de homepage en niet op een Over ons. Er staat nu wie we zijn, met de <b>missie</b> en de <b>visie</b> als twee gelabelde regels eronder in plaats van weggestopt in een lead.'],
  ['Trustpilot in plaats van eigen reviews', 'Het reviewblok haalde zijn citaten uit de winkel zelf. Nu komen ze van <b>nl.trustpilot.com/review/wellshave.nl</b>: zes beoordelingen, letterlijk overgenomen, met de echte TrustScore <b>4,4 uit 985</b> ernaast. Trustpilot is onafhankelijk; een review op je eigen productpagina is dat niet.'],
  ['Een carrousel, geen zesde scherm', 'Zes reviews onder elkaar is weer een scherm scrollen. Het spoor gebruikt <b>scroll-snap</b>: op desktop drie kaarten per stap, mobiel één. Werkt het JavaScript niet, dan blijft het gewoon veegbaar en gaat er niets stuk. De stippen en de pijlen kijken allebei naar <b>scrollLeft</b>, dus vegen en klikken lopen niet uit de pas.'],
  ['Eén teamfoto in plaats van zes rondjes', 'Er stonden zes losse cirkels met een initiaal erin. Nu is het de echte teamfoto, met de namen erín. De tekst schuift met een negatieve marge over de onderste <b>18%</b> van de foto — daar staan geen gezichten meer, want de voorste twee eindigen op driekwart. Niets van de foto wordt weggesneden.'],
  ['De namen staan er niet bij de gezichten', 'Dat was de eerste opzet: een label per gezicht. De losse portretten in de winkel (<b>team_dustin.png</b> en de andere vijf) maken vier van de zes met zekerheid herkenbaar, maar twee niet. Een collega onder de verkeerde naam publiceren is erger dan geen label, dus staan de namen als een rij eronder — in de foto, maar niet aan een gezicht vast.'],
  ['Wat is blijven staan', 'Het verhaal in de ik-vorm, de drie vragen, en het blok met wat we wel en niet beloven. Die drie zijn goedgekeurd zoals ze waren; alleen de alinea&rsquo;s van het verhaal en de subkop bij de vragen zijn een regel korter.'],
  ['Nog steeds geen getal zonder bron', '<b>4,4</b> en <b>985</b> komen van de Trustpilot-pagina zelf. De zes reviews zijn woord voor woord overgenomen, met de naam en de datum die de schrijver er zelf bij zette. De kritische review onder <b>&#34;wat wij niet beloven&#34;</b> is er ook een van Trustpilot, van vier sterren.'],
  ['Taal van de homepage', 'Donker is #0B0B0A met een gouden gloed, licht is een paneel in een dun gouden kader, het accent zit in <b>&lt;b&gt;</b>, mobiel is één echte media query op <b>749px</b>, en boven- en ondermarge komen uit <b>desk_indent_top</b> en de drie andere — want <b>snippets/indent-settings</b> gebruikt een ID-selector die van elke klasse wint.'],
  ['Het beeld is lichter geworden', 'De drie foto&rsquo;s zijn opnieuw gecodeerd op de breedte die ze werkelijk krijgen. De teamfoto ging van <b>7,4&#8239;MB</b> naar <b>173&#8239;KB</b>, en de map met beeld van 1&#8239;MB naar 728&#8239;KB — inclusief een foto die er eerst niet in zat.'],
  ['Alles is een instelling', '78 velden en drie bloktypes: vraag, Trustpilot-beoordeling en persoon. Een review verversen is een blok bijwerken, geen code.'],
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
/* Het vak draagt zelf .ws-ov, zodat de sectie hier in precies dezelfde
   cascade staat als in het thema. Een blanco reset op * zou de padding uit
   het stijlblad overschrijven, dus die staat er bewust niet. */
.scaler img{max-width:100%;height:auto;display:block}
footer{border-top:1px solid var(--rule);padding-top:20px;color:var(--fg-soft);font-size:13px;
  line-height:165%}
footer b{color:var(--fg);font-weight:600}
footer p{margin:0 0 18px;max-width:72ch}
.verg{margin:0 0 46px}
.tabelwrap{overflow-x:auto;border:1px solid var(--rule);border-radius:10px;background:var(--surface)}
.tabel{border-collapse:collapse;width:100%;min-width:840px;font-size:13px}
.tabel th,.tabel td{padding:11px 12px;text-align:left;border-bottom:1px solid var(--rule)}
.tabel thead th{font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;
  color:var(--fg-soft);vertical-align:bottom;line-height:135%}
.tabel thead abbr{text-decoration:none;border-bottom:1px dotted var(--rule);cursor:help}
.tabel tbody th{font-weight:600;white-space:nowrap}
.tabel tbody th em{display:block;font-style:normal;font-size:11px;font-weight:400;
  color:var(--fg-soft);margin-top:2px}
.tabel td.v{text-align:center;font-size:15px;color:var(--fg-soft);
  font-variant-numeric:tabular-nums}
.tabel td.v.ja{color:var(--gold);font-weight:700}
.tabel td.v.half{color:var(--fg-soft);opacity:.8}
.tabel tr.ons th,.tabel tr.ons td{background:rgba(188,129,62,.07)}
.tabel tr.ons th{color:var(--gold)}
.tabel tfoot th,.tabel tfoot td{border-bottom:0;font-size:11px;font-weight:600;
  letter-spacing:.06em;text-transform:uppercase;color:var(--fg-soft)}
.tabel tfoot td.v{font-size:12px}
.verg-bij{font-size:13.5px;line-height:165%;color:var(--fg-soft);margin:14px 0 0;max-width:72ch}
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
    <h1>Over ons, teruggebracht tot zeven blokken</h1>
    <p class="sub">De vorige versie had er tien. Vier zijn eruit omdat de pagina te
      lang werd om te lezen: de resultaatband, de tijdlijn, de werkwijze en de scorebalk.
      De hero is teruggebracht tot <b>halve foto, halve tekst</b> met de missie en de
      visie eronder, het reviewblok is nu een <b>Trustpilot-carrousel</b>, en het team is
      <b>één foto met de namen erin</b>.</p>
    <p class="sub">Elk venster hieronder is een echte weergave op 1440 en op 390 pixels,
      dus de mobiele kolom laat zien wat de media query op 749px werkelijk doet. De
      carrousel werkt in beide kolommen. De tabel eronder is de vergelijking uit de vorige
      ronde, met onze rij bijgewerkt naar wat er nu echt staat.</p>
  </header>

  ${vergelijking}

  ${blokken}

  <footer>
    <p>Tien blokken, waarvan vier nieuw uit de vergelijking hierboven. De rode draad is
      dezelfde gebleven: <b>de klant is het onderwerp, wij zijn het gereedschap</b>. Wat er per
      ronde veranderde en waarom, staat hieronder.</p>
    <div class="wijz">
      ${WIJZ.map(([k, t]) => `<div class="wijz-kaart"><h3>${k}</h3><p>${t}</p></div>`).join('')}
    </div>
  </footer>

</div>

<script>
${script}
</script>

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
