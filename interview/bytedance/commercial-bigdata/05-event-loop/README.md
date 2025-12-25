# JavaScript 事件循环深度解析

## 📝 面试题目

1. **事件循环的原理是什么？**
2. **事件循环相关的代码题**

## 🎯 考察点

1. **异步编程理解**：对JavaScript异步机制的掌握
2. **执行顺序**：理解宏任务和微任务的执行机制
3. **浏览器环境**：理解浏览器的事件循环模型
4. **Node.js环境**：了解Node.js事件循环的特殊性

## 🔄 事件循环基础

### 1. JavaScript是单线程的

```javascript
// JavaScript执行模型
console.log('Start');

// 同步代码立即执行
console.log('Middle');

// 异步代码不会阻塞
setTimeout(() => {
  console.log('Timeout');
}, 0);

console.log('End');

// 输出顺序：Start -> Middle -> End -> Timeout
```

### 2. 调用栈（Call Stack）

```javascript
// 调用栈的执行过程
function first() {
  console.log('First');
  second();
}

function second() {
  console.log('Second');
  third();
}

function third() {
  console.log('Third');
}

first();

// 栈的变化过程：
// push first()
//   push console.log('First')
//   pop
//   push second()
//     push console.log('Second')
//     pop
//     push third()
//       push console.log('Third')
//       pop
//     pop
//   pop
// pop
```

## 🏗️ 事件循环机制

### 1. 核心组件

```javascript
// 事件循环的组成部分：
/*
┌───────────────────────┐
│        Call Stack      │ ← 同步代码执行
├───────────────────────┤
│    Task Queue         │ ← 宏任务队列
│   (Callback Queue)    │
├───────────────────────┤
│     Microtask Queue   │ ← 微任务队列
├───────────────────────┤
│       Web APIs        │ ← 浏览器API（setTimeout等）
└───────────────────────┘
*/
```

### 2. 宏任务（Macrotask）

```javascript
// 常见的宏任务：
// 1. setTimeout / setInterval
// 2. setImmediate (Node.js)
// 3. I/O操作（文件读写、网络请求）
// 4. UI渲染
// 5. requestAnimationFrame

console.log('Script Start');

setTimeout(() => {
  console.log('setTimeout 1');
}, 0);

setTimeout(() => {
  console.log('setTimeout 2');
}, 100);

fetch('/api/data').then(() => {
  console.log('Fetch complete');
});

console.log('Script End');

// 执行顺序：
// 1. Script Start
// 2. Script End
// 3. setTimeout 1 (0ms后)
// 4. Fetch complete (网络请求完成)
// 5. setTimeout 2 (100ms后)
```

### 3. 微任务（Microtask）

```javascript
// 常见的微任务：
// 1. Promise.then/catch/finally
// 2. process.nextTick (Node.js)
// 3. MutationObserver
// 4. queueMicrotask

console.log('Script Start');

Promise.resolve().then(() => {
  console.log('Promise 1');
});

Promise.resolve().then(() => {
  console.log('Promise 2');
  Promise.resolve().then(() => {
    console.log('Promise 2.1');
  });
});

queueMicrotask(() => {
  console.log('Microtask');
});

console.log('Script End');

// 执行顺序：
// 1. Script Start
// 2. Script End
// 3. Promise 1
// 4. Promise 2
// 5. Promise 2.1 (微任务队列中的新微任务)
// 6. Microtask
```

## 🔄 执行顺序详解

### 1. 基本规则

```javascript
// 事件循环执行顺序：
// 1. 执行当前栈中的同步代码
// 2. 执行微任务队列中的所有微任务
// 3. 执行一个宏任务
// 4. 重复步骤2-3

console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => {
    console.log('5');
  }, 0);
});

console.log('6');

// 输出顺序：1 -> 6 -> 4 -> 2 -> 3 -> 5
```

### 2. 复杂示例

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timer 1');
  Promise.resolve().then(() => {
    console.log('Promise 1');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 2');
  setTimeout(() => {
    console.log('Timer 2');
  }, 0);
});

Promise.resolve().then(() => {
  console.log('Promise 3');
});

console.log('End');

// 详细执行流程：
/*
1. 执行同步代码：
   - Start
   - End

2. 微任务队列：
   - Promise 2
   - Promise 3

3. 执行微任务：
   - Promise 2（加入Timer 2到宏任务队列）
   - Promise 3

4. 执行宏任务（Timer 1）：
   - Timer 1
   - 加入Promise 1到微任务队列

5. 执行微任务：
   - Promise 1

6. 执行宏任务（Timer 2）：
   - Timer 2

最终输出：
Start
End
Promise 2
Promise 3
Timer 1
Promise 1
Timer 2
*/
```

## 🧪 经典面试题

### 题目1：基础事件循环

```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

async1();

new Promise(resolve => {
  console.log('promise1');
  resolve();
}).then(() => {
  console.log('promise2');
});

console.log('script end');

// 答案：
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout

// 解析：
// 1. async函数中的await相当于Promise.then的语法糖
// 2. await后面的代码会被包装在微任务中
```

### 题目2：嵌套任务

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
  new Promise(resolve => {
    console.log('4');
    resolve();
  }).then(() => {
    console.log('5');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('6');
  setTimeout(() => {
    console.log('7');
  }, 0);
}).then(() => {
  console.log('8');
});

console.log('9');

// 答案：
// 1
// 9
// 6
// 8
// 2
// 4
// 3
// 5
// 7
```

### 题目3：Promise链和定时器

```javascript
setTimeout(() => {
  console.log('A');
}, 0);

var obj = {
  func: function() {
    setTimeout(function() {
      console.log('B');
    }, 0);
    return new Promise(resolve => {
      console.log('C');
      resolve();
    });
  }
};

obj.func().then(() => {
  console.log('D');
});

console.log('E');

// 答案：
// E
// C
// D
// A
// B
```

## 🌐 浏览器 vs Node.js

### 1. 浏览器事件循环

```javascript
// 浏览器环境
console.log('Start');

setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));

console.log('End');

// 浏览器输出：
// Start
// End
// Promise
// Timeout
```

### 2. Node.js事件循环

```javascript
// Node.js环境（不同版本可能有差异）
const fs = require('fs');

console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);
setImmediate(() => console.log('Immediate 1'));

fs.readFile(__filename, () => {
  console.log('File Read');
  setTimeout(() => console.log('Timeout 2'), 0);
  setImmediate(() => console.log('Immediate 2'));
});

Promise.resolve().then(() => console.log('Promise'));

console.log('End');

// Node.js输出（大致顺序）：
// Start
// End
// Promise
// Timeout 1
// Immediate 1
// File Read
// Immediate 2
// Timeout 2
```

## 🛠️ 实际应用

### 1. 避免阻塞主线程

```javascript
// ❌ 错误：长时间计算阻塞
function badExample() {
  for (let i = 0; i < 1000000000; i++) {
    // 耗时计算
  }
}

// ✅ 正确：使用事件循环分片处理
function goodExample(data, callback) {
  const chunkSize = 1000;
  let index = 0;

  function processChunk() {
    const endIndex = Math.min(index + chunkSize, data.length);

    for (; index < endIndex; index++) {
      // 处理数据
      processData(data[index]);
    }

    if (index < data.length) {
      // 让出控制权
      setTimeout(processChunk, 0);
    } else {
      callback();
    }
  }

  processChunk();
}
```

### 2. 批处理优化

```javascript
class BatchProcessor {
  constructor() {
    this.items = [];
    this.timer = null;
    this.delay = 100;
  }

  add(item) {
    this.items.push(item);

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.process();
      }, this.delay);
    }
  }

  process() {
    // 批量处理
    const items = this.items.splice(0);
    this.timer = null;

    // 处理items...
    console.log(`Processing ${items.length} items`);
  }
}

// 使用示例
const processor = new BatchProcessor();
processor.add({ id: 1 });
processor.add({ id: 2 });
processor.add({ id: 3 });
// 100ms后批量处理
```

### 3. 动画和事件处理

```javascript
// 使用requestAnimationFrame优化动画
function animate() {
  // 更新动画
  updateAnimation();

  // 继续下一帧
  requestAnimationFrame(animate);
}

// 使用微任务优化事件处理
function handleEvent(event) {
  // 立即响应
  quickResponse(event);

  // 延迟处理
  Promise.resolve().then(() => {
    heavyProcessing(event);
  });
}
```

## 🚀 性能优化技巧

### 1. 微任务批处理

```javascript
class MicrotaskBatch {
  constructor() {
    this.tasks = [];
    this.scheduled = false;
  }

  add(task) {
    this.tasks.push(task);
    this.schedule();
  }

  schedule() {
    if (!this.scheduled) {
      this.scheduled = true;
      Promise.resolve().then(() => {
        this.flush();
      });
    }
  }

  flush() {
    const tasks = this.tasks;
    this.tasks = [];
    this.scheduled = false;

    for (const task of tasks) {
      task();
    }
  }
}

// 使用示例
const batch = new MicrotaskBatch();

// 多次添加任务
for (let i = 0; i < 1000; i++) {
  batch.add(() => {
    // 处理任务
  });
}

// 所有任务会在一个微任务中批量执行
```

### 2. 防抖和节流

```javascript
// 使用微任务实现的防抖
function microtaskDebounce(fn, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      Promise.resolve().then(() => fn.apply(this, args));
    }, delay);
  };
}

// 使用宏任务实现的节流
function throttle(fn, delay) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();

    if (now - lastTime > delay) {
      lastTime = now;
      setTimeout(() => fn.apply(this, args), 0);
    }
  };
}
```

## 🎯 面试回答模板

```
事件循环是JavaScript实现异步的核心机制。它的原理可以概括为：

1. **基本概念**：
   - JavaScript是单线程的，但通过事件循环实现异步
   - 有调用栈、任务队列（宏任务）、微任务队列等核心组件

2. **执行流程**：
   - 首先执行调用栈中的同步代码
   - 然后执行微任务队列中的所有微任务
   - 接着执行一个宏任务
   - 重复这个过程

3. **关键区别**：
   - 微任务优先级高于宏任务
   - 每个宏任务执行后会清空所有微任务
   - Promise.then、async/await是微任务
   - setTimeout、setInterval是宏任务

4. **实际应用**：
   - 理解事件循环有助于编写高效的异步代码
   - 避免长时间运行的任务阻塞主线程
   - 合理使用Promise和定时器
```

## 📚 进阶学习

1. **Web Workers**：真正的多线程JavaScript
2. **Atomics API**：共享内存的原子操作
3. **Performance API**：性能监控和优化
4. **Scheduler API**：任务调度优先级

---

**掌握事件循环，是成为JavaScript高手的必经之路！** ⚡