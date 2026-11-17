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
  const result=[],inkPixels=[];
  for(let f=0;f<COUNT;f++){
   const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
   const c=canvas.getContext('2d');const im=c.createImageData(W,H);
   // Index occupies two bits, preserving anti-aliased sketch edges.
   let minX=W,maxX=0,minY=H,maxY=0,strongInk=0;
   for(let i=0;i<PIXELS;i++){
    const pixelIndex=f*PIXELS+i;
    const a=(bytes[pixelIndex>>2]>>((pixelIndex&3)*2))&3;
    if(!a)continue;
    const p=i*4;im.data[p]=228;im.data[p+1]=211;im.data[p+2]=184;im.data[p+3]=a*85;
    const x=i%W,y=(i/W)|0;
    if(a>1){strongInk++;if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}
   }
   c.putImageData(im,0,0);
   // Trim each frame to meaningful body pixels. Rendering uses this box
   // to ground feet and preserve a consistent physical character scale.
   canvas.bodyBox=minX<=maxX&&minY<=maxY?{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1}:{x:0,y:0,w:W,h:H};
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
   result.push(canvas);inkPixels.push(strongInk);
  }
  // The chroma-key source occasionally removes almost the entire figure.
  // Such frames look like a tiny miner even at a fixed render scale.
  // Substitute the nearest intact frame in this *same* animation, rather
  // than attempting to inflate a handful of remaining pixels.
  const ordered=[...inkPixels].sort((a,b)=>a-b);
  const typical=ordered[Math.floor(ordered.length/2)]||1;
  const threshold=Math.max(160,typical*.4);
  const valid=inkPixels.map((count,i)=>count>=threshold?i:-1).filter(i=>i>=0);
  if(valid.length){
   for(let i=0;i<COUNT;i++){
    if(inkPixels[i]>=threshold)continue;
    const dist=j=>Math.min(Math.abs(i-j),COUNT-Math.abs(i-j));
    const chosen=[...valid].sort((a,b)=>dist(a)-dist(b)||a-b)[0];
    result[i]=result[chosen];
  }
  }
  // A shared reference pose/height per animation prevents frame-by-frame
  // enlargement when limbs extend or contract. The original frames retain
  // their changing anatomy at a single, stable pixel-to-world scale.
  const heights=result.map(im=>im.bodyBox.h);
  const refHeight=(name==='standCrouch'||name==='crouchProne'||name==='standProne')
    ? heights[0] : [...heights].sort((a,b)=>a-b)[Math.floor(heights.length/2)];
  const centers=result.map(im=>im.bodyBox.x+im.bodyBox.w/2).sort((a,b)=>a-b);
  const centerX=centers[Math.floor(centers.length/2)];
  for(const im of result){im.motionReference={height:Math.max(1,refHeight),centerX}}
  frames[name]=result;
 }catch(e){errors[name]=String(e)}
 finally{completed++}
}
(async()=>{for(const name of names)await load(name)})();
})();