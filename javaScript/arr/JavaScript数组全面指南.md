# JavaScript 数组全面指南

## 一、数组基础

### 1. 数组声明

```javascript
// 字面量声明
const arr1 = [1, 2, 3];

// 构造函数声明
const arr2 = new Array(4, 5, 6);
const sparseArr = new Array(5); // 创建长度为5的空槽位数组
const filledArr = new Array(5).fill(undefined); // 创建填充undefined的数组

// Array.of()声明
const arr3 = Array.of(7, 8, 9, { name: "tom" }, [10, 11]);

// Array.from()声明一个26个字母的数组
const chars = Array.from(new Array(26), (value, index) => {
  return String.fromCharPoint(index + 65);
});
```

### 2. 数组特性

- 动态扩容：自动调整大小
- 稀疏数组：空槽位在迭代时会被跳过
- 混合类型：可存储任意数据类型
- 类对象特性：具有 length 属性和数字索引

## 二、数组方法

### 1. 静态方法

```javascript
Array.of(1, 2, 3); // [1, 2, 3]
Array.from("hello"); // ['h', 'e', 'l', 'l', 'o']
Array.isArray([]); // true
```

### 2. 实例方法

```javascript
// 遍历方法
arr.forEach((item, index) => {});
arr.map((item) => item * 2);
arr.filter((item) => item > 2);
// 返回一个新数组，包含原数组arr 满足筛选条件的元素

// 查找方法
arr.find((item) => item === 3);
// 找到第一个满足条件的元素，返回该元素，找不到返回 undefined
arr.some((item) => item > 3);
// 有一个满足条件则返回 true
arr.every((item) => item > 0);
// 所有满足条件则返回 true
// 操作方法
arr.concat([4, 5, 6], [7, 8, 9]);
// 返回一个新数组，包含原数组arr 和 concat() 参数中的元素
// 传入[2,3,4] ,会返回 [1,2,3,4,7,8,9,...arr];
// 原数组不变
arr.slice(1, 3);
// 返回一个新数组，包含原数组arr 的 索引1 到3的元素
// 原数组不变
arr.splice(1, 0, "a", "b");
// 删除原数组arr 的索引1的元素，并返回被删除的元素，并插入 "a" 和 "b"
```

## 三、高级用法

### 1. 迭代器方法

```javascript
for (let item of arr) {
} // 值迭代
for (let [index, item] of arr.entries()) {
} // 索引和值
```

### 2. Reduce 高级应用

```javascript
// 求和
[1, 2, 3, 4].reduce((sum, num) => sum + num, 0);
// 这里传入两个参数 callbackFn 和 initialValue
// callbackFn(accumulator, currentValue)
// accumulator 累加器，初始值为 initialValue，默认为数组的第一个元素。
// 数组转对象
["a", "b"].reduce((obj, key, i) => {
  obj[key] = i;
  return obj;
}, {});

// 函数组合
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);
```

<!-- 动手实现一下 -->

```js
Array.prototype.myReduce = function (callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function");
  }

  const array = this;
  const length = array.length;

  // 处理空数组无初始值的情况
  if (length === 0 && initialValue === undefined) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let accumulator;
  let startIndex;

  // 设置初始累加值
  if (initialValue !== undefined) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    accumulator = array[0];
    startIndex = 1;
  }

  // 遍历数组执行回调
  for (let i = startIndex; i < length; i++) {
    if (i in array) {
      // 跳过空位（稀疏数组）
      accumulator = callback(accumulator, array[i], i, array);
    }
  }

  return accumulator;
};
```

## 四、性能优化

1. 避免稀疏数组
2. 预分配大数组长度
3. 选择合适遍历方法：
   - for 循环：最高性能
   - forEach：平衡可读性和性能
   - 高阶函数：代码简洁但性能稍低

## 五、常见问题

1. 稀疏数组陷阱：

```javascript
const arr = new Array(5);
// 因为里面是空的的插槽
arr.forEach((item) => console.log(item)); // 不会执行
```

2. 浅拷贝问题：

````javascript
const arr1 = [{ a: 1 }];
const copy1 = [...arr1];
copy1[0].a = 2; // 原数组也会被修改
console.log(arr1);
console.log(copy1);
// ```
// 运行这段代码，会输出：
// [ { a: 2 } ]
// [ { a: 2 } ]
// ```

const arr2 = [{ a: 1 }];
const copy2 = structuredClone(arr2);
copy2[0].a = 3;

console.log(arr2);
console.log(copy2);
// ```
// [ { a: 1 } ]
// [ { a: 3 } ]
// 这是因为 `structuredClone` 函数会创建一个新对象，并复制对象的所有属性。因此，修改 `copy2` 对象不会影响 `arr2` 对象。
// ```
````

3. 数组判断：

```javascript
typeof [] === "object"; // true
Array.isArray([]); // 正确判断方法
```

## 六、ES6+新特性

1. 扩展运算符：

```javascript
const newArr = [...arr, 4, 5, 6];
```

2. 解构赋值：

```javascript
const [first, ...rest] = [1, 2, 3, 4];
console.log(first, rest);
// 输出1 [ 2, 3, 4 ]
let [a, b] = [1, 2];
[a, a, b, a] = [1, 2, 3, 4];

console.log([a, b]);
// 输出[4, 3];
// 解构赋值从左到右依次执行：

// 第一个a：用数组右侧第一个值 1 赋值 → a = 1

// 第二个a：用右侧第二个值 2 赋值 → a = 2（覆盖之前的值）

// b：用右侧第三个值 3 赋值 → b = 3

// 第三个a：用右侧第四个值 4 赋值 → a = 4（再次覆盖）
```

3. Array.prototype.includes：

```javascript
[1, 2, 3].includes(2); // true
// 线性查找 空槽 会被当做undfined
// 这里使用 SameValueZero 比较 NaN = NaN
// 使用 Set（const set = new Set([1, 2, 3]); set.has(2);），时间复杂度 O(1)。
```

4. 扁平化方法：
   arr.flat([depth])
   参数：
   depth（可选）：指定要提取嵌套数组的结构深度，默认值为 1。
   flat() 会自动移除数组中的空位（empty 值）

```javascript
const FF = [1, "a", [2]].flat(); // 输出: [1, "a", 2]

console.log(FF);
// 输出: [1, "a", 2]
const FFF = [
  1,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  "a",
  [2],
  {
    a: 1,
    b: {
      a: 2,
    },
  },
].flat(2);
console.log(FFF);
// 输出： [ 1, 'a', 2, { a: 1, b: { a: 2 } } ]

// flat() 会自动移除数组中的空位（empty 值）
```

```js
自己简单实现;
function flatten(arr, depth = 1) {
  return depth > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val),
        []
      )
    : arr.slice();
}

// 使用示例
flatten([1, [2, [3]]], 2); // 输出: [1, 2, 3]
```

本文全面总结了 JavaScript 数组的核心知识点和最佳实践，可作为日常开发的参考指南。
