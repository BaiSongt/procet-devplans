#!/usr/bin/env node
// U4-03：纯规划合成校验器，不启动产品进程，不读取/删除用户工程。
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const trace = JSON.parse(fs.readFileSync(path.join(root,"research/traces/U4-03.json"),"utf8"));
const fixtures = JSON.parse(fs.readFileSync(path.join(root,"docs/work-packages/U4-03/fixtures.json"),"utf8"));
const sources = JSON.parse(fs.readFileSync(path.join(root,"research/sources/U4-03.json"),"utf8"));
function get(o,p){return p.split(".").reduce((x,k)=>x?.[k],o)}
function match(rule,input){return rule.criteria.every(c=>c.op==="nonEmpty"?(typeof get(input,c.path)==="string"&&get(input,c.path).trim()!==""):c.op==="eqField"?get(input,c.path)===get(input,c.other):get(input,c.path)===c.value)}
const sourceIds = new Set(sources.sources.map(s=>s.id));
let passed=0;
for(const rule of trace.rules){
 if(!rule.sourceIds.length||!rule.sourceIds.every(id=>sourceIds.has(id))) throw Error("来源未登记:"+rule.id);
 for(const f of [...fixtures.cases,...fixtures.mutations].filter(t=>t.ruleId===rule.id)){
   const actual=match(rule,f.input)?"PASS":"REJECT";
   if(actual!==f.expected)throw Error(f.id+":期望"+f.expected+"实际"+actual);
   if(f.id.includes("-M")&&!f.differentFieldFromPairedNegative)throw Error("变异与反例相同字段:"+f.id);
   passed++;
 }
}
if(trace.rules.length!==10||fixtures.cases.length!==20||fixtures.mutations.length!==10||passed!==30)throw Error("规则和验收数量错误");
process.stdout.write("U4-03 synthetic planning 30/30 PASS; product NOT_RUN\n");
