#!/usr/bin/env node
"use strict";
// B74只读规划验收；不调用实际机床、NC或产品数据库。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
function judge(x){const a=x.cutter,b=x.bind,n=x.nc,g=x.gate,u=x.ui,c=x.compat;
if(g.currentRev!==g.expectedRev||a.revision!==g.expectedRev||b.cutterRevision!==a.revision||b.cutterHash!==a.hash||b.frame!==b.expectedFrame||n.finalHash!==n.expectedHash||g.scope!==g.expectedScope||g.taskGen!==g.receiptGen||g.cancelled)return "STALE";
if(!g.acl||!g.cas||a.kind!=="TURNING_INSERT"||a.unit!=="mm"||(typeof a.noseRadiusMm==="number"&&a.noseRadiusMm<=0)||!b.physicalInstall||n.clClaimsPass||n.d16!=="BLOCKED"||u.sceneCount!==1||u.engineCount!==1||u.panel!=="UnifiedTaskPanel"||u.previewWrites||!["GUI","CLI","Agent"].every(k=>u.channels.includes(k))||c.abOverwrite||c.freezeUnchanged===false||c.rollbackSafe===false)return "REJECT";
if(a.noseRadiusMm==null||b.offsetEvidence==null||!b.version||!n.xMode||!n.comp||!g.requestId||c.newReader==null)return "UNKNOWN";
if(!b.offsetEvidence||!c.oldReader||!c.newReader||g.port!=="Resources.CutterProfilePort")return "REJECT";
if(n.plane!=="G18"||!["G7","G8"].includes(n.xMode)||!["G41","G42"].includes(n.comp)||n.xWord!==(n.xMode==="G7"?n.partDiameterMm:n.partDiameterMm/2)||n.entryMotion!=="LINEAR"||n.exitMotion!=="LINEAR"||n.entryMm<a.noseRadiusMm)return "REJECT";
if(b.controller==="LinuxCNC"){if(n.dialect!=="LinuxCNC"||b.version!=="2.9")return "UNKNOWN";if(b.tableQ==null||b.tableDiameterMm==null)return "UNKNOWN";if(!Number.isInteger(a.orientationQ)||a.orientationQ<0||a.orientationQ>9||b.tableQ!==a.orientationQ||b.tableTool!==b.loadedTool||Math.abs(b.tableDiameterMm-2*a.noseRadiusMm)>1e-9||!(n.exitMm>2*a.noseRadiusMm))return "REJECT";}
else if(b.controller==="Haas"){if(n.dialect!=="Haas"||b.version!=="NGC"||b.haasTip==null)return "UNKNOWN";if(b.haasOffset!=="T0707"||!Number.isInteger(b.haasTip)||b.haasTip<0||b.haasTip>9)return "REJECT";if(!n.haasExitVerified)return "UNKNOWN";}
else return "UNKNOWN";
if(n.d13!=="PENDING"||n.d14!=="NOT_RUN"||n.d15!=="NOT_RUN")return "UNKNOWN";
return u.displayOnly?"DISPLAY_ONLY":"CANDIDATE_ONLY";}
const root=path.resolve(__dirname,"..");
const f=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-02-02/lathe-tnc-b74-fixtures-v08.json"),"utf8"));
const t=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-02-02-lathe-tnc-b74-v08.json"),"utf8"));
const s=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-02-02-lathe-tnc-b74.json"),"utf8"));
assert.equal(s.sources.length,7);assert.equal(t.rules.length,8);assert.equal(f.total,f.cases.length);
const sourceIds=new Set(s.sources.map(x=>x.id)),caseIds=new Set(f.cases.map(x=>x.id));assert.equal(caseIds.size,f.total);
for(const r of t.rules){assert.ok(r.sourceIds.every(x=>sourceIds.has(x)));assert.ok(r.caseIds.length>=3);assert.ok(r.caseIds.every(x=>caseIds.has(x)));}
for(const c of f.cases){assert.equal(judge(c.input),c.expected,c.id);assert.ok(t.rules.find(x=>x.id===c.ruleId)?.caseIds.includes(c.id));}
console.log("B74同judge规划合成 "+f.total+"/"+f.total+" PASS；产品与独立消费者NOT_RUN");
