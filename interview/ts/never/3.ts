// import { timeStamp } from "console"; // 这个导入可能不需要

// 1. 基础泛型函数
function fetchData<T>(data: T) {
  return {
    data,
    timestamp: Date.now()
  }
}

// 2. ReturnType 与泛型函数
type Result = ReturnType<typeof fetchData<string>>; // { data: string; timestamp: number }

// 3. 泛型约束示例
interface HasId {
  id: number;
}

function processWithId<T extends HasId>(item: T) {
  return {
    ...item,
    processedAt: new Date()
  }
}

type ProcessedResult = ReturnType<typeof processWithId<{ id: number; name: string }>>;

// 4. 多个泛型参数
function createPair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

type PairType = ReturnType<typeof createPair<string, number>>; // [string, number]

// 5. 泛型默认值
function createConfig<T = string>(value: T) {
  return {
    value,
    createdAt: Date.now()
  }
}

type DefaultConfig = ReturnType<typeof createConfig>; // { value: string; createdAt: number }
type NumberConfig = ReturnType<typeof createConfig<number>>; // { value: number; createdAt: number }

// 6. 泛型与条件类型
function transformValue<T>(value: T): T extends string ? string : T extends number ? number : T {
  if (typeof value === 'string') {
    return value.toUpperCase() as any;
  }
  return value as any;
}

type StringTransform = ReturnType<typeof transformValue<string>>; // string
type NumberTransform = ReturnType<typeof transformValue<number>>; // number

// 7. 泛型函数重载
function parseInput<T extends string | number>(input: T): T extends string ? string : number;
function parseInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim();
  }
  return Number(input);
}

type StringParse = ReturnType<typeof parseInput<string>>; // string
type NumberParse = ReturnType<typeof parseInput<number>>; // number

// 8. 泛型与异步函数
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

type ApiResponse = ReturnType<typeof fetchApi<{ data: string }>>; // Promise<{ data: string }>

// 9. 泛型类方法
class DataProcessor<T> {
  process(data: T) {
    return {
      original: data,
      processed: true,
      timestamp: Date.now()
    };
  }
}

const processor = new DataProcessor<string>();
type ProcessedData = ReturnType<typeof processor.process>; // { original: string; processed: boolean; timestamp: number }

// 10. 泛型与映射类型
function createRecord<K extends string, V>(keys: K[], value: V): Record<K, V> {
  const result = {} as Record<K, V>;
  keys.forEach(key => {
    result[key] = value;
  });
  return result;
}

type RecordType = ReturnType<typeof createRecord<['name', 'age'], string>>; // Record<"name" | "age", string>

// 11. 泛型与联合类型
function handleUnion<T extends string | number>(value: T): T {
  return value;
}

type UnionResult1 = ReturnType<typeof handleUnion<string>>; // string
type UnionResult2 = ReturnType<typeof handleUnion<number>>; // number

// 12. 泛型与类型推断
function inferType<T>(value: T) {
  return {
    value,
    type: typeof value
  };
}

type InferredType = ReturnType<typeof inferType<string>>; // { value: string; type: "string" }

// 13. 实际应用示例
interface User {
  id: number;
  name: string;
  email: string;
}

function createUserResponse<T extends User>(user: T) {
  return {
    success: true,
    data: user,
    timestamp: Date.now()
  };
}

type UserResponse = ReturnType<typeof createUserResponse<User>>;
// { success: boolean; data: User; timestamp: number }

// 14. 泛型与错误处理
function tryCatch<T>(fn: () => T): { success: true; data: T } | { success: false; error: Error } {
  try {
    return { success: true, data: fn() };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

type TryCatchResult = ReturnType<typeof tryCatch<() => string>>;
// { success: true; data: string } | { success: false; error: Error }

// 15. 泛型与高阶函数
function withLogging<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: Parameters<T>) => {
    console.log(`Calling function with args:`, args);
    const result = fn(...args);
    console.log(`Function returned:`, result);
    return result;
  }) as T;
}

const loggedFetchData = withLogging(fetchData);
type LoggedResult = ReturnType<typeof loggedFetchData<string>>;

// 测试代码
const testData = fetchData("hello");
console.log(testData); // { data: "hello", timestamp: 1234567890 }

const testPair = createPair("age", 25);
console.log(testPair); // ["age", 25]

const testConfig = createConfig(42);
console.log(testConfig); // { value: 42, createdAt: 1234567890 }