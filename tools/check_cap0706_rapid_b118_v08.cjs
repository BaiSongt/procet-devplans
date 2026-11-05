#!/usr/bin/env node
// 中文注释：此校验器不接入机床，只检查规则、来源和合成反例。
"use strict";
const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=read("research/sources/CAP-07-06-rapid-b118.json"),t=read("research/traces/CAP-07-06-rapid-b118-v08.json"),f=read("docs/capabilities/CAP-07-06/rapid-b118-fixtures-v08.json");
const bad=[],sourceIds=new Set(s.sources.map(x=>x.id)),caseMap=new Map(f.cases.map(x=>[x.id,x]));
if(s.sources.length!==8||s.registeredRecords!==8||sourceIds.size!==8)bad.push("来源计数/ID");
if(t.rules.length!==8||f.cases.length!==40||caseMap.size!==40||f.goldens.length!==3)bad.push("规则/用例计数");
for(const r of t.rules){
if(r.fields.length!==4||r.positive.length!==1||r.negative.length!==4||r.expectedNegativeStatuses.length!==4)bad.push(r.id+"数量");
for(const id of r.sourceIds)if(!sourceIds.has(id))bad.push(r.id+"来源"+id);
for(const p of r.originalWorkPackages)if(!/^(F1|E3|U4)-[0-9]{2}$/.test(p))bad.push(r.id+"编号"+p);
const pos=caseMap.get(r.positive[0]);if(!pos||pos.rule!==r.id||pos.expect!=="CANDIDATE"||r.fields.some(k=>pos.input[k]!==true)){bad.push(r.id+"正向");continue;}
r.negative.forEach((id,i)=>{const n=caseMap.get(id);if(!n){bad.push(id+"缺失");return;}
const changed=r.fields.filter(k=>n.input[k]!==pos.input[k]);if(n.rule!==r.id||changed.length!==1||changed[0]!==r.fields[i]||n.mutatedField!==r.fields[i]||n.expect!==r.expectedNegativeStatuses[i])bad.push(id+"反例")});
}
for(const c of f.cases){const r=t.rules.find(x=>x.id===c.rule);if(!r){bad.push(c.id+"无规则");continue;}
const changed=r.fields.findIndex(k=>c.input[k]!==true),actual=changed<0?"CANDIDATE":r.expectedNegativeStatuses[changed];if(actual!==c.expect)bad.push(c.id+"状态")}
const near=(x,y)=>Math.abs(x-y)<1e-9,equal=(x,y)=>x.length===y.length&&x.every((v,i)=>near(v,y[i]));
const asyncPos=g=>g.targetMm.map((x,i)=>Math.min(x,g.timeSec*g.speedMmPerSec[i]));
const straight=g=>g.targetMm.map(x=>x*Math.min(1,g.timeSec/Math.max(...g.targetMm.map((d,i)=>d/g.speedMmPerSec[i]))));
const g=f.goldens;
for(let i=0;i<2;i++)if(!equal(asyncPos(g[i]),g[i].expectedAsyncMm)||!equal(straight(g[i]),g[i].expectedLinearMm))bad.push("解析G0"+i);
const clearance=p=>Math.hypot(p[0]-g[2].obstacleMm[0],p[1]-g[2].obstacleMm[1])-g[2].radiusMm;
if(!near(clearance(g[2].rapidPointMm),g[2].expectedRapidClearanceMm)||!near(clearance(g[2].linearPointMm),g[2].expectedLinearClearanceMm))bad.push("解析G03");
console.log(JSON.stringify({planningOnly:true,sources:s.sources.length,rules:t.rules.length,syntheticCases:f.cases.length,analyticGoldens:f.goldens.length,failed:bad.length,errors:bad,actualD15:"NOT_RUN"}));if(bad.length)process.exit(1);
