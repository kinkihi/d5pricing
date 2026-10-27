// Browser coverage for independent personal tiers and the Figma feature groups.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
let browser;
(async () => {
  browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_PATH || undefined, args:['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:1920,height:1400}});
  const errors = [], checks = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if(r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
  const screenshots = process.env.SCREENSHOT_DIR || path.join(__dirname,'../qa');
  const amount = id => page.locator(`[data-price="${id}"]`).getAttribute('aria-label');
  const toggle = id => page.locator(`[data-tier-toggle="${id}"]`);
  const tier = id => page.locator(`[data-personal-tier="${id}"]`).innerText();
  const settle = () => page.waitForTimeout(550);
  const setTier = async (id, advanced) => {
    if ((await toggle(id).getAttribute('aria-pressed') === 'true') !== advanced) await toggle(id).click();
  };
  const setBilling = async annual => {
    if ((await page.locator('[data-billing-toggle]').getAttribute('aria-pressed') === 'true') !== annual) await page.locator('[data-billing-toggle]').click();
  };
  const renderedAmount = id => page.locator(`[data-price="${id}"]`).evaluate(el => [...el.querySelectorAll('.number-wheel-track')].map(track => track.firstElementChild.textContent).join(''));
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(await page.locator('.personal-card h3').allTextContents(),['实时渲染','AI 创作','实时渲染','AI 创作','实时渲染','AI 创作']);
  assert.deepEqual(await page.locator('.personal-card .render-features .plan-list').evaluateAll(lists => lists.map(x => x.children.length)),[7,7,7]);
  assert.deepEqual(await page.locator('.personal-card .ai-features .plan-list').evaluateAll(lists => lists.map(x => x.children.length)),[5,4,5]);
  assert.equal(await page.locator('[data-first-month]').count(),0);
  assert.match(await page.locator('.pro .render-features').innerText(),/16,000\+/);
  assert.match(await page.locator('.pro .ai-features').innerText(),/2K 图片，720p/);
  assert.equal(await page.locator('.community .unavailable').innerText(),'不支持积分充值');
  checks.push('All three cards use the Figma Render/AI groups, exact entry-tier limits and current subscription labels.');

  for (const annual of [false,true]) {
    await setBilling(annual);
    for (const [basic,pro] of [[false,false],[true,false],[true,true],[false,true]]) {
      await setTier('basic',basic); await setTier('pro',pro); await settle();
      const expected = annual ? [basic ? 1188 : 468,pro ? 2628 : 1920] : [basic ? 129 : 49,pro ? 279 : 200];
      for (const [i,id] of ['basic','pro'].entries()) {
        assert.equal(await amount(id),String(expected[i]));
        assert.equal(await renderedAmount(id),String(expected[i]),'Visible settled digits match the accessible amount');
        const advanced = id === 'basic' ? basic : pro;
        assert.equal(await tier(id),advanced ? '进阶档' : '入门档');
        const ai = await page.locator(`[data-ai-features="${id}"]`).innerText();
        assert.match(ai,new RegExp(advanced ? '4500' : '1500'));
        assert.match(ai,new RegExp(advanced ? '6 个' : '4 个'));
        assert.match(ai,new RegExp(advanced ? '4K 图片，4K' : '2K 图片，720p'));
        await page.locator(`[data-select-plan="${id}"]`).click();
        assert.match(await page.locator('.dialog-price').innerText(),new RegExp(`￥${expected[i]}.*${annual ? '年' : '月'}订阅`));
        assert.equal(await page.locator('.dialog-tier').innerText(),advanced ? '进阶档' : '入门档');
        await page.keyboard.press('Escape');
      }
    }
  }
  checks.push('All eight independent tier/billing combinations match beta prices, visible digits, AI allowances and subscription previews.');

  await setTier('basic',false); await setTier('pro',false); await setBilling(false); await settle();
  const button = await toggle('basic').elementHandle();
  await page.evaluate(async () => {
    for(let i=0;i<9;i++) {
      document.querySelector('[data-tier-toggle="basic"]').click();
      document.querySelector('[data-billing-toggle]').click();
      await new Promise(resolve => setTimeout(resolve,35));
    }
  });
  await settle();
  assert.equal(await button.evaluate(el => el.isConnected),true,'Tier switching preserves the button DOM');
  assert.equal(await renderedAmount('basic'),'1188');
  assert.equal(await renderedAmount('pro'),'1920');
  await toggle('basic').focus(); await page.keyboard.press('Enter'); await settle();
  assert.equal(await amount('basic'),'468');
  assert.equal(await toggle('basic').evaluate(el => el === document.activeElement),true);
  await page.keyboard.press('Space'); await settle();
  assert.equal(await amount('basic'),'1188');
  assert.match(await page.locator('#announcer').innerText(),/基础版.*进阶档.*1188/);
  checks.push('Nine interrupted tier/billing reversals settle correctly; Enter/Space work with retained focus and an announced selection.');

  await page.reload();
  assert.equal(await amount('basic'),'1188'); assert.equal(await amount('pro'),'1920');
  await page.locator('[data-audience="team"]').click(); await page.waitForTimeout(850);
  assert.equal(await toggle('basic').evaluate(el => el.closest('.plan-card').inert),true);
  await page.locator('[data-audience="personal"]').click(); await page.waitForTimeout(850);
  await page.locator('[data-language-toggle]').click();
  assert.equal(await tier('basic'),'Advanced'); assert.equal(await tier('pro'),'Starter');
  assert.equal(await amount('basic'),'1188'); assert.equal(await amount('pro'),'1920');
  checks.push('Different Basic/Pro selections persist through reload, audience round trips and language changes.');

  for (const lang of ['en','zh']) {
    if(await page.locator('html').getAttribute('lang') !== (lang === 'zh' ? 'zh-CN' : 'en')) await page.locator('[data-language-toggle]').click();
    await setTier('basic',true); await setTier('pro',true); await setBilling(true); await settle();
    for (const width of [1920,1440,1024,961,820,390,320]) {
      await page.setViewportSize({width,height:1100}); await page.mouse.move(0,0); await page.waitForTimeout(400);
      const layout = await page.evaluate(() => ({
        overflow:document.documentElement.scrollWidth > innerWidth,
        clipped:[...document.querySelectorAll('.personal-card')].flatMap(card => {
          const bounds=card.getBoundingClientRect();
          return [...card.querySelectorAll('.plan-list,.price-tier-control')].filter(el => {
            const r=el.getBoundingClientRect();return r.right > bounds.right - 1 || r.bottom > bounds.bottom - 1;
          }).map(el => `${card.dataset.plan}: ${el.className}`);
        }),
      }));
      assert.equal(layout.overflow,false,`${lang} ${width}px page overflow`);
      assert.deepEqual(layout.clipped,[],`${lang} ${width}px card overflow`);
      if(width === 1920 || width === 390) await page.locator('#pricing').screenshot({path:path.join(screenshots,`personal-tiers-${lang}-${width}.png`)});
    }
  }
  checks.push('Chinese/English advanced annual cards fit at 1920, 1440, 1024, 961, 820, 390 and 320px.');
  await page.setViewportSize({width:1920,height:1400});
  await page.locator('.basic .feature-info-button').focus();
  assert.equal(await page.locator('#basic-credits-tip').evaluate(el => getComputedStyle(el).visibility),'visible');
  assert.match(await page.locator('#basic-credits-tip').innerText(),/3000.*1500.*50%/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#basic-credits-tip').evaluate(el => getComputedStyle(el).visibility),'hidden');
  const assets = await page.locator('.personal-card img').evaluateAll(images => images.map(img => ({src:img.getAttribute('src'),loaded:img.complete && img.naturalWidth > 0,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height})));
  assert.ok(assets.length > 40);
  for (const asset of assets) {assert.ok(asset.loaded,asset.src);assert.ok(Math.abs(asset.width-16)<.2 && Math.abs(asset.height-16)<.2,`${asset.src} retains its 16px design slot`);}
  await page.emulateMedia({reducedMotion:'reduce'});
  await toggle('basic').click(); assert.equal(await renderedAmount('basic'),'468');
  await setBilling(false); assert.equal(await renderedAmount('basic'),'49');assert.equal(await renderedAmount('pro'),'279');
  checks.push('Benefit tooltips are keyboard accessible; all original SVGs load at 16px; reduced-motion prices update immediately.');
  assert.deepEqual(errors,[]);
  const report={passed:true,checks,errors,unverified:['Safari/WebKit and Firefox were not run.','Live publication and real checkout are outside this local preview.']};
  fs.writeFileSync(path.join(__dirname,'../qa/personal-tiers-verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  await browser.close();
})().catch(async error => {await browser?.close();console.error(error);process.exit(1);});
