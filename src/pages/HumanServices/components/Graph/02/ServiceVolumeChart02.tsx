import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export interface ChartData {
  volumeData: number[];
  ratioData: number[];
  categories: string[];
}

interface ServiceVolumeChartProps {
  isMini?: boolean;
  height?: number;
  title?: string;
  chartData?: ChartData;
}

const ServiceVolumeChart: React.FC<ServiceVolumeChartProps> = ({
  isMini = false,
  height = 300,
  title = '数据趋势',
  chartData,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  // 根据指标标题获取对应的单位
  const getUnitByTitle = (title: string): string => {
    if (title.includes('利用率') || title.includes('降幅')) {
      return '%';
    } else if (title.includes('强度')) {
      return '时';
    } else if (title.includes('接话量')) {
      return '次';
    }
    return '次'; // 默认单位
  };

  // 判断是否为百分比类指标（环比应显示PP）
  const isPercentageIndicator = (title: string): boolean => {
    return title.includes('利用率') || title.includes('降幅');
  };

  useEffect(() => {
    if (!chartRef.current) return;

    console.log('ServiceVolumeChart02 - Rendering with props:', {
      title,
      isMini,
      hasChartData: !!chartData,
      chartDataLength: chartData?.volumeData?.length || 0,
      chartData: chartData,
    });

    // 初始化图表
    chartInstance.current = echarts.init(chartRef.current);

    // 如果没有数据，直接返回，不显示任何内容
    if (!chartData || !chartData.volumeData || chartData.volumeData.length === 0) {
      console.log('ServiceVolumeChart02 - No valid data, chart will remain empty');
      return;
    }

    const { volumeData, ratioData, categories } = chartData;
    console.log('ServiceVolumeChart02 - Using data:', { volumeData, ratioData, categories });

    // 获取当前指标的单位
    const unit = getUnitByTitle(title);
    const isPercentage = isPercentageIndicator(title);

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
          formatter: function (params: any) {
            let result = `${params[0].axisValue}<br/>`;
            params.forEach((param: any) => {
              if (param.seriesName === title) {
                result += `${param.marker}${param.seriesName}: ${param.value.toLocaleString()}${unit}<br/>`;
              } else {
                // 百分比指标的环比显示PP，其他显示%
                const ratioUnit = isPercentage ? 'PP' : '%';
                result += `${param.marker}${param.seriesName}: ${param.value >= 0 ? '+' : ''}${param.value.toFixed(2)}${ratioUnit}<br/>`;
              }
            });
            return result;
          },
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
                result += `${param.marker}${param.seriesName}: ${param.value.toLocaleString()}${unit}<br/>`;
              } else {
                // 百分比指标的环比显示PP，其他显示%
                const ratioUnit = isPercentage ? 'PP' : '%';
                result += `${param.marker}${param.seriesName}: ${param.value >= 0 ? '+' : ''}${param.value.toFixed(2)}${ratioUnit}<br/>`;
              }
            });
            return result;
          },
        },
        legend: {
          data: [title, '月环比增长率'],
          top: 5,
        },
      }),
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: categories,
        axisLabel: {
          show: !isMini,
          rotate: 0, // 月份标签不需要旋转
        },
        axisLine: {
          show: !isMini,
        },
        axisTick: {
          show: !isMini,
        },
      },
      yAxis: [
        // 左侧Y轴 - 服务量/数值
        {
          type: 'value',
          name: isMini ? '' : unit === '%' ? '百分比' : unit === '时' ? '时长' : '数值',
          position: 'left',
          scale: true, // 开启自适应范围，不强制从0开始
          axisLabel: {
            show: !isMini,
            formatter: function (value: number) {
              return `${value}${unit}`;
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
        // 右侧Y轴 - 月环比增长率
        {
          type: 'value',
          name: isMini ? '' : '月环比增长率',
          position: 'right',
          axisLabel: {
            show: !isMini,
            formatter: function (value: number) {
              // 百分比指标的环比显示PP，其他显示%
              const ratioUnit = isPercentage ? 'PP' : '%';
              return `{value}${ratioUnit}`;
            },
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
        // 月环比增长率数据系列
        {
          name: '月环比增长率',
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
            color: '#ec0507',
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

    console.log('ServiceVolumeChart02 - Setting chart option:', option);
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
  }, [isMini, height, title, chartData]);

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
