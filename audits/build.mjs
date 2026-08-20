// Zet een .template.html om naar het publiceerbare bestand door de
// beeldplaceholders te vervangen door inline data-URI's uit audits/assets/.
import { readFileSync, writeFileSync } from 'node:fs';

const ASSETS = {
  __LOGO__:         ['assets/hero-logo.png',    'image/png'],
  __LOGODONKER__:   ['assets/hero-logo-donker.png','image/png'],
  __PORTRAIT__:     ['assets/hero-portrait.jpg','image/jpeg'],
  __MIRROR__:       ['assets/hero-mirror.jpg',  'image/jpeg'],
  __MARK__:      ['assets/mark.png',            'image/png'],
  __USE__:       ['assets/use-neustrimmer.jpg', 'image/jpeg'],
  __BUNDLEBIG__: ['assets/bundel-dark.jpg',     'image/jpeg'],
  __BUNDELPACK__: ['assets/bundel-pack.webp',   'image/webp'],
  __ZONE_LICHAAM__: ['assets/best-lichaam.webp', 'image/webp'],
  __ZONE_GEZICHT__: ['assets/best-gezicht.webp', 'image/webp'],
  __ZONE_HOOFD__:   ['assets/best-hoofd.webp',   'image/webp'],
  __ZONE_NEUS__:    ['assets/best-neus.webp',    'image/webp'],
  __BEST_LICHAAM__: ['assets/best-lichaam.webp','image/webp'],
  __BEST_NEUS__:    ['assets/best-neus.webp',   'image/webp'],
  __BEST_GEZICHT__: ['assets/best-gezicht.webp','image/webp'],
  __BEST_HOOFD__:   ['assets/best-hoofd.webp',  'image/webp'],
  __BEST_SCHAAM__:  ['assets/best-schaamstreek.webp','image/webp'],
  __KKMARK__:       ['assets/kieskeurig-woordmerk.png','image/png'],
  __GEN_GG__:       ['assets/gen-groomguard.webp','image/webp'],
  __GEN_NT__:       ['assets/gen-neustrimmer.webp','image/webp'],
  __GEN_MSGOLD__:    ['assets/gen-msgold.webp','image/webp'],
  __GEN_MSSUPREME__: ['assets/gen-mssupreme.webp','image/webp'],
  __GEN_HEADDELUXE__: ['assets/gen-headdeluxe.webp','image/webp'],
  __GEN_SENTINEL__:  ['assets/gen-sentinel.webp','image/webp'],
  __GEN_TONDELUXE__: ['assets/gen-tondeluxe.webp','image/webp'],
  __GEN_BARBERBRO__: ['assets/gen-barberbro.webp','image/webp'],
  __GEN_FLEXBLADE__: ['assets/gen-flexblade.webp','image/webp'],
  __GEN_FLEXTRIO__:  ['assets/gen-flextrio.webp','image/webp'],
  __KKBEST__:       ['assets/kk-best-reviewed.png','image/png'],
  __KKTEST__:       ['assets/kk-testpanel.png',   'image/png'],
};

const name = process.argv[2];
if (!name) throw new Error('gebruik: node build.mjs <bestandsnaam-zonder-extensie>');

const dir = new URL('.', import.meta.url).pathname;
let html = readFileSync(`${dir}${name}.template.html`, 'utf8');

// Zonder dit raadt de browser de codering bij het openen van een lokaal
// bestand. Dat ging bij drie blokken goed en bij het vierde niet: ™ werd â„¢
// en één werd Ã©Ã©n. Nooit op raden vertrouwen.
if (!/<meta\s+charset/i.test(html)) html = '<meta charset="utf-8">\n' + html;

for (const [token, [file, mime]] of Object.entries(ASSETS)) {
  const hits = html.split(token).length - 1;
  if (!hits) continue;
  const b64 = readFileSync(`${dir}${file}`).toString('base64');
  html = html.replaceAll(token, `data:${mime};base64,${b64}`);
  console.log(`${token} -> ${file} (${Math.round(b64.length / 1024)} kB b64, ${hits}x)`);
}

const left = html.match(/__[A-Z0-9]+__/g);
if (left) throw new Error(`nog niet ingevulde placeholders: ${[...new Set(left)].join(', ')}`);

writeFileSync(`${dir}${name}.html`, html);
console.log(`geschreven: ${name}.html (${Math.round(html.length / 1024)} kB)`);
