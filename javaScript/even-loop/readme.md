# event loop

事件循环机制(渲染主线程的调度机制)

- js 单线程
  同一时刻只做一件事
  同步任务尽快执行完成,尽快渲染页面(重绘重排)，并处理事件。
  耗时性都任务？
  - settTimeout
  - fetch/ajax
  - eventListener
- script 脚本 一个宏任务

- 微任务是优先级最高的，紧急的。

- 微任务有那些
  - promise.then()
  - MutationObserver 微任务，做到页面渲染前执行
    - dom 改变在页面渲染前拿到 DOM 前端有啥变化
  - queueMicrotask() 浏览器原生的微任务
  - process.nextTick() node 原生微任务
