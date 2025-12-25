# 代码练习题

## 📝 题目列表

这里准备了字节跳动面试中可能出现的手写代码题目，涵盖了前端开发的核心知识点。

## 🎯 练习题目

### 1. 实现Promise (简化版)

```javascript
// 实现一个简单的Promise
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(callback => callback());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(callback => callback());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        try {
          if (typeof onFulfilled === 'function') {
            const result = onFulfilled(this.value);
            resolve(result);
          } else {
            resolve(this.value);
          }
        } catch (error) {
          reject(error);
        }
      };

      const handleRejected = () => {
        try {
          if (typeof onRejected === 'function') {
            const result = onRejected(this.reason);
            resolve(result);
          } else {
            reject(this.reason);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === 'fulfilled') {
        setTimeout(handleFulfilled, 0);
      } else if (this.state === 'rejected') {
        setTimeout(handleRejected, 0);
      } else {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      value => {
        onFinally();
        return value;
      },
      reason => {
        onFinally();
        throw reason;
      }
    );
  }

  static resolve(value) {
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;

      if (promises.length === 0) {
        resolve(results);
        return;
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => {
            results[index] = value;
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          },
          reject
        );
      });
    });
  }
}

// 测试
const p1 = new MyPromise((resolve) => {
  setTimeout(() => resolve(1), 1000);
});

p1.then(value => console.log(value)); // 1
```

### 2. 手写防抖和节流

```javascript
// 防抖函数
function debounce(func, delay) {
  let timer = null;

  return function(...args) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 带立即执行的防抖
function debounceImmediate(func, delay) {
  let timer = null;

  return function(...args) {
    const callNow = !timer;

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
    }, delay);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

// 节流函数
function throttle(func, delay) {
  let timer = null;
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();

    if (now - lastTime >= delay) {
      lastTime = now;
      func.apply(this, args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        lastTime = Date.now();
        func.apply(this, args);
      }, delay - (now - lastTime));
    }
  };
}

// 使用requestAnimationFrame的节流
function throttleRAF(func) {
  let ticking = false;

  return function(...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// 测试
const input = document.createElement('input');
document.body.appendChild(input);

input.addEventListener('input', debounce(e => {
  console.log('Debounced:', e.target.value);
}, 500));

window.addEventListener('scroll', throttle(e => {
  console.log('Throttled scroll');
}, 100));
```

### 3. 深拷贝实现

```javascript
// 深拷贝函数
function deepClone(obj, hash = new WeakMap()) {
  // 处理null或非对象
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理正则表达式
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 处理Map
  if (obj instanceof Map) {
    const clone = new Map();
    hash.set(obj, clone);
    obj.forEach((value, key) => {
      clone.set(deepClone(key, hash), deepClone(value, hash));
    });
    return clone;
  }

  // 处理Set
  if (obj instanceof Set) {
    const clone = new Set();
    hash.set(obj, clone);
    obj.forEach(value => {
      clone.add(deepClone(value, hash));
    });
    return clone;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const clone = [];
    hash.set(obj, clone);
    obj.forEach((value, index) => {
      clone[index] = deepClone(value, hash);
    });
    return clone;
  }

  // 检查循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 处理普通对象
  const clone = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, clone);

  // 处理Symbol属性
  const allKeys = Reflect.ownKeys(obj);
  allKeys.forEach(key => {
    clone[key] = deepClone(obj[key], hash);
  });

  return clone;
}

// 使用示例
const obj = {
  a: 1,
  b: {
    c: 2,
    d: new Date(),
    e: /test/g,
    f: new Map([['key', 'value']]),
    g: new Set([1, 2, 3])
  }
};
obj.self = obj; // 循环引用

const cloned = deepClone(obj);
console.log(cloned !== obj); // true
console.log(cloned.b !== obj.b); // true
console.log(cloned.self === cloned); // true
```

### 4. 数组扁平化

```javascript
// 方法1：递归实现
function flatten1(arr) {
  const result = [];

  const helper = (subArr) => {
    for (const item of subArr) {
      if (Array.isArray(item)) {
        helper(item);
      } else {
        result.push(item);
      }
    }
  };

  helper(arr);
  return result;
}

// 方法2：reduce实现
function flatten2(arr) {
  return arr.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? flatten2(cur) : cur);
  }, []);
}

// 方法3：指定深度的扁平化
function flattenWithDepth(arr, depth = 1) {
  return depth > 0
    ? arr.reduce((prev, cur) => {
        return prev.concat(Array.isArray(cur) ? flattenWithDepth(cur, depth - 1) : cur);
      }, [])
    : arr.slice();
}

// 方法4：使用栈实现
function flatten4(arr) {
  const result = [];
  const stack = [...arr];

  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item);
    }
  }

  return result.reverse();
}

// 方法5：原生flat
function flatten5(arr, depth = Infinity) {
  return arr.flat(depth);
}

// 测试
const nested = [1, [2, [3, [4, 5]], 6], 7, [8, 9]];
console.log(flatten1(nested)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(flattenWithDepth(nested, 2)); // [1, 2, 3, [4, 5], 6, 7, 8, 9]
```

### 5. 实现事件总线

```javascript
class EventBus {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    // 返回取消订阅函数
    return () => {
      this.off(eventName, callback);
    };
  }

  // 订阅事件（只执行一次）
  once(eventName, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
  }

  // 取消订阅
  off(eventName, callback) {
    if (!this.events[eventName]) return;

    if (!callback) {
      // 取消所有订阅
      this.events[eventName] = [];
    } else {
      this.events[eventName] = this.events[eventName].filter(
        cb => cb !== callback
      );
    }
  }

  // 触发事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) return;

    this.events[eventName].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event ${eventName}:`, error);
      }
    });
  }

  // 清空所有事件
  clear() {
    this.events = {};
  }

  // 获取事件监听器数量
  listenerCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }
}

// 使用示例
const bus = new EventBus();

const unsubscribe = bus.on('test', (data) => {
  console.log('Received:', data);
});

bus.emit('test', 'Hello World'); // Received: Hello World

bus.once('once', () => {
  console.log('This will only run once');
});

bus.emit('once'); // This will only run once
bus.emit('once'); // Nothing happens

unsubscribe(); // 取消订阅
```

### 6. LRU缓存实现

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      // 移动到最前面（最近使用）
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // 更新现有值
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 删除最久未使用的项
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// 使用链表实现的LRU
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache2 {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _add(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      this._remove(node);
      this._add(node);
      return node.value;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this._remove(node);
      this._add(node);
    } else {
      const node = new Node(key, value);
      this.cache.set(key, node);
      this._add(node);

      if (this.cache.size > this.capacity) {
        const tail = this.tail.prev;
        this._remove(tail);
        this.cache.delete(tail.key);
      }
    }
  }
}

// 测试
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // 1
cache.put(3, 3); // 移除key 2
console.log(cache.get(2)); // -1
```

### 7. 实现发布订阅模式

```javascript
class Publisher {
  constructor() {
    this.subscribers = [];
  }

  // 订阅
  subscribe(subscriber) {
    this.subscribers.push(subscriber);
    return () => {
      const index = this.subscribers.indexOf(subscriber);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // 发布
  publish(message) {
    this.subscribers.forEach(subscriber => {
      subscriber.update(message);
    });
  }
}

// 观察者
class Subscriber {
  constructor(name) {
    this.name = name;
  }

  update(message) {
    console.log(`${this.name} received: ${message}`);
  }
}

// 事件驱动的发布订阅
class EventDrivenPubSub {
  constructor() {
    this.topics = {};
  }

  // 订阅主题
  subscribe(topic, subscriber) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(subscriber);

    return () => {
      this.unsubscribe(topic, subscriber);
    };
  }

  // 取消订阅
  unsubscribe(topic, subscriber) {
    if (!this.topics[topic]) return;

    const index = this.topics[topic].indexOf(subscriber);
    if (index > -1) {
      this.topics[topic].splice(index, 1);
    }

    if (this.topics[topic].length === 0) {
      delete this.topics[topic];
    }
  }

  // 发布消息
  async publish(topic, message) {
    if (!this.topics[topic]) return [];

    const subscribers = this.topics[topic];
    const results = [];

    for (const subscriber of subscribers) {
      try {
        const result = await subscriber.handle(message);
        results.push(result);
      } catch (error) {
        console.error(`Error in subscriber ${subscriber.name}:`, error);
      }
    }

    return results;
  }

  // 广播到所有主题
  broadcast(message) {
    Object.keys(this.topics).forEach(topic => {
      this.publish(topic, { ...message, topic });
    });
  }
}

// 测试
const pubSub = new EventDrivenPubSub();

const subscriber1 = {
  name: 'Subscriber 1',
  handle: async (message) => {
    console.log(`${subscriber1.name} processing ${message}`);
    return 'Processed by 1';
  }
};

pubSub.subscribe('news', subscriber1);
pubSub.publish('news', 'Breaking news!');
```

### 8. 柯里化函数

```javascript
// 普通柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

// 带占位符的柯里化
function curryWithPlaceholder(fn, placeholder = '_') {
  return function curried(...args) {
    // 替换占位符
    const replacePlaceholders = (args, newArgs) => {
      let replaced = 0;
      return args.map(arg => {
        if (arg === placeholder && replaced < newArgs.length) {
          return newArgs[replaced++];
        }
        return arg;
      });
    };

    // 检查是否还有占位符
    const hasPlaceholder = args.some(arg => arg === placeholder);

    if (!hasPlaceholder && args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function(...nextArgs) {
      const replacedArgs = replacePlaceholders(args, nextArgs);
      return curried.apply(this, replacedArgs);
    };
  };
}

// 使用示例
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6

const curriedAddWithPlaceholder = curryWithPlaceholder(add);
console.log(curriedAddWithPlaceholder(1, '_', 3)(2)); // 6
```

### 9. 实现虚拟滚动

```javascript
class VirtualScroll {
  constructor(options) {
    this.container = options.container;
    this.itemHeight = options.itemHeight;
    this.data = options.data;
    this.renderItem = options.renderItem;

    this.visibleCount = Math.ceil(this.container.clientHeight / this.itemHeight);
    this.startIndex = 0;
    this.endIndex = this.visibleCount;

    this.init();
  }

  init() {
    // 创建滚动容器
    this.content = document.createElement('div');
    this.content.style.height = `${this.data.length * this.itemHeight}px`;
    this.content.style.position = 'relative';

    // 创建视口
    this.viewport = document.createElement('div');
    this.viewport.style.position = 'relative';

    this.content.appendChild(this.viewport);
    this.container.appendChild(this.content);

    // 绑定滚动事件
    this.container.addEventListener('scroll', this.handleScroll.bind(this));

    // 初始渲染
    this.render();
  }

  handleScroll() {
    const scrollTop = this.container.scrollTop;
    this.startIndex = Math.floor(scrollTop / this.itemHeight);
    this.endIndex = this.startIndex + this.visibleCount;

    this.render();
  }

  render() {
    // 清空视口
    this.viewport.innerHTML = '';

    // 渲染可见项
    for (let i = this.startIndex; i <= this.endIndex && i < this.data.length; i++) {
      const item = this.renderItem(this.data[i], i);
      item.style.position = 'absolute';
      item.style.top = `${i * this.itemHeight}px`;
      item.style.width = '100%';
      item.style.height = `${this.itemHeight}px`;
      this.viewport.appendChild(item);
    }
  }

  updateData(newData) {
    this.data = newData;
    this.content.style.height = `${this.data.length * this.itemHeight}px`;
    this.render();
  }
}

// 使用示例
const container = document.getElementById('scroll-container');
const data = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

const virtualScroll = new VirtualScroll({
  container,
  itemHeight: 50,
  data,
  renderItem: (item, index) => {
    const div = document.createElement('div');
    div.textContent = `${index}: ${item.name}`;
    div.style.borderBottom = '1px solid #eee';
    div.style.padding = '10px';
    return div;
  }
});
```

### 10. 实现简单的Promise.allSettled

```javascript
// Promise.allSettled Polyfill
if (!Promise.allSettled) {
  Promise.allSettled = function(promises) {
    return new Promise((resolve) => {
      const results = [];
      let completed = 0;

      if (promises.length === 0) {
        resolve(results);
        return;
      }

      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(
          value => {
            results[index] = { status: 'fulfilled', value };
            completed++;
            if (completed === promises.length) {
              resolve(results);
            }
          },
          reason => {
            results[index] = { status: 'rejected', reason };
            completed++;
            if (completed === promises.length) {
              resolve(results);
            }
          }
        );
      });
    });
  };
}

// 测试
const promises = [
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3),
  new Promise(resolve => setTimeout(() => resolve(4), 1000))
];

Promise.allSettled(promises).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'fulfilled', value: 4 }
  // ]
});
```

## 💡 练习建议

1. **理解原理**：不只是复制代码，要理解每个实现背后的原理
2. **举一反三**：尝试用不同的方法实现相同的功能
3. **优化改进**：思考如何优化代码的性能和可读性
4. **实际应用**：在实际项目中尝试使用这些实现
5. **总结归纳**：整理常见的编程模式和技巧

## 📚 进阶练习

1. 实现一个简单的响应式系统（类似Vue的响应式）
2. 实现一个简易的虚拟DOM
3. 实现一个WebRTC视频通话应用
4. 实现一个WebWorker任务调度器
5. 实现一个Canvas绘图引擎

---

**多写代码，多思考，多总结！** 💪