#!/usr/bin/env node
"use strict";
// V0.8跨11域研究交叉复核：只读规划JSON，绝不访问产品仓或设备。
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const ensure=(cond,msg)=>{if(!cond)throw new Error(msg)};
function verify(m,owners,p,index,src,tr,fixtures){
 const results=[],check=(id,fn)=>{fn();results.push(id)};
 const haveCap=new Set(p.capabilities.drafted.map(x=>x.id));
 const haveWp=new Set(p.workPackages.detailed.map(x=>x.id));
 const registries=new Set(index.registries.map(x=>x.path));
 const sourceIds=new Set(src.sources.map(x=>x.id));
 const expectedOwner=Object.fromEntries(owners.contracts.map(x=>[x.assetId,x.ownerDomain]));
 const ids=m.domains.map(x=>x.domainId),unique=a=>new Set(a).size===a.length;
 check("全域编号",()=>ensure(ids.join(",")==="01,02,03,04,05,06,07,08,09,10,11","11域编号/顺序错误"));
 check("17资产Owner候选集",()=>ensure(Object.keys(expectedOwner).length===17 && JSON.stringify(m.expectedAssetOwners)===JSON.stringify(expectedOwner),"17资产Owner原候选映射发生偏移"));
 check("来源及追踪",()=>{ensure(src.registeredRecords===src.sources.length,"来源数量不一致");ensure(tr.rules.length===11&&unique(tr.rules.map(x=>x.id)),"规则不足或重号");ensure(registries.has(tr.sourceRegistry)&&tr.sourceRegistry===m.baseline.sourceRegistry||tr.sourceRegistry===fixtures.sourceRegistry,"来源登记路径无效");});
 for(const d of m.domains){
  check("XDOM-POS-"+d.domainId,()=>{
   const expected=Object.keys(expectedOwner).filter(x=>expectedOwner[x]===d.domainId).sort();
   ensure(JSON.stringify(d.ownerAssetIds.slice().sort())===JSON.stringify(expected),"域"+d.domainId+"业务写权越界");
   ensure(!d.ownerAssetIds.includes(d.forbiddenWriteAsset),"域"+d.domainId+"包含禁止写入资产");
   ensure(haveCap.has(d.anchorCapability)&&haveWp.has(d.anchorWorkPackage),"域"+d.domainId+"CAP或原包不存在");
   ensure(d.anchorTrace==="research/traces/"+d.anchorCapability+".json" && d.anchorRegistry==="research/sources/"+d.anchorCapability+".json" && registries.has(d.anchorRegistry),"域"+d.domainId+"研究锚点无登记");
   const r=tr.rules.find(x=>x.positiveAcceptance==="XDOM-POS-"+d.domainId);
   ensure(r && r.negativeAcceptance==="XDOM-NEG-"+d.domainId && r.capabilities.includes(d.anchorCapability) && r.workPackages.includes(d.anchorWorkPackage) && r.sourceIds.every(s=>sourceIds.has(s)) && r.fields.length>=4,"规则来源/字段/CAP/包/验收链断裂");
  });
 }
 const g=m.crossGuards;
 const required={d04SetupDistinctD10Execution:true,clOnlyGrantsRelease:false,unknownSemanticsGrantsRelease:false,opcServiceGoodOverridesBadItem:false,solverMayOverwriteFrozenD08:false,singleBabylonWorld:true,unifiedLeftTaskPanel:true,lateCancelAckRestoresWrite:false};
 for(const [k,v] of Object.entries(required))check("XDOM-GPOS-"+k,()=>ensure(g[k]===v,"跨域门禁变更："+k));
 check("NC链完整",()=>ensure(JSON.stringify(g.ncReleaseChain)===JSON.stringify(["D09","D12","D13","D14","D15","D16"]),"NC工程证据链中断"));
 check("Owner事务必要检查",()=>ensure(["ACL_RECHECK","SCOPE_EPOCH_RECHECK","EXPECTED_REVISION","EXPECTED_HASH","FRAME_CONSISTENCY","CAS","CANCEL_GENERATION","RECEIPT_AUDIT"].every(x=>g.ownerWriteChecks.includes(x)),"Owner写入前必要重验缺失"));
 const rejected=[];
 for(const c of fixtures.domainNegative){
  const bad=JSON.parse(JSON.stringify(m)),d=bad.domains.find(x=>x.domainId===c.domainId);
  d.ownerAssetIds.push(c.assetId);
  try{const ex=Object.keys(expectedOwner).filter(x=>expectedOwner[x]===d.domainId).sort();ensure(JSON.stringify(d.ownerAssetIds.slice().sort())===JSON.stringify(ex),"预期拒绝");throw Error("NEGATIVE_MUTATION_ACCEPTED")}catch(e){ensure(e.message!=="NEGATIVE_MUTATION_ACCEPTED","未捕获域负例");rejected.push(c.id)}
 }
 for(const c of fixtures.guardNegative){const bad=JSON.parse(JSON.stringify(m));bad.crossGuards[c.guard]=!bad.crossGuards[c.guard];try{ensure(bad.crossGuards[c.guard]===required[c.guard],"预期拒绝");throw Error("NEGATIVE_MUTATION_ACCEPTED")}catch(e){ensure(e.message!=="NEGATIVE_MUTATION_ACCEPTED","未捕获门禁负例");rejected.push(c.id)}}
 ensure(rejected.length===19,"负向变异数量异常");
 return {positive:results.length,rejected:rejected.length,total:results.length+rejected.length,status:"PASS_PLANNING_ONLY",nodeRuntime:"NODE_SCRIPT_ACTUAL",product:"NOT_RUN"};
}
if(require.main===module){
 const result=verify(load("docs/architecture/v0.8/11域研究交叉复核_2026-10-28.json"),load("docs/architecture/v0.8/owner-interface-review-v08.json"),load("tracking/progress.json"),load("research/source-index.json"),load("research/sources/DOMAIN-CROSSCHECK-V08.json"),load("research/traces/DOMAIN-CROSSCHECK-V08.json"),load("docs/architecture/v0.8/11域研究交叉验收_2026-10-28.json"));
 process.stdout.write(JSON.stringify(result,null,2)+"\n");
}
module.exports={verify};
