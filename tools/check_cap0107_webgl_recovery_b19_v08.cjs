#!/usr/bin/env node
'use strict';
// CAP-01-07 B19：仅读规划合成证据；不连接产品仓、不修改业务数据。
const fs=require('node:fs');
const path=require('node:path');
function validate(s){
 const err=[];
 function check(ok,code){if(!ok)err.push(code)}
 check(s.engineCount===1 && s.sceneCount===1 && s.canvasCount===1 && s.leftTaskPanelCount===1 && s.inactiveRootPickable===false,"R01_SINGLE_WORLD");
 check(s.contextLostEventHandled===true && s.lossDefaultPrevented===true && s.renderSuspendedDuringLoss===true,"R02_LOSS_SUSPEND");
 check(s.restoreEventSeen===true && s.resourcesRecreated===true && s.gpuResourceEpoch===s.gpuEpoch,"R03_RESTORE_EPOCH");
 check(s.pickGpuEpoch===s.gpuEpoch && s.selectionSceneRevision===s.currentSceneRevision && s.selectedExactRef===s.sourceExactRef,"R04_PICK_STALE");
 check(s.receiptScopeEpoch===s.scopeEpoch && s.receiptPermissionEpoch===s.permissionEpoch && s.currentOwnerRevision===s.expectedOwnerRevision,"R05_CAS_PERMISSION");
 check(s.previewGpuEpoch===s.gpuEpoch && s.previewScopeEpoch===s.scopeEpoch && s.lateCancelledAckApplied===false,"R06_PREVIEW_CANCEL");
 check(s.rendererDomainWrite===false && s.businessRevisionBefore===s.businessRevisionAfter && Array.isArray(s.consumerPorts) && s.consumerPorts.length===3 && s.consumerPorts.every(p=>p==="D04.OwnerPort"),"R07_DOMAIN_ISOLATION");
 check(["unknown","validated"].includes(s.ncSemanticStatus) && (s.ncSemanticStatus!=="unknown" || (s.ncVerificationStatus==="unknown" && s.releaseStatus==="blocked")),"R08_NC_FAIL_CLOSED");
 return err;
}
function runFixtures(f){
 let passed=0, failures=[];
 for(const c of f.cases){
  const state=JSON.parse(JSON.stringify(f.baseline));
  if(c.field!=="(baseline)")state[c.field]=c.value;
  const actual=validate(state);
  if(JSON.stringify([...actual].sort())!==JSON.stringify([...c.expectedCodes].sort()))failures.push({id:c.id,expected:c.expectedCodes,actual});
  else passed++;
 }
 return {passed,total:f.cases.length,failures};
}
function main(){
 const arg=process.argv;
 const defaultFile=path.resolve(__dirname,'../docs/capabilities/CAP-01-07/webgl-recovery-b19-fixtures-v08.json');
 const file=arg.includes('--fixtures')?arg[arg.indexOf('--fixtures')+1]:defaultFile;
 if(!file||(!arg.includes('--self-test')&&!arg.includes('--fixtures'))){
  process.stderr.write('用法：node tools/check_cap0107_webgl_recovery_b19_v08.cjs --self-test [--fixtures path]\n');process.exitCode=2;return;
 }
 const fixtures=JSON.parse(fs.readFileSync(file,'utf8'));
 if(fixtures.schemaVersion!=='procet-cap0107-webgl-recovery-b19-fixtures-v08')throw Error('不支持的fixture schema');
 const result=runFixtures(fixtures);
 process.stdout.write(JSON.stringify({nature:'SYNTHETIC_ONLY',...result},null,2)+'\n');
 if(result.failures.length)process.exitCode=1;
}
if(require.main===module)main();
module.exports={validate,runFixtures};
