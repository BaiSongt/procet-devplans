"use strict";
// CAP-09-03 B53只读规划合成检查；不运行任何机床操作。
const fs=require("node:fs");
const path=require("node:path");
const fx=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../docs/capabilities/CAP-09-03/homing-b53-fixtures-v08.json"),"utf8"));
function judge(x){
 const out=(status,rule,reason)=>({status,rule,reason,product:"NOT_RUN"});
 const txt=s=>typeof s==="string"&&!!s&&s!=="UNKNOWN";
 const num=n=>typeof n==="number"&&Number.isFinite(n);
 const r=x?.refs;
 if(!r?.d03||!r?.d04||!r?.d10||!r?.controller)return out("UNKNOWN","B53-R01","missing_exact_refs");
 for(const k of ["d03","d10"]){if(["id","rev","hash","owner"].some(f=>!txt(r[k][f])))return out("UNKNOWN","B53-R01","missing_exact_id_revision_hash")}
 if(r.d03.owner!=="02"||r.d10.owner!=="04"||r.d03.frame!=="MACHINE"||r.d10.frame!=="MACHINE"||r.d04.role!=="NOMINAL_SETUP")return out("REJECT","B53-R01","frame_or_owner_conflated");
 if(!txt(r.controller.version)||!txt(r.controller.hash))return out("UNKNOWN","B53-R01","controller_version_unknown");
 if(r.controller.dialect!=="LinuxCNC"||r.controller.version!=="2.9")return out("UNKNOWN","B53-R01","controller_outside_verified_dialect");
 const m=x.mapping,j=x.joints;
 if(!m||!Array.isArray(m.jointIds)||!Array.isArray(j))return out("UNKNOWN","B53-R02","missing_joint_map");
 if(m.axis!=="Y"||m.coupled!==true||m.jointCount!==2||m.jointIds.length!==2||new Set(m.jointIds).size!==2||j.length!==2||new Set(j.map(v=>v.id)).size!==2||j.some(v=>v.axis!==m.axis||!m.jointIds.includes(v.id)))return out("REJECT","B53-R02","physical_joint_collapsed");
 if(j.some(v=>v.homed!==true||!txt(v.epoch))||j[0].epoch!==j[1].epoch)return out("UNKNOWN","B53-R02","joint_home_epoch_incomplete");
 for(const v of j){
   if(![v.offset,v.latchCoordinate,v.home,v.nominalDifference].every(num))return out("UNKNOWN","B53-R03","unknown_home_reference");
   if(Math.abs(v.offset-v.latchCoordinate)>1e-9||Math.abs(v.home-v.offset-v.nominalDifference)>1e-9)return out("REJECT","B53-R03","home_offset_not_home");
 }
 const h=x.home;
 if(!h||typeof h.syncFinal!=="boolean"||j.some(v=>!Number.isInteger(v.sequence)))return out("UNKNOWN","B53-R04","unknown_homing_sequence");
 if(!h.syncFinal||j.some(v=>v.sequence!==-1))return out("REJECT","B53-R04","gantry_final_not_synchronized");
 if(!txt(h.mode)||!num(h.search)||!num(h.latch)||typeof h.useIndex!=="boolean")return out("UNKNOWN","B53-R05","homing_parameters_unknown");
 const allowed=(h.mode==="SWITCH_INDEX"&&h.search!==0&&h.latch!==0&&h.useIndex)||
 (h.mode==="INDEX_ONLY"&&h.search===0&&h.latch!==0&&h.useIndex)||
 (h.mode==="SWITCH_ONLY"&&h.search!==0&&h.latch!==0&&!h.useIndex);
 if(!allowed)return out("REJECT","B53-R05","homing_mode_inconsistent");
 if(h.useIndex&&h.indexWired!==true)return out("UNKNOWN","B53-R05","encoder_index_hal_unknown");
 if(h.evidence!=="SYNTHETIC")return out("UNKNOWN","B53-R05","real_homing_not_tested");
 for(const v of j){
   if(typeof v.volatile!=="boolean"||typeof v.powerLost!=="boolean"||typeof v.estop!=="boolean")return out("UNKNOWN","B53-R06","volatile_status_unknown");
   if((v.powerLost||v.estop)&&v.volatile)return out("REJECT","B53-R06","home_invalidated_after_reset");
   if(v.powerLost||v.estop)return out("UNKNOWN","B53-R06","reset_requires_fresh_proof");
 }
 for(const v of j){
   if(![v.min,v.max,v.current].every(num))return out("UNKNOWN","B53-R07","joint_soft_limit_unknown");
   if(v.min>=v.max||v.current<v.min||v.current>v.max||v.home<v.min||v.home>v.max)return out("REJECT","B53-R07","physical_joint_limit_violation");
 }
 const w=x.write,n=x.nc;
 if(!w||!n||!txt(w.owner))return out("UNKNOWN","B53-R08","domain_command_unknown");
 if(w.owner!=="InverseKinematicsPort"||["acl","casRevision","casHash","scope","generation","cancelFence","freezePreserved","previewOnly"].some(k=>w[k]!==true))return out("REJECT","B53-R08","cas_or_cancel_or_freeze_bypass");
 if(n.finalNc!==false||n.d13!=="UNKNOWN"||n.d14!=="NOT_RUN"||n.d15!=="NOT_RUN"||n.d16!=="BLOCKED"||n.clAsProof!==false)return out("REJECT","B53-R08","nc_verification_promoted");
 return out("PLANNING_VALID",null,"synthetic_only_real_machine_unknown");
}
function apply(base,changes){let o=JSON.parse(JSON.stringify(base));for(const [p,v] of changes){let keys=p.split("."),q=o;for(const k of keys.slice(0,-1))q=q[k];q[keys.at(-1)]=v;}return o}
let pass=0;const failed=[];
for(const c of fx.cases){const actual=judge(apply(fx.base,c.changes));if(actual.status===c.expected&&actual.rule===c.rule)pass++;else failed.push({id:c.id,expected:c.expected,rule:c.rule,actual});}
console.log(JSON.stringify({kind:"PLANNING_SYNTHETIC_ONLY",pass,total:fx.cases.length,failed,product:"NOT_RUN"},null,2));
if(failed.length)process.exitCode=1;
