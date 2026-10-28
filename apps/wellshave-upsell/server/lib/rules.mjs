// Zelfde regels als in de Upsell Studio: de eerste actieve regel die past wint,
// een regel met trigger "*" vangt de rest op.

export function matchRule(config, purchasedHandles, {dismissed = []} = {}) {
  const handles = new Set(purchasedHandles);
  const rules = [...(config.rules || [])]
    .filter((r) => r.active !== false && (r.offers || []).length && !dismissed.includes(r.id))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const trig = (r) => (r.triggers || []).map((t) => (typeof t === 'string' ? t : t.handle));
  return (
    rules.find((r) => trig(r).some((h) => h !== '*' && handles.has(h))) ||
    rules.find((r) => trig(r).includes('*')) ||
    null
  );
}

// Producten die de klant net kocht nooit opnieuw aanbieden.
export function offersFor(rule, purchasedVariantIds = []) {
  const bought = new Set(purchasedVariantIds.map(String));
  return (rule.offers || []).filter((o) => !bought.has(String(o.variantId))).slice(0, 3);
}

// Bedankpagina: niet de producten die al na betaling werden aangeboden (belofte "weg is weg").
export function thanksFor(rule, purchasedVariantIds = []) {
  const blocked = new Set([...purchasedVariantIds.map(String), ...(rule.offers || []).map((o) => String(o.variantId))]);
  return (rule.thanks || []).filter((o) => !blocked.has(String(o.variantId))).slice(0, 4);
}

const short = (t) => String(t || '').replace(/™/g, '').replace(/\s+–.*$/, '').trim();

export function fillText(text, {productTitle, offerTitle, discount}) {
  return String(text || '')
    .replaceAll('{product}', short(productTitle) || 'je bestelling')
    .replaceAll('{aanbod}', short(offerTitle))
    .replaceAll('{korting}', String(discount ?? 0));
}

export const discounted = (price, pct) => Math.round(Number(price) * (100 - pct)) / 100;
