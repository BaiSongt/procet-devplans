#!/usr/bin/env node
// 连续四/五轴刀路规划规则的离线静态校验；只检查合成用例，不启动产品或机床。
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const trace=read("research/traces/CAP-07-04.json"),src=read("research/sources/CAP-07-04.json"),fx=read("docs/capabilities/CAP-07-04/fixtures.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
function meets(rule,input){return rule.criteria.every(c=>{const v=get(input,c.path),w=c.other?get(input,c.other):c.value;switch(c.op){
case "eq":case "eqField":return v===w;
case "gt":return Number.isFinite(v)&&v>w;
case "lteField":return Number.isFinite(v)&&Number.isFinite(w)&&v<=w;
case "sha256":return typeof v==="string"&&/^[0-9a-f]{64}$/.test(v);
case "unitVec":return Array.isArray(v)&&v.length===3&&v.every(Number.isFinite)&&Math.abs(Math.hypot(...v)-1)<1e-8;
case "unitQuat":return Array.isArray(v)&&v.length===4&&v.every(Number.isFinite)&&Math.abs(Math.hypot(...v)-1)<1e-8;
default:throw Error("不支持的谓词 "+c.op);
}});}
if(src.sources.length!==9||src.registeredRecords!==9||trace.rules.length!==10||fx.cases.length!==20||fx.mutationCases.length!==10||!fx.syntheticOnly)throw Error("来源/规则/用例数量或合成标志错误");
const ids=new Set(src.sources.map(x=>x.id)),rids=new Set(trace.rules.map(x=>x.id)),seen=new Set();
if(ids.size!==9||rids.size!==10)throw Error("来源或规则ID重复");
for(const r of trace.rules){if(!r.assets.includes("D09")||!r.sourceIds.length||r.sourceIds.some(id=>!ids.has(id))||r.criteria.some(c=>!r.fields.includes(c.path)))throw Error("规则映射缺口 "+r.id)}
for(const f of [...fx.cases,...fx.mutationCases]){if(seen.has(f.id))throw Error("用例ID重复");seen.add(f.id);const r=trace.rules.find(x=>x.id===f.ruleId);if(!r||(meets(r,f.input)?"PASS":"REJECT")!==f.expected)throw Error("规则误判 "+f.id)}
for(let i=0;i<10;i++){const r=trace.rules[i],n=fx.cases[2*i+1],m=fx.mutationCases[i];if(!seen.has(r.positiveTestId)||!seen.has(r.negativeTestId)||!seen.has(r.mutationTestId)||n.mutatedField===m.mutatedField||!m.distinctFromNegativeField)throw Error("错误变异/映射缺失 "+r.id)}
console.log(JSON.stringify({capability:"CAP-07-04",syntheticPlanningPass:30,syntheticPlanningTotal:30,product:"NOT_RUN",consumer:"NOT_RUN",machine:"NOT_RUN"}));
