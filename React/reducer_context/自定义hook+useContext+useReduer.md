# 使用自定义 hooks + useContext + useReduer 构建中型项目

## 目录结构

- src
  - components
    - AddTodo.jsx // 添加任务组件
    - TodoList.jsx // 任务列表组件
  - hook // 自定义 hooks
    - useTodos.jsx // 返回状态和可以改变状态的函数，依赖 todoReducer.js 来定义改变状态的函数
    - useTodoContext.jsx // 这里是返回 useContext(TodoContext)的结果，依赖于 TodoContext
  - reducer
    - todoReducer.jsx // 定义改变状态的 Reducers 函数
  - TodoContext // 创建了上下文对象，并导出
  - App.jsx // 根组件
    - 创建了 TodoContext.Provider，并传入 value={useTodoContext()} 实际上就是 value = {state,useA(x)=>dispatch(x)，useB(x)=>dispatch(x)，useC(x)=>dispatch(x)，useD(x)=>dispatch(x)} 这里用 useTodos 做了一层封装，返回 state 和包装了一层的 dispatch 函数，可以直接使用，不用 通过 dispatch({type: 'ADD',payload:x}) 来调用 而是可以直接 useA(x)=>dispatch({type: 'ADD',payload:x})来简化操作。再比如 toggle(x)=>dispatch({type: 'TOGGLE',payload:x})等封装。
