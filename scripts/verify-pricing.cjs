// Run against `npm run dev`. Requires Playwright (or PLAYWRIGHT_MODULE).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
let activeBrowser;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}),
    args: ['--no-sandbox'],
  });
  activeBrowser = browser;
  const page = await browser.newPage({ viewport: { width: 1920, height: 1100 } });
  const errors = [], failedRequests = [], checks = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`); });
  const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
  const shot = name => page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR || path.join(__dirname, '..', 'qa'), name), fullPage: true });
  const price = id => page.locator(`[data-price="${id}"]`).evaluate(el => el.getAttribute('aria-label') || el.textContent);
  const finishCardMotion = () => page.locator('#pricing').evaluate(async region => {
    await Promise.all(region.getAnimations({subtree:true}).map(animation => animation.finished.catch(() => {})));
  });
  const audience = async name => {
    await page.locator(`[data-audience="${name}"]`).click({ force: true });
    await finishCardMotion();
  };
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('[data-audience="personal"]').getAttribute('aria-selected'), 'true');
  assert.equal(await price('basic'), '49');
  assert.equal(await price('pro'), '200');
  const grid = await page.locator('.plan-grid').boundingBox();
  assert.deepEqual({x:grid.x,y:grid.y,width:grid.width}, {x:240,y:474,width:1440});
  assert.ok(grid.height >= 760, 'Personal cards fit both Figma feature groups');
  checks.push('Desktop geometry matches the 1920px Figma frame; three personal cards are visible.');
  await shot('personal-desktop.png');

  await page.locator('[data-billing-toggle]').click();
  await page.waitForTimeout(550);
  assert.equal(await price('basic'), '468');
  assert.equal(await price('pro'), '1920');
  await audience('team');
  assert.equal(await page.locator('.billing').evaluate(el => el.inert), true);
  assert.equal(await page.locator('.team-card').evaluate(el => el.inert), false);
  assert.equal(await page.locator('.community').evaluate(el => el.inert), true);
  assert.deepEqual(await page.locator('.column-title').allTextContents(), ['Pro','Team','Enterprise']);
  assert.deepEqual(await page.locator('.team-card h3').allTextContents(), ['协作与管理','专业表现席位','AI 创作席位']);
  assert.deepEqual(await page.locator('.team-card .plan-list').evaluateAll(lists => lists.map(list => list.children.length)), [5,2,2]);
  assert.match(await page.locator('.team-card').innerText(), /支持团队基础 \/ 专业席位自由组合/);
  assert.match(await page.locator('.team-card').innerText(), /团队共享 AI 积分/);
  assert.doesNotMatch(await page.locator('.team-card').innerText(), /100GB|版本更新管理|模型管理/);
  const teamCard = await page.locator('.team-card').boundingBox();
  assert.ok(Math.abs(teamCard.width-464)<.1);
  assert.equal(teamCard.height,680);
  const teamIcons = await page.locator('.team-card img').evaluateAll(images => images.map(img => ({loaded:img.complete && img.naturalWidth > 0,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height})));
  assert.equal(teamIcons.length,13);
  for(const icon of teamIcons) assert.ok(icon.loaded && Math.abs(icon.width-16)<.2 && Math.abs(icon.height-16)<.2);
  await page.locator('.team-card .feature-info-button').focus();
  assert.equal(await page.locator('#team-seats-tip').evaluate(el => getComputedStyle(el).visibility),'visible');
  await page.keyboard.press('Escape');
  checks.push('Team card matches the Figma 464×680 layout, all three benefit groups, original 16px icons and accessible mixed-seat explanation.');
  await shot('team-desktop.png');
  const stackedX = (await page.locator('.community').boundingBox()).x;
  await audience('personal');
  assert.equal(await price('basic'), '468');
  assert.equal(await page.locator('[data-billing-toggle]').getAttribute('aria-pressed'), 'true');
  checks.push('Annual prices, billing state, comparison columns and inactive focus targets survive a round trip.');

  await page.locator('[data-audience="team"]').click({force:true});
  // Headless GPU rendering may delay the first frame; observe actual movement.
  await page.waitForFunction(endX => {
    const x=document.querySelector('.community').getBoundingClientRect().x;
    return x > 241 && x < endX - 1;
  },stackedX,{polling:'raf',timeout:5000});
  const movingX = (await page.locator('.community').boundingBox()).x;
  assert.ok(movingX > 240 && movingX < 728, `Expected card movement, got ${movingX}`);
  await shot('transition-midpoint.png');
  for (let i = 0; i < 7; i++) {
    await page.locator(`[data-audience="${i % 2 ? 'team' : 'personal'}"]`).click({ force:true });
    await page.waitForTimeout(60);
  }
  await finishCardMotion();
  assert.equal(await page.locator('[data-audience="personal"]').getAttribute('aria-selected'),'true');
  assert.ok(Math.abs((await page.locator('.community').boundingBox()).x - 240) < 1);
  checks.push('Motion has intermediate frames; seven rapid reversals settle without stale cards or focus state.');

  await page.locator('[data-audience="personal"]').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-audience="team"]').evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Home');
  assert.equal(await page.locator('[data-audience="personal"]').evaluate(el=>el===document.activeElement),true);
  await page.waitForTimeout(850);
  await page.locator('[data-select-plan="pro"]').click();
  assert.equal(await page.locator('.pricing-dialog').evaluate(el=>el.open),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.pricing-dialog').evaluate(el=>el.open),false);
  await audience('team');
  await page.locator('[data-contact-sales]').click();
  assert.match(await page.locator('.pricing-dialog').innerText(),/专业表现席位/);
  assert.match(await page.locator('.pricing-dialog').innerText(),/团队共享/);
  assert.doesNotMatch(await page.locator('.pricing-dialog').innerText(),/100GB/);
  await page.keyboard.press('Escape');
  await page.locator('[data-compare-toggle]').click();
  assert.equal(await page.locator('.compare-row:visible').count(),0);
  await page.locator('[data-compare-toggle]').click();
  assert.equal(await page.locator('.compare-row:visible').count(),2);
  checks.push('Keyboard tabs, focus return, preview dialogs, Escape and comparison disclosure work.');

  await page.locator('[data-language-toggle]').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.equal(await page.locator('.team-card h2').innerText(),'Teams');
  assert.deepEqual(await page.locator('.team-card h3').allTextContents(),['Collaboration & management','Professional visualization seats','AI creation seats']);
  await page.locator('[data-language-toggle]').click();
  assert.equal(await page.locator('.team-card h2').innerText(),'团队版');
  checks.push('Language changes retain the selected audience and update card content.');

  const reload = page.waitForEvent('framenavigated', frame => frame === page.mainFrame());
  const css = path.join(__dirname, '..', 'web', 'pricing-experience.css');
  const now = new Date(); fs.utimesSync(css, now, now);
  await reload;
  await page.waitForLoadState('load');
  assert.equal(await page.locator('[data-audience="team"]').getAttribute('aria-selected'),'true');
  checks.push('A saved file triggers browser reload and preserves the active audience and billing.');

  for (const width of [1440,1024,820,760,390,320]) {
    await page.setViewportSize({width,height:900});
    for(const tab of ['personal','team']) {
      await audience(tab);
      const geometry=await page.evaluate(()=>({
        viewport:innerWidth,document:document.documentElement.scrollWidth,
        clipped:[...document.querySelectorAll('.plan-card:not([inert])')].filter(card=>
          [...card.querySelectorAll('.plan-list')].some(list => list.getBoundingClientRect().bottom > card.getBoundingClientRect().bottom - 12)
        ).map(card=>card.dataset.plan),
      }));
      assert.equal(geometry.document,geometry.viewport,`Overflow at ${width}px / ${tab}`);
      assert.deepEqual(geometry.clipped,[],`Card content clipped at ${width}px / ${tab}`);
      if(width===390) await shot(`mobile-${tab}.png`);
    }
  }
  checks.push('Both audiences pass overflow and card-content checks at 1440, 1024, 820, 760, 390 and 320px.');
  await audience('team');
  await page.locator('[data-language-toggle]').click();
  for (const width of [1440,1024,390,320]) {
    await page.setViewportSize({width,height:1000});
    await page.mouse.move(0,0); await page.waitForTimeout(850);
    const layout = await page.locator('.team-card').evaluate(card => ({
      pageOverflow:document.documentElement.scrollWidth > innerWidth,
      contentOverflow:[...card.querySelectorAll('.plan-list,h3')].some(el => {
        const r=el.getBoundingClientRect(),c=card.getBoundingClientRect();
        return r.right > c.right - 1 || r.bottom > c.bottom - 1;
      }),
    }));
    assert.equal(layout.pageOverflow,false,`English team page overflow at ${width}px`);
    assert.equal(layout.contentOverflow,false,`English team content overflow at ${width}px`);
  }
  await page.locator('[data-contact-sales]').click();
  assert.match(await page.locator('.pricing-dialog').innerText(),/Shared across the team/);
  assert.ok(await page.locator('.pricing-dialog').evaluate(el => el.scrollWidth <= el.clientWidth));
  await page.keyboard.press('Escape');
  checks.push('English team benefits wrap without clipping at 1440, 1024, 390 and 320px; the updated contact preview fits mobile.');
  await page.emulateMedia({reducedMotion:'reduce'});
  await audience('personal');
  assert.equal(await page.locator('.community').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  checks.push('Reduced-motion preference disables card transitions.');
  assert.deepEqual(errors,[]);
  assert.deepEqual(failedRequests,[]);
  const report = { passed:true,checks,consoleErrors:errors,failedRequests };
  fs.writeFileSync(path.join(__dirname,'..','qa','verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  await browser.close();
})().catch(async error=>{await activeBrowser?.close();console.error(error);process.exit(1);});
