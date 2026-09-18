import { PGlite } from '@electric-sql/pglite';
import { exercises } from './data/curriculum.js';
import { grade } from './grading.js';
let db, grader, seed, persistent=true;
async function initialize(options={}){
 seed=await fetch('/database/academy.sql').then(r=>{if(!r.ok)throw new Error('The practice dataset could not be loaded.'); return r.text();});
 try {if(options.temporary){persistent=false;db=await PGlite.create();}else db=await PGlite.create(`idb://pg-workbench-user-${String(options.userId||'local').replace(/[^a-zA-Z0-9-]/g,'')}`);}
 catch(e){persistent=false;db=await PGlite.create();}
 const exists=await db.query("SELECT to_regclass('academy.customers') IS NOT NULL AS ready");
 if(!exists.rows[0].ready)await db.exec(seed);
 await db.exec('SET search_path TO lab,academy,public;');
 return {persistent,version:(await db.query('SHOW server_version')).rows[0].server_version};
}
async function schema(){
 const tables=await db.query("SELECT table_schema,table_name,table_type FROM information_schema.tables WHERE table_schema IN ('academy','lab') ORDER BY table_schema,table_name");
 const columns=await db.query("SELECT table_schema,table_name,column_name,data_type,is_nullable,column_default FROM information_schema.columns WHERE table_schema IN ('academy','lab') ORDER BY table_schema,table_name,ordinal_position");
 const keys=await db.query("SELECT tc.table_schema,tc.table_name,kcu.column_name,tc.constraint_type FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name=kcu.constraint_name AND tc.constraint_schema=kcu.constraint_schema WHERE tc.table_schema IN ('academy','lab') AND tc.constraint_type IN ('PRIMARY KEY','FOREIGN KEY','UNIQUE')");
 const relations=await db.query("SELECT conrelid::regclass::text AS source,confrelid::regclass::text AS target,pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE contype='f' AND connamespace IN (SELECT oid FROM pg_namespace WHERE nspname IN ('academy','lab')) ORDER BY 1,2");
 let total=0;
 const output=[];
 for(const t of tables.rows){
   const ident='"'+t.table_schema.replaceAll('"','""')+'"."'+t.table_name.replaceAll('"','""')+'"';
   const count=(await db.query(`SELECT count(*) AS n FROM ${ident}`)).rows[0].n;
   if(t.table_type==='BASE TABLE')total+=Number(count);
   output.push({...t,count,columns:columns.rows.filter(c=>c.table_name===t.table_name&&c.table_schema===t.table_schema).map(c=>({...c,keys:keys.rows.filter(k=>k.table_name===t.table_name&&k.table_schema===t.table_schema&&k.column_name===c.column_name).map(k=>k.constraint_type)}))});
 }
 return {tables:output,relations:relations.rows,total};
}
let chain=Promise.resolve();
self.onmessage=({data})=>{chain=chain.then(async()=>{
 const {id,type,payload}=data;
 try{
  let result;
  if(type==='init')result=await initialize(payload);
  else if(type==='run'){
   if(!payload.sql.trim()||payload.sql.length>50000)throw new Error('Enter SQL between 1 and 50,000 characters.');
   const start=performance.now();
   const results=await db.exec(payload.sql);
   result={time:Math.round(performance.now()-start),results:results.map(r=>({...r,rows:r.rows.slice(0,500),totalRows:r.rows.length,truncated:r.rows.length>500}))};
  }else if(type==='schema')result=await schema();
  else if(type==='check'){
   const ex=exercises.find(e=>e.id===payload.exerciseId); if(!ex)throw new Error('Unknown exercise.');
   if(!grader){grader=await PGlite.create();await grader.exec(seed);}
   result=await grade(grader,ex,payload.sql);
  }else if(type==='prepare'){
   const ex=exercises.find(e=>e.id===payload.exerciseId);if(!ex)throw new Error('Unknown exercise.');
   await db.exec('ROLLBACK; DROP SCHEMA IF EXISTS lab CASCADE; CREATE SCHEMA lab; SET search_path TO lab,academy,public;');
   if(ex.setup)await db.exec(ex.setup);
   result={prepared:true};
  }else if(type==='reset'){
   await db.exec('ROLLBACK; DROP SCHEMA IF EXISTS academy CASCADE; DROP SCHEMA IF EXISTS lab CASCADE;');await db.exec(seed);await db.exec('SET search_path TO lab,academy,public;');result={reset:true};
  }else throw new Error('Unknown database action.');
  self.postMessage({id,result});
 }catch(e){self.postMessage({id,error:{message:e.message,code:e.code,detail:e.detail,hint:e.hint,position:e.position}});}
});};
