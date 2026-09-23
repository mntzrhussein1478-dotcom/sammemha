import type {Metadata} from 'next';
import RecentDesigns from '@/components/RecentDesigns';
import ToolsExplorer from '@/components/ToolsExplorer';
export const metadata:Metadata={title:'الأدوات',description:'استعرض أدوات صمّمها: أغلفة دفاتر، شهادات، جداول، بطاقات عمل، QR، سيرة ذاتية ودعوات.',alternates:{canonical:'/tools'}};
export default function Page(){return <div className="container"><header className="page-head"><span className="eyebrow">7 أدوات تعمل الآن</span><h1>أدوات التصميم</h1><p>اختر الأداة، اختر القالب، عدّل البيانات وشاهد النتيجة مباشرة، ثم نزّل PNG أو PDF بدون حساب.</p></header><RecentDesigns/><ToolsExplorer/></div>}
