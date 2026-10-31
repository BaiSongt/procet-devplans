'use strict';
// B42：只读规划校验，不能授予NC/产品PASS。
const fs=require('node:fs'),path=require('node:path');
const judge=function judge(x){
const id=v=>typeof v==="string"&&v.length>0,sha=v=>typeof v==="string"&&/^[a-f0-9]{64}$/.test(v),int=Number.isSafeInteger;
if(!id(x["entry.revision"])||!sha(x["entry.hash"])||!id(x["entry.frame"])||!id(x["entry.unit"]))return "REJECT";
if(x["entry.revision"]!=="D05-r7"||x["entry.frame"]!=="PART:mm"||x["entry.unit"]!=="mm")return "STALE";
if(!["closeMatch","exactMatch"].includes(x["term.relation"])||x["term.approved"]!==true)return "REJECT";
if(x["term.schemeRevision"]!=="SKOS-r3")return "STALE";
if(x["term.relation"]==="closeMatch"&&x["term.transitive"]!==false)return "REJECT";
if(x["term.relation"]==="exactMatch"&&typeof x["term.transitive"]!=="boolean")return "REJECT";
if(x["shape.conforms"]!==true||x["shape.trusted"]!==true||x["shape.claimsManufacturingPass"]!==false)return "REJECT";
if(x["shape.dataHash"]!==x["entry.hash"]||x["shape.revision"]!=="Shape-r2")return "STALE";
if(!int(x["cache.ownerEpoch"])||!int(x["cache.snapshotEpoch"])||!sha(x["cache.digest"]))return "REJECT";
if(x["cache.ownerEpoch"]!==7||x["cache.snapshotEpoch"]!==x["cache.ownerEpoch"]||x["cache.etagMatch"]!==true||x["cache.invalidated"]!==false||x["cache.digest"]!=="b".repeat(64))return "STALE";
if(x["cache.cascadeComplete"]!==true)return "UNKNOWN";
if(!id(x["auth.expectedScope"])||!id(x["auth.currentScope"])||!int(x["auth.expectedAcl"])||!int(x["auth.currentAcl"]))return "REJECT";
if(x["auth.expectedScope"]!=="P1"||x["auth.expectedScope"]!==x["auth.currentScope"]||x["auth.expectedAcl"]!==12||x["auth.expectedAcl"]!==x["auth.currentAcl"])return "STALE";
if(x["auth.role"]!=="READ_ONLY")return "REJECT";
if(x["source.parameterFromDirectory"]!==false||x["source.trustedDataOnly"]!==true)return "REJECT";
if(x["source.depth"]!=="PUBLIC_BODY_SECTION"||x["source.profileKnown"]!==true||x["source.unitKnown"]!==true)return "UNKNOWN";
if(x["result.advisory"]!==true||x["result.noFrozenRewrite"]!==true||x["result.d15"]!=="NOT_RUN"||x["result.d16Release"]!==false||x["result.shadow"]!==true||x["result.consumer"]!=="NOT_RUN")return "REJECT";
if(x["ui.port"]!=="11.ProcessKnowledgePort"||x["ui.channels"]!=="GUI|CLI|Agent"||x["ui.worldCount"]!==1||x["ui.leftPanel"]!==true||x["ui.fontMaxPx"]!==12)return "REJECT";
if(x["owner.cancelled"]===true)return "CANCELLED";
if(x["owner.cancelled"]!==false||x["owner.lateAckAdopted"]!==false)return "REJECT";
if(x["binding.d04"]!=="D04-r2"||x["binding.d10"]!=="D10-r4"||x["binding.d04"]===x["binding.d10"])return "STALE";
return "ADVISORY_ONLY";
};
function run(root=path.join(__dirname,'..')){const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));let s=load('research/sources/CAP-11-02-knowledge-conformance-b42.json'),t=load('research/traces/CAP-11-02-knowledge-conformance-b42-v08.json'),f=load('docs/capabilities/CAP-11-02/knowledge-conformance-b42-fixtures-v08.json');
const sourceIds=new Set(s.sources.map(x=>x.id)),ids=new Map(f.cases.map(x=>[x.id,x]));if(sourceIds.size!==6||s.sources.length!==6||ids.size!==f.cases.length||t.rules.length!==8||!f.syntheticOnly)throw Error('source/case重复或数量不一致');
for(const r of t.rules){if(!r.sourceIds.every(id=>sourceIds.has(id))||!r.fields.every(k=>Object.hasOwn(f.baseline,k))||!r.negativeIds.length||!r.positiveIds.length)throw Error('来源字段或正反链接缺失：'+r.id);
for(const [key,kind] of [['positiveIds','positive'],['negativeIds','negative'],['unknownIds','unknown']])if(!r[key].every(id=>ids.has(id)&&ids.get(id).kind===kind))throw Error('用例引用缺失:'+r.id)}
let counts={positive:0,negative:0,unknown:0};for(const c of f.cases){if(c.kind!=='positive'&&(Object.keys(c.patch).length!==1||Object.keys(c.patch)[0]!==c.changedField))throw Error('单字段变异不成立:'+c.id);if(judge({...f.baseline,...c.patch})!==c.expected)throw Error('判据冲突:'+c.id);counts[c.kind]++}for(const k of Object.keys(counts))if(counts[k]!==f[k+'Count'])throw Error('计数冲突:'+k);return {status:'PLANNING_SYNTHETIC_PASS',total:f.cases.length,counts,realSHACL:'NOT_RUN',owner:'NOT_RUN',D15:'NOT_RUN',independentConsumers:'0/17'};}
if(require.main===module){try{console.log(JSON.stringify(run()))}catch(e){console.error(e.stack||e.message);process.exitCode=1}}module.exports={judge,run};
