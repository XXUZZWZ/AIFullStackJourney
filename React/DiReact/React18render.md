### React 18 的 render 是怎么“做”的（核心机制一图读懂）

- **入口与根容器**

  - React 18 引入 `createRoot(container)`（替代 legacy `ReactDOM.render`），支持并发渲染；SSR 用 `hydrateRoot`.
  - 更新入口统一走 `scheduleUpdateOnFiber` → 安排到根 `FiberRoot` 的调度队列。

- **并发渲染的本质：可中断 + 分片**

  - 通过 Scheduler（独立调度器）+ Lane 模型（优先级通道）实现“时间分片”和“可中断渲染”。
  - 高优先级（如输入事件）可以打断低优先级渲染；未完成的 `workInProgress` 可继续复用，避免重头来过。

- **双阶段（render → commit）与双缓存 Fiber 树**

  - render 阶段（调和）：构建/更新 `workInProgress` Fiber 树（副本），只是计算变更，不触摸真实 DOM，可中断。
  - commit 阶段：一次性把变更提交到 DOM，执行布局/副作用；不可中断。
  - 双缓存：`current`（已提交）与 `workInProgress`（正在计算）两棵树间切换。

- **Lane 优先级模型（取代老的 expirationTime）**

  - 多条“车道”对应不同类型/紧急度的更新（离散事件、连续事件、Transitions、Idle 等）。
  - 调度器根据“最紧急的 Lane”选择要处理的 root 与更新批次，支持合并与降级。

- **工作循环（高层调用链）**

  - `setState/useState` → `scheduleUpdateOnFiber`
  - `ensureRootIsScheduled` → 根据 lanes 安排任务
  - `performConcurrentWorkOnRoot`
    - `renderRootConcurrent` → `workLoopConcurrent`（可中断）
      - `beginWork`（创建/复用子 Fiber，计算 diff）
      - `completeWork`（生成 effect/tag，准备 DOM 操作）
    - 完成后进入 `commitRoot`
      - `beforeMutation`（DOM 前）
      - `mutation`（应用 DOM 变更）
      - `layout`（触发 layout effects）
      - 异步执行 passive effects（`useEffect`）

- **调度器与优先级**

  - Scheduler 提供任务队列与时间切片（`MessageChannel` 为主回退，必要时 `setTimeout`）。
  - 优先级：Immediate、UserBlocking、Normal、Low、Idle；React 将这些映射到 lane 组合进行更细粒度控制。

- **关键并发特性/API**

  - **Transitions**：`startTransition` / `useTransition` 将某些更新标记为“非紧急”，避免阻塞输入。
  - **自动批处理**：任意环境（事件/定时器/Promise）中多个 setState 会自动合并提交。
  - **Suspense**：数据未就绪时可“挂起”，结合并发渲染能选择性跳过/回退并在就绪后无闪烁更新。
  - **`useDeferredValue`**：为派生值降级优先级，平滑 UI。
  - **`useId`**：并发 + SSR 稳定 ID。
  - **StrictMode**（开发）：有意双调用某些生命周期/副作用以暴露不安全逻辑。

- **SSR 与水合（Hydration）**

  - `hydrateRoot` 支持流式与选择性水合；可被高优先级事件打断；Suspense 边界能按需水合与回退，提升交互就绪时间。

- **副作用时机**

  - `useLayoutEffect`：commit 后、浏览器绘制前，同步执行（影响布局）。
  - `useEffect`：commit 结束后异步执行（不阻塞渲染），与并发调度配合良好。

- **事件与同步边界**
  - 离散事件（如 click、keyDown）通常以更高优先级同步/准同步处理，必要时 `flushSync` 可强制同步边界。

### 和你当前 `didact.js` 的差异（快速对照）

- 你的 `render` 是一次性同步递归：不可中断、无优先级、无调度、无双阶段。
- React 18 的 `render` 有：调度器 + lane 优先级、可中断的并发工作循环、render/commit 分阶段、双缓存 Fiber、自动批处理与 Suspense/Transition 等语义特性。

### 一句话总结

- React 18 的 render 通过 Fiber + Scheduler + Lanes 将渲染拆分为可中断的、按优先级调度的任务，在 render/commit 两阶段间配合双缓存树，实现高性能、可预测、对交互友好的并发渲染。
