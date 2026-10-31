#!/usr/bin/env node
'use strict';
// CAP-04-02 B09：独立只读结构/刚体合成测试，不修改产品数据；不授予L3或D16资格。
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const fixtures=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-04-02/frame-contract-b09-fixtures-v08.json'),'utf8'));
const trace=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-04-02-frame-contract-b09-v08.json'),'utf8'));

function rigid(m){
 if(!Array.isArray(m)||m.length!==16||!m.every(Number.isFinite))return false;
 if(Math.abs(m[12])>1e-10||Math.abs(m[13])>1e-10||Math.abs(m[14])>1e-10||Math.abs(m[15]-1)>1e-10)return false;
 const r=[0,1,2].map(i=>[m[4*i],m[4*i+1],m[4*i+2]]);
 for(let i=0;i<3;i++)for(let j=0;j<3;j++){let d=r[i].reduce((s,x,k)=>s+x*r[j][k],0);if(Math.abs(d-(i===j?1:0))>1e-10)return false}
 const det=r[0][0]*(r[1][1]*r[2][2]-r[1][2]*r[2][1])-r[0][1]*(r[1][0]*r[2][2]-r[1][2]*r[2][0])+r[0][2]*(r[1][0]*r[2][1]-r[1][1]*r[2][0]);
 return Math.abs(det-1)<1e-10;
}

function invRigid(m){const out=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];for(let i=0;i<3;i++)for(let j=0;j<3;j++)out[4*i+j]=m[4*j+i];for(let i=0;i<3;i++)out[4*i+3]=-(out[4*i]*m[3]+out[4*i+1]*m[7]+out[4*i+2]*m[11]);return out}

function mul4(a,b){const c=Array(16).fill(0);for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)c[4*i+j]+=a[4*i+k]*b[4*k+j];return c}

function evaluate(s){
 const err=[];
 if(!s.scope.projectId||!s.scope.documentInstanceId||!s.scope.setupId)err.push("SCOPE_ID_MISSING");
 if(!s.cad.id||!s.cad.revision||!s.cad.frameRef||!s.stock.id||!s.stock.revision||!s.stock.frameRef)err.push("SOURCE_IDENTITY_MISSING");
 if(!s.cad.hash||s.cad.hash!==s.cad.expectedHash||!s.stock.hash||s.stock.hash!==s.stock.expectedHash)err.push("SOURCE_HASH_MISMATCH");
 if(!s.cad.occurrencePath)err.push("OCCURRENCE_REQUIRED");
 if(s.stock.sourceKind==="measured"&&!s.stock.measurementEvidenceRef)err.push("MEASUREMENT_EVIDENCE_MISSING");
 if(s.frames.unit!=="mm")err.push("UNIT_POLICY_MISMATCH");
 if(s.frames.convention!=="column_vector_left_multiply")err.push("FRAME_CONVENTION_MISMATCH");
 if(!s.frames.numericPolicyRef)err.push("NUMERIC_POLICY_MISSING");
 const a=rigid(s.frames.T_SP),b=rigid(s.frames.T_SK),c=rigid(s.frames.T_KP);
 if(!a||!b||!c)err.push("INVALID_RIGID_FRAME");
 if(a&&b&&c){const x=mul4(invRigid(s.frames.T_SK),s.frames.T_SP);if(x.some((v,i)=>Math.abs(v-s.frames.T_KP[i])>1e-9))err.push("FRAME_COMPOSITION_MISMATCH")}
 if(s.constraints.rank<6)err.push("REGISTRATION_UNDERDETERMINED");
 if(s.constraints.candidates!==1)err.push("REGISTRATION_AMBIGUOUS");
 if(s.constraints.conflicting)err.push("REGISTRATION_CONFLICT");
 if(s.geometry.bboxEvidence!=="POSSIBLE_NOT_PROVEN"||(!s.geometry.hasExactContainmentEvidence&&s.geometry.declaredContainment!=="unknown"))err.push("GEOMETRY_OVERCLAIM");
 if(s.write.owner!=="D04")err.push("WRONG_DOMAIN_OWNER");
 if(s.write.expectedRevision!==s.write.currentRevision||!s.write.casMatches)err.push("CAS_CONFLICT");
 if(!s.write.aclGranted)err.push("SCOPE_REVOKED");
 if(s.write.permissionEpoch!==s.write.currentPermissionEpoch)err.push("PERMISSION_EPOCH_STALE");
 if(s.scope.scopeEpoch!==s.scope.currentScopeEpoch)err.push("STALE_SCOPE");
 if(s.write.previewOnly)err.push("PREVIEW_NOT_COMMIT");
 if(s.write.requestCancelled||s.write.lateAck)err.push("CANCELLED_LATE_ACK");
 const p="StockPartRegistrationPort";
 if(s.ui.guiPort!==p||s.ui.cliPort!==p||s.ui.agentPort!==p)err.push("PORT_SPLIT");
 if(s.ui.activeBabylonWorlds!==1)err.push("MULTIPLE_ACTIVE_3D");
 if(s.ui.taskPanelSide!=="left")err.push("TASK_PANEL_SPLIT");
 if(!s.execution.d04D10Separate)err.push("D04_D10_CONFLATED");
 if(s.execution.clIsD15)err.push("CL_AS_NC_VALIDATION");
 if(s.execution.d13!=="unknown"||s.execution.d14!=="NOT_RUN"||s.execution.d15!=="NOT_RUN")err.push("UNKNOWN_NC_OVERCLAIM");
 if(s.execution.d16!=="BLOCKED")err.push("D16_UNQUALIFIED");
 if(s.execution.materialSweep)err.push("MATERIAL_SWEEP_OUT_OF_SCOPE");
 if(s.evidence.ownerSignatures!==0||s.evidence.realConsumers!==0||s.evidence.l3!=="PENDING_HUMAN")err.push("HUMAN_APPROVAL_FORGED");
 if(s.evidence.product!=="NOT_RUN")err.push("PRODUCT_PASS_FORGED");
 if(!s.migration.sourceClosureVerified||!s.migration.rollbackRef)err.push("MIGRATION_ROLLBACK_MISSING");
 return [...new Set(err)];
}

function apply(s,path,value){const o=JSON.parse(JSON.stringify(s));const keys=path.split(".");let x=o;for(const k of keys.slice(0,-1))x=x[k];x[keys.at(-1)]=value;return o}
const errors=[];
const baselineErrors=evaluate(fixtures.baseline);
if(baselineErrors.length)errors.push('POSITIVE_FAILED:'+baselineErrors.join(','));
if(fixtures.cases[0]?.kind!=='positive'||fixtures.cases[0]?.expectedErrors.length)errors.push('POSITIVE_FIXTURE_INVALID');
const sourceIds=new Set(trace.sources.map(s=>s.id)),testIds=new Set(fixtures.cases.map(c=>c.id));
const seen=new Set();
for(const r of trace.rules){
 if(seen.has(r.id))errors.push('DUPLICATE_RULE:'+r.id);seen.add(r.id);
 if(!r.sourceRefs.length||!r.fields.length||!r.caps.length||!r.originalPackages.length||!r.independentNegativeCases.length)errors.push('INCOMPLETE_RULE:'+r.id);
 for(const id of r.sourceRefs)if(!sourceIds.has(id))errors.push('MISSING_SOURCE:'+id);
 for(const id of r.independentNegativeCases)if(!testIds.has(id))errors.push('MISSING_TEST:'+id);
}
let pass=0;
for(const c of fixtures.cases){
 const got=evaluate(c.patch?apply(fixtures.baseline,c.patch.path,c.patch.value):fixtures.baseline);
 if(c.kind==='positive'&&got.length===0){pass++;continue}
 if(c.kind==='negative'&&c.expectedErrors.length===1&&got.includes(c.expectedErrors[0])&&got.length>0){pass++;continue}
 errors.push('CASE_FAILED:'+c.id+':'+got.join(','));
}
if(trace.rules.length!==8||fixtures.cases.length!==47)errors.push('COUNT_MISMATCH');
if(fixtures.expectation.nodeIndependent!=='NOT_RUN'||fixtures.expectation.product!=='NOT_RUN'||fixtures.expectation.realConsumers!==0||fixtures.expectation.realOwnerSignatures!==0)errors.push('FALSE_ASSURANCE');
console.log(JSON.stringify({topic:trace.topic,ruleCount:trace.rules.length,syntheticCases:pass,total:fixtures.cases.length,errors,status:errors.length?'FAIL':'PASS',product:'NOT_RUN',ownerSignatures:0,independentConsumers:0,l3:'PENDING_HUMAN'},null,2));
if(errors.length)process.exitCode=1;
