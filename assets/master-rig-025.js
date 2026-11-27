/* The Depths gameplay rig 050D, extracted directly from the approved 049A walker.
   Only upright locomotion uses this renderer; gameplay position is authoritative.
   Sprite art is loaded from the existing DepthsFullArt importer. */
(()=>{
'use strict';
const W=245,H=418,clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),radians=d=>d*Math.PI/180;
const V=(x,y)=>({x,y}),add=(a,b)=>V(a.x+b.x,a.y+b.y),rot=(p,a)=>V(p.x*Math.cos(a)-p.y*Math.sin(a),p.x*Math.sin(a)+p.y*Math.cos(a));
let ctx=null;
const parts={
 head:{poly:[[130,5],[170,7],[179,32],[178,59],[162,78],[134,70],[122,46],[123,20]],start:[141,67],end:[148,26]},
 neck:{poly:[[127,63],[147,65],[140,95],[123,98]],start:[133,80],end:[137,70]},
 torso:{poly:[[114,80],[141,74],[137,117],[127,154],[114,158],[107,130],[109,98]],start:[123,96],end:[114,153]},
 pelvis:{poly:[[80,177],[104,186],[103,216],[84,225],[72,205]],start:[86,195],end:[90,207]},
 upper_arm:{poly:[[108,84],[133,90],[127,109],[121,137],[114,162],[97,147],[96,121]],start:[121,94],end:[110,155]},
 forearm:{poly:[[108,143],[118,148],[118,216],[107,223],[104,179]],start:[110,154],end:[114,220]},
 hand:{poly:[[109,211],[125,214],[130,244],[122,266],[109,254],[105,226]],start:[114,218],end:[119,246]},
 thigh:{poly:[[77,186],[98,190],[103,232],[105,292],[93,302],[85,256]],start:[86,200],end:[98,294]},
 shin:{poly:[[92,285],[107,289],[101,354],[98,381],[85,389],[84,342]],start:[98,294],end:[93,379]},
 foot:{poly:[[83,374],[100,371],[112,385],[140,389],[141,402],[82,403]],start:[93,379],end:[126,396]}
};
let sprites={},originalFrame=null,loaded=false;
function attachSource(){
 const lib=window.DepthsFullArt;if(!lib?.state?.ready)return false;
 const frame=lib.get('standCrouch',0);if(!frame)return false;originalFrame=frame;
 for(const [name,def] of Object.entries(parts)){
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
  g.beginPath();def.poly.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.clip();
  g.drawImage(frame,frame.sourceX||0,frame.sourceY||0);sprites[name]=c;
 }
 loaded=true;
 return true;
}

function drawPart(name,start,end,alpha=1,roll=0){
 const d=parts[name],im=sprites[name];if(!im)return;
 const a=V(...d.start),b=V(...d.end),source=Math.atan2(b.y-a.y,b.x-a.x),target=Math.atan2(end.y-start.y,end.x-start.x);
 const natural=Math.hypot(b.x-a.x,b.y-a.y),required=Math.hypot(end.x-start.x,end.y-start.y);
 ctx.save();ctx.globalAlpha=alpha;ctx.translate(start.x,start.y);ctx.rotate(target-source);
 const k=natural>1?required/natural:1;
 ctx.scale(clamp(k,.15,1.8),clamp(k,.15,1.8));if(name==='torso'&&roll){ctx.transform(1+.19*roll,0,.09*roll,1,0,0)}ctx.drawImage(im,-a.x,-a.y);ctx.restore();
}
function drawUpperArm(start,end,alpha=1){
 // The upper-arm crop contains duplicate rib-cage art. Draw an independent
 // graphite bone with fixed length and two fine chalk contour strokes.
 const dx=end.x-start.x,dy=end.y-start.y,len=Math.max(1,Math.hypot(dx,dy));
 const nx=-dy/len,ny=dx/len;
 ctx.save();ctx.globalAlpha=alpha;ctx.lineCap='round';ctx.lineJoin='round';
 function stroke(offset,width,color){
  ctx.beginPath();ctx.moveTo(start.x+nx*offset,start.y+ny*offset);
  ctx.quadraticCurveTo((start.x+end.x)/2+nx*(offset+1),(start.y+end.y)/2+ny*(offset+1),end.x+nx*offset,end.y+ny*offset);
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
 }
 stroke(-2.5,1.9,'#dfd7c9');stroke(2.5,1.5,'#eae2d4');stroke(0,.8,'rgba(238,229,211,.55)');
 for(const p of [start,end]){ctx.beginPath();ctx.arc(p.x,p.y,3.5,0,Math.PI*2);ctx.fillStyle='#171a1a';ctx.fill();ctx.strokeStyle='#e0d5c0';ctx.lineWidth=1.4;ctx.stroke()}
 ctx.restore();
}
function ik(hip,ankle,len1,len2,sign){
 const dx=ankle.x-hip.x,dy=ankle.y-hip.y;
 const magnitude=Math.max(.001,Math.hypot(dx,dy)),distance=clamp(magnitude,Math.abs(len1-len2)+.01,len1+len2-.01);
 const ux=dx/magnitude,uy=dy/magnitude,along=(distance*distance+len1*len1-len2*len2)/(2*distance);
 const height=Math.sqrt(Math.max(0,len1*len1-along*along));
 return V(hip.x+ux*along+sign*(-uy)*height,hip.y+uy*along+sign*ux*height);
}
// Authored contact/down/passing/up key poses, with two steps in each full cycle.
const WALK_POSES=[
 {t:0,    lx:.55,ly:0,   rx:-.55,ry:0,   bob:0,  arm:-1},
 {t:.125, lx:.28,ly:0,   rx:-.40,ry:-16, bob:3,  arm:-.72},
 {t:.25,  lx:0,  ly:0,   rx:0,   ry:-34, bob:-1, arm:0},
 {t:.375, lx:-.28,ly:0,  rx:.40, ry:-16, bob:-4, arm:.72},
 {t:.50,  lx:-.55,ly:0,  rx:.55, ry:0,   bob:0,  arm:1},
 {t:.625, lx:-.40,ly:-16,rx:.28,ry:0,   bob:3,  arm:.72},
 {t:.75,  lx:0,  ly:-34,rx:0,   ry:0,   bob:-1, arm:0},
 {t:.875, lx:.40,ly:-16,rx:-.28,ry:0,   bob:-4, arm:-.72},
 {t:1,    lx:.55,ly:0,   rx:-.55,ry:0,   bob:0,  arm:-1}
];
function walkPose(p){
 const t=((p%1)+1)%1;
 let i=0;while(i<WALK_POSES.length-2&&WALK_POSES[i+1].t<t)i++;
 const a=WALK_POSES[i],b=WALK_POSES[i+1];
 let u=(t-a.t)/(b.t-a.t);
 u=u*u*(3-2*u);
 const result={};for(const key of ['lx','ly','rx','ry','bob','arm'])result[key]=a[key]+(b[key]-a[key])*u;
 return result;
}
// Independent ankle timing per leg. Left contact is at phase 0,
// right contact is at phase .5. Toe lift happens only near the next
// contact; push-off occurs immediately after the foot trails behind.
const FOOT_ROLL_KEYS=[
 {t:0,angle:-12},   // heel strike: toe raised
 {t:.06,angle:0},   // foot settles
 {t:.36,angle:0},   // flat for most of planted stance
 {t:.45,angle:13},  // trailing foot begins pushing off
 {t:.53,angle:24},  // toe-down push-off
 {t:.62,angle:10},  // foot relaxes after toe-off
 {t:.72,angle:0},   // neutral in mid-swing
 {t:.88,angle:0},   // stay neutral until nearly full extension
 {t:.94,angle:-7},  // late toe lift, close to contact
 {t:1,angle:-12}
];
function ankleRollAt(footPhase){
 const t=((footPhase%1)+1)%1;
 let i=0;while(i<FOOT_ROLL_KEYS.length-2&&FOOT_ROLL_KEYS[i+1].t<t)i++;
 const a=FOOT_ROLL_KEYS[i],b=FOOT_ROLL_KEYS[i+1];
 let u=(t-a.t)/(b.t-a.t);u=u*u*(3-2*u);
 return a.angle+(b.angle-a.angle)*u;
}
// Foot sprite is anchored at the ankle. Turn its toe vector instead of
// rotating the whole leg or altering the planted ankle position.
function toeTarget(ankle,rollDeg){
 const baseline=Math.atan2(11,31);
 const angle=baseline+radians(rollDeg);
 const length=Math.hypot(31,11);
 return V(ankle.x+Math.cos(angle)*length,ankle.y+Math.sin(angle)*length);
}

const DEFAULTS=Object.freeze({stride:104,knee:0,lean:0,posture:6,arm:.75,elbow:.55,footroll:1,weight:5});
function ready(){return loaded||attachSource()}
function sample({phase=0,settings=DEFAULTS,posture='stand'}={}){
 const crouched=posture==='crouch';
  const c=settings,walk=walkPose(phase);
 // Shift the hips over the planted foot during each half-stride.
 const hipTravel=crouched?0:11*Math.sin(phase*2*Math.PI);
 const hipX=90+hipTravel;
 function crouchFoot(p){const u=((p%1)+1)%1;if(u<.5)return V(94+40-160*u,365);const k=(u-.5)*2;return V(94-40+80*(k*k*(3-2*k)),365-20*Math.sin(Math.PI*k)**2);}
 const footL=crouched?crouchFoot(phase):V(94+walk.lx*c.stride,381+walk.ly);
 const footR=crouched?crouchFoot(phase+.5):V(94+walk.rx*c.stride,381+walk.ry);
 const leftGround=walk.ly>=-0.1,rightGround=walk.ry>=-0.1;
 // Solve leg extension from actual grounded-foot reach. Bone lengths = 103+95.
 const groundedReach=Math.max(0,
    leftGround?Math.abs(footL.x-(hipX-3)):0,
    rightGround?Math.abs(footR.x-(hipX+3)):0);
 const targetLength=196;
 const stanceHeight=Math.sqrt(Math.max(100,targetLength*targetLength-groundedReach*groundedReach));
 const sink=walk.bob*c.weight/5;
 const desiredHipY=crouched?253+2*Math.cos(phase*4*Math.PI):381-stanceHeight+sink+c.knee*3;
 const maxReach=103+95-.02;
 const reach=(foot,hx)=>Math.sqrt(Math.max(0,maxReach*maxReach-(foot.x-hx)**2));
 const leftReach=reach(footL,hipX-3),rightReach=reach(footR,hipX+3);
 const lower=Math.max(footL.y-leftReach,footR.y-rightReach);
 const upper=Math.min(footL.y+leftReach,footR.y+rightReach);
 if(lower>upper||Math.abs(footL.x-(hipX-3))>=maxReach||Math.abs(footR.x-(hipX+3))>=maxReach)throw Error('Unreachable ankle targets');
 const hipY=clamp(desiredHipY,lower,upper);
 const hip=V(hipX,hipY),root=V(hipX-2,hipY-7);
 const tilt=radians(crouched?45:c.lean);
 const shoulder=add(root,rot(V(c.posture,-103),tilt)),neck=add(shoulder,rot(V(12,-18),tilt)),headBase=add(neck,rot(V(4,-14),tilt));
 // Forward-folding knee in recovery, naturally almost straight at contact.
 const kneeL=ik(V(hip.x-3,hip.y),footL,103,95,-1);
 const kneeR=ik(V(hip.x+3,hip.y),footR,103,95,-1);
 // Synchronize opposing arms to current foot separation. All limb sections rotate at joints.
 const legSeparation=walk.arm;
 const shoulderL=add(shoulder,rot(V(-5,2),tilt)),shoulderR=add(shoulder,rot(V(5,2),tilt));
 function armChain(origin,travel,side){
   const angle=crouched?.18+travel*.20:travel*c.arm*.66+tilt*.16;
   const elbow=add(origin,V(Math.sin(angle)*60,Math.cos(angle)*60));
   // Flex isn't fixed: recover during the backswing, bend as the hand comes forward.
   const cycle=Math.max(0,Math.min(1,(travel+1)/2));
   const flex=(.08+c.elbow*(.25+1.05*cycle))*(1+.08*Math.sin(phase*4*Math.PI));
   const lowerAngle=crouched?angle+1.05+flex*.25:angle+flex;
   const wrist=add(elbow,V(Math.sin(lowerAngle)*60,Math.cos(lowerAngle)*60));
   const hand=add(wrist,V(Math.sin(lowerAngle)*24,Math.cos(lowerAngle)*24));
   return {elbow,wrist,hand};
 }
 const leftArm=armChain(shoulderL,legSeparation,1),rightArm=armChain(shoulderR,-legSeparation,-1);
 const elbowL=leftArm.elbow,elbowR=rightArm.elbow;
 const wristL=leftArm.wrist,wristR=rightArm.wrist;
 return {hip,root,shoulder,neck,headBase,kneeL,kneeR,footL,footR,shoulderL,shoulderR,leftArm,rightArm,elbowL,elbowR,wristL,wristR,toeL:toeTarget(footL,ankleRollAt(phase)*(crouched?.3:c.footroll)),toeR:toeTarget(footR,ankleRollAt(phase+.5)*(crouched?.3:c.footroll))};
}
const ANATOMY=Object.freeze({scale:.44,thigh:103,shin:95,upperArm:60,forearm:60,hand:24,torso:Math.hypot(6,103),neck:Math.hypot(12,18),headOffset:Math.hypot(4,14),foot:Math.hypot(31,11),floor:381});
function draw(context,{phase=0,x=0,y=0,dir=1,settings=DEFAULTS,skin=true,bones=false,pose=null,displayScale=1}={}){
 const p=pose||sample({phase,settings}),art=skin&&ready(),prone=!!p.hipL;
 const {hip,root,shoulder,neck,headBase,kneeL,kneeR,footL,footR,shoulderL,shoulderR,leftArm,rightArm,elbowL,elbowR,wristL,wristR,toeL,toeR}=p;
 ctx=context;ctx.save();ctx.translate(x,y);ctx.scale((dir>=0?1:-1)*ANATOMY.scale*displayScale,ANATOMY.scale*displayScale);ctx.translate(-100,-381);
 if(art){
 // Draw arm layers first, then place the clean chest/ribcage over them.
 // This hides source-polygon overlap that previously made ribs blob into arms.
 drawPart('thigh',(p.hipR||V(hip.x+3,hip.y)),kneeR,prone?.88:.60);drawPart('shin',kneeR,footR,prone?.88:.60);
 drawPart('foot',footR,toeR,prone?.88:.60);
 drawUpperArm(shoulderR,elbowR,prone?.85:.57);drawPart('forearm',elbowR,wristR,prone?.85:.57);drawPart('hand',wristR,rightArm.hand,prone?.85:.57);
 drawPart('thigh',(p.hipL||V(hip.x-3,hip.y)),kneeL);drawPart('shin',kneeL,footL);drawPart('foot',footL,toeL);
 if(prone){const t=p.torsoEnd,dx=root.x-t.x,dy=root.y-t.y;ctx.save();ctx.strokeStyle='#d4c7ae';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(t.x,t.y);ctx.lineTo(root.x,root.y);ctx.stroke();ctx.strokeStyle='#807767';ctx.lineWidth=1.6;for(let k=1;k<5;k++){let u=k/5;ctx.beginPath();ctx.arc(t.x+dx*u,t.y+dy*u,4,0,Math.PI*2);ctx.stroke()}ctx.restore();}drawPart('pelvis',root,p.pelvisEnd||V(root.x+2,root.y+12));
 drawPart('torso',shoulder,p.torsoEnd||V(root.x+2,root.y-43),1,p.ribRoll||0);
 drawUpperArm(shoulderL,elbowL);drawPart('forearm',elbowL,wristL);drawPart('hand',wristL,leftArm.hand);
 drawPart('neck',neck,headBase);
 drawPart('head',headBase,p.headEnd||V(headBase.x+7,headBase.y-41));

 }
 if(bones||!art){const chains=[[(p.hipL||V(hip.x-3,hip.y)),kneeL,footL,toeL],[(p.hipR||V(hip.x+3,hip.y)),kneeR,footR,toeR],[root,p.ribHinge||root,shoulder,neck,headBase],[shoulderL,elbowL,wristL,leftArm.hand],[shoulderR,elbowR,wristR,rightArm.hand]];ctx.strokeStyle='#80d4b6';ctx.fillStyle='#14241f';ctx.lineWidth=2;for(const chain of chains){ctx.beginPath();chain.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));ctx.stroke();for(const v of chain){ctx.beginPath();ctx.arc(v.x,v.y,3,0,Math.PI*2);ctx.fill();ctx.stroke()}}}
 ctx.restore();return {pose:p,art};
}
window.DepthsMasterRig025={sample,draw,ready,anatomy:ANATOMY,defaults:DEFAULTS,version:'025 projected skin'};
})();
