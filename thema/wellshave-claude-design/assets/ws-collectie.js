/* Wellshave — collectiepagina.
   Bindt de keuzehulp uit ws-collectie-kop aan het raster uit ws-collectie-raster.
   De beslistabel komt uit <script type="application/json" id="ws-collectie-keuze">. */
(function () {
  'use strict';

  var bron = document.getElementById('ws-collectie-keuze');
  var CFG = { tabel: [], woord: {}, standaard: '' };
  if (bron) { try { CFG = JSON.parse(bron.textContent) || CFG; } catch (e) {} }

  /* ── de keuzehulp ── */
  function kies() {
    var rijen = document.querySelectorAll('.wsc .keuzes');
    if (!rijen.length) return;
    var nu = {};
    rijen.forEach(function (rij) {
      var b = rij.querySelector('.keuze[aria-pressed="true"]');
      if (b) nu[rij.dataset.groep] = b.dataset.v;
    });

    var id = CFG.standaard;
    for (var i = 0; i < CFG.tabel.length; i++) {
      var r = CFG.tabel[i], raak = true;
      for (var k in r.w) {
        if (r.w[k] !== '*' && nu[k] !== r.w[k]) { raak = false; break; }
      }
      if (raak) { id = r.id; break; }
    }

    // De match verschijnt pas als élke vraag beantwoord is. Zolang dat niet zo is,
    // is er nog geen advies te geven en zou een paneel doen alsof van wel.
    var rijen2 = document.querySelectorAll('.wsc .vraagrij');
    var af = 0;
    rijen2.forEach(function (r) { if (r.classList.contains('klaar')) af++; });
    var compleet = rijen2.length > 0 && af === rijen2.length;

    document.querySelectorAll('.wsc .matchpaneel').forEach(function (p) {
      p.classList.toggle('aan', compleet && p.dataset.id === id);
    });

    var kaart = document.querySelector('.wsc .kiescard');
    if (kaart) kaart.classList.toggle('compleet', compleet);
    stapper(af, rijen2.length);

    var woorden = [];
    for (var g in nu) { if (CFG.woord[g] && CFG.woord[g][nu[g]]) woorden.push(CFG.woord[g][nu[g]]); }
    document.dispatchEvent(new CustomEvent('ws:keuze', {
      detail: { id: id, regel: woorden.join(' · ') }
    }));
  }

  // De teller en de bolletjes bovenaan, plus de kop die omschakelt zodra alles
  // beantwoord is. Het aantal stappen staat niet vast: het volgt de vraagblokken.
  function stapper(af, totaal) {
    // Elk bolletje hoort bij zijn eigen vraag, niet bij een positie in de telling:
    // heropen je stap 1 terwijl stap 2 al beantwoord is, dan moet bolletje twee
    // gevuld blijven en bolletje één weer leeg.
    var bollen = document.querySelectorAll('.wsc .stapper .sb');
    var rijen = document.querySelectorAll('.wsc .vraagrij');
    bollen.forEach(function (b, i) {
      var r = rijen[i];
      b.classList.toggle('af', !!r && r.classList.contains('klaar'));
      b.classList.toggle('nu', !!r && r.classList.contains('nu'));
    });
    var t = document.querySelector('.wsc .stapper-af');
    if (t) t.textContent = af;

    var compleet = totaal > 0 && af === totaal;
    ['.wsc .kiescard-kop', '.wsc .kiescard-sub'].forEach(function (sel) {
      var e = document.querySelector(sel);
      if (!e) return;
      var tekst = compleet ? e.dataset.af : e.dataset.open;
      e.textContent = tekst || '';
      e.hidden = !tekst;
    });
  }

  // Een vraag beantwoorden klapt hem dicht en opent de eerstvolgende die nog leeg is.
  function stapVooruit(rij) {
    rij.classList.remove('nu');
    rij.classList.add('klaar');
    var b = rij.querySelector('.keuze[aria-pressed="true"]');
    var a = rij.querySelector('.vr-antwoord');
    if (a) a.textContent = b ? b.textContent.trim() : '';
    var volgende = null;
    document.querySelectorAll('.wsc .vraagrij').forEach(function (r) {
      if (!volgende && !r.classList.contains('klaar')) volgende = r;
    });
    document.querySelectorAll('.wsc .vraagrij').forEach(function (r) { r.classList.remove('nu'); });
    if (volgende) volgende.classList.add('nu');
  }

  // Het potlood zet één vraag weer open zonder de andere antwoorden kwijt te raken.
  function heropen(rij) {
    document.querySelectorAll('.wsc .vraagrij').forEach(function (r) { r.classList.remove('nu'); });
    rij.classList.remove('klaar');
    rij.classList.add('nu');
    kies();
  }

  /* ── het raster ── */
  function tel() {
    var actief = document.querySelector('.wsc [data-groep="cat"] .filter[aria-pressed="true"]');
    var cat = actief ? actief.dataset.cat : 'alles', n = 0;
    document.querySelectorAll('.wsc .groep').forEach(function (g) {
      var uit = cat !== 'alles' && g.dataset.cat !== cat;
      g.classList.toggle('uit', uit);
      if (!uit) n += g.querySelectorAll('.wsk').length;
    });
    var t = document.querySelector('.wsc .telling');
    if (t) t.textContent = n + ' artikel' + (n === 1 ? '' : 'en');
    var f = document.querySelector('.wsc .fb-telling');
    if (f) f.textContent = n;
  }

  function gekozen() {
    return [].slice.call(document.querySelectorAll('.wsc .wsk-vgl input:checked'));
  }

  function vgltel() {
    var aan = gekozen();
    document.querySelectorAll('.wsc .wsk-vgl input').forEach(function (i) {
      i.disabled = !i.checked && aan.length >= 3;
    });
    document.querySelectorAll('.wsc .fb-knop.vgl-open').forEach(function (b) {
      b.disabled = aan.length < 2;
    });
    document.querySelectorAll('.vgl-tel').forEach(function (t) {
      t.textContent = aan.length ? ' (' + aan.length + ')' : '';
    });

    // De balk onder in beeld: hij verschijnt zodra er iets is aangevinkt, zodat de
    // bezoeker niet terug hoeft te scrollen naar de knop in de filterbalk.
    var balk = document.querySelector('.wsc-laag .vgl-balk');
    if (balk) {
      balk.hidden = aan.length === 0;
      document.body.classList.toggle('vgl-balk-aan', aan.length > 0);
      var b = balk.querySelector('.vgl-balk-tel b');
      if (b) b.textContent = aan.length;
      var k = balk.querySelector('.vgl-open');
      if (k) k.disabled = aan.length < 2;
    }
  }

  function wisKeuze() {
    document.querySelectorAll('.wsc .wsk-vgl input:checked').forEach(function (i) { i.checked = false; });
    vgltel();
  }

  var vgl_vorige = null;   // waar de focus vandaan kwam, zodat hij daar weer belandt

  function toonVergelijking() {
    var aan = gekozen().map(function (i) { return i.closest('.wsk').dataset.id; });
    if (aan.length < 2) return;
    document.querySelectorAll('.wsc-laag .vgl').forEach(function (v) {
      v.classList.toggle('uit', aan.indexOf(v.dataset.id) < 0);
    });
    var u = document.querySelector('.wsc-laag .vgl-uit');
    if (!u) return;
    vgl_vorige = document.activeElement;
    u.hidden = false;
    document.body.classList.add('vgl-open');
    var sl = u.querySelector('.vgl-sluit');
    if (sl) sl.focus();
    var rij = u.querySelector('.vergelijk');
    if (rij) rij.scrollLeft = 0;
  }

  function sluitVergelijking() {
    var u = document.querySelector('.wsc-laag .vgl-uit');
    if (!u || u.hidden) return;
    u.hidden = true;
    document.body.classList.remove('vgl-open');
    if (vgl_vorige && vgl_vorige.focus) vgl_vorige.focus();
    vgl_vorige = null;
  }

  // `id` is het korte id uit de beslistabel ("elite"); de kaarten in het raster staan
  // op de producthandle ("neustrimmer-2in1-elite"). Het matchpaneel kent allebei, dus
  // die vertaalt. Zonder deze stap bleef "Beste match" op elke kaart onzichtbaar.
  function zetMatch(id, regel) {
    var paneel = document.querySelector('.wsc .matchpaneel[data-id="' + id + '"]');
    var handle = paneel && paneel.dataset.handle;
    document.querySelectorAll('.wsc .wsk').forEach(function (k) {
      var isMatch = !!handle && k.dataset.id === handle;
      k.classList.toggle('match', isMatch);
      var t = k.querySelector('.wsk-tag.matchtag');
      if (isMatch && !t) {
        t = document.createElement('span');
        t.className = 'wsk-tag matchtag';
        t.textContent = k.dataset.matchlabel || 'Beste match';
        var shot = k.querySelector('.wsk-shot');
        shot.insertBefore(t, shot.firstChild);
      }
      if (t) t.style.display = isMatch ? '' : 'none';
      var eigen = k.querySelector('.wsk-tag:not(.matchtag)');
      if (eigen) eigen.style.display = isMatch ? 'none' : '';
    });
    var r = document.querySelector('.wsc .keuzeregel');
    if (r && regel) r.textContent = regel;
  }

  /* ── bedrading ── */
  /* De zonebalk is op de telefoon een schuifstrip. Het spoor eronder laat zien
     dat er nog tegels naast staan en hoe ver je bent. Staat alles al in beeld,
     dan gaat het spoor weg — een volle balk die niet beweegt is ruis. */
  function zonespoor() {
    var strip = document.querySelector('.wsc .zonekiezer');
    var spoor = document.querySelector('.wsc .zk-spoor');
    if (!strip || !spoor) return;
    var duim = spoor.querySelector('.zk-duim');

    function teken() {
      var over = strip.scrollWidth - strip.clientWidth;
      if (over <= 2) { spoor.hidden = true; return; }
      spoor.hidden = false;
      var deel = strip.clientWidth / strip.scrollWidth;      /* hoeveel er in beeld staat */
      var breed = Math.max(deel * 100, 14);                  /* onder de 14% wordt de duim een stip */
      duim.style.width = breed + '%';
      var ruimte = 100 - breed;                              /* wat de duim nog kan afleggen */
      duim.style.transform = 'translateX(' + (strip.scrollLeft / over) * ruimte * (100 / breed) + '%)';
    }

    if (strip.dataset.spoor !== 'aan') {
      strip.dataset.spoor = 'aan';
      strip.addEventListener('scroll', teken, { passive: true });
      if (window.ResizeObserver) new ResizeObserver(teken).observe(strip);
      else window.addEventListener('resize', teken);
    }
    teken();
  }

  /* De keuzehulp staat in de bron boven het raster, want hij hoort bij de sectie
     ws-collectie-kop en die staat nu eenmaal eerst. Op de pagina hoort hij ónder de
     eerste productgroep: vier vragen zijn 491 px, en zolang dat blok boven de kaarten
     staat begint het eerste product op de telefoon pas op 1679 px. Hij staat verborgen
     in de HTML en komt hier tevoorschijn — zonder JavaScript werkt de hulp toch niet,
     dus dan is verborgen beter dan een dode kaart boven de producten.
     Staat er geen raster, dan blijft hij waar hij staat en houdt hij zijn eigen marge. */
  function verhuisHulp() {
    var hulp = document.getElementById('ws-keuzehulp');
    if (!hulp) return;
    var groep = document.querySelector('.wsc .groep');
    if (groep && groep.nextElementSibling !== hulp) {
      groep.parentNode.insertBefore(hulp, groep.nextSibling);
    }
    hulp.classList.toggle('in-raster', !!groep);
    hulp.hidden = false;
  }

  // De regel in de hero brengt je naar de kaart en zet de cursor op de eerste vraag,
  // zodat je met het toetsenbord verder kunt zonder terug te zoeken.
  function naarHulp(e) {
    var hulp = document.getElementById('ws-keuzehulp');
    if (!hulp || hulp.hidden) return;
    e.preventDefault();
    var zacht = !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    hulp.scrollIntoView({ behavior: zacht ? 'smooth' : 'auto', block: 'start' });
    var eerste = hulp.querySelector('.vraagrij.nu .keuze') || hulp.querySelector('.keuze');
    if (eerste) window.setTimeout(function () { eerste.focus({ preventScroll: true }); }, zacht ? 420 : 0);
  }

  function wire() {
    verhuisHulp();
    document.querySelectorAll('.wsc .hero-hulp').forEach(function (a) {
      if (a.dataset.gekoppeld === 'ja') return;
      a.dataset.gekoppeld = 'ja';
      a.addEventListener('click', naarHulp);
    });

    document.querySelectorAll('.wsc .zones').forEach(function (rij) {
      rij.querySelectorAll('.zone').forEach(function (b) {
        b.addEventListener('click', function (e) {
          if (b.tagName === 'A') return;            /* een echte link laat je met rust */
          e.preventDefault();
          rij.querySelectorAll('.zone').forEach(function (x) { x.removeAttribute('aria-current'); });
          b.setAttribute('aria-current', 'true');
        });
      });
    });

    document.querySelectorAll('.wsc .filters').forEach(function (rij) {
      rij.querySelectorAll('.filter').forEach(function (b) {
        b.addEventListener('click', function () {
          rij.querySelectorAll('.filter').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          if (rij.dataset.groep === 'cat') tel();
        });
      });
    });

    document.querySelectorAll('.wsc .keuzes').forEach(function (rij) {
      rij.querySelectorAll('.keuze').forEach(function (b) {
        b.addEventListener('click', function () {
          rij.querySelectorAll('.keuze').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          var vr = rij.closest('.vraagrij');
          if (vr) stapVooruit(vr);
          kies();
        });
      });
    });

    document.querySelectorAll('.wsc .vr-wijzig').forEach(function (b) {
      b.addEventListener('click', function () {
        var vr = b.closest('.vraagrij');
        if (vr) heropen(vr);
      });
    });
    // Een dichtgeklapte rij is zelf ook aanklikbaar; het potlood is de aanwijzing.
    document.querySelectorAll('.wsc .vraagrij').forEach(function (vr) {
      vr.addEventListener('click', function (e) {
        if (!vr.classList.contains('klaar')) return;
        if (e.target.closest('.keuze') || e.target.closest('.vr-wijzig')) return;
        heropen(vr);
      });
    });

    document.querySelectorAll('.wsc .kies-opnieuw').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.wsc .vraagrij').forEach(function (r, i) {
          r.classList.remove('klaar', 'nu');
          if (i === 0) r.classList.add('nu');
          r.querySelectorAll('.keuze').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          var a = r.querySelector('.vr-antwoord'); if (a) a.textContent = '';
        });
        kies();
        var k = document.querySelector('.wsc .kiescard');
        if (k) k.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    document.querySelectorAll('.wsc .vknop').forEach(function (b) {
      b.addEventListener('click', function () {
        var item = b.parentElement, open = item.classList.toggle('open');
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    document.querySelectorAll('.wsc .wsk-oog').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        b.closest('.wsk').classList.toggle('blik');
      });
    });
    document.querySelectorAll('.wsc .wsk-blik').forEach(function (p) {
      p.addEventListener('click', function () { p.closest('.wsk').classList.remove('blik'); });
    });

    document.querySelectorAll('.wsc .wsk-vgl input').forEach(function (i) {
      i.addEventListener('change', vgltel);
    });
    document.querySelectorAll('.vgl-open').forEach(function (b) {
      b.addEventListener('click', toonVergelijking);
    });
    // het kruisje en de waas sluiten allebei; escape ook
    document.querySelectorAll('[data-vgl-sluit]').forEach(function (b) {
      b.addEventListener('click', sluitVergelijking);
    });
    document.querySelectorAll('.vgl-balk-wis').forEach(function (b) {
      b.addEventListener('click', wisKeuze);
    });
    if (!document.body.dataset.vglEsc) {
      document.body.dataset.vglEsc = '1';
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') sluitVergelijking();
      });
    }

    // Sorteren. De oorspronkelijke volgorde is de redactionele volgorde uit het
    // sjabloon; die leggen we één keer vast zodat "Meest relevant" er altijd naar
    // terug kan. Er wordt per groep gesorteerd, want een groep is een keuze van de
    // redactie en die willen we niet door elkaar husselen.
    document.querySelectorAll('.wsc .kaarten').forEach(function (raster) {
      [].slice.call(raster.children).forEach(function (k, i) {
        if (!k.dataset.volgorde) k.dataset.volgorde = i;
      });
    });

    function sorteer(sleutel) {
      document.querySelectorAll('.wsc .kaarten').forEach(function (raster) {
        var kaarten = [].slice.call(raster.children);
        kaarten.sort(function (a, b) {
          var av, bv;
          if (sleutel === 'prijs-op' || sleutel === 'prijs-af') {
            av = parseInt(a.dataset.prijs || '0', 10);
            bv = parseInt(b.dataset.prijs || '0', 10);
            if (av !== bv) return sleutel === 'prijs-op' ? av - bv : bv - av;
          } else if (sleutel === 'score') {
            av = parseFloat(a.dataset.score || '0');
            bv = parseFloat(b.dataset.score || '0');
            // zonder beoordeling achteraan: een leeg vakje is geen slechte score
            if (av !== bv) return bv - av;
          }
          return parseInt(a.dataset.volgorde, 10) - parseInt(b.dataset.volgorde, 10);
        });
        kaarten.forEach(function (k) { raster.appendChild(k); });
      });
    }

    document.querySelectorAll('.wsc [data-sorteer]').forEach(function (kiezer) {
      kiezer.addEventListener('change', function () {
        sorteer(kiezer.value);
        var t = kiezer.closest('.fb-sorteer');
        t = t && t.querySelector('.fb-sorteer-tekst');
        if (t) t.textContent = kiezer.options[kiezer.selectedIndex].textContent;
      });
    });

    zonespoor();

    if (document.querySelector('.wsc [data-groep="cat"]')) tel();
    if (document.querySelector('.wsc .wsk-vgl')) vgltel();
    if (document.querySelector('.wsc .wsk')) {
      document.addEventListener('ws:keuze', function (e) { zetMatch(e.detail.id, e.detail.regel); });
    }
    kies();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  /* de theme-editor bouwt secties opnieuw op */
  document.addEventListener('shopify:section:load', wire);
})();
