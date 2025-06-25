import React, { useState } from 'react';
import { Modal, Radio } from 'antd';
import ServiceVolumeChart01 from '@/pages/HumanServices/components/Graph/ServiceVolumeChart01';

// 模态框状态类型定义
interface ModalState {
  visible: boolean;
  period: '7days' | '30days';
  title: string;
}

// 模态框状态管理
interface ModalStates {
  [key: string]: ModalState;
}

// 自定义 Hook
export const useChartModal = () => {
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

  return {
    modalStates,
    showModal,
    handleModalClose,
    handlePeriodChange,
  };
};

// 图表渲染工具类
export class ChartModalRenderer {
  private modalStates: ModalStates;
  private showModal: (key: string, title: string) => void;
  private handleModalClose: (key: string) => void;
  private handlePeriodChange: (key: string, period: '7days' | '30days') => void;

  constructor(
    modalStates: ModalStates,
    showModal: (key: string, title: string) => void,
    handleModalClose: (key: string) => void,
    handlePeriodChange: (key: string, period: '7days' | '30days') => void,
  ) {
    this.modalStates = modalStates;
    this.showModal = showModal;
    this.handleModalClose = handleModalClose;
    this.handlePeriodChange = handlePeriodChange;
  }

  // 渲染带模态框的图表
  renderChartWithModal = (key: string, title: string): React.ReactNode => {
    const currentState = this.modalStates[key] || {
      visible: false,
      period: '7days' as const,
      title: title,
    };

    return (
      <>
        <div
          onClick={() => this.showModal(key, title)}
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
        <Modal
          open={currentState.visible}
          onCancel={() => this.handleModalClose(key)}
          footer={null}
          width={800}
          centered
        >
          <Radio.Group
            value={currentState.period === '7days' ? '01' : '02'}
            onChange={(e) =>
              this.handlePeriodChange(key, e.target.value === '01' ? '7days' : '30days')
            }
            style={{ marginBottom: 20 }}
          >
            <Radio.Button value="01">7天</Radio.Button>
            <Radio.Button value="02">30天</Radio.Button>
          </Radio.Group>
          <div style={{ padding: '20px 0' }}>
            <ServiceVolumeChart01
              isMini={false}
              height={400}
              title={title}
              period={currentState.period}
            />
          </div>
        </Modal>
      </>
    );
  };
}

// 简化版渲染函数（使用函数式编程）- 推荐使用
export const createChartRenderer = (
  modalStates: ModalStates,
  showModal: (key: string, title: string) => void,
  handleModalClose: (key: string) => void,
  handlePeriodChange: (key: string, period: '7days' | '30days') => void,
) => {
  return (key: string, title: string): React.ReactNode => {
    const currentState = modalStates[key] || {
      visible: false,
      period: '7days' as const,
      title: title,
    };

    return (
      <>
        <div
          onClick={() => showModal(key, title)}
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
          <ServiceVolumeChart01 isMini={true} title={title} period="7days" />
        </div>
        <Modal
          open={currentState.visible}
          onCancel={() => handleModalClose(key)}
          footer={null}
          width={800}
          centered
        >
          <Radio.Group
            value={currentState.period === '7days' ? '01' : '02'}
            onChange={(e) => handlePeriodChange(key, e.target.value === '01' ? '7days' : '30days')}
            style={{ marginBottom: 20 }}
          >
            <Radio.Button value="01">7天</Radio.Button>
            <Radio.Button value="02">30天</Radio.Button>
          </Radio.Group>
          <ServiceVolumeChart01
            isMini={false}
            height={400}
            title={title}
            period={currentState.period}
          />
        </Modal>
      </>
    );
  };
};

// 导出常用的图表配置
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
};
