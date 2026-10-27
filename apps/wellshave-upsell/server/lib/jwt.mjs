// HS256-JWT's zonder externe afhankelijkheden. Shopify ondertekent de tokens van
// checkout- en post-purchase-extensies met het API-geheim van de app; wij ondertekenen
// de changesets voor de pagina na betaling met datzelfde geheim.
import {createHmac, randomUUID, timingSafeEqual} from 'node:crypto';

const b64url = (buf) => Buffer.from(buf).toString('base64url');
const fromB64url = (s) => Buffer.from(s, 'base64url');

export function sign(payload, secret) {
  const header = b64url(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

export function verify(token, secret, {audience, now = Math.floor(Date.now() / 1000), leeway = 10} = {}) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('token heeft geen drie delen');
  const [header, body, sig] = parts;
  let head;
  try {
    head = JSON.parse(fromB64url(header).toString());
  } catch {
    throw new Error('ongeldige handtekening');
  }
  if (head.alg !== 'HS256') throw new Error('onverwacht algoritme');
  const expected = createHmac('sha256', secret).update(`${header}.${body}`).digest();
  const given = fromB64url(sig);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) throw new Error('ongeldige handtekening');
  const claims = JSON.parse(fromB64url(body).toString());
  if (claims.exp && now > claims.exp + leeway) throw new Error('token verlopen');
  if (claims.nbf && now + leeway < claims.nbf) throw new Error('token nog niet geldig');
  if (audience && claims.aud && claims.aud !== audience) throw new Error('verkeerde audience');
  return claims;
}

// Changeset voor applyChangeset op de pagina na betaling.
export function signChangeset({referenceId, changes, apiKey, secret, now = Math.floor(Date.now() / 1000)}) {
  return sign({iss: apiKey, jti: randomUUID(), iat: now, sub: referenceId, changes}, secret);
}
