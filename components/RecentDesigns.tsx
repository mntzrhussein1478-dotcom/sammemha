'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {toolsBySlug} from '@/data/tools';
import {clearRecentDesigns,getRecentDesigns} from '@/lib/storage';
import type {RecentDesign} from '@/lib/types';

function formatDate(value:number){return new Intl.DateTimeFormat('ar-IQ',{dateStyle:'medium',timeStyle:'short'}).format(value)}

export default function RecentDesigns(){
  const [items,setItems]=useState<RecentDesign[]>([]);
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>setItems(getRecentDesigns()));
    return()=>cancelAnimationFrame(frame);
  },[]);
  if(!items.length)return null;
  return <section className="recent-section" aria-labelledby="recent-title"><div className="section-head compact"><div><span className="eyebrow">محفوظ محلياً</span><h2 id="recent-title">آخر التصاميم</h2></div><button className="mini" onClick={()=>{clearRecentDesigns();setItems([])}}>مسح القائمة</button></div><div className="recent-grid">{items.map(item=>{const tool=toolsBySlug[item.slug];const template=tool?.templates.find(t=>t.id===item.templateId);if(!tool)return null;return <Link href={`/tools/${item.slug}`} className="recent-card" key={`${item.slug}:${item.templateId}`}><strong>{tool.name}</strong><span>{template?.name||'القالب الافتراضي'}</span><small>{formatDate(item.updatedAt)}</small></Link>})}</div></section>;
}
