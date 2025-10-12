# ts

- unknow any never
- any
  - 万能类型，但是不安全，给变量关闭了类型检查，你可以对他做任何操作，回归 js,放弃编译时检查
- unknown
  - 不知道变量类型，但不同于 any 不能直接使用要做类型断言或收窄
- never 永远不会出现的类型
  - 返回报错
  - 没有返回的函数
  - 类型穷尽检查
- ts 内置的高级类型 Pick Omit
  - 后端返回接口数据比较多，前端只需要使用一部分数据，这是后可以使用 pick 来提取接口的部分属性

## unknown / any / never 要点

- **unknown（未知但安全）**：可接收任意类型，但使用前必须类型收窄或断言。
- **any（放弃检查）**：对其进行的任何操作都不会有类型错误提示，但最不安全。
- **never（不可能的值）**：表示永不发生的类型；可用于穷尽检查和永不返回的函数。

### 场景与示例

```ts
// unknown：先收窄再用
let u: unknown = JSON.parse(input);
if (typeof u === "string") {
  console.log(u.toUpperCase());
}
// 或断言
console.log((u as { id: number }).id);

// any：快速但危险
let a: any = getValue();
a.foo.bar().baz; // 编译不报错，运行期易崩

// never：永不返回或不可能到达
function fail(msg: string): never {
  throw new Error(msg);
}

type Shape = { kind: "circle"; r: number } | { kind: "square"; a: number };

function area(s: Shape) {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "square":
      return s.a * s.a;
    default:
      const _exhaustive: never = s; // 保证穷尽
      return _exhaustive;
  }
}
```

### 记忆三句话

- **unknown**：能接一切，不能直接用（先收窄/断言）。
- **any**：能接能用，但不安全（慎用、限域）。
- **never**：能赋给任意类型，但任何类型不能赋给它。
