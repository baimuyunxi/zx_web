import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
  return {
    totalTag: {
      fontSize: '12px',
      // color: '#52c41a',
      // background: '#f6ffed',
      padding: '2px 6px',
      margin: 'auto',
      borderRadius: '4px',
      // border: '1px solid #d9f7be',
      wordBreak: 'break-all',
    },
    totalOuter: {
      display: 'flex',
      alignItems: 'baseline',
      flexWrap: 'wrap',
      gap: '8px',
    },
    totalMiddle: {
      display: 'flex',
      alignItems: 'baseline',
    },
    totalSpan: {
      fontSize: 14,
      color: '#999',
      marginLeft: 4,
    },
  };
});

export default useStyles;
