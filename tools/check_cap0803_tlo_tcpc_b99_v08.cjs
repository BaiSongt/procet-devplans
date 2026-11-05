'use strict';
const fs=require('node:fs'),path=require('node:path');
const fields=["guards.controllerProfilePinned","guards.controllerVersionPinned","guards.ncBytesShaPinned","guards.toolTableShaPinned","guards.hEntryResolved","guards.g431ReplaceG432Add","guards.haasInitialModalCaptured","guards.g49TransitionTracked","guards.g234HMrzpWcsPinned","guards.g234MutualExclusion","guards.rapidRotaryNotCertified","guards.postCompAxisLimitChecked","guards.d03D10Separate","guards.gaugeVectorFrameDeclared","guards.aclScopeCasCancelFence","guards.independentD15UnknownBlocksD16"];
function val(o,k){return k.split(".").reduce((x,p)=>x==null?undefined:x[p],o)}
function change(o,k,v){let p=k.split(".");let t=o;for(let i=0;i<p.length-1;i++)t=t[p[i]];t[p[p.length-1]]=v}
function judge(x){
for(const f of fields)if(val(x,f)!==true)return "REJECT";
if(!x.verified||!["LINUXCNC_2_9","HAAS_NGC_UMC"].includes(x.dialect)||!x.modalKnown)return "UNKNOWN";
if(x.h===0&&x.toolChanger==="unknown")return "UNKNOWN";
if(x.dialect==="LINUXCNC_2_9"){
if(x.code==="G43")return Number.isInteger(x.h)&&x.h>=0&&Object.hasOwn(x.table,String(x.h))&&x.offsetAction==="TABLE"?"DESIGN_OK":"REJECT";
if(x.code==="G43.1")return x.offsetAction==="REPLACE"&&Number.isFinite(x.axisWord)&&!x.commandedMotion?"DESIGN_OK":"REJECT";
if(x.code==="G43.2")return x.offsetAction==="ADD"&&Number.isInteger(x.h)&&Object.hasOwn(x.table,String(x.h))?"DESIGN_OK":"REJECT";
return "UNKNOWN"}
if(x.code!=="G234")return "UNKNOWN";
if(!Number.isInteger(x.h)||x.h<=0||!Object.hasOwn(x.table,String(x.h))||x.activeG43||x.activeG254||!x.mrzp||!x.wcs)return "REJECT";
if(x.rotaryRapid||!x.axisLimitsKnown)return "UNKNOWN";
return "DESIGN_OK"}
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const f=read("docs/capabilities/CAP-08-03/tlo-tcpc-b99-fixtures-v08.json"),s=read("research/sources/CAP-08-03-tlo-tcpc-b99.json"),t=read("research/traces/CAP-08-03-tlo-tcpc-b99-v08.json");
const ids=new Set(f.cases.map(x=>x.id)),src=new Set(s.sources.map(x=>x.id));if(ids.size!==f.cases.length||s.sources.length!==6||t.rules.length!==8)throw Error('count mismatch');
for(const r of t.rules){if(!r.positive.length||!r.negative.length||![...r.positive,...r.negative,...r.unknown].every(x=>ids.has(x))||!r.sourceIds.every(x=>src.has(x))||!r.fields.every(x=>fields.includes(x)))throw Error('trace gap '+r.id)}
for(const c of f.cases){let v=JSON.parse(JSON.stringify(f.baselines[c.base]));for(const [p,x]of Object.entries(c.patch))change(v,p,x);if(judge(v)!==c.expected)throw Error('case '+c.id)}
for(const g of f.golden)if(g.p.some((v,i)=>Math.abs(v-g.L*g.a[i]-g.tip[i])>1e-10))throw Error('golden '+g.id);
console.log(JSON.stringify({planningSynthetic:f.cases.length,mathGolden:f.golden.length,realController:'NOT_RUN',independentConsumer:'NOT_RUN'}));
