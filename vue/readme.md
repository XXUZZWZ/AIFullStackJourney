# VUE 中的 hooks

- 你用的 react 是什么版本

  - react 19
  - react 16 以后有一个划时代的更新 函数式组件 hooks
  - 2019 年左右 还是类组件 Component 基类
  - 函数组件 子组件 + 父组件 通过 props 传递数据 无状态组件
  - UI 展示 Stateless
  - 函数组件 + useState + useEffect .. hooks 类组件就没有必要了

- 类组件

  - 和函数书简都有 各司其职
  - this 可能丢失
  - 写法有点复杂
  - 生命周期钩子函数，由 useEffect 副作用代替

- Vue 抄袭了 React 的 hooks
  -hooks 是一种函数式编程思想
- 什么是 hooks

  - 能够在不编写 class 的情况下使用 React 的状态 和生命周期等

- ahooks 函数式编程 组件库

- hooks 总线

- ahooks 第三方库 vueuse
  useToggle useRequest (所有请求的 data .loading ,error)

- 自定义 hooks

  - useTitle useTodos ,useMouse,useRepos
  - 把响应式业务或响应式场景封装到 hooks 目录下

- 内置的 hooks
  useState useEffect useMemo useCallback
  useContext useReducer useRef 创建一个可变的引用对象
  useLayoutEffect 是 React Hooks 中的一个函数，它在 DOM 更新后、浏览器绘制前同步执行，适合用于需要读取 DOM 布局并同步更新的场景，以避免视觉闪烁。
  - useImperativeHandle 创建一个自定义的 ref，并允许你指定如何转发到内部组件。
