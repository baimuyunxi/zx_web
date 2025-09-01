import { Card, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const TrendValue = (props: any) => {
  return (
    <Card
      style={{
        marginTop: 24,
        borderRadius: 8,
      }}
      variant="borderless"
      bodyStyle={{
        padding: 20,
        background: '#f9f9f9',
        textAlign: 'center',
      }}
    >
      <Title
        level={4}
        style={{
          fontSize: 16,
          color: '#999',
          margin: 0,
        }}
      >
        图表预留区域
      </Title>
    </Card>
  );
};

export default TrendValue;
