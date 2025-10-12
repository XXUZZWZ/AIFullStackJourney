# TypeScript never 类型详解

## 什么是 never 类型？

`never` 是 TypeScript 中的一种特殊类型，表示**永远不会发生**的值的类型。它通常用于以下场景：

- 函数永远不会正常返回（抛出错误或无限循环）
- 类型系统中表示不可能的情况
- 类型保护中的详尽性检查

## 基本语法和用法

### 1. 永远不会返回的函数

```typescript
// 抛出错误的函数
function throwError(message: string): never {
  throw new Error(message);
}

// 无限循环的函数
function infiniteLoop(): never {
  while (true) {
    console.log('Looping forever...');
  }
}
```

### 2. never 的类型检测

```typescript
type IsNever<T> = [T] extends [never] ? true : false;

type Test1 = IsNever<never>;        // true
type Test2 = IsNever<string>;       // false
type Test3 = IsNever<number | never>; // false
```

## never 在类型系统中的行为

### 1. 在联合类型中

`never` 在联合类型中会被自动忽略：

```typescript
type Union1 = string | never;           // string
type Union2 = number | never | boolean; // number | boolean
type Union3 = never | never;            // never
```

### 2. 在交叉类型中

不可能的类型组合会产生 `never`：

```typescript
type Intersection1 = string & number;   // never
type Intersection2 = { a: number } & { a: string }; // never
```

### 3. 数组中的 never

```typescript
type EmptyArray = never[];  // 空数组类型
const arr: EmptyArray = []; // 只能是空数组
```

## 实际应用场景

### 1. 详尽性检查（Exhaustiveness Checking）

这是 `never` 类型最重要的应用之一：

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; sideLength: number }
  | { kind: 'triangle'; base: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default:
      // 如果 Shape 类型添加了新成员但这里没处理，TypeScript 会报错
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

### 2. 类型过滤

使用条件类型从联合类型中过滤掉某些类型：

```typescript
// 过滤掉 null 和 undefined
type NonNullable<T> = T extends null | undefined ? never : T;
type Result = NonNullable<string | number | null | undefined>; // string | number

// 提取字符串类型
type ExtractString<T> = T extends string ? T : never;
type OnlyStrings = ExtractString<string | number | boolean>; // string

// 排除特定类型
type Diff<T, U> = T extends U ? never : T;
type Filtered = Diff<'a' | 'b' | 'c', 'b'>; // 'a' | 'c'
```

### 3. 属性排除

从对象类型中排除特定属性：

```typescript
type RemoveKindField<T> = {
  [K in keyof T as K extends 'kind' ? never : K]: T[K];
};

type Circle = { kind: 'circle'; radius: number };
type WithoutKind = RemoveKindField<Circle>; // { radius: number }
```

### 4. 类型保护

```typescript
function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

function processValue(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  } else {
    // 这里的 value 类型应该是 never
    assertNever(value);
  }
}
```

## never 与 void 的区别

理解 `never` 和 `void` 的区别非常重要：

| 特性 | `void` | `never` |
|------|--------|---------|
| 返回值 | 函数正常结束，返回 `undefined` | 函数永远不会正常结束 |
| 使用场景 | 函数没有返回值 | 抛出错误、无限循环 |
| 类型兼容性 | 可以赋值给 `void` | 不能赋值给其他类型 |
| 联合类型 | 保留在联合类型中 | 从联合类型中移除 |

```typescript
function returnsVoid(): void {
  console.log('返回 void');
  // 隐式返回 undefined
}

function returnsNever(): never {
  throw new Error('永远不会返回');
  // 函数永远不会正常结束
}

// void 可以赋值给 void
let v: void = returnsVoid();

// never 不能赋值给其他类型
// let n: string = returnsNever(); // 错误！
```

## 高级用法

### 1. 递归类型中的 never

```typescript
// 深度只读类型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};
```

### 2. 函数参数中的 never

```typescript
type FunctionWithNever = (arg: never) => void;
// 这个函数无法被调用，因为没有值可以赋给 never 类型
```

### 3. 条件类型中的分布式特性

```typescript
// 当 T 是联合类型时，条件类型会分布到每个成员上
type ToArray<T> = T extends any ? T[] : never;
type StringArray = ToArray<string | number>; // string[] | number[]
```

## 常见误区

### 1. 不要混淆 never 和 void

```typescript
// 错误：这个函数实际上会返回 undefined
function wrongNever(): never {
  console.log('This is wrong');
  // 这里应该抛出错误或无限循环
}

// 正确：使用 void
function correctVoid(): void {
  console.log('This is correct');
}
```

### 2. 注意 never 在条件类型中的行为

```typescript
// 注意：never 在条件类型中可能会产生意外的结果
type Test<T> = T extends never ? true : false;
type Result1 = Test<never>; // never (!)
type Result2 = Test<string>; // false

// 正确的写法：使用元组包装
type CorrectTest<T> = [T] extends [never] ? true : false;
type CorrectResult1 = CorrectTest<never>; // true
type CorrectResult2 = CorrectTest<string>; // false
```

## 最佳实践

1. **使用 never 进行详尽性检查**：在 switch 语句的 default 分支中使用 never 确保所有情况都被处理
2. **类型过滤时使用 never**：在条件类型中使用 never 来过滤掉不需要的类型
3. **避免误用**：不要在不应该使用 never 的地方使用它
4. **理解类型系统**：深入理解 never 在类型系统中的行为

## 总结

`never` 类型是 TypeScript 类型系统中一个强大但容易被误解的特性。正确理解和使用 `never` 可以帮助你：

- 编写更安全的代码
- 进行编译时的详尽性检查
- 创建更精确的类型定义
- 避免运行时错误

通过掌握 `never` 类型，你可以更好地利用 TypeScript 的类型系统来编写健壮、可维护的代码。