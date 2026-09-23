# صمّمها — Sammemha

منصة ويب عربية لإنشاء منتجات رقمية جاهزة للطباعة أو المشاركة مباشرة من المتصفح. الإصدار الحالي **v1.0.0** يضم 7 أدوات فعلية بدون حساب وبدون API مدفوع للوظائف الأساسية.

## الأدوات
- غلاف دفتر مدرسي (11 فئة/نمط أصلي)
- شهادة تقدير
- جدول دراسي
- بطاقة عمل مع QR وشعار اختياري
- مولد QR: URL / Text / Phone / WhatsApp / Email / Wi‑Fi
- CV عربي
- بطاقة دعوة

## التقنية
- Next.js App Router + TypeScript + React
- CSS Variables / Design Tokens بدون مكتبة UI ثقيلة
- Canvas API للتصيير عالي الدقة
- jsPDF محمّل ديناميكياً عند تصدير PDF فقط
- qrcode محمّل ديناميكياً عند الحاجة
- IndexedDB للمسودات والصور وlocalStorage للتفضيلات/آخر التصاميم/المفضلة
- Vitest + Playwright (Chromium / Firefox / WebKit / Mobile Chrome)
- Vercel-ready مع `output: standalone` لتسهيل النقل إلى استضافة Node أخرى

## التشغيل محلياً
```bash
npm ci
npm run dev
```
إذا كنت تبدأ قبل وجود Lockfile:
```bash
npm install
```

## التحقق والبناء
```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
```

## متغيرات البيئة
انسخ `.env.example` إلى `.env.local` وحدّث `NEXT_PUBLIC_SITE_URL` إلى الدومين الرسمي. لا توجد Secrets مطلوبة في v1.

## بنية المشروع
- `app/` المسارات وMetadata وSEO
- `components/` مكونات الواجهة المشتركة
- `features/editor/` المحرر وCanvas renderer
- `data/tools.ts` Registry الأدوات والقوالب والحقول
- `lib/` التصدير، الصور، IndexedDB، QR، Versioning، i18n وPayment abstraction
- `config/` Feature Flags وSecurity/Performance budgets
- `public/` PWA/Branding assets
- `tests/` Unit وE2E

## إضافة قالب جديد
1. افتح `data/tools.ts`.
2. أضف `TemplateDefinition` إلى `templates` الخاصة بالأداة مع `id` فريد و`version` و`access`.
3. استخدم `pattern` موجوداً أو أضف Pattern جديداً في `features/editor/draw.ts`.
4. لا تغيّر IDs/Versions القديمة بطريقة تكسر المسودات؛ `lib/tool-versioning.ts` يحافظ على fallback آمن.
5. أضف/حدّث اختباراً إذا غيّر القالب منطق الرسم.

## إضافة أداة جديدة
1. أضف slug إلى `ToolSlug` في `lib/types.ts`.
2. أضف تعريف الأداة في `data/tools.ts`: metadata, fields, defaults, templates, dimensions, export settings.
3. أضف Renderer في `features/editor/draw.ts`.
4. أضف SEO content وفوائد/FAQ داخل تعريف الأداة.
5. أضف Unit/E2E مناسبين.

## الهوية والتصميم
- Design Tokens أعلى `app/globals.css`.
- الشعار: `public/icon.svg` و`app/icon.svg`.
- PWA icons: `public/icon-192.png` و`public/icon-512.png`.
- Open Graph: `public/opengraph-image.png`.
- الألوان الأساسية قابلة للتعديل من CSS Variables بدون تغيير المكونات.

## الأمان والخصوصية
- CSP ورؤوس أمان في `next.config.ts`؛ لا يوجد `unsafe-eval`.
- React escaping افتراضياً، ولا يوجد `eval` أو تنفيذ كود ديناميكي.
- JSON-LD الوحيد المستخدم داخل `<script>` مشتق من بيانات داخلية موثوقة مع escaping للحرف `<`.
- الصور: JPG/PNG/WebP حتى 8MB، فحص MIME + magic bytes + أبعاد قصوى، وإعادة ترميز محلية تقلل EXIF.
- لا تُرسل محتويات التصميم أو الصور إلى Backend في v1.
- لوحة Admin غير منشورة لأن v1 لا يملك Authentication حقيقياً.

## Feature Flags / Maintenance
`config/features.ts` يحتوي الميزات المستقبلية وهي مخفية ما لم تكن مكتملة. `config/site.ts` يحتوي الإصدار، اللغات والدومين وMaintenance flag.

## الدفع لاحقاً
`lib/payments/provider.ts` يعرّف `PaymentProvider`. عند إضافة بوابة دفع، أنشئ Adapter خادمي، تحقق من Webhooks وتوقيعاتها، ولا تضع مفاتيح سرية في Frontend.

## الحسابات لاحقاً
أضف Auth/Database/Cloud Storage كطبقات مستقلة ثم اجعل IndexedDB fallback محلياً. Registry وRenderer لا يعتمدان على مزود Auth أو Database بعينه.

## CI/CD
GitHub Actions يشغّل Dependency Audit، Type Check، ESLint، Unit Tests، Production Build وPlaywright E2E. أول Bootstrap يولّد `package-lock.json` ثم يحفظه لضمان Builds قابلة لإعادة الإنتاج.
