export const INDICATOR_CONFIGS = {
  // 接通率类指标（越高越好）
  conn15Rate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 85,
    name: '语音客服15秒接通率',
  },
  word5Rate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 90,
    name: '文字客服5分钟接通率',
  },
  farCabinetRate: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 80,
    name: '远程柜台25秒接通率',
  },
  '10009_15s_rate': {
    type: 'rate',
    direction: 'higher_better',
    threshold: 85,
    name: '10009号15秒接通率',
  },
  artConnRt: {
    type: 'rate',
    direction: 'higher_better',
    threshold: 95,
    name: '10000号适老化接通率',
  },
  onceRate: { type: 'rate', direction: 'higher_better', threshold: 85, name: '10000号人工一解率' },

  // 重复来电率（越低越好）
  repeatRate: { type: 'rate', direction: 'lower_better', threshold: 5, name: '10000号重复来电率' },

  // 呼入量类指标（保持中性）
  wanHaoCt: { type: 'volume', direction: 'lower_better', name: '万号人工话务总量' },
  artCallinCt: { type: 'volume', direction: 'lower_better', name: '语音人工呼入量' },
  wordCallinCt: { type: 'volume', direction: 'neutral', name: '文字客服呼入量' },
  farCabinetCt: { type: 'volume', direction: 'neutral', name: '远程柜台呼入量' },

  // 月指标（新增）
  voiceUseRate: {
    type: 'rate',
    direction: 'higher_better', // 修改：下降为好的趋势（绿色）
    threshold: 73.8,
    name: '语音通话利用率',
  },
  voicePerCapitaCt: {
    type: 'volume',
    direction: 'higher_better',
    threshold: 2632,
    name: '语音人均月接话量',
  },
  voiceCallinTensityCt: {
    type: 'volume',
    direction: 'higher_better',
    threshold: 133,
    name: '语音通话强度',
  },
  voiceDecreaseCt: {
    type: 'volume',
    direction: 'lower_better',
    name: '夜间语音人工接通量降幅',
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

  // 对于中性方向的指标，保持中性
  if (config.direction === 'neutral') {
    return 'neutral';
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
