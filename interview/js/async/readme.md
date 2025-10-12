# 异步编程

- 回调函数

  - 通过回调函数，在任务完成后执行
  - 缺点： 回调地狱，错误处理难以传递
  - node.js fs.read() 回调函数第一个参数是错误对象，没有独立都错误处理机制。

- promise 链式调用管理异步流程、支持链式，统一错误捕获

  - .then / .catch/.finally
  - 链式过多可读性下降
    - es6+ generator + yield 可生成器函数
    - 异步流程控制灵活
    - 缺点： 要手动调用 next() 来 执行下一个 yied 表达式

- async /await Promise 语法糖 ，用同步写法写异步逻辑。
  - 错误捕获要配合 try catch 来捕获
  - 事件 / 发布订阅 事件触发后异步执行 监听器
- webworker 开启子线程耗时任务，真正的一段时间并行执行任务

  - 不能操作 dom,不能访问 window 对象，基于事件机制

- JavaScript 是单线程的，异步是为了解决阻塞，从早期的回调到 promise ,再到 async /await 核心都说事件循环和任务队列，让耗时任务放入异步队列，主线程继续执行。我更倾向于 async /await 语义清晰的 书写代码

- async /await

  - await 在等什么？
    await 后面的代码会放到微任务队列
    它等待 resolve or reject
  - await 后面一定是 promise ?
