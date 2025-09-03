import React, { useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';

interface TopSalesItemProps {
  dataSource: any[];
  loading: boolean;
}

type DataIndex = keyof any;

const TopSalesItem: React.FC<TopSalesItemProps> = ({ dataSource, loading }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  // 为数据源添加原始排名
  const dataSourceWithRank = dataSource.map((item, index) => ({
    ...item,
    originalRank: index + 1,
  }));

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    // @ts-ignore
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void, confirm: (param?: FilterConfirmProps) => void) => {
    clearFilters();
    setSearchText('');
    confirm();
  };

  const getColumnSearchProps = (dataIndex: DataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`搜索销售品`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        ?.includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: '排名',
      dataIndex: 'originalRank',
      key: 'originalRank',
      render: (originalRank: number) => originalRank,
    },
    {
      title: '销售品',
      dataIndex: 'srcOfferName',
      key: 'srcOfferName',
      render: (text: React.ReactNode) => <a>{text}</a>,
      ...getColumnSearchProps('srcOfferName'),
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
      rowKey={(record, index) => record.originalRank || index}
      size="small"
      columns={columns}
      dataSource={dataSourceWithRank}
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
