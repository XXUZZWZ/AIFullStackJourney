# 闭包

- 一句话概括概念
  closure 是 js 语法特性，能访问**自由变量** 函数就叫闭包，当一个内部函数访问了它所在的外部变量，即使外部函数已经执行完毕，这些变量任然停留在内存中，供内部函数使用，这种机制叫闭包

- 你不知道的 javaScript 闭包 = 函数 + 词法作用域(本质)

- 形成条件：函数嵌套函数，内部函数可以在外界访问 返回或挂载在全局

  - 立即执行函数 块级作用域+ 定时器

- 底层原理
  - 词法作用域(Lexical Scope)
  - JavaScript 引擎的编译阶段，会为每个函数创建一个作用域，作用域会保存函数的变量声明和参数。
    - 在内部再声明一个函数，内部函数可以外部函数的变量声明，并且外部作用域函数的变量声明会保存在内部作用域中，不会垃圾回收。
    - 作用域链 (Scope Chain) 内部函数再查找变量时，会沿着作用域链向上查找外侧变量。
    - 变量的持久化，由于闭包函数依然引用自由变量，js v8 引擎 gc 认为它不该回收，保留在内存中。
      - 这些外部变量还在使用，所以不会销毁，导致值持久存在。
- 模型图
  [Global Scope]
  ^
  |
  |  
  [Outer Function Scope]
  ^
  |
  [Inner Function Scope]

- 业务场景

- 数据私有化
  - 封装类 或 复杂性 私有属性
- 防抖节流
- 循环绑定事件

  ```javascript
  for (var i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
  // 打印 10 10 10 10 10 10 10 10 10 10

  <!-- 为啥？因为 i 是全局变量，每次循环都会改变 i 的值，所以打印的是 i 的最终值。 -->
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
  // 打印 1 2 3 4 5 6 7 8 9 10
  // 这是为啥？  这是因为 JavaScript 的变量作用域问题。
  for (var i = 0; i < 10; i++) {
    (
        setTimeout(() => {
         console.log(i);
        },100)
    )(i)
  }
  // 打印：
  // IIFE

  ```

  ```javascript
  function memoize(fn) {
    const cache = {};
    return function (key) {
      if (cache[key]) {
        return cache[key];
      }
      const result = fn(key);
      cache[key] = result;
      return result;
    };
  }
  ```

  - 柯里化
    一个接收多个函数的参数的函数，转化为一系列一个参数的函数链
  - 偏函数...

  ```javascript
  function curry(fn) {}
  ```

## 总结

闭包是函数与其内部的词法作用域链的组合，它让函数在外部作用域执行完后依然能访问里面的变量。本质·是作用域链导致变量持久化，在构成中常用于数据私有化
防抖节流 事件绑定 缓存优化

我在项目里经常用闭包减少全局变量污染，但也可能带来内存泄漏 ，不需要手动释放。
