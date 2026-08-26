// Zet de Over ons-sectie om naar één los HTML-bestand om naar te kijken.
//
// De copy komt uit templates/page.ws-overons.json en de opmaak uit
// assets/ws-overons.css, allebei ongewijzigd. Alleen de markup staat hier
// een tweede keer, net als in audits/build-preview.mjs op de homepage-tak:
// een Liquid-renderer hebben we hier niet. Wie de sectie verbouwt, verbouwt
// dit bestand mee — anders kijkt iemand naar een verouderd ontwerp.
//
//   node theme/preview.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('.', import.meta.url).pathname;
const css = readFileSync(`${dir}assets/ws-overons.css`, 'utf8');
const tpl = JSON.parse(readFileSync(`${dir}templates/page.ws-overons.json`, 'utf8'));
const sec = tpl.sections.ws_overons;
const s = sec.settings;
const blok = (t) => sec.block_order.map((k) => sec.blocks[k]).filter((b) => b.type === t);

// |br| is in het thema een instelling-vriendelijk regeleinde; hier hetzelfde.
const br = (v) => (v || '').replace(/\|br\|/g, '<br>');
const el = (v, fn) => (v ? fn(v) : '');

const FOTO = 'https://wellshave.com/cdn/shop/files/freepik_portrait-lifestyle-shot-o_2812538722.png?v=1&width=1600';

const ICO = {
  v1: '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.6v5.2M12 16.1v.1" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  v2: '<path d="M3.4 7.2h13l4.2 4.8-4.2 4.8h-13z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.2 12h6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  v3: '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/>',
};
const CHK = '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7.8 12.3l2.9 2.9 5.5-6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>';
const KRS = '<circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>';
const TEL = '<path d="M17 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M19 8v6M22 11h-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="7" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/>';
const svg = (p) => `<svg viewBox="0 0 24 24">${p}</svg>`;

const punten = (voor, klas, pad) =>
  [1, 2, 3, 4]
    .map((i) => s[`${voor}_punt_${i}`])
    .filter(Boolean)
    .map((p) => `<li><svg class="${klas}" viewBox="0 0 24 24">${pad}</svg><span>${p}</span></li>`)
    .join('');

const html = `<!DOCTYPE html>
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
</head><body>

<div class="ws-ov">

  <header class="ws-ov__hero" style="--ws-ov-hero-h:${s.hero_hoogte}px">
    <div class="ws-ov__media">
      <img class="ws-ov__foto" src="${FOTO}" alt="Man met een handdoek na het douchen, naast een Wellshave-trimmer in het laadstation." width="928" height="929">
      <div class="ws-ov__scrim"></div>
    </div>
    <div class="ws-ov__streep"></div>
    <div class="ws-ov__heroin"><div class="ws-ov__heroblok">
      ${el(s.hero_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
      ${el(s.hero_kop, (v) => `<h1 class="ws-ov__h1">${br(v)}</h1>`)}
      ${el(s.hero_lead, (v) => `<p class="ws-ov__lead">${v}</p>`)}
      ${el(s.tel_getal, (v) => `<p class="ws-ov__teller">${svg(TEL)}<span><b>${v}</b><em>${s.tel_label}</em></span></p>`)}
    </div></div>
  </header>

  <section class="ws-ov__vragen"><div class="ws-ov__rand"><div class="ws-ov__randin">
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
  </div></div></section>

  <section class="ws-ov__werk"><div class="ws-ov__werkin">
    <div class="ws-ov__werkkop">
      ${el(s.wk_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
      ${el(s.wk_kop, (v) => `<h2 class="ws-ov__h2--dark">${br(v)}</h2>`)}
      ${el(s.wk_sub, (v) => `<p class="ws-ov__sub--dark">${v}</p>`)}
    </div>
    <div class="ws-ov__stappen" style="--ws-kol:${Math.min(3, blok('stap').length)}">
      ${blok('stap')
        .map(
          (b) => `<div class="ws-ov__stap">
        <p class="ws-ov__cijfer">${b.settings.cijfer}</p>
        ${el(b.settings.label, (v) => `<p class="ws-ov__staplabel">${v}</p>`)}
        ${el(b.settings.tekst, (v) => `<p class="ws-ov__staptekst">${v}</p>`)}
        ${el(
          b.settings.citaat,
          (v) =>
            `<blockquote class="ws-ov__stem">${v}${
              b.settings.citaat_bron ? `<b>${b.settings.citaat_bron}</b>` : ''
            }</blockquote>`
        )}
      </div>`
        )
        .join('')}
    </div>
  </div></section>

  <section class="ws-ov__belofte"><div class="ws-ov__duo" style="--ws-kol:2">
    <div class="ws-ov__paneel">
      ${el(s.wel_eyebrow, (v) => `<p class="ws-ov__paneelkop">${v}</p>`)}
      ${el(s.wel_kop, (v) => `<h3 class="ws-ov__paneelh">${br(v)}</h3>`)}
      <ul class="ws-ov__lijst">${punten('wel', 'ws-ov__vink', CHK)}</ul>
      ${el(
        s.team_titel,
        (v) => `<div class="ws-ov__team"><span><b>${v}</b><em>${s.team_tekst || ''}</em></span></div>`
      )}
    </div>
    <div class="ws-ov__paneel ws-ov__paneel--licht">
      ${el(s.niet_eyebrow, (v) => `<p class="ws-ov__paneelkop">${v}</p>`)}
      ${el(s.niet_kop, (v) => `<h3 class="ws-ov__paneelh">${br(v)}</h3>`)}
      <ul class="ws-ov__lijst">${punten('niet', 'ws-ov__kruis', KRS)}</ul>
    </div>
  </div></section>

  <section class="ws-ov__af"><div class="ws-ov__afin">
    ${el(s.af_eyebrow, (v) => `<p class="ws-ov__eyebrow">${v}</p>`)}
    ${el(s.af_kop, (v) => `<h2 class="ws-ov__h2--dark">${br(v)}</h2>`)}
    ${el(s.af_sub, (v) => `<p class="ws-ov__sub--dark">${v}</p>`)}
    <div class="ws-ov__knoppen">
      ${el(
        s.cta1_label,
        (v) =>
          `<a class="ws-ov__cta" href="${s.cta1_link || '/collections/all'}">${v}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a>`
      )}
      ${el(
        s.cta2_label,
        (v) => `<a class="ws-ov__cta ws-ov__cta--rand" href="${s.cta2_link || '/pages/quiz'}">${v}</a>`
      )}
    </div>
    ${el(s.af_reden, (v) => `<p class="ws-ov__afreden">${v}</p>`)}
  </div></section>

</div>
</body></html>
`;

writeFileSync(`${dir}over-ons.preview.html`, html);
console.log('geschreven: theme/over-ons.preview.html');
