// Mystery Korting: de server achter de popup.
//
//   POST /api/claim   e-mail + quizantwoord in, unieke kortingscode uit
//   POST /api/event   telt stappen in de trechter (popup getoond, antwoord, enz.)
//   GET  /api/stats   trechter per dag en variant, achter STATS_KEY
//
// Alles buiten /api/ (het script en de beelden) serveert Cloudflare uit public/.

import { addDiscountCode, codeExists } from './shopify.js';
import { syncClaim } from './klaviyo.js';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // geen 0/O en 1/I
const EVENTS = new Set(['view', 'answer', 'decline', 'email_view', 'claim_view', 'dismiss', 'tab_open', 'tab_hide', 'error']);
const CLAIMS_PER_IP_PER_HOUR = 8;
const MAX_SYNC_ATTEMPTS = 6;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin');
    const cors = corsHeaders(env, origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    try {
      if (url.pathname === '/api/claim' && request.method === 'POST') {
        if (!cors) return json({ error: 'origin' }, 403);
        return withHeaders(await handleClaim(request, env, ctx), cors);
      }
      if (url.pathname === '/api/event' && request.method === 'POST') {
        if (!cors) return new Response(null, { status: 403 });
        await handleEvent(request, env);
        return new Response(null, { status: 204, headers: cors });
      }
      if (url.pathname === '/api/stats' && request.method === 'GET') {
        return await handleStats(url, env);
      }
    } catch (err) {
      console.error(err);
      return withHeaders(json({ error: 'server' }, 500), cors || {});
    }

    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Niet gevonden', { status: 404 });
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(retryPending(env));
  },
};

// ---------------------------------------------------------------------------------------
// Claim

async function handleClaim(request, env, ctx) {
  const body = await readJson(request);
  if (!body) return json({ error: 'body' }, 400);

  // Honeypot: een verborgen veld dat mensen nooit invullen.
  if (body.website) return json({ error: 'body' }, 400);

  const email = normalizeEmail(body.email);
  if (!email) return json({ error: 'email' }, 400);

  const ip = request.headers.get('cf-connecting-ip') || 'onbekend';
  if (!(await withinRateLimit(env, `claim:${await sha256(ip)}`, CLAIMS_PER_IP_PER_HOUR, 3600))) {
    return json({ error: 'rate' }, 429);
  }

  const emailHash = await sha256(email);
  const existing = await env.DB.prepare('SELECT * FROM claims WHERE email_hash = ?').bind(emailHash).first();

  // Wie al eerder claimde, krijgt dezelfde code terug; geen tweede korting per adres.
  if (existing && existing.shopify_status !== 'error') {
    return json({ code: existing.code, existing: true });
  }

  const claim = existing ?? {
    id: crypto.randomUUID(),
    email_hash: emailHash,
    email,
    code: generateCode(env.CODE_PREFIX),
    answer: cleanText(body.answer, 60),
    variant: cleanText(body.variant, 20),
    page: cleanText(body.page, 200),
    created_at: new Date().toISOString(),
  };
  claim.email = email;

  if (!existing) {
    await env.DB.prepare(
      'INSERT INTO claims (id, email_hash, email, code, answer, variant, page, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(claim.id, claim.email_hash, claim.email, claim.code, claim.answer, claim.variant, claim.page, claim.created_at).run();
  }

  let shopifyStatus;
  try {
    shopifyStatus = await addDiscountCode(env, claim.code);
  } catch (err) {
    console.error(err);
    await env.DB.prepare('UPDATE claims SET shopify_status = ?, last_error = ? WHERE id = ?')
      .bind('error', String(err.message).slice(0, 500), claim.id).run();
    return json({ error: 'shopify' }, 502);
  }
  await env.DB.prepare('UPDATE claims SET shopify_status = ? WHERE id = ?').bind(shopifyStatus, claim.id).run();
  await countEvent(env, claim.variant || '-', 'claim', claim.answer || '');

  // Klaviyo hoeft de klant niet op te houden; mislukt het, dan pakt de cron het op.
  ctx.waitUntil(syncToKlaviyo(env, claim));

  return json({ code: claim.code });
}

async function syncToKlaviyo(env, claim) {
  try {
    await syncClaim(env, claim);
    // Klaviyo heeft het adres nu; hier bewaren we het niet langer dan nodig.
    await env.DB.prepare('UPDATE claims SET klaviyo_status = ?, email = NULL, last_error = NULL WHERE id = ?')
      .bind('ok', claim.id).run();
  } catch (err) {
    console.error(err);
    await env.DB.prepare('UPDATE claims SET klaviyo_status = ?, last_error = ?, attempts = attempts + 1 WHERE id = ?')
      .bind('error', String(err.message).slice(0, 500), claim.id).run();
  }
}

// Draait elk kwartier.
export async function retryPending(env) {
  const { results: pendingCodes } = await env.DB.prepare(
    "SELECT * FROM claims WHERE shopify_status = 'pending' AND created_at < ? LIMIT 50",
  ).bind(new Date(Date.now() - 60_000).toISOString()).all();
  for (const claim of pendingCodes) {
    try {
      const status = (await codeExists(env, claim.code)) ? 'ok' : await addDiscountCode(env, claim.code);
      await env.DB.prepare('UPDATE claims SET shopify_status = ? WHERE id = ?').bind(status, claim.id).run();
    } catch (err) {
      console.error(err);
    }
  }

  const { results: unsynced } = await env.DB.prepare(
    "SELECT * FROM claims WHERE klaviyo_status != 'ok' AND shopify_status != 'error' AND email IS NOT NULL " +
    'AND attempts < ? AND created_at < ? LIMIT 50',
  ).bind(MAX_SYNC_ATTEMPTS, new Date(Date.now() - 60_000).toISOString()).all();
  for (const claim of unsynced) await syncToKlaviyo(env, claim);

  await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Date.now()).run();
}

// ---------------------------------------------------------------------------------------
// Trechter

async function handleEvent(request, env) {
  const body = await readJson(request);
  if (!body || !EVENTS.has(body.e)) return;
  await countEvent(env, cleanText(body.v, 20) || '-', body.e, cleanText(body.d, 60) || '');
}

async function countEvent(env, variant, event, detail) {
  await env.DB.prepare(
    'INSERT INTO daily_stats (day, variant, event, detail, count) VALUES (?, ?, ?, ?, 1) ' +
    'ON CONFLICT(day, variant, event, detail) DO UPDATE SET count = count + 1',
  ).bind(amsterdamDay(), variant, event, detail).run();
}

async function handleStats(url, env) {
  if (!env.STATS_KEY || url.searchParams.get('key') !== env.STATS_KEY) {
    return new Response('Geen toegang', { status: 401 });
  }
  const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '14', 10) || 14, 1), 120);
  const since = amsterdamDay(Date.now() - (days - 1) * 86_400_000);
  const { results } = await env.DB.prepare(
    'SELECT day, variant, event, detail, count FROM daily_stats WHERE day >= ? ORDER BY day DESC',
  ).bind(since).all();
  const health = await env.DB.prepare(
    "SELECT SUM(shopify_status = 'error') AS shopify_fout, SUM(shopify_status = 'pending') AS shopify_wacht, " +
    "SUM(klaviyo_status != 'ok') AS klaviyo_open FROM claims",
  ).first();

  if (url.searchParams.get('format') === 'json') return json({ since, rows: results, health });
  return new Response(renderStats(results, health, days), {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export function summarize(rows) {
  const byKey = new Map();
  for (const r of rows) {
    const key = `${r.day}|${r.variant}`;
    if (!byKey.has(key)) byKey.set(key, { day: r.day, variant: r.variant, view: 0, answers: {}, email_view: 0, claim: 0, dismiss: 0, decline: 0, tab_open: 0 });
    const s = byKey.get(key);
    if (r.event === 'answer') s.answers[r.detail || '?'] = (s.answers[r.detail || '?'] || 0) + r.count;
    else if (r.event in s) s[r.event] += r.count;
  }
  return [...byKey.values()].sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : a.variant.localeCompare(b.variant)));
}

function renderStats(rows, health, days) {
  const lines = summarize(rows);
  const total = lines.reduce((t, s) => ({ view: t.view + s.view, claim: t.claim + s.claim }), { view: 0, claim: 0 });
  const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '–');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const body = lines.map((s) => `<tr><td>${esc(s.day)}</td><td>${esc(s.variant)}</td><td>${s.view}</td>` +
    `<td>${esc(Object.entries(s.answers).map(([k, v]) => `${k}: ${v}`).join(', ') || '–')}</td>` +
    `<td>${s.email_view}</td><td>${s.claim}</td><td>${pct(s.claim, s.view)}</td><td>${s.dismiss + s.decline}</td><td>${s.tab_open}</td></tr>`).join('');
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mystery Korting</title><style>
body{font:14px/1.4 Montserrat,system-ui,sans-serif;margin:24px;color:#191816;background:#F5F1EA}
table{border-collapse:collapse;background:#fff;width:100%;max-width:1100px}th,td{padding:8px 10px;border-bottom:1px solid #EDE6DA;text-align:left}
th{background:#191816;color:#fff;font-weight:600}.kpi{display:flex;gap:16px;margin:16px 0}.kpi div{background:#fff;padding:12px 16px;border-radius:12px}
.kpi b{display:block;font-size:22px}.wrap{overflow-x:auto}</style></head><body>
<h1>Mystery Korting, laatste ${days} dagen</h1>
<div class="kpi"><div><b>${total.view}</b>keer getoond</div><div><b>${total.claim}</b>codes geclaimd</div><div><b>${pct(total.claim, total.view)}</b>conversie</div>
<div><b>${health?.shopify_fout || 0} / ${health?.klaviyo_open || 0}</b>Shopify-fouten / nog niet in Klaviyo</div></div>
<div class="wrap"><table><thead><tr><th>Dag</th><th>Variant</th><th>Getoond</th><th>Antwoorden</th><th>E-mailstap</th><th>Geclaimd</th><th>Conversie</th><th>Weggeklikt</th><th>Zijtab geopend</th></tr></thead>
<tbody>${body || '<tr><td colspan="9">Nog geen gegevens.</td></tr>'}</tbody></table></div></body></html>`;
}

// ---------------------------------------------------------------------------------------
// Hulpjes

export function generateCode(prefix = 'WS') {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  // 256 is deelbaar door 32, dus elke letter is even waarschijnlijk.
  const body = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
  return `${prefix}-${body}`;
}

export function normalizeEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254) return null;
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(email) ? email : null;
}

function cleanText(value, max) {
  if (typeof value !== 'string') return null;
  const text = value.replace(/[\u0000-\u001f]/g, '').trim().slice(0, max);
  return text || null;
}

async function sha256(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function withinRateLimit(env, key, limit, windowSeconds) {
  const now = Date.now();
  const row = await env.DB.prepare(
    'INSERT INTO rate_limits (key, count, expires_at) VALUES (?, 1, ?) ' +
    'ON CONFLICT(key) DO UPDATE SET ' +
    'count = CASE WHEN expires_at < ? THEN 1 ELSE count + 1 END, ' +
    'expires_at = CASE WHEN expires_at < ? THEN excluded.expires_at ELSE expires_at END ' +
    'RETURNING count',
  ).bind(key, now + windowSeconds * 1000, now, now).first();
  return row.count <= limit;
}

export function amsterdamDay(time = Date.now()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date(time));
}

// Het script stuurt text/plain, zodat de browser geen extra preflight-verzoek doet.
async function readJson(request) {
  try {
    const text = await request.text();
    if (text.length > 4000) return null;
    const data = JSON.parse(text);
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function corsHeaders(env, origin) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return null;
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'origin',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function withHeaders(response, headers) {
  for (const [k, v] of Object.entries(headers)) response.headers.set(k, v);
  return response;
}
