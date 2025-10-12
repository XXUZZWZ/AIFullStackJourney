# 箭头函数和普通函数的区别

## 定义与语法

- 普通函数：`function foo(a, b) { return a + b; }`
- 箭头函数：`const foo = (a, b) => a + b`
  - 只有一个参数可省略括号：`x => x * 2`
  - 返回对象字面量需加括号：`() => ({ x: 1 })`
  - 代码块体需要显式 `return`：`x => { return x * 2 }`

## this 绑定（核心差异）

- 普通函数：`this` 动态绑定，取决于调用方式（作为方法调用、`call/apply/bind`、构造调用、裸调用等）。
- 箭头函数：`this` 词法绑定，取决于定义位置，继承外层作用域的 `this`，且无法通过 `call/apply/bind` 改变。

```js
const obj = {
  id: 1,
  normal() {
    console.log(this.id);
  },
  arrow: () => {
    console.log(this && this.id);
  },
};
obj.normal(); // 1（方法调用，this 指向 obj）
obj.arrow(); // undefined（箭头继承定义处的 this，通常为全局/undefined）
```

## arguments / super / new.target

- 普通函数：拥有自己的 `arguments`、`this`、`super`、`new.target`。
- 箭头函数：没有自己的 `arguments/new.target/super/this`，均从外层作用域继承。

```js
function normal() {
  console.log(arguments.length);
}
const arrow = () => {
  /* 没有 arguments，改用剩余参数 */
};
const arrow2 = (...args) => console.log(args.length);
```

## 原型与构造能力

- 普通函数：有 `prototype`，可作为构造函数使用：`new Foo()`。
- 箭头函数：无 `prototype`，不能作为构造函数使用，`new` 会报错。

```js
function Person(name) {
  this.name = name;
}
new Person("A"); // ✅

const Person2 = (name) => {
  this.name = name;
};
// new Person2('A'); // ❌ TypeError: Person2 is not a constructor
```

## 绑定与调用

- 普通函数：可使用 `call/apply/bind` 显式改变 `this`。
- 箭头函数：`call/apply/bind` 只能传参，无法改变 `this`。

## 提升（Hoisting）

- 函数声明（普通函数）会函数提升，可在声明前调用。
- 箭头函数通常以变量形式存在，遵循 `let/const` 的暂时性死区，不会函数提升。

```js
foo(); // ✅
function foo() {}

// bar(); // ❌ ReferenceError
const bar = () => {};
```

## 生成器 / async

- 箭头函数不能作为生成器（不能写 `=>*`），但可以是 `async`：`const f = async () => {}`。
- 普通函数既可以是生成器 `function* g(){}`，也可以是 `async function`。

## 性能与使用场景

- 箭头函数：
  - 没有自身绑定开销（`this/arguments/prototype`），在高频回调（如数组遍历、事件回调中闭包捕获外层 `this`）更简洁。
  - 适合需要继承外层 `this` 的场景（如类中回调、Promise/定时器回调等）。
- 普通函数：
  - 需要动态 `this`、作为方法或构造函数、需要 `arguments`/`new.target`/`prototype` 时必须使用。

## 典型易错点

- 作为对象方法/类方法若用箭头：`this` 不指向实例，通常不是想要的效果。
- DOM 事件回调如果需要 `this` 指向当前元素，请用普通函数；若无需依赖 DOM `this`，箭头更简洁。
- 返回对象字面量要加括号：`() => ({ a: 1 }))`。

## 小示例

```js
// 1) 类中回调：用箭头避免手动 bind
class Timer {
  constructor() {
    this.seconds = 0;
    setInterval(() => {
      // 箭头继承实例 this
      this.seconds += 1;
    }, 1000);
  }
}

// 2) DOM 事件如果要用元素 this，使用普通函数
button.onclick = function () {
  console.log(this === button);
};

// 3) 数组回调：箭头简洁
const squares = [1, 2, 3].map((x) => x * 2);
```

## 总结

- 箭头函数：`this/arguments/new.target/super` 词法继承、不可构造、无 `prototype`、不可改 `this`、常用于回调/闭包。
- 普通函数：`this` 动态、可构造、有 `prototype`、可改 `this`、有 `arguments`，适合方法与需要构造/动态绑定的场景。
