// B130 CAP-04-02：纯规划合成校验；不代表实际OCCT、量仪、机床或产品验收。
"use strict";
const fs=require("node:fs");const path=require("node:path");const assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const src=read("research/sources/CAP-04-02-target-uncertainty-b130.json");
const tr=read("research/traces/CAP-04-02-target-uncertainty-b130-v08.json");
const fx=read("docs/capabilities/CAP-04-02/target-uncertainty-b130-fixtures-v08.json");
function judge(a){let s=a.source,f=a.frame,c=a.cov,q=a.quality,p=a.policy,t=a.point,u=a.ui,g=a.gate,h=a.chain;
if(!s.cadRevision||!s.cadHash||!s.stockRevision||!s.stockHash||!s.occurrence)return"UNKNOWN";
if(f.from!=="PART"||f.to!=="SETUP"||f.unit!=="mm"||f.angleUnit!=="rad")return"REJECT";
if(![c.sigmaT,c.sigmaTheta,c.rho].every(Number.isFinite)||c.sigmaT<0||c.sigmaTheta<0||Math.abs(c.rho)>1)return"REJECT";if(!c.frame||!c.ref)return"UNKNOWN";
if(!q.heldout||!q.biasAssessed)return"UNKNOWN";if(q.metric!=="targetRms")return"REJECT";
if(!Number.isFinite(p.k)||p.k<=0)return"REJECT";if(!p.hash)return"UNKNOWN";
if(!Number.isFinite(t.distance)||!Number.isFinite(t.clearance)||t.distance<0)return"UNKNOWN";
const v=c.sigmaT**2+(t.distance*c.sigmaTheta)**2+2*t.distance*c.rho*c.sigmaT*c.sigmaTheta;
if(v<0||t.clearance-p.k*Math.sqrt(v)<0)return"REJECT";
if(u.worlds!==1||u.panel!=="UnifiedTaskPanel:left"||u.port!=="StockPartRegistrationPort"||!["GUI","CLI","Agent"].every(x=>u.channels.includes(x)))return"REJECT";
if(g.cancelled||g.scopeEpoch!==g.ackEpoch)return"STALE";if(!g.acl||!g.cas)return"REJECT";
if(!h.d10Separate||h.clIsNc||!h.freezeUnchanged)return"REJECT";if(!h.rollback)return"UNKNOWN";return"QUALIFIED_CANDIDATE";}
assert.equal(src.records.length,7);assert.equal(tr.rules.length,8);assert.equal(fx.tests.length,32);assert.equal(fx.goldens.length,5);
const sids=new Set(src.records.map(s=>s.id));assert.equal(sids.size,7);
const tids=new Set(fx.tests.map(t=>t.id));assert.equal(tids.size,32);
for(const rule of tr.rules){assert.ok(rule.fields.length);assert.equal(rule.tests.length,4);for(const sourceId of rule.sourceIds)assert.ok(sids.has(sourceId),rule.id+" unknown source "+sourceId);for(const t of rule.tests)assert.ok(tids.has(t),rule.id+" unknown test "+t);}
let pos=0,neg=0;for(const t of fx.tests){assert.equal(judge(t.input),t.expect,t.id);if(t.kind==="positive"){pos++;assert.equal(t.changedField,null);}else{neg++;const delta=[];for(const key in fx.baseline)for(const field in fx.baseline[key])if(JSON.stringify(fx.baseline[key][field])!==JSON.stringify(t.input[key][field]))delta.push(key+"."+field);assert.deepEqual(delta,[t.changedField],t.id);}}
assert.equal(pos,8);assert.equal(neg,24);
for(const golden of fx.goldens){const {sigmaT,sigmaTheta}=fx.baseline.cov;const v=sigmaT**2+(golden.radius*sigmaTheta)**2+2*golden.radius*golden.rho*sigmaT*sigmaTheta;const u=Math.sqrt(v),U=fx.baseline.policy.k*u;assert.ok(Math.abs(v-golden.variance)<1e-12);assert.ok(Math.abs(u-golden.u)<1e-12);assert.ok(Math.abs(U-golden.expanded)<1e-12);assert.ok(Math.abs(golden.clearance-U-golden.margin)<1e-12);}
console.log(JSON.stringify({status:"SYNTHETIC_PLANNING_PASS",positive:pos,negative:neg,golden:fx.goldens.length,productAcceptance:"NOT_RUN"}));
