#!/usr/bin/env node
'use strict';
// B11 只读校验：合成规则不用于自动控制机床
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const gitsha=p=>{const b=fs.readFileSync(path.join(root,p));return crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');};
const audit=read('research/audits/REGISTRY-AUDIT-B11-2026-10-28.json'),idx=read('research/source-index.json'),tr=read('research/traces/REGISTRY-AUDIT-B11-CROSSDOMAIN-V08.json'),fx=read('docs/architecture/v0.8/registry-audit-b11-fixtures-v08.json'),prog=read('tracking/registry-audit-progress-v08.json');
assert.equal(gitsha('research/source-index.json'),audit.sourceIndexBlobSha);assert.equal(idx.registries.length,127);assert.equal(idx.registeredRecords,1075);
const ids=new Set();let total=0,covered=0,inline=0;
for(const a of audit.items){assert.equal(idx.registries[a.ordinal-1].path,a.registryPath);assert.equal(idx.registries[a.ordinal-1].registeredRecords,a.sourceCount);assert.equal(gitsha(a.registryPath),a.registryBlobSha);assert.equal(gitsha(a.tracePath),a.traceBlobSha);
 const s=read(a.registryPath).sources,t=read(a.tracePath),refs=new Set(t.rules.flatMap(r=>r.sourceIds||[]));assert.deepEqual(s.map(x=>x.id),a.sourceIds);assert.deepEqual(s.filter(x=>!refs.has(x.id)).map(x=>x.id),a.unreferencedInOriginalSameNameTrace);
 for(const x of s){assert.ok(!ids.has(x.id));ids.add(x.id);if(x.rules?.length)inline++;}total+=s.length;covered+=s.filter(x=>refs.has(x.id)).length;}
assert.equal(total,90);assert.equal(covered,90);assert.equal(inline,0);assert.equal(audit.externalReopenedCount,8);
for(const r of tr.rules){assert.ok(r.fields.length&&r.capabilityIds.length&&r.workPackages.length);for(const id of r.sourceIds)assert.ok(ids.has(id),'dangling source '+id);for(const f of r.fields)assert.ok(fx.requirements.some(q=>q.path===f),'field missing '+f);}
const at=(x,p)=>p.split('.').reduce((a,k)=>a?.[k],x);
const errors=x=>fx.requirements.filter(q=>{const v=at(x,q.path),z=q.expected;switch(q.op){case'eq':return v!==z;case'oneOf':return !z.includes(v);case'range':return !(typeof v==='number'&&v>=z[0]&&v<=z[1]);case'intBetween':return !(Number.isInteger(v)&&v>=z[0]&&v<=z[1]);case'isDate':return !(typeof v==='string'&&v.endsWith('Z')&&Number.isFinite(Date.parse(v)));case'sameAs':return v!==at(x,z);case'greaterThanPath':return !(Number.isInteger(v)&&v>at(x,z));case'lessThanPath':return !(Number.isInteger(v)&&v<at(x,z));default:throw Error('bad op '+q.op);}}).map(q=>q.path);
let checked=0,neg=0;const base=fx.cases[0].input;
for(const c of fx.cases){const e=errors(c.input);assert.equal(e.length?'REJECT_DESIGN_CONTRACT':'PLANNING_CANDIDATE_NOT_PRODUCT_PASS',c.expected,c.id);if(c.changedField){neg++;const diff=fx.requirements.filter(q=>at(base,q.path)!==at(c.input,q.path));assert.equal(diff.length,1,c.id);assert.equal(diff[0].path,c.changedField);assert.ok(e.includes(c.expectedErrorContains));}checked++;}
const gateMap={"JOB_ORDER_TIED_START_PRIORITY":"UNKNOWN_ORDER_NOT_MACHINE_START","ALARM_ACKED_NOT_REPAIRED":"ACK_NOT_RESOLUTION","OBSERVATION_WITHOUT_CYCLE_EVENT":"UNKNOWN_PHYSICAL_START","TUF_EXPIRED_OR_CLOCK_UNKNOWN":"OFFLINE_FAIL_CLOSED","SIGNED_PACKAGE_RECEIPT_ONLY":"NOT_CONTROLLER_LOADED","TRUST_ROOT_ROLLBACK":"REJECT_ROLLBACK","RAG_CROSS_TENANT":"DENY_AND_REDACT","RAG_STALE_SELECTOR":"RESELECT_SOURCE_REVISION","CANCELLED_WITH_LATE_ACK":"DISCARD_LATE_RECEIPT","CL_PREVIEW_REQUESTS_D16":"D15_INDEPENDENT_AND_HUMAN_GATE"};
for(const g of fx.gates){assert.equal(gateMap[g.kind],g.expected);checked++;}
assert.equal(fx.positiveCases,4);assert.equal(neg,fx.independentSingleFieldNegatives);assert.equal(fx.gatesCount,10);assert.equal(prog.structuralAuditedRegistries,110);assert.equal(prog.structuralAuditedRegistrations,933);assert.equal(checked,58);
console.log('B11 原90/90同名研究结构覆盖，规划测试 '+checked+'/'+checked+'；产品测试NOT_RUN');
