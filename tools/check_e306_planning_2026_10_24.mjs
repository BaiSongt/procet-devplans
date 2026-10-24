#!/usr/bin/env node
// E3-06纯规划结构与正反案例检测；不计算真实签名，不读取真实NC，不授予生产发布资格。
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const argi=process.argv.indexOf('--root'), root=path.resolve(argi<0?'.':process.argv[argi+1]);
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const assert=(cond,msg)=>{if(!cond) throw new Error('E3-06规划校验失败: '+msg);};
export function classify(rule,gates){
 const missing=Object.entries(gates).filter(([,v])=>v!==true).map(([k])=>k);
 if(!missing.length)return {status:'PLANNING_CONTRACT_CANDIDATE_NOT_RELEASED',code:'D16_CONTRACT_READY_ONLY'};
 return missing.length===1&&missing[0]===rule.fixtureGate
 ?{status:'PLANNING_BLOCKED_OR_UNKNOWN',code:rule.failureCode}
 :{status:'PLANNING_BLOCKED_OR_UNKNOWN',code:'MULTIPLE_GATE_FAILURES'};
}
export function safePath(p){
 return typeof p==='string'&&p.length>0&&!p.includes('\\')&&!p.startsWith('/')&&!/^[a-zA-Z]:/.test(p)&&
 p.split('/').every(x=>x!=='.'&&x!=='..'&&x!==''&&x!=='~')&&!p.includes('\0');
}
export function validate(trace,fixture,source,owner,manifest){
 assert(trace.workPackageId==='E3-06'&&fixture.workPackageId==='E3-06','原编号');
 assert(trace.rules.length===10&&fixture.cases.length===20&&fixture.gateKeys.length===10,'规则、验收或门禁数量');
 assert(source.sources.length===10&&source.registeredRecords===10,'研究来源数量');
 assert(new Set(source.sources.map(x=>x.id)).size===10,'研究来源ID重复');
 assert(source.sources.every(x=>x.url?.startsWith('https://')&&x.accessDepth&&x.locator&&x.limits&&x.published&&x.accessedOn),'来源元数据不完整');
 assert(owner.assets.length===17&&new Set(owner.assets.map(x=>x.id)).size===17,'资产Owner候选矩阵有缺漏');
 assert(owner.assets.every(x=>x.approval==='PENDING_CROSS_DOMAIN_REVIEW'),'不得代签Owner');
 const sids=new Set(source.sources.map(x=>x.id)), aids=new Set(owner.assets.map(x=>x.id));
 const rids=new Set(),seen=new Set();
 for(const r of trace.rules){
  assert(!rids.has(r.id),'重复规则ID');rids.add(r.id);
  assert(r.workPackageId==='E3-06'&&fixture.gateKeys.includes(r.fixtureGate),'规则门禁');
  assert(r.sourceIds?.length&&r.fields?.length&&r.assets?.length,'追踪缺来源/字段/资产');
  for(const x of r.sourceIds)assert(sids.has(x),'未登记来源 '+x);
  for(const x of r.assets)assert(aids.has(x),'无效资产 '+x);
  for(const [pol,id] of [['positive',r.positiveTestId],['negative',r.negativeTestId]]){
   const f=fixture.cases.find(x=>x.id===id);
   assert(f&&f.ruleId===r.id&&f.polarity===pol&&!seen.has(id),'正反唯一映射 '+id);
   seen.add(id);
   assert(Object.keys(f.gates).length===10&&fixture.gateKeys.every(k=>Object.hasOwn(f.gates,k)),'门禁字段失配 '+id);
   const missing=Object.entries(f.gates).filter(([,v])=>v!==true).map(([k])=>k);
   assert(pol==='positive'?missing.length===0:missing.length===1&&missing[0]===r.fixtureGate,'正反只改变目标门禁 '+id);
   const actual=classify(r,f.gates);assert(actual.code===f.expectedCode&&actual.status===f.expectedStatus,'期望状态失配 '+id);
   assert(f.requiredIndependentConsumer==='D17_NOT_RUN'&&f.humanApproval==='PENDING_HUMAN'&&f.realNcVerification==='NOT_RUN','合成案例不能宣称真实批准/测试 '+id);
  }
 }
 assert(seen.size===20,'用例数量不完整');
 assert(manifest.synthetic===true&&manifest.emissionAllowed===false&&manifest.hashesArePlaceholders===true,'不能将模拟包作为生产包');
 assert(manifest.signature.status==='NOT_RUN'&&manifest.approval.authorizer==='PENDING_HUMAN','不能冒充密码学签名或审批');
 assert(manifest.package.files.length>0,'离线清单不能为空');
 const paths=new Set();
 for(const file of manifest.package.files){
  assert(safePath(file.path)&&!paths.has(file.path),'不安全或重复路径 '+file.path);
  paths.add(file.path);
  assert(file.isPlaceholder===true&&/^[0-9a-f]{64}$/.test(file.sha256),'占位hash格式');
 }
 return {rules:10,positive:10,negative:10,sources:10,ownerCandidates:17,offlineManifest:'SYNTHETIC_NOT_USABLE'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const t=read('research/traces/E3-06.json'),f=read('docs/work-packages/E3-06/fixtures.json'),s=read('research/sources/E3-06.json'),o=read('docs/work-packages/E3-06/asset-owner-consumer-matrix.json'),m=read('docs/work-packages/E3-06/offline-manifest.example.json');
 const result=validate(t,f,s,o,m);
 if(process.argv.includes('--self-test')){
  for(const r of t.rules){const pos=f.cases.find(x=>x.id===r.positiveTestId);const changed={...pos.gates,[r.fixtureGate]:false};assert(classify(r,changed).code===r.failureCode,'负例变异未捕获 '+r.id);}
  assert(!safePath('../escape.nc')&&!safePath('/absolute.nc')&&!safePath('a\\b.nc')&&!safePath('x/./b.nc')&&!safePath('C:/a.nc'),'路径逃逸故障变异');
  result.mutationChecks=15;
 }
 console.log(JSON.stringify({...result,status:'PLANNING_DATA_PASS_ONLY',nodeFileExecuted:true,product:'NOT_RUN',realSignature:'NOT_RUN',independentConsumer:'NOT_RUN'}));
}
