# 全家桶开发之 Zustand 状态管理

## 轻巧的 hooks 化的状态管理库

- 现代前端开发模式
  - UI 组件 + 全局状态管理
- 轻巧的 hooks 状态管理库
  - count 响应式状态
  - 全局状态管理
    - useContext + useReducer 来集中管理状态
  - 简化状态管理
  - redux
  - zustand

## 什么时候使用？

- 小项目 store 没必要
- 中大型项目 router store 才需要
  - router-router-dom
  - zustand
  - 全部都用 zustand 来完成所有状态管理
  - 组件全部只负责存页面
  - zustand 中央接管所有数据逻辑
  