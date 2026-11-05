'use strict';
// 本工具只检查合成规划反例，不对真实D15/OEM、物理机床或安全资格认证。
const fs=require('fs'),path=require('path');
function judge(o){
let missing=false;const get=p=>p.split('.').reduce((x,k)=>x==null?null:x[k],o);
const eq=(p,v)=>{const x=get(p);if(x==null){missing=true;return true}return x===v};
const pair=(a,b)=>{const x=get(a),y=get(b);if(x==null||y==null){missing=true;return true}return x===y};
const different=(a,b)=>{const x=get(a),y=get(b);if(x==null||y==null){missing=true;return true}return x!==y};
const expected=[["nc.closure",true],["d13.status","NC_SYNTHETIC"],["d13.unknownCount",0],["d10.calibration","PINNED_SYNTHETIC"],["d14.ordered",true],["d14.spans",true],["d14.gaps",0],["d14.cartesianOk",true],["d14.jointOk",true],["d14.timeUnit","SECONDS"],["d14.claimRealTime",false],["d15.recomputed",true],["d15.coverage","INTERVAL_SCOPE_SYNTHETIC"],["d15.collision","SCOPE_MODELED_SYNTHETIC"],["d15.unknown",0],["d15.claimServoSafe",false],["d15.report","DESIGN_ONLY_SYNTHETIC"],["ui.ownerPort",true],["ui.babylon",true],["ui.leftPanel",true],["tx.cas",true],["tx.canceled",false],["tx.rollback",true]];
for(const [p,v] of expected)if(!eq(p,v))return "REJECT";
for(const [a,b] of [["nc.hash","d13.ncHash"],["d13.hash","d14.d13Hash"],["d10.hash","d14.d10Hash"],["d10.frame","d14.frame"],["d10.profile","d14.profile"],["d14.timelineHash","d15.timelineHash"],["tx.ackEpoch","tx.activeEpoch"],["tx.scope","d10.scope"]])if(!pair(a,b))return "REJECT";
if(!different("d14.binary","d15.binary")||!different("d14.run","d15.run"))return "REJECT";
const q=["d14.x","d14.thetaDeg","d14.qReported","d10.jointMax","d14.vPeak","d10.vMax","d14.aPeak","d10.aMax"].map(get);
if(q.some(x=>x==null))missing=true;else{
if(!q.every(x=>typeof x==="number"&&Number.isFinite(x)))return "REJECT";
const analytic=q[0]+2*Math.sin(q[1]*Math.PI/180);
if(Math.abs(analytic-q[2])>1e-9||Math.abs(analytic)>q[3]+1e-9||q[4]>q[5]||q[6]>q[7])return "REJECT";
}
return missing?"UNKNOWN":"DESIGN_OK";
}
function setPath(o,p,v){const a=p.split('.');let x=o;for(let i=0;i<a.length-1;i++)x=x[a[i]];x[a.at(-1)]=v}
function run(root){
const f=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-09-06/CAP-09-06-joint-b101-fixtures-v08.json'),'utf8'));
const t=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-09-06-joint-b101-trace-v08.json'),'utf8'));
const s=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-09-06-joint-b101.json'),'utf8'));
const ids=new Set(s.sources.map(x=>x.id)),cases=new Set(f.cases.map(x=>x.id));
if(ids.size!==s.sources.length||ids.size!==s.registeredRecords||cases.size!==f.cases.length)throw Error('重复ID或登记数不符');
for(const r of t.rules){if(!r.sourceIds.length||!r.fields.length||!r.negative.length||!r.unknown.length||!r.positive.length)throw Error('空规则 '+r.id);for(const id of r.sourceIds)if(!ids.has(id))throw Error('无来源 '+id);for(const id of [...r.positive,...r.negative,...r.unknown])if(!cases.has(id))throw Error('无案例 '+id);if(!r.originalWorkPackages.includes('E3-05')||!r.caps.includes('CAP-09-06'))throw Error('映射缺失');}
const outcomes={};for(const c of f.cases){const o=JSON.parse(JSON.stringify(f.baseline));for(const [p,v]of Object.entries(c.changes))setPath(o,p,v);const got=judge(o);if(got!==c.expected)throw Error(c.id+':'+got+' != '+c.expected);outcomes[got]=(outcomes[got]||0)+1;}
console.log(JSON.stringify({status:'SYNTHETIC_ONLY',outcomes,total:f.cases.length,realD15:'NOT_RUN',product:'NOT_RUN'}));return outcomes;
}
if(require.main===module)run(path.resolve(__dirname,'..'));
module.exports={judge,run};
