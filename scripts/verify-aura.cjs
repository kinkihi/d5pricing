// Exercise actual WebGL rendering, motion preferences and context recovery.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
let browser;
(async () => {
  browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_PATH || undefined,
    args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[], requested=[], checks=[];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('console', m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('request', r=>requested.push(r.url()));
  page.on('response', r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.addInitScript(() => {
    window.auraDrawCount=0;
    const draw=WebGLRenderingContext.prototype.drawArrays;
    WebGLRenderingContext.prototype.drawArrays=function(...args) {
      if(this.canvas.matches('[data-aura-glow]'))window.auraDrawCount++;
      return draw.apply(this,args);
    };
  });
  const base=process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';
  await page.goto(base);
  const canvas=page.locator('[data-aura-glow]');
  await page.waitForFunction(()=>document.querySelector('[data-aura-glow]').dataset.rendered==='true');
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await canvas.evaluate(c=>c.getContext('webgl').getError()),0);
  assert.ok(!(requested.some(url=>url.includes('nebula'))));
  await page.waitForTimeout(700);
  const first=await canvas.screenshot();
  const count=await page.evaluate(()=>window.auraDrawCount);
  await page.waitForTimeout(2200);
  const second=await canvas.screenshot();
  assert.notDeepEqual(first,second,'The actual shader pixels change over time');
  const draws=await page.evaluate(()=>window.auraDrawCount)-count;
  assert.ok(draws>2 && draws<100,`Animation runs within its frame budget: ${draws}`);
  checks.push('WebGL shader compiles and paints changing pixels; no old star-field asset is requested.');

  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(150);
  const frozenCount=await page.evaluate(()=>window.auraDrawCount);
  const frozen=await canvas.screenshot();
  await page.waitForTimeout(450);
  assert.equal(await page.evaluate(()=>window.auraDrawCount),frozenCount);
  assert.deepEqual(await canvas.screenshot(),frozen,'Reduced motion keeps the same background');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForTimeout(200);
  assert.ok(await page.evaluate(()=>window.auraDrawCount)>frozenCount);
  await page.evaluate(()=>scrollTo({top:1200,behavior:'instant'}));
  await page.waitForTimeout(300);
  const offscreenCount=await page.evaluate(()=>window.auraDrawCount);
  await page.waitForTimeout(350);
  assert.equal(await page.evaluate(()=>window.auraDrawCount),offscreenCount);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(250);
  assert.ok(await page.evaluate(()=>window.auraDrawCount)>offscreenCount);
  checks.push('Reduced-motion preference and leaving the viewport pause drawing; returning resumes it.');

  await canvas.evaluate(c=>{
    window.auraContextLoss=c.getContext('webgl').getExtension('WEBGL_lose_context');
    window.auraContextLoss.loseContext();
  });
  await page.waitForFunction(()=>!document.querySelector('[data-aura-glow]').dataset.rendered);
  assert.match(await page.locator('.pricing-sky').evaluate(el=>getComputedStyle(el).backgroundImage),/radial-gradient/);
  await page.waitForTimeout(200);
  await page.evaluate(()=>window.auraContextLoss.restoreContext());
  await page.waitForFunction(()=>document.querySelector('[data-aura-glow]').dataset.rendered==='true');
  assert.equal(await canvas.evaluate(c=>c.getContext('webgl').getError()),0);
  checks.push('Losing the graphics context reveals the CSS gradient; restoring it restarts the shader.');

  await page.locator('[data-audience="team"]').click();
  await page.waitForTimeout(850);
  await page.locator('.team-card').hover();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.team-card')).borderTopColor==='rgb(143, 148, 251)', null, {timeout:5000});
  assert.equal(await page.locator('.team-card').evaluate(el=>getComputedStyle(el).borderTopColor),'rgb(143, 148, 251)');
  await page.screenshot({path:path.join(__dirname,'../qa/aura-team-hover.png'),clip:{x:0,y:0,width:1440,height:1000}});
  for(const width of [1920,390,320]) {
    await page.setViewportSize({width,height:1000});
    // Cards retain their existing responsive transform transition on resize.
    await page.waitForFunction(()=>document.documentElement.scrollWidth===innerWidth, null, {timeout:5000});
    await page.waitForTimeout(100);
    const size=await canvas.evaluate(c=>({buffer:c.width,width:c.clientWidth,height:c.clientHeight,overflow:document.documentElement.scrollWidth>innerWidth}));
    assert.ok(size.buffer<=960);
    assert.equal(size.width,width);
    assert.equal(size.overflow,false);
  }
  checks.push('Team hover border is #8F94FB; responsive hero rendering stays within the viewport and its 960px buffer cap.');

  const fallback=await browser.newPage();
  await fallback.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args) {
      return type==='webgl' ? null : original.call(this,type,...args);
    };
  });
  await fallback.goto(base);
  await fallback.waitForTimeout(250);
  assert.equal(await fallback.locator('[data-aura-glow]').getAttribute('data-rendered'),null);
  assert.match(await fallback.locator('.pricing-sky').evaluate(el=>getComputedStyle(el).backgroundImage),/radial-gradient/);
  assert.equal(await fallback.locator('h1').innerText(),'找到适合你的 D5 方案');
  checks.push('A browser without WebGL retains the matching CSS gradient and readable page content.');
  assert.deepEqual(errors,[]);
  const report={passed:true,renderer:'Chromium WebGL / SwiftShader',checks,errors};
  fs.writeFileSync(path.join(__dirname,'../qa/aura-verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  await browser.close();
})().catch(async error=>{await browser?.close();console.error(error);process.exit(1);});
