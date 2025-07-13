class EventLoopSimulator {
  constructor() {
    this.callStack = [];
    this.microtaskQueue = [];
    this.macrotaskQueue = [];
    this.eventQueue = [];
    this.renderQueue = [];

    this.timerTasks = [];
    this.networkTasks = [];
    this.eventTasks = [];

    this.isRunning = false;
    this.isPaused = false;
    this.executionSpeed = 1500;
    this.taskId = 0;

    this.statusLog = [];
    this.animatingTasks = new Map();

    this.initializeDOM();
    this.initializeSlots();
  }

  initializeDOM() {
    this.elements = {
      callStack: document.getElementById("call-stack"),
      microtaskQueue: document.getElementById("microtask-queue"),
      macrotaskQueue: document.getElementById("macrotask-queue"),
      eventQueue: document.getElementById("event-queue"),
      renderQueue: document.getElementById("render-queue"),
      timerTasks: document.getElementById("timer-tasks"),
      networkTasks: document.getElementById("network-tasks"),
      eventTasks: document.getElementById("event-tasks"),
      statusLog: document.getElementById("status-log"),
      currentCode: document.getElementById("current-code"),
      timerThread: document.getElementById("timer-thread"),
      networkThread: document.getElementById("network-thread"),
      eventThread: document.getElementById("event-thread"),
      animationLayer: document.getElementById("animation-layer"),
    };
  }

  initializeSlots() {
    const queues = [
      "call-stack",
      "microtask-queue",
      "macrotask-queue",
      "event-queue",
      "render-queue",
    ];
    queues.forEach((queueId) => {
      const queueElement = this.elements[queueId.replace("-", "")];
      if (queueElement) {
        queueElement.innerHTML = "";
        for (let i = 0; i < 6; i++) {
          const slot = document.createElement("div");
          slot.className = "queue-slot";
          slot.setAttribute("data-slot-index", i);
          queueElement.appendChild(slot);
        }
      }
    });
  }

  createTaskBlock(task, container) {
    const block = document.createElement("div");
    block.className = `task-block ${task.type}`;
    block.textContent = task.name;
    block.setAttribute("data-task-id", task.id);

    if (container) {
      const containerRect = container.getBoundingClientRect();
      const visualizationRect =
        this.elements.animationLayer.getBoundingClientRect();

      block.style.left =
        containerRect.left - visualizationRect.left + 10 + "px";
      block.style.top = containerRect.top - visualizationRect.top + 10 + "px";
    }

    this.elements.animationLayer.appendChild(block);
    return block;
  }

  getQueueSlotPosition(queueElement, slotIndex) {
    const slot = queueElement.children[slotIndex];
    if (!slot) return null;

    const slotRect = slot.getBoundingClientRect();
    const visualizationRect =
      this.elements.animationLayer.getBoundingClientRect();

    return {
      x: slotRect.left - visualizationRect.left + 5,
      y: slotRect.top - visualizationRect.top + 5,
    };
  }

  animateTaskToQueue(taskBlock, targetQueue, targetIndex, duration = 1000) {
    return new Promise((resolve) => {
      const targetPos = this.getQueueSlotPosition(targetQueue, targetIndex);
      if (!targetPos) {
        resolve();
        return;
      }

      const currentRect = taskBlock.getBoundingClientRect();
      const visualizationRect =
        this.elements.animationLayer.getBoundingClientRect();
      const currentX = currentRect.left - visualizationRect.left;
      const currentY = currentRect.top - visualizationRect.top;

      const deltaX = targetPos.x - currentX;
      const deltaY = targetPos.y - currentY;

      const controlX = currentX + deltaX * 0.5 + (deltaX > 0 ? -50 : 50);
      const controlY = Math.min(currentY, targetPos.y) - 30;

      taskBlock.classList.add("moving");

      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = this.easeInOutCubic(progress);

        const x = this.bezierPoint(
          currentX,
          controlX,
          targetPos.x,
          easedProgress
        );
        const y = this.bezierPoint(
          currentY,
          controlY,
          targetPos.y,
          easedProgress
        );

        taskBlock.style.left = x + "px";
        taskBlock.style.top = y + "px";
        taskBlock.style.transform = `scale(${
          1 + Math.sin(progress * Math.PI) * 0.2
        })`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          taskBlock.classList.remove("moving");
          taskBlock.style.transform = "scale(1)";

          const targetSlot = targetQueue.children[targetIndex];
          if (targetSlot) {
            targetSlot.classList.remove("target");
            targetSlot.classList.add("occupied");
          }
          resolve();
        }
      };

      const targetSlot = targetQueue.children[targetIndex];
      if (targetSlot) {
        targetSlot.classList.add("target");
      }

      requestAnimationFrame(animate);
    });
  }

  bezierPoint(p0, p1, p2, t) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  createTask(name, type, code = "", delay = 0) {
    return {
      id: ++this.taskId,
      name,
      type,
      code,
      delay,
      timestamp: Date.now(),
    };
  }

  log(message) {
    const timestamp = new Date().toLocaleTimeString();
    this.statusLog.push(`[${timestamp}] ${message}`);
    this.updateStatusDisplay();
  }

  updateStatusDisplay() {
    this.elements.statusLog.innerHTML = this.statusLog
      .slice(-10)
      .map((log) => `<div>${log}</div>`)
      .join("");
    this.elements.statusLog.scrollTop = this.elements.statusLog.scrollHeight;
  }

  updateDisplay() {
    requestAnimationFrame(() => {
      this.renderQueue("call-stack", this.callStack);
      this.renderQueue("microtask-queue", this.microtaskQueue);
      this.renderQueue("macrotask-queue", this.macrotaskQueue);
      this.renderQueue("event-queue", this.eventQueue);
      this.renderQueue("render-queue", this.renderQueue);
      this.renderQueue("timer-tasks", this.timerTasks);
      this.renderQueue("network-tasks", this.networkTasks);
      this.renderQueue("event-tasks", this.eventTasks);
    });
  }

  renderQueue(elementId, queue) {
    const element = this.elements[elementId.replace("-", "")];
    if (!element) return;

    queue.forEach((task, index) => {
      const slot = element.children[index];
      if (slot && !slot.classList.contains("occupied")) {
        slot.classList.add("occupied");
        slot.setAttribute("data-task-name", task.name);
        slot.setAttribute("data-task-type", task.type);
      }
    });

    for (let i = queue.length; i < element.children.length; i++) {
      const slot = element.children[i];
      if (slot) {
        slot.classList.remove("occupied");
        slot.removeAttribute("data-task-name");
        slot.removeAttribute("data-task-type");
      }
    }
  }

  async addSyncTask() {
    const task = this.createTask(
      "同步任务",
      "sync",
      'console.log("执行同步任务");'
    );

    this.elements.callStack.classList.add("highlight");
    setTimeout(() => {
      this.elements.callStack.classList.remove("highlight");
    }, 500);

    this.callStack.push(task);
    this.log(`添加同步任务: ${task.name}`);
    this.updateCodeDisplay(task.code);
    this.updateDisplay();

    if (!this.isRunning) {
      await this.executeNextTask();
    }
  }

  async addPromise() {
    const task = this.createTask(
      "Promise.then",
      "sync",
      'Promise.resolve().then(() => console.log("微任务执行"));'
    );

    this.elements.callStack.classList.add("highlight");
    setTimeout(() => {
      this.elements.callStack.classList.remove("highlight");
    }, 500);

    this.callStack.push(task);
    this.log(`添加 Promise 任务: ${task.name}`);
    this.updateCodeDisplay(task.code);
    this.updateDisplay();

    setTimeout(async () => {
      const microtask = this.createTask("Promise回调", "microtask");

      const promiseBlock = this.createTaskBlock(
        microtask,
        this.elements.callStack
      );

      await this.animateTaskToQueue(
        promiseBlock,
        this.elements.microtaskQueue,
        this.microtaskQueue.length,
        800
      );

      this.elements.microtaskQueue.classList.add("highlight");
      setTimeout(() => {
        this.elements.microtaskQueue.classList.remove("highlight");
      }, 500);

      this.microtaskQueue.push(microtask);
      this.log(`微任务进入队列: ${microtask.name}`);
      this.updateDisplay();

      setTimeout(() => {
        if (promiseBlock.parentNode) {
          promiseBlock.parentNode.removeChild(promiseBlock);
        }
      }, 500);
    }, 500);

    if (!this.isRunning) {
      await this.executeNextTask();
    }
  }

  async addTimeout() {
    const delay = Math.floor(Math.random() * 3 + 1) * 1000;
    const task = this.createTask(
      "setTimeout",
      "sync",
      `setTimeout(() => console.log("定时器执行"), ${delay});`
    );

    this.elements.callStack.classList.add("highlight");
    setTimeout(() => {
      this.elements.callStack.classList.remove("highlight");
    }, 500);

    this.callStack.push(task);
    this.log(`添加 setTimeout 任务: ${task.name}`);
    this.updateCodeDisplay(task.code);
    this.updateDisplay();

    setTimeout(async () => {
      const timerTask = this.createTask(
        `Timer(${delay}ms)`,
        "timer",
        "",
        delay
      );

      const timerBlock = this.createTaskBlock(
        timerTask,
        this.elements.timerThread
      );

      this.timerTasks.push(timerTask);
      this.highlightThread("timer");
      this.log(`定时器任务移交给计时器线程: ${timerTask.name}`);

      await this.sleep(500);

      setTimeout(async () => {
        this.timerTasks = this.timerTasks.filter((t) => t.id !== timerTask.id);
        const macrotask = this.createTask("Timer回调", "macrotask");

        await this.animateTaskToQueue(
          timerBlock,
          this.elements.macrotaskQueue,
          this.macrotaskQueue.length
        );

        this.elements.macrotaskQueue.classList.add("highlight");
        setTimeout(() => {
          this.elements.macrotaskQueue.classList.remove("highlight");
        }, 500);

        this.macrotaskQueue.push(macrotask);
        this.log(`定时器完成，宏任务进入队列: ${macrotask.name}`);
        this.removeThreadHighlight("timer");

        setTimeout(() => {
          if (timerBlock.parentNode) {
            timerBlock.parentNode.removeChild(timerBlock);
          }
        }, 500);
      }, delay);
    }, 500);

    if (!this.isRunning) {
      await this.executeNextTask();
    }
  }

  async addFetch() {
    const task = this.createTask(
      "fetch请求",
      "sync",
      'fetch("/api/data").then(response => console.log("网络请求完成"));'
    );

    this.elements.callStack.classList.add("highlight");
    setTimeout(() => {
      this.elements.callStack.classList.remove("highlight");
    }, 500);

    this.callStack.push(task);
    this.log(`添加 Fetch 任务: ${task.name}`);
    this.updateCodeDisplay(task.code);
    this.updateDisplay();

    setTimeout(async () => {
      const networkTask = this.createTask("HTTP请求", "network");

      const networkBlock = this.createTaskBlock(
        networkTask,
        this.elements.networkThread
      );

      this.networkTasks.push(networkTask);
      this.highlightThread("network");
      this.log(`网络请求移交给网络线程: ${networkTask.name}`);

      await this.sleep(500);

      setTimeout(async () => {
        this.networkTasks = this.networkTasks.filter(
          (t) => t.id !== networkTask.id
        );
        const microtask = this.createTask("Fetch回调", "microtask");

        await this.animateTaskToQueue(
          networkBlock,
          this.elements.microtaskQueue,
          this.microtaskQueue.length
        );

        this.elements.microtaskQueue.classList.add("highlight");
        setTimeout(() => {
          this.elements.microtaskQueue.classList.remove("highlight");
        }, 500);

        this.microtaskQueue.push(microtask);
        this.log(`网络请求完成，微任务进入队列: ${microtask.name}`);
        this.removeThreadHighlight("network");

        setTimeout(() => {
          if (networkBlock.parentNode) {
            networkBlock.parentNode.removeChild(networkBlock);
          }
        }, 500);
      }, 2000);
    }, 500);

    if (!this.isRunning) {
      await this.executeNextTask();
    }
  }

  highlightThread(threadType) {
    const threadElement = this.elements[`${threadType}Thread`];
    if (threadElement) {
      threadElement.classList.add("active", "processing");
    }
  }

  removeThreadHighlight(threadType) {
    const threadElement = this.elements[`${threadType}Thread`];
    if (threadElement) {
      threadElement.classList.remove("active", "processing");
    }
  }

  highlightQueueTransfer(sourceElement, targetElement) {
    sourceElement.classList.add("sending-task");
    targetElement.classList.add("receiving-task");

    setTimeout(() => {
      sourceElement.classList.remove("sending-task");
      targetElement.classList.remove("receiving-task");
    }, 1000);
  }

  async animateTaskTransfer(sourceElement, targetElement, taskName) {
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const transferElement = document.createElement("div");
    transferElement.className = "transfer-animation";
    transferElement.textContent = taskName;
    transferElement.style.position = "fixed";
    transferElement.style.left = sourceRect.left + sourceRect.width / 2 + "px";
    transferElement.style.top = sourceRect.top + sourceRect.height / 2 + "px";
    transferElement.style.transform = "translate(-50%, -50%)";
    transferElement.style.transition =
      "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    document.body.appendChild(transferElement);

    requestAnimationFrame(() => {
      transferElement.classList.add("active");
      transferElement.style.left =
        targetRect.left + targetRect.width / 2 + "px";
      transferElement.style.top = targetRect.top + targetRect.height / 2 + "px";
    });

    await this.sleep(800);

    if (transferElement.parentNode) {
      transferElement.style.opacity = "0";
      transferElement.style.transform = "translate(-50%, -50%) scale(0.5)";
      setTimeout(() => {
        if (transferElement.parentNode) {
          transferElement.parentNode.removeChild(transferElement);
        }
      }, 200);
    }
  }

  updateCodeDisplay(code) {
    this.elements.currentCode.innerHTML = this.highlightCode(code);
  }

  highlightCode(code) {
    return code
      .replace(
        /(console\.log|setTimeout|Promise|fetch)/g,
        '<span style="color: #e06c75;">$1</span>'
      )
      .replace(/(".*?")/g, '<span style="color: #98c379;">$1</span>')
      .replace(/(\d+)/g, '<span style="color: #d19a66;">$1</span>')
      .replace(/(=>|=)/g, '<span style="color: #56b6c2;">$1</span>');
  }

  async startExecution() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.log("开始执行事件循环");

    while (this.isRunning && !this.isPaused) {
      await this.executeEventLoop();
      await this.sleep(this.executionSpeed);
    }
  }

  async executeEventLoop() {
    if (this.callStack.length > 0) {
      await this.executeNextTask();
    } else if (this.microtaskQueue.length > 0) {
      await this.executeMicrotask();
    } else if (this.macrotaskQueue.length > 0 || this.eventQueue.length > 0) {
      await this.executeMacrotask();
    } else if (this.renderQueue.length > 0) {
      await this.executeRenderTask();
    } else {
      this.isRunning = false;
      this.log("事件循环空闲");
    }
  }

  async executeNextTask() {
    if (this.callStack.length === 0) return;

    const task = this.callStack[this.callStack.length - 1];
    const taskSlot =
      this.elements.callStack.children[this.callStack.length - 1];

    if (taskSlot) {
      taskSlot.classList.add("occupied");

      const executingBlock = this.createTaskBlock(task, taskSlot);
      executingBlock.classList.add("executing");
    }

    this.log(`执行: ${task.name}`);
    this.updateDisplay();

    await this.sleep(800);

    this.callStack.pop();

    if (taskSlot) {
      taskSlot.classList.remove("occupied");
    }

    const executingBlocks = this.elements.animationLayer.querySelectorAll(
      ".task-block.executing"
    );
    executingBlocks.forEach((block) => {
      block.classList.add("fade-out");
      setTimeout(() => {
        if (block.parentNode) {
          block.parentNode.removeChild(block);
        }
      }, 500);
    });

    this.log(`完成: ${task.name}`);
    this.updateDisplay();
  }

  async executeMicrotask() {
    if (this.microtaskQueue.length === 0) return;

    const task = this.microtaskQueue[0];
    const sourceElement = this.elements.microtaskQueue;
    const targetElement = this.elements.callStack;

    this.highlightQueueTransfer(sourceElement, targetElement);

    const taskBlock = this.createTaskBlock(task, sourceElement);

    await this.animateTaskToQueue(
      taskBlock,
      targetElement,
      this.callStack.length
    );

    this.microtaskQueue.shift();
    this.callStack.push(task);
    this.log(`微任务进入执行栈: ${task.name}`);
    this.updateDisplay();

    setTimeout(() => {
      if (taskBlock.parentNode) {
        taskBlock.parentNode.removeChild(taskBlock);
      }
    }, 500);

    await this.sleep(500);
    await this.executeNextTask();
  }

  async executeMacrotask() {
    let task = null;
    let sourceElement = null;

    if (this.macrotaskQueue.length > 0) {
      task = this.macrotaskQueue[0];
      sourceElement = this.elements.macrotaskQueue;
    } else if (this.eventQueue.length > 0) {
      task = this.eventQueue[0];
      sourceElement = this.elements.eventQueue;
    }

    if (task && sourceElement) {
      const targetElement = this.elements.callStack;

      this.highlightQueueTransfer(sourceElement, targetElement);

      const taskBlock = this.createTaskBlock(task, sourceElement);

      await this.animateTaskToQueue(
        taskBlock,
        targetElement,
        this.callStack.length
      );

      if (this.macrotaskQueue.length > 0) {
        this.macrotaskQueue.shift();
      } else {
        this.eventQueue.shift();
      }

      this.callStack.push(task);
      this.log(`宏任务进入执行栈: ${task.name}`);
      this.updateDisplay();

      setTimeout(() => {
        if (taskBlock.parentNode) {
          taskBlock.parentNode.removeChild(taskBlock);
        }
      }, 500);

      await this.sleep(500);
      await this.executeNextTask();
    }
  }

  async executeRenderTask() {
    if (this.renderQueue.length === 0) return;

    const task = this.renderQueue[0];
    const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);

    if (taskElement) {
      taskElement.classList.add("executing");
    }

    this.log(`执行渲染任务: ${task.name}`);
    this.updateDisplay();

    await this.sleep(1000);

    if (taskElement) {
      taskElement.classList.add("fade-out");
      await this.sleep(500);
    }

    this.renderQueue.shift();
    this.log(`渲染完成: ${task.name}`);
    this.updateDisplay();
  }

  pauseExecution() {
    this.isPaused = true;
    this.log("暂停执行");
  }

  clearAll() {
    this.callStack = [];
    this.microtaskQueue = [];
    this.macrotaskQueue = [];
    this.eventQueue = [];
    this.renderQueue = [];
    this.timerTasks = [];
    this.networkTasks = [];
    this.eventTasks = [];

    this.isRunning = false;
    this.isPaused = false;
    this.statusLog = [];

    const allQueueElements = [
      this.elements.callStack,
      this.elements.microtaskQueue,
      this.elements.macrotaskQueue,
      this.elements.eventQueue,
      this.elements.renderQueue,
      this.elements.timerTasks,
      this.elements.networkTasks,
      this.elements.eventTasks,
    ];

    allQueueElements.forEach((element) => {
      if (element) {
        element.classList.remove("highlight", "receiving-task", "sending-task");
        Array.from(element.children).forEach((slot) => {
          slot.classList.remove("occupied", "target");
          slot.removeAttribute("data-task-name");
          slot.removeAttribute("data-task-type");
        });
      }
    });

    const threadElements = [
      this.elements.timerThread,
      this.elements.networkThread,
      this.elements.eventThread,
    ];

    threadElements.forEach((element) => {
      if (element) {
        element.classList.remove("active", "processing");
      }
    });

    const animatingBlocks =
      this.elements.animationLayer.querySelectorAll(".task-block");
    animatingBlocks.forEach((block) => {
      if (block.parentNode) {
        block.parentNode.removeChild(block);
      }
    });

    this.initializeSlots();
    this.updateDisplay();
    this.updateStatusDisplay();
    this.updateCodeDisplay("// 所有任务已清空");
    this.log("清空所有任务和队列");
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async runComplexExample() {
    this.clearAll();
    this.updateCodeDisplay(`
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
        `);

    await this.sleep(500);
    this.callStack.push(this.createTask("console.log('1')", "sync"));
    this.updateDisplay();

    await this.sleep(1000);
    this.callStack.push(this.createTask("setTimeout", "sync"));
    setTimeout(() => {
      this.macrotaskQueue.push(this.createTask("Timer回调('2')", "macrotask"));
      this.updateDisplay();
    }, 1000);
    this.updateDisplay();

    await this.sleep(1000);
    this.callStack.push(this.createTask("Promise.resolve()", "sync"));
    setTimeout(() => {
      this.microtaskQueue.push(
        this.createTask("Promise回调('3')", "microtask")
      );
      this.updateDisplay();
    }, 500);
    this.updateDisplay();

    await this.sleep(1000);
    this.callStack.push(this.createTask("console.log('4')", "sync"));
    this.updateDisplay();

    this.startExecution();
  }

  async runNestedPromises() {
    this.clearAll();
    this.updateCodeDisplay(`
Promise.resolve().then(() => {
    console.log('Promise 1');
    return Promise.resolve();
}).then(() => {
    console.log('Promise 2');
});
        `);

    this.microtaskQueue.push(this.createTask("Promise 1", "microtask"));
    setTimeout(() => {
      this.microtaskQueue.push(this.createTask("Promise 2", "microtask"));
      this.updateDisplay();
    }, 1500);
    this.updateDisplay();

    this.startExecution();
  }

  async runMixedTasks() {
    this.clearAll();
    this.updateCodeDisplay(`
setTimeout(() => console.log('宏任务 1'), 0);
Promise.resolve().then(() => console.log('微任务 1'));
setTimeout(() => console.log('宏任务 2'), 0);
Promise.resolve().then(() => console.log('微任务 2'));
        `);

    this.macrotaskQueue.push(this.createTask("宏任务 1", "macrotask"));
    this.microtaskQueue.push(this.createTask("微任务 1", "microtask"));
    this.macrotaskQueue.push(this.createTask("宏任务 2", "macrotask"));
    this.microtaskQueue.push(this.createTask("微任务 2", "microtask"));

    this.renderQueue.push(this.createTask("页面重绘", "render"));

    this.updateDisplay();
    this.startExecution();
  }
}

const simulator = new EventLoopSimulator();

function addSyncTask() {
  simulator.addSyncTask();
}

function addPromise() {
  simulator.addPromise();
}

function addTimeout() {
  simulator.addTimeout();
}

function addFetch() {
  simulator.addFetch();
}

function startExecution() {
  simulator.startExecution();
}

function pauseExecution() {
  simulator.pauseExecution();
}

function clearAll() {
  simulator.clearAll();
}

function runComplexExample() {
  simulator.runComplexExample();
}

function runNestedPromises() {
  simulator.runNestedPromises();
}

function runMixedTasks() {
  simulator.runMixedTasks();
}
