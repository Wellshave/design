// Elke 5 minuten: upsells in dezelfde order afronden (betaald markeren of na 60 minuten verwijderen).
import {settleAll} from '../lib/settle.mjs';

export const config = {schedule: '*/5 * * * *'};

export default async function handler() {
  const out = await settleAll(process.env.SHOPIFY_SHOP || 'wellshave.myshopify.com');
  if (Object.keys(out).length) console.log('upsell afronden', JSON.stringify(out));
  return new Response('ok');
}
