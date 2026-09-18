// Local production server for the account-enabled source edition.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {createInviteHandler} from '../api/invite.js';
try{process.loadEnvFile('.env');}catch(e){if(e.code!=='ENOENT')throw e;}
const invite=createInviteHandler(process.env);
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const port=Number(process.env.PG_WORKBENCH_PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.wasm':'application/wasm','.sql':'text/plain; charset=utf-8','.json':'application/json','.data':'application/octet-stream','.gz':'application/gzip','.png':'image/png'};
if(!fs.existsSync(path.join(root,'index.html'))){console.error('The built app is missing. For the source edition, run npm ci and npm run build first.');process.exit(1);}
const server=http.createServer((req,res)=>{
 if(new URL(req.url,'http://localhost').pathname==='/api/invite'){invite(req,res);return;}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end('Method not allowed');return;}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Bad request');return;}
 const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
 fs.stat(target,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
 res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Content-Length':stat.size,'X-Content-Type-Options':'nosniff','Cache-Control':pathname.includes('/assets/')?'public, max-age=31536000, immutable':'no-cache'});
 if(req.method==='HEAD')res.end();else fs.createReadStream(target).pipe(res);
 });
});
server.on('error',err=>{console.error(err.code==='EADDRINUSE'?`Port ${port} is already in use. Open http://localhost:${port} if PG Workbench is running, or close the other service.`:err.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>{
 const url=`http://localhost:${port}`;console.log(`\nPG Workbench is ready: ${url}\nKeep this window open. Press Ctrl+C to stop.\nAccount progress syncs online. Practice database changes stay in this browser.\n`);
 if(process.env.PG_WORKBENCH_NO_OPEN!=='1'){
 const cmd=process.platform==='win32'?'cmd':process.platform==='darwin'?'open':'xdg-open';
 const args=process.platform==='win32'?['/c','start','',url]:[url];const child=spawn(cmd,args,{stdio:'ignore',detached:true});child.on('error',()=>{});child.unref();
 }
});
