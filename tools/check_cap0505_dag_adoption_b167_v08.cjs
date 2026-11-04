// B167：只读规划测试，非产品/几何/NC验证。
'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const f=JSON.parse(fs.readFileSync(path.join(root,'docs/capabilities/CAP-05-05/dag-closure-b167-fixtures-v08.json'),'utf8'));
const t=JSON.parse(fs.readFileSync(path.join(root,'research/traces/CAP-05-05-dag-closure-b167-v08.json'),'utf8'));
const s=JSON.parse(fs.readFileSync(path.join(root,'research/sources/CAP-05-05-dag-closure-b167.json'),'utf8'));
const B=f.baseline;
function topo(nodes,edges){const indeg=new Map(nodes.map(n=>[n,0]));const outs=new Map(nodes.map(n=>[n,[]]));for(const [u,v] of edges){if(!outs.has(u)||!indeg.has(v))return false;outs.get(u).push(v);indeg.set(v,indeg.get(v)+1);}const q=nodes.filter(n=>indeg.get(n)===0);let count=0;while(q.length){const u=q.shift();count++;for(const v of outs.get(u)){indeg.set(v,indeg.get(v)-1);if(indeg.get(v)===0)q.push(v)}}return count===nodes.length;}
function close(nodes,edges,selected,satisfied){const rev=new Map(nodes.map(n=>[n,[]]));for(const [u,v] of edges){if(!rev.has(v))return false;rev.get(v).push(u)}const chosen=new Set(selected),ok=new Set([...selected,...satisfied]),seen=new Set(selected),q=[...selected];while(q.length){let n=q.pop();if(!rev.has(n))return false;for(const p of rev.get(n)){if(!ok.has(p))return false;if(!seen.has(p)){seen.add(p);q.push(p)}}}return true;}
function orderOk(edges,order){return edges.every(([u,v])=>order.indexOf(u)>=0&&order.indexOf(v)>order.indexOf(u));}
const equal=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
function judge(rule,rec){return rule.fields.every(f=>equal(rec[f],B[f]))&& (rule.id==="B167-R01"?topo(rec["graph.nodes"],rec["graph.edges"])&&orderOk(rec["graph.edges"],rec["graph.order"]):true)&&(rule.id==="B167-R02"?close(B["graph.nodes"],B["graph.edges"],rec["pick.selected"],rec["pick.baseSatisfied"]):true);}
function gold(g){switch(g.kind){case "DAG":return topo(B["graph.nodes"],g.edges);case "CLOSURE":return close(B["graph.nodes"],B["graph.edges"],g.selected,g.satisfied);case "ORDER":return orderOk(B["graph.edges"],g.order);case "FREEZE":return g.collision&&!g.overwrite;case "NC":return g.d13==="UNKNOWN"&&!g.release;default:return null;}}
if(s.records.length!==8||t.rules.length!==8||f.cases.length!==40||f.goldens.length!==8)throw Error('源/规则/验收数量错误');
const ids=new Set(s.records.map(x=>x.id)), tests=new Set(f.cases.map(x=>x.id));
for(const rule of t.rules){if(rule.fields.length!==4||rule.sourceIds.some(x=>!ids.has(x))||rule.testIds.some(x=>!tests.has(x)))throw Error('追踪关系错误：'+rule.id);}
let n=0;for(const c of f.cases){const rule=t.rules.find(x=>x.id===c.ruleId);if(!rule)throw Error('未找到规则');
const actual=judge(rule,c.record)?'REVIEW_ONLY':'REJECT';if(actual!==c.expected)throw Error('失败 '+c.id);
const diff=Object.keys(B).filter(k=>!equal(c.record[k],B[k]));if(c.kind==='ONE_FIELD_NEGATIVE'&&(diff.length!==1||diff[0]!==c.changedField))throw Error('独立反例不是单字段');
if(c.kind==='POSITIVE'&&diff.length)throw Error('正例被改变');n++;}
for(const g of f.goldens){if(gold(g)!==g.expected)throw Error('Goldens失败 '+g.id);n++;}
console.log(JSON.stringify({status:'PLANNING_SYNTHETIC_ONLY',passed:n,product:'NOT_RUN',independentConsumers:'NOT_RUN'}));
