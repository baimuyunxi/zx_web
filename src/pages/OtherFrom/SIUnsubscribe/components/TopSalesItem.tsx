import React from 'react';
import { Table } from 'antd/lib';

const TopSalesItem = (dataSource: any) => {
  const columns = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
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
    },
  ];

  return (
    <Table<any>
      rowKey={(record) => record.index}
      size="small"
      columns={columns}
      // @ts-ignore
      dataSource={dataSource}
      pagination={{
        style: {
          marginBottom: 0,
        },
        pageSize: 5,
      }}
    />
  );
};

export default TopSalesItem;
