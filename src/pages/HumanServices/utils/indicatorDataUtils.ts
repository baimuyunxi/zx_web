import moment from 'moment';

// 指标数据接口
export interface IndicatorData {
  pDayId: string;
  prevDay: number;
  prevMonth: number;
  momRate: number;
  currentMonthCumulative: number;
  prevMonthCumulative: number;
  monthMomRate: number;
}

// 接口返回数据结构
export interface IndicatorResponse {
  data: IndicatorData[];
  maxPDayId: string;
  pdDate: boolean;
  threshold?: string;
  code: number;
  message: string;
}

// 处理后的数据结构
export interface ProcessedIndicatorData {
  currentValue: number;
  monthValue: number;
  dayRatio: number;
  monthRatio: number;
  dateTag: string;
  dateColor: string;
  chartData: {
    volumeData: number[];
    ratioData: number[];
    categories: string[];
  };
  isDataSynced: boolean;
  threshold?: string;
}

/**
 * 处理指标数据
 * @param response 后端返回的数据
 * @returns 处理后的数据
 */
export const processIndicatorData = (response: IndicatorResponse): ProcessedIndicatorData => {
  const { data, maxPDayId, pdDate, threshold } = response;

  // 检查数据是否同步
  if (!pdDate || !data || data.length === 0) {
    return {
      currentValue: 0,
      monthValue: 0,
      dayRatio: 0,
      monthRatio: 0,
      dateTag: maxPDayId || '暂无数据',
      dateColor: '#f50',
      chartData: {
        volumeData: [],
        ratioData: [],
        categories: [],
      },
      isDataSynced: false,
      threshold,
    };
  }

  // 获取最新数据（pDayId最大的数据）
  const latestData = data[0]; // 数据已按pDayId降序排序

  // 处理日期标签和颜色
  const { dateTag, dateColor } = processDateTag(maxPDayId);

  // 处理图表数据
  const chartData = processChartData(data);

  // 格式化数值
  const currentValue = latestData.prevDay || 0;
  const monthValue = latestData.currentMonthCumulative || 0;
  const dayRatio = latestData.momRate || 0;
  const monthRatio = latestData.monthMomRate || 0;

  return {
    currentValue,
    monthValue,
    dayRatio,
    monthRatio,
    dateTag,
    dateColor,
    chartData,
    isDataSynced: true,
    threshold,
  };
};

/**
 * 处理日期标签和颜色
 * @param maxPDayId 最大日期ID
 * @returns 日期标签和颜色
 */
const processDateTag = (maxPDayId: string): { dateTag: string; dateColor: string } => {
  if (!maxPDayId) {
    return { dateTag: '暂无数据', dateColor: '#f50' };
  }

  // 获取昨天的日期
  const yesterday = moment().subtract(1, 'day');
  const yesterdayFormatted = yesterday.format('M月D日');

  // 判断是否为昨天
  const isYesterday = maxPDayId === yesterdayFormatted;

  return {
    dateTag: maxPDayId,
    dateColor: isYesterday ? 'orange' : '#f50',
  };
};

/**
 * 处理图表数据
 * @param data 原始数据数组
 * @returns 图表数据
 */
const processChartData = (
  data: IndicatorData[],
): {
  volumeData: number[];
  ratioData: number[];
  categories: string[];
} => {
  if (!data || data.length === 0) {
    return {
      volumeData: [],
      ratioData: [],
      categories: [],
    };
  }

  // 数据已按pDayId降序排序，需要反转为升序以便图表显示
  const reversedData = [...data].reverse();

  const volumeData = reversedData.map((item) => item.prevDay || 0);
  const ratioData = reversedData.map((item) => item.momRate || 0);
  const categories = reversedData.map((item) => formatDateForChart(item.pDayId));

  return {
    volumeData,
    ratioData,
    categories,
  };
};

/**
 * 格式化日期用于图表显示
 * @param pDayId 日期ID (yyyyMMdd格式)
 * @returns 格式化后的日期字符串
 */
const formatDateForChart = (pDayId: string): string => {
  if (!pDayId || pDayId.length !== 8) {
    return pDayId;
  }

  const year = pDayId.substring(0, 4);
  const month = pDayId.substring(4, 6);
  const day = pDayId.substring(6, 8);

  // 去掉前导零
  const monthInt = parseInt(month, 10);
  const dayInt = parseInt(day, 10);

  return `${monthInt}/${dayInt}`;
};

/**
 * 格式化数值显示
 * @param value 数值
 * @param unit 单位
 * @returns 格式化后的字符串
 */
export const formatValue = (value: number, unit: string): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万${unit}`;
  }
  return `${value}${unit}`;
};

/**
 * 格式化百分比显示
 * @param value 数值
 * @returns 格式化后的百分比字符串
 */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

/**
 * 格式化PP单位显示
 * @param value 数值
 * @returns 格式化后的PP字符串
 */
export const formatPP = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}PP`;
};
