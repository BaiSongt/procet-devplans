"use strict";
// B129只读校验器：只读取本规划仓JSON，不修改产品/机床数据
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const get=(x,p)=>p.split(".").reduce((v,k)=>v==null?undefined:v[k],x);
const judge=(obj,rules)=>{for(const r of rules)for(const g of r.guards){
 const lhs=get(obj,g.path),rhs=g.op==="same"?get(obj,g.rhs):g.rhs;
 const ok=g.op==="eq"||g.op==="same"?lhs===rhs:g.op==="sha"?typeof lhs==="string"&&/^[a-f0-9]{64}$/.test(lhs):g.op==="nonempty"?typeof lhs==="string"&&lhs.length>0:false;
 if(!ok)return "REJECT_"+r.id;
}return "REVIEW_ONLY";};
function main(){
 const s=load("research/sources/CAP-02-03-retention-knob-b129.json"),t=load("research/traces/CAP-02-03-retention-knob-b129-v08.json"),f=load("docs/capabilities/CAP-02-03/retention-knob-b129-fixtures-v08.json");
 if(s.registeredRecords!==7||s.sources.length!==7||t.ruleCount!==8||t.rules.length!==8||f.cases.length!==40)throw Error("count mismatches");
 const src=new Set(s.sources.map(x=>x.id)),ids=new Set(f.cases.map(x=>x.id));
 if(src.size!==7||ids.size!==40)throw Error("duplicate IDs");
 for(const r of t.rules){
  if(!r.sourceIds.length||r.sourceIds.some(x=>!src.has(x))||r.guards.length!==4)throw Error("invalid rule "+r.id);
  for(const id of [...r.positiveIds,...r.negativeIds])if(!ids.has(id))throw Error("orphan reference "+id);
  for(const g of r.guards)if(!r.fields.includes(g.path)||get(f.base,g.path)===undefined||(g.op==="same"&&get(f.base,g.rhs)===undefined))throw Error("unknown field "+g.path);
 }
 let pos=0,neg=0;
 for(const c of f.cases){
  const r=t.rules.find(x=>x.id===c.ruleId);if(!r||![...r.positiveIds,...r.negativeIds].includes(c.id))throw Error("unmapped case "+c.id);
  if(c.changes.length>1)throw Error("non-independent case");
  const x=structuredClone(f.base);
  for(const v of c.changes){const p=v.path.split("."),k=p.pop();let n=x;for(const q of p)n=n[q];n[k]=v.value;}
  if(judge(x,t.rules)!==c.expected)throw Error("bad verdict "+c.id);
  c.changes.length?neg++:pos++;
 }
 if(pos!==8||neg!==32)throw Error("case partition");
 console.log("B129 PASS_SYNTHETIC_ONLY: "+pos+" positive, "+neg+" negative; product NOT_RUN");
}
if(require.main===module)main();
module.exports={judge,main};
