// Shopify Admin API: toegangstoken ophalen en unieke codes onder de moederkorting hangen.

const ADD_CODE = `mutation AddCode($discountId: ID!, $codes: [DiscountRedeemCodeInput!]!) {
  discountRedeemCodeBulkAdd(discountId: $discountId, codes: $codes) {
    bulkCreation { id }
    userErrors { field message code }
  }
}`;

const BULK_STATUS = `query BulkStatus($id: ID!) {
  discountRedeemCodeBulkCreation(id: $id) {
    done importedCount failedCount
    codes(first: 1) { nodes { code errors { message } } }
  }
}`;

const CODE_EXISTS = `query CodeExists($code: String!) {
  codeDiscountNodeByCode(code: $code) { id }
}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Apps uit het Dev Dashboard krijgen geen vast token meer; je ruilt client-id en -secret
// in voor een token dat 24 uur geldt. Dat token bewaren we in D1 tot het bijna verloopt.
export async function getAccessToken(env) {
  if (env.SHOPIFY_ADMIN_TOKEN) return env.SHOPIFY_ADMIN_TOKEN;

  const cached = await env.DB.prepare('SELECT value, expires_at FROM tokens WHERE name = ?')
    .bind('shopify').first();
  if (cached && cached.expires_at > Date.now() + 5 * 60_000) return cached.value;

  const res = await fetch(`https://${env.SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.SHOPIFY_CLIENT_ID,
      client_secret: env.SHOPIFY_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) throw new Error(`Shopify-token: HTTP ${res.status} ${await res.text()}`);
  const { access_token, expires_in } = await res.json();

  await env.DB.prepare(
    'INSERT INTO tokens (name, value, expires_at) VALUES (?, ?, ?) ' +
    'ON CONFLICT(name) DO UPDATE SET value = excluded.value, expires_at = excluded.expires_at',
  ).bind('shopify', access_token, Date.now() + expires_in * 1000).run();
  return access_token;
}

export async function adminGraphql(env, query, variables) {
  const token = await getAccessToken(env);
  const res = await fetch(`https://${env.SHOP}/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-shopify-access-token': token },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify: HTTP ${res.status} ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`Shopify: ${json.errors.map((e) => e.message).join('; ')}`);
  return json.data;
}

// Voegt een code toe aan de moederkorting. Shopify doet dat asynchroon, maar bij een enkele
// code is het binnen een seconde klaar; we wachten daar kort op zodat we de klant geen code
// laten zien die niet werkt. Geeft 'ok' terug, of 'pending' als Shopify nog bezig is (de
// cron controleert die later), en gooit een fout als Shopify de code weigert.
export async function addDiscountCode(env, code, { attempts = 8, interval = 300 } = {}) {
  const data = await adminGraphql(env, ADD_CODE, {
    discountId: env.SHOPIFY_DISCOUNT_ID,
    codes: [{ code }],
  });
  const { bulkCreation, userErrors } = data.discountRedeemCodeBulkAdd;
  if (userErrors.length) throw new Error(`Shopify: ${userErrors.map((e) => e.message).join('; ')}`);

  for (let i = 0; i < attempts; i++) {
    await sleep(interval);
    const { discountRedeemCodeBulkCreation: status } = await adminGraphql(env, BULK_STATUS, { id: bulkCreation.id });
    if (!status?.done) continue;
    if (status.importedCount >= 1) return 'ok';
    const reason = status.codes.nodes[0]?.errors?.map((e) => e.message).join('; ') || 'onbekende reden';
    throw new Error(`Shopify weigerde code ${code}: ${reason}`);
  }
  return 'pending';
}

export async function codeExists(env, code) {
  const data = await adminGraphql(env, CODE_EXISTS, { code });
  return Boolean(data.codeDiscountNodeByCode);
}
