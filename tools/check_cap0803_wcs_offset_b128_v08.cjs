"use strict";
// B128：只读规划合成校验；绝不向控制器/机床发送命令。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const a=process.argv.indexOf("--root"),root=a<0?path.resolve(__dirname,".."):path.resolve(process.argv[a+1]);
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=read("research/sources/CAP-08-03-wcs-offset-b128.json"),t=read("research/traces/CAP-08-03-wcs-offset-b128-v08.json"),f=read("docs/capabilities/CAP-08-03/wcs-offset-b128-fixtures-v08.json");
assert.equal(s.sources.length,7);assert.equal(s.registeredRecords,7);assert.equal(new Set(s.sources.map(x=>x.id)).size,7);
assert.equal(t.rules.length,8);assert.equal(f.cases.length,40);assert.equal(f.goldens.length,8);
const src=new Set(s.sources.map(x=>x.id)),cases=new Map(f.cases.map(x=>[x.id,x]));assert.equal(cases.size,40);
for(const r of t.rules){assert.equal(r.fields.length,4);assert.equal(r.negative.length,4);assert.equal(r.positive.length,1);assert.ok(r.sourceIds.every(id=>src.has(id)));assert.ok(r.caps.length&&r.originalWorkPackages.length);
for(const id of [...r.positive,...r.negative]){const c=cases.get(id);assert.ok(c,id);assert.equal(c.rule,r.id);assert.deepEqual(Object.keys(c.input).sort(),[...r.fields].sort(),id);const j=r.fields.findIndex(key=>c.input[key]!==true);assert.equal(j<0?"CANDIDATE":r.expectedNegativeStatuses[j],c.expect,id);}
for(let i=0;i<4;i++){const c=cases.get(r.negative[i]);assert.equal(c.mutatedField,r.fields[i]);assert.deepEqual(r.fields.filter(x=>c.input[x]===false),[r.fields[i]],c.id);}}
function semantic(g){const o={status:"SYNTHETIC_ONLY"};
if(g.kind==="L2")return {...o,offset:g.profile==="LINUXCNC_2_9"?g.value:g.profile==="HAAS_MILL_DOC"?(g.distance==="G91"?g.oldOffset+g.value:g.value):null,selected:g.selected};
if(g.kind==="L20"){if(g.profile==="LINUXCNC_2_9")return {...o,offset:g.machineX-g.desiredWorkX-g.otherOffset,selected:g.selected};if(g.profile==="HAAS_MILL_DOC")return {...o,aux:g.p===2?"G111":"UNKNOWN",offset:g.value,selected:g.selected};}
if(g.kind==="G92_RESET"){let saved=g.saved,enabled=true;for(const op of g.operations){if(op==="G92.1"){saved=0;enabled=false}else if(op==="G92.2"){enabled=false}else if(op==="G92.3"){enabled=true}else return {status:"UNKNOWN"}}return {...o,enabled,saved};}
if(g.kind==="G52_RESTART")return {...o,restored:g.persistenceEnabled?g.g52X:0};return {status:"UNKNOWN"};}
for(const g of f.goldens)assert.deepEqual(semantic(g),g.expect,g.id);
console.log("B128: 40/40字段案例、8/8标量Goldens；PLANNING_ONLY，非实际OEM/D13-D15/独立消费者验收");
