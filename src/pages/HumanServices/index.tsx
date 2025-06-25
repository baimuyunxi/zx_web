import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import { Col, Divider, Row, Space, StatisticProps, Tag } from 'antd';
import ChartCard from '@/pages/components/Charts/ChartCard';
import Trend from '../components/Trend';
import useStyles from '@/pages/HumanServices/style.style';
import CountUp from 'react-countup';
import StatisticDisplay from '@/pages/components/StatisticDisplay';

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
            title={<span className={styles.titleSpan}>万号人工话务总量</span>}
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
            title={<span className={styles.titleSpan}>语音人工呼入量</span>}
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
            title={<span className={styles.titleSpan}>文字客服呼入量</span>}
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
            title={<span className={styles.titleSpan}>远程柜台呼入量</span>}
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
            title={<span className={styles.titleSpan}>语音客服15秒接通率</span>}
            total={<StatisticDisplay value={85.2} suffix="%" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span className={styles.titleSpan}>文字客服5分钟接通率</span>}
            total={<StatisticDisplay value={92} suffix="%" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span className={styles.titleSpan}>远程柜台25秒接通率</span>}
            total={<StatisticDisplay value={78} suffix="%" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span className={styles.titleSpan}>10009号15秒接通率</span>}
            total={<StatisticDisplay value={88} suffix="%" />}
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={<span className={styles.titleSpan}>10000号适老化接通率</span>}
            total={<StatisticDisplay value={95} suffix="%" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span className={styles.titleSpan}>10000号人工一解率</span>}
            total={<StatisticDisplay value={83} suffix="%" />}
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span className={styles.titleSpan}>10000号重复来电率</span>}
            total={<StatisticDisplay value={12} suffix="%" />}
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
            title={<span className={styles.titleSpan}>语音人均月接话量</span>}
            total={<StatisticDisplay value={1234} unit="次" />}
            footer={
              <>
                <Trend value="-8%">月环比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span className={styles.titleSpan}>语音通话强度</span>}
            total={<StatisticDisplay value={876} unit="分钟" />}
            footer={
              <>
                <Trend value="-8%">月环比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span className={styles.titleSpan}>夜间语音人工接话量降幅</span>}
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
            title={<span className={styles.titleSpan}>语音通话利用率</span>}
            total={<StatisticDisplay value={91} suffix="%" />}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HumanServices;
