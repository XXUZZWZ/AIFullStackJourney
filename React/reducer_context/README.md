# reducer and context

- useReducer
  - 响应式状态管理
  - reducer 纯函数 负责状态改变规矩
  - initialState 初始状态
  - dispatch 派发一个 action 给 reducer
  - action = {type: 'ADD',payload:1}
- useContext
  - context = createContext()
  - Provider value={} <context.Provider value={state,dispatch}></context.Provider >
  - Consumer const consumer = useContext(context)
- useContext(通信) + useReducer(响应式状态管理)

  - 提供了什么？
    - 一个 state 对象和一个 dispatch 方法
    - state 对象里存储了很多状态
    - dispatch 方法，可以派发一个 action 给 reducer 去处理状态
  - 实现了什么？
    - 跨层级全局状态管理

- 自定义 hook

  - 组件(渲染) + hook(状态)

- hooks + useContext
  - 全局应用级别响应式状态
- hooks + useContext + useContext
  - 全局应用级别响应式状态管理
-
