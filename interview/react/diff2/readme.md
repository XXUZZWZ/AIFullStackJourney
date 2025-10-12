# diff

React 的 diff 算法核心是用最小的计算成本，找到两颗树的差异，只更新真正改变的节点 以及 收集到 patchs

- 真实的 DOM 树 可能比较深，如果每次都做完整的树比对 时间复杂度 为 n^3,页面会卡
- 同级比较 如果一个节点类型不同，直接替换，不做子树的比较
- 删除一些没有的节点
- 列表元素移动，快速找到元素前后对应关系，移动或复用节点，而不是暴力重建
- diff 算法 核心思想是 分层比较
  双端 diff
  - 一个个 节点来对比 区旧列表找 key 找到 了就看看是不是在后面 不动 不是就移动到新位置 lastIndex

## React 是否使用双端 diff？

- 结论：React 不使用“双端 diff”（头尾双指针法）。
- React 的同级节点对比采用单端线性遍历策略，自左向右处理：
  - 基于 key 复用节点；
  - 当顺序被打乱时，用旧节点构建 key -> fiber 的映射快速查找；
  - 使用 lastPlacedIndex 判断节点是否需要移动，移动则插入到正确位置；
  - 追求近似 O(n) 的复杂度，并不保证“最少移动次数”的最优解。
- 不同类型的节点直接替换，不做子树比较；新列表没有出现的旧节点会被标记删除。

## 与 Vue 的对比（易混点）

- Vue 2/3：常见“双端指针”策略，Vue 3 还会结合 LIS（最长递增子序列）优化以减少移动次数。
- React：更偏向实现简单、稳定且调度友好的策略，不做最少移动次数的全局最优。

## 面试要点速记

- 关键词：key、reconcileChildrenArray、lastPlacedIndex、同级比较、近似 O(n)、非最少移动。
- 常见误区：把 Vue 的双端 diff 误认为是 React 的实现。

A B C 0 -1 -2
B C A

### 结论（针对旧：A B C → 新：B C A）

- 会复用全部三个节点，不删除不新增。
- 仅标记 A 需要移动，把 A 移到末尾；B、C 不动。
- 时间复杂度近似 O(n)。

### 简要过程（基于稳定 key）

- 旧索引：A@0, B@1, C@2；lastPlacedIndex 初始为 0
- 遍历新列表：
  - B：oldIndex=1 ≥ 0 → 不动；lastPlacedIndex=1
  - C：oldIndex=2 ≥ 1 → 不动；lastPlacedIndex=2
  - A：oldIndex=0 < 2 → 标记“需要移动”，把 A 插到 C 后
- 结果：得到 B C A，仅一次移动（A）。

### 详细过程（A B C → B C A）

- 旧列表与 key：A(0), B(1), C(2)
- 新列表与顺序：B, C, A
- 步骤：
  1. 前缀匹配阶段：新[0]=B 与 旧[0]=A key 不同，前缀匹配结束。
  2. 建表阶段：把未匹配到前缀的旧节点放入 map：{ A@0, B@1, C@2 }，lastPlacedIndex=0。
  3. 放置阶段（按新列表从左到右）：
     - 处理 B：oldIndex=1 ≥ lastPlacedIndex(0) → 不动，lastPlacedIndex=1
     - 处理 C：oldIndex=2 ≥ lastPlacedIndex(1) → 不动，lastPlacedIndex=2
     - 处理 A：oldIndex=0 < lastPlacedIndex(2) → 需要移动，将 A 插入到 C 后
  4. 清理阶段：所有旧节点均已复用，无需删除。
  5. 结果：B C A（全复用，仅一次移动 A）。

备注：判断是否移动只依赖 oldIndex 与 lastPlacedIndex 的比较，不计算最少移动次数的全局最优。

- A B C D
- D A B C

### 详细过程（A B C D → D A B C）

- 旧列表与 key：A(0), B(1), C(2), D(3)
- 新列表与顺序：D, A, B, C
- 步骤：
  1. 前缀匹配阶段：新[0]=D 与 旧[0]=A 不同，前缀匹配结束。
  2. 建表阶段：map = { A@0, B@1, C@2, D@3 }，lastPlacedIndex=0。
  3. 放置阶段（按新列表从左到右）：
     - 处理 D：oldIndex=3 ≥ 0 → 不动，lastPlacedIndex=3
     - 处理 A：oldIndex=0 < 3 → 需要移动，插到 D 后
     - 处理 B：oldIndex=1 < 3 → 需要移动，插到 A 后
     - 处理 C：oldIndex=2 < 3 → 需要移动，插到 B 后
  4. 清理阶段：所有旧节点均已复用，无需删除。
  5. 结果：D A B C（全复用，标记 A/B/C 为“移动”，D 为“不动”）。

提示：lastPlacedIndex 只用于判断是否移动，并不追求全局“最少移动次数”。
