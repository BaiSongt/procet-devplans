'use strict';
// B39仅作只读规划合成验收；真实浏览器/辅助技术/业务Owner产品验证均未执行。
const fs=require('node:fs'),path=require('node:path');
const judge=function judge(x){
 const hash=s=>typeof s==="string"&&/^[a-f0-9]{64}$/.test(s);
 if(!["Escape","pointercancel","lostpointercapture"].includes(x["event.key"])||typeof x["event.isComposing"]!=="boolean"||typeof x["event.repeat"]!=="boolean")return "REJECT";
 if(x["ui.channels"]!=="GUI|CLI|Agent"||x["ui.port"]!=="04.EditSessionPort"||x["ui.leftPanel"]!==true||!Number.isInteger(x["ui.fontMaxPx"])||x["ui.fontMaxPx"]<1||x["ui.fontMaxPx"]>12)return "REJECT";
 if(x["render.engineCount"]!==1||x["render.sceneCount"]!==1||x["render.canvasCount"]!==1||!["PROJECT","RESOURCES"].includes(x["render.activeRoot"])||x["render.hiddenRootPickable"]!==false)return "REJECT";
 if(![x["render.sceneEpoch"],x["render.pickEpoch"],x["render.leaseEpoch"]].every(Number.isInteger)||x["render.sceneEpoch"]!==x["render.pickEpoch"]||x["render.sceneEpoch"]!==x["render.leaseEpoch"])return "STALE";
 if(x["owner.expectedRevision"]!=="D04-r11"||x["owner.actualRevision"]!==x["owner.expectedRevision"]||!hash(x["owner.expectedHash"])||x["owner.actualHash"]!==x["owner.expectedHash"]||x["owner.expectedFrame"]!=="PART"||x["owner.actualFrame"]!==x["owner.expectedFrame"]||x["owner.aclEpoch"]!==x["owner.aclNow"]||x["owner.scopeEpoch"]!==x["owner.scopeNow"]||x["owner.cancelEpoch"]!==x["owner.ackEpoch"]||x["owner.cancelled"]!==false||x["owner.lateAck"]!==false)return "STALE";
 if(x["flow.d04"]!=="D04-r11"||x["flow.d10"]!=="D10-r4"||x["flow.d13"]!=="KNOWN_SUBSET"||x["flow.d15"]!=="NOT_RUN")return "UNKNOWN";
 if(x["flow.clAsNcVerified"]!==false||x["flow.freezeBefore"]!==x["flow.freezeAfter"]||x["flow.oldReader"]!=="SHADOW_READ_ONLY"||x["flow.consumer"]!=="NOT_RUN")return "REJECT";
 if(x["edit.confirmOnDirty"]!==true||x["edit.discardWithoutConfirm"]!==false||x["edit.previewWrites"]!==false)return "REJECT";
 if(x["gesture.promotePick"]!==false)return "REJECT";
 if(x["pointer.keyboardAlt"]!==true||x["pointer.dragAlt"]!==true||!Number.isFinite(x["pointer.widthCssPx"])||!Number.isFinite(x["pointer.heightCssPx"])||x["pointer.widthCssPx"]<=0||x["pointer.heightCssPx"]<=0)return "REJECT";
 if(!["NONE","EXCEPTION_PENDING_REVIEW"].includes(x["pointer.exception"]))return "REJECT";
 if(x["pointer.widthCssPx"]<24||x["pointer.heightCssPx"]<24)return x["pointer.exception"]==="NONE"?"REJECT":"UNKNOWN";
 if(x["event.compositionStateTrusted"]!==true)return "UNKNOWN";
 if(x["event.repeat"]===true)return "REPEAT_IGNORED";
 if(x["event.key"]==="Escape"&&x["event.isComposing"]===true)return "IME_RESERVED";
 if(x["event.key"]!=="Escape"){
  if(x["gesture.captureActive"]!==true)return "UNKNOWN";
  if((x["event.key"]==="pointercancel"&&x["gesture.cancelled"]===true&&x["gesture.captureLost"]===false)||(x["event.key"]==="lostpointercapture"&&x["gesture.captureLost"]===true&&x["gesture.cancelled"]===false))return "CAPTURE_RELEASE_NO_PICK";
  return "UNKNOWN";
 }
 if(x["gesture.captureActive"]!==false||x["gesture.cancelled"]!==false||x["gesture.captureLost"]!==false)return "UNKNOWN";
 if(x["focus.modalOpen"]===true){
  if(x["focus.kind"]!=="MODAL"||x["focus.initialInside"]!==true||x["focus.restoreAnchor"]!==true||x["focus.trap"]!==true||x["focus.obscured"]!==false)return "UNKNOWN";
  return x["edit.dirty"]===true?"DIRTY_CONFIRM_REQUIRED":x["edit.dirty"]===false?"MODAL_DISMISS_NO_WRITE":"REJECT";
 }
 if(x["focus.modalOpen"]===false&&x["focus.kind"]==="TASK"&&x["focus.trap"]===false&&x["focus.obscured"]===false)
  return x["edit.dirty"]===true?"DIRTY_CONFIRM_REQUIRED":x["edit.dirty"]===false?"TASK_EXIT_NO_WRITE":"REJECT";
 return "UNKNOWN";
};
function run(root=path.join(__dirname,'..')){
 const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const fx=load("docs/work-packages/U4-05/esc-focus-b39-fixtures-v08.json"),tr=load("research/traces/U4-05-esc-focus-b39-v08.json"),sr=load("research/sources/U4-05-esc-focus-b39.json");
 const cm=new Map(fx.cases.map(c=>[c.id,c])),sm=new Set(sr.sources.map(s=>s.id));
 if(cm.size!==fx.cases.length||sm.size!==sr.sources.length)throw Error('重复验收/来源ID');
 for(const r of tr.rules){
  if(!r.sourceIds.length||!r.sourceIds.every(id=>sm.has(id)))throw Error('缺来源:'+r.id);
  if(!r.positiveIds.length||!r.negativeIds.length)throw Error('缺正反:'+r.id);
  if(!r.fields.every(f=>Object.hasOwn(fx.baseline,f)))throw Error('缺字段:'+r.id);
  for(const [ids,kind] of [[r.positiveIds,'positive'],[r.negativeIds,'negative'],[r.unknownIds,'unknown']])
   if(!ids.every(id=>cm.has(id)&&cm.get(id).kind===kind))throw Error('验收类型不一致:'+r.id);
 }
 const counts={positive:0,negative:0,unknown:0};
 for(const c of fx.cases){const got=judge({...fx.baseline,...c.patch});if(got!==c.expected)throw Error(c.id+': '+got+' !== '+c.expected);counts[c.kind]++;}
 for(const k of Object.keys(counts))if(counts[k]!==fx[k+'Count'])throw Error('数量错误:'+k);
 return {status:'PLANNING_SYNTHETIC_PASS',count:fx.cases.length,counts,actualBrowser:'NOT_RUN',product:'NOT_RUN',consumers:'NOT_RUN'};
}
if(require.main===module){try{console.log(JSON.stringify(run()));}catch(e){console.error(e.stack||e.message);process.exitCode=1;}}
module.exports={judge,run};
