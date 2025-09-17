import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import useStyles from '@/pages/SmartServices/style.style';
import {
  formatPercentage,
  formatPP,
  IndicatorData,
  IndicatorResponse,
  ProcessedIndicatorData,
  processIndicatorData,
} from '@/pages/SmartServices/utils/indicatorDataUtils';
import { useChartModal01 } from '@/pages/SmartServices/components/Graph/01/utils/useChartModal01';
import { createChartRenderer01 } from '@/pages/SmartServices/components/Graph/01/utils/chartCardUtils01';
import StatisticDisplay from '@/pages/components/StatisticDisplay';
import Trend from '@/pages/components/Trend';
import { Col, Divider, Row, Space, Tag, Tooltip } from 'antd';
import ChartCard from '@/pages/components/Charts/ChartCard';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  getCommentAfterwards,
  getCuDianSatRate,
  getIMInstantRate,
  getIMSolveRate,
  getInstSatisfactionRate,
  getKdOrderSatPre,
  getRemoteInstantRate,
  getRemoteSolveRate,
  getResolutionRate,
  getTsSatOrderPre,
  getTsSatSolutionRate,
  getXianShangSatRate,
  getYdOrderSatPre,
  getZiZuSatRate,
} from '@/pages/CustomerTestimonials/service';

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

const Customer: React.FC = () => {
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
    loadIndicatorData('tssatorderpre', getTsSatOrderPre);
    loadIndicatorData('tssatsolutionRate', getTsSatSolutionRate);
    loadIndicatorData('zizusatRate', getZiZuSatRate);
    loadIndicatorData('cudiansatRate', getCuDianSatRate);
    loadIndicatorData('instSatisfactionRate', getInstSatisfactionRate);
    loadIndicatorData('resolutionRate', getResolutionRate);
    loadIndicatorData('IMInstantRate', getIMInstantRate);
    loadIndicatorData('IMSolveRate', getIMSolveRate);
    loadIndicatorData('RemoteInstantRate', getRemoteInstantRate);
    loadIndicatorData('RemoteSolveRate', getRemoteSolveRate);
    loadIndicatorData('ydordersatpre', getYdOrderSatPre);
    loadIndicatorData('kdordersatpre', getKdOrderSatPre);
    loadIndicatorData('commentAfterwards', getCommentAfterwards);
    loadIndicatorData('xianshangsatRate', getXianShangSatRate);
  }, []);

  // 判断是否为呼入量指标（只有呼入量指标才显示月环比）
  const isVolumeIndicator = (key: string): boolean => {
    return ['artConn'].includes(key);
  };

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
          {isVolumeIndicator(indicatorKey) && (
            <Trend value="--" indicatorKey={indicatorKey}>
              月环比
            </Trend>
          )}
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
        {isVolumeIndicator(indicatorKey) && (
          <Trend
            value={isPercentage ? formatPP(data.monthRatio) : formatPercentage(data.monthRatio)}
            indicatorKey={indicatorKey}
          >
            月环比
          </Trend>
        )}
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
                    color={indicatorData.tssatorderpre?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.tssatorderpre?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>投诉工单测评满意率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="满意工单量/（满意工单量+不满意工单量）*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.tssatorderpre?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.tssatorderpre.currentValue}
                  unit="%"
                  threshold={indicatorData.tssatorderpre.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.tssatorderpre || ({} as ProcessedIndicatorData),
              'tssatorderpre',
              true,
            )}
          >
            {renderChartWithModal01(
              'tssatorderpre',
              '投诉工单测评满意率',
              indicatorData.tssatorderpre?.chartData,
              originalData.tssatorderpre,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.tssatsolutionRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.tssatsolutionRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>投诉工单测评解决率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="针对存在投诉工单的用户进行满意率测评中答复问题已解决的用户量/参评用户数">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.tssatsolutionRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.tssatsolutionRate.currentValue}
                  unit="%"
                  threshold={indicatorData.tssatsolutionRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.tssatsolutionRate || ({} as ProcessedIndicatorData),
              'tssatsolutionRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'tssatsolutionRate',
              '投诉工单测评解决率',
              indicatorData.tssatsolutionRate?.chartData,
              originalData.tssatsolutionRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.zizusatRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.zizusatRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>自助测评满意率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="针对自助服务用户通过IVR开展测评，自助满意率=（7-10）分用户/全量用户数">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.zizusatRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.zizusatRate.currentValue}
                  unit="%"
                  threshold={indicatorData.zizusatRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.zizusatRate || ({} as ProcessedIndicatorData),
              'zizusatRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'zizusatRate',
              '自助测评满意率',
              indicatorData.zizusatRate?.chartData,
              originalData.zizusatRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.cudiansatRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.cudiansatRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>各触点测评解决率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="在人工、自助、在线三类触点测评为解决和未解决的用户中，人工在三类总和中占比*人工测评解决率+自助在三类总和中占比*自助测评解决率+在线在三类总和中占比*在线测评解决率。">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.cudiansatRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.cudiansatRate.currentValue}
                  unit="%"
                  threshold={indicatorData.cudiansatRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.cudiansatRate || ({} as ProcessedIndicatorData),
              'cudiansatRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'cudiansatRate',
              '各触点测评解决率',
              indicatorData.cudiansatRate?.chartData,
              originalData.cudiansatRate,
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
                    color={indicatorData.instSatisfactionRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.instSatisfactionRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>语音客服即时满意率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="10000号人工服务话后评价满意的话务量/已评价为问题已解决的总话务量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.instSatisfactionRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.instSatisfactionRate.currentValue}
                  unit="%"
                  threshold={indicatorData.instSatisfactionRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.instSatisfactionRate || ({} as ProcessedIndicatorData),
              'instSatisfactionRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'instSatisfactionRate',
              '语音客服即时满意率',
              indicatorData.instSatisfactionRate?.chartData,
              originalData.instSatisfactionRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.resolutionRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.resolutionRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>语音客服即时解决率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="10000号人工服务话后评价选择“解决”的话务量/话后评价的总话务量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.resolutionRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.resolutionRate.currentValue}
                  unit="%"
                  threshold={indicatorData.resolutionRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.resolutionRate || ({} as ProcessedIndicatorData),
              'resolutionRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'resolutionRate',
              '语音客服即时解决率',
              indicatorData.resolutionRate?.chartData,
              originalData.resolutionRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.IMInstantRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.IMInstantRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>文字客服即时满意率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="文字客服话后服务评价选择“十分满意”和“满意”的服务量/话后评价的总服务量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.IMInstantRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.IMInstantRate.currentValue}
                  unit="%"
                  threshold={indicatorData.IMInstantRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.IMInstantRate || ({} as ProcessedIndicatorData),
              'IMInstantRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'IMInstantRate',
              '文字客服即时满意率',
              indicatorData.IMInstantRate?.chartData,
              originalData.IMInstantRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.IMSolveRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.IMSolveRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>文字客服即时解决率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="文字客服服务话后评价选择“解决”的服务量/话后评价的总话务量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.IMSolveRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.IMSolveRate.currentValue}
                  unit="%"
                  threshold={indicatorData.IMSolveRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.IMSolveRate || ({} as ProcessedIndicatorData),
              'IMSolveRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'IMSolveRate',
              '文字客服即时解决率',
              indicatorData.IMSolveRate?.chartData,
              originalData.IMSolveRate,
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
                    color={indicatorData.RemoteInstantRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.RemoteInstantRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>远程柜台即时满意率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="远程柜台话后服务评价选择“十分满意”和“满意”的服务量/话后评价的总服务量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.RemoteInstantRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.RemoteInstantRate.currentValue}
                  unit="%"
                  threshold={indicatorData.RemoteInstantRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.RemoteInstantRate || ({} as ProcessedIndicatorData),
              'RemoteInstantRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'RemoteInstantRate',
              '远程柜台即时满意率',
              indicatorData.RemoteInstantRate?.chartData,
              originalData.RemoteInstantRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.RemoteSolveRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.RemoteSolveRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>远程柜台即时解决率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="远程柜台服务话后评价选择“解决”的服务量/话后评价的总话务量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.RemoteSolveRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.RemoteSolveRate.currentValue}
                  unit="%"
                  threshold={indicatorData.RemoteSolveRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.RemoteSolveRate || ({} as ProcessedIndicatorData),
              'RemoteSolveRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'RemoteSolveRate',
              '远程柜台即时解决率',
              indicatorData.RemoteSolveRate?.chartData,
              originalData.RemoteSolveRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.ydordersatpre?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.ydordersatpre?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>移动故障用后即评10分满意率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="省中心移动故障工单十分满意量/省中心移动故障工单参评总量">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.ydordersatpre?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.ydordersatpre.currentValue}
                  unit="%"
                  threshold={indicatorData.ydordersatpre.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.ydordersatpre || ({} as ProcessedIndicatorData),
              'ydordersatpre',
              true,
            )}
          >
            {renderChartWithModal01(
              'ydordersatpre',
              '移动故障用后即评10分满意率',
              indicatorData.ydordersatpre?.chartData,
              originalData.ydordersatpre,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.kdordersatpre?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.kdordersatpre?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>宽带故障用后即评10分满意率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="省中心宽带故障工单十分满意量/省中心宽带故障工单参评总量">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.kdordersatpre?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.kdordersatpre.currentValue}
                  unit="%"
                  threshold={indicatorData.kdordersatpre.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.kdordersatpre || ({} as ProcessedIndicatorData),
              'kdordersatpre',
              true,
            )}
          >
            {renderChartWithModal01(
              'kdordersatpre',
              '宽带故障用后即评10分满意率',
              indicatorData.kdordersatpre?.chartData,
              originalData.kdordersatpre,
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
                    color={indicatorData.commentAfterwards?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.commentAfterwards?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>语音客服话后即评10分满意率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="十分满意量/（十分满意量+基本满意量+不满意量+非常不满意量）">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.commentAfterwards?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.commentAfterwards.currentValue}
                  unit="%"
                  threshold={indicatorData.commentAfterwards.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.commentAfterwards || ({} as ProcessedIndicatorData),
              'commentAfterwards',
              true,
            )}
          >
            {renderChartWithModal01(
              'commentAfterwards',
              '语音客服话后即评10分满意率',
              indicatorData.commentAfterwards?.chartData,
              originalData.commentAfterwards,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.xianshangsatRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.xianshangsatRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>线上调查综合类十分满意率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="线上调查综合类修复工单评价选择“十分满意”的服务量/评价总服务量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.xianshangsatRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.xianshangsatRate.currentValue}
                  unit="%"
                  threshold={indicatorData.xianshangsatRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.xianshangsatRate || ({} as ProcessedIndicatorData),
              'xianshangsatRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'xianshangsatRate',
              '线上调查综合类十分满意率',
              indicatorData.xianshangsatRate?.chartData,
              originalData.resolutionRate,
            )}
          </ChartCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Customer;
