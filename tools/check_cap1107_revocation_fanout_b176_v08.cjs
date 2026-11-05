'use strict';
/* B176只读规划判据，独立产品测试并未运行。 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const t=read('research/traces/CAP-11-07-revocation-fanout-b176-v08.json'),s=read(t.sourceRegistry),f=read(t.fixtures);
const get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
function valid(p,v,x){
 if(p==='knowledge.sourceSha')return typeof v==='string'&&/^sha256:[a-f0-9]{64}$/.test(v);
 if(p==='knowledge.scopeEpoch')return Number.isInteger(v)&&v>=0;
 if(p==='reader.currentEpoch')return Number.isInteger(v)&&v>=x.knowledge.scopeEpoch;
 if(p==='reader.minEpoch')return Number.isInteger(v)&&v>=0&&v<=x.reader.currentEpoch;
 if(p==='provenance.invalidatedAt')return typeof v==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(v)&&!Number.isNaN(Date.parse(v));
 if(p==='provenance.relation')return v==='prov:wasInvalidatedBy';
 if(p==='revoke.reason')return v==='EVIDENCE_WITHDRAWN';
 if(p==='commit.expectedHead')return v===x.knowledge.revision;
 if(['knowledge.id','knowledge.revision','revoke.eventId','revoke.actor','provenance.activityId'].includes(p))return typeof v==='string'&&v.length>0;
 return v===true;
}
function fanout(g){
 const {root,nodes,edges,budget}=g;if(!Object.hasOwn(nodes,root))return 'UNKNOWN_GAP';
 const adj=new Map(Object.keys(nodes).map(k=>[k,[]]));
 for(const [u,v] of edges){if(!adj.has(u)||!adj.has(v))return 'UNKNOWN_GAP';adj.get(u).push(v);}
 let count=0,error=null;const colors=new Map(),affected=new Set();
 function dfs(u){if(error)return;if(colors.get(u)===1){error='UNKNOWN_CYCLE';return;}if(colors.get(u)===2)return;
  if(++count>budget){error='UNKNOWN_BUDGET';return;}colors.set(u,1);
  for(const v of adj.get(u)){if(nodes[v]!==nodes[root]){error='UNKNOWN_SCOPE';return;}affected.add(v);dfs(v);if(error)return;}
  colors.set(u,2);}
 dfs(root);if(error)return error;affected.delete(root);
 return affected.size?'IMPACT:'+Array.from(affected).sort().join(','):'IMPACT:NONE';
}
assert.equal(s.records.length,6);assert.equal(t.rules.length,8);assert.equal(f.cases.length,40);assert.equal(f.goldens.length,8);
const src=new Set(s.records.map(z=>z.id)),seen=new Set();let good=0;
for(const r of t.rules){assert.equal(r.fields.length,4);assert.deepEqual(r.originalWorkPackages,['T5-01','T5-02']);for(const id of r.sourceIds)assert.ok(src.has(id));for(const id of r.testIds)assert.ok(f.cases.some(c=>c.id===id));}
for(const c of f.cases){assert.ok(!seen.has(c.id));seen.add(c.id);const r=t.rules.find(z=>z.id===c.ruleId);assert.ok(r&&r.testIds.includes(c.id));const x=JSON.parse(JSON.stringify(f.baseline));
 if(c.changedField){assert.equal(c.kind,'single_field_negative');assert.ok(r.fields.includes(c.changedField));const [a,b]=c.changedField.split('.');assert.notDeepEqual(x[a][b],c.patchValue);x[a][b]=c.patchValue;
 assert.deepEqual(t.rules.flatMap(r=>r.fields).filter(p=>!Object.is(get(x,p),get(f.baseline,p))),[c.changedField]);}
 assert.equal(r.fields.every(p=>valid(p,get(x,p),x)),c.expected,c.id);good++;
}
for(const g of f.goldens){assert.equal(fanout(g),g.expected,g.id);good++;}
assert.equal(good,48);console.log('B176: 48/48 PLANNING_SYNTHETIC_ONLY; product/Owner/consumer NOT_RUN');
