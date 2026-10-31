'use strict';
// 只读规划合成验收，非OCCT/FCL/NC安全认证。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const judge=function judge(x){
let a=x.v;
switch(x.rule){
case"B57-R01":return !a.exactD03||!a.exactD04||!a.exactD07||!a.exactD08||!a.frameRight?"REJECT":(!a.fullToolHolder||!a.fixtureStock?"UNKNOWN":"PASS");
case"B57-R02":{
let nums=["lengthMm","radiusMm","thetaRad","distance0Mm","distance1Mm","errorUpperMm","marginMm"];
if(nums.some(k=>typeof a[k]!=="number"||!Number.isFinite(a[k])||a[k]<0)||a.unit!=="mm")return"REJECT";
if(!a.motionBoundCertified||!a.distanceLowerBoundCertified)return"UNKNOWN";
return Math.min(a.distance0Mm,a.distance1Mm)-a.errorUpperMm-0.5*(a.lengthMm+a.radiusMm*a.thetaRad)>a.marginMm?"PASS":"UNKNOWN";}
case"B57-R03":return a.api!=="BRepExtrema_DistShapeShape"||a.isSweptClaim||a.isDoneEqualsPrecisionProof||a.innerSolution?"REJECT":(!a.isDone||!a.errorBoundCertified?"UNKNOWN":"PASS");
case"B57-R04":return a.samplesProveContinuity||a.endpointCollision?"REJECT":(!a.allIntervalsCovered||a.budgetExhausted?"UNKNOWN":"PASS");
case"B57-R05":return !a.setupD04Exact||!a.executionD10Separated||!a.d08Frozen||!a.d07OrderedState||!a.d03ToolHashExact?"REJECT":(!a.fixtureEnvelopeKnown?"UNKNOWN":"PASS");
case"B57-R06":return !a.aclAtCommit||!a.casAtCommit||!a.hashFrameScopeExact||!a.taskGenerationExact||a.cancelled||!a.ignoreLateAck||!a.immutableRollback?"REJECT":(!a.ackStateKnown?"UNKNOWN":"PASS");
case"B57-R07":return a.clPreviewCountsAsD15||a.d14FromClOnly||!a.d16BlockedOnUnknown?"REJECT":(!a.consumerProofPlanned?"UNKNOWN":"PASS");
case"B57-R08":return !a.singleBabylonEngine||!a.singleScene||!a.singleCanvas||!a.leftTaskPanel||!a.sameGuiCliAgentPort||a.maxFontPx>12||!a.previewOnly?"REJECT":(a.consumerProof==="UNKNOWN"?"UNKNOWN":"PASS");
default:return"REJECT";
}};
const f=read('docs/capabilities/CAP-07-06/continuous-link-b57-fixtures-v08.json'),t=read('research/traces/CAP-07-06-continuous-b57-v08.json'),s=read('research/sources/CAP-07-06-continuous-b57.json');
function main(){const ids=new Set(),sources=new Set(s.sources.map(x=>x.id)),ruleIds=new Set(t.rules.map(x=>x.id));
if(sources.size!==s.registeredRecords||ruleIds.size!==8)throw Error('source/rule count');
for(const r of t.rules){if(!r.sourceIds.length||!r.fields.length||!r.assets.length||!r.workPackages.length||r.sourceIds.some(x=>!sources.has(x)))throw Error('trace '+r.id);}
for(const x of f.cases){if(ids.has(x.id)||!ruleIds.has(x.ruleId)||x.input.rule!==x.ruleId)throw Error('id '+x.id);ids.add(x.id);if(judge(x.input)!==x.expected)throw Error('judge '+x.id);}
for(const r of t.rules)for(const k of ['positive','negative','unknown'])for(const id of r[k])if(!ids.has(id))throw Error('missing '+id);
if(f.summary.total!==f.cases.length||f.summary.positive!==f.cases.filter(x=>x.kind==='positive').length||f.summary.negative!==f.cases.filter(x=>x.kind==='negative').length||f.summary.unknown!==f.cases.filter(x=>x.kind==='unknown').length)throw Error('summary');
console.log(JSON.stringify({result:'PLANNING_SYNTHETIC_PASS',...f.summary,realOcct:'NOT_RUN',realMachine:'NOT_RUN'}));}
if(require.main===module)main();module.exports={judge,main};
