#!/usr/bin/env node
// B145仅执行规划合成；不代表实际OCCT/NC/独立Owner验收。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const src=load('research/sources/CAP-03-03-wire-traversal-b145.json'),tr=load('research/traces/CAP-03-03-wire-traversal-b145-v08.json'),fx=load('docs/capabilities/CAP-03-03/wire-traversal-b145-fixtures-v08.json');
const graph=function graph(a){let c=a.context||{};if(!c.revision||!c.occurrence)return"UNKNOWN_SNAPSHOT";if(c.cumOri!==true||c.cumLoc!==true)return"UNKNOWN_TRAVERSAL_MODE";if(!c.face)return"UNKNOWN_FACE_CONTEXT";if(!a.members||!a.visited||a.members.length!==a.visited.length||new Set(a.members).size!==a.members.length||new Set(a.visited.map(x=>x.id)).size!==a.members.length||a.visited.some(x=>!a.members.includes(x.id)))return"UNKNOWN_INCOMPLETE_WIRE";let prev=null,ins={},outs={};for(let e of a.visited){if(prev!==null&&prev!==e.start)return"UNKNOWN_CONNECTIVITY";ins[e.end]=(ins[e.end]||0)+1;outs[e.start]=(outs[e.start]||0)+1;prev=e.end;}if(Object.keys({...ins,...outs}).some(v=>(ins[v]||0)>1||(outs[v]||0)>1))return"UNKNOWN_CONNECTIVITY";if(a.closed&&prev!==a.visited[0]?.start)return"UNKNOWN_CONNECTIVITY";return"PLANNING_CANDIDATE_ONLY"};
if(src.records.length!==7||tr.rules.length!==8||fx.groups.length!==8||fx.goldens.length!==8)throw Error('structure');
const ids=new Set(src.records.map(s=>s.id));let n=0;
for(const group of fx.groups){const rule=tr.rules.find(r=>r.id===group.ruleId);if(!rule||rule.sourceIds.some(id=>!ids.has(id)))throw Error('source-rule');
const judge=x=>rule.fields.every(f=>x[f]===true)?'PLANNING_CANDIDATE_ONLY':rule.failure;
if(judge(group.positive.values)!==group.positive.expected||!rule.testIds.includes(group.positive.id))throw Error('positive');n++;
for(const v of group.negative){const delta=rule.fields.filter(f=>group.positive.values[f]!==v.values[f]);if(delta.length!==1||delta[0]!==v.mutatedField||judge(v.values)!==v.expected||!rule.testIds.includes(v.id))throw Error('independent negative');n++;}}
for(const v of fx.goldens){if(graph(v.input)!==v.expected)throw Error('golden '+v.id);n++}
if(n!==48)throw Error('count');console.log('B145 SYNTHETIC_PLANNING_PASS 48/48. Real OCCT/Owner NOT_RUN');
