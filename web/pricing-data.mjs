// Source: D5 AI积分定价完整方案.xlsx / 定价推演 （最终）, CNY column C.
// Prototype assumes all four monthly tiers; no annual or first-month promotion offered.
export const tiers = [
  { id: 'starter', name: '入门', credits: 1000, concurrency: '4', basic: 49, pro: 200 },
  { id: 'light', name: '轻量', credits: 2700, concurrency: '6', basic: 129, pro: 280 },
  { id: 'standard', name: '标准', credits: 6000, concurrency: '10', basic: 269, pro: 420 },
  { id: 'ultra', name: '旗舰', credits: 13000, concurrency: '不限', basic: 569, pro: 720 },
];
export const plans = { community: '社区版', basic: '基础版', pro: '专业版' };
export const formatNumber = value => value.toLocaleString('en-US');
export function entitlements(plan, tierIndex) {
  const t = tiers[tierIndex];
  if (!t || !Object.hasOwn(plans, plan)) throw new RangeError('Unknown plan or tier');
  if (plan === 'community') return { price: 0, credits: 0, concurrency: '2', image: '1K', video: '480P', models: '部分模型', commercial: 'AI 权益不可商用', arco: '消耗积分', render: '不支持', bonus: '不可充值', expiry: '—', downloads: '不可管理' };
  return { price: t[plan], credits: t.credits, concurrency: t.concurrency, image: plan === 'basic' && tierIndex === 0 ? '2K' : '4K', video: plan === 'basic' && tierIndex === 0 ? '720P' : '4K', models: '全部模型', commercial: plan === 'basic' ? 'AI 生成可商用' : '全部可商用¹', arco: '消耗积分', render: plan === 'pro' ? '不消耗积分' : '不支持', bonus: `${(plan === 'pro' ? 10 : 0) + (tierIndex >= 2 ? 10 : 0)}%`, expiry: plan === 'pro' ? '180 天' : '90 天', downloads: '下载管理' };
}
export function comparisonRows(index) {
  const values = ['community', 'basic', 'pro'].map(plan => entitlements(plan, index));
  const row = (label, key, format = v => v) => ({ label, values: values.map(v => format(v[key])) });
  return [
    { group: 'AI 创作与用量' },
    row('每月套餐积分', 'credits', v => v ? `${formatNumber(v)} 积分` : '无月度套餐'),
    row('并发任务', 'concurrency', v => v === '不限' ? v : `${v} 个`),
    row('AI 图片分辨率', 'image'), row('AI 视频分辨率', 'video'), row('可用模型', 'models'),
    { group: '工作流与成果使用' },
    row('Arco 内 AI 增强、放大', 'arco'), row('Render 内 AI 增强、放大', 'render'), row('商用范围', 'commercial'), row('分享下载', 'downloads'),
    { group: '充值权益' }, row('常态充值赠送', 'bonus'), row('充值积分有效期', 'expiry'),
  ];
}
