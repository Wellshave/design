// Pagina na betaling, alleen bij kaart, Shop Pay en PayPal. Eén tik voegt de gekozen
// producten aan dezelfde order toe; de server ondertekent die wijziging.
import {useEffect, useMemo, useState} from 'react';
import {
  extend, render, useExtensionInput,
  BlockStack, InlineStack, Button, CalloutBanner, Heading, Image, Layout, Text, TextBlock, TextContainer, View, Checkbox, Separator,
} from '@shopify/post-purchase-ui-extensions-react';

const APP_URL = 'https://wellshave-upsell.netlify.app';
const eur = (n) => `€${Number(n).toFixed(2).replace('.', ',')}`;
const num = (gid) => String(gid).split('/').pop();

async function post(path, token, body) {
  const res = await fetch(`${APP_URL}${path}`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
  return res.json();
}

extend('Checkout::PostPurchase::ShouldRender', async ({inputData, storage}) => {
  const p = inputData.initialPurchase;
  try {
    const offer = await post('/api/post-purchase/offer', inputData.token, {
      referenceId: p.referenceId,
      customerId: p.customerId,
      shopDomain: inputData.shop?.domain,
      lineItems: p.lineItems.map((l) => ({productId: num(l.product.id), variantId: num(l.product.variant.id)})),
    });
    if (!offer.render) return {render: false};
    await storage.update(offer);
    return {render: true};
  } catch {
    // Bij twijfel geen pagina: de klant gaat gewoon door naar de bedankpagina.
    return {render: false};
  }
});

render('Checkout::PostPurchase::Render', () => <App />);

function useCountdown(minutes) {
  const [left, setLeft] = useState(minutes ? minutes * 60 : null);
  useEffect(() => {
    if (!minutes) return undefined;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [minutes]);
  return left;
}

export function App() {
  const {storage, inputData, calculateChangeset, applyChangeset, done} = useExtensionInput();
  const offer = storage.initialData;
  const [picked, setPicked] = useState(() => new Set([offer.offers[0].variantId]));
  const [calc, setCalc] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const left = useCountdown(offer.settings.timerMin);
  const s = offer.settings;

  const changes = useMemo(
    () => offer.offers.filter((o) => picked.has(o.variantId)).map((o) => ({
      type: 'add_variant',
      variantId: Number(num(o.variantId)),
      quantity: 1,
      discount: {value: offer.discount, valueType: 'percentage', title: `${offer.discount}% extra korting`},
    })),
    [picked],
  );

  // Shopify rekent btw en verzending uit voor wat er nu gekozen is.
  useEffect(() => {
    let alive = true;
    if (!changes.length) return setCalc(null);
    calculateChangeset({changes}).then((r) => alive && setCalc(r.calculatedPurchase)).catch(() => {});
    return () => {
      alive = false;
    };
  }, [changes]);

  useEffect(() => {
    if (left === 0) decline();
  }, [left]);

  const total = calc?.totalOutstandingSet?.presentmentMoney?.amount;
  const toggle = (id) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  async function accept() {
    setBusy(true);
    setError('');
    const res = await post('/api/post-purchase/sign', inputData.token, {
      referenceId: inputData.initialPurchase.referenceId,
      customerId: inputData.initialPurchase.customerId,
      shopDomain: inputData.shop?.domain,
      ruleId: offer.ruleId,
      discount: offer.discount,
      variantIds: [...picked],
    }).catch(() => ({}));
    if (!res.token) {
      setBusy(false);
      setError('Toevoegen lukte niet. Je bestelling is niet veranderd.');
      return;
    }
    const applied = await applyChangeset(res.token);
    if (applied?.errors?.length) {
      setBusy(false);
      setError('De betaling voor dit extraatje lukte niet. Je bestelling is niet veranderd.');
      return;
    }
    done();
  }

  function decline() {
    setBusy(true);
    // "Weg is weg": de server onthoudt dat deze klant dit aanbod heeft gezien.
    post('/api/post-purchase/dismiss', inputData.token, {
      customerId: inputData.initialPurchase.customerId,
      shopDomain: inputData.shop?.domain,
      ruleId: offer.ruleId,
    }).catch(() => {}).finally(() => done());
  }

  const mm = left == null ? null : `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
  const [main, ...extras] = offer.offers;

  return (
    <BlockStack spacing="loose">
      <CalloutBanner title={`Alleen nu: ${offer.discount}% extra korting`}>
        {mm ? `Dit aanbod verloopt over ${mm}.` : 'Alleen op deze pagina.'}
      </CalloutBanner>
      <Layout maxInlineSize={0.95} media={[{viewportSize: 'small', sizes: [1, 0, 1], maxInlineSize: 0.9}, {viewportSize: 'medium', sizes: [532, 0, 1], maxInlineSize: 420}, {viewportSize: 'large', sizes: [560, 38, 340]}]}>
        <View>
          <Image source={main.image} description={main.title} />
        </View>
        <View />
        <BlockStack spacing="base">
          <TextContainer>
            <Heading>{offer.headline}</Heading>
            <Heading level={2}>{offer.headline2}</Heading>
            <TextBlock subdued>{offer.sub}</TextBlock>
          </TextContainer>

          <Checkbox checked={picked.has(main.variantId)} onChange={() => toggle(main.variantId)}>
            <Text emphasized>{main.title}</Text> · {eur(main.offerPrice)} <Text subdued role="deletion">{eur(main.price)}</Text>
          </Checkbox>
          {extras.length ? <Separator /> : null}
          {extras.length ? <Text emphasized>Maak het compleet, ook {offer.discount}% extra</Text> : null}
          {extras.map((o) => (
            <InlineStack key={o.variantId} spacing="tight" alignment="center">
              <Image source={o.image} description={o.title} />
              <Checkbox checked={picked.has(o.variantId)} onChange={() => toggle(o.variantId)}>
                {o.title} · {eur(o.offerPrice)} <Text subdued role="deletion">{eur(o.price)}</Text>
              </Checkbox>
            </InlineStack>
          ))}

          {error ? <CalloutBanner status="critical">{error}</CalloutBanner> : null}
          <Button submit onPress={accept} loading={busy} disabled={!changes.length}>
            {changes.length ? `Ja, voeg toe${total ? ` · ${eur(total)}` : ''}` : 'Kies minstens één product'}
          </Button>
          <TextBlock size="small" subdued>Met één tik, via dezelfde betaalmethode. Wordt met je bestelling verzonden.</TextBlock>

          <View border="base" padding="base" cornerRadius="large">
            <BlockStack spacing="tight">
              <Heading level={2}>{s.lcTitle} {s.lcTitle2}</Heading>
              <TextBlock>{s.lcText}</TextBlock>
            </BlockStack>
          </View>

          <Button plain onPress={decline} disabled={busy}>{s.noText || 'Nee, ik laat deze korting liggen'}</Button>
        </BlockStack>
      </Layout>
    </BlockStack>
  );
}
