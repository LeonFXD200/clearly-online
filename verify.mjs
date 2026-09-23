import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
import config from './site.config.mjs';
const files=readdirSync('.').filter(file=>file.endsWith('.html')&&file!=='404.html');
const titles=new Set(),descriptions=new Set();
let checkedLinks=0;
for(const file of files){
 const html=readFileSync(file,'utf8');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const description=html.match(/<meta name="description" content="(.*?)">/)?.[1];
 assert(title&&!titles.has(title),`${file}: unique title`);titles.add(title);
 assert(description&&!descriptions.has(description),`${file}: unique description`);descriptions.add(description);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: exactly one H1`);
 assert(html.includes('<html lang="en-GB">'),`${file}: language`);
 assert(html.includes(`rel="canonical" href="${new URL(file==='index.html'?'':file,config.url).href}"`),`${file}: canonical`);
 assert(!/goodmeasure|Good Measure|PLACEHOLDER|TODO|®/.test(html),`${file}: old branding or placeholders`);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(schema['@context'],'https://schema.org');
 assert.equal(schema['@graph'][0].name,'Made Proper');
 for(const match of html.matchAll(/<img\b([^>]+)>/g)){
   assert(/alt="[^"]+"/.test(match[1]),`${file}: image alt`);
   assert(/width="\d+"/.test(match[1])&&/height="\d+"/.test(match[1]),`${file}: image dimensions`);
 }
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,`${file}: duplicate IDs`);
 for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(https?:|mailto:|data:)/.test(ref))continue;
   const [pathPart,hash]=ref.split('#');
   const path=pathPart.split('?')[0];
   const target=path?(path==='./'?'index.html':path):file;
   assert(existsSync(target),`${file}: missing ${ref}`);
   if(hash&&target.endsWith('.html'))assert(readFileSync(target,'utf8').includes(`id="${hash}"`),`${file}: missing anchor ${ref}`);
   checkedLinks++;
 }
}
const sitemap=readFileSync('sitemap.xml','utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,7);
for(const file of files.filter(f=>f!=='privacy.html'))assert(sitemap.includes(new URL(file==='index.html'?'':file,config.url).href));
assert(readFileSync('contact.html','utf8').includes(config.email));
assert(statSync('assets/founder-240.jpg').size<25000);
assert(statSync('assets/founder-800.jpg').size<160000);
assert(statSync('assets/manrope-latin.woff2').size<50000);
assert(readFileSync('assets/manrope-latin.woff2').subarray(0,4).toString()==='wOF2');
console.log(`PASS: ${files.length} pages; ${checkedLinks} local links/assets; titles, descriptions, headings, schema, sitemap, branding and asset budgets.`);
