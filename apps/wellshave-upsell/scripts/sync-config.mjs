// Zet config/upsell-config.json (export uit de Upsell Studio) in de shop-metafield
// wellshave_upsell.config, waar de server het aanbod uit leest.
// Gebruik: SHOP=wellshave.myshopify.com SHOPIFY_ADMIN_TOKEN=... npm run sync-config
import {readFile} from 'node:fs/promises';

const shop = process.env.SHOP || 'wellshave.myshopify.com';
const token = process.env.SHOPIFY_ADMIN_TOKEN;
if (!token) {
  console.error('Zet SHOPIFY_ADMIN_TOKEN (toegangstoken van de geïnstalleerde app).');
  process.exit(1);
}

const config = JSON.parse(await readFile(new URL('../config/upsell-config.json', import.meta.url), 'utf8'));
const gql = async (query, variables) => {
  const res = await fetch(`https://${shop}/admin/api/2026-01/graphql.json`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'X-Shopify-Access-Token': token},
    body: JSON.stringify({query, variables}),
  });
  return res.json();
};

const {data} = await gql('{ shop { id } }');
const out = await gql(
  'mutation($m:[MetafieldsSetInput!]!){ metafieldsSet(metafields:$m){ metafields{ id } userErrors{ message } } }',
  {m: [{ownerId: data.shop.id, namespace: 'wellshave_upsell', key: 'config', type: 'json', value: JSON.stringify(config)}]},
);
const errs = out.data?.metafieldsSet?.userErrors || out.errors;
if (errs?.length) {
  console.error(errs);
  process.exit(1);
}
console.log(`Instellingen gesynchroniseerd: ${config.rules.length} regels.`);
