// B169 仅规划合成验收。不能替代OCCT真实运行、D02签署、NC验证。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const fx=read('docs/capabilities/CAP-03-05/seam-periodic-b169-fixtures-v08.json'),tr=read('research/traces/CAP-03-05-seam-periodic-b169-v08.json'),so=read('research/sources/CAP-03-05-seam-periodic-b169.json');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const pd=(a,b,p)=>{if(![a,b,p].every(Number.isFinite)||p<=0)return NaN;let r=((a-b)%p+p)%p;return Math.min(r,p-r)};
const fields=[["seam.faceScoped","seam.pcurveCount","seam.closedOnFace","seam.periodicSurface"],["uv.uStart","uv.uEnd","uv.uPeriod","uv.vGap"],["role.edgeClassification","role.cutBoundaryClaim","role.independentEvidenceRequired","role.sameFace"],["degen.flag","degen.curve3dPresent","degen.checkedSeparately","degen.classification"],["wire.seamStatus","wire.pcurveOrientationOK","wire.sameParameter","wire.brepValidityChecked"],["refs.sourceHash","refs.designRevision","refs.occurrenceFrame","refs.topologyHistory"],["ui.oneWorld","ui.leftTaskPanel","ui.sharedOwnerPort","ui.previewNoCommit"],["commit.casRechecked","commit.aclRechecked","commit.cancelFenceFresh","commit.lateAckRejected"],["chain.d04D10Separated","chain.clNeutral","chain.d13UnknownBlocks","chain.d15D16NotCertified"]];
const expected=[[true,2,true,true],[0,6.283185307179586,6.283185307179586,0],["SEAM_ONLY",false,true,true],[false,true,true,"NONDEGENERATE_SEAM"],["OK",true,true,true],["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","D01@r27","worldFromPart@r5","CURRENT"],[true,true,true,true],[true,true,true,true],[true,true,true,true]];
function judge(id,x){let i=Number(id.slice(-2))-1;if(i===1)return Number.isFinite(x['uv.uPeriod'])&&x['uv.uPeriod']>0&&pd(x['uv.uStart'],x['uv.uEnd'],x['uv.uPeriod'])<1e-8&&Math.abs(x['uv.vGap'])<1e-8;
if(i===5)return /^[a-f0-9]{64}$/.test(x['refs.sourceHash'])&&/^D01@r\\d+$/.test(x['refs.designRevision'])&&/^worldFromPart@r\\d+$/.test(x['refs.occurrenceFrame'])&&x['refs.topologyHistory']==='CURRENT';
return i>=0&&i<9&&fields[i].every((k,j)=>same(x[k],expected[i][j]));}
if(so.records.length!==7||tr.rules.length!==9||fx.cases.length!==45||fx.goldens.length!==8)throw Error('数量不符');
const ids=new Set(so.records.map(x=>x.id)),tests=new Set(fx.cases.map(x=>x.id));
if(ids.size!==7||tests.size!==45)throw Error('重复ID');
for(const r of tr.rules)if(r.fields.length!==4||r.sourceIds.some(x=>!ids.has(x))||r.testIds.length!==5||r.testIds.some(x=>!tests.has(x))||!r.originalWorkPackages.includes('F1-04'))throw Error('追踪断链 '+r.id);
let pass=0;for(const c of fx.cases){let r=tr.rules.find(x=>x.id===c.ruleId);if(!r)throw Error('无效规则');let x={...fx.baseline,...c.patch};let actual=judge(r.id,x)?'REVIEW_ONLY':'REJECT';if(actual!==c.expected)throw Error(c.id+' '+actual);let delta=Object.keys(fx.baseline).filter(k=>!same(fx.baseline[k],x[k]));if(c.kind==='POSITIVE'&&delta.length||c.kind==='ONE_FIELD_NEGATIVE'&&(delta.length!==1||delta[0]!==c.changedField||!r.fields.includes(c.changedField)))throw Error('非单字段 '+c.id);pass++;}
for(const g of fx.goldens){if(Math.abs(pd(g.uStart,g.uEnd,g.period)-g.expected)>1e-8)throw Error('数值Golden '+g.id);pass++;}
console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_ONLY',checked:pass,owner:'NOT_SIGNED',consumer:'NOT_RUN',product:'NOT_RUN'}));
