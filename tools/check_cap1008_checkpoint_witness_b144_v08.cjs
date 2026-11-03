// B144仅校验规划样例和来源关系；不签名、不模拟真实设备，不是RFC9162证明器
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const sources=read("research/sources/CAP-10-08-checkpoint-witness-b144.json"),trace=read("research/traces/CAP-10-08-checkpoint-witness-b144-v08.json"),fx=read("docs/capabilities/CAP-10-08/checkpoint-witness-b144-fixtures-v08.json");
assert.equal(sources.records.length,5);assert.equal(new Set(sources.records.map(s=>s.id)).size,5);assert.equal(trace.rules.length,8);assert.equal(fx.groups.length,8);
const sids=new Set(sources.records.map(s=>s.id));let count=0;
for(const r of trace.rules){assert.equal(r.capabilityId,"CAP-10-08");assert.deepEqual(r.originalWorkPackages,["E3-06","T5-03"]);assert.equal(r.fields.length,4);assert(r.sourceIds.every(s=>sids.has(s)));const group=fx.groups.find(g=>g.ruleId===r.id);assert(group);assert.equal(group.negative.length,4);assert.deepEqual(r.tests,[group.positive.id,...group.negative.map(x=>x.id)]);
 for(const c of [group.positive,...group.negative]){assert.deepEqual(Object.keys(c.values),r.fields);if(c.mutatedField)assert.deepEqual(r.fields.filter(k=>c.values[k]!==group.positive.values[k]),[c.mutatedField]);const got=r.fields.every(k=>c.values[k]===true)?"PLANNING_CANDIDATE_ONLY":r.failureStatus;assert.equal(got,c.expected);count++;}}
function state(x){if(!x.ownerAclLive)return"REJECT_PERMISSION";if(x.cancelled)return"REJECT_CANCEL";if(!x.d15Independent)return"BLOCK_D16";if(x.oldSize>x.newSize)return"INVALID_TREE_ORDER";if(x.oldSize===x.newSize&&!x.sameSizeRootEqual)return"CONFLICT_EQUIVOCATION";if(x.oldSize<x.newSize&&!x.consistencyVerified)return"UNKNOWN_CONSISTENCY";if(!x.witnessVerified)return"UNKNOWN_WITNESS";return"PLANNING_CANDIDATE_ONLY";}
for(const g of fx.goldens){assert.equal(state(g.input),g.expected);count++}
assert.equal(fx.goldens.length,10);assert.equal(count,50);
console.log("B144：8正+32单字段负+10状态Golden规划结构通过；密码学/产品NOT_RUN");
