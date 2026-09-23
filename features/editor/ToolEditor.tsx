'use client';

import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import type {DesignDraft,DraftStyle,ImageTransform,ToolDefinition,ToolField} from '@/lib/types';
import {drawDesign,exportSizeMm} from './draw';
import {canvasToPdf,canvasToPng} from '@/lib/export';
import {fileToSafeDataUrl} from '@/lib/image';
import {isTemplateFavorite,loadDraft,saveDraft,saveRecent,toggleTemplateFavorite} from '@/lib/storage';
import {migrateDraft} from '@/lib/tool-versioning';
import {hasQrPayload,qrPayload} from '@/lib/qr';

type Snapshot={
  data:Record<string,string>;
  style:DraftStyle;
  imageUrls:Record<string,string>;
  imageTransforms:Record<string,ImageTransform>;
};
const defaultTransform:ImageTransform={zoom:1,rotate:0,x:0,y:0};
const clone=<T,>(value:T):T=>JSON.parse(JSON.stringify(value)) as T;
const imageLabel=(key:string)=>key==='photo'?'الصورة':key==='logo'?'الشعار':'التوقيع';

export default function ToolEditor({tool}:{tool:ToolDefinition}){
  const initialTemplate=tool.templates.find(t=>t.id===tool.defaultTemplateId)??tool.templates[0];
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const exportRef=useRef<HTMLCanvasElement>(null);
  const [data,setData]=useState<Record<string,string>>(tool.defaults);
  const [style,setStyle]=useState<DraftStyle>({accent:initialTemplate.accent,background:initialTemplate.background,fontScale:1,fontFamily:'sans',templateId:initialTemplate.id,includeBleed:false});
  const [imageUrls,setImageUrls]=useState<Record<string,string>>({});
  const [images,setImages]=useState<Record<string,HTMLImageElement|null>>({});
  const [imageTransforms,setImageTransforms]=useState<Record<string,ImageTransform>>({});
  const [zoom,setZoom]=useState(.68);
  const [busy,setBusy]=useState(false);
  const [progress,setProgress]=useState(0);
  const [error,setError]=useState('');
  const [fav,setFav]=useState(false);
  const [qr,setQr]=useState<HTMLImageElement|null>(null);
  const [showGuides,setShowGuides]=useState(true);
  const [history,setHistory]=useState<Snapshot[]>([]);
  const [redo,setRedo]=useState<Snapshot[]>([]);
  const [loaded,setLoaded]=useState(false);
  const [dirty,setDirty]=useState(false);

  const template=useMemo(()=>tool.templates.find(t=>t.id===style.templateId)??initialTemplate,[tool.templates,style.templateId,initialTemplate]);
  const currentSnapshot=useCallback(():Snapshot=>({data:clone(data),style:clone(style),imageUrls:clone(imageUrls),imageTransforms:clone(imageTransforms)}),[data,style,imageUrls,imageTransforms]);
  const pushHistory=useCallback(()=>{setHistory(h=>[...h.slice(-29),currentSnapshot()]);setRedo([]);setDirty(true)},[currentSnapshot]);
  const applySnapshot=useCallback((snapshot:Snapshot)=>{setData(snapshot.data);setStyle(snapshot.style);setImageUrls(snapshot.imageUrls);setImageTransforms(snapshot.imageTransforms);setDirty(true)},[]);

  useEffect(()=>{let live=true;void(async()=>{const raw=await loadDraft(tool.slug);if(!live)return;if(raw){const draft=migrateDraft(raw,tool);setData(draft.data);setStyle(draft.style);setImageUrls(draft.imageUrls||{});setImageTransforms(draft.imageTransforms||{})}setLoaded(true)})();return()=>{live=false}},[tool]);
  useEffect(()=>setFav(isTemplateFavorite(tool.slug,style.templateId)),[tool.slug,style.templateId]);
  useEffect(()=>{let cancelled=false;const entries=Object.entries(imageUrls);if(!entries.length){setImages({});return}const next:Record<string,HTMLImageElement|null>={};let pending=entries.length;for(const[key,url]of entries){if(!url){next[key]=null;if(--pending===0&&!cancelled)setImages(next);continue}const image=new Image();image.onload=()=>{next[key]=image;if(--pending===0&&!cancelled)setImages(next)};image.onerror=()=>{next[key]=null;if(--pending===0&&!cancelled)setImages(next)};image.src=url}return()=>{cancelled=true}},[imageUrls]);
  useEffect(()=>{if(!loaded)return;const id=window.setTimeout(()=>{const draft:DesignDraft={schemaVersion:1,slug:tool.slug,templateVersion:template.version,updatedAt:Date.now(),data,style,imageUrls,imageTransforms};void(async()=>{await saveDraft(draft);saveRecent({slug:tool.slug,title:tool.name,templateId:template.id,updatedAt:draft.updatedAt});setDirty(false)})()},450);return()=>window.clearTimeout(id)},[loaded,tool,template,data,style,imageUrls,imageTransforms]);
  useEffect(()=>{function before(event:BeforeUnloadEvent){if(!dirty)return;event.preventDefault();event.returnValue=''}window.addEventListener('beforeunload',before);return()=>window.removeEventListener('beforeunload',before)},[dirty]);

  useEffect(()=>{let cancelled=false;void(async()=>{try{let payload='';let level:'L'|'M'|'Q'|'H'='M';let dark='#111827',light='#ffffff';if(tool.slug==='qr'){if(!hasQrPayload(data)){setQr(null);return}payload=qrPayload(data);level=(['L','M','Q','H'].includes(data.errorCorrection)?data.errorCorrection:'H') as typeof level;dark=data.fg||dark;light=data.bg||light}else if(tool.slug==='business-card'){payload=(data.website||data.phone||'').trim();if(!payload){setQr(null);return}payload=data.website||`tel:${data.phone}`}else{setQr(null);return}const {default:QRCode}=await import('qrcode');const url=await QRCode.toDataURL(payload,{errorCorrectionLevel:level,margin:2,width:1400,color:{dark,light}});if(cancelled)return;const image=new Image();image.onload=()=>{if(!cancelled)setQr(image)};image.src=url}catch{if(!cancelled)setQr(null)}})();return()=>{cancelled=true}},[tool.slug,data]);
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;drawDesign(canvas,tool,data,{template,accent:style.accent,background:style.background,fontScale:style.fontScale,fontFamily:style.fontFamily,images,imageTransforms,qrImage:qr,showGuides,includeBleed:tool.exportSettings.bleedMm>0},96)},[tool,data,template,style,images,imageTransforms,qr,showGuides]);

  const undo=useCallback(()=>{const previous=history.at(-1);if(!previous)return;setRedo(items=>[currentSnapshot(),...items].slice(0,30));setHistory(items=>items.slice(0,-1));applySnapshot(previous)},[history,currentSnapshot,applySnapshot]);
  const redoIt=useCallback(()=>{const next=redo[0];if(!next)return;setHistory(items=>[...items,currentSnapshot()].slice(-30));setRedo(items=>items.slice(1));applySnapshot(next)},[redo,currentSnapshot,applySnapshot]);
  useEffect(()=>{function onKey(event:KeyboardEvent){if(!(event.ctrlKey||event.metaKey)||event.key.toLowerCase()!=='z')return;event.preventDefault();event.shiftKey?redoIt():undo()}window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[undo,redoIt]);

  function patch(key:string,value:string){pushHistory();setData(current=>({...current,[key]:value}))}
  function patchStyle(next:Partial<DraftStyle>){pushHistory();setStyle(current=>({...current,...next}))}
  function chooseTemplate(id:string){const next=tool.templates.find(item=>item.id===id);if(!next)return;pushHistory();setStyle(current=>({...current,templateId:id,accent:next.accent,background:next.background}))}
  async function upload(key:string,file?:File){if(!file)return;setError('');try{const safe=await fileToSafeDataUrl(file);pushHistory();setImageUrls(current=>({...current,[key]:safe.dataUrl}));setImageTransforms(current=>({...current,[key]:current[key]??defaultTransform}))}catch(reason){setError(reason instanceof Error?reason.message:'تعذر قراءة الصورة')}}
  function updateTransform(key:string,next:Partial<ImageTransform>){pushHistory();setImageTransforms(current=>({...current,[key]:{...(current[key]??defaultTransform),...next}}))}
  function removeImage(key:string){pushHistory();setImageUrls(current=>{const next={...current};delete next[key];return next});setImageTransforms(current=>{const next={...current};delete next[key];return next})}
  function reset(){pushHistory();setData(tool.defaults);setStyle({accent:initialTemplate.accent,background:initialTemplate.background,fontScale:1,fontFamily:'sans',templateId:initialTemplate.id,includeBleed:false});setImageUrls({});setImageTransforms({});setError('')}
  async function exportFile(kind:'png'|'pdf'){setBusy(true);setProgress(12);setError('');try{await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));const canvas=exportRef.current;if(!canvas)throw new Error('تعذر تجهيز التصدير');setProgress(38);drawDesign(canvas,tool,data,{template,accent:style.accent,background:style.background,fontScale:style.fontScale,fontFamily:style.fontFamily,images,imageTransforms,qrImage:qr,showGuides:false,includeBleed:style.includeBleed},tool.exportSettings.dpi);setProgress(78);await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));const label=data.student||data.recipient||data.name||data.title||'design';const fileName=`${tool.slug}-${label}`;const size=exportSizeMm(tool,style.includeBleed);if(kind==='png')await canvasToPng(canvas,fileName);else await canvasToPdf(canvas,fileName,size.width,size.height);setProgress(100)}catch(reason){setError(reason instanceof Error?reason.message:'فشل التصدير')}finally{window.setTimeout(()=>{setBusy(false);setProgress(0)},300)}}
  const visibleFields=tool.fields.filter(field=>!field.showWhen||data[field.showWhen.key]===field.showWhen.value);

  function renderField(field:ToolField){
    const id=`field-${field.key}`;
    if(field.type==='image'){
      const transform=imageTransforms[field.key]??defaultTransform;
      return <div className="field-block" key={field.key}><label htmlFor={id}>{field.label}</label><input id={id} type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>upload(field.key,event.target.files?.[0])}/>{imageUrls[field.key]&&<div className="image-controls"><span>{imageLabel(field.key)} جاهزة • قص مركزي آمن</span><label htmlFor={`${id}-zoom`}>تكبير</label><input id={`${id}-zoom`} type="range" min="0.8" max="2.5" step="0.05" value={transform.zoom} onChange={event=>updateTransform(field.key,{zoom:Number(event.target.value)})}/><label htmlFor={`${id}-rotate`}>دوران</label><input id={`${id}-rotate`} type="range" min="-180" max="180" step="1" value={transform.rotate} onChange={event=>updateTransform(field.key,{rotate:Number(event.target.value)})}/><div className="image-position"><div><label htmlFor={`${id}-x`}>أفقي</label><input id={`${id}-x`} type="range" min="-1" max="1" step="0.05" value={transform.x} onChange={event=>updateTransform(field.key,{x:Number(event.target.value)})}/></div><div><label htmlFor={`${id}-y`}>عمودي</label><input id={`${id}-y`} type="range" min="-1" max="1" step="0.05" value={transform.y} onChange={event=>updateTransform(field.key,{y:Number(event.target.value)})}/></div></div><button type="button" className="mini danger" onClick={()=>removeImage(field.key)}>إزالة الصورة</button></div>}{field.helper&&<small>{field.helper}</small>}</div>;
    }
    if(field.type==='textarea')return <div className="field-block" key={field.key}><label htmlFor={id}>{field.label}</label><textarea id={id} value={data[field.key]||''} maxLength={field.maxLength} placeholder={field.placeholder} required={field.required} onChange={event=>patch(field.key,event.target.value)}/>{field.helper&&<small>{field.helper}</small>}</div>;
    if(field.type==='select')return <div className="field-block" key={field.key}><label htmlFor={id}>{field.label}</label><select id={id} value={data[field.key]||''} onChange={event=>patch(field.key,event.target.value)}>{field.options?.map(option=><option value={option.value} key={option.value}>{option.label}</option>)}</select>{field.helper&&<small>{field.helper}</small>}</div>;
    return <div className="field-block" key={field.key}><label htmlFor={id}>{field.label}</label><input id={id} type={field.type} required={field.required} maxLength={field.maxLength} value={data[field.key]||''} placeholder={field.placeholder} onChange={event=>patch(field.key,event.target.value)}/>{field.helper&&<small>{field.helper}</small>}</div>;
  }

  return <div className="editor-shell">
    <aside className="control-panel" aria-label="لوحة إعدادات التصميم">
      <div className="editor-toolbar"><button className="mini" disabled={!history.length} onClick={undo}>تراجع</button><button className="mini" disabled={!redo.length} onClick={redoIt}>إعادة</button><button className="mini" onClick={reset}>إعادة ضبط</button></div>
      <section className="control-section"><div className="control-heading"><h2>القالب</h2><button className="mini" onClick={()=>setFav(toggleTemplateFavorite(tool.slug,template.id))}>{fav?'★ محفوظ':'☆ حفظ القالب'}</button></div><div className="template-strip">{tool.templates.map(item=><button key={item.id} className={item.id===template.id?'template-option active':'template-option'} onClick={()=>chooseTemplate(item.id)} aria-pressed={item.id===template.id}><span className="template-swatch" style={{background:`linear-gradient(135deg,${item.background} 52%,${item.accent} 52%)`}}/><span>{item.name}</span><small>{item.category}</small></button>)}</div></section>
      <section className="control-section"><h2>بيانات التصميم</h2><div className="field-grid">{visibleFields.map(renderField)}</div></section>
      {tool.slug!=='qr'&&<section className="control-section"><h2>المظهر</h2><div className="field-row"><label htmlFor="accent-color">اللون الرئيسي<input id="accent-color" type="color" value={style.accent} onChange={event=>patchStyle({accent:event.target.value})}/></label><label htmlFor="background-color">الخلفية<input id="background-color" type="color" value={style.background} onChange={event=>patchStyle({background:event.target.value})}/></label></div><label className="font-select" htmlFor="font-family">الخط<select id="font-family" value={style.fontFamily} onChange={event=>patchStyle({fontFamily:event.target.value as 'sans'|'serif'})}><option value="sans">عربي Sans</option><option value="serif">عربي Serif</option></select></label><label className="range-label" htmlFor="font-scale">حجم النص <span>{Math.round(style.fontScale*100)}%</span><input id="font-scale" type="range" min="0.8" max="1.2" step="0.02" value={style.fontScale} onChange={event=>patchStyle({fontScale:Number(event.target.value)})}/></label></section>}
      {tool.exportSettings.bleedMm>0&&<section className="control-section"><label className="check-row"><input type="checkbox" checked={style.includeBleed} onChange={event=>patchStyle({includeBleed:event.target.checked})}/><span>تضمين Bleed ‏{tool.exportSettings.bleedMm} مم في الملف النهائي</span></label></section>}
      <div className="privacy-note">الحفظ تلقائي في IndexedDB على جهازك. الصور تُعاد معالجتها محلياً لإزالة Metadata مثل EXIF ولا تُرفع إلى خادم صمّمها.</div>
      {error&&<div className="error-msg" role="alert">{error}</div>}
    </aside>
    <section className="preview-panel" aria-label="معاينة التصميم">
      <div className="preview-top"><div><strong>المعاينة المباشرة</strong><span>Trim: {tool.dimensions.widthMm} × {tool.dimensions.heightMm} مم • {tool.exportSettings.dpi} DPI عند التصدير</span></div><div className="zoom"><button aria-label="تصغير المعاينة" onClick={()=>setZoom(value=>Math.max(.28,value-.1))}>−</button><span>{Math.round(zoom*100)}%</span><button aria-label="تكبير المعاينة" onClick={()=>setZoom(value=>Math.min(1.25,value+.1))}>+</button><button onClick={()=>setZoom(.68)}>ملاءمة</button></div></div>
      <div className="canvas-stage"><div className="page-wrap" style={{transform:`scale(${zoom})`}}><canvas ref={canvasRef} aria-label="المعاينة المرئية للتصميم"/></div></div>
      <div className="print-legend"><button className="mini" onClick={()=>setShowGuides(value=>!value)}>{showGuides?'إخفاء خطوط الطباعة':'إظهار خطوط الطباعة'}</button><span><i className="guide-dot trim"/>Trim</span><span><i className="guide-dot safe"/>Safe Area</span>{tool.exportSettings.bleedMm>0&&<span><i className="guide-dot bleed"/>Bleed</span>}</div>
      <div className="export-bar"><button className="btn primary" disabled={busy} onClick={()=>exportFile('png')}>{busy?`تجهيز ${progress}%`:'تنزيل PNG'}</button><button className="btn secondary" disabled={busy} onClick={()=>exportFile('pdf')}>تنزيل PDF</button>{busy&&<progress max="100" value={progress} aria-label="تقدم التصدير"/>}</div>
      <canvas ref={exportRef} hidden/>
    </section>
  </div>;
}
