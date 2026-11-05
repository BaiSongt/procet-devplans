/* B25 D07封存状态合成正反验收，仅规划：不运行真实OCCT、D07独立消费者或NC */
"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const hash=x=>crypto.createHash("sha256").update(x).digest("hex");
const hex=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==="object"?Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])])):x;
function validate(x){
const errors=[],check=(r,p)=>{if(!p)errors.push("B25-"+r)};
const b=x.rawBrep||{},s=x.serializer||{},m=x.metadata||{},r=x.refs||{},c=x.commit||{},q=x.qualification||{},ui=x.ui||{};
let bytes=null;try{bytes=Buffer.from(b.bytesBase64,"base64")}catch(_){}
check("R1",bytes&&b.bytesBase64&&bytes.toString("base64")===b.bytesBase64&&bytes.length===b.byteLength&&b.byteLength>0&&hash(bytes)===b.sha256&&hex(b.sha256)&&b.hashKind==="SHA256_RAW_V1"&&b.syntheticOnly===true);
check("R2",s.api==="BRepTools::Write_explicit"&&s.occtVersion==="8.0.1"&&s.buildHash==="UNVERIFIED"&&s.format==="VERSION_1"&&s.withTriangles===true&&s.withNormals===false&&s.execution==="NOT_RUN");
let j=null,k=null;try{j=JSON.parse(m.json);k=JSON.stringify(stable(j))}catch(_){}
const fields=["assetId","branch","frame","hashKind","parentHash","rawBrepSha256","removedBrepSha256","revision","scope","serializerBuild","serializerFormat","serializerNormals","serializerTriangles","setup","setupRefHash","stateUid","targetHash","unit"];
check("R3",j&&typeof j==="object"&&!Array.isArray(j)&&Object.keys(j).length===fields.length&&fields.every(f=>Object.hasOwn(j,f))&&fields.filter(f=>typeof j[f]!=="string").every(f=>["serializerNormals","serializerTriangles"].includes(f))&&k===m.json&&m.scheme==="JCS_IJSON_RESTRICTED_FIXTURE"&&j.serializerNormals===false&&j.serializerTriangles===true);
const d=r.D01||{},su=r.D04||{},p=r.parentD07||{};
check("R4",j&&m.domain==="procet:d07:state:v1\n"&&hex(m.stateSha256)&&hash(m.domain+m.json)===m.stateSha256&&m.stateSha256!==b.sha256&&j.assetId==="D07"&&j.hashKind==="SHA256_DOMAIN_V1"&&j.rawBrepSha256===b.sha256&&j.parentHash===p.hash&&j.targetHash===d.hash&&j.setupRefHash===su.hash&&j.scope==="SYN/A/S1"&&j.frame==="S1"&&j.unit==="mm"&&j.serializerFormat===s.format&&j.serializerTriangles===s.withTriangles&&j.serializerNormals===s.withNormals&&j.serializerBuild==="OCCT_8.0.1_BUILD_UNVERIFIED"&&d.assetId==="D01"&&d.revision==="r1"&&d.frame==="PART"&&su.assetId==="D04"&&su.revision==="r2"&&su.frame==="S1"&&p.assetId==="D07"&&p.revision==="r7"&&p.frame==="S1"&&[d,su,p].every(z=>hex(z.hash)&&z.scope==="SYN/A/S1"));
check("R5",c.expectedHead==="head7"&&c.expectedHead===c.currentHead&&c.aclEpoch===c.authorizedAclEpoch&&c.scopeEpoch===c.authorizedScopeEpoch&&c.taskGeneration===c.currentGeneration&&c.cancelled===false&&c.lateAck===false&&c.stageSealed===true&&c.manifestVerified===true&&c.recovery==="UNKNOWN_NOT_CLAIMED"&&c.ownerReceipt===null&&c.productCommit===false&&c.idempotencyKey==="B25-SYN-01");
check("R6",q.independentD07==="NOT_RUN"&&q.productPass===false&&q.d08FrozenUntouched===true&&q.d09Eligible===false&&q.d13==="UNKNOWN"&&q.d14==="BLOCKED"&&q.d15==="BLOCKED"&&q.d16==="BLOCKED"&&q.materialSweep===false);
const e=r.D10||{};
check("R7",ui.ownerPort==="ManufacturingStatePort"&&Array.isArray(ui.routes)&&ui.routes.length===3&&["GUI","CLI","Agent"].every(z=>ui.routes.includes(z))&&ui.singleBabylon===true&&ui.leftTaskPanel===true&&ui.maxFontPx===12&&e.assetId==="D10"&&e.revision==="r3"&&e.frame==="MACHINE"&&e.scope==="SYN/A/S1"&&hex(e.hash)&&e.hash!==su.hash&&e.frame!==su.frame);
return {ok:errors.length===0,errors};
}
function mutate(x,changes){const y=JSON.parse(JSON.stringify(x));for(const c of changes){const parts=c.path.split(".");let z=y;for(const p of parts.slice(0,-1))z=z[p];z[parts.at(-1)]=c.value}return y}
function run(){const root=path.join(__dirname,".."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));const s=read("research/sources/CAP-06-05-seal-hash-b25.json"),t=read("research/traces/CAP-06-05-seal-hash-b25-v08.json"),f=read("docs/capabilities/CAP-06-05/seal-hash-b25-fixtures-v08.json");if(s.sources.length!==5||t.rules.length!==7||f.cases.length<40||f.syntheticOnly!==true||f.notRealOcct!==true)throw Error("B25_COUNTS");const si=new Set(s.sources.map(x=>x.id)),ci=new Set(f.cases.map(x=>x.id));if(si.size!==5||ci.size!==f.cases.length)throw Error("B25_IDS");for(const z of s.sources)if(!z.url||!z.edition||!z.locator||!z.accessDepth||!z.limits)throw Error("B25_SOURCE");for(const z of t.rules)if(!z.fields.length||!z.workPackages.length||z.sourceIds.some(x=>!si.has(x))||z.positiveIds.some(x=>!ci.has(x))||z.negativeIds.some(x=>!ci.has(x)))throw Error("B25_TRACE");for(const z of f.cases){const a=validate(mutate(f.base,z.mutations));if(z.expected==="PASS"?!a.ok:!a.errors.includes(z.ruleId))throw Error("B25_CASE_"+z.id)}console.log("B25_SYNTHETIC_PLANNING_PASS "+f.cases.length+"/"+f.cases.length+" REAL_OCCT_D07_NC_NOT_RUN")}
if(require.main===module)run();
module.exports={validate,mutate,run};
