"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const argv=process.argv;
const rootIndex=argv.indexOf("--root");
const root=rootIndex>=0?path.resolve(argv[rootIndex+1]):path.resolve(__dirname,"..");
function load(p){return JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));}
const s=load("research/sources/CAP-08-03-reference-return-b120.json");
const t=load("research/traces/CAP-08-03-reference-return-b120-v08.json");
const f=load("docs/capabilities/CAP-08-03/reference-return-b120-fixtures-v08.json");
assert.equal(s.registeredRecords,s.sources.length);
assert.equal(new Set(s.sources.map(x=>x.id)).size,s.sources.length);
assert.equal(t.rules.length,8);
assert.equal(f.cases.length,40);
assert.equal(f.goldens.length,8);
const sourceIds=new Set(s.sources.map(x=>x.id));
const caseIds=new Set(f.cases.map(x=>x.id));
assert.equal(caseIds.size,f.cases.length);
function judge(rule,input){
  const fail=rule.fields.findIndex(k=>input[k]!==true);
  return fail<0?"CANDIDATE":rule.expectedNegativeStatuses[fail];
}
for(const rule of t.rules){
  assert.equal(rule.fields.length,4,rule.id);
  assert.equal(rule.positive.length,1);
  assert.equal(rule.negative.length,4);
  assert.ok(rule.sourceIds.every(x=>sourceIds.has(x)),rule.id);
  assert.ok(rule.originalWorkPackages.length>0);
  for(const id of [...rule.positive,...rule.negative]){
    assert.ok(caseIds.has(id),id);
    const test=f.cases.find(x=>x.id===id);
    assert.equal(test.rule,rule.id);
    assert.equal(judge(rule,test.input),test.expect,id);
  }
  for(let k=0;k<4;k++){
    const neg=f.cases.find(x=>x.id===rule.negative[k]);
    assert.equal(neg.mutatedField,rule.fields[k]);
    const falseFields=rule.fields.filter(field=>neg.input[field]===false);
    assert.deepEqual(falseFields,[rule.fields[k]],neg.id);
  }
}
function syntheticOneDimensional(g){
  assert.equal(g.profile,"SYNTHETIC_1D_TRANSLATION_NOT_OEM");
  let current=g.initialMachineZ;
  let mode=g.initialMode;
  const positions=[];
  for(const step of g.steps){
    if(step.mode)mode=step.mode;
    assert.ok(["G90","G91"].includes(mode));
    if(step.code==="G28"||step.code==="G30"){
      current=(mode==="G90"?g.wcsOffsetZ+step.z:current+step.z);
      positions.push(current);
      current=g.referenceMachineZ;
      positions.push(current);
    }else if(step.code==="G53"){
      assert.equal(mode,"G90","G53/G91 omitted from synthetic subset");
      current=step.z;
      positions.push(current);
    }else if(step.code==="G0"){
      current=(mode==="G90"?g.wcsOffsetZ+step.z:current+step.z);
      positions.push(current);
    }else throw Error("unsupported synthetic token "+step.code);
  }
  return {positions,mode};
}
for(const golden of f.goldens){
  const actual=syntheticOneDimensional(golden);
  assert.deepEqual(actual.positions,golden.expectedPositions,golden.id);
  assert.equal(actual.mode,golden.expectedMode,golden.id);
}
console.log(JSON.stringify({status:"PLANNING_SYNTHETIC_ONLY",sources:s.sources.length,rules:t.rules.length,positive:8,negative:32,mathGoldens:8,realNC:"NOT_RUN",realD15:"NOT_RUN"}));
