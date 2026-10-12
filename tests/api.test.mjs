import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const base=new URL('../',import.meta.url);
async function route(name){const source=(await fs.readFile(new URL('app/api/'+name+'/route.ts',base),'utf8')).replace("'@/lib/demo'",JSON.stringify(new URL('lib/demo.ts',base).href));const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));}
const data=await route('dashboard'),brief=await route('brief'),exporter=await route('export');
const res=await data.GET(new Request('https://example.test/api/dashboard'));
assert.equal(res.status,200);const d=await res.json();assert.ok(d.total.net>0);assert.equal(d.meta.metricVersion,'1.1');assert.equal(d.meta.scope,'company');
assert.equal((await data.GET(new Request('https://example.test/api/dashboard?units=invalid'))).status,400);
assert.equal((await data.GET(new Request('https://example.test/api/dashboard?from=2026-02-30'))).status,400);
const b=await brief.POST(new Request('https://example.test/api/brief',{method:'POST',body:JSON.stringify({query:'scenario=margin',scope:'overview'})}));assert.equal(b.status,200);const bi=await b.json();assert.equal(bi.kind,'rule_based');assert.equal(bi.paidCalls,0);assert.ok(bi.items.length>0);
assert.equal((await brief.POST(new Request('https://example.test/api/brief',{method:'POST',body:JSON.stringify({query:'',scope:'arbitrary_sql'})}))).status,400);
const c=await exporter.GET(new Request('https://example.test/api/export?screen=profitability&platform=Google%20Ads&search=%EA%B2%80%EC%83%89'));assert.equal(c.status,200);assert.ok(c.headers.get('Content-Disposition').includes('.csv'));const text=await c.text();assert.ok(text.includes('Google Ads'));assert.ok(!text.includes('Meta Ads'));
assert.equal((await exporter.GET(new Request('https://example.test/api/export?screen=invalid'))).status,400);
console.log('API contracts, date validation, brief evidence and filtered CSV checks passed');

const filtered=await data.GET(new Request('https://example.test/api/dashboard?units=cheonggye&categories=커피,쇼케이스'));assert.equal(filtered.status,200);const fd=await filtered.json();assert.deepEqual(fd.categories.map(c=>c.name),['커피','쇼케이스']);assert.equal(fd.categoryTotal.net,fd.categories.reduce((n,c)=>n+c.net,0));assert.equal((await data.GET(new Request('https://example.test/api/dashboard?categories=invalid'))).status,400);const fc=await exporter.GET(new Request('https://example.test/api/export?screen=sales&units=cheonggye&categories=커피'));const ft=await fc.text();assert.equal(fc.status,200);assert.ok(ft.includes('커피'));assert.ok(ft.includes('선택 분류 합계'));assert.ok(!ft.includes('주류'));console.log('Category API and CSV scope checks passed');
