import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,relative} from 'node:path';
import assert from 'node:assert/strict';
import config from './site.config.mjs';

// Verify the generated site without a network dependency. Word counts below are
// regression guards against an empty template, not search-ranking thresholds.
const siteURL=new URL(config.url);
assert.equal(siteURL.href,'https://clearlyonline.co.uk/','approved HTTPS custom domain');
const canonicalFor=file=>new URL(file==='index.html'?'':file,siteURL).href;
const files=readdirSync('.').filter(file=>file.endsWith('.html')).sort();
assert(files.includes('index.html')&&files.includes('404.html'),'homepage and custom 404 exist');
const decode=value=>value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp|pound);/gi,(_,entity)=>{
 if(entity[0]==='#')return String.fromCodePoint(parseInt(entity.slice(entity[1].toLowerCase()==='x'?2:1),entity[1].toLowerCase()==='x'?16:10));
 return {amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' ',pound:'£'}[entity.toLowerCase()];
});
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m=>[m[1].toLowerCase(),decode(m[2]??m[3])]));
const tags=(html,name)=>[...html.matchAll(new RegExp(`<${name}\\b[^>]*>`,'gi'))].map(m=>attrs(m[0]));
const textOnly=html=>decode(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
const one=(values,label)=>{assert.equal(values.length,1,`${label}: exactly one`);return values[0];};
const titleSet=new Set(),descriptionSet=new Set(),mainSet=new Set();
const documents=new Map(files.map(file=>[file,readFileSync(file,'utf8')]));
const idsByFile=new Map();
const indexable=new Map();
const inbound=new Map(files.map(file=>[file,new Set()]));
let checkedLinks=0,checkedSchemaRefs=0;
const assetHashes=Object.fromEntries(['styles.min.css','script.min.js'].map(file=>[file,createHash('sha256').update(readFileSync(file)).digest('hex').slice(0,12)]));
const oldPrices=new Set([39,99,159,239,795,1495,2495]);
const rejectOldPrices=(value,label)=>{
 for(const [,amount] of value.matchAll(/£\s*(\d[\d,]*(?:\.\d{1,2})?)/g))assert(!oldPrices.has(Number(amount.replaceAll(',',''))),`${label}: superseded price £${amount}`);
};
function localFileFor(target){
 const path=decodeURIComponent(target.pathname);
 assert(!path.includes('\\')&&!path.includes('\0'),'invalid local URL path');
 const candidate=path.endsWith('/')?`${path}index.html`:path;
 const absolute=resolve(`.${candidate}`);
 assert(!relative(process.cwd(),absolute).startsWith('..'),'local URL escapes site directory');
 return relative(process.cwd(),absolute).replaceAll('\\','/');
}
function checkLink(ref,file,{fragment=true,navigation=false}={}){
 const target=new URL(ref,canonicalFor(file));
 if(target.hostname!==siteURL.hostname)return;
 assert.equal(target.origin,siteURL.origin,`${file}: internal URLs use the HTTPS custom origin`);
 const local=localFileFor(target);
 assert(existsSync(local)&&statSync(local).isFile(),`${file}: missing local target ${ref}`);
 if(fragment&&target.hash&&local.endsWith('.html')){
  const hash=decodeURIComponent(target.hash.slice(1));
  assert(idsByFile.get(local)?.has(hash),`${file}: missing anchor ${ref}`);
 }
 if(navigation&&local.endsWith('.html')&&local!==file)inbound.get(local)?.add(file);
 checkedLinks++;
}
function walk(value,visit){
 if(!value||typeof value!=='object')return;
 if(Array.isArray(value)){value.forEach(item=>walk(item,visit));return;}
 visit(value);
 Object.values(value).forEach(item=>walk(item,visit));
}
const types=node=>[].concat(node['@type']??[]);
const isType=(node,type)=>types(node).includes(type);
const pageTypes=new Set(['WebPage','AboutPage','ContactPage','CollectionPage']);

// Collect anchors before checking links, including absolute same-origin links.
for(const [file,html] of documents){
 const ids=[...html.matchAll(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m=>decode(m[1]??m[2]));
 assert.equal(ids.length,new Set(ids).size,`${file}: duplicate IDs`);
 idsByFile.set(file,new Set(ids));
}
for(const [file,html] of documents){
 const errorPage=file==='404.html';
 const canonical=canonicalFor(file);
 const meta=tags(html,'meta');
 const getMeta=(key,value)=>meta.filter(item=>item[key]?.toLowerCase()===value).map(item=>item.content);
 const title=decode(one([...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(m=>m[1]),`${file}: title`)).trim();
 assert(title&&!titleSet.has(title.toLowerCase()),`${file}: nonempty unique title`);titleSet.add(title.toLowerCase());
 const descriptions=getMeta('name','description');
 if(!errorPage||descriptions.length){
  const description=one(descriptions,`${file}: description`);
  assert(description?.trim()&&!descriptionSet.has(description.toLowerCase()),`${file}: nonempty unique description`);
  descriptionSet.add(description.toLowerCase());
 }
 assert.equal((html.match(/<h1\b/gi)||[]).length,1,`${file}: exactly one H1`);
 assert.equal(one(tags(html,'html'),`${file}: html`).lang,'en-GB',`${file}: language`);
 const robotRules=one(getMeta('name','robots'),`${file}: robots`).toLowerCase().split(/[\s,]+/);
 const canIndex=!robotRules.includes('noindex')&&!robotRules.includes('none');
 indexable.set(file,canIndex);
 assert(!robotRules.includes('nofollow')&&!robotRules.includes('none'),`${file}: links remain crawlable`);
 if(errorPage||file==='privacy.html')assert(!canIndex,`${file}: intentionally excluded from search`);
 else assert(canIndex,`${file}: public content must remain indexable`);
 for(const bot of ['googlebot','bingbot'])for(const directive of getMeta('name',bot))assert(!/\b(?:noindex|nofollow|none)\b/i.test(directive),`${file}: ${bot} restriction`);
 const canonicals=tags(html,'link').filter(link=>link.rel?.toLowerCase().split(/\s+/).includes('canonical'));
 if(!errorPage||canonicals.length)assert.equal(one(canonicals,`${file}: canonical`).href,canonical,`${file}: canonical URL`);
 const main=one([...html.matchAll(/<main\b[^>]*>([\s\S]*?)<\/main>/gi)].map(m=>m[1]),`${file}: main content`);
 const mainText=textOnly(main);
 assert(mainText.split(/\s+/).length>=(errorPage?10:80),`${file}: substantive server-rendered main content`);
 assert(!mainSet.has(mainText),`${file}: duplicate main content`);mainSet.add(mainText);
 if(!errorPage)assert(/<h2\b/i.test(main),`${file}: descriptive content sections`);
 assert(!/goodmeasure|Good Measure|Made Proper|MADE PROPER|made-proper|PLACEHOLDER|TODO|®/.test(html),`${file}: old branding or placeholders`);
 assert(!/[–—]/.test(html),`${file}: no en or em dashes`);
 rejectOldPrices(textOnly(html),file);
 for(const img of tags(html,'img')){
  assert(img.alt?.trim(),`${file}: descriptive image alt`);
  assert(/^\d+$/.test(img.width)&&Number(img.width)>0&&/^\d+$/.test(img.height)&&Number(img.height)>0,`${file}: image dimensions`);
  if(img.srcset)for(const candidate of img.srcset.split(','))checkLink(candidate.trim().split(/\s+/)[0],file);
 }
 // Never skip a same-origin link solely because its URL is absolute.
 for(const tag of tags(html,'a'))if(tag.href&&!/^(?:mailto:|tel:|data:|javascript:)/i.test(tag.href))checkLink(tag.href,file,{navigation:true});
 for(const tag of [...tags(html,'link'),...tags(html,'img'),...tags(html,'script'),...tags(html,'source')]){
  const ref=tag.href??tag.src;
  if(ref&&!/^(?:mailto:|tel:|data:|javascript:)/i.test(ref))checkLink(ref,file);
 }
 if(errorPage)continue;
 const guide=tags(html,'link').filter(link=>link.rel==='describedby'&&link.type==='text/markdown');
 assert.equal(one(guide,`${file}: llms guide link`).href,new URL('llms.txt',siteURL).href);
 for(const [asset,hash] of Object.entries(assetHashes)){
  const linked=[...tags(html,'link'),...tags(html,'script')].map(tag=>tag.href??tag.src).filter(Boolean).filter(ref=>new URL(ref,canonical).pathname===`/${asset}`);
  const ref=new URL(one(linked,`${file}: minified ${asset}`),canonical);
  assert.equal(ref.origin,siteURL.origin,`${file}: self-hosted ${asset}`);
  assert.equal(ref.search,`?v=${hash}`,`${file}: ${asset} version matches its contents`);
 }
 for(const [key,value] of [['og:title',title],['og:description',descriptions[0]],['og:url',canonical],['og:site_name',config.name],['og:locale','en_GB']])assert.equal(one(getMeta('property',key),`${file}: ${key}`),value,`${file}: ${key} agrees with page`);
 for(const [key,value] of [['twitter:title',title],['twitter:description',descriptions[0]],['twitter:card','summary_large_image']])assert.equal(one(getMeta('name',key),`${file}: ${key}`),value,`${file}: ${key} agrees with page`);
 const socialImage=one(getMeta('property','og:image'),`${file}: social image`);
 assert.equal(new URL(socialImage).origin,siteURL.origin,`${file}: social image custom domain`);
 assert.equal(one(getMeta('name','twitter:image'),`${file}: Twitter image`),socialImage);
 checkLink(socialImage,file);
 assert(one(getMeta('property','og:image:alt'),`${file}: social alt`).trim(),`${file}: social image alt`);
 assert(Number(one(getMeta('property','og:image:width'),`${file}: social width`))>0&&Number(one(getMeta('property','og:image:height'),`${file}: social height`))>0,`${file}: social image dimensions`);
 const schemas=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>attrs(m[1]).type==='application/ld+json').map(m=>JSON.parse(m[2]));
 const schema=one(schemas,`${file}: JSON-LD document`);
 assert.equal(schema['@context'],'https://schema.org',`${file}: schema context`);
 assert(Array.isArray(schema['@graph']),`${file}: JSON-LD graph`);
 const nodes=schema['@graph'];
 const organization=one(nodes.filter(node=>isType(node,'Organization')),`${file}: Organization`);
 const website=one(nodes.filter(node=>isType(node,'WebSite')),`${file}: WebSite`);
 const page=one(nodes.filter(node=>types(node).some(type=>pageTypes.has(type))),`${file}: WebPage`);
 assert.equal(organization.name,config.name,`${file}: organization name`);
 assert.equal(organization.url,config.url,`${file}: organization URL`);
 assert.equal(organization.email,config.email,`${file}: public enquiry email`);
 assert.equal(website.url,config.url,`${file}: website URL`);
 assert.equal(page['@id'],`${canonical}#page`,`${file}: canonical page ID`);
 assert.equal(page.url,canonical,`${file}: schema page URL`);
 assert.equal(page.name,title,`${file}: schema page title`);
 assert.equal(page.description,descriptions[0],`${file}: schema description`);
 assert.equal(page.inLanguage,'en-GB',`${file}: schema language`);
 assert.equal(page.isPartOf?.['@id'],website['@id'],`${file}: page belongs to website`);
 assert.equal(website.publisher?.['@id'],organization['@id'],`${file}: website publisher`);
 const ids=new Map();
 walk(schema,node=>{
  for(const key of ['aggregateRating','review','reviews','ratingValue','reviewCount','address','postalAddress','streetAddress','postalCode'])assert(!(key in node),`${file}: unapproved ${key} schema`);
  assert(!types(node).some(type=>['Review','AggregateRating','PostalAddress'].includes(type)),`${file}: unapproved rating, review or address type`);
  if('price' in node)assert(!oldPrices.has(Number(node.price)),`${file}: superseded schema price`);
  for(const key of ['url','logo','image','contentUrl','thumbnailUrl'])if(typeof node[key]==='string'){
   assert.equal(new URL(node[key]).origin,siteURL.origin,`${file}: ${key} schema uses custom domain`);
   checkLink(node[key],file,{fragment:false});
  }
  if(node['@id']&&Object.keys(node).length>1){
   const id=new URL(node['@id']);
   assert.equal(id.origin,siteURL.origin,`${file}: schema ID uses custom domain`);
   assert(id.hash&&!id.search,`${file}: stable schema fragment ID`);
   checkLink(id.href,file,{fragment:false});
   assert(!ids.has(id.href),`${file}: duplicate schema definition ${id.href}`);ids.set(id.href,node);
  }
 });
 walk(schema,node=>{
  if(node['@id']){assert(ids.has(node['@id']),`${file}: unresolved JSON-LD reference ${node['@id']}`);checkedSchemaRefs++;}
 });
 for(const node of [organization,website]){
  assert(node['@id'],`${file}: stable entity ID`);
  assert.equal(new URL(node['@id']).pathname,'/',`${file}: site entity ID belongs to homepage`);
 }
 if(file!=='index.html'){
  const breadcrumb=one(nodes.filter(node=>isType(node,'BreadcrumbList')),`${file}: breadcrumb schema`);
  assert(breadcrumb['@id'],`${file}: breadcrumb ID`);
  assert.equal(new URL(breadcrumb['@id']).pathname,new URL(canonical).pathname,`${file}: breadcrumb canonical ID`);
  assert.equal(page.breadcrumb?.['@id'],breadcrumb['@id'],`${file}: page links breadcrumb`);
  assert(Array.isArray(breadcrumb.itemListElement)&&breadcrumb.itemListElement.length>=2,`${file}: breadcrumb hierarchy`);
  breadcrumb.itemListElement.forEach((item,index)=>{
   assert.equal(item.position,index+1,`${file}: breadcrumb positions`);
   assert(item.name?.trim(),`${file}: breadcrumb label`);
   const itemURL=typeof item.item==='string'?item.item:item.item?.['@id'];
   assert(itemURL,`${file}: breadcrumb destination`);checkLink(itemURL,file,{fragment:false});
   if(index===0)assert.equal(itemURL,config.url,`${file}: breadcrumb starts at homepage`);
   if(index===breadcrumb.itemListElement.length-1)assert.equal(itemURL,canonical,`${file}: breadcrumb ends at page`);
  });
 }
 if(['web-design.html','local-seo.html','website-care.html','websites-for-trades.html','websites-for-appointments.html','websites-for-professionals.html'].includes(file)){
  const service=one(nodes.filter(node=>isType(node,'Service')),`${file}: service schema`);
  assert(service['@id'],`${file}: service ID`);
  assert.equal(new URL(service['@id']).pathname,new URL(canonical).pathname,`${file}: service canonical ID`);
  assert.equal(service.url,canonical,`${file}: service URL`);
  assert.equal(service.provider?.['@id'],organization['@id'],`${file}: service provider`);
  assert(service.name?.trim(),`${file}: service name`);
 }
}
const sitemap=readFileSync('sitemap.xml','utf8');
const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decode(m[1]));
assert.equal(locations.length,new Set(locations).size,'sitemap has no duplicate URLs');
const expected=[...indexable].filter(([,canIndex])=>canIndex).map(([file])=>canonicalFor(file)).sort();
assert.deepEqual([...locations].sort(),expected,'sitemap contains exactly the indexable canonical pages');
for(const location of locations){assert.equal(new URL(location).origin,siteURL.origin,'sitemap custom domain');checkLink(location,'index.html');}
const robots=readFileSync('robots.txt','utf8');
assert(/^User-agent:\s*\*\s*$/mi.test(robots),'robots.txt general crawler group');
assert(!/^Disallow:\s*\S+/mi.test(robots),'robots.txt does not block public pages');
assert.equal(one([...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gmi)].map(m=>m[1]),'robots sitemap'),new URL('sitemap.xml',siteURL).href);
for(const [file,canIndex] of indexable)if(canIndex&&file!=='index.html')assert(inbound.get(file).size>0,`${file}: discoverable from another page`);

const pricing=documents.get('pricing.html');
for(const [name,price] of [['Starter',400],['Business',500],['Growth',600]]){
 const card=[...pricing.matchAll(/<article\b[^>]*class="[^"]*\bprice-card\b[^"]*"[^>]*>([\s\S]*?)<\/article>/g)].map(m=>m[1]).find(card=>new RegExp(`<h3>${name}<\\/h3>`).test(card));
 assert(card,`pricing.html: ${name} package`);
 assert.equal(textOnly(card.match(/<p class="price">([\s\S]*?)<\/p>/)?.[1]??'').match(/£[\d,]+/)?.[0],`£${price}`,`pricing.html: approved ${name} build price`);
}
for(const file of ['index.html','pricing.html','website-care.html'])assert(/£49\s*(?:\/\s*month|(?:per|a)\s+month)/i.test(textOnly(documents.get(file))),`${file}: £49 monthly hosting and care`);
assert(documents.get('contact.html').includes(config.email),'contact email');
for(const page of ['websites-for-trades.html','websites-for-appointments.html','websites-for-professionals.html'])assert(documents.get(page).includes('COMMON QUESTIONS'),`${page}: answer content`);
assert(documents.get('about.html').includes('Clearly Online exists to help good local businesses explain their work clearly online'),'mission');
for(const file of ['guides.html','website-cost-guide.html','website-brief-checklist.html'])assert(indexable.get(file),`${file}: useful guide remains published and indexable`);
const llms=readFileSync('llms.txt','utf8');
assert(llms.includes(config.email),'llms.txt enquiry email');
for(const location of expected)assert(llms.includes(location),`llms.txt missing ${location}`);
rejectOldPrices(llms,'llms.txt');
assert(statSync('styles.min.css').size<statSync('styles.css').size,'CSS minification');
assert(statSync('script.min.js').size<statSync('script.js').size,'JS minification');
assert(statSync('assets/founder-240.jpg').size<25000,'small portrait budget');
assert(statSync('assets/founder-800.jpg').size<160000,'large portrait budget');
assert(statSync('assets/manrope-latin.woff2').size<50000,'font budget');
assert(readFileSync('assets/manrope-latin.woff2').subarray(0,4).toString()==='wOF2','valid WOFF2 font signature');
console.log(`PASS: ${files.length} pages; ${checkedLinks} local links/assets; ${checkedSchemaRefs} resolved schema IDs; metadata, indexability, sitemap, content, approved pricing, branding and asset budgets.`);
