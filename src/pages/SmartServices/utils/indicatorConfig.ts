export const INDICATOR_CONFIGS = {
  // 接通率类指标（越高越好）
  intelLigentCus: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 92,
    name: '智能语音客服占比',
  },
  onlineCustRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 27,
    name: '在线客服比',
  },
  intelLsoluRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 80,
    name: '智能客服来话一解率',
  },
  seifServiceRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 80,
    name: '语音自助话务占比',
  },

  intelLigentrgRate: {
    type: 'rate',
    direction: 'lower_better',
    threshold: 22,
    name: '智能客服转人工率',
  },
} as const;


// 新增：获取指标趋势的好坏判断
export const getIndicatorTrendGoodness = (
  indicatorKey: string,
  numericValue: number,
): 'good' | 'bad' | 'neutral' => {
  const config = INDICATOR_CONFIGS[indicatorKey as keyof typeof INDICATOR_CONFIGS];

  if (!config) {
    return 'neutral'; // 默认中性
  }

  // 对于有明确方向偏好的指标
  if (config.direction === 'higher_better') {
    // 越高越好的指标：增长为好，下降为坏
    return numericValue > 0 ? 'good' : 'bad';
  } else if (config.direction === 'lower_better') {
    // 越低越好的指标：下降为好，增长为坏
    return numericValue < 0 ? 'good' : 'bad';
  }

  return 'neutral';
};
