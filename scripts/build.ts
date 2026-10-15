import {mkdir,readFile,writeFile,cp} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {home} from '../src/home.ts';
import {commercialPages,infoPages} from '../src/pages.ts';
import type {Page} from '../src/pages.ts';
import {articlePages,articles} from '../src/articles.ts';
import {reportPage,findings} from '../src/report.ts';
import {layout,mark,esc} from '../src/components.ts';
import {business} from '../src/config.ts';
const root=resolve(import.meta.dirname,'..'),dist=resolve(root,'dist'),assets=resolve(root,'public/assets');
await mkdir(dist,{recursive:true});await mkdir(assets,{recursive:true});
const pages:Page[]=[{path:'/',title:'Cyber Security Bunbury & South West WA | CyberSafe SW',description:'Practical cyber security check-ups for homes and small businesses in Bunbury and South West WA. Onsite assessments, clear reports and straightforward advice.',body:home()},...commercialPages(),...infoPages(),...articlePages(),reportPage()];
const hashes=new Set<string>();
for(const page of pages){
 const schema=[...(page.schema||[])];if(page.path!=='/')schema.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:business.domain},{'@type':'ListItem',position:2,name:page.title.split(' | ')[0],item:business.domain+page.path}]});
 const body=page.body.replace('style="font-size:27px;margin-bottom:18px"','class="form-title"').replace('class="note" style="margin-top:0"','class="note launch-notice"').replace('style="text-decoration:underline"','class="underlined"');
 const html=layout(page.path,page.title,page.description,body,{schema,noindex:page.noindex});
 const scripts=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];for(const s of scripts)hashes.add("'sha256-"+createHash('sha256').update(s[1]).digest('base64')+"'");
 const folder=page.path==='/'?dist:resolve(dist,'.'+page.path);if(page.path==='/404')await writeFile(resolve(dist,'404.html'),html);else{await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'index.html'),html);}
}
const logo=`<svg xmlns="http://www.w3.org/2000/svg" width="380" height="85" viewBox="0 0 380 85"><g transform="translate(0 10) scale(1.3)" color="#176753">${mark.replace(/<svg[^>]+>|<\/svg>/g,'')}</g><text x="75" y="43" fill="#102b39" font-family="Arial,sans-serif" font-size="34" font-weight="600" letter-spacing="-1">CyberSafe<tspan fill="#176753" font-weight="400"> SW</tspan></text><text x="76" y="65" fill="#102b39" font-family="Arial,sans-serif" font-size="8" letter-spacing="1.4">LOCAL KNOWLEDGE. DIGITAL CONFIDENCE.</text></svg>`;
await writeFile(resolve(assets,'logo.svg'),logo);
await writeFile(resolve(assets,'favicon.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="13" fill="#102b39"/><g transform="translate(8 8)" color="#a1e7d5">${mark.replace(/<svg[^>]+>|<\/svg>/g,'')}</g></svg>`);
function social(title:string,kicker:string){return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#102b39"/><g fill="none" stroke="#40616d" opacity=".6"><circle cx="990" cy="320" r="245"/><circle cx="990" cy="320" r="173"/><circle cx="990" cy="320" r="105"/><path d="M700 320h500M990 50v540"/></g><g transform="translate(955 260) scale(2.7)" color="#a1e7d5">${mark.replace(/<svg[^>]+>|<\/svg>/g,'')}</g><g transform="translate(62 53)" color="#a1e7d5">${mark.replace(/<svg[^>]+>|<\/svg>/g,'')}</g><text x="121" y="86" fill="#fff" font-family="Arial,sans-serif" font-size="28">CyberSafe SW</text><text x="68" y="220" fill="#a1e7d5" font-family="Arial,sans-serif" font-size="15" letter-spacing="3">${esc(kicker)}</text>${title.split('|').map((line,i)=>`<text x="65" y="${304+i*69}" fill="#f4f6ee" font-family="Georgia,serif" font-size="58">${esc(line)}</text>`).join('')}<path d="M68 533h660" stroke="#496b78"/><text x="68" y="575" fill="#c7d6dc" font-family="Arial,sans-serif" font-size="17">BUNBURY &amp; SOUTH WEST WA</text><text x="728" y="575" fill="#a1e7d5" font-family="Arial,sans-serif" font-size="16">cybersafesw.com</text></svg>`;}
await writeFile(resolve(assets,'social-preview.svg'),social('A clearer picture.|A practical way forward.','LOCAL CYBER SECURITY'));
const titles=['An extra layer|for your accounts.','Five useful checks.|A stronger starting point.','Backed up?|Let’s make sure.'];
for(const [i,a] of articles.entries())await writeFile(resolve(assets,'social-'+a.slug+'.svg'),social(titles[i],a.category));
await writeFile(resolve(root,'report-data.json'),JSON.stringify(findings,null,2));
await cp(resolve(root,'public'),dist,{recursive:true});
const paths=pages.filter(p=>!p.noindex).map(p=>p.path);
await writeFile(resolve(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${business.domain+(p==='/'?'':p)}</loc></url>`).join('')}</urlset>`);
await writeFile(resolve(dist,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${business.domain}/sitemap.xml\n`);
const csp=`default-src 'self'; script-src 'self' ${[...hashes].join(' ')} https://www.googletagmanager.com; style-src 'self'; img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`;
await writeFile(resolve(dist,'_headers'),`/*\n  Content-Security-Policy: ${csp}\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Strict-Transport-Security: max-age=31536000\n/assets/*\n  Cache-Control: public, max-age=3600\n`);
await writeFile(resolve(root,'build-manifest.json'),JSON.stringify({pages:pages.map(({path,title,noindex})=>({path,title,indexable:!noindex})),csp},null,2));
console.log(`Built ${pages.length} static pages, sitemap, robots, SVG branding and security headers in ${dist}`);
