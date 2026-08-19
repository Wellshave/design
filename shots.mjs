import { execSync } from 'node:child_process';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { const r = execSync('npm root -g').toString().trim(); ({ chromium } = await import(`${r}/playwright/index.mjs`)); }
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://localhost:5180/', { waitUntil:'load' });
await p.waitForTimeout(3000);
await p.screenshot({ path:'/tmp/f1.png' });
await p.locator('#specs').scrollIntoViewIfNeeded(); await p.waitForTimeout(2200);
await p.screenshot({ path:'/tmp/f2.png' });
await p.locator('#buy').scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
await p.click('#addBtn'); await p.waitForTimeout(600);
await p.screenshot({ path:'/tmp/f3.png' });
await p.locator('.bundle[data-id="essential"]').click(); await p.waitForTimeout(900);
await p.click('#addBtn'); await p.waitForTimeout(600);
await p.screenshot({ path:'/tmp/f4.png' });
await p.evaluate(() => window.scrollBy(0, 300)); await p.waitForTimeout(600);
await p.screenshot({ path:'/tmp/f5.png' });
await p.locator('#spin').scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
await p.screenshot({ path:'/tmp/f6.png' });
await p.locator('#macro').scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
await p.screenshot({ path:'/tmp/f7.png' });
await b.close();
