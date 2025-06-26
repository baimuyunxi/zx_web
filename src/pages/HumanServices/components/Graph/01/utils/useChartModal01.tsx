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
 * 职责：专注于状态管理，不涉及UI渲染
 */
export const useChartModal01 = () => {
  const [modalStates, setModalStates] = useState<ModalStates>({});

  // 显示模态框
  const showModal = (key: string, title: string) => {
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
  const handleModalClose = (key: string) => {
    setModalStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        visible: false,
      },
    }));
  };

  // 切换时间周期
  const handlePeriodChange = (key: string, period: '7days' | '30days') => {
    setModalStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        period: period,
      },
    }));
  };

  // 获取指定 key 的状态
  const getModalState = (key: string): ModalState => {
    return (
      modalStates[key] || {
        visible: false,
        period: '7days',
        title: '',
      }
    );
  };

  // 批量获取多个状态
  const getMultipleModalStates = (keys: string[]): ModalStates => {
    const result: ModalStates = {};
    keys.forEach((key) => {
      result[key] = getModalState(key);
    });
    return result;
  };

  // 重置所有状态
  const resetAllModals = () => {
    setModalStates({});
  };

  // 重置指定状态
  const resetModal = (key: string) => {
    setModalStates((prev) => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  };

  return {
    // 基础状态管理
    showModal,
    handleModalClose,
    handlePeriodChange,

    // 状态获取
    getModalState,
    getMultipleModalStates,

    // 状态重置
    resetAllModals,
    resetModal,

    // 调试用（保留兼容性）
    modalStates,
  };
};

// 预定义的图表配置
export const chartConfigs = {
  // 日指标配置
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
  // 月指标配置
  monthlyMetrics: [
    { key: 'monthly_calls_per_person', title: '语音人均月接话量' },
    { key: 'call_intensity', title: '语音通话强度' },
    { key: 'night_decline', title: '夜间语音人工接话量降幅' },
    { key: 'call_utilization', title: '语音通话利用率' },
  ],
} as const;

// 工具函数：从配置中提取所有的 keys
export const getAllChartKeys = (): string[] => {
  const dailyKeys = chartConfigs.dailyMetrics.map((config) => config.key);
  const monthlyKeys = chartConfigs.monthlyMetrics.map((config) => config.key);
  return [...dailyKeys, ...monthlyKeys];
};

// 工具函数：根据 key 查找标题
export const getChartTitleByKey = (key: string): string => {
  const allConfigs = [...chartConfigs.dailyMetrics, ...chartConfigs.monthlyMetrics];
  const config = allConfigs.find((config) => config.key === key);
  return config?.title || key;
};
