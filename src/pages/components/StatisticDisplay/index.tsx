import React from 'react';
import type { StatisticProps } from 'antd';
import { Statistic, Tag } from 'antd';
import CountUp from 'react-countup';
import useStyles from '@/pages/components/StatisticDisplay/index.style';
import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined } from '@ant-design/icons';

// 内置formatter定义
const formatter: StatisticProps['formatter'] = (value) => {
  const numValue = value as number;

  // 获取原始数值的小数位数
  const decimalPlaces = (numValue.toString().split('.')[1] || '').length;

  return (
    <CountUp
      end={numValue}
      separator={','}
      decimals={decimalPlaces} // 保持原有的小数位数
      decimal="."
    />
  );
};

export type StatisticDisplayProps = {
  /** 主要数值 */
  value: number | string;
  /** 单位文本，可选 */
  unit?: string;
  /** 月累计标签文本，可选 */
  monthLabel?: string;
  /** 月累计值，可选 */
  monthValue?: string | number;
  /** 设置数值的后缀，可选 */
  suffix?: React.ReactNode;
  /** 阈值提醒，可选 */
  threshold?: string;
};

const StatisticDisplay: React.FC<StatisticDisplayProps> = ({
  value,
  unit,
  monthLabel,
  monthValue,
  suffix,
  threshold,
}) => {
  const { styles } = useStyles();
  // 判断是否显示月累计标签
  const showMonthTag = monthLabel && monthValue !== undefined && monthValue !== null;

  // 根据threshold获取图标和颜色
  const getThresholdIcon = (thresholdType: string) => {
    if (!thresholdType) return null;

    switch (thresholdType) {
      case 'up':
        return (
          <ArrowUpOutlined
            style={{
              color: '#52c41a',
              fontSize: '18px',
            }}
          />
        );
      case 'down':
        return (
          <ArrowDownOutlined
            style={{
              color: '#ff4d4f',
              fontSize: '18px',
            }}
          />
        );
      case 'flat':
        return (
          <MinusOutlined
            style={{
              color: '#8c8c8c',
              fontSize: '18px',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.totalOuter}>
      {threshold && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '4px',
          }}
        >
          {getThresholdIcon(threshold)}
        </div>
      )}
      <div className={styles.totalMiddle}>
        {suffix ? (
          <Statistic
            value={value}
            formatter={formatter}
            valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            suffix={suffix}
          />
        ) : (
          <Statistic
            value={value}
            formatter={formatter}
            valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
          />
        )}
        {unit && <span className={styles.totalSpan}>{unit}</span>}
      </div>

      {showMonthTag && (
        <Tag className={styles.totalTag} style={{ marginLeft: '12px' }}>
          {monthLabel}: <strong>{monthValue}</strong>
        </Tag>
      )}
    </div>
  );
};

export default StatisticDisplay;
