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

test('cover workflow updates and downloads PNG and PDF',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium','Heavy export is validated once on Chromium; cross-browser smoke tests run in every project.');
  await page.goto('/tools/notebook-cover');
  await expect(page.getByRole('heading',{name:'غلاف دفتر مدرسي'})).toBeVisible();
  const input=page.getByLabel('اسم الطالب');
  await input.fill('اختبار منتظر');
  await expect(input).toHaveValue('اختبار منتظر');
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
});
