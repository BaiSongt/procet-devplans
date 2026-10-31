#!/usr/bin/env node
// CAP-04-03 B21单侧接触/规划证据只读校验，合成阈值不是生产公差。
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const validate=function validate(x){
 const errors=[],finite=z=>typeof z==="number"&&Number.isFinite(z), exact=s=>typeof s==="string"&&/^D0[13]\.[A-Za-z]+@sha256:[a-f0-9]{64}$/.test(s);
 if(!exact(x.cadExactRef)||!exact(x.fixtureExactRef)||!exact(x.datumExactRef)||x.contactFrame!=="D04.Setup@rev12"||x.normalPolarity!=="gap_nonnegative"||x.normalsQualified!==true)errors.push("B21-R01_EXACT_NORMAL");
 const validRows=Array.isArray(x.contactRows)&&x.contactRows.length===6&&x.contactRows.every(row=>Array.isArray(row)&&row.length===6&&row.every(finite));
 let computedRank=-1;
 if(validRows){const a=x.contactRows.map(row=>row.slice());let r=0;for(let c=0;c<6&&r<6;c++){let p=r;for(let i=r+1;i<6;i++)if(Math.abs(a[i][c])>Math.abs(a[p][c]))p=i;if(Math.abs(a[p][c])<=1e-9)continue;[a[p],a[r]]=[a[r],a[p]];let div=a[r][c];for(let j=c;j<6;j++)a[r][j]/=div;for(let i=r+1;i<6;i++){let v=a[i][c];for(let j=c;j<6;j++)a[i][j]-=v*a[r][j];}r++;}computedRank=r;}
 if(!validRows||computedRank!==6||x.rankDeclared!==computedRank)errors.push("B21-R02_RANK");
 if(validRows&&computedRank===6){
  const v=x.escapeTwist,ok=Array.isArray(v)&&v.length===6&&v.every(finite);
  let dots=ok?x.contactRows.map(row=>row.reduce((s,a,i)=>s+a*v[i],0)):[];
  if(!ok||Math.hypot(...v)<=1e-9||!dots.every(d=>d>=-1e-9)||!dots.some(d=>d>1e-9)||x.escapeStatus!=="found"||x.formClosureStatus!=="not_proven")errors.push("B21-R03_UNILATERAL");
 }
 if(x.clampEvidenceState!=="not_assessed"||x.physicalStability!=="unknown"||x.forceClosureStatus!=="unknown")errors.push("B21-R04_FORCE_UNKNOWN");
 if(x.engineCount!==1||x.sceneCount!==1||x.canvasCount!==1||x.leftTaskPanelCount!==1||x.previewOnly!==true||!Array.isArray(x.entryOwnerPorts)||x.entryOwnerPorts.length!==3||!x.entryOwnerPorts.every(v=>v==="D04.OwnerPort"))errors.push("B21-R05_ONE_PORT");
 if(x.scopeEpoch!==12||x.responseScopeEpoch!==x.scopeEpoch||x.expectedRevision!=="D04@rev12"||x.currentRevision!==x.expectedRevision||x.permissionEpoch!==7||x.responsePermissionEpoch!==x.permissionEpoch||x.permissionCurrent!==true||x.cancelled!==false||x.lateAckApplied!==false)errors.push("B21-R06_CAS_ACK");
 if(x.d10BindingChanged!==false||x.clAnimationUsedAsNcEvidence!==false||x.ncExecutionSemantics!=="unknown"||x.d16Release!=="blocked"||x.frozenBaselineOverwritten!==false)errors.push("B21-R07_EXECUTION");
 return errors;
};
const fixturePath=process.argv[2]||path.join(__dirname,"../docs/capabilities/CAP-04-03/unilateral-b21-fixtures-v08.json");
const tracePath=process.argv[3]||path.join(__dirname,"../research/traces/CAP-04-03-unilateral-b21-v08.json");
const fx=JSON.parse(fs.readFileSync(fixturePath,"utf8"));
const tr=JSON.parse(fs.readFileSync(tracePath,"utf8"));
const ids=new Set(),rules=new Set(tr.rules.map(r=>r.id)),sourceIds=new Set(tr.sources.map(s=>s.id));
let ok=0;const failures=[];
for(const c of fx.cases){
 if(ids.has(c.id))failures.push("DUPLICATE_CASE:"+c.id);ids.add(c.id);
 if(c.ruleId!=="ALL"&&!rules.has(c.ruleId))failures.push("UNKNOWN_RULE:"+c.id);
 const input=JSON.parse(JSON.stringify(fx.baseline));
 for(const p of c.patches){if(!Object.prototype.hasOwnProperty.call(input,p.field))failures.push("UNKNOWN_FIELD:"+c.id+":"+p.field);input[p.field]=p.value;}
 const observed=validate(input).sort(),wanted=[...c.expectedCodes].sort();
 if(JSON.stringify(observed)!==JSON.stringify(wanted))failures.push("MISMATCH:"+c.id+":"+observed+" expected "+wanted);else ok++;
}
for(const r of tr.rules){
 if(!r.sourceIds.every(id=>sourceIds.has(id)))failures.push("UNDEFINED_SOURCE:"+r.id);
 if(!r.acceptanceCaseIds.every(id=>ids.has(id)))failures.push("UNDEFINED_CASE:"+r.id);
 if(!r.acceptanceCaseIds.some(id=>id.startsWith("B21-P"))||!r.acceptanceCaseIds.some(id=>id.startsWith("B21-N")))failures.push("MISSING_POLARITY:"+r.id);
}
console.log(JSON.stringify({classification:"SYNTHETIC_PLANNING_ONLY",passed:ok,total:fx.cases.length,failures,productAcceptance:"NOT_RUN",humanApproval:"PENDING_L3"}));
if(failures.length)process.exitCode=1;
