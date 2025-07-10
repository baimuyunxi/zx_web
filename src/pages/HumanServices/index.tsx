import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Col, Divider, Row, Space, StatisticProps, Tag, Tooltip } from 'antd';
import ChartCard from '@/pages/components/Charts/ChartCard';
import Trend from '../components/Trend';
import useStyles from '@/pages/HumanServices/style.style';
import CountUp from 'react-countup';
import StatisticDisplay from '@/pages/components/StatisticDisplay';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useChartModal01 } from '@/pages/HumanServices/components/Graph/01/utils/useChartModal01';
import { createChartRenderer01 } from '@/pages/HumanServices/components/Graph/01/utils/chartCardUtils01';
import { useChartModal02 } from '@/pages/HumanServices/components/Graph/02/utils/useChartModal02';
import { createChartRenderer02 } from '@/pages/HumanServices/components/Graph/02/utils/chartCardUtils02';
import {
  getArtCallinCt,
  getArtConnRt,
  getConn15Rate,
  getFarCabinetCt,
  getFarCabinetRate,
  getOnceRate,
  getRepeatRate,
  getWanHaoCt,
  getWord5Rate,
  getWordCallinCt,
} from './service';
import {
  formatPercentage,
  formatPP,
  formatValue,
  IndicatorData,
  IndicatorResponse,
  ProcessedIndicatorData,
  processIndicatorData,
} from './utils/indicatorDataUtils';

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

const formatter: StatisticProps['formatter'] = (value) => {
  const numValue = value as number;
  const decimalPlaces = (numValue.toString().split('.')[1] || '').length;

  return <CountUp end={numValue} separator={','} decimals={decimalPlaces} decimal="." />;
};

const HumanServices = () => {
  const { styles } = useStyles();

  // 状态管理
  const [indicatorData, setIndicatorData] = useState<Record<string, ProcessedIndicatorData>>({});
  const [originalData, setOriginalData] = useState<Record<string, IndicatorData[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

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

  /**
   * 月指标状态管理
   */
  const { showModal02, handleModalClose02, getModalState02 } = useChartModal02();
  const renderChartWithModal02 = createChartRenderer02(
    getModalState02,
    showModal02,
    handleModalClose02,
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
    loadIndicatorData('wanHaoCt', getWanHaoCt);
    loadIndicatorData('artCallinCt', getArtCallinCt);
    loadIndicatorData('conn15Rate', getConn15Rate);
    loadIndicatorData('artConnRt', getArtConnRt);
    loadIndicatorData('wordCallinCt', getWordCallinCt);
    loadIndicatorData('word5Rate', getWord5Rate);
    loadIndicatorData('farCabinetCt', getFarCabinetCt);
    loadIndicatorData('farCabinetRate', getFarCabinetRate);
    loadIndicatorData('onceRate', getOnceRate);
    loadIndicatorData('repeatRate', getRepeatRate);
  }, []);

  // 渲染数据同步提示
  const renderUnsyncedData = (unit: string = '次') => (
    <StatisticDisplay value={0} unit={unit} monthLabel="数据暂未同步" monthValue="--" />
  );

  // 渲染数据同步提示（百分比类型）
  const renderUnsyncedPercentageData = () => (
    <StatisticDisplay value={0} suffix="%" monthLabel="数据暂未同步" />
  );

  // 判断是否为呼入量指标（只有呼入量指标才显示月环比）
  const isVolumeIndicator = (key: string): boolean => {
    return ['wanHaoCt', 'artCallinCt', 'wordCallinCt', 'farCabinetCt'].includes(key);
  };

  // 渲染Footer
  const renderFooter = (
    data: ProcessedIndicatorData,
    indicatorKey: string,
    isPercentage: boolean = false,
  ) => {
    if (!data.isDataSynced) {
      return (
        <>
          <Trend value="--">日环比</Trend>
          {isVolumeIndicator(indicatorKey) && <Trend value="--">月环比</Trend>}
        </>
      );
    }

    return (
      <>
        <Trend value={isPercentage ? formatPP(data.dayRatio) : formatPercentage(data.dayRatio)}>
          日环比
        </Trend>
        {isVolumeIndicator(indicatorKey) && (
          <Trend
            value={isPercentage ? formatPP(data.monthRatio) : formatPercentage(data.monthRatio)}
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
                    color={indicatorData.wanHaoCt?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.wanHaoCt?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>万号人工话务总量</span>
                </div>
              </>
            }
            action={
              <Tooltip title="语音人工呼入量+文字客服呼入量">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.wanHaoCt?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.wanHaoCt.currentValue}
                  unit="次"
                  monthLabel="当月累计"
                  monthValue={formatValue(indicatorData.wanHaoCt.monthValue, '次')}
                />
              ) : (
                renderUnsyncedData()
              )
            }
            footer={renderFooter(
              indicatorData.wanHaoCt || ({} as ProcessedIndicatorData),
              'wanHaoCt',
            )}
          >
            {renderChartWithModal01(
              'total_volume',
              '万号人工话务总量',
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
                  <span className={styles.titleSpan}>语音人工呼入量</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户拨打10000号请求进人工的量">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.artCallinCt?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.artCallinCt.currentValue}
                  unit="次"
                  monthLabel="当月累计"
                  monthValue={formatValue(indicatorData.artCallinCt.monthValue, '次')}
                />
              ) : (
                renderUnsyncedData()
              )
            }
            footer={renderFooter(
              indicatorData.artCallinCt || ({} as ProcessedIndicatorData),
              'artCallinCt',
            )}
          >
            {renderChartWithModal01(
              'voice_calls',
              '语音人工呼入量',
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
                  <span className={styles.titleSpan}>语音客服15S接通率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户拨打10000号的人工服务请求在15秒内接通次数/人工服务请求总数*100%。">
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
              '语音客服15S接通率',
              indicatorData.conn15Rate?.chartData,
              originalData.conn15Rate,
            )}
          </ChartCard>
        </Col>

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
                  <span className={styles.titleSpan}>10000号适老化接通率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户拨打10000号进入尊老专席话务接通量/尊老专席请求量*100%。">
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
              '10000号适老化接通率',
              indicatorData.artConnRt?.chartData,
              originalData.artConnRt,
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
                  <span className={styles.titleSpan}>文字客服呼入量</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户请求文字客服量">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.wordCallinCt?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.wordCallinCt.currentValue}
                  unit="次"
                  monthLabel="当月累计"
                  monthValue={formatValue(indicatorData.wordCallinCt.monthValue, '次')}
                />
              ) : (
                renderUnsyncedData()
              )
            }
            footer={renderFooter(
              indicatorData.wordCallinCt || ({} as ProcessedIndicatorData),
              'wordCallinCt',
            )}
          >
            {renderChartWithModal01(
              'text_service',
              '文字客服呼入量',
              indicatorData.wordCallinCt?.chartData,
              originalData.wordCallinCt,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.word5Rate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.word5Rate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>文字客服5分钟接通率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户请求文字客服在5分钟内的接通量/文字客服请求量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.word5Rate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.word5Rate.currentValue}
                  suffix="%"
                  threshold={indicatorData.word5Rate.threshold || 'down'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.word5Rate || ({} as ProcessedIndicatorData),
              'word5Rate',
              true,
            )}
          >
            {renderChartWithModal01(
              'text_5min_rate',
              '文字客服5分钟接通率',
              indicatorData.word5Rate?.chartData,
              originalData.word5Rate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.farCabinetCt?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.farCabinetCt?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>远程柜台呼入量</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户请求远程柜台量">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.farCabinetCt?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.farCabinetCt.currentValue}
                  unit="次"
                  monthLabel="当月累计"
                  monthValue={formatValue(indicatorData.farCabinetCt.monthValue, '次')}
                />
              ) : (
                renderUnsyncedData()
              )
            }
            footer={renderFooter(
              indicatorData.farCabinetCt || ({} as ProcessedIndicatorData),
              'farCabinetCt',
            )}
          >
            {renderChartWithModal01(
              'remote_counter',
              '远程柜台呼入量',
              indicatorData.farCabinetCt?.chartData,
              originalData.farCabinetCt,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.farCabinetRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.farCabinetRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>远程柜台25秒接通率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户请求远柜人工服务在25秒内的接通量/远程柜台请求量*100%。">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.farCabinetRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.farCabinetRate.currentValue}
                  suffix="%"
                  threshold={indicatorData.farCabinetRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.farCabinetRate || ({} as ProcessedIndicatorData),
              'farCabinetRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'remote_25s_rate',
              '远程柜台25秒接通率',
              indicatorData.farCabinetRate?.chartData,
              originalData.farCabinetRate,
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
                    color={indicatorData.onceRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.onceRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>10000号人工一解率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="10000号人工一次即解决问题的服务/10000号总人工服务*100%。 其中，同一主叫号码在24小时内，未重复拨打 10000 号人工服务视为人工服务一次解决">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.onceRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.onceRate.currentValue}
                  suffix="%"
                  threshold={indicatorData.onceRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.onceRate || ({} as ProcessedIndicatorData),
              'onceRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'first_solution_rate',
              '10000号人工一解率',
              indicatorData.onceRate?.chartData,
              originalData.onceRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag
                    color={indicatorData.repeatRate?.dateColor || '#f50'}
                    bordered={false}
                    style={{ fontSize: 12, margin: 0 }}
                  >
                    {indicatorData.repeatRate?.dateTag || '暂无数据'}
                  </Tag>
                  <span className={styles.titleSpan}>10000号重复来电率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="同一主叫号码，连续7天内拨打10000号并接通人工达到4次或以上的话务量/同周期人工接通量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={
              indicatorData.repeatRate?.isDataSynced ? (
                <StatisticDisplay
                  value={indicatorData.repeatRate.currentValue}
                  suffix="%"
                  threshold={indicatorData.repeatRate.threshold || 'up'}
                />
              ) : (
                renderUnsyncedPercentageData()
              )
            }
            footer={renderFooter(
              indicatorData.repeatRate || ({} as ProcessedIndicatorData),
              'repeatRate',
              true,
            )}
          >
            {renderChartWithModal01(
              'repeat_call_rate',
              '10000号重复来电率',
              indicatorData.repeatRate?.chartData,
              originalData.repeatRate,
            )}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
                  </Tag>
                  <span className={styles.titleSpan}>10009号15接通率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="10009号的人工服务请求在15秒内接通次数/人工服务请求总数*100%。">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={<StatisticDisplay value={95} suffix="%" threshold="up" />}
            footer={
              <>
                <Trend value="12PP">日环比</Trend>
                <Trend value="-8PP">月环比</Trend>
              </>
            }
          >
            {renderChartWithModal01('10009_15s_rate', '10009号15接通率')}
          </ChartCard>
        </Col>
      </Row>

      <Divider orientation="left" style={{ fontSize: 18, fontWeight: 'bold', marginTop: 12 }}>
        <Space>
          📈 月指标
          {/*@ts-ignore*/}
          <Tag color="green" size="small">
            月度统计
          </Tag>
        </Space>
      </Divider>

      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月
                  </Tag>
                  <span className={styles.titleSpan}>语音人均月接话量</span>
                </div>
              </>
            }
            action={
              <Tooltip title="客服代表月度接话量的平均值；剔除月接话量1000以下的工号，剔除月工作时长小于100小时的工号">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={<StatisticDisplay value={1234} unit="次" threshold="up" />}
            footer={
              <>
                <Trend value="-8%">月环比</Trend>
              </>
            }
          >
            {renderChartWithModal02('monthly_calls_per_person', '语音人均月接话量')}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月
                  </Tag>
                  <span className={styles.titleSpan}>语音通话强度</span>
                </div>
              </>
            }
            action={
              <Tooltip title="客服代表每月累计通话时长的平均值；剔除月接话量1000以下的工号，剔除月工作时长小于100小时的工号">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={<StatisticDisplay value={876} unit="时" threshold="up" />}
            footer={
              <>
                <Trend value="-8%">月环比</Trend>
              </>
            }
          >
            {renderChartWithModal02('call_intensity', '语音通话强度')}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月
                  </Tag>
                  <span className={styles.titleSpan}>夜间语音人工接话量降幅</span>
                </div>
              </>
            }
            action={
              <Tooltip title="23年9月为T0值，与24年夜间服务量夜间服务量的涨降幅对比，如7月夜间语音人工接通量降幅=24年7月夜间人工接通量/23年9月夜间人工接通量-1">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={<StatisticDisplay value={234} unit="次" />}
            footer={
              <>
                <Trend value="-8%">月环比</Trend>
              </>
            }
          >
            {renderChartWithModal02('night_decline', '夜间语音人工接话量降幅')}
          </ChartCard>
        </Col>

        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月
                  </Tag>
                  <span className={styles.titleSpan}>语音通话利用率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="客服代表在签入系统时间中用于接听话务的时间占比（呼入通话时长/签入时长×100%）；剔除月接话量1000以下的工号，剔除月工作时长小于100小时的工号">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={<StatisticDisplay value={91} suffix="%" threshold="up" />}
            footer={
              <>
                <Trend value="-8PP">月环比</Trend>
              </>
            }
          >
            {renderChartWithModal02('call_utilization', '语音通话利用率')}
          </ChartCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HumanServices;
