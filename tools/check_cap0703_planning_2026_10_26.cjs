#!/usr/bin/env node
// 仅对静态规则、合成案例和恶意字段变异作校验；不运行产品、OCCT、机床与后处理。
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const trace=read("research/traces/CAP-07-03.json"),src=read("research/sources/CAP-07-03.json"),fixtures=read("docs/capabilities/CAP-07-03/fixtures.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
function meets(rule,input) {
 return rule.criteria.every(c=>{
 const v=get(input,c.path), w=c.other?get(input,c.other):c.value;
 switch(c.op){
 case "eq": case "eqField":return v===w;
 case "gt":return Number.isFinite(v)&&v>w;
 case "gte":return Number.isFinite(v)&&v>=w;
 case "ltField":return Number.isFinite(v)&&Number.isFinite(w)&&v<w;
 case "lteField":return Number.isFinite(v)&&Number.isFinite(w)&&v<=w;
 case "sha256":return typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
 case "axisAligned":{if(!Array.isArray(v)||!Array.isArray(w)||v.length!==3||w.length!==3)return false;const nv=Math.hypot(...v),nw=Math.hypot(...w),tol=get(input,c.toleranceField);if(nv<1e-12||nw<1e-12||!Number.isFinite(tol)||tol<0||tol>10)return false;const cos=v.reduce((s,x,i)=>s+x*w[i],0)/(nv*nw);return Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI<=tol;}
 case "properRotation":{if(!Array.isArray(v)||v.length!==3||v.some(r=>!Array.isArray(r)||r.length!==3||r.some(x=>!Number.isFinite(x))))return false;const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);const cols=[0,1,2].map(j=>v.map(row=>row[j]));const orth=cols.every((col,i)=>Math.abs(dot(col,col)-1)<1e-9&&cols.every((other,j)=>i===j||Math.abs(dot(col,other))<1e-9));const det=v[0][0]*(v[1][1]*v[2][2]-v[1][2]*v[2][1])-v[0][1]*(v[1][0]*v[2][2]-v[1][2]*v[2][0])+v[0][2]*(v[1][0]*v[2][1]-v[1][1]*v[2][0]);return orth&&Math.abs(det-1)<1e-9;}
 default:throw Error("不支持判断:"+c.op);
 }
 });
}
if(src.registeredRecords!==9||src.sources.length!==9||trace.rules.length!==10||fixtures.cases.length!==20||fixtures.mutationCases.length!==10||!fixtures.syntheticOnly)throw Error("分母、来源或合成标记错误");
const srcIds=new Set(src.sources.map(x=>x.id)),ruleIds=new Set(trace.rules.map(x=>x.id)),seen=new Set();
if(srcIds.size!==9||ruleIds.size!==10)throw Error("重复来源/规则ID");
for(const rule of trace.rules){if(!rule.assets.includes("D09")||!rule.fields.length||!rule.criteria.every(c=>rule.fields.includes(c.path))||!rule.sourceIds.length||!rule.sourceIds.every(id=>srcIds.has(id)))throw Error("追踪缺失:"+rule.id);}
for(const t of [...fixtures.cases,...fixtures.mutationCases]){if(seen.has(t.id))throw Error("重复验收ID:"+t.id);seen.add(t.id);const rule=trace.rules.find(x=>x.id===t.ruleId);if(!rule||meets(rule,t.input)!==(t.expected==="PASS"))throw Error("错误输入被接受或有效输入被拒绝:"+t.id);}
for(const rule of trace.rules){if(!seen.has(rule.positiveTestId)||!seen.has(rule.negativeTestId)||!seen.has(rule.mutationTestId))throw Error("验收闭环缺失:"+rule.id);}
for(let i=0;i<10;i++){const neg=fixtures.cases[2*i+1],mut=fixtures.mutationCases[i];if(!mut.distinctFromNegativeField||neg.mutatedField===mut.mutatedField)throw Error("非差异变异:"+mut.id);}
console.log(JSON.stringify({cap:"CAP-07-03",planningOnly:true,syntheticPassed:30,total:30,product:"NOT_RUN",independentConsumers:"NOT_RUN",machine:"NOT_RUN"}));
