#!/usr/bin/env node
// 规划追踪与合成正反用例的独立文件入口，不进行任何产品/机床检验。
import assert from "node:assert/strict";import fs from "node:fs";import path from "node:path";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const sources=read("research/sources/CAP-05-03.json"),traces=read("research/traces/CAP-05-03.json"),fixtures=read("docs/capabilities/CAP-05-03/fixtures.json");
function evaluate(n,x){const hash=z=>typeof z==="string"&&/^[a-f0-9]{64}$/.test(z),unique=a=>Array.isArray(a)&&new Set(a).size===a.length;
switch(n){
case 1:return x.scope==="p1"&&x.planRevision&&x.refs?.length===3&&x.refs.every(r=>r.id&&r.revision&&hash(r.hash)&&r.frame);
case 2:{const a=x.operationIds,b=x.edges;if(!unique(a)||!Array.isArray(b))return false;const deg=Object.fromEntries(a.map(k=>[k,0]));for(const [u,v] of b){if(!a.includes(u)||!a.includes(v)||u===v)return false;deg[v]++}let q=a.filter(k=>!deg[k]),count=0;while(q.length){const k=q.shift();count++;for(const [u,v] of b)if(u===k&&!--deg[v])q.push(v)}return count===a.length}
case 3:return unique(x.displayOrder)&&JSON.stringify(x.edgesBefore)===JSON.stringify(x.edgesAfter);
case 4:return unique(x.features)&&unique(x.operations)&&x.operations.every(op=>Array.isArray(x.links[op])&&x.links[op].every(f=>x.features.includes(f)));
case 5:return x.writesD10===false&&(!x.crossSetup||(x.frameChecked&&x.setupB.frame===x.transferExactRef?.frame&&hash(x.transferExactRef?.hash)&&x.transferExactRef?.revision));
case 6:return x.fork===true&&!x.overwriteFrozen&&!x.modified.some(id=>x.frozen.includes(id));
case 7:return x.approval===true&&hash(x.solverRun?.hash)&&x.solverRun?.revision&&!x.selection.some(id=>x.freeze.includes(id));
case 8:return x.aclAtCommit===true&&x.sourceHashesCurrent===true&&x.expectedRevision===x.currentRevision;
case 9:return x.cancelled===false&&x.scopeEpoch===x.ackEpoch&&x.generation===x.ackGeneration;
case 10:return x.historicalD16Unchanged===true&&x.d16==="NOT_RELEASED"&&["NOT_RUN","UNKNOWN"].includes(x.d15)&&x.affected.every(id=>x.stale.includes(id))&&!x.unaffected.some(id=>x.stale.includes(id));
default:return false}}
assert.equal(sources.sources.length,9);assert.equal(sources.registeredRecords,9);assert.equal(traces.rules.length,10);assert.equal(fixtures.cases.length,20);
const ids=new Set(sources.sources.map(s=>s.id));assert.equal(ids.size,9);
let accepted=0,rejected=0;
for(const rule of traces.rules){assert(rule.sourceIds.length>0&&rule.sourceIds.every(id=>ids.has(id)));assert.equal(rule.acceptanceIds.length,2);assert.deepEqual(rule.workPackages,["W2-02","W2-03","W2-05"]);
for(const id of rule.acceptanceIds){const c=fixtures.cases.find(z=>z.id===id);assert(c);assert.equal(c.ruleId,rule.id);const v=evaluate(Number(rule.id.slice(-2)),c.input);assert.equal(v,c.expected==="PASS",id);if(v)accepted++;else rejected++;}}
assert.deepEqual([accepted,rejected],[10,10]);
console.log(JSON.stringify({planning:"PASS",sources:9,rules:10,positive:10,negative:10,product:"NOT_RUN",independentConsumers:"NOT_RUN"}));
