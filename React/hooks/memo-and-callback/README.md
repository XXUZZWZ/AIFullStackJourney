# 性能优化 hook

- 父子组件渲染顺序

  - 执行的时候由外到内 组件树
  - 所以 useEffect 执行顺序是由内到外

- Button 组件该不该重新渲染
  - 父组件的局部，count 改变和 Button 组件没有关系
    Button JSX,如果可以不重新渲染，减少页面级别的 reflow 和 repaint
  - 性能优化
    - 响应式和性能 **切分组件** 甚至一个组件内的**独立部分**方便优化性能 通过 memo 包裹 组件 函数 返回一个 React.memo(Button)可以缓存组件的渲染结果，当组件的 props 不改变时，React 会跳过组件的渲染，直接复用缓存的渲染结果。
  - 将全部放入一个 Context 里,而且所有的状态都通过 reducer 生成好吗？
    - 不好
- 组件划分的粒度
  - 组件划分 单向数据流
  - 好处，拆分出只负责渲染的子组件(porps + jsx)和自定义的处理数据的自定义 hooks。
  - 复用组件
  - useCallback (父子组件传函数的时候一定要用 useCallback() 比如 传入子组件的 handleCallback ) + React.memo
