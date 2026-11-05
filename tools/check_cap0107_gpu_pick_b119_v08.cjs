#!/usr/bin/env node
"use strict";
// 中文注释：规划规则与异步选取状态机只读预检；绝不连接产品/浏览器/机床。
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=read("research/sources/CAP-01-07-gpu-pick-b119.json"),t=read("research/traces/CAP-01-07-gpu-pick-b119-v08.json"),f=read("docs/capabilities/CAP-01-07/gpu-pick-b119-fixtures-v08.json");
const errors=[], ids=new Set(s.sources.map(x=>x.id)),cmap=new Map(f.cases.map(x=>[x.id,x]));
if(s.sources.length!==6||s.registeredRecords!==6||ids.size!==6)errors.push("SOURCE_COUNT");
if(t.rules.length!==8||f.cases.length!==40||cmap.size!==40||f.transitions.length!==9)errors.push("CASE_COUNT");
function judge(r,v){const i=r.fields.findIndex(k=>v[k]!==true);return i<0?"CANDIDATE":r.expectedNegativeStatuses[i]}
for(const r of t.rules){
  if(r.fields.length!==4||r.expectedNegativeStatuses.length!==4||r.positive.length!==1||r.negative.length!==4)errors.push(r.id+"规则结构");
  if(r.sourceIds.some(id=>!ids.has(id))||r.caps[0]!=="CAP-01-07"||r.originalWorkPackages.some(w=>!/^(B0|F1|W2|U4)-[0-9]{2}$/.test(w)))errors.push(r.id+"引用");
  const p=cmap.get(r.positive[0]);if(!p||p.rule!==r.id||p.expect!=="CANDIDATE"||r.fields.some(k=>p.input[k]!==true))errors.push(r.id+"正向");
  for(let j=0;j<4;j++){
    const c=cmap.get(r.negative[j]);if(!c){errors.push(r.id+"反向缺失");continue}
    const changed=r.fields.filter(k=>c.input[k]!==true);
    if(c.rule!==r.id||changed.length!==1||changed[0]!==r.fields[j]||c.mutatedField!==r.fields[j]||c.expect!==r.expectedNegativeStatuses[j])errors.push(c.id+"变异");
  }
}
for(const c of f.cases){const r=t.rules.find(x=>x.id===c.rule);if(!r||judge(r,c.input)!==c.expect)errors.push(c.id+"状态")}
function classify(v){
  if(!v.pointerActive)return "CANCELLED";
  if(v.issuedScopeEpoch!==v.currentScopeEpoch||v.issuedSceneEpoch!==v.currentSceneEpoch||v.issuedPickListRevision!==v.currentPickListRevision||v.issuedInstanceMapRevision!==v.currentInstanceMapRevision)return "STALE";
  if(!v.activeRoot||!v.aclGenerationExact)return "REJECT";
  if(!v.semanticExactRefValid)return "UNKNOWN";
  return "CANDIDATE";
}
for(const x of f.transitions)if(classify(x.input)!==x.expect)errors.push(x.id+"状态机");
console.log(JSON.stringify({planningOnly:true,registeredSources:s.sources.length,rules:t.rules.length,syntheticCases:f.cases.length,transitionSnapshots:f.transitions.length,failed:errors.length,errors,realBabylon:"NOT_RUN",independentConsumer:"NOT_RUN"}));
if(errors.length)process.exit(1);
