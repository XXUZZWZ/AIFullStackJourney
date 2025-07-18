// {}key : value O(1) HashMap  Map
// 第一种重要数据结构
// 第二种重要数据结构 链表 队列 栈
// 其他语言有长度限定，js没有，自动扩容
// 可以在初始化时声明大小，但是后续会动态扩容

let arr = new Array(4, 5, 9);
console.log(Object.keys(arr));
arr[10] = undefined;
console.log(arr);
//[ 4, 5, 9, <7 empty items>, undefined ]
// 输出空插槽 empty items
for (let key in arr) {
  console.log(key);
}
// 遵循对象规范
for (let key of arr) {
  console.log(key);
}
// 遵循数组规范
