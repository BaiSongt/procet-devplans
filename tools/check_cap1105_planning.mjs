#!/usr/bin/env node
// CAP-11-05 中文规划Oracle：只读合成资料，不访问产品数据库/网络，不构成产品验证。
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const tr=load('research/traces/CAP-11-05.json'), src=load('research/sources/CAP-11-05.json');
const f=load('docs/capabilities/CAP-11-05/fixtures.json'), o=load('docs/capabilities/CAP-11-05/asset-owner-candidates.json');
const get=(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x);
function oracle(rule,input){return rule.criteria.every(c=>c.op==='eq'&&get(input,c.path)===c.value)?'PASS':'REJECT'}
function classify(s){
 if(['REVOKED_ACL','WRONG_PROJECT','UNAUTHORIZED_AGENT','FROZEN_WRITE','CANCEL_BEFORE_COMMIT','LATE_ACK','INJECTION_IN_RESULT'].includes(s))return 'REJECT';
 if(['STALE_D01','STALE_D03','STALE_D04','STALE_D08','CAS_CONFLICT'].includes(s))return 'STALE';
 if(['MISSING_HARDNESS','MISSING_TOOL','MISSING_D10','UNMODELED_CONTROLLER','MISSING_POWER_EVIDENCE','D15_UNKNOWN','CL_ONLY'].includes(s))return 'UNKNOWN';
 if(['NEEDS_HUMAN','CONFLICT_ALTERNATIVES'].includes(s))return 'AWAITING_HUMAN';
 if(['ALL_VALID','ALTERNATIVE_VALID','MATH_ONLY'].includes(s))return 'ADVISORY_ONLY';
 throw Error('未知状态 '+s);
}
assert.equal(tr.rules.length,10); assert.equal(src.sources.length,10); assert.equal(f.cases.length,50); assert.equal(f.gateCases.length,24); assert.equal(f.mathVectors.length,2);
assert.equal(o.assets.length,17); assert.equal(new Set(o.assets.map(x=>x.id)).size,17);
const sids=new Set(src.sources.map(x=>x.id));assert.equal(sids.size,10);
for(const r of tr.rules){assert.equal(r.fields.length,4);assert.deepEqual(r.fields,r.criteria.map(x=>x.path));assert(r.sourceIds.every(x=>sids.has(x)));assert(r.workPackages.includes('T5-01')&&r.workPackages.includes('T5-02'));
 const own=f.cases.filter(x=>x.ruleId===r.id);assert.equal(own.length,5);
 const p=own.find(x=>x.scenario==='POSITIVE');assert(p);assert.equal(oracle(r,p.input),'PASS');
 const mut=own.filter(x=>x.scenario==='INDEPENDENT_FIELD_MUTATION');assert.equal(mut.length,4);
 assert.deepEqual(new Set(mut.map(x=>x.mutatedField)),new Set(r.fields));
 for(const x of mut){assert.equal(oracle(r,x.input),'REJECT');assert.equal(x.expected,'REJECT');
 for(const field of r.fields){assert.equal(get(x.input,field),field===x.mutatedField?false:true)}
 }
}
for(const x of f.gateCases) assert.equal(classify(x.signal),x.expected,x.id);
for(const v of f.mathVectors){const x=v.inputs;const vf=x.fz_mm_per_tooth*x.n_rpm*x.teethEffective;
 const vc=Math.PI*x.diameter_mm*x.n_rpm/1000,q=x.ap_mm*x.ae_mm*vf/1000;
 const pc=x.ae_mm*x.ap_mm*vf*x.kc_N_per_mm2/(60*1e6);
 for(const [key,actual] of Object.entries({vf_mm_min:vf,vc_m_min:vc,q_cm3_min:q,pc_kw:pc}))
 assert(Math.abs(actual-v.expect[key])<1e-6,key+' 单位算术');
}
console.log('CAP-11-05: 50/50规则案例，24/24状态门禁，2/2算术向量，17/17 Owner候选，PLANNING_ONLY PASS');
