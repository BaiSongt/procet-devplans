#!/usr/bin/env node
'use strict';
// B81只读单轴Z补偿规划合成，不是控制器解释器、实际运动或安全验证。
const fs=require('node:fs'), path=require('node:path');
const data=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../docs/capabilities/CAP-09-04/tool-length-modal-b81-fixtures-v08.json'),'utf8'));
const num=n=>typeof n==='number'&&Number.isFinite(n), str=s=>typeof s==='string'&&s.length>0;
const ans=(status,offsetZ=null,reason='')=>({status,offsetZ,reason});
function judge(x){
 const e=x.evidence||{},a=x.action||{};
 const keys=['d03Hash','d10Hash','d12Hash','toolTableHash','gaugeFrame','frame','unit','scope','controllerSoftware','interpreterBuild'];
 if(keys.some(k=>!str(e[k]))||!num(e.gaugeMeasuredZ))return ans('UNKNOWN',null,'missing_exact_evidence');
 if(!e.d10Revision||!e.d03Revision||!e.d12Revision||!e.toolTableRevision)return ans('UNKNOWN',null,'missing_revision');
 if(e.scope!==e.authorizedScope||(e.readOnlyAgent===false&&e.actor==='agent_unapproved'))return ans('REJECT',null,'scope_or_agent');
 if(e.cancelled||!e.aclAtCommit||!e.d15Independent||e.d16AutoPublish||e.executionWithoutApproval)return ans('REJECT',null,'permission_or_safety');
 if(e.d10Revision!==e.expectedD10Revision||e.d03Revision!==e.expectedD03Revision||e.d12Revision!==e.expectedD12Revision||
  e.toolTableRevision!==e.expectedToolTableRevision||e.d12Hash!==e.expectedD12Hash||e.toolTableHash!==e.expectedToolTableHash||
  e.scopeEpoch!==e.expectedScopeEpoch||e.generation!==e.expectedGeneration||e.cancelEpoch!==e.expectedCancelEpoch)
  return ans('STALE',null,'revision_epoch_hash');
 if(e.frame!=='machine'||e.unit!=='mm'||e.gaugeFrame!=='spindle_gauge')return ans('UNKNOWN',null,'frame_not_qualified');
 if(e.controllerSoftware==='linuxcnc-2.9'&&e.interpreterBuild==='linuxcnc-2.9-profile'){
  let value;
  if(a.op==='G49')value=0;
  else if(a.op==='G43'){
   if(a.h!==undefined&&(!Number.isInteger(a.h)||a.h<0))return ans('REJECT',null,'invalid_h');
   let n=a.h===undefined?e.loadedTool:a.h;
   if(n===0&&e.changer==='nonrandom')n=e.loadedTool;
   if(n===0&&e.changer!=='random'&&e.changer!=='nonrandom')return ans('UNKNOWN',null,'changer_unknown');
   if(!Number.isInteger(n)||n<0||!num(e.toolTable?.[n]))return ans('UNKNOWN',null,'table_unresolved');
   value=e.toolTable[n];
  }else if(a.op==='G43.1'){
   if(a.sameBlockMotion||a.h!==undefined)return ans('REJECT',null,'motion_or_h_same_block');
   if(!num(a.z))return ans('UNKNOWN',null,'dynamic_axis_unresolved');
   value=a.z;
  }else if(a.op==='G43.2'){
   if((a.h!==undefined&&a.z!==undefined)||(a.h===undefined&&a.z===undefined))return ans('REJECT',null,'invalid_additional_words');
   if(!num(e.currentAppliedZ))return ans('UNKNOWN',null,'prior_modal_unknown');
   if(a.h!==undefined){
    if(!Number.isInteger(a.h)||a.h<0)return ans('REJECT',null,'invalid_h');
    if(!num(e.toolTable?.[a.h]))return ans('UNKNOWN',null,'table_unresolved');
    value=e.currentAppliedZ+e.toolTable[a.h];
   }else{
    if(!num(a.z))return ans('UNKNOWN',null,'axis_unresolved');
    value=e.currentAppliedZ+a.z;
   }
  }else return ans('UNKNOWN',null,'unmodeled_linuxcnc_command');
  return ans(e.intent==='preview'?'READ_ONLY':'CANDIDATE_ONLY',Number(value.toFixed(8)),'synthetic_modal_only');
 }
 if(e.controllerSoftware==='haas-ngc-100.21.000.1100'&&e.interpreterBuild==='haas-ngc-versioned-profile'){
  if(!e.startupOffsetObserved)return ans('UNKNOWN',null,'persistent_ngc_modal_unobserved');
  if(a.op==='G49')return ans(e.intent==='preview'?'READ_ONLY':'CANDIDATE_ONLY',0,'synthetic_modal_only');
  if(a.op!=='G43')return ans('UNKNOWN',null,'haas_mode_not_modeled');
  if(!Number.isInteger(a.h)||a.h<=0)return ans('REJECT',null,'haas_h_required');
  if(!num(e.toolTable?.[a.h]))return ans('UNKNOWN',null,'haas_offset_unresolved');
  return ans(e.intent==='preview'?'READ_ONLY':'CANDIDATE_ONLY',e.toolTable[a.h],'synthetic_modal_only');
 }
 return ans('UNKNOWN',null,'controller_profile_not_verified');
}
function merge(a,b){
 if(!b||typeof b!=='object'||Array.isArray(b))return b;
 const out={...a};
 for(const [k,v] of Object.entries(b))
  out[k]=k==='action'&&v&&typeof v==='object'?{...v}:
   v&&typeof v==='object'&&!Array.isArray(v)?merge(out[k]||{},v):v;
 return out;
}
const ids=new Set(),failed=[],counts={};
for(const c of data.cases){
 if(ids.has(c.id))throw Error('重复case ID:'+c.id);ids.add(c.id);
 const actual=judge(merge(data.base,c.patch));
 counts[actual.status]=(counts[actual.status]||0)+1;
 if(actual.status!==c.expect||('offsetZ' in c&&(actual.offsetZ===null||Math.abs(actual.offsetZ-c.offsetZ)>1e-8)))
  failed.push({id:c.id,expect:c.expect,expectedOffset:c.offsetZ,actual});
}
if(data.cases.length!==32||ids.size!==32)throw Error('B81必须32项不同ID');
console.log(JSON.stringify({scope:'PLANNING_SYNTHETIC_SAME_JUDGE_ONLY',cases:ids.size,counts,failed,
 independentNodeProcess:true,realController:'NOT_RUN',d13d14d15d16:'NOT_RUN',
 ownerSigned:'0/17',consumerPass:'0/17',L3:'PENDING_HUMAN'}));
if(failed.length)process.exitCode=1;
