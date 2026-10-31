'use strict';
// 仅规划合成检验；不读取真实机床或NC，不能作为D15认证。
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..');const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const judge=function judge(x){
 const v=x.v,requirements={
 "B58-R01":["finalNcHashExact","controllerProfileExact","d13BlockByteSpan","modalBeforeAfter","d13OnlyExecutionEvents"],
 "B58-R02":["g61VisitsPoint","g611StopsPerBlock","collinearG61MayContinue","g61G611Distinct","modalStateRecorded"],
 "B58-R03":["noPNotFiniteBound","p0NotFiniteBound","pPositiveRequiredForFiniteMode","qZeroDisablesNaiveCam","qNotSameAsP"],
 "B58-R04":["activeUnitsPinned","g20InchesConverted","g21MillimetersRetained","pqBlockUnitRecorded","noUnitlessTolerance"],
 "B58-R05":["trajIniHashPinned","velocityAccelPinned","physicalJointLimitsPinned","lookaheadConfigurationPinned","d04NotD10"],
 "B58-R06":["d14ConsumesD13","jointTimeNotVertexLinear","physicalJointIdsPinned","plannerGapUnknown","clPlaybackNotD14"],
 "B58-R07":["pNotPhysicalProof","d15Independent","endpointsNotContinuousProof","noMaterialSweptClaim","fullToolHolderGeometry"],
 "B58-R08":["singleBabylonWorld","leftTaskPanel","guiCliAgentSameOwner","aclCasCommitRechecked","cancelLateAckRejected","frozenD08Untouched","d16UnknownBlocksRelease","migrationRollback"]
 };
 const known={"B58-R01":"interpreterInitializationKnown","B58-R02":"controllerExactProfileKnown","B58-R03":"g64DialectQualified","B58-R04":"precedingUnitModeKnown","B58-R05":"oemMachineProfileVerified","B58-R06":"timingSolverValidated","B58-R07":"independentDeviationBoundCertified","B58-R08":"independentConsumerReceipt"};
 if(!requirements[x.rule]||requirements[x.rule].some(k=>v[k]!==true))return "REJECT";
 if(x.rule==="B58-R07"){
  if(["clearanceMm","deviationUpperMm","geomUpperMm"].some(k=>typeof v[k]!=="number"||!Number.isFinite(v[k])||v[k]<0))return "REJECT";
  if(v.independentDeviationBoundCertified!==true||v.continuousCoverageCertified!==true)return "UNKNOWN";
  return v.clearanceMm>v.deviationUpperMm+v.geomUpperMm?"PASS":"UNKNOWN";
 }
 return v[known[x.rule]]===true?"PASS":"UNKNOWN";
};
function main(){const s=read('research/sources/CAP-09-06-trajectory-modes-b58.json'),t=read('research/traces/CAP-09-06-trajectory-modes-b58-v08.json'),f=read('docs/capabilities/CAP-09-06/trajectory-modes-b58-fixtures-v08.json');const si=new Set(s.sources.map(x=>x.id)),ri=new Set(t.rules.map(x=>x.id)),ci=new Set();if(si.size!==s.registeredRecords||ri.size!==8)throw Error('sources/rules');let n=0;for(const c of f.cases){if(ci.has(c.id)||!ri.has(c.ruleId)||c.input.rule!==c.ruleId||judge(c.input)!==c.expected)throw Error('case '+c.id);ci.add(c.id);n++;}for(const r of t.rules){if(!r.fields.length||!r.sourceIds.length||!r.workPackages.length||r.sourceIds.some(x=>!si.has(x)))throw Error('trace '+r.id);for(const k of ['positive','negative','unknown'])for(const id of r[k])if(!ci.has(id))throw Error('unlinked '+id);}for(const k of ['positive','negative','unknown'])if(f.summary[k]!==f.cases.filter(x=>x.kind===k).length)throw Error('summary '+k);if(n!==f.summary.total)throw Error('count');console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_PASS',...f.summary,product:'NOT_RUN'}));}
if(require.main===module)main();module.exports={judge,main};
