#!/usr/bin/env node
// B146仅核对规划证据结构和合成测试，不执行实机热漂移/最终NC/产品验收。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const src=read('research/sources/CAP-02-06-thermal-drift-b146.json'),tr=read('research/traces/CAP-02-06-thermal-drift-b146-v08.json'),fx=read('docs/capabilities/CAP-02-06/thermal-drift-b146-fixtures-v08.json');
function eligibility(a){if(a.target!=='RESOURCE')return'REJECT_DOMAIN_CROSSING';if(a.raw!==true)return'UNKNOWN_OBSERVATION';if(a.calibration!==true)return'UNKNOWN_RESOURCE';if(a.frame!==true)return'UNKNOWN_FRAME';if(a.uncertainty!==true)return'UNKNOWN_UNCERTAINTY';if(a.approvedModel!==true)return'UNKNOWN_MODEL';if(!Number.isFinite(a.ageSeconds)||!Number.isFinite(a.windowSeconds)||a.ageSeconds<0||a.windowSeconds<=0||a.ageSeconds>a.windowSeconds)return'STALE_THERMAL_WINDOW';return'RESOURCE_MODEL_CANDIDATE_ONLY'}
function evaluate(g){if(g.kind==='eligibility')return eligibility(g.input);if(g.kind==='predict')return g.input.biasMm+g.input.coeffMmPerK*g.input.deltaK;if(g.kind==='residual')return g.input.rawMm+g.input.correctionSign*(g.input.biasMm+g.input.coeffMmPerK*g.input.deltaK);return'UNKNOWN_KIND'}
if(src.records.length!==7||tr.rules.length!==8||fx.groups.length!==8||fx.goldens.length!==8)throw Error('结构不完整');
const sourceIds=new Set(src.records.map(s=>s.id));if(sourceIds.size!==7)throw Error('重复来源');let n=0;
for(const g of fx.groups){const r=tr.rules.find(r=>r.id===g.ruleId);if(!r||r.sourceIds.some(s=>!sourceIds.has(s))||r.fields.length!==4)throw Error('规则来源缺失');const judge=v=>r.fields.every(f=>v[f]===true)?'RESOURCE_MODEL_CANDIDATE_ONLY':r.failure;if(!r.testIds.includes(g.positive.id)||judge(g.positive.values)!==g.positive.expected)throw Error('正例失配');n++;if(g.negative.length!==4)throw Error('反例不足');for(const a of g.negative){let delta=r.fields.filter(f=>g.positive.values[f]!==a.values[f]);if(delta.length!==1||delta[0]!==a.mutatedField||!r.testIds.includes(a.id)||judge(a.values)!==a.expected)throw Error('单字段反例失配 '+a.id);n++}}
for(const g of fx.goldens){const got=evaluate(g);if(typeof g.expected==='number'?(typeof got!=='number'||Math.abs(got-g.expected)>1e-12):got!==g.expected)throw Error('Golden失配 '+g.id);n++}
if(n!==48)throw Error('数量错误');console.log('B146 48/48规划合成PASS；实测/NC/Owner/产品NOT_RUN');
