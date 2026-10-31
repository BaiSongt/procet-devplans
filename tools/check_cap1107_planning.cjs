#!/usr/bin/env node
// 中文：规划合成核对工具，非实际知识服务/NC/机床测试。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const load=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const cap='CAP-11-07',tr=load('research/traces/'+cap+'.json'),src=load('research/sources/'+cap+'.json'),fx=load('docs/capabilities/'+cap+'/fixtures.json'),owner=load('docs/capabilities/'+cap+'/asset-owner-candidates.json');
const get=(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x);
const pass=(r,x)=>r.criteria.every(c=>c.op==='eq'&&get(x,c.path)===true)?'PASS':'REJECT';
const gates={"CANDIDATE":["FEEDBACK_RECEIVED","D17_EVENT_IMPORTED","AI_CLASSIFICATION_ONLY"],"REVIEW_REQUIRED":["DUPLICATE_FOUND","CONTRADICTION_FOUND","EVIDENCE_REVIEW_REQUESTED","HUMAN_APPROVAL_PENDING"],"APPROVED_PROPOSAL":["HUMAN_APPROVED_DIGEST","APPROVAL_SIGNED_ONLY"],"NEW_REVISION":["OWNER_CAS_COMMITTED","ROLLBACK_CREATED_NEW_REVISION"],"STALE":["PARENT_HASH_CHANGED","FRAME_CHANGED","SCOPE_EPOCH_CHANGED","DEPENDENCY_REVISION_CHANGED"],"REJECT":["ACL_REVOKED","AGENT_SELF_APPROVAL","FROZEN_AB_OVERWRITE","LATE_ACK_AFTER_CANCEL","POISONED_RETRIEVAL"],"UNKNOWN":["D13_UNKNOWN","CL_ONLY_AS_NC_PROOF","LEGACY_SCHEMA_UNVERIFIED"],"SUSPENDED":["INDEPENDENT_CONSUMER_NACK"]};
function gate(s){for(const [k,v] of Object.entries(gates))if(v.includes(s))return k;return 'UNKNOWN';}
function dag(e){const g=new Map();for(const [a,b] of e){g.set(a,[...(g.get(a)||[]),b]);if(!g.has(b))g.set(b,[]);}const active=new Set(),done=new Set();function walk(x){if(active.has(x))return false;if(done.has(x))return true;active.add(x);for(const n of g.get(x))if(!walk(n))return false;active.delete(x);done.add(x);return true;}return [...g.keys()].every(walk);}
assert.equal(src.sources.length,10);assert.equal(tr.rules.length,10);assert.equal(fx.cases.length,50);assert.equal(fx.gateCases.length,24);assert.equal(fx.lineageCases.length,6);assert.equal(owner.assets.length,17);
const ids=new Set(src.sources.map(s=>s.id));assert.equal(ids.size,10);
for(const r of tr.rules){assert.equal(r.fields.length,4);assert.deepEqual(r.fields,r.criteria.map(c=>c.path));assert(r.sourceIds.every(s=>ids.has(s)));const a=fx.cases.filter(c=>c.ruleId===r.id);assert.equal(a.length,5);assert.deepEqual(new Set(a.filter(c=>c.mutatedField).map(c=>c.mutatedField)),new Set(r.fields));for(const x of a){assert.equal(pass(r,x.input),x.expected);if(x.mutatedField)for(const p of r.fields)assert.equal(get(x.input,p),p===x.mutatedField?false:true);}}
for(const x of fx.gateCases)assert.equal(gate(x.signal),x.expected);for(const x of fx.lineageCases)assert.equal(dag(x.edges)?'PASS':'REJECT',x.expected);
console.log('CAP-11-07规划合成80/80 PASS；产品/独立消费者NOT_RUN');
