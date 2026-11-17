/* The Depths — Prototype 013 motion library
 * 8 chroma-keyed user-video clips, each resampled to 12 aligned transparent
 * 160×120 bitmask frames (zlib compressed text assets).
 * These are experimental silhouettes, not production-grade sprite artwork.
 * The in-game joint rig remains a complete fallback and comparison mode.
 */
(()=>{
'use strict';
const names=['walk','standCrouch','crouchWalk','crouchProne','proneCrawl','standMine','crouchMine','proneMine'];
const WIDTH=160, HEIGHT=120, FRAMES=12, BYTES_PER_FRAME=WIDTH*HEIGHT/8;
const frames=Object.create(null);
const errors=Object.create(null);
let completed=0;
const api={
  names, frames, errors,
  get(name,index){
    const arr=frames[name];
    return arr ? arr[((Math.floor(index)%arr.length)+arr.length)%arr.length] : null;
  },
  stats(){return {ready:Object.keys(frames).length,total:names.length,completed,errors:Object.keys(errors)}}
};
window.DepthMotions=api;
async function load(name){
  try{
    if(typeof DecompressionStream!=='function')throw new Error('Browser lacks DecompressionStream');
    const response=await fetch('assets/motion-'+name+'.txt');
    if(!response.ok)throw new Error('HTTP '+response.status);
    const b64=(await response.text()).trim();
    if(!/^[a-zA-Z0-9+/=]+$/.test(b64))throw new Error('Invalid frame data');
    const compressed=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate'));
    const data=new Uint8Array(await new Response(stream).arrayBuffer());
    if(data.length!==FRAMES*BYTES_PER_FRAME)throw new Error('Expected '+(FRAMES*BYTES_PER_FRAME)+' bytes, got '+data.length);
    const images=[];
    for(let f=0;f<FRAMES;f++){
      const surface=document.createElement('canvas');surface.width=WIDTH;surface.height=HEIGHT;
      const context=surface.getContext('2d');
      const rgba=context.createImageData(WIDTH,HEIGHT);
      const offset=f*BYTES_PER_FRAME;
      for(let i=0;i<WIDTH*HEIGHT;i++){
        const bit=(data[offset+(i>>3)]>>(7-(i&7)))&1;
        if(bit){
          const k=i*4;
          rgba.data[k]=230;rgba.data[k+1]=211;rgba.data[k+2]=170;rgba.data[k+3]=255;
        }
      }
      context.putImageData(rgba,0,0);
      images.push(surface);
    }
    frames[name]=images;
  }catch(e){errors[name]=String(e)}
  finally{completed++}
}
Promise.all(names.map(load));
})();