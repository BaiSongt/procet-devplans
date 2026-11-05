#!/usr/bin/env node
"use strict";
// B56规划独立执行入口，中文注释；仅在合成JSON上检查字节补丁结构。
// 不解析真实机床语义，不触及产品、客户数据、设备或真实NC。
const fs = require("node:fs");
const path = require("node:path");
function fromHex(hex) {
  if(typeof hex!=="string" || hex.length%2 || /[^0-9a-f]/i.test(hex)) return null;
  const a=[];
  for(let n=0;n<hex.length;n+=2)a.push(parseInt(hex.slice(n,n+2),16));
  return a;
}
function utf8Valid(a) {
  if(!Array.isArray(a))return false;
  for(let i=0;i<a.length;) {
    const b=a[i];
    if(b<0x80){i++;continue;}
    let n=0,lo=0x80,hi=0xbf;
    if(b>=0xc2&&b<=0xdf)n=2;
    else if(b===0xe0){n=3;lo=0xa0;}
    else if(b>=0xe1&&b<=0xec)n=3;
    else if(b===0xed){n=3;hi=0x9f;}
    else if(b>=0xee&&b<=0xef)n=3;
    else if(b===0xf0){n=4;lo=0x90;}
    else if(b>=0xf1&&b<=0xf3)n=4;
    else if(b===0xf4){n=4;hi=0x8f;}
    else return false;
    if(i+n>a.length||a[i+1]<lo||a[i+1]>hi)return false;
    for(let j=2;j<n;j++)if(a[i+j]<0x80||a[i+j]>0xbf)return false;
    i+=n;
  }
  return true;
}
function sha256Hex(hex) {
  const b=fromHex(hex);if(!b)return null;
  const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const m=b.slice();m.push(128);while(m.length%64!==56)m.push(0);
  const bits=b.length*8;
  for(let z=7;z>=0;z--)m.push(Math.floor(bits/2**(z*8))&255);
  const rot=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let off=0;off<m.length;off+=64) {
    const w=new Array(64);
    for(let i=0;i<16;i++){const p=off+i*4;w[i]=((m[p]<<24)|(m[p+1]<<16)|(m[p+2]<<8)|m[p+3])>>>0;}
    for(let i=16;i<64;i++){const a=w[i-15],z=w[i-2],s0=rot(a,7)^rot(a,18)^(a>>>3),s1=rot(z,17)^rot(z,19)^(z>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;}
    let [a,b0,c,d,e,f,g,v]=h;
    for(let i=0;i<64;i++){
      const s1=rot(e,6)^rot(e,11)^rot(e,25),ch=(e&f)^(~e&g),t1=(v+s1+ch+k[i]+w[i])>>>0;
      const s0=rot(a,2)^rot(a,13)^rot(a,22),maj=(a&b0)^(a&c)^(b0&c),t2=(s0+maj)>>>0;
      v=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;
    }
    for(let i=0;i<8;i++)h[i]=(h[i]+[a,b0,c,d,e,f,g,v][i])>>>0;
  }
  return h.map(v=>v.toString(16).padStart(8,"0")).join("");
}
function judge(x) {
  const fail=(why)=>({status:"REJECT",reason:why}),unknown=(why)=>({status:"UNKNOWN",reason:why});
  if(x?.syntheticOnly!==true)return fail("R08_NON_SYNTHETIC_CLAIM");
  const s=x.source,g=x.guard,a=x.audit,p=x.patch,expected=x.expected;
  if(!s||!g||!a||!p||!expected)return fail("R01_MISSING_STRUCTURE");
  if(s.encoding==null || s.encoding==="UNKNOWN")return unknown("R03_ENCODING_NOT_PROVEN");
  if(s.dialect==null||s.dialect==="UNKNOWN")return unknown("R03_DIALECT_NOT_PROVEN");
  if(s.encoding!=="UTF-8"||s.dialect!=="LinuxCNC-2.9")return unknown("R03_UNSUPPORTED_PROFILE");
  const bytes=fromHex(s.rawHex),insert=fromHex(p.replacementHex);
  if(!bytes||!insert)return fail("R02_INVALID_HEX");
  if(!utf8Valid(bytes)||!utf8Valid(insert))return fail("R03_UTF8_INVALID");
  const bh=sha256Hex(s.rawHex);
  if(bh!==s.sha256 || bh!==expected.sourceHash || s.revision!==expected.sourceRevision||
     s.frame!==expected.frame || s.scope!==expected.scope || s.schema!==expected.schema)return fail("R01_EXACT_SOURCE_MISMATCH");
  if(s.bom!=="UTF8"&&s.bom!=="NONE")return fail("R03_BOM_UNDECLARED");
  const hasBom=bytes[0]===0xef&&bytes[1]===0xbb&&bytes[2]===0xbf;
  if((s.bom==="UTF8")!==hasBom)return fail("R03_BOM_MISMATCH");
  if(s.eol!=="CRLF"&&s.eol!=="LF")return fail("R03_EOL_UNDECLARED");
  function eolOkay(arr) {
    for(let i=0;i<arr.length;i++){if(arr[i]===13){if(s.eol!=="CRLF"||arr[i+1]!==10)return false;i++;}else if(arr[i]===10&&s.eol==="CRLF")return false;}
    return true;
  }
  if(!eolOkay(bytes))return fail("R03_SOURCE_EOL_MISMATCH");
  if(p.kind!=="BYTE_SPAN"||p.coordinateUnit!=="OCTET"||p.utf16IndexUsed!==false)return fail("R02_UTF16_NOT_BYTE");
  if(!Number.isSafeInteger(p.start)||!Number.isSafeInteger(p.end)||p.start<0||p.end<p.start||p.end>bytes.length)return fail("R02_BAD_RANGE");
  if(hasBom&&p.start<3)return fail("R03_BOM_EDIT_BLOCKED");
  if(!utf8Valid(bytes.slice(0,p.start))||!utf8Valid(bytes.slice(p.end)))return fail("R02_SPLIT_CODEPOINT");
  if(sha256Hex(bytes.slice(p.start,p.end).map(z=>z.toString(16).padStart(2,"0")).join(""))!==p.beforeSha256)return fail("R04_RANGE_PREIMAGE_MISMATCH");
  if(p.rebaseWithoutReview!==false || p.autoNormalize!==false || p.writeOriginal!==false)return fail("R04_FORBIDDEN_REWRITE");
  const result=bytes.slice(0,p.start).concat(insert,bytes.slice(p.end));
  if(!utf8Valid(result)||!eolOkay(result))return fail("R03_RESULT_ENCODING_EOL");
  if(hasBom && (result[0]!==239||result[1]!==187||result[2]!==191))return fail("R03_BOM_LOST");
  if(result.some(v=>v===0))return fail("R03_NUL_IN_NC");
  if(g.acl!==true||g.casAtomic!==true||g.recheckAtCommit!==true||g.cancelled!==false||
     g.lateAckAccepted!==false||g.scopeEpoch!==g.expectedScopeEpoch||
     g.generation!==g.expectedGeneration||g.ownerPort!=="08.NcSourceOwnerPort"||
     !["GUI","CLI","Agent"].includes(g.entry))return fail("R05_OWNER_GUARD");
  if(a.d04D10Separate!==true||a.d08Frozen!==true||a.abSameFact!==true||
     a.singleBabylonWorld!==true||a.leftTaskPanel!==true||a.fontMaxPx!==12||
     JSON.stringify(a.entries)!=='["GUI","CLI","Agent"]'||a.samePort!==true)return fail("R06_CONTEXT_UI_INVARIANT");
  if(a.d13!=="STALE"||a.d14!=="STALE"||a.d15!=="STALE"||a.d16!=="BLOCKED"||
     a.clClaimsNcPass!==false||a.deviceAckClaimed!==false||a.ncResultClaim!=="NOT_RUN")return fail("R07_DOWNSTREAM_PROOF_INVALID");
  if(a.oldBytesImmutable!==true||a.newRevisionOnly!==true||a.sourceMapStale!==true||
     a.oldReaderCompatible!==true||a.rollbackNonDestructive!==true||
     a.independentConsumer!=="NOT_RUN"||a.ownerSignoff!=="PENDING_HUMAN"||
     a.l3!=="PENDING_HUMAN")return fail("R08_PROVENANCE_OR_FALSE_PASS");
  return {status:"PLANNING_VALID_EDIT_ONLY",reason:"SYNTHETIC_BYTE_PATCH_NOT_NC_VERIFIED",newSha256:sha256Hex(result.map(v=>v.toString(16).padStart(2,"0")).join(""))};
}
function setDot(o,p,v){const a=p.split(".");let z=o;for(let i=0;i<a.length-1;i++)z=z[a[i]];z[a[a.length-1]]=v;}
function fixtureInput(f,c) {
 const x=JSON.parse(JSON.stringify(f.base));
 if(c.variant==="BOM"||c.variant==="CHINESE"||c.variant==="LF"||c.variant==="INSERT") {
   const variants=f.positiveVariants;
   if(!variants||!variants[c.variant])throw Error("缺少正例变体："+c.variant);
   return JSON.parse(JSON.stringify(variants[c.variant]));
 }
 for(const [p,v] of c.changes||[])setDot(x,p,v);
 return x;
}
function selfTest(){
 const f=JSON.parse(fs.readFileSync(path.join(__dirname,"../docs/capabilities/CAP-08-06/byte-edit-b56-fixtures-v08.json"),"utf8"));
 if(sha256Hex("")!==f.sha256Golden.empty||sha256Hex("616263")!==f.sha256Golden.abc)throw Error("SHA256向量失败");
 let pos=0,neg=0,unk=0;
 const ids=new Set();
 for(const c of f.cases) {
  if(ids.has(c.id))throw Error("重复用例："+c.id);ids.add(c.id);
  const res=judge(fixtureInput(f,c));
  if(res.status!==c.expected)throw Error(c.id+"预期"+c.expected+"实际"+res.status+":"+res.reason);
  if(c.kind==="positive")pos++;else if(c.kind==="negative")neg++;else unk++;
 }
 process.stdout.write(JSON.stringify({kind:"SYNTHETIC_PLANNING_ONLY",positive:pos,negative:neg,unknown:unk,total:f.cases.length,status:"PASS",independentConsumer:"NOT_RUN",machine:"NOT_RUN"})+"\n");
}
if(require.main===module) {
 if(process.argv.includes("--self-test"))selfTest();
 else {process.stderr.write("用法：node tools/check_cap0806_byte_edit_b56_v08.cjs --self-test\n");process.exitCode=2;}
}
module.exports={judge,sha256Hex,utf8Valid};
