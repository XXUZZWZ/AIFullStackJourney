# Promise.all

- MDN
  - 静态方法
  - Promise.all 方法接收一个 promise 的**iterable**类型输入(Array,Map,set)并返回一个 Promise 实例，输入的所有 Promise 的 resolve 回调数组，并按顺序存放。只要任何一个输入的 reject 回调执行，就会抛出一个第一个错误，Promise.all 和 Promise 失败 catch 执行，reject 是第一个抛出的错误。
    - 可迭代对像： Array、String、Map、Set、TypedArray、arguments、NodeList
  - 如果有其他 promise 子项失败，那么其他还没有完成的 promise 会继续执行。，只不过结果不会出现在 promise 的返回的列表里了。
- race,any,allsettled

  - async await 简单，不需要 then 的链式调用，优雅的异步变同步
  - 但也不能乱用，他说串行执行，过早 await 会阻塞后续可并行的任务；应先创建所有 Promise，再统一等待，可以节约时间。

- 如果并行业务需求，all,race/any,allsettled,
  更加合适且高效
- Promise.all() 全成功才成功：所有 Promise 都 fulfilled 时，它才 fulfilled；任何一个 rejected，它就立即 rejected。
- Promise.race() 谁快听谁的：哪个 Promise 最先完成（无论 fulfilled 或 rejected），它的结果就决定了 Promise.race() 的最终状态。
- Promise.any() 首个成功即成功：只要有一个 Promise fulfilled，它就立即 fulfilled；只有当所有 Promise 都 rejected 时，它才 rejected（返回 AggregateError）。
- Promise.allSettled() 全部完成才结束：等待所有 Promise 都 settled（fulfilled 或 rejected），然后返回一个包含每个 Promise 结果（含状态和值/原因）的数组。
