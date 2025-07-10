import { useState } from 'react';

// 图表数据接口
export interface ChartData {
  volumeData: number[];
  ratioData: number[];
  categories: string[];
}

// 模态框状态类型定义
export interface ModalState {
  visible: boolean;
  period: '7days' | '30days';
  title: string;
  chartData?: ChartData; // 添加图表数据支持
}

// 模态框状态管理
export interface ModalStates {
  [key: string]: ModalState;
}

// 图表配置类型
export interface ChartConfig {
  key: string;
  title: string;
}

/**
 * 图表模态框状态管理 Hook
 * 专注于日指标的状态管理，支持周期切换和图表数据传递
 */
export const useChartModal01 = () => {
  const [modalStates, setModalStates] = useState<ModalStates>({});

  // 显示模态框 - 支持传递图表数据
  const showModal01 = (key: string, title: string, chartData?: ChartData) => {
    console.log('showModal01 called with:', { key, title, chartData }); // 调试输出
    setModalStates((prev) => ({
      ...prev,
      [key]: {
        visible: true,
        period: '7days', // 默认7天
        title: title,
        chartData: chartData, // 存储图表数据
      },
    }));
  };

  // 关闭模态框
  const handleModalClose01 = (key?: string) => {
    if (key) {
      // 关闭指定的模态框
      setModalStates((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          visible: false,
        },
      }));
    } else {
      // 关闭所有模态框（兼容旧版本调用）
      setModalStates((prev) => {
        const newStates = { ...prev };
        Object.keys(newStates).forEach((modalKey) => {
          newStates[modalKey] = {
            ...newStates[modalKey],
            visible: false,
          };
        });
        return newStates;
      });
    }
  };

  // 切换时间周期
  const handlePeriodChange01 = (
    keyOrPeriod: string | '7days' | '30days',
    period?: '7days' | '30days',
  ) => {
    if (period) {
      // 新版本调用：handlePeriodChange01(key, period)
      const key = keyOrPeriod as string;
      setModalStates((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          period: period,
        },
      }));
    } else {
      // 旧版本调用：handlePeriodChange01(period) - 应用到当前打开的模态框
      const newPeriod = keyOrPeriod as '7days' | '30days';
      setModalStates((prev) => {
        const newStates = { ...prev };
        Object.keys(newStates).forEach((modalKey) => {
          if (newStates[modalKey].visible) {
            newStates[modalKey] = {
              ...newStates[modalKey],
              period: newPeriod,
            };
          }
        });
        return newStates;
      });
    }
  };

  // 获取指定 key 的状态
  const getModalState01 = (key?: string): ModalState => {
    if (key) {
      // 获取指定key的状态
      return (
        modalStates[key] || {
          visible: false,
          period: '7days',
          title: '',
          chartData: undefined,
        }
      );
    } else {
      // 兼容旧版本：返回第一个打开的模态框状态
      const openModal = Object.entries(modalStates).find(([, state]) => state.visible);
      return openModal
        ? openModal[1]
        : {
            visible: false,
            period: '7days',
            title: '',
            chartData: undefined,
          };
    }
  };

  return {
    // 基础状态管理
    showModal01,
    handleModalClose01,
    handlePeriodChange01,

    // 状态获取
    getModalState01,

    // 调试用（保留兼容性）
    modalStates,
  };
};

// 预定义的日指标图表配置
export const chartConfigs = {
  dailyMetrics: [
    { key: 'total_volume', title: '万号人工话务总量' },
    { key: 'voice_calls', title: '语音人工呼入量' },
    { key: 'text_service', title: '文字客服呼入量' },
    { key: 'remote_counter', title: '远程柜台呼入量' },
    { key: 'voice_15s_rate', title: '语音客服15秒接通率' },
    { key: 'text_5min_rate', title: '文字客服5分钟接通率' },
    { key: 'remote_25s_rate', title: '远程柜台25秒接通率' },
    { key: '10009_15s_rate', title: '10009号15秒接通率' },
    { key: 'senior_rate', title: '10000号适老化接通率' },
    { key: 'first_solution_rate', title: '10000号人工一解率' },
    { key: 'repeat_call_rate', title: '10000号重复来电率' },
  ],
} as const;

// 工具函数：从配置中提取所有的 keys
export const getAllChartKeys = (): string[] => {
  return chartConfigs.dailyMetrics.map((config) => config.key);
};

// 工具函数：根据 key 查找标题
export const getChartTitleByKey = (key: string): string => {
  const config = chartConfigs.dailyMetrics.find((config) => config.key === key);
  return config?.title || key;
};
