import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { Col, Divider, Row, Space, Tag, Tooltip } from 'antd';
import ChartCard from '@/pages/components/Charts/ChartCard';
import { InfoCircleOutlined } from '@ant-design/icons';
import StatisticDisplay from '@/pages/components/StatisticDisplay';
import {
  formatPercentage,
  formatPP,
  IndicatorData,
  ProcessedIndicatorData,
} from '@/pages/SmartServices/utils/indicatorDataUtils';
import useStyles from '@/pages/SmartServices/style.style';
import { useChartModal01 } from '@/pages/SmartServices/components/Graph/01/utils/useChartModal01';
import { createChartRenderer01 } from '@/pages/SmartServices/components/Graph/01/utils/chartCardUtils01';
import Trend from '../components/Trend';

const topColProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const Smart: React.FC = () => {
  const { styles } = useStyles();

  // 状态管理
  const [indicatorData, setIndicatorData] = useState<Record<string, ProcessedIndicatorData>>({});
  const [originalData, setOriginalData] = useState<Record<string, IndicatorData[]>>({});
  const [, setLoading] = useState<Record<string, boolean>>({});

  /**
   * 日指标状态管理
   */
  const { showModal01, handleModalClose01, handlePeriodChange01, getModalState01 } =
    useChartModal01();
  const renderChartWithModal01 = createChartRenderer01(
    getModalState01,
    showModal01,
    handleModalClose01,
    handlePeriodChange01,
  );

  // 渲染数据同步提示
  const renderUnsyncedData = (unit: string = '次') => (
    <StatisticDisplay value={0} unit={unit} monthLabel="数据暂未同步" monthValue="--" />
  );

  // 渲染数据同步提示（百分比类型）
  const renderUnsyncedPercentageData = () => (
    <StatisticDisplay value={0} suffix="%" monthLabel="数据暂未同步" />
  );

  // 渲染Footer
  const renderFooter = (
    data: ProcessedIndicatorData,
    indicatorKey: string,
    isPercentage: boolean = false,
  ) => {
    if (!data.isDataSynced) {
      return (
        <>
          <Trend value="--" indicatorKey={indicatorKey}>
            日环比
          </Trend>
        </>
      );
    }

    return (
      <>
        <Trend
          value={isPercentage ? formatPP(data.dayRatio) : formatPercentage(data.dayRatio)}
          indicatorKey={indicatorKey}
        >
          日环比
        </Trend>
      </>
    );
  };

  return (
    <PageContainer>
      <Divider orientation="left" style={{ fontSize: 18, fontWeight: 'bold' }}>
        <Space>
          📊 日指标
          {/*@ts-ignore*/}
          <Tag color="blue" size="small">
            日度更新
          </Tag>
        </Space>
      </Divider>

      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.artConnRt?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.artConnRt?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>语音自助话务占比</span>
                </div>
              </>
            }
            action={
              <Tooltip title="语音自助话务量（总语音话务量-10000号人工呼叫量）/总语音话务量（自助+人工呼入）*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.artConnRt?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.artConnRt.currentValue}
                  unit="%"
                  threshold={indicatorData.artConnRt.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.artConnRt || ({} as ProcessedIndicatorData),
              'artConnRt',
              true,
            )}
          >
            {renderChartWithModal01(
              'senior_rate',
              '语音自助话务占比',
              indicatorData.artConnRt?.chartData,
              originalData.artConnRt,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.wanHaoCt?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.wanHaoCt?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>智能语音客服占比</span>
                </div>
              </>
            }
            action={
              <Tooltip title="智能语音服务量/（10000号+10001话务总量）*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.artConnRt?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.artConnRt.currentValue}
                  unit="%"
                  threshold={indicatorData.artConnRt.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.wanHaoCt || ({} as ProcessedIndicatorData),
              'wanHaoCt',
            )}
          >
            {renderChartWithModal01(
              'total_volume',
              '智能语音客服占比',
              indicatorData.wanHaoCt?.chartData,
              originalData.wanHaoCt,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.artCallinCt?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.artCallinCt?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>智能客服转人工率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="（转接人工服务的请求量/智能语音服务量）×100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.artConnRt?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.artConnRt.currentValue}
                  unit="%"
                  threshold={indicatorData.artConnRt.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.artCallinCt || ({} as ProcessedIndicatorData),
              'artCallinCt',
            )}
          >
            {renderChartWithModal01(
              'voice_calls',
              '智能客服转人工率',
              indicatorData.artCallinCt?.chartData,
              originalData.artCallinCt,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.conn15Rate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.conn15Rate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>智能客服来话一解率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="（2小时内未重复使用智能客服的服务量/.智能客服服务量）×100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.conn15Rate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.conn15Rate.currentValue}
                  unit="%"
                  threshold={indicatorData.conn15Rate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.conn15Rate || ({} as ProcessedIndicatorData),
              'conn15Rate',
              true,
            )}
          >
            {renderChartWithModal01(
              'voice_15s_rate',
              '智能客服来话一解率',
              indicatorData.conn15Rate?.chartData,
              originalData.conn15Rate,
            )}
          </ChartCard>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.wordCallinCt?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.wordCallinCt?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>在线客服比</span>
                </div>
              </>
            }
            action={
              <Tooltip title="（（（在线机器人服务量+在线数字人服务量+在线文字客服话务量+在线视频客服话务量）/10000号来话量）×100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.artConnRt?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.artConnRt.currentValue}
                  unit="%"
                  threshold={indicatorData.artConnRt.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.wordCallinCt || ({} as ProcessedIndicatorData),
              'wordCallinCt',
            )}
          >
            {renderChartWithModal01(
              'text_service',
              '在线客服比',
              indicatorData.wordCallinCt?.chartData,
              originalData.wordCallinCt,
            )}
          </ChartCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Smart;
