import { useState } from 'react';

// 模态框状态类型定义
export interface ModalState {
  visible: boolean;
  period: '7days' | '30days';
  title: string;
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
 * 专注于日指标的状态管理，支持周期切换
 */
export const useChartModal01 = () => {
  const [modalStates, setModalStates] = useState<ModalStates>({});

  // 显示模态框
  const showModal01 = (key: string, title: string, chartData: any) => {
    setModalStates((prev) => ({
      ...prev,
      [key]: {
        visible: true,
        period: '7days', // 默认7天
        title: title,
      },
    }));
  };

  // 关闭模态框
  const handleModalClose01 = (key: string) => {
    setModalStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        visible: false,
      },
    }));
  };

  // 切换时间周期
  const handlePeriodChange01 = (key: string, period: '7days' | '30days') => {
    setModalStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        period: period,
      },
    }));
  };

  // 获取指定 key 的状态
  const getModalState01 = (key: string): ModalState => {
    return (
      modalStates[key] || {
        visible: false,
        period: '7days',
        title: '',
      }
    );
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
