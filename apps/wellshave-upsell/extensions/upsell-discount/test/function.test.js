import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cartLinesDiscountsGenerateRun, cartDeliveryOptionsDiscountsGenerateRun} from '../src/index.js';

const cfg = {pct: 20, variantIds: ['gid://shopify/ProductVariant/1'], freeShipping: true};
const discount = (classes, c = cfg) => ({discountClasses: classes, metafield: {value: JSON.stringify(c)}});

test('alleen aangeboden varianten krijgen korting, één stuk per regel', () => {
  const out = cartLinesDiscountsGenerateRun({
    cart: {lines: [
      {id: 'a', quantity: 3, merchandise: {__typename: 'ProductVariant', id: 'gid://shopify/ProductVariant/1'}},
      {id: 'b', quantity: 1, merchandise: {__typename: 'ProductVariant', id: 'gid://shopify/ProductVariant/2'}},
    ]},
    discount: discount(['PRODUCT']),
  });
  const c = out.operations[0].productDiscountsAdd.candidates[0];
  assert.deepEqual(c.targets, [{cartLine: {id: 'a', quantity: 1}}]);
  assert.equal(c.value.percentage.value, 20);
});

test('zonder configuratie of zonder productklasse: geen korting', () => {
  const cart = {lines: [{id: 'a', quantity: 1, merchandise: {__typename: 'ProductVariant', id: 'gid://shopify/ProductVariant/1'}}]};
  assert.deepEqual(cartLinesDiscountsGenerateRun({cart, discount: {discountClasses: ['PRODUCT'], metafield: null}}).operations, []);
  assert.deepEqual(cartLinesDiscountsGenerateRun({cart, discount: discount(['ORDER'])}).operations, []);
});

test('verzending gaat naar 0 voor alle bezorggroepen', () => {
  const out = cartDeliveryOptionsDiscountsGenerateRun({cart: {deliveryGroups: [{id: 'g1'}]}, discount: discount(['SHIPPING'])});
  assert.deepEqual(out.operations[0].deliveryDiscountsAdd.candidates[0].targets, [{deliveryGroup: {id: 'g1'}}]);
  assert.equal(out.operations[0].deliveryDiscountsAdd.candidates[0].value.percentage.value, 100);
});
