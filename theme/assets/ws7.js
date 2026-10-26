/* Wellshave homepage v7: schuifrijen met een voortgangsbalk.
   De gouden lijn toont hoeveel van de rij je ziet en waar je bent; klik op de balk om te springen.
   In het innovatieblok krijgt de kaart in het midden de klasse is-actief. */
(function () {
  function start(w) {
    if (w.dataset.ws7Klaar) return;
    w.dataset.ws7Klaar = '1';
    var r = w.querySelector('.ws7-rij'), bar = w.querySelector('.ws7-voortgang');
    if (!r) return;
    var f = bar ? bar.querySelector('i') : null, tech = r.classList.contains('ws7-tech');
    function bij() {
      if (f) {
        var zicht = Math.min(1, r.clientWidth / r.scrollWidth), max = r.scrollWidth - r.clientWidth, p = max > 0 ? r.scrollLeft / max : 0;
        f.style.width = (zicht * 100) + '%';
        f.style.left = (p * (1 - zicht) * 100) + '%';
        bar.style.visibility = zicht >= 0.999 ? 'hidden' : '';
      }
      if (tech) {
        var m = r.getBoundingClientRect(), c = m.left + m.width / 2, best = null, d = 1e9;
        Array.prototype.forEach.call(r.children, function (k) {
          var b = k.getBoundingClientRect(), x = Math.abs(b.left + b.width / 2 - c);
          if (x < d) { d = x; best = k; }
        });
        Array.prototype.forEach.call(r.children, function (k) { k.classList.toggle('is-actief', k === best); });
      }
    }
    if (bar) bar.addEventListener('click', function (e) {
      var b = bar.getBoundingClientRect();
      r.scrollTo({ left: (e.clientX - b.left) / b.width * (r.scrollWidth - r.clientWidth), behavior: 'smooth' });
    });
    r.addEventListener('scroll', bij, { passive: true });
    window.addEventListener('resize', bij);
    bij();
  }
  function alles(root) { (root || document).querySelectorAll('.ws7-schuif').forEach(start); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { alles(); });
  else alles();
  document.addEventListener('shopify:section:load', function (e) { alles(e.target); });
})();
