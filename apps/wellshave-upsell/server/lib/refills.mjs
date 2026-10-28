// Welke producten mesjes of een kop hebben die op raken, en wat de klant dan nodig heeft.
// Alleen bij een bestelling met zo'n product verschijnt "Ja, herinner mij".
// Overschrijfbaar via config.refills (zelfde vorm).

const group = (triggers, refills) => ({triggers, refills});

export const REFILLS = [
  group(['wellshave-flex-guard™', 'essential-flex-bundel', 'body-beard-kit', 'flex-guard-blade-vervanging', 'trio-pack'],
    ['trio-pack', 'flex-guard-blade-vervanging']),
  group(['wellshave-bodygroomer-groom-guard', 'groom-guard-pro', 'vervanging-bodygroomer-mes', 'trio-pack-groom-guard', 'foil-shaver-groom-guard'],
    ['trio-pack-groom-guard', 'vervanging-bodygroomer-mes', 'foil-shaver-groom-guard']),
  group(['wellshave-scheerapparaat-elite', 'elite-scheerkop'], ['elite-scheerkop']),
  group(['skull-deal-3-0', 'skull-deal-2-0', 'skull-shaver-deluxe-extra-magnetische-scheerkop', 'wellshave-5-in-1-scheerapparaat-mannen-deluxe', 'wellshave-scheerkop-7d-vervanging'],
    ['wellshave-scheerkop-7d-vervanging']),
  group(['wellshave-safety-razor-black', 'wellshave-safety-razor-gold', 'wellshave-safety-razor-matt-grey', 'wellshave-safety-razor-rose', 'wellshave-safety-razor-silver', 'wellshave-safety-razor-blades'],
    ['wellshave-safety-razor-blades']),
  group(['wellshave-4-in-1-neustrimmer-ultimate', 'wellshave-3-in-1-neustrimmer-advance', 'wellshave-2-in-1-neustrimmer-premium', 'wellshave-neustrimmer-basic',
    'neustrimmer-4in1-ultra', 'neustrimmer-3in1-platinum', 'neustrimmer-2in1-elite', 'neustrimmer-essential', 'vervanging-neustrimmer-opzetstuk'],
  ['vervanging-neustrimmer-opzetstuk']),
];

// Vervangonderdelen voor deze bestelling (handles, zonder dubbelen). Leeg = geen herinnering.
export function refillsFor(purchasedHandles = [], groups = REFILLS) {
  const bought = new Set(purchasedHandles);
  return [...new Set(groups.filter((g) => g.triggers.some((h) => bought.has(h))).flatMap((g) => g.refills))];
}
