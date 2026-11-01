#!/usr/bin/env node
// 中文注释：B103只读规划验收；不修改产品仓，不验证真实机床和Reader。
"use strict";const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const judge=function judge(id,x){
const nonempty=v=>typeof v==="string"&&v.length>0,validHash=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);
if(id==="R01"){let s=x.source||{};if(!nonempty(s.edition))return"UNKNOWN";if(s.claimsCurrent===true&&s.edition!=="2025")return"REJECT";return s.edition==="2025"&&s.claimsCurrent===true?"PASS_DESIGN":"UNKNOWN";}
if(id==="R02"){let c=x.corpus||{};if(c.family==="STC")return c.claimsTargetCoverage?"REJECT":"UNKNOWN";if(c.family!=="FTC")return"UNKNOWN";if(c.claimsTargetCoverage&&!validHash(c.rawHash))return"REJECT";return c.targetPresent===true&&validHash(c.rawHash)&&c.claimsTargetCoverage===true?"PASS_DESIGN":"UNKNOWN";}
if(id==="R03"){let t=x.target||{};if(!nonempty(t.sourceEntity)||!nonempty(t.topologyRef)||!Array.isArray(t.occurrence)||t.occurrence.length===0)return"REJECT";if(t.frame==="DISPLAY"||!["mm","in"].includes(t.unit))return"REJECT";return nonempty(t.frame)?"PASS_DESIGN":"UNKNOWN";}
if(id==="R04"){let t=x.target||{};if(!nonempty(t.kind)||t.kind==="UNKNOWN")return"UNKNOWN";if(!Number.isInteger(t.position)||t.position<0||!Array.isArray(t.modifiers)||t.modifiers.some((m,i)=>m.ordinal!==i||!nonempty(m.code)))return"REJECT";return"PASS_DESIGN";}
if(id==="R05"){let s=x.semantic||{};if(s.kind==="graphical_only")return s.claim==="semantic"?"REJECT":"UNKNOWN";return s.kind==="semantic"&&s.claim==="semantic"&&nonempty(s.sourceEntity)?"PASS_DESIGN":"UNKNOWN";}
if(id==="R06"){let r=x.reader||{};if(!nonempty(r.run)&&r.claimsPassed===true)return"REJECT";if(!nonempty(r.run)||!nonempty(r.version)||r.coverage!=="checked")return"UNKNOWN";return r.apiPresent===true?"PASS_DESIGN":"UNKNOWN";}
if(id==="R07"){let a=x.coverage||{},ks=["expected","parsed","skipped","unsupported","ambiguous"];if(ks.some(k=>!Number.isSafeInteger(a[k])||a[k]<0))return"REJECT";if(a.parsed+a.skipped+a.unsupported+a.ambiguous!==a.expected)return"REJECT";return a.expected>0&&a.parsed===a.expected?"PASS_DESIGN":"UNKNOWN";}
if(id==="R08"){let c=x.commit||{};if(!nonempty(c.d01Read))return"UNKNOWN";if(!validHash(c.d01Expected)||c.d01Expected!==c.d01Read||c.writer!=="D02_OWNER"||c.acl!==true||c.cas!==true||c.epoch!==true||c.frozen!==true)return"REJECT";if(c.releaseClaim===true&&c.independentReal!==true)return"REJECT";return c.releaseClaim===false?"PASS_DESIGN":"UNKNOWN";}
return"REJECT";};
const sources=read("research/sources/CAP-03-04-datum-target-b103.json"),trace=read("research/traces/CAP-03-04-datum-target-b103-v08.json"),fx=read("docs/capabilities/CAP-03-04/datum-target-b103-fixtures-v08.json");
const errors=[],ids=new Set(),srcIds=new Set(sources.sources.map(s=>s.id));
if(sources.registeredRecords!==7||sources.sources.length!==7)errors.push("SOURCES_COUNT");
if(trace.rules.length!==8)errors.push("RULES_COUNT");
for(const r of trace.rules){if(!r.sourceIds.every(s=>srcIds.has(s)))errors.push("SOURCE_TRACE:"+r.id);
for(const group of [r.positiveIds,r.negativeIds,r.unknownIds])for(const id of group)if(!fx.cases.some(x=>x.id===id&&x.ruleId===r.id))errors.push("MISSING_CASE:"+id);}
for(const c of fx.cases){if(ids.has(c.id))errors.push("DUPLICATE_CASE:"+c.id);ids.add(c.id);let got=judge(c.ruleId.replace("B103-",""),c.input);if(got!==c.expected)errors.push("CASE:"+c.id+":"+got+"!="+c.expected);}
const out={status:errors.length?"FAIL":"PASS_SYNTHETIC_ONLY",cases:fx.cases.length,sources:sources.sources.length,rules:trace.rules.length,errors,independentNodeExecution:"THIS_PROCESS_ONLY",realFtcBytes:"NOT_RUN",product:"NOT_RUN"};console.log(JSON.stringify(out,null,2));if(errors.length)process.exitCode=1;
