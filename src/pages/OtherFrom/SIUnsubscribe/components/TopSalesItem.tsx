import React from 'react';
import { Table } from 'antd';

interface TopSalesItemProps {
  dataSource: any[];
  loading: boolean;
}

const TopSalesItem: React.FC<TopSalesItemProps> = ({ dataSource, loading }) => {
  const columns = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '销售品',
      dataIndex: 'srcOfferName',
      key: 'srcOfferName',
      render: (text: React.ReactNode) => <a href="/">{text}</a>,
    },
    {
      title: '当日',
      dataIndex: 'currentCount',
      key: 'currentCount',
    },
    {
      title: '日环比',
      dataIndex: 'growthRatePercent',
      key: 'growthRatePercent',
      render: (value: number) => (value !== undefined && value !== null ? `${value}%` : '-'),
    },
    {
      title: '当月',
      dataIndex: 'monCurrentCount',
      key: 'monCurrentCount',
    },
    {
      title: '月环比',
      dataIndex: 'monGrowthRatePercent',
      key: 'monGrowthRatePercent',
      render: (value: number) => (value !== undefined && value !== null ? `${value}%` : '-'),
    },
  ];

  return (
    <Table<any>
      rowKey={(record, index) => index || record.index}
      size="small"
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={{
        style: {
          marginBottom: 0,
        },
        pageSize: 5,
        showSizeChanger: false,
      }}
    />
  );
};

export default TopSalesItem;
