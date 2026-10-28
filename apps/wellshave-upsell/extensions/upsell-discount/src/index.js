// De server maakt per upsell één unieke code met deze configuratie:
// {pct, variantIds, parent, freeShipping}. Zonder die code doet de functie niets.

const parse = (discount) => {
  try {
    return JSON.parse(discount?.metafield?.value || '{}');
  } catch {
    return {};
  }
};

export function cartLinesDiscountsGenerateRun(input) {
  const cfg = parse(input.discount);
  if (!input.discount.discountClasses.includes('PRODUCT') || !(cfg.pct > 0)) return {operations: []};
  const allowed = new Set(cfg.variantIds || []);
  const targets = input.cart.lines
    .filter((l) => l.merchandise.__typename === 'ProductVariant' && allowed.has(l.merchandise.id))
    // Eén stuk per aangeboden product; extra stuks kosten de gewone prijs.
    .map((l) => ({cartLine: {id: l.id, quantity: 1}}));
  if (!targets.length) return {operations: []};
  return {
    operations: [
      {
        productDiscountsAdd: {
          selectionStrategy: 'ALL',
          candidates: [{message: `${cfg.pct}% extra korting`, targets, value: {percentage: {value: cfg.pct}}}],
        },
      },
    ],
  };
}

export function cartDeliveryOptionsDiscountsGenerateRun(input) {
  const cfg = parse(input.discount);
  if (!input.discount.discountClasses.includes('SHIPPING') || !cfg.freeShipping) return {operations: []};
  const groups = input.cart.deliveryGroups.map((g) => ({deliveryGroup: {id: g.id}}));
  if (!groups.length) return {operations: []};
  return {
    operations: [
      {
        deliveryDiscountsAdd: {
          selectionStrategy: 'ALL',
          candidates: [{message: 'Gratis verzending, gaat mee met je bestelling', targets: groups, value: {percentage: {value: 100}}}],
        },
      },
    ],
  };
}
