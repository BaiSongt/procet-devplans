#!/usr/bin/env node
// 中文注释：仅核对规划规则/来源/合成及解析向量，不操作产品仓和机床。
"use strict";
const fs=require("node:fs"), path=require("node:path");
const root=path.resolve(__dirname,".."), load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const sources=load("research/sources/CAP-02-07-gltf-b117.json");
const trace=load("research/traces/CAP-02-07-gltf-b117-v08.json");
const fixtures=load("docs/capabilities/CAP-02-07/gltf-b117-fixtures-v08.json");
const expectedKinds=[["UNKNOWN","REJECT","UNKNOWN","STALE"],["REJECT","REJECT","REJECT","REJECT"],["UNKNOWN","REJECT","REJECT","REJECT"],["REJECT","REJECT","REJECT","REJECT"],["STALE","UNKNOWN","UNKNOWN","UNKNOWN"],["STALE","STALE","UNKNOWN","REJECT"],["STALE","REJECT","REJECT","STALE"],["REJECT","REJECT","REJECT","REJECT"]];
const errors=[], ids=new Set(sources.sources.map(s=>s.id)), map=new Map(trace.rules.map(r=>[r.id,r]));
if(sources.registeredRecords!==sources.sources.length||sources.sources.length!==7)errors.push("来源登记数异常");
if(trace.rules.length!==8||fixtures.cases.length!==40||fixtures.goldens.length!==5)errors.push("规则或样例数异常");
const byId=new Map(fixtures.cases.map(c=>[c.id,c])); if(byId.size!==fixtures.cases.length)errors.push("重复用例ID");
for(const [i,r] of trace.rules.entries()){
 if(r.fields.length!==4||r.fields.some(f=>!f))errors.push(r.id+"字段数不符");
 for(const s of r.sourceIds)if(!ids.has(s))errors.push(r.id+"未知来源"+s);
 for(const pkg of r.originalWorkPackages)if(!/^(F1|U4|E3)-\d{2}$/.test(pkg))errors.push(r.id+"原包编号异常");
 for(const id of [...r.positive,...r.negative])if(!byId.has(id))errors.push(r.id+"缺用例"+id);
 if(r.positive.length!==1||r.negative.length!==4)errors.push(r.id+"正反分配不足");
 const base=byId.get(r.positive[0]);if(!base||base.rule!==r.id||base.expect!=="CANDIDATE"||r.fields.some(f=>base.input[f]!==true))errors.push(r.id+"基线异常");
 for(const [k,id] of r.negative.entries()){
  const c=byId.get(id);if(!c)continue;
  const changes=r.fields.filter(f=>base.input[f]!==c.input[f]);
  if(c.rule!==r.id||changes.length!==1||changes[0]!==r.fields[k]||c.mutatedField!==r.fields[k]||c.expect!==expectedKinds[i][k])errors.push(id+"变异或预期异常");
 }
}
for(const c of fixtures.cases){
 const r=map.get(c.rule);if(!r){errors.push(c.id+"规则不存在");continue}
 const ri=trace.rules.indexOf(r), bad=r.fields.findIndex(f=>c.input[f]!==true);
 const actual=bad<0?"CANDIDATE":expectedKinds[ri][bad];
 if(actual!==c.expect)errors.push(c.id+"预期与同判定函数不符");
}
const near=(a,b)=>Math.abs(a-b)<1e-8, gs=fixtures.goldens;
const vec=(a,b)=>a.length===b.length&&a.every((x,i)=>near(x,b[i]));
const det=s=>s.reduce((a,b)=>a*b,1);
const g=gs[1];
const actual=[g.translationM[0]*1000-g.localPointM[1]*1000,g.translationM[1]*1000+g.localPointM[0]*1000,0];
const wrong=[-g.translationM[1]*1000-g.localPointM[1]*1000,g.translationM[0]*1000+g.localPointM[0]*1000,0];
const golden=[near(gs[0].meters*1000,gs[0].expectedMm),vec(actual,g.expectedMm)&&vec(wrong,g.wrongInverseOrderMm),det(gs[2].parentScale)*det(gs[2].childScale)===gs[2].expectedDetSign,det(gs[3].parentScale)*det(gs[3].childScale)===gs[3].expectedDetSign,det(gs[4].parentScale)*det(gs[4].childScale)===0&&gs[4].expectedManufacturingFrame==="REJECT"];
golden.forEach((v,i)=>{if(!v)errors.push("G0"+(i+1)+"解析Golden不符")});
console.log(JSON.stringify({planningOnly:true,rules:trace.rules.length,sources:sources.sources.length,syntheticCases:fixtures.cases.length,goldenCases:golden.length,failed:errors.length,errors,nodeProcess:"PLANNING_ONLY",product:"NOT_RUN"},null,2));
process.exitCode=errors.length?1:0;
