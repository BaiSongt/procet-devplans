// B131 合成规划规则测试，不构成实际OEM/NC/D15验收。
"use strict";const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");const root=path.resolve(__dirname,".."),get=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));const src=get("research/sources/CAP-08-05-g84-tapping-b131.json"),tr=get("research/traces/CAP-08-05-g84-tapping-b131-v08.json"),fx=get("docs/capabilities/CAP-08-05/g84-tapping-b131-fixtures-v08.json");
function judge(a){let p=a.profile,c=a.cycle,h=a.hardware,f=a.feed,i=a.identity,e=a.evidence,u=a.ui,g=a.gate;
if(!p.hash||!i.ncHash||!i.d04||!i.d10||!i.frame)return"UNKNOWN";
if(p.machine!=="MILL"&&p.machine!=="LATHE")return"REJECT";
if(!["LINUXCNC_2_9","HAAS_MILL_NGC","HAAS_LATHE_NGC"].includes(p.controller))return"UNKNOWN";
if(!["G33.1","G84","G95"].includes(c.code)||!["SYNC","FLOAT"].includes(c.motion))return"UNKNOWN";
if(c.unit!=="mm/rev")return"REJECT";
if(!Number.isFinite(f.rpm)||f.rpm<=0||!Number.isFinite(f.pitch)||f.pitch<=0||!Number.isFinite(f.nominal)||Math.abs(f.rpm*f.pitch-f.nominal)>1e-10)return"REJECT";
if(!Number.isFinite(f.k)||!Number.isFinite(f.f))return"REJECT";
if(p.controller==="LINUXCNC_2_9"&&p.machine==="MILL"){if(c.code==="G33.1"){if(c.motion!=="SYNC"||h.holder!=="RIGID")return"REJECT";if(!h.encoder||!h.index)return"UNKNOWN";if(Math.abs(f.k-f.pitch)>1e-10)return"REJECT";}else if(c.code==="G84"){if(c.motion!=="FLOAT"||h.holder!=="FLOATING")return"REJECT";if(f.mode!=="G94"||Math.abs(f.f-f.nominal)>1e-10)return"REJECT";}else return"UNKNOWN";}
else if(p.controller==="HAAS_MILL_NGC"&&p.machine==="MILL"){if(c.code!=="G84")return"UNKNOWN";if(c.motion!=="SYNC"||h.holder!=="RIGID")return"REJECT";if(!h.oemOption)return"UNKNOWN";if(f.mode==="G94"&&Math.abs(f.f-f.nominal)>1e-10)return"REJECT";if(f.mode==="G95"&&Math.abs(f.f-f.pitch)>1e-10)return"REJECT";}else return"UNKNOWN";
if(e.d13!=="REPARSED_NC"||e.d14!=="AXIS_TIMELINE_REQUIRED"||e.d15!=="INDEPENDENT_PENDING")return"REJECT";
if(u.worlds!==1||u.panel!=="UnifiedTaskPanel:left"||u.entry!=="GUI|CLI|Agent"||u.port!=="NcCycleInterpreterPort")return"REJECT";
if(g.cancelled||g.epoch!==g.ackEpoch)return"STALE";
if(!g.acl||!g.cas||!g.frozen)return"REJECT";if(!g.rollback)return"UNKNOWN";
return"QUALIFIED_CANDIDATE_NOT_D15"}
assert.equal(src.records.length,7);assert.equal(tr.rules.length,8);assert.equal(fx.tests.length,32);assert.equal(fx.goldens.length,10);const sources=new Set(src.records.map(x=>x.id)),testIds=new Set(fx.tests.map(x=>x.id));for(const r of tr.rules){assert.equal(r.tests.length,4);for(const s of r.sourceIds)assert.ok(sources.has(s));for(const t of r.tests)assert.ok(testIds.has(t));}let pos=0,neg=0;for(const t of fx.tests){assert.equal(judge(t.input),t.expect,t.id);if(t.kind==="positive")pos++;else{neg++;const diff=[];for(const k in fx.baseline)for(const q in fx.baseline[k])if(JSON.stringify(fx.baseline[k][q])!==JSON.stringify(t.input[k][q]))diff.push(k+"."+q);assert.deepEqual(diff,[t.changedField]);}}assert.equal(pos,8);assert.equal(neg,24);for(const g of fx.goldens)assert.equal(judge(g.input),g.expect,g.name);for(const g of fx.mathGoldens)assert.equal(g.rpm*g.pitch,g.nominal);console.log(JSON.stringify({status:"SYNTHETIC_PLANNING_PASS",positive:pos,negative:neg,goldens:13,product:"NOT_RUN"}));
