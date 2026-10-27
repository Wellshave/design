// Eén Netlify-functie voor alle routes van de upsell-app.
import {createHmac, randomBytes, timingSafeEqual} from 'node:crypto';
import {verify, signChangeset} from '../lib/jwt.mjs';
import {
  env, saveToken, shopFromDest, getConfig, getOrder, dismissedOf, stateOf, setOrderState,
  markDismissed, addTags, createUpsellCode, productHandles, admin,
} from '../lib/shopify.mjs';
import {buildOffer, recentlyOffered, checkoutUrl} from '../lib/offers.mjs';

export const config = {path: ['/auth', '/auth/callback', '/api/*']};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body, status = 200) => new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json', ...CORS}});
const SECRET = () => env('SHOPIFY_API_SECRET');
const API_KEY = () => env('SHOPIFY_API_KEY');
const STORE_DOMAIN = () => env('STORE_DOMAIN') || 'wellshave.com';

// Sessietoken van de bedankpagina-extensie.
function checkoutSession(req, tokenOverride) {
  const token = tokenOverride || (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const claims = verify(token, SECRET(), {audience: API_KEY()});
  return {shop: shopFromDest(claims.dest), claims};
}

function purchasedFrom(order) {
  const lines = order.lineItems.nodes.filter((l) => l.product);
  return {
    purchasedHandles: lines.map((l) => l.product.handle),
    purchasedVariantIds: lines.map((l) => l.variant?.id).filter(Boolean),
    productTitle: lines[0]?.product.title,
  };
}

// ---------- bedankpagina ----------
async function thankYouOffer(req) {
  const {shop} = checkoutSession(req);
  const {orderId} = await req.json();
  const order = await getOrder(shop, orderId);
  if (!order) return json({mode: 'none'});
  if (order.customAttributes?.some((a) => a.key === '_ws_parent')) {
    return json({mode: 'upsell-confirmation', parent: order.customAttributes.find((a) => a.key === '_ws_parent').value});
  }
  const state = stateOf(order);
  if (state.status === 'dismissed' || state.status === 'expired') return json({mode: 'none', reminder: await reminderBlock(shop, order)});
  const dismissed = dismissedOf(order);
  const config = await getConfig(shop);
  const offer = await buildOffer(shop, config, {...purchasedFrom(order), dismissed});
  if (!offer) return json({mode: 'none'});
  // De pagina na betaling heeft bij deze bestelling al een aanbod getoond: alleen de cross-sell.
  if (recentlyOffered(dismissed) && !state.status) return json({mode: 'thanks-only', ...offer, offers: []});
  // De klok start bij de eerste keer tonen en loopt door, ook na herladen.
  const shownAt = state.shownAt || new Date().toISOString();
  const minutes = offer.settings.timerMin || 0;
  const expiresAt = state.endsAt || (minutes ? new Date(Date.parse(shownAt) + minutes * 60000).toISOString() : null);
  if (expiresAt && Date.parse(expiresAt) < Date.now()) {
    if (state.status !== 'expired') {
      await setOrderState(shop, order.id, {...state, status: 'expired'});
      await markDismissed(shop, order.customer?.id, offer.ruleId, dismissed, 'expired');
    }
    return json({mode: 'thanks-only', ...offer, offers: []});
  }
  if (!state.status) await setOrderState(shop, order.id, {status: 'shown', ruleId: offer.ruleId, shownAt});
  return json({mode: 'offer', state: state.status || 'shown', expiresAt, ...offer});
}

async function reminderBlock(shop, order) {
  const s = (await getConfig(shop)).settings || {};
  return s.remOn ? {remText: s.remText, remWeeks: s.remWeeks ?? 8} : null;
}

async function thankYouAccept(req) {
  const {shop} = checkoutSession(req);
  const {orderId, variantIds = []} = await req.json();
  const r = await acceptCore(shop, orderId, variantIds);
  return r.url ? json({url: r.url}) : json({error: r.error}, r.status);
}

// De knop op de bedankpagina is een gewone link hierheen: de code wordt gemaakt en de
// klant gaat in één beweging door naar de checkout.
async function thankYouGo(url) {
  const {shop} = checkoutSession(null, url.searchParams.get('token'));
  const r = await acceptCore(shop, url.searchParams.get('order'), (url.searchParams.get('v') || '').split(',').filter(Boolean));
  if (r.url) return new Response(null, {status: 302, headers: {Location: r.url}});
  return new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:Inter,system-ui,sans-serif;padding:32px;max-width:420px;margin:auto"><h1 style="font-weight:500;letter-spacing:-.03em">${r.error}</h1><p><a href="https://${STORE_DOMAIN()}">Terug naar Wellshave</a></p>`, {status: r.status, headers: {'Content-Type': 'text/html; charset=utf-8'}});
}

async function acceptCore(shop, orderId, variantIds) {
  const order = await getOrder(shop, orderId);
  if (!order) return {error: 'Bestelling niet gevonden.', status: 404};
  const state = stateOf(order);
  if (state.status === 'dismissed' || state.status === 'expired') return {error: 'Dit aanbod is niet meer beschikbaar.', status: 410};
  if (state.status === 'accepted' && Date.parse(state.endsAt) > Date.now() && state.url) return {url: state.url};
  if (state.status === 'accepted') return {error: 'Dit aanbod is verlopen.', status: 410};
  const minutes = (await getConfig(shop)).settings?.timerMin || 0;
  if (minutes && state.shownAt && Date.parse(state.shownAt) + minutes * 60000 < Date.now()) return {error: 'Dit aanbod is verlopen.', status: 410};
  const config = await getConfig(shop);
  const offer = await buildOffer(shop, config, {...purchasedFrom(order), dismissed: dismissedOf(order)});
  if (!offer) return {error: 'Geen aanbod gevonden.', status: 404};
  const allowed = new Set(offer.offers.map((o) => o.variantId));
  const chosen = variantIds.filter((v) => allowed.has(v));
  if (!chosen.length) return {error: 'Kies minstens één product.', status: 400};
  // Code blijft 30 minuten geldig om af te rekenen (tijd voor de bank-app).
  const {code, endsAt} = await createUpsellCode(shop, {order, ruleId: offer.ruleId, pct: offer.discount, variantIds: chosen, minutes: 30});
  const url = checkoutUrl({domain: STORE_DOMAIN(), variantIds: chosen, code, order});
  await setOrderState(shop, order.id, {status: 'accepted', ruleId: offer.ruleId, code, endsAt, url, at: new Date().toISOString()});
  await markDismissed(shop, order.customer?.id, offer.ruleId, dismissedOf(order), 'accepted');
  await addTags(shop, order.id, ['upsell-aangeboden']);
  return {url};
}

async function thankYouDismiss(req) {
  const {shop} = checkoutSession(req);
  const {orderId} = await req.json();
  const order = await getOrder(shop, orderId);
  const state = stateOf(order);
  const ruleId = state.ruleId;
  await setOrderState(shop, order.id, {...state, status: 'dismissed', at: new Date().toISOString()});
  if (ruleId) await markDismissed(shop, order.customer?.id, ruleId, dismissedOf(order), 'dismissed');
  return json({ok: true});
}

// "Ja, herinner mij": één Klaviyo-event, waar de flow voor vervangmesjes op start.
async function reminder(req) {
  const {shop} = checkoutSession(req);
  const {orderId} = await req.json();
  const order = await getOrder(shop, orderId);
  const key = env('KLAVIYO_PRIVATE_KEY');
  if (!key) return json({error: 'Klaviyo is nog niet gekoppeld.'}, 503);
  const s = (await getConfig(shop)).settings || {};
  const weeks = s.remWeeks ?? 8;
  const remindAt = new Date(Date.now() + weeks * 7 * 864e5).toISOString().slice(0, 10);
  const res = await fetch('https://a.klaviyo.com/api/events', {
    method: 'POST',
    headers: {Authorization: `Klaviyo-API-Key ${key}`, revision: '2025-01-15', 'Content-Type': 'application/json', accept: 'application/json'},
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          properties: {order: order.name, products: order.lineItems.nodes.map((l) => l.product?.title).filter(Boolean), herinner_op: remindAt},
          metric: {data: {type: 'metric', attributes: {name: 'Herinnering vervangmesjes aangevraagd'}}},
          profile: {data: {type: 'profile', attributes: {email: order.email}}},
          unique_id: `herinnering-${order.id}`,
        },
      },
    }),
  });
  if (!res.ok) return json({error: 'Herinnering kon niet worden opgeslagen.'}, 502);
  await addTags(shop, order.id, ['herinnering-vervangmesjes']);
  return json({ok: true, remindAt});
}

// ---------- pagina na betaling (kaart, Shop Pay, PayPal) ----------
function postPurchaseClaims(req) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  return verify(token, SECRET());
}

async function postPurchaseOffer(req) {
  const claims = postPurchaseClaims(req);
  const body = await req.json();
  const shop = shopFromDest(claims.dest || body.shopDomain);
  const productIds = [...new Set((body.lineItems || []).map((l) => `gid://shopify/Product/${l.productId}`))];
  const products = await productHandles(shop, productIds);
  const dismissed = await customerDismissed(shop, body.customerId);
  const config = await getConfig(shop);
  const offer = await buildOffer(shop, config, {
    purchasedHandles: products.map((p) => p.handle),
    purchasedVariantIds: (body.lineItems || []).map((l) => `gid://shopify/ProductVariant/${l.variantId}`),
    dismissed,
    productTitle: products[0]?.title,
  });
  if (!offer) return json({render: false});
  return json({render: true, ...offer, thanks: []});
}

async function customerDismissed(shop, customerId) {
  if (!customerId) return [];
  const id = String(customerId).startsWith('gid://') ? customerId : `gid://shopify/Customer/${customerId}`;
  const d = await admin(shop, `query($id:ID!){ customer(id:$id){ metafield(namespace:"wellshave_upsell", key:"dismissed"){ value } } }`, {id});
  return JSON.parse(d.customer?.metafield?.value || '[]');
}

async function postPurchaseSign(req) {
  const claims = postPurchaseClaims(req);
  const body = await req.json();
  const shop = shopFromDest(claims.dest || body.shopDomain);
  const {referenceId, variantIds = [], discount, ruleId, customerId} = body;
  // Opnieuw berekenen in plaats van de korting uit de browser te vertrouwen.
  const config = await getConfig(shop);
  const rule = (config.rules || []).find((r) => r.id === ruleId);
  if (!rule || rule.discount !== discount) return json({error: 'Aanbod gewijzigd'}, 409);
  const allowed = new Set(rule.offers.map((o) => o.variantId));
  const changes = variantIds
    .filter((v) => allowed.has(v))
    .map((v) => ({
      type: 'add_variant',
      variantId: Number(String(v).split('/').pop()),
      quantity: 1,
      discount: {value: discount, valueType: 'percentage', title: `${discount}% extra korting`},
    }));
  if (!changes.length) return json({error: 'Geen producten gekozen'}, 400);
  await markDismissed(shop, customerId && `gid://shopify/Customer/${String(customerId).split('/').pop()}`, ruleId, await customerDismissed(shop, customerId), 'accepted');
  return json({token: signChangeset({referenceId, changes, apiKey: API_KEY(), secret: SECRET()})});
}

async function postPurchaseDismiss(req) {
  const claims = postPurchaseClaims(req);
  const body = await req.json();
  const shop = shopFromDest(claims.dest || body.shopDomain);
  if (body.customerId && body.ruleId) {
    const id = `gid://shopify/Customer/${String(body.customerId).split('/').pop()}`;
    await markDismissed(shop, id, body.ruleId, await customerDismissed(shop, body.customerId), 'dismissed');
  }
  return json({ok: true});
}

// ---------- webhooks ----------
function webhookValid(req, raw) {
  const given = Buffer.from(req.headers.get('x-shopify-hmac-sha256') || '', 'base64');
  const expected = createHmac('sha256', SECRET()).update(raw).digest();
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// Tweede (iDEAL-)order koppelen aan de eerste, zodat ze in één pakket gaan.
async function ordersCreate(req) {
  const raw = await req.text();
  if (!webhookValid(req, raw)) return new Response('ongeldige hmac', {status: 401});
  const shop = req.headers.get('x-shopify-shop-domain');
  const o = JSON.parse(raw);
  const parent = (o.note_attributes || []).find((a) => a.name === '_ws_parent')?.value;
  if (!parent) return new Response('ok');
  const tag = `upsell-bundel-${parent.replace(/\D/g, '')}`;
  await addTags(shop, o.admin_graphql_api_id, [tag, 'upsell-order']);
  const d = await admin(shop, `query($q:String!){ orders(first:1, query:$q){ nodes{ id } } }`, {q: `name:${parent}`});
  const parentId = d.orders.nodes[0]?.id;
  if (parentId) await addTags(shop, parentId, [tag, 'heeft-upsell']);
  return new Response('ok');
}

async function compliance(req) {
  const raw = await req.text();
  if (!webhookValid(req, raw)) return new Response('ongeldige hmac', {status: 401});
  // De app bewaart geen klantgegevens buiten Shopify (alleen metafields op klant en order).
  return new Response('ok');
}

// ---------- installatie (eenmalig) ----------
function oauthStart(url) {
  const shop = url.searchParams.get('shop');
  if (!/^[a-z0-9-]+\.myshopify\.com$/.test(shop || '')) return new Response('shop ontbreekt', {status: 400});
  const state = randomBytes(12).toString('hex');
  const scopes = 'read_orders,write_orders,read_customers,write_customers,read_products,write_discounts';
  const redirect = `${url.origin}/auth/callback`;
  const to = `https://${shop}/admin/oauth/authorize?client_id=${API_KEY()}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirect)}&state=${state}`;
  return new Response(null, {status: 302, headers: {Location: to, 'Set-Cookie': `ws_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/auth`}});
}

async function oauthCallback(req, url) {
  const p = Object.fromEntries(url.searchParams);
  const cookie = (req.headers.get('cookie') || '').match(/ws_state=([a-f0-9]+)/)?.[1];
  if (!cookie || cookie !== p.state) return new Response('state klopt niet', {status: 400});
  const {hmac, ...rest} = p;
  const msg = Object.keys(rest).sort().map((k) => `${k}=${rest[k]}`).join('&');
  const expected = createHmac('sha256', SECRET()).update(msg).digest('hex');
  if (!hmac || hmac.length !== expected.length || !timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))) return new Response('hmac klopt niet', {status: 400});
  const res = await fetch(`https://${p.shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({client_id: API_KEY(), client_secret: SECRET(), code: p.code}),
  });
  const {access_token} = await res.json();
  if (!access_token) return new Response('geen token ontvangen', {status: 502});
  await saveToken(p.shop, access_token);
  return new Response('Wellshave Upsell is gekoppeld. Je kunt dit venster sluiten.', {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}

const routes = {
  'POST /api/thank-you/offer': thankYouOffer,
  'POST /api/thank-you/accept': thankYouAccept,
  'POST /api/thank-you/dismiss': thankYouDismiss,
  'POST /api/thank-you/reminder': reminder,
  'POST /api/post-purchase/offer': postPurchaseOffer,
  'POST /api/post-purchase/sign': postPurchaseSign,
  'POST /api/post-purchase/dismiss': postPurchaseDismiss,
  'POST /api/webhooks/orders-create': ordersCreate,
  'POST /api/webhooks/compliance': compliance,
};

export default async function handler(req) {
  const url = new URL(req.url);
  if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: CORS});
  if (url.pathname === '/auth') return oauthStart(url);
  if (url.pathname === '/auth/callback') return oauthCallback(req, url);
  if (req.method === 'GET' && url.pathname === '/api/thank-you/go') {
    try { return await thankYouGo(url); } catch (e) { console.error(e); return new Response('Deze link is verlopen. Ga terug en probeer het opnieuw.', {status: 401}); }
  }
  const fn = routes[`${req.method} ${url.pathname}`];
  if (!fn) return json({error: 'niet gevonden'}, 404);
  try {
    return await fn(req);
  } catch (e) {
    const auth = /handtekening|verlopen|audience|drie delen|algoritme/.test(e.message);
    console.error(url.pathname, e);
    return json({error: auth ? 'Niet geautoriseerd' : 'Er ging iets mis'}, auth ? 401 : 500);
  }
}
