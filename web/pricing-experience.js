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
  const currencySymbol = () => state.lang === 'zh' ? '¥' : '$';
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
    return `<section class="plan-feature-section ai-features" aria-labelledby="${id}-ai-title"><h3 id="${id}-ai-title"><span class="feature-check" aria-hidden="true">${personalIcon('ai')}</span>${zh ? 'AI 创作' : 'AI creation'}${badge}</h3><ul class="plan-list" data-ai-features="${id}">${aiFeatures(id)}</ul></section><section class="plan-feature-section workflow-features" aria-labelledby="${id}-workflow-title"><h3 id="${id}-workflow-title"><span class="feature-check" aria-hidden="true">${personalIcon('render')}</span>${zh ? '实时渲染' : 'Visual workflow'}</h3><ul class="plan-list">${items.map(item => personalFeature(item)).join('')}</ul></section>`;
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
        ${id === 'community' ? `<div class="plan-price"><span class="price-value">${money(0)}</span><span class="price-period">${p.free}</span></div>` : priceControl(id)}
      </div>
      ${id === 'community' ? '' : `<div class="plan-savings${annual ? '' : ' is-off'}" data-savings="${id}">${annualSavings(id)}</div>`}
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

  function priceControl(id) {
    const name = P()[id].name;
    return `<div class="plan-tier"><div class="price-tier-control">
      <div class="plan-price"><span class="price-value">${currencySymbol()}<span data-price="${id}">${personalPrice(id)}</span></span><span class="price-period" data-period>${pricePeriod()}</span></div>
      <div class="multiplier${state.personalTiers[id] === 1 ? ' is-triple' : ''}" data-multiplier="${id}" role="group" aria-label="${state.lang === 'zh' ? `${name}积分倍数` : `${name} credit multiplier`}">
        ${[0,1].map(index => `<button type="button" class="multiplier-option" data-tier-set="${id}" data-tier-index="${index}" aria-pressed="${state.personalTiers[id] === index}">${personalTiers[index].names[state.lang]}</button>`).join('')}
      </div>
    </div></div>`;
  }
  function renderSubnav() {
    const p = P();
    const annual = state.billing === 'annual';
    const zh = state.lang === 'zh';
    const personal = ['community','basic','pro'].map(id => `<article class="plan-subnav-card ${id}">
      <h2>${p[id].name}</h2>
      ${id === 'community' ? `<div class="plan-price"><span class="price-value">${money(0)}</span><span class="price-period">${p.free}</span></div>` : `${priceControl(id)}<div class="plan-savings${annual ? '' : ' is-off'}" data-savings="${id}">${annualSavings(id)}</div>`}
      <button type="button" class="plan-button" data-select-plan="${id}" data-purchase="${id}">${id === 'community' ? p.download : purchaseLabel()}</button>
    </article>`).join('');
    const team = `<article class="plan-subnav-card team">
      <h2>${zh ? '团队版' : 'Teams'}</h2>
      <div class="plan-price"><span class="price-value">${zh ? '联系我们' : 'Contact us'}</span></div>
      <button type="button" class="plan-button" data-contact-sales="team">${zh ? '咨询购买' : 'Contact sales'}</button>
    </article>`;
    $('#plan-subnav').innerHTML = `<div class="plan-subnav-inner${state.audience === 'team' ? ' is-team' : ''}">${state.audience === 'team' ? team : personal}</div>`;
    syncPlanSubnav();
  }
  function syncPlanSubnav() {
    const bar = $('#plan-subnav');
    const comparison = $('#comparison');
    if (!bar || !comparison) return;
    const box = comparison.getBoundingClientRect();
    const show = box.top <= 88 && box.bottom > 220;
    document.body.classList.toggle('is-plan-subnav', show);
    bar.setAttribute('aria-hidden', String(!show));
    if (show) bar.removeAttribute('inert');
    else bar.setAttribute('inert','');
  }
  syncTier = function () {
    $('#plan-grid').classList.toggle('is-annual',state.billing === 'annual');
    for (const id of ['basic','pro']) {
      $$(`[data-price="${id}"]`).forEach(el => animateNumber(el, personalPrice(id)));
      $$(`[data-multiplier="${id}"]`).forEach(track => track.classList.toggle('is-triple', state.personalTiers[id] === 1));
      $$(`[data-tier-set="${id}"]`).forEach(button => {
        const selected = Number(button.dataset.tierIndex) === state.personalTiers[id];
        button.setAttribute('aria-pressed',String(selected));
      });
      const badge = $(`[data-multiplier-badge="${id}"]`);
      if (badge) badge.textContent = tierName(id);
      const features = $(`[data-ai-features="${id}"]`);
      if (features) features.innerHTML = aiFeatures(id);
      $$(`[data-savings="${id}"]`).forEach(el => {
        el.innerHTML = annualSavings(id);
        el.classList.toggle('is-off', state.billing !== 'annual');
      });
    }
    $$('[data-period]').forEach(el => { el.textContent = pricePeriod(); });
    $$('[data-purchase]').forEach(el => {
      if (el.dataset.purchase !== 'community') el.textContent = purchaseLabel();
    });
  };

  const yes = 'yes', no = 'no';
  const personalCompare = {
    zh: {
      columns: ['社区版','基础版','专业版'],
      groups: [
        ['产品', [
          ['D5 Arco', yes, yes, yes],
          ['D5 Render', yes, yes, yes],
          ['D5 Lite', yes, yes, yes],
          ['D5 Works', yes, yes, yes],
        ]],
        ['D5 Arco · AI 创作', [
          ['模型', '部分开放', '全部开放', '全部开放'],
          ['同时运行 AI 任务（画布＋对话合计）', '2', '1× 4；3× 6', '1× 4；3× 6'],
          ['AI 图片最高规格', '1K', '1× 2K；3× 4K', '4K'],
          ['AI 视频最高规格', '480P', '1× 720P；3× 4K', '4K'],
          ['Arco 增强与放大', yes, yes, yes],
          ['Arco 项目评论与反馈', yes, yes, yes],
          ['技能', yes, yes, yes],
          ['每个画布分享链接上限', '1', '3', '20'],
          ['分享访问码设置', '无', yes, yes],
          ['分享下载设置', '无', '可禁止下载', '可禁止下载'],
          ['分享署名水印设置', yes, yes, yes],
          ['对话分享数量', '不限', '不限', '不限'],
        ]],
        ['D5 Arco · 连接', [
          ['与 D5 Render 连接', '限时支持', '限时支持', yes],
          ['与 D5 Lite 连接', '限时支持', '限时支持', yes],
          ['与 D5 Works 连接', '限时支持', '限时支持', yes],
          ['自定义 MCP 连接', yes, yes, yes],
        ]],
        ['D5 Render · 场景构建', [
          ['实时渲染、环境与材质编辑', yes, yes, yes],
          ['地理天空和天气系统', yes, yes, yes],
          ['地形系统和海洋系统', yes, yes, yes],
          ['植物笔刷、路径与散布', yes, yes, yes],
          ['素材库', '2100+', '2100+', '16000+'],
          ['基础光源', yes, yes, yes],
          ['自定义 HDRI、LUT、IES', yes, yes, yes],
          ['Render 内指定 AI 功能（AI 氛围匹配、AI 图像后期、AI 材质生成、局部重绘）', no, no, '不限次数，不扣积分'],
          ['文本/图片生成模型（使用消耗积分）', yes, yes, yes],
          ['舞台灯与投影灯', no, no, yes],
          ['城市生成', no, no, yes],
          ['剖切工具', no, no, yes],
          ['项目合并', no, no, yes],
        ]],
        ['D5 Render · 输出与展示', [
          ['图片和全景图渲染', '最高支持 16K', '最高支持 16K', '最高支持 16K'],
          ['基础视频输出格式', '最高支持 4K', '最高支持 4K', '最高支持 4K'],
          ['通道图渲染', yes, yes, yes],
          ['视频序列帧与多帧率渲染', no, no, yes],
          ['交互演示', '创建 1 个', '创建 1 个', '不限'],
          ['空间漫游与全景漫游', '创建 1 个', '创建 1 个', '不限'],
          ['双目立体全景图', no, no, yes],
          ['VR 虚拟现实', no, no, yes],
          ['XR 漫游', no, no, yes],
          ['漫游项目管理', '1 个项目', '1 个项目', yes],
          ['漫游信息和相机设置', yes, yes, yes],
          ['锚点热点', yes, yes, yes],
          ['高级显示设置（高级显示、密码保护、富媒体热点与户型导航）', no, no, yes],
          ['分享链接设置（链接有效期、品牌水印配置、水印可见性管理）', no, no, yes],
        ]],
        ['D5 Render · 云端预设', [
          ['D5 Studio 个人预设', '5 个', '5 个', '不限'],
          ['D5 精选预设', no, no, yes],
        ]],
        ['D5 Lite', [
          ['Lite CLI（beta）', '限时支持', '限时支持', yes],
          ['D5 Lite 实时渲染', yes, yes, yes],
          ['材质和灯光编辑', yes, yes, yes],
          ['环境和后期调整', yes, yes, yes],
          ['图片与全景图渲染', yes, yes, yes],
        ]],
        ['D5 Works', [
          ['Works MCP', '限时支持', '限时支持', yes],
          ['单个付费商品购买（仅海外）', '原价购买', '原价购买', '享专属优惠价（-12%）'],
        ]],
        ['云存储', [
          ['云空间', '限量', '1× 10 GB；3× 10 GB', '1× 10 GB；3× 10 GB'],
        ]],
        ['工作流插件', [
          {sub:'D5 Render 同步'},
          ['SketchUp 实时同步', yes, yes, yes],
          ['Rhino 实时同步', yes, yes, yes],
          ['3ds Max 实时同步', yes, yes, yes],
          ['Archicad 实时同步', yes, yes, yes],
          ['Blender 实时同步', yes, yes, yes],
          ['Vectorworks 实时同步', yes, yes, yes],
          ['Revit', yes, yes, yes],
          ['Cinema 4D', yes, yes, yes],
          {sub:'D5 Lite 同步'},
          ['Lite for SketchUp', yes, yes, yes],
          ['Lite for Rhino', yes, yes, yes],
          ['Lite for Revit', yes, yes, yes],
        ]],
      ],
    },
    en: {
      columns: ['Community','Basic','Pro'],
      groups: [
        ['Products', [
          ['D5 Arco', yes, yes, yes],
          ['D5 Render', yes, yes, yes],
          ['D5 Lite', yes, yes, yes],
          ['D5 Works', yes, yes, yes],
        ]],
        ['D5 Arco · AI creation', [
          ['Models', 'Selected', 'All', 'All'],
          ['Concurrent AI tasks (canvas + chat)', '2', '1× 4; 3× 6', '1× 4; 3× 6'],
          ['Max AI image', '1K', '1× 2K; 3× 4K', '4K'],
          ['Max AI video', '480P', '1× 720P; 3× 4K', '4K'],
          ['Arco enhance and upscale', yes, yes, yes],
          ['Arco comments and feedback', yes, yes, yes],
          ['Skills', yes, yes, yes],
          ['Share links per canvas', '1', '3', '20'],
          ['Share access code', 'None', yes, yes],
          ['Share download control', 'None', 'Can disable download', 'Can disable download'],
          ['Share attribution watermark', yes, yes, yes],
          ['Shared conversations', 'Unlimited', 'Unlimited', 'Unlimited'],
        ]],
        ['D5 Arco · Connections', [
          ['Connect to D5 Render', 'Limited-time', 'Limited-time', yes],
          ['Connect to D5 Lite', 'Limited-time', 'Limited-time', yes],
          ['Connect to D5 Works', 'Limited-time', 'Limited-time', yes],
          ['Custom MCP connection', yes, yes, yes],
        ]],
        ['D5 Render · Scene building', [
          ['Real-time render, environment, and materials', yes, yes, yes],
          ['Geo sky and weather', yes, yes, yes],
          ['Terrain and ocean', yes, yes, yes],
          ['Plant brush, path, and scatter', yes, yes, yes],
          ['Asset library', '2,100+', '2,100+', '16,000+'],
          ['Basic lights', yes, yes, yes],
          ['Custom HDRI, LUT, IES', yes, yes, yes],
          ['Selected Render AI (Atmosphere Match, post, materials, inpainting)', no, no, 'Unlimited, no credits'],
          ['Text/image generation models (uses credits)', yes, yes, yes],
          ['Stage and projector lights', no, no, yes],
          ['City generation', no, no, yes],
          ['Section tool', no, no, yes],
          ['Project merge', no, no, yes],
        ]],
        ['D5 Render · Output and presentation', [
          ['Image and panorama render', 'Up to 16K', 'Up to 16K', 'Up to 16K'],
          ['Basic video output', 'Up to 4K', 'Up to 4K', 'Up to 4K'],
          ['Channel render', yes, yes, yes],
          ['Image sequence and multi-frame-rate video', no, no, yes],
          ['Interactive presentation', 'Create 1', 'Create 1', 'Unlimited'],
          ['Spatial and panorama tours', 'Create 1', 'Create 1', 'Unlimited'],
          ['Stereo panorama', no, no, yes],
          ['VR', no, no, yes],
          ['XR tour', no, no, yes],
          ['Tour project management', '1 project', '1 project', yes],
          ['Tour info and camera settings', yes, yes, yes],
          ['Anchor hotspots', yes, yes, yes],
          ['Advanced display (password, rich hotspots, floorplan nav)', no, no, yes],
          ['Share-link settings (expiry, brand watermark, visibility)', no, no, yes],
        ]],
        ['D5 Render · Cloud presets', [
          ['D5 Studio personal presets', '5', '5', 'Unlimited'],
          ['D5 curated presets', no, no, yes],
        ]],
        ['D5 Lite', [
          ['Lite CLI (beta)', 'Limited-time', 'Limited-time', yes],
          ['D5 Lite real-time render', yes, yes, yes],
          ['Material and light editing', yes, yes, yes],
          ['Environment and post adjustments', yes, yes, yes],
          ['Image and panorama render', yes, yes, yes],
        ]],
        ['D5 Works', [
          ['Works MCP', 'Limited-time', 'Limited-time', yes],
          ['Buying a paid item (overseas only)', 'List price', 'List price', 'Exclusive price (−12%)'],
        ]],
        ['Cloud storage', [
          ['Cloud storage', 'Limited', '1× 10 GB; 3× 10 GB', '1× 10 GB; 3× 10 GB'],
        ]],
        ['Workflow plugins', [
          {sub:'D5 Render sync'},
          ['SketchUp live sync', yes, yes, yes],
          ['Rhino live sync', yes, yes, yes],
          ['3ds Max live sync', yes, yes, yes],
          ['Archicad live sync', yes, yes, yes],
          ['Blender live sync', yes, yes, yes],
          ['Vectorworks live sync', yes, yes, yes],
          ['Revit', yes, yes, yes],
          ['Cinema 4D', yes, yes, yes],
          {sub:'D5 Lite sync'},
          ['Lite for SketchUp', yes, yes, yes],
          ['Lite for Rhino', yes, yes, yes],
          ['Lite for Revit', yes, yes, yes],
        ]],
      ],
    },
  };
  const teamCompare = {
    zh: {
      columns: ['专业版','团队版'],
      groups: [['功能', [
        ['成员管理', no, yes],
        ['积分共享池', no, yes],
        ['积分额度分配', no, yes],
        ['数据看板', no, yes],
        ['团队资产管理', no, yes],
        ['Arco 团队项目', no, yes],
        ['Arco 画布多人协作', no, yes],
        ['同时运行 AI 任务（画布＋对话合计）', '最多 6 个', '最多 10 个'],
        ['Render 项目多人编辑', no, '专业席位支持'],
        ['Render 团队预设', no, '专业席位支持'],
        ['Render 第三方网盘集成', no, '专业席位支持'],
        ['云空间', '10 GB', '100 GB'],
        ['订阅积分有效期', '1 月', '1 年'],
        ['充值积分有效期', '180 天', '365 天'],
      ]]],
    },
    en: {
      columns: ['Pro','Teams'],
      groups: [['Features', [
        ['Member management', no, yes],
        ['Shared credit pool', no, yes],
        ['Credit quota allocation', no, yes],
        ['Analytics dashboard', no, yes],
        ['Team asset management', no, yes],
        ['Arco team projects', no, yes],
        ['Multi-user Arco canvas', no, yes],
        ['Concurrent AI tasks (canvas + chat)', 'Up to 6', 'Up to 10'],
        ['Multi-user Render editing', no, 'Pro seats'],
        ['Render team presets', no, 'Pro seats'],
        ['Render third-party drive integration', no, 'Pro seats'],
        ['Cloud storage', '10 GB', '100 GB'],
        ['Subscription credit expiry', '1 month', '1 year'],
        ['Top-up credit expiry', '180 days', '365 days'],
      ]]],
    },
  };
  const faqs = {
    zh: {
      personal: [
        ['社区版、基础版和专业版怎么选？', '社区版免费提供 300 积分，适合体验；基础版适合以 AI 创作为主的用户；专业版适合需要 D5 Render、D5 Lite 及更完整专业可视化能力的用户。基础版和专业版均提供 1× / 3× 档位，可按 AI 用量与创作需求选择。'],
        ['按月和按年购买有什么区别？如何升级或续费？', '按年购买一次支付全年费用，不自动续费；月订阅取消自动续费后，当前周期内权益继续有效。升级、续费和降档按独立规则执行。'],
        ['积分如何发放、到期和充值？', '基础版与专业版的订阅积分按月发放；未用积分按规则到期。有效订阅期内可充值，充值积分单独计算有效期；社区版不支持充值。'],
        ['如何开具发票？', '成功订购后，可前往 <a href="https://myspace.d5render.cn/bill" target="_blank" rel="noopener">D5 用户中心·发票服务</a>申请开票。团队采购的发票事宜请与销售确认。'],
        ['原有专业版用户如何衔接？', '详见<a href="https://www.d5render.cn/news/d5-subscription-update-2026/" target="_blank" rel="noopener">D5 订阅方案更新预告及权益说明</a>。'],
        ['首发赠分持续多久？年付可以锁定全年赠分吗？', '首发赠分截至 <strong>2027 年 2 月 28 日（含当日，北京时间）</strong>。按实际发放批次判断。年付积分仍按月发放，不锁定全年赠分；已发赠分不因活动结束提前收回。'],
      ],
      team: [
        ['基础席位与专业席位是什么？', '基础席位与专业席位是团队版内可组合的席位配置。基础席位包含个人基础版功能权益；专业席位包含个人专业版权益。'],
        ['团队版和个人版有什么区别？', '团队版增加项目与画布多人协作、成员与资产管理、共享积分池及额度分配。以 AI 创作为主的成员可选基础席位，需要可视化专业能力的成员选专业席位，两类席位可以组合。'],
        ['团队积分如何发放、共享和充值？', '团队套餐积分与单独充值积分分别管理；具体发放、共享、有效期和赠送规则见团队积分细则。'],
        ['团队版如何购买？支持按月、折扣和开票吗？', '团队方案需联系销售，按席位配置和实际协作需求报价；月付、折扣、开票及开票类型以销售确认的方案为准。'],
        ['原有团队版会自动升级吗？个人版如何升级或加入团队？', '不会。旧团队版与工作流团队版的积分和权益规则不同，升级需另行办理；个人加入团队、旧订阅衔接及金额抵扣以独立迁移说明和销售确认为准。'],
      ],
    },
    en: {
      personal: [
        ['How do I choose Community, Basic, and Pro?', 'Community includes 300 free credits for trying D5. Basic is for work that is mainly AI creation. Pro is for D5 Render, D5 Lite, and a fuller professional visualization workflow. Basic and Pro both offer 1× and 3× tiers.'],
        ['How do monthly and yearly billing differ? What about upgrades and renewals?', 'Yearly billing is one payment for the year and does not auto-renew. After a monthly subscription is cancelled, benefits continue through the current period. Upgrades, renewals, and moving to a lower tier follow their own rules.'],
        ['How are credits issued, when do they expire, and can I buy more?', 'Basic and Pro subscription credits are issued monthly. Unused credits expire under the plan rules. Extra credits can be bought during an active subscription and expire separately. Community cannot buy extra credits.'],
        ['How do I get an invoice?', 'After a successful order, request an invoice from <a href="https://myspace.d5render.cn/bill" target="_blank" rel="noopener">D5 Account · Invoices</a>. For team purchases, confirm invoicing with sales.'],
        ['What happens for existing Pro subscribers?', 'See the <a href="https://www.d5render.cn/news/d5-subscription-update-2026/" target="_blank" rel="noopener">D5 subscription update</a>.'],
        ['How long does the launch bonus last? Does yearly billing lock it in?', 'The launch bonus runs through <strong>February 28, 2027</strong> (Beijing time, that day included), based on the batch actually issued. Yearly credits are still issued monthly and do not lock the bonus for the whole year. Credits already issued are not taken back early when the promotion ends.'],
      ],
      team: [
        ['What are Basic and Pro seats?', 'They are seat types you can mix in Teams. A Basic seat includes individual Basic benefits. A Pro seat includes individual Pro benefits.'],
        ['How is Teams different from an individual plan?', 'Teams adds multi-user projects and canvases, member and asset management, a shared credit pool, and quota allocation. Members focused on AI can use Basic seats; members who need professional visualization can use Pro seats.'],
        ['How are team credits issued, shared, and topped up?', 'Plan credits and separately purchased credits are managed separately. Issuance, sharing, expiry, and bonuses follow the team credit policy.'],
        ['How do I buy Teams? Are monthly billing, discounts, and invoices available?', 'Contact sales for a quote based on seats and collaboration needs. Monthly billing, discounts, and invoice type follow the plan sales confirms.'],
        ['Will an existing team plan upgrade automatically? How does an individual join?', 'No. Legacy team plans and the workflow team plan use different credit and benefit rules, so upgrading is a separate process. Joining a team, connecting an old subscription, and any credit follow the migration notes and sales confirmation.'],
      ],
    },
  };
  function compareCell(value) {
    const zh = state.lang === 'zh';
    if (value === yes) return `<img src="assets/figma/check-circle.svg" alt="${zh ? '支持' : 'Included'}">`;
    if (value === no) return `<img src="assets/figma/personal-close.svg" alt="${zh ? '不支持' : 'Not included'}">`;
    const tiers = String(value).split(/\s*[;；]\s*/);
    if (tiers.length > 1 && tiers.every(part => /^[13]×\s+\S/.test(part))) {
      return `<span class="compare-tiers">${tiers.map(part => {
        const match = part.match(/^([13]×)\s+(.+)$/);
        return `<span class="compare-tier"><span class="multiplier-badge">${match[1]}</span><span>${match[2]}</span></span>`;
      }).join('')}</span>`;
    }
    return `<span class="compare-text">${value}</span>`;
  }
  function nestCompare(groups) {
    const products = [];
    groups.forEach(([title, rows]) => {
      const [product, theme] = title.split(' · ');
      const themes = [];
      if (theme) themes.push({name: theme, rows});
      else {
        let current = {name: '', rows: []};
        rows.forEach(row => {
          if (row.sub) {
            if (current.name || current.rows.length) themes.push(current);
            current = {name: row.sub, rows: []};
          } else current.rows.push(row);
        });
        if (current.name || current.rows.length) themes.push(current);
      }
      const previous = products[products.length - 1];
      if (theme && previous && previous.name === product) previous.themes.push(...themes);
      else products.push({name: product, themes});
    });
    return products;
  }
  const themeIcons = {
    'AI 创作': {src:'assets/figma/theme-ai.svg', tone:'is-grape'},
    'AI creation': {src:'assets/figma/theme-ai.svg', tone:'is-grape'},
    '连接': {src:'assets/figma/theme-plugs.svg', tone:'is-neutral'},
    'Connections': {src:'assets/figma/theme-plugs.svg', tone:'is-neutral'},
    '场景构建': {src:'assets/figma/theme-scene.svg', tone:'is-info'},
    'Scene building': {src:'assets/figma/theme-scene.svg', tone:'is-info'},
    '输出与展示': {src:'assets/figma/theme-output.svg', tone:'is-green'},
    'Output and presentation': {src:'assets/figma/theme-output.svg', tone:'is-green'},
    '云端预设': {src:'assets/figma/theme-studio.svg', tone:'is-sky'},
    'Cloud presets': {src:'assets/figma/theme-studio.svg', tone:'is-sky'},
    'D5 Render 同步': {src:'assets/figma/theme-workflow.svg', tone:'is-neutral'},
    'D5 Render sync': {src:'assets/figma/theme-workflow.svg', tone:'is-neutral'},
    'D5 Lite 同步': {src:'assets/figma/theme-workflow.svg', tone:'is-neutral'},
    'D5 Lite sync': {src:'assets/figma/theme-workflow.svg', tone:'is-neutral'},
  };
  const collapsedCompare = new Set();
  renderCompare = function () {
    const team = state.audience === 'team';
    const catalog = (team ? teamCompare : personalCompare)[state.lang];
    const scope = team ? 'team' : 'personal';
    const line = (row, nested) => `<div class="compare-line${nested ? ' is-nested' : ''}"><span class="compare-label">${row[0]}</span>${row.slice(1).map(value => `<span class="compare-value">${compareCell(value)}</span>`).join('')}</div>`;
    const cards = nestCompare(catalog.groups).map((product, productIndex) => {
      const key = `${scope}-${productIndex}`;
      const open = !collapsedCompare.has(key);
      const unnamed = product.themes.length === 1 && !product.themes[0].name;
      const inner = unnamed
        ? product.themes[0].rows.map(row => line(row, false)).join('')
        : product.themes.map(theme => {
          const icon = themeIcons[theme.name];
          return `<div class="compare-subhead">${icon ? `<span class="compare-theme-icon ${icon.tone}"><img src="${icon.src}" alt=""></span>` : ''}<span>${theme.name}</span></div>${theme.rows.map(row => line(row, true)).join('')}`;
        }).join('');
      return `<section class="compare-card"><button type="button" class="compare-card-toggle" data-compare-toggle="${key}" aria-expanded="${open}"><img src="assets/figma/compare-chevron.svg" alt="">${product.name}</button><div class="compare-card-body" data-compare-panel="${key}"${open ? '' : ' hidden'}>${inner}</div></section>`;
    }).join('');
    $('#compare').innerHTML = `<div class="compare-stack${team ? ' is-team' : ''}"><div class="compare-columns">${catalog.columns.map(title => `<span>${title}</span>`).join('')}</div>${cards}</div>`;
    renderFaq();
  };
  function renderFaq() {
    const items = faqs[state.lang][state.audience === 'team' ? 'team' : 'personal'];
    $('#faq-list').innerHTML = items.map(([question, answer]) => `<details><summary><span>${question}</span><img src="assets/figma/caret-down-faq.svg" alt=""></summary><p>${answer}</p></details>`).join('');
  };

  function syncThemeControl() {
    const light = document.documentElement.dataset.theme === 'light';
    const button = $('[data-theme-toggle]');
    if (button) {
      const zh = state.lang === 'zh';
      button.setAttribute('aria-pressed', String(light));
      button.setAttribute('aria-label', light ? (zh ? '切换为暗色' : 'Switch to dark mode') : (zh ? '切换为亮色' : 'Switch to light mode'));
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#ffffff' : '#000000');
  }
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
    try { localStorage.setItem('d5-theme', document.documentElement.dataset.theme); } catch (e) {}
    syncThemeControl();
  }

  function persistPreviewState() {
    const url = new URL(location.href);
    for (const key of ['audience','billing','lang']) url.searchParams.set(key,state[key]);
    url.searchParams.set('theme', document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    for (const id of ['basic','pro']) {
      if (state.personalTiers[id]) url.searchParams.set(`${id}Tier`,'advanced');
      else url.searchParams.delete(`${id}Tier`);
    }
    history.replaceState(null,'',url);
  }

  function syncAudience() {
    const team = state.audience === 'team';
    renderSubnav();
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
    copy.zh['comparison.subtitle'] = team ? '详细对比个人专业版与团队版整体能力' : '详细对比个人创作套餐及功能权益';
    copy.en['comparison.subtitle'] = team ? 'Pro and Teams, compared' : 'Individual plans, side by side';
    $('[data-i18n="comparison.subtitle"]').textContent = t('comparison.subtitle');
    $('.header-language').textContent = state.lang === 'zh' ? 'English' : '中文';
    syncThemeControl();
    persistPreviewState();
    syncPlanSubnav();
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
    if (target.hasAttribute('data-compare-toggle')) {
      const key = target.dataset.compareToggle;
      const open = target.getAttribute('aria-expanded') !== 'false';
      if (open) collapsedCompare.add(key);
      else collapsedCompare.delete(key);
      target.setAttribute('aria-expanded', String(!open));
      $$(`[data-compare-panel="${key}"]`).forEach(row => { row.hidden = open; });
    }
    if (target.hasAttribute('data-theme-toggle')) {
      applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
      persistPreviewState();
    }
    if (target.hasAttribute('data-language-toggle')) {
      // Reuse the existing language events for all page copy.
      $(`.footer-legal [data-lang="${state.lang === 'zh' ? 'en' : 'zh'}"]`).click();
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
  window.addEventListener('resize',() => { positionTooltip(); syncPlanSubnav(); });
  window.addEventListener('scroll',() => { positionTooltip(); syncPlanSubnav(); },true);
  document.addEventListener('transitionend',event => {
    if (activeTooltip && event.target === activeTooltip.button.closest('.plan-card')) positionTooltip();
  });
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  renderAll();
})();
