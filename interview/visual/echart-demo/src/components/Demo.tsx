import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

/**
 * ECharts 演示组件
 * 
 * 功能特点：
 * 1. 响应式饼图展示
 * 2. 自动窗口大小调整
 * 3. 完整的生命周期管理
 * 4. 性能优化和内存清理
 * 
 * 使用场景：
 * - 数据可视化展示
 * - 营销数据分析
 * - 用户行为统计
 */

interface ChartData {
  value: number;
  name: string;
}

const Demo: React.FC = () => {
  // DOM 引用：用于挂载 ECharts 实例
  const chartRef = useRef<HTMLDivElement>(null);
  
  // ECharts 实例引用：用于存储图表实例
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  
  // 图表数据状态：可配置的数据源
  const [chartData] = useState<ChartData[]>([
    { value: 100, name: '线下渠道' },
    { value: 200, name: '邮件营销' },
    { value: 300, name: '直接访问' },
    { value: 333, name: '视频广告' },
    { value: 444, name: '搜索引擎' },
  ]);

  /**
   * 初始化 ECharts 图表
   * 步骤：
   * 1. 检查 DOM 容器是否存在
   * 2. 创建 ECharts 实例
   * 3. 配置图表选项
   * 4. 应用配置到图表
   * 5. 设置响应式调整
   */
  useEffect(() => {
    // 确保 DOM 容器已挂载
    if (!chartRef.current) {
      console.warn('Chart container not found');
      return;
    }

    try {
      // 步骤1：初始化 ECharts 实例
      const chartInstance = echarts.init(chartRef.current);
      chartInstanceRef.current = chartInstance;

      // 步骤2：配置图表选项
      const option: echarts.EChartsOption = {
        // 图表标题配置
        title: {
          text: '营销渠道分析',
          subtext: '数据来源：用户行为统计',
          left: 'center',
          top: 20,
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        
        // 提示框配置
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            return `
              <div style="padding: 8px;">
                <strong>${params.name}</strong><br/>
                访问量：${params.value}<br/>
                占比：${params.percent}%
              </div>
            `;
          }
        },
        
        // 图例配置
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          data: chartData.map(item => item.name),
          textStyle: {
            fontSize: 12
          }
        },
        
        // 系列配置
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'], // 环形图配置
            center: ['60%', '50%'], // 图表位置
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: chartData
          }
        ],
        
        // 颜色配置
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
        
        // 动画配置
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      };

      // 步骤3：应用配置到图表
      chartInstance.setOption(option);

      // 步骤4：响应式处理 - 监听窗口大小变化
      const handleResize = () => {
        if (chartInstance && !chartInstance.isDisposed()) {
          chartInstance.resize();
        }
      };

      // 添加窗口大小变化监听
      window.addEventListener('resize', handleResize);

      // 返回清理函数：组件卸载时执行
      return () => {
        // 移除事件监听器
        window.removeEventListener('resize', handleResize);
        
        // 销毁图表实例，释放内存
        if (chartInstance && !chartInstance.isDisposed()) {
          chartInstance.dispose();
        }
        
        // 清空引用
        chartInstanceRef.current = null;
      };
    } catch (error) {
      console.error('Failed to initialize chart:', error);
    }
  }, [chartData]); // 依赖项：当数据变化时重新渲染

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div 
        ref={chartRef} 
        style={{
          width: '800px',
          height: '500px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '20px'
        }}
      />
    </div>
  );
};

export default Demo;