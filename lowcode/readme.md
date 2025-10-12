# 低代码平台

- 代码
- prompt vibe coding
- 比如 coze 是 AI agent 开发工具

## 定义

- 低代码或零代码是通过可视化的拖拽来代替手写代码，来构建应用
- 让非技术人员来使用
- 常用于表单 审批流程 数据看版 等场景 快速满足业务需要
  - canvas
  - 拖拽

## aisuda

- Aisuda（爱速搭）是阿里巴巴推出的一款低代码应用搭建平台，旨在通过可视化拖拽等方式，让开发者和业务人员能快速、高效地构建企业级应用。

- 核心

- 业务或产品需要实现
- 低代码编辑器
  - 物料区域 各种类型，各种参数 可拖拽的
  - 组合显示区域 可以是网页 可以是 Agent 开发 工作流 n8n dify
  - 属性修改区域

## 我们要开发或维护过低代码平台

- React flow

## 第一次总结

- 使用了 aisuda 低代码工具,发现核心是维护一个 json 数据
  - 通过 children 属性串联的组件树
  - alloment split pane 布局 实现区域可拖拽
  - 用 tailwindcss 写样式
  - zustand 来管理全局状态
  - 数据结构就是组件树
- 低代码区

  - 物料区
  - 编辑区
  - 设置区

- 阿里的 Antd 组件库

## 物料区组件

- 可扩展的 组件库
  - Container 容器组件

## typescript

- Record<string,any>

## 拖拽生成

- react-dnd 是勇敢用于在 React 应用中

## 遇到的问题

- useDrop 会插入多次
- useDrop 再多次重复，违反了 dry 原则
- 封装一下
