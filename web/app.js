// D5 pricing page — data, i18n and the few interactions present in the design
// (language switch, audience segmented control, billing toggle, credit tier slider, FAQ).

const tiers = [
  { credits: 1000, basic: 49, pro: 200, basicAnnual: 399, proAnnual: 1920 },
  { credits: 2700, basic: 129, pro: 280, basicAnnual: 999, proAnnual: 2520 },
  { credits: 6000, basic: 269, pro: 420, basicAnnual: 1999, proAnnual: 3520 },
  { credits: 13000, basic: 569, pro: 720, basicAnnual: 3999, proAnnual: 5520 },
];
// Four tiers occupy the quarter marks, including the rail's endpoint.
const tierProgress = ['25%', '50%', '75%', '100%'];

const state = { lang: 'zh', tier: 0, billing: 'monthly', audience: 'personal' };

const copy = {
  zh: {
    'hero.title': '找到适合你的 D5 方案',
    'hero.subtitle': '从第一次灵感探索，到下一次专业交付，更多创意，更大可能',
    'audience.personal': '个人创作', 'audience.team': '团队协作',
    'billing.monthly': '按月', 'billing.annual': '按年', 'billing.discount': '享x折',
    'billing.toAnnual': '切换按年购买', 'billing.toMonthly': '切换按月购买',
    'education.title': 'D5 for Education', 'education.subtitle': 'Best for students, educators, and academic institutions', 'education.button': 'Apply',
    'workflow.title': '工作流对比', 'workflow.subtitle': '找到最适合你的 D5 工作流',
    'comparison.title': '完整功能对比', 'comparison.subtitle': '详细对比套餐及功能权益',
    'faq.q1': 'D5 Pro 可以升级到 D5 团队版吗？', 'faq.a1': '团队版面向需要协作与统一管理的团队，具体开放时间和升级方式以后续产品公告为准。',
    'faq.q2': 'D5 社区版授权可以做什么？', 'faq.a2': '社区版适合个人体验 D5 的 AI 创作能力，生成内容不可用于商业用途。',
    'faq.q3': '如何获取发票？', 'faq.a3': '完成购买后，可在账户订单页面申请和下载发票。',
    'footer.product': '产品', 'footer.whyD5': '为什么选择 D5', 'footer.whatsNew': '最新动态', 'footer.pricing': '价格', 'footer.download': '下载', 'footer.teams': 'D5 团队版', 'footer.education': 'D5 教育版', 'footer.roadmap': '开发路线图', 'footer.assets': '素材库',
    'footer.support': '支持', 'footer.help': '帮助中心', 'footer.requirements': '系统要求', 'footer.space': '我的空间',
    'footer.learn': '学习', 'footer.tutorial': '教程', 'footer.sample': '示例场景', 'footer.gallery': '作品展示', 'footer.blog': '博客', 'footer.webinars': '线上研讨会', 'footer.certification': '认证', 'footer.instructor': 'D5 讲师',
    'footer.community': '社区', 'footer.forum': '论坛', 'footer.awards': 'D5 大奖', 'footer.creator': '创作者计划', 'footer.campus': '校园大使', 'footer.userGroup': '用户社群', 'footer.winPro': '赢取 D5 Pro',
    'footer.business': '商务合作', 'footer.reseller': '成为经销商', 'footer.findReseller': '寻找经销商', 'footer.affiliate': '推广合作', 'footer.technology': '技术合作伙伴', 'footer.brandKit': '品牌资源',
    'footer.company': '公司', 'footer.about': '关于我们', 'footer.careers': '加入我们',
    'footer.subscribe': '订阅动态', 'footer.newsletter': '获取最新消息、文章、资源和设计灵感。', 'footer.emailLabel': '邮箱地址', 'footer.emailPlaceholder': '输入邮箱', 'footer.next': '下一步', 'footer.followTitle': '关注我们',
    'footer.copyright': 'Dimension 5 Techs. © 2026 Dimension 5. 保留所有权利。', 'footer.privacy': '隐私政策', 'footer.service': '服务协议', 'footer.join': '加入我们',
  },
  en: {
    'hero.title': 'Find the right D5 plan for you',
    'hero.subtitle': 'From your first exploration to your next professional delivery, more ideas, more possibilities',
    'audience.personal': 'For creators', 'audience.team': 'For teams',
    'billing.monthly': 'Monthly', 'billing.annual': 'Yearly', 'billing.discount': 'Save x%',
    'billing.toAnnual': 'Switch to yearly billing', 'billing.toMonthly': 'Switch to monthly billing',
    'education.title': 'D5 for Education', 'education.subtitle': 'Best for students, educators, and academic institutions', 'education.button': 'Apply',
    'workflow.title': 'Workflow Comparison', 'workflow.subtitle': 'Find the D5 workflow that fits you',
    'comparison.title': 'Compare all features', 'comparison.subtitle': 'Detailed comparison of plans and features',
    'faq.q1': 'Can D5 Pro be upgraded to D5 for Teams?', 'faq.a1': 'D5 for Teams is designed for collaborative work and centralized management. Availability and upgrade details will follow the product announcement.',
    'faq.q2': 'What am I allowed to do with D5 Community license?', 'faq.a2': 'The Community plan is for exploring D5 AI creation features. Generated content is not for commercial use.',
    'faq.q3': 'How do I get an invoice?', 'faq.a3': 'After purchase, request and download an invoice from your account orders page.',
    'footer.product': 'Product', 'footer.whyD5': 'Why D5', 'footer.whatsNew': 'What’s New', 'footer.pricing': 'Pricing', 'footer.download': 'Download', 'footer.teams': 'D5 for Teams', 'footer.education': 'D5 for Education', 'footer.roadmap': 'Roadmap', 'footer.assets': 'Asset Library',
    'footer.support': 'Support', 'footer.help': 'Help Center', 'footer.requirements': 'System Requirements', 'footer.space': 'My Space',
    'footer.learn': 'Learn', 'footer.tutorial': 'Tutorials', 'footer.sample': 'Sample Scene', 'footer.gallery': 'Gallery', 'footer.blog': 'Blog', 'footer.webinars': 'Webinars', 'footer.certification': 'Certification', 'footer.instructor': 'D5 Instructor',
    'footer.community': 'Community', 'footer.forum': 'Forum', 'footer.awards': 'D5 Awards', 'footer.creator': 'Champion Program', 'footer.campus': 'Campus Ambassador', 'footer.userGroup': 'User Group', 'footer.winPro': 'Win D5 Pro',
    'footer.business': 'For Business', 'footer.reseller': 'Become a Reseller', 'footer.findReseller': 'Find a Reseller', 'footer.affiliate': 'Affiliate Program', 'footer.technology': 'Technology Partners', 'footer.brandKit': 'Brand Kit',
    'footer.company': 'Company', 'footer.about': 'About Us', 'footer.careers': 'Career',
    'footer.subscribe': 'Hear from us', 'footer.newsletter': 'Subscribe to get the latest news, articles, resources and inspiration.', 'footer.emailLabel': 'Email address', 'footer.emailPlaceholder': 'Enter your email', 'footer.next': 'Next', 'footer.followTitle': 'Follow us',
    'footer.copyright': 'Dimension 5 Techs. © 2026 Dimension 5. All rights reserved.', 'footer.privacy': 'Privacy Policy', 'footer.service': 'Service Agreement', 'footer.join': 'Join Us',
  },
};

const plans = {
  zh: {
    tierNames: ['入门', '轻量', '标准', '旗舰'],
    credits: '积分', perMonth: '/月', monthly: '/月订阅', annual: '/年订阅', free: '/免费体验', firstMonth: '首月￥39', upgrade: '立即升级', download: '免费下载',
    community: { desc: '从第一次灵感探索开始', name: '社区版', info: '一次性领取 300 体验积分', list: ['支持 2 个并发任务', '支持体验部分模型', '支持生成 1K 图片', '支持生成 480P 视频', '不支持 AI 积分包充值', '不可商用'] },
    basic: { desc: '为日常创作', name: '基础版', list: ['每月按档位发放积分', '支持 4 个并发任务', '支持全部模型', '支持生成 2K 图片', '支持生成 720P 视频', '支持 AI 积分包充值', 'AI 生成可商用'] },
    pro: { desc: '专业表达相得益彰', name: '专业版', list: ['每月按档位发放积分', '支持 4 个并发任务', '支持全部模型', '支持生成 4K 图片', '支持生成 4K 视频', ['支持 AI 积分包充值', '额外赠送 10%'], '全部可商用'] },
    compare: { lead: 'D5 渲染功能', cols: ['社区版', '基础版', '专业版', '团队版'], pending: '权益待确认', group: '场景编辑', rows: ['无限场景数量', '主流文件格式导入'] },
    sliderLabel: '每月 AI 积分档位',
  },
  en: {
    tierNames: ['Starter', 'Light', 'Standard', 'Ultra'],
    credits: 'credits', perMonth: '/mo', monthly: '/month', annual: '/year', free: '/free', firstMonth: 'First month ￥39', upgrade: 'Upgrade now', download: 'Free Download',
    community: { desc: 'Start exploring your ideas', name: 'Community', info: 'One-time 300 trial credits', list: ['2 concurrent tasks', 'Selected models', 'AI images up to 1K', 'AI videos up to 480P', 'AI credit packs unavailable', 'Not for commercial use'] },
    basic: { desc: 'For everyday creation', name: 'Basic', list: ['Credits issued by monthly tier', '4 concurrent tasks', 'All models', 'AI images up to 2K', 'AI videos up to 720P', 'AI credit packs available', 'AI content for commercial use'] },
    pro: { desc: 'Professional expression, amplified', name: 'Pro', list: ['Credits issued by monthly tier', '4 concurrent tasks', 'All models', 'AI images up to 4K', 'AI videos up to 4K', ['AI credit packs available', '10% bonus'], 'All for commercial use'] },
    compare: { lead: 'D5 Render Features', cols: ['Community', 'Basic', 'Pro', 'Teams'], pending: 'Benefits to be confirmed', group: 'Scene Editing', rows: ['Unlimited number of scenes', 'Major file format imports'] },
    sliderLabel: 'Monthly AI credit tier',
  },
};

// Workbook: D5 AI积分定价完整方案.xlsx.
// B端完整定价!J3:J6 formulas explicitly quote 元/席/年 (no monthly quote).
// H3:H6 are review list prices; L2 leaves contract prices to sales/finance.
// 规则与待确认!C22 requires sales-led pricing, not public self-service checkout.
// Credits: B端完整定价!G3:G6, per seat, valid for one year (NOT per month).
// Benefits: AI 权益!B11:H11 and B14:H14. M is not launched; omit it.
const businessPlans = {
  zh: {
    contact: '联系销售', period: '按席位 / 年报价',
    monthlyNote: '暂未提供月付价格，按席位年度报价；具体合同价由销售确认。',
    annualNote: '按席位年度报价；具体合同价由销售确认。',
    preview: '当前为设计预览，尚未接入销售咨询，不会提交联系请求。',
    team: {
      desc: '面向中小型团队', name: '团队版',
      info: '基础席位 20,000 积分 / 席；专业席位 25,000 积分 / 席，均一年有效。',
      list: ['支持 10 个并发任务', '支持全部模型', '支持生成 4K 图片', '支持生成 4K 视频', '全部可商用', '充值按企业价格，充值积分 365 天有效'],
    },
    enterprise: {
      desc: '面向大型客户', name: '企业版',
      info: '基础席位 22,000 积分 / 席；专业席位 40,000 积分 / 席，均一年有效。',
      list: ['并发任务不限', '支持全部模型', '支持生成 4K 图片', '支持生成 4K 视频', '全部可商用', '充值按企业价格，充值积分 365 天有效'],
    },
  },
  en: {
    contact: 'Contact sales', period: 'Per seat / year',
    monthlyNote: 'Monthly pricing is not provided. Annual per-seat quotes are confirmed by sales.',
    annualNote: 'Annual per-seat quotes are confirmed by sales.',
    preview: 'This is a design preview. Sales contact is not connected and no request will be submitted.',
    team: {
      desc: 'For small and medium-sized teams', name: 'Teams',
      info: 'Basic seat: 20,000 credits per seat; professional seat: 25,000 credits per seat. Valid for one year.',
      list: ['10 concurrent tasks', 'All models', 'AI images up to 4K', 'AI videos up to 4K', 'All for commercial use', 'Enterprise top-up pricing; top-up credits valid for 365 days'],
    },
    enterprise: {
      desc: 'For large organizations', name: 'Enterprise',
      info: 'Basic seat: 22,000 credits per seat; professional seat: 40,000 credits per seat. Valid for one year.',
      list: ['Unlimited concurrent tasks', 'All models', 'AI images up to 4K', 'AI videos up to 4K', 'All for commercial use', 'Enterprise top-up pricing; top-up credits valid for 365 days'],
    },
  },
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const t = key => copy[state.lang][key] ?? key;
const P = () => plans[state.lang];
const price = (plan, i) => state.billing === 'annual' ? tiers[i][`${plan}Annual`] : tiers[i][plan];

// Keep each number's digit places stable when a new target interrupts a roll.
const rollingNumbers = new WeakMap();
const activeNumbers = new Set();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const digitAt = (value, place) => Math.floor(value / (10 ** place)) % 10;
const wrapDigit = value => ((value % 10) + 10) % 10;

function paintLane(lane) {
  const whole = Math.floor(lane.position);
  lane.track.children[0].textContent = wrapDigit(whole);
  lane.track.children[1].textContent = wrapDigit(whole + 1);
  // The track contains two digits, so half its height is one digit.
  lane.track.style.transform = `translateY(-${(lane.position - whole) * 50}%)`;
}

function addLane(el, number, position) {
  const wheel = document.createElement('span');
  wheel.className = 'number-wheel';
  wheel.setAttribute('aria-hidden', 'true');
  const track = document.createElement('span');
  track.className = 'number-wheel-track';
  track.append(document.createElement('span'), document.createElement('span'));
  wheel.append(track);
  el.prepend(wheel);
  const lane = { wheel, track, position };
  number.lanes.push(lane); // Units first: existing places stay right-aligned.
  paintLane(lane);
}

function finishNumber(el, number) {
  cancelAnimationFrame(number.raf);
  number.raf = 0;
  activeNumbers.delete(el);
  if (reducedMotion.matches) {
    el.textContent = String(number.target);
    number.lanes = [];
    return;
  }
  const length = String(number.target).length;
  while (number.lanes.length > length) number.lanes.pop().wheel.remove();
  number.lanes.forEach((lane, place) => {
    lane.position = digitAt(number.target, place);
    paintLane(lane);
  });
}

function animateNumber(el, target) {
  let number = rollingNumbers.get(el);
  if (!number) {
    number = { target: Number(el.textContent) || 0, lanes: [], raf: 0 };
    rollingNumbers.set(el, number);
  }
  el.classList.add('rolling-number');
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', String(target));
  if (reducedMotion.matches) {
    number.target = target;
    finishNumber(el, number);
    return;
  }
  if (number.target === target) return;
  cancelAnimationFrame(number.raf);
  const previous = number.target;
  const direction = target > previous ? 1 : -1;
  if (!number.lanes.length) {
    el.textContent = '';
    for (let place = 0; place < String(previous).length; place++) {
      addLane(el, number, digitAt(previous, place));
    }
  }
  const length = Math.max(String(target).length, number.lanes.length);
  while (number.lanes.length < length) addLane(el, number, 0);
  number.target = target;
  number.lanes.forEach((lane, place) => {
    lane.start = lane.position; // Retarget from the last actually painted frame.
    const digit = digitAt(target, place);
    lane.end = direction > 0
      ? digit + 10 * Math.ceil((lane.start - digit) / 10)
      : digit + 10 * Math.floor((lane.start - digit) / 10);
  });
  const started = performance.now();
  activeNumbers.add(el);
  const frame = now => {
    if (!el.isConnected) {
      number.raf = 0;
      activeNumbers.delete(el);
      return;
    }
    if (reducedMotion.matches) {
      finishNumber(el, number);
      return;
    }
    const progress = Math.min(1, Math.max(0, (now - started) / 500));
    const eased = 1 - (1 - progress) ** 4;
    number.lanes.forEach(lane => {
      lane.position = lane.start + (lane.end - lane.start) * eased;
      paintLane(lane);
    });
    if (progress === 1) finishNumber(el, number);
    else number.raf = requestAnimationFrame(frame);
  };
  number.raf = requestAnimationFrame(frame);
}

reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    activeNumbers.forEach(el => finishNumber(el, rollingNumbers.get(el)));
  }
});

function applyLanguage() {
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  document.title = state.lang === 'zh' ? 'D5 · 选择你的创作方案' : 'D5 · Choose your D5 plan';
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
  syncBillingToggle();
}

function syncBillingToggle() {
  const annual = state.billing === 'annual';
  const toggle = $('[data-billing-toggle]');
  toggle.setAttribute('aria-pressed', String(annual));
  toggle.setAttribute('aria-label', t(annual ? 'billing.toMonthly' : 'billing.toAnnual'));
  const discount = $('[data-i18n="billing.discount"]');
  if (discount) discount.hidden = state.audience === 'team';
}

function listItems(list) {
  return list.map(item => Array.isArray(item)
    ? `<li>${item[0]}<em>${item[1]}</em></li>`
    : `<li>${item}</li>`).join('');
}

function renderPlans() {
  // Language/audience changes replace cards: stop frames before detaching them.
  activeNumbers.forEach(el => {
    const number = rollingNumbers.get(el);
    cancelAnimationFrame(number.raf);
    number.raf = 0;
    activeNumbers.delete(el);
  });
  const grid = $('#plan-grid');
  grid.classList.toggle('is-team', state.audience === 'team');
  if (state.audience === 'team') {
    const b = businessPlans[state.lang];
    grid.innerHTML = ['team', 'enterprise'].map(id => `
      <article class="plan-card ${id} ${id === 'team' ? 'basic' : 'pro'}">
        <div class="plan-top">
          <div class="plan-title">
            <p class="plan-desc">${b[id].desc}</p>
            <div class="plan-name"><h2>${b[id].name}</h2></div>
          </div>
          <div class="plan-price"><span class="price-value">${b.contact}</span><span class="price-period">${b.period}</span></div>
          <div class="plan-info"><p>${b[id].info}</p><p data-business-billing>${state.billing === 'annual' ? b.annualNote : b.monthlyNote}</p></div>
        </div>
        <button type="button" class="plan-button" data-contact-sales="${id}">${b.contact}</button>
        <ul class="plan-list">${listItems(b[id].list)}</ul>
      </article>`).join('');
    return;
  }
  const p = P();
  const tier = tiers[state.tier];
  const period = state.billing === 'annual' ? p.annual : p.monthly;
  const tag = `<span class="tag" data-first-month${state.billing === 'monthly' && state.tier === 0 ? '' : ' hidden'}>${p.firstMonth}</span>`;

  const paidCard = id => `
    <article class="plan-card ${id}">
      <div class="plan-top">
        <div class="plan-title">
          <p class="plan-desc">${p[id].desc}</p>
          <div class="plan-name"><h2>${p[id].name}</h2>${id === 'basic' ? tag : ''}</div>
        </div>
        <div class="plan-price"><span class="price-value">￥<span data-price="${id}">${price(id, state.tier)}</span></span><span class="price-period" data-period>${period}</span></div>
        <div class="credit-block">
          <div class="credit-wrap"><div class="credit-info"><img src="assets/figma/star-four.svg" alt=""><strong><span data-credits>${tier.credits}</span> ${p.credits}</strong><span>${p.perMonth}</span></div></div>
          <div class="plan-slider" data-plan-slider style="--progress:${tierProgress[state.tier]}">
            <span class="slider-fill" aria-hidden="true"></span>
            <span class="slider-ticks" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span class="slider-handle" aria-hidden="true"></span>
            <span class="slider-label" data-tier-label aria-hidden="true">${p.tierNames[state.tier]}</span>
            <input type="range" min="0" max="3" step="1" value="${state.tier}" aria-label="${p[id].name} · ${p.sliderLabel}" aria-valuetext="${p.tierNames[state.tier]}, ${tier.credits} ${p.credits}">
          </div>
        </div>
      </div>
      <button type="button" class="plan-button">${p.upgrade}</button>
      <ul class="plan-list">${listItems(p[id].list)}</ul>
    </article>`;

  $('#plan-grid').innerHTML = `
    <article class="plan-card community">
      <div class="plan-title">
        <p class="plan-desc">${p.community.desc}</p>
        <div class="plan-name"><h2>${p.community.name}</h2></div>
      </div>
      <div class="plan-price"><span class="price-value">￥0</span><span class="price-period">${p.free}</span></div>
      <div class="plan-info"><p>${p.community.info}</p></div>
      <a class="plan-button" href="#pricing">${p.download}</a>
      <ul class="plan-list">${listItems(p.community.list)}</ul>
    </article>
    ${paidCard('basic')}
    ${paidCard('pro')}`;
}

function syncTier() {
  // Sales-led annual seat quotes must never use personal monthly/tier prices.
  if (state.audience === 'team') {
    const b = businessPlans[state.lang];
    $$('[data-business-billing]').forEach(el => {
      el.textContent = state.billing === 'annual' ? b.annualNote : b.monthlyNote;
    });
    return;
  }
  const p = P();
  const tier = tiers[state.tier];
  $$('[data-price]').forEach(el => animateNumber(el, price(el.dataset.price, state.tier)));
  $$('[data-credits]').forEach(el => animateNumber(el, tier.credits));
  $$('[data-period]').forEach(el => { el.textContent = state.billing === 'annual' ? p.annual : p.monthly; });
  $$('[data-tier-label]').forEach(el => { el.textContent = p.tierNames[state.tier]; });
  $$('[data-plan-slider]').forEach(slider => {
    slider.style.setProperty('--progress', tierProgress[state.tier]);
    const input = slider.querySelector('input');
    input.value = String(state.tier);
    input.setAttribute('aria-valuetext', `${p.tierNames[state.tier]}, ${tier.credits} ${p.credits}`);
  });
  const tag = $('[data-first-month]');
  if (tag) tag.hidden = !(state.billing === 'monthly' && state.tier === 0);
}

function renderCompare() {
  const c = P().compare;
  const check = '<img src="assets/figma/check-circle.svg" alt="">';
  $('#compare').innerHTML = `
    <table class="compare-table">
      <thead class="compare-head"><tr>
        <th scope="col" class="lead"><span>${c.lead}<img src="assets/figma/chevron-down-12.svg" alt=""></span></th>
        ${c.cols.map(name => `<th scope="col" class="col">${name}</th>`).join('')}
      </tr></thead>
      <tbody class="compare-body">
        <tr><th colspan="5" class="compare-group"><img src="assets/figma/caret-down.svg" alt="">${c.group}</th></tr>
        ${c.rows.map(label => `<tr class="compare-row"><th scope="row" class="lead">${label}</th><td class="col">${check}</td><td class="col">${check}</td><td class="col">${check}</td><td class="col" title="${c.pending}">—</td></tr>`).join('')}
      </tbody>
    </table>`;
}

function renderAll() {
  renderPlans();
  renderCompare();
  applyLanguage();
}

// ---- Slider: pointer drag / keyboard through the native range input ----
function selectTier(next) {
  next = Math.max(0, Math.min(3, Math.round(next)));
  if (next === state.tier) return;
  state.tier = next;
  syncTier();
  $('#announcer').textContent = `${P().tierNames[state.tier]} · ${tiers[state.tier].credits} ${P().credits}`;
}
function tierFromPointer(slider, clientX) {
  const rect = slider.getBoundingClientRect();
  const x = (clientX - rect.left) / rect.width;
  // Match the four visual ticks at 25%, 50%, 75%, and 100%.
  return (x - 0.25) / 0.25;
}
let drag = null;
document.addEventListener('pointerdown', e => {
  const slider = e.target.closest('[data-plan-slider]');
  if (!slider || drag || e.button !== 0 || e.isPrimary === false) return;
  e.preventDefault();
  slider.setPointerCapture(e.pointerId);
  drag = { slider, id: e.pointerId };
  slider.querySelector('input').focus({ preventScroll: true });
  selectTier(tierFromPointer(slider, e.clientX));
});
document.addEventListener('pointermove', e => { if (drag && drag.id === e.pointerId) selectTier(tierFromPointer(drag.slider, e.clientX)); });
function finishDrag(e) {
  if (!drag || (e && drag.id !== e.pointerId)) return;
  const { slider, id } = drag;
  drag = null;
  if (slider.hasPointerCapture(id)) slider.releasePointerCapture(id);
}
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => document.addEventListener(type, finishDrag));
document.addEventListener('input', e => { if (e.target.matches('[data-plan-slider] input')) selectTier(Number(e.target.value)); });

// ---- Controls ----
document.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (btn.dataset.lang) { finishDrag(); state.lang = btn.dataset.lang; renderAll(); return; }
  if (btn.hasAttribute('data-billing-toggle')) {
    state.billing = state.billing === 'annual' ? 'monthly' : 'annual';
    syncTier();
    syncBillingToggle();
    return;
  }
  if (btn.hasAttribute('data-contact-sales')) {
    const b = businessPlans[state.lang];
    $('#announcer').textContent = `${b[btn.dataset.contactSales].name} · ${b.preview}`;
    return;
  }
  if (btn.dataset.audience) {
    finishDrag();
    state.audience = btn.dataset.audience;
    $$('[data-audience]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.audience === state.audience)));
    renderPlans();
    syncBillingToggle();
    $('#announcer').textContent = t(`audience.${state.audience}`);
  }
});
$('#newsletter-form').addEventListener('submit', e => e.preventDefault());

renderAll();
