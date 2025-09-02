import { GridContent, PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Card, Col, FloatButton, message, Row } from 'antd';
import { RobotOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import TopSalesItem from '@/pages/OtherFrom/SIUnsubscribe/components/TopSalesItem';
import CardIndicatorValue from '@/pages/OtherFrom/SIUnsubscribe/components/CardIndicatorValue';
import TrendValue from '@/pages/OtherFrom/SIUnsubscribe/components/TrendValue';
import { getIvrBoard, getIvrTopRank, getIvrTrend } from '@/pages/OtherFrom/SIUnsubscribe/service';

// 人工数据的默认值
const trafficDefaultData = {
  dailyOrders: { value: 0, change: 0, isUp: false },
  dailyOrdersRate: { value: 0, change: 0, isUp: false },
  monthlyOrders: { value: 0, change: 0, isUp: false },
  monthlyOrdersRate: { value: 0, change: 0, isUp: false },
  dailyUnsubscribe: { value: 0, change: 0, isUp: false },
  dailyUnsubscribeRate: { value: 0, change: 0, isUp: false },
  monthlyUnsubscribe: { value: 0, change: 0, isUp: false },
  monthlyUnsubscribeRate: { value: 0, change: 0, isUp: false },
};

const SalesItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ivr');
  const [loading, setLoading] = useState(false);
  const [boardLoading, setBoardLoading] = useState(false);
  const [trendLoading, setTrendLoading] = useState(false);

  // IVR 数据状态
  const [maxDay, setMaxDay] = useState('2021-07-01');
  const [orderTopData, setOrderTopData] = useState([]);
  const [unsubscribeTopData, setUnsubscribeTopData] = useState([]);
  const [boardData, setBoardData] = useState(null);
  const [trendData, setTrendData] = useState([]);

  const currentData = activeTab === 'ivr' ? boardData : trafficDefaultData;

  // 获取 IVR 排行数据
  const fetchIvrTopRank = async () => {
    try {
      setLoading(true);
      const response = await getIvrTopRank();
      if (response.code === 200) {
        setMaxDay(response.maxDay || '2021-07-01');
        setOrderTopData(response.orderData || []);
        setUnsubscribeTopData(response.unsubscribeData || []);
      }
    } catch (error) {
      message.error('获取排行数据失败');
      console.error('获取排行数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取 IVR 看板数据
  const fetchIvrBoard = async () => {
    try {
      setBoardLoading(true);
      const response = await getIvrBoard();
      if (response.code === 200) {
        const orderData = response.orderData?.[0] || {};
        const unsubscribeData = response.unsubscribeData?.[0] || {};

        const transformedData = {
          dailyOrders: {
            value: orderData.currentCount || 0,
            change: orderData.growthRatePercent || 0,
            isUp: orderData.growthOpinion || false,
          },
          dailyOrdersRate: {
            value: orderData.growthRatePercent || 0,
            change: orderData.growthRatePercent || 0,
            isUp: orderData.growthOpinion || false,
          },
          monthlyOrders: {
            value: orderData.monCurrentCount || 0,
            change: orderData.monGrowthRatePercent || 0,
            isUp: orderData.monGrowthOpinion || false,
          },
          monthlyOrdersRate: {
            value: orderData.monGrowthRatePercent || 0,
            change: orderData.monGrowthRatePercent || 0,
            isUp: orderData.monGrowthOpinion || false,
          },
          dailyUnsubscribe: {
            value: unsubscribeData.currentCount || 0,
            change: unsubscribeData.growthRatePercent || 0,
            isUp: unsubscribeData.growthOpinion || false,
          },
          dailyUnsubscribeRate: {
            value: unsubscribeData.growthRatePercent || 0,
            change: unsubscribeData.growthRatePercent || 0,
            isUp: unsubscribeData.growthOpinion || false,
          },
          monthlyUnsubscribe: {
            value: unsubscribeData.monCurrentCount || 0,
            change: unsubscribeData.monGrowthRatePercent || 0,
            isUp: unsubscribeData.monGrowthOpinion || false,
          },
          monthlyUnsubscribeRate: {
            value: unsubscribeData.monGrowthRatePercent || 0,
            change: unsubscribeData.monGrowthRatePercent || 0,
            isUp: unsubscribeData.monGrowthOpinion || false,
          },
        };
        setBoardData(transformedData);
      }
    } catch (error) {
      message.error('获取看板数据失败');
      console.error('获取看板数据失败:', error);
    } finally {
      setBoardLoading(false);
    }
  };

  // 获取 IVR 趋势数据
  const fetchIvrTrend = async () => {
    try {
      setTrendLoading(true);
      const response = await getIvrTrend();
      if (response.code === 200) {
        setTrendData(response.data || []);
      }
    } catch (error) {
      message.error('获取趋势数据失败');
      console.error('获取趋势数据失败:', error);
    } finally {
      setTrendLoading(false);
    }
  };

  // 初始化加载 IVR 数据
  useEffect(() => {
    if (activeTab === 'ivr') {
      fetchIvrTopRank();
      fetchIvrBoard();
      fetchIvrTrend();
    }
  }, []);

  // 切换到小翼数据
  const handleSwitchToIVR = () => {
    setActiveTab('ivr');
    fetchIvrTopRank();
    fetchIvrBoard();
    fetchIvrTrend();
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
        <strong>*</strong> 数据截止时间: {activeTab === 'ivr' ? maxDay : 'null'} (当前显示:{' '}
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
              <TopSalesItem
                dataSource={activeTab === 'ivr' ? orderTopData : []}
                loading={activeTab === 'ivr' ? loading : false}
              />
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
              <TopSalesItem
                dataSource={activeTab === 'ivr' ? unsubscribeTopData : []}
                loading={activeTab === 'ivr' ? loading : false}
              />
            </Card>
          </Col>
        </Row>
        <Card variant="borderless">
          <CardIndicatorValue
            currentData={currentData}
            loading={activeTab === 'ivr' ? boardLoading : false}
          />

          <TrendValue
            data={activeTab === 'ivr' ? trendData : []}
            loading={activeTab === 'ivr' ? trendLoading : false}
          />
        </Card>
      </GridContent>
    </PageContainer>
  );
};

export default SalesItems;
