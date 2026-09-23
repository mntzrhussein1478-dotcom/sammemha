import type {Metadata,Viewport} from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Onboarding from '@/components/Onboarding';
import PwaRegister from '@/components/PwaRegister';
import VercelObservability from '@/components/VercelObservability';
const site=process.env.NEXT_PUBLIC_SITE_URL||'https://sammemha.vercel.app';
export const metadata:Metadata={metadataBase:new URL(site),title:{default:'صمّمها | أدوات تصميم عربية سهلة',template:'%s | صمّمها'},description:'أنشئ أغلفة دفاتر وشهادات وجداول وبطاقات وQR وسيرة ذاتية ودعوات مباشرة من المتصفح.',applicationName:'صمّمها',alternates:{canonical:'/'},robots:{index:true,follow:true},openGraph:{type:'website',locale:'ar_IQ',siteName:'صمّمها',title:'صمّمها | أدوات تصميم عربية سهلة',description:'صمّم وصدّر ملفات PNG وPDF مباشرة من المتصفح.',images:[{url:'/opengraph-image.png',width:1200,height:630,alt:'صمّمها - أدوات تصميم عربية'}]},twitter:{card:'summary_large_image',title:'صمّمها',description:'أدوات تصميم عربية سهلة من المتصفح.',images:['/opengraph-image.png']},manifest:'/manifest.webmanifest',icons:{icon:[{url:'/icon.svg',type:'image/svg+xml'},{url:'/icon-192.png',sizes:'192x192',type:'image/png'}],apple:'/icon-192.png'}};
export const viewport:Viewport={themeColor:[{media:'(prefers-color-scheme: light)',color:'#f7f8fc'},{media:'(prefers-color-scheme: dark)',color:'#0e1017'}],width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl" suppressHydrationWarning><body><a className="skip-link" href="#main">تجاوز إلى المحتوى</a><Header/><main id="main">{children}</main><Footer/><Onboarding/><PwaRegister/><VercelObservability/></body></html>}
