// Three-step plan finder. Monthly and annual prices reuse the existing pricing data.
// Default recommendation: design planning + 3D rendering, Standard, top-up benefits.
(() => {
  const selection = { goals: new Set([2, 3]), tier: 2, manualTier: false, offer: '2' };
  const root = document.querySelector('#plan-finder');
  const words = {
    zh: {
      title: '选择适合你的方案', subtitle: '让创作走的更远',
      questions: ['你想完成哪类创作？', '你的创作频率大概是怎样？', '选择你心动的优惠'],
      goals: ['个人兴趣及探索', 'AI 图片与视频生成', '设计项目策划和汇报', '更高品质、更可控的 3D 渲染', '可漫游及互动的 3D 演示'],
      goalHints: ['尝试 AI 创作，探索灵感和不同表达', '生成图片、视频，进行多轮创意迭代', '辅助方案构思、视觉表达和项目汇报', '使用更多 D5 产品，完成更精细的渲染表达', '制作可漫游、可互动的空间演示'],
      usage: ['偶尔尝试', '稳定创作', '持续交付', '批量生产'], offers: ['首月优惠', '长期订阅更省', '充值获赠更多'],
      offerHints: ['降低第一次购买的成本', '持续使用，关注长期成本', '额外购买 AI 点数，获得更多赠送'],
      monthly: '按月', annual: '按年', perYear: '/年', equivalent: '折合', annualTotal: '年付总额', annualSaving: '较连续月付 12 个月节省', perMonth: '/月', credits: 'AI 点数', tasks: '个并发任务', unlimited: '并发任务不限',
      recommended: '推荐方案', why: '推荐理由',
      firstOffer: '首月优惠需确认购买资格，当前按常规月价展示；后续正常价格不变。', firstOfferAnnual: '首月优惠适用于符合资格的月付购买，当前展示年付价格。',
      basicReason: '主要使用 Arco，支持你的灵感探索、AI 图片与视频创作，以及设计策划和汇报。',
      proReason: '专业版支持全部 D5 产品，覆盖从创意到生产的完整工作流。',
      noBonus: '充值无额外赠送', bonus: '充值额外赠送', expiry: '充值点数', days: '天有效',
      choose: '选择', proChoose: '开始使用 D5 工作流', preview: '方案预览', previewNote: '购买通道尚未接入。你可以继续调整方案，当前不会创建订单或扣款。', close: '继续调整',
    },
    en: {
      title: 'Choose the right plan for you', subtitle: 'Take your creativity further',
      questions: ['What would you like to create?', 'How often do you create?', 'Choose the offer you love'],
      goals: ['Personal exploration', 'AI image and video creation', 'Design planning and presentations', 'Higher-quality, more controllable 3D rendering', 'Walkthroughs and interactive 3D presentations'],
      goalHints: ['Explore inspiration and new creative styles', 'Generate images and videos and iterate on ideas', 'Develop concepts, visuals and project presentations', 'Use more D5 products for refined rendering', 'Create immersive, interactive spatial presentations'],
      usage: ['Explore occasionally', 'Create regularly', 'Deliver consistently', 'Produce at scale'], offers: ['First-month offer', 'Long-term savings', 'More top-up credits'],
      offerHints: ['Lower the cost of your first purchase', 'Reduce costs over continued use', 'Get more credits when topping up'],
      monthly: 'Monthly', annual: 'Yearly', perYear: '/year', equivalent: 'Equivalent to', annualTotal: 'Annual total', annualSaving: 'Saved compared with 12 monthly payments', perMonth: '/mo', credits: 'AI credits', tasks: 'concurrent tasks', unlimited: 'Unlimited concurrent tasks',
      recommended: 'Recommended plan', why: 'Why we recommend it',
      firstOffer: 'First-month offers depend on eligibility. Regular monthly pricing is shown, including the ongoing price.', firstOfferAnnual: 'First-month offers apply to eligible monthly purchases. Yearly pricing is currently shown.',
      basicReason: 'Arco supports your exploration, AI image and video creation, design planning and presentations.', proReason: 'Pro supports all D5 products, covering the complete workflow from ideation to production.',
      noBonus: 'No top-up bonus', bonus: 'Top-up bonus', expiry: 'Top-up credits valid for', days: 'days',
      choose: 'Choose', proChoose: 'Start using D5 Workflow', preview: 'Plan preview', previewNote: 'Checkout is not connected yet. You can keep adjusting your plan; no order or charge will be created.', close: 'Keep exploring',
    },
  };
  const w = () => words[state.lang];
  const q = selector => root.querySelector(selector);
  const format = n => n.toLocaleString('en-US');
  const plan = () => [...selection.goals].some(i => i >= 3) ? 'pro' : 'basic';
  const asset = name => `assets/figma/${name}.svg`;

  function render() {
    const c = w();
    document.querySelector('#workflow-title').textContent = c.title;
    document.querySelector('#workflow .section-head p').textContent = c.subtitle;
    root.innerHTML = `
      <div class="finder-steps">
        ${c.questions.map((question, step) => `<div class="finder-step"><fieldset>
          <legend><span class="step-number">0${step + 1}</span>${question}</legend>
          <div class="finder-options ${step === 0 ? 'goal-options' : ''}">
            ${step === 0 ? c.goals.map((label, i) => `<label class="finder-option goal-option" title="${c.goalHints[i]}">
              <input type="checkbox" name="creative-goal" value="${i}">
              <img class="goal-icon" src="${asset('goal-unchecked')}" alt=""><span>${label}</span>
            </label>`).join('') : step === 1 ? c.usage.map((label, i) => `<label class="finder-option usage-option">
              <input type="radio" name="finder-usage" value="${i}"><span>${label}<small>${format(tiers[i].credits)} ${c.credits}${c.perMonth}</small></span>
            </label>`).join('') : c.offers.map((label, i) => `<label class="finder-option offer-option" title="${c.offerHints[i]}">
              <input type="radio" name="finder-offer" value="${i}"><span>${label}</span>
            </label>`).join('')}
          </div>
        </fieldset>
          ${step < 2 ? `<div class="step-connector" aria-hidden="true"><img src="${asset(`step-line-${step + 1}`)}" alt=""></div>` : ''}
        </div>`).join('')}
      </div>
      <aside class="finder-result" aria-label="${c.recommended}">
        <div class="finder-result-box">
        <p class="finder-eyebrow">${c.recommended}</p>
        <div class="finder-billing"><span>${c.monthly}</span><button class="toggle" type="button" data-finder-billing aria-pressed="false"><span></span></button><span class="finder-annual">${c.annual}<b class="finder-discount" data-finder-discount></b></span></div>
        <div class="finder-result-content">
          <div class="finder-summary" aria-live="polite" aria-atomic="true"></div>
          <div class="credit-block">
            <div class="credit-wrap"><div class="credit-info"><span class="finder-star"><img src="${asset('recommend-star')}" alt=""></span><strong data-finder-credits></strong><span>${c.perMonth}</span></div></div>
            <div class="plan-slider finder-slider">
              <span class="slider-fill" aria-hidden="true"></span><span class="finder-ticks" aria-hidden="true"><img src="${asset('recommend-ticks')}" alt=""></span><span class="slider-handle" aria-hidden="true"></span><span class="slider-label" aria-hidden="true"></span>
              <input type="range" min="0" max="3" step="1" aria-label="${P().sliderLabel}">
            </div>
          </div>
          <div class="finder-explanation"></div>
          <button class="plan-button finder-choose" type="button"></button>
        </div>
        </div>
      </aside>
      <dialog class="finder-dialog" aria-labelledby="finder-dialog-title"><h3 id="finder-dialog-title">${c.preview}</h3><p data-preview-summary></p><p>${c.previewNote}</p><form method="dialog"><button class="plan-button">${c.close}</button></form></dialog>`;
    sync();
  }

  function sync() {
    const c = w(), id = plan(), pro = id === 'pro', tier = tiers[selection.tier];
    root.querySelectorAll('[name="creative-goal"]').forEach(input => {
      input.checked = selection.goals.has(Number(input.value));
      input.nextElementSibling.src = asset(input.checked ? 'goal-checked' : 'goal-unchecked');
    });
    root.querySelectorAll('[name="finder-usage"]').forEach(input => { input.checked = Number(input.value) === selection.tier; });
    root.querySelectorAll('[name="finder-offer"]').forEach(input => { input.checked = input.value === selection.offer; });
    const annual = state.billing === 'annual';
    const amount = annual ? tier[`${id}Annual`] : tier[id];
    const period = annual ? c.perYear : c.perMonth;
    const annualAmount = tier[`${id}Annual`];
    const monthlyEquivalent = format(Number((annualAmount / 12).toFixed(2)));
    const annualSaving = format(tier[id] * 12 - annualAmount);
    const discount = Math.round((1 - annualAmount / (tier[id] * 12)) * 100);
    q('[data-finder-discount]').textContent = state.lang === 'zh' ? `省 ${discount}%` : `Save ${discount}%`;
    const annualOffer = `${c.annualTotal} ￥${format(annualAmount)}${c.perYear} · ${c.equivalent} ￥${monthlyEquivalent}${c.perMonth} · ${c.annualSaving} ￥${annualSaving}`;
    const toggle = q('[data-finder-billing]');
    toggle.setAttribute('aria-pressed', String(annual));
    toggle.setAttribute('aria-label', t(annual ? 'billing.toMonthly' : 'billing.toAnnual'));
    const name = `${P()[id].name} · ${P().tierNames[selection.tier]}`;
    const concurrency = selection.tier === 3 ? c.unlimited : `${[4, 6, 10][selection.tier]} ${c.tasks}`;
    q('.finder-summary').innerHTML = `<h3>${name}</h3><div class="plan-price"><span class="price-value">￥${format(amount)}</span><span class="price-period">${period}</span></div>${annual ? `<p class="finder-hint">${c.equivalent} ￥${monthlyEquivalent}${c.perMonth}</p>` : ''}<p class="finder-hint">${concurrency}</p>`;
    q('[data-finder-credits]').textContent = `${format(tier.credits)} ${c.credits}`;
    q('.finder-slider').style.setProperty('--progress', tierProgress[selection.tier]);
    q('.slider-label').textContent = P().tierNames[selection.tier];
    const slider = q('input[type="range"]');
    slider.value = selection.tier;
    slider.setAttribute('aria-valuetext', `${P().tierNames[selection.tier]}, ${format(tier.credits)} ${c.credits}${c.perMonth}`);
    const bonus = (pro ? 10 : 0) + (selection.tier >= 2 ? 10 : 0);
    const topup = `${bonus ? `${c.bonus} ${bonus}%` : c.noBonus}${state.lang === 'zh' ? '，' : ', '}${c.expiry} ${pro ? 180 : 90} ${c.days}${state.lang === 'zh' ? '。' : '.'}`;
    const offer = selection.offer === '0' ? (annual ? c.firstOfferAnnual : c.firstOffer) : selection.offer === '1' ? annualOffer : topup;
    q('.finder-explanation').innerHTML = `<div><h4>${c.why}</h4><p>${pro ? c.proReason : c.basicReason}</p></div>
      <div class="finder-offer-note"><h4>${c.offers[Number(selection.offer)]}</h4><p>${offer}</p></div>`;
    q('.finder-choose').textContent = pro ? c.proChoose : `${c.choose} ${name}`;
    q('[data-preview-summary]').textContent = `${name} · ￥${format(amount)}${period} · ${format(tier.credits)} ${c.credits}${c.perMonth}`;
  }

  root.addEventListener('change', event => {
    const input = event.target;
    if (input.name === 'creative-goal') {
      const goal = Number(input.value);
      if (input.checked) selection.goals.add(goal);
      else if (selection.goals.size > 1) selection.goals.delete(goal);
      if (!selection.manualTier) selection.tier = Math.max(0, ...[...selection.goals].filter(i => i < 3));
    } else if (input.name === 'finder-usage') {
      selection.tier = Number(input.value); selection.manualTier = true;
    } else if (input.name === 'finder-offer') {
      selection.offer = input.value;
      if (selection.offer !== '2') {
        state.billing = selection.offer === '1' ? 'annual' : 'monthly';
        syncTier();
        syncBillingToggle();
      }
    }
    else return;
    sync();
  });
  // Match the existing card slider: tiers sit at 25%, 50%, 75% and 100%.
  let pointerDrag = null;
  function setPointerTier(slider, x) {
    const bounds = slider.getBoundingClientRect();
    selection.tier = Math.max(0, Math.min(3, Math.round(((x - bounds.left) / bounds.width - .25) / .25)));
    selection.manualTier = true;
    sync();
  }
  root.addEventListener('pointerdown', event => {
    const slider = event.target.closest('.finder-slider');
    if (!slider || pointerDrag || event.button !== 0 || event.isPrimary === false) return;
    event.preventDefault();
    slider.setPointerCapture(event.pointerId);
    pointerDrag = { slider, id: event.pointerId };
    slider.querySelector('input').focus({ preventScroll: true });
    setPointerTier(slider, event.clientX);
  });
  root.addEventListener('pointermove', event => {
    if (pointerDrag?.id === event.pointerId) setPointerTier(pointerDrag.slider, event.clientX);
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    root.addEventListener(name, event => {
      if (pointerDrag?.id !== event.pointerId) return;
      const { slider, id } = pointerDrag;
      pointerDrag = null;
      if (slider.hasPointerCapture(id)) slider.releasePointerCapture(id);
    });
  }
  root.addEventListener('input', event => {
    if (event.target.type !== 'range') return;
    selection.tier = Number(event.target.value); selection.manualTier = true; sync();
  });
  root.addEventListener('click', event => {
    if (event.target.closest('[data-finder-billing]')) {
      state.billing = state.billing === 'annual' ? 'monthly' : 'annual';
      syncTier();
      syncBillingToggle();
      sync();
    }
    if (event.target.closest('.finder-choose')) q('dialog').showModal();
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-lang]')) render();
    else if (event.target.closest('[data-billing-toggle]')) sync();
  });
  render();
})();
