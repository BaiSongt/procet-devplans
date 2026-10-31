#!/usr/bin/env node
// CAP-11-01 规划合成校验器：仅检查规格来源/字段/固定预期，不执行真实产品。
"use strict";
const fs=require("node:fs"),path=require("node:path");
const base=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(base,p),"utf8"));
function judge(v){
 if(v.cancelled||v.lateAck)return "CANCELLED";
 if(!v.tenantAcl||!v.scopeEpochValid||v.promptInjection)return "REJECT";
 if(v.intent==="CYCLE_START")return "REJECT";
 if(v.finalNcMissing||v.d15Missing)return "UNKNOWN";
 if(v.intent==="READ")return v.exactRefs?"PASS":"UNKNOWN";
 if(v.intent==="DRAFT")return v.exactRefs?"DRAFT_ONLY":"UNKNOWN";
 if(v.intent==="CL_PREVIEW")return v.exactRefs?"CL_ONLY":"UNKNOWN";
 if(v.intent==="COMMIT"){if(!v.exactRefs||!v.casMatches)return "STALE";if(!v.humanApproved)return "REQUIRE_HUMAN";return v.ownerPort?"PORT_ONLY":"REJECT"}
 if(v.intent==="RELEASE")return v.d15Approved&&v.d16Approved&&v.ncExact&&v.ownerPort?"PENDING_INDEPENDENT_GATE":"UNKNOWN";
 return "UNKNOWN";
}
function validate(){
 const trace=load("research/traces/CAP-11-01.json");
 const sources=load("research/sources/CAP-11-01.json");
 const fixtures=load("docs/capabilities/CAP-11-01/fixtures.json");
 const ids=new Set(sources.sources.map(s=>s.id));
 if(trace.rules.length!==10 || new Set(trace.rules.flatMap(r=>r.fields)).size!==40)throw Error("规则/字段数量异常");
 let n=0;
 for(const r of trace.rules){
   if(r.fields.length!==4 || !r.sourceIds.length || r.sourceIds.some(s=>!ids.has(s)))throw Error("缺来源/字段 "+r.id);
   const group=fixtures.cases.filter(x=>x.ruleId===r.id);
   if(group.length!==5 || group.filter(x=>x.expected==="PASS").length!==1)throw Error("缺独立正反 "+r.id);
   for(const x of group){
     const got=r.criteria.every(c=>c.path.split(".").reduce((v,k)=>v?.[k],x.input)===c.value)?"PASS":"REJECT";
     if(got!==x.expected)throw Error("案例预期不符 "+x.id);
     n++;
   }
 }
 for(const x of fixtures.gateCases){if(judge(x.input)!==x.expected)throw Error("状态门禁不符 "+x.id);n++}
 return n;
}
const n=validate();
process.stdout.write("CAP-11-01 PLANNING_SYNTHETIC_PASS "+n+"/"+n+"; PRODUCT_NOT_RUN; INDEPENDENT_CONSUMER_NOT_RUN\n");
