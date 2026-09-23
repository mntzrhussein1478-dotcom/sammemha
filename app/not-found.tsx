import type {Metadata} from 'next';
import Link from 'next/link';

export const metadata:Metadata={
  title:'404 | الصفحة غير موجودة',
  robots:{index:false,follow:false},
  alternates:{canonical:null}
};

export default function NotFound(){
  return <div className="container page-head" style={{textAlign:'center',paddingBlock:'100px'}}>
    <span className="eyebrow">404</span>
    <h1>هذه الصفحة غير موجودة</h1>
    <p>قد يكون الرابط تغيّر أو كُتب بشكل غير صحيح.</p>
    <div className="hero-actions" style={{justifyContent:'center'}}>
      <Link className="btn primary" href="/">الرئيسية</Link>
      <Link className="btn ghost" href="/tools">الأدوات</Link>
    </div>
  </div>
}
