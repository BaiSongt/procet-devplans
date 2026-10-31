'use strict';
// B50 规划合成规则检查：不运行OCCT/Babylon/产品代码。
const fs=require('node:fs');const path=require('node:path');
const judge=function judge(x){
 if(!x||!x.source||!x.dimension||!x.ui||!x.regen||!x.owner||!x.down)return "REJECT";
 const s=x.source,d=x.dimension,u=x.ui,r=x.regen,o=x.owner,z=x.down;
 const nonempty=v=>typeof v==="string"&&v.trim().length>0;
 if(["projectId","assetId","revision","contentHash","geometryHash","occurrencePath","frameRef","frameRevision","frameHash","scopeKey"].some(k=>!nonempty(s[k])))return "REJECT";
 if(!["D01","D03","D04"].includes(s.domain)||!["D03","D04"].includes(o.writerDomain))return "REJECT";
 if(s.domain!=="D01"&&o.writerDomain!==s.domain)return "REJECT";
 if(s.domain==="D01"&&o.writerDomain!=="D03")return "REJECT";
 if(!nonempty(d.id)||!["DRIVING","MEASURED","REFERENCE_PMI"].includes(d.kind)||!nonempty(d.unit)||!nonempty(d.displayUnit))return "REJECT";
 if(!nonempty(d.anchor?.geometryRef)||!nonempty(d.anchor?.topologyRef)||!nonempty(d.anchor?.occurrencePath)||!nonempty(d.anchor?.frameRef))return "REJECT";
 if(d.anchor.geometryRef!==s.geometryHash||d.anchor.occurrencePath!==s.occurrencePath||d.anchor.frameRef!==s.frameRef)return "REJECT";
 if(u.engineCount!==1||u.sceneCount!==1||u.taskPanel!=="left"||u.maxFontPx!==12||u.previewOnly!==true||u.numericInputAvailable!==true||u.singlePointerAlternative!==true||u.escRespectsDirty!==true||u.port!=="DimensionIntentPort")return "REJECT";
 if(!["GUI","CLI","Agent"].includes(u.activeEntry)||!Array.isArray(u.entrypoints)||!["GUI","CLI","Agent"].every(k=>u.entrypoints.includes(k)))return "REJECT";
 if(o.acl!==true||o.expectedRevision!==s.revision||o.actualRevision!==s.revision||o.expectedHash!==s.contentHash||o.actualHash!==s.contentHash)return "REJECT";
 if(!Number.isInteger(o.scopeEpoch)||o.scopeEpoch!==o.currentEpoch||o.cancelled!==false||o.lateAck!==false||!nonempty(o.requestId)||o.immutablePast!==true)return "REJECT";
 if(z.d08FrozenUnchanged!==true||z.d16FrozenUnchanged!==true||z.d04D10Separate!==true||z.clPreviewIsNcEvidence!==false||z.d13UnknownPromoted!==false||z.d16ReleaseAllowed!==false||z.rollbackRef==null||!nonempty(z.rollbackRef)||z.legacyBytesPreserved!==true)return "REJECT";
 if(!Array.isArray(z.staleConsumers)||!["D04","D07","D09","D10","D13","D14","D15"].every(k=>z.staleConsumers.includes(k)))return "REJECT";
 if(s.domain==="D01"&&d.kind==="DRIVING")return "REJECT";
 if(d.kind!=="DRIVING"){
   if(d.editAllowed!==false||d.parameterRef!==null||d.requestedValue!==null||o.commitRequested!==false)return "REJECT";
   return "READ_ONLY";
 }
 if(s.domain==="D01"||d.editAllowed!==true||!nonempty(d.parameterRef)||o.commitRequested!==true)return "REJECT";
 if(!Number.isFinite(d.sourceValue)||!Number.isFinite(d.requestedValue)||d.sourceValue<=0||d.requestedValue<=0||d.sourceValue===d.requestedValue)return "REJECT";
 if(d.unit!=="mm"||d.displayUnit!=="mm"||!nonempty(d.numericPolicyRef)||!nonempty(d.recomputeProfileRef)||r.parameterUnitSource!=="explicit_schema")return "REJECT";
 if(r.deprecatedDimensionStorage===true||r.newGeometryHash===s.geometryHash||!nonempty(r.newGeometryHash)||!nonempty(r.kernelVersion)||r.previewWroteAsset===true||o.releasedResourceWriteInPlace===true)return "REJECT";
 if(o.writeMode!==(s.domain==="D04"?"NEW_SETUP_REVISION":"DERIVE_RESOURCE_REVISION"))return "REJECT";
 if(!["exact_brep","mesh_only","unresolved"].includes(s.geometryQualification)||!["unique","ambiguous","unresolved"].includes(d.anchor.rebindState)||!["PASS","FAIL","UNKNOWN"].includes(r.status)||!["verified","invalid","unknown"].includes(r.constraintStatus))return "REJECT";
 if(s.geometryQualification!=="exact_brep"||d.anchor.rebindState!=="unique"||r.status==="UNKNOWN"||r.constraintStatus==="unknown")return "UNKNOWN";
 if(r.status!=="PASS"||r.constraintStatus!=="verified")return "REJECT";
 return "READY_FOR_OWNER_REVIEW";
};
const setAt=function setPath(o,p,v){const a=p.split(".");for(let i=0;i<a.length-1;i++)o=o[a[i]];o[a[a.length-1]]=v;};
function run(data){const failures=[];for(const c of data.cases){const x=JSON.parse(JSON.stringify(c.replace||data.baseline));if(c.path)setAt(x,c.path,c.value);const actual=judge(x);if(actual!==c.expected)failures.push({id:c.id,expected:c.expected,actual})}return{total:data.cases.length,passed:data.cases.length-failures.length,failures};}
if(require.main===module){const f=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/capabilities/CAP-01-07/dimension-edit-b50-fixtures-v08.json'),'utf8'));const r=run(f);console.log(JSON.stringify(r,null,2));if(r.failures.length)process.exitCode=1;}
module.exports={judge,run};
