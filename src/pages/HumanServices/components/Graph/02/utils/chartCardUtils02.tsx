import React from 'react';
import { Modal } from 'antd';
import ServiceVolumeChart02 from '@/pages/HumanServices/components/Graph/02/ServiceVolumeChart02';
import { ChartConfig, ModalState } from './useChartModal02';

/**
 * 图表卡片渲染工具 - 月指标专用，简化版本
 */

/**
 * 创建迷你图组件
 * @param title 图表标题
 * @param onClick 点击事件处理器
 */
export const createMiniChart = (title: string, onClick: () => void): React.ReactNode => {
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
      <ServiceVolumeChart02 isMini={true} title={title} />
    </div>
  );
};

/**
 * 创建详细图表模态框组件 - 移除period相关功能
 * @param visible 是否显示
 * @param title 图表标题
 * @param onClose 关闭回调
 */
export const createChartModal = (
  visible: boolean,
  title: string,
  onClose: () => void,
): React.ReactNode => {
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
      <div>
        <ServiceVolumeChart02 isMini={false} height={400} title={title} />
      </div>
    </Modal>
  );
};

/**
 * 创建完整的图表渲染器 - 简化版本
 * @param getModalState 获取模态框状态的函数
 * @param showModal 显示模态框的函数
 * @param handleModalClose 关闭模态框的函数
 */
export const createChartRenderer02 = (
  getModalState: (key: string) => ModalState,
  showModal: (key: string, title: string) => void,
  handleModalClose: (key: string) => void,
) => {
  return (key: string, title: string): React.ReactNode => {
    const currentState = getModalState(key);

    return (
      <>
        {createMiniChart(title, () => showModal(key, title))}
        {createChartModal(currentState.visible, title, () => handleModalClose(key))}
      </>
    );
  };
};

/**
 * 完整的图表组合组件属性 - 简化版本
 */
export interface ChartWithModalProps {
  title: string;
  modalKey: string;
  modalState: ModalState;
  onShowModal: (key: string, title: string) => void;
  onCloseModal: (key: string) => void;
}

/**
 * 完整的图表组合组件 - 简化版本
 */
export const ChartWithModal: React.FC<ChartWithModalProps> = ({
  title,
  modalKey,
  modalState,
  onShowModal,
  onCloseModal,
}) => {
  return (
    <>
      {createMiniChart(title, () => onShowModal(modalKey, title))}
      {createChartModal(modalState.visible, title, () => onCloseModal(modalKey))}
    </>
  );
};

/**
 * 月指标图表配置常量
 */
export const MONTHLY_CHART_CONFIGS = {
  MONTHLY_CALLS_PER_PERSON: { key: 'monthly_calls_per_person', title: '语音人均月接话量' },
  CALL_INTENSITY: { key: 'call_intensity', title: '语音通话强度' },
  NIGHT_DECLINE: { key: 'night_decline', title: '夜间语音人工接话量降幅' },
  CALL_UTILIZATION: { key: 'call_utilization', title: '语音通话利用率' },
} as const;

/**
 * 批量渲染图表工具 - 简化版本
 */
export const renderChartsInBatch = (
  configs: Array<ChartConfig>,
  getModalState: (key: string) => ModalState,
  showModal: (key: string, title: string) => void,
  handleModalClose: (key: string) => void,
) => {
  const renderChart = createChartRenderer02(getModalState, showModal, handleModalClose);

  return configs.map(({ key, title }) => ({
    key,
    title,
    chart: renderChart(key, title),
    modalState: getModalState(key),
  }));
};

/**
 * 获取所有月指标配置
 */
export const getAllMonthlyChartConfigs = (): ChartConfig[] => {
  return Object.values(MONTHLY_CHART_CONFIGS);
};
