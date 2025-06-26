import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ServiceVolumeChartProps {
  isMini?: boolean;
  height?: number;
  title?: string;
  period?: '7days' | '30days';
}

const ServiceVolumeChart: React.FC<ServiceVolumeChartProps> = ({
  isMini = false,
  height = 300,
  title = '数据趋势',
  period = '7days',
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    chartInstance.current = echarts.init(chartRef.current);

    // 根据周期生成不同的模拟数据
    const getData = () => {
      if (period === '7days') {
        return {
          data: [8200, 9320, 9010, 9340, 12900, 13300, 13200],
          categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        };
      } else {
        // 30天数据
        const days = [];
        const data = [];
        for (let i = 1; i <= 30; i++) {
          days.push(`${i}日`);
          // 生成随机数据，模拟30天的波动
          data.push(Math.floor(Math.random() * 5000) + 8000);
        }
        return {
          data,
          categories: days,
        };
      }
    };

    const { data, categories } = getData();

    const option: echarts.EChartsOption = {
      // 迷你图配置
      ...(isMini && {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          show: false,
        },
        tooltip: {
          trigger: 'axis',
        },
      }),
      // 完整图配置
      ...(!isMini && {
        // title: {
        //   text: title,
        //   left: 'center',
        //   textStyle: {
        //     fontSize: 16,
        //     fontWeight: 'bold',
        //   },
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [title],
          top: 30,
        },
      }),
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: categories,
        axisLabel: {
          show: !isMini,
          rotate: period === '30days' && !isMini ? 45 : 0, // 30天时倾斜显示
        },
        axisLine: {
          show: !isMini,
        },
        axisTick: {
          show: !isMini,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: !isMini,
          formatter: '{value}次',
        },
        axisLine: {
          show: !isMini,
        },
        axisTick: {
          show: !isMini,
        },
        splitLine: {
          show: !isMini,
        },
      },
      series: [
        {
          name: title,
          data: data,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(194,162,240)',
              },
              {
                offset: 1,
                color: 'rgba(240,230,252, 0.05)',
              },
            ]),
          },
          lineStyle: {
            color: 'rgba(194,162,240)',
            width: isMini ? 1 : 2,
          },
          itemStyle: {
            color: 'rgb(103,70,150)',
          },
          symbol: isMini ? 'none' : 'circle',
          symbolSize: isMini ? 0 : 4,
        },
      ],
      animation: true,
      animationDuration: 1000,
    };

    chartInstance.current.setOption(option);

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [isMini, height, title, period]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: isMini ? 60 : height,
        cursor: isMini ? 'pointer' : 'default',
      }}
    />
  );
};

export default ServiceVolumeChart;
