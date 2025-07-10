import moment from 'moment';

// 指标数据接口
export interface IndicatorData {
  PDayId: string;
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
  console.log('processIndicatorData - Input response:', response);

  const { data, maxPDayId, pdDate, threshold } = response;

  // 检查数据是否同步 - 修复判断逻辑
  const isDataSynced = pdDate && data && data.length > 0;
  console.log('Data sync check:', {
    pdDate,
    hasData: !!data,
    dataLength: data?.length || 0,
    isDataSynced,
  });

  if (!isDataSynced) {
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
  console.log('Latest data:', latestData);

  // 处理日期标签和颜色
  const { dateTag, dateColor } = processDateTag(maxPDayId);

  // 处理图表数据 - 默认显示7天
  const chartData = processChartData(data, '7days');

  // 格式化数值
  const currentValue = latestData.prevDay || 0;
  const monthValue = latestData.currentMonthCumulative || 0;
  const dayRatio = latestData.momRate || 0;
  const monthRatio = latestData.monthMomRate || 0;

  const result = {
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

  console.log('processIndicatorData - Output result:', result);
  return result;
};

/**
 * 处理日期标签和颜色
 * @param maxPDayId 最大日期ID
 * @returns 日期标签和颜色
 */
const processDateTag = (maxPDayId: string): { dateTag: string; dateColor: string } => {
  console.log('processDateTag - Input maxPDayId:', maxPDayId);

  if (!maxPDayId) {
    return { dateTag: '暂无数据', dateColor: '#f50' };
  }

  // 获取昨天的日期
  const yesterday = moment().subtract(1, 'day');
  const yesterdayFormatted = yesterday.format('M月D日');

  console.log('Date comparison:', { maxPDayId, yesterdayFormatted });

  // 判断是否为昨天
  const isYesterday = maxPDayId === yesterdayFormatted;

  const result = {
    dateTag: maxPDayId,
    dateColor: isYesterday ? 'orange' : '#f50',
  };

  console.log('processDateTag - Output result:', result);
  return result;
};

/**
 * 处理图表数据
 * @param data 原始数据数组
 * @param period 时间周期
 * @returns 图表数据
 */
const processChartData = (
  data: IndicatorData[],
  period: '7days' | '30days' = '7days',
): {
  volumeData: number[];
  ratioData: number[];
  categories: string[];
} => {
  console.log('processChartData - Input:', { dataLength: data?.length || 0, period });

  if (!data || data.length === 0) {
    console.log('processChartData - No data, returning empty');
    return {
      volumeData: [],
      ratioData: [],
      categories: [],
    };
  }

  // 数据已按pDayId降序排序，需要反转为升序以便图表显示
  const reversedData = [...data].reverse();

  // 根据周期限制数据量
  const limitedData =
    period === '7days'
      ? reversedData.slice(-7) // 取最后7天
      : reversedData.slice(-30); // 取最后30天

  console.log('processChartData - Data processing:', {
    originalLength: data.length,
    reversedLength: reversedData.length,
    limitedLength: limitedData.length,
    period,
    sampleData: limitedData.slice(0, 3).map((item) => ({
      PDayId: item.PDayId,
      prevDay: item.prevDay,
    })),
  });

  const volumeData = limitedData.map((item) => item.prevDay || 0);
  const ratioData = limitedData.map((item) => item.momRate || 0);
  const categories = limitedData.map((item) => formatDateForChart(item.PDayId));

  console.log('processChartData - Generated categories:', categories);
  console.log('processChartData - Generated volumeData:', volumeData);
  console.log('processChartData - Generated ratioData:', ratioData);

  return {
    volumeData,
    ratioData,
    categories,
  };
};

/**
 * 根据指定周期重新处理图表数据
 * @param data 原始数据数组
 * @param period 时间周期
 * @returns 图表数据
 */
export const reprocessChartDataByPeriod = (
  data: IndicatorData[],
  period: '7days' | '30days',
): {
  volumeData: number[];
  ratioData: number[];
  categories: string[];
} => {
  console.log('reprocessChartDataByPeriod called with:', { dataLength: data?.length || 0, period });
  return processChartData(data, period);
};

/**
 * 格式化日期用于图表显示
 * @param PDayId 日期ID (yyyyMMdd格式)
 * @returns 格式化后的日期字符串
 */
const formatDateForChart = (PDayId: string): string => {
  console.log('formatDateForChart - Input PDayId:', PDayId);

  if (!PDayId) {
    console.log('formatDateForChart - Empty PDayId, returning empty string');
    return '';
  }

  if (PDayId.length !== 8) {
    console.log('formatDateForChart - Invalid PDayId length:', PDayId.length, 'returning as-is');
    return PDayId;
  }

  try {
    const year = PDayId.substring(0, 4);
    const month = PDayId.substring(4, 6);
    const day = PDayId.substring(6, 8);

    // 去掉前导零
    const monthInt = parseInt(month, 10);
    const dayInt = parseInt(day, 10);

    const result = `${monthInt}月${dayInt}日`;
    console.log('formatDateForChart - Formatted result:', { PDayId, result });
    return result;
  } catch (error) {
    console.error('formatDateForChart - Error formatting:', error, 'PDayId:', PDayId);
    return PDayId;
  }
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
