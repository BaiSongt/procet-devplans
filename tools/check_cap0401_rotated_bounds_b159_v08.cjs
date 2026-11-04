'use strict';
// B159 CAP-04-01 原编号Setup毛坯包围规划校验器。只读、无运行机床/OCCT。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const fixture=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-04-01/rotated-bounds-b159-fixtures-v08.json'),'utf8'));
const trace=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-04-01-rotated-bounds-b159-v08.json'),'utf8'));
const source=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-04-01-rotated-bounds-b159.json'),'utf8'));
const valid={"cadExactRef":"D01:cad:r12:sha256:abc","occurrencePath":"asm/partA[0]","sourceFrameExact":"PART@r4","unitCode":"mm","setupFrameExact":"SETUP:S1@r5","transformKind":"SE3_RH","transformDirection":"PART_TO_SETUP","frameWitness":"verified_exact","bboxAlgorithm":"BRepBndLib.AddOptimal","triangulationPolicy":"IGNORE_TRIANGULATION","shapeTolerancePolicy":"EXPLICIT_BUDGET","occtApiEvidence":"API_8_0_1_DOC_ONLY","boxState":"FINITE_NONVOID","gapRecorded":true,"boundsOrder":"MIN_LE_MAX","boundsFrame":"SETUP_LOCAL","candidateMethod":"RECOMPUTE_TRANSFORMED_SHAPE","shapeSourceKind":"CAD_BREP","enclosureDecision":"INDEPENDENT_CHECK_PENDING","tightnessClaim":"NO_GLOBAL_OPTIMAL_CLAIM","autoOnSetupCreate":false,"explicitCalculate":true,"explicitAdopt":true,"stockIntentState":"D04_DRAFT_ONLY","ownerDomain":"D04","casAtCommit":true,"aclAtCommit":"RECHECK_CURRENT_ACTOR","lateAckHandling":"DISCARD_OLD_SCOPE_EPOCH","singleBabylonWorld":true,"leftTaskPanel":true,"guiCliAgentSamePort":true,"ncVerificationState":"UNKNOWN_UNTIL_FINAL_NC_D15"};
function judge(a){
  for(const k of Object.keys(valid))if(!Object.prototype.hasOwnProperty.call(a,k)||a[k]===null)return 'UNKNOWN';
  for(const [k,v] of Object.entries(valid))if(a[k]!==v)return 'REJECT';
  return 'PASS';
}
function goldenJudge(a){
  if(!Number.isFinite(a.angleDeg)||!Array.isArray(a.candidate)||!Array.isArray(a.vertices))return 'UNKNOWN';
  if(a.claimOptimal)return 'REJECT';
  const theta=a.angleDeg*Math.PI/180,c=Math.cos(theta),s=Math.sin(theta),xs=[],ys=[];
  for(const p of a.vertices){const x=c*p[0]-s*p[1],y=s*p[0]+c*p[1];
    if(!Number.isFinite(x)||!Number.isFinite(y))return 'UNKNOWN';xs.push(x);ys.push(y);}
  const b=[Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys)];
  return [0,2].every(j=>a.candidate[j]<=b[j]+1e-9&&a.candidate[j+1]>=b[j+1]-1e-9)?'PASS_CONTAINMENT_ONLY':'REJECT';
}
const errors=[],ids=new Set(),sourceIds=new Set(source.records.map(x=>x.id));
if(source.records.length!==5||trace.rules.length!==8||Object.keys(fixture.fieldSpecs).length!==32)errors.push('数量');
const baseline=Object.fromEntries(Object.entries(fixture.fieldSpecs).map(([k,v])=>[k,v[0]]));
for(const r of trace.rules){
  if(r.fields.length!==4||r.originalWorkPackages.join(',')!=='F1-02,F1-04,W2-05,E3-04,U4-02')errors.push(r.id+':字段/原包');
  for(const x of r.sourceIds)if(!sourceIds.has(x))errors.push(r.id+':来源');
  for(const x of r.testIds)if(!fixture.cases.find(c=>c.id===x))errors.push(r.id+':验收映射');
}
for(const c of fixture.cases){
  if(ids.has(c.id))errors.push(c.id+':重复');ids.add(c.id);
  if(judge(c.record)!==c.expected)errors.push(c.id+':判定');
  if(c.kind==='single_field_negative'){
    const changed=Object.keys(baseline).filter(k=>baseline[k]!==c.record[k]);
    if(changed.length!==1||changed[0]!==c.mutatedField||!trace.rules.find(r=>r.id===c.ruleId)?.fields.includes(c.mutatedField))errors.push(c.id+':非独立字段反例');
  }
}
for(const g of fixture.goldens)if(goldenJudge(g.record)!==g.expected)errors.push(g.id+':数学Golden');
if(fixture.cases.length!==40||fixture.goldens.length!==8)errors.push('案例计数');
console.log(JSON.stringify({result:errors.length?'FAIL':'PASS_SYNTHETIC_ONLY',positive:8,negative:32,goldens:8,errors,actualOCCT:'NOT_RUN',independentConsumer:'NOT_RUN'},null,2));
process.exitCode=errors.length?1:0;
