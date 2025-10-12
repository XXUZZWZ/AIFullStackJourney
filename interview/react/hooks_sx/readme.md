- react hooks 为何不能放到非顶层代码中
- 函数组件每次渲染不会保留局部变量，react 只能在一次次调用自己保存 state/effect 等 hooks

- 他的做法是：给每一个 hooks 在链表。数组里排位置，比如第一个 slot useState 第二个 useEffect

- 下一次渲染时 React 会调用顺序一个一个取
