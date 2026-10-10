// Klaviyo: profiel bijwerken, inschrijven op de Newsletter-lijst en een event loggen.

const BASE = 'https://a.klaviyo.com/api';
const REVISION = '2026-04-15';
export const EVENT_NAME = 'Mystery Korting Geclaimd';
const SOURCE = 'Mystery Korting popup';

async function call(env, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      authorization: `Klaviyo-API-Key ${env.KLAVIYO_PRIVATE_KEY}`,
      revision: REVISION,
      accept: 'application/vnd.api+json',
      'content-type': 'application/vnd.api+json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Klaviyo ${path}: HTTP ${res.status} ${await res.text()}`);
}

// De volgorde telt. De lijst start de welkomstflow, en die mail toont de code uit het
// profiel; dus eerst het profiel met de code, pas daarna de inschrijving.
export async function syncClaim(env, claim) {
  await call(env, '/profile-import', {
    data: {
      type: 'profile',
      attributes: {
        email: claim.email,
        properties: {
          mystery_korting_code: claim.code,
          mystery_korting_voor_wie: claim.answer ?? '',
          mystery_korting_variant: claim.variant ?? '',
          mystery_korting_datum: claim.created_at,
        },
      },
    },
  });

  await call(env, '/profile-subscription-bulk-create-jobs', {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        custom_source: SOURCE,
        profiles: {
          data: [{
            type: 'profile',
            attributes: {
              email: claim.email,
              subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
            },
          }],
        },
      },
      relationships: { list: { data: { type: 'list', id: env.KLAVIYO_LIST_ID } } },
    },
  });

  await call(env, '/events', {
    data: {
      type: 'event',
      attributes: {
        unique_id: claim.id,
        time: claim.created_at,
        properties: {
          code: claim.code,
          voor_wie: claim.answer ?? '',
          variant: claim.variant ?? '',
          pagina: claim.page ?? '',
        },
        metric: { data: { type: 'metric', attributes: { name: EVENT_NAME } } },
        profile: { data: { type: 'profile', attributes: { email: claim.email } } },
      },
    },
  });
}
