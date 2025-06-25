import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import { Col, Divider, Row, Space, StatisticProps, Tag, Tooltip } from 'antd';
import ChartCard from '@/pages/components/Charts/ChartCard';
import Trend from '../components/Trend';
import useStyles from '@/pages/HumanServices/style.style';
import CountUp from 'react-countup';
import StatisticDisplay from '@/pages/components/StatisticDisplay';
import { InfoCircleOutlined } from '@ant-design/icons';

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

  // 获取原始数值的小数位数
  const decimalPlaces = (numValue.toString().split('.')[1] || '').length;

  return (
    <CountUp
      end={numValue}
      separator={','}
      decimals={decimalPlaces} // 保持原有的小数位数
      decimal="."
    />
  );
};

const HumanServices = () => {
  const { styles } = useStyles();

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
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
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
              <StatisticDisplay value={12344} unit="次" monthLabel="当月累计" monthValue="123万" />
            }
            footer={
              <>
                <Trend value="12%">日环比</Trend>

                <Trend value="-8%">月环比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
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
              <StatisticDisplay value={8567} unit="次" monthLabel="当月累计" monthValue="123万" />
            }
            footer={
              <>
                <Trend value="12%">日环比</Trend>

                <Trend value="-8%">月环比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
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
              <StatisticDisplay value={2156} unit="次" monthLabel="当月累计" monthValue="123万" />
            }
            footer={
              <>
                <Trend value="12%">日环比</Trend>

                <Trend value="-8%">月环比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="#f50" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月23日
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
              <StatisticDisplay value={1290} unit="次" monthLabel="当月累计" monthValue="123万" />
            }
            footer={
              <>
                <Trend value="12%">日环比</Trend>

                <Trend value="-8%">月环比</Trend>
              </>
            }
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
                  </Tag>
                  <span className={styles.titleSpan}>语音客服15秒接通率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户拨打10000号的人工服务请求在15秒内接通次数/人工服务请求总数*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={<StatisticDisplay value={85.2} suffix="%" threshold="up" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
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
            total={<StatisticDisplay value={92} suffix="%" threshold="down" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
                  </Tag>
                  <span className={styles.titleSpan}>远程柜台25秒接通率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户请求远柜人工服务在25秒内的接通量/远程柜台请求量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={<StatisticDisplay value={78} suffix="%" threshold="flat" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
                  </Tag>
                  <span className={styles.titleSpan}>10009号15秒接通率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="10009号的人工服务请求在15秒内接通次数/人工服务请求总数*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={<StatisticDisplay value={88} suffix="%" threshold="up" />}
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
                  </Tag>
                  <span className={styles.titleSpan}>10000号适老化接通率</span>
                </div>
              </>
            }
            action={
              <Tooltip title="用户拨打10000号进入尊老专席话务接通量/尊老专席请求量*100%">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={<StatisticDisplay value={95} suffix="%" threshold="up" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
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
            total={<StatisticDisplay value={83} suffix="%" threshold="up" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
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
            total={<StatisticDisplay value={12} suffix="%" threshold="up" />}
          />
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
                    6月24日
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
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
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
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
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
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag color="orange" bordered={false} style={{ fontSize: 12, margin: 0 }}>
                    6月24日
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
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HumanServices;
