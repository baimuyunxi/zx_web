import { GridContent, PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { Card, Col, FloatButton, message, Row } from 'antd';
import { RobotOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import TopSalesItem from '@/pages/OtherFrom/SIUnsubscribe/components/TopSalesItem';
import CardIndicatorValue from '@/pages/OtherFrom/SIUnsubscribe/components/CardIndicatorValue';
import TrendValue from '@/pages/OtherFrom/SIUnsubscribe/components/TrendValue';
// 模拟数据
const mockData = {
  ivr: {
    dailyOrders: { value: 1234, change: 12.5, isUp: true },
    dailyOrdersRate: { value: 12.5, change: 2.3, isUp: true },
    monthlyOrders: { value: 35678, change: -5.2, isUp: false },
    monthlyOrdersRate: { value: -5.2, change: -1.8, isUp: false },
    dailyUnsubscribe: { value: 89, change: -8.9, isUp: false },
    dailyUnsubscribeRate: { value: -8.9, change: -3.2, isUp: false },
    monthlyUnsubscribe: { value: 2156, change: 15.6, isUp: true },
    monthlyUnsubscribeRate: { value: 15.6, change: 5.4, isUp: true },
  },
  traffic: {
    dailyOrders: { value: 2456, change: 18.7, isUp: true },
    dailyOrdersRate: { value: 18.7, change: 4.2, isUp: true },
    monthlyOrders: { value: 67890, change: 8.3, isUp: true },
    monthlyOrdersRate: { value: 8.3, change: 2.1, isUp: true },
    dailyUnsubscribe: { value: 156, change: -12.4, isUp: false },
    dailyUnsubscribeRate: { value: -12.4, change: -4.8, isUp: false },
    monthlyUnsubscribe: { value: 3421, change: -7.8, isUp: false },
    monthlyUnsubscribeRate: { value: -7.8, change: -2.9, isUp: false },
  },
};

const SalesItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ivr');

  const currentData = mockData[activeTab as keyof typeof mockData];

  // 切换到小翼数据
  const handleSwitchToIVR = () => {
    setActiveTab('ivr');
    message.success('已切换到小翼数据');
  };

  // 切换到人工数据
  const handleSwitchToTraffic = () => {
    setActiveTab('traffic');
    message.success('已切换到人工数据');
  };

  return (
    <PageContainer>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ insetInlineEnd: 24 }}
        icon={<SwapOutlined />}
      >
        <FloatButton
          icon={<RobotOutlined />}
          onClick={handleSwitchToIVR}
          tooltip="切换到小翼数据"
          type={activeTab === 'ivr' ? 'primary' : 'default'}
        />
        <FloatButton
          icon={<UserOutlined />}
          onClick={handleSwitchToTraffic}
          tooltip="切换到人工数据"
          type={activeTab === 'traffic' ? 'primary' : 'default'}
        />
      </FloatButton.Group>
      <span style={{ color: 'red' }}>
        <strong>*</strong> 数据截止时间: 2021-07-01 (当前显示:{' '}
        {activeTab === 'ivr' ? '小翼' : '人工'}数据)
      </span>
      <GridContent>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              variant="borderless"
              style={{
                marginBottom: 24,
              }}
              title={'销售品订购TOP'}
            >
              <TopSalesItem />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              variant="borderless"
              style={{
                marginBottom: 24,
              }}
              title={'销售品退订TOP'}
            >
              <TopSalesItem />
            </Card>
          </Col>
        </Row>
        <Card variant="borderless">
          <CardIndicatorValue currentData={currentData} />

          <TrendValue />
        </Card>
      </GridContent>
    </PageContainer>
  );
};

export default SalesItems;
