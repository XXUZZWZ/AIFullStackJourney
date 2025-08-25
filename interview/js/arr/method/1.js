/**
 * splice（删/插/替换）
语法：splice(start, deleteCount, ...items)；
返回被删除元素数组；会修改原数组；
O(n)。
场景：列表中间插入/删除、重排。
 */

const a = [1, 2, 3, 4];
console.log(a);
a.splice(1, 2); // 删除，从索引1删2个 → a=[1,4]
console.log(a);
a.splice(1, 0, 7, 8); // 插入 → a=[1,7,8,4]
console.log(a);
a.splice(2, 1, 9); // 替换 → a=[1,7,9,4]
console.log(a);
// 如果不修改呢？怎么做 splice 不能用？？？
console.log("--------------------------------");
const b = [1, 2, 3, 4];
console.log(b);
console.log(b.slice(1, 4));
console.log(b);
console.log(b.slice(-2));
console.log(b.slice(1, 3).concat(b.slice(4)));
const clone = a.slice(); // 浅拷贝
