// Regression coverage for interrupted billing changes and hover compositing.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
let browser;
(async () => {
  browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_PATH || undefined, args:['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:1440,height:1100}});
  const errors = [], requests = [], checks = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4173/');
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('#workflow, #plan-finder').count(),0);
  assert.ok(!requests.some(url => /recommender\.(css|js)/.test(url)));
  assert.equal(await page.locator('#faq-title').innerText(),'常见问题');
  await page.locator('[data-language-toggle]').click();
  assert.equal(await page.locator('#faq-title').innerText(),'FAQ');
  await page.locator('[data-language-toggle]').click();
  checks.push('Recommendation section and its scripts/styles are absent; FAQ title follows the chosen language.');

  const measureRoll = async (duration = 650) => page.evaluate(async duration => {
    const read = () => [...document.querySelectorAll('[data-price]')].map(el => {
      const r = el.getBoundingClientRect();
      const period = el.closest('.plan-price').querySelector('[data-period]').getBoundingClientRect();
      return {width:r.width,y:r.y,periodX:period.x,label:el.getAttribute('aria-label')};
    });
    const before = read();
    document.querySelector('[data-billing-toggle]').click();
    const immediate = read();
    const frames = [{time:performance.now(),prices:immediate}];
    await new Promise(resolve => {
      const start = performance.now();
      function sample(now) {
        frames.push({time:now,prices:read()});
        if(now-start >= duration) resolve(); else requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    return {before,immediate,frames};
  },duration);
  const verifyContinuous = result => {
    result.before.forEach((price,i) => {
      assert.ok(Math.abs(price.width-result.immediate[i].width)<.75,'No width jump on click');
      assert.ok(Math.abs(price.y-result.immediate[i].y)<.5,'No baseline jump on click');
      for(let f=1;f<result.frames.length;f++) {
        const current=result.frames[f], previous=result.frames[f-1];
        const delta=Math.abs(current.prices[i].width-previous.prices[i].width);
        assert.ok(delta < Math.max(0,current.time-previous.time)*.3+1,`Abrupt digit width change: ${delta}px`);
        assert.ok(Math.abs(current.prices[i].y-price.y)<.5,'Price baseline stays fixed');
        assert.ok(Math.abs(current.prices[i].periodX-previous.prices[i].periodX) < Math.max(0,current.time-previous.time)*.3+1,'Period label moves continuously');
      }
    });
  };
  const annual=await measureRoll(); verifyContinuous(annual);
  assert.deepEqual(annual.frames.at(-1).prices.map(x=>x.label),['39','160']);
  const monthly=await measureRoll(); verifyContinuous(monthly);
  assert.deepEqual(monthly.frames.at(-1).prices.map(x=>x.label),['49','200']);
  for(let i=0;i<6;i++) verifyContinuous(await measureRoll(80));
  await page.waitForTimeout(550);
  assert.deepEqual(await page.locator('[data-price]').evaluateAll(els=>els.map(el=>el.getAttribute('aria-label'))),['49','200']);
  checks.push('First and reverse billing changes keep the price baseline fixed and move digit widths/period labels continuously; six rapid reversals settle correctly.');

  const hoverCard = async id => {
    const card=page.locator(`[data-plan="${id}"]`);
    // Taller grouped cards can trigger Playwright's automatic scrolling on hover.
    // Establish the viewport before comparing the hover geometry.
    await card.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
    const finishMotion=()=>card.evaluate(async el=>{await Promise.all(el.getAnimations().map(animation=>animation.finished.catch(()=>{})));});
    await page.mouse.move(0,0); await finishMotion();
    const before=await card.boundingBox();
    const background=await card.evaluate(el=>getComputedStyle(el).backgroundColor);
    await card.hover(); await finishMotion();
    const after=await card.boundingBox();
    assert.ok(before.y-after.y>5 && before.y-after.y<10,`${id} lifts subtly`);
    assert.ok(after.width>before.width && after.width<before.width*1.01,`${id} scales subtly`);
    assert.equal(await card.evaluate(el=>getComputedStyle(el).backgroundColor),background,`${id} keeps its background color`);
    assert.notEqual(await card.evaluate(el=>getComputedStyle(el).boxShadow),'none');
    await page.mouse.move(0,0); await finishMotion();
    assert.ok(Math.abs((await card.boundingBox()).y-before.y)<.5,`${id} returns to its original position`);
  };
  for(const id of ['community','basic','pro']) await hoverCard(id);
  await page.locator('[data-audience="team"]').click(); await page.waitForTimeout(850);
  await hoverCard('team');
  await page.locator('.team-card').screenshot({path:path.join(process.env.SCREENSHOT_DIR || path.join(__dirname,'../qa'),'team-background-rest.png')});
  await page.locator('.team-card').hover(); await page.waitForTimeout(350);
  await page.locator('.team-card').screenshot({path:path.join(process.env.SCREENSHOT_DIR || path.join(__dirname,'../qa'),'team-background-hover.png')});
  assert.equal(await page.locator('.team-card').evaluate(el=>getComputedStyle(el).backdropFilter),'none');
  checks.push('All four cards lift, scale subtly and cast shadows; leaving restores geometry and preserves the background color. Team background no longer samples animated rear cards.');

  await page.locator('[data-audience="personal"]').click(); await page.waitForTimeout(850);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-billing-toggle]').click();
  assert.deepEqual(await page.locator('[data-price]').evaluateAll(els=>els.map(el=>el.getAttribute('aria-label'))),['39','160']);
  await page.locator('[data-billing-toggle]').click();
  assert.deepEqual(await page.locator('[data-price]').evaluateAll(els=>els.map(el=>el.getAttribute('aria-label'))),['49','200']);
  checks.push('Reduced-motion billing updates settle immediately in both directions.');
  assert.deepEqual(errors,[]);
  const report={passed:true,checks,errors,safariVerification:'Not run: WebKit download blocked by the environment network policy.'};
  fs.writeFileSync(path.join(__dirname,'../qa/refinements-verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  await browser.close();
})().catch(async error=>{await browser?.close();console.error(error);process.exit(1);});
