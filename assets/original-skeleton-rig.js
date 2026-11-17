/* The Depths — source-derived skeleton rig, Prototype 029
 * No redesigned anatomy: each texture is cut from the ORIGINAL
 * "stand_to_crouch" video-derived frame 0 already in DepthMotions.
 * Attaches graphite source fragments to the existing gameplay joints.
 */
(()=>{
'use strict';
let cache=null, sourceUsed=null;
const sourcePoints={
 head:[.77,.073],shoulder:[.51,.208],elbow:[.40,.377],hand:[.40,.580],
 hip:[.13,.462],knee:[.25,.735],ankle:[.19,.941],toe:[.49,.989]
};
function sourceInfo(){
 const source=window.DepthMotions?.get('standCrouch',0);
 if(!source)return null;
 const box=source.bodyBox||{x:80,y:4,w:90,h:195};
 return {source,box,
  p(k){const a=sourcePoints[k];return{x:box.x+a[0]*box.w,y:box.y+a[1]*box.h}}};
}
function crop(info,points,pad,mask){
 const {source}=info;
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
 const x=Math.max(0,Math.floor(Math.min(...xs)-pad));
 const y=Math.max(0,Math.floor(Math.min(...ys)-pad));
 const w=Math.min(source.width-x,Math.ceil(Math.max(...xs)-x+pad));
 const h=Math.min(source.height-y,Math.ceil(Math.max(...ys)-y+pad));
 if(w<2||h<2)return null;
 const out=document.createElement('canvas');out.width=w;out.height=h;
 const c=out.getContext('2d');
 if(mask==='ellipse'){
  const center=points[0],r=points[1];
  c.beginPath();c.ellipse(center.x-x,center.y-y,r.x,r.y,0,0,Math.PI*2);c.clip();
 }else if(mask==='segment'){
  c.beginPath();c.moveTo(points[0].x-x,points[0].y-y);
  c.lineTo(points[1].x-x,points[1].y-y);
  c.lineCap='round';c.lineWidth=pad*1.45;c.strokeStyle='#fff';c.stroke();
  c.globalCompositeOperation='source-in';
  c.drawImage(source,-x,-y);
  c.globalCompositeOperation='source-over';
  return {image:out,x,y};
 }else if(mask==='torso'){
  const a=points[0],b=points[1],dx=b.x-a.x,dy=b.y-a.y;
  const ang=Math.atan2(dy,dx),nx=-Math.sin(ang),ny=Math.cos(ang);
  const width=pad*.66;
  c.beginPath();
  c.moveTo(a.x-x+nx*width,a.y-y+ny*width);
  c.quadraticCurveTo(a.x-x+dx*.45+nx*(width*1.2),a.y-y+dy*.45+ny*(width*1.2),b.x-x+nx*width*.5,b.y-y+ny*width*.5);
  c.lineTo(b.x-x-nx*width*.5,b.y-y-ny*width*.5);
  c.quadraticCurveTo(a.x-x+dx*.45-nx*(width*1.2),a.y-y+dy*.45-ny*(width*1.2),a.x-x-nx*width,a.y-y-ny*width);
  c.closePath();c.clip();
 }
 c.drawImage(source,-x,-y);
 return {image:out,x,y};
}
function build(){
 const info=sourceInfo();if(!info)return null;
 if(cache&&sourceUsed===info.source)return cache;
 sourceUsed=info.source;
 const p=k=>info.p(k),pt=(x,y)=>({x:info.box.x+x*info.box.w,y:info.box.y+y*info.box.h});
 const pieces={
  head:crop(info,[p('head'),{x:info.box.w*.245,y:info.box.h*.078}],1.7,'ellipse'),
  torso:crop(info,[p('shoulder'),p('hip')],info.box.w*.33,'torso'),
  pelvis:crop(info,[pt(.14,.458),{x:info.box.w*.21,y:info.box.h*.063}],2,'ellipse'),
  upperArm:crop(info,[p('shoulder'),p('elbow')],info.box.w*.105,'segment'),
  lowerArm:crop(info,[p('elbow'),p('hand')],info.box.w*.092,'segment'),
  upperLeg:crop(info,[p('hip'),p('knee')],info.box.w*.105,'segment'),
  lowerLeg:crop(info,[p('knee'),p('ankle')],info.box.w*.091,'segment'),
  foot:crop(info,[pt(.18,.965),{x:info.box.w*.31,y:info.box.h*.038}],1,'ellipse')
 };
 cache={pieces,p:info.p,box:info.box,source:info.source};
 return cache;
}
function draw(ctx,pose,alpha=1){
 const art=build();
 if(!art)return false;
 const {pieces,p}=art;
 const part=(key,anchor,target,size=1)=>{
  const piece=pieces[key];if(!piece)return;
  const base=p(anchor);
  const x=piece.x-base.x,y=piece.y-base.y;
  ctx.drawImage(piece.image,target[0]+x*size,target[1]+y*size,
   piece.image.width*size,piece.image.height*size);
 };
 const bone=(key,a,b,far=false)=>{
  const piece=pieces[key];if(!piece)return;
  const refA=p(key==='upperArm'?'shoulder':key==='lowerArm'?'elbow':
   key==='upperLeg'?'hip':'knee');
  const refB=p(key==='upperArm'?'elbow':key==='lowerArm'?'hand':
   key==='upperLeg'?'knee':'ankle');
  const A=pose[a],B=pose[b];
  const sr=Math.hypot(refB.x-refA.x,refB.y-refA.y)||1;
  const dr=Math.hypot(B[0]-A[0],B[1]-A[1])||1;
  const scale=dr/sr;
  const rot=Math.atan2(B[1]-A[1],B[0]-A[0])-Math.atan2(refB.y-refA.y,refB.x-refA.x);
  ctx.save();ctx.translate(A[0],A[1]);ctx.rotate(rot);ctx.scale(scale,scale);
  ctx.globalAlpha*=far?.48:1;
  ctx.drawImage(piece.image,piece.x-refA.x,piece.y-refA.y);
  ctx.restore();
 };
 const torso=(a,b)=>{
  const piece=pieces.torso,refA=p('shoulder'),refB=p('hip'),A=pose[a],B=pose[b];
  if(!piece)return;
  const rr=Math.atan2(refB.y-refA.y,refB.x-refA.x);
  const tr=Math.atan2(B[1]-A[1],B[0]-A[0]);
  const scale=Math.hypot(B[0]-A[0],B[1]-A[1])/Math.max(1,Math.hypot(refB.x-refA.x,refB.y-refA.y));
  ctx.save();ctx.translate(A[0],A[1]);ctx.rotate(tr-rr);ctx.scale(scale,scale);
  ctx.drawImage(piece.image,piece.x-refA.x,piece.y-refA.y);ctx.restore();
 };
 ctx.save();ctx.globalAlpha*=alpha;ctx.imageSmoothingEnabled=true;
 // Readjust the standing anatomy toward the ORIGINAL character's longer legs.
 // Blend correction away as posture lowers, preventing an abrupt rig swap.
 const w=Math.max(0,1-Math.max(0,pose._poseValue||0)/3);
 const anatomy=Object.fromEntries(Object.entries(pose).filter(([k,v])=>Array.isArray(v)).map(([k,v])=>[k,v.slice()]));
 for(const name of ['hip','knee','farKnee','ankle','farAnkle']){
  if(anatomy[name])anatomy[name][1]-=w*(name==='hip'?24:name.toLowerCase().includes('knee')?11:0);
 }
 bone('upperLeg','hip','farKnee',true);
 bone('lowerLeg','farKnee','farAnkle',true);
 bone('upperArm','shoulder','farElbow',true);
 bone('lowerArm','farElbow','farHand',true);
 torso('shoulder','hip');
 if(pieces.pelvis){
  const rp=p('hip'),piece=pieces.pelvis;
  ctx.drawImage(piece.image,anatomy.hip[0]+piece.x-rp.x,anatomy.hip[1]+piece.y-rp.y);
 }
 bone('upperLeg','hip','knee');
 bone('lowerLeg','knee','ankle');
 if(pieces.foot){
  const src=p('ankle'),piece=pieces.foot;
  const foot=(ank,toe)=>{
   ctx.save();ctx.translate(anatomy[ank][0],anatomy[ank][1]);
   const dest=anatomy[toe],v=[dest[0]-anatomy[ank][0],dest[1]-anatomy[ank][1]];
   ctx.rotate(Math.atan2(v[1],v[0]));ctx.scale(Math.max(.5,Math.hypot(...v)/19),.9);
   ctx.drawImage(piece.image,piece.x-src.x,piece.y-src.y);ctx.restore();
  };
  foot('ankle','toe');foot('farAnkle','farToe');
 }
 bone('upperArm','shoulder','elbow');
 bone('lowerArm','elbow','hand');
 part('head','head',anatomy.head,1.0);
 ctx.restore();
 return true;
}
window.OriginalSkeletonRig={draw,ready:()=>!!build()};
})();