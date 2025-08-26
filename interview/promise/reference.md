# Promise 组合方法速查

面试与实战中最常用的 4 个 Promise 组合方法：`Promise.all`、`Promise.race`、`Promise.any`、`Promise.allSettled`。下面按“语义 → 行为 → 典型用法 → 注意点”讲清楚。

## 快捷对照表

| 方法       | 成功条件          | 失败条件                       | 返回值                 |
| ---------- | ----------------- | ------------------------------ | ---------------------- |
| all        | 全部 fulfilled    | 任一 rejected                  | 按输入顺序的值数组     |
| race       | 首个 settled 决定 | 无                             | 首个 settled 的值/原因 |
| any        | 首个 fulfilled    | 全部 rejected → AggregateError | 首个 fulfilled 的值    |
| allSettled | 全部 settled      | 无                             | 每项结果对象数组       |

---

## Promise.all(iterable)

- 语义：等待“全部 fulfilled”；有一个 reject 就整体 reject。
- 返回：单个 Promise，成功时值为“按输入顺序”组成的数组。
- 行为：

  - 输入是可迭代对象（常见是数组），元素可以是 Promise 或普通值。
  - 只要有一个 Promise 变为 rejected，整体立刻 rejected（短路）。
  - 若输入为空数组，立即以空数组 resolved。

- 典型用法：并发请求、批量读取、结果聚合。
- 注意点：

  - 顺序以输入顺序为准，与完成先后无关。
  - 任一失败会导致整体失败，若想“都返回结果”，用 `allSettled`。

示例：

```js
const p1 = fetch("/api/a").then((r) => r.json());
const p2 = fetch("/api/b").then((r) => r.json());
const p3 = 42; // 普通值也会被当作 resolved Promise

Promise.all([p1, p2, p3])
  .then(([a, b, num]) => {
    console.log(a, b, num);
  })
  .catch((err) => {
    console.error("任一失败则到这里：", err);
  });
```

---

## Promise.race(iterable)

- 语义：谁先 settled（fulfilled 或 rejected），就用谁的结果。
- 返回：单个 Promise，值/原因为“第一个 settled 的那个”。
- 典型用法：超时控制、兜底方案、优先返回最快数据源。

超时示例：

```js
const withTimeout = (taskPromise, ms = 5000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([taskPromise, timeout]);
};

withTimeout(fetch("/api/slow"), 3000)
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## Promise.any(iterable)

- 语义：等待“第一个 fulfilled”；若全部 rejected，则整体 rejected。
- 返回：单个 Promise。
- 全部失败时：以 `AggregateError` 拒绝，包含所有失败原因。
- 典型用法：多源容灾，只要有一个成功就行（如主备接口、备选 CDN）。

示例：

```js
const fastCDN = fetch("https://cdn-a.com/file");
const backupCDN = fetch("https://cdn-b.com/file");

Promise.any([fastCDN, backupCDN])
  .then((r) => r.text())
  .then(console.log)
  .catch((err) => {
    // 只有都失败才会到这，err 是 AggregateError
    console.error(err.errors); // 所有失败原因
  });
```

---

## Promise.allSettled(iterable)

- 语义：等待“全部 settled”（无论成功或失败），永不短路。
- 返回：单个 Promise，成功值为结果对象数组：

  - 成功项：`{ status: 'fulfilled', value }`
  - 失败项：`{ status: 'rejected', reason }`

- 典型用法：需要收集每个任务的最终结果，做统计/降级/部分成功处理。

示例：

```js
const tasks = [
  fetch("/api/a").then((r) => r.json()),
  fetch("/api/b").then((r) => r.json()),
  Promise.reject(new Error("手动失败")),
];

Promise.allSettled(tasks).then((results) => {
  const success = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
  const failed = results
    .filter((r) => r.status === "rejected")
    .map((r) => r.reason);
  console.log("成功：", success);
  console.log("失败：", failed);
});
```

---

## 选型对比与速记

- all：全部成功才成功；有一个失败就失败。适合“全部都要”。
- race：谁先结束用谁；常用于超时/抢占。
- any：第一个成功就成功；都失败才失败。适合“有一个就够”。
- allSettled：等全部有结果；用于统计与部分成功场景。

---

## 常见面试坑点

- `Promise.any` 全部失败时抛出 `AggregateError`，错误集合在 `errors` 数组。
- `Promise.race` 做超时时，原任务不会自动取消；配合 `AbortController` 更稳妥。
- `Promise.all` 保序但会短路；一个失败整体失败，不适合“部分结果”收集。
- `Promise.allSettled` 永远不会 reject，返回的是结果对象数组而非值数组。
- 并发来自同时创建 Promise；在 `for...of` 中逐个 `await` 是串行。
- 空输入行为不同：`all/settled` 立即 resolved；`race/any` 永久 pending。

---

## 小知识与陷阱

- “并发”来自于同时创建 Promise；若在 `then` 里串起再发，那是串行。
- 空数组：

  - `Promise.all([])` 和 `Promise.allSettled([])` 立即 resolved（值分别是 `[]`）。
  - `Promise.race([])` 和 `Promise.any([])` 永远“悬而未决”（pending）。

- `any` 的全失败错误是 `AggregateError`，有 `errors` 数组可用于排查。
- 若想限制并发数量，需自实现队列/使用库（如 p-limit），与这四个组合方法无关。
