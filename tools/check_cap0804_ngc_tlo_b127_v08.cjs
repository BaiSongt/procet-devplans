"use strict";
// B127只读规划校验器：本脚本检查来源—规则—字段—独立负例及解析状态算例，不接控制器/机床。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const arg=process.argv.indexOf("--root");const root=arg<0?path.resolve(__dirname,".."):path.resolve(process.argv[arg+1]);
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const s=read("research/sources/CAP-08-04-ngc-tlo-b127.json"),t=read("research/traces/CAP-08-04-ngc-tlo-b127-v08.json"),f=read("docs/capabilities/CAP-08-04/ngc-tlo-b127-fixtures-v08.json");
assert.equal(s.registeredRecords,7);assert.equal(s.sources.length,7);assert.equal(new Set(s.sources.map(x=>x.id)).size,7);
assert.equal(t.rules.length,8);assert.equal(f.cases.length,40);assert.equal(f.goldens.length,8);
const sourceSet=new Set(s.sources.map(x=>x.id)),caseSet=new Set(f.cases.map(x=>x.id));assert.equal(caseSet.size,40);
function judge(r,input){const idx=r.fields.findIndex(field=>input[field]!==true);return idx<0?"CANDIDATE":r.expectedNegativeStatuses[idx];}
for(const r of t.rules){assert.equal(r.fields.length,4,r.id);assert.equal(r.positive.length,1);assert.equal(r.negative.length,4);assert.ok(r.sourceIds.every(id=>sourceSet.has(id)),r.id);assert.ok(r.caps.length>0&&r.originalWorkPackages.length>0);
for(const id of [...r.positive,...r.negative]){assert.ok(caseSet.has(id));const c=f.cases.find(x=>x.id===id);assert.equal(c.rule,r.id);assert.equal(judge(r,c.input),c.expect,id);assert.deepEqual(Object.keys(c.input).sort(),[...r.fields].sort(),id);}
for(let i=0;i<4;i++){const c=f.cases.find(x=>x.id===r.negative[i]);assert.equal(c.mutatedField,r.fields[i]);assert.deepEqual(r.fields.filter(x=>c.input[x]===false),[r.fields[i]],c.id);}}
function model(g){if(!["HAAS_NGC_100_21_000_1100_PLUS","LINUXCNC_2_9"].includes(g.profile))return{status:"UNKNOWN",offset:null};let offset=g.initialOffset,tool=null;for(const s of g.steps){switch(s.code){case "M6":tool=s.tool;if(g.profile.startsWith("HAAS"))offset=g.offsets[String(tool)]??null;break;case "G43":offset=g.offsets[String(s.h??tool)]??null;break;case "G43_1":if(g.profile!=="LINUXCNC_2_9")return{status:"UNKNOWN",offset:null};offset=s.z;break;case "G43_2":if(g.profile!=="LINUXCNC_2_9")return{status:"UNKNOWN",offset:null};{const add=g.offsets[String(s.h)];offset=add===undefined?null:offset+add;}break;case "G49":offset=0;break;case "RESTART":if(!g.profile.startsWith("HAAS"))return{status:"UNKNOWN",offset:null};break;default:return{status:"UNKNOWN",offset:null}}if(offset===null)return{status:"UNKNOWN",offset:null};}return{status:"CANDIDATE",offset};}
for(const g of f.goldens){const v=model(g);assert.equal(v.status,g.expectStatus,g.id);assert.equal(v.offset,g.expectOffset,g.id);} 
console.log("B127 40/40 field cases; 8/8 simplified offset goldens; PLANNING_ONLY not OEM/NC/product");
