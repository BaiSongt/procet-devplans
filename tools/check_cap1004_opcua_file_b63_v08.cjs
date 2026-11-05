#!/usr/bin/env node
"use strict";
// B63：只读合成检查器，不能连接机床、下发程序或授予NC工程资格。
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,"../docs/capabilities/CAP-10-04/opcua-file-b63-fixtures-v08.json"),"utf8"));
function judge(x,hash){
  if(!x||!x.owner||!x.capability||!x.session||!x.read||!x.resume||!x.access||!x.digest||!x.flow||!x.ui)return "UNKNOWN";
  const o=x.owner,c=x.capability,s=x.session,r=x.read,z=x.resume,a=x.access,d=x.digest,f=x.flow,u=x.ui;
  const missing=v=>v===null||v===undefined;
  if(o.aclRechecked===false)return "REJECT";
  if(o.cancelled===true||s.lateAck===true)return "STALE";
  if([o.revision,o.expectedRevision,o.hash,o.expectedHash,o.frame,o.expectedFrame,o.scopeEpoch,o.expectedScopeEpoch,o.taskGeneration,o.expectedTaskGeneration].some(missing))return "UNKNOWN";
  if(o.revision!==o.expectedRevision||o.hash!==o.expectedHash||o.frame!==o.expectedFrame||o.scopeEpoch!==o.expectedScopeEpoch||o.taskGeneration!==o.expectedTaskGeneration)return "STALE";
  if(missing(o.aclRechecked)||missing(o.cancelled))return "UNKNOWN";
  if([c.fileTypeConfirmed,c.filePortConfirmed,c.targetProfileExact].some(missing))return "UNKNOWN";
  if(c.fileTypeConfirmed!==true||c.filePortConfirmed!==true||c.targetProfileExact!==true)return "REJECT";
  if([s.activeSession,s.handleSession,s.currentEpoch,s.handleEpoch,s.ackEpoch,s.lateAck].some(missing))return "UNKNOWN";
  if(s.activeSession!==s.handleSession||s.handleEpoch!==s.currentEpoch||s.ackEpoch!==s.currentEpoch)return "STALE";
  if(!Array.isArray(r.requests)||!Array.isArray(r.parts)||!Array.isArray(r.observedPositions)||r.requests.length!==r.parts.length||r.requests.length!==r.observedPositions.length||r.requests.length<2)return "UNKNOWN";
  let cursor=0;
  for(let i=0;i<r.requests.length;i++){
    const req=r.requests[i],part=r.parts[i];
    if(missing(req)||missing(part)||missing(r.observedPositions[i]))return "UNKNOWN";
    if(!Number.isSafeInteger(req)||req<=0||typeof part!=="string"||part.length%2!==0||!/^[0-9a-fA-F]*$/.test(part))return "REJECT";
    const n=part.length/2;
    if(n>req||(n===0&&i<r.requests.length-1))return "REJECT";
    cursor+=n;
    if(r.observedPositions[i]!==cursor)return "REJECT";
    if(n<req&&i<r.requests.length-1&&r.terminatedOnShortRead===true)return "REJECT";
  }
  if(missing(r.expectedLength)||missing(r.terminatedOnShortRead))return "UNKNOWN";
  if(r.parts[r.parts.length-1]!=="")return "UNKNOWN";
  if(cursor!==r.expectedLength)return cursor>r.expectedLength?"REJECT":"UNKNOWN";
  if([z.requestedOffset,z.confirmedOffset,z.fileSize,z.getPositionObserved].some(missing))return "UNKNOWN";
  if(z.getPositionObserved!==true)return "UNKNOWN";
  if(![z.requestedOffset,z.confirmedOffset,z.fileSize].every(v=>Number.isSafeInteger(v)&&v>=0))return "REJECT";
  if(z.requestedOffset>z.fileSize||z.confirmedOffset!==z.requestedOffset)return "REJECT";
  if([a.writable,a.userWritable,a.aclRechecked,a.activeFileProtected].some(missing))return "UNKNOWN";
  if(a.writable!==true||a.userWritable!==true||a.aclRechecked!==true||a.activeFileProtected!==true)return "REJECT";
  if([d.sourceHex,d.expectedHash,d.receiverHex,d.receiverClosureHash,d.expectedClosureHash,d.independentlyReadBack].some(missing))return "UNKNOWN";
  if(d.independentlyReadBack!==true)return "UNKNOWN";
  if(typeof d.receiverHex!=="string"||typeof d.sourceHex!=="string"||!/^(?:[0-9a-fA-F]{2})*$/.test(d.receiverHex)||!/^(?:[0-9a-fA-F]{2})*$/.test(d.sourceHex))return "REJECT";
  const assembled=r.parts.slice(0,-1).join("").toLowerCase();
  if(assembled!==d.receiverHex.toLowerCase()||d.sourceHex.toLowerCase()!==d.receiverHex.toLowerCase()||d.receiverClosureHash!==d.expectedClosureHash)return "REJECT";
  if(typeof hash!=="function")return "UNKNOWN";
  if(hash(d.receiverHex.toLowerCase())!==d.expectedHash)return "REJECT";
  if([f.stageOnly,f.noCycleStart,f.noProgramActivate,f.noPublishPassClaim,u.singleBabylonWorld,u.unifiedTaskPanel,u.sameOwnerPort].some(missing))return "UNKNOWN";
  if([f.stageOnly,f.noCycleStart,f.noProgramActivate,f.noPublishPassClaim,u.singleBabylonWorld,u.unifiedTaskPanel,u.sameOwnerPort].some(v=>v!==true))return "REJECT";
  return "CANDIDATE_ONLY";
}
function patch(x,p,val){const keys=p.split(".");let t=x;for(let i=0;i<keys.length-1;i++)t=t[keys[i]];t[keys[keys.length-1]]=val;}
const hash=h=>crypto.createHash("sha256").update(Buffer.from(h,"hex")).digest("hex");
let passed=0;
for(const c of fixture.cases){const input=JSON.parse(JSON.stringify(fixture.base));for(const [p,v] of Object.entries(c.patch))patch(input,p,v);const actual=judge(input,hash);if(actual!==c.expected)throw Error(c.id+": "+actual+" != "+c.expected);passed++;}
console.log(JSON.stringify({cases:passed,kind:"SYNTHETIC_ONLY",product:"NOT_RUN",independentReceiver:"NOT_RUN"}));
