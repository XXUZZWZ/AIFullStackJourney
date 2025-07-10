# useContext

- 组件层次太深，组件通信机械化。
- 上下文对象：**全局**状态共享。

- 使用流程

  - 创建一个上下文对象
  - provider 全局声明
  - 在任何地方，useContext 使用状态。

## 数据状态共享 ， 肯定不只有一种方式

- 组件单向数据流传递
- 创建上下文对象
  - 在它 Provider 的内部可以使用 useContext 获取状态
  - ThemeContext.Provider 组件，react 的一贯风格
  - 一般在全局使用
