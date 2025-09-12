// 全局对象 ，指向下一个要处理的单元工作(即一个fiber 节点)
let nextUnitOfWork = null;

function workLoop(deadline) {
  nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  let shouldYield = false;
  while (nextUnitOfWork && shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 如果任务时间小于1ms 停止执行，避免阻塞渲染
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
