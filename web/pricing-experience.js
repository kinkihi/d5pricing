// Figma card content and reversible, interruption-safe audience transitions.
// Personal: Figma 31951:32326. Teams: 32080:13484 within 32080:12530.
// CNY prices: jjcyixi/d5pricing-beta/data.js. USD prices: 海外版本.html,
// PERSONAL_TIERS (20261023-usd-r2); only prices are taken from that attachment.
(() => {
  const params = new URLSearchParams(location.search);
  state.audience = params.get('audience') === 'team' ? 'team' : 'personal';
  state.billing = params.get('billing') === 'annual' ? 'annual' : 'monthly';
  state.lang = params.get('lang') === 'en' ? 'en' : 'zh';
  state.personalTiers = Object.fromEntries(['basic','pro'].map(id => [id, params.get(`${id}Tier`) === 'advanced' ? 1 : 0]));
  const personalTiers = [
    { names: {zh:'入门档',en:'Starter'}, credits:1500, baseCredits:1000, concurrency:4, image:'2K', video:'720p' },
    { names: {zh:'进阶档',en:'Advanced'}, credits:4500, baseCredits:3000, concurrency:6, image:'4K', video:'4K' },
  ];
  const personalPrices = {
    zh: [
      {basic:49, pro:200, basicAnnual:468, proAnnual:1920},
      {basic:129, pro:279, basicAnnual:1188, proAnnual:2628},
    ],
    en: [
      {basic:7, pro:38, basicAnnual:72, proAnnual:360},
      {basic:25, pro:55, basicAnnual:240, proAnnual:504},
    ],
  };
  const selectedTier = id => personalTiers[state.personalTiers[id]];
  const selectedPrices = id => personalPrices[state.lang][state.personalTiers[id]];
  const currencySymbol = () => state.lang === 'zh' ? '￥' : '$';
  const money = amount => `${currencySymbol()}${amount}`;
  const personalPrice = id => state.billing === 'annual' ? selectedPrices(id)[`${id}Annual`] / 12 : selectedPrices(id)[id];
  const pricePeriod = () => state.billing === 'annual' ? (state.lang === 'zh' ? '/月，按年购买' : '/mo, billed yearly') : P().monthly;
  function annualSavings(id) {
    const prices = selectedPrices(id), saved = prices[id] * 12 - prices[`${id}Annual`];
    return `<span class="saving-badge">${state.lang === 'zh' ? `每年省${money(saved)}` : `Save ${money(saved)}/year`}</span><span class="original-price">${state.lang === 'zh' ? '原月订阅价 ' : 'Monthly price '}<s>${state.lang === 'zh' ? '¥' : '$'}${prices[id]}</s>${state.lang === 'zh' ? '/月' : '/mo'}</span>`;
  }
  const tierName = id => selectedTier(id).names[state.lang];

  Object.assign(copy.zh, {
    'education.title': 'D5 学生版',
    'education.subtitle': '专为高校在校生推出的特别权益方案，助力教与学',
    'education.button': '自主申请',
    'comparison.title': '功能权益对比',
    'comparison.subtitle': '详细对比个人创作套餐及功能权益',
    'billing.discount': '更多优惠',
  });
  Object.assign(copy.en, {
    'education.title': 'D5 Student Plan',
    'education.subtitle': 'Special benefits for university and college students to support teaching and learning',
    'education.button': 'Apply now',
    'comparison.title': 'Compare features and benefits',
    'comparison.subtitle': 'Compare individual plans and their features and benefits in detail',
    'billing.discount': 'More savings',
  });
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
      shared: ['Free syncing via modeling plugins','3,000+ free assets','Free real-time interactive presentations','Free real-time 16K image rendering','Free real-time 4K video rendering','Free panorama tour creation and sharing'],
      community: 'More free D5 workflow features available', basic: 'Includes Community D5 workflow features',
      pro: ['16,000+ premium assets across all categories','Advanced scene building, including city generation','Professional image rendering in TGA, TIF and EXR formats','Professional video rendering at multiple frame rates and formats','Create and share real-time spatial tours and XR tours','Real-time cloud pixel streaming and virtual reality (VR) sharing','Full access to D5 workflow features'],
    },
  };
  const personalIcon = name => `<img src="assets/figma/personal-${name}.svg" alt="" width="16" height="16">`;
  const info = (id, key, text) => `<span class="feature-info"><button type="button" class="feature-info-button" aria-label="${state.lang === 'zh' ? '权益说明' : 'Benefit details'}" aria-describedby="${id}-${key}-tip">${personalIcon('question')}</button><span class="feature-tooltip" role="tooltip" popover="manual" id="${id}-${key}-tip">${text}</span></span>`;
  const tooltipCopy = (title, detail) => `<span class="tooltip-title">${title}</span><span class="tooltip-detail">${detail}</span>`;
  function creditTip(credits) {
    return state.lang === 'zh'
      ? tooltipCopy(`约 ${credits / 2} 张图片或 ${credits / 12} 秒视频`, '按最低价估算：图像 2 积分/张，视频<br>（Seedance 2.0 Mini）12 积分/秒')
      : tooltipCopy(`About ${credits / 2} images or ${credits / 12} seconds of video`, 'Estimated at the lowest rates: 2 credits/image;<br>video (Seedance 2.0 Mini), 12 credits/second.');
  }
  const personalFeature = (text, {unavailable = false, help = ''} = {}) => `<li${unavailable ? ' class="unavailable"' : ''}><span class="feature-check" aria-hidden="true">${personalIcon(unavailable ? 'close' : 'check')}</span><span class="feature-copy">${text}${help}</span></li>`;
  function aiFeatures(id) {
    const zh = state.lang === 'zh';
    if (id === 'community') return [
      personalFeature(zh ? '免费 300 AI 积分领取' : 'Claim 300 free AI credits', {help:info(id,'credits',creditTip(300))}),
      personalFeature(zh ? '支持体验部分 AI 模型' : 'Try selected AI models'),
      personalFeature(zh ? '支持最高 1K 图片，480p 视频生成' : 'Generate images up to 1K and video up to 480p'),
      personalFeature(zh ? '支持最多 2 个 AI 任务并发' : 'Run up to 2 concurrent AI tasks'),
      personalFeature(zh ? '不支持积分充值' : 'Credit top-ups unavailable', {unavailable:true}),
    ].join('');
    const tier = selectedTier(id);
    const help = creditTip(tier.credits);
    return [
      personalFeature(zh ? `每月 ${tier.credits} AI 积分` : `${tier.credits.toLocaleString('en-US')} AI credits per month`, {help:info(id,'credits',help)}),
      ...(id === 'pro' ? [personalFeature(zh ? '工作流内指定 AI 功能不限次使用' : 'Unlimited use of selected workflow AI features', {help:info(id,'workflow',tooltipCopy(zh ? 'D5 Render 3.1 版本' : 'D5 Render 3.1', zh ? 'AI 氛围匹配、AI 后期、局部重绘等不限次使用' : 'Unlimited AI Atmosphere Match, AI post-processing, inpainting and more.'))})] : []),
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
    zh: [
      {id:'collaboration',title:'协作与管理',icon:'team-users',items:['支持团队基础 / 专业席位自由组合','支持自定义AI功能权限','支持团队成员及分组管理','支持团队数据看板','支持团队云资产管理']},
      {id:'render',title:'专业表现席位',icon:'personal-render',items:['包含个人专业版功能权益','支持D5工作流项目多人编辑']},
      {id:'ai',title:'AI 创作席位',icon:'team-ai',items:['包含个人基础版功能权益','团队共享 AI 积分']},
    ],
    en: [
      {id:'collaboration',title:'Collaboration & management',icon:'team-users',items:['Mix Basic and Pro seats freely','Custom AI feature permissions','Team member and group management','Team analytics dashboard','Team cloud asset management']},
      {id:'render',title:'Professional visualization seats',icon:'personal-render',items:['Includes individual Pro plan benefits','Collaborative editing of D5 workflow projects']},
      {id:'ai',title:'AI creation seats',icon:'team-ai',items:['Includes individual Basic plan benefits','Shared team AI credits']},
    ],
  };
  function teamFeatureSections() {
    const seatHelp = state.lang === 'zh' ? '可按成员的创作需求自由组合基础席位与专业席位；各席位权益见下方说明。' : 'Mix Basic and Pro seats to match each member’s creative needs. Seat benefits are listed below.';
    return teamFeatures[state.lang].map(group => `<section class="plan-feature-section team-feature-section" aria-labelledby="team-${group.id}-title"><h3 id="team-${group.id}-title"><span class="feature-check" aria-hidden="true"><img src="assets/figma/${group.icon}.svg" alt="" width="16" height="16"></span>${group.title}</h3><ul class="plan-list">${group.items.map((item,index) => personalFeature(item, {help:group.id === 'collaboration' && index === 0 ? info('team','seats',seatHelp) : ''})).join('')}</ul></section>`).join('');
  }

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
    const headers = cards.slice(0,3).map(card => card.querySelector('.personal-card-header').offsetHeight);
    grid.style.setProperty('--annual-header-extra',`${Math.max(0,Math.max(headers[1],headers[2]) - headers[0])}px`);
    grid.style.setProperty('--personal-desktop-height',`${Math.max(community,basic,pro)}px`);
    grid.style.setProperty('--basic-y',`${community + 24}px`);
    grid.style.setProperty('--pro-y',`${community + basic + 48}px`);
    grid.style.setProperty('--personal-height',`${community + basic + pro + 48}px`);
    grid.style.setProperty('--team-height',`${team + 24}px`);
    grid.style.setProperty('--team-desktop-height',`${team + 32}px`);
  });

  renderPlans = function () {
    hideTooltip();
    activeNumbers.forEach(el => finishNumber(el, rollingNumbers.get(el)));
    const p = P();
    const annual = state.billing === 'annual';
    const period = pricePeriod();
    $('#plan-grid').classList.toggle('is-annual',annual);
    const personalCard = id => `<article class="plan-card personal-card ${id}" data-plan="${id}" aria-label="${p[id].name}">
      ${id === 'pro' ? '<div class="card-glow" aria-hidden="true"><div class="pro-wave"><canvas data-shader="wave"></canvas></div></div>' : ''}
      <div class="personal-card-header"><div class="plan-top">
        <div class="plan-title"><div class="plan-name"><h2>${p[id].name}</h2></div></div>
        ${id === 'community' ? `<div class="plan-price"><span class="price-value">${money(0)}</span><span class="price-period">${p.free}</span></div>` : `
        <div class="plan-tier"><span class="tier-name" data-personal-tier="${id}">${tierName(id)}</span><div class="price-tier-control">
          <div class="plan-price"><span class="price-value">${currencySymbol()}<span data-price="${id}">${personalPrice(id)}</span></span><span class="price-period" data-period>${period}</span></div>
          <button type="button" class="tier-toggle" data-tier-toggle="${id}" aria-pressed="${state.personalTiers[id] === 1}" aria-label="${tierToggleLabel(id)}" aria-describedby="${id}-tier-tip"><span class="tier-arrow-window" aria-hidden="true"><span class="tier-arrow-track">${personalIcon('arrow-up')}${personalIcon('arrow-up')}</span></span></button>
          <span class="feature-tooltip tier-tooltip" role="tooltip" popover="manual" id="${id}-tier-tip">${tierTooltipLabel(id)}</span>
        </div><div class="plan-savings" data-savings="${id}"${annual ? '' : ' hidden'}>${annualSavings(id)}</div></div>`}
      </div>
      <button type="button" class="plan-button" data-select-plan="${id}">${id === 'community' ? p.download : p.upgrade}</button></div>
      ${featureSections(id)}
    </article>`;
    const zh = state.lang === 'zh';
    $('#plan-grid').innerHTML = ['community','basic','pro'].map(personalCard).join('') + `
      <article class="plan-card team-card" data-plan="team" aria-label="${zh ? '团队版' : 'Teams'}">
        <div class="card-glow" aria-hidden="true"></div>
        <div class="team-card-header"><div class="plan-top"><div class="plan-title"><div class="plan-name"><h2>${zh ? '团队版' : 'Teams'}</h2></div></div>
          <div class="plan-price"><span class="price-value">${zh ? '联系我们' : 'Contact us'}</span></div>
        </div>
        <button type="button" class="plan-button" data-contact-sales="team">${zh ? '咨询购买' : 'Contact sales'}</button></div>
        ${teamFeatureSections()}
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
  function tierTooltipLabel(id) {
    return state.lang === 'zh' ? (state.personalTiers[id] ? '较低档位' : '更高档位') : (state.personalTiers[id] ? 'Lower tier' : 'Higher tier');
  }
  syncTier = function () {
    $('#plan-grid').classList.toggle('is-annual',state.billing === 'annual');
    for (const id of ['basic','pro']) {
      animateNumber($(`[data-price="${id}"]`),personalPrice(id));
      $(`[data-personal-tier="${id}"]`).textContent = tierName(id);
      const toggle = $(`[data-tier-toggle="${id}"]`);
      toggle.setAttribute('aria-pressed',String(state.personalTiers[id] === 1));
      toggle.setAttribute('aria-label',tierToggleLabel(id));
      $(`#${id}-tier-tip`).textContent = tierTooltipLabel(id);
      const savings = $(`[data-savings="${id}"]`);
      savings.innerHTML = annualSavings(id);
      savings.hidden = state.billing !== 'annual';
    }
    $$('[data-period]').forEach(el => { el.textContent = pricePeriod(); });
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
    copy.en['comparison.subtitle'] = team ? 'Compare individual and team plans, features and benefits in detail' : 'Compare individual plans and their features and benefits in detail';
    $('[data-i18n="comparison.subtitle"]').textContent = t('comparison.subtitle');
    $('.header-language').textContent = state.lang === 'zh' ? 'English' : '中文';
    persistPreviewState();
  }

  window.setPricingAudience = audience => {
    if (audience === state.audience) return;
    hideTooltip();
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
    const title = id === 'team' ? (zh ? '团队方案咨询' : 'Team plan consultation') : id === 'education' ? (zh ? 'D5 学生版申请' : 'D5 Student Plan application') : P()[id].name;
    let body;
    if (id === 'team') body = `<p>${zh ? '按团队需求自由组合基础席位与专业席位，协作管理并共享 AI 积分。' : 'Mix Basic and Pro seats for your team, manage collaboration and share AI credits.'}</p><dl><dt>${teamFeatures[state.lang][1].title}</dt><dd>${teamFeatures[state.lang][1].items[0]}</dd><dt>${teamFeatures[state.lang][2].title}</dt><dd>${teamFeatures[state.lang][2].items[0]}</dd><dt>${zh ? 'AI 积分' : 'AI credits'}</dt><dd>${zh ? '团队共享' : 'Shared across the team'}</dd></dl><p>${zh ? '当前为方案预览，咨询入口尚未接入。' : 'This preview is not connected to the sales consultation service yet.'}</p>`;
    else if (id === 'education') body = `<p>${zh ? '专为高校在校生推出的特别权益方案，助力教与学。申请入口将在正式上线后开放。' : 'Special benefits for university and college students to support teaching and learning. Applications will open with the official release.'}</p>`;
    else body = `${id === 'community' ? '' : `<p class="dialog-tier">${tierName(id)}</p>`}<div class="dialog-price">${money(id === 'community' ? 0 : personalPrice(id))} <span class="price-period">${id === 'community' ? P().free : pricePeriod()}</span></div>${id !== 'community' && state.billing === 'annual' ? `<div class="plan-savings">${annualSavings(id)}</div><p class="annual-total">${zh ? `按年支付 ${money(selectedPrices(id)[`${id}Annual`])}/年` : `Billed yearly: ${money(selectedPrices(id)[`${id}Annual`])}/year`}</p>` : ''}<p>${zh ? '已选好你的创作方案。当前为交互预览，购买与账号服务尚未接入，不会创建订单。' : 'Your plan is selected. Checkout and account services are not connected in this preview; no order is created.'}</p>`;
    dialog.innerHTML = `<button type="button" class="dialog-close" data-close-dialog aria-label="${zh ? '关闭' : 'Close'}">${zh ? '关闭' : 'Close'}</button><h2 id="pricing-dialog-title">${title}</h2>${body}<button class="plan-button" type="button" data-close-dialog>${zh ? '继续了解方案' : 'Keep exploring'}</button>`;
    dialog.showModal();
  };
  dialog.addEventListener('click',event => { if (event.target === dialog || event.target.closest('[data-close-dialog]')) dialog.close(); });
  document.addEventListener('click',event => {
    const target = event.target.closest('button,a');
    if (!target) return;
    if (target.hasAttribute('data-tier-toggle')) {
      hideTooltip();
      const id = target.dataset.tierToggle;
      state.personalTiers[id] = 1 - state.personalTiers[id];
      syncTier();
      $(`[data-ai-features="${id}"]`).innerHTML = aiFeatures(id);
      persistPreviewState();
      $('#announcer').textContent = `${P()[id].name} · ${tierName(id)} · ${money(personalPrice(id))}${pricePeriod()}`;
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
    if (target.hasAttribute('data-billing-toggle')) {
      $('#announcer').textContent = ['basic','pro'].map(id => `${P()[id].name} · ${tierName(id)} · ${money(personalPrice(id))}${pricePeriod()}`).join('; ');
    }
    if (target.hasAttribute('data-billing-toggle') || target.hasAttribute('data-lang')) persistPreviewState();
  });
  // Top-layer tooltips stay above animated cards and fit within the viewport.
  const tooltipTrigger = '.feature-info-button,.tier-toggle';
  let activeTooltip = null, pendingTooltip = null, tooltipTimer, tooltipDelay, tooltipExpiry;
  function hideTooltip() {
    clearTimeout(tooltipTimer);
    clearTimeout(tooltipDelay);
    clearTimeout(tooltipExpiry);
    pendingTooltip = null;
    if (activeTooltip?.tip.isConnected) activeTooltip.tip.hidePopover();
    activeTooltip = null;
  }
  function positionTooltip() {
    if (!activeTooltip) return;
    const {button,tip} = activeTooltip;
    const teamCard = button.closest('.team-card')?.getBoundingClientRect();
    if (teamCard) tip.style.maxWidth = `${Math.min(256,teamCard.width - 32,innerWidth - 32)}px`;
    const anchor = button.getBoundingClientRect(), box = tip.getBoundingClientRect();
    const tier = button.matches('.tier-toggle');
    const preferredLeft = teamCard || tier ? anchor.left + (anchor.width - box.width) / 2 : anchor.left;
    const minLeft = Math.max(16,teamCard ? teamCard.left + 16 : 16);
    const maxLeft = Math.min(innerWidth - box.width - 16,teamCard ? teamCard.right - box.width - 16 : innerWidth);
    const left = Math.max(minLeft,Math.min(preferredLeft,maxLeft));
    const above = anchor.top - box.height - 8, below = anchor.bottom + 8;
    const top = (tier && above >= 16) || below + box.height > innerHeight - 16 ? above : below;
    tip.style.left = `${left}px`;
    tip.style.top = `${Math.max(16,Math.min(top,innerHeight - box.height - 16))}px`;
  }
  function showTooltip(button) {
    clearTimeout(tooltipTimer);
    if (activeTooltip?.button === button || pendingTooltip === button) return;
    hideTooltip();
    const open = () => {
      pendingTooltip = null;
      if (!button.isConnected || button.closest('[inert]')) return;
      const tip = document.getElementById(button.getAttribute('aria-describedby'));
      activeTooltip = {button,tip};
      tip.showPopover();
      positionTooltip();
      if (button.matches('.tier-toggle')) tooltipExpiry = setTimeout(hideTooltip,2500);
    };
    if (button.matches('.tier-toggle')) {
      pendingTooltip = button;
      tooltipDelay = setTimeout(open,500);
    } else {
      open();
    }
  }
  document.addEventListener('pointerover',event => {
    if (event.pointerType === 'touch') return;
    const button = event.target.closest(tooltipTrigger);
    if (button) {
      if (!button.contains(event.relatedTarget)) showTooltip(button);
    }
    else if (event.target.closest('.feature-tooltip')) clearTimeout(tooltipTimer);
  });
  document.addEventListener('pointerout',event => {
    const trigger = event.target.closest(`${tooltipTrigger},.feature-tooltip`);
    if (!trigger || trigger.contains(event.relatedTarget)) return;
    if (pendingTooltip === trigger && trigger !== document.activeElement) {
      clearTimeout(tooltipDelay);
      pendingTooltip = null;
    }
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => {
      if (activeTooltip?.button !== document.activeElement) hideTooltip();
    },120);
  });
  document.addEventListener('focusin',event => {
    if (event.target.matches(tooltipTrigger)) showTooltip(event.target);
    else hideTooltip();
  });
  document.addEventListener('focusout',event => {
    if (event.target.matches(tooltipTrigger)) hideTooltip();
  });
  document.addEventListener('click',event => {
    const button = event.target.closest('.feature-info-button');
    if (button) showTooltip(button);
    else if (!event.target.closest('.feature-tooltip')) hideTooltip();
  });
  document.addEventListener('keydown',event => { if (event.key === 'Escape') hideTooltip(); });
  window.addEventListener('resize',positionTooltip);
  window.addEventListener('scroll',positionTooltip,true);
  document.addEventListener('transitionend',event => {
    if (activeTooltip && event.target === activeTooltip.button.closest('.plan-card')) positionTooltip();
  });
  renderAll();
})();
