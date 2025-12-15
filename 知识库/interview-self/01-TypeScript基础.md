---
marp: true
---

# TypeScript 基础复习（接口、泛型）

> 📚 **学习重点**: 掌握 TypeScript 核心类型系统，熟练使用接口和泛型
>
> ⏱️ **建议复习时间**: 45-60分钟
>
> 🎯 **掌握程度**: 能够独立定义类型、使用泛型编写可复用代码

---

## 📑 目录

1. [TypeScript 基础类型](#typescript-基础类型)
2. [接口（Interface）](#接口interface)
3. [泛型（Generics）](#泛型generics)
4. [高级类型](#高级类型)
5. [实战应用](#实战应用)
6. [练习题](#练习题)

---

## 🔰 TypeScript 基础类型

### 基本类型注解

```typescript
// 基本类型
let name: string = "张三";
let age: number = 25;
let isStudent: boolean = true;
let hobbies: string[] = ["编程", "阅读", "运动"];

// 对象类型
let person: {
  name: string;
  age: number;
  isStudent: boolean;
} = {
  name: "李四",
  age: 30,
  isStudent: false
};

// 函数类型
const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

// 联合类型
let status: "pending" | "success" | "error" = "pending";
let id: string | number = "123";
```

### 类型别名

```typescript
// 使用 type 关键字定义类型别名
type User = {
  id: string;
  name: string;
  age: number;
  email?: string; // 可选属性
};

type Status = "pending" | "success" | "error";

// 使用类型别名
const user: User = {
  id: "1",
  name: "王五",
  age: 28
};

const currentStatus: Status = "success";
```

---

## 🎯 接口（Interface）

### 1. 基本接口定义

```typescript
// 定义用户接口
interface IUser {
  id: string;
  name: string;
  age: number;
  email?: string; // 可选属性
  readonly createdAt: Date; // 只读属性
}

// 使用接口
const user: IUser = {
  id: "1",
  name: "张三",
  age: 25,
  createdAt: new Date()
};

// user.createdAt = new Date(); // ❌ 错误：只读属性不能修改
user.email = "zhangsan@example.com"; // ✅ 正确：可选属性可以赋值
```

### 2. 接口继承

```typescript
// 基础动物接口
interface IAnimal {
  name: string;
  age: number;
}

// 狗接口继承动物接口
interface IDog extends IAnimal {
  breed: string; // 品种
  bark(): void;  // 吠叫方法
}

// 使用继承的接口
const dog: IDog = {
  name: "旺财",
  age: 3,
  breed: "柴犬",
  bark() {
    console.log(`${this.name} 在汪汪叫`);
  }
};
```

### 3. 函数类型接口

```typescript
// 定义搜索函数接口
interface ISearchFunction {
  (query: string, page: number): Promise<any[]>;
}

// 实现搜索函数
const searchUsers: ISearchFunction = async (query, page) => {
  const response = await fetch(`/api/users?q=${query}&page=${page}`);
  return response.json();
};
```

### 4. 索引签名

```typescript
// 动态属性接口
interface IDictionary {
  [key: string]: string | number;
}

const config: IDictionary = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  version: "1.0.0"
};
```

---

## 🔧 泛型（Generics）

### 1. 基本泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 使用泛型函数
const numResult = identity<number>(42);
const strResult = identity<string>("Hello TypeScript");

// 类型推导（推荐）
const autoResult = identity("TypeScript 会自动推导类型");
```

### 2. 泛型约束

```typescript
// 约束泛型必须有 length 属性
interface ILengthwise {
  length: number;
}

function logLength<T extends ILengthwise>(arg: T): void {
  console.log(`长度: ${arg.length}`);
}

logLength("Hello"); // ✅ 字符串有 length 属性
logLength([1, 2, 3]); // ✅ 数组有 length 属性
// logLength(123); // ❌ 数字没有 length 属性
```

### 3. 泛型接口

```typescript
// 泛型接口
interface IApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 用户数据类型
interface IUser {
  id: string;
  name: string;
  email: string;
}

// 使用泛型接口
async function fetchUsers(): Promise<IApiResponse<IUser[]>> {
  const response = await fetch('/api/users');
  return response.json();
}

// 文章数据类型
interface IArticle {
  id: string;
  title: string;
  content: string;
}

async function fetchArticles(): Promise<IApiResponse<IArticle[]>> {
  const response = await fetch('/api/articles');
  return response.json();
}
```

### 4. 泛型类

```typescript
// 泛型栈类
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// 使用泛型类
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);

const stringStack = new Stack<string>();
stringStack.push("Hello");
stringStack.push("World");
```

### 5. 多个泛型参数

```typescript
// 键值对泛型
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

function createKeyValuePair<K, V>(key: K, value: V): KeyValuePair<K, V> {
  return { key, value };
}

// 使用多个泛型参数
const userPair = createKeyValuePair("user1", { name: "张三", age: 25 });
const configPair = createKeyValuePair("timeout", 5000);
```

---

## 🚀 高级类型

### 1. 联合类型和交叉类型

```typescript
// 联合类型 |
type Status = "loading" | "success" | "error";
type ID = string | number;

// 交叉类型 &
interface IPerson {
  name: string;
  age: number;
}

interface IEmployee {
  employeeId: string;
  department: string;
}

type EmployeePerson = IPerson & IEmployee;

const employee: EmployeePerson = {
  name: "李四",
  age: 30,
  employeeId: "E001",
  department: "技术部"
};
```

### 2. 条件类型

```typescript
// 条件类型 T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// 实用条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

type Test3 = NonNullable<string | null>; // string
type Test4 = NonNullable<number | undefined>; // number
```

### 3. 映射类型

```typescript
// 将所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 将所有属性变为必选
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 选择特定属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 排除特定属性
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 使用示例
interface IUser {
  id: string;
  name: string;
  age: number;
  email: string;
}

type PartialUser = Partial<IUser>; // 所有属性可选
type UserBasicInfo = Pick<IUser, 'name' | 'age'>; // 只要 name 和 age
type UserWithoutEmail = Omit<IUser, 'email'>; // 排除 email
```

### 4. 工具类型

```typescript
interface IUser {
  id: string;
  name: string;
  age: number;
  email: string;
}

// Record: 创建对象类型
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

// Exclude: 排除类型
type StringOrNumber = Exclude<string | number | boolean, boolean>;

// Extract: 提取类型
type OnlyString = Extract<string | number | boolean, string>;

// ReturnType: 获取函数返回类型
function getUser() {
  return { id: "1", name: "张三" };
}

type GetUserReturn = ReturnType<typeof getUser>; // { id: string; name: string; }
```

---

## 💻 实战应用

### 1. Vue3 + TypeScript 组件示例

```vue
<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>年龄: {{ user.age }}</p>
    <p>邮箱: {{ user.email || '未设置' }}</p>
    <button @click="updateAge">增加年龄</button>
  </div>
</template>

<script setup lang="ts">
// 定义用户接口
interface IUser {
  id: string;
  name: string;
  age: number;
  email?: string;
}

// Props 类型定义
interface IProps {
  user: IUser;
  onUpdate: (user: IUser) => void;
}

const props = defineProps<IProps>();

// 更新年龄方法
const updateAge = (): void => {
  const updatedUser: IUser = {
    ...props.user,
    age: props.user.age + 1
  };
  props.onUpdate(updatedUser);
};
</script>
```

### 2. API 请求封装

```typescript
// 通用 API 响应类型
interface IApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页数据类型
interface IPaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// HTTP 客户端类
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // 泛型 GET 方法
  async get<T>(url: string): Promise<IApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${url}`);
    return response.json();
  }

  // 泛型 POST 方法
  async post<T, D>(url: string, data: D): Promise<IApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// 使用示例
const api = new HttpClient('https://api.example.com');

// 获取用户列表
async function fetchUsers(): Promise<IApiResponse<IPaginatedData<IUser>>> {
  return api.get<IPaginatedData<IUser>>('/users');
}

// 创建用户
async function createUser(userData: Omit<IUser, 'id'>): Promise<IApiResponse<IUser>> {
  return api.post<IUser, Omit<IUser, 'id'>>('/users', userData);
}
```

### 3. 状态管理（Pinia）

```typescript
// 用户状态管理
interface IUserState {
  users: IUser[];
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get<IPaginatedData<IUser>>('/users');
        this.users = response.data.items;
      } catch (error) {
        this.error = '获取用户列表失败';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: Omit<IUser, 'id'>): Promise<void> {
      try {
        const response = await api.post<IUser, Omit<IUser, 'id'>>('/users', userData);
        this.users.push(response.data);
      } catch (error) {
        this.error = '创建用户失败';
        console.error(error);
      }
    }
  }
});
```

---

## 📝 练习题

### 基础练习

1. **定义一个完整的用户管理接口系统**
   - 用户基本信息接口
   - 用户角色接口
   - API 响应接口
   - 包含增删改查的类型定义

2. **实现一个泛型栈类**
   - 支持任意类型的数据
   - 包含 push、pop、peek、isEmpty 方法
   - 添加类型约束和错误处理

3. **创建一个表单验证系统**
   - 使用泛型定义验证规则
   - 支持不同类型的表单字段
   - 返回详细的验证结果

### 进阶练习

4. **实现一个事件发布订阅系统**
   ```typescript
   // 要求实现以下接口
   interface IEventEmitter {
     on<T>(event: string, handler: (data: T) => void): void;
     emit<T>(event: string, data: T): void;
     off(event: string): void;
   }
   ```

5. **创建一个数据库查询构建器**
   ```typescript
   // 要求支持链式调用和类型安全
   interface IQueryBuilder<T> {
     select<K extends keyof T>(keys: K[]): IQueryBuilder<Pick<T, K>>;
     where<K extends keyof T>(key: K, value: T[K]): IQueryBuilder<T>;
     orderBy<K extends keyof T>(key: K, direction: 'asc' | 'desc'): IQueryBuilder<T>;
     limit(count: number): IQueryBuilder<T>;
     execute(): Promise<T[]>;
   }
   ```

### 面试题

6. **解释 TypeScript 中的 interface 和 type 的区别？**
7. **什么是泛型？为什么要使用泛型？**
8. **解释什么是类型推断，什么时候需要显式类型注解？**
9. **如何实现一个类型安全的深度只读？**
10. **什么是条件类型？请举例说明其应用场景。**

---

## 🎯 总结

### 核心要点

1. **接口（Interface）**
   - 定义对象结构和类型契约
   - 支持继承、扩展
   - 提供更好的代码提示和类型检查

2. **泛型（Generics）**
   - 提供类型安全的代码复用
   - 增强代码的灵活性和可维护性
   - 支持约束和条件类型

3. **类型系统**
   - 联合类型、交叉类型
   - 工具类型和映射类型
   - 条件类型和类型推断

### 最佳实践

- 🔸 优先使用 interface 定义对象类型，type 用于联合类型、工具类型
- 🔸 合理使用泛型，避免过度复杂化
- 🔸 利用 TypeScript 的类型推导，减少冗余的类型注解
- 🔸 为公共 API 提供完整的类型定义
- 🔸 使用严格的 TypeScript 配置，提高代码质量

### 常见错误

- ❌ 滥用 any 类型，失去类型安全
- ❌ 接口设计过于复杂，难以维护
- ❌ 泛型使用不当，导致代码可读性差
- ❌ 忽略可选属性和 null 检查

---

**📚 扩展阅读**: [TypeScript 官方文档](https://www.typescriptlang.org/docs/)

**⏰ 更新时间**: 2025-10-26