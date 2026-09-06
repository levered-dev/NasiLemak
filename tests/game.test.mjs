import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('../app/recipe.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {initialState,transition,stages,dishes}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
test('complete cooking journey with arrangement, washing, stirring, timers, cutting and all plating',()=>{
let s=initialState();const act=a=>{s=transition(s,a).state};
act({type:'next'});assert.equal(s.stage,0);
for(const id of ['beras','santan','pandan'])act({type:'move',id});act({type:'next'});assert.equal(s.stage,1);
act({type:'add',id:'beras'});assert.deepEqual(s.added,[]);act({type:'wash'});
for(let stage=1;stage<=4;stage++){
  assert.equal(s.stage,stage);act({type:'cook'});assert.equal(s.running,false);
  for(const id of stages[stage].needs)act({type:'add',id});
  if(stage===2){act({type:'cook'});assert.equal(s.running,false);for(let i=0;i<3;i++)act({type:'stir'})}
  act({type:'cook'});assert.equal(s.running,true);act({type:'next'});assert.equal(s.stage,stage);
  act({type:'tick',seconds:stages[stage].duration/2});assert.equal(s.complete,false);
  act({type:'tick',seconds:stages[stage].duration/2});assert.equal(s.complete,true);act({type:'next'});
}
assert.equal(s.stage,5);act({type:'slice'});assert.equal(s.slices,0);act({type:'add',id:'timun'});act({type:'wash'});for(let i=0;i<4;i++)act({type:'slice'});assert.equal(s.complete,true);act({type:'next'});
assert.equal(s.stage,6);act({type:'next'});assert.equal(s.stage,6);for(const d of dishes)act({type:'plate',id:d.id});act({type:'next'});assert.equal(s.stage,7);assert.equal(s.plated.length,6);act({type:'reset'});assert.deepEqual(s,initialState());
});
test('wrong, duplicate and out-of-order actions preserve progress',()=>{
let s={...initialState(),stage:2};let r=transition(s,{type:'add',id:'telur'});assert.equal(r.state,s);assert.match(r.message,/tidak diperlukan/);
s=transition(s,{type:'add',id:'minyak'}).state;r=transition(s,{type:'add',id:'minyak'});assert.equal(r.state,s);
for(const a of [{type:'plate',id:'nasi'},{type:'slice'},{type:'tick',seconds:Infinity},{type:'tick',seconds:-1},{type:'next'}])assert.equal(transition(s,a).state,s);
});
test('arrangement counts distinct ingredients; resets clear active cooking',()=>{
let s=initialState();for(let i=0;i<5;i++)s=transition(s,{type:'move',id:'beras'}).state;assert.equal(s.moved.length,1);assert.equal(transition(s,{type:'next'}).state.stage,0);
s={...s,stage:1,running:true,progress:.8};assert.deepEqual(transition(s,{type:'reset'}).state,initialState());
});
test('all six delivered food meshes are finite 3D triangles with matching colors',()=>{
const data=JSON.parse(readFileSync(new URL('../public/hidangan.json',import.meta.url),'utf8'));assert.deepEqual(Object.keys(data).sort(),dishes.map(d=>d.id).sort());
for(const mesh of Object.values(data)){assert.ok(mesh.p.length>90);assert.equal(mesh.p.length%9,0);assert.equal(mesh.p.length,mesh.c.length);assert.ok(mesh.p.every(Number.isFinite));assert.ok(mesh.c.every(x=>x>=0&&x<=1));let maxY=0;for(let i=1;i<mesh.p.length;i+=3)maxY=Math.max(maxY,mesh.p[i]);assert.ok(maxY>.02)}
});
