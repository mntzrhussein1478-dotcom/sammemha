import {uploadPolicy} from '@/config/security';

type SafeImage={dataUrl:string;width:number;height:number};
function detectSignature(bytes:Uint8Array){
  if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return 'image/jpeg';
  if(bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47&&bytes[4]===0x0d&&bytes[5]===0x0a&&bytes[6]===0x1a&&bytes[7]===0x0a)return 'image/png';
  if(String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'image/webp';
  return null;
}
async function decode(file:File){
  if('createImageBitmap' in window)return createImageBitmap(file);
  const url=URL.createObjectURL(file);
  try{
    const image=await new Promise<HTMLImageElement>((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('تعذر فك ترميز الصورة'));im.src=url});
    return image;
  } finally { URL.revokeObjectURL(url) }
}
export async function validateImage(file:File){
  if(!uploadPolicy.allowedMime.includes(file.type as (typeof uploadPolicy.allowedMime)[number]))throw new Error('الملف يجب أن يكون JPG أو PNG أو WebP');
  if(file.size>uploadPolicy.maxBytes)throw new Error('حجم الصورة يجب ألا يتجاوز 8MB');
  const bytes=new Uint8Array(await file.slice(0,16).arrayBuffer());
  const signature=detectSignature(bytes);
  if(!signature||signature!==file.type)throw new Error('نوع الصورة لا يطابق محتواها الفعلي');
  return true;
}
export async function fileToSafeDataUrl(file:File):Promise<SafeImage>{
  await validateImage(file);
  const source=await decode(file);
  const width='naturalWidth' in source?source.naturalWidth:source.width;
  const height='naturalHeight' in source?source.naturalHeight:source.height;
  if(!width||!height)throw new Error('أبعاد الصورة غير صالحة');
  if(width>uploadPolicy.maxDimension||height>uploadPolicy.maxDimension)throw new Error('أبعاد الصورة كبيرة جداً');
  const max=1800,scale=Math.min(1,max/Math.max(width,height));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)throw new Error('المتصفح لا يدعم معالجة الصورة');
  ctx.drawImage(source as CanvasImageSource,0,0,canvas.width,canvas.height);
  if('close' in source&&typeof source.close==='function')source.close();
  const outputType=file.type==='image/png'?'image/png':'image/jpeg';
  return {dataUrl:canvas.toDataURL(outputType,0.9),width:canvas.width,height:canvas.height};
}
