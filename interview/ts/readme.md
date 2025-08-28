# Typescript

- 为啥不用 ts?
  - 第一个项目专注于 react 全家桶 ，但是对常见的 React + ts 开发。
  - next.js + ts

## 对 ts 泛型的理解

- 泛型是类型的函数，T 是占位符，接收参数并返回新类型

- 泛型是在类型层面引入参数化机制，他的核心目标是编译期间提供类型安全，同时保持复用性

````md
### 对 TS 泛型的理解（精要）

- **是什么**：泛型让函数、接口、类型别名、类在“保留类型信息”的同时保持“复用性”。写一次逻辑，适配多种类型，并由编译器在调用处进行类型检查与推断。

- **基本用法**

```ts
function identity<T>(value: T): T {
  return value;
}
identity<number>(1); // 显式传入
identity("hi"); // 自动推断 T 为 string

interface Box<T> {
  value: T;
}
const a: Box<number> = { value: 1 };

type List<T> = Array<T>;
const nums: List<number> = [1, 2, 3];
```

- **多类型参数与约束**

```ts
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // K 被约束为 T 的合法键
}

function len<T extends { length: number }>(x: T) {
  return x.length;
}
```

- **默认类型参数**

```ts
interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

function parseJSON<T = unknown>(s: string): T {
  return JSON.parse(s) as T;
}
```

- **结合条件类型与 infer（高阶）**

```ts
// 提取函数返回值
type Return<T> = T extends (...args: any[]) => infer R ? R : never;

// 丢弃元组第一个元素
type DropFirst<T extends any[]> = T extends [any, ...infer R] ? R : never;

// 分布式条件类型（对联合类型逐个分发）
type Nullable<T> = T | null | undefined;
type NonNullable<T> = T extends null | undefined ? never : T;
```

- **实用工具类型（都基于泛型）**

```ts
type Partial<T> = { [K in keyof T]?: T[K] };
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Record<K extends PropertyKey, T> = { [P in K]: T };
```

- **泛型类与构造签名**

```ts
class Store<T> {
  private data: T[] = [];
  add(item: T) {
    this.data.push(item);
  }
  all(): T[] {
    return this.data;
  }
}

function make<T>(Ctor: new (...args: any[]) => T): T {
  return new Ctor();
}
```

- **常见坑与最佳实践**

  - **T 在运行时被擦除**：不能用 `typeof T`、`instanceof T`；如需实例化，传入构造函数约束。
  - **any vs unknown**：不确定类型优先用 `unknown`；必要时用泛型约束缩小。
  - **过度显式**：能让编译器推断就让它推断，减少噪音。
  - **窄化与约束**：对键访问、结构要求务必用 `extends` 与 `keyof` 保证安全。

- **小型实战片段**

```ts
type Api<T> = Promise<{ code: number; data: T; msg: string }>;

async function request<T>(url: string): Api<T> {
  const res = await fetch(url);
  return res.json();
}

type User = { id: string; name: string };
const user = await request<User>("/api/user"); // data 强类型为 User
```
````
