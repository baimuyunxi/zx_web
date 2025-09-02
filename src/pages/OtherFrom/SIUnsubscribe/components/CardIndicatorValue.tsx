import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Spin, Statistic, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

// 定义 props 类型
interface DataItem {
  value: number;
  change: number;
  isUp: boolean;
}

interface CurrentData {
  dailyOrders: DataItem;
  dailyOrdersRate: DataItem;
  monthlyOrders: DataItem;
  monthlyOrdersRate: DataItem;
  dailyUnsubscribe: DataItem;
  dailyUnsubscribeRate: DataItem;
  monthlyUnsubscribe: DataItem;
  monthlyUnsubscribeRate: DataItem;
}

interface CardIndicatorValueProps {
  currentData: CurrentData;
  loading?: boolean;
}

const CardIndicatorValue: React.FC<CardIndicatorValueProps> = ({
  currentData,
  loading = false,
}) => {
  // 添加防护，确保 currentData 存在
  if (!currentData && !loading) {
    return <div>数据加载中...</div>;
  }

  return (
    <Card
      variant="borderless"
      style={{
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Spin spinning={loading}>
        <Row gutter={0}>
          <Col xs={24} sm={24} md={12}>
            <Card
              style={{
                background: '#fafafa',
                borderRadius: '8px 0 0 8px',
                height: '100%',
              }}
              bodyStyle={{
                padding: '20px',
                textAlign: 'center',
              }}
              bordered={false}
            >
              <Title
                level={4}
                style={{
                  marginBottom: 16,
                  color: '#1890ff',
                  textAlign: 'center',
                }}
              >
                订购数据
              </Title>
              <Row gutter={[24, 24]} justify="center">
                <Col md={12} sm={12} xs={24} style={{ textAlign: 'center' }}>
                  <Statistic
                    title="日订购量"
                    value={currentData?.dailyOrders?.value || 0}
                    valueStyle={{
                      fontWeight: 'bold',
                      fontSize: '24px',
                      color: currentData?.dailyUnsubscribeRate?.isUp ? '#cf1322' : '#3f8600',
                    }}
                    prefix={
                      currentData?.dailyOrders?.isUp ? (
                        <ArrowUpOutlined style={{ color: '#3f8600' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#cf1322' }} />
                      )
                    }
                    suffix="单"
                  />
                </Col>
                <Col md={12} sm={12} xs={24} style={{ textAlign: 'center' }}>
                  <Statistic
                    title="日订购量环比"
                    value={currentData?.dailyOrdersRate?.value || 0}
                    precision={1}
                    valueStyle={{
                      color: 'rgba(50,50,50)',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                    suffix="%"
                  />
                </Col>
              </Row>
              <Row gutter={[24, 24]} style={{ marginTop: 24 }} justify="center">
                <Col md={12} sm={12} xs={24} style={{ textAlign: 'center' }}>
                  <Statistic
                    title="当月订购量"
                    value={currentData?.monthlyOrders?.value || 0}
                    valueStyle={{
                      color: currentData?.monthlyOrders?.isUp ? '#cf1322' : '#3f8600',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                    prefix={
                      currentData?.monthlyOrders?.isUp ? (
                        <ArrowUpOutlined style={{ color: '#cf1322' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#3f8600' }} />
                      )
                    }
                    suffix="单"
                  />
                </Col>
                <Col md={12} sm={12} xs={24} style={{ textAlign: 'center' }}>
                  <Statistic
                    title="当月订购量环比"
                    value={Math.abs(currentData?.monthlyOrdersRate?.value || 0)}
                    precision={1}
                    valueStyle={{
                      color: 'rgba(50,50,50)',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                    suffix="%"
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Card
              style={{
                background: '#f5f5f5',
                borderRadius: '0 8px 8px 0',
                height: '100%',
              }}
              bodyStyle={{
                padding: '20px',
                textAlign: 'center',
              }}
              bordered={false}
            >
              <Title
                level={4}
                style={{
                  marginBottom: 16,
                  color: '#ff7875',
                  textAlign: 'center',
                }}
              >
                退订数据
              </Title>
              <Row gutter={[24, 24]} justify="center">
                <Col md={12} sm={12} xs={24} style={{ textAlign: 'center' }}>
                  <Statistic
                    title="日退订量"
                    value={currentData?.dailyUnsubscribe?.value || 0}
                    valueStyle={{
                      fontWeight: 'bold',
                      fontSize: '24px',
                      color: currentData?.dailyUnsubscribeRate?.isUp ? '#cf1322' : '#3f8600',
                    }}
                    prefix={
                      currentData?.dailyUnsubscribe?.isUp ? (
                        <ArrowUpOutlined style={{ color: '#cf1322' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#3f8600' }} />
                      )
                    }
                    suffix="单"
                  />
                </Col>
                <Col md={12} sm={12} xs={24} style={{ textAlign: 'center' }}>
                  <Statistic
                    title="日退订量环比"
                    value={Math.abs(currentData?.dailyUnsubscribeRate?.value || 0)}
                    precision={1}
                    valueStyle={{
                      color: 'rgba(50,50,50)',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                    suffix="%"
                  />
                </Col>
              </Row>
              <Row gutter={[24, 24]} style={{ marginTop: 24 }} justify="center">
                <Col md={12} sm={12} xs={24} style={{ textAlign: 'center' }}>
                  <Statistic
                    title="当月退订量"
                    value={currentData?.monthlyUnsubscribe?.value || 0}
                    valueStyle={{
                      color: currentData?.monthlyUnsubscribe?.isUp ? '#cf1322' : '#3f8600',
                      fontSize: '24px',
                    }}
                    prefix={
                      currentData?.monthlyUnsubscribe?.isUp ? (
                        <ArrowUpOutlined style={{ color: '#cf1322' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#3f8600' }} />
                      )
                    }
                    suffix="单"
                  />
                </Col>
                <Col md={12} sm={12} xs={24} style={{ textAlign: 'center' }}>
                  <Statistic
                    title="当月退订量环比"
                    value={Math.abs(currentData?.monthlyUnsubscribeRate?.value || 0)}
                    precision={1}
                    valueStyle={{
                      color: 'rgba(50,50,50)',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                    suffix="%"
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default CardIndicatorValue;
