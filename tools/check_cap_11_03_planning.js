#!/usr/bin/env node
// 仅检验CAP-11-03规划来源映射、字段变异和合成状态，不触碰产品仓。
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const get=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const tr=get("research/traces/CAP-11-03.json"),fi=get("docs/capabilities/CAP-11-03/fixtures.json");
const ss=new Set(get("research/sources/CAP-11-03.json").sources.map(x=>x.id));
const aa=new Set(get("docs/architecture/v0.8/business-assets.json").assets.map(x=>x.id));
const at=(o,p)=>p.split(".").reduce((x,k)=>x?.[k],o);
const run=(r,i)=>r.criteria.every(q=>at(i,q.path)===q.value)?"PASS":"REJECT";
const gate=i=>i.cancelled||i.lateAck?"CANCELLED":(!i.authorized||!i.postAcl||!i.scopeFresh||i.crossTenant||i.injected||i.writeAttempt||i.frozenRewrite||i.releaseAttempt)?"REJECT":(!i.indexFresh||!i.sourceExact||!i.hashMatch||i.revoked||!i.frameCurrent)?"STALE":i.conflict?"CONFLICT":(!i.evidence||!i.selector||!i.licensed||!i.readDepth||i.scoreOnly||i.clAsD15||i.unknownController)?"UNKNOWN":"ADVISORY_ONLY";
let failures=[];
if(tr.rules.length!==10||fi.cases.length!==50||fi.gateCases.length!==28)failures.push("计数");
for(const r of tr.rules)if(r.fields.length!==4||r.sourceIds.some(x=>!ss.has(x))||r.assets.some(x=>!aa.has(x))||!r.workPackages.includes("T5-01")||!r.workPackages.includes("T5-02"))failures.push(r.id);
for(const c of fi.cases){const r=tr.rules.find(r=>r.id===c.ruleId);if(!r||run(r,c.input)!==c.expected)failures.push(c.id);}
for(const c of fi.gateCases)if(gate(c.input)!==c.expected)failures.push(c.id);
if(gate({...fi.gateCases[0].input,authorized:false})!=="REJECT"||run(tr.rules[0],fi.cases[1].input)!=="REJECT")failures.push("故意变异未被捕获");
if(failures.length){console.error(failures.join(" | "));process.exitCode=1;}else console.log("PASS 50正反+28状态门禁，2个故意变异；PLANNING_ONLY ≠ PRODUCT_PASS");
