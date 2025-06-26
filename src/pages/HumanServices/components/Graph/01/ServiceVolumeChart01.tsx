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
      // 生成-20%到30%之间的随机日环比数据
      const generateRandomRatio = () => {
        return Math.random() * 50 - 20; // -20% 到 30% 之间
      };

      if (period === '7days') {
        const volumeData = [8200, 9320, 9010, 9340, 12900, 13300, 13200];
        const categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

        // 生成随机日环比数据（-20%到30%之间）
        const ratioData = categories.map((_, index) => {
          if (index === 0) return 0; // 第一天没有环比
          return Number(generateRandomRatio().toFixed(2));
        });

        return {
          volumeData,
          ratioData,
          categories,
        };
      } else {
        // 30天数据
        const days = [];
        const volumeData = [];
        const ratioData = [];

        for (let i = 1; i <= 30; i++) {
          days.push(`${i}日`);
          // 生成随机数据，模拟30天的波动
          volumeData.push(Math.floor(Math.random() * 5000) + 8000);
          // 生成随机日环比数据（-20%到30%之间）
          if (i === 1) {
            ratioData.push(0); // 第一天没有环比
          } else {
            ratioData.push(Number(generateRandomRatio().toFixed(2)));
          }
        }

        return {
          volumeData,
          ratioData,
          categories: days,
        };
      }
    };

    const { volumeData, ratioData, categories } = getData();

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
        yAxis: [{ show: false }, { show: false }],
        tooltip: {
          trigger: 'axis',
        },
      }),
      // 完整图配置
      ...(!isMini && {
        grid: {
          left: '8%',
          right: '8%',
          bottom: '8%',
          top: '15%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params: any) {
            let result = `${params[0].axisValue}<br/>`;
            params.forEach((param: any) => {
              if (param.seriesName === title) {
                // 根据指标类型显示不同单位
                const unit = title.includes('率') ? '%' : '次';
                result += `${param.marker}${param.seriesName}: ${param.value.toLocaleString()}${unit}<br/>`;
              } else {
                result += `${param.marker}${param.seriesName}: ${param.value >= 0 ? '+' : ''}${param.value.toFixed(2)}%<br/>`;
              }
            });
            return result;
          },
        },
        legend: {
          data: [title, '日环比增长率'],
          top: 5,
        },
      }),
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: categories,
        axisLabel: {
          show: !isMini,
          rotate: period === '30days' && !isMini ? 45 : 0,
        },
        axisLine: {
          show: !isMini,
        },
        axisTick: {
          show: !isMini,
        },
      },
      yAxis: [
        // 左侧Y轴 - 服务量/指标值
        {
          type: 'value',
          name: isMini ? '' : title.includes('率') ? '百分比' : '服务量',
          position: 'left',
          axisLabel: {
            show: !isMini,
            formatter: function (value: number) {
              // 根据指标类型决定单位
              if (title.includes('率')) {
                return `${value}%`;
              } else {
                return `${value}次`;
              }
            },
          },
          axisLine: {
            show: !isMini,
            lineStyle: {
              color: 'rgba(194,162,240)',
            },
          },
          axisTick: {
            show: !isMini,
          },
          splitLine: {
            show: !isMini,
          },
        },
        // 右侧Y轴 - 日环比增长率
        {
          type: 'value',
          name: isMini ? '' : '日环比增长率',
          position: 'right',
          axisLabel: {
            show: !isMini,
            formatter: '{value}%',
          },
          axisLine: {
            show: !isMini,
            lineStyle: {
              color: '#ff7875',
            },
          },
          axisTick: {
            show: !isMini,
          },
          splitLine: {
            show: false, // 隐藏右侧y轴的分割线，避免与左侧重叠
          },
        },
      ],
      series: [
        // 主数据系列
        {
          name: title,
          data: volumeData,
          type: 'line',
          yAxisIndex: 0, // 使用左侧y轴
          smooth: isMini ? true : false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(194,162,240)',
              },
              {
                offset: 1,
                color: 'rgba(240,230,252, 0.3)',
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
          symbolSize: isMini ? 0 : 8,
        },
        // 日环比增长率数据系列
        {
          name: '日环比增长率',
          data: ratioData,
          type: 'line',
          yAxisIndex: 1, // 使用右侧y轴
          smooth: isMini ? true : false,
          lineStyle: {
            color: '#FF7D29',
            width: isMini ? 1 : 2,
            type: 'dashed', // 虚线样式以区分
          },
          itemStyle: {
            color: '#ff4d4f',
          },
          symbol: isMini ? 'none' : 'diamond',
          symbolSize: isMini ? 0 : 8,
          // 添加标记线显示0%基准线
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 0,
                lineStyle: {
                  color: '#ff7875',
                  type: 'solid',
                  width: 1,
                  opacity: 0.3,
                },
              },
            ],
          },
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
