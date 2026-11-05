#!/usr/bin/env node
// CAP-07-02规划合成校验；只读取静态规则与JSON，不运行真实OCCT/NC/产品。
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const trace=read("research/traces/CAP-07-02.json"),source=read("research/sources/CAP-07-02.json"),data=read("docs/capabilities/CAP-07-02/fixtures.json");
const get=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
function meets(rule,input){
 return rule.criteria.every(c=>{const v=get(input,c.path),w=c.other?get(input,c.other):c.value;
 switch(c.op){case"eq":case"eqField":return v===w;case"gt":return Number.isFinite(v)&&v>w;case"gte":return Number.isFinite(v)&&v>=w;
 case"lt":case"ltField":return Number.isFinite(v)&&Number.isFinite(w)&&v<w;
 case"lteField":return Number.isFinite(v)&&Number.isFinite(w)&&v<=w;case"sha256":return typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
 case"isNull":return v===null;default:throw Error("不支持的判断:"+c.op);}});
}
if(source.registeredRecords!==10||source.sources.length!==10||trace.rules.length!==10||data.cases.length!==20||data.mutationCases.length!==10||!data.syntheticOnly)throw Error("登记分母错误");
const srcIds=new Set(source.sources.map(x=>x.id)),rules=new Map(trace.rules.map(x=>[x.id,x])),seen=new Set();
if(srcIds.size!==10||rules.size!==10)throw Error("规则/来源ID不唯一");
for(const r of trace.rules){
 if(!r.sourceIds.length||!r.sourceIds.every(x=>srcIds.has(x))||!r.criteria.every(c=>r.fields.includes(c.path))||!r.assets.includes("D09"))throw Error("字段/来源/Owner追踪缺失:"+r.id);
}
let passed=0;
for(const t of [...data.cases,...data.mutationCases]){
 if(seen.has(t.id))throw Error("测试ID重复:"+t.id);seen.add(t.id);
 const r=rules.get(t.ruleId);if(!r||meets(r,t.input)!==(t.expected==="PASS"))throw Error("合成场景未过:"+t.id);
 passed++;
}
for(const r of trace.rules){if(!seen.has(r.positiveTestId)||!seen.has(r.negativeTestId)||!seen.has(r.mutationTestId))throw Error("用例失联:"+r.id);}
if(!data.mutationCases.every(c=>c.distinctFromNegativeField===true))throw Error("独立变异与反例同字段");
console.log(JSON.stringify({item:"CAP-07-02",planningOnly:true,syntheticPassed:passed,total:30,product:"NOT_RUN",independentConsumer:"NOT_RUN"}));
