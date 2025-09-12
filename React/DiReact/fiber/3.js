// 全局任务对象 ，一个要处理的任务单元，fiber 节点

let nextUnitOfWork = null;

function performUnitOfWork(fiber) {
  // 当前fiber 创建的真实dom,没有就创建
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  const elements = fiber.props.children;
  // 递归子节点
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
      child: null,
      sibling: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
  if (fiber.child) {
    return fiber.child;
  }
  // 如果没有子节点，找兄弟节点
  let next = fiber;
  while (next) {
    if (next.sibling) {
      return next.sibling;
    }
    next = next.parent;
  }
  return null;
}

// 工作循环
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 执行单元工作
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 避免阻塞1ms
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
