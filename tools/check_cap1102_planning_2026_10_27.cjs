#!/usr/bin/env node
'use strict';
// 中文注释：本工具只执行CAP-11-02规划合成检查；非产品/机床安全证据。
const fs=require('node:fs'),path=require('node:path');
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const sources=read('research/sources/CAP-11-02.json'),trace=read('research/traces/CAP-11-02.json');
const fixtures=read('docs/capabilities/CAP-11-02/fixtures.json');
const owners=read('docs/capabilities/CAP-11-02/asset-owner-candidates.json');
const assert=(v,m)=>{if(!v)throw Error(m)};
const get=(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x);
const oracle=(r,x)=>r.criteria.every(c=>c.op==='eq'&&get(x,c.path)===c.value)?'PASS':'REJECT';
const gate=x=>{if(x.cancelled)return"CANCELLED";if(x.scopeAuthorized===false||x.sourceTrusted===false||x.injectionDetected)return"REJECT";if(x.casMismatch||x.exactMatch===false||x.hashMismatch||(x.offline&&x.offlineCacheValid===false))return"STALE";if(x.conflict)return"CONFLICT";if(x.approved===false||x.ownerSignoff===false)return"PENDING_HUMAN";if(x.overwriteFrozen)return"NEW_REVISION_REQUIRED";if(x.materialMatch===false||x.toolMatch===false||x.machineMatch===false||x.approxOnly)return"NOT_APPLICABLE";if(x.unitsPresent===false||x.controllerKnown===false||x.actualSetupKnown===false)return"UNKNOWN";if(x.requestRelease&&x.d15!=="PASS")return"BLOCK_D16";if(x.fieldFeedback)return"REVIEW_REQUIRED";if(x.viewOnly)return"PREVIEW_ONLY";return"PROPOSE"};
assert(sources.sources.length===10&&trace.rules.length===10,'来源/规则数');
assert(owners.assets.length===17,'17Owner候选');
const ids=new Set(sources.sources.map(x=>x.id));const rm=new Map(trace.rules.map(x=>[x.id,x]));
for(const r of trace.rules){assert(r.fields.length===4&&r.fields.every(f=>r.criteria.some(c=>c.path===f&&c.op==='eq'&&c.value===true)),'40字段规则');assert(r.sourceIds.every(x=>ids.has(x)),'来源引用');assert(r.workPackages.includes('T5-01')&&r.workPackages.includes('T5-02'),'原编号包')}
const seen=new Set();for(const c of fixtures.cases){assert(!seen.has(c.id),'重复');seen.add(c.id);const r=rm.get(c.ruleId);assert(!!r&&oracle(r,c.input)===c.expected,'字段正反预期:'+c.id);if(c.mutatedField){let changed=r.fields.filter(f=>get(c.input,f)!==true);assert(changed.length===1&&changed[0]===c.mutatedField,'非独立字段变异')}}
for(const c of fixtures.gateCases){assert(!seen.has(c.id),'重复');seen.add(c.id);assert(gate(c.input)===c.expected,'状态门禁:'+c.id)}
assert(fixtures.cases.length===50&&fixtures.gateCases.length===24&&seen.size===74,'案例数量');
console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_PASS',cases:74,ruleCount:10,sourceCount:10,ownerCandidates:17,product:'NOT_RUN',independentConsumer:'NOT_RUN'}));
