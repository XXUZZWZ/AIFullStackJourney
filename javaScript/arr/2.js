// 满足不同类型值的需求
// 静态方法，不需要实例化
const arr = Array.of(1, 2, undefined, "你爸爸", { name: "小王", age: 18 });
// console.log(arr);
//
const arr1 = Array.from(new Array(26), (value, index) => {
  return String.fromCodePoint(65 + 32 + index);
});
// arr.concat([4, 5, 6]);
console.log(arr.slice(1, 2));
console.log(arr);
arr.splice(1, 0, "a", "b");
console.log(arr);

// console.log(arr.concat([4, 5, 6], [{ name: "小王", age: 18 }], [[1, 2, 3]]));
