import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Alert, Card, Typography } from 'antd';
import React from 'react';

const Admin: React.FC = () => {
  const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        <Alert
          message={'页面逐渐完善中...'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 48,
          }}
        />
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          <SmileTwoTone /> 指标监控平台 <HeartTwoTone twoToneColor="#eb2f96" /> You
        </Typography.Title>
      </Card>
    </PageContainer>
  );
};

export default Admin;
