// 原F1-02规划补证检查：机器正反/独立字段变异与数学解析；不测试产品。
'use strict';const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const t=load('research/traces/F1-02.json'),s=load('research/sources/F1-02.json'),f=load('docs/work-packages/F1-02/fixtures.json');const ids=new Set(s.sources.map(x=>x.id)),get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);let passed=0;
if(t.rules.length!==10||s.sources.length!==8||ids.size!==8||f.cases.length!==30||f.mathVectors.length!==6)throw Error('COUNTS');
for(const r of t.rules){if(r.sourceIds.some(x=>!ids.has(x))||r.fields.length!==4||!r.originalAcceptanceId||!r.capabilities.length)throw Error('TRACE');let c=f.cases.filter(x=>x.ruleId===r.id);if(c.length!==3||new Set(c.map(x=>x.scenario)).size!==3)throw Error('SCENARIOS');for(const a of c){if(a.scenario!=='POSITIVE'&&!r.fields.includes(a.mutatedField))throw Error('MUTATION');let v=r.criteria.every(x=>get(a.input,x.path)===x.value)?'PASS':'REJECT';if(v!==a.expected)throw Error(a.id);passed++;}}
const rot=(v,degrees)=>{let a=degrees*Math.PI/180;return [Math.cos(a)*v[0]-Math.sin(a)*v[1],Math.sin(a)*v[0]+Math.cos(a)*v[1],v[2]];};
const add=(a,b)=>a.map((x,i)=>x+b[i]),near=(a,b)=>a.every((x,i)=>Math.abs(x-b[i])<1e-9);
for(const v of f.mathVectors){let ok=false;
if(v.kind==='RZ90_POINT')ok=near(rot(v.point,v.rotationDeg),v.expected);
if(v.kind==='TRANSLATION_DIRECTION')ok=near(v.vector,v.expected);
if(v.kind==='NONCOMMUTATIVE'){let ab=add(v.a.translate,rot(v.point,v.b.rotateZdeg)),ba=rot(add(v.a.translate,v.point),v.b.rotateZdeg);ok=near(ab,v.ab)&&near(ba,v.ba)&&!near(ab,ba);}
if(v.kind==='INVERSE_ROUNDTRIP'){let world=add(rot(v.point,v.rotationDeg),v.translation),back=rot(world.map((x,i)=>x-v.translation[i]),-v.rotationDeg);ok=near(back,v.expected);}
if(v.kind==='REFLECTION')ok=v.determinant<0&&v.expected==='REJECT';
if(v.kind==='STALE_SCOPE')ok=v.expectedEpoch!==v.actualEpoch&&v.expected==='REJECT';
if(!ok)throw Error(v.id);passed++;}
console.log(JSON.stringify({kind:'PLANNING_SYNTHETIC_ONLY',passed,realNC:'NOT_RUN',realOCCT:'NOT_RUN',realB5:'NOT_RUN',independentConsumer:'NOT_RUN'}));