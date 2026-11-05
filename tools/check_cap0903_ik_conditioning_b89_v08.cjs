"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const fixture = JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-09-03/ik-conditioning-b89-fixtures-v08.json"),"utf8"));
const trace = JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-09-03-ik-conditioning-b89-v08.json"),"utf8"));
const sources = JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-09-03-ik-conditioning-b89.json"),"utf8"));
const judge = function judge(c) {
 if(!c||typeof c!=="object")return"REJECT";
 const {refs:r,svd:s,scale:w,step:t,rank:k,continuity:q,oracle:o,workflow:g}=c;
 if([r,s,w,t,k,q,o,g].some(v=>!v||typeof v!=="object"))return"UNKNOWN";
 if(g.cancelled)return"CANCELLED";
 if(!g.cas||!g.taskGenerationExact||r.d03Hash!==r.expectedD03Hash||r.d10Hash!==r.expectedD10Hash)return"STALE";
 if(g.lateAck||!g.acl)return"REJECT";
 if(!/^sha256:[a-f0-9]{64}$/.test(r.d03Hash)||!/^sha256:[a-f0-9]{64}$/.test(r.d10Hash)||!/^sha256:[a-f0-9]{64}$/.test(r.controllerProfileHash))return"UNKNOWN";
 if(!r.d04Frame||!r.d10Frame)return"UNKNOWN";
 if(r.d04Frame===r.d10Frame||r.frameConvention!=="RIGHT_HANDED_COLUMN"||r.unitPolicy!=="PINNED")return"REJECT";
 if(s.algorithm!=="JacobiSVD"||!s.version||!Number.isInteger(s.rows)||!Number.isInteger(s.cols)||s.rows!==2||s.cols!==2)return"REJECT";
 if(!Array.isArray(s.sigmas)||s.sigmas.length!==2||s.sigmas.some(x=>!Number.isFinite(x)||x<0)||s.sigmas[0]<s.sigmas[1])return"REJECT";
 if(!Number.isFinite(s.threshold)||s.threshold<=0)return"UNKNOWN";
 if(s.sigmas[0]===0||s.sigmas[1]<=s.threshold)return"UNKNOWN";
 if(s.rank!==2)return"REJECT";
 if(w.mixedUnitAuto)return"REJECT";
 if(!w.taskScalePinned||!w.jointScalePinned||!w.normalized)return"UNKNOWN";
 if(k.nullDirectionRequested)return"UNKNOWN";
 if(!k.ambiguityRecorded)return"REJECT";
 if(k.fullRankNeeded&&!s.rank)return"UNKNOWN";
 if(!Number.isFinite(t.lambda)||t.lambda<0)return"REJECT";
 if(t.lambda===0&&s.sigmas[1]<0.01)return"UNKNOWN";
 if(!t.solverVersionPinned||!Array.isArray(t.error)||t.error.length!==2||t.error.some(x=>!Number.isFinite(x)))return"UNKNOWN";
 if(!Number.isFinite(t.gainBound)||t.gainBound<=0||!Number.isFinite(t.jointBound)||t.jointBound<=0)return"UNKNOWN";
 const expected=t.error.map((e,i)=>e*s.sigmas[i]/(s.sigmas[i]**2+t.lambda**2));
 const residual=t.error.map((e,i)=>e-s.sigmas[i]*expected[i]);
 if(expected.some(x=>Math.abs(x)>t.gainBound||Math.abs(x)>t.jointBound))return"REJECT";
 if(!Array.isArray(t.predictedStep)||!Array.isArray(t.predictedResidual)||t.predictedStep.length!==2||t.predictedResidual.length!==2)return"REJECT";
 if(expected.some((x,i)=>!Number.isFinite(t.predictedStep[i])||Math.abs(x-t.predictedStep[i])>1e-8)||residual.some((x,i)=>!Number.isFinite(t.predictedResidual[i])||Math.abs(x-t.predictedResidual[i])>1e-8))return"REJECT";
 if(!q.branchId||!Array.isArray(q.prevTurns)||!Array.isArray(q.nextTurns)||q.prevTurns.length!==2||q.nextTurns.length!==2)return"UNKNOWN";
 if(!q.noImplicitWrap||!q.candidateWithinJointLimits)return"REJECT";
 if(!q.rateBoundsPinned||!q.accelerationBoundsPinned)return"UNKNOWN";
 if(!o.independentFKRequired||!o.noD15Promotion||o.verified||o.residualEvidence!=="SYNTHETIC_NUMERIC"||o.taskToleranceProfile!=="NOT_SET")return"REJECT";
 if(g.sceneCount!==1||!g.leftPanel||!g.sameDomainPort||!g.clPreviewLabelled||g.d15!=="NOT_RUN"||g.d16!=="BLOCKED"||g.consumers!=="NOT_RUN")return"REJECT";
 return"CANDIDATE_ONLY";
};
function check(){
const assert=require("node:assert/strict");
const ids=new Set(),rules=new Set(trace.rules.map(r=>r.id)),sourceIds=new Set(sources.sources.map(s=>s.id));
assert.equal(sources.registeredRecords,sources.sources.length);
for(const r of trace.rules){assert(r.sourceIds.length>0&&r.fields.length>0&&r.positiveIds.length>0&&r.negativeIds.length>0);for(const id of r.sourceIds)assert(sourceIds.has(id));}
const failures=[];for(const c of fixture.cases){assert(!ids.has(c.id));ids.add(c.id);assert(rules.has(c.ruleId));const got=judge(c.input);if(got!==c.expected)failures.push({id:c.id,expected:c.expected,got});}
for(const r of trace.rules)for(const id of [...r.positiveIds,...r.negativeIds])assert(ids.has(id),"未找到验收ID:"+id);
for(const g of fixture.mathGolden){const c=fixture.cases[0].input;const s=c.svd.sigmas[1],e=c.step.error[1],lambda=c.step.lambda;const d=s*e/(s*s+lambda*lambda);const result=g.id==="B89-G01"?d:e-s*d;if(Math.abs(result-g.expected)>1e-12)failures.push({id:g.id,expected:g.expected,got:result});}
assert.equal(failures.length,0,JSON.stringify(failures));return{cases:fixture.cases.length,golden:fixture.mathGolden.length,ruleCount:trace.rules.length,pass:true,execution:"INDEPENDENT_NODE_FILE_PROCESS_IF_RUN_AS_SCRIPT",product:"NOT_RUN"};
}
if(require.main===module)console.log(JSON.stringify(check(),null,2));
module.exports={judge,check};
