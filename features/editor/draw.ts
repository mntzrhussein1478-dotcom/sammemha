import type {ImageTransform,TemplateDefinition,ToolDefinition} from '@/lib/types';

export type DrawOptions={
  template:TemplateDefinition;
  accent:string;
  background:string;
  fontScale:number;
  fontFamily:'sans'|'serif';
  images:Record<string,HTMLImageElement|null>;
  imageTransforms:Record<string,ImageTransform>;
  qrImage?:HTMLImageElement|null;
  showGuides?:boolean;
  includeBleed?:boolean;
};

const PX_PER_MM=96/25.4;
let ACTIVE_FAMILY='Tahoma, Arial, sans-serif';
const defaultTransform:ImageTransform={zoom:1,rotate:0,x:0,y:0};

export function exportSizeMm(tool:ToolDefinition,includeBleed:boolean){const bleed=includeBleed?tool.exportSettings.bleedMm:0;return{width:tool.dimensions.widthMm+bleed*2,height:tool.dimensions.heightMm+bleed*2}}
function isDark(hex:string){const h=hex.replace('#','');if(h.length!==6)return false;const [r,g,b]=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));return (r*299+g*587+b*114)/1000<125}
function inkFor(bg:string){return isDark(bg)?'#f8fafc':'#111827'}
function rgba(hex:string,alpha:number){const h=hex.replace('#','');if(h.length!==6)return `rgba(79,70,229,${alpha})`;const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return `rgba(${r},${g},${b},${alpha})`}
function setFont(c:CanvasRenderingContext2D,size:number,weight=400){c.font=`${weight} ${Math.max(9,size)}px ${ACTIVE_FAMILY}`}
function fit(c:CanvasRenderingContext2D,text:string,maxWidth:number,start:number,min=14,weight=700){let size=start;while(size>min){setFont(c,size,weight);if(c.measureText(text).width<=maxWidth)return size;size-=1.5}return min}
function splitWords(text:string){return text.trim().split(/\s+/).filter(Boolean)}
function wrapped(c:CanvasRenderingContext2D,text:string,maxWidth:number,maxLines:number){const words=splitWords(text);const out:string[]=[];let line='';for(const word of words){const candidate=line?`${line} ${word}`:word;if(c.measureText(candidate).width>maxWidth&&line){out.push(line);line=word;if(out.length===maxLines-1)break}else line=candidate}if(line&&out.length<maxLines)out.push(line);if(out.length===maxLines&&words.length){const last=out[maxLines-1];out[maxLines-1]=last.length>2?`${last.replace(/[.…]+$/,'')}…`:last}return out}
function drawWrapped(c:CanvasRenderingContext2D,text:string,x:number,y:number,maxWidth:number,lineHeight:number,maxLines=7){wrapped(c,text,maxWidth,maxLines).forEach((line,i)=>c.fillText(line,x,y+i*lineHeight))}
function drawImageCover(c:CanvasRenderingContext2D,image:HTMLImageElement|undefined|null,x:number,y:number,w:number,h:number,t:ImageTransform=defaultTransform,radius=0){if(!image)return;c.save();c.beginPath();radius?c.roundRect(x,y,w,h,radius):c.rect(x,y,w,h);c.clip();const base=Math.max(w/image.naturalWidth,h/image.naturalHeight);const scale=base*Math.max(.5,t.zoom||1);const dw=image.naturalWidth*scale,dh=image.naturalHeight*scale;c.translate(x+w/2+(t.x||0)*w*.35,y+h/2+(t.y||0)*h*.35);c.rotate(((t.rotate||0)*Math.PI)/180);c.drawImage(image,-dw/2,-dh/2,dw,dh);c.restore()}
function drawPattern(c:CanvasRenderingContext2D,pattern:TemplateDefinition['pattern'],W:number,H:number,accent:string,bg:string){c.save();const soft=isDark(bg)?'rgba(255,255,255,.10)':rgba(accent,.09);c.strokeStyle=soft;c.fillStyle=soft;c.lineWidth=2;
  if(pattern==='kids'){for(let i=0;i<18;i++){const r=12+(i%4)*9;c.beginPath();c.arc((i*83)%W,(i*131)%H,r,0,Math.PI*2);c.fill()}}
  else if(pattern==='education'){for(let y=40;y<H;y+=46){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}for(let x=48;x<W;x+=64){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke()}}
  else if(pattern==='games'){for(let i=0;i<32;i++){const s=10+(i%3)*6;c.fillRect((i*67)%W,(i*103)%H,s,s)}}
  else if(pattern==='cars'){c.lineWidth=5;c.setLineDash([28,22]);c.beginPath();c.moveTo(W*.18,0);c.lineTo(W*.66,H);c.stroke();c.setLineDash([]);c.lineWidth=2;c.beginPath();c.moveTo(W*.32,0);c.lineTo(W*.80,H);c.stroke()}
  else if(pattern==='space'){for(let i=0;i<48;i++){const r=1+(i%3);c.beginPath();c.arc((i*71)%W,(i*97)%H,r,0,Math.PI*2);c.fill()}c.beginPath();c.arc(W*.18,H*.22,46,0,Math.PI*2);c.stroke()}
  else if(pattern==='nature'){c.beginPath();c.moveTo(0,H*.78);c.quadraticCurveTo(W*.22,H*.56,W*.48,H*.78);c.quadraticCurveTo(W*.72,H*.58,W,H*.76);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill()}
  else if(pattern==='sport'){c.lineWidth=10;c.beginPath();c.arc(W*.12,H*.28,110,-1.2,1.2);c.stroke();c.beginPath();c.arc(W*.85,H*.76,160,1.9,4.4);c.stroke()}
  else if(pattern==='geometric'||pattern==='modern'||pattern==='bold'){for(let i=0;i<8;i++){c.save();c.translate((i*137)%W,(i*89)%H);c.rotate(Math.PI/4);c.strokeRect(-30,-30,60,60);c.restore()}}
  else if(pattern==='boys'){for(let x=-H;x<W;x+=55){c.beginPath();c.moveTo(x,0);c.lineTo(x+H,H);c.stroke()}}
  else if(pattern==='girls'||pattern==='soft'){for(let i=0;i<15;i++){const x=(i*101)%W,y=(i*149)%H;c.beginPath();c.arc(x,y,10+(i%3)*7,0,Math.PI*2);c.stroke()}}
  else if(pattern==='classic'||pattern==='formal'){c.strokeRect(16,16,W-32,H-32);c.strokeRect(28,28,W-56,H-56)}
  c.restore();
}
function drawGuides(c:CanvasRenderingContext2D,tool:ToolDefinition,W:number,H:number,bleedPx:number){if(!tool.exportSettings.safeMm&&!tool.exportSettings.bleedMm)return;c.save();c.lineWidth=1.5;c.setLineDash([8,6]);c.strokeStyle='rgba(220,38,38,.82)';c.strokeRect(.75,.75,W-1.5,H-1.5);const safe=tool.exportSettings.safeMm*PX_PER_MM;c.strokeStyle='rgba(5,150,105,.82)';c.strokeRect(safe,safe,W-safe*2,H-safe*2);if(bleedPx>0){c.strokeStyle='rgba(37,99,235,.82)';c.strokeRect(-bleedPx+.75,-bleedPx+.75,W+bleedPx*2-1.5,H+bleedPx*2-1.5)}c.setLineDash([]);c.restore()}

export function drawDesign(canvas:HTMLCanvasElement,tool:ToolDefinition,data:Record<string,string>,o:DrawOptions,dpi=96){
  ACTIVE_FAMILY=o.fontFamily==='serif'?"'Times New Roman', Times, serif":'Tahoma, Arial, sans-serif';
  const bleedMm=o.includeBleed?tool.exportSettings.bleedMm:0,scale=dpi/96,bleed=bleedMm*PX_PER_MM;
  const W=tool.dimensions.widthMm*PX_PER_MM,H=tool.dimensions.heightMm*PX_PER_MM,totalW=W+bleed*2,totalH=H+bleed*2;
  canvas.width=Math.max(1,Math.round(totalW*scale));canvas.height=Math.max(1,Math.round(totalH*scale));
  const c=canvas.getContext('2d');if(!c)return;c.save();c.scale(scale,scale);c.fillStyle=o.background;c.fillRect(0,0,totalW,totalH);c.translate(bleed,bleed);drawPattern(c,o.template.pattern,W,H,o.accent,o.background);
  const ink=inkFor(o.background),muted=isDark(o.background)?'#d1d5db':'#4b5563',acc=o.accent,fs=Math.min(1.25,Math.max(.8,o.fontScale||1));c.direction='rtl';c.textAlign='right';c.textBaseline='alphabetic';
  if(tool.slug==='qr'){
    c.fillStyle=o.background;c.fillRect(0,0,W,H);if(o.qrImage){const pad=W*.08;c.drawImage(o.qrImage,pad,pad,W-pad*2,H-pad*2)}
  } else if(tool.slug==='notebook-cover'){
    c.fillStyle=acc;c.fillRect(0,0,W,104);c.fillStyle='#fff';setFont(c,34*fs,800);c.fillText(data.subject||'دفتر',W-42,66);c.fillStyle=ink;const nameSize=fit(c,data.student||'',W-84,44*fs,18,800);setFont(c,nameSize,800);c.fillText(data.student||'',W-42,188);setFont(c,22*fs,500);c.fillStyle=muted;c.fillText(data.grade||'',W-42,236);c.fillText(data.school||'',W-42,276);c.fillText(data.year||'',W-42,316);if(o.images.photo){const s=Math.min(280,H-410);drawImageCover(c,o.images.photo,W-42-s,H-42-s,s,s,o.imageTransforms.photo,28);c.strokeStyle=rgba(acc,.65);c.lineWidth=4;c.strokeRect(W-42-s,H-42-s,s,s)}c.strokeStyle=acc;c.lineWidth=4;c.strokeRect(22,22,W-44,H-44)
  } else if(tool.slug==='certificate'){
    c.strokeStyle=acc;c.lineWidth=o.template.pattern==='classic'?12:8;c.strokeRect(24,24,W-48,H-48);c.strokeStyle=rgba(acc,.28);c.lineWidth=2;c.strokeRect(42,42,W-84,H-84);c.textAlign='center';c.fillStyle=acc;setFont(c,44*fs,800);c.fillText(data.type||'شهادة تقدير',W/2,132);c.fillStyle=muted;setFont(c,23*fs,500);c.fillText('تُمنح هذه الشهادة إلى',W/2,204);c.fillStyle=ink;setFont(c,fit(c,data.recipient||'',W-180,50*fs,22,800),800);c.fillText(data.recipient||'',W/2,278);c.fillStyle=muted;setFont(c,21*fs,500);c.fillText(`تقديراً للجهود المتميزة • ${data.issuer||''}`,W/2,338);setFont(c,17*fs,500);c.textAlign='right';c.fillText(data.date||'',W-85,H-72);c.textAlign='left';c.fillText(data.signature||'',85,H-72);if(o.images.signatureImage)drawImageCover(c,o.images.signatureImage,56,H-145,150,58,o.imageTransforms.signatureImage,2)
  } else if(tool.slug==='schedule'){
    c.textAlign='center';c.fillStyle=acc;setFont(c,34*fs,800);c.fillText(data.title||'',W/2,62);const days=(data.days||'').split('،').map(v=>v.trim()).filter(Boolean).slice(0,7);const periods=(data.periods||'').split('،').map(v=>v.trim()).filter(Boolean).slice(0,9);const rows=(data.subjects||'').split(/\n+/).map(row=>row.split('،').map(v=>v.trim()));const left=42,top=104,labelW=88,gridW=W-left*2-labelW,gridH=H-top-48,cols=Math.max(days.length,1),rws=Math.max(periods.length,1),cw=gridW/cols,rh=gridH/(rws+1);c.strokeStyle=rgba(acc,.25);c.lineWidth=1;c.fillStyle=acc;c.fillRect(left+labelW,top,gridW,rh);setFont(c,15*fs,800);c.fillStyle='#fff';days.forEach((d,i)=>c.fillText(d,left+labelW+cw*i+cw/2,top+rh*.66));periods.forEach((p,r)=>{const y=top+rh*(r+1);c.fillStyle=rgba(acc,.10);c.fillRect(left,y,labelW-4,rh-3);c.fillStyle=ink;c.fillText(p,left+(labelW-4)/2,y+rh*.64);days.forEach((_,col)=>{const x=left+labelW+cw*col;c.strokeRect(x,y,cw-3,rh-3);c.fillStyle=ink;setFont(c,14*fs,600);const subject=rows[col]?.[r]||'';c.fillText(subject,x+(cw-3)/2,y+rh*.64)})})
  } else if(tool.slug==='business-card'){
    if(o.template.id==='business-dark'){c.fillStyle='#0f172a';c.fillRect(0,0,W,H);c.fillStyle=acc;c.fillRect(0,0,W*.12,H)}else{c.fillStyle=acc;c.fillRect(W*.68,0,W*.32,H)}const localInk=o.template.id==='business-dark'?'#f8fafc':ink,localMuted=o.template.id==='business-dark'?'#cbd5e1':muted;c.fillStyle=localInk;c.textAlign='right';setFont(c,fit(c,data.name||'',W*.56,30*fs,16,800),800);c.fillText(data.name||'',W*.61,68);setFont(c,17*fs,500);c.fillStyle=localMuted;c.fillText(data.job||'',W*.61,99);setFont(c,13.5*fs,500);[data.phone,data.email,data.website].filter(Boolean).forEach((v,i)=>c.fillText(v,W*.61,138+i*24));if(o.images.logo)drawImageCover(c,o.images.logo,W*.73,22,W*.20,56,o.imageTransforms.logo,8);if(o.qrImage)c.drawImage(o.qrImage,W*.76,H-112,86,86)
  } else if(tool.slug==='cv'){
    const sidebar=o.template.id==='cv-sidebar',bold=o.template.id==='cv-bold';if(sidebar){c.fillStyle=acc;c.fillRect(W*.72,0,W*.28,H);c.fillStyle='#fff';c.textAlign='center';setFont(c,28*fs,800);c.fillText(data.name||'',W*.86,90);setFont(c,17*fs,500);c.fillText(data.title||'',W*.86,126);if(o.images.photo){c.save();c.beginPath();c.arc(W*.86,205,62,0,Math.PI*2);c.clip();drawImageCover(c,o.images.photo,W*.86-62,143,124,124,o.imageTransforms.photo);c.restore()}c.textAlign='right';setFont(c,15*fs,500);c.fillText(data.contact||'',W-34,306)}else{if(bold){c.fillStyle=acc;c.fillRect(0,0,W,126);c.fillStyle='#fff'}else c.fillStyle=ink;c.textAlign='right';setFont(c,34*fs,800);c.fillText(data.name||'',W-48,64);setFont(c,18*fs,500);c.fillText(data.title||'',W-48,94);c.fillStyle=bold?'#eef2ff':muted;setFont(c,14*fs,500);c.fillText(data.contact||'',W-48,116);if(o.images.photo)drawImageCover(c,o.images.photo,46,38,92,92,o.imageTransforms.photo,46)}
    c.textAlign='right';const contentRight=sidebar?W*.66:W-48,contentWidth=sidebar?W*.61:W-96;let y=sidebar?86:172;c.fillStyle=ink;for(const [title,key,space] of [['نبذة','summary',128],['التعليم','education',132],['الخبرة','experience',176],['المهارات','skills',132],['اللغات','languages',95]] as const){setFont(c,22*fs,800);c.fillStyle=acc;c.fillText(title,contentRight,y);setFont(c,15.5*fs,500);c.fillStyle=muted;drawWrapped(c,data[key]||'',contentRight,y+28,contentWidth,23*fs,key==='experience'?6:4);y+=space}}
  else if(tool.slug==='invitation'){
    c.textAlign='center';c.fillStyle=acc;setFont(c,29*fs,800);c.fillText(data.occasion||'',W/2,105);c.fillStyle=ink;setFont(c,fit(c,data.name||'',W-90,38*fs,18,800),800);c.fillText(data.name||'',W/2,188);c.fillStyle=muted;setFont(c,18*fs,500);c.fillText(`${data.date||''} • ${data.time||''}`,W/2,245);c.fillText(data.place||'',W/2,282);setFont(c,19*fs,500);drawWrapped(c,data.message||'',W/2,350,W-110,30*fs,5);c.strokeStyle=acc;c.lineWidth=3;c.strokeRect(24,24,W-48,H-48)
  }
  if(o.showGuides)drawGuides(c,tool,W,H,bleed);c.restore();
}
