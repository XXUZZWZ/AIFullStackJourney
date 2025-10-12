// 类型推断机制 指 编译器 根据变量或表达式的初始值 或上下文自动推导出类型 无需显式说明
// as 类型断言 告诉编译器 我知道这个变量的类型 你不要报错

// 1. 类型推断示例
function sum(a: number, b: number) {
  return a + b; // TypeScript 推断返回类型为 number
}

// 2. ReturnType 工具类型 - 获取函数返回类型
type SumReturn = ReturnType<typeof sum>; // number

// 3. 变量类型推断
let x = 10; // 推断为 number
let y = "hello"; // 推断为 string
let z = true; // 推断为 boolean

// 4. 对象类型推断
const person = {
  name: "Alice",
  age: 30,
  isStudent: false
}; // 推断为 { name: string; age: number; isStudent: boolean }

// 5. 数组类型推断
const numbers = [1, 2, 3]; // 推断为 number[]
const mixed = [1, "hello", true]; // 推断为 (number | string | boolean)[]

// 6. 函数参数类型推断
const multiply = (a: number, b: number) => a * b; // 推断返回类型为 number

// 7. 类型断言示例
let someValue: any = "this is a string";
let strLength1: number = (someValue as string).length; // 类型断言
let strLength2: number = (<string>someValue).length; // 另一种语法（JSX 中不可用）

// 8. 非空断言
function getElement(): HTMLElement | null {
  return document.getElementById("myElement");
}

const element = getElement()!; // 非空断言，告诉编译器这个值不会是 null

// 9. const 断言
const colors = ["red", "green", "blue"] as const; // 推断为 readonly ["red", "green", "blue"]

// 10. 上下文类型推断
window.addEventListener("click", (event) => {
  // event 被推断为 MouseEvent
  console.log(event.clientX, event.clientY);
});

// 11. 更复杂的类型推断示例
function processArray<T>(arr: T[]): T[] {
  return arr.map(item => item);
}

const processed = processArray([1, 2, 3]); // 推断 T 为 number

// 12. 条件类型中的类型推断
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type StringType = UnpackPromise<Promise<string>>; // string
type NumberType = UnpackPromise<number>; // number

// 13. 类型推断的限制
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

const stringArray = createArray(3, "hello"); // string[]
const numberArray = createArray(3, 42); // number[]

// 14. 类型推断与泛型约束
function mergeObjects<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = mergeObjects({ a: 1 }, { b: 2 }); // 推断为 { a: number } & { b: number }

// 15. 类型推断在实际项目中的应用
interface User {
  id: number;
  name: string;
  email: string;
}

// TypeScript 会推断 users 为 User[]
const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" }
];

// 自动推断 map 返回类型
const userNames = users.map(user => user.name); // string[]

// 测试代码
console.log(sum(5, 3)); // 8
console.log(person.name); // "Alice"
console.log(numbers.length); // 3
console.log(multiply(4, 5)); // 20 