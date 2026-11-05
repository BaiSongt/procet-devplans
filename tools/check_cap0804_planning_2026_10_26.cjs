#!/usr/bin/env node
'use strict';
// 中文：只检查规划合成规则及声明的语义序列，绝不连接机床或产品数据库。
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const t=read('research/traces/CAP-08-04.json'),s=read('research/sources/CAP-08-04.json'),f=read('docs/capabilities/CAP-08-04/fixtures.json'),o=read('docs/capabilities/CAP-08-04/asset-owner-candidates.json');
const must=(v,m)=>{if(!v)throw Error(m)},at=(v,p)=>p.split('.').reduce((a,k)=>a?.[k],v);
must(s.sources.length===8&&t.rules.length===10&&f.cases.length===30&&f.semanticCases.length===8&&o.assets.length===17,'数量异常');
const ids=new Set(s.sources.map(x=>x.id)),aids=new Set(o.assets.map(x=>x.id));
must(ids.size===8&&aids.size===17,'来源或资产重复');
for(let i=1;i<=17;i++)must(aids.has('D'+String(i).padStart(2,'0')),'缺少原17资产');
let count=0;
for(const r of t.rules){
 must(r.sourceIds.length&&r.sourceIds.every(x=>ids.has(x))&&r.assets.every(x=>aids.has(x)),'孤立来源/资产');
 must(r.workPackages.join(',')==='E3-02,E3-03,U4-04','原工作包编号变更');
 const cases=f.cases.filter(x=>x.ruleId===r.id);must(cases.length===3,'缺正反/变异');
 const p=cases.find(x=>x.id===r.positiveTestId),n=cases.find(x=>x.id===r.negativeTestId),m=cases.find(x=>x.id===r.mutationTestId);
 must(p?.scenario==='POSITIVE'&&n?.scenario==='NEGATIVE'&&m?.scenario==='INDEPENDENT_FIELD_MUTATION','测试类型错误');
 must(n.mutatedField!==m.mutatedField,'变异字段相同');
 for(const c of cases){const passed=r.criteria.every(x=>x.op==='eq'&&at(c.input,x.path)===x.value);must((passed?'PASS':'REJECT')===c.expected,'失败 '+c.id);must(c.synthetic===true,'非合成');count++}
}
function interpretSynthetic(c){const st={toolSelected:false,toolChanged:false,coolant:'OFF',offset:'NOT_APPLIED',orientRequested:false,orientAck:false,unknown:false,ended:false};for(const cmd of c.commands){
 if(st.ended)return {result:'REJECT',state:st};
 if(cmd==='COOLANT_ON')st.coolant='ON';else if(cmd==='T_SELECT')st.toolSelected=true;
 else if(cmd==='M6_REQUEST'){if(!st.toolSelected)return {result:'REJECT',state:st};st.unknown=true}
 else if(cmd==='M6_ACK'){if(!st.toolSelected)return {result:'REJECT',state:st};st.toolChanged=true;st.unknown=false;if(c.profile.m6Coolant==='STOP')st.coolant='OFF'}
 else if(cmd==='M19_REQUEST'){if(!c.profile.m19Supported)return {result:'UNKNOWN',state:st};st.orientRequested=true;st.unknown=true}
 else if(cmd==='M19_ACK'){if(!c.profile.m19Supported||!st.orientRequested)return {result:'UNKNOWN',state:st};st.orientAck=true;st.unknown=false}
 else if(cmd==='M30')st.ended=true;else if(cmd==='SPINDLE_START'){}else return {result:'UNKNOWN',state:st}
}return {result:st.unknown?'UNKNOWN':'PASS',state:st}}
for(const c of f.semanticCases){const x=interpretSynthetic(c);must(x.result===c.expected,'语义 '+c.id);if(c.expectedCoolant)must(x.state.coolant===c.expectedCoolant,'冷却 '+c.id);if(c.expectedOffset)must(x.state.offset===c.expectedOffset,'补偿 '+c.id)}
must(o.assets.every(x=>x.approval==='PENDING_HUMAN'&&x.independentConsumer==='NOT_RUN'),'不得伪造签署/验收');
console.log('CAP-08-04规划合成：字段正反/变异 '+count+'/30、异构语义序列 8/8 PASS。独立真实产品/消费者/机床 NOT_RUN');
