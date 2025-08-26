# ECharts 演示组件使用指南

## 📋 组件概述

这是一个基于 React + ECharts 的高性能数据可视化组件，专门用于展示饼图数据。

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install echarts react
```

### 2. 使用组件
```tsx
import Demo from './components/Demo';

function App() {
  return (
    <div className="App">
      <Demo />
    </div>
  );
}
```

## 📊 数据结构说明

### ChartData 接口
```typescript
interface ChartData {
  value: number;  // 数值
  name: string;   // 名称（用于显示）
}
```

### 示例数据
```typescript
const chartData = [
  { value: 100, name: '线下渠道' },
  { value: 200, name: '邮件营销' },
  { value: 300, name: '直接访问' },
  { value: 333, name: '视频广告' },
  { value: 444, name: '搜索引擎' },
];
```

## 🎨 图表配置详解

### 1. 标题配置
- **text**: 主标题 "营销渠道分析"
- **subtext**: 副标题 "数据来源：用户行为统计"
- **position**: 居中显示

### 2. 提示框配置
- **trigger**: 'item' - 鼠标悬停触发
- **formatter**: 自定义格式显示名称、数值和百分比

### 3. 图例配置
- **orient**: 'vertical' - 垂直排列
- **position**: 左侧居中
- **data**: 动态从 chartData 提取

### 4. 系列配置
- **type**: 'pie' - 饼图类型
- **radius**: ['40%', '70%'] - 环形图效果
- **center**: ['60%', '50%'] - 图表位置偏右
- **animation**: 开启动画效果

## ⚡ 性能优化特性

### 1. 内存管理
- ✅ 组件卸载时自动销毁图表实例
- ✅ 移除事件监听器防止内存泄漏
- ✅ 检查图表实例是否已销毁

### 2. 响应式设计
- ✅ 自动监听窗口大小变化
- ✅ 图表自适应调整
- ✅ 防抖处理避免频繁重绘

### 3. 错误处理
- ✅ DOM 容器存在性检查
- ✅ 图表初始化错误捕获
- ✅ 控制台错误日志输出

## 🔧 自定义扩展

### 修改图表类型
```typescript
// 改为柱状图
series: [
  {
    type: 'bar',
    data: chartData.map(item => item.value)
  }
]
```

### 更新数据源
```typescript
const [chartData, setChartData] = useState<ChartData[]>(initialData);

// 动态更新数据
const updateData = () => {
  setChartData([
    { value: 150, name: '新渠道1' },
    { value: 250, name: '新渠道2' },
    // ...更多数据
  ]);
};
```

### 主题切换
```typescript
const themes = {
  light: ['#5470c6', '#91cc75', '#fac858'],
  dark: ['#4992ff', '#7cffb2', '#fddd60']
};

// 在 option 中配置
color: themes.light
```

## 🎯 使用场景

### 1. 营销数据分析
- 展示不同渠道的转化效果
- 对比各渠道投入产出比

### 2. 用户行为统计
- 分析用户来源分布
- 跟踪访问路径效果

### 3. 销售数据展示
- 产品销量占比
- 区域销售分布

## 📱 响应式适配

组件已内置响应式支持：
- 自动适应容器大小
- 支持移动端触摸交互
- 窗口缩放时自动重绘

## 🔍 调试技巧

### 1. 检查图表初始化
```typescript
console.log('Chart initialized:', chartInstance);
```

### 2. 验证数据格式
```typescript
console.log('Chart data:', chartData);
console.log('Data validation:', chartData.every(item => item.value > 0));
```

### 3. 性能监控
```typescript
// 在 useEffect 中添加
console.time('chart-render');
chartInstance.setOption(option);
console.timeEnd('chart-render');
```

## 🚨 常见问题

### Q1: 图表不显示？
**解决方案：**
- 检查容器是否有固定宽高
- 确认 ECharts 是否正确安装
- 查看控制台错误信息

### Q2: 内存泄漏？
**解决方案：**
- 确保组件卸载时调用 `dispose()`
- 检查事件监听器是否正确移除
- 使用 React DevTools 检查组件生命周期

### Q3: 响应式失效？
**解决方案：**
- 确认容器使用百分比宽高
- 检查 CSS 样式是否有限制
- 验证 resize 事件是否正常触发

## 📚 相关资源

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [React Hooks 指南](https://react.dev/reference/react)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)

