import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import { Col, Divider, Row, Statistic, StatisticProps } from 'antd';
import ChartCard from '@/pages/components/Charts/ChartCard';
import Trend from '../components/Trend';
import useStyles from '@/pages/HumanServices/style.style';
import CountUp from 'react-countup';

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

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator={','} />
);

const HumanServices: React.FC = () => {
  const { styles } = useStyles();

  return (
    <PageContainer>
      <Divider orientation="left">日指标</Divider>
      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>万号人工话务总量</span>}
            total={
              <Statistic
                value={12344}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
              />
            }
            footer={
              <>
                <Trend
                  flag="up"
                  style={{
                    marginRight: 16,
                  }}
                >
                  周同比
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  日同比
                  <span className={styles.trendText}>11%</span>
                </Trend>
              </>
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>语音人工呼入量</span>}
            total={
              <Statistic
                value={12344}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
              />
            }
            footer={
              <>
                <Trend
                  flag="up"
                  style={{
                    marginRight: 16,
                  }}
                >
                  周同比
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  日同比
                  <span className={styles.trendText}>11%</span>
                </Trend>
              </>
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>文字客服呼入量</span>}
            total={
              <Statistic
                value={12344}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
              />
            }
            footer={
              <>
                <Trend
                  flag="up"
                  style={{
                    marginRight: 16,
                  }}
                >
                  周同比
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  日同比
                  <span className={styles.trendText}>11%</span>
                </Trend>
              </>
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>远程柜台呼入量</span>}
            total={
              <Statistic
                value={12344}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
              />
            }
            footer={
              <>
                <Trend
                  flag="up"
                  style={{
                    marginRight: 16,
                  }}
                >
                  周同比
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  日同比
                  <span className={styles.trendText}>11%</span>
                </Trend>
              </>
            }
          ></ChartCard>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>语音客服15秒接通率</span>}
            total={
              <Statistic
                value={85}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
                suffix={'%'}
              />
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>文字客服5分钟接通率</span>}
            total={
              <Statistic
                value={85}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
                suffix={'%'}
              />
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>远程柜台25秒接通率</span>}
            total={
              <Statistic
                value={85}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
                suffix={'%'}
              />
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>10009号15秒接通率</span>}
            total={
              <Statistic
                value={85}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
                suffix={'%'}
              />
            }
          ></ChartCard>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>10000号适老化接通率</span>}
            total={
              <Statistic
                value={85}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
                suffix={'%'}
              />
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>10000号人工一解率</span>}
            total={
              <Statistic
                value={85}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
                suffix={'%'}
              />
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>10000号重复来电率</span>}
            total={
              <Statistic
                value={85}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
                suffix={'%'}
              />
            }
          ></ChartCard>
        </Col>
      </Row>
      <Divider orientation="left">月指标</Divider>
      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>语音人均月接话量</span>}
            total={
              <Statistic
                value={1234}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
              />
            }
            footer={
              <>
                <Trend
                  flag="up"
                  style={{
                    marginRight: 16,
                  }}
                >
                  周同比
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  日同比
                  <span className={styles.trendText}>11%</span>
                </Trend>
              </>
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>语音通话强度</span>}
            total={
              <Statistic
                value={1234}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
              />
            }
            footer={
              <>
                <Trend
                  flag="up"
                  style={{
                    marginRight: 16,
                  }}
                >
                  周同比
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  日同比
                  <span className={styles.trendText}>11%</span>
                </Trend>
              </>
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={
              <span style={{ fontSize: '16px', color: '#8c8c8c' }}>夜间语音人工接话量降幅</span>
            }
            total={
              <Statistic
                value={1234}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
              />
            }
            footer={
              <>
                <Trend
                  flag="up"
                  style={{
                    marginRight: 16,
                  }}
                >
                  周同比
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  日同比
                  <span className={styles.trendText}>11%</span>
                </Trend>
              </>
            }
          ></ChartCard>
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>语音通话利用率</span>}
            total={
              <Statistic
                value={85}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: '30px', fontWeight: 'bold' }}
                suffix={'%'}
              />
            }
          ></ChartCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HumanServices;
