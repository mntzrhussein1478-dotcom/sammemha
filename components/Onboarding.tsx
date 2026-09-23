'use client';
import {useEffect,useRef,useState} from 'react';

export default function Onboarding(){
  const [show,setShow]=useState(false);
  const [step,setStep]=useState(0);
  const primary=useRef<HTMLButtonElement>(null);

  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      try{setShow(!localStorage.getItem('sammemha:onboarded'))}
      catch{setShow(true)}
    });
    return()=>cancelAnimationFrame(frame);
  },[]);

  useEffect(()=>{
    if(!show)return;
    primary.current?.focus();
    function key(e:KeyboardEvent){if(e.key==='Escape')done()}
    document.addEventListener('keydown',key);
    return()=>document.removeEventListener('keydown',key);
  },[show,step]);

  if(!show)return null;
  const items=[
    ['اختر أداة','ابدأ من الأداة والقالب المناسبين بدون إنشاء حساب.'],
    ['عدّل وشاهد','كل تغيير يظهر مباشرة، ومسودتك تُحفظ محلياً على جهازك.'],
    ['نزّل تصميمك','صدّر PNG عالي الدقة أو PDF للطباعة مع Safe Area وBleed عند الحاجة.'],
  ];
  function done(){try{localStorage.setItem('sammemha:onboarded','1')}catch{}setShow(false)}

  return <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title" aria-describedby="onboarding-description"><span className="eyebrow">{step+1} / 3</span><h2 id="onboarding-title">{items[step][0]}</h2><p id="onboarding-description">{items[step][1]}</p><div className="modal-actions"><button className="btn ghost" onClick={done}>تخطي</button>{step<2?<button ref={primary} className="btn primary" onClick={()=>setStep(s=>s+1)}>التالي</button>:<button ref={primary} className="btn primary" onClick={done}>ابدأ الآن</button>}</div></div></div>;
}
