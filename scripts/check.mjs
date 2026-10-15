import {readFile,stat} from 'node:fs/promises';import {resolve} from 'node:path';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..'),dist=resolve(root,'dist');const manifest=JSON.parse(await readFile(resolve(root,'build-manifest.json'),'utf8'));
const titles=new Set(),descriptions=new Set();let links=0,schemas=0;
for(const p of manifest.pages){const file=resolve(dist,p.path==='/404'?'404.html':'.'+p.path+'/index.html');const html=await readFile(file,'utf8');
 assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1,p.path+' must have one h1');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];assert(title&&!titles.has(title),'Missing/duplicate title '+p.path);titles.add(title);
 const desc=html.match(/<meta name="description" content="([^"]+)"/)?.[1];assert(desc&&!descriptions.has(desc),'Missing/duplicate description '+p.path);descriptions.add(desc);
 assert(html.includes('lang="en-AU"'));assert(html.includes('rel="canonical"'));assert(html.includes('og:image'));assert(html.includes('twitter:card'));
 assert(!/\$350|350\s*AUD|5-star|guaranteed protection/i.test(html));assert(!/style="|onclick=/.test(html),'Inline styling/handlers found '+p.path);
 if(p.indexable)assert(!html.includes('content="noindex'),'Indexable page has noindex '+p.path);
 for(const [,raw]of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){const list=JSON.parse(raw);assert(Array.isArray(list));for(const s of list){assert(s['@context']==='https://schema.org');assert(s['@type']);schemas++;}}
 for(const [,attr,raw]of html.matchAll(/\b(href|src)="([^"]+)"/g)){if(!raw.startsWith('/'))continue;const url=new URL(raw.replace(/&amp;/g,'&'),'https://cybersafesw.com');const target=resolve(dist,'.'+decodeURIComponent(url.pathname));let actual=target;try{if((await stat(actual)).isDirectory())actual=resolve(actual,'index.html');await stat(actual);}catch{assert.fail('Broken '+attr+' in '+p.path+': '+raw);}if(url.hash&&attr==='href'){const content=await readFile(actual,'utf8');assert(content.includes('id="'+url.hash.slice(1)+'"'),'Missing fragment '+raw);}links++;}
}
const sitemap=await readFile(resolve(dist,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,manifest.pages.filter(p=>p.indexable).length);assert(!sitemap.includes('/404'));
execFileSync(process.execPath,['--check',resolve(root,'public/assets/main.js')]);execFileSync(process.execPath,['--check',resolve(root,'netlify/functions/contact.mjs')]);
console.log(`PASS: ${manifest.pages.length} pages, ${links} internal asset/link targets, ${schemas} JSON-LD records, unique metadata, one h1, sitemap, no inline handlers, JS syntax.`);
console.log('TypeScript sources ran through Node 24 native type stripping. A full tsc semantic check requires the optional TypeScript compiler; see README.');
