"use strict";
const fs=require("fs"),path=require("path"),root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=load("research/sources/CAP-02-04.json"),t=load("research/traces/CAP-02-04-v08-supplement.json"),f=load("docs/capabilities/CAP-02-04/research-fixtures-v08.json"),idx=load("research/source-index.json");
const get=(x,p)=>p.split(".").reduce((v,k)=>v?.[k],x);
function assert(x,m){if(!x)throw Error(m);}
const accepts=(r,c)=>r.criteria.every(k=>get(c.input,k.path)===k.value);
assert(s.registeredRecords===8&&s.sources.length===8&&new Set(s.sources.map(x=>x.id)).size===8,"sources");
assert(idx.registries.some(x=>x.path==="research/sources/CAP-02-04.json"&&x.registeredRecords===8),"index-entry");
assert(idx.registeredRecords===idx.registries.reduce((n,x)=>n+x.registeredRecords,0),"index-sum");
assert(t.legacyTrace==="research/traces/CAP-02-04.json"&&t.rules.length===10,"legacy-trace");
assert(JSON.stringify(t.engineeringGates.ncChain)===JSON.stringify(["D09","D12","D13","D14","D15","D16"])&&t.engineeringGates.d04D10Separate&&t.engineeringGates.unknownNotPublishable,"gates");
assert(f.positives.length===10&&f.negatives.length===40&&f.mathScenarios.length===6&&f.stateScenarios.length===8,"fixture-count");
let passed=0;
for(const r of t.rules){
 assert(r.capabilityId==="CAP-02-04"&&r.fields.length===4&&r.criteria.length===4&&r.workPackages.length>0&&r.capTests.length>0,r.id);
 assert(r.sourceIds.length>0&&r.sourceIds.every(x=>s.sources.some(y=>y.id===x)),r.id+":source");
 const p=f.positives.filter(x=>x.ruleId===r.id),ns=f.negatives.filter(x=>x.ruleId===r.id);
 assert(p.length===1&&accepts(r,p[0]),r.id+":positive");passed++;
 assert(ns.length===4&&new Set(ns.map(x=>x.mutatedField)).size===4,r.id+":neg-count");
 for(const x of ns){assert(!accepts(r,x)&&r.fields.filter(k=>get(x.input,k)!==true).length===1&&get(x.input,x.mutatedField)===false,r.id+":independent "+x.id);passed++;}
}
function rank(a){const m=a.map(row=>row.slice()),n=m.length,p=m[0].length;let r=0;for(let j=0;j<p&&r<n;j++){let k=r;for(let i=r+1;i<n;i++)if(Math.abs(m[i][j])>Math.abs(m[k][j]))k=i;if(Math.abs(m[k][j])<1e-10)continue;[m[r],m[k]]=[m[k],m[r]];let v=m[r][j];for(let z=j;z<p;z++)m[r][z]/=v;for(let i=r+1;i<n;i++){let z=m[i][j];for(let q=j;q<p;q++)m[i][q]-=z*m[r][q];}r++;}return r;}
for(const c of f.mathScenarios){
 if(c.kind==="rank")assert(rank(c.matrix)===c.expected,c.id);
 else if(c.kind==="oneSidedEscape"){let q=c.witness;assert(rank(c.matrix)===6&&q.some(v=>v!==0)&&c.matrix.every(row=>row.reduce((s,v,i)=>s+v*q[i],0)>=-1e-10)===c.expected,c.id);}
 else if(c.kind==="frictionCone"){let norm=Math.hypot(...c.tangential);assert((norm>c.mu*c.normalForce)===(c.expected==="OUTSIDE_CONE"),c.id);}
 else throw Error("unknown math type "+c.kind);
 passed++;
}
assert(f.stateScenarios.every(x=>x.productAcceptance==="NOT_RUN"),"state-scope");
assert(t.productAcceptance==="NOT_RUN"&&f.product==="NOT_RUN"&&f.realConsumer==="NOT_RUN"&&f.independentNodeProcess==="NOT_RUN","product-scope");
console.log("CAP-02-04 PLANNING_STATIC",passed,"(10 positive, 40 one-field negatives, 6 math), 8 state designs NOT_RUN; real consumers NOT_RUN");
