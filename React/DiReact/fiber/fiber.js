// 最小并发 Didact（可中断 + 双阶段）
// 这一份极简实现，浓缩了 React 18 的核心并发渲染思想：
// 1) Fiber 数据结构串联整棵树（父/子/兄弟指针）
// 2) 两阶段工作流：render（计算与收集变更）→ commit（一次性应用 DOM 变更）
// 3) 时间切片：在 render 阶段使用 shouldYield() 判断时间是否耗尽，从而“可中断”
// 4) 双缓存树：currentRoot（已提交）与 wipRoot（计算中）在提交后进行切换
//
// 注意：
// - 这是教学用的“最小实现”，省略了优先级 Lanes、Hook、Suspense、过渡等复杂能力。
// - 目标是帮助理解大方向与关键分工，而非完全还原 React 内部细节。

function createTextElement(text) {
  // 文本节点也统一抽象为 VDOM：
  // 这样 child 列表中可以只处理“对象”，避免真实字符串分支。
  return {
    type: "TEXT_ELEMENT",
    props: { nodeValue: text, children: [] },
  };
}

function createElement(type, props, ...children) {
  // VDOM 结构：{ type, props: { ...props, children: [childVDOM...] } }
  // - children 中的原始值（string/number）被包装为 TEXT_ELEMENT
  // - 整个树构建是纯数据，不涉及真实 DOM
  return {
    type,
    props: {
      ...props,
      children: children.map((c) =>
        typeof c === "object" ? c : createTextElement(String(c))
      ),
    },
  };
}

let nextUnitOfWork = null; // 指向“下一个需要处理的 Fiber 单元”；为空表示本次 render 分片已跑完
let wipRoot = null; // work-in-progress 根（正在构建）
let currentRoot = null; // 已提交的根（commit 后成为“当前树”）
let deletions = null; // 本次提交需要删除的旧 Fiber 列表（收集于 render 阶段）

function createDom(fiber) {
  // beginWork 阶段“懒创建”真实 DOM：
  // - 对 TEXT_ELEMENT 创建 TextNode
  // - 对普通元素创建对应的 Element
  // - 初始属性一次性设置（事件与属性分开处理）
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}

const isEvent = (k) => k.startsWith("on"); // 事件以 onXxx 命名，如 onClick
const isProperty = (k) => k !== "children" && !isEvent(k); // 普通属性：排除 children 与事件

function updateDom(dom, prevProps, nextProps) {
  // DOM 属性/事件的最小更新：
  // 1) 移除旧事件
  // 2) 移除被删除的旧属性
  // 3) 添加或更新新属性
  // 4) 绑定新事件
  // 事件移除
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((k) => !(k in nextProps) || prevProps[k] !== nextProps[k])
    .forEach((name) => {
      const eventType = name.toLowerCase().slice(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });
  // 属性移除
  Object.keys(prevProps)
    .filter(isProperty)
    .filter((k) => !(k in nextProps))
    .forEach((name) => (dom[name] = ""));
  // 属性添加
  Object.keys(nextProps)
    .filter(isProperty)
    .forEach((name) => (dom[name] = nextProps[name]));
  // 事件添加
  Object.keys(nextProps)
    .filter(isEvent)
    .filter((k) => prevProps[k] !== nextProps[k])
    .forEach((name) => {
      const eventType = name.toLowerCase().slice(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

function render(element, container) {
  // 触发一次新的渲染：
  // - 构建一个“伪根”Fiber：其 dom 指向容器，children 为要渲染的 element
  // - 将 nextUnitOfWork 指向根，等待 workLoop 推进
  // - 清空 deletions，准备收集删除项
  wipRoot = {
    type: "div",
    dom: container,
    props: { children: [element] },
    parent: null,
  };
  nextUnitOfWork = wipRoot;
  deletions = [];
}

// 可中断：时间片不足时让出
function shouldYield(deadline) {
  // deadline.timeRemaining() 近似表示本帧剩余可用时间（ms）
  // 小于阈值则让出控制权，避免长任务阻塞主线程（输入/动画更流畅）
  return deadline.timeRemaining() < 1;
}
function workLoop(deadline) {
  // 渲染分片主循环：
  // - 持续执行 performUnitOfWork，直到没有工作或时间片不足
  // - 如果所有工作完成（nextUnitOfWork 为空且 wipRoot 存在），进入提交阶段
  // - 再次请求下一帧，形成“可中断”的持续推进
  let shouldYieldFlag = false;
  while (nextUnitOfWork && !(shouldYieldFlag = shouldYield(deadline))) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  // 分片结束，如果构建完毕则提交
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestWorkLoop(); // 继续下一帧
}

let scheduleHandle = null; // 简易防抖：避免重复安排同一帧的回调
function requestWorkLoop() {
  if (scheduleHandle) return;
  scheduleHandle = scheduler((deadline) => {
    scheduleHandle = null;
    workLoop(deadline);
  });
}

// 简易 scheduler：优先用 MessageChannel，其次 requestIdleCallback（或 setTimeout）
function scheduler(cb) {
  // 简易调度：
  // - 优先使用 MessageChannel（宏任务+更稳定），我们人为提供固定的 timeRemaining 值
  // - 其次使用 requestIdleCallback（可能受限于浏览器/节流）
  // - 兜底使用 setTimeout
  if (typeof MessageChannel !== "undefined") {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => cb({ timeRemaining: () => 5 });
    channel.port2.postMessage(0);
    return { cancel: () => (channel.port1.onmessage = null) };
  }
  if (typeof requestIdleCallback !== "undefined") {
    const id = requestIdleCallback(cb);
    return { cancel: () => cancelIdleCallback(id) };
  }
  const id = setTimeout(() => cb({ timeRemaining: () => 0 }), 1);
  return { cancel: () => clearTimeout(id) };
}

function performUnitOfWork(fiber) {
  // 单元工作：对应 React 的 beginWork/completeWork 的合体节奏
  // 1) beginWork：创建当前 fiber 的 dom（如需）并基于 props.children 调和子节点
  // 2) 深度优先向下：优先处理子节点
  // 3) 回溯 complete：没有子则向上回溯，寻找兄弟节点继续
  // 1) beginWork：为当前 fiber 准备 dom/子节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);

  // 2) 深度优先：优先返回子节点
  if (fiber.child) return fiber.child;

  // 3) 没有子，completeWork：向上回溯，寻找兄弟
  let next = fiber;
  while (next) {
    // 在 complete 时不触 DOM，收集好结构，提交阶段统一处理
    if (next.sibling) return next.sibling;
    next = next.parent;
  }
  return null;
}

function reconcileChildren(wipFiber, elements) {
  // children 调和（极简 diff）：
  // - 同类型：标记 UPDATE，复用旧 dom
  // - 不同类型且有新节点：标记 PLACEMENT（新增）
  // - 旧节点多于新节点：标记旧 fiber 为 DELETION
  // 这里未实现 key 对应的“移动”优化，仅处理最基础的三类。
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      // 更新
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    } else if (element) {
      // 新增
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    if (oldFiber && !sameType) {
      // 删除
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) oldFiber = oldFiber.sibling;

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (prevSibling) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}

function commitRoot() {
  // 提交阶段：对收集到的 effect（新增/更新/删除）一次性操作 DOM
  // - 先处理 deletions（确保从 DOM 中移除）
  // - 再递归提交 wipRoot.child
  // - 切换双缓存：wip → current
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  // 递归提交单个 fiber：
  // - 寻找最近的拥有 dom 的父节点（函数组件等可能没有 dom）
  // - 根据 effectTag 执行对应的 DOM 操作
  // - 递归处理 child 与 sibling
  if (!fiber) return;
  // 找到最近的有 dom 的父节点（跳过函数组件等）
  let parentFiber = fiber.parent;
  while (parentFiber && !parentFiber.dom) parentFiber = parentFiber.parent;
  const parentDom = parentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    parentDom.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, parentDom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, parentDom) {
  // 删除：若当前 fiber 没有 dom（例如函数组件），向下寻找有 dom 的子节点删除
  if (fiber.dom) {
    parentDom.removeChild(fiber.dom);
  } else if (fiber.child) {
    commitDeletion(fiber.child, parentDom);
  }
}

// 导出 Didact-like API：对外暴露 createElement/render 接口
const Didact = { createElement, render };

// 使用示例（在页面中引入本文件后取消注释即可体验）：
// const element = Didact.createElement("div", null,
//   Didact.createElement("h1", null, "Hello"),
//   Didact.createElement("button", { onClick: () => alert(1) }, "Click")
// );
// Didact.render(element, document.getElementById("root"));
// requestWorkLoop();
