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
