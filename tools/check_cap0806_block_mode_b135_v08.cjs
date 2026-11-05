// B135 只读规划合成验证。不是LinuxCNC/Haas/B5产品验收。
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const src=read("research/sources/CAP-08-06-block-mode-b135.json"),tr=read("research/traces/CAP-08-06-block-mode-b135-v08.json"),fx=read("docs/capabilities/CAP-08-06/block-mode-b135-fixtures-v08.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
const statuses=["UNKNOWN","STALE","REJECT","REJECT"];
function judge(a){for(const r of tr.rules)for(let i=0;i<r.fields.length;i++)if(get(a,r.fields[i])!==get(fx.baseline,r.fields[i]))return statuses[i];return "PLANNING_CANDIDATE_NOT_PRODUCT_PASS";}
function semantic(a){
 const bad=status=>({status,actions:[],lookAhead:"UNKNOWN"});
 if(!a.modePinned||typeof a.blockDelete!=="boolean"||typeof a.optionalStop!=="boolean")return bad("UNKNOWN");
 if(!["linuxcnc-2.9","haas-mill"].includes(a.profile))return bad("UNKNOWN_DIALECT");
 if(a.profile==="haas-mill"&&((a.s17Locked===true&&a.optionalStop)||(a.s18Locked===true&&a.blockDelete)||(typeof a.s17Locked!=="boolean")||(typeof a.s18Locked!=="boolean")))return bad("UNKNOWN_CONFIG");
 let acts=[],haasSlash=false;
 for(const line of a.program){
  if(line.startsWith("/"))haasSlash=true;
  if(line.includes("/")&&!line.startsWith("/"))return bad("UNKNOWN_SYNTAX");
  if(line.startsWith("/")&&a.blockDelete){acts.push("SKIP");continue}
  const code=line.startsWith("/")?line.slice(1):line;
  if(code==="G1")acts.push("MOVE");
  else if(code==="M01")acts.push(a.optionalStop?"PAUSE_OPTIONAL":"CONTINUE");
  else if(code==="M00")acts.push("PAUSE_MANDATORY");
  else if(code==="M30"){acts.push("END");break}
  else return bad("UNKNOWN_SYNTAX");
 }
 return {status:"SYNTHETIC_ONLY",actions:acts,lookAhead:a.profile==="haas-mill"&&haasSlash?"REQUIRES_OEM_CHECK":"NOT_MODELED"};
}
assert.equal(src.records.length,7);assert.equal(tr.rules.length,8);assert.equal(fx.tests.length,40);assert.equal(fx.goldens.length,13);
const S=new Set(src.records.map(x=>x.id)),T=new Set(fx.tests.map(x=>x.id));assert.equal(S.size,7);assert.equal(T.size,40);
for(const r of tr.rules){assert.equal(r.fields.length,4);assert.equal(r.tests.length,5);for(const id of r.sourceIds)assert.ok(S.has(id));for(const id of r.tests)assert.ok(T.has(id));}
let p=0,n=0;
for(const t of fx.tests){assert.equal(judge(t.input),t.expect,t.id);const diff=tr.rules.flatMap(r=>r.fields).filter(k=>get(t.input,k)!==get(fx.baseline,k));if(t.kind==="positive"){assert.deepEqual(diff,[]);p++;}else{assert.deepEqual(diff,[t.changedField],t.id);n++;}}
for(const g of fx.goldens)assert.deepEqual(semantic(g.input),g.expected,g.id);
assert.equal(p,8);assert.equal(n,32);
console.log(JSON.stringify({kind:"PLANNING_SYNTHETIC_ONLY",positive:p,negative:n,semanticGoldens:13,actualController:"NOT_RUN",actualD13D15:"NOT_RUN"}));
