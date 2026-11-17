/* The Depths — Prototype 014: nine 8-frame video-derived graphite animations.
 * Uses 256×208 2-bit anti-aliased alpha data per frame, zlib compressed.
 * No external runtime dependency; original joint rig remains the fallback.
 */
(()=>{
'use strict';
const names=['walk','standCrouch','crouchWalk','standProne','proneCrawl','crouchProne','standMine','crouchMine','proneMine'];
const frames=Object.create(null),errors=Object.create(null);
let completed=0;
const api={
 names,frames,errors,
 get(name,index){
   const arr=frames[name];
   return arr&&arr.length?arr[((Math.floor(index)%arr.length)+arr.length)%arr.length]:null;
 },
 count(name){return frames[name]?.length||8},
 stats(){return {ready:Object.keys(frames).length,total:names.length,completed,errors:Object.keys(errors)}}
};
window.DepthMotions=api;
async function load(name){
 try{
  if(typeof DecompressionStream!=='function')throw Error('This browser lacks zlib/deflate decompression');
  const source=window.DEPTHS_INK14?.[name];
  if(!source||source.w!==256||source.h!==208||source.n!==8)throw Error('Motion asset missing or malformed: '+name);
  const binary=Uint8Array.from(atob(source.packed),c=>c.charCodeAt(0));
  const stream=new Blob([binary]).stream().pipeThrough(new DecompressionStream('deflate'));
  const bytes=new Uint8Array(await new Response(stream).arrayBuffer());
  const W=256,H=208,COUNT=8,PIXELS=W*H;
  if(bytes.length!==PIXELS*COUNT/4)throw Error('Incorrect decoded length for '+name);
  const result=[];
  for(let f=0;f<COUNT;f++){
   const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
   const c=canvas.getContext('2d');const im=c.createImageData(W,H);
   // Index occupies two bits, preserving anti-aliased sketch edges.
   let minX=W,maxX=0,minY=H,maxY=0;
   for(let i=0;i<PIXELS;i++){
    const pixelIndex=f*PIXELS+i;
    const a=(bytes[pixelIndex>>2]>>((pixelIndex&3)*2))&3;
    if(!a)continue;
    const p=i*4;im.data[p]=228;im.data[p+1]=211;im.data[p+2]=184;im.data[p+3]=a*85;
    const x=i%W,y=(i/W)|0;
    if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
   }
   c.putImageData(im,0,0);
   // Headlight follows the visible sprite's upper body, not an unrelated rig pose.
   if(minY<maxY){
    const boxH=maxY-minY+1,headBandMax=minY+Math.max(8,Math.min(24,Math.round(boxH*.19)));
    let sum=0,num=0;
    for(let y=minY;y<=Math.min(maxY,headBandMax);y++)for(let x=minX;x<=maxX;x++){
      const index=f*PIXELS+y*W+x;const alpha=(bytes[index>>2]>>((index&3)*2))&3;
      if(alpha>1){sum+=x;num++}
    }
    canvas.headPoint={x:num?sum/num:(minX+maxX)/2,y:minY+10};
   }else canvas.headPoint={x:W/2,y:40};
   result.push(canvas);
  }
  frames[name]=result;
 }catch(e){errors[name]=String(e)}
 finally{completed++}
}
(async()=>{for(const name of names)await load(name)})();
})();