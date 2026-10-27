// Figma card content and reversible, interruption-safe audience transitions.
// Personal content: Figma 31951:32326. Tier prices: jjcyixi/d5pricing-beta/data.js.
(() => {
  const params = new URLSearchParams(location.search);
  state.audience = params.get('audience') === 'team' ? 'team' : 'personal';
  state.billing = params.get('billing') === 'annual' ? 'annual' : 'monthly';
  state.lang = params.get('lang') === 'en' ? 'en' : 'zh';
  state.personalTiers = Object.fromEntries(['basic','pro'].map(id => [id, params.get(`${id}Tier`) === 'advanced' ? 1 : 0]));
  const personalTiers = [
    { names: {zh:'入门档',en:'Starter'}, credits:1500, baseCredits:1000, concurrency:4, image:'2K', video:'720p', basic:49, pro:200, basicAnnual:468, proAnnual:1920 },
    { names: {zh:'进阶档',en:'Advanced'}, credits:4500, baseCredits:3000, concurrency:6, image:'4K', video:'4K', basic:129, pro:279, basicAnnual:1188, proAnnual:2628 },
  ];
  const selectedTier = id => personalTiers[state.personalTiers[id]];
  const personalPrice = id => selectedTier(id)[state.billing === 'annual' ? `${id}Annual` : id];
  const tierName = id => selectedTier(id).names[state.lang];

  Object.assign(copy.zh, {
    'education.title': 'D5 学生版',
    'education.subtitle': '专为高校在校生推出的特别权益方案，助力教与学',
    'education.button': '自主申请',
    'comparison.title': '功能权益对比',
    'comparison.subtitle': '详细对比个人创作套餐及功能权益',
    'billing.discount': '年付惠',
  });
  copy.en['billing.discount'] = 'Save';
  plans.zh.download = '开始体验';
  plans.en.download = 'Get started';
  plans.zh.upgrade = '立即订阅';
  plans.en.upgrade = 'Subscribe now';
  const renderFeatures = {
    zh: {
      shared: ['免费建模插件同步','免费3000+素材','免费实时交互演示','免费实时渲染 16K 图片','免费实时渲染 4K 视频','免费全景漫游创建及分享'],
      community: '更多 D5工作流免费功能可用', basic: '包含社区版 D5工作流功能',
      pro: ['全品类 16,000+ 高品质素材','城市生成等高级场景构建功能','专业级图片.tga、.tif、.exr格式渲染','专业级视频多帧率及多格式渲染','实时空间漫游、XR 漫游创建及分享','实时云端像素推流、虚拟现实(VR)分享','完整 D5工作流功能可用'],
    },
    en: {
      shared: ['Free modeling plugin sync','3,000+ free assets','Free real-time interactive presentations','Free real-time 16K image rendering','Free real-time 4K video rendering','Free panorama creation and sharing'],
      community: 'More free D5 workflow features', basic: 'Community D5 workflow features included',
      pro: ['16,000+ premium assets across all categories','Advanced scene building including city generation','Professional TGA, TIF and EXR image rendering','Professional video formats and frame rates','Spatial and XR tour creation and sharing','Cloud pixel streaming and virtual reality (VR) sharing','The complete D5 workflow'],
    },
  };
  const personalIcon = name => `<img src="assets/figma/personal-${name}.svg" alt="" width="16" height="16">`;
  const info = (id, key, text) => `<span class="feature-info"><button type="button" class="feature-info-button" aria-label="${state.lang === 'zh' ? '权益说明' : 'Benefit details'}" aria-describedby="${id}-${key}-tip">${personalIcon('question')}</button><span class="feature-tooltip" role="tooltip" id="${id}-${key}-tip">${text}</span></span>`;
  const personalFeature = (text, {unavailable = false, help = ''} = {}) => `<li${unavailable ? ' class="unavailable"' : ''}><span class="feature-check" aria-hidden="true">${personalIcon(unavailable ? 'close' : 'check')}</span><span class="feature-copy">${text}${help}</span></li>`;
  function aiFeatures(id) {
    const zh = state.lang === 'zh';
    if (id === 'community') return [
      personalFeature(zh ? '免费 300 AI 积分领取' : '300 free AI credits to claim', {help:info(id,'credits',zh ? '一次性领取 300 积分，有效期 365 天。' : 'Claim 300 credits once, valid for 365 days.')}),
      personalFeature(zh ? '支持体验部分 AI 模型' : 'Try selected AI models'),
      personalFeature(zh ? '支持最高 1K 图片，480p 视频生成' : 'Generate images up to 1K and video up to 480p'),
      personalFeature(zh ? '支持最多 2 个 AI 任务并发' : 'Run up to 2 concurrent AI tasks'),
      personalFeature(zh ? '不支持积分充值' : 'Credit top-ups unavailable', {unavailable:true}),
    ].join('');
    const tier = selectedTier(id);
    const help = zh ? `每月 ${tier.baseCredits} 基础积分 + ${tier.credits - tier.baseCredits} 首发赠送积分。2027年2月28日前购买，统一首发窗口内合资格月度批次加赠 50%；窗口结束后恢复基础积分。年付按月发放，不全年加赠。` : `${tier.baseCredits} base credits + ${tier.credits - tier.baseCredits} launch bonus per eligible monthly batch. Purchase before February 28, 2027 within the shared launch window; base credits apply afterward. Annual credits are issued monthly; the bonus does not cover the full year.`;
    return [
      personalFeature(zh ? `每月 ${tier.credits} AI 积分` : `${tier.credits.toLocaleString('en-US')} AI credits per month`, {help:info(id,'credits',help)}),
      ...(id === 'pro' ? [personalFeature(zh ? '工作流内指定 AI 功能不限次使用' : 'Unlimited use of selected workflow AI features', {help:info(id,'workflow',zh ? 'Render 内指定功能（AI 氛围匹配、AI 后期、局部重绘等）不限次使用；通过 Arco 使用按积分计费。' : 'Selected features within Render, including AI Atmosphere Match, AI post-processing and inpainting, are unlimited. Usage through Arco consumes credits.')})] : []),
      personalFeature(zh ? '支持全部 AI 模型' : 'Access to all AI models'),
      personalFeature(zh ? `支持最高 ${tier.image} 图片，${tier.video} 视频生成` : `Generate images up to ${tier.image} and video up to ${tier.video}`),
      personalFeature(zh ? `支持最多 ${tier.concurrency} 个 AI 任务并发` : `Run up to ${tier.concurrency} concurrent AI tasks`),
    ].join('');
  }
  function featureSections(id) {
    const copy = renderFeatures[state.lang];
    const items = id === 'pro' ? copy.pro : [...copy.shared,copy[id]];
    return `<section class="plan-feature-section render-features" aria-labelledby="${id}-render-title"><h3 id="${id}-render-title"><span class="feature-check" aria-hidden="true">${personalIcon('render')}</span>${state.lang === 'zh' ? '实时渲染' : 'Real-time rendering'}</h3><ul class="plan-list">${items.map(item => personalFeature(item)).join('')}</ul></section><section class="plan-feature-section ai-features" aria-labelledby="${id}-ai-title"><h3 id="${id}-ai-title"><span class="feature-check" aria-hidden="true">${personalIcon('ai')}</span>${state.lang === 'zh' ? 'AI 创作' : 'AI creation'}</h3><ul class="plan-list" data-ai-features="${id}">${aiFeatures(id)}</ul></section>`;
  }
  const teamFeatures = {
    zh: ['包含个人创作全部功能权益', '支持D5工作流多人协作', '100GB 共享云空间', '支持定制席位类型',
      '支持自定义团队角色权限', '团队后台数据看板', '团队成员分组管理', '团队数字资产管理',
      '团队D5产品版本更新管理', '团队AI 功能权限及模型管理'],
    en: ['Everything for individual creators', 'Collaborative D5 workflows', '100GB shared cloud storage', 'Custom seat types',
      'Custom team roles and permissions', 'Team analytics dashboard', 'Member and group management', 'Team asset management',
      'D5 version and update management', 'AI model and permission controls'],
  };
  const check = '<span class="feature-check" aria-hidden="true"><img src="assets/figma/check.svg" alt="" width="16" height="16"></span>';
  const features = items => items.map(item => `<li>${check}<span>${Array.isArray(item) ? `${item[0]}<em>${item[1]}</em>` : item}</span></li>`).join('');

  // Measure natural card heights on narrow screens, including translated copy.
  // Transforms do not affect offsetHeight, so measurements stay stable in motion.
  const cardObserver = new ResizeObserver(() => {
    const grid = $('#plan-grid');
    const cards = ['community','basic','pro','team'].map(id => grid.querySelector(`[data-plan="${id}"]`));
    if (cards.some(card => !card)) return;
    const [community,basic,pro,team] = cards.map(card => card.offsetHeight);
    const sectionHeight = name => Math.max(...cards.slice(0,3).map(card => {
      const section = card.querySelector(`.${name}`);
      return section.querySelector('h3').offsetHeight + section.querySelector('ul').offsetHeight + 16;
    }));
    grid.style.setProperty('--render-section-height',`${sectionHeight('render-features')}px`);
    grid.style.setProperty('--ai-section-height',`${sectionHeight('ai-features')}px`);
    grid.style.setProperty('--personal-desktop-height',`${Math.max(community,basic,pro)}px`);
    grid.style.setProperty('--basic-y',`${community + 24}px`);
    grid.style.setProperty('--pro-y',`${community + basic + 48}px`);
    grid.style.setProperty('--personal-height',`${community + basic + pro + 48}px`);
    grid.style.setProperty('--team-height',`${team + 24}px`);
  });

  renderPlans = function () {
    activeNumbers.forEach(el => finishNumber(el, rollingNumbers.get(el)));
    const p = P();
    const annual = state.billing === 'annual';
    const period = annual ? p.annual : p.monthly;
    const personalCard = id => `<article class="plan-card personal-card ${id}" data-plan="${id}" aria-label="${p[id].name}">
      ${id === 'pro' ? '<div class="card-glow" aria-hidden="true"><canvas data-shader="wave"></canvas></div>' : ''}
      <div class="personal-card-header"><div class="plan-top">
        <div class="plan-title"><div class="plan-name"><h2>${p[id].name}</h2></div></div>
        ${id === 'community' ? `<div class="plan-price"><span class="price-value">￥0</span><span class="price-period">${p.free}</span></div>` : `
        <div class="plan-tier"><span class="tier-name" data-personal-tier="${id}">${tierName(id)}</span><div class="price-tier-control">
          <div class="plan-price"><span class="price-value">￥<span data-price="${id}">${personalPrice(id)}</span></span><span class="price-period" data-period>${period}</span></div>
          <button type="button" class="tier-toggle" data-tier-toggle="${id}" aria-pressed="${state.personalTiers[id] === 1}" aria-label="${tierToggleLabel(id)}">${personalIcon('arrow-up')}</button>
        </div></div>`}
      </div>
      <button type="button" class="plan-button" data-select-plan="${id}">${id === 'community' ? p.download : p.upgrade}</button></div>
      ${featureSections(id)}
    </article>`;
    const zh = state.lang === 'zh';
    $('#plan-grid').innerHTML = ['community','basic','pro'].map(personalCard).join('') + `
      <article class="plan-card team-card" data-plan="team" aria-label="${zh ? '团队版' : 'Teams'}">
        <div class="card-glow" aria-hidden="true"></div>
        <div class="plan-top"><div class="plan-title"><div class="plan-name"><h2>${zh ? '团队版' : 'Teams'}</h2></div></div>
          <div class="plan-price"><span class="price-value">${zh ? '联系我们' : 'Contact us'}</span></div>
        </div>
        <button type="button" class="plan-button" data-contact-sales="team">${zh ? '咨询购买' : 'Contact sales'}</button>
        <ul class="plan-list">${features(teamFeatures[state.lang])}</ul>
      </article>`;
    cardObserver.disconnect();
    $$('#plan-grid .plan-card').forEach(card => cardObserver.observe(card));
    $$('.personal-card .plan-list').forEach(list => cardObserver.observe(list));
    syncAudience();
    document.dispatchEvent(new Event('d5:shaders'));
  };

  function tierToggleLabel(id) {
    const next = personalTiers[1 - state.personalTiers[id]].names[state.lang];
    return state.lang === 'zh' ? `${P()[id].name}：切换到${next}` : `${P()[id].name}: switch to ${next}`;
  }
  syncTier = function () {
    for (const id of ['basic','pro']) {
      animateNumber($(`[data-price="${id}"]`),personalPrice(id));
      $(`[data-personal-tier="${id}"]`).textContent = tierName(id);
      const toggle = $(`[data-tier-toggle="${id}"]`);
      toggle.setAttribute('aria-pressed',String(state.personalTiers[id] === 1));
      toggle.setAttribute('aria-label',tierToggleLabel(id));
    }
    $$('[data-period]').forEach(el => { el.textContent = state.billing === 'annual' ? P().annual : P().monthly; });
  };

  let comparisonExpanded = true;
  renderCompare = function () {
    const team = state.audience === 'team';
    const c = P().compare;
    // The provided Figma comparison has the same Render rows in both states.
    const titles = team ? ['Pro', 'Team', 'Enterprise'] : ['Community', 'Basic', 'Pro'];
    $('#compare').innerHTML = `<table class="compare-table">
      <thead class="compare-head"><tr><th scope="col" class="lead"><span>${c.lead}</span></th>
        ${titles.map(title => `<th scope="col" class="col"><span class="column-title">${title}</span></th>`).join('')}</tr></thead>
      <tbody class="compare-body"><tr><th colspan="4" class="compare-group"><button type="button" data-compare-toggle aria-expanded="${comparisonExpanded}" aria-controls="compare-row-0 compare-row-1"><img src="assets/figma/caret-down.svg" alt="">${c.group}</button></th></tr>
        ${c.rows.map((label, i) => `<tr id="compare-row-${i}" class="compare-row"${comparisonExpanded ? '' : ' hidden'}><th scope="row" class="lead">${label}</th>${titles.map(() => `<td class="col"><img src="assets/figma/check-circle.svg" alt="${state.lang === 'zh' ? '支持' : 'Included'}"></td>`).join('')}</tr>`).join('')}
      </tbody></table>`;
  };

  function persistPreviewState() {
    const url = new URL(location.href);
    for (const key of ['audience','billing','lang']) url.searchParams.set(key,state[key]);
    for (const id of ['basic','pro']) {
      if (state.personalTiers[id]) url.searchParams.set(`${id}Tier`,'advanced');
      else url.searchParams.delete(`${id}Tier`);
    }
    history.replaceState(null,'',url);
  }

  function syncAudience() {
    const team = state.audience === 'team';
    $('#pricing').classList.toggle('is-team',team);
    $('#plan-grid').classList.toggle('is-team',team);
    $('#plan-grid').setAttribute('aria-labelledby',`tab-${state.audience}`);
    $$('[data-audience]').forEach(button => {
      const selected = button.dataset.audience === state.audience;
      button.setAttribute('aria-selected',String(selected));
      button.setAttribute('aria-pressed',String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    $$('#plan-grid [data-plan]').forEach(card => {
      const inactive = (card.dataset.plan === 'team') !== team;
      card.inert = inactive;
      card.setAttribute('aria-hidden',String(inactive));
    });
    $('.billing').inert = team;
    $('.billing').setAttribute('aria-hidden',String(team));
    $('.education').inert = team;
    $('.education').setAttribute('aria-hidden',String(team));
    copy.zh['comparison.subtitle'] = team ? '详细对比个人与团队套餐及功能权益' : '详细对比个人创作套餐及功能权益';
    copy.en['comparison.subtitle'] = team ? 'Compare individual and team plans and features' : 'Compare individual plans and features';
    $('[data-i18n="comparison.subtitle"]').textContent = t('comparison.subtitle');
    $('.header-language').textContent = state.lang === 'zh' ? 'English' : '中文';
    persistPreviewState();
  }

  window.setPricingAudience = audience => {
    if (audience === state.audience) return;
    state.audience = audience;
    // CSS retargets each existing card from its current interpolated position.
    // No timers or DOM replacement means rapid reversals cannot leave stale cards.
    syncAudience();
    renderCompare();
    syncTier();
    syncBillingToggle();
    $('#announcer').textContent = t(`audience.${audience}`);
  };

  $('.segmented').addEventListener('keydown',event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'personal' : event.key === 'End' ? 'team' : state.audience === 'personal' ? 'team' : 'personal';
    window.setPricingAudience(next);
    $(`[data-audience="${next}"]`).focus({preventScroll:true});
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'pricing-dialog';
  dialog.setAttribute('aria-labelledby','pricing-dialog-title');
  document.body.append(dialog);
  window.openPricingDialog = id => {
    const zh = state.lang === 'zh';
    const title = id === 'team' ? (zh ? '团队方案咨询' : 'D5 for Teams') : id === 'education' ? (zh ? 'D5 学生版申请' : 'D5 for Education') : P()[id].name;
    let body;
    if (id === 'team') body = `<p>${zh ? '为团队配置适合的席位、共享空间与协作权限。' : 'Find the right seats, shared storage and collaboration permissions for your team.'}</p><dl><dt>${zh ? '共享云空间' : 'Shared cloud storage'}</dt><dd>100GB</dd><dt>${zh ? '席位与权限' : 'Seats and permissions'}</dt><dd>${zh ? '支持定制' : 'Customizable'}</dd></dl><p>${zh ? '当前为方案预览，咨询入口尚未接入。' : 'This preview is not connected to the sales consultation service yet.'}</p>`;
    else if (id === 'education') body = `<p>${zh ? '专为高校在校生推出的特别权益方案，助力教与学。申请入口将在正式上线后开放。' : 'Special benefits for students and educators. Applications will open with the official release.'}</p>`;
    else body = `${id === 'community' ? '' : `<p class="dialog-tier">${tierName(id)}</p>`}<div class="dialog-price">￥${id === 'community' ? '0' : personalPrice(id)} <span class="price-period">${id === 'community' ? P().free : state.billing === 'annual' ? P().annual : P().monthly}</span></div><p>${zh ? '已选好你的创作方案。当前为交互预览，购买与账号服务尚未接入，不会创建订单。' : 'Your plan is selected. Checkout and account services are not connected in this preview; no order is created.'}</p>`;
    dialog.innerHTML = `<button type="button" class="dialog-close" data-close-dialog aria-label="${zh ? '关闭' : 'Close'}">${zh ? '关闭' : 'Close'}</button><h2 id="pricing-dialog-title">${title}</h2>${body}<button class="plan-button" type="button" data-close-dialog>${zh ? '继续了解方案' : 'Keep exploring'}</button>`;
    dialog.showModal();
  };
  dialog.addEventListener('click',event => { if (event.target === dialog || event.target.closest('[data-close-dialog]')) dialog.close(); });
  document.addEventListener('click',event => {
    const target = event.target.closest('button,a');
    if (!target) return;
    if (target.hasAttribute('data-tier-toggle')) {
      const id = target.dataset.tierToggle;
      state.personalTiers[id] = 1 - state.personalTiers[id];
      syncTier();
      $(`[data-ai-features="${id}"]`).innerHTML = aiFeatures(id);
      persistPreviewState();
      $('#announcer').textContent = `${P()[id].name} · ${tierName(id)} · ￥${personalPrice(id)}${state.billing === 'annual' ? P().annual : P().monthly}`;
    }
    if (target.hasAttribute('data-select-plan')) window.openPricingDialog(target.dataset.selectPlan);
    if (target.hasAttribute('data-contact-sales')) window.openPricingDialog('team');
    if (target.closest('.education')) { event.preventDefault(); window.openPricingDialog('education'); }
    if (target.hasAttribute('data-language-toggle')) {
      // Reuse the existing language events for all page copy.
      $(`.footer-legal [data-lang="${state.lang === 'zh' ? 'en' : 'zh'}"]`).click();
    }
    if (target.hasAttribute('data-compare-toggle')) {
      comparisonExpanded = !comparisonExpanded;
      target.setAttribute('aria-expanded',String(comparisonExpanded));
      $$('.compare-row').forEach(row => { row.hidden = !comparisonExpanded; });
    }
    if (target.hasAttribute('data-billing-toggle') || target.hasAttribute('data-lang')) persistPreviewState();
  });
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape' && document.activeElement?.matches('.feature-info-button')) document.activeElement.blur();
  });
  renderAll();
})();
