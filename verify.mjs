import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
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
 assert(html.includes('rel="describedby" type="text/markdown"'),`${file}: llms guide link`);
 assert(html.includes('href="styles.min.css?v=made-proper-3"')&&html.includes('src="script.min.js?v=made-proper-2"'),`${file}: minified assets`);
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
assert.equal((sitemap.match(/<loc>/g)||[]).length,files.filter(f=>f!=='privacy.html').length);
for(const file of files.filter(f=>f!=='privacy.html'))assert(sitemap.includes(new URL(file==='index.html'?'':file,config.url).href));
assert(readFileSync('contact.html','utf8').includes(config.email));
for(const page of ['websites-for-trades.html','websites-for-appointments.html','websites-for-professionals.html'])assert(readFileSync(page,'utf8').includes('COMMON QUESTIONS'),`${page}: answer content`);
assert(readFileSync('about.html','utf8').includes('Made Proper exists to help good local businesses explain their work clearly online'), 'mission');
const llms=readFileSync('llms.txt','utf8');
assert(llms.includes(config.email));
for(const file of files.filter(f=>f!=='privacy.html'))assert(llms.includes(new URL(file==='index.html'?'':file,config.url).href),`llms.txt missing ${file}`);
assert(statSync('styles.min.css').size<statSync('styles.css').size,'CSS minification');
assert(statSync('script.min.js').size<statSync('script.js').size,'JS minification');
assert(statSync('assets/founder-240.jpg').size<25000);
assert(statSync('assets/founder-800.jpg').size<160000);
assert(statSync('assets/manrope-latin.woff2').size<50000);
assert(readFileSync('assets/manrope-latin.woff2').subarray(0,4).toString()==='wOF2');
console.log(`PASS: ${files.length} pages; ${checkedLinks} local links/assets; titles, descriptions, headings, schema, sitemap, branding and asset budgets.`);
