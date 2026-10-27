#!/usr/bin/env node
// CAP-11-06 中文静态规划Oracle：只读公开规划合成数据，非产品/机床测试。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cap='CAP-11-06', tr=load('research/traces/'+cap+'.json'),src=load('research/sources/'+cap+'.json');
const fx=load('docs/capabilities/'+cap+'/fixtures.json'),owners=load('docs/capabilities/'+cap+'/asset-owner-candidates.json');
const get=(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x);
function oracle(r,v){return r.criteria.every(c=>c.op==='eq'&&get(v,c.path)===c.value)?'PASS':'REJECT';}
function gate(s){
 const groups={
 QUEUED:['SUBMITTED'],RUNNING:['WORKER_ACK','RESTART_VALID_CHECKPOINT'],
 WAITING_DEPENDENCY:['DEPENDENCY_PENDING'],WAITING_APPROVAL:['APPROVAL_REQUIRED'],
 RETRY_WAIT:['TRANSIENT_FAILURE_SAFE'],
 RECONCILING:['DUPLICATE_SAME_KEY_DIGEST','CANCEL_AFTER_ACTUAL_COMMIT','TIMEOUT_AFTER_SEND'],
 SUCCEEDED:['OWNER_RECEIPT_VERIFIED'],CANCELLING:['CANCEL_REQUESTED'],CANCELLED:['CANCEL_BEFORE_COMMIT'],
 REJECT:['LATE_ACK_AFTER_CANCEL','REVOKED_ACL','UNAUTHORIZED_AGENT','DUPLICATE_DIFFERENT_DIGEST','FROZEN_AB_MUTATION'],
 STALE:['PROJECT_SWITCH','HASH_MISMATCH','FRAME_MISMATCH','LEASE_EXPIRED','CAS_CONFLICT'],
 UNKNOWN:['NON_IDEMPOTENT_RETRY','MCP_VERSION_UNNEGOTIATED','D13_UNKNOWN','D15_CL_ONLY'],
 SUSPENDED:['LEGACY_SCHEMA_READONLY'],FAILED:['CONSUMER_NACK']
 };
 for(const [k,v] of Object.entries(groups))if(v.includes(s))return k;
 throw Error('未建模的状态必须UNKNOWN: '+s);
}
function isDAG(edges){const g=new Map();for(const [a,b] of edges){if(!g.has(a))g.set(a,[]);if(!g.has(b))g.set(b,[]);g.get(a).push(b);}const active=new Set(),done=new Set();function dfs(v){if(active.has(v))return false;if(done.has(v))return true;active.add(v);for(const u of g.get(v))if(!dfs(u))return false;active.delete(v);done.add(v);return true;}return [...g.keys()].every(dfs);}
assert.equal(tr.rules.length,10);assert.equal(src.sources.length,10);assert.equal(fx.cases.length,50);assert.equal(fx.gateCases.length,28);assert.equal(fx.dagCases.length,4);assert.equal(owners.assets.length,17);assert.equal(new Set(owners.assets.map(x=>x.id)).size,17);
const ids=new Set(src.sources.map(x=>x.id));assert.equal(ids.size,10);
for(const r of tr.rules){
 assert.equal(r.fields.length,4);assert.deepEqual(r.fields,r.criteria.map(c=>c.path));
 assert(r.sourceIds.every(id=>ids.has(id)));assert(r.workPackages.includes('T5-01')&&r.workPackages.includes('T5-02'));
 const items=fx.cases.filter(c=>c.ruleId===r.id);assert.equal(items.length,5);
 const pos=items.find(x=>x.scenario==='POSITIVE');assert(pos);assert.equal(oracle(r,pos.input),'PASS');assert.equal(pos.expected,'PASS');
 const negatives=items.filter(x=>x.scenario==='INDEPENDENT_FIELD_MUTATION');assert.equal(negatives.length,4);
 assert.deepEqual(new Set(negatives.map(x=>x.mutatedField)),new Set(r.fields));
 for(const x of negatives){assert.equal(oracle(r,x.input),'REJECT');assert.equal(x.expected,'REJECT');for(const f of r.fields)assert.equal(get(x.input,f),x.mutatedField===f?false:true);}
}
for(const c of fx.gateCases)assert.equal(gate(c.signal),c.expected,c.id);
for(const g of fx.dagCases)assert.equal(isDAG(g.edges)?'PASS':'REJECT',g.expected,g.id);
console.log('CAP-11-06 规划合成：50字段+28状态+4 DAG=82/82 PASS；17资产Owner仅候选；产品/消费者NOT_RUN');
