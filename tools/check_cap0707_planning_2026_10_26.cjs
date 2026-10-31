#!/usr/bin/env node
// CAP-07-07中文校验：仅本仓合成规划契约，不表示真实OCCT/NC/机床通过
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const s=read('research/sources/CAP-07-07.json'),t=read('research/traces/CAP-07-07.json');
const f=read('docs/capabilities/CAP-07-07/fixtures.json'),c=read('docs/capabilities/CAP-07-07/contract.example.json');
const owner=read('docs/capabilities/CAP-07-07/asset-owner-candidates.json');
const hash=x=>typeof x==='string'&&/^[a-f0-9]{64}$/i.test(x);
const uniq=(arr,label)=>assert.equal(new Set(arr).size,arr.length,label+'不能重复');
function accepts(r,v){return r.criteria.every(q=>{switch(q.op){case 'eq':return v[q.path]===q.value;case 'gt':return typeof v[q.path]==='number'&&Number.isFinite(v[q.path])&&v[q.path]>q.value;case 'sha256':return hash(v[q.path]);case 'sameField':return v[q.path]===v[q.other];default:throw Error('未知操作符：'+q.op)}})}
const v3=x=>Array.isArray(x)&&x.length===3&&x.every(Number.isFinite),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0),norm=x=>Math.sqrt(dot(x,x)),close=(a,b,t=1e-8)=>Math.abs(a-b)<=t,dist=(a,b)=>norm(sub(a,b));
function checkContract(x){
assert.equal(x.syntheticOnly,true);assert.equal(x.notNCVerified,true);assert.equal(x.outputAssetId,'D09');assert.equal(x.CLIsNotNC,true);
assert.equal(x.frame.handedness,'RIGHT');assert.equal(x.frame.lengthUnit,'MM');assert.ok(hash(x.frame.hash));
const b=x.frame.basis;assert.equal(b.length,3);b.forEach(row=>assert.ok(v3(row)));for(let i=0;i<3;i++)for(let j=0;j<3;j++)assert.ok(close(dot(b[i],b[j]),i===j?1:0),'非刚性正交Frame');
const det=b[0][0]*(b[1][1]*b[2][2]-b[1][2]*b[2][1])-b[0][1]*(b[1][0]*b[2][2]-b[1][2]*b[2][0])+b[0][2]*(b[1][0]*b[2][1]-b[1][1]*b[2][0]);assert.ok(close(det,1),'右手det(R)须+1');
const must=['D01','D03','D04','D05','D07','D08'];must.forEach(id=>{const a=x.readExactAssets.find(q=>q.assetId===id);assert.ok(a&&a.revision>0&&hash(a.contentHash)&&hash(a.frameHash)&&a.scope,'缺少exact来源：'+id)});assert.equal(x.readExactAssets.find(q=>q.assetId==='D08').frozen,true);
assert.equal(x.tool.tcpDefinition,'TOOL_TIP');assert.equal(x.tool.axisConvention,'TIP_TO_HOLDER');assert.equal(x.tool.contactPointSeparate,true);assert.equal(x.operation.mode,'INDEXED_3_PLUS_2');assert.equal(x.operation.indexedOrientationConstantOnCut,true);
const known=new Set(['CUT_LINE','CUT_ARC','LINK_RETRACT']);uniq(x.segments.map(a=>a.id),'段ID');assert.ok(x.segments.length>=2);
x.segments.forEach((a,i)=>{assert.equal(a.index,i);assert.ok(known.has(a.kind));assert.ok(v3(a.from)&&v3(a.to)&&v3(a.toolAxis));assert.ok(close(norm(a.toolAxis),1),'刀轴非单位向量');assert.equal(a.tcpRole,'TOOL_TIP');
assert.ok(a.feedIntent&&['CUT_FEED','NON_CUT_LINK'].includes(a.feedIntent.mode)&&Number.isFinite(a.feedIntent.value)&&a.feedIntent.value>0&&a.feedIntent.unit==='MM_MIN');assert.equal(a.provenance.materialBeforeHash,x.operation.materialBeforeHash);assert.equal(a.provenance.frozenPlanHash,x.operation.frozenPlanHash);
if(i)assert.ok(dist(x.segments[i-1].to,a.from)<1e-8,'段端点不连续');
if(a.kind==='CUT_ARC'){const arc=a.arc;assert.ok(arc&&v3(arc.center)&&v3(arc.planeNormal)&&close(norm(arc.planeNormal),1));assert.ok(arc.radiusMM>0&&arc.toleranceMM>0);assert.ok(close(dist(a.from,arc.center),arc.radiusMM,arc.toleranceMM)&&close(dist(a.to,arc.center),arc.radiusMM,arc.toleranceMM),'圆弧端点不在圆上');assert.ok(close(dot(sub(a.from,arc.center),arc.planeNormal),0,arc.toleranceMM));assert.ok(close(dot(sub(a.to,arc.center),arc.planeNormal),0,arc.toleranceMM));assert.ok(arc.sweepRad>0&&arc.sweepRad<=Math.PI*2)}
});
assert.deepEqual(x.controllerWords,[]);assert.deepEqual(x.machineAxisWords,[]);assert.equal(x.executionBindingRef,null);
assert.equal(x.downstream.D13,'UNKNOWN');assert.equal(x.downstream.D15,'NOT_RUN');assert.equal(x.downstream.D16,'BLOCKED');
const q=x.ownerSubmit;assert.ok(hash(q.actualHead)&&q.expectedHead===q.actualHead&&q.aclAllowed&&q.scopeEpoch===q.expectedScopeEpoch&&q.taskGeneration===q.receiptGeneration&&!q.cancelled&&q.rollbackMode==='NON_DESTRUCTIVE');
}
assert.equal(s.registeredRecords,9);assert.equal(s.sources.length,9);assert.equal(t.rules.length,10);assert.equal(f.cases.length,30);assert.equal(owner.owners.length,17);uniq(owner.owners.map(x=>x.assetId),'资产');uniq(s.sources.map(x=>x.id),'来源');uniq(t.rules.map(x=>x.id),'规则');uniq(f.cases.map(x=>x.id),'场景');
const knownSource=new Set(s.sources.map(x=>x.id)),knownRules=new Set(t.rules.map(x=>x.id));for(const r of t.rules){assert.ok(r.sourceIds.length&&r.sourceIds.every(id=>knownSource.has(id)));assert.ok(r.fields.length&&r.assets.length);for(const field of r.fields)assert.ok(r.criteria.some(c=>c.path===field),'字段无判据：'+field);for(const k of ['positiveTestId','negativeTestId','mutationTestId']){const z=f.cases.find(y=>y.id===r[k]);assert.ok(z&&z.ruleId===r.id);if(k!=='positiveTestId')assert.ok(r.fields.includes(z.mutatedField))}}
for(const z of f.cases){const rule=t.rules.find(r=>r.id===z.ruleId);assert.ok(rule&&knownRules.has(z.ruleId));assert.equal(accepts(rule,z.input)?'PASS':'REJECT',z.expected,z.id)}
checkContract(c);
const copy=()=>JSON.parse(JSON.stringify(c));
for(const [label,fn] of [['handedness',x=>x.frame.basis[2][2]=-1],['arcRadius',x=>x.segments[1].arc.radiusMM=11],['endpointGap',x=>x.segments[1].from[0]=9],['machineWord',x=>x.machineAxisWords.push('A')],['staleReceipt',x=>x.ownerSubmit.receiptGeneration=4]]){const bad=copy();fn(bad);assert.throws(()=>checkContract(bad),'错误变异未被拒绝：'+label)}
console.log('CAP-07-07规划合成30/30及5项契约变异PASS；真实OCCT/NC/机床/跨域消费者NOT_RUN。规划PASS≠产品PASS');
