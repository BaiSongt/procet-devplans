'use strict';
// B112只读合成校验器：不连接OCCT、产品SQLite、机床或付费CI。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const load=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const sources=load('research/sources/CAP-04-04-frame-path-b112.json');
const trace=load('research/traces/CAP-04-04-frame-path-b112-v08.json');
const fx=load('docs/capabilities/CAP-04-04/frame-path-b112-fixtures-v08.json');
const I=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
const mul=(a,b)=>a.map(row=>row.map((_,j)=>row.reduce((s,x,k)=>s+x*b[k][j],0)));
const compose=xs=>xs.reduce((a,b)=>mul(a,b),I);
const point=(m,p)=>m.slice(0,3).map(row=>row[0]*p[0]+row[1]*p[1]+row[2]*p[2]+row[3]);
function rigid(m){
 if(!Array.isArray(m)||m.length!==4||m.some(r=>!Array.isArray(r)||r.length!==4||r.some(x=>!Number.isFinite(x))))return false;
 if(m[3].some((x,i)=>Math.abs(x-(i===3?1:0))>1e-10))return false;
 const a=m,det=a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])-a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])+a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0]);
 if(Math.abs(det-1)>1e-9)return false;
 for(let i=0;i<3;i++)for(let j=0;j<3;j++){let q=0;for(let k=0;k<3;k++)q+=a[k][i]*a[k][j];if(Math.abs(q-(i===j?1:0))>1e-9)return false;}return true;
}
function decide(x){
 const r=x.refs,m=x.matrix,p=x.paths,g=x.gate;
 if(Object.values(r).some(v=>v!==true)||p.allExact!==true)return 'STALE';
 if(['finite','homogeneous','rightHanded','orthonormal','scaleOne','orderCorrect','inverseRoundtrip','unitMm','rawInputChecked'].some(k=>m[k]!==true)||['samePort','singleBabylon','leftTaskPanel','casAcl','cancelFence','unchangedFrozen','d04D10Separated','rollbackNonDestructive'].some(k=>g[k]!==true)||g.selfCertifiedMeasured||g.d15FromCL)return 'REJECT';
 if(!m.conventionKnown||!p.sourceKnown||!p.rooted)return 'UNKNOWN';
 if(!p.alternateAvailable)return 'SINGLE_PATH_ONLY';
 if(!p.independentProvenance)return 'UNKNOWN';
 if(!p.pathA.every(rigid)||!p.pathB.every(rigid))return 'REJECT';
 const a=compose(p.pathA),b=compose(p.pathB);
 const d=Math.hypot(...point(a,[0,0,0]).map((v,i)=>v-point(b,[0,0,0])[i]));
 let tr=0;for(let k=0;k<3;k++)for(let i=0;i<3;i++)tr+=a[k][i]*b[k][i];
 const angle=Math.acos(Math.max(-1,Math.min(1,(tr-1)/2)));
 if(!Number.isFinite(d)||!Number.isFinite(angle)||!Number.isFinite(p.translationThresholdMm)||!Number.isFinite(p.angleThresholdRad)||p.translationThresholdMm<=0||p.angleThresholdRad<=0)return 'UNKNOWN';
 if(d>p.translationThresholdMm||angle>p.angleThresholdRad)return 'FRAME_CONFLICT';
 return 'CONSISTENT_CANDIDATE';
}
function patch(obj,key,value){const a=key.split('.');let v=obj;for(const k of a.slice(0,-1)){assert(k in v,key);v=v[k];}assert(a.at(-1) in v,key);v[a.at(-1)]=value;}
const keys=new Set(fx.cases.map(x=>x.id)),srcIds=new Set(sources.sources.map(x=>x.id));
assert.equal(sources.sources.length,5);assert.equal(sources.registeredRecords,5);assert.equal(srcIds.size,5);
assert.equal(trace.rules.length,8);assert.equal(fx.cases.length,32);assert.equal(keys.size,32);
for(const rule of trace.rules){
 assert(rule.sourceIds.length&&rule.fields.length&&rule.positive.length&&rule.negative.length);
 assert(rule.caps.includes('CAP-04-04'));assert(rule.originalWorkPackages.includes('F1-02'));
 for(const sid of rule.sourceIds)assert(srcIds.has(sid),'source '+sid);
 for(const caseId of [...rule.positive,...rule.negative,...rule.unknownOrStale])assert(keys.has(caseId),'case '+caseId);
 for(const field of rule.fields)assert.notEqual(field.split('.').reduce((v,k)=>v==null?undefined:v[k],fx.baseline),undefined,'field '+field);
}
const counts={};
for(const c of fx.cases){
 assert(trace.rules.some(r=>r.id===c.ruleId),'rule '+c.id);
 const value=structuredClone(fx.baseline);
 for(const [k,v] of Object.entries(c.patch))patch(value,k,v);
 const actual=decide(value);assert.equal(actual,c.expected,'case '+c.id);
 counts[actual]=(counts[actual]||0)+1;
}
assert.deepEqual(counts,fx.expectedCounts);
const a=compose(fx.baseline.paths.pathA),b=compose(fx.baseline.paths.pathB),bad=compose([...fx.baseline.paths.pathA].reverse());
function near(x,y){assert.equal(x.length,y.length);x.forEach((v,i)=>assert(Math.abs(v-y[i])<1e-9));}
near(point(a,[0,0,0]),[100,10,0]);near(point(b,[0,0,0]),[100,10,0]);
near(point(bad,[0,0,0]),[110,0,0]);near(point(a,[2,3,4]),[97,12,4]);near(point(b,[2,3,4]),[97,12,4]);
console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_PASS',cases:fx.cases.length,goldens:4,counts,independentNode:'THIS_PROCESS_ONLY',realOCCT:'NOT_RUN',realConsumer:'NOT_RUN',product:'NOT_RUN'}));
