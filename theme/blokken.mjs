// De zeven blokken van Over ons als losse stukken markup.
//
// Eén bron voor preview.mjs en artifact.mjs, zodat die twee niet uit elkaar
// gaan lopen. De copy komt uit templates/page.ws-overons.json en de opmaak uit
// assets/ws-overons.css, allebei ongewijzigd. Alleen de markup staat hier een
// tweede keer, want een Liquid-renderer hebben we niet. Verbouw je
// sections/ws-overons.liquid, verbouw dan dit bestand mee.
import { readFileSync } from 'node:fs';

const dir = new URL('.', import.meta.url).pathname;

export const css = readFileSync(`${dir}assets/ws-overons.css`, 'utf8');
export const tpl = JSON.parse(readFileSync(`${dir}templates/page.ws-overons.json`, 'utf8'));

const sec = tpl.sections.ws_overons;
export const s = sec.settings;
const blok = (t) => sec.block_order.map((k) => sec.blocks[k]).filter((b) => b.type === t);

// de eigen merkfotografie, ingebed zodat een los bestand overal werkt
const MIME = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
export function beeld(naam) {
  const ext = naam.split('.').pop();
  return `data:${MIME[ext]};base64,${readFileSync(`${dir}beeld/${naam}`).toString('base64')}`;
}

// |br| is in het thema een instelling-vriendelijk regeleinde; hier hetzelfde
const br = (v) => (v || '').replace(/\|br\|/g, '<br>');
const el = (v, fn) => (v ? fn(v) : '');

const ICO = {
  v1: '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.6v5.2M12 16.1v.1" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  v2: '<path d="M3.4 7.2h13l4.2 4.8-4.2 4.8h-13z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.2 12h6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  v3: '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/>',
};
const CHK = '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7.8 12.3l2.9 2.9 5.5-6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>';
const KRS = '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>';
const STR = '<path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z"/>';
const svg = (p) => `<svg viewBox="0 0 24 24">${p}</svg>`;
const pijl =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

const punten = (voor, klas, pad) =>
  [1, 2, 3, 4]
    .map((i) => s[`${voor}_punt_${i}`])
    .filter(Boolean)
    .map((p) => `<li><svg class="${klas}" viewBox="0 0 24 24">${pad}</svg><span>${p}</span></li>`)
    .join('');

const hero = () => `<header class="ws-ov__hero" style="--ws-ov-hero-h:${s.hero_hoogte}px">
  <div class="ws-ov__media">
    <img class="ws-ov__foto" src="${beeld('founder-magazijn.jpg')}" alt="${s.foto_alt}">
  </div>
  <div class="ws-ov__heroin"><div class="ws-ov__heroblok">
    ${el(s.hero_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
    ${el(s.hero_kop, (v) => `<h1 class="ws-ov__h1">${br(v)}</h1>`)}
    <div class="ws-ov__paar">
      ${el(
        s.missie,
        (v) => `<div><p class="ws-ov__paarlabel">${s.missie_label}</p><p class="ws-ov__paartekst">${v}</p></div>`
      )}
      ${el(
        s.visie,
        (v) => `<div><p class="ws-ov__paarlabel">${s.visie_label}</p><p class="ws-ov__paartekst">${v}</p></div>`
      )}
    </div>
  </div></div>
</header>`;

const verhaal = () => `<section class="ws-ov__verhaal"><div class="ws-ov__verhaalin">
  <figure class="ws-ov__beeld">
    <div class="ws-ov__beeld--een"><img src="${beeld('verhaal-1.jpg')}" alt="${s.vh_foto1_alt}" loading="lazy"></div>
    <div class="ws-ov__beeld--twee"><img src="${beeld('verhaal-2.jpg')}" alt="${s.vh_foto2_alt}" loading="lazy"></div>
    ${el(s.vh_bijschrift, (v) => `<figcaption class="ws-ov__bijschrift">${v}</figcaption>`)}
  </figure>
  <div class="ws-ov__verhaalt">
    ${el(s.vh_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
    ${el(s.vh_kop, (v) => `<h2 class="ws-ov__h2 ws-ov__h2--klein">${br(v)}</h2>`)}
    ${[1, 2, 3]
      .map((i) => s[`vh_p${i}`])
      .filter(Boolean)
      .map((v) => `<p class="ws-ov__vtekst">${v}</p>`)
      .join('')}
    ${el(s.vh_les, (v) => `<blockquote class="ws-ov__les">${v}</blockquote>`)}
    ${el(
      s.vh_naam,
      (v) => `<div class="ws-ov__hand">
      <i style="background-image:url(${beeld('founder-magazijn.jpg')})"></i>
      <span><b>${v}</b><em>${s.vh_naam_bij || ''}</em></span>
    </div>`
    )}
  </div>
</div></section>`;

const vragen = () => `<section class="ws-ov__vragen"><div class="ws-ov__rand">
  <img class="ws-ov__randmerk" src="${beeld('hero-logo.png')}" alt="">
  <div class="ws-ov__randin">
    <div class="ws-ov__kop">
      ${el(s.vr_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
      ${el(s.vr_kop, (v) => `<h2 class="ws-ov__h2">${br(v)}</h2>`)}
      ${el(s.vr_sub, (v) => `<p class="ws-ov__sub">${v}</p>`)}
    </div>
    <div class="ws-ov__drie" style="--ws-kol:${Math.min(3, blok('vraag').length)}">
      ${blok('vraag')
        .map(
          (b) => `<article class="ws-ov__vraag">
        <span class="ws-ov__zegel">${svg(ICO[b.settings.icoon] || ICO.v1)}</span>
        ${el(b.settings.nr, (v) => `<p class="ws-ov__vraagnr">${v}</p>`)}
        ${el(b.settings.kop, (v) => `<h3 class="ws-ov__vraagh">${v}</h3>`)}
        ${el(b.settings.tekst, (v) => `<p class="ws-ov__vraagt">${v}</p>`)}
      </article>`
        )
        .join('')}
    </div>
    ${el(s.vr_slot, (v) => `<p class="ws-ov__vraagslot">${svg(CHK)}<span>${v}</span></p>`)}
  </div>
</div></section>`;

const trustpilot = () => `<section class="ws-ov__tp"><div class="ws-ov__tpin">
  <div class="ws-ov__tpkop">
    <div class="ws-ov__tpkoptekst">
      ${el(s.tp_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
      ${el(s.tp_kop, (v) => `<h2 class="ws-ov__h2 ws-ov__h2--klein">${br(v)}</h2>`)}
    </div>
    ${el(
      s.tp_score,
      (v) => `<p class="ws-ov__tpscore">${svg(STR)}<span><b>${v}</b></span><span>${s.tp_aantal}<br><a href="${s.tp_link}" rel="noopener nofollow" target="_blank">op Trustpilot</a></span></p>`
    )}
  </div>
  <div class="ws-ov__spoor" tabindex="0" role="group" aria-label="${s.tp_eyebrow || 'Beoordelingen'}">
    ${blok('review')
      .map(
        (b) => `<article class="ws-ov__tpk">
      <span class="ws-ov__sterren" role="img" aria-label="${b.settings.sterren} van de 5 sterren">${svg(STR).repeat(b.settings.sterren)}</span>
      ${el(b.settings.titel, (v) => `<p class="ws-ov__tpt">${v}</p>`)}
      <blockquote class="ws-ov__tpc">${b.settings.tekst}</blockquote>
      <p class="ws-ov__tpb"><b>${b.settings.naam}</b><em>${b.settings.datum}</em></p>
    </article>`
      )
      .join('')}
  </div>
  <div class="ws-ov__tpnav" data-ws-ov-nav>
    <button class="ws-ov__pijl" type="button" data-ws-ov="terug" aria-label="Vorige beoordelingen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5M11 18l-6-6 6-6"/></svg></button>
    <button class="ws-ov__pijl" type="button" data-ws-ov="verder" aria-label="Volgende beoordelingen">${pijl}</button>
    <span class="ws-ov__stip" data-ws-ov="stippen"></span>
  </div>
</div></section>`;

const belofte = () => `<section class="ws-ov__belofte"><div class="ws-ov__duo" style="--ws-kol:2">
  <div class="ws-ov__paneel">
    <img class="ws-ov__paneelmerk" src="${beeld('hero-logo.png')}" alt="">
    ${el(s.wel_eyebrow, (v) => `<p class="ws-ov__paneelkop">${v}</p>`)}
    ${el(s.wel_kop, (v) => `<h3 class="ws-ov__paneelh">${br(v)}</h3>`)}
    <ul class="ws-ov__lijst">${punten('wel', 'ws-ov__vink', CHK)}</ul>
  </div>
  <div class="ws-ov__paneel ws-ov__paneel--licht">
    <img class="ws-ov__paneelmerk" src="${beeld('hero-logo.png')}" alt="">
    ${el(s.niet_eyebrow, (v) => `<p class="ws-ov__paneelkop">${v}</p>`)}
    ${el(s.niet_kop, (v) => `<h3 class="ws-ov__paneelh">${br(v)}</h3>`)}
    <ul class="ws-ov__lijst">${punten('niet', 'ws-ov__kruis', KRS)}</ul>
    ${el(
      s.tegen_tekst,
      (v) => `<blockquote class="ws-ov__tegen">${el(s.tegen_label, (x) => `<b>${x}</b>`)}<em>${v}</em>${s.tegen_bron ? ` · ${s.tegen_bron}` : ''}</blockquote>`
    )}
  </div>
</div></section>`;

const team = () => `<section class="ws-ov__tm"><div class="ws-ov__tmin">
  <figure class="ws-ov__tmfoto">
    <img src="${beeld('teamfoto.jpg')}" alt="${s.tm_alt}" loading="lazy">
    <figcaption class="ws-ov__tmover">
      ${el(s.tm_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
      ${el(s.tm_kop, (v) => `<h2 class="ws-ov__tmh">${br(v)}</h2>`)}
      <p class="ws-ov__namen">
        ${blok('mens')
          .map((b) => `<span><b>${b.settings.naam}</b><em>${b.settings.rol}</em></span>`)
          .join('')}
      </p>
    </figcaption>
  </figure>
</div></section>`;

const afsluiter = () => `<section class="ws-ov__af"><div class="ws-ov__afin">
  ${el(s.af_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
  ${el(s.af_kop, (v) => `<h2 class="ws-ov__h2--dark">${br(v)}</h2>`)}
  ${el(s.af_sub, (v) => `<p class="ws-ov__sub--dark">${v}</p>`)}
  <div class="ws-ov__knoppen">
    ${el(s.cta1_label, (v) => `<a class="ws-ov__cta" href="${s.cta1_link || '/collections/all'}">${v}${pijl}</a>`)}
    ${el(s.cta2_label, (v) => `<a class="ws-ov__cta ws-ov__cta--rand" href="${s.cta2_link || '/pages/quiz'}">${v}</a>`)}
  </div>
  ${el(s.af_reden, (v) => `<p class="ws-ov__afreden">${v}</p>`)}
</div></section>`;

export const BLOKKEN = [
  { id: 'hero', naam: '1 · Hero', bij: 'Half foto, half tekst. Missie en visie, verder niets.', html: hero },
  { id: 'verhaal', naam: '2 · Het verhaal', bij: 'Waar het begon, meteen omgedraaid naar wat het voor jou betekent.', html: verhaal },
  { id: 'vragen', naam: '3 · De drie vragen', bij: 'Zijn probleem, wat hij al probeerde, waar hij uit wil komen.', html: vragen },
  { id: 'tp', naam: '4 · Trustpilot', bij: 'Zes echte beoordelingen in een carrousel, met de TrustScore.', html: trustpilot },
  { id: 'belofte', naam: '5 · Wel en niet beloven', bij: 'Wat we waarmaken, wat we niet claimen, en één kritische review.', html: belofte },
  { id: 'team', naam: '6 · Het team', bij: 'Eén foto van alle zes, met de namen erin.', html: team },
  { id: 'af', naam: '7 · Afsluiter', bij: 'Terug naar de keuze, met de risiconemers eronder.', html: afsluiter },
];

// de carrousel, letterlijk hetzelfde script als in de sectie
export const script = readFileSync(`${dir}sections/ws-overons.liquid`, 'utf8')
  .match(/<script>\n([\s\S]*?)\n<\/script>/)[1];

// het kale document waar één of alle blokken in gerenderd worden
export const document_ = (inhoud) => `<!DOCTYPE html>
<html lang="nl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Over ons &mdash; Wellshave</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0}
body{background:#F7F2E9;font-family:"Montserrat",sans-serif}
img{max-width:100%;height:auto;display:block}
${css}
</style>
</head><body><div class="ws-ov">${inhoud}</div>
<script>
${script}
</script>
</body></html>`;
