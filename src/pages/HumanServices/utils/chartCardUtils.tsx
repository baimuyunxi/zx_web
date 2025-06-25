import React from 'react';
import { Modal, Radio } from 'antd';
import ServiceVolumeChart01 from '@/pages/HumanServices/components/Graph/ServiceVolumeChart01';

// ChartCard 中使用的图表渲染工具
export interface ChartCardConfig {
  key: string;
  title: string;
  modalVisible?: boolean;
  period?: '7days' | '30days';
}

// 创建迷你图组件
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

// 创建详细图表模态框组件
export const createChartModal = (
  visible: boolean,
  title: string,
  period: '7days' | '30days',
  onClose: () => void,
  onPeriodChange: (period: '7days' | '30days') => void,
): React.ReactNode => {
  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={800} centered title={title}>
      <Radio.Group
        value={period === '7days' ? '01' : '02'}
        onChange={(e) => onPeriodChange(e.target.value === '01' ? '7days' : '30days')}
        style={{ marginBottom: 20 }}
      >
        <Radio.Button value="01">7天</Radio.Button>
        <Radio.Button value="02">30天</Radio.Button>
      </Radio.Group>
      <div style={{ padding: '20px 0' }}>
        <ServiceVolumeChart01 isMini={false} height={400} title={title} period={period} />
      </div>
    </Modal>
  );
};

// 完整的图表组合组件
export interface ChartWithModalProps {
  title: string;
  modalKey: string;
  visible?: boolean;
  period?: '7days' | '30days';
  onShowModal: (key: string, title: string) => void;
  onCloseModal: (key: string) => void;
  onPeriodChange: (key: string, period: '7days' | '30days') => void;
}

export const ChartWithModal: React.FC<ChartWithModalProps> = ({
  title,
  modalKey,
  visible = false,
  period = '7days',
  onShowModal,
  onCloseModal,
  onPeriodChange,
}) => {
  return (
    <>
      {createMiniChart(title, () => onShowModal(modalKey, title))}
      {createChartModal(
        visible,
        title,
        period,
        () => onCloseModal(modalKey),
        (newPeriod) => onPeriodChange(modalKey, newPeriod),
      )}
    </>
  );
};

// HOC: 为 ChartCard 添加图表功能
export const withChart = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return React.forwardRef<any, P & ChartWithModalProps>((props, ref) => {
    const {
      title,
      modalKey,
      visible,
      period,
      onShowModal,
      onCloseModal,
      onPeriodChange,
      ...restProps
    } = props;

    return (
      <WrappedComponent {...(restProps as P)} ref={ref}>
        <ChartWithModal
          title={title}
          modalKey={modalKey}
          visible={visible}
          period={period}
          onShowModal={onShowModal}
          onCloseModal={onCloseModal}
          onPeriodChange={onPeriodChange}
        />
      </WrappedComponent>
    );
  });
};

// 图表配置常量
export const CHART_CONFIGS = {
  DAILY_METRICS: {
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
  },
  MONTHLY_METRICS: {
    MONTHLY_CALLS_PER_PERSON: { key: 'monthly_calls_per_person', title: '语音人均月接话量' },
    CALL_INTENSITY: { key: 'call_intensity', title: '语音通话强度' },
    NIGHT_DECLINE: { key: 'night_decline', title: '夜间语音人工接话量降幅' },
    CALL_UTILIZATION: { key: 'call_utilization', title: '语音通话利用率' },
  },
} as const;

// 快速配置生成器
export const generateChartConfig = (configs: Array<{ key: string; title: string }>) => {
  return configs.map((config) => ({
    ...config,
    render: (onShowModal: (key: string, title: string) => void) =>
      createMiniChart(config.title, () => onShowModal(config.key, config.title)),
  }));
};

// 批量渲染工具
export const renderChartsInBatch = (
  configs: Array<{ key: string; title: string }>,
  modalStates: { [key: string]: any },
  showModal: (key: string, title: string) => void,
  handleModalClose: (key: string) => void,
  handlePeriodChange: (key: string, period: '7days' | '30days') => void,
) => {
  return configs.map(({ key, title }) => {
    const currentState = modalStates[key] || {
      visible: false,
      period: '7days' as const,
      title: title,
    };

    return {
      key,
      miniChart: createMiniChart(title, () => showModal(key, title)),
      modal: createChartModal(
        currentState.visible,
        title,
        currentState.period,
        () => handleModalClose(key),
        (newPeriod) => handlePeriodChange(key, newPeriod),
      ),
    };
  });
};
