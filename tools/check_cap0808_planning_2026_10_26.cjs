/* CAP-08-08 规划合成校验：独立Node入口；不触达产品或机床 */
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const trace=read("research/traces/CAP-08-08.json"),sources=read("research/sources/CAP-08-08.json"),fixtures=read("docs/capabilities/CAP-08-08/fixtures.json");
const get=(o,p)=>p.split(".").reduce((x,k)=>x==null?undefined:x[k],o);
const check=(rule,input)=>rule.criteria.every(c=>c.op==="eq"&&get(input,c.path)===c.value)?"PASS":"REJECT";
const ids=new Set(sources.sources.map(x=>x.id));
assert.equal(sources.registeredRecords,8);assert.equal(ids.size,8);assert.equal(trace.rules.length,10);assert.equal(fixtures.cases.length,30);
for(const r of trace.rules){assert.equal(r.capabilityId,"CAP-08-08");assert.ok(r.sourceIds.length&&r.sourceIds.every(s=>ids.has(s)));assert.ok(r.fields.length>=4);assert.deepEqual(r.fields,r.criteria.map(c=>c.path));const matches=fixtures.cases.filter(c=>c.ruleId===r.id);assert.equal(matches.length,3);assert.deepEqual(new Set(matches.map(c=>c.scenario)),new Set(["POSITIVE","NEGATIVE","INDEPENDENT_FIELD_MUTATION"]));for(const c of matches){assert.equal(check(r,c.input),c.expected,c.id);if(c.mutatedField)assert.ok(r.fields.includes(c.mutatedField));}assert.notEqual(matches[1].mutatedField,matches[2].mutatedField)}
const example=read("docs/capabilities/CAP-08-08/contract.example.json");assert.equal(example.syntheticOnly,true);assert.equal(example.gates.d16Release,"BLOCKED");assert.equal(example.gates.d13Semantic,"UNKNOWN");assert.notEqual(example.executionContext.d03ResourceRevision,example.executionContext.d10MachineBindingRevision);
console.log("PASS 30/30 规则正反/独立字段变异；8来源/10规则/1合成合同；产品/NC/机床/消费者 NOT_RUN");
