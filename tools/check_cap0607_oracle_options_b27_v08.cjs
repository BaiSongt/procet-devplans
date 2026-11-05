// CAP-06-07 B27，仅规划合成DTO/解析AABB的只读校验器；非真实OCCT、产品或消费者测试。
'use strict';
const fs=require('node:fs'),path=require('node:path');
const validate=function validate(x){
 const H=v=>typeof v==="string"&&/^[0-9a-f]{64}$/.test(v),pos=v=>Number.isSafeInteger(v)&&v>0,fin=v=>typeof v==="number"&&Number.isFinite(v),r=x?.refs||{},a=x?.oracle||{},b=x?.brep||{},v=x?.volume||{},p=x?.policy||{},t=x?.topology||{},o=x?.owner||{},d=x?.downstream||{};
 if(x?.schemaVersion!=="procet-b27-oracle-synthetic-v1"||!["D01","D04","D07"].every(k=>H(r[k]?.hash)&&typeof r[k]?.revision==="string"&&r[k].revision.length>0)||!H(r.frameHash)||r.scope!=="SYN/P/A/S1")return "B27-R1";
 if(!pos(a.generatorPid)||!pos(a.verifierPid)||a.generatorPid===a.verifierPid||!H(a.generatorBinaryHash)||!H(a.verifierBinaryHash)||a.recomputed!==true||a.independence!=="PROCESS_ONLY_SYNTHETIC"||a.commonModeRisk!=="OPEN")return "B27-R2";
 if(b.geomControls!==true||b.exactMethod!==true||b.allSolidsChecked!==true||b.valid!==true||b.closed!==true||b.orientation!=="COHERENT"||!pos(b.solidCount)||b.checkedCount!==b.solidCount||b.selfInterferenceChecked!==true)return "B27-R3";
 if(v.algorithm!=="VolumePropertiesGK"||v.onlyClosed!==true||v.skipShared!==true||!fin(v.eps)||v.eps<=0||v.eps>0.001||!fin(v.reportedRelError)||v.reportedRelError<0||v.reportedRelError>0.001||v.freshAccumulation!==true)return "B27-R4";
 if(p.version!=="SYNTHETIC_POLICY_r1"||p.volumeUnit!=="mm3"||v.unit!=="mm3"||!fin(p.absTol)||p.absTol<0||p.absTol>0.05||!fin(p.relTol)||p.relTol<0||p.relTol>0.001||!fin(p.maxGKRelError)||p.maxGKRelError<=0||p.maxGKRelError>0.001||v.reportedRelError>p.maxGKRelError||![v.before,v.after,v.removed].every(n=>fin(n)&&n>=0)||Math.abs(v.before-v.removed-v.after)>p.absTol+p.relTol*Math.abs(v.before)+1e-12)return "B27-R5";
 if(t.independentBoolean!==true||t.protectedIntersectionVolume!==0||t.targetMismatchVolume!==0||t.distanceZeroIsNoOverlapProof!==false||!pos(t.islandCountExpected)||t.islandCountObserved!==t.islandCountExpected)return "B27-R6";
 if(o.port!=="06.OracleVerificationPort"||!Array.isArray(o.channels)||o.channels.join("|")!=="GUI|CLI|Agent"||o.babylonWorlds!==1||o.taskPanel!=="UnifiedTaskPanel.left"||!H(o.expectedHead)||o.expectedHead!==o.observedHead||!pos(o.aclEpoch)||o.aclEpoch!==o.observedAclEpoch||!pos(o.scopeEpoch)||o.scopeEpoch!==o.observedScopeEpoch||!pos(o.generation)||o.generation!==o.observedGeneration||o.cancelled!==false||o.stageSealed!==true||o.committed!==false)return "B27-R7";
 if(d.D05!=="NOT_APPROVED"||d.D08FrozenUnchanged!==true||d.D10Bound!==false||d.D13!=="UNKNOWN"||d.D15!=="NOT_RUN"||d.D16!=="BLOCKED"||d.clAnimationAsNcProof!==false||d.materialSweep!==false)return "B27-R8";
 return "PASS";
};
const patch=function patch(x,pa){let v=x;let parts=pa.path.split(".");for(const p of parts.slice(0,-1)){if(!(p in v))throw Error("missing field "+pa.path);v=v[p];}if(!(parts.at(-1) in v))throw Error("missing leaf "+pa.path);v[parts.at(-1)]=pa.value;};
const boxVol=function boxVol(a,b){return [0,1,2].reduce((prod,i)=>prod*Math.max(0,Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])),1);};
function run(root=path.resolve(__dirname,'..')){
 const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const f=load('docs/capabilities/CAP-06-07/oracle-options-b27-fixtures-v08.json'),t=load('research/traces/CAP-06-07-oracle-options-b27-v08.json'),s=load('research/sources/CAP-06-07-oracle-options-b27.json');
 if(f.syntheticOnly!==true||t.capabilityId!=='CAP-06-07'||s.sources.length!==6||t.rules.length!==8||f.cases.length!==39||f.mathBoxes.length!==2)throw Error('schema/count mismatch');
 const ids=new Set(s.sources.map(x=>x.id)),cases=new Set(f.cases.map(x=>x.id));
 for(const r of t.rules){if(!r.sourceIds.every(i=>ids.has(i))||!r.positiveIds.every(i=>cases.has(i))||!r.negativeIds.every(i=>cases.has(i))||r.capabilityId!=='CAP-06-07'||!r.workPackages.includes(r.primaryPackage))throw Error('trace gap '+r.id);}
 let n=0;for(const c of f.cases){let v=structuredClone(f.base);for(const p of c.patches)patch(v,p);let actual=validate(v);if(actual!==c.expect)throw Error(c.id+' actual '+actual+' expected '+c.expect);n++;}
 for(const m of f.mathBoxes){if(boxVol(m.a,m.b)!==m.expectedIntersectionVolume)throw Error('AABB '+m.id);n++;}
 console.log('B27 SYNTHETIC_PLANNING_ONLY '+n+'/'+n+' PASS; OCCT/独立消费者/NC NOT_RUN');return n;
}
if(require.main===module){try{run()}catch(e){console.error(e.message);process.exitCode=1}}
module.exports={validate,run};
