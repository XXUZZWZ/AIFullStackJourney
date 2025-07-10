# JavaScript 防抖与节流：从原理到实践的完整指南

## 🎯 引言

在现代 Web 开发中，用户交互事件（如输入、滚动、点击等）往往会高频触发，如果不加以控制，可能会导致：

- 🔥 **性能问题**：频繁执行复杂操作（如 API 请求、DOM 操作）
- 💰 **资源浪费**：无效的网络请求增加服务器负担
- 😵 **用户体验差**：页面卡顿、响应延迟

**防抖（Debounce）**和**节流（Throttle）**是解决这类问题的两种重要策略。

### 核心概念对比

| 特性 | 防抖 (Debounce) | 节流 (Throttle) |
|------|----------------|----------------|
| **执行时机** | 停止触发后延迟执行 | 固定时间间隔执行 |
| **触发频率** | 可能只执行一次 | 保证定期执行 |
| **典型场景** | 搜索框输入、按钮防重复点击 | 滚动事件、鼠标移动 |
| **核心思想** | "等等再执行" | "限制执行频率" |

## 🔍 防抖 (Debounce) 深入解析

### 什么是防抖？

**防抖**是一种控制函数执行频率的技术，核心思想是：**在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时**。

```javascript
// 防抖的生活类比：电梯等待
// 电梯门即将关闭时，如果有人按了按钮，就重新开始等待
// 只有在没有人按按钮的一段时间后，门才会关闭
```

### 防抖的工作原理

```javascript
// 时间轴演示
// 用户输入: a -> b -> c -> d -> (停止输入)
// 时间点:   0ms  100ms  200ms  300ms  800ms
// 防抖效果: 清除 -> 清除 -> 清除 -> 清除 -> 执行(500ms后)
```

### 防抖的多种实现方式

#### 1. 基础版本 - 函数属性存储

```javascript
function debounce(fn, delay) {
  return function(args) {
    const that = this; // 保存 this 上下文
    clearTimeout(fn.id); // 清除之前的定时器
    fn.id = setTimeout(() => {
      fn.call(that, args); // 保持 this 指向
    }, delay);
  };
}

// 使用示例
const debouncedSearch = debounce(function(keyword) {
  console.log('搜索:', keyword);
}, 300);
```

#### 2. 闭包版本 - 更优雅的实现

```javascript
function debounce(fn, delay) {
  let timeoutId = null; // 使用闭包存储定时器ID
  
  return function(...args) {
    const that = this;
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}
```

#### 3. 立即执行版本 - 首次触发立即执行

```javascript
function debounce(fn, delay, immediate = false) {
  let timeoutId = null;
  
  return function(...args) {
    const that = this;
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) fn.apply(that, args);
    }, delay);
    
    if (callNow) fn.apply(that, args);
  };
}
```

#### 4. 带取消功能的完整版本

```javascript
function debounce(fn, delay, immediate = false) {
  let timeoutId = null;
  
  const debounced = function(...args) {
    const that = this;
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) fn.apply(that, args);
    }, delay);
    
    if (callNow) fn.apply(that, args);
  };
  
  // 取消防抖
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
  };
  
  // 立即执行
  debounced.flush = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      fn.apply(this, arguments);
    }
  };
  
  return debounced;
}
```

### 实际应用场景

#### 1. 搜索框输入优化

```javascript
// 搜索建议API调用
function searchSuggest(keyword) {
  return fetch(`/api/search?q=${keyword}`)
    .then(response => response.json())
    .then(data => {
      // 更新搜索建议UI
      updateSearchSuggestions(data.suggestions);
    });
}

const debouncedSearch = debounce(searchSuggest, 300);

// HTML: <input id="search" type="text" placeholder="搜索...">
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', (e) => {
  const keyword = e.target.value.trim();
  if (keyword) {
    debouncedSearch(keyword);
  }
});
```

#### 2. 按钮防重复点击

```javascript
// 表单提交防抖
function submitForm(formData) {
  return fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  }).then(response => {
    if (response.ok) {
      showMessage('提交成功！', 'success');
    } else {
      showMessage('提交失败，请重试', 'error');
    }
  });
}

const debouncedSubmit = debounce(submitForm, 1000, true); // 立即执行版本

// HTML: <button id="submit-btn">提交</button>
const submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener('click', () => {
  const formData = getFormData();
  debouncedSubmit(formData);
});
```

#### 3. 窗口大小调整优化

```javascript
// 响应式布局调整
function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // 重新计算布局
  if (width < 768) {
    document.body.classList.add('mobile');
  } else {
    document.body.classList.remove('mobile');
  }
  
  // 更新图表尺寸
  updateChartSize(width, height);
}

const debouncedResize = debounce(handleResize, 150);
window.addEventListener('resize', debouncedResize);
```

## ⏱️ 节流 (Throttle) 深入解析

### 什么是节流？

**节流**是另一种控制函数执行频率的技术，核心思想是：**在固定时间间隔内只执行一次函数，即使在这个时间间隔内触发多次**。

```javascript
// 节流的生活类比：地铁发车
// 无论有多少人在站台等待，地铁都是每隔5分钟发一班车
// 不会因为人多就加快发车，也不会因为人少就停止发车
```

### 节流的工作原理

```javascript
// 时间轴演示（节流间隔: 100ms）
// 触发时间:   0ms  20ms  40ms  60ms  80ms  120ms  140ms
// 节流效果: 执行 -> 忽略 -> 忽略 -> 忽略 -> 忽略 -> 执行 -> 忽略
```

### 节流的多种实现方式

#### 1. 时间戳版本 - 简单直接

```javascript
function throttle(fn, delay) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastTime > delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用示例
const throttledScroll = throttle(function() {
  console.log('页面滚动中...');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

#### 2. 定时器版本 - 保证末尾执行

```javascript
function throttle(fn, delay) {
  let timeoutId = null;
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);
    
    clearTimeout(timeoutId);
    
    if (remaining <= 0) {
      // 可以立即执行
      lastTime = now;
      fn.apply(this, args);
    } else {
      // 设置定时器，保证末尾执行
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

#### 3. 完整版本 - 可配置首尾执行

```javascript
function throttle(fn, delay, options = {}) {
  const { leading = true, trailing = true } = options;
  let timeoutId = null;
  let lastTime = 0;
  
  const throttled = function(...args) {
    const now = Date.now();
    
    // 禁用首次执行
    if (!leading && lastTime === 0) {
      lastTime = now;
    }
    
    const remaining = delay - (now - lastTime);
    
    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      lastTime = now;
      fn.apply(this, args);
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        lastTime = leading ? Date.now() : 0;
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
  
  // 取消节流
  throttled.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastTime = 0;
  };
  
  return throttled;
}
```

### 节流的实际应用场景

#### 1. 滚动事件优化

```javascript
// 无限滚动加载
function loadMoreContent() {
  const scrollTop = window.pageYOffset;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.offsetHeight;
  
  if (scrollTop + windowHeight >= docHeight - 100) {
    // 接近底部时加载更多内容
    fetchMoreData();
  }
}

const throttledLoadMore = throttle(loadMoreContent, 200);
window.addEventListener('scroll', throttledLoadMore);
```

#### 2. 鼠标移动事件

```javascript
// 鼠标跟随效果
function updateMousePosition(event) {
  const tooltip = document.getElementById('tooltip');
  tooltip.style.left = event.clientX + 10 + 'px';
  tooltip.style.top = event.clientY + 10 + 'px';
}

const throttledMouseMove = throttle(updateMousePosition, 16); // ~60fps
document.addEventListener('mousemove', throttledMouseMove);
```

#### 3. 网络请求控制

```javascript
// 实时保存功能
function autoSave(content) {
  return fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  }).then(response => {
    if (response.ok) {
      showStatus('保存成功', 'success');
    }
  }).catch(error => {
    showStatus('保存失败', 'error');
  });
}

const throttledSave = throttle(autoSave, 3000);

// 编辑器内容变化时自动保存
const editor = document.getElementById('editor');
editor.addEventListener('input', (e) => {
  throttledSave(e.target.value);
});
```

## 🔥 深入技术分析

### 为什么要使用 fn.id 保存定时器？

```javascript
// 方法一：全局变量（不推荐）
let globalTimerId;
function debounce(fn, delay) {
  return function(args) {
    clearTimeout(globalTimerId); // 全局变量污染
    globalTimerId = setTimeout(() => fn(args), delay);
  };
}

// 方法二：闭包变量（推荐）
function debounce(fn, delay) {
  let timerId; // 闭包保存，不污染全局
  return function(args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(args), delay);
  };
}

// 方法三：函数属性（合理）
function debounce(fn, delay) {
  return function(args) {
    clearTimeout(fn.id); // 利用函数对象特性
    fn.id = setTimeout(() => fn(args), delay);
  };
}
```

**优缺点对比：**

| 方法 | 优点 | 缺点 |
|------|------|------|
| 全局变量 | 简单直接 | 全局污染，多实例冲突 |
| 闭包变量 | 没有污染，封装好 | 占用内存，每个实例都有独立作用域 |
| 函数属性 | 内存友好，利用函数对象特性 | 修改了原函数对象 |

### this 上下文问题深入分析

```javascript
// 问题演示：不处理 this
function simpleDebounce(fn, delay) {
  return function(args) {
    setTimeout(() => fn(args), delay); // this 丢失
  };
}

const obj = {
  name: 'MyObject',
  greet: simpleDebounce(function() {
    console.log(`Hello, I'm ${this.name}`); // this 为 undefined
  }, 300)
};

obj.greet(); // 输出: "Hello, I'm undefined"
```

```javascript
// 正确处理：保存并传递 this
function correctDebounce(fn, delay) {
  return function(...args) {
    const context = this; // 保存当前 this
    clearTimeout(fn.id);
    fn.id = setTimeout(() => {
      fn.apply(context, args); // 使用 apply 传递 this
    }, delay);
  };
}

const obj = {
  name: 'MyObject',
  greet: correctDebounce(function() {
    console.log(`Hello, I'm ${this.name}`); // this 正确
  }, 300)
};

obj.greet(); // 输出: "Hello, I'm MyObject"
```

### 箭头函数与普通函数的区别

```javascript
// 箭头函数版本：自动继承外层 this
const debounceArrow = (fn, delay) => {
  return (...args) => {
    clearTimeout(fn.id);
    fn.id = setTimeout(() => fn(...args), delay);
  };
};

// 普通函数版本：需要手动处理 this
function debounceRegular(fn, delay) {
  return function(...args) {
    const context = this;
    clearTimeout(fn.id);
    fn.id = setTimeout(() => fn.apply(context, args), delay);
  };
}
```
## ⚡ 性能对比与优化

### 防抖 vs 节流效果对比

```javascript
// 性能测试代码
function performanceTest() {
  let normalCount = 0;
  let debounceCount = 0;
  let throttleCount = 0;
  
  // 普通函数
  function normalHandler() {
    normalCount++;
  }
  
  // 防抖函数
  const debouncedHandler = debounce(() => {
    debounceCount++;
  }, 100);
  
  // 节流函数
  const throttledHandler = throttle(() => {
    throttleCount++;
  }, 100);
  
  // 模拟高频事件（1000次触发，间隔10ms）
  let i = 0;
  const interval = setInterval(() => {
    normalHandler();
    debouncedHandler();
    throttledHandler();
    
    if (++i >= 1000) {
      clearInterval(interval);
      
      setTimeout(() => {
        console.log(`普通函数执行次数: ${normalCount}`);
        console.log(`防抖函数执行次数: ${debounceCount}`);
        console.log(`节流函数执行次数: ${throttleCount}`);
      }, 200);
    }
  }, 10);
}

// 运行结果示例：
// 普通函数执行次数: 1000
// 防抖函数执行次数: 1
// 节流函数执行次数: 100
```

### 内存性能优化

```javascript
// 内存泄漏风险的防抖实现
function memoryLeakDebounce(fn, delay) {
  const timers = new Map(); // 可能造成内存泄漏
  
  return function(...args) {
    const key = JSON.stringify(args);
    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(() => {
      fn.apply(this, args);
      timers.delete(key); // 记得清理
    }, delay));
  };
}

// 内存友好的防抖实现
function memoryFriendlyDebounce(fn, delay) {
  let timeoutId = null;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 重用实例的防抖实现
class DebounceManager {
  constructor() {
    this.debounces = new Map();
  }
  
  create(key, fn, delay) {
    if (!this.debounces.has(key)) {
      let timeoutId = null;
      
      this.debounces.set(key, (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      });
    }
    
    return this.debounces.get(key);
  }
  
  clear(key) {
    this.debounces.delete(key);
  }
}

// 使用示例
const debounceManager = new DebounceManager();
const searchDebounce = debounceManager.create('search', handleSearch, 300);
const saveDebounce = debounceManager.create('save', handleSave, 1000);
```

### 不同场景下的选择建议

```javascript
// 场景一：搜索框输入 - 使用防抖
const searchInput = document.getElementById('search');
const debouncedSearch = debounce(performSearch, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// 场景二：滚动加载 - 使用节流
const throttledLoadMore = throttle(loadMoreContent, 500);

window.addEventListener('scroll', throttledLoadMore);

// 场景三：按钮点击 - 使用防抖（立即执行）
const submitButton = document.getElementById('submit');
const debouncedSubmit = debounce(submitForm, 1000, true);

submitButton.addEventListener('click', debouncedSubmit);

// 场景四：窗口大小调整 - 使用防抖
const debouncedResize = debounce(handleResize, 150);

window.addEventListener('resize', debouncedResize);
```

## 📚 最佳实践指南

### 1. 合理的时间间隔设置

```javascript
// 不同场景的推荐间隔
const DELAYS = {
  SEARCH: 300,        // 搜索输入
  BUTTON_CLICK: 1000, // 按钮点击防重复
  SCROLL: 100,        // 滚动事件
  RESIZE: 150,        // 窗口大小调整
  AUTO_SAVE: 2000,    // 自动保存
  MOUSE_MOVE: 16,     // 鼠标移动 (~60fps)
  API_CALL: 500       // API调用防抖
};

// 根据网络条件动态调整
function getAdaptiveDelay(baseDelay) {
  const connection = navigator.connection;
  if (connection) {
    const { effectiveType } = connection;
    switch (effectiveType) {
      case '2g': return baseDelay * 2;
      case '3g': return baseDelay * 1.5;
      case '4g': return baseDelay;
      default: return baseDelay;
    }
  }
  return baseDelay;
}

const adaptiveSearchDelay = getAdaptiveDelay(DELAYS.SEARCH);
const debouncedSearch = debounce(performSearch, adaptiveSearchDelay);
```

### 2. 错误处理和重试机制

```javascript
function robustDebounce(fn, delay, maxRetries = 3) {
  let timeoutId = null;
  let retryCount = 0;
  
  return function(...args) {
    const executeWithRetry = async () => {
      try {
        await fn.apply(this, args);
        retryCount = 0; // 成功后重置重试次数
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.warn(`执行失败，第${retryCount}次重试:`, error);
          
          // 指数退避重试
          const retryDelay = delay * Math.pow(2, retryCount - 1);
          timeoutId = setTimeout(executeWithRetry, retryDelay);
        } else {
          console.error('执行失败，已达到最大重试次数:', error);
          retryCount = 0;
        }
      }
    };
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(executeWithRetry, delay);
  };
}
```

### 3. 组合使用模式

```javascript
// 防抖 + 节流组合使用
function debounceThrottle(fn, debounceDelay, throttleDelay) {
  const debouncedFn = debounce(fn, debounceDelay);
  const throttledFn = throttle(debouncedFn, throttleDelay);
  
  return throttledFn;
}

// 实际应用：高频搜索场景
const searchHandler = debounceThrottle(
  performSearch,
  300,  // 防抖延迟
  1000  // 节流间隔
);

// 保证最多1秒执行一次，但在停止输入300ms后也会执行
searchInput.addEventListener('input', (e) => {
  searchHandler(e.target.value);
});
```

### 4. React Hook 封装

```javascript
// React 防抖 Hook
import { useCallback, useRef } from 'react';

function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

// React 节流 Hook
function useThrottle(callback, delay) {
  const lastRunRef = useRef(0);
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastRunRef.current > delay) {
      lastRunRef.current = now;
      callback(...args);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        callback(...args);
      }, delay - (now - lastRunRef.current));
    }
  }, [callback, delay]);
}

// 使用示例
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const debouncedSearch = useDebounce(async (searchQuery) => {
    if (searchQuery.trim()) {
      const response = await fetch(`/api/search?q=${searchQuery}`);
      const data = await response.json();
      setResults(data.results);
    } else {
      setResults([]);
    }
  }, 300);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="搜索..."
      />
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 🔧 高级技巧与应用

### 1. 可取消的防抖节流

```javascript
// 带取消功能的高级防抖
function advancedDebounce(fn, delay, options = {}) {
  const { maxWait = 0, leading = false, trailing = true } = options;
  
  let timeoutId = null;
  let maxTimeoutId = null;
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  let result;
  
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = fn.apply(thisArg, args);
    return result;
  }
  
  function leadingEdge(time) {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, delay);
    return leading ? invokeFunc(time) : result;
  }
  
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - timeSinceLastCall;
    
    return maxWait
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }
  
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    return (lastCallTime === 0 ||
            timeSinceLastCall >= delay ||
            timeSinceLastCall < 0 ||
            (maxWait && timeSinceLastInvoke >= maxWait));
  }
  
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  }
  
  function trailingEdge(time) {
    timeoutId = null;
    
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  
  let lastArgs, lastThis;
  
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    
    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait) {
        timeoutId = setTimeout(timerExpired, delay);
        return invokeFunc(lastCallTime);
      }
    }
    
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, delay);
    }
    
    return result;
  }
  
  debounced.cancel = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId !== null) {
      clearTimeout(maxTimeoutId);
    }
    
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeoutId = maxTimeoutId = undefined;
  };
  
  debounced.flush = function() {
    return timeoutId === null ? result : trailingEdge(Date.now());
  };
  
  debounced.pending = function() {
    return timeoutId !== null;
  };
  
  return debounced;
}
```

### 2. 智能自适应防抖

```javascript
// 根据用户行为自适应调整延迟时间
function adaptiveDebounce(fn, baseDelay = 300) {
  let consecutiveCalls = 0;
  let lastCallTime = 0;
  let timeoutId = null;
  
  return function(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    // 如果调用间隔短，增加连续调用计数
    if (timeSinceLastCall < baseDelay) {
      consecutiveCalls++;
    } else {
      consecutiveCalls = 1;
    }
    
    lastCallTime = now;
    
    // 根据连续调用次数动态调整延迟
    const adaptiveDelay = Math.min(
      baseDelay * Math.pow(1.5, Math.min(consecutiveCalls - 1, 5)),
      baseDelay * 10
    );
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      consecutiveCalls = 0;
      fn.apply(this, args);
    }, adaptiveDelay);
  };
}
```

### 3. 异步防抖处理

```javascript
// 异步防抖处理
function asyncDebounce(asyncFn, delay) {
  let timeoutId = null;
  let currentPromise = null;
  let abortController = null;
  
  return function(...args) {
    return new Promise((resolve, reject) => {
      // 取消之前的请求
      if (abortController) {
        abortController.abort();
      }
      
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(async () => {
        try {
          abortController = new AbortController();
          const result = await asyncFn.apply(this, [...args, abortController.signal]);
          resolve(result);
        } catch (error) {
          if (error.name !== 'AbortError') {
            reject(error);
          }
        }
      }, delay);
    });
  };
}
```

## 🔥 面试题全解析

### 1. 手写防抖函数

**面试官可能的问法：**
> 请手写实现一个防抖函数，并解释其工作原理。

```javascript
// 基础版本
function debounce(fn, delay) {
  let timeoutId = null;
  
  return function(...args) {
    const context = this;
    
    // 清除之前的定时器
    clearTimeout(timeoutId);
    
    // 设置新的定时器
    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// 进阶版本：立即执行选项
function debounce(fn, delay, immediate = false) {
  let timeoutId = null;
  
  return function(...args) {
    const context = this;
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        fn.apply(context, args);
      }
    }, delay);
    
    if (callNow) {
      fn.apply(context, args);
    }
  };
}
```

**关键点说明：**
1. **闭包保存状态**：使用闭包保存 `timeoutId`
2. **清除定时器**：每次调用都清除之前的定时器
3. **this 上下文**：使用 `apply` 保持原函数的 this 指向
4. **参数传递**：使用剩余参数和扩展运算符处理参数

### 2. 手写节流函数

**面试官可能的问法：**
> 请手写实现一个节流函数，并说明与防抖的区别。

```javascript
// 时间戳版本
function throttle(fn, delay) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 定时器版本（保证末尾执行）
function throttle(fn, delay) {
  let timeoutId = null;
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    const context = this;
    
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(context, args);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        fn.apply(context, args);
      }, delay - (now - lastTime));
    }
  };
}
```

### 3. 常见面试问题

**Q1: 防抖和节流的区别是什么？**

A:
- **防抖**：重新计时，只有在停止触发一段时间后才执行
- **节流**：固定时间间隔执行，不管触发频率如何

**Q2: 什么情况下使用防抖，什么情况下使用节流？**

A:
- **防抖**：搜索框输入、按钮防重复点击、窗口大小调整
- **节流**：滚动事件、鼠标移动、实时保存

**Q3: 为什么要保存 this 上下文？**

A:
```javascript
// 问题演示
const obj = {
  name: 'test',
  method: debounce(function() {
    console.log(this.name); // 如果不处理，this 为 undefined
  }, 300)
};

// 解决方案：在防抖函数内保存并传递 this
function debounce(fn, delay) {
  return function(...args) {
    const context = this; // 保存当前 this
    clearTimeout(fn.id);
    fn.id = setTimeout(() => {
      fn.apply(context, args); // 传递正确的 this
    }, delay);
  };
}
```

**Q4: 如何实现一个可以取消的防抖函数？**

A:
```javascript
function debounce(fn, delay) {
  let timeoutId = null;
  
  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
  
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
  };
  
  return debounced;
}
```

### 4. 复杂面试题

**Q: 如何实现一个同时支持防抖和节流的函数？**

A:
```javascript
function debounceThrottle(fn, debounceDelay, throttleDelay) {
  let debounceTimer = null;
  let throttleTimer = null;
  let lastExecTime = 0;
  
  return function(...args) {
    const now = Date.now();
    const context = this;
    
    // 清除防抖定时器
    clearTimeout(debounceTimer);
    
    // 节流逻辑：检查是否可以执行
    if (now - lastExecTime >= throttleDelay) {
      lastExecTime = now;
      fn.apply(context, args);
    } else {
      // 设置防抖定时器
      debounceTimer = setTimeout(() => {
        lastExecTime = Date.now();
        fn.apply(context, args);
      }, debounceDelay);
    }
  };
}
```

## 📝 总结与最佳实践

### 快速选择指南

| 场景 | 推荐方案 | 延迟时间 | 原因 |
|------|----------|----------|------|
| 搜索框输入 | 防抖 | 300ms | 等待用户输入完成 |
| 按钮点击 | 防抖(立即执行) | 1000ms | 防止重复提交 |
| 滚动事件 | 节流 | 100ms | 保持流畅体验 |
| 窗口大小调整 | 防抖 | 150ms | 避免不必要的重算 |
| 自动保存 | 节流 | 2000ms | 定期保存数据 |
| 鼠标移动 | 节流 | 16ms | 保持 60fps |

### 性能优化建议

1. **选择合适的延迟时间**
2. **避免在高频事件中使用复杂逻辑**
3. **使用对象池管理多个防抖实例**
4. **适当使用 Web Worker 处理计算密集任务**
5. **结合 requestAnimationFrame 优化动画相关操作**

### 最终建议

- **理解原理**：深入理解防抖和节流的工作机制
- **合理应用**：根据具体场景选择合适的方案
- **性能监控**：在实际项目中监控性能表现
- **持续优化**：根据用户反馈调整参数

防抖和节流是前端性能优化的重要手段，掌握它们的原理和应用对于打造高性能的 Web 应用至关重要。希望这篇文章能帮助您更好地理解和应用这些技术！

---

*本文章介绍了防抖和节流的完整知识体系，从基础原理到高级应用，从性能优化到面试技巧，全面覆盖了实际开发中可能遇到的各种情况。*