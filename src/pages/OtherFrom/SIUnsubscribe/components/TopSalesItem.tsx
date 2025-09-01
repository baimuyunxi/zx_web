import React from 'react';
import { Table } from 'antd/lib';

const TopSalesItem = () => {
  const columns = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '销售品',
      dataIndex: 'keyword',
      key: 'keyword',
      render: (text: React.ReactNode) => <a href="/">{text}</a>,
    },
    {
      title: '当日',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: '日环比',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: '当月',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: '月环比',
      dataIndex: 'keyword',
      key: 'keyword',
    },
  ];

  return (
    <Table<any>
      rowKey={(record) => record.index}
      size="small"
      columns={columns}
      // @ts-ignore
      dataSource={''}
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
