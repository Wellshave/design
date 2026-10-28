// Bouwt het aanbod dat de extensies tonen. Eén aanbod per bestelling, en een regel die
// een klant ooit zag (geaccepteerd of weggeklikt) komt voor die klant nooit meer terug.
import {matchRule, offersFor, thanksFor, fillText, discounted} from './rules.mjs';
import {variantsInfo, env} from './shopify.mjs';
import {refillsFor} from './refills.mjs';

export const SEEN_WINDOW_MS = 2 * 60 * 60 * 1000;

export function seenRules(dismissed) {
  return dismissed.map((d) => (typeof d === 'string' ? d : d.rule));
}

// Heeft deze klant de afgelopen twee uur al een aanbod gekregen? Dan was dat bij deze
// bestelling (pagina na betaling), en tonen we op de bedankpagina geen tweede.
export function recentlyOffered(dismissed, now = Date.now()) {
  return dismissed.some((d) => typeof d === 'object' && now - Date.parse(d.at) < SEEN_WINDOW_MS);
}

export async function buildOffer(shop, config, {purchasedHandles, purchasedVariantIds, dismissed, productTitle}) {
  const rule = matchRule(config, purchasedHandles, {dismissed: seenRules(dismissed)});
  if (!rule) return null;
  const s = config.settings || {};
  const offerRefs = offersFor(rule, purchasedVariantIds);
  const thankRefs = thanksFor(rule, purchasedVariantIds);
  const info = await variantsInfo(shop, [...offerRefs, ...thankRefs].map((o) => o.variantId));
  const byId = Object.fromEntries(info.map((v) => [v.variantId, v]));
  const pct = rule.discount || 0;
  const offers = offerRefs
    .map((o) => byId[o.variantId])
    .filter((v) => v && v.available)
    .map((v) => ({...v, offerPrice: discounted(v.price, pct)}));
  if (!offers.length) return null;
  const tyPct = s.tyDisc || 0;
  const thanks = thankRefs
    .map((o) => byId[o.variantId])
    .filter((v) => v && v.available)
    .map((v) => ({...v, offerPrice: discounted(v.price, tyPct)}));
  const ctx = {productTitle, offerTitle: offers[0].title, discount: pct};
  return {
    ruleId: rule.id,
    discount: pct,
    headline: fillText(rule.headline, ctx),
    headline2: fillText(rule.headline2, ctx),
    sub: fillText(rule.sub, ctx),
    offers,
    thanks,
    settings: {
      timerMin: s.timerMin ?? 10,
      lcTitle: s.lcTitle,
      lcTitle2: s.lcTitle2,
      lcText: s.lcText,
      noText: s.noText,
      tyTitle: s.tyTitle,
      tyDisc: tyPct,
      code: s.code,
      // Alleen bij producten met mesjes of een kop die op raken, en alleen met Klaviyo-sleutel.
      remOn: !!s.remOn && Boolean(env('KLAVIYO_PRIVATE_KEY')) && refillsFor(purchasedHandles, config.refills).length > 0,
      remText: s.remText,
      remWeeks: s.remWeeks ?? 8,
    },
  };
}

// Korte checkout met alles al ingevuld; de unieke code zet ook verzending op 0.
export function checkoutUrl({domain, variantIds, code, order}) {
  const items = variantIds.map((id) => `${String(id).split('/').pop()}:1`).join(',');
  const p = new URLSearchParams();
  p.set('discount', code);
  p.set('attributes[_ws_parent]', order.name);
  if (order.email) p.set('checkout[email]', order.email);
  const a = order.shippingAddress;
  if (a) {
    const map = {first_name: a.firstName, last_name: a.lastName, address1: a.address1, address2: a.address2, zip: a.zip, city: a.city, country: a.countryCodeV2, phone: a.phone};
    for (const [k, v] of Object.entries(map)) if (v) p.set(`checkout[shipping_address][${k}]`, v);
  }
  return `https://${domain}/cart/${items}?${p.toString()}`;
}
