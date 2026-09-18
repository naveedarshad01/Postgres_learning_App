import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {initial,createProgressWriter} from '../src/account/progress.js';
import {createInviteHandler} from '../api/invite.js';
const uidA='11111111-1111-4111-8111-111111111111',uidB='22222222-2222-4222-8222-222222222222',uidAdmin='33333333-3333-4333-8333-333333333333';
test('Account SQL: creation, unique usernames, role isolation, private progress and stale-write rejection',async()=>{
 const db=new PGlite();
 try{
 await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to authenticated,anon; grant execute on function auth.uid() to authenticated,anon;`);
 await db.exec(await fs.readFile(new URL('../supabase/setup.sql',import.meta.url),'utf8'));
 for(const [id,username] of [[uidA,'alice'],[uidB,'bob'],[uidAdmin,'owner']])await db.query('insert into auth.users values ($1,$2)',[id,{username,role:'admin'}]);
 await assert.rejects(()=>db.query('insert into auth.users values ($1,$2)',['44444444-4444-4444-8444-444444444444',{username:'alice'}]),/unique/);
 await db.query("update public.profiles set role='admin' where id=$1",[uidAdmin]);
 const asUser=async id=>{await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await db.exec('set role authenticated');};
 await asUser(uidA);
 assert.equal((await db.query('select * from public.profiles')).rows.length,1);
 assert.equal((await db.query('select role from public.profiles')).rows[0].role,'learner');
 assert.equal((await db.query('select user_id from public.learner_progress')).rows[0].user_id,uidA);
 await assert.rejects(()=>db.exec("update public.profiles set role='admin'"),/permission denied/);
 await assert.rejects(()=>db.exec('select * from public.admin_learners()'),/Administrator/);
 await assert.rejects(()=>db.exec("update public.learner_progress set revision=100"),/permission denied/);
 const state={...initial,notes:{'1.1':'PRIVATE NOTE'},drafts:{'1.1':'PRIVATE SQL'},completed:{'1.1':{at:'2026-09-18',assisted:false}}};
 assert.equal((await db.query('select public.save_my_progress($1,0) as revision',[state])).rows[0].revision,1);
 await assert.rejects(()=>db.query('select public.save_my_progress($1,0)',[initial]),/PROGRESS_CONFLICT/);
 await assert.rejects(()=>db.query('select public.save_my_progress($1,1)',[{...initial,plan:4}]),/Unsupported/);
 await asUser(uidB);
 assert.equal((await db.query('select state from public.learner_progress')).rows[0].state.notes,undefined);
 await asUser(uidAdmin);
 const rows=(await db.query('select * from public.admin_learners()')).rows;
 assert.equal(rows.length,3);
 assert.equal(rows.find(x=>x.username==='alice').learning.completed['1.1'].assisted,false);
 assert.equal(rows.find(x=>x.username==='alice').learning.notes,undefined);
 assert.equal(rows.find(x=>x.username==='alice').learning.drafts,undefined);
 assert.equal((await db.query('select * from public.learner_progress')).rows.length,1);
 assert.equal((await db.query("select * from public.admin_learners('ali',0)")).rows.length,1);
 await db.exec('reset role;set role anon');
 await assert.rejects(()=>db.exec('select * from public.profiles'),/permission denied/);
 await assert.rejects(()=>db.exec('select * from public.admin_learners()'),/permission denied/);
 }finally{await db.close();}
});
test('Progress writer serializes updates, retries failures and rejects conflicts without overwriting',async()=>{
 let release;const wait=new Promise(r=>release=r);const calls=[];
 const w=createProgressWriter(initial,0,async(state,revision)=>{calls.push({state,revision});if(calls.length===1)await wait;return revision+1;});
 w.set({...initial,day:2});const first=w.flush();w.set({...initial,day:3});release();await first;
 assert.deepEqual(calls.map(c=>[c.state.day,c.revision]),[[2,0],[3,1]]);assert.equal(w.dirty(),false);
 let failures=0;const retry=createProgressWriter(initial,0,async()=>{if(failures++===0)throw Error('Offline');return 1;});retry.set({...initial,day:2});await assert.rejects(retry.flush(),/Offline/);assert.equal(retry.dirty(),true);await retry.flush();assert.equal(retry.dirty(),false);
 let attempts=0;const conflict=createProgressWriter(initial,0,async()=>{attempts++;throw Error('PROGRESS_CONFLICT');});conflict.set({...initial,day:2});await assert.rejects(conflict.flush());await assert.rejects(conflict.flush());assert.equal(attempts,1);assert.equal(conflict.dirty(),true);
});
const env={SUPABASE_URL:'https://test.supabase.co',VITE_SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'server-secret',APP_URL:'https://app.example.com'};
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(s){this.code=s;return this;},json(body){this.body=body;return this;}};}
test('Invite endpoint rejects unauthenticated/non-admin/foreign-origin requests; admin invites use server-controlled URL',async()=>{
 let role='learner',invites=0;
 const factory=(url,key)=>key==='server-secret'?{auth:{admin:{inviteUserByEmail:async(email,options)=>{invites++;assert.equal(email,'learner@example.com');assert.equal(options.redirectTo,'https://app.example.com/?account=setup');assert.equal(options.data.role,undefined);return {};}}}}:{auth:{getUser:async()=>({data:{user:{id:uidA}}})},from:()=>({select:()=>({eq:()=>({single:async()=>({data:{role}})})})})};
 const handler=createInviteHandler(env,factory);let res=response();await handler({method:'POST',headers:{}},res);assert.equal(res.code,401);
 res=response();await handler({method:'POST',headers:{authorization:'Bearer valid',origin:'https://other.example'}},res);assert.equal(res.code,403);
 const req={method:'POST',headers:{authorization:'Bearer valid',origin:'https://app.example.com'},body:{email:'learner@example.com',username:'learner_1',role:'admin',display_name:'Learner'}};
 res=response();await handler(req,res);assert.equal(res.code,403);assert.equal(invites,0);
 role='admin';res=response();await handler(req,res);assert.equal(res.code,200);assert.equal(invites,1);
 res=response();await handler({...req,body:{...req.body,username:'INVALID NAME!'}},res);assert.equal(res.code,400);
 res=response();await handler({...req,method:'GET'},res);assert.equal(res.code,405);
});
