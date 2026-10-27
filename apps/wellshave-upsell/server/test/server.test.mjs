import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sign, verify, signChangeset} from '../lib/jwt.mjs';
import {matchRule, offersFor, thanksFor, fillText, discounted} from '../lib/rules.mjs';
import {recentlyOffered, seenRules, checkoutUrl} from '../lib/offers.mjs';
import config from '../../config/upsell-config.json' with {type: 'json'};

const V = (n) => `gid://shopify/ProductVariant/${n}`;

test('jwt: ondertekenen en controleren, met audience en verloop', () => {
  const now = Math.floor(Date.now() / 1000);
  const t = sign({aud: 'key', dest: 'https://wellshave.myshopify.com', exp: now + 60}, 'geheim');
  assert.equal(verify(t, 'geheim', {audience: 'key'}).dest, 'https://wellshave.myshopify.com');
  assert.throws(() => verify(t, 'fout'), /handtekening/);
  assert.throws(() => verify('x.y.z', 'geheim'), /handtekening/);
  assert.throws(() => verify(t, 'geheim', {audience: 'ander'}), /audience/);
  assert.throws(() => verify(sign({exp: now - 100}, 'geheim'), 'geheim'), /verlopen/);
  const c = verify(signChangeset({referenceId: 'r1', changes: [], apiKey: 'key', secret: 'geheim'}), 'geheim');
  assert.equal(c.sub, 'r1');
  assert.equal(c.iss, 'key');
});

test('regels: eerste passende regel wint, vangnet voor de rest', () => {
  assert.equal(matchRule(config, ['groom-guard-pro']).id, 'groomguardpro');
  assert.equal(matchRule(config, ['onbekend-product']).id, 'vangnet');
  assert.equal(matchRule(config, ['groom-guard-pro'], {dismissed: ['groomguardpro']}).id, 'vangnet');
});

test('nooit aanbieden wat net gekocht is; bedankpagina herhaalt het aanbod niet', () => {
  const rule = config.rules.find((r) => r.id === 'groomguardpro');
  const first = rule.offers[0].variantId;
  assert.ok(!offersFor(rule, [first]).some((o) => o.variantId === first));
  const offerIds = new Set(rule.offers.map((o) => o.variantId));
  assert.ok(thanksFor(rule, []).every((o) => !offerIds.has(o.variantId)));
});

test('teksten en prijzen', () => {
  assert.equal(fillText('Eenmalig bij je {product}. Nu {korting}%', {productTitle: 'Groom Guard™ PRO', discount: 20}), 'Eenmalig bij je Groom Guard PRO. Nu 20%');
  assert.equal(discounted(24.95, 20), 19.96);
});

test('een aanbod in de laatste twee uur blokkeert een tweede aanbod', () => {
  const now = Date.parse('2026-10-27T12:00:00Z');
  assert.equal(recentlyOffered([{rule: 'a', at: '2026-10-27T11:30:00Z'}], now), true);
  assert.equal(recentlyOffered([{rule: 'a', at: '2026-10-27T08:00:00Z'}], now), false);
  assert.deepEqual(seenRules(['oud', {rule: 'nieuw'}]), ['oud', 'nieuw']);
});

test('checkout-link bevat producten, code, koppeling en ingevulde gegevens', () => {
  const url = new URL(checkoutUrl({
    domain: 'wellshave.com',
    variantIds: [V(1), V(2)],
    code: 'WS-9451-ABC',
    order: {name: '#SHAVE9451', email: 'klant@example.nl', shippingAddress: {firstName: 'Jan', zip: '1234 AB', countryCodeV2: 'NL'}},
  }));
  assert.equal(url.pathname, '/cart/1:1,2:1');
  assert.equal(url.searchParams.get('discount'), 'WS-9451-ABC');
  assert.equal(url.searchParams.get('attributes[_ws_parent]'), '#SHAVE9451');
  assert.equal(url.searchParams.get('checkout[email]'), 'klant@example.nl');
  assert.equal(url.searchParams.get('checkout[shipping_address][zip]'), '1234 AB');
});
