"use strict";
// 只读规划合成校验器；不读取真实NC、不做产品或机床验收。
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const d=load("docs/work-packages/E3-03/canned-retract-b30-fixtures-v08.json");
const t=load("research/traces/E3-03-canned-retract-b30-v08.json");
const sources=load("research/sources/E3-03-canned-retract-b30.json");
const verify=function verify(v){
const oksha=x=>typeof x==="string" && /^[a-f0-9]{64}$/.test(x),n=x=>typeof x==="number"&&Number.isFinite(x),eq=(a,b)=>n(a)&&n(b)&&Math.abs(a-b)<1e-8;
if(!v||v.schema!=="B30-G81-SYNTH-1")return "REJECT";
const a=v.refs||{},c=v.cycle||{},p=v.lineage||{},g=v.gate||{},w=c.word||{},s=c.start||[],e=c.expect||{};
if(!["nc","d04","d10","profile","frame"].every(k=>oksha(a[k]))||a.d04===a.d10||a.source!=="D12_FINAL_NC"||!Number.isInteger(a.d04Revision)||!Number.isInteger(a.d10Revision)||a.d04Revision===a.d10Revision)return "REJECT";
if(g.port!=="08.NcExecutionPort.interpret"||JSON.stringify(g.channels)!=='["GUI","CLI","Agent"]'||g.worlds!==1||g.panel!=="UnifiedTaskPanel.left"||g.revision!==g.observed||g.acl!==g.aclObserved||g.scope!==g.scopeObserved||g.generation!==g.generationObserved||g.cancel!==false||g.lateAck!==false||g.frozen!==true||g.frozenChanged!==false||g.d14!=="NOT_RUN"||g.d15!=="NOT_RUN"||g.d16!=="BLOCKED")return "REJECT";
if(!Number.isInteger(p.line)||p.line<1||!oksha(p.block)||!oksha(p.modalBefore)||!oksha(p.modalAfter)||!/^cycle-\d{3}$/.test(p.epoch||""))return "REJECT";
if(c.mode!=="G81"||c.plane!=="G17")return g.d13==="UNKNOWN"?"UNKNOWN":"REJECT";
if(g.d13!=="SYNTHETIC_ONLY"||!["G90","G91"].includes(c.distance)||!["G98","G99"].includes(c.retract)||c.feed!=="G94"||c.comp!=="G40"||c.rotary!==false||c.macro!==false)return "REJECT";
if(s.length!==3||![...s,c.oldZ,w.x,w.y,w.z,w.r].every(n)||!eq(c.oldZ,s[2])||!Number.isInteger(w.l)||w.l<1||w.l>16)return "REJECT";
const r=c.distance==="G90"?w.r:s[2]+w.r,z=c.distance==="G90"?w.z:r+w.z;
if(r<=z)return "REJECT";
const xy=Array.from({length:w.l},(_,i)=>c.distance==="G90"?[w.x,w.y]:[s[0]+(i+1)*w.x,s[1]+(i+1)*w.y]);
const clear=c.retract==="G98"?Math.max(c.oldZ,r):r;
if(!Array.isArray(e.xy)||e.xy.length!==xy.length||!e.xy.every((q,i)=>Array.isArray(q)&&q.length===2&&eq(q[0],xy[i][0])&&eq(q[1],xy[i][1]))||!eq(e.r,r)||!eq(e.z,z)||!eq(e.clear,clear)||e.preRapid!==(s[2]<r)||p.count!==w.l)return "REJECT";
if(c.exit==="CONTINUE"){if(!eq(c.afterOldZ,c.oldZ))return "REJECT"}else if(["G80","G0"].includes(c.exit)){if(c.afterOldZ!==null)return "REJECT"}else return "REJECT";
return "PASS";
};
const patch=function patch(o,path,val){const ps=path.split(".");let x=o;for(const k of ps.slice(0,-1)){x=x[k]}x[ps.at(-1)]=val};
const sid=new Set(sources.sources.map(s=>s.id)),cid=new Set(d.cases.map(c=>c.id));
let failures=[];
for(const r of t.rules){
 if(r.sourceIds.some(x=>!sid.has(x)))failures.push("source:"+r.id);
 if(!r.positiveIds?.length||!r.negativeIds?.length||!r.workPackageIds.includes("E3-03"))failures.push("trace:"+r.id);
 for(const p of r.fields){let x=d.base;for(const k of p.split("."))x=x?.[k];if(x===undefined)failures.push("field:"+r.id+":"+p)}
 for(const id of [...r.positiveIds,...r.negativeIds,...r.unknownIds])if(!cid.has(id))failures.push("case:"+id);
}
const count={PASS:0,REJECT:0,UNKNOWN:0};
for(const c of d.cases){const x=JSON.parse(JSON.stringify(d.base));for(const p of c.patches)patch(x,p.path,p.value);const actual=verify(x);if(actual!==c.expected)failures.push("verdict:"+c.id+":"+actual);count[c.expected]++}
console.log(JSON.stringify({status:failures.length?"FAIL":"PASS",counts:count,rules:t.rules.length,sources:sources.sources.length,level:"PLANNING_SYNTHETIC_ONLY",failures},null,2));
if(failures.length)process.exitCode=1;
