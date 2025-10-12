# TypeScript 类型推断与类型断言详解

## 什么是类型推断？

类型推断（Type Inference）是 TypeScript 编译器根据变量或表达式的初始值或上下文自动推导出类型的能力，无需显式声明类型。

## 类型推断的类型

### 1. 基础类型推断

```typescript
// 变量声明时的类型推断
let x = 10;                    // 推断为 number
let y = "hello";              // 推断为 string
let z = true;                  // 推断为 boolean

// 数组类型推断
const numbers = [1, 2, 3];     // 推断为 number[]
const mixed = [1, "hello"];    // 推断为 (number | string)[]
```

### 2. 对象类型推断

```typescript
const person = {
  name: "Alice",
  age: 30,
  isStudent: false
};
// 推断为: { name: string; age: number; isStudent: boolean }
```

### 3. 函数类型推断

```typescript
// 函数返回类型推断
function sum(a: number, b: number) {
  return a + b; // 推断返回类型为 number
}

// 箭头函数类型推断
const multiply = (a: number, b: number) => a * b; // 推断返回类型为 number
```

### 4. 上下文类型推断

```typescript
// 事件处理器的参数类型推断
window.addEventListener("click", (event) => {
  // event 被推断为 MouseEvent
  console.log(event.clientX, event.clientY);
});

// 数组方法的回调函数
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2); // num 推断为 number
```

## ReturnType 工具类型

`ReturnType` 是 TypeScript 内置的工具类型，用于获取函数的返回类型。

```typescript
function sum(a: number, b: number) {
  return a + b;
}

type SumReturn = ReturnType<typeof sum>; // number

// 实际应用
function getUser() {
  return { id: 1, name: "Alice" };
}

type User = ReturnType<typeof getUser>; // { id: number; name: string }
```

## 类型断言（Type Assertion）

类型断言告诉编译器："我知道这个变量的类型，你不要报错"。

### 1. 基本语法

```typescript
let someValue: any = "this is a string";

// 语法1: as 语法
let strLength1: number = (someValue as string).length;

// 语法2: 尖括号语法（JSX 中不可用）
let strLength2: number = (<string>someValue).length;
```

### 2. 非空断言

```typescript
function getElement(): HTMLElement | null {
  return document.getElementById("myElement");
}

const element = getElement()!; // 非空断言，告诉编译器这个值不会是 null
element.style.display = "none"; // 可以直接使用
```

### 3. const 断言

```typescript
// 普通数组推断
const colors1 = ["red", "green", "blue"]; // string[]

// const 断言
const colors2 = ["red", "green", "blue"] as const; // readonly ["red", "green", "blue"]

// 对象 const 断言
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const;
// 推断为: { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000 }
```

## 高级类型推断

### 1. 泛型中的类型推断

```typescript
function processArray<T>(arr: T[]): T[] {
  return arr.map(item => item);
}

const processed = processArray([1, 2, 3]); // 推断 T 为 number
const strings = processArray(["a", "b"]);  // 推断 T 为 string
```

### 2. 条件类型中的 infer 关键字

```typescript
// 提取 Promise 的泛型类型
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type StringType = UnpackPromise<Promise<string>>; // string
type NumberType = UnpackPromise<number>;          // number

// 提取数组元素类型
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type ElementType = ArrayElement<string[]>; // string
```

### 3. 泛型约束与类型推断

```typescript
function mergeObjects<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = mergeObjects({ a: 1 }, { b: 2 });
// 推断为: { a: number } & { b: number }
```

## 类型推断的限制

### 1. 需要显式类型声明的场景

```typescript
// 空数组需要显式类型
const emptyArray = []; // any[]
const numbers: number[] = []; // 需要显式声明

// 函数参数通常需要显式类型
function greet(name) { // 参数 name 推断为 any
  return `Hello, ${name}`;
}
```

### 2. 泛型推断的限制

```typescript
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

// 需要提供足够的上下文
const arr1 = createArray(3, "hello"); // string[]
const arr2 = createArray(3, 42);      // number[]
```

## 实际项目中的应用

### 1. API 响应类型推断

```typescript
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
```

### 2. 配置对象类型推断

```typescript
const config = {
  api: {
    baseUrl: "https://api.example.com",
    timeout: 5000
  },
  features: {
    darkMode: true,
    notifications: false
  }
} as const;

// 自动推断出完整的配置类型
```

### 3. 事件处理器的类型推断

```typescript
// React 组件中的事件处理器
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value; // 自动推断为 string
  // ...
};
```

## 最佳实践

### 1. 何时使用类型推断

- **推荐使用**：简单的变量声明、对象字面量、数组字面量
- **推荐使用**：函数返回值（除非需要特定类型）
- **推荐使用**：泛型函数的调用

### 2. 何时需要显式类型

- **需要显式**：函数参数
- **需要显式**：空数组、空对象
- **需要显式**：复杂的接口定义
- **需要显式**：公共 API 的导出类型

### 3. 类型断言的使用原则

- **谨慎使用**：只在确定类型时使用
- **避免滥用**：不要用类型断言绕过类型检查
- **优先选择**：使用类型守卫而不是类型断言
- **文档说明**：对复杂的类型断言添加注释

## 常见误区

### 1. 过度使用类型断言

```typescript
// 错误：滥用类型断言
const element = document.getElementById("myElement") as HTMLElement;

// 正确：使用类型守卫
const element = document.getElementById("myElement");
if (element) {
  // 在这里 element 是 HTMLElement
}
```

### 2. 忽略类型推断的能力

```typescript
// 错误：不必要的类型声明
const name: string = "Alice";

// 正确：让 TypeScript 推断
const name = "Alice";
```

### 3. 不理解 const 断言的作用

```typescript
// 错误：不理解 const 断言的用途
const colors = ["red", "green", "blue"] as const;
colors.push("yellow"); // 错误！数组是只读的

// 正确：理解 const 断言创建的是字面量类型
```

## 总结

类型推断和类型断言是 TypeScript 中两个强大的特性：

- **类型推断**让代码更简洁，减少冗余的类型声明
- **类型断言**在你知道比编译器更多信息时提供灵活性
- **ReturnType**等工具类型增强了类型系统的表达能力

正确使用这些特性可以让你编写出既类型安全又简洁优雅的 TypeScript 代码。