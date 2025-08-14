const obj = { a: 1, b: 3 };
// 常见的数据结构 大型语言都内置
// HashMap 字典 在 O(1) 时间查询
const target = new Map(); // 实例化 es6 新的数据类型 数据结构
target.set("a", 3);

console.log(target.get("c"));
target.set(obj, 999);
// 任何对象都可以作为 key 和JSON 的区别
// Map 在存储键值对时，直接使用键的引用地址作为标识符。例如：
console.log(target.get(obj));

let obj2 = { name: "实用性" };
const target2 = new WeakMap();
target2.set(obj2, "code 秘密花园");
console.log(target2.get(obj2));
obj2 = null;

console.log(target2.length);
