let worker,seq=0,pending=new Map(),readyPromise;
function start(){
 worker=new Worker(new URL('./db.worker.js',import.meta.url),{type:'module'});
 worker.onmessage=({data})=>{const p=pending.get(data.id);if(!p)return;clearTimeout(p.timer);pending.delete(data.id);data.error?p.reject(Object.assign(new Error(data.error.message),data.error)):p.resolve(data.result);};
 worker.onerror=()=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(new Error('The database worker stopped. Reload the page to reconnect.'));}pending.clear();};
}
export function callDB(type,payload={},timeout=45000){
 if(!worker)start();
 return new Promise((resolve,reject)=>{const id=++seq;
 const timer=setTimeout(()=>{stopDB('The operation exceeded the time limit. Reconnect the lab; committed changes are kept.');},timeout);
 pending.set(id,{resolve,reject,timer});worker.postMessage({id,type,payload});});
}
export function stopDB(message='Query cancelled. Reconnect the lab to continue.'){
 if(worker)worker.terminate();worker=null;readyPromise=null;
 for(const p of pending.values()){clearTimeout(p.timer);p.reject(new Error(message));}pending.clear();
}
export function initDB(options={}){if(!readyPromise)readyPromise=callDB('init',options,120000).catch(e=>{readyPromise=null;throw e;});return readyPromise;}
