// for   of
const arr = [1, 2, 3, 4, 5];

// 比计数循环好理解
for (let i of arr) {
  console.log(i);
}
// for item  of arr   item 怎么拿到index
for (let [index, item] of arr.entries()) {
  // 每一项都是数组，第一项是key,第二项是值
  console.log(index + 1, item);
}
console.log(arr.entries());
