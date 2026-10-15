import http from 'node:http';import {readFile,stat} from 'node:fs/promises';import {resolve,extname,sep} from 'node:path';
import handler from '../netlify/functions/contact.mjs';
const root=resolve(import.meta.dirname,'../dist'),port=Number(process.env.PORT||4321);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const csp=JSON.parse(await readFile(resolve(root,'../build-manifest.json'),'utf8')).csp.replace('; upgrade-insecure-requests','');
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/.netlify/functions/contact'){const chunks=[];let bytes=0;for await(const chunk of req){bytes+=chunk.length;if(bytes>16000){res.writeHead(413,{'Content-Type':'application/json'});res.end('{"error":"Enquiry too long."}');return;}chunks.push(chunk);}const request=new Request('http://127.0.0.1:'+port+url.pathname,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});const response=await handler(request);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;}
 let path=resolve(root,'.'+decodeURIComponent(url.pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}let status=200;
 try{if((await stat(path)).isDirectory())path=resolve(path,'index.html');await stat(path);}catch{path=resolve(root,'404.html');status=404;}
 const content=await readFile(path);res.writeHead(status,{'Content-Type':types[extname(path)]||'application/octet-stream','Content-Security-Policy':csp,'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()'});res.end(req.method==='HEAD'?undefined:content);
 }catch{res.writeHead(400);res.end('Invalid request.');}});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
process.on('SIGINT',()=>server.close(()=>process.exit(0)));
