# async await 是什么？ 如何实现的？

- 它是 es2017 引入的异步编程语法糖 让异步代码写起来像同步，解决了 then 的链式调用很麻烦的问题。

- async await 是基于 promise 的语法糖

- async function 声明的函数一定返回 promise

  - await 会暂停 async 函数的执行，等待 Promise 解决后完成继续
  - 本质还是异步的，这个函数外面后面代码还是会执行。

- 本质上 async /await 是对 promise + Gennerator 的封装
  - generrator 思想很好 运行得到迭代对象 next() value 和 done 状态
  - 太复杂了
  - async 函数内部会被编译成一个状态机(等待？完成？)
- async /await 简单优雅 不要滥用 并发的请用 Promise.all()
