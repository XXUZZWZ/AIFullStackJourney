好的，你这个 `readme.md` 在讲 React 的 diff（协调/Reconciliation）：给两棵虚拟 DOM 树，产出一个“补丁（patches）”列表，把当前树变成工作中树，并尽量减少 DOM 操作。下面用最关键的点串起来。

### 核心流程（React 视角）

- Render 阶段（可中断）：比较 current Fiber Tree 和新产生的 workInProgress 树，标记变化，生成副作用链表（effect list）。
- Commit 阶段（不可中断）：按标记一次性对真实 DOM 执行最少的插入/更新/删除。

### 节点比较规则（单节点）

- 类型相同（同 HTML 标签或同组件）：复用节点，只对比 `props`/`attrs`，更新差异。
- 类型不同：整棵子树替换（卸载旧、挂载新）。
- 文本节点：直接比较文本内容，变了就 `nodeValue` 更新。
- key 相同才认为“同一元素的不同版本”；key 不同视为不同元素。

### 子节点列表 Diff（关键）

- 无 key（或使用索引做 key）：
  - 同层顺序对比，逐个复用或替换。
  - 中间插入/删除会导致后续大量错位，复用率低、DOM 操作多。
- 有稳定 key：
  - 构建 key → oldChild 的映射，单次遍历新子列表：
    - key 命中 → 复用并移动（必要时）
    - 未命中 → 创建新节点
  - old 中多余的节点 → 删除
- 目标：在不做全局最优计算的前提下，用线性复杂度近似最少 DOM 变更。

### 产生的补丁（Fiber flags）

- Placement：需要插入（或移动到新位置）
- Update：属性/样式/事件变更
- Deletion：需要删除
- 这些在 Render 阶段被打标，Commit 阶段统一执行

### 简例（为何要稳定 key）

旧：[{id:1},{id:2},{id:3}]
新：[{id:3},{id:1},{id:2}]

- 有 key=id：React 识别到 1、2、3 都可复用，仅做“移动”操作。
- 用索引当 key：React 误判为大量替换，可能重建 DOM，丢失子组件状态。

### 与真实 DOM 的关系

- React 不直接“边遍历边改 DOM”，而是先在内存生成 workInProgress 树并打补丁标记，再一次性提交到 DOM，减少重排重绘和中间态闪烁。

### 常见坑

- 列表使用索引当 key → 移动/插入导致错位重建、状态错乱。
- 把副作用（DOM 读写/订阅）放在渲染逻辑里，应放 `useEffect`/`useLayoutEffect`。
- 误解“最少 DOM 操作”：React 采用启发式、线性复杂度，不保证全局最优，但“足够好且快”。

如果你愿意，我可以把 `interview/react/diff/readme.md` 补充成更系统的笔记：加入小图、带 key/无 key 的对比表、以及一个最小可运行的列表重排示例，帮助记忆与面试表述。
