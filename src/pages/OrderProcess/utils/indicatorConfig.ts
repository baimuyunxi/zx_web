export const INDICATOR_CONFIGS = {
  // 接通率类指标（越高越好）
  ordersolve: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 86,
    name: '最严工单问题解决率',
  },
  orderdeclaration: {
    type: 'rate',
    direction: 'lower_better',
    threshold: 10,
    name: '最严工单申告率',
  },
  orderrepeat: {
    type: 'rate',
    direction: 'lower_better',
    threshold: 9,
    name: '投诉处理重复率',
  },
  moveorder: {
    type: 'rate',
    direction: 'lower_better',
    threshold: 9,
    name: '移动故障工单重复率（万号办结）',
  },
  bandorder: {
    type: 'rate',
    direction: 'lower_better',
    threshold: 9,
    name: '宽带故障工单重复率（万号办结）',
  },
  tsordersolve: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 95,
    name: '投诉工单问题解决率（省内参评口径）',
  },

  cxordersolve: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 95,
    name: '查询工单问题解决率（省内参评口径）',
  },

  gzordersolve: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 95,
    name: '故障工单问题解决率（省内参评口径）',
  },
  tsordertimerat: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 81,
    name: '投诉工单及时率',
  },
  tsorderoverrat: {
    type: 'rate',
    direction: 'neutral',
    name: '投诉工单逾限且催单率',
  },
  ydorderoverrat: {
    type: 'rate',
    direction: 'lower_better',
    threshold: 0.5,
    name: '移动故障工单逾限且催单率',
  },
  kdorderoverrat: {
    type: 'rate',
    direction: 'lower_better',
    threshold: 1,
    name: '宽带故障工单逾限且催单率',
  },
  kdonlinepre: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 29,
    name: '宽带在线预处理率',
  },
  kdorderpre: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 95,
    name: '宽带故障预处理及时率',
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
