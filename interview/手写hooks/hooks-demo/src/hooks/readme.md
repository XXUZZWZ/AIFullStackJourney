### usePrevious 原理简述

- useRef 返回的是一个在整个组件生命周期内都“保持同一个引用”的可变容器 (`ref.current`)。它的变化不会触发组件重新渲染。
- useEffect 在每次渲染“提交之后”执行。因此：
  - 第 N 次渲染时，`ref.current` 仍是第 N-1 次渲染时存下的值（因为上一次的 effect 已经把它更新成了“上一次的值”）。
  - 本次渲染提交后，effect 才把 `ref.current` 更新为“当前值”，为下一次渲染准备。

换句话说：渲染时拿到的是“上一次渲染保存的值”，提交后再把它更新为“本次值”，所以能够得到“上一次的值”。

### 你这段代码的时间线

- 初始化：`useRef(value)` 让第一次渲染时 `ref.current === 当前 value`（注意：第一次并不是 undefined）。
- 渲染完成后：`useEffect` 把 `ref.current = 当前 value`。
- 下一次渲染时：返回的 `ref.current` 就是“上一次的 value”。

### 首次渲染想得到 undefined？

如果你期望第一次渲染返回 undefined（更“语义化”的 previous），可以这样写：

```ts
const ref = useRef<T | undefined>(undefined);
useEffect(() => {
  ref.current = value;
}, [value]);
return ref.current;
```

这样首次渲染返回 `undefined`，之后每次返回“上一次的值”。

### 核心原因（渲染时机与副作用时机不同步）

- 渲染阶段：React 执行函数组件，读取 `ref.current`。这个阶段不会执行 `useEffect`，也不会改 `ref.current`。
- 提交阶段（commit）：本次渲染结果挂到真实 DOM 上后，React 才调度并执行 `useEffect` 回调。
- 因此，在第 N 次渲染“读取”时，`useEffect` 还没跑，`ref.current` 仍是上一次提交后由上一次 `useEffect` 写入的值，也就是第 N-1 次的值。
- 等到第 N 次渲染提交完成，`useEffect` 才把 `ref.current` 更新为“当前值”，为第 N+1 次渲染做准备。

### 为什么用 ref 可以做到

- `useRef` 持有一个在组件整个生命周期内稳定不变的对象引用，其 `.current` 可变但更新不触发重渲染。
- 这使得我们可以在“提交后”的 `useEffect` 中写入最新值，而在“下一次渲染”读取到的就是上一次写入的值——天然形成“previous”的效果。

### 补充细节

- 首次渲染：如果 `useRef(value)`，则第一次返回的就是当前值；若想第一次返回 `undefined`，初始成 `useRef<T | undefined>(undefined)` 即可。
- 严格模式（开发环境）会额外触发一次装载-卸载以帮助发现副作用问题，但不改变“渲染先于 useEffect、effect 提交后执行”的时序本质。
