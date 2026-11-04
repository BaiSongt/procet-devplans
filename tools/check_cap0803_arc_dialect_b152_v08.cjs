#!/usr/bin/env node
"use strict";
// B152规划只读机器校验器：不调用OEM、不改产品文件，不表示工程验证。
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const valid=(id,x)=>{
 const vec2=a=>Array.isArray(a)&&a.length===2&&a.every(Number.isFinite);
 const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 switch(id){
 case "B152-R01":return ["d12Hash","d10Hash","profileHash"].every(k=>typeof x[k]==="string"&&/^[a-f0-9]{64}$/.test(x[k]))&&x.sourceKind==="FINAL_NC";
 case "B152-R02":return ["G17","G18","G19"].includes(x.plane)&&["G90.1","G91.1"].includes(x.arcCenterMode)&&["G90","G91"].includes(x.linearDistanceMode)&&["G20","G21"].includes(x.units);
 case "B152-R03":{const m={G17:["I","J"],G18:["I","K"],G19:["J","K"]};return !!m[x.plane]&&Array.isArray(x.offsetWords)&&x.offsetWords.length>0&&new Set(x.offsetWords).size===x.offsetWords.length&&x.offsetWords.every(w=>m[x.plane].includes(w))&&x.mixedRadius===false&&x.centerOffsetsPresent===true;}
 case "B152-R04":return ["G90.1","G91.1"].includes(x.mode)&&vec2(x.start)&&vec2(x.offset)&&vec2(x.declaredCenter)&&x.declaredCenter.every((n,i)=>Math.abs(n-(x.mode==="G91.1"?x.start[i]+x.offset[i]:x.offset[i]))<1e-9);
 case "B152-R05":return vec2(x.start)&&vec2(x.end)&&vec2(x.center)&&Number.isFinite(x.maxMismatch)&&x.maxMismatch>=0&&dist(x.start,x.center)>0&&Math.abs(dist(x.start,x.center)-dist(x.end,x.center))<=x.maxMismatch;
 case "B152-R06":{if(!vec2(x.start)||!vec2(x.end)||!Number.isFinite(x.signedRadius)||x.signedRadius===0)return false;const d=dist(x.start,x.end);return d>0&&d<=2*Math.abs(x.signedRadius)+1e-10&&x.arcClass===(x.signedRadius>0?"MINOR":"MAJOR");}
 case "B152-R07":return x.dialect==="LINUXCNC_2_9"&&Number.isInteger(x.turnCount)&&x.turnCount>=1&&Number.isFinite(x.partialSweepDeg)&&x.partialSweepDeg>0&&x.partialSweepDeg<=360&&Number.isFinite(x.totalSweepDeg)&&Math.abs(x.totalSweepDeg-(x.partialSweepDeg+360*(x.turnCount-1)))<1e-9;
 case "B152-R08":return x.d13Source==="D12_FINAL_BYTES"&&x.d14Source==="D13_EVENTS"&&x.d15Gate==="INDEPENDENT_UNKNOWN_BLOCKS"&&x.ownerCommit==="ACL_CAS_SCOPE_GENERATION_CANCEL_RECHECK";
 default:return false;
 }
}
const gold=(g)=>{
 const d=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 const sweep=(s,e,c,dir)=>{const a=Math.atan2(s[1]-c[1],s[0]-c[0]),b=Math.atan2(e[1]-c[1],e[0]-c[0]);let v=dir==="CCW"?b-a:a-b;while(v<=0)v+=Math.PI*2;return v*180/Math.PI};
 switch(g.kind){
 case "CENTER_INCREMENTAL":return g.start.map((v,i)=>v+g.offset[i]);
 case "CENTER_ABSOLUTE":return g.offset;
 case "G17_SWEEP_DEG":return sweep(g.start,g.end,g.center,g.direction);
 case "R_CHORD_FEASIBLE":return d(g.start,g.end)<=2*Math.abs(g.radius)&&d(g.start,g.end)>0;
 case "TURN_SWEEP":return g.partial+360*(g.turns-1);
 case "R_CENTER_CANDIDATES":{const [sx,sy]=g.start,[ex,ey]=g.end,r=Math.abs(g.radius),dx=ex-sx,dy=ey-sy,ch=Math.hypot(dx,dy),h=Math.sqrt(r*r-ch*ch/4),m=[(sx+ex)/2,(sy+ey)/2],n=[-dy/ch,dx/ch];return [1,-1].map(sign=>[m[0]+sign*h*n[0],m[1]+sign*h*n[1]]).map(p=>p.map(v=>Math.round(v*1e9)/1e9)).sort((a,b)=>a[0]-b[0]);}
 default:throw Error("UNKNOWN_GOLDEN_"+g.kind);
 }
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function main(){
 const rootArg=process.argv.indexOf("--root"); const root=path.resolve(rootArg>=0?process.argv[rootArg+1]:".");
 const trace=JSON.parse(fs.readFileSync(path.join(root,"research/traces/CAP-08-03-arc-dialect-b152-v08.json"),"utf8"));
 const fixtures=JSON.parse(fs.readFileSync(path.join(root,"docs/capabilities/CAP-08-03/arc-dialect-b152-fixtures-v08.json"),"utf8"));
 const sources=JSON.parse(fs.readFileSync(path.join(root,"research/sources/CAP-08-03-arc-dialect-b152.json"),"utf8"));
 assert.equal(trace.rules.length,8); assert.equal(sources.records.length,4);
 const ids=new Set(sources.records.map(s=>s.id)),seen=new Set();
 for(const rule of trace.rules){
   assert.equal(rule.fields.length,4);
   for(const sid of rule.sourceIds)assert(ids.has(sid),"missing source "+sid);
   const t=fixtures.tests.filter(x=>x.ruleId===rule.id);
   assert.equal(t.length,5);assert(same(rule.testIds,t.map(x=>x.id)));
   const pos=t.find(x=>x.expected==="PASS");assert(pos&&valid(rule.id,pos.input));
   for(const neg of t.filter(x=>x.expected==="FAIL")){
     const changed=rule.fields.filter(k=>!same(pos.input[k],neg.input[k]));
     assert.deepEqual(changed,[neg.mutationField],"not independent "+neg.id);
     assert.equal(valid(rule.id,neg.input),false,"should reject "+neg.id);
   }
   t.forEach(x=>{assert(!seen.has(x.id),"duplicate");seen.add(x.id)});
 }
 assert.equal(seen.size,40);
 for(const g of fixtures.goldens){
   const actual=gold(g);assert(same(actual,g.expected)||(typeof actual==="number"&&Math.abs(actual-g.expected)<1e-9),g.id);
 }
 assert.equal(fixtures.goldens.length,8);
 process.stdout.write("B152 规划合成 8正+32单字段反+8数学Golden：48/48 PASS；真实NC/OEM/独立消费者 NOT_RUN\n");
}
if(require.main===module)main();
