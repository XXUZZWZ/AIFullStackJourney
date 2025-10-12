// 1. never 类型表示永远不会有返回值的函数
function error(): never {
  throw new Error("报错")
}

function loop(): never {
  while (true) {
    console.log('环')
  }
}

// 2. never 类型检测
// type 常用于类型别名
type isNever<T> = [T] extends [never] ? true : false;

type Test1 = isNever<never>; // true
type Test2 = isNever<string>; // false

// 3. never 在联合类型中会被忽略
type Union1 = string | never; // string
type Union2 = number | never | boolean; // number | boolean

// 4. never 用于详尽性检查
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
      // 如果 Shape 添加了新类型但这里没处理，TypeScript 会报错
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}

// 5. never 用于过滤类型
type NonNullable<T> = T extends null | undefined ? never : T;
type Result = NonNullable<string | number | null | undefined>; // string | number

// 6. never 用于排除某些属性
type RemoveKindField<T> = {
  [K in keyof T as K extends 'kind' ? never : K]: T[K];
};

type Circle = { kind: 'circle'; radius: number };
type WithoutKind = RemoveKindField<Circle>; // { radius: number }

// 7. 函数参数中的 never（函数不可调用）
type FunctionWithNever = (arg: never) => void;
// 无法调用这个函数，因为没有值可以赋给 never 类型

// 8. 交叉类型产生 never
type Intersection = string & number; // never（不可能既是 string 又是 number）

// 9. 数组中的 never
type EmptyArray = never[]; // 空数组类型
const arr: EmptyArray = []; // 只能是空数组

// 10. 条件类型中的 never
type ExtractString<T> = T extends string ? T : never;
type OnlyStrings = ExtractString<string | number | boolean>; // string

// 11. 实际使用示例
function processValue(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  } else {
    // 这里的 value 类型应该是 never
    const unreachable: never = value;
    throw new Error(`Unexpected value: ${unreachable}`);
  }
}

// 12. never 与 void 的区别
function returnsVoid(): void {
  console.log('返回 void');
  // 可以正常返回（隐式返回 undefined）
}

function returnsNever(): never {
  throw new Error('永远不会返回');
  // 函数永远不会正常结束
}

// 13. 使用 never 进行类型保护
function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

// 14. 在泛型中使用 never
type Diff<T, U> = T extends U ? never : T;
type Filtered = Diff<'a' | 'b' | 'c', 'b'>; // 'a' | 'c'

// 15. 递归类型中的 never
// 用于限制递归深度或作为终止条件
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// 测试示例
const testShape: Shape = { kind: 'circle', radius: 5 };
console.log(getArea(testShape));

const testValue: string | number = 'hello';
processValue(testValue);