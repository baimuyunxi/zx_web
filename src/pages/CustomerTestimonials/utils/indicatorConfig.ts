export const INDICATOR_CONFIGS = {
  // 接通率类指标（越高越好）
  tssatorderpre: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 85,
    name: '投诉工单测评满意率',
  },
  tssatsolutionRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 70,
    name: '投诉工单测评解决率',
  },
  zizusatRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 85,
    name: '自助测评满意率',
  },
  cudiansatRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 80,
    name: '各触点测评解决率',
  },
  instSatisfactionRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 98,
    name: '语音客服即时满意率',
  },
  resolutionRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 90,
    name: '语音客服即时解决率',
  },
  IMInstantRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 95,
    name: '投诉工单测评解决率',
  },
  IMSolveRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 85,
    name: '文字客服即时解决率',
  },
  RemoteInstantRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 95,
    name: '远程柜台即时满意率',
  },
  RemoteSolveRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 90,
    name: '远程柜台即时解决率',
  },
  ydordersatpre: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 89,
    name: '移动故障用后即评10分满意率',
  },
  kdordersatpre: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 70,
    name: '宽带故障用后即评10分满意率',
  },
  commentAfterwards: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 85,
    name: '语音客服话后即评10分满意率',
  },
  xianshangsatRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 80,
    name: '线上调查综合类十分满意率',
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
