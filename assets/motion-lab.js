/* The Depths — animation lab. No gameplay state is changed by this panel. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),canvas=$('labCanvas');
if(!canvas)return;
const ctx=canvas.getContext('2d');
let selected='walk',running=true,reverse=false,speed=1,clock=0,last=0;
const names=['walk','standCrouch','crouchWalk','standProne','crouchProne','proneCrawl','standMine','crouchMine','proneMine'];
const labels=['Upright walk','Stand → crouch','Crouch walk','Stand → prone','Crouch → prone','Prone crawl','Standing pickaxe','Crouched pickaxe','Prone rock pick'];
names.forEach((name,i)=>{const option=document.createElement('option');option.value=name;option.textContent=labels[i];$('labSelect').appendChild(option)});
$('labSelect').onchange=()=>{selected=$('labSelect').value;clock=0};
$('labPause').onclick=()=>{running=!running;$('labPause').textContent=running?'⏸ Pause':'▶ Play'};
$('labReverse').onclick=()=>{reverse=!reverse;$('labReverse').textContent=reverse?'↩ Reverse ON':'↩ Reverse OFF';clock=0};
$('labSpeed').onchange=()=>{speed=Number($('labSpeed').value)||1};
function loop(t){
 const dt=last?Math.min(.08,(t-last)/1000):0;last=t;
 if(running)clock+=dt*speed;
 const isTransition=selected==='standCrouch'||selected==='standProne'||selected==='crouchProne';
 const count=selected==='walk'?7:(window.DepthMotions?.count(selected)||8),duration=isTransition?1.8:1.0;
 const normalized=(clock%duration)/duration;
 let frame=Math.min(count-1,Math.floor(normalized*count));
 if(reverse)frame=count-1-frame;
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle='#0c1012';ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle='#313331';ctx.fillRect(0,247,canvas.width,33);
 ctx.strokeStyle='#b9a17e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,247);ctx.lineTo(canvas.width,247);ctx.stroke();
 const image=window.DepthMotions?.get(selected,frame);
 if(image){
   ctx.imageSmoothingEnabled=true;ctx.drawImage(image,canvas.width/2-160,247-222,320,240);
   $('labStatus').textContent=labels[names.indexOf(selected)]+' • frame '+(frame+1)+'/'+count+(isTransition?' • transition (reversible)':' • loop');
 }else{
   const stats=window.DepthMotions?.stats();
   $('labStatus').textContent='Loading '+selected+'... '+(stats?.ready||0)+'/'+(stats?.total||9)+' assets ('+(stats?.errors?.length||0)+' errors)';
   ctx.font='18px system-ui';ctx.fillStyle='#c3ac85';ctx.textAlign='center';
   ctx.fillText('Preparing animation…',canvas.width/2,130);
 }
 requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();