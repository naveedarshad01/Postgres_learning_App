import {PGlite} from '@electric-sql/pglite';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {curriculum,exercises,plans,interviewCards} from '../src/data/curriculum.js';
import {grade,compareRows} from '../src/grading.js';
const db=await PGlite.create();await db.exec(fs.readFileSync('public/database/academy.sql','utf8'));
assert.equal(curriculum.length,30);assert.equal(exercises.length,90);assert.equal(interviewCards.length,60);
for(const [days,plan] of Object.entries(plans)){assert.equal(plan.groups.length,Number(days));assert.deepEqual(plan.groups.flat(),curriculum.map(l=>l.id));}
let pass=0,fail=[];
for(const e of exercises){try{const r=await grade(db,e,e.solution);assert.ok(r.passed,JSON.stringify(r));pass++;}catch(err){fail.push({id:e.id,title:e.title,error:err.message});}}
assert.equal(compareRows([[1],[1]],[[1]],false),false);
assert.equal(compareRows([[1],[2]],[[2],[1]],true),false);
const wrong=await grade(db,exercises[0],'SELECT 0 AS customer_id,\'wrong\' AS full_name,\'ZZ\' AS country_code');assert.equal(wrong.passed,false);
let rejected=false;try{await grade(db,exercises[0],'SELECT 1; SELECT 2;');}catch{rejected=true;}assert.ok(rejected);
rejected=false;try{await grade(db,exercises[0],'DELETE FROM academy.customers');}catch{rejected=true;}assert.ok(rejected);
const tableRows=await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='academy' AND table_type='BASE TABLE' ORDER BY table_name");
const counts={};for(const {table_name} of tableRows.rows)counts[table_name]=Number((await db.query(`SELECT count(*) AS n FROM academy.${table_name}`)).rows[0].n);
const report={testedAt:new Date().toISOString(),engine:(await db.query('SELECT version()')).rows[0].version,passed:pass,failed:fail,tableCount:tableRows.rows.length,recordCount:Object.values(counts).reduce((a,b)=>a+b,0),counts,checks:['all 90 reference answers','7/15/30 plan coverage','60 interview cards','wrong answer rejected','multiple-query submission rejected','read-only checker prevents mutation','duplicate and row-order sensitivity']};
fs.writeFileSync('docs/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await db.close();if(fail.length)process.exitCode=1;
