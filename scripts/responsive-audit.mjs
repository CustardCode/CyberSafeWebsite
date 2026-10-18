import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const pw=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const out=resolve(process.env.QA_OUTPUT||'qa/refinement');await mkdir(out,{recursive:true});
const manifest=JSON.parse(await readFile(new URL('../build-manifest.json',import.meta.url),'utf8'));
const required=[[320,568],[375,667],[390,844],[430,932],[600,960],[768,1024],[1024,768],[834,1194],[1194,834],[1366,768],[1440,900],[1920,1080],[2560,1440]];
const extra=[[360,800],[540,900],[700,900],[701,900],[900,900],[901,900],[1100,800],[568,320],[667,375],[844,390],[932,430],[960,600]];
const keyPages=['/','/services','/services/cyber-security-check-up','/how-it-works','/sample-report','/contact','/home-cyber-security-bunbury','/small-business-cyber-security-bunbury'];
const base=process.env.QA_BASE||'http://127.0.0.1:4325';
if(!process.env.QA_BASE){process.env.PORT='4325';await import('./serve.mjs');}
const axe=process.env.AXE_MODULE_PATH?await readFile(process.env.AXE_MODULE_PATH,'utf8'):null;
const results={required,extra,engines:{},pdf:'',failures:[]};
for(const engine of (process.env.QA_ENGINES||'chromium,firefox,webkit').split(',')){
 const r={checks:0,errors:[],instrumentationErrors:[],failures:[],accessibility:[],screenshots:[],interactions:[],performance:[]};results.engines[engine]=r;
 let browser;
 try{browser=await pw[engine].launch({headless:true});}catch(e){r.unavailable=e.message.split('\n')[0];console.log(engine+' unavailable: '+r.unavailable);continue;}
 try{
 const page=await browser.newPage({reducedMotion:'reduce'});let phase='website';
 page.on('pageerror',e=>r.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('404'))(phase==='website'?r.errors:r.instrumentationErrors).push(m.text());});
 for(const [width,height]of (process.env.QA_VIEWPORTS?process.env.QA_VIEWPORTS.split(',').map(v=>v.split('x').map(Number)):[...required,...extra])){
 await page.setViewportSize({width,height});
 for(const entry of manifest.pages){
  await page.goto(base+entry.path,{waitUntil:'load'});
  await page.locator('img[loading=lazy]').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
  await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const m=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,images:[...document.images].every(i=>i.complete&&i.naturalWidth),clipped:[...document.querySelectorAll('main h1,main h2,.button,.report-sheet,.contact-form')].filter(el=>{let b=el.getBoundingClientRect();return b.width&& (b.left< -1||b.right>innerWidth+1)}).map(el=>el.className||el.tagName)}));
  r.checks++;if(m.scrollWidth!==width||m.h1!==1||!m.images||m.clipped.length)r.failures.push({path:entry.path,width,height,...m});
  if(entry.path==='/'&&required.some(v=>v[0]===width&&v[1]===height)||[390,768,1440].includes(width)&&keyPages.includes(entry.path)){
   const name=engine+'-'+width+'x'+height+'-'+(entry.path.slice(1).replaceAll('/','-')||'home')+'.png';
   phase='screenshot';await page.screenshot({path:resolve(out,name),fullPage:true,caret:'initial'});await page.waitForTimeout(0);phase='website';r.screenshots.push(name);
  }
 }
 console.log(engine+': '+width+'×'+height+' checked');
 }
 for(const width of [390,834,1440]){
 await page.setViewportSize({width,height:900});
 for(const path of manifest.pages.map(p=>p.path)){
  await page.goto(base+path);
  if(axe){phase='accessibility instrumentation';await page.evaluate(axe);const a=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};});r.accessibility.push({path,width,...a});phase='website';}
 }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base);
 const menu=page.locator('.menu-toggle');await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');assert(await menu.evaluate(e=>e===document.activeElement));
 await menu.click();await page.getByRole('link',{name:'Sample report',exact:true}).click();assert.equal(new URL(page.url()).pathname,'/sample-report');
 await page.locator('a[href="#findings"]').click();assert.equal(new URL(page.url()).hash,'#findings');
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('.report-tabs a[download]').click()]);assert.equal(download.suggestedFilename(),'cybersafe-sw-sample-report.pdf');
 await page.goto(base+'/services/home-wifi-security');await page.locator('.hero-aside .button').click();assert.equal(await page.locator('#service').inputValue(),'Home Wi-Fi Security');assert(await page.locator('button[type=submit]').isEnabled());
 await page.locator('#save-draft').click();assert.equal(await page.locator('#name').getAttribute('aria-invalid'),'true');assert.equal(await page.evaluate(()=>document.activeElement.id),'name');
 await page.locator('#name').fill('Fictional visitor');await page.locator('#email').fill('bad-email');await page.locator('#location').fill('Bunbury');await page.locator('#message').fill('A fictional enquiry for testing.');await page.locator('#save-draft').click();assert.equal(await page.locator('#email').getAttribute('aria-invalid'),'true');await page.locator('#email').fill('visitor@example.org');
 const[draft]=await Promise.all([page.waitForEvent('download'),page.locator('#save-draft').click()]);assert.equal(draft.suggestedFilename(),'cybersafe-enquiry-draft.txt');assert((await page.locator('#form-status').textContent()).includes('not been sent'));
 // Inspect the draft target without launching a mail client or sending a message.
 await page.evaluate(()=>document.querySelector('#email-draft-link').addEventListener('click',e=>e.preventDefault()));await page.locator('button[type=submit]').click();assert((await page.locator('#email-draft-link').getAttribute('href')).startsWith('mailto:contact@cybersafesw.com?'));assert((await page.locator('#form-status').textContent()).includes('has not sent anything'));
 await page.goto(base+'/contact');assert.equal(await page.locator('#service').inputValue(),'Something Else / Not Sure');
 assert.equal(await page.locator('.contact-intro .phone-link').getAttribute('href'),'tel:+61409224814');
 await page.locator('#privacy-settings').click();await page.locator('#decline-analytics').click();assert.equal(await page.locator('script[src*="googletagmanager"]').count(),0);
 await page.goto(base);await page.locator('.faq-list summary').first().click();assert(await page.locator('.faq-list details').first().evaluate(e=>e.open));
 await page.goto(base);await page.emulateMedia({reducedMotion:'reduce'});if(engine==='webkit')await page.locator('.skip-link').focus();else await page.keyboard.press('Tab');assert(await page.locator('.skip-link').evaluate(e=>e===document.activeElement));await page.keyboard.press('Enter');assert.equal(new URL(page.url()).hash,'#main');assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 // Tablet menu and breakpoint transition stay in sync.
 await page.setViewportSize({width:834,height:1194});await page.goto(base);assert(await menu.isVisible());await menu.click();await page.setViewportSize({width:1024,height:768});await page.waitForFunction(()=>document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false');assert.equal(await menu.getAttribute('aria-expanded'),'false');assert(await page.locator('#main-nav').isVisible());
 r.interactions=['Mobile menu, Escape and focus return','Report navigation and PDF download','Service prefill and Not Sure default','Required fields and email validation','Local draft download','Mailto drafting without sending','Phone link','Consent remains off','FAQ','Keyboard skip link','Reduced motion','Tablet/desktop menu transition'];
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await nojs.newPage();await np.goto(base);assert(await np.getByRole('link',{name:'Sample report',exact:true}).isVisible());await nojs.close();r.interactions.push('Navigation usable without JavaScript');
 }catch(e){r.failures.push({functionalError:e.stack});}
 finally{await browser.close();}
 r.errors=[...new Set(r.errors)];r.instrumentationErrors=[...new Set(r.instrumentationErrors)];console.log(engine+' complete: '+r.checks+' layout checks; '+r.failures.length+' failures');
}
await writeFile(resolve(out,'results.json'),JSON.stringify(results,null,2));
const failed=Object.entries(results.engines).some(([,r])=>r.failures.length||r.errors.length||r.accessibility.some(a=>a.violations.length));
console.log('AUDIT '+(failed?'NEEDS FIXES':Object.values(results.engines).some(r=>r.unavailable)?'PASSED FOR AVAILABLE ENGINES (see unavailable browsers)':'PASSED'));process.exit(failed?1:0);
