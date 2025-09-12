我先打开你当前聚焦的 `React/DiReact/fiber/fiber.js`，快速识别其中“不常用”的 API，并梳理每个的参数、返回值与副作用，然后整理成清晰要点给你。

[1 tool called]

我已通读 `React/DiReact/fiber/fiber.js`，现在按“较不常用/内部”API 逐个给出：参数、返回值、以及副作用，便于你快速检索与理解。

### 内部/不常用 API 讲解

- `createDom(fiber)`

  - 参数:
    - `fiber`：当前 Fiber 节点（包含 `type`, `props`）
  - 返回值:
    - `dom`：创建好的真实 `Node`（`Text` 或 `Element`）
  - 副作用:
    - 调用 `document.createTextNode`/`document.createElement` 创建真实 DOM
    - 通过 `updateDom` 设置属性与事件

- `updateDom(dom, prevProps, nextProps)`

  - 参数:
    - `dom`：目标 DOM 节点
    - `prevProps`：旧属性对象
    - `nextProps`：新属性对象
  - 返回值:
    - 无（`undefined`）
  - 副作用:
    - 移除旧事件监听与被删除属性
    - 设置/更新新属性
    - 绑定新事件监听
    - 直接读写 DOM 与事件系统

- `workLoop(deadline)`

  - 参数:
    - `deadline`：调度回调获得的时间片对象（提供 `timeRemaining()`）
  - 返回值:
    - 无
  - 副作用:
    - 循环推进渲染分片：调用 `performUnitOfWork`
    - 在工作用尽或时间片不足时终止
    - 完成时触发 `commitRoot`
    - 重新安排下一帧工作（调用 `requestWorkLoop`）

- `shouldYield(deadline)`

  - 参数:
    - `deadline`：时间片对象
  - 返回值:
    - `boolean`：是否应让出主线程（`timeRemaining() < 1`）
  - 副作用:
    - 无（纯判断）

- `requestWorkLoop()`

  - 参数:
    - 无
  - 返回值:
    - 无
  - 副作用:
    - 为 `workLoop` 注册下一次调度回调（防抖：`scheduleHandle`）
    - 依赖 `scheduler` 来选择具体调度方式

- `scheduler(cb)`

  - 参数:
    - `cb`：被调度的回调（接收 `deadline`）
  - 返回值:
    - `{ cancel: () => void }`：取消句柄
  - 副作用:
    - 使用 `MessageChannel` / `requestIdleCallback` / `setTimeout` 安排宏/空闲任务
    - 当使用 `MessageChannel` 时，构造“伪 deadline”（`timeRemaining: () => 5`）

- `performUnitOfWork(fiber)`

  - 参数:
    - `fiber`：当前处理的 Fiber 单元
  - 返回值:
    - `Fiber | null`：下一要处理的 Fiber（先子后兄弟，再回溯）
  - 副作用:
    - 若 `fiber.dom` 不存在则调用 `createDom` 创建
    - 调用 `reconcileChildren` 构建/对比子 Fiber 结构（设置 `effectTag`）
    - 推进指针控制 DFS 次序

- `reconcileChildren(wipFiber, elements)`

  - 参数:
    - `wipFiber`：正在构建的父 Fiber
    - `elements`：该父节点的新子 VDOM 列表
  - 返回值:
    - 无
  - 副作用:
    - 基于旧 Fiber（`alternate.child`）与新 `elements` 做极简 Diff
    - 标记子 Fiber 的 `effectTag` 为 `"UPDATE"|"PLACEMENT"`；对多余旧 Fiber 标记 `"DELETION"` 并推入全局 `deletions`
    - 链接 `child/sibling` 指针构建 Fiber 子链

- `commitRoot()`

  - 参数:
    - 无
  - 返回值:
    - 无
  - 副作用:
    - 先处理全局 `deletions`（删除 DOM）
    - 递归提交 `wipRoot.child`（新增/更新 DOM）
    - 切换双缓存：`currentRoot = wipRoot; wipRoot = null`

- `commitWork(fiber)`

  - 参数:
    - `fiber`：要提交的 Fiber
  - 返回值:
    - 无
  - 副作用:
    - 查找最近的有 DOM 的父 Fiber，获取 `parentDom`
    - 按 `effectTag`：
      - `"PLACEMENT"`：`parentDom.appendChild(fiber.dom)`
      - `"UPDATE"`：`updateDom(fiber.dom, fiber.alternate.props, fiber.props)`
      - `"DELETION"`：调用 `commitDeletion`
    - 递归提交 `child` 与 `sibling`，直接操作 DOM

- `commitDeletion(fiber, parentDom)`

  - 参数:
    - `fiber`：要删除的 Fiber（可能自身无 DOM）
    - `parentDom`：其最近有 DOM 的父节点 DOM
  - 返回值:
    - 无
  - 副作用:
    - 若当前 `fiber.dom` 存在：`parentDom.removeChild(fiber.dom)`
    - 否则向下递归查找有 DOM 的子节点删除
    - 直接移除真实 DOM

- `render(element, container)`

  - 参数:
    - `element`：根 VDOM
    - `container`：容器 DOM 节点
  - 返回值:
    - 无
  - 副作用:
    - 初始化 `wipRoot`（双缓存的 WIP 树根）
    - 设置 `nextUnitOfWork = wipRoot`
    - 重置本轮 `deletions = []`
    - 不直接改 DOM，等待调度推进与提交阶段

- 辅助判断：
  - `isEvent(key)` / `isProperty(key)`
    - 参数: `key`（字符串）
    - 返回值: `boolean`
    - 副作用: 无（纯函数）

### 小结

- 上述 API 多为内部渲染管线与调度相关，直接操纵 DOM 的副作用主要集中在 `updateDom`、`commitWork`、`commitDeletion`、`createDom`。
- 调度与可中断逻辑由 `scheduler`、`requestWorkLoop`、`workLoop`、`shouldYield` 协作，属于“并发渲染”的教学版实现。

如果你希望，我可以把这些说明补充成 `note.md` 与练习 `problem.md` 写到 `React/DiReact/fiber/` 下；或进一步对比 React 18 真正实现中的相应概念与差异。
