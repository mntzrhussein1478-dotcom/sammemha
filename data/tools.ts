import type {TemplateDefinition,ToolDefinition,ToolSlug} from '@/lib/types';

const template=(id:string,name:string,category:string,pattern:TemplateDefinition['pattern'],accent:string,background:string='#ffffff'):TemplateDefinition=>({id,name,category,pattern,accent,background,version:1,access:'free'});
const faqCommon=[
  {q:'هل أحتاج حساباً؟',a:'لا. النسخة الحالية تعمل بدون تسجيل وتحفظ المسودة محلياً على جهازك.'},
  {q:'هل تُرفع بياناتي للسيرفر؟',a:'لا تُرسل صورك أو نصوص تصميمك إلى خادم صمّمها ضمن الأدوات الأساسية؛ المعالجة والتصدير يتمان داخل المتصفح.'},
  {q:'ما جودة التصدير؟',a:'أدوات الطباعة تصدّر Canvas بدقة مستهدفة 300 DPI، مع خيار Bleed عندما يكون مناسباً.'}
];
const printExport={dpi:300,bleedMm:3,safeMm:6,allowTransparent:false} as const;
const digitalExport={dpi:300,bleedMm:0,safeMm:4,allowTransparent:true} as const;
const notebookTemplates=[
  template('kids-bubbles','فقاعات مرحة','أطفال','kids','#7c3aed','#fff7ed'),
  template('education-grid','تعليم هادئ','تعليم','education','#2563eb','#f8fafc'),
  template('pixel-play','بيكسل أصلي','ألعاب أصلية','games','#7c3aed','#111827'),
  template('road-motion','طريق وحركة','سيارات','cars','#dc2626','#f8fafc'),
  template('deep-space','فضاء عميق','فضاء','space','#6366f1','#0f172a'),
  template('green-hills','تلال خضراء','طبيعة','nature','#059669','#f0fdf4'),
  template('active-lines','حركة رياضية','رياضة عامة','sport','#ea580c','#fff7ed'),
  template('geo-clean','هندسي','هندسي','geometric','#0f766e','#f8fafc'),
  template('blue-bold','أزرق جريء','أولاد','boys','#2563eb','#eff6ff'),
  template('rose-soft','وردي هادئ','بنات','girls','#db2777','#fff1f2'),
  template('minimal-ink','Minimal','Minimal','minimal','#334155','#ffffff')
];
const certificateTemplates=[
  template('formal-indigo','رسمي بنفسجي','رسمي','formal','#4f46e5','#ffffff'),
  template('classic-gold','كلاسيكي ذهبي','كلاسيكي','classic','#a16207','#fffbeb'),
  template('modern-teal','حديث أخضر','حديث','modern','#0f766e','#f0fdfa')
];
const scheduleTemplates=[
  template('schedule-indigo','منظم بنفسجي','حديث','modern','#4f46e5','#ffffff'),
  template('schedule-green','دراسة هادئة','تعليم','education','#047857','#f0fdf4'),
  template('schedule-orange','نشاط','أطفال','kids','#ea580c','#fff7ed')
];
const businessTemplates=[
  template('business-modern','حديث','حديث','modern','#4f46e5','#ffffff'),
  template('business-dark','داكن','جريء','bold','#0f172a','#f8fafc'),
  template('business-minimal','Minimal','Minimal','minimal','#0f766e','#ffffff')
];
const cvTemplates=[
  template('cv-sidebar','شريط جانبي','حديث','modern','#4f46e5','#ffffff'),
  template('cv-clean','نظيف','Minimal','minimal','#0f766e','#ffffff'),
  template('cv-bold','جريء','جريء','bold','#1d4ed8','#f8fafc')
];
const invitationTemplates=[
  template('invite-soft','هادئ','هادئ','soft','#be185d','#fff1f2'),
  template('invite-modern','حديث','حديث','modern','#7c3aed','#faf5ff'),
  template('invite-classic','كلاسيكي','كلاسيكي','classic','#a16207','#fffbeb')
];

export const tools:ToolDefinition[]=[
  {slug:'notebook-cover',name:'غلاف دفتر مدرسي',description:'صمّم غلافاً مدرسياً أصلياً وجاهزاً للطباعة بمقاس A4.',category:'تعليم',access:'free',badge:'شائع',sortWeight:100,dimensions:{widthMm:210,heightMm:297},exportSettings:printExport,fields:[
    {key:'student',label:'اسم الطالب',type:'text',required:true,maxLength:50},{key:'grade',label:'الصف',type:'text',maxLength:40},{key:'subject',label:'المادة',type:'text',maxLength:40},{key:'school',label:'المدرسة',type:'text',maxLength:70},{key:'year',label:'السنة الدراسية',type:'text',maxLength:20},{key:'photo',label:'صورة الطالب (اختياري)',type:'image',helper:'JPG أو PNG أو WebP حتى 8MB. تتم المعالجة محلياً.'}
  ],defaults:{student:'اسم الطالب',grade:'الصف الثاني',subject:'الرياضيات',school:'',year:'2026–2027'},templates:notebookTemplates,defaultTemplateId:'education-grid',benefits:['10 قوالب أصلية بلا شخصيات محمية','مقاس A4 مضبوط وSafe Area','تصدير 300 DPI مع Bleed اختياري'],faq:faqCommon,related:['schedule','certificate']},

  {slug:'certificate',name:'شهادة تقدير',description:'أنشئ شهادة تقدير عربية أنيقة للطباعة أو المشاركة الرقمية.',category:'تعليم',access:'free',sortWeight:90,dimensions:{widthMm:297,heightMm:210},exportSettings:printExport,fields:[
    {key:'recipient',label:'اسم المستلم',type:'text',required:true,maxLength:70},{key:'issuer',label:'اسم الجهة',type:'text',maxLength:80},{key:'type',label:'نوع الشهادة',type:'text',maxLength:50},{key:'date',label:'التاريخ',type:'date'},{key:'signature',label:'اسم الموقّع',type:'text',maxLength:50},{key:'signatureImage',label:'صورة التوقيع (اختياري)',type:'image'}
  ],defaults:{recipient:'أحمد محمد',issuer:'الجهة المانحة',type:'شهادة تقدير',date:'2026-09-23',signature:'الإدارة'},templates:certificateTemplates,defaultTemplateId:'formal-indigo',benefits:['A4 أفقي','3 قوالب أصلية','توقيع نصي أو صورة اختيارية'],faq:faqCommon,related:['notebook-cover','cv']},

  {slug:'schedule',name:'جدول دراسي',description:'رتّب الأيام والحصص والمواد في جدول واضح وقابل للطباعة.',category:'تعليم',access:'free',badge:'جديد',sortWeight:80,dimensions:{widthMm:297,heightMm:210},exportSettings:printExport,fields:[
    {key:'title',label:'عنوان الجدول',type:'text',maxLength:70},{key:'days',label:'الأيام',type:'text',helper:'افصل الأيام بالفاصلة العربية ،',maxLength:120},{key:'periods',label:'الحصص',type:'text',helper:'مثال: الأولى،الثانية،الثالثة،الرابعة',maxLength:140},{key:'subjects',label:'المواد',type:'textarea',helper:'سطر لكل يوم، والمواد داخل السطر مفصولة بـ ،',maxLength:700}
  ],defaults:{title:'جدولي الدراسي',days:'الأحد،الاثنين،الثلاثاء،الأربعاء،الخميس',periods:'الأولى،الثانية،الثالثة،الرابعة،الخامسة',subjects:'رياضيات،عربي،إنكليزي،علوم،حاسوب\nعربي،رياضيات،علوم،إنكليزي،رياضة\nإنكليزي،علوم،رياضيات،عربي،فن\nعلوم،حاسوب،عربي،رياضيات،إنكليزي\nرياضيات،عربي،إنكليزي،علوم،نشاط'},templates:scheduleTemplates,defaultTemplateId:'schedule-indigo',benefits:['أيام وحصص قابلة للتخصيص','3 أنماط لونية','تخطيط أفقي مناسب للطباعة'],faq:faqCommon,related:['notebook-cover','certificate']},

  {slug:'business-card',name:'بطاقة عمل',description:'بطاقة عمل احترافية بمقاس 90×50 مم مع QR وشعار اختياري.',category:'أعمال',access:'free',badge:'شائع',sortWeight:95,dimensions:{widthMm:90,heightMm:50},exportSettings:{...printExport,safeMm:4},fields:[
    {key:'name',label:'الاسم',type:'text',required:true,maxLength:50},{key:'job',label:'المسمى الوظيفي',type:'text',maxLength:60},{key:'phone',label:'الهاتف',type:'tel',maxLength:30},{key:'email',label:'البريد',type:'email',maxLength:70},{key:'website',label:'الموقع',type:'url',maxLength:100},{key:'logo',label:'الشعار (اختياري)',type:'image'}
  ],defaults:{name:'الاسم الكامل',job:'المسمى الوظيفي',phone:'',email:'',website:''},templates:businessTemplates,defaultTemplateId:'business-modern',benefits:['مقاس 90×50 مم','QR تلقائي عند وجود موقع','شعار اختياري يعالج محلياً'],faq:faqCommon,related:['qr','cv']},

  {slug:'qr',name:'مولد QR Code',description:'أنشئ QR للنصوص والروابط والهاتف وواتساب والبريد والواي فاي.',category:'أدوات',access:'free',badge:'شائع',sortWeight:110,dimensions:{widthMm:100,heightMm:100},exportSettings:digitalExport,fields:[
    {key:'kind',label:'النوع',type:'select',options:[{label:'رابط URL',value:'url'},{label:'نص',value:'text'},{label:'هاتف',value:'phone'},{label:'WhatsApp',value:'whatsapp'},{label:'بريد إلكتروني',value:'email'},{label:'Wi‑Fi',value:'wifi'}]},
    {key:'url',label:'الرابط',type:'url',required:true,maxLength:500,showWhen:{key:'kind',value:'url'}},{key:'text',label:'النص',type:'textarea',required:true,maxLength:1000,showWhen:{key:'kind',value:'text'}},{key:'phone',label:'رقم الهاتف',type:'tel',required:true,maxLength:40,showWhen:{key:'kind',value:'phone'}},{key:'whatsapp',label:'رقم WhatsApp مع رمز الدولة',type:'tel',required:true,maxLength:40,showWhen:{key:'kind',value:'whatsapp'}},{key:'email',label:'البريد الإلكتروني',type:'email',required:true,maxLength:120,showWhen:{key:'kind',value:'email'}},
    {key:'wifiSsid',label:'اسم الشبكة (SSID)',type:'text',required:true,maxLength:64,showWhen:{key:'kind',value:'wifi'}},{key:'wifiPassword',label:'كلمة مرور Wi‑Fi',type:'text',maxLength:100,showWhen:{key:'kind',value:'wifi'}},{key:'wifiSecurity',label:'نوع الحماية',type:'select',options:[{label:'WPA/WPA2',value:'WPA'},{label:'WEP',value:'WEP'},{label:'بدون كلمة مرور',value:'nopass'}],showWhen:{key:'kind',value:'wifi'}},
    {key:'errorCorrection',label:'تصحيح الأخطاء',type:'select',options:[{label:'L - منخفض',value:'L'},{label:'M - متوسط',value:'M'},{label:'Q - مرتفع',value:'Q'},{label:'H - الأعلى',value:'H'}]},{key:'fg',label:'لون الرمز',type:'color'},{key:'bg',label:'لون الخلفية',type:'color'}
  ],defaults:{kind:'url',url:'https://example.com',text:'نص QR',phone:'',whatsapp:'964',email:'',wifiSsid:'',wifiPassword:'',wifiSecurity:'WPA',errorCorrection:'H',fg:'#111827',bg:'#ffffff'},templates:[template('qr-clean','QR نظيف','Minimal','minimal','#111827','#ffffff')],defaultTemplateId:'qr-clean',benefits:['6 أنواع بيانات','Error Correction قابل للتغيير','PNG عالي الدقة قابل للمسح'],faq:[...faqCommon,{q:'كيف أدخل شبكة Wi‑Fi؟',a:'اختر Wi‑Fi ثم أدخل اسم الشبكة وكلمة المرور ونوع الحماية؛ المنصة تولّد صيغة WIFI القياسية وتتعامل مع المحارف الخاصة.'}],related:['business-card','invitation']},

  {slug:'cv',name:'السيرة الذاتية',description:'أنشئ CV عربي بسيط ومرتب من صفحة واحدة.',category:'أعمال',access:'free',sortWeight:85,dimensions:{widthMm:210,heightMm:297},exportSettings:printExport,fields:[
    {key:'name',label:'الاسم',type:'text',required:true,maxLength:60},{key:'title',label:'المسمى',type:'text',maxLength:70},{key:'contact',label:'التواصل',type:'text',maxLength:120},{key:'summary',label:'نبذة',type:'textarea',maxLength:450},{key:'education',label:'التعليم',type:'textarea',maxLength:400},{key:'experience',label:'الخبرة',type:'textarea',maxLength:700},{key:'skills',label:'المهارات',type:'textarea',maxLength:300},{key:'languages',label:'اللغات',type:'text',maxLength:120},{key:'photo',label:'الصورة (اختياري)',type:'image'}
  ],defaults:{name:'الاسم الكامل',title:'المسمى الوظيفي',contact:'الهاتف • البريد الإلكتروني',summary:'نبذة مختصرة عنك وخبرتك.',education:'التعليم والمؤهلات',experience:'الخبرات العملية',skills:'التواصل، التنظيم، العمل ضمن فريق',languages:'العربية'},templates:cvTemplates,defaultTemplateId:'cv-sidebar',benefits:['3 قوالب أصلية','A4 من صفحة واحدة','صورة شخصية اختيارية'],faq:faqCommon,related:['business-card','certificate']},

  {slug:'invitation',name:'بطاقة دعوة',description:'صمّم دعوة رقمية هادئة للمناسبات المختلفة.',category:'مناسبات',access:'free',badge:'جديد',sortWeight:75,dimensions:{widthMm:148,heightMm:210},exportSettings:printExport,fields:[
    {key:'occasion',label:'نوع المناسبة',type:'text',maxLength:40},{key:'name',label:'الاسم',type:'text',maxLength:70},{key:'date',label:'التاريخ',type:'date'},{key:'time',label:'الوقت',type:'time'},{key:'place',label:'المكان',type:'text',maxLength:100},{key:'message',label:'رسالة قصيرة',type:'textarea',maxLength:260}
  ],defaults:{occasion:'دعوة خاصة',name:'يسعدنا حضوركم',date:'2026-10-01',time:'19:00',place:'',message:'وجودكم يكمّل فرحتنا.'},templates:invitationTemplates,defaultTemplateId:'invite-soft',benefits:['3 قوالب أصلية','مقاس A5','مناسب للمشاركة والطباعة'],faq:faqCommon,related:['qr','certificate']}
];

export const toolsBySlug=Object.fromEntries(tools.map(t=>[t.slug,t])) as Record<ToolSlug,ToolDefinition>;
export const categories=[...new Set(tools.map(t=>t.category))];
