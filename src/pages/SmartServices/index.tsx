import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Col, Divider, Row, Space, Tag, Tooltip } from 'antd';
import ChartCard from '@/pages/components/Charts/ChartCard';
import { InfoCircleOutlined } from '@ant-design/icons';
import StatisticDisplay from '@/pages/components/StatisticDisplay';
import {
  formatPercentage,
  formatPP,
  IndicatorData,
  IndicatorResponse,
  ProcessedIndicatorData,
  processIndicatorData,
} from '@/pages/SmartServices/utils/indicatorDataUtils';
import useStyles from '@/pages/SmartServices/style.style';
import { useChartModal01 } from '@/pages/SmartServices/components/Graph/01/utils/useChartModal01';
import { createChartRenderer01 } from '@/pages/SmartServices/components/Graph/01/utils/chartCardUtils01';
import Trend from '../components/Trend';
import {
  getIntellSoluRate,
  getLigentCus,
  getLigentrgRate,
  getOnlineCustRate,
  getSeifServiceRate,
} from '@/pages/SmartServices/service';

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

  // 加载指标数据
  const loadIndicatorData = async (key: string, apiCall: () => Promise<IndicatorResponse>) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await apiCall();
      console.log(`${key} API Response:`, response);

      // 存储原始数据
      setOriginalData((prev) => ({ ...prev, [key]: response.data || [] }));

      // 处理数据
      const processedData = processIndicatorData(response);
      console.log(`${key} Processed Data:`, processedData);
      setIndicatorData((prev) => ({ ...prev, [key]: processedData }));
    } catch (error) {
      console.error(`加载${key}数据失败:`, error);
      // 设置默认数据
      setIndicatorData((prev) => ({
        ...prev,
        [key]: {
          currentValue: 0,
          monthValue: 0,
          dayRatio: 0,
          monthRatio: 0,
          dateTag: '暂无数据',
          dateColor: '#f50',
          chartData: { volumeData: [], ratioData: [], categories: [] },
          isDataSynced: false,
        },
      }));
      setOriginalData((prev) => ({ ...prev, [key]: [] }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    // 日指标数据加载
    loadIndicatorData('intelLigentCus', getLigentCus);
    loadIndicatorData('intelLigentrgRate', getLigentrgRate);
    loadIndicatorData('onlineCustRate', getOnlineCustRate);
    loadIndicatorData('intelLsoluRate', getIntellSoluRate);
    loadIndicatorData('seifServiceRate', getSeifServiceRate);
  }, []);

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
                    color={indicatorData.seifServiceRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.seifServiceRate?.dateTag || '暂无数据'}
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
              indicatorData.seifServiceRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.seifServiceRate.currentValue}
                  unit="%"
                  threshold={indicatorData.seifServiceRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.seifServiceRate || ({} as ProcessedIndicatorData),
              'seifServiceRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'voice_calls',
              '语音自助话务占比',
              indicatorData.seifServiceRate?.chartData,
              originalData.seifServiceRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.intelLigentCus?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.intelLigentCus?.dateTag || '暂无数据'}
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
              indicatorData.intelLigentCus?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.intelLigentCus.currentValue}
                  unit="%"
                  threshold={indicatorData.intelLigentCus.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.intelLigentCus || ({} as ProcessedIndicatorData),
              'intelLigentCusv',
              true,
            )}
          >
            {renderChartWithModal01(
              'voice_calls',
              '智能语音客服占比',
              indicatorData.intelLigentCus?.chartData,
              originalData.intelLigentCus,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.intelLigentrgRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.intelLigentrgRate?.dateTag || '暂无数据'}
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
              indicatorData.intelLigentrgRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.intelLigentrgRate.currentValue}
                  unit="%"
                  threshold={indicatorData.intelLigentrgRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.intelLigentrgRate || ({} as ProcessedIndicatorData),
              'intelLigentrgRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'voice_calls',
              '智能客服转人工率',
              indicatorData.intelLigentrgRate?.chartData,
              originalData.intelLigentrgRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.intelLsoluRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.intelLsoluRate?.dateTag || '暂无数据'}
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
              indicatorData.intelLsoluRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.intelLsoluRate.currentValue}
                  unit="%"
                  threshold={indicatorData.intelLsoluRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.intelLsoluRate || ({} as ProcessedIndicatorData),
              'intelLsoluRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'voice_15s_rate',
              '智能客服来话一解率',
              indicatorData.intelLsoluRate?.chartData,
              originalData.intelLsoluRate,
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
                    color={indicatorData.onlineCustRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.onlineCustRate?.dateTag || '暂无数据'}
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
              indicatorData.onlineCustRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.onlineCustRate.currentValue}
                  unit="%"
                  threshold={indicatorData.onlineCustRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.onlineCustRate || ({} as ProcessedIndicatorData),
              'onlineCustRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'text_service',
              '在线客服比',
              indicatorData.onlineCustRate?.chartData,
              originalData.onlineCustRate,
            )}
          </ChartCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Smart;
