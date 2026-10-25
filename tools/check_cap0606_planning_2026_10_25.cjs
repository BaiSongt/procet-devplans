// CAP-06-06 合成规划规则检查；不运行OCCT/产品/NC，也不证明行业安全。
'use strict';
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const cases=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-06-06/fixtures.json'),'utf8'));
const trace=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-06-06.json'),'utf8'));
const sources=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-06-06.json'),'utf8'));
const assess=function assess(ruleId,x){
 const H=v=>typeof v==="string" && /^[0-9a-f]{64}$/.test(v), P=v=>Number.isInteger(v)&&v>0;
 let ok=false;
 switch(ruleId){
 case "C0606-R01":ok=x.exact?.project==="SYN"&&x.exact?.setup==="S1"&&P(x.exact?.revision)&&H(x.exact?.hash)&&H(x.exact?.frameHash)&&x.exact?.owner==="06"&&x.exact?.scope==="SYN/A/S1";break;
 case "C0606-R02":{let b=x.budget||{};ok=["beamWidth","maxBooleanCalls","maxExpansions","maxWallMs","maxBytes","workers"].every(k=>P(b[k]))&&b.workers<=b.beamWidth;break;}
 case "C0606-R03":{let t=x.ledger||{},a=t.inflight||[];ok=P(t.limit)&&Number.isInteger(t.used)&&t.used>=0&&a.every(y=>y.token&&P(y.cost))&&new Set(a.map(y=>y.token)).size===a.length&&t.used+a.reduce((s,y)=>s+y.cost,0)<=t.limit&&t.atomicReservation===true;break;}
 case "C0606-R04":{let t=x.frontier||{},a=t.items||[];ok=P(t.seed)&&t.tiePolicy==="score_cost_uid"&&t.workerOrderIndependent===true&&H(t.snapshotHash)&&a.length>0&&a.every(y=>typeof y.key==="string"&&y.uid)&&new Set(a.map(y=>y.uid)).size===a.length&&a.every((y,i)=>i===0||a[i-1].key<=y.key);break;}
 case "C0606-R05":{let d=x.dominance||{},a=d.a||{},b=d.b||{};ok=d.claimPrune===true&&H(a.stockBytesHash)&&a.stockBytesHash===b.stockBytesHash&&H(a.protectionHash)&&a.protectionHash===b.protectionHash&&a.remainingHash===b.remainingHash&&a.frameHash===b.frameHash&&a.toleranceHash===b.toleranceHash&&a.scope===b.scope&&Number.isFinite(a.cost)&&Number.isFinite(b.cost)&&a.cost<=b.cost;break;}
 case "C0606-R06":{let f=x.fork||{};ok=H(f.parentHash)&&f.parentPreserved===true&&H(f.d08Before)&&f.d08Before===f.d08After&&Array.isArray(f.children)&&f.children.length>=2&&f.children.every(c=>c.parentHash===f.parentHash&&H(c.hash))&&new Set(f.children.map(c=>c.hash)).size===f.children.length;break;}
 case "C0606-R07":{let t=x.cancel||{};ok=t.cancelled===true&&P(t.cancelGeneration)&&Number.isInteger(t.receiptGeneration)&&t.receiptGeneration<t.cancelGeneration&&t.receiptDisposition==="IGNORED_NO_COMMIT"&&t.newOwnerRevision===null;break;}
 case "C0606-R08":{let r=x.replay||{};ok=r.schema==="frontier-v1"&&r.algorithmVersion==="solver-planning-v0.8"&&H(r.configHash)&&H(r.scopeHash)&&H(r.inputHash)&&H(r.persistedHash)&&r.persistedHash===r.observedHash&&r.seal==="SEALED"&&r.missingWorkerOutputs==="QUARANTINED";break;}
 case "C0606-R09":{let c=x.commit||{};ok=c.port==="06.SolverCandidatePort"&&c.expectedHead===c.observedHead&&P(c.aclEpoch)&&c.aclEpoch===c.observedAclEpoch&&P(c.taskGeneration)&&c.taskGeneration===c.observedTaskGeneration&&c.cancelled===false&&c.uniqueTerminal===true&&c.idempotencyKey&&c.receipt==="COMMITTED";break;}
 case "C0606-R10":{let q=x.qualification||{};ok=q.status==="BUDGET_EXHAUSTED_UNKNOWN"&&q.d07==="REQUIRED_NOT_RUN"&&q.d05==="NOT_APPROVED"&&q.d08FrozenUnchanged===true&&q.d13==="UNKNOWN"&&q.d15==="NOT_RUN"&&q.d16==="BLOCKED"&&q.clPreviewAsNcProof===false&&q.materialSweepSimulated===false;break;}
 }
 return ok?"PASS":({
 "C0606-R01":"REJECT_EXACT_SCOPE",
 "C0606-R02":"REJECT_UNBOUNDED_BUDGET",
 "C0606-R03":"REJECT_BUDGET_LEDGER",
 "C0606-R04":"REJECT_UNSTABLE_FRONTIER",
 "C0606-R05":"REJECT_UNSAFE_DOMINANCE",
 "C0606-R06":"REJECT_FROZEN_FORK",
 "C0606-R07":"REJECT_LATE_RECEIPT",
 "C0606-R08":"REJECT_UNTRUSTED_CHECKPOINT",
 "C0606-R09":"REJECT_OWNER_COMMIT",
 "C0606-R10":"REJECT_FALSE_QUALIFICATION"})[ruleId]||"UNKNOWN_RULE";
};
function check(){
 const all=[...cases.cases,...cases.mutationCases],ids=new Set(),rids=new Set(trace.rules.map(r=>r.id)),sids=new Set(sources.sources.map(s=>s.id));
 if(trace.rules.length!==10||cases.cases.length!==20||cases.mutationCases.length!==10||sources.sources.length!==9)throw Error('规划追踪数量不符');
 for(const r of trace.rules){if(!r.sourceIds.length||r.sourceIds.some(s=>!sids.has(s))||!r.fields.length||!r.assets.length)throw Error('断链 '+r.id);}
 for(const x of all){if(ids.has(x.id)||!rids.has(x.ruleId)||x.expected!==assess(x.ruleId,x.input))throw Error('断言失败/重复 '+x.id);ids.add(x.id);}
 for(const r of trace.rules){if(!ids.has(r.positiveTestId)||!ids.has(r.negativeTestId))throw Error('验收未链接 '+r.id);}
 console.log('CAP-06-06 规划合成 10正+10反+10变异=30/30 PASS；产品/OCCT/真实消费者NOT_RUN');return true;
}
if(require.main===module)check();module.exports={assess,check};
