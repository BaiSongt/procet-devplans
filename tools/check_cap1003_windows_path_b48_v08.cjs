"use strict";
// 仅核验规划合成归档成员元数据，不读取实际U盘/机床或授予签发与启动资格。
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const sha=v=>typeof v==="string"&&/^[a-f0-9]{64}$/.test(v);
const result=(status,code)=>({status,code});
function pathJudge(name){
 if(typeof name!=="string"||!name.length||name.startsWith("/")||/^[A-Za-z]:/.test(name))return result("REJECTED","ABSOLUTE");
 if(name.includes("\\"))return result("REJECTED","BACKSLASH");
 if(name.includes(":"))return result("REJECTED","STREAM");
 const segments=name.split("/");
 if(segments.some(x=>!x||x==="."||x===".."))return result("REJECTED","TRAVERSAL");
 for(const seg of segments){
  if(/[\u0000-\u001f\u007f]/.test(seg))return result("REJECTED","CONTROL");
  if(/[<>"|?*]/.test(seg))return result("REJECTED","INVALID_CHAR");
  if(/[. ]$/.test(seg))return result("REJECTED","TRAILING");
  if(/^(CON|PRN|AUX|NUL|COM[1-9¹²³]|LPT[1-9¹²³])(?:\..*)?$/i.test(seg))return result("REJECTED","DEVICE");
  // 此Portable V1子集不宣称实现Windows完整Unicode case-fold或8.3别名。
  if(/[^\x20-\x7e]/.test(seg))return result("UNKNOWN","UNICODE_POLICY");
 }
 return null;
}
function judge(x){
 if(!x||!x.identity||!x.profile||!x.archive||!x.manifest||!x.budget||!x.receiver||!x.owner||!x.ui||!x.gate)return result("REJECTED","SHAPE");
 const {identity:i,profile:p,archive:a,manifest:m,budget:b,receiver:r,owner:o,ui:u,gate:g}=x;
 if(!o.aclGranted)return result("REJECTED","ACL");
 if(!o.casMatched||o.actualRevision!==o.expectedRevision)return result("REJECTED","CAS");
 if(i.scopeEpoch!==o.scopeEpoch)return result("REJECTED","EPOCH");
 if(o.cancelled||o.cancelGeneration!==o.ackGeneration)return result("REJECTED","CANCEL");
 if(o.lateAck)return result("REJECTED","LATE_ACK");
 if(o.freezeAfter!==o.freezeBefore||!sha(o.freezeBefore))return result("REJECTED","FREEZE");
 if(o.pairedReaderRollback!==true||o.d17AppendOnly!==true)return result("REJECTED","ROLLBACK");
 if(o.d10Frame!==i.d10Frame)return result("REJECTED","FRAME");
 if(o.d10Revision!==i.d10Revision||i.d10Revision===i.d04Revision)return result("REJECTED","REVISION");
 if(!sha(i.d12Hash)||!sha(i.d16Hash)||!sha(i.manifestHash)||!i.d04Revision||!i.d10Revision||!i.d10Frame)return result("REJECTED","SHAPE");
 if(r.d12Hash!==i.d12Hash)return result("REJECTED","RAW_BYTES");
 if(r.d16Hash!==i.d16Hash)return result("REJECTED","RELEASE_ID");
 if(r.manifestHash!==i.manifestHash||r.stagingIsolated!==true)return result("REJECTED","MANIFEST_MISMATCH");
 if(!(u.entries==="GUI|CLI|Agent"&&u.ownerPort==="10.OfflineTransferPort"&&u.babylonWorlds===1&&u.leftTaskPanel===true&&u.maxFontPx<=12&&u.maxFontPx>0&&u.previewWrites===false))return result("REJECTED","UI");
 if(!(g.d13==="NOT_RUN"&&g.d14==="NOT_RUN"&&g.d15==="NOT_RUN"&&g.d16==="BLOCKED"&&g.clPromotedToD15===false&&g.receipt==="D17_APPEND_ONLY"))return result("REJECTED","GATE");
 if(!(p.fileSystem==="NTFS"&&p.hostVerified===true&&p.reparseAuditAvailable===true&&p.archiveFormat==="ZIP"&&p.policy==="ASCII_PORTABLE_V1"))return result("UNKNOWN","HOST");
 if(!Array.isArray(a.entries)||!Array.isArray(m.entries))return result("REJECTED","SHAPE");
 if(![b.maxEntries,b.maxTotalBytes,b.maxEntryBytes].every(z=>Number.isSafeInteger(z)&&z>0))return result("REJECTED","BUDGET");
 if(a.entries.length>b.maxEntries||a.entries.some(e=>!Number.isSafeInteger(e.size)||e.size<0||e.size>b.maxEntryBytes)||a.entries.reduce((s,e)=>s+e.size,0)>b.maxTotalBytes)return result("REJECTED","BUDGET");
 const canonical=[];
 for(const e of a.entries){
  const pg=pathJudge(e.name);if(pg)return pg;
  if(e.kind!=="regular"){
   if(["symlink","junction","hardlink","reparse"].includes(e.kind))return result("REJECTED","LINK_TYPE");
   return result("UNKNOWN","ENTRY_TYPE");
  }
  if(!sha(e.rawHash))return result("REJECTED","MANIFEST_MISMATCH");
  canonical.push(e.name.toLowerCase());
 }
 for(let j=0;j<canonical.length;j++)for(let k=j+1;k<canonical.length;k++){
  if(canonical[j]===canonical[k])return result("REJECTED","ALIAS_COLLISION");
  if(canonical[j].startsWith(canonical[k]+"/")||canonical[k].startsWith(canonical[j]+"/"))return result("REJECTED","FILE_PARENT");
 }
 if(m.entries.length!==a.entries.length)return result("REJECTED","MANIFEST_MISMATCH");
 for(let j=0;j<a.entries.length;j++){
  const e=a.entries[j],z=m.entries[j];
  if(!z||e.name!==z.name||e.kind!==z.kind||e.size!==z.size||e.rawHash!==z.rawHash)return result("REJECTED","MANIFEST_MISMATCH");
 }
 if(a.entries[0]?.rawHash!==i.d12Hash)return result("REJECTED","RAW_BYTES");
 if(r.signatureEvidence!=="SYNTHETIC_ONLY")return result("UNKNOWN","SIGNATURE");
 return result("PLANNING_CANDIDATE","SYNTHETIC_ONLY");
}
function setField(o,p,v){const seg=p.split(".");let cur=o;for(let j=0;j<seg.length-1;j++){if(!(seg[j] in cur))throw Error("invalid path "+p);cur=cur[seg[j]];}if(!(seg[seg.length-1] in cur))throw Error("invalid leaf "+p);cur[seg[seg.length-1]]=v;}
function diff(a,b,p="",out=[]){
 if(a===b)return out;
 if(a&&b&&typeof a==="object"&&typeof b==="object"&&!Array.isArray(a)&&!Array.isArray(b)){
  for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],p?p+"."+k:k,out);
 }else if(Array.isArray(a)&&Array.isArray(b)){
  for(let j=0;j<Math.max(a.length,b.length);j++)diff(a[j],b[j],p?p+"."+j:String(j),out);
 }else if(JSON.stringify(a)!==JSON.stringify(b))out.push(p);
 return out;
}
const s=read("research/sources/CAP-10-03-windows-path-b48.json"),t=read("research/traces/CAP-10-03-windows-path-b48-v08.json"),f=read("docs/capabilities/CAP-10-03/windows-path-b48-fixtures-v08.json");
const errors=[],sid=new Set(s.sources.map(z=>z.id)),rid=new Set(t.rules.map(z=>z.id)),cid=new Set(f.cases.map(z=>z.id));
if(sid.size!==s.sources.length||rid.size!==t.rules.length||cid.size!==f.cases.length)errors.push("duplicate source/rule/case ID");
for(const z of t.rules){
 if(!z.fields.length||!z.sourceIds.length||!z.capabilityIds.includes("CAP-10-03")||!z.workPackageIds.includes("E3-06")||!z.workPackageIds.includes("T5-03")||!z.positiveIds.length||!z.negativeIds.length)errors.push("incomplete trace "+z.id);
 for(const src of z.sourceIds)if(!sid.has(src))errors.push("missing source "+src);
 for(const [ids,k] of [[z.positiveIds,"positive"],[z.negativeIds,"negative"],[z.unknownIds,"unknown"]])for(const id of ids)if(f.cases.find(q=>q.id===id)?.kind!==k)errors.push("unmapped "+id);
}
for(const c of f.cases){
 const x=JSON.parse(JSON.stringify(f.base));
 if(c.kind!=="positive"){setField(x,c.mutatedField,c.mutatedValue);if(JSON.stringify(diff(f.base,x))!==JSON.stringify([c.mutatedField]))errors.push("not single-field "+c.id);if(!rid.has("B48-"+c.ruleId))errors.push("missing rule "+c.id);}
 const actual=judge(x);
 if(JSON.stringify(actual)!==JSON.stringify(c.expected))errors.push(c.id+" expected "+JSON.stringify(c.expected)+" actual "+JSON.stringify(actual));
}
for(const k of ["positive","negative","unknown"])if(f.cases.filter(c=>c.kind===k).length!==f[k+"Count"])errors.push("count "+k);
if(errors.length){console.error(JSON.stringify({status:"FAIL",errors}));process.exitCode=1;}
else console.log(JSON.stringify({status:"PASS",grade:"SYNTHETIC_PLANNING_ONLY",total:f.cases.length,positive:f.positiveCount,negative:f.negativeCount,unknown:f.unknownCount,windowsHost:"NOT_RUN",realReceiver:"NOT_RUN",consumer:"NOT_RUN"}));
