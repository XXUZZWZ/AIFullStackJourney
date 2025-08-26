# 数组上的方法

## 一、按“是否修改原数组”分类（副作用视角）

- 会修改原数组（非纯函数）要谨慎使用：

  - push / pop（尾部入栈/出栈）
  - shift / unshift（头部出队/入队，移动元素，O(n)）
  - splice（删/插/替换，O(n)）
  - sort / reverse（重排）
  - fill / copyWithin（写入/覆盖）

- 不修改原数组（纯函数，返回新数组）： 推荐多用在 React 这些框架中要返回一些数据，因为数据不变，不会触发视图更新。
  - forEach 没有返回
  - map 返回新数组
  - 查找类
    - es5 就提供了 indexOf /LastIndexOf 判重等
    - es6 提供了 find 查找满足条件的元素，第一个元素
    - js 是基于 ECMAScript 脚本标准开发的
      - ES5 兼容性
      - ES6 新特性
      - ES6 + 新特性
    - findIndex 查找满足条件元素，第一个元素下标
    - includes 判断是否包含某元素
    - find/findIndex/findLast/findLastIndex
    - 过滤和判定
      - filter
      - every
      - some
      - any
  - slice（截取/浅拷贝）
  - slice(start, end)
  - concat
  - flat
  - flat( depth )
  - 迭代器 iterable - keys() values entries() - 与 for...in 的区别
    for...in 遍历可枚举属性名，包含继承属性，顺序不保证，适合对象。
    for...of/keys/values/entries 走迭代协议，顺序有保证，适合数组元素遍历。
  - join/toString
  - 归约
    reduce ,reduceRight 相加
  - 静态方法
    - Array.isArray
    - Array.from
    - Array.of
  - concat（拼接，浅拷贝）
  - map / filter / reduce / reduceRight
  - flat / flatMap
  - toSorted / toReversed（不可变重排，ES2023）
  - toSorted/toReversed/toFlatSorted/toFlatReversed（不可变重排，ES2023）

> 实战规则：在需要“不可变更新”（如 React/Redux）时优先使用不改原数组的方法；仅在明确接受副作用时使用会改原数组的方法。

---

## 二、核心方法详解（参数 / 返回值 / 副作用 / 复杂度）

### 1. splice(start, deleteCount, ...items)

- 参数：

  - start：起始索引（可负，按 length + start 折算）
  - deleteCount：删除个数
  - ...items：要插入的新元素

- 返回值：被删除元素数组

- 副作用：会修改原数组（增删改）

- 时间复杂度：O(n)（可能移动大量元素）

- 示例（见 `1.js`）：

```js
const a = [1, 2, 3, 4];
a.splice(1, 2); // 删除 → a=[1,4]
a.splice(1, 0, 7, 8); // 插入 → a=[1,7,8,4]
a.splice(2, 1, 9); // 替换 → a=[1,7,9,4]
```

### 2. slice(start?, end?)

- 参数：

  - start：默认 0；可负（length + start）
  - end：默认 length；开区间（不含 end），可负（length + end）

- 返回值：新数组（浅拷贝）

- 副作用：不修改原数组

- 边界：end ≤ start → []；越界会被钳制到 [0, length]

- 示例（见 `1.js`）：

```js
const b = [1, 2, 3, 4];
b.slice(1, 4); // [2,3,4]
b.slice(-2); // [3,4]
const clone = b.slice(); // 浅拷贝
```

### 3. concat(...items)

- 参数：若干数组或元素

- 返回值：新数组（浅拷贝；对象元素拷引用）

- 副作用：不修改原数组

- 说明：不是“深拷贝”；对象/数组元素仍与源共享引用

- 示例：

```js
const b = [1, 2, 3, 4];
const res = b.slice(1, 3).concat(b.slice(4)); // 结果为 [2,3]
```

---

## 三、栈/队列方法与性能

- push / pop（栈）：尾部操作，近似 O(1)，高效。

- shift / unshift（队列）：头部操作，需要整体移动元素，O(n)，大数据量下应避免。

- 建议：如需高频头部操作，考虑双端队列（两个栈模拟或专用结构）。

---

## 四、不可变更新 vs 可变更新（对比）

- 不可变更新（推荐于 UI 状态）：

  - 删除：`arr.filter((_, i) => i !== k)` 或 `arr.slice(0,k).concat(arr.slice(k+1))`
  - 替换：`arr.map((x,i)=> i===k ? newX : x)`
  - 插入：`arr.slice(0,k).concat([newX], arr.slice(k))`

- 可变更新（会改原数组，简单直接）：
  - 删除/插入/替换：`splice`

---

## 五、ES6+ 常用方法分组

- 遍历/转换：forEach, map, filter, flat, flatMap

- 查找/判断：find, findIndex, includes, some, every, indexOf, lastIndexOf, at

- 拼接/成串：concat, join

- 统计/聚合：reduce, reduceRight

- 构造/填充：Array.from, Array.of, fill, copyWithin

- 不可变重排：toSorted, toReversed

---

## 六、浅拷贝与深拷贝提示

- slice/concat 创建的是“新数组的浅拷贝”：

  - 基本类型值会复制
  - 引用类型复制引用（共享同一对象）

- 若需深拷贝：`structuredClone(obj)`、`lodash.cloneDeep` 等（JSON 序列化有信息丢失限制）。

---

## 七、从示例代码提炼（`interview/js/arr/method/1.js`）

```js
// 1) 可变：splice 系列操作
const a = [1, 2, 3, 4];
a.splice(1, 2); // 删除 → a=[1,4]
a.splice(1, 0, 7, 8); // 插入 → a=[1,7,8,4]
a.splice(2, 1, 9); // 替换 → a=[1,7,9,4]

// 2) 不可变：slice/concat 组合
const b = [1, 2, 3, 4];
const sub = b.slice(1, 4); // [2,3,4]
const tail = b.slice(-2); // [3,4]
const removed = b.slice(1, 3).concat(b.slice(4)); // [2,3]
const clone = b.slice(); // 浅拷贝
```

> 结论：在需要可控副作用与更好可维护性的场景中，优先使用不变式（slice/concat 等）进行数组更新；对性能敏感或简单场景再考虑 splice 等可变方法。
