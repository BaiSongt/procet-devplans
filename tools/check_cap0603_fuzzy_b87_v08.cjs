#!/usr/bin/env node
// B87只读规划合成校验；不是OCCT真实执行或产品验收。中文说明。
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const fixture=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-06-03/fuzzy-b87-fixtures-v08.json"),"utf8"));
const trace=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-06-03-fuzzy-b87-v08.json"),"utf8"));
const registry=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-06-03-fuzzy-b87.json"),"utf8"));
const judge=function judge(rule,x){
const pass="PASS_SYNTHETIC_ONLY";
switch(rule){
case "F87-R1":
 if(!Number.isInteger(x.revision)||!x.hash||!/^[0-9a-f]{64}$/.test(x.hash)||!x.frame||!x.unit||!x.scope||!x.expectedScope)return "UNKNOWN_EXACT";
 return x.revision<1||x.scope!==x.expectedScope?"REJECT_EXACT":pass;
case "F87-R2":
 if(["fuzzy","maxFuzzy","minFeature","measuredGap"].some(k=>x[k]!==null&&x[k]!==undefined&&(!Number.isFinite(x[k])||x[k]<0)))return "REJECT_FUZZY_POLICY";
 if(["fuzzy","maxFuzzy","minFeature","measuredGap"].some(k=>x[k]===null||x[k]===undefined)||!x.policyVersion||x.unit!=="mm")return "UNKNOWN_GEOMETRY_MARGIN";
 if(x.maxFuzzy<=0||x.minFeature<=0||x.fuzzy>x.maxFuzzy)return "REJECT_FUZZY_BUDGET";
 if(2*x.fuzzy>=x.minFeature)return "UNKNOWN_THIN_WALL";
 if(x.fuzzy<x.measuredGap)return "UNKNOWN_GAP_UNCOVERED";
 return pass;
case "F87-R3":
 if(!["OFF","SHIFT","FULL"].includes(x.glue))return "REJECT_GLUE_MODE";
 if(x.glue==="OFF")return pass;
 if(x.realIntersection===true)return "REJECT_GLUE_INTERSECTION";
 if(x.realIntersection!==false||x.coincidenceProof!=="VERIFIED_EXACT")return "UNKNOWN_GLUE_PRECONDITION";
 return pass;
case "F87-R4":
 if(x.nonDestructive!==true)return "REJECT_MUTABLE_INPUT";
 if(!/^[0-9a-f]{64}$/.test(x.beforeHash||"")||!/^[0-9a-f]{64}$/.test(x.afterHash||""))return "UNKNOWN_INPUT_BYTES";
 return x.beforeHash===x.afterHash?pass:"REJECT_INPUT_CHANGED";
case "F87-R5":
 if(x.historyEnabled!==true)return "REJECT_HISTORY_DISABLED";
 if(x.simplify===true&&x.mergedHistory!==true)return "REJECT_HISTORY_UNMERGED";
 if(x.multiOrigin===true&&x.uniqueOriginClaim===true)return "REJECT_FALSE_UNIQUENESS";
 if(x.finalHistoryResolved!==true)return "UNKNOWN_HISTORY";
 return pass;
case "F87-R6":
 if(x.hasErrors===true)return "REJECT_OCCT_ERROR";
 if(x.hasWarnings===true)return "UNKNOWN_OCCT_WARNING";
 if(x.isDone!==true||x.reportCaptured!==true)return "UNKNOWN_OCCT_REPORT";
 return pass;
case "F87-R7":
 if(x.shapeValid===false)return "REJECT_TOPOLOGY";
 if(Number.isFinite(x.protectedOverlap)&&Number.isFinite(x.maxOverlap)&&x.protectedOverlap>x.maxOverlap)return "REJECT_PROTECTION";
 if(!Number.isInteger(x.solidCount)||x.solidCount<1||x.checkedCount!==x.solidCount||!Number.isFinite(x.protectedOverlap)||x.protectedOverlap<0||!Number.isFinite(x.maxOverlap)||x.maxOverlap<0||x.shapeValid!==true||x.independentPath!==true)return "UNKNOWN_ORACLE";
 return pass;
case "F87-R8":
 if(x.port!=="06.LocalBRepRemovalDomainPort"||!["GUI","CLI","Agent"].includes(x.channel)||x.worlds!==1||x.panel!=="LEFT_UNIFIED")return "REJECT_ENTRY";
 if(x.cancelled===true)return "REJECT_CANCELLED";
 if(x.expectedHead!==x.observedHead||x.aclEpoch!==x.observedAclEpoch||x.generation!==x.observedGeneration)return "STALE_OWNER";
 if(x.d08FrozenUnchanged!==true||x.clClaimsNc===true||x.d13UnknownAsPass===true)return "REJECT_BOUNDARY";
 if(!x.rollbackRef)return "UNKNOWN_MIGRATION";
 return pass;
default:return "UNKNOWN_RULE";
}};
const failures=[];
const ids=new Set(),ruleSet=new Set(trace.rules.map(x=>x.id)),sourceSet=new Set(registry.sources.map(x=>x.id));
for(const r of trace.rules){
 if(!r.fields?.length||!r.sourceIds?.every(s=>sourceSet.has(s))||!r.positiveIds?.length||!r.negativeIds?.length)failures.push("追踪链缺项:"+r.id);
 for(const id of [...r.positiveIds,...r.negativeIds])if(!fixture.cases.some(c=>c.id===id&&c.ruleId===r.id))failures.push("验收丢失:"+id);
}
for(const c of fixture.cases){
 if(ids.has(c.id))failures.push("重复用例:"+c.id);ids.add(c.id);
 if(!ruleSet.has(c.ruleId)||judge(c.ruleId,c.input)!==c.expected)failures.push("反例不符:"+c.id);
}
if(ids.size!==32||ruleSet.size!==8||sourceSet.size!==7)failures.push("数量不符");
if(process.argv.includes("--self-test")){
 const seeds=fixture.cases.filter(c=>c.expected==="PASS_SYNTHETIC_ONLY");
 const mutations=[{"rule":"F87-R1","patch":{"scope":"DIFFERENT"}},{"rule":"F87-R2","patch":{"fuzzy":0.1}},{"rule":"F87-R3","patch":{"glue":"SHIFT"}},{"rule":"F87-R4","patch":{"nonDestructive":false}},{"rule":"F87-R5","patch":{"historyEnabled":false}},{"rule":"F87-R6","patch":{"hasErrors":true}},{"rule":"F87-R7","patch":{"protectedOverlap":9}},{"rule":"F87-R8","patch":{"cancelled":true}}];
 for(const m of mutations){const seed=seeds.find(x=>x.ruleId===m.rule);if(!seed||judge(seed.ruleId,{...seed.input,...m.patch})===seed.expected)failures.push("故障注入未被拒绝:"+m.rule)}
}
console.log(JSON.stringify({status:failures.length?"FAIL":"PASS_SYNTHETIC_ONLY",count:ids.size,rules:ruleSet.size,sources:sourceSet.size,mutations:process.argv.includes("--self-test")?8:"NOT_RUN",product:"NOT_RUN",failures},null,2));
if(failures.length)process.exitCode=1;
