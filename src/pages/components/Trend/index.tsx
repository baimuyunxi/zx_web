import React from 'react';
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import useStyles from './index.style';
import { getIndicatorTrendGoodness } from '@/pages/HumanServices/utils/indicatorConfig';

export type TrendProps = {
  style?: React.CSSProperties;
  reverseColor?: boolean;
  className?: string;
  children?: React.ReactNode;
  value?: string | number;
  indicatorKey?: string; // 新增：指标标识
};

const Trend: React.FC<TrendProps> = ({
  style,
  reverseColor,
  className,
  children,
  value,
  indicatorKey, // 新增参数
  ...rest
}) => {
  const { styles } = useStyles();

  // 提取公共的数值解析函数
  const parseNumericValue = (val: string | number | undefined): number | null => {
    if (val === undefined || val === null) return null;

    let numericValue: number;

    if (typeof val === 'number') {
      numericValue = val;
    } else {
      // 移除所有非数字和非负号的字符进行判断
      const cleanValue = val.toString().replace(/[^0-9.-]/g, '');
      numericValue = parseFloat(cleanValue);
    }

    // 如果解析失败，返回null
    return isNaN(numericValue) ? null : numericValue;
  };

  // 根据数值获取趋势信息
  const getTrendInfo = (val: string | number | undefined) => {
    const numericValue = parseNumericValue(val);

    if (numericValue === null) {
      return {
        direction: undefined,
        valueColor: '#666',
        arrowColor: '#666',
      };
    }

    if (numericValue === 0) {
      return {
        direction: undefined,
        valueColor: '#666',
        arrowColor: '#666',
      };
    }

    const isPositive = numericValue > 0;
    const direction = isPositive ? 'up' : 'down';

    // 根据指标好坏判断数值颜色
    let valueColor: string;
    let arrowColor: string;

    if (indicatorKey) {
      // 有指标标识时，根据指标好坏判断颜色
      const trendGoodness = getIndicatorTrendGoodness(indicatorKey, numericValue);

      switch (trendGoodness) {
        case 'good':
          valueColor = '#52c41a'; // 绿色 - 好的趋势
          arrowColor = '#52c41a';
          break;
        case 'bad':
          valueColor = '#ff4d4f'; // 红色 - 坏的趋势
          arrowColor = '#ff4d4f';
          break;
        case 'neutral':
        default:
          // 中性时保持原有逻辑：正数绿色，负数红色
          valueColor = isPositive ? '#52c41a' : '#ff4d4f';
          arrowColor = isPositive ? '#52c41a' : '#ff4d4f';
          break;
      }
    } else {
      // 没有指标标识时，使用原有逻辑或reverseColor
      let shouldReverse = reverseColor || false;

      if (shouldReverse) {
        // 反转颜色：up为红色，down为绿色
        valueColor = isPositive ? '#ff4d4f' : '#52c41a';
        arrowColor = isPositive ? '#ff4d4f' : '#52c41a';
      } else {
        // 正常颜色：up为绿色，down为红色
        valueColor = isPositive ? '#52c41a' : '#ff4d4f';
        arrowColor = isPositive ? '#52c41a' : '#ff4d4f';
      }
    }

    return {
      direction: direction as 'up' | 'down',
      valueColor,
      arrowColor,
    };
  };

  const { direction, valueColor, arrowColor } = getTrendInfo(value);

  const classString = classNames(
    styles.trendItem,
    {
      [styles.trendItemGrey]: !direction,
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
          marginRight: '8px',
        }}
      >
        {children}
      </span>
      {value && (
        <span
          style={{
            color: valueColor,
            fontWeight: 'bold',
          }}
        >
          {value}
        </span>
      )}
      {direction && (
        <span
          className={styles[direction]}
          style={{
            color: arrowColor,
            marginRight: '12px',
          }}
        >
          {direction === 'up' ? <RiseOutlined /> : <FallOutlined />}
        </span>
      )}
    </div>
  );
};

export default Trend;
