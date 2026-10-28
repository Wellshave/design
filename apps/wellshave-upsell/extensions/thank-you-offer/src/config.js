// Adres van de upsell-server (Netlify). Pas aan als de app op een ander domein draait.
export const APP_URL = 'https://wellshave-upsell.netlify.app';

export const eur = (n) => `€${Number(n).toFixed(2).replace('.', ',')}`;
