import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import { Col, Divider, Row, Space, Statistic, StatisticProps, Tag } from 'antd';
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
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>万号人工话务总量</span>}
            total={
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Statistic
                  value={12344}
                  formatter={formatter}
                  valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                />
                <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>次</span>
              </div>
            }
            footer={
              <>
                <Trend value="12%">周同比</Trend>

                <Trend value="-8%">日同比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>语音人工呼入量</span>}
            total={
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Statistic
                  value={8567}
                  formatter={formatter}
                  valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                />
                <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>次</span>
              </div>
            }
            footer={
              <>
                <Trend value="12%">周同比</Trend>

                <Trend value="-8%">日同比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>文字客服呼入量</span>}
            total={
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Statistic
                  value={2134}
                  formatter={formatter}
                  valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                />
                <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>次</span>
              </div>
            }
            footer={
              <>
                <Trend value="12%">周同比</Trend>

                <Trend value="-8%">日同比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>远程柜台呼入量</span>}
            total={
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Statistic
                  value={1643}
                  formatter={formatter}
                  valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                />
                <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>次</span>
              </div>
            }
            footer={
              <>
                <Trend value="12%">周同比</Trend>

                <Trend value="-8%">日同比</Trend>
              </>
            }
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>语音客服15秒接通率</span>}
            total={
              <Statistic
                value={85.2}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                suffix="%"
              />
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>文字客服5分钟接通率</span>}
            total={
              <Statistic
                value={92}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                suffix="%"
              />
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>远程柜台25秒接通率</span>}
            total={
              <Statistic
                value={78}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                suffix="%"
              />
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>10009号15秒接通率</span>}
            total={
              <Statistic
                value={88}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                suffix="%"
              />
            }
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>10000号适老化接通率</span>}
            total={
              <Statistic
                value={95}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                suffix="%"
              />
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>10000号人工一解率</span>}
            total={
              <Statistic
                value={83}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                suffix="%"
              />
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>10000号重复来电率</span>}
            total={
              <Statistic
                value={12}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                suffix="%"
              />
            }
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
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>语音人均月接话量</span>}
            total={
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Statistic
                  value={1234}
                  formatter={formatter}
                  valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                />
                <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>次</span>
              </div>
            }
            footer={
              <>
                <Trend value="12%">周同比</Trend>

                <Trend value="-8%">日同比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>语音通话强度</span>}
            total={
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Statistic
                  value={876}
                  formatter={formatter}
                  valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                />
                <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>分钟</span>
              </div>
            }
            footer={
              <>
                <Trend value="12%">周同比</Trend>

                <Trend value="-8%">日同比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>夜间语音人工接话量降幅</span>}
            total={
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Statistic
                  value={234}
                  formatter={formatter}
                  valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                />
                <span style={{ fontSize: 14, color: '#999', marginLeft: 8 }}>次</span>
              </div>
            }
            footer={
              <>
                <Trend value="12%">周同比</Trend>

                <Trend value="-8%">日同比</Trend>
              </>
            }
          />
        </Col>
        <Col {...topColProps}>
          <ChartCard
            title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>语音通话利用率</span>}
            total={
              <Statistic
                value={91}
                formatter={formatter}
                valueStyle={{ color: '#1890ff', fontSize: 30, fontWeight: 'bold' }}
                suffix="%"
              />
            }
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HumanServices;
