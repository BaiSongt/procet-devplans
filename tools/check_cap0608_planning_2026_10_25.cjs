#!/usr/bin/env node
// 中文说明：仅运行规划合成规则；不是产品、OCCT或真实消费者测试。
const fs=require("node:fs"),path=require("node:path");
function verdict(n,x){
 const sha=s=>typeof s==="string"&&/^[0-9a-f]{64}$/.test(s);
 const arrSame=(A,B)=>Array.isArray(A)&&Array.isArray(B)&&A.length===B.length&&[...A].sort().join("|")===[...B].sort().join("|");
 switch(n){
 case 1:return Number.isInteger(x.revision)&&x.revision>0&&sha(x.contentHash)&&sha(x.frameHash)&&Number.isInteger(x.setupRevision)&&x.setupRevision>0&&typeof x.scopeId==="string"&&x.scopeId.length>8;
 case 2:return x.authorized===true&&sha(x.frozenBeforeHash)&&x.frozenBeforeHash===x.frozenAfterHash&&x.touched.every(s=>!x.locked.includes(s));
 case 3:{const set=new Set(x.changed);for(let active=true;active;){active=false;for(const [s,t] of x.edges)if(set.has(s)&&!set.has(t)){set.add(t);active=true}}return arrSame([...set],x.affected)&&x.unaffectedStable===true}
 case 4:return sha(x.priorHash)&&x.priorHash===x.currentHash&&x.priorAlgo===x.currentAlgo&&sha(x.priorTolerance)&&x.priorTolerance===x.currentTolerance;
 case 5:{const g=new Map;for(const [s,t] of x.edges){if(!g.has(s))g.set(s,[]);g.get(s).push(t)}const seen=new Set,stack=new Set;function dfs(s){if(stack.has(s))return false;if(seen.has(s))return true;seen.add(s);stack.add(s);for(const t of g.get(s)||[])if(!dfs(t))return false;stack.delete(s);return true}return x.parentRevision!==x.childRevision&&x.parentPreserved===true&&x.freezePreserved===true&&[...g.keys()].every(dfs)}
 case 6:return x.sealed===true&&sha(x.expectedHead)&&x.expectedHead===x.actualHead&&x.aclAllowed===true&&x.generation===x.receiptGeneration&&x.cancelled===false;
 case 7:return ["A","B"].includes(x.mode)&&sha(x.canonicalFactHash)&&x.canonicalFactHash===x.observedFactHash&&x.duplicateFrozen===false&&x.adoptOwner==="05";
 case 8:return x.oracleProcess!==x.generatorProcess&&sha(x.oracleBinaryHash)&&sha(x.generatorBinaryHash)&&x.oracleBinaryHash!==x.generatorBinaryHash&&x.recomputed===true&&x.geometryValid===true;
 case 9:return x.budgetExhausted===true&&x.searchStatus==="UNKNOWN"&&x.controllerStatus==="UNKNOWN"&&x.ncValidated===false&&x.publishAllowed===false;
 case 10:return x.late===true&&x.receiptAction==="IGNORE"&&x.legacyReadOnly===true&&x.rollbackExact===true&&x.originalDataPreserved===true;
 default:return false;
 }
}
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,"../docs/capabilities/CAP-06-08/fixtures.json"),"utf8"));
if(fixture.cases.length!==20||fixture.mutationCases.length!==10)throw Error("固定正反/变异数量不一致");
let pass=0;const ids=new Set();
for(const t of [...fixture.cases,...fixture.mutationCases]){const number=Number(t.ruleId.slice(-2));if(ids.has(t.id))throw Error("重复ID:"+t.id);ids.add(t.id);if(verdict(number,t.input)!==(t.expected==="PASS"))throw Error("失败:"+t.id);pass++;}
console.log(JSON.stringify({item:"CAP-06-08",planningOnly:true,syntheticPassed:pass,total:30,product:"NOT_RUN",consumer:"NOT_RUN"}));
