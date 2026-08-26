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
        ${KOLOMMEN.map(() => '<td class="v ja">✓</td>').join('')}</tr>
    </tbody>
    <tfoot><tr><th scope="row">Hoeveel van de acht</th>
      ${KOLOMMEN.map((_, i) => `<td class="v">${tel(i)}/8</td>`).join('')}</tr></tfoot>
  </table></div>
  <p class="verg-bij">De laatste kolom is de enige waar alle acht een streepje
    hebben. Geen van deze merken schrijft op wat het níét waarmaakt, en geen
    van ze laat een kritische review zien. Dat is precies het blok dat wij al
    hadden, dus dat blijft — met er nu een echte review van drie sterren onder.</p>
</section>`;

const WIJZ = [
  ['Knop boven de vouw', 'Zes van de acht zetten hun eerste knop naar de winkel in de hero. Bij ons stond hij pas na tien schermen. Er staat er nu één in blok 1, met de honderd dagen ernaast zodat klikken niets kost.'],
  ['Uitkomsten met een bron eronder', 'Achaté (+7 uur vrije tijd), Moov (+15% adem, −30% stress) en MAE zetten direct onder de hero drie genummerde uitkomsten. Aantrekkelijk, maar bij geen van hen staat waar die percentages vandaan komen. Blok 2 doet de vorm na en zet er de bron bij: <b>4,9 uit 192 beoordelingen</b>, <b>100 dagen</b>, <b>2 jaar</b> — alle drie aanwijsbaar.'],
  ['Een reis met echte jaartallen', 'Cloudpillo is de enige met een uitgewerkte tijdlijn, en die werkt: je ziet een merk groeien in plaats van erover te lezen. Blok 4 doet hetzelfde, en de jaartallen zijn niet gekozen maar opgezocht — het zijn de aanmaakdatums van de producten in de winkel. 2022 is de Groom Guard™, 2023 zijn de neustrimmers.'],
  ['Reviews verdienen een eigen blok', 'Cloudpillo, Meroda en Achaté geven klantcitaten een eigen sectie. Bij ons stond er één citaat verstopt in stap 01, en dat citaat was bovendien nergens in de winkel terug te vinden. Blok 7 heeft nu drie échte reviews en de scores per product — inclusief de <b>4,4</b> van de neustrimmer, want een pagina met alleen negens gelooft niemand.'],
  ['Namen in plaats van rondjes', 'Moov zet zijn team met functie en quote neer, Achaté met een groepsfoto van veertien. Wij hadden drie naamloze avatars in het beloftepaneel. Blok 9 noemt de zes met naam en rol; staat er geen foto, dan vult de cirkel zich met de initiaal in plaats van leeg te blijven.'],
  ['Wat niemand van de acht doet', 'Geen van deze acht pagina&rsquo;s schrijft op wat het merk níét belooft, en geen laat een kritische review zien. Dat blok hadden wij al, en het is nu scherper: onder <b>&#34;wat wij niet beloven&#34;</b> staat een echte review die zegt dat het niet altijd pijnloos is. Dat kost een half sterretje en levert de rest van de pagina geloofwaardigheid op.'],
  ['Wat we níét hebben overgenomen', 'Meroda plakt een productgrid en een Instagram-feed op zijn Over ons; dat maakt er een tweede winkelpagina van. En de missiezinnen van Dore &amp; Rose en Hears (&#34;we&rsquo;re on a mission to elevate sleep into a true wellness experience&#34;) zeggen bij nalezen niets. Onze eerste zin blijft <b>&#34;jij bent niet het probleem&#34;</b>.'],
  ['Een verhaal in de ik-vorm', 'Zes van de acht hebben een oprichtersverhaal; Moov en Achaté ondertekenen het met naam en portret. Blok 3 doet dat ook, en draait elke zin over vroeger om naar de lezer: &#34;ik was installateur&#34; staat er alleen omdat de zin erna is dat verkeerd gereedschap je laat geloven dat jíj degene bent die het niet kan.'],
  ['Ander beeld dan de homepage', 'De hero leende eerder het portret van de homepage. Twee pagina&rsquo;s achter elkaar hetzelfde beeld leest als een herhaling. De hero staat nu in het eigen magazijn tussen de rolcontainers, en blok 3 gebruikt de twee foto&rsquo;s uit de installateurstijd — alle drie al in de winkel aanwezig.'],
  ['Taal van de homepage, niet van de landingspagina', 'De eerste versie stond in het landingspagina-systeem uit de merklaag: tweeslags koppen met een tekstverloop, zand, een los HTML-bestand. Dat systeem is voor verkeer <b>ná een advertentie</b>. Donker is nu #0B0B0A met een gouden gloed, licht is een paneel in een dun gouden kader, en het accent zit in <b>&lt;b&gt;</b>.'],
  ['Eén breekpunt, marge uit de instellingen', 'Mobiel is één echte media query op <b>749px</b>, de grens die het thema zelf aanhoudt. Boven- en ondermarge gaan via <b>desk_indent_top</b> en de drie andere, want <b>snippets/indent-settings</b> gebruikt een ID-selector die van elke klasse wint.'],
  ['Twee specificiteitsvallen weggehaald', '<b>.ws-ov p{margin:0}</b> weegt zwaarder dan een losse klasse, dus <b>.ws-ov__afreden</b> en <b>.ws-ov__mensslot</b> kregen hun bovenmarge niet. En het vak in dit artefact droeg zelf geen <b>.ws-ov</b>, waardoor het hier net anders stond dan in het thema. Allebei rechtgezet.'],
  ['Alles is een instelling', '103 velden en zes bloktypes: uitkomst, vraag, fase, stap, klantcitaat en persoon. Wie een review wil verversen of een jaartal wil bijstellen heeft geen code nodig.'],
];;

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
    <h1>Over ons, gemeten langs acht andere</h1>
    <p class="sub">Acht Over ons-pagina&rsquo;s uit dezelfde hoek van de markt zijn naast elkaar
      gelegd. De patronen die bij de meeste terugkwamen en die wij misten, zitten er nu in:
      een <b>knop boven de vouw</b>, <b>drie uitkomsten in cijfers</b>, een <b>tijdlijn</b>,
      <b>reviews als eigen blok</b> en een <b>team met namen</b>. De tabel hieronder laat zien
      wie wat doet.</p>
    <p class="sub">Verschil met die acht: elk cijfer op deze pagina is aanwijsbaar, de reviews
      zijn letterlijk uit de winkel overgenomen, en er staat één van drie sterren tussen. De
      pagina is een themasectie (<code>ws-overons</code>) met een eigen stijlblad en een
      paginasjabloon. Elk venster hieronder is een echte weergave op 1440 en op 390 pixels,
      dus de mobiele kolom laat zien wat de media query op 749px werkelijk doet.</p>
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
