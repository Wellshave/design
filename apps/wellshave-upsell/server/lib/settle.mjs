// Afronden van een upsell in dezelfde order: betaald, of na de betaaltijd weer verwijderd.
import {admin, stateOf, setOrderState, removeFromOrder, addTags, removeTags} from './shopify.mjs';

export const PAY_MINUTES = 60;
export const WAIT_TAG = 'upsell-wacht-op-betaling';

export async function settle(shop, order, now = Date.now()) {
  const state = stateOf(order);
  if (state.mode !== 'edit' || state.status !== 'accepted') return state.status;
  const outstanding = Number(order.totalOutstandingSet?.shopMoney?.amount || 0);
  if (outstanding <= 0) {
    await setOrderState(shop, order.id, {...state, status: 'paid', paidSeenAt: new Date(now).toISOString()});
    await addTags(shop, order.id, ['heeft-upsell', 'upsell-betaald']);
    await removeTags(shop, order.id, [WAIT_TAG]);
    return 'paid';
  }
  if (Date.parse(state.endsAt) > now) return 'waiting';
  await removeFromOrder(shop, order.id, state.lineItemIds || [], `Upsell niet betaald binnen ${PAY_MINUTES} minuten, automatisch verwijderd.`);
  await setOrderState(shop, order.id, {...state, status: 'unpaid', removedAt: new Date(now).toISOString()});
  await addTags(shop, order.id, ['upsell-niet-betaald']);
  await removeTags(shop, order.id, [WAIT_TAG]);
  return 'unpaid';
}

export async function settleAll(shop) {
  const d = await admin(
    shop,
    `query($q:String!){ orders(first:50, query:$q){ nodes{ id name totalOutstandingSet{ shopMoney{ amount } }
      metafield(namespace:"wellshave_upsell", key:"state"){ value } } } }`,
    {q: `tag:${WAIT_TAG}`},
  );
  const out = {};
  for (const o of d.orders.nodes) {
    try {
      out[o.name] = await settle(shop, o);
    } catch (e) {
      console.error('afronden mislukt', o.name, e);
      out[o.name] = 'fout';
    }
  }
  return out;
}
