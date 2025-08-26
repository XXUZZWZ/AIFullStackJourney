import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

/**
 * ECharts 演示组件
 *
 * 这个组件演示了如何在 React 中以“正确姿势”接入 ECharts：
 * - 在首次渲染后创建图表实例，并在卸载时销毁，避免内存泄漏
 * - 使用 ref 获取真实 DOM 容器，供 ECharts 渲染
 * - 使用 useEffect 管理图表的创建、更新与清理，保证生命周期完整
 * - 监听窗口大小变化，保持图表自适应
 *
 * 功能特点：
 * 1. 响应式环形饼图展示
 * 2. 自动窗口大小调整（resize）
 * 3. 完整的生命周期管理（初始化/更新/销毁）
 * 4. 基础的性能优化和内存清理
 *
 * 使用场景：
 * - 数据可视化展示
 * - 营销数据分析
 * - 用户行为统计
 *
 * 使用方式：
 * - 直接在页面中引入并渲染 <Demo /> 即可
 * - 如需接入真实数据，只需将下方 chartData 的 mock 数据替换为你的数据，并触发状态更新
 */

// 统一定义图表数据的结构，便于在整个组件中获得类型提示与约束
interface ChartData {
  value: number;
  name: string;
}

const Demo: React.FC = () => {
  // DOM 引用：用于挂载 ECharts 实例。ECharts 需要真实 DOM 节点来渲染图表。
  const chartRef = useRef<HTMLDivElement>(null);
  
  // ECharts 实例引用：保存 init 生成的图表实例，方便在清理阶段 dispose，或在需要时调用实例方法（如 resize）。
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  
  // 图表数据状态：可配置的数据源。实际项目中可通过接口获取后 setState 更新。
  const [chartData] = useState<ChartData[]>([
    { value: 100, name: '线下渠道' },
    { value: 200, name: '邮件营销' },
    { value: 300, name: '直接访问' },
    { value: 333, name: '视频广告' },
    { value: 444, name: '搜索引擎' },
  ]);

  /**
   * 初始化并渲染 ECharts 图表
   *
   * 步骤概览：
   * 1) 确认 DOM 容器存在
   * 2) 通过 echarts.init 创建实例，并保存到 ref
   * 3) 准备 Option（图表的所有配置项）
   * 4) setOption 应用配置
   * 5) 绑定 window.resize 事件，保持自适应
   * 6) 返回清理函数：移除事件监听并销毁实例
   *
   * 依赖项：chartData
   * - 当 chartData 变化时，会重新执行 effect，以便刷新图表数据
   */
  useEffect(() => {
    // 确保 DOM 容器已挂载
    if (!chartRef.current) {
      console.warn('Chart container not found');
      return;
    }

    try {
      // 步骤1：初始化 ECharts 实例
      // 注意：同一个 DOM 节点不要重复 init；这里在组件首次挂载时运行。
      const chartInstance = echarts.init(chartRef.current);
      chartInstanceRef.current = chartInstance;

      // 步骤2：配置图表选项（Option 是 ECharts 的核心配置对象）
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
          // 使用 unknown + 运行时守卫，兼容 ECharts v6 类型变更并避免 any
          formatter: (params: unknown) => {
            const single = Array.isArray(params) ? params[0] : params;
            const p = (single ?? {}) as Record<string, unknown>;

            const name = typeof p.name === 'string' ? p.name : '';
            const value = typeof p.value === 'number' || typeof p.value === 'string' ? p.value : '';
            const percent = typeof p.percent === 'number' || typeof p.percent === 'string' ? p.percent : '';

            return `
              <div style="padding: 8px;">
                <strong>${name}</strong><br/>
                访问量：${value}<br/>
                占比：${percent}%
              </div>
            `;
          }
        },
        
        // 图例配置
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          // 图例展示每个扇区的名称
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
            // 最核心的数据入口：每一项代表一个饼图扇区
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
      {/*
        图表容器：
        - ECharts 会占满容器宽高进行渲染
        - 通过 ref 传递 DOM 给 echarts.init
      */}
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