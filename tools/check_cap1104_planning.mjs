// 中文注释：仅规划数据静态规则核查；不能充当产品或真实制造验收。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cap='CAP-11-04';
const t=read('research/traces/'+cap+'.json'),s=read('research/sources/'+cap+'.json'),f=read('docs/capabilities/'+cap+'/fixtures.json');
const get=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o);
function gate(v){const a=v.input;switch(v.kind){
case 'auth':return a.principal===false||a.acl===false?'REJECT':a.principal==='unknown'||a.acl==='unknown'?'UNKNOWN':!a.scope||!a.revision?'STALE':'ALLOW';
case 'approval':return a.impact==='read'?'ALLOW':!a.digest||!a.scope||!a.human?'REJECT':!a.fresh?'STALE':'ALLOW';
case 'dispatch':return !a.payloadSame||!a.keySame?'REJECT':a.cancelled?'CANCELLED':!a.cas?'STALE':!a.resultKnown?'UNKNOWN':'ACCEPT';
case 'nc':return a.clOnly||!a.d12||!a.d13||!a.d14||!a.d15||!a.productVerified?'UNKNOWN':'ENGINEERING_EVIDENCE_ELIGIBLE';
case 'result':return !a.schema||!a.dataOnly||a.frozenOverwrite?'REJECT':!a.receipt?'UNKNOWN':'DATA_ONLY';
default:throw Error('unknown gate '+v.kind);
}}
let passed=0;
const ruleMap=new Map(t.rules.map(z=>[z.id,z])),sourceMap=new Map(s.sources.map(z=>[z.id,z]));
if(t.rules.length!==10||ruleMap.size!==10||s.sources.length!==10||sourceMap.size!==10||f.cases.length!==50||f.gateCases.length!==24)throw Error('cardinality');
for(const rule of t.rules){if(rule.fields.length!==4||rule.criteria.length!==4||!rule.sourceIds.every(id=>sourceMap.has(id)))throw Error(rule.id+' trace broken')}
for(const c of f.cases){const rule=ruleMap.get(c.ruleId);if(!rule)throw Error(c.id+' missing rule');const got=rule.criteria.every(p=>get(c.input,p.path)===p.value)?'PASS':'REJECT';if(got!==c.expected)throw Error(c.id+' expected '+c.expected+' got '+got);passed++}
for(const c of f.gateCases){const got=gate(c);if(got!==c.expected)throw Error(c.id+' expected '+c.expected+' got '+got);passed++}
const altered=structuredClone(f.cases[0]);altered.input.tool.namespaceVersion=false;
if(ruleMap.get(altered.ruleId).criteria.every(p=>get(altered.input,p.path)===p.value))throw Error('mutation detector failed');
console.log('PASS '+passed+'/'+(f.cases.length+f.gateCases.length)+' synthetic planning only; product NOT_RUN');
