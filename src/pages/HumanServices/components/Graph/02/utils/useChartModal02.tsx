import { useState } from 'react';

// 图表数据接口
export interface ChartData {
  volumeData: number[];
  ratioData: number[];
  categories: string[];
}

// 模态框状态类型定义 - 添加图表数据支持
export interface ModalState {
  visible: boolean;
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
 * 专注于月指标的状态管理，支持图表数据传递
 */
export const useChartModal02 = () => {
  const [modalStates, setModalStates] = useState<ModalStates>({});

  // 显示模态框 - 支持传递图表数据
  const showModal02 = (key: string, title: string, chartData?: ChartData) => {
    console.log('showModal02 called with:', { key, title, chartData }); // 调试输出
    setModalStates((prev) => ({
      ...prev,
      [key]: {
        visible: true,
        title: title,
        chartData: chartData, // 存储图表数据
      },
    }));
  };

  // 关闭模态框
  const handleModalClose02 = (key: string) => {
    setModalStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        visible: false,
      },
    }));
  };

  // 获取指定 key 的状态
  const getModalState02 = (key: string): ModalState => {
    return (
      modalStates[key] || {
        visible: false,
        title: '',
        chartData: undefined,
      }
    );
  };

  return {
    // 基础状态管理
    showModal02,
    handleModalClose02,

    // 状态获取
    getModalState02,

    // 调试用（保留兼容性）
    modalStates,
  };
};

// 预定义的图表配置 - 只保留月指标
export const chartConfigs = {
  monthlyMetrics: [
    { key: 'monthly_calls_per_person', title: '语音人均月接话量' },
    { key: 'call_intensity', title: '语音通话强度' },
    { key: 'night_decline', title: '夜间语音人工接话量降幅' },
    { key: 'call_utilization', title: '语音通话利用率' },
  ],
} as const;

// 工具函数：从配置中提取所有的 keys
export const getAllChartKeys = (): string[] => {
  return chartConfigs.monthlyMetrics.map((config) => config.key);
};

// 工具函数：根据 key 查找标题
export const getChartTitleByKey = (key: string): string => {
  const config = chartConfigs.monthlyMetrics.find((config) => config.key === key);
  return config?.title || key;
};
