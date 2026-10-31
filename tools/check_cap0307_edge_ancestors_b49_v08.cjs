'use strict';
// 仅合成字段判定，未执行真实OCCT或产品测试。
const fs=require('node:fs');const path=require('node:path');
const judge=function judge(x){
 const s=x.source,t=x.topology,m=x.semantics,o=x.owner,g=x.gate;
 if(!s||!t||!m||!o||!g)return "REJECT";
 if(["projectId","occurrencePath","d01Revision","d01Hash","d02Revision","frameRef"].some(k=>typeof s[k]!=="string"||!s[k].trim()))return "REJECT";
 if(t.mapReset!==true||!t.mapRunId||t.ancestorMode!=="unique")return "REJECT";
 if(!t.edge?.tShape||!t.edge.location||!t.comparedEdge?.tShape||!t.comparedEdge.location)return "REJECT";
 if(t.edge.tShape!==t.comparedEdge.tShape||t.edge.location!==t.comparedEdge.location)return "REJECT";
 if(!Array.isArray(t.ancestorFaces)||new Set(t.ancestorFaces).size!==t.ancestorFaces.length)return "REJECT";
 if(t.edgeConnected!==true||t.vertexOnly!==false||t.meshOnly!==false)return "REJECT";
 if(m.relationKind!=="shares_topological_edge"||m.graphLayer!=="D02_CANDIDATE"||m.materialRole!=="undecided"||m.promotedToD05!==false)return "REJECT";
 if(!m.d08FrozenUnchanged||!m.d16FrozenUnchanged)return "REJECT";
 if(o.expectedRevision!==s.d02Revision||o.actualRevision!==s.d02Revision||o.sourceHash!==s.d01Hash||o.frameRef!==s.frameRef)return "REJECT";
 if(o.acl!==true||o.scopeEpoch!==o.currentEpoch||o.cancelled!==false||o.lateAck!==false)return "REJECT";
 if(o.port!=="FeatureRelationService"||o.worldCount!==1||o.taskPanel!=="left"||!Array.isArray(o.entrypoints)||["GUI","CLI","Agent"].some(x=>!o.entrypoints.includes(x)))return "REJECT";
 if(o.readerRollback!==true||o.historyPreserved!==true||g.d16Publish!==false)return "REJECT";
 if(t.transferredAcrossRevision!==false||t.ancestorFaces.length!==2||g.d15!=="NOT_RUN")return "UNKNOWN";
 return "CANDIDATE_ONLY";
};
const setAt=function setAt(obj,path,v){const a=path.split(".");let o=obj;for(let i=0;i<a.length-1;i++)o=o[a[i]];o[a[a.length-1]]=v};
function run(data){let failed=[];for(const c of data.cases){const x=JSON.parse(JSON.stringify(data.baseline));if(c.path)setAt(x,c.path,c.value);const actual=judge(x);if(actual!==c.expected)failed.push({id:c.id,actual,expected:c.expected})}return{total:data.cases.length,passed:data.cases.length-failed.length,failed}}
if(require.main===module){const f=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/capabilities/CAP-03-07/edge-ancestors-b49-fixtures-v08.json'),'utf8'));const out=run(f);console.log(JSON.stringify(out,null,2));if(out.failed.length)process.exitCode=1}
module.exports={judge,run};
