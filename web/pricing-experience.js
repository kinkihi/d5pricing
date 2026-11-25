// Figma card content and reversible, interruption-safe audience transitions.
// Personal: Figma 32143:12642. Teams: 32143:13817.
// CNY prices: jjcyixi/d5pricing-beta/data.js. USD prices: 海外版本.html,
// PERSONAL_TIERS (20261023-usd-r2); only prices are taken from that attachment.
(() => {
  const params = new URLSearchParams(location.search);
  state.audience = params.get('audience') === 'team' ? 'team' : 'personal';
  state.billing = params.get('billing') === 'annual' ? 'annual' : 'monthly';
  state.lang = params.get('lang') === 'en' ? 'en' : 'zh';
  state.personalTiers = Object.fromEntries(['basic','pro'].map(id => [id, params.get(`${id}Tier`) === 'advanced' ? 1 : 0]));
  const personalTiers = [
    { names: {zh:'1×',en:'1×'}, credits:1500, concurrency:4, image:'2K', video:'720p' },
    { names: {zh:'3×',en:'3×'}, credits:4500, concurrency:4, image:'2K', video:'720p' },
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
  const pricePeriod = () => state.lang === 'zh' ? '/月' : '/mo';
  const purchaseLabel = () => state.billing === 'annual'
    ? (state.lang === 'zh' ? '按年购买' : 'Buy yearly')
    : (state.lang === 'zh' ? '按月购买' : 'Buy monthly');
  function annualSavings(id) {
    const prices = selectedPrices(id), saved = prices[id] * 12 - prices[`${id}Annual`];
    const yuan = state.lang === 'zh' ? '￥' : '$';
    const mark = state.lang === 'zh' ? '¥' : '$';
    return state.lang === 'zh'
      ? `<span class="saving-badge">按年节省${yuan}${saved}</span><span class="original-price">原价 <s>${mark}${prices[id]}</s>/月，一次性支付${yuan}${prices[`${id}Annual`]}</span>`
      : `<span class="saving-badge">Save ${yuan}${saved}/year</span><span class="original-price">Was <s>${mark}${prices[id]}</s>/mo, pay ${yuan}${prices[`${id}Annual`]} once</span>`;
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
    'education.subtitle': 'Special benefits for college students',
    'education.button': 'Apply now',
    'comparison.title': 'Compare features',
    'comparison.subtitle': 'Individual plans, side by side',
    'billing.discount': 'More savings',
  });
  plans.zh.download = '开始体验';
  plans.en.download = 'Get started';
  plans.zh.free = '/免费开始';
  plans.en.free = '/free to start';
  plans.zh.upgrade = '按年购买';
  plans.en.upgrade = 'Buy yearly';
  const renderFeatures = {
    zh: {
      community: ['工作流同步插件','2100+ 免费素材','免费实时渲染 16K 图片','免费实时渲染 4K 视频','免费全景漫游创建及分享'],
      basic: ['包含全部社区版权益','10GB 云空间'],
      pro: ['包含全部基础版权益','10GB 云空间','16,000+ 专业素材','专业级图片与视频多格式渲染','城市生成等高级场景构建功能','空间漫游、XR 漫游、交互演示与 VR体验'],
    },
    en: {
      community: ['Workflow sync plugin','2,100+ free assets','Free real-time 16K images','Free real-time 4K video','Free panorama tours and sharing'],
      basic: ['All Community benefits','10GB cloud storage'],
      pro: ['All Basic benefits','10GB cloud storage','16,000+ professional assets','Pro image and video formats','Advanced scene tools, including city generation','Spatial tours, XR tours, interactive demos, and VR'],
    },
  };
  const personalIcon = name => `<img src="assets/figma/personal-${name}.svg" alt="" width="16" height="16">`;
  const info = (id, key, text) => `<span class="feature-info"><button type="button" class="feature-info-button" aria-label="${state.lang === 'zh' ? '权益说明' : 'Benefit details'}" aria-describedby="${id}-${key}-tip">${personalIcon('question')}</button><span class="feature-tooltip" role="tooltip" popover="manual" id="${id}-${key}-tip">${text}</span></span>`;
  const tooltipCopy = (title, detail) => `<span class="tooltip-title">${title}</span><span class="tooltip-detail">${detail}</span>`;
  function creditTip(credits) {
    return state.lang === 'zh'
      ? tooltipCopy(`约 ${credits / 2} 张图片或 ${credits / 12} 秒视频`, '按最低价估算：图像 2 积分/张，视频<br>（Seedance 2.0 Mini）12 积分/秒')
      : tooltipCopy(`About ${credits / 2} images or ${credits / 12}s of video`, 'Est. at minimum rates: 2 credits/image;<br>Seedance 2.0 Mini video: 12 credits/sec.');
  }
  const personalFeature = (text, {unavailable = false, help = '', bonus = ''} = {}) => `<li class="${[unavailable ? 'unavailable' : '', bonus ? 'has-badge' : ''].filter(Boolean).join(' ')}"><span class="feature-main"><span class="feature-check" aria-hidden="true">${personalIcon(unavailable ? 'close' : 'check')}</span><span class="feature-copy">${text}${help}</span></span>${bonus ? `<span class="bonus-badge">${bonus}</span>` : ''}</li>`;
  function aiFeatures(id) {
    const zh = state.lang === 'zh';
    if (id === 'community') return [
      personalFeature(zh ? '一次性 300 积分' : '300 one-time credits', {help:info(id,'credits',creditTip(300))}),
      personalFeature(zh ? '体验部分 AI 模型' : 'Try selected AI models'),
      personalFeature(zh ? 'AI 生成最高 1K 图片，480p 视频' : 'AI up to 1K images and 480p video'),
      personalFeature(zh ? '最多 2 个 AI 任务并发' : 'Up to 2 concurrent AI tasks'),
      personalFeature(zh ? '不支持积分充值' : 'Credit top-ups unavailable', {unavailable:true}),
    ].join('');
    const tier = selectedTier(id);
    const resolution = id === 'pro' ? {image:'4K',video:'4K'} : {image:'2K',video:'720p'};
    const bonus = zh ? '限时加赠' : 'Limited bonus';
    return [
      personalFeature(zh ? `每月 ${tier.credits} AI 积分` : `${tier.credits.toLocaleString('en-US')} AI credits / month`, {help:info(id,'credits',creditTip(tier.credits)), bonus}),
      personalFeature(zh ? '支持全部 AI 模型' : 'All AI models'),
      personalFeature(zh ? `AI 生成最高 ${resolution.image} 图片，${resolution.video} 视频` : `AI up to ${resolution.image} images and ${resolution.video} video`),
      personalFeature(zh ? (id === 'basic' ? `最多 ${tier.concurrency} 个 AI 任务并行` : `支持最多 ${tier.concurrency} 个 AI 任务并发`) : `Up to ${tier.concurrency} concurrent AI tasks`),
      ...(id === 'pro' ? [personalFeature(zh ? 'D5 渲染器内指定 AI 功能不限次使用' : 'Selected AI features in D5 Render, unlimited', {help:info(id,'workflow',tooltipCopy(zh ? 'D5 Render 3.1 版本' : 'D5 Render 3.1', zh ? 'AI 氛围匹配、AI 后期、局部重绘等不限次使用' : 'Unlimited AI Atmosphere Match, AI post-processing, inpainting, and more.'))})] : []),
    ].join('');
  }
  function featureSections(id) {
    const items = renderFeatures[state.lang][id];
    const zh = state.lang === 'zh';
    const badge = id === 'community' ? '' : `<span class="multiplier-badge" data-multiplier-badge="${id}">${selectedTier(id).names[state.lang]}</span>`;
    return `<section class="plan-feature-section ai-features" aria-labelledby="${id}-ai-title"><h3 id="${id}-ai-title"><span class="feature-check" aria-hidden="true">${personalIcon('ai')}</span>${zh ? 'AI 创作' : 'AI creation'}${badge}</h3><ul class="plan-list" data-ai-features="${id}">${aiFeatures(id)}</ul></section><section class="plan-feature-section workflow-features" aria-labelledby="${id}-workflow-title"><h3 id="${id}-workflow-title"><span class="feature-check" aria-hidden="true">${personalIcon('render')}</span>${zh ? '可视化工作流' : 'Visual workflow'}</h3><ul class="plan-list">${items.map(item => personalFeature(item)).join('')}</ul></section>`;
  }
  const teamSeats = {
    zh: [
      {id:'basic',title:'基础席位',icon:'team-ai',lines:['专注 AI 创作','包含个人基础版功能']},
      {id:'pro',title:'专业席位',icon:'personal-render',lines:['完整可视化工作流','包含个人专业版功能']},
    ],
    en: [
      {id:'basic',title:'Basic seats',icon:'team-ai',lines:['Focused on AI creation','Includes individual Basic']},
      {id:'pro',title:'Pro seats',icon:'personal-render',lines:['Full visual workflow','Includes individual Pro']},
    ],
  };
  const teamCollab = {
    zh: ['100 GB 团队云空间','团队共享 AI 积分池','支持团队AI 积分额度分配管理','支持团队成员及分组管理','支持团队数据看板','支持项目多人协作','支持团队云资产管理'],
    en: ['100 GB team cloud storage','Shared team AI credit pool','Allocate team AI credit quotas','Member and group management','Team analytics dashboard','Multi-user project collaboration','Team cloud asset management'],
  };
  function teamFeatureSections() {
    const zh = state.lang === 'zh';
    const seatHelp = zh ? '可按成员的创作需求自由组合基础席位与专业席位；各席位权益见下方说明。' : 'Mix Basic and Pro seats for each member. Seat benefits are listed below.';
    const seats = teamSeats[state.lang].map(seat => `<section class="seat-card" aria-labelledby="team-seat-${seat.id}"><h3 id="team-seat-${seat.id}"><span class="feature-check" aria-hidden="true"><img src="assets/figma/${seat.icon}.svg" alt="" width="16" height="16"></span>${seat.title}</h3><div class="seat-lines">${seat.lines.map(line => `<p>${line}</p>`).join('')}</div></section>`).join('');
    return `<div class="team-mix"><span class="feature-check" aria-hidden="true"><img src="assets/figma/team-agreement.svg" alt="" width="14.3333" height="10.6667"></span><span>${zh ? '团队分工 自由组合' : 'Mix roles freely'}</span>${info('team','seats',seatHelp)}</div><div class="team-seats">${seats}</div><section class="plan-feature-section team-feature-section" aria-labelledby="team-collab-title"><h3 id="team-collab-title"><span class="feature-check" aria-hidden="true"><img src="assets/figma/team-users.svg" alt="" width="16" height="16"></span>${zh ? '协作与管理' : 'Collaboration & management'}</h3><ul class="plan-list">${teamCollab[state.lang].map(item => personalFeature(item)).join('')}</ul></section>`;
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
    grid.style.setProperty('--workflow-section-height',`${sectionHeight('workflow-features')}px`);
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
        <div class="plan-tier"><div class="price-tier-control">
          <div class="plan-price"><span class="price-value">${currencySymbol()}<span data-price="${id}">${personalPrice(id)}</span></span><span class="price-period" data-period>${period}</span></div>
          <div class="multiplier${state.personalTiers[id] === 1 ? ' is-triple' : ''}" role="group" aria-label="${state.lang === 'zh' ? `${p[id].name}积分倍数` : `${p[id].name} credit multiplier`}">
            ${[0,1].map(index => `<button type="button" class="multiplier-option" data-tier-set="${id}" data-tier-index="${index}" aria-pressed="${state.personalTiers[id] === index}">${personalTiers[index].names[state.lang]}</button>`).join('')}
          </div>
        </div><div class="plan-savings" data-savings="${id}"${annual ? '' : ' hidden'}>${annualSavings(id)}</div></div>`}
      </div>
      <button type="button" class="plan-button" data-select-plan="${id}" data-purchase="${id}">${id === 'community' ? p.download : purchaseLabel()}</button></div>
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

  syncTier = function () {
    $('#plan-grid').classList.toggle('is-annual',state.billing === 'annual');
    for (const id of ['basic','pro']) {
      animateNumber($(`[data-price="${id}"]`),personalPrice(id));
      const track = $(`.plan-card.${id} .multiplier`);
      track.classList.toggle('is-triple',state.personalTiers[id] === 1);
      $$(`[data-tier-set="${id}"]`).forEach(button => {
        const selected = Number(button.dataset.tierIndex) === state.personalTiers[id];
        button.setAttribute('aria-pressed',String(selected));
      });
      const badge = $(`[data-multiplier-badge="${id}"]`);
      if (badge) badge.textContent = tierName(id);
      const features = $(`[data-ai-features="${id}"]`);
      if (features) features.innerHTML = aiFeatures(id);
      const savings = $(`[data-savings="${id}"]`);
      savings.innerHTML = annualSavings(id);
      savings.hidden = state.billing !== 'annual';
    }
    $$('[data-period]').forEach(el => { el.textContent = pricePeriod(); });
    $$('[data-purchase]').forEach(el => {
      if (el.dataset.purchase !== 'community') el.textContent = purchaseLabel();
    });
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
    copy.en['comparison.subtitle'] = team ? 'Individual & team plans, side by side' : 'Individual plans, side by side';
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
    if (id === 'team') body = `<p>${zh ? '按团队需求自由组合基础席位与专业席位，协作管理并共享 AI 积分。' : 'Mix Basic and Pro seats for your team, manage collaboration, and share AI credits.'}</p><dl>${teamSeats[state.lang].map(seat => `<dt>${seat.title}</dt><dd>${seat.lines[0]}</dd>`).join('')}<dt>${zh ? 'AI 积分' : 'AI credits'}</dt><dd>${zh ? '团队共享' : 'Shared across the team'}</dd></dl><p>${zh ? '当前为方案预览，咨询入口尚未接入。' : 'This preview is not connected to the sales consultation service yet.'}</p>`;
    else if (id === 'education') body = `<p>${zh ? '专为高校在校生推出的特别权益方案，助力教与学。申请入口将在正式上线后开放。' : 'Special benefits for university and college students to support teaching and learning. Applications will open with the official release.'}</p>`;
    else body = `${id === 'community' ? '' : `<p class="dialog-tier">${tierName(id)}</p>`}<div class="dialog-price">${money(id === 'community' ? 0 : personalPrice(id))} <span class="price-period">${id === 'community' ? P().free : pricePeriod()}</span></div>${id !== 'community' && state.billing === 'annual' ? `<div class="plan-savings">${annualSavings(id)}</div><p class="annual-total">${zh ? `按年支付 ${money(selectedPrices(id)[`${id}Annual`])}/年` : `Billed yearly: ${money(selectedPrices(id)[`${id}Annual`])}/year`}</p>` : ''}<p>${zh ? '已选好你的创作方案。当前为交互预览，购买与账号服务尚未接入，不会创建订单。' : 'Your plan is selected. Checkout and account services are not connected in this preview; no order is created.'}</p>`;
    dialog.innerHTML = `<button type="button" class="dialog-close" data-close-dialog aria-label="${zh ? '关闭' : 'Close'}">${zh ? '关闭' : 'Close'}</button><h2 id="pricing-dialog-title">${title}</h2>${body}<button class="plan-button" type="button" data-close-dialog>${zh ? '继续了解方案' : 'Keep exploring'}</button>`;
    dialog.showModal();
  };
  dialog.addEventListener('click',event => { if (event.target === dialog || event.target.closest('[data-close-dialog]')) dialog.close(); });
  document.addEventListener('click',event => {
    const target = event.target.closest('button,a');
    if (!target) return;
    if (target.hasAttribute('data-tier-set')) {
      hideTooltip();
      const id = target.dataset.tierSet;
      const next = Number(target.dataset.tierIndex);
      if (state.personalTiers[id] === next) return;
      state.personalTiers[id] = next;
      syncTier();
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
