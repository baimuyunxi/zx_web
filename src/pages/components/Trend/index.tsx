import React from 'react';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import useStyles from './index.style';

export type TrendProps = {
  style?: React.CSSProperties;
  reverseColor?: boolean;
  className?: string;
  children?: React.ReactNode;
  value?: string | number;
};

const Trend: React.FC<TrendProps> = ({
  style,
  reverseColor,
  className,
  children,
  value,
  ...rest
}) => {
  const { styles } = useStyles();

  // 根据value判断趋势方向
  const getTrendDirection = (val: string | number | undefined): 'up' | 'down' | undefined => {
    if (val === undefined || val === null) return undefined;

    let numericValue: number;

    if (typeof val === 'number') {
      numericValue = val;
    } else {
      // 移除所有非数字和非负号的字符进行判断
      const cleanValue = val.toString().replace(/[^0-9.-]/g, '');
      numericValue = parseFloat(cleanValue);
    }

    // 如果解析失败，返回undefined
    if (isNaN(numericValue)) return undefined;

    // 正数向上，负数向下，零不显示箭头
    if (numericValue > 0) {
      return 'up';
    } else if (numericValue < 0) {
      return 'down';
    } else {
      return undefined; // 零不显示箭头
    }
  };

  // 判断数值正负的函数
  const getValueColor = (val: string | number | undefined): string | undefined => {
    if (val === undefined || val === null) return undefined;

    let numericValue: number;

    if (typeof val === 'number') {
      numericValue = val;
    } else {
      // 移除所有非数字和非负号的字符进行判断
      const cleanValue = val.toString().replace(/[^0-9.-]/g, '');
      numericValue = parseFloat(cleanValue);
    }

    // 如果解析失败，返回undefined使用默认颜色
    if (isNaN(numericValue)) return undefined;

    // 负数返回红色，正数返回绿色
    if (numericValue < 0) {
      return '#ff4d4f'; // 红色
    } else if (numericValue > 0) {
      return '#52c41a'; // 绿色
    } else {
      return undefined; // 零返回默认色
    }
  };

  // 获取箭头颜色
  const getArrowColor = (direction: 'up' | 'down' | undefined): string => {
    if (!direction) return '#666'; // 默认颜色

    if (reverseColor) {
      // 如果需要反转颜色
      return direction === 'up' ? '#ff4d4f' : '#52c41a';
    } else {
      // 正常颜色：up为绿色，down为红色
      return direction === 'up' ? '#52c41a' : '#ff4d4f';
    }
  };

  const trendDirection = getTrendDirection(value);
  const valueColor = getValueColor(value);
  const arrowColor = getArrowColor(trendDirection);

  const classString = classNames(
    styles.trendItem,
    {
      [styles.trendItemGrey]: !trendDirection,
    },
    className,
  );

  return (
    <div
      {...rest}
      className={classString}
      style={style}
      title={typeof children === 'string' ? children : ''}
    >
      <span
        style={{
          marginLeft: '8px',
        }}
      >
        {children}
      </span>
      {value && (
        <span
          style={{
            color: valueColor,
            fontWeight: 'bold',
            marginLeft: '4px',
          }}
        >
          {value}
        </span>
      )}
      {trendDirection && (
        <span
          className={styles[trendDirection]}
          style={{
            color: arrowColor,
          }}
        >
          {trendDirection === 'up' ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </span>
      )}
    </div>
  );
};

export default Trend;
