import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import useStyles from '@/pages/OrderProcess/style.style';
import {
  formatPercentage,
  formatPP,
  IndicatorData,
  IndicatorResponse,
  ProcessedIndicatorData,
  processIndicatorData,
} from '@/pages/OrderProcess/utils/indicatorDataUtils';
import { useChartModal01 } from '@/pages/OrderProcess/components/Graph/01/utils/useChartModal01';
import { createChartRenderer01 } from '@/pages/OrderProcess/components/Graph/01/utils/chartCardUtils01';
import StatisticDisplay from '@/pages/components/StatisticDisplay';
import Trend from '@/pages/components/Trend';
import { Col, Divider, Row, Space, Tag, Tooltip } from 'antd';
import ChartCard from '@/pages/components/Charts/ChartCard';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  getBandOrder,
  getCxOrderSolve,
  getGzOrderSolve,
  getKdOnlinePre,
  getKdOrderOverRat,
  getKdOrderPre,
  getMoveOrder,
  getOrderDeclarAtion,
  getOrderRepeat,
  getOrderSolve,
  getTsOrderOverRat,
  getTsOrderSolve,
  getTsOrderTimeRat,
  getYdOrderOverRat,
} from '@/pages/OrderProcess/service';

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

const Order: React.FC = () => {
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
    loadIndicatorData('ordersolve', getOrderSolve);
    loadIndicatorData('orderdeclaration', getOrderDeclarAtion);
    loadIndicatorData('orderrepeat', getOrderRepeat);
    loadIndicatorData('moveorder', getMoveOrder);
    loadIndicatorData('bandorder', getBandOrder);
    loadIndicatorData('tsordersolve', getTsOrderSolve);
    loadIndicatorData('cxordersolve', getCxOrderSolve);
    loadIndicatorData('gzordersolve', getGzOrderSolve);
    loadIndicatorData('tsordertimerat', getTsOrderTimeRat);
    loadIndicatorData('tsorderoverrat', getTsOrderOverRat);
    loadIndicatorData('ydorderoverrat', getYdOrderOverRat);
    loadIndicatorData('kdorderoverrat', getKdOrderOverRat);
    loadIndicatorData('kdonlinepre', getKdOnlinePre);
    loadIndicatorData('kdorderpre', getKdOrderPre);
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
                    color={indicatorData.ordersolve?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.ordersolve?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>最严工单问题解决率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="1-（方案不明确+合理诉求未解决+重复生成工单）/抽检审计总量*100%。">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.ordersolve?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.ordersolve.currentValue}
                  unit="%"
                  threshold={indicatorData.ordersolve.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.ordersolve || ({} as ProcessedIndicatorData),
              'ordersolve',
              true,
            )}
          >
            {renderChartWithModal01(
              'ordersolve',
              '最严工单问题解决率',
              indicatorData.ordersolve?.chartData,
              originalData.ordersolve,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.orderdeclaration?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.orderdeclaration?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>最严工单申告率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="30天内最严工单申告量/最严工单办结总量*1000‰。">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.orderdeclaration?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.orderdeclaration.currentValue}
                  unit="%"
                  threshold={indicatorData.orderdeclaration.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.orderdeclaration || ({} as ProcessedIndicatorData),
              'orderdeclaration',
              true,
            )}
          >
            {renderChartWithModal01(
              'orderdeclaration',
              '最严工单申告率',
              indicatorData.orderdeclaration?.chartData,
              originalData.orderdeclaration,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.orderrepeat?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.orderrepeat?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>投诉处理重复率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="重复投诉工单量/归档投诉工单总量（其中，重复投诉工单指自然月度内同一客户业务号码工单≥2次)">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.orderrepeat?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.orderrepeat.currentValue}
                  unit="%"
                  threshold={indicatorData.orderrepeat.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.orderrepeat || ({} as ProcessedIndicatorData),
              'orderrepeat',
              true,
            )}
          >
            {renderChartWithModal01(
              'orderrepeat',
              '投诉处理重复率',
              indicatorData.orderrepeat?.chartData,
              originalData.orderrepeat,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.moveorder?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.moveorder?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>移动故障工单重复率（万号办结）</span>
                </div>
              </>
            }
            action={
              <Tooltip title="省中心移动故障工单重复量/移动故障工单办结总量">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.moveorder?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.moveorder.currentValue}
                  unit="%"
                  threshold={indicatorData.moveorder.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.moveorder || ({} as ProcessedIndicatorData),
              'moveorder',
              true,
            )}
          >
            {renderChartWithModal01(
              'moveorder',
              '移动故障工单重复率（万号办结）',
              indicatorData.moveorder?.chartData,
              originalData.moveorder,
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
                    color={indicatorData.bandorder?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.bandorder?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>宽带故障工单重复率（万号办结）</span>
                </div>
              </>
            }
            action={
              <Tooltip title="宽带故障重复工单量/归档宽带故障工单总量（其中：重复工单指30天内同一产品号码工单≥2次）">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.bandorder?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.bandorder.currentValue}
                  unit="%"
                  threshold={indicatorData.bandorder.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.bandorder || ({} as ProcessedIndicatorData),
              'bandorder',
              true,
            )}
          >
            {renderChartWithModal01(
              'bandorder',
              '宽带故障工单重复率（万号办结）',
              indicatorData.bandorder?.chartData,
              originalData.bandorder,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.tsordersolve?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.tsordersolve?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>投诉工单问题解决率（省内参评口径）</span>
                </div>
              </>
            }
            action={
              <Tooltip title="已解决投诉工单量/（已解决+未解决）投诉工单量。">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.tsordersolve?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.tsordersolve.currentValue}
                  unit="%"
                  threshold={indicatorData.tsordersolve.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.tsordersolve || ({} as ProcessedIndicatorData),
              'tsordersolve',
              true,
            )}
          >
            {renderChartWithModal01(
              'tsordersolve',
              '投诉工单问题解决率（省内参评口径）',
              indicatorData.tsordersolve?.chartData,
              originalData.tsordersolve,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.cxordersolve?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.cxordersolve?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>查询工单问题解决率（省内参评口径）</span>
                </div>
              </>
            }
            action={
              <Tooltip title="已解决查询工单量/（已解决+未解决）查询工单量。">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.cxordersolve?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.cxordersolve.currentValue}
                  unit="%"
                  threshold={indicatorData.cxordersolve.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.cxordersolve || ({} as ProcessedIndicatorData),
              'cxordersolve',
              true,
            )}
          >
            {renderChartWithModal01(
              'cxordersolve',
              '查询工单问题解决率（省内参评口径）',
              indicatorData.cxordersolve?.chartData,
              originalData.cxordersolve,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.gzordersolve?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.gzordersolve?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>故障工单问题解决率（省内参评口径）</span>
                </div>
              </>
            }
            action={
              <Tooltip title="已解决故障工单量/（已解决+未解决）故障工单量。">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.gzordersolve?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.gzordersolve.currentValue}
                  unit="%"
                  threshold={indicatorData.gzordersolve.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.gzordersolve || ({} as ProcessedIndicatorData),
              'gzordersolve',
              true,
            )}
          >
            {renderChartWithModal01(
              'gzordersolve',
              '故障工单问题解决率（省内参评口径）',
              indicatorData.gzordersolve?.chartData,
              originalData.gzordersolve,
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
                    color={indicatorData.tsordertimerat?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.tsordertimerat?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>投诉工单及时率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="当期投诉在规定时限（“是否超时”字段为“是”）内办结并回复客户的工单量/投诉单受理总量*100%。">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.tsordertimerat?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.tsordertimerat.currentValue}
                  unit="%"
                  threshold={indicatorData.tsordertimerat.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.tsordertimerat || ({} as ProcessedIndicatorData),
              'tsordertimerat',
              true,
            )}
          >
            {renderChartWithModal01(
              'tsordertimerat',
              '投诉工单及时率',
              indicatorData.tsordertimerat?.chartData,
              originalData.tsordertimerat,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.tsorderoverrat?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.tsorderoverrat?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>投诉工单逾限且催单率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="逾限催单量（是否逾限催单”为1量）/工单总量">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.tsorderoverrat?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.tsorderoverrat.currentValue}
                  unit="%"
                  threshold={indicatorData.tsorderoverrat.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.tsorderoverrat || ({} as ProcessedIndicatorData),
              'tsorderoverrat',
              true,
            )}
          >
            {renderChartWithModal01(
              'tsorderoverrat',
              '投诉工单逾限且催单率',
              indicatorData.tsorderoverrat?.chartData,
              originalData.tsorderoverrat,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.ydorderoverrat?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.ydorderoverrat?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>移动故障工单逾限且催单率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="省中心移动故障逾限催单总量/移动故障工单办结总量（逾限时长≥48小时）">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.ydorderoverrat?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.ydorderoverrat.currentValue}
                  unit="%"
                  threshold={indicatorData.ydorderoverrat.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.ydorderoverrat || ({} as ProcessedIndicatorData),
              'ydorderoverrat',
              true,
            )}
          >
            {renderChartWithModal01(
              'ydorderoverrat',
              '移动故障工单逾限且催单率',
              indicatorData.ydorderoverrat?.chartData,
              originalData.ydorderoverrat,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.kdorderoverrat?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.kdorderoverrat?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>宽带故障工单逾限且催单率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="省级归档宽带故障工单逾限且催单量/省级归档宽带故障工单总量">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.kdorderoverrat?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.kdorderoverrat.currentValue}
                  unit="%"
                  threshold={indicatorData.kdorderoverrat.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.kdorderoverrat || ({} as ProcessedIndicatorData),
              'kdorderoverrat',
              true,
            )}
          >
            {renderChartWithModal01(
              'kdorderoverrat',
              '宽带故障工单逾限且催单率',
              indicatorData.kdorderoverrat?.chartData,
              originalData.kdorderoverrat,
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
                    color={indicatorData.kdonlinepre?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.kdonlinepre?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>宽带在线预处理率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="省级归档工单量（一级+二级）/全省归档宽带故障工单总量（数据故障）">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.kdonlinepre?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.kdonlinepre.currentValue}
                  unit="%"
                  threshold={indicatorData.kdonlinepre.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.kdonlinepre || ({} as ProcessedIndicatorData),
              'kdonlinepre',
              true,
            )}
          >
            {renderChartWithModal01(
              'kdonlinepre',
              '宽带在线预处理率',
              indicatorData.kdonlinepre?.chartData,
              originalData.kdonlinepre,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.kdorderpre?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.kdorderpre?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>宽带故障预处理及时率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="二级1小时内处理量/二级到达总量（剔除夜间时长22:00-08:00）">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.kdorderpre?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.kdorderpre.currentValue}
                  unit="%"
                  threshold={indicatorData.kdorderpre.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.kdorderpre || ({} as ProcessedIndicatorData),
              'kdorderpre',
              true,
            )}
          >
            {renderChartWithModal01(
              'kdorderpre',
              '宽带故障预处理及时率',
              indicatorData.kdorderpre?.chartData,
              originalData.kdorderpre,
            )}
          </ChartCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

// @ts-ignore
export default Order;
