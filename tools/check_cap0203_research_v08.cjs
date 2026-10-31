"use strict";
const fs=require("fs"),path=require("path"),root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=load("research/sources/CAP-02-03.json"),t=load("research/traces/CAP-02-03.json"),f=load("docs/capabilities/CAP-02-03/research-fixtures-v08.json"),idx=load("research/source-index.json");
const get=(x,p)=>p.split(".").reduce((v,k)=>v?.[k],x);
const valid=(r,c)=>r.criteria.every(x=>get(c.input,x.path)===x.value);
function assert(x,message){if(!x)throw new Error(message);}
assert(t.capabilityId==="CAP-02-03"&&s.registeredRecords===s.sources.length&&s.sources.length===6,"source");
assert(idx.registries.some(x=>x.path==="research/sources/CAP-02-03.json"&&x.registeredRecords===6),"index");
assert(idx.registeredRecords===idx.registries.reduce((n,x)=>n+x.registeredRecords,0),"registry sum");
assert(t.rules.length===10&&f.positives.length===10&&f.negatives.length===40&&f.stateScenarios.length===8,"fixture counts");
assert(t.engineeringGates.d04D10Separate&&t.engineeringGates.unknownNotPublishable
  &&JSON.stringify(t.engineeringGates.ncChain)===JSON.stringify(["D09","D12","D13","D14","D15","D16"]),"NC chain");
const seen=new Set();let checks=0;
for(const r of t.rules){
 assert(!seen.has(r.id)&&r.fields.length===4&&r.capabilityId==="CAP-02-03",r.id);seen.add(r.id);
 assert(r.sourceIds.length>0&&r.sourceIds.every(id=>s.sources.some(z=>z.id===id)),r.id+":sources");
 assert(r.workPackages.length>0&&r.capTests.length>0&&r.criteria.length===4,r.id+":trace");
 const pos=f.positives.filter(x=>x.ruleId===r.id),neg=f.negatives.filter(x=>x.ruleId===r.id);
 assert(pos.length===1&&valid(r,pos[0]),r.id+":positive");checks++;
 assert(neg.length===4&&new Set(neg.map(x=>x.mutatedField)).size===4,r.id+":negative-number");
 for(const n of neg){
  assert(!valid(r,n)&&r.fields.filter(p=>get(n.input,p)!==true).length===1
  &&get(n.input,n.mutatedField)===false,r.id+":not independent reject "+n.id);checks++;
 }
}
assert(f.stateScenarios.every(x=>x.productAcceptance==="NOT_RUN"),"state test boundary");
assert(t.productAcceptance==="NOT_RUN"&&f.product==="NOT_RUN"&&f.independentNodeProcess==="NOT_RUN","product boundary");
console.log("CAP-02-03 PLANNING_STATIC",checks,"(10 positives + 40 independent one-field negatives), 8 state designs recorded; real product NOT_RUN");
