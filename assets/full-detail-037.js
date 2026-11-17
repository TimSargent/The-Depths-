/* The Depths — original high-detail Animation Library 014 importer.
   Loads the user's original 72 transparent PNGs, never reconstructs the miner.
   Browser-local storage keeps the imported ZIP available on later visits.
   If not yet imported, DepthMotions retains the existing compressed fallback.
*/
(()=>{
'use strict';
const names={
 walk_upright:'walk',stand_to_crouch:'standCrouch',
 crouch_walk:'crouchWalk',stand_to_prone:'standProne',
 prone_crawl:'proneCrawl',crouch_to_prone:'crouchProne',
 mine_standing:'standMine',mine_crouched:'crouchMine',mine_prone:'proneMine'
};
const CACHE='depths-original-art-037',STATUS={ready:false,busy:false,message:'Full-detail source not loaded'};
let frames={};
function status(message){STATUS.message=message;window.dispatchEvent(new CustomEvent('depths-art-status',{detail:{...STATUS}}))}
function u16(v,n){return v.getUint16(n,true)}
function u32(v,n){return v.getUint32(n,true)}
async function zipEntries(blob){
 const bytes=new Uint8Array(await blob.arrayBuffer()),view=new DataView(bytes.buffer);
 let eocd=-1;
 for(let p=bytes.length-22;p>=Math.max(0,bytes.length-66000);p--){
  if(u32(view,p)===0x06054b50){eocd=p;break}
 }
 if(eocd<0)throw Error('This is not a readable ZIP file');
 const count=u16(view,eocd+10),offset=u32(view,eocd+16);
 let p=offset;const result=[];
 const utf8=new TextDecoder('utf-8');
 for(let i=0;i<count;i++){
  if(u32(view,p)!==0x02014b50)throw Error('ZIP directory is damaged');
  const method=u16(view,p+10),size=u32(view,p+20);
  const nl=u16(view,p+28),el=u16(view,p+30),cl=u16(view,p+32);
  const name=utf8.decode(bytes.subarray(p+46,p+46+nl));
  const local=u32(view,p+42),localName=u16(view,local+26),localExtra=u16(view,local+28);
  const start=local+30+localName+localExtra;
  if(method!==0&&method!==8)throw Error('Unsupported ZIP compression');
  result.push({name,method,bytes:bytes.slice(start,start+size)});
  p+=46+nl+el+cl;
 }
 return result;
}
async function unzipEntry(entry){
 if(entry.method===0)return new Blob([entry.bytes],{type:'image/png'});
 // ZIP method 8 = raw DEFLATE, not the zlib-wrapped deflate format.
 if(typeof DecompressionStream!=='function')throw Error('Browser does not support ZIP decompression');
 const readable=new Blob([entry.bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
 const buf=await new Response(readable).arrayBuffer();
 return new Blob([buf],{type:'image/png'});
}
function loadImage(blob){
 return new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(blob),im=new Image();
  im.onload=()=>{URL.revokeObjectURL(url);resolve(im)};
  im.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Could not decode original PNG'))};
  im.src=url;
 });
}
function frameFromImage(im){
 const temp=document.createElement('canvas');temp.width=im.width;temp.height=im.height;
 const ctx=temp.getContext('2d',{willReadFrequently:true});
 ctx.drawImage(im,0,0);
 const raw=ctx.getImageData(0,0,im.width,im.height),data=raw.data;
 let minx=im.width,miny=im.height,maxx=-1,maxy=-1;
 // Original transparent frames contain some opaque black/green screen residue.
 // Remove ONLY the matte/background. Keep the actual bright graphite anatomy
 // and anti-aliased edges in their original source resolution.
 for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++){
  const i=(y*im.width+x)*4,r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
  const bright=Math.max(r,g,b);
  const chroma=g>r*1.25+12&&g>b*1.20+12;
  if(chroma||bright<32||a<25){data[i+3]=0;continue}
  const opacity=Math.round(a*Math.min(1,(bright-28)/72));
  data[i+3]=opacity;
  if(opacity>95&&bright>52){
   if(x<minx)minx=x;if(x>maxx)maxx=x;
   if(y<miny)miny=y;if(y>maxy)maxy=y;
  }
 }
 if(maxx<minx||maxy<miny)throw Error('PNG contained no visible original artwork');
 ctx.putImageData(raw,0,0);
 const pad=3,x=Math.max(0,minx-pad),y=Math.max(0,miny-pad);
 const w=Math.min(im.width-x,maxx-minx+1+pad*2),h=Math.min(im.height-y,maxy-miny+1+pad*2);
 const out=document.createElement('canvas');out.width=w;out.height=h;
 out.getContext('2d').drawImage(temp,x,y,w,h,0,0,w,h);
 out.bodyBox={x:0,y:0,w,h};
 out.sourceX=x;out.sourceY=y;out.sourceW=im.width;out.sourceH=im.height;
 out.headPoint={x:w/2,y:Math.min(17,h*.12)};
 return out;
}
function median(arr){const a=arr.slice().sort((x,y)=>x-y);return a[Math.floor(a.length/2)]}
function normalize(key,images){
 const heights=images.map(im=>im.height),widths=images.map(im=>im.width);
 const centers=images.map(im=>im.sourceX+im.width/2);
 const centerX=median(centers);
 // Locked physical calibration by animation, never resize on each frame.
 const stand=['walk','standMine','standCrouch','standProne'].includes(key);
 const prone=['proneCrawl','proneMine'].includes(key);
 const refH=(key==='standCrouch'||key==='crouchProne'||key==='standProne')?heights[0]:median(heights);
 const refW=median(widths);
 // A single shared ground datum for upright walking. Earlier versions
 // re-anchored to every cropped frame's bottom, creating visible bobbing.
 const sharedWalkFloor=key==='walk'?median(images.map(im=>im.sourceY+im.height)):null;
 const targetH=stand?176:prone?65:119;
 const sx=prone?203/Math.max(1,refW):targetH/Math.max(1,refH);
 const sy=targetH/Math.max(1,refH);
 for(const im of images){
  im.motionReference={height:refH,centerX:centerX-im.sourceX};
  // Keep boot contact aligned to one ground plane while preserving genuine
  // frame-to-frame body motion from the original artwork.
  if(key==='walk') im.motionReference.footY=sharedWalkFloor-im.sourceY;
  im.fullDetailScale={sx,sy};
  im.isOriginalArtwork=true;
 }
 return images;
}
function dbOpen(){
 return new Promise((resolve,reject)=>{
  if(!window.indexedDB)return reject(Error('Local saving unavailable'));
  const req=indexedDB.open(CACHE,1);
  req.onupgradeneeded=()=>req.result.createObjectStore('assets');
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error);
 });
}
async function remember(blob){
 const db=await dbOpen();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('assets','readwrite');tx.objectStore('assets').put(blob,'library014');
  tx.oncomplete=()=>{db.close();resolve()};
  tx.onerror=()=>{db.close();reject(tx.error)};
 });
}
async function recalled(){
 const db=await dbOpen();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('assets','readonly'),req=tx.objectStore('assets').get('library014');
  req.onsuccess=()=>{db.close();resolve(req.result)};
  req.onerror=()=>{db.close();reject(req.error)};
 });
}
async function install(blob,persist=true){
 if(STATUS.busy)return;
 STATUS.busy=true;STATUS.ready=false;status('Reading original artwork ZIP…');
 try{
  const entries=await zipEntries(blob),groups={};
  for(const item of entries){
   const name=item.name.split('/').at(-1);
   const match=name.match(/^([a-z_]+)_0([0-7])\.png$/i);
   if(!match||!names[match[1]])continue;
   const key=names[match[1]],index=Number(match[2]);
   (groups[key]??=[])[index]=item;
  }
  if(Object.keys(groups).length!==9||Object.values(groups).some(g=>g.length!==8||Array.from({length:8},(_,i)=>!g[i]).some(Boolean)))
   throw Error('Choose The_Depths_Animation_Library_014.zip (72 PNG frames required)');
  const installed={};
  for(const [key,group] of Object.entries(groups)){
   const list=[];
   for(const entry of group){
    const png=await unzipEntry(entry);
    list.push(frameFromImage(await loadImage(png)));
   }
   installed[key]=normalize(key,list);
   status('Restoring original '+key+' artwork…');
  }
  // Publish all nine at once: no mid-animation changes from partial loading.
  frames=installed;STATUS.ready=true;
  status('Original artwork ready — all 72 high-detail frames');
  if(persist){try{await remember(blob)}catch(e){
   status('Original artwork ready (browser could not save for next visit)');
  }}
 }catch(e){
  frames={};STATUS.ready=false;status('Original artwork import failed: '+e.message);throw e;
 }finally{STATUS.busy=false}
}
window.DepthsFullArt={
 get(name,index){const list=frames[name];return list?.[((Math.floor(index)%8)+8)%8]||null},
 count(){return Object.keys(frames).length},
 state:STATUS,install,
 async restore(){try{const blob=await recalled();if(blob)await install(blob,false)}
  catch(e){status('Load original ZIP to enable full-detail character')}}
};
window.DepthsFullArt.restore();
})();