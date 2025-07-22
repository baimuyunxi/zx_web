import React from 'react';
import { Modal, Radio } from 'antd';
import ServiceVolumeChart01 from '@/pages/HumanServices/components/Graph/01/ServiceVolumeChart01';
import { ChartConfig, ChartData, ModalState } from './useChartModal01';
import { IndicatorData, reprocessChartDataByPeriod } from '../../../../utils/indicatorDataUtils';

/**
 * 图表卡片渲染工具 - 日指标专用，支持周期切换和真实数据传递
 */

/**
 * 创建迷你图组件
 * @param title 图表标题
 * @param onClick 点击事件处理器
 * @param chartData 图表数据
 */
export const createMiniChart = (
  title: string,
  onClick: () => void,
  chartData?: ChartData,
): React.ReactNode => {
  console.log('createMiniChart called with:', { title, hasChartData: !!chartData, chartData });

  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      <ServiceVolumeChart01
        isMini={true}
        title={title}
        period="7days" // 迷你图始终显示7天
        chartData={chartData} // 传递真实图表数据
      />
    </div>
  );
};

/**
 * 创建详细图表模态框组件
 * @param visible 是否显示
 * @param title 图表标题
 * @param period 时间周期
 * @param onClose 关闭回调
 * @param onPeriodChange 周期切换回调
 * @param chartData 图表数据
 * @param originalData 原始数据（用于重新处理）
 */
export const createChartModal = (
  visible: boolean,
  title: string,
  period: '7days' | '30days',
  onClose: () => void,
  onPeriodChange: (period: '7days' | '30days') => void,
  chartData?: ChartData,
  originalData?: IndicatorData[],
): React.ReactNode => {
  console.log('createChartModal called with:', {
    visible,
    title,
    period,
    hasChartData: !!chartData,
    hasOriginalData: !!originalData,
  });

  // 根据周期动态处理数据
  const modalChartData = React.useMemo(() => {
    if (originalData && originalData.length > 0) {
      console.log(
        'Reprocessing data for period:',
        period,
        'originalData length:',
        originalData.length,
      );
      return reprocessChartDataByPeriod(originalData, period);
    }
    return chartData;
  }, [originalData, period, chartData]);

  console.log('Modal chart data:', modalChartData);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      title={title}
      destroyOnClose={true}
    >
      <Radio.Group
        value={period === '7days' ? '01' : '02'}
        onChange={(e) => onPeriodChange(e.target.value === '01' ? '7days' : '30days')}
        style={{ marginTop: 8 }}
      >
        <Radio.Button value="01">7天</Radio.Button>
        <Radio.Button value="02">30天</Radio.Button>
      </Radio.Group>
      <div>
        <ServiceVolumeChart01
          isMini={false}
          height={400}
          title={title}
          period={period}
          chartData={modalChartData} // 使用动态处理的数据
        />
      </div>
    </Modal>
  );
};

/**
 * 创建完整的图表渲染器 - 支持图表数据传递和动态切换
 * @param getModalState 获取模态框状态的函数
 * @param showModal 显示模态框的函数
 * @param handleModalClose 关闭模态框的函数
 * @param handlePeriodChange 切换周期的函数
 */
export const createChartRenderer01 = (
  getModalState: (key?: string) => ModalState,
  showModal: (key: string, title: string, chartData?: ChartData) => void,
  handleModalClose: (key?: string) => void,
  handlePeriodChange: (
    keyOrPeriod: string | '7days' | '30days',
    period?: '7days' | '30days',
  ) => void,
) => {
  return (
    key: string,
    title: string,
    chartData?: ChartData,
    originalData?: IndicatorData[],
  ): React.ReactNode => {
    console.log('Chart renderer called with:', {
      key,
      title,
      hasChartData: !!chartData,
      hasOriginalData: !!originalData,
      originalDataLength: originalData?.length || 0,
    });

    const currentState = getModalState(key);

    return (
      <>
        {createMiniChart(title, () => showModal(key, title, chartData), chartData)}
        {createChartModal(
          currentState.visible,
          title,
          currentState.period,
          () => handleModalClose(key),
          (newPeriod) => handlePeriodChange(key, newPeriod),
          currentState.chartData || chartData,
          originalData, // 传递原始数据用于动态处理
        )}
      </>
    );
  };
};

/**
 * 完整的图表组合组件属性 - 更新支持图表数据
 */
export interface ChartWithModalProps {
  title: string;
  modalKey: string;
  modalState: ModalState;
  onShowModal: (key: string, title: string, chartData?: ChartData) => void;
  onCloseModal: (key: string) => void;
  onPeriodChange: (key: string, period: '7days' | '30days') => void;
  chartData?: ChartData;
  originalData?: IndicatorData[]; // 添加原始数据支持
}

/**
 * 完整的图表组合组件
 */
export const ChartWithModal: React.FC<ChartWithModalProps> = ({
  title,
  modalKey,
  modalState,
  onShowModal,
  onCloseModal,
  onPeriodChange,
  chartData,
  originalData,
}) => {
  return (
    <>
      {createMiniChart(title, () => onShowModal(modalKey, title, chartData), chartData)}
      {createChartModal(
        modalState.visible,
        title,
        modalState.period,
        () => onCloseModal(modalKey),
        (newPeriod) => onPeriodChange(modalKey, newPeriod),
        modalState.chartData || chartData,
        originalData,
      )}
    </>
  );
};

/**
 * 日指标图表配置常量
 */
export const DAILY_CHART_CONFIGS = {
  INTEL_LIGRNT_CUS: { key: 'intelLigentCus', title: '智能语音客服占比' },
  INTEL_LIGRNTRG_RATE: { key: 'intelLigentrgRate', title: '智能客服转人工率' },
  ONLINE_CUST_RATE: { key: 'onlineCustRate', title: '在线客服比（省内口径）' },
  INTEL_LSOLU_RATE: { key: 'intelLsoluRate', title: '智能客服来话一解率' },
  VOICE_15S_RATE: { key: 'seifServiceRate', title: '语音自助话务占比' },
} as const;

/**
 * 批量渲染图表工具 - 支持图表数据
 */
export const renderChartsInBatch = (
  configs: Array<ChartConfig & { chartData?: ChartData; originalData?: IndicatorData[] }>,
  getModalState: (key: string) => ModalState,
  showModal: (key: string, title: string, chartData?: ChartData) => void,
  handleModalClose: (key: string) => void,
  handlePeriodChange: (key: string, period: '7days' | '30days') => void,
) => {
  const renderChart = createChartRenderer01(
    // @ts-ignore
    getModalState,
    showModal,
    handleModalClose,
    handlePeriodChange,
  );

  return configs.map(({ key, title, chartData, originalData }) => ({
    key,
    title,
    chart: renderChart(key, title, chartData, originalData),
    modalState: getModalState(key),
  }));
};

/**
 * 获取所有日指标配置
 */
export const getAllDailyChartConfigs = (): ChartConfig[] => {
  return Object.values(DAILY_CHART_CONFIGS);
};
