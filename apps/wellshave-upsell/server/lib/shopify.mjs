// Alles wat de server bij Shopify ophaalt of wijzigt, via de Admin GraphQL API.
import {randomBytes} from 'node:crypto';
import bundledConfig from '../../config/upsell-config.json' with {type: 'json'};

export const API_VERSION = '2026-01';
export const NS = 'wellshave_upsell';
export const env = (k) => process.env[k] || '';

// Toegangstoken van de installatie, bewaard in Netlify Blobs (alleen geladen op de server).
const tokens = async () => (await import('@netlify/blobs')).getStore('wellshave-upsell-tokens');

export async function saveToken(shop, token) {
  await (await tokens()).set(shop, token);
}

export async function getToken(shop) {
  if (env('SHOPIFY_ADMIN_TOKEN')) return env('SHOPIFY_ADMIN_TOKEN');
  return (await (await tokens()).get(shop)) || '';
}

export function shopFromDest(dest) {
  // Sessietokens dragen de winkel als https://wellshave.myshopify.com
  return String(dest || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

export async function admin(shop, query, variables = {}) {
  const token = await getToken(shop);
  if (!token) throw new Error(`geen toegangstoken voor ${shop}, installeer de app eerst via /auth`);
  const res = await fetch(`https://${shop}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'X-Shopify-Access-Token': token},
    body: JSON.stringify({query, variables}),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// ---------- instellingen uit de Upsell Studio (shop-metafield) ----------
let cache = {at: 0, value: null};
export async function getConfig(shop) {
  if (cache.value && Date.now() - cache.at < 5 * 60 * 1000) return cache.value;
  const d = await admin(shop, `{ shop { metafield(namespace: "${NS}", key: "config") { value } } }`);
  // De shop-metafield (gezet met sync-config) gaat voor; anders de meegeleverde export.
  const value = d.shop.metafield?.value ? {...JSON.parse(d.shop.metafield.value), source: 'metafield'} : {...bundledConfig, source: 'bundled'};
  cache = {at: Date.now(), value};
  return value;
}

// ---------- producten ----------
export async function variantsInfo(shop, ids) {
  if (!ids.length) return [];
  const d = await admin(
    shop,
    `query($ids:[ID!]!){ nodes(ids:$ids){ ... on ProductVariant { id price availableForSale
      product { title handle featuredMedia { preview { image { url(transform:{maxWidth:400}) } } } } } } }`,
    {ids},
  );
  return d.nodes.filter(Boolean).map((v) => ({
    variantId: v.id,
    title: v.product.title,
    handle: v.product.handle,
    price: Number(v.price),
    image: v.product.featuredMedia?.preview?.image?.url || '',
    available: v.availableForSale,
  }));
}

export async function productHandles(shop, productIds) {
  if (!productIds.length) return [];
  const d = await admin(shop, `query($ids:[ID!]!){ nodes(ids:$ids){ ... on Product { handle title } } }`, {ids: productIds});
  return d.nodes.filter(Boolean);
}

// ---------- orders en klanten ----------
export async function getOrder(shop, orderId) {
  const d = await admin(
    shop,
    `query($id:ID!){ order(id:$id){ id name email tags customAttributes { key value }
      customer { id metafield(namespace:"${NS}", key:"dismissed"){ value } }
      metafield(namespace:"${NS}", key:"state"){ value }
      shippingAddress { firstName lastName address1 address2 zip city countryCodeV2 phone }
      lineItems(first:50){ nodes { variant { id } product { id handle title } } } } }`,
    {id: orderId},
  );
  return d.order;
}

export const dismissedOf = (order) => JSON.parse(order?.customer?.metafield?.value || '[]');
export const stateOf = (order) => JSON.parse(order?.metafield?.value || '{}');

export async function setOrderState(shop, orderId, state) {
  await admin(
    shop,
    `mutation($m:[MetafieldsSetInput!]!){ metafieldsSet(metafields:$m){ userErrors{ message } } }`,
    {m: [{ownerId: orderId, namespace: NS, key: 'state', type: 'json', value: JSON.stringify(state)}]},
  );
}

// "Weg is weg": de regel komt voor deze klant nooit meer terug.
export async function markDismissed(shop, customerId, ruleId, current = [], status = 'dismissed') {
  if (!customerId || current.some((d) => (d.rule || d) === ruleId)) return;
  const next = [...current, {rule: ruleId, at: new Date().toISOString(), status}];
  await admin(
    shop,
    `mutation($m:[MetafieldsSetInput!]!){ metafieldsSet(metafields:$m){ userErrors{ message } } }`,
    {m: [{ownerId: customerId, namespace: NS, key: 'dismissed', type: 'json', value: JSON.stringify(next)}]},
  );
}

export async function addTags(shop, id, tags) {
  await admin(shop, `mutation($id:ID!,$t:[String!]!){ tagsAdd(id:$id, tags:$t){ userErrors{ message } } }`, {id, t: tags});
}

// Unieke code: één keer te gebruiken, vervalt met de klok, en zet ook de verzendkosten op 0.
export async function createUpsellCode(shop, {order, ruleId, pct, variantIds, minutes}) {
  const code = `WS-${order.name.replace(/\D/g, '')}-${randomBytes(3).toString('hex').toUpperCase()}`;
  const endsAt = new Date(Date.now() + Math.max(minutes || 0, 15) * 60 * 1000).toISOString();
  const d = await admin(
    shop,
    `mutation($d:DiscountCodeAppInput!){ discountCodeAppCreate(codeAppDiscount:$d){
      codeAppDiscount{ discountId } userErrors{ field message } } }`,
    {
      d: {
        title: `Upsell ${order.name} (${ruleId})`,
        functionHandle: 'upsell-discount',
        code,
        startsAt: new Date().toISOString(),
        endsAt,
        usageLimit: 1,
        appliesOncePerCustomer: true,
        // Alleen deze klant kan de code gebruiken; doorsturen heeft geen zin.
        context: order.customer?.id ? {customers: {add: [order.customer.id]}} : {all: 'ALL'},
        discountClasses: ['PRODUCT', 'SHIPPING'],
        combinesWith: {orderDiscounts: false, productDiscounts: false, shippingDiscounts: false},
        metafields: [
          {
            namespace: '$app:upsell-discount',
            key: 'function-configuration',
            type: 'json',
            value: JSON.stringify({pct, variantIds, parent: order.name, freeShipping: true}),
          },
        ],
      },
    },
  );
  const errs = d.discountCodeAppCreate.userErrors;
  if (errs.length) throw new Error(errs.map((e) => e.message).join('; '));
  return {code, endsAt};
}
