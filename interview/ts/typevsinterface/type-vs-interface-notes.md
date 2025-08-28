## Type vs Interface 学习笔记

### 核心结论

- **共同点**: 都能声明类型，约束对象/函数的结构。
- **使用倾向**: 可用 interface 描述对象契约时优先 interface；涉及联合/元组/基础类型别名或复杂类型运算时用 type。
- **扩展方式**: interface 用 `extends`；type 用交叉类型 `&`。
- **合并行为**: 同名 interface 自动合并；type 不能重复声明。

### 相同点

```ts
interface User {
  name: string;
  age: number;
}
type UserProtocol = { name: string } & { age: number };
```

### 主要区别

- 扩展与组合：

```ts
// interface 继承
interface Person {
  name: string;
}
interface Employee extends Person {
  job: string;
}

// type 交叉
type PersonType = { name: string };
type EmployeeType = PersonType & { job: string };
```

- 类型能力范围：

```ts
type ID = string | number; // 联合类型
type Point = [number, number, string]; // 元组类型
// interface 不能直接表示上述两种
```

- 函数类型声明：

```ts
interface AddFn {
  (a: number, b: number): number;
}
type AddType = (a: number, b: number) => number;
```

- 类型别名：

```ts
type NumberOther = number;
let a: NumberOther = 333;
```

- 声明合并：

```ts
interface Animal {
  name: string;
}
interface Animal {
  age: number;
} // 合并为 { name; age }

// type 不支持重复声明
// type AnimalType = { name: string }
// type AnimalType = { age: number } // ❌ 冲突
```

### 何时用哪一个

- **使用 interface**：

  - 面向对象契约（对象、类、函数）
  - 需要同名声明合并或为第三方类型做增强
  - 搭配 `implements`/`extends` 更直观

- **使用 type**：
  - 需要联合、交叉、元组、条件类型、映射类型等复杂组合
  - 需要基础类型别名（如 `type ID = string | number`）
  - 承载工具类型（如 `Partial<T>` 等）计算结果

### 易错点/注意

- 同名合并只适用于 interface。
- interface 不能直接表示联合/元组/基础类型别名。
- 扩展结构两者皆可（extends vs `&`）；库增强优先 interface。

### 速查

- **interface 特长**：声明合并、继承、契约清晰、可增强。
- **type 特长**：联合/交叉/元组/别名、复杂类型运算、工具类型结果。
