import React from 'react';
import { Modal, Radio } from 'antd';
import ServiceVolumeChart01 from '@/pages/HumanServices/components/Graph/01/ServiceVolumeChart01';
import { ChartConfig, ModalState } from './useChartModal01';

/**
 * 图表卡片渲染工具 - 日指标专用，支持周期切换
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
      <ServiceVolumeChart01
        isMini={true}
        title={title}
        period="7days" // 迷你图始终显示7天
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
 */
export const createChartModal = (
  visible: boolean,
  title: string,
  period: '7days' | '30days',
  onClose: () => void,
  onPeriodChange: (period: '7days' | '30days') => void,
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
      <Radio.Group
        value={period === '7days' ? '01' : '02'}
        onChange={(e) => onPeriodChange(e.target.value === '01' ? '7days' : '30days')}
        style={{ marginTop: 8 }}
      >
        <Radio.Button value="01">7天</Radio.Button>
        <Radio.Button value="02">30天</Radio.Button>
      </Radio.Group>
      <div>
        <ServiceVolumeChart01 isMini={false} height={400} title={title} period={period} />
      </div>
    </Modal>
  );
};

/**
 * 创建完整的图表渲染器
 * @param getModalState 获取模态框状态的函数
 * @param showModal 显示模态框的函数
 * @param handleModalClose 关闭模态框的函数
 * @param handlePeriodChange 切换周期的函数
 */
export const createChartRenderer01 = (
  getModalState: (key: string) => ModalState,
  showModal: (key: string, title: string) => void,
  handleModalClose: (key: string) => void,
  handlePeriodChange: (key: string, period: '7days' | '30days') => void,
) => {
  return (key: string, title: string): React.ReactNode => {
    const currentState = getModalState(key);

    return (
      <>
        {createMiniChart(title, () => showModal(key, title))}
        {createChartModal(
          currentState.visible,
          title,
          currentState.period,
          () => handleModalClose(key),
          (newPeriod) => handlePeriodChange(key, newPeriod),
        )}
      </>
    );
  };
};

/**
 * 完整的图表组合组件属性
 */
export interface ChartWithModalProps {
  title: string;
  modalKey: string;
  modalState: ModalState;
  onShowModal: (key: string, title: string) => void;
  onCloseModal: (key: string) => void;
  onPeriodChange: (key: string, period: '7days' | '30days') => void;
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
}) => {
  return (
    <>
      {createMiniChart(title, () => onShowModal(modalKey, title))}
      {createChartModal(
        modalState.visible,
        title,
        modalState.period,
        () => onCloseModal(modalKey),
        (newPeriod) => onPeriodChange(modalKey, newPeriod),
      )}
    </>
  );
};

/**
 * 日指标图表配置常量
 */
export const DAILY_CHART_CONFIGS = {
  TOTAL_VOLUME: { key: 'total_volume', title: '万号人工话务总量' },
  VOICE_CALLS: { key: 'voice_calls', title: '语音人工呼入量' },
  TEXT_SERVICE: { key: 'text_service', title: '文字客服呼入量' },
  REMOTE_COUNTER: { key: 'remote_counter', title: '远程柜台呼入量' },
  VOICE_15S_RATE: { key: 'voice_15s_rate', title: '语音客服15秒接通率' },
  TEXT_5MIN_RATE: { key: 'text_5min_rate', title: '文字客服5分钟接通率' },
  REMOTE_25S_RATE: { key: 'remote_25s_rate', title: '远程柜台25秒接通率' },
  SERVICE_10009_15S_RATE: { key: '10009_15s_rate', title: '10009号15秒接通率' },
  SENIOR_RATE: { key: 'senior_rate', title: '10000号适老化接通率' },
  FIRST_SOLUTION_RATE: { key: 'first_solution_rate', title: '10000号人工一解率' },
  REPEAT_CALL_RATE: { key: 'repeat_call_rate', title: '10000号重复来电率' },
} as const;

/**
 * 批量渲染图表工具
 */
export const renderChartsInBatch = (
  configs: Array<ChartConfig>,
  getModalState: (key: string) => ModalState,
  showModal: (key: string, title: string) => void,
  handleModalClose: (key: string) => void,
  handlePeriodChange: (key: string, period: '7days' | '30days') => void,
) => {
  const renderChart = createChartRenderer01(
    getModalState,
    showModal,
    handleModalClose,
    handlePeriodChange,
  );

  return configs.map(({ key, title }) => ({
    key,
    title,
    chart: renderChart(key, title),
    modalState: getModalState(key),
  }));
};

/**
 * 获取所有日指标配置
 */
export const getAllDailyChartConfigs = (): ChartConfig[] => {
  return Object.values(DAILY_CHART_CONFIGS);
};
