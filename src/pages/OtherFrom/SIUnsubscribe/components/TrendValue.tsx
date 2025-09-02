import { Card, Spin, Typography } from 'antd';
import React, { useEffect, useRef } from 'react';

const { Title } = Typography;

interface TrendItem {
  PDayId: string;
  APrevDay: number;
  DPrevDay: number;
  AGrowthRatePercent: number;
  DGrowthRatePercent: number;
}

interface TrendValueProps {
  data?: TrendItem[];
  loading?: boolean;
}

const TrendValue: React.FC<TrendValueProps> = ({ data = [], loading = false }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    // 动态加载 echarts
    const loadECharts = async () => {
      if (typeof window !== 'undefined') {
        // 检查是否已经加载了 echarts
        if (!(window as any).echarts) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js';
          script.async = true;
          document.head.appendChild(script);

          return new Promise<void>((resolve) => {
            script.onload = () => resolve();
          });
        }
      }
    };

    const initChart = async () => {
      if (chartRef.current && data.length > 0) {
        await loadECharts();
        const echarts = (window as any).echarts;

        if (!echarts) return;

        // 初始化或获取图表实例
        if (!chartInstance.current) {
          chartInstance.current = echarts.init(chartRef.current);
        }

        // 处理数据
        const xAxisData = data.map((item) => item.PDayId);
        const orderData = data.map((item) => Number(item.APrevDay));
        const unsubscribeData = data.map((item) => Number(item.DPrevDay));
        const orderGrowthData = data.map((item) => Number(item.AGrowthRatePercent));
        const unsubscribeGrowthData = data.map((item) => Number(item.DGrowthRatePercent));

        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999',
              },
            },
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          legend: {
            data: ['订购量', '退订量', '订购环比', '退订环比'],
          },
          xAxis: [
            {
              type: 'category',
              data: xAxisData,
              axisPointer: {
                type: 'shadow',
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '数量',
              min: 0,
              axisLabel: {
                formatter: '{value}',
              },
            },
            {
              type: 'value',
              name: '环比(%)',
              axisLabel: {
                formatter: '{value}%',
              },
            },
          ],
          dataZoom: [
            {
              type: 'inside',
              start: 80,
              end: 100,
            },
            {
              start: 80,
              end: 100,
            },
          ],
          series: [
            {
              name: '订购量',
              type: 'bar',
              tooltip: {
                valueFormatter: function (value: number) {
                  return value + ' 单';
                },
              },
              data: orderData,
              itemStyle: {
                color: '#1890ff',
              },
            },
            {
              name: '退订量',
              type: 'bar',
              tooltip: {
                valueFormatter: function (value: number) {
                  return value + ' 单';
                },
              },
              data: unsubscribeData,
              itemStyle: {
                color: '#ff7875',
              },
            },
            {
              name: '订购环比',
              type: 'line',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: function (value: number) {
                  return value + '%';
                },
              },
              data: orderGrowthData,
              lineStyle: {
                color: '#52c41a',
              },
              itemStyle: {
                color: '#52c41a',
              },
            },
            {
              name: '退订环比',
              type: 'line',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: function (value: number) {
                  return value + '%';
                },
              },
              data: unsubscribeGrowthData,
              lineStyle: {
                color: '#faad14',
              },
              itemStyle: {
                color: '#faad14',
              },
            },
          ],
        };

        chartInstance.current.setOption(option);
      }
    };

    initChart();

    // 清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data]);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) {
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
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
      </Card>
    );
  }

  if (!data || data.length === 0) {
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
  }

  return (
    <Card
      style={{
        marginTop: 24,
        borderRadius: 8,
      }}
      variant="borderless"
      bodyStyle={{
        padding: 20,
      }}
    >
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: 400,
        }}
      />
    </Card>
  );
};

export default TrendValue;
