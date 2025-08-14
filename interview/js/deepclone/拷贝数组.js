const arr = [1, 2, 3, 4, 5];
const newArr = [...arr];
console.log(newArr === arr);

const newArr2 = arr.slice();
console.log(newArr2 === arr);

const arr3 = [
  [1, 2],
  [3, 4],
  [5, 6, [222, [333, [444, [555, [666, [777, [888, [999]]]]]]]]],
];

let arr4 = arr3.slice();
/**
 * slice() 方法返回一个新的数组对象，这一对象是一个由 start 和 end 决定的原数组的浅拷贝（包括 start，不包括 end），其中 start 和 end 代表了数组元素的索引。原始数组不会被改变。
 */
console.log(arr4[1] === arr3[1]);

arr4 = arr3.concat();
/**
 * 数组和/或值，将被合并到一个新的数组中。如果省略了所有 valueN 参数，则 concat 会返回调用此方法的现存数组的一个
 * 浅拷贝。
 */
