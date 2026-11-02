"use strict";
// B123规划校验：只读仓库文件，不访问网络、产品、机床或数据库。
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
function getAt(obj,path){return path.split(".").reduce((v,k)=>v==null?undefined:v[k],obj)}
function setAt(obj,path,value){let a=path.split("."),p=obj;for(let i=0;i<a.length-1;i++)p=p[a[i]];p[a.at(-1)]=value;return obj}
function judge(rule,x){
switch(rule){
case "B123-R01":if(!x.profile.modelRead||!x.profile.profileHash)return "UNKNOWN";if(x.profile.isaVersion!=="2.00.0")return "UNKNOWN";if(!x.profile.namespaceMatchesPinned)return "REJECT";break;
case "B123-R02":if(!x.identity.issuerId||!x.identity.mappingProof)return "UNKNOWN";if(x.identity.displayNameOnly)return "REJECT";if(!x.identity.revisionCurrent)return "STALE";break;
case "B123-R03":if(!x.start.responseObserved||x.start.readbackState!=="AllowedToStart")return "UNKNOWN";if(x.start.claimRunning||x.start.remoteCycleStart)return "REJECT";break;
case "B123-R04":if(!x.queue.snapshotExact||x.queue.eligibleA.state!=="AllowedToStart")return "UNKNOWN";if(x.queue.absoluteNextClaim||x.queue.unqualifiedSelection)return "REJECT";break;
case "B123-R05":if(!x.quantity.units)return "UNKNOWN";if(!x.quantity.runIdsUnique||x.quantity.conflatedRunItem||x.quantity.qualityFromCount)return "REJECT";break;
case "B123-R06":if(!x.response.jobResponseId)return "UNKNOWN";if(x.response.jobOrderId!==x.response.expectedJobId)return "REJECT";if(x.response.finalClaim&&!x.response.endTime)return "UNKNOWN";if(x.response.qualityClaim&&!x.response.inspectionRef)return "REJECT";break;
case "B123-R07":if(!x.release.d10Exact)return "UNKNOWN";if(!x.release.finalNcShaExact)return "REJECT";if(x.release.d15Independent!=="PASS"||!x.release.d13Known||!x.release.d16Signed||!x.release.localOperatorAuthorised)return "UNKNOWN";if(x.release.claimCycleStartFromOrder)return "REJECT";break;
case "B123-R08":if(!x.control.aclCurrent||!x.control.casMatch||x.control.cancelled||!x.control.scopeEpochCurrent)return "STALE";if(!x.control.sameOwnerPort||!x.control.oneBabylonWorld||!x.control.leftTaskPanel||!x.control.rollbackImmutable)return "REJECT";break;
default:throw new Error("unknown rule "+rule)
}
return "CANDIDATE_ONLY";
}
function compareEligible(a,b){
if(!a||!b||a.state!=="AllowedToStart"||b.state!=="AllowedToStart")return "UNKNOWN";
const at=Date.parse(a.startTime),bt=Date.parse(b.startTime);
if(!Number.isFinite(at)||!Number.isFinite(bt)||!Number.isInteger(a.priority)||!Number.isInteger(b.priority))return "UNKNOWN";
if(at!==bt)return at<bt?"A":"B";
if(a.priority!==b.priority)return a.priority>b.priority?"A":"B";
return "TIE_UNKNOWN";
}
const fixture=read("docs/capabilities/CAP-10-06/job-order-b123-fixtures-v08.json");
const trace=read("research/traces/CAP-10-06-job-order-b123-v08.json");
const source=read("research/sources/CAP-10-06-job-order-b123.json");
let passed=0; const seen=new Set();
const demand=(condition,message)=>{if(!condition)throw new Error(message);};
demand(source.registeredRecords===8&&source.sources.length===8,"source count");
demand(trace.rules.length===8&&fixture.cases.length===40&&fixture.goldens.length===4,"trace or fixtures count");
const sids=new Set(source.sources.map(x=>x.id));
for(const s of source.sources)demand(s.url&&s.edition&&s.accessDepth&&s.limits&&s.accessedOn,"source metadata missing "+s.id);
for(const r of trace.rules){
  demand(r.sourceIds.every(id=>sids.has(id)),"unregistered source "+r.id);
  demand(r.fields.length===4&&r.positive.length===1&&r.negative.length===4,"rule mapping "+r.id);
  demand(r.originalWorkPackages.includes("E3-06")&&r.originalWorkPackages.includes("T5-03"),"original packages "+r.id);
}
for(const c of fixture.cases){
  demand(!seen.has(c.id),"duplicate case "+c.id);seen.add(c.id);
  const rule=trace.rules.find(r=>r.id===c.ruleId); demand(rule,"unknown case rule "+c.id);
  demand(rule.positive.includes(c.id)||rule.negative.includes(c.id),"unmapped case "+c.id);
  if(c.mutation)demand(rule.fields.includes(c.mutation.path),"not a declared field "+c.id);
  const x=structuredClone(fixture.base);if(c.mutation)setAt(x,c.mutation.path,c.mutation.value);
  const got=judge(c.ruleId,x);demand(got===c.expected,`${c.id}: expected ${c.expected}, got ${got}`);passed++;
}
for(const g of fixture.goldens){const got=compareEligible(g.a,g.b);demand(got===g.expected,`${g.id}: expected ${g.expected}, got ${got}`);passed++;}
for(const r of trace.rules){demand([...r.positive,...r.negative].every(id=>seen.has(id)),"missing mapped case "+r.id);}
process.stdout.write(`B123 PLANNING_SYNTHETIC_ONLY ${passed}/${fixture.cases.length+fixture.goldens.length} PASS; actual OPC/MES/NC/OEM/independent consumers NOT_RUN\n`);
