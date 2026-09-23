import {readFileSync,writeFileSync} from 'node:fs';
import {transform} from 'esbuild';

for(const [source,target,loader] of [
  ['styles.css','styles.min.css','css'],
  ['script.js','script.min.js','js'],
]){
  const original=readFileSync(source,'utf8');
  const result=await transform(original,{loader,minify:true,target:'es2020',legalComments:'inline'});
  writeFileSync(target,result.code);
  console.log(`${source}: ${Buffer.byteLength(original)} → ${Buffer.byteLength(result.code)} bytes`);
}
