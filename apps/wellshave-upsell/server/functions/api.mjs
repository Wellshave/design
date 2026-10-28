// Eén Netlify-functie voor alle routes van de upsell-app.
import {createHmac, randomBytes, timingSafeEqual} from 'node:crypto';
import {verify, signChangeset} from '../lib/jwt.mjs';
import {
  env, saveToken, shopFromDest, getConfig, getOrder, dismissedOf, stateOf, setOrderState,
  markDismissed, addTags, createUpsellCode, productHandles, admin, addToOrder, removeFromOrder,
} from '../lib/shopify.mjs';
import {settle, PAY_MINUTES, WAIT_TAG} from '../lib/settle.mjs';
import {buildOffer, recentlyOffered, checkoutUrl} from '../lib/offers.mjs';
import {refillsFor} from '../lib/refills.mjs';

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
  // De order staat soms pas een paar seconden later in de Admin: laat de pagina het opnieuw proberen.
  if (!order) return json({mode: 'pending'});
  if (order.customAttributes?.some((a) => a.key === '_ws_parent')) {
    return json({mode: 'upsell-confirmation', parent: order.customAttributes.find((a) => a.key === '_ws_parent').value});
  }
  let state = stateOf(order);
  if (state.mode === 'edit' && state.status === 'accepted') {
    await settle(shop, order);
    state = stateOf(await getOrder(shop, order.id));
  }
  if (state.mode === 'edit' && state.status === 'paid') return json({mode: 'upsell-confirmation', parent: order.name, reminder: await reminderBlock(shop, order)});
  if (state.status === 'dismissed' || state.status === 'expired' || state.status === 'unpaid') return json({mode: 'none', reminder: await reminderBlock(shop, order)});
  const dismissed = dismissedOf(order);
  const config = await getConfig(shop);
  const offer = await buildOffer(shop, config, {...purchasedFrom(order), dismissed});
  if (!offer) return json({mode: 'none', reminder: await reminderBlock(shop, order)});
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

// Voorbeeld voor de checkout-editor (daar bestaat geen echte bestelling).
async function thankYouPreview(req) {
  const {shop} = checkoutSession(req);
  const config = await getConfig(shop);
  const first = [...(config.rules || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .flatMap((r) => (r.triggers || []).map((t) => t.handle || t)).find((h) => h && h !== '*');
  const d = first ? await admin(shop, 'query($h:String!){ productByIdentifier(identifier:{handle:$h}){ title } }', {h: first}) : null;
  const offer = await buildOffer(shop, config, {purchasedHandles: [first], purchasedVariantIds: [], dismissed: [], productTitle: d?.productByIdentifier?.title});
  if (!offer) return json({mode: 'none'});
  const minutes = offer.settings.timerMin || 0;
  return json({mode: 'offer', preview: true, state: 'shown', expiresAt: minutes ? new Date(Date.now() + minutes * 60000).toISOString() : null, ...offer});
}

async function reminderBlock(shop, order) {
  const config = await getConfig(shop);
  const s = config.settings || {};
  if (!s.remOn || !env('KLAVIYO_PRIVATE_KEY')) return null;
  return refillsFor(purchasedFrom(order).purchasedHandles, config.refills).length ? {remText: s.remText, remWeeks: s.remWeeks ?? 8} : null;
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
  // Zoals AfterSell: in dezelfde order, de klant betaalt alleen het restbedrag (ook met iDEAL).
  // Lukt dat niet, dan valt het terug op een aparte checkout met een unieke code.
  try {
    const r = await addToOrder(shop, order.id, {
      items: offer.offers.filter((o) => chosen.includes(o.variantId)),
      pct: offer.discount,
      note: `Upsell (${offer.ruleId}): klant betaalt het restbedrag. Niet betaald binnen ${PAY_MINUTES} minuten, dan wordt het automatisch verwijderd.`,
    });
    if (r.url && r.outstanding > 0) {
      const at = new Date().toISOString();
      const endsAt = new Date(Date.now() + PAY_MINUTES * 60000).toISOString();
      await setOrderState(shop, order.id, {status: 'accepted', mode: 'edit', ruleId: offer.ruleId, lineItemIds: r.lineItemIds, endsAt, url: r.url, at});
      await markDismissed(shop, order.customer?.id, offer.ruleId, dismissedOf(order), 'accepted');
      await addTags(shop, order.id, ['upsell-aangeboden', WAIT_TAG]);
      return {url: r.url};
    }
    if (r.lineItemIds.length) await removeFromOrder(shop, order.id, r.lineItemIds, 'Upsell teruggedraaid: geen betaallink.');
  } catch (e) {
    console.error('order bewerken mislukt, aparte checkout', e);
  }
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
  const config = await getConfig(shop);
  const refills = refillsFor(purchasedFrom(order).purchasedHandles, config.refills);
  if (!refills.length) return json({error: 'Geen product met vervangmesjes in deze bestelling.'}, 400);
  const s = config.settings || {};
  const weeks = s.remWeeks ?? 8;
  const remindAt = new Date(Date.now() + weeks * 7 * 864e5).toISOString().slice(0, 10);
  const res = await fetch('https://a.klaviyo.com/api/events', {
    method: 'POST',
    headers: {Authorization: `Klaviyo-API-Key ${key}`, revision: '2025-01-15', 'Content-Type': 'application/json', accept: 'application/json'},
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          properties: {
            order: order.name,
            products: order.lineItems.nodes.map((l) => l.product?.title).filter(Boolean),
            herinner_op: remindAt,
            // Voor de knop in de mail: wat de klant opnieuw nodig heeft.
            vervanging: refills,
            vervanging_url: `https://${STORE_DOMAIN()}/products/${encodeURIComponent(refills[0])}`,
          },
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
  const d = await admin(shop, `query($q:String!){ orders(first:1, query:$q){ nodes{ id note } } }`, {q: `name:${parent}`});
  const p = d.orders.nodes[0];
  // Notitie voor het magazijn: de notitie staat op de pakbon en in de order.
  await addNote(shop, o.admin_graphql_api_id, o.note, `UPSELL: samen verzenden met ${parent}.`);
  if (p) {
    await addTags(shop, p.id, [tag, 'heeft-upsell']);
    await addNote(shop, p.id, p.note, `UPSELL: wacht op ${o.name}, samen verzenden.`);
  }
  return new Response('ok');
}

async function addNote(shop, id, current, line) {
  if (String(current || '').includes(line)) return;
  const note = current ? `${current}\n${line}` : line;
  await admin(shop, `mutation($i:OrderInput!){ orderUpdate(input:$i){ userErrors{ message } } }`, {i: {id, note}});
}

async function compliance(req) {
  const raw = await req.text();
  if (!webhookValid(req, raw)) return new Response('ongeldige hmac', {status: 401});
  // De app bewaart geen klantgegevens buiten Shopify (alleen metafields op klant en order).
  return new Response('ok');
}


// ---------- eenmalig: Klaviyo-flow voor de herinnering aanmaken (doet niets als hij al bestaat) ----------
const REMINDER_FLOW = 'WS | Herinnering vervangmesjes';
async function klaviyo(path, init = {}, revision = '2025-10-15') {
  const res = await fetch(`https://a.klaviyo.com/api${path}`, {
    ...init,
    headers: {Authorization: `Klaviyo-API-Key ${env('KLAVIYO_PRIVATE_KEY')}`, revision, accept: 'application/json', 'Content-Type': 'application/json'},
  });
  return {status: res.status, body: await res.json().catch(() => ({}))};
}

async function setupReminderFlow(url) {
  const found = await klaviyo(`/flows?filter=${encodeURIComponent(`equals(name,"${REMINDER_FLOW}")`)}`);
  let flow = found.body.data?.[0];
  const tried = [];
  if (!flow) {
    const metrics = await klaviyo('/metrics');
    const metric = (metrics.body.data || []).find((m) => m.attributes.name === 'Herinnering vervangmesjes aangevraagd');
    if (!metric) return json({error: 'metric niet gevonden'}, 404);
    const body = {data: {type: 'flow', attributes: {name: REMINDER_FLOW, definition: {
      triggers: [{type: 'metric', id: metric.id, trigger_filter: null}],
      profile_filter: null,
      entry_action_id: 'wacht',
      actions: [
        {temporary_id: 'wacht', type: 'time-delay', data: {unit: 'days', value: 56, secondary_value: null, timezone: 'profile'}, links: {next: 'mail'}},
        {temporary_id: 'mail', type: 'send-email', links: {next: null}, data: {status: 'draft', message: {
          from_email: 'marketing@wellshave.nl', from_label: 'Wellshave®', reply_to_email: 'contact@wellshave.com', cc_email: null, bcc_email: null,
          subject_line: 'Tijd voor verse mesjes', preview_text: 'Je vroeg ons om een seintje. Hier is het.',
          template_id: 'UBtPrv', smart_sending_enabled: false, transactional: false, add_tracking_params: true,
          custom_tracking_params: null, additional_filters: null, name: 'Herinnering vervangmesjes',
        }}},
      ],
    }}}};
    for (const rev of ['2025-10-15', '2025-07-15', '2025-04-15', '2025-01-15.pre', '2024-10-15.pre']) {
      const r = await klaviyo('/flows', {method: 'POST', body: JSON.stringify(body)}, rev);
      tried.push({rev, status: r.status, errors: r.body.errors?.map((e) => e.detail)});
      if (r.status < 300) { flow = r.body.data; break; }
    }
  }
  if (flow && url.searchParams.get('live') === '1') {
    const full = await klaviyo(`/flows/${flow.id}?additional-fields[flow]=definition`);
    for (const a of full.body.data?.attributes?.definition?.actions || []) {
      if (a.type !== 'send-email' || a.data.status === 'live') continue;
      const definition = {...a, data: {...a.data, status: 'live'}};
      const r = await klaviyo(`/flow-actions/${a.id}`, {method: 'PATCH', body: JSON.stringify({data: {type: 'flow-action', id: a.id, attributes: {definition}}})});
      tried.push({action: a.id, status: r.status, errors: r.body.errors?.map((e) => e.detail)});
    }
    const r = await klaviyo(`/flows/${flow.id}`, {method: 'PATCH', body: JSON.stringify({data: {type: 'flow', id: flow.id, attributes: {status: 'live'}}})});
    tried.push({flowLive: r.status, errors: r.body.errors?.map((e) => e.detail)});
  }
  return json({flow: flow ? {id: flow.id, name: flow.attributes?.name, status: flow.attributes?.status} : null, tried});
}

// ---------- status (geen geheimen, alleen of alles aangesloten is) ----------
async function health(url) {
  const shop = url.searchParams.get('shop') || 'wellshave.myshopify.com';
  const out = {keys: Boolean(API_KEY() && SECRET()), installed: false, rules: 0, configSource: null};
  try {
    const config = await getConfig(shop);
    out.installed = true;
    out.rules = (config.rules || []).length;
    out.configSource = config.source;
    const sc = await admin(shop, '{ currentAppInstallation { accessScopes { handle } } }');
    out.orderEdits = sc.currentAppInstallation.accessScopes.some((a) => a.handle === 'write_order_edits') ? 'goedgekeurd' : 'nog goedkeuren';
    out.scopes = sc.currentAppInstallation.accessScopes.map((a) => a.handle);
    out.tokenSource = env('SHOPIFY_ADMIN_TOKEN') ? 'env' : 'blobs';
  } catch (e) {
    out.error = /toegangstoken/.test(e.message) ? 'nog niet geïnstalleerd' : 'Shopify niet bereikbaar';
  }
  out.klaviyo = await klaviyoStatus();
  return json(out, out.installed && out.keys ? 200 : 503);
}

// Werkt de Klaviyo-sleutel? Alleen de uitkomst, nooit de sleutel zelf.
async function klaviyoStatus() {
  const key = env('KLAVIYO_PRIVATE_KEY');
  if (!key) return 'ontbreekt';
  try {
    const res = await fetch('https://a.klaviyo.com/api/metrics?fields[metric]=name', {
      headers: {Authorization: `Klaviyo-API-Key ${key}`, revision: '2025-01-15', accept: 'application/json'},
    });
    return res.ok ? 'werkt' : res.status === 401 ? 'ongeldig' : `fout ${res.status}`;
  } catch {
    return 'niet bereikbaar';
  }
}

// ---------- installatie (eenmalig) ----------
function oauthStart(url) {
  const shop = url.searchParams.get('shop');
  if (!/^[a-z0-9-]+\.myshopify\.com$/.test(shop || '')) return new Response('shop ontbreekt', {status: 400});
  const state = randomBytes(12).toString('hex');
  const scopes = 'read_orders,write_orders,write_order_edits,read_customers,write_customers,read_products,write_discounts';
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
  'POST /api/thank-you/preview': thankYouPreview,
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
  if (req.method === 'GET' && url.pathname === '/api/health') return health(url);
  if (req.method === 'POST' && url.pathname === '/api/setup/klaviyo-reminder-flow') return setupReminderFlow(url);
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
