#!/usr/bin/env node
"use strict";
// B76只读规划合成校验：不会调用控制器、不会产生NC工程PASS。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const judge=function judge(x){
 const a=x?.identity,p=x?.program,g=x?.gate;
 if(!a||!p||!g)return "UNKNOWN";
 if(a.ncHash!==a.expectedNcHash||a.profileHash!==a.expectedProfileHash||a.closureHash!==a.expectedClosureHash||a.d04Revision!=="D04-r76"||a.d10Revision!=="D10-r76"||a.scopeEpoch!==11||a.frame!=="Machine"||g.generation!==g.ackGeneration)return "STALE";
 if(g.ownerPort!=="NcSemanticOwnerPort"||!g.acl||!g.cas||g.cancelled||g.lateAck||g.sceneCount!==1||!g.leftPanel||!Array.isArray(g.channels)||["GUI","CLI","Agent"].some(c=>!g.channels.includes(c))||!g.freezePreserved||!g.rollbackReader||g.previewWrites)return "REJECTED";
 if(!p.profileVerified||!["LINUXCNC_2_9","HAAS_LATHE"].includes(p.dialect)||!p.targetResolved||p.externalUnresolved||p.unknownMacro)return "UNKNOWN";
 if(p.mixedStyles||p.duplicateNumber||p.mainM99||p.outsideClosure||!p.searchRootsPinned||!p.searchPathApproved||!p.callStackMapped||!p.returnMapped)return "REJECTED";
 const linux=p.dialect==="LINUXCNC_2_9";
 const permitted=linux?{"O_CALL":["LOCAL_1_30","O_SUB",false],"M98_NUMBERED":["GLOBAL_1_30","O_BLOCK",false]}:{"M97_LOCAL":["PROFILE_SPECIFIC","N_BLOCK",false],"M98_EXTERNAL":["PROFILE_SPECIFIC","O_PROGRAM",true]};
 const set=permitted[p.style];
 if(!set||set[0]!==p.paramScope||set[1]!==p.targetType||set[2]!==p.externalFile)return "REJECTED";
 if(!/^(0|[1-9]\d{0,23})$/.test(String(p.outerRepeat))||!/^(0|[1-9]\d{0,23})$/.test(String(p.innerRepeat))||!/^(0|[1-9]\d{0,23})$/.test(String(p.expectedEvents))||!/^(0|[1-9]\d{0,23})$/.test(String(p.maxEvents)))return "REJECTED";
 const total=BigInt(p.outerRepeat)*BigInt(p.innerRepeat);
 if(total===0n||total!==BigInt(p.expectedEvents)||total>BigInt(p.maxEvents))return "REJECTED";
 if(linux){const result=p.style==="M98_NUMBERED"?Number(p.initialParam1)+Number(p.outerRepeat)*Number(p.outerStep)+Number(total)*Number(p.innerStep):Number(p.initialParam1);if(!Number.isFinite(result)||!Number.isFinite(p.expectedParamAfter)||Math.abs(result-p.expectedParamAfter)>1e-9)return "REJECTED";}
 else if(p.expectedParamAfter!==null)return "REJECTED";
 if(g.releaseRequested&&!g.d15Independent)return "REJECTED";
 return g.previewOnly?"DISPLAY_ONLY":"CANDIDATE_ONLY";
};
const patch=function patch(obj,changes){const x=JSON.parse(JSON.stringify(obj));for(const [key,val] of Object.entries(changes)){const parts=key.split(".");let target=x;for(const p of parts.slice(0,-1))target=target[p];target[parts.at(-1)]=val;}return x;};
const root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=load("research/sources/CAP-08-05-subprogram-b76.json"),t=load("research/traces/CAP-08-05-subprogram-b76-v08.json"),f=load("docs/capabilities/CAP-08-05/subprogram-b76-fixtures-v08.json");
assert.equal(s.sources.length,7);assert.equal(t.rules.length,8);
const ids=new Set(s.sources.map(x=>x.id));
for(const r of t.rules){assert.ok(r.sourceIds.every(x=>ids.has(x)),r.id+"来源");assert.ok(r.caseIds.length>0,r.id+"验收");assert.ok(r.workPackageIds.length>0,r.id+"工作包");}
for(const c of f.cases){const r=t.rules.find(x=>x.id===c.ruleId);assert.ok(r&&r.caseIds.includes(c.id),c.id+"反追踪");assert.equal(judge(patch(f.base,c.changes)),c.expected,c.id+"预期");}
assert.equal(f.total,f.cases.length);for(const k of Object.keys(f.counts))assert.equal(f.counts[k],f.cases.filter(c=>c.kind===k).length);
assert.equal(5n*5n,25n);assert.ok(Math.abs(5*1+25*.01-5.25)<1e-12);
console.log("B76 仅规划同judge合成 "+f.cases.length+"/"+f.cases.length+" PASS "+JSON.stringify(f.counts)+"；产品/实机/独立消费者NOT_RUN");
