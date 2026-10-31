#!/usr/bin/env node
// 只检查CAP-07-01规划静态场景；并非OCCT、NC或独立产品消费者。
const fs=require("node:fs"),path=require("node:path");
const base=path.resolve(__dirname,"..");
const trace=JSON.parse(fs.readFileSync(path.join(base,"research/traces/CAP-07-01.json"),"utf8"));
const source=JSON.parse(fs.readFileSync(path.join(base,"research/sources/CAP-07-01.json"),"utf8"));
const data=JSON.parse(fs.readFileSync(path.join(base,"docs/capabilities/CAP-07-01/fixtures.json"),"utf8"));
const get=(x,p)=>p.split(".").reduce((a,k)=>a?.[k],x);
function checkCriteria(r,x){return r.criteria.every(c=>{const v=get(x,c.path),w=c.other?get(x,c.other):c.value;switch(c.op){
case "eq":case "eqField":return v===w;
case "sha256":return typeof v==="string"&&/^[0-9a-f]{64}$/.test(v);
case "gt":return Number.isFinite(v)&&v>w;
case "gte":return Number.isFinite(v)&&v>=w;
case "lt":return Number.isFinite(v)&&v<w;
case "ltField":return Number.isFinite(v)&&Number.isFinite(w)&&v<w;
case "isNull":return v===null;
default:throw Error("不支持的操作:"+c.op);
}})}
if(source.registeredRecords!==source.sources.length||source.sources.length!==8||trace.rules.length!==10||data.cases.length!==20||data.mutationCases.length!==10)throw Error("分母/登记不一致");
const sourceIds=new Set(source.sources.map(x=>x.id)),rules=new Map(trace.rules.map(x=>[x.id,x])),seen=new Set();
for(const r of trace.rules){if(!r.sourceIds.length||!r.sourceIds.every(x=>sourceIds.has(x)))throw Error("缺来源:"+r.id);if(!r.criteria.length||!r.criteria.every(x=>r.fields.includes(x.path)))throw Error("缺字段:"+r.id);if(!r.assets.includes("D09")&&r.id!=="C0701-R01"&&r.id!=="C0701-R03")throw Error("领域追踪缺D09:"+r.id)}
let passed=0;
for(const t of [...data.cases,...data.mutationCases]){const rule=rules.get(t.ruleId);if(!rule||seen.has(t.id))throw Error("规则/ID不合法:"+t.id);seen.add(t.id);if(checkCriteria(rule,t.input)!==(t.expected==="PASS"))throw Error("合成失败:"+t.id);passed++;}
for(const r of trace.rules){if(!seen.has(r.positiveTestId)||!seen.has(r.negativeTestId)||!seen.has(r.mutationTestId))throw Error("用例失联:"+r.id);}
console.log(JSON.stringify({item:"CAP-07-01",planningOnly:true,syntheticPassed:passed,total:30,product:"NOT_RUN",independentConsumer:"NOT_RUN"}));
