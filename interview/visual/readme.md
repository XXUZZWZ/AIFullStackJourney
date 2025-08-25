# 数据可视化

- echarts
  - 老板 客户 数据报表
  - 开源的用于绘制图表的 柱状图 饼状图等 可视化库
- @types/echarts
  - echarts 的类型定义
  - pnpm i @types/echarts -D 命令详解这个命令用于在 TypeScript 项目中安装 ECharts 的类型定义。
- React 是用 ts 写出来的
- echarts 和类型声明文件是分开的

- 直观看到数据的价值

  - echats 2d
  - three.js 3d

- echars 流程
  - 安装 echarts @types/echarts
  - 引入 echarts
  - init 实例化要传给它一个 dom 节点
  - useRef<HTMLDivElement>(null)
  - null | HTMLDivElement
  - 联合类型 useRef 可变对象
  - setOption 配置项
    - series:[] //数据条目
