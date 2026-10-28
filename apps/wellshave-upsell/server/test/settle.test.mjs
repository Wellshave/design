import {test} from 'node:test';
import assert from 'node:assert/strict';

process.env.SHOPIFY_ADMIN_TOKEN = 'test';
const {settle, WAIT_TAG} = await import('../lib/settle.mjs');

// Neemt alle Admin-aanroepen op in plaats van ze naar Shopify te sturen.
function fakeShopify() {
  const calls = [];
  globalThis.fetch = async (_url, init) => {
    const {query, variables} = JSON.parse(init.body);
    calls.push({query, variables});
    const data = query.includes('orderEditBegin') ? {orderEditBegin: {calculatedOrder: {id: 'calc'}, userErrors: []}} : new Proxy({}, {get: () => ({userErrors: []})});
    return {json: async () => ({data})};
  };
  return calls;
}

const order = (outstanding, state) => ({
  id: 'gid://shopify/Order/1',
  totalOutstandingSet: {shopMoney: {amount: String(outstanding)}},
  metafield: {value: JSON.stringify(state)},
});
const base = {status: 'accepted', mode: 'edit', ruleId: 'groomguard', lineItemIds: ['gid://shopify/LineItem/77'], endsAt: '2026-10-28T10:00:00Z'};

test('betaald: markeren en wachttag weg, niets verwijderen', async () => {
  const calls = fakeShopify();
  assert.equal(await settle('s', order(0, base), Date.parse('2026-10-28T09:40:00Z')), 'paid');
  assert.ok(!calls.some((c) => c.query.includes('orderEditSetQuantity')));
  assert.ok(calls.some((c) => c.query.includes('tagsRemove') && c.variables.t.includes(WAIT_TAG)));
  assert.ok(calls.some((c) => c.query.includes('metafieldsSet') && c.variables.m[0].value.includes('"paid"')));
});

test('nog binnen de betaaltijd: niets doen', async () => {
  const calls = fakeShopify();
  assert.equal(await settle('s', order(11.96, base), Date.parse('2026-10-28T09:40:00Z')), 'waiting');
  assert.equal(calls.length, 0);
});

test('niet betaald na de betaaltijd: toegevoegde regel op 0 en voorraad terug', async () => {
  const calls = fakeShopify();
  assert.equal(await settle('s', order(11.96, base), Date.parse('2026-10-28T10:01:00Z')), 'unpaid');
  const q = calls.find((c) => c.query.includes('orderEditSetQuantity'));
  assert.equal(q.variables.l, 'gid://shopify/CalculatedLineItem/77');
  assert.ok(calls.some((c) => c.query.includes('orderEditCommit')));
});

test('andere statussen laten we met rust', async () => {
  const calls = fakeShopify();
  assert.equal(await settle('s', order(0, {status: 'shown'})), 'shown');
  assert.equal(calls.length, 0);
});

test('bundel: onderdelen samen precies de aanbiedingsprijs', async () => {
  const {bundleLines} = await import('../lib/shopify.mjs');
  const lines = bundleLines([{quantity: 3, productVariant: {id: 'blade', price: '14.95'}}], 19.96);
  assert.deepEqual(lines.map((l) => [l.variantId, l.quantity]), [['blade', 3]]);
  assert.equal(Math.round(44.85 * (1 - lines[0].pct / 100) * 100) / 100, 19.96);
});
