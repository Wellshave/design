import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
const p = await (await b.newContext({viewport:{width:1400,height:1200}})).newPage();
await p.goto('file:///home/user/design/audits/blok-02-pijnpunt.html',{waitUntil:'load',timeout:60000});
await p.waitForTimeout(1500);
const out = await p.evaluate(()=>{
  const bad=[];
  document.querySelectorAll('.pf, .pf *').forEach(el=>{
    const par=el.parentElement; if(!par) return;
    const r=el.getBoundingClientRect(), pr=par.getBoundingClientRect();
    if(r.width===0) return;
    const ovR=r.right-pr.right, ovB=r.bottom-pr.bottom;
    if(ovR>2||ovB>2){
      const cs=getComputedStyle(par);
      if(cs.overflow!=='visible'||ovR>2)
        bad.push({el:el.className||el.tagName, parent:par.className||par.tagName,
                  right:Math.round(ovR), bottom:Math.round(ovB)});
    }
  });
  const imgs=[...document.querySelectorAll('.pf img')].map(i=>{
    const r=i.getBoundingClientRect();
    return {src:i.alt.slice(0,28), nat:(i.naturalWidth/i.naturalHeight).toFixed(3),
            box:(r.width/r.height).toFixed(3), fit:getComputedStyle(i).objectFit};
  });
  const cta=document.querySelector('.spot-cta').getBoundingClientRect();
  const spot=document.querySelector('.spot').getBoundingClientRect();
  return {bad:bad.slice(0,15), imgs, cta:{w:Math.round(cta.width),h:Math.round(cta.height)},
          spot:{w:Math.round(spot.width),h:Math.round(spot.height)}};
});
console.log(JSON.stringify(out,null,1));
await b.close();
