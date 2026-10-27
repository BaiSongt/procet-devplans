"use strict";
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=load("research/sources/CAP-02-05.json"),t=load("research/traces/CAP-02-05-v08-supplement.json");
const f=load("docs/capabilities/CAP-02-05/research-fixtures-v08.json"),idx=load("research/source-index.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
const check=(yes,msg)=>{if(!yes)throw Error(msg)};
const accepts=(r,x)=>r.criteria.every(k=>get(x.input,k.path)===k.value);
check(s.registeredRecords===10&&s.sources.length===10&&new Set(s.sources.map(x=>x.id)).size===10,"source registry");
check(idx.registeredRecords===idx.registries.reduce((n,x)=>n+x.registeredRecords,0),"registry sum");
check(idx.registries.some(x=>x.path==="research/sources/CAP-02-05.json"&&x.registeredRecords===10),"registry path");
check(t.legacyTrace==="research/traces/CAP-02-05.json"&&t.rules.length===10,"legacy trace");
check(JSON.stringify(t.engineeringGates.ncChain)===JSON.stringify(["D09","D12","D13","D14","D15","D16"]),"NC chain");
check(t.engineeringGates.d04D10Separate&&t.engineeringGates.immutableAB&&t.engineeringGates.unknownNotPublishable,"gates");
check(f.positives.length===10&&f.negatives.length===40&&f.mathScenarios.length===4&&f.stateScenarios.length===8,"counts");
let passed=0;
for(const r of t.rules){
 check(r.capabilityId==="CAP-02-05"&&r.fields.length===4&&r.criteria.length===4&&r.capTests.length>0&&r.workPackages.length>0,r.id);
 check(r.sourceIds.length&&r.sourceIds.every(id=>s.sources.some(x=>x.id===id)),r.id+" source");
 const p=f.positives.filter(x=>x.ruleId===r.id),ns=f.negatives.filter(x=>x.ruleId===r.id);
 check(p.length===1&&accepts(r,p[0]),r.id+" positive");passed++;
 check(ns.length===4&&new Set(ns.map(x=>x.mutatedField)).size===4,r.id+" negatives");
 for(const n of ns){check(!accepts(r,n)&&get(n.input,n.mutatedField)===false&&r.fields.filter(k=>get(n.input,k)!==true).length===1,n.id);passed++;}
}
for(const m of f.mathScenarios){
 if(m.kind==="density"){const v=m.sourceUnit==="g/cm3"?m.value*1000:m.value/1000;check(Math.abs(v-m.expected)<1e-9,m.id);}
 else if(m.kind==="bboxFalsePositive"){const [x,y]=m.partPoint,b=m.boundingBox;
 const bbox=b[0]<=x&&x<=b[2]&&b[1]<=y&&y<=b[3];
 const shape=m.stockRects.some(r=>r[0]<=x&&x<=r[2]&&r[1]<=y&&y<=r[3]);
 check(bbox===m.expectedBboxContains&&shape===m.expectedStockContains,m.id);}
 else if(m.kind==="absolutePose"){let v=m.baseline;for(let n=0;n<m.repetitions;n++)v=m.baseline+m.offset;check(v===m.expected,m.id);}
 else throw Error("invalid math kind "+m.kind);
 passed++;
}
check(passed===54,"case total");
check(f.stateScenarios.every(x=>x.productAcceptance==="NOT_RUN"),"state not run");
check(t.productAcceptance==="NOT_RUN"&&f.product==="NOT_RUN"&&f.realConsumer==="NOT_RUN"&&f.independentNodeProcess==="NOT_RUN","product gate");
console.log("CAP-02-05 PLANNING_STATIC",passed,"10正40独立负4数学；8状态未执行，真实产品/消费者NOT_RUN");
