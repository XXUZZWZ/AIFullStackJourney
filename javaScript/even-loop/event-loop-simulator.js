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
            callStack: document.getElementById('call-stack'),
            microtaskQueue: document.getElementById('microtask-queue'),
            macrotaskQueue: document.getElementById('macrotask-queue'),
            eventQueue: document.getElementById('event-queue'),
            renderQueue: document.getElementById('render-queue'),
            timerTasks: document.getElementById('timer-tasks'),
            networkTasks: document.getElementById('network-tasks'),
            eventTasks: document.getElementById('event-tasks'),
            statusLog: document.getElementById('status-log'),
            currentCode: document.getElementById('current-code'),
            timerThread: document.getElementById('timer-thread'),
            networkThread: document.getElementById('network-thread'),
            eventThread: document.getElementById('event-thread')
        };
    }

    createTask(name, type, code = '', delay = 0) {
        return {
            id: ++this.taskId,
            name,
            type,
            code,
            delay,
            timestamp: Date.now()
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
        this.renderQueue('call-stack', this.callStack);
        this.renderQueue('microtask-queue', this.microtaskQueue);
        this.renderQueue('macrotask-queue', this.macrotaskQueue);
        this.renderQueue('event-queue', this.eventQueue);
        this.renderQueue('render-queue', this.renderQueue);
        this.renderQueue('timer-tasks', this.timerTasks);
        this.renderQueue('network-tasks', this.networkTasks);
        this.renderQueue('event-tasks', this.eventTasks);
    }

    renderQueue(elementId, queue) {
        const element = this.elements[elementId.replace('-', '')];
        if (!element) return;
        
        element.innerHTML = '';
        queue.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.textContent = task.name;
            
            if (index === queue.length - 1 && elementId === 'call-stack') {
                taskElement.classList.add('executing');
            }
            
            element.appendChild(taskElement);
        });
        
        if (queue.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'text-align: center; color: #6c757d; font-style: italic; padding: 20px;';
            placeholder.textContent = '队列为空';
            element.appendChild(placeholder);
        }
    }

    async addSyncTask() {
        const task = this.createTask('同步任务', 'sync', 'console.log("执行同步任务");');
        this.callStack.push(task);
        this.log(`添加同步任务: ${task.name}`);
        this.updateCodeDisplay(task.code);
        this.updateDisplay();
        
        if (!this.isRunning) {
            await this.executeNextTask();
        }
    }

    async addPromise() {
        const task = this.createTask('Promise.then', 'sync', 
            'Promise.resolve().then(() => console.log("微任务执行"));');
        this.callStack.push(task);
        this.log(`添加 Promise 任务: ${task.name}`);
        this.updateCodeDisplay(task.code);
        this.updateDisplay();
        
        setTimeout(() => {
            const microtask = this.createTask('Promise回调', 'microtask');
            this.microtaskQueue.push(microtask);
            this.log(`微任务进入队列: ${microtask.name}`);
            this.updateDisplay();
        }, 500);
        
        if (!this.isRunning) {
            await this.executeNextTask();
        }
    }

    async addTimeout() {
        const delay = Math.floor(Math.random() * 3 + 1) * 1000;
        const task = this.createTask('setTimeout', 'sync', 
            `setTimeout(() => console.log("定时器执行"), ${delay});`);
        this.callStack.push(task);
        this.log(`添加 setTimeout 任务: ${task.name}`);
        this.updateCodeDisplay(task.code);
        this.updateDisplay();
        
        setTimeout(() => {
            const timerTask = this.createTask(`Timer(${delay}ms)`, 'timer', '', delay);
            this.timerTasks.push(timerTask);
            this.highlightThread('timer');
            this.log(`定时器任务移交给计时器线程: ${timerTask.name}`);
            this.updateDisplay();
            
            setTimeout(() => {
                this.timerTasks = this.timerTasks.filter(t => t.id !== timerTask.id);
                const macrotask = this.createTask('Timer回调', 'macrotask');
                this.macrotaskQueue.push(macrotask);
                this.log(`定时器完成，宏任务进入队列: ${macrotask.name}`);
                this.updateDisplay();
                this.removeThreadHighlight('timer');
            }, delay);
        }, 500);
        
        if (!this.isRunning) {
            await this.executeNextTask();
        }
    }

    async addFetch() {
        const task = this.createTask('fetch请求', 'sync', 
            'fetch("/api/data").then(response => console.log("网络请求完成"));');
        this.callStack.push(task);
        this.log(`添加 Fetch 任务: ${task.name}`);
        this.updateCodeDisplay(task.code);
        this.updateDisplay();
        
        setTimeout(() => {
            const networkTask = this.createTask('HTTP请求', 'network');
            this.networkTasks.push(networkTask);
            this.highlightThread('network');
            this.log(`网络请求移交给网络线程: ${networkTask.name}`);
            this.updateDisplay();
            
            setTimeout(() => {
                this.networkTasks = this.networkTasks.filter(t => t.id !== networkTask.id);
                const microtask = this.createTask('Fetch回调', 'microtask');
                this.microtaskQueue.push(microtask);
                this.log(`网络请求完成，微任务进入队列: ${microtask.name}`);
                this.updateDisplay();
                this.removeThreadHighlight('network');
            }, 2000);
        }, 500);
        
        if (!this.isRunning) {
            await this.executeNextTask();
        }
    }

    highlightThread(threadType) {
        const threadElement = this.elements[`${threadType}Thread`];
        if (threadElement) {
            threadElement.classList.add('active');
        }
    }

    removeThreadHighlight(threadType) {
        const threadElement = this.elements[`${threadType}Thread`];
        if (threadElement) {
            threadElement.classList.remove('active');
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
        
        const task = this.callStack.pop();
        this.log(`执行: ${task.name}`);
        this.updateDisplay();
        
        await this.sleep(800);
        
        this.log(`完成: ${task.name}`);
        this.updateDisplay();
    }

    async executeMicrotask() {
        if (this.microtaskQueue.length === 0) return;
        
        const task = this.microtaskQueue.shift();
        this.callStack.push(task);
        this.log(`微任务进入执行栈: ${task.name}`);
        this.updateDisplay();
        
        await this.sleep(500);
        await this.executeNextTask();
    }

    async executeMacrotask() {
        let task = null;
        
        if (this.macrotaskQueue.length > 0) {
            task = this.macrotaskQueue.shift();
        } else if (this.eventQueue.length > 0) {
            task = this.eventQueue.shift();
        }
        
        if (task) {
            this.callStack.push(task);
            this.log(`宏任务进入执行栈: ${task.name}`);
            this.updateDisplay();
            
            await this.sleep(500);
            await this.executeNextTask();
        }
    }

    async executeRenderTask() {
        if (this.renderQueue.length === 0) return;
        
        const task = this.renderQueue.shift();
        this.log(`执行渲染任务: ${task.name}`);
        this.updateDisplay();
        
        await this.sleep(1000);
        this.log(`渲染完成: ${task.name}`);
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
        
        this.updateDisplay();
        this.updateStatusDisplay();
        this.updateCodeDisplay('// 所有任务已清空');
        this.log('清空所有任务和队列');
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
