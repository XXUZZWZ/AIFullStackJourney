# Array 的高级考点

- 怎么认识数组
  - 可遍历的对象
- [] 数组字面量声明
-
- new Array()
  - 类似于 C++,固定大小的分配。
  - v8 引擎对 arr 设计
  - 灵活扩展，不限类型
  - 还有 hash 的特性
  - 稀疏数组（Sparse Array）特性,空槽位在迭代时会被跳过
- new Array(length)
  - new Array(5) 创建的是一个只有长度没有元素的空槽位数组，而非包含 undefined 的数组。
  - 空槽位在迭代时会被跳过（例如 forEach(), map() 会忽略空槽位）。
- new Array(length).fill(undefined) 创建的是一个包含 undefined 一样的内容的数组。

- [] 数组字面量

  - ['宗馥丽',"宗继昌","宗友","宗杰里",...arr];

- 静态方法
  - Array.from() //转换(类数组，填充计算) Array.from([1,2,3],x=>x+1) //[2,3,4] 已经有数据
    - 初始化一个 26 字母表 Array.from(26,x=>String.fromCharCode(x+65))
  - Array.of(1,{a:1},"a")
  - Array.isArray()
