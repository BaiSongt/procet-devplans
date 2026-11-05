'use strict';
// B52：只读合成验收，单位与相关不确定度验算；不进行产品测量认证。
const fs = require('node:fs');
const path = require('node:path');
const judge = function judge(x){
 const reject=code=>({status:"REJECTED",code}), unknown=code=>({status:"UNKNOWN",code});
 const i=x.identity,m=x.measurement,d=x.decision,b=x.bindings,g=x.governance;
 if(i.owner!=="D17"||i.capability!=="CAP-02-06")return reject("OWNER_TYPE");
 if(typeof i.resourceRef!=="string"||!/^D03:[^@]+@r[0-9]+$/.test(i.resourceRef)||typeof i.resourceHash!=="string"||!/^sha256:[0-9a-f]{64}$/.test(i.resourceHash))return reject("RESOURCE_EXACT");
 if(i.calibrationResourceRef!==i.resourceRef||typeof i.calibrationHash!=="string"||!/^sha256:[0-9a-f]{64}$/.test(i.calibrationHash))return reject("CALIBRATION_IDENTITY");
 if(typeof i.measurandRef!=="string"||!i.measurandRef.startsWith("D01:")||typeof i.frameRef!=="string"||!i.frameRef.startsWith("FRAME:")||typeof i.method!=="string"||!i.method)return reject("MEASURAND_METHOD_FRAME");
 if(i.traceabilityChainRef==null||i.traceabilityChainRef==="UNKNOWN")return unknown("TRACEABILITY_UNKNOWN");
 if(i.calibrationScope==null||i.calibrationScope==="UNKNOWN")return unknown("CAL_SCOPE_UNKNOWN");
 if(i.calibrationScope!=="length")return reject("CAL_SCOPE_MISMATCH");
 if(i.calibrationValidUntil==null)return unknown("CAL_VALIDITY_UNKNOWN");
 if(!/^\d{4}-\d\d-\d\dT/.test(i.sampleAt)||! /^\d{4}-\d\d-\d\dT/.test(i.calibrationValidFrom)||! /^\d{4}-\d\d-\d\dT/.test(i.calibrationValidUntil)|| i.sampleAt<i.calibrationValidFrom || i.sampleAt>i.calibrationValidUntil)return reject("CAL_TIME_SCOPE");
 if(typeof b.d04Ref!=="string"||!b.d04Ref.startsWith("D04:")||typeof b.d10Ref!=="string"||!b.d10Ref.startsWith("D10:")||b.d04Ref===b.d10Ref)return reject("D04_D10_TYPES");
 if(b.d15State!=="NOT_RUN"||b.d16State!=="BLOCKED")return reject("ENGINEERING_CLAIM");
 if(g.ownerPort!=="MeasurementEvidencePort"||!["GUI","CLI","Agent"].includes(g.entry)||g.sceneCount!==1||g.taskPanel!=="LEFT_UNIFIED")return reject("SINGLE_ENTRY_GUI");
 if(g.permissionFresh!==true||g.aclScope!=="measurement_write")return reject("AUTH_RECHECK");
 if(g.expectedRevision!==g.actualRevision||g.expectedHash!==g.actualHash||g.actualHash!==i.resourceHash)return reject("CAS_EXACT");
 if(g.scopeEpoch!==g.ackScopeEpoch||g.cancelGeneration!==g.ackCancelGeneration||g.frozenOverwrite===true)return reject("LATE_ACK_FREEZE");
 if(g.previewOnly===true&&g.commitRequested===true)return reject("PREVIEW_WRITE");
 if(!["mm","um"].includes(m.unit)||!Number.isFinite(m.value))return reject("MEASUREMENT_UNIT");
 if(m.u1==null||m.u2==null||m.cov12==null)return unknown("UNCERTAINTY_MISSING");
 if(!Number.isFinite(m.u1)||!Number.isFinite(m.u2)||m.u1<0||m.u2<0)return reject("UNCERTAINTY_DOMAIN");
 if(!Number.isFinite(m.cov12)||Math.abs(m.cov12)>m.u1*m.u2+1e-14)return reject("COVARIANCE_PSD");
 if(!Number.isFinite(m.coverageFactor)||m.coverageFactor<1||m.coverageFactor>5)return reject("COVERAGE_FACTOR");
 const scale=m.unit==="um"?0.001:1;
 const v=m.value*scale,rad=m.u1*m.u1+m.u2*m.u2+2*m.cov12;
 if(rad< -1e-14)return reject("NEGATIVE_VARIANCE");
 const ucmm=Math.sqrt(Math.max(0,rad))*scale, U=ucmm*m.coverageFactor;
 if(!Number.isFinite(m.reportedUc)||Math.abs(m.reportedUc*scale-ucmm)>1e-8)return reject("UC_REPORT_MISMATCH");
 if(!Number.isFinite(m.reportedU)||Math.abs(m.reportedU*scale-U)>1e-8)return reject("U_REPORT_MISMATCH");
 if(d.ruleId==null||d.ruleId==="UNKNOWN")return unknown("DECISION_RULE_UNKNOWN");
 if(d.ruleId!=="PROCET-GUARD-U@R1"||typeof d.ruleHash!=="string"||!/^sha256:[0-9a-f]{64}$/.test(d.ruleHash)||!Number.isFinite(d.upperLimitMm))return reject("DECISION_RULE_ID");
 if(b.channel==="in_machine_probe"&&b.d13State!=="VERIFIED")return unknown("CONTROLLER_SEMANTIC_UNKNOWN");
 if(b.channel!=="offline_cmm"&&b.channel!=="in_machine_probe")return reject("CHANNEL_UNKNOWN");
 if(b.channel==="offline_cmm"&&b.d13State!=="NOT_APPLICABLE")return reject("NC_BOUNDARY");
 const outcome=v+U<=d.upperLimitMm+1e-12?"CONFORMING_CANDIDATE":v-U>d.upperLimitMm+1e-12?"NONCONFORMING_CANDIDATE":"INDETERMINATE";
 if(d.reportedOutcome!==outcome)return reject("OUTCOME_MISMATCH");
 return {status:outcome,code:"MEASUREMENT_CANDIDATE",ucMm:ucmm,expandedUMm:U};
};
const setPath = function setPath(obj,path,value){const s=path.split(".");let p=obj;for(let j=0;j<s.length-1;j++)p=p[s[j]];p[s[s.length-1]]=value;};
function run(fixture){
  const details=fixture.cases.map(c=>{
    const input=JSON.parse(JSON.stringify(fixture.baseline));
    for(const [p,v] of Object.entries(c.patch))setPath(input,p,v);
    const observed=judge(input);
    return {id:c.id,kind:c.kind,ok:observed.status===c.expected.status&&observed.code===c.expected.code,observed,expected:c.expected};
  });
  return {total:details.length,pass:details.filter(x=>x.ok).length,failed:details.filter(x=>!x.ok).length,details};
}
if(require.main===module){
  const input=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/capabilities/CAP-02-06/covariance-b52-fixtures-v08.json'),'utf8'));
  const report=run(input);
  console.log(JSON.stringify({total:report.total,pass:report.pass,failed:report.details.filter(x=>!x.ok).map(x=>x.id)},null,2));
  if(report.pass!==report.total)process.exitCode=1;
}
module.exports={judge,run};
