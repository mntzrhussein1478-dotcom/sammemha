'use client';
import {useEffect,useState} from 'react';

type Theme='light'|'dark'|'system';
function readTheme():Theme{try{const raw=localStorage.getItem('sammemha:theme');if(raw==='light'||raw==='dark'||raw==='system')return raw}catch{}return 'system'}
function resolved(theme:Theme){return theme==='dark'||(theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}

export default function ThemeToggle(){
  const [theme,setTheme]=useState<Theme>('system');
  useEffect(()=>{
    const media=window.matchMedia('(prefers-color-scheme: dark)');
    const sync=()=>{const saved=readTheme();setTheme(saved);document.documentElement.dataset.theme=resolved(saved)};
    const frame=requestAnimationFrame(sync);
    const onChange=()=>{if(readTheme()==='system')document.documentElement.dataset.theme=resolved('system')};
    media.addEventListener('change',onChange);
    return()=>{cancelAnimationFrame(frame);media.removeEventListener('change',onChange)};
  },[]);
  function apply(next:Theme){setTheme(next);document.documentElement.dataset.theme=resolved(next);try{localStorage.setItem('sammemha:theme',next)}catch{}}
  function cycle(){apply(theme==='system'?'light':theme==='light'?'dark':'system')}
  const label=theme==='system'?'النظام':theme==='light'?'فاتح':'داكن';
  return <button className="icon-btn" onClick={cycle} aria-label="تغيير المظهر" title={`المظهر: ${label}`}>{theme==='dark'?'☾':theme==='light'?'☀':'◐'}</button>;
}
