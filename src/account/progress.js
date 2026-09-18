export const initial={version:1,plan:30,day:1,selected:'1.1',completed:{},reviewed:{},drafts:{},notes:{},drills:{},quizScore:null,history:[],mockEnd:null,helpUsed:{}};
export function normalizeProgress(value){
 const x=value && typeof value==='object' && !Array.isArray(value)?value:{};
 const out={...initial,...x,version:1};
 out.plan=[7,15,30].includes(Number(out.plan))?Number(out.plan):30;
 out.day=Math.max(1,Math.min(Number(out.day)||1,out.plan));
 for(const k of ['completed','reviewed','drafts','notes','drills','helpUsed'])if(!out[k]||typeof out[k]!=='object'||Array.isArray(out[k]))out[k]={};
 for(const k of ['drafts','notes'])out[k]=Object.fromEntries(Object.entries(out[k]).filter(([,v])=>typeof v==='string'));
 if(!out.quizScore||!Number.isInteger(out.quizScore.score)||out.quizScore.score<0||out.quizScore.score>20)out.quizScore=null;
 out.history=Array.isArray(out.history)?out.history.filter(h=>h&&typeof h.sql==='string').slice(0,25):[];
 if(!/^([1-9]|[12][0-9]|30)\.[123]$/.test(out.selected))out.selected='1.1';
 return out;
}
// One writer at a time; revision checks in PostgreSQL reject stale device writes.
export function createProgressWriter(initialState,revision,save,onStatus=()=>{}){
 let state=initialState,ack=JSON.stringify(state),currentRevision=revision,running=null,conflict=false,closed=false;
 function dirty(){return JSON.stringify(state)!==ack;}
 function set(next){state=next;onStatus(dirty()?'Pending changes':'Saved');}
 async function flush(){
  if(closed)return;
  if(running){await running;if(dirty())return flush();return;}
  if(conflict)throw new Error('Another session saved newer progress. Export your work, then reload.');
  if(!dirty())return;
  running=(async()=>{
   while(dirty()&&!closed){
    const snapshot=JSON.stringify(state);
    if(new TextEncoder().encode(snapshot).length>950000)throw new Error('Progress exceeds 950 KB. Export a backup, then shorten large notes or SQL drafts.');
    onStatus('Saving…');
    currentRevision=await save(JSON.parse(snapshot),currentRevision);
    ack=snapshot;
   }
   if(!closed)onStatus('Saved');
  })();
  try{await running;}catch(e){conflict=/PROGRESS_CONFLICT|Another session/.test(e.message);if(!closed)onStatus(conflict?'Conflict — export, then reload':`Not saved: ${e.message}`);throw e;}finally{running=null;}
 }
 return {set,flush,dirty,close(){closed=true;},getState:()=>state};
}
