import type {Metadata} from 'next';

export const metadata:Metadata={
  title:'الملاحظات والاقتراحات',
  description:'أرسل اقتراح أداة أو بلاغاً عن خطأ أو ملاحظة حول منصة صمّمها، مع الحفاظ على الخصوصية وعدم إرسال بيانات حساسة.',
  alternates:{canonical:'/feedback'},
  openGraph:{
    title:'الملاحظات والاقتراحات | صمّمها',
    description:'شارك اقتراحاً أو بلاغاً عن خطأ لتحسين منصة صمّمها.',
    url:'/feedback'
  }
};

export default function FeedbackLayout({children}:{children:React.ReactNode}){
  return children;
}
