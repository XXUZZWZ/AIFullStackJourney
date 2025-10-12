### React Hooks 顶层调用规则与“状态槽位”原理笔记

#### 为什么必须在顶层调用 Hooks

- **身份即顺序**：React 用“调用顺序”作为每个 Hook 的身份标识，将其状态存进按序排列的“槽位（slot）/链表节点”中。
- **一致性要求**：下一次渲染会按完全相同的调用顺序取回对应槽位的状态与副作用。因此，Hook 调用次数与顺序必须在每次渲染中保持一致。
- **顶层规则**：只在函数组件或自定义 Hook 的“顶层”调用 Hook，不要放进条件、循环或嵌套函数。

#### 违反会导致的问题（原理解释）

- **状态错位**：第 n 个 `useState` 没被调用而第 n+1 个被调用，随后所有后续 Hook 的槽位左移/右移，A/B 的状态彼此错位。
- **Effect 清理错乱**：`useEffect` 的订阅与清理按序记账，顺序漂移会造成清理错对象、重复订阅或清不干净。
- **渲染崩溃或诡异行为**：某些渲染路径没调用到预期的 Hook，读取到不存在或错误的槽位，可能直接报错或表现不稳定。

#### 正反示例

错误（条件内调用，顺序变化导致错位）：

```jsx
function App({ show }) {
  const [a] = React.useState("A");
  if (show) {
    const [b] = React.useState("B"); // ❌ 条件中调用
  }
  const [c] = React.useState("C");
  return null;
}
```

正确（顶层固定顺序；条件决定“是否使用”，而不是“是否调用”）：

```jsx
function App({ show }) {
  const [a] = React.useState("A");
  const [b] = React.useState("B"); // ✅ 始终占据第二个槽位
  const [c] = React.useState("C");
  return show ? <div>{b}</div> : null;
}
```

#### 极简 Hooks 实现与运行演示

- 参考文件：`interview/react/hooks_sx/1.jsx`
- 核心思路：
  - 维护 `hookStates`（数组/表）与 `hookIndex`（当前调用序号）。
  - 每次“渲染”前把 `hookIndex` 置 0；组件执行时每调用一次 Hook，使用并递增索引。
  - `useState` 在首次访问对应索引时初始化；之后读写同一槽位。
  - `useEffect` 使用索引存放依赖与清理函数，依赖变化时先清理后执行。
- 演示方法：
  - BAD：`AppBad` 在条件内调用 `useState`，当 `show` 从 true → false，b 的槽位消失，后续槽位错位。
  - GOOD：`AppGood` 始终在顶层调用相同数量与顺序的 Hook，状态稳定。
- 运行：
  - 使用 Node 直接执行 `1.jsx`，观察控制台 `hookStates` 与日志。可直观看到 BAD/GOOD 的差异。

#### 实践建议

- **只在顶层调用**：组件函数或自定义 Hook 顶层，禁止放在 `if/for/函数内部`。
- **把条件放入逻辑内部**：在 `useEffect` 中用 `if (!enabled) return;` 控制启用，而不是包住 Hook 调用。
- **用工具兜底**：启用 `eslint-plugin-react-hooks` 以自动检查 `rules-of-hooks` 与依赖数组。

#### 一句话记忆

- Hook 的“调用序列”就是它的“身份”。想要状态不串位，就让序列每次渲染都一致——只在顶层调用。

#### useEffect 条件启用：错误与正确写法（详细）

错误：把“是否启用”写在 Hook 外层条件中，导致有些渲染不调用该 Hook → 调用序列不稳定。

```jsx
function Bad({ enabled }) {
  const [value, setValue] = React.useState(0);
  if (enabled) {
    // ❌ 当 enabled 为 false 时，本次渲染完全不调用这个 effect
    React.useEffect(() => {
      const id = setInterval(() => setValue((v) => v + 1), 1000);
      return () => clearInterval(id);
    }, []);
  }
  return <div>{value}</div>;
}
```

正确：始终在顶层调用 `useEffect`，把“是否启用”的逻辑放在 effect 内部或依赖中，以 early-return/清理控制行为，保持调用次数不变。

写法 A：在 effect 内部做 early-return（更直观）。

```jsx
function GoodA({ enabled }) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (!enabled) return; // ✅ 未启用时不建立订阅
    const id = setInterval(() => setValue((v) => v + 1), 1000);
    return () => clearInterval(id); // ✅ 启用→禁用时能正确清理
  }, [enabled]);
  return <div>{value}</div>;
}
```

写法 B：把 `enabled` 放入依赖；当变为 false 时，清理后不再重建。

```jsx
function GoodB({ enabled }) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    // 当 enabled 为 false 时，effect 仍被“调用”但不建立副作用
    if (!enabled) return;
    const id = setInterval(() => setValue((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [enabled]);
  return <div>{value}</div>;
}
```

写法 C：复杂订阅场景，清理顺序与依赖拆分。

```jsx
function GoodC({ enabled, source, throttleMs }) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let timer = null;

    function onMessage(msg) {
      if (cancelled) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setData(msg), throttleMs);
    }

    source.on("message", onMessage);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      source.off("message", onMessage);
    };
  }, [enabled, source, throttleMs]); // ✅ 所有用到的外部值都在依赖中

  return <pre>{JSON.stringify(data)}</pre>;
}
```

要点：

- 始终在顶层调用 `useEffect`，不要把它放进条件分支里。
- 用 early-return 或依赖控制 effect 的启用与清理。
- 依赖数组应列出 effect 中用到的所有外部变量，保证变动时正确重建/清理。
