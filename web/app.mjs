const tiers = [
  { id: 'starter', name: '入门', credits: 1000, concurrency: '4', basic: 49, pro: 200, basicAnnual: 399, proAnnual: 1920 },
  { id: 'light', name: '轻量', credits: 2700, concurrency: '6', basic: 129, pro: 280, basicAnnual: 999, proAnnual: 2520 },
  { id: 'standard', name: '标准', credits: 6000, concurrency: '10', basic: 269, pro: 420, basicAnnual: 1999, proAnnual: 3520 },
  { id: 'ultra', name: '旗舰', credits: 13000, concurrency: '不限', basic: 569, pro: 720, basicAnnual: 3999, proAnnual: 5520 },
];
const plans = { community: '社区版', basic: '基础版', pro: '专业版' };
const formatNumber = value => value.toLocaleString('en-US');
function entitlements(plan, tierIndex) {
  const t = tiers[tierIndex];
  if (!t || !Object.hasOwn(plans, plan)) throw new RangeError('Unknown plan or tier');
  if (plan === 'community') return { price: 0, credits: 0, concurrency: '2', image: '1K', video: '480P', models: '部分模型', commercial: 'AI 权益不可商用', arco: '消耗积分', render: '不支持', bonus: '不可充值', expiry: '—', downloads: '不可管理' };
  return { price: t[plan], credits: t.credits, concurrency: t.concurrency, image: plan === 'basic' && tierIndex === 0 ? '2K' : '4K', video: plan === 'basic' && tierIndex === 0 ? '720P' : '4K', models: '全部模型', commercial: plan === 'basic' ? 'AI 生成可商用' : '全部可商用¹', arco: '消耗积分', render: plan === 'pro' ? '不消耗积分' : '不支持', bonus: `${(plan === 'pro' ? 10 : 0) + (tierIndex >= 2 ? 10 : 0)}%`, expiry: plan === 'pro' ? '180 天' : '90 天', downloads: '下载管理' };
}
function comparisonRows(index) {
  const values = ['community', 'basic', 'pro'].map(plan => entitlements(plan, index));
  const row = (label, key, format = v => v) => ({ label, values: values.map(v => format(v[key])) });
  return [
    { group: 'AI 创作与用量' }, row('每月套餐积分', 'credits', v => v ? `${formatNumber(v)} 积分` : '无月度套餐'), row('并发任务', 'concurrency', v => v === '不限' ? v : `${v} 个`), row('AI 图片分辨率', 'image'), row('AI 视频分辨率', 'video'), row('可用模型', 'models'),
    { group: '工作流与成果使用' }, row('Arco 内 AI 增强、放大', 'arco'), row('Render 内 AI 增强、放大', 'render'), row('商用范围', 'commercial'), row('分享下载', 'downloads'),
    { group: '充值权益' }, row('常态充值赠送', 'bonus'), row('充值积分有效期', 'expiry'),
  ];
}
const num = formatNumber;

const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const state={audience:'personal',tier:0,plan:'pro',stage:'arco',previewPlan:'pro',previewTier:0,differences:false,billing:'monthly',lang:'zh'};
const billingPrice=(plan,tierIndex)=>plan==='community'?0:(state.billing==='annual'?tiers[tierIndex][`${plan}Annual`]:tiers[tierIndex][plan]);
const check='<span class="check" aria-hidden="true">✓</span>';
const copy={zh:{
  'nav.product':'产品⌄','nav.workflow':'工作流⌄','nav.solutions':'解决方案⌄','nav.explore':'探索⌄','nav.learning':'学习⌄','nav.pricing':'价格','nav.signIn':'登录','nav.download':'免费下载 ↗',
  'hero.title':'找到适合你的 D5 方案','hero.subtitle':'从第一次灵感探索，到下一次专业交付，更多创意，更大可能','audience.personal':'个人创作','audience.team':'团队协作','audience.soon':'即将更新','billing.annual':'按年','billing.discount':'享 x 折',
  'pricing.foot':'套餐积分按月发放，到期不累计。<a href="#comparison">了解积分规则 ↗</a>','pricing.compare':'比较全部权益 ↓','education.inline':'D5 教育版：为学生和教师提供专属权益','education.apply':'了解更多 ↗',
  'usage.label':'每月 AI 用量','usage.help':'用量档同时应用于基础版与专业版。相同档位的月积分相同，软件功能权益不同。套餐积分按积分月发放，到期不累计。','billing.monthly':'按月','billing.note':'· 到期不自动续费','team.title':'为一起创造，准备更多可能。','team.subtitle':'团队用户方案即将更新，敬请期待。','team.back':'先看看个人方案 ↗','workflow.stage1':'灵感探索','workflow.stage2':'设计推敲','workflow.stage3':'渲染表达','workflow.stage4':'成果交付','workflow.comparePlan':'比较版本','workflow.compareTier':'用量档位','workflow.previewOnly':'仅比较，不改变已选方案','workflow.noteLead':'用量决定探索的空间，版本决定创作的能力。','workflow.noteStrong':'同档积分相同，专业能力不同。','education.title':'D5 for Education','education.subtitle':'Best for students, educators, and academic institutions','education.button':'Apply','checkout.title':'确认你的创作方案','checkout.notice':'这是设计预览，尚未接入登录、支付和权益开通。不会创建订单或收取费用。','checkout.back':'返回继续比较',
  'workflow.title':'D5 伴随你，每一步创作','workflow.subtitle':'把权益放进工作流，看看它们如何帮你实现想法。','workflow.link':'查看完整权益 ↗','comparison.title':'完整权益对比','comparison.subtitle':'当前比较 <strong id="comparison-tier-label">入门</strong> 用量档，两个付费版本共享同一用量标准。','comparison.toggle':'只看差异','comparison.hint':'左右滑动，比较三个版本 ↔','comparison.note':'分辨率指 AI 生成能力；Render 内不消耗积分的范围仅为 AI 增强、放大功能。','faq.title':'FAQ','faq.subtitle':'关于选择、积分和开通。','faq.link':'前往帮助中心 ↗',
  'faq.q1':'D5 Pro 可以升级到 D5 团队版吗？<span>+</span>','faq.a1':'团队版面向需要协作与统一管理的团队，具体开放时间和升级方式以后续产品公告为准。','faq.q2':'D5 社区版授权可以做什么？<span>+</span>','faq.a2':'社区版适合个人体验 D5 的 AI 创作能力，生成内容不可用于商业用途。','faq.q3':'如何获取发票？<span>+</span>','faq.a3':'完成购买后，可在账户订单页面申请和下载发票。',
  'footer.product':'产品','footer.whyD5':'为什么选择 D5','footer.whatsNew':'最新动态','footer.pricing':'价格','footer.download':'下载','footer.teams':'D5 团队版','footer.education':'D5 教育版','footer.roadmap':'开发路线图','footer.assets':'素材库','footer.support':'支持','footer.help':'帮助中心','footer.requirements':'系统要求','footer.space':'我的空间','footer.learn':'学习','footer.tutorial':'教程','footer.sample':'示例场景','footer.gallery':'作品展示','footer.blog':'博客','footer.webinars':'线上研讨会','footer.certification':'认证','footer.instructor':'D5 讲师','footer.community':'社区','footer.forum':'论坛','footer.awards':'D5 大奖','footer.creator':'创作者计划','footer.campus':'校园大使','footer.userGroup':'用户社群','footer.winPro':'赢取 D5 Pro','footer.business':'商务合作','footer.reseller':'成为经销商','footer.findReseller':'寻找经销商','footer.affiliate':'推广合作','footer.technology':'技术合作伙伴','footer.brandKit':'品牌资源','footer.company':'公司','footer.about':'关于我们','footer.careers':'加入我们','footer.hear':'听见你的声音','footer.newsletter':'获取最新消息、文章、资源和设计灵感。','footer.emailLabel':'邮箱地址','footer.emailPlaceholder':'输入邮箱','footer.subscribe':'下一步','footer.followTitle':'关注我们','footer.follow':'D5　Discord　Instagram','footer.privacy':'隐私政策','footer.service':'服务协议','footer.join':'加入我们','footer.copyright':'Dimension 5 Techs. © 2026 Dimension 5. 保留所有权利。'
},en:{
  'nav.product':'Product⌄','nav.workflow':'Workflow⌄','nav.solutions':'Solutions⌄','nav.explore':'Explore⌄','nav.learning':'Learning⌄','nav.pricing':'Pricing','nav.signIn':'Sign In','nav.download':'Free Download ↗',
  'hero.title':'Find the right D5 plan for you','hero.subtitle':'From your first exploration to your next professional delivery, more ideas, more possibilities','audience.personal':'For creators','audience.team':'For teams','audience.soon':'Coming soon','billing.annual':'Yearly','billing.discount':'Save x%',
  'pricing.foot':'Monthly credits reset each cycle and do not roll over. <a href="#comparison">Learn about credits ↗</a>','pricing.compare':'Compare all features ↓','education.inline':'D5 for Education: dedicated benefits for students and teachers','education.apply':'Learn more ↗',
  'usage.label':'Monthly AI usage','usage.help':'The usage tier applies to both Basic and Pro. Credits stay the same within a tier while product benefits differ. Plan credits expire at the end of each credit cycle.','billing.monthly':'Monthly','billing.note':'· No auto-renewal','team.title':'More possibilities for creating together.','team.subtitle':'The team plan is coming soon. Stay tuned.','team.back':'See personal plans ↗','workflow.stage1':'Explore ideas','workflow.stage2':'Design iteration','workflow.stage3':'Visual expression','workflow.stage4':'Delivery','workflow.comparePlan':'Compare plan','workflow.compareTier':'Usage tier','workflow.previewOnly':'Preview only — your selected plan stays unchanged','workflow.noteLead':'Usage expands your creative space; plan level shapes your capabilities.','workflow.noteStrong':'Same-tier credits, different pro benefits.','education.title':'D5 for Education','education.subtitle':'Best for students, educators, and academic institutions','education.button':'Apply','checkout.title':'Confirm your plan','checkout.notice':'This is a design preview. Login, payment and activation are not connected; no order or charge will be created.','checkout.back':'Back to comparison',
  'workflow.title':'D5 with you, at every step','workflow.subtitle':'See how each benefit supports your creative workflow.','workflow.link':'View all features ↗','comparison.title':'Compare all features','comparison.subtitle':'Comparing the <strong id="comparison-tier-label">Starter</strong> usage tier. Paid plans share the same monthly credits.','comparison.toggle':'Show differences only','comparison.hint':'Swipe to compare three plans ↔','comparison.note':'Resolution refers to AI generation. Render features without credit usage include AI Enhance and Upscale.','faq.title':'FAQ','faq.subtitle':'Plans, credits and getting started.','faq.link':'Visit Help Center ↗',
  'faq.q1':'Can D5 Pro be upgraded to D5 for Teams?<span>+</span>','faq.a1':'D5 for Teams is designed for collaborative work and centralized management. Availability and upgrade details will follow the product announcement.','faq.q2':'What am I allowed to do with D5 Community license?<span>+</span>','faq.a2':'The Community plan is for exploring D5 AI creation features. Generated content is not for commercial use.','faq.q3':'How do I get an invoice?<span>+</span>','faq.a3':'After purchase, request and download an invoice from your account orders page.',
  'footer.product':'Product','footer.whyD5':'Why D5','footer.whatsNew':'What’s New','footer.pricing':'Pricing','footer.download':'Download','footer.teams':'D5 for Teams','footer.education':'D5 for Education','footer.roadmap':'Roadmap','footer.assets':'Asset Library','footer.support':'Support','footer.help':'Help Center','footer.requirements':'System Requirements','footer.space':'My Space','footer.learn':'Learn','footer.tutorial':'Tutorials','footer.sample':'Sample Scene','footer.gallery':'Gallery','footer.blog':'Blog','footer.webinars':'Webinars','footer.certification':'Certification','footer.instructor':'D5 Instructor','footer.community':'Community','footer.forum':'Forum','footer.awards':'D5 Awards','footer.creator':'Champion Program','footer.campus':'Campus Ambassador','footer.userGroup':'User Group','footer.winPro':'Win D5 Pro','footer.business':'For Business','footer.reseller':'Become a Reseller','footer.findReseller':'Find a Reseller','footer.affiliate':'Affiliate Program','footer.technology':'Technology Partners','footer.brandKit':'Brand Kit','footer.company':'Company','footer.about':'About Us','footer.careers':'Career','footer.hear':'Hear from us','footer.newsletter':'Subscribe to get the latest news, articles, resources and inspiration.','footer.emailLabel':'Email address','footer.emailPlaceholder':'Enter your email','footer.subscribe':'Next step','footer.followTitle':'Follow us','footer.follow':'D5　Discord　Instagram','footer.privacy':'Privacy Policy','footer.service':'Service Agreement','footer.join':'Join Us','footer.copyright':'Dimension 5 Techs. © 2026 Dimension 5. All rights reserved.'
}};
const planCopy={zh:{community:'社区版',basic:'基础版',pro:'专业版',communityDesc:'从第一次灵感探索开始',basicDesc:'为日常 AI 创作，提供更多可能',proDesc:'让 AI 创作与专业表达相得益彰'},en:{community:'Community',basic:'Basic',pro:'Pro',communityDesc:'Start exploring your ideas',basicDesc:'More possibilities for everyday AI creation',proDesc:'Bring AI creation and professional expression together'}};
const tierCopy={zh:['入门','轻量','标准','旗舰'],en:['Starter','Light','Standard','Ultra']};
const tierName=i=>tierCopy[state.lang][i];
const t=k=>copy[state.lang][k]||k; const ptxt=k=>planCopy[state.lang][k]||k;
const valueText=v=>{if(state.lang==='zh')return v;const map={'AI 权益不可商用':'AI benefits not for commercial use','AI 生成可商用':'AI-generated content for commercial use','全部可商用¹':'All benefits for commercial use¹','不可管理':'Not available','下载管理':'Download management','不可充值':'Top-up unavailable','不支持':'Not supported','不消耗积分':'Credit-free','消耗积分':'Uses credits','部分模型':'Selected models','全部模型':'All models'};return map[v]||String(v).replace('积分','credits').replace('天',' days').replace('个','').replace('不限','Unlimited');};
function applyLanguage(){document.documentElement.lang=state.lang==='zh'?'zh-CN':'en';$$('[data-i18n]').forEach(el=>{el.innerHTML=t(el.dataset.i18n)});$$('[data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));$$('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===state.lang));document.title=state.lang==='zh'?'D5 · 选择你的创作方案':'D5 · Choose your D5 plan';}
const stages={
  arco:{product:'D5 ARCO · AI CREATION',heading:'让一个想法，长出更多可能。',description:'从灵感探索到图像生成，把反复尝试交给 AI，让你专注于值得继续的方向。',image:'assets/arco.webp',chip:'EXPLORE YOUR IDEAS',caption:'D5 Arco · 官方界面示意'},
  lite:{product:'D5 LITE · DESIGN ITERATION',heading:'一边设计，一边看见。',description:'在建模软件中推敲设计，用实时光影和材质观察每一次变化，让想法逐渐清晰。',image:'assets/workflow-hero.webp',chip:'DESIGN IN REAL TIME',caption:'D5 Lite · 官方产品示意'},
  render:{product:'D5 RENDER · VISUAL EXPRESSION',heading:'让细节，更接近你的想象。',description:'在渲染表达阶段精进画面。查看当前版本如何支持 Render 内的 AI 增强与放大。',image:'assets/render.png',chip:'BRING IDEAS TO LIFE',caption:'D5 Render · 官方界面示意'},
  delivery:{product:'PRESENT & SHARE · DELIVERY',heading:'把作品，自信地交到下一站。',description:'从创作到使用，了解 AI 生成成果的商用范围，以及分享下载的管理能力。',image:'assets/workflow-render.webp',chip:'READY FOR YOUR NEXT STEP',caption:'D5 工作流 · 官方产品示意'}
};
const stageEn={
  arco:{product:'D5 ARCO · AI CREATION',heading:'Let one idea grow into many possibilities.',description:'Explore directions with AI image generation and keep the ideas worth pursuing.',chip:'EXPLORE YOUR IDEAS',caption:'D5 Arco · product preview'},
  lite:{product:'D5 LITE · DESIGN ITERATION',heading:'Design and see the result at once.',description:'Iterate in your modeling software with real-time light and materials.',chip:'DESIGN IN REAL TIME',caption:'D5 Lite · product preview'},
  render:{product:'D5 RENDER · VISUAL EXPRESSION',heading:'Bring every detail closer to your vision.',description:'Refine the final image and compare how each plan supports Render AI tools.',chip:'BRING IDEAS TO LIFE',caption:'D5 Render · product preview'},
  delivery:{product:'PRESENT & SHARE · DELIVERY',heading:'Deliver your work with confidence.',description:'Understand commercial use and sharing benefits from creation to delivery.',chip:'READY FOR YOUR NEXT STEP',caption:'D5 workflow · product preview'}
};
function renderPricing(){
  const tier=tiers[state.tier];
  const tierText=tierName(state.tier);
  $('#mobile-plan-switch').innerHTML=Object.entries(plans).map(([id])=>`<button data-plan="${id}" aria-pressed="${state.plan===id}">${ptxt(id)}<small>${id==='community'?(state.lang==='zh'?'免费':'Free'):`¥${billingPrice(id,state.tier)} / ${state.billing==='annual'?(state.lang==='zh'?'年':'yr'):(state.lang==='zh'?'月':'mo')}`}</small></button>`).join('');
  $('#plan-grid').innerHTML=Object.entries(plans).map(([id])=>{
    const e=entitlements(id,state.tier),pro=id==='pro',free=id==='community',name=ptxt(id),displayPrice=billingPrice(id,state.tier);
    const labels={community:'EXPLORE',basic:'CREATE',pro:'PROFESSIONAL CREATION'};
    const descriptions={community:ptxt('communityDesc'),basic:ptxt('basicDesc'),pro:ptxt('proDesc')};
    const features=free?(state.lang==='zh'?['一次性领取 300 体验积分','支持 2 个并发任务','支持体验部分模型','支持生成 1K 图片','支持生成 480P 视频','不支持 AI 积分包充值','不可商用']:['One-time 300 trial credits','2 concurrent tasks','Selected models','AI image generation up to 1K','AI video generation up to 480P','AI credit packs unavailable','Not for commercial use']):pro?(state.lang==='zh'?['每月按档位发放积分','支持 4 个并发任务','支持全部模型','支持生成 4K 图片','支持生成 4K 视频','支持AI 积分包充值　额外赠送 10%','全部可商用']:['Credits issued by monthly tier','4 concurrent tasks','All models','AI image generation up to 4K','AI video generation up to 4K','AI credit packs　10% bonus','All for commercial use']):(state.lang==='zh'?['每月按档位发放积分','支持 4 个并发任务','支持全部模型','支持生成 2K 图片','支持生成 720P 视频','支持AI 积分包充值','AI生成可商用']:['Credits issued by monthly tier','4 concurrent tasks','All models','AI image generation up to 2K','AI video generation up to 720P','AI credit packs available','AI-generated content for commercial use']);
    const progress=12.5+state.tier*25;
    const slider=free?'':`<div class="slider-caption" id="tier-label-${id}">${state.lang==='zh'?'可选每月AI 积分档位':'Monthly AI credit tier'}</div><div class="plan-slider ${pro?'slider-pro':''}" data-plan-slider style="--progress:${progress}%"><span class="slider-fill" aria-hidden="true"></span><span class="slider-ticks" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="slider-tier-label" data-plan-tier-label aria-hidden="true">${tierText}</span><span class="slider-credits" data-plan-credits aria-hidden="true">${tier.credits}</span><input type="range" min="0" max="3" step="1" value="${state.tier}" data-plan-tier aria-label="${name} · ${state.lang==='zh'?'每月AI积分档位':'Monthly AI credit tier'}" aria-valuetext="${tierText}, ${tier.credits} ${state.lang==='zh'?'积分':'credits'}"></div>`;
    const action=free?`<a class="button secondary" href="#pricing">${state.lang==='zh'?'免费下载':'Free Download'}</a>`:`<button class="button ${pro?'primary':'basic-button'}" data-checkout="${id}">${state.lang==='zh'?'立即升级':'Upgrade now'}</button>`;
    const firstMonth=state.billing==='monthly'&&state.lang==='zh'&&id==='basic'?`<span class="first-month" ${state.tier!==0?'hidden':''}>首月￥39</span>`:'';
    const period=free?(state.lang==='zh'?'/免费体验':'/ free'):(state.billing==='annual'?(state.lang==='zh'?'/年':'/ yr'):(state.lang==='zh'?'/月':'/ mo'));
    const priceNote=free?(state.lang==='zh'?'下载 Arco 并登录领取 · 365 天有效':'Download Arco and sign in · valid for 365 days'):(state.billing==='annual'?(state.lang==='zh'?`${tierText}用量 · 年付方案`:`${tierText} tier · annual plan`):`${tierText}${state.lang==='zh'?'用量 · 单次月购，无自动续费':' tier · one-time monthly purchase'}`);
    return `<article class="plan-card ${id} ${state.plan===id?'mobile-active':''}"><p class="plan-label">${labels[id]}</p><p class="plan-description">${descriptions[id]}</p><div class="plan-heading"><h2>${name}</h2></div><div class="price-row"><span class="price-currency">￥</span><span class="price-number">${displayPrice}</span><span class="price-period">${period}</span>${firstMonth}</div><p class="price-note">${priceNote}</p>${free?`${action}`:`${slider}${action}`}<div class="plan-divider"></div><ul class="feature-list">${features.map(f=>`<li>${check}<span>${f}</span></li>`).join('')}</ul><button class="plan-detail" data-explore="${id}">${free?(state.lang==='zh'?'看看 D5 工作流':'Explore the D5 workflow'):(state.lang==='zh'?'了解工作流权益':'See workflow benefits')} <span>↗</span></button></article>`;
  }).join('');
  renderComparison();renderMobilePurchase();applyLanguage();
  const billingToggle=$('.billing-toggle-control');
  billingToggle.setAttribute('aria-pressed',state.billing==='annual');
  billingToggle.setAttribute('aria-label',state.billing==='annual'?(state.lang==='zh'?'切换按月购买':'Switch to monthly'):(state.lang==='zh'?'切换按年购买':'Switch to annual'));
}
// Digit wheels follow Number Input's roll treatment: directional, interruptible,
// 500ms settling. The accessible value always exposes the selected tier immediately.
const numberMotion = new WeakMap();
function animateNumber(el, target) {
  if (!el) return;
  let motion = numberMotion.get(el);
  const previous = motion?.target ?? Number(el.textContent);
  if (motion?.target === target) return;
  const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!motion || quiet) {
    motion?.lanes.forEach(lane => cancelAnimationFrame(lane.frame));
    el.replaceChildren();
    motion = { target: previous, lanes: new Map() };
    numberMotion.set(el, motion);
  }
  el.classList.add('rolling-number');
  el.setAttribute('aria-label', String(target));
  const direction = Math.sign(target - previous) || 1;
  const digits = String(target).split('').reverse();
  for (const [place, lane] of motion.lanes) {
    if (place >= digits.length) {
      cancelAnimationFrame(lane.frame);
      lane.cell.remove();
      motion.lanes.delete(place);
    }
  }
  digits.forEach((digit, place) => {
    let lane = motion.lanes.get(place);
    if (!lane) {
      const cell = document.createElement('span');
      cell.className = 'number-wheel';
      cell.setAttribute('aria-hidden', 'true');
      const track = document.createElement('span');
      track.className = 'number-wheel-track';
      track.append(document.createElement('span'), document.createElement('span'));
      cell.append(track);
      el.prepend(cell);
      lane = { cell, track, position: Number(String(previous).split('').reverse()[place] || 0), frame: 0 };
      motion.lanes.set(place, lane);
    }
    cancelAnimationFrame(lane.frame);
    const start = lane.position;
    const currentDigit = ((start % 10) + 10) % 10;
    const delta = direction > 0 ? (Number(digit) - currentDigit + 10) % 10 : -((currentDigit - Number(digit) + 10) % 10);
    const destination = start + delta;
    const paint = position => {
      lane.position = position;
      const integer = Math.floor(position);
      lane.track.children[0].textContent = String(((integer % 10) + 10) % 10);
      lane.track.children[1].textContent = String((((integer + 1) % 10) + 10) % 10);
      lane.track.style.transform = `translateY(${-((position - integer) * 50)}%)`;
    };
    if (quiet || delta === 0) { paint(destination); return; }
    const started = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - started) / 500);
      paint(t === 1 ? destination : start + delta * (1 - Math.pow(1 - t, 4)));
      if (t < 1) lane.frame = requestAnimationFrame(tick);
    };
    paint(start);
    lane.frame = requestAnimationFrame(tick);
  });
  motion.target = target;
}
function syncTierControls() {
  const tier = tiers[state.tier];
  const progress = 12.5 + state.tier * 25;
  $$('.plan-card').forEach(card => {
    if (card.classList.contains('community')) return;
    const id = card.classList.contains('basic') ? 'basic' : 'pro';
    animateNumber(card.querySelector('.price-number'), billingPrice(id,state.tier));
    const badge = card.querySelector('.first-month');
    if (badge) badge.hidden = state.tier !== 0;
    const slider = card.querySelector('[data-plan-slider]');
    slider.style.setProperty('--progress', `${progress}%`);
    const input = slider.querySelector('[data-plan-tier]');
    input.value = String(state.tier);
    input.setAttribute('aria-valuetext', `${tierName(state.tier)}, ${tier.credits} ${state.lang==='zh'?'积分':'credits'}`);
    slider.querySelector('[data-plan-tier-label]').textContent = tierName(state.tier);
    animateNumber(slider.querySelector('[data-plan-credits]'), tier.credits);
  });
  $$('#mobile-plan-switch [data-plan]').forEach(button => {
    const id = button.dataset.plan;
    if (id !== 'community') button.querySelector('small').textContent = `¥${billingPrice(id,state.tier)} / ${state.billing==='annual'?(state.lang==='zh'?'年':'yr'):(state.lang==='zh'?'月':'mo')}`;
  });
  const billingToggle=$('.billing-toggle button');
  billingToggle.setAttribute('aria-pressed',state.billing==='annual');
  billingToggle.setAttribute('aria-label',state.billing==='annual'?(state.lang==='zh'?'切换按月购买':'Switch to monthly'):(state.lang==='zh'?'切换按年购买':'Switch to annual'));
  renderMobilePurchase();
}
function selectTier(value) {
  const next = Math.max(0, Math.min(3, Math.round(value)));
  if (state.tier === next) return;
  state.tier = next;
  syncTierControls();
}
// Keep the DOM and captured pointer alive for the entire drag, even when a
// finger leaves the rail. Native range keyboard behavior remains available.
let tierDrag = null;
function tierFromPointer(slider, clientX) {
  const bounds = slider.getBoundingClientRect();
  const position = (clientX - bounds.left) / bounds.width;
  return Math.max(0, Math.min(3, (position - 0.125) / 0.25));
}
document.addEventListener('pointerdown', event => {
  const slider = event.target.closest('[data-plan-slider]');
  if (!slider || event.button !== 0 || !event.isPrimary) return;
  event.preventDefault();
  slider.querySelector('input').focus({ preventScroll: true });
  slider.setPointerCapture(event.pointerId);
  slider.classList.add('is-dragging');
  tierDrag = { slider, pointerId: event.pointerId };
  selectTier(tierFromPointer(slider, event.clientX));
});
document.addEventListener('pointermove', event => {
  if (tierDrag?.pointerId === event.pointerId) selectTier(tierFromPointer(tierDrag.slider, event.clientX));
});
function finishTierDrag(event) {
  if (tierDrag?.pointerId !== event.pointerId) return;
  const { slider } = tierDrag;
  tierDrag = null;
  slider.classList.remove('is-dragging');
  if (slider.hasPointerCapture(event.pointerId)) slider.releasePointerCapture(event.pointerId);
  $('#announcer').textContent = `${tierName(state.tier)} · ${tiers[state.tier].credits} ${state.lang==='zh'?'积分':'credits'}`;
}
['pointerup','pointercancel','lostpointercapture'].forEach(type => document.addEventListener(type, finishTierDrag));
function renderComparison(){
  const zh=state.lang==='zh';
  $('#comparison-tier-label').textContent=tierName(state.tier);
  $('#comparison-head').innerHTML=`<tr><th>${zh?'D5 渲染功能':'D5 Render Features'}</th><th>${zh?'社区版':'Community'}</th><th>${zh?'基础版':'Basic'}</th><th>${zh?'专业版':'Pro'}</th></tr>`;
  const group=zh?'场景编辑':'Scene Editing';
  const features=zh?['无限场景数量','主流文件格式导入']:['Unlimited number of scenes','Major file format imports'];
  $('#comparison-body').innerHTML=`<tr class="group-row"><th colspan="4">${group}</th></tr>${features.map(label=>`<tr><th>${label}</th><td>✓</td><td>✓</td><td>✓</td></tr>`).join('')}`;
  return;
  $('#comparison-tier-label').textContent=tierName(state.tier);
  $('#comparison-head').innerHTML=`<tr><th>${state.lang==='zh'?'功能与权益':'Features & benefits'}</th>${Object.entries(plans).map(([id])=>`<th>${ptxt(id)}<small>${id==='community'?(state.lang==='zh'?'免费体验':'Free trial'):`${tierName(state.tier)} · ${num(tiers[state.tier].credits)} ${state.lang==='zh'?'积分 / 月':'credits / mo'}`}</small></th>`).join('')}</tr>`;
  const valueCopy={
    '无月度套餐':state.lang==='zh'?'无月度套餐':'No monthly plan','部分模型':state.lang==='zh'?'部分模型':'Selected models','全部模型':state.lang==='zh'?'全部模型':'All models','消耗积分':state.lang==='zh'?'消耗积分':'Uses credits','不支持':state.lang==='zh'?'不支持':'Not supported','不消耗积分':state.lang==='zh'?'不消耗积分':'Credit-free','AI 权益不可商用':state.lang==='zh'?'AI 权益不可商用':'AI benefits not for commercial use','AI 生成可商用':state.lang==='zh'?'AI 生成可商用':'AI-generated content for commercial use','全部可商用¹':state.lang==='zh'?'全部可商用¹':'All benefits for commercial use¹','不可管理':state.lang==='zh'?'不可管理':'Not available','下载管理':state.lang==='zh'?'下载管理':'Download management','不可充值':state.lang==='zh'?'不可充值':'Top-up unavailable','—':'—'
  };
  const groupCopy={ 'AI 创作与用量':state.lang==='zh'?'AI 创作与用量':'AI creation & usage','工作流与成果使用':state.lang==='zh'?'工作流与成果使用':'Workflow & usage rights','充值权益':state.lang==='zh'?'充值权益':'Top-up benefits' };
  const labelCopy={ '每月套餐积分':state.lang==='zh'?'每月套餐积分':'Monthly plan credits','并发任务':state.lang==='zh'?'并发任务':'Concurrent tasks','AI 图片分辨率':state.lang==='zh'?'AI 图片分辨率':'AI image resolution','AI 视频分辨率':state.lang==='zh'?'AI 视频分辨率':'AI video resolution','可用模型':state.lang==='zh'?'可用模型':'Available models','Arco 内 AI 增强、放大':state.lang==='zh'?'Arco 内 AI 增强、放大':'Arco AI Enhance & Upscale','Render 内 AI 增强、放大':state.lang==='zh'?'Render 内 AI 增强、放大':'Render AI Enhance & Upscale','商用范围':state.lang==='zh'?'商用范围':'Commercial use','分享下载':state.lang==='zh'?'分享下载':'Sharing & download','常态充值赠送':state.lang==='zh'?'常态充值赠送':'Top-up bonus','充值积分有效期':state.lang==='zh'?'充值积分有效期':'Top-up credit validity' };
  const localValue=v=>{if(state.lang==='zh')return v;const direct=valueCopy[v];if(direct)return direct;return valueText(v).replace('免费体验','Free trial');};
  const rows=comparisonRows(state.tier).map(r=>r.group?{group:groupCopy[r.group]||r.group}:{label:labelCopy[r.label]||r.label,values:r.values.map(localValue)});
  $('#comparison-body').innerHTML=rows.filter(r=>r.group||!state.differences||new Set(r.values).size>1).map(r=>r.group?`<tr class="group-row"><th colspan="4">${r.group}</th></tr>`:`<tr><th>${r.label}</th>${r.values.map((v,i)=>`<td class="${i===2&&v!==r.values[1]?'positive':''}">${v}</td>`).join('')}</tr>`).join('');
}
function renderMobilePurchase(){const plan=state.plan,e=entitlements(plan,state.tier),name=ptxt(plan);$('#mobile-purchase').innerHTML=`<div><strong>${name}</strong><small>${plan==='community'?(state.lang==='zh'?'开启你的第一次探索':'Start exploring'):`${tierName(state.tier)} · ${num(e.credits)} ${state.lang==='zh'?'积分/月':'credits/mo'}`}</small></div>${plan==='community'?`<a class="button primary" href="#pricing">${state.lang==='zh'?'免费下载':'Download'}</a>`:`<button class="button primary" data-checkout="${plan}">${state.lang==='zh'?'开通':'Choose'} ${name}</button>`}`;updateStickyPurchase()}
function updateStickyPurchase(){const card=document.querySelector('.plan-card.mobile-active');const action=card?.querySelector('.button');$('#mobile-purchase').hidden=!action||action.getBoundingClientRect().bottom>=64}
function renderWorkflow(){
  const s=state.lang==='en'?stageEn[state.stage]:stages[state.stage],e=entitlements(state.previewPlan,state.previewTier),t=tiers[state.previewTier];
  $$('[data-stage]').forEach(b=>{const active=b.dataset.stage===state.stage;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1});$('#workflow-panel').setAttribute('aria-labelledby',`tab-${state.stage}`);$('#workflow-visual').className=`workflow-visual ${state.stage}`;$('#workflow-visual').innerHTML=`<span class="visual-chip">${s.chip}</span><div class="visual-caption"><span>${s.caption}</span><span>0${Object.keys(stages).indexOf(state.stage)+1} / 04</span></div>`;$('#workflow-product').textContent=s.product;$('#workflow-heading').textContent=s.heading;$('#workflow-description').textContent=s.description;$('#workflow-plan').value=state.previewPlan;$('#workflow-plan').innerHTML=`<option value="basic">${ptxt('basic')}</option><option value="pro">${ptxt('pro')}</option>`;$('#workflow-tier').innerHTML=tiers.map((x,i)=>`<option value="${i}" ${i===state.previewTier?'selected':''}>${tierName(i)} · ${num(x.credits)}</option>`).join('');
  let metrics=[],note='';const zh=state.lang==='zh';if(state.stage==='arco'){metrics=[[zh?'每月创作积分':'Monthly credits',num(e.credits)],[zh?'并发任务':'Concurrent tasks',e.concurrency==='不限'?(zh?'不限':'Unlimited'):`${e.concurrency} ${zh?'个':'tasks'}`],[zh?'AI 图片 / 视频':'AI image / video',`${e.image} / ${e.video}`],[zh?'Arco 内增强、放大':'Arco Enhance & Upscale',zh?'消耗积分':'Uses credits']];note=zh?`同为${tierName(state.previewTier)}档，基础版和专业版积分相同。套餐积分到期不累计.`:`Basic and Pro share the same ${tierName(state.previewTier)} credits. Plan credits expire each cycle.`;}if(state.stage==='render'){metrics=[[zh?'Render 内 AI 增强':'Render AI Enhance',valueText(e.render)],[zh?'Render 内 AI 放大':'Render AI Upscale',valueText(e.render)],[zh?'Arco 内增强、放大':'Arco Enhance & Upscale',valueText(e.arco)],[zh?'每月 AI 创作积分':'Monthly AI credits',num(e.credits)]];note=state.previewPlan==='pro'?(zh?'不耗积分仅适用于上述 Render 功能，不代表所有 AI 功能免费。':'Credit-free applies only to the Render features above, not every AI feature.'):(zh?'切换专业版，查看 Render 内 AI 增强与放大权益。':'Switch to Pro to compare credit-free Render Enhance and Upscale.');}if(state.stage==='delivery'){metrics=[[zh?'商用范围':'Commercial use',valueText(e.commercial)],[zh?'分享下载':'Sharing & download',valueText(e.downloads)],[zh?'充值积分有效期':'Top-up validity',valueText(e.expiry)],[zh?'常态充值额外赠送':'Top-up bonus',valueText(e.bonus)]];note=zh?'商用权限以适用产品的授权条款为准。协作项目数暂未上线。':'Commercial use follows the applicable product terms. Team projects are not available yet.';}
  $('#workflow-benefits').innerHTML=state.stage==='lite'?`<div class="benefit-explanation">${zh?'D5 Lite 将实时可视化带入建模软件，在方案推敲中观察光影与材质。<br><br>AI 模式探索可能，渲染模式验证想法。从设计修改到画面呈现，让每一步更直观。':'Bring real-time visualization into your modeling workflow. <br><br>Explore in AI mode, validate in Render mode, and make every design change easier to see.'}</div><a class="text-link" href="#pricing">${zh?'了解 D5 Lite ↗':'Learn about D5 Lite ↗'}</a>`:`<dl class="benefit-grid">${metrics.map(([label,value])=>`<div class="benefit-item"><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl><p class="benefit-note">${note}</p>`;$('#apply-workflow').textContent=`${zh?'选择':'Choose'} ${ptxt(state.previewPlan)} · ${tierName(state.previewTier)} ↗`;
}
function setAudience(a){state.audience=a;$$('[data-audience]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.audience===a));$('#personal-pricing').hidden=false;$('#personal-details').hidden=false;$('#team-panel').hidden=true;renderMobilePurchase()}
function setBilling(mode){if(state.billing===mode)return;state.billing=mode;renderPricing();renderWorkflow();}
function setLanguage(lang){state.lang=lang;renderPricing();renderWorkflow();applyLanguage();}
function openCheckout(plan){state.plan=plan;renderPricing();const e=entitlements(plan,state.tier),zh=state.lang==='zh',annual=state.billing==='annual';$('#checkout-content').innerHTML=`<div class="checkout-summary"><div class="checkout-row"><span>${zh?'会员版本':'Plan'}</span><strong>${ptxt(plan)}</strong></div><div class="checkout-row"><span>${zh?'每月用量':'Monthly usage'}</span><strong>${tierName(state.tier)} · ${num(e.credits)} ${zh?'积分':'credits'}</strong></div><div class="checkout-row"><span>${zh?'购买方式':'Purchase'}</span><strong>${annual?(zh?'年度购买':'Annual plan'):(zh?'单次月购':'One-time monthly')}</strong></div><div class="checkout-row"><span>${zh?'续费方式':'Renewal'}</span><strong>${zh?'到期后自行购买':'Buy again after expiry'}</strong></div></div><div class="checkout-total"><span>${zh?'方案价格':'Plan price'}</span><strong>¥${billingPrice(plan,state.tier)}<small> / ${annual?(zh?'年':'yr'):(zh?'月':'mo')}</small></strong></div>`;$('#checkout-dialog').showModal()}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.lang){setLanguage(b.dataset.lang);return;}if(b.classList.contains('billing-toggle-control')){setBilling(state.billing==='annual'?'monthly':'annual');return;}if(b.dataset.audience)setAudience(b.dataset.audience);if(b.dataset.tier!==undefined){state.tier=Number(b.dataset.tier);renderPricing();$('#announcer').textContent=state.lang==='zh'?`已切换${tiers[state.tier].name}用量`:`Switched to ${tiers[state.tier].name}`;}if(b.dataset.plan){state.plan=b.dataset.plan;renderPricing();}if(b.dataset.checkout)openCheckout(b.dataset.checkout);if(b.dataset.explore){state.previewPlan=b.dataset.explore==='community'?'basic':b.dataset.explore;state.previewTier=state.tier;renderWorkflow();$('#workflow').scrollIntoView({behavior:'smooth'});}if(b.dataset.stage){state.stage=b.dataset.stage;renderWorkflow()}});
document.addEventListener('input',e=>{if(e.target.matches('[data-plan-tier]')){selectTier(Number(e.target.value));}});
$('#back-personal').addEventListener('click',()=>setAudience('personal'));$('#workflow-plan').addEventListener('change',e=>{state.previewPlan=e.target.value;renderWorkflow()});$('#workflow-tier').addEventListener('change',e=>{state.previewTier=Number(e.target.value);renderWorkflow()});$('#apply-workflow').addEventListener('click',()=>{state.plan=state.previewPlan;state.tier=state.previewTier;renderPricing();$('#pricing').scrollIntoView({behavior:'smooth'});$('#announcer').textContent=state.lang==='zh'?'已选择工作流方案':'Workflow plan selected'});$('#difference-only').addEventListener('change',e=>{state.differences=e.target.checked;renderComparison()});$('.workflow-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const keys=Object.keys(stages);let i=keys.indexOf(state.stage);i=e.key==='Home'?0:e.key==='End'?keys.length-1:(i+(e.key==='ArrowRight'?1:-1)+keys.length)%keys.length;state.stage=keys[i];renderWorkflow();$(`[data-stage="${state.stage}"]`).focus()});$('.dialog-close').addEventListener('click',()=>$('#checkout-dialog').close());$('.dialog-return').addEventListener('click',()=>$('#checkout-dialog').close());$('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();$('#newsletter-note').textContent=state.lang==='zh'?'感谢订阅，我们会把最新动态发到你的邮箱。':'Thanks for subscribing. We will send updates to your inbox.';});window.addEventListener('scroll',updateStickyPurchase);window.addEventListener('resize',updateStickyPurchase);renderPricing();renderWorkflow();applyLanguage();
