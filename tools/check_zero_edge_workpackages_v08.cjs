#!/usr/bin/env node
// 只读规划检查，不触发CI、不改产品数据
'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const map=read('docs/architecture/v0.8/cross-coverage-v08.json'),review=read('docs/architecture/v0.8/zero-edge-workpackage-review-v08.json'),f=read('docs/architecture/v0.8/zero-edge-workpackage-fixtures-v08.json');
const zero=new Set(map.gaps.packagesWithoutOriginalCapEdge),caps=new Set(map.capabilities.map(x=>x.id)),assets=new Set(map.assets.map(x=>x.id));
function vr(r){const o=map.workPackages.find(x=>x.id===r.id);return !!o&&zero.has(r.id)&&r.name===o.name&&r.detail===o.detail&&JSON.stringify(r.originalCapEdges)===JSON.stringify(o.directOriginalCapabilities)&&r.originalCapEdges.length===0&&r.relation==='REVIEW_ONLY_NO_DIRECT_EDGE'&&r.candidateConsumerCapIds.length>0&&r.candidateConsumerCapIds.every(x=>caps.has(x))&&r.candidateAssetIds.every(x=>assets.has(x))&&r.rationale.length>=10&&r.ownerApproval==='PENDING_HUMAN'&&r.independentConsumer==='NOT_RUN'&&r.product==='NOT_RUN'&&r.ownerWriteGranted===false;}
const yes=["singleBabylon","leftTaskPanel","guiCliAgentSamePort","aclScopeRevisionHashFrameCasCancelRecheck","d04D10Separated","abFrozenProtected","finalNcD13D14D15Required"],no=["unknownCanRelease","lateAckCanWrite","clAnimationCountsAsNcPass","requireMaterialSweep"],vp=p=>yes.every(k=>p[k]===true)&&no.every(k=>p[k]===false);
let n=0;for(const c of f.cases){let ok;if(c.kind.startsWith('POLICY')){const p={...review.policy};if(c.kind==='POLICY_NEG')p[c.key]=c.value;ok=vp(p)}else{const r={...review.packages.find(x=>x.id===c.package)};if(c.kind==='NEG')r[c.key]=c.value;ok=vr(r)}if((ok?'PLANNING_PASS':'REJECT')!==c.expected)throw Error('规划失败: '+c.id);n++;}
if(n!==62||review.packages.length!==10||map.counts.capPackageOriginalEdges!==312||zero.size!==10)throw Error('原映射/验收数量漂移');console.log('规划合成 '+n+'/62 PASS；独立产品/机床/消费者 NOT_RUN');
