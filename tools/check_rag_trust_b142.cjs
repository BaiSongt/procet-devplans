#!/usr/bin/env node
// B142只读规划Fixture检查，不执行实际Agent、Owner写入或机床行为。
"use strict";const fs=require("node:fs"),path=require("node:path"),r=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(r,p),"utf8"));
const s=read("research/sources/CAP-11-03-rag-trust-b142.json"),t=read("research/traces/CAP-11-03-rag-trust-b142.json"),f=read("docs/capabilities/CAP-11-03/rag-trust-b142-fixtures.json");
const judge=(r,v)=>r.fields.every(k=>v[k]===true)?"PLANNING_CANDIDATE_ONLY":r.failureStatus;
const scenario=v=>!v.ownerAcl?"REJECT_ACL":!v.sourceExact?"UNKNOWN_EVIDENCE":v.blockedInjection?"BLOCK_PROMPT_INJECTION":!v.toolTrusted?"REJECT_TOOL_HINT":v.cancelled?"CANCELLED":v.write&&(!v.confirmed||!v.ownerCas)?"BLOCK_OWNER_WRITE":v.release&&!v.ncSemanticsKnown?"UNKNOWN_NC_SEMANTICS":v.release&&!v.d15Independent?"BLOCK_NC_RELEASE":v.write?"OWNER_WRITE_CANDIDATE_ONLY":"ADVISORY_ONLY";
let count=0;function ok(v,m){if(!v)throw Error(m);++count;}
ok(s.records.length===6&&new Set(s.records.map(x=>x.id)).size===6,"sources");ok(t.rules.length===8&&f.groups.length===8,"rules");
ok(f.sourceRegistry==="research/sources/CAP-11-03-rag-trust-b142.json"&&f.trace==="research/traces/CAP-11-03-rag-trust-b142.json","paths");
for(let r of t.rules){const g=f.groups.find(x=>x.ruleId===r.id);
 ok(g&&r.sourceIds.every(id=>s.records.some(x=>x.id===id)),"orphan "+r.id);
 ok(r.fields.length===4&&g.negative.length===4,"fields "+r.id);
 ok(r.tests.join("|")===[g.positive.id,...g.negative.map(x=>x.id)].join("|"),"IDs "+r.id);
 ok(judge(r,g.positive.values)===g.positive.expected,"positive "+r.id);
 for(let neg of g.negative){ok(r.fields.includes(neg.mutatedField)&&r.fields.filter(k=>g.positive.values[k]!==neg.values[k]).length===1,"mutation "+neg.id);ok(neg.values[neg.mutatedField]===false&&judge(r,neg.values)===neg.expected,"negative "+neg.id);}
}
for(let g of f.goldens)ok(scenario(g.values)===g.expected,"golden "+g.id);
console.log("B142 "+count+" 规划断言PASS；8正32独立反10状态Golden；真实RAG/Owner/NC NOT_RUN。");
