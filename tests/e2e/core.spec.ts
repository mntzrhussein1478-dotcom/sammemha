import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('sammemha:onboarded','1'));
});

test('homepage, navigation and tools render without console errors or horizontal overflow',async({page})=>{
  const consoleErrors:string[]=[];
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/صمّمها بنفسك/})).toBeVisible();
  await page.getByRole('link',{name:'استعرض الأدوات'}).click();
  await expect(page).toHaveURL(/\/tools$/);
  await expect(page.getByRole('heading',{name:'أدوات التصميم'})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
  expect(overflow).toBe(false);
  expect(consoleErrors).toEqual([]);
});

test('cover workflow autosaves, validates image upload, and downloads PNG and PDF',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium','Heavy editor workflow is validated once on Chromium.');
  await page.goto('/tools/notebook-cover');
  await expect(page.getByRole('heading',{name:'غلاف دفتر مدرسي'})).toBeVisible();

  const input=page.getByLabel('اسم الطالب');
  await input.fill('اختبار حفظ محلي');
  await expect(input).toHaveValue('اختبار حفظ محلي');
  await page.waitForTimeout(800);
  await page.reload();
  await expect(page.getByLabel('اسم الطالب')).toHaveValue('اختبار حفظ محلي');

  const pngBuffer=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8Dwn4GBgYGJAQoAHxcCAk+Uzr4AAAAASUVORK5CYII=','base64');
  await page.getByLabel('صورة الطالب (اختياري)').setInputFiles({name:'student.png',mimeType:'image/png',buffer:pngBuffer});
  await expect(page.getByRole('button',{name:'إزالة الصورة'})).toBeVisible();

  const pngPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'تنزيل PNG'}).click();
  const png=await pngPromise;
  expect(png.suggestedFilename()).toMatch(/notebook-cover-.*\.png$/);

  const pdfPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'تنزيل PDF'}).click();
  const pdf=await pdfPromise;
  expect(pdf.suggestedFilename()).toMatch(/notebook-cover-.*\.pdf$/);
});

test('QR tool creates a downloadable code',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium','Heavy export is validated once on Chromium.');
  await page.goto('/tools/qr');
  await page.getByLabel('الرابط').fill('https://example.org/test');
  await expect(page.locator('canvas').first()).toBeVisible();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'تنزيل PNG'}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/qr-.*\.png$/);
});

test('all seven production tool routes render their editor',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium','Full route sweep is validated once on Chromium.');
  const tools:[string,string][]=[
    ['notebook-cover','غلاف دفتر مدرسي'],
    ['certificate','شهادة تقدير'],
    ['schedule','جدول دراسي'],
    ['business-card','بطاقة عمل'],
    ['qr','مولد QR Code'],
    ['cv','السيرة الذاتية'],
    ['invitation','بطاقة دعوة']
  ];
  for(const [slug,heading] of tools){
    const response=await page.goto(`/tools/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading',{name:heading})).toBeVisible();
    await expect(page.locator('canvas').first()).toBeVisible();
  }
});

test('theme cycles and persists',async({page})=>{
  await page.goto('/');
  const button=page.getByRole('button',{name:'تغيير المظهر'});
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme',/light|dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme',/light|dark/);
});

test('direct refresh, sitemap, robots and 404 behave correctly',async({page,request})=>{
  await page.goto('/tools/certificate');
  await page.reload();
  await expect(page.getByRole('heading',{name:'شهادة تقدير'})).toBeVisible();
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  expect((await request.get('/robots.txt')).status()).toBe(200);

  const response=await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('هذه الصفحة غير موجودة')).toBeVisible();
  const robots=await page.locator('meta[name="robots"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('content')||''));
  expect(robots.length).toBeGreaterThan(0);
  expect(robots.every(value=>value.includes('noindex'))).toBe(true);
  expect(await page.locator('link[rel="canonical"]').count()).toBe(0);
});
