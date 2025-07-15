# reducer

- 聊聊组件通信
  - 单向数据流 跨层级通信
    - 父子组件 props 通信,传递数据或事件
    - 子父组件通信-自定义事件 props 传递
    - 兄弟组件通信通过父组件来通信
    - 兄弟组件通过父组件中转
  - 跨层级通信
    - useContext +useReducer
    - Redux
- useContext +useReducer
  - 帮我们打理复杂的全局的跨层级共享 ？？
  - useReducer 帮我解决全局状态**管理**
  - 多状态值管理
  - 俄罗斯套娃一样太多了。
  - 经营一家公公司一样制定一个制度
    - 单纯 Reducer 纯函数
- 纯函数和规定

## useReducer 纯函数

- useState 做响应式状态
- useReducer 响应式状态管理
  - 怎么管理？
  - 纯函数？
