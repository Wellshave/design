// Bedankpagina. Voor iDEAL, Klarna, Bancontact en Apple Pay is dit de plek van het
// aanbod na betaling (Shopify slaat de pagina na betaling bij die methodes over).
// Daaronder de cross-sell en de herinnering voor vervangmesjes.
import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {APP_URL, eur} from './config.js';

export default function extension() {
  render(<ThankYou />, document.body);
}

async function call(path, body) {
  const token = await shopify.sessionToken.get();
  const res = await fetch(`${APP_URL}${path}`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Er ging iets mis');
  return data;
}

// Sessietokens zijn ongeveer een minuut geldig; ververs zodat de link altijd werkt.
function useFreshToken() {
  const [token, setToken] = useState('');
  useEffect(() => {
    let alive = true;
    const load = () => shopify.sessionToken.get().then((t) => alive && setToken(t)).catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  return token;
}

function useCountdown(expiresAt) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    if (!expiresAt) return undefined;
    const tick = () => setLeft(Math.max(0, Date.parse(expiresAt) - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  return left;
}

function ThankYou() {
  const orderId = shopify.orderConfirmation.value?.order?.id;
  // In de checkout-editor bestaat de bestelling niet echt: toon dan een voorbeeld.
  const inEditor = Boolean(shopify.extension?.editor) || !orderId;
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState('');

  useEffect(() => {
    if (inEditor) {
      call('/api/thank-you/preview', {}).then(setData).catch((e) => setFailed(String(e?.message || e)));
      return;
    }
    if (!orderId) return;
    call('/api/thank-you/offer', {orderId}).then(setData).catch((e) => setFailed(String(e?.message || e)));
  }, [orderId, inEditor]);

  // In de editor altijd iets tonen, zodat zichtbaar is of het blok draait en waarom het eventueel faalt.
  if (failed) return inEditor ? <s-banner tone="warning" heading="Wellshave Upsell kan de server niet bereiken">{failed}</s-banner> : null;
  if (!data) return inEditor ? <s-banner tone="info">Wellshave Upsell: voorbeeld laden…</s-banner> : <s-skeleton-paragraph />;
  if (inEditor && data.mode !== 'offer') return <s-banner tone="info">Wellshave Upsell draait, maar er is geen voorbeeldaanbod.</s-banner>;
  if (data.mode === 'upsell-confirmation') {
    return (
      <s-banner tone="success" heading="Toegevoegd aan je bestelling">
        <s-text>Komt mee in hetzelfde pakket als bestelling {data.parent}.</s-text>
      </s-banner>
    );
  }
  return (
    <s-stack gap="large">
      {data.mode === 'offer' && data.offers?.length ? <Offer data={data} orderId={orderId} /> : null}
      {data.thanks?.length ? <CrossSell data={data} /> : null}
      {(data.settings?.remOn || data.reminder) ? <Reminder orderId={orderId} preview={data.preview} settings={data.settings || data.reminder} /> : null}
    </s-stack>
  );
}

// ---------- het eenmalige aanbod ----------
function Offer({data, orderId}) {
  const [picked, setPicked] = useState(() => new Set([data.offers[0].variantId]));
  const [status, setStatus] = useState(data.state === 'dismissed' ? 'dismissed' : 'open');
  // De server bepaalt de deadline; herladen zet de klok niet terug.
  const left = useCountdown(data.expiresAt);
  const token = useFreshToken();
  const s = data.settings;

  if (status === 'dismissed' || left === 0) return null;

  const chosen = data.offers.filter((o) => picked.has(o.variantId));
  const total = chosen.reduce((a, o) => a + o.offerPrice, 0);
  const saved = chosen.reduce((a, o) => a + (o.price - o.offerPrice), 0);
  const toggle = (id) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  // Gewone link naar de server: die maakt de unieke code en stuurt door naar de checkout.
  const goHref = !data.preview && token && chosen.length
    ? `${APP_URL}/api/thank-you/go?${new URLSearchParams({token, order: orderId, v: chosen.map((o) => o.variantId).join(',')})}`
    : undefined;

  async function dismiss() {
    if (data.preview) return;
    setStatus('dismissed');
    call('/api/thank-you/dismiss', {orderId}).catch(() => {});
  }

  const mm = left == null ? null : `${String(Math.floor(left / 60000)).padStart(2, '0')}:${String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}`;
  const [main, ...extras] = data.offers;

  return (
    <s-section>
      <s-stack gap="base">
        <s-stack direction="inline" justifyContent="space-between" alignItems="center">
          <s-badge tone="critical">Alleen nu: {data.discount}% extra korting</s-badge>
          {mm ? <s-text type="strong">Nog {mm}</s-text> : null}
        </s-stack>
        <s-heading>{data.headline}</s-heading>
        {data.headline2 ? <s-text type="emphasis" color="base">{data.headline2}</s-text> : null}
        <s-text color="subdued">{data.sub}</s-text>

        <s-clickable onClick={() => toggle(main.variantId)}>
          <s-box padding="base" border="base" borderRadius="large" background={picked.has(main.variantId) ? 'subdued' : 'base'}>
            <s-stack gap="base">
              <s-image src={main.image} alt={main.title} aspectRatio="1.6" objectFit="contain" borderRadius="base" />
              <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                <s-stack gap="none">
                  <s-text type="strong">{main.title}</s-text>
                  <s-stack direction="inline" gap="small-200">
                    <s-text type="strong">{eur(main.offerPrice)}</s-text>
                    <s-text color="subdued"><s-text type="redundant">{eur(main.price)}</s-text></s-text>
                  </s-stack>
                </s-stack>
                <s-checkbox checked={picked.has(main.variantId)} accessibilityLabel={`${main.title} toevoegen`} />
              </s-stack>
            </s-stack>
          </s-box>
        </s-clickable>

        {extras.length ? (
          <s-stack gap="small">
            <s-text type="strong">Maak het compleet, ook {data.discount}% extra</s-text>
            {extras.map((o) => (
              <s-clickable key={o.variantId} onClick={() => toggle(o.variantId)}>
                <s-box padding="small" border="base" borderRadius="base">
                  <s-stack direction="inline" gap="base" alignItems="center">
                    <s-product-thumbnail src={o.image} alt={o.title} />
                    <s-stack gap="none" inlineSize="fill">
                      <s-text type="strong">{o.title}</s-text>
                      <s-stack direction="inline" gap="small-200">
                        <s-text>{eur(o.offerPrice)}</s-text>
                        <s-text color="subdued"><s-text type="redundant">{eur(o.price)}</s-text></s-text>
                      </s-stack>
                    </s-stack>
                    <s-checkbox checked={picked.has(o.variantId)} accessibilityLabel={`${o.title} toevoegen`} />
                  </s-stack>
                </s-box>
              </s-clickable>
            ))}
          </s-stack>
        ) : null}

        <s-button variant="primary" href={goHref} disabled={!goHref}>
          {chosen.length ? `Ja, toevoegen · ${eur(total)}` : 'Kies minstens één product'}
        </s-button>
        <s-text color="subdued" type="small">Je gegevens staan er al in en verzending is gratis. Betaal je niet, dan verandert er niets aan je bestelling.</s-text>

        <s-box padding="base" borderRadius="large" background="subdued" border="base">
          <s-stack gap="small-200">
            <s-heading>{s.lcTitle} {s.lcTitle2}</s-heading>
            <s-text>{s.lcText}</s-text>
          </s-stack>
        </s-box>

        <s-button variant="secondary" onClick={dismiss}>{s.noText || 'Nee, ik laat deze korting liggen'}</s-button>
        {saved > 0 ? <s-text color="subdued" type="small">Je bespaart {eur(saved)}.</s-text> : null}
      </s-stack>
    </s-section>
  );
}

// ---------- cross-sell met de kortingscode ----------
function CrossSell({data}) {
  const s = data.settings;
  return (
    <s-section heading={s.tyTitle || 'Maak je set compleet'}>
      <s-stack gap="small">
        {data.thanks.map((o) => (
          <s-stack key={o.variantId} direction="inline" gap="base" alignItems="center">
            <s-product-thumbnail src={o.image} alt={o.title} />
            <s-stack gap="none" inlineSize="fill">
              <s-text type="strong">{o.title}</s-text>
              <s-stack direction="inline" gap="small-200">
                <s-text>{eur(o.offerPrice)}</s-text>
                {s.tyDisc ? <s-text color="subdued"><s-text type="redundant">{eur(o.price)}</s-text></s-text> : null}
              </s-stack>
            </s-stack>
            <s-link href={s.code ? `https://wellshave.com/discount/${encodeURIComponent(s.code)}?redirect=/products/${o.handle}` : `https://wellshave.com/products/${o.handle}`}>Toevoegen +</s-link>
          </s-stack>
        ))}
        {s.code && s.tyDisc ? (
          <s-box padding="small" border="dashed" borderRadius="base">
            <s-stack direction="inline" justifyContent="space-between">
              <s-text color="subdued">Code voor {s.tyDisc}% korting</s-text>
              <s-text type="strong">{s.code}</s-text>
            </s-stack>
          </s-box>
        ) : null}
      </s-stack>
    </s-section>
  );
}

// ---------- herinnering voor vervangmesjes ----------
function Reminder({orderId, settings, preview}) {
  const [state, setState] = useState('idle');
  async function ask() {
    if (preview) return;
    setState('busy');
    try {
      await call('/api/thank-you/reminder', {orderId});
      setState('done');
    } catch {
      setState('error');
    }
  }
  return (
    <s-box padding="base" borderRadius="large" background="subdued">
      <s-stack gap="small">
        <s-heading>Nieuwe mesjes nodig? Wij seinen je in.</s-heading>
        <s-text>{settings.remText}. Over {settings.remWeeks || 8} weken krijg je één mail, meer niet.</s-text>
        {state === 'done' ? (
          <s-banner tone="success">Staat genoteerd. Je krijgt over {settings.remWeeks || 8} weken één mail.</s-banner>
        ) : (
          <s-button onClick={ask} loading={state === 'busy'}>Ja, herinner mij</s-button>
        )}
        {state === 'error' ? <s-text color="subdued">Dat lukte even niet. Probeer het zo nog eens.</s-text> : null}
      </s-stack>
    </s-box>
  );
}
