'use strict';
// 只读规划校验器，非NC生产解释器。
const fs=require('node:fs'),path=require('node:path');
const flags=["controllerProfileExact","ncRawBytesExact","d04D10Separated","initialFeedModeKnown","modalTransitionRecorded","g93BlockFRequired","implicitMotionResolved","rapidUnaffected","fPositiveFinite","nominalTimeUnitsDeclared","g94FreshFEnforcedByDialect","resetSnapshotScoped","overrideNotCertified","d14IndependentTiming","aclCasCancelFence","d15UnknownBlocksD16"];
function get(x,p){return p.split(".").reduce((v,k)=>v==null?undefined:v[k],x)}
function set(x,p,value){const a=p.split(".");let y=x;for(let i=0;i<a.length-1;i++)y=y[a[i]];y[a[a.length-1]]=value}
function judge(x){
for(const flag of flags)if(get(x,"guards."+flag)!==true)return {status:"REJECT",seconds:null};
if(!x.dialectVerified||!x.stateKnown||!x.resetEventKnown||!x.driverModelKnown||!["LINUXCNC_2_9","HAAS_MILL_G93"].includes(x.dialect))return {status:"UNKNOWN",seconds:null};
if(!["G93","G94"].includes(x.feedMode)||!["G0","G1","G2","G3"].includes(x.motion))return {status:"UNKNOWN",seconds:null};
if(x.inferRapidTime)return {status:"REJECT",seconds:null};
if(x.motion==="G0")return {status:"DESIGN_OK_NO_TIME",seconds:null};
if(x.requestActualTimeProof)return {status:"UNKNOWN",seconds:null};
if(x.feedMode==="G93"){
if(x.dialect==="HAAS_MILL_G93"&&x.resetSinceLastG93&&!x.g93ReissuedAfterReset)return {status:"REJECT",seconds:null};
if(typeof x.fWord!=="number"||!Number.isFinite(x.fWord)||x.fWord<=0)return {status:"REJECT",seconds:null};
return {status:"DESIGN_OK",seconds:60/x.fWord};
}
if(x.dialect==="LINUXCNC_2_9"&&x.transitionedToG94&&!x.freshG94Feed)return {status:"REJECT",seconds:null};
if(x.dialect==="HAAS_MILL_G93"&&x.transitionedToG94&&!x.freshG94Feed)return {status:"UNKNOWN",seconds:null};
if(typeof x.fWord!=="number"||!Number.isFinite(x.fWord)||x.fWord<=0)return {status:"REJECT",seconds:null};
if(x.motion!=="G1"||!x.linearOnly||typeof x.distanceMm!=="number"||!Number.isFinite(x.distanceMm)||x.distanceMm<0)return {status:"UNKNOWN",seconds:null};
return {status:"DESIGN_OK",seconds:60*x.distanceMm/x.fWord};
}
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const s=read("research/sources/CAP-08-03-inverse-time-b105.json"),t=read("research/traces/CAP-08-03-inverse-time-b105-v08.json"),f=read("docs/capabilities/CAP-08-03/inverse-time-b105-fixtures-v08.json");
const ids=new Set(f.cases.map(x=>x.id)),sources=new Set(s.sources.map(x=>x.id));
if(ids.size!==39||sources.size!==6||s.registeredRecords!==6||t.rules.length!==8||t.sourceRegistry!=="research/sources/CAP-08-03-inverse-time-b105.json"||t.fixtures!=="docs/capabilities/CAP-08-03/inverse-time-b105-fixtures-v08.json"||t.checker!=="tools/check_cap0803_inverse_time_b105_v08.cjs")throw Error('索引/数量失败');
for(const r of t.rules){if(!r.positive.length||!r.negative.length||r.sourceIds.some(x=>!sources.has(x))||r.fields.some(x=>!flags.some(f=>'guards.'+f===x))||!r.caps.includes('CAP-08-03')||!r.originalWorkPackages.includes('E3-02'))throw Error('规则缺口 '+r.id);for(const id of [...r.positive,...r.negative,...r.unknown])if(!ids.has(id))throw Error('验收缺口 '+id)}
const n={};let golden=0;for(const c of f.cases){if(!t.rules.some(r=>r.id===c.ruleId))throw Error('无规则 '+c.id);const x=JSON.parse(JSON.stringify(f.baselines[c.base]));if(!x)throw Error('无基线');for(const [p,v]of Object.entries(c.patch))set(x,p,v);const o=judge(x);n[o.status]=(n[o.status]||0)+1;if(o.status!==c.expected)throw Error('判定失败 '+c.id);if(Object.hasOwn(c,'expectedSeconds')){golden++;if(c.expectedSeconds===null?o.seconds!==null:!Number.isFinite(o.seconds)||Math.abs(o.seconds-c.expectedSeconds)>1e-10)throw Error('Golden '+c.id)}}
if(n.DESIGN_OK!==5||n.DESIGN_OK_NO_TIME!==1||n.REJECT!==24||n.UNKNOWN!==9||golden!==6)throw Error('覆盖失败');
console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_PASS',cases:f.cases.length,counts:n,golden,realController:'NOT_RUN',independentD14D15:'NOT_RUN',product:'NOT_RUN'}));
