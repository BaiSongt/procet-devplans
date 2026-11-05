'use strict';
// B175只读规划合成校验，不连接刀具、控制器、设备或生产数据库。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const t=read('research/traces/CAP-02-03-gauge-stack-b175-v08.json'),s=read(t.sourceRegistry),f=read(t.fixtures);
const get=(o,p)=>p.split('.').reduce((x,k)=>x?.[k],o);
function valid(p,v,x){
 if(p.endsWith('Sha')||p.endsWith('.sha'))return typeof v==='string'&&/^sha256:[a-f0-9]{64}$/.test(v);
 if(['assembly.revision','assembly.cutterRevision','assembly.holderRevision'].includes(p))return typeof v==='string'&&/^rev-[1-9]\d*$/.test(v);
 if(p==='gauge.direction')return v==='+Z';if(p==='gauge.units')return v==='mm';
 if(p==='tcp.tipKind')return v==='CUTTING_EDGE_POINT';if(p==='tcp.source')return v==='DESIGN_NOMINAL';
 if(p==='measure.calibrationRev')return typeof v==='string'&&/^CAL-[1-9]\d*$/.test(v);
 if(p==='execution.toolTableEpoch')return typeof v==='string'&&/^epoch-[1-9]\d*$/.test(v);
 if(p==='length.nominalGaugeMm')return Number.isFinite(v)&&v>0&&Math.abs(v-(x.length.holderMm+x.length.extensionMm+x.length.stickoutMm))<1e-9;
 if(['length.holderMm','length.extensionMm','length.stickoutMm'].includes(p))return Number.isFinite(v)&&v>=0;
 if(['measure.observedMm','measure.standardUncertaintyMm'].includes(p))return Number.isFinite(v)&&v>0;
 if(p==='execution.appliedHLengthMm')return Number.isFinite(v)&&Math.abs(v-x.measure.observedMm)<1e-9;
 return v===true;
}
function classify(s){return s.lateAck?'REJECT_LATE_ACK':s.sourceChanged?'STALE_RECOMPUTE':!s.axisAligned?'UNKNOWN_NONCOAX':Math.abs(s.nominal-(s.holder+s.extension+s.stickout))>1e-9?'NOMINAL_MISMATCH':!s.controllerKnown?'D13_UNKNOWN':Math.abs(s.appliedH-s.measured)>1e-9?'D10_OFFSET_MISMATCH':'PLANNING_ONLY';}
assert.equal(s.records.length,9);assert.equal(t.rules.length,10);assert.equal(f.cases.length,50);assert.equal(f.goldens.length,8);
const sources=new Set(s.records.map(x=>x.id)),seen=new Set();let pos=0,neg=0;
for(const r of t.rules){assert.equal(r.fields.length,4);assert.deepEqual(r.originalWorkPackages,['F1-02','F1-06','E3-03','E3-04','T5-03']);for(const id of r.sourceIds)assert.ok(sources.has(id),id);for(const id of r.testIds)assert.ok(f.cases.some(c=>c.id===id),id);}
for(const c of f.cases){assert.ok(!seen.has(c.id),c.id);seen.add(c.id);const rule=t.rules.find(r=>r.id===c.ruleId);assert.ok(rule&&rule.testIds.includes(c.id));const x=JSON.parse(JSON.stringify(f.baseline));
if(c.changedField){neg++;assert.equal(c.kind,'single_field_negative');assert.ok(rule.fields.includes(c.changedField));const [a,b]=c.changedField.split('.');assert.notDeepEqual(x[a][b],c.patchValue);x[a][b]=c.patchValue;assert.equal(t.rules.flatMap(r=>r.fields).filter(p=>!Object.is(get(x,p),get(f.baseline,p))).length,1);}else{pos++;assert.equal(c.kind,'positive');}
assert.equal(rule.fields.every(p=>valid(p,get(x,p),x)),c.expected,c.id);}
for(const g of f.goldens)assert.equal(classify(g.state),g.expected,g.id);
assert.equal(pos,10);assert.equal(neg,40);console.log('B175 58/58 PLANNING_ONLY; independent Node file test achieved; real tool/NC/Owner/consumer NOT_RUN');
