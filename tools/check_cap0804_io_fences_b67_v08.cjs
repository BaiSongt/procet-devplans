'use strict';
// B67规划独立可执行只读校验器。无真实机床/产品调用，绝非D15放行工具。
const fs=require('node:fs');const path=require('node:path');
const judge=function judge(x){
 const out=(status,reason,events=[])=>({status,reason,events});
 if(!x?.owner||!x?.source||!x?.binding||!x?.program||!x?.evidence||!x?.ui)return out("REJECT","SCHEMA");
 const o=x.owner,s=x.source,b=x.binding,p=x.program,e=x.evidence,u=x.ui;
 if(o.port!=="D13.AuxIoDomainPort"||o.actor!=="planner"||!o.canRead||!o.canWrite)return out("REJECT","AUTH_OR_PORT");
 if(!["GUI","CLI","Agent"].includes(u.entry)||!u.sharedPort||!u.singleBabylon||!u.leftTaskPanel)return out("REJECT","UI_BOUNDARY");
 if(s.d10AsSetup||s.freezeRewrite||e.requestPublish)return out("REJECT","DOMAIN_OR_RELEASE_BOUNDARY");
 if(o.cancelled||o.generation!==o.ackGeneration||o.aclEpoch!==o.currentAclEpoch||o.scopeEpoch!==o.currentScopeEpoch)return out("STALE","CANCEL_OR_PERMISSION_FENCE");
 if(s.d04Expected!==s.d04Current||s.d10Expected!==s.d10Current||s.ncExpected!==s.ncCurrent||s.profileExpected!==s.profileCurrent||s.frameExpected!==s.frameCurrent)return out("STALE","EXACT_SOURCE_CHANGED");
 if(b.dialect!=="LinuxCNC-2.9"||!b.optionHashExact)return out("UNKNOWN","DIALECT_OR_OPTION_UNKNOWN");
 if(!b.halWiringVerified)return out("UNKNOWN","HAL_WIRING_UNVERIFIED");
 if(!p.reparsedFinalNc)return out("REJECT","FINAL_NC_NOT_REPARSED");
 if(e.claimDeviceComplete)return out("REJECT","NO_PHANTOM_DEVICE_ACK");
 if(!e.sourceLineMap)return out("REJECT","SOURCE_LINE_UNMAPPED");
 if(!e.exactInvalidation||!e.rollbackPreserved)return out("UNKNOWN","INVALIDATION_OR_ROLLBACK_UNKNOWN");
 if(p.legacyUnmapped)return out("UNKNOWN","LEGACY_UNRESOLVED");
 if(!Array.isArray(p.blocks)||!Array.isArray(p.expectedEvents)||!p.blocks.length)return out("REJECT","PROGRAM_SCHEMA");
 const pending=new Map(),events=[];
 const bounds=(z)=>Number.isInteger(z)&&z>=0;
 for(const blk of p.blocks){
  const m=blk.op;
  if(!blk.id||typeof m!=="string")return out("REJECT","BLOCK_SCHEMA");
  if(["G0","G1","G2","G3"].includes(m)){
   if(!blk.motionId)return out("UNKNOWN","MOTION_ID_UNKNOWN");
   for(const ev of pending.values())events.push({...ev,type:"QUEUED_AT_MOTION",anchor:blk.motionId});
   pending.clear();continue;
  }
  if(["M62","M63","M64","M65"].includes(m)){
   if(!bounds(blk.P)||blk.P>=b.digitalOutCount)return out("REJECT","DIGITAL_CHANNEL_RANGE");
   const val=(m==="M62"||m==="M64")?1:0;
   const ev={kind:"DO",index:blk.P,value:val};
   if(m==="M62"||m==="M63")pending.set("DO:"+blk.P,ev);
   else events.push({...ev,type:"IMMEDIATE_BREAKS_BLENDING",anchor:null});
   continue;
  }
  if(m==="M67"||m==="M68"){
   if(!bounds(blk.E)||blk.E>=b.analogOutCount||typeof blk.Q!=="number"||!Number.isFinite(blk.Q))return out("REJECT","ANALOG_CHANNEL_OR_VALUE");
   const ev={kind:"AO",index:blk.E,value:blk.Q};
   if(m==="M67")pending.set("AO:"+blk.E,ev);
   else events.push({...ev,type:"IMMEDIATE_BREAKS_BLENDING",anchor:null});
   continue;
  }
  if(m==="M66"){
   const hasP=Object.prototype.hasOwnProperty.call(blk,"P"),hasE=Object.prototype.hasOwnProperty.call(blk,"E");
   if(hasP===hasE)return out("REJECT","INPUT_SELECTOR");
   const k=hasP?"DI":"AI",idx=hasP?blk.P:blk.E,limit=hasP?b.digitalInCount:b.analogInCount;
   if(!bounds(idx)||idx>=limit)return out("REJECT","INPUT_CHANNEL_RANGE");
   if(!Number.isInteger(blk.L)||blk.L<0||blk.L>4||(!hasP&&blk.L!==0))return out("REJECT","INPUT_WAIT_MODE");
   if(blk.L!==0&&(!(typeof blk.Q==="number")||!Number.isFinite(blk.Q)||blk.Q<=0))return out("REJECT","INPUT_TIMEOUT_WORD");
   const sample=e.ioSample;
   if(!sample)return out("UNKNOWN","INPUT_RESULT_NOT_OBSERVED");
   if(sample.value===-1)return out("UNKNOWN","INPUT_TIMEOUT_NOT_SUCCESS");
   if(sample.kind!==k||sample.index!==idx||sample.source!=="HAL_PIN"||sample.d10Exact!==s.d10Current||!sample.timestamp||!Number.isFinite(sample.value))return out("UNKNOWN","INPUT_PROVENANCE_UNQUALIFIED");
   const val=sample.value;
   if(hasP&&blk.L>0){
    const ok=blk.L===1||blk.L===2||blk.L===3?val===1:val===0;
    if(!ok)return out("UNKNOWN","INPUT_CONDITION_NOT_PROVEN");
   }
   events.push({kind:k,index:idx,value:val,type:blk.L===0?"INPUT_SAMPLE_ONLY":"WAIT_INPUT_OBSERVED",anchor:null});
   continue;
  }
  return out("UNKNOWN","UNMODELED_M_OR_G_CODE");
 }
 if(pending.size)return out("UNKNOWN","QUEUED_WITHOUT_NEXT_MOTION");
 if(JSON.stringify(events)!==JSON.stringify(p.expectedEvents))return out("REJECT","EVENT_TIMELINE_MISMATCH",events);
 if(p.mode==="display"||p.mode==="preview")return out("DISPLAY_ONLY","NO_OWNER_COMMIT",events);
 if(p.mode!=="inspect")return out("REJECT","COMMAND_UNSUPPORTED",events);
 return out("CANDIDATE_ONLY","INTENT_NOT_MACHINE_ACK",events);
};
const root=path.resolve(__dirname,'..');
const load=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const f=load('docs/capabilities/CAP-08-04/io-fences-b67-fixtures-v08.json'),src=load('research/sources/CAP-08-04-io-fences-b67.json'),trace=load('research/traces/CAP-08-04-io-fences-b67-v08.json');
function put(obj,key,value){const ps=key.split('.');let v=obj;for(let i=0;i<ps.length-1;i++)v=v[ps[i]];v[ps[ps.length-1]]=value}
let pass=0;const errs=[];
const ids=new Set(),srcIds=new Set(src.sources.map(s=>s.id));
if(src.registeredRecords!==src.sources.length||srcIds.size!==src.sources.length)errs.push('来源条数或ID重复');
for(const rule of trace.rules){const hits=f.cases.filter(c=>c.ruleId===rule.id);if(!hits.length||!hits.some(c=>c.expected==='CANDIDATE_ONLY')||!hits.some(c=>c.expected!=='CANDIDATE_ONLY'))errs.push('规则无独立正反:'+rule.id);if(rule.sourceIds.some(id=>!srcIds.has(id)))errs.push('未知来源:'+rule.id);if(rule.caseIds.some(id=>!f.cases.some(c=>c.id===id)))errs.push('未知案例:'+rule.id)}
for(const c of f.cases){if(ids.has(c.id))errs.push('重复案例:'+c.id);ids.add(c.id);const x=JSON.parse(JSON.stringify(f.base));for(const [k,v]of Object.entries(c.changes))put(x,k,v);const r=judge(x);if(r.status===c.expected&&r.reason===c.expectedReason)pass++;else errs.push({id:c.id,got:r,expected:c.expected,reason:c.expectedReason})}
if(f.cases.length!==53||trace.rules.length!==8)errs.push('数量不符');
console.log(JSON.stringify({total:f.cases.length,passed:pass,failed:errs.length,statusCounts:f.cases.reduce((a,c)=>(a[c.expected]=(a[c.expected]||0)+1,a),{}),syntheticOnly:true,productTests:'NOT_RUN',independentConsumer:'NOT_RUN',errors:errs},null,2));if(errs.length)process.exitCode=1;
module.exports={judge};
