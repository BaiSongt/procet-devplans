#!/usr/bin/env node
"use strict";
// B72独立入口：仅规划合成验收，不连接控制器、不产生NC工程合格报告。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function judge(x){const a=x.identity,p=x.program,g=x.gate;if(!a||!p||!g)return "UNKNOWN";if(a.ncHash!==a.expectedNcHash||a.scopeEpoch!==7||a.d04Rev!=="D04-r72"||a.d10Rev!=="D10-r72"||a.profileHash!=="b".repeat(64)||g.generation!==g.ackGeneration)return "STALE";if(!a.frameFrom||!a.frameTo||g.ownerPort!=="NcSemanticOwnerPort"||!g.acl||!g.cas||g.cancelled||g.lateAck||g.sceneCount!==1||!g.leftPanel||!Array.isArray(g.channels)||["GUI","CLI","Agent"].some(c=>!g.channels.includes(c))||g.previewWrites||!g.freezePreserved||!g.rollbackReader)return "REJECTED";if(!p.profileVerified||!p.xModeKnown||!p.machineLimitKnown||!p.spindleSelected||!p.spindleFeedbackKnown||!p.centerFrameKnown||p.unsupportedMacro||!["MM","INCH"].includes(p.units)||!["LINUXCNC_2_9","HAAS_LATHE"].includes(p.dialect)||p.xWord===0)return "UNKNOWN";const lc=p.dialect==="LINUXCNC_2_9";if(p.feedMode!==(lc?"G95":"G99")||p.limitCode!==(lc?"G96_D":"G50_S")||!(lc?["G7","G8"]:["PROFILE_DIAMETER","PROFILE_RADIUS"]).includes(p.xMode)||!p.cssOn||!p.centerAligned||!(p.cssS>0)||!(p.limitRpm>0)||!(p.machineLimitRpm>0)||!(p.feedPerRev>0))return "REJECTED";const scale=p.units==="MM"?1:25.4,diam=Math.abs(p.xWord)*scale*(["G7","PROFILE_DIAMETER"].includes(p.xMode)?1:2),speed=p.cssS*(p.units==="MM"?1000:304.8),rpm=Math.min(speed/(Math.PI*diam),p.limitRpm,p.machineLimitRpm),f=rpm*p.feedPerRev*scale;const eq=(v,w)=>Number.isFinite(w)&&Math.abs(v-w)<1e-6*Math.max(1,Math.abs(v));if(!eq(diam,p.expectedDiameterMm)||!eq(rpm,p.expectedRpm)||!eq(f,p.expectedFeedMmMin))return "REJECTED";return g.previewOnly?"DISPLAY_ONLY":"CANDIDATE_ONLY"}
const root=path.resolve(__dirname,"..");
const f=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-08-03/lathe-css-b72-fixtures-v08.json"),"utf8"));
const s=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-08-03-lathe-css-b72.json"),"utf8"));
const t=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-08-03-lathe-css-b72-v08.json"),"utf8"));
assert.equal(s.sources.length,8);assert.equal(t.rules.length,8);
const sourceIds=new Set(s.sources.map(x=>x.id)),ruleIds=new Set(t.rules.map(x=>x.id));
for(const r of t.rules){assert.ok(r.sourceIds.length>0&&r.sourceIds.every(id=>sourceIds.has(id)),r.id+" source");assert.ok(r.fields.length>=3,r.id+" fields");assert.ok(r.workPackageIds.length>0,r.id+" packages");}
for(const c of f.cases){assert.ok(ruleIds.has(c.ruleId),c.id+" trace");assert.equal(judge(c.input),c.expected,c.id+" expected status");}
assert.equal(f.total,f.cases.length);
for(const k of Object.keys(f.counts))assert.equal(f.counts[k],f.cases.filter(c=>c.kind===k).length);
console.log("B72 规划合成 PASS "+f.cases.length+"/"+f.cases.length+" "+JSON.stringify(f.counts)+"；真实NC/机床/独立消费者NOT_RUN");
