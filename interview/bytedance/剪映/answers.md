# 剪映部门面试题答案

## 一面答案

### 基础/学习类

#### 2. JS中异步的概念是什么？

**核心概念：**
异步是指一个任务发起后，不会立即等待其完成，而是继续执行后续代码。当任务完成时，通过回调函数、Promise等方式通知主线程。

**为什么需要异步：**
JS是单线程的，如果有耗时操作（如网络请求、文件读写）同步执行，会阻塞整个线程，导致页面卡死。异步机制让JS可以处理这类耗时操作而不阻塞主线程。

**异步模式：**
- 回调函数
- Promise
- async/await
- 事件监听
- 发布/订阅

---

#### 3. 为什么JS是单线程还需要事件循环？

**JS为什么是单线程：**
JS作为浏览器脚本语言，主要用途是与用户交互和操作DOM。如果多线程，多个线程同时操作DOM会引发复杂的同步问题。单线程简化了模型，避免了复杂的并发控制。

**为什么需要事件循环：**
虽然JS是单线程的，但有很多异步任务（网络请求、定时器、I/O操作）。事件循环机制让JS能够：

1. **不阻塞主线程**：将耗时任务交给浏览器/Node的其他线程处理
2. **协调任务执行**：确定何时执行异步任务的回调
3. **保证执行顺序**：宏任务和微任务的正确调度

**事件循环流程：**
1. 执行同步代码（宏任务）
2. 同步代码执行完毕，栈清空
3. 执行所有微任务（Microtask）
4. 微任务清空后，渲染页面（浏览器环境）
5. 取下一个宏任务执行
6. 重复2-5

---

#### 4. 栈内存和堆内存的差异？

| 特性 | 栈内存（Stack） | 堆内存（Heap） |
|------|----------------|---------------|
| **存储内容** | 基本类型、引用类型的地址 | 对象、数组等引用类型 |
| **访问速度** | 快（直接访问，LIFO） | 慢（间接访问，随机存取） |
| **空间大小** | 小，由系统自动分配 | 大，动态分配 |
| **分配释放** | 自动，按顺序 | 手动或GC回收 |
| **数据结构** | 线性、有序 | 树状、无序 |

**为什么数组在堆内存：**
- 数组大小可变，可能动态增长
- 数组可能存储大量数据
- 堆内存可以灵活分配较大空间
- 栈内存空间有限，不适合存放大对象

---

#### 5. 为什么数组要存在堆内存而不是栈内存？

1. **大小不确定**：数组长度可变，可能动态增长
2. **空间需求大**：数组可能包含大量元素，栈空间有限（通常几MB）
3. **生命周期灵活**：数组可能需要在函数外部继续使用
4. **赋值特性**：数组是引用类型，赋值时复制引用而非数据，需要堆存储支持

---

#### 6. JS中有哪些基本数据类型？

ES6标准下的7种基本类型：

1. **Undefined** - 未定义
2. **Null** - 空值
3. **Boolean** - 布尔值（true/false）
4. **Number** - 数字（整数、浮点数、NaN、Infinity）
5. **String** - 字符串
6. **Symbol** - 唯一标识符（ES6新增）
7. **BigInt** - 大整数（ES2020新增）

**引用类型：**
- Object（包括Array、Function、Date、RegExp等）

**判断类型方法：**
- `typeof` - 区分基本类型（null除外返回object）
- `Object.prototype.toString.call()` - 精确判断所有类型
- `instanceof` - 判断引用类型的具体构造函数

---

#### 7. 函数内部的this含义是什么？

**this的核心：**
this是函数执行时的上下文对象，指向函数的调用者。

**this绑定规则（优先级从高到低）：**

1. **new绑定** - new调用时指向新创建的对象
2. **显式绑定** - call/apply/bind强制指定this
3. **隐式绑定** - 作为对象方法调用时指向该对象
4. **默认绑定** - 独立调用时指向全局对象（严格模式为undefined）

**特殊情况：**
- 箭头函数：没有自己的this，继承外层作用域
- DOM事件处理：指向绑定事件的元素
- setTimeout/setInterval：默认指向全局对象（window）

---

#### 8. call、apply、bind的区别？

| 方法 | 参数形式 | 执行时机 | 返回值 |
|------|----------|----------|--------|
| **call** | 参数列表（fn.call(thisArg, arg1, arg2)） | 立即执行 | 函数返回值 |
| **apply** | 参数数组（fn.apply(thisArg, [args])） | 立即执行 | 函数返回值 |
| **bind** | 参数列表（fn.bind(thisArg, arg1, arg2)） | 返回新函数，不立即执行 | 新函数 |

**应用场景：**
```javascript
// call - 方法借用
const obj = { name: 'Alice' };
function greet(greeting) {
  console.log(`${greeting}, I'm ${this.name}`);
}
greet.call(obj, 'Hello'); // Hello, I'm Alice

// apply - 数组作为参数
Math.max.apply(null, [1, 3, 2]); // 3

// bind - 永久绑定this，便于回调
const boundGreet = greet.bind(obj, 'Hi');
boundGreet(); // Hi, I'm Alice
```

**手写实现核心思路：**
- call/apply：临时将函数作为对象的属性调用
- bind：返回一个新函数，内部调用原函数并绑定this

---

#### 9. TypeScript联合类型和交叉类型的概念？

**联合类型（Union Type）：**
表示值可以是多种类型之一，使用 `|` 连接。

```typescript
// 变量可以是string或number
let value: string | number;
value = "hello";
value = 123;

// 联合类型只能访问所有类型的公共属性
function printId(id: string | number) {
  console.log(id.toString()); // OK
  // console.log(id.length);  // Error: number没有length
}
```

**交叉类型（Intersection Type）：**
表示同时具备多个类型的特性，使用 `&` 连接。

```typescript
// 同时具有Person和Serializable的特性
interface Person {
  name: string;
}
interface Serializable {
  serialize(): string;
}
type PersonSerializable = Person & Serializable;

const person: PersonSerializable = {
  name: "Alice",
  serialize() {
    return JSON.stringify(this);
  }
};
```

**应用场景对比：**
- 联合类型：`|` - "或"的关系，处理不同类型但相似的场景
- 交叉类型：`&` - "且"的关系，组合多个类型

---

#### 10. 平常怎么学前端的？

**回答框架（按实际情况调整）：**

1. **学习路径**
   - 基础：HTML/CSS/JavaScript
   - 框架：React/Vue
   - 工程化：Webpack/Vite、Git
   - 进阶：性能优化、设计模式

2. **学习方式**
   - 官方文档 + 实践项目
   - 技术博客/掘金/MDN
   - 视频教程
   - 开源项目阅读

3. **学习方法**
   - 边学边做，注重实践
   - 总结笔记，形成知识体系
   - 关注前端新技术动态
   - 参与技术社区讨论

4. **当前提升方向**
   - 深入理解原理（浏览器、JS底层）
   - 关注工程化和架构设计
   - 培养问题解决能力

---

### 浏览器/网络类

#### 11. 什么是同源策略？

**定义：**
同源策略是浏览器的一种安全机制，限制一个源的文档或脚本如何与另一个源的资源进行交互。

**同源的判断（三者完全相同）：**
- 协议（http/https）
- 域名（example.com）
- 端口（80/443/8080）

**限制行为：**
1. **Cookie、LocalStorage、IndexedDB** 无法读取
2. **DOM** 无法获取
3. **AJAX请求** 被拦截（但请求实际发送了，只是响应被拦截）

**例外：**
- `<script>`、`<img>`、`<iframe>` 等标签的跨域资源加载
- 跨域资源共享（CORS）
- 服务器代理
- postMessage通信

---

#### 12. 如何实现跨域请求？

**方案一：CORS（跨域资源共享）- 标准方案**

服务端设置响应头：
```javascript
// 允许所有来源
res.setHeader('Access-Control-Allow-Origin', '*')
// 允许指定来源
res.setHeader('Access-Control-Allow-Origin', 'https://example.com')
// 允许携带凭证
res.setHeader('Access-Control-Allow-Credentials', 'true')
// 允许的请求方法
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
// 允许的请求头
res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
```

**方案二：JSONP（只支持GET）**

```javascript
// 前端
function jsonp(url, callbackName) {
  const script = document.createElement('script');
  script.src = `${url}?callback=${callbackName}`;
  document.body.appendChild(script);
}
// 后端返回：callbackName({data: ...})
```

**方案三：代理服务器（开发环境常用）**

```javascript
// vite.config.js / webpack.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://backend.com',
        changeOrigin: true
      }
    }
  }
}
```

**方案四：Nginx反向代理（生产环境）**

```nginx
location /api/ {
    proxy_pass http://backend_server/;
}
```

---

#### 13. 为什么代理可以绕过同源限制？

**核心原理：同源策略只存在于浏览器，服务器之间没有跨域限制。**

**流程说明：**
```
浏览器 ──同源──> 代理服务器 ──无限制──> 目标服务器
    ↑                                    │
    └────────────返回数据─────────────────┘
```

1. 浏览器请求代理服务器（同源，不触发跨域）
2. 代理服务器转发请求到目标服务器（服务器间通信，无同源策略）
3. 目标服务器返回数据给代理
4. 代理将数据返回给浏览器

**关键点：**
- 请求发起者是服务器（Node.js/Nginx），不受浏览器同源策略约束
- 浏览器只看到自己与代理的通信，认为是同源的

---

#### 14. Cookie和Session的定义和差异？

| 特性 | Cookie | Session |
|------|--------|---------|
| **存储位置** | 浏览器端 | 服务器端 |
| **大小限制** | 4KB左右 | 无限制（服务器存储） |
| **安全性** | 较低，可被篡改 | 较高，数据在服务器 |
| **生命周期** | 可设置过期时间 | 会话结束（默认） |
| **跨域** | 受同源策略限制 | 通过Cookie中的SessionID关联 |

**工作原理：**
```
1. 用户登录成功
2. 服务器生成Session，存储在服务器内存/数据库
3. 服务器返回Set-Cookie header，包含SessionID
4. 浏览器存储Cookie
5. 后续请求自动携带Cookie中的SessionID
6. 服务器根据SessionID查找对应的Session数据
```

**Session常见问题：**
- 分布式环境下Session共享问题（解决方案：Redis存储）
- CSRF攻击（通过Cookie携带用户凭证）

---

#### 15. Cookie是怎么种下的？

**服务端设置：**
```javascript
// Node.js Express示例
res.setHeader('Set-Cookie', [
  'sessionId=abc123; HttpOnly; Secure; SameSite=Strict',
  'user=john; Max-Age=3600; Path=/'
]);

// 或使用cookie-parser中间件
res.cookie('name', 'value', {
  httpOnly: true,    // 只能HTTP访问，防止XSS
  secure: true,      // 仅HTTPS传输
  sameSite: 'strict', // 防止CSRF
  maxAge: 3600000,   // 过期时间（毫秒）
  domain: '.example.com', // 域名范围
  path: '/'          // 路径范围
});
```

**前端设置（document.cookie）：**
```javascript
document.cookie = 'name=value; max-age=3600; path=/';
```

**Cookie属性说明：**
| 属性 | 说明 |
|------|------|
| **HttpOnly** | 禁止JS访问，防止XSS窃取 |
| **Secure** | 仅HTTPS传输 |
| **SameSite** | Strict/Lax/None，控制跨站请求携带 |
| **Domain** | 指定Cookie所属域 |
| **Path** | 指定Cookie生效路径 |
| **Max-Age/Expires** | 过期时间 |

---

#### 16. LocalStorage和SessionStorage的区别？

| 特性 | LocalStorage | SessionStorage |
|------|--------------|----------------|
| **生命周期** | 永久（除非手动删除） | 会话期间（关闭标签页/窗口即清除） |
| **作用域** | 同源下所有标签页共享 | 仅当前标签页/窗口可见 |
| **存储大小** | 5-10MB | 5-10MB |
| **API** | 相同 | 相同 |

**基本使用：**
```javascript
// 存储数据
localStorage.setItem('key', 'value');
sessionStorage.setItem('key', 'value');

// 读取数据
const value = localStorage.getItem('key');
const value = sessionStorage.getItem('key');

// 删除数据
localStorage.removeItem('key');
sessionStorage.removeItem('key');

// 清空所有
localStorage.clear();
sessionStorage.clear();

// 存储对象（需要JSON序列化）
localStorage.setItem('user', JSON.stringify({name: 'Alice'}));
const user = JSON.parse(localStorage.getItem('user'));
```

**注意事项：**
- 只能存储字符串，存储对象需要JSON序列化
- 同步操作，大量数据可能阻塞
- 隐身模式下LocalStorage可能被清除

---

#### 17. HTTP强缓存和协商缓存的区别？

**强缓存（Strong Cache）：**
不向服务器发送请求，直接从缓存读取。

| Header | 说明 |
|--------|------|
| **Expires** | HTTP/1.0，绝对时间（服务器时间，可能有时钟偏差） |
| **Cache-Control** | HTTP/1.1，相对时间（优先级更高） |

```http
Cache-Control: max-age=3600      # 缓存3600秒
Cache-Control: no-cache          # 每次都要验证
Cache-Control: no-store          # 不缓存
Cache-Control: private           # 仅浏览器可缓存
Cache-Control: public            # 浏览器和CDN都可缓存
```

**协商缓存（Conditional Cache）：**
向服务器发送请求，服务器判断资源是否修改，未修改返回304。

| Header对 | 请求头 | 响应头 |
|----------|--------|--------|
| **ETag** | If-None-Match | Etag（资源唯一标识） |
| **Last-Modified** | If-Modified-Since | Last-Modified（最后修改时间） |

```http
# 首次请求
Response: Last-Modified: Wed, 21 Oct 2025 07:28:00 GMT
Response: Etag: "33a64af557e2d53"

# 再次请求
Request: If-Modified-Since: Wed, 21 Oct 2025 07:28:00 GMT
Request: If-None-Match: "33a64af557e2d53"

# 未修改返回304，已修改返回200和新资源
```

**缓存策略判断流程：**
```
1. 检查 Cache-Control / Expires
   → 存在且未过期 → 使用强缓存（200 from cache）

2. 检查 ETag / Last-Modified
   → 资源未修改 → 使用协商缓存（304 Not Modified）
   → 资源已修改 → 返回新资源（200）
```

---

#### 18. 301和302状态码的区别？

| 状态码 | 名称 | 含义 | SEO影响 | 后续请求 |
|--------|------|------|---------|----------|
| **301** | Moved Permanently | 永久重定向 | 权重转移给新URL | 浏览器会缓存重定向 |
| **302** | Found | 临时重定向 | 不转移权重 | 每次都先请求原URL |

**使用场景：**
```http
# 301 - 永久重定向
# 域名变更、URL结构重组
HTTP/1.1 301 Moved Permanently
Location: https://new-domain.com/path

# 302 - 临时重定向
# 系统维护、A/B测试、用户登录跳转
HTTP/1.1 302 Found
Location: https://temp-page.com
```

**其他3xx状态码：**
- **303** - See Other，重定向到GET请求
- **307** - Temporary Redirect，保持请求方法（POST还是POST）
- **308** - Permanent Redirect，永久重定向并保持请求方法

---

### CSS类

#### 19. 设备像素和逻辑像素的区别？

**基本概念：**

| 类型 | 说明 | 缩写 |
|------|------|------|
| **设备像素（物理像素）** | 屏幕实际拥有的像素点 | DP |
| **逻辑像素（CSS像素）** | CSS中使用的像素单位 | DIP/DP |
| **设备独立像素** | 与设备无关的抽象像素 | - |

**关键公式：**
```
DPR（设备像素比）= 设备像素 / 逻辑像素
```

**常见设备DPR：**
| 设备 | DPR |
|------|-----|
| 标准PC显示器 | 1 |
| iPhone 6/7/8 | 2 |
| iPhone X/11/12 Pro | 3 |
| 部分Android手机 | 3-4 |

**实际应用：**
```css
/* 1px边框在高清屏变粗问题 */
/* 方案一：transform缩放 */
.border-1px {
  position: relative;
}
.border-1px::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #000;
  transform: scaleY(0.5); /* 根据DPR调整 */
  transform-origin: 0 0;
}

/* 方案二：媒体查询 */
@media (-webkit-min-device-pixel-ratio: 2) {
  .border { border-width: 0.5px; }
}
```

---

#### 20. CSS两种盒模型的差异？

**盒模型类型：**

| 特性 | 标准盒模型（content-box） | 怪异盒模型（border-box） |
|------|--------------------------|--------------------------|
| **width包含** | 仅content | content + padding + border |
| **设置方式** | box-sizing: content-box | box-sizing: border-box |
| **计算宽高** | 需手动加上p/b | width就是总宽度 |

**图示：**
```
content-box:
┌──────────────────────────────────┐
│           margin                 │
│  ┌────────────────────────────┐  │
│  │        border              │  │
│  │  ┌──────────────────────┐  │  │
│  │  │      padding         │  │  │
│  │  │  ┌────────────────┐  │  │  │
│  │  │  │   content      │  │  │  │
│  │  │  │   (width设定)  │  │  │  │
│  │  │  └────────────────┘  │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘

border-box:
┌──────────────────────────────────┐
│           margin                 │
│  ┌────────────────────────────┐  │
│  │        border              │  │
│  │  ┌──────────────────────┐  │  │
│  │  │  (width设定包含此区域)│  │  │
│  │  │  ┌────────────────┐  │  │  │
│  │  │  │   content      │  │  │  │
│  │  │  └────────────────┘  │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**推荐使用：**
```css
/* 全局设置，便于布局计算 */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 示例：实际占用宽度100px */
.box {
  width: 100px;
  padding: 10px;  /* content宽度自动变成80px */
  border: 5px solid black;
}
```

---

### 代码输出/手写类

#### 21. 事件循环代码输出顺序题

**经典例题：**
```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

new Promise((resolve) => {
  console.log('4');
  resolve();
}).then(() => {
  console.log('5');
}).then(() => {
  console.log('6');
});

setTimeout(() => {
  console.log('7');
  Promise.resolve().then(() => {
    console.log('8');
  });
}, 0);

console.log('9');
```

**输出顺序：** `1 → 4 → 9 → 5 → 6 → 2 → 3 → 7 → 8`

**分析过程：**
```
1. 执行同步代码：
   - console.log('1') → 输出 1
   - setTimeout1 → 宏任务队列 [setTimeout1]
   - Promise构造函数同步执行 → 输出 4
   - Promise.then1 → 微任务队列 [then1]
   - Promise.then2 → 微任务队列 [then1, then2]
   - setTimeout2 → 宏任务队列 [setTimeout1, setTimeout2]
   - console.log('9') → 输出 9

2. 执行微任务队列：
   - then1 → 输出 5
   - then2 → 输出 6
   - 微任务清空

3. 执行第一个宏任务（setTimeout1）：
   - console.log('2') → 输出 2
   - Promise.then → 微任务队列 [then3]

4. 执行微任务队列：
   - then3 → 输出 3

5. 执行第二个宏任务（setTimeout2）：
   - console.log('7') → 输出 7
   - Promise.then → 微任务队列 [then4]

6. 执行微任务队列：
   - then4 → 输出 8
```

**记忆要点：**
- 同步代码最先执行
- 微任务优先于宏任务
- 微任务队列清空后才执行下一个宏任务
- 宏任务：setTimeout、setInterval、setImmediate(Node)、I/O
- 微任务：Promise.then、queueMicrotask、MutationObserver

---

#### 22. React useState闭包陷阱题（点3次count是多少）

**问题代码：**
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // 点击3次按钮后，输出什么？
    }, 1000);
    return () => clearInterval(timer);
  }, []); // 依赖数组为空

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**答案：** 每次输出 `0`

**原因分析：**
1. `useEffect` 的依赖数组为空，只在组件挂载时执行一次
2. `setInterval` 的回调函数捕获了初始的 `count` 值（闭包）
3. 后续 `count` 更新，但回调函数中的 `count` 仍然是 `0`

---

#### 23. 如何改造代码让延迟1秒能拿到最新count？

**方案一：添加依赖（不推荐）**
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count);
  }, 1000);
  return () => clearInterval(timer);
}, [count]); // count变化时重新创建定时器
```

**方案二：使用函数式更新（推荐）**
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => {
      console.log(prev); // 可以获取最新值
      return prev; // 不更新state
    });
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

**方案三：使用 useRef 保存最新值**
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // 同步更新ref
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(countRef.current); // 始终是最新值
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

#### 24. 手写冒泡排序

```javascript
/**
 * 冒泡排序
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 * 稳定性：稳定
 */
function bubbleSort(arr) {
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    // 优化：记录本轮是否发生交换
    let swapped = false;

    // 每轮将最大的元素"冒泡"到末尾
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // 如果没有发生交换，说明已排序完成
    if (!swapped) break;
  }

  return arr;
}

// 测试
console.log(bubbleSort([5, 3, 8, 4, 2])); // [2, 3, 4, 5, 8]
console.log(bubbleSort([1, 2, 3, 4, 5])); // [1, 2, 3, 4, 5]（只需一轮比较）
```

---

#### 25. 手写函数防抖

```javascript
/**
 * 函数防抖 - 在事件被触发n秒后再执行回调
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay, immediate = false) {
  let timer = null;

  return function (...args) {
    // 清除之前的定时器
    if (timer) clearTimeout(timer);

    if (immediate) {
      // 立即执行模式
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (callNow) fn.apply(this, args);
    } else {
      // 延迟执行模式
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}

// 使用示例
const handleInput = debounce((e) => {
  console.log('搜索:', e.target.value);
}, 500);

// input.addEventListener('input', handleInput);

// React Hook版本
function useDebounce(fn, delay) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useCallback(
    debounce((...args) => {
      fnRef.current(...args);
    }, delay),
    [delay]
  );
}
```

---

### 框架/工程化类

#### 26. CommonJS和ESM的区别？

| 特性 | CommonJS (CJS) | ES Modules (ESM) |
|------|----------------|------------------|
| **语法** | `require` / `module.exports` | `import` / `export` |
| **加载方式** | 运行时同步加载 | 编译时静态加载 |
| **输出** | 值拷贝 | 值引用（动态绑定） |
| **顶层this** | 指向模块本身 | undefined |
| **支持环境** | Node.js | 浏览器 + Node.js |
| **可 Tree Shaking** | 不支持 | 支持 |

**CommonJS：**
```javascript
// 导出
module.exports = {
  name: 'Alice',
  sayHello() {}
};
// 或
exports.name = 'Alice';

// 导入
const user = require('./user');
```

**ESM：**
```javascript
// 导出
export const name = 'Alice';
export function sayHello() {}
export default { name, sayHello };

// 导入
import user, { name } from './user';
```

**值的拷贝 vs 引用：**
```javascript
// CommonJS - 值拷贝
// counter.js
let count = 0;
module.exports = { count };
module.exports.add = () => count++;

// main.js
const counter = require('./counter');
counter.add();
console.log(counter.count); // 0（count是导出时的拷贝）

// ESM - 值引用
// counter.mjs
export let count = 0;
export function add() { count++; }

// main.mjs
import { count, add } from './counter.mjs';
add();
console.log(count); // 1（count是动态绑定的引用）
```

---

#### 27. 前端路由两种模式及特点？

**Hash模式：**

```javascript
// URL示例：http://example.com/#/home
// Hash变化不会触发页面刷新
window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  // 根据 hash 渲染不同组件
});

// 跳转
location.hash = '/about';
```

| 特点 | 说明 |
|------|------|
| **URL格式** | `domain.com/#/path` |
| **兼容性** | 兼容性好，支持老浏览器 |
| **刷新** | 刷新不404 |
| **SEO** | 较差（爬虫可能忽略hash内容） |
| **原理** | 监听 `hashchange` 事件 |

**History模式：**

```javascript
// URL示例：http://example.com/home
// 需要服务端配置，否则刷新会404

// 跳转（不刷新页面）
history.pushState({}, '', '/about');
history.replaceState({}, '', '/about');

// 监听
window.addEventListener('popstate', () => {
  // 处理路由变化
});
```

| 特点 | 说明 |
|------|------|
| **URL格式** | `domain.com/path`（自然URL） |
| **兼容性** | 需要HTML5支持 |
| **刷新** | 需要服务端配置，刷新可能404 |
| **SEO** | 好（URL正常） |
| **原理** | 利用 History API |

**服务端配置（Nginx）：**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

#### 28. Git平常用哪些操作？

**日常操作：**
```bash
# 查看状态
git status

# 添加修改
git add .                    # 添加所有
git add file.js              # 添加指定文件

# 提交
git commit -m "feat: xxx"
git commit --amend           # 修改上一次提交

# 拉取/推送
git pull origin main         # 拉取并合并
git pull --rebase origin main  # 拉取并变基
git push origin main
git push -f origin feature   # 强制推送（慎用）

# 分支操作
git branch                   # 查看本地分支
git branch -r                # 查看远程分支
git branch -a                # 查看所有分支
git checkout -b feature      # 创建并切换分支
git switch feature           # 切换分支（新语法）
git branch -d feature        # 删除本地分支
git push origin --delete feature  # 删除远程分支

# 查看历史
git log --oneline            # 简洁日志
git log --graph              # 图形化日志
git reflog                   # 查看所有操作记录（可恢复）

# 暂存
git stash                    # 暂存当前修改
git stash pop                # 恢复并删除暂存
git stash list               # 查看暂存列表

# 合并
git merge feature            # 合并分支
git rebase main              # 变基到main
```

**解决冲突：**
```bash
git merge feature
# 出现冲突后，编辑文件解决冲突
git add .
git commit
```

---

### 项目类

#### 29. 项目中最有挑战性的部分是什么？

**回答框架（STAR法则）：**

**S - Situation（背景）：**
描述项目背景和面临的问题

**T - Task（任务）：**
明确需要解决的具体问题

**A - Action（行动）：**
详细描述解决过程：
- 分析问题的思路
- 技术方案的选择
- 实施过程中的困难
- 如何优化和改进

**R - Result（结果）：**
量化成果：
- 性能提升（加载时间降低X%）
- 用户体验改善
- 开发效率提升
- 团队认可

**示例回答要点：**
- 组织树二级节点卡顿优化（虚拟滚动）
- i18n工具的自动化提效
- SSE监控SDK的稳定性保障

---

### 算法类

#### 30. 两数之和

```javascript
/**
 * 两数之和
 * 给定一个整数数组 nums 和一个目标值 target
 * 返回数组中两个数的索引，使它们相加等于 target
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // 使用Map存储值和索引的对应关系
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // 检查补数是否已存在
    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    // 存储当前值和索引
    map.set(nums[i], i);
  }

  return []; // 无解
}

// 测试
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
console.log(twoSum([3, 3], 6));         // [0, 1]

/**
 * 复杂度分析：
 * 时间复杂度：O(n)，只需遍历一次
 * 空间复杂度：O(n)，Map最多存储n个元素
 */
```

---

## 二面答案

### 项目相关

#### 1-9. 项目相关问题（根据实际项目回答）

**组织树卡顿问题回答要点：**
- **业务场景**：组织架构树，二级节点下可能有成百上千个子节点
- **卡顿原因**：一次性渲染大量DOM，导致主线程阻塞
- **解决方案**：虚拟滚动 + 懒加载，只渲染可视区域节点
- **效果**：DOM数量从几千降到几十，FPS显著提升

**i18n提效工具回答要点：**
- **key生成**：使用 `crypto.createHash('md5').update(content).digest('hex').slice(0, 8)`
- **前8位原因**：128位MD5取前8位=32位十六进制，碰撞概率极低（2^32分之1）
- **增量代码**：配置Git钩子/CI流程，仅对变更文件运行

**SSE监控SDK回答要点：**
- **为什么不用Sentry**：SSE场景特殊（长连接），需要特定事件类型（连接/断开/消息）
- **上报策略**：批量上报 + 队列缓存，避免频繁请求
- **限流**：本地采样率 + 服务端限流配置
- **未发送数据**：LocalStorage持久化，下次启动补发
- **管理端**：提供数据看板，支持按项目/时间/事件类型查询

---

#### 10. 前端做性能优化有哪些手段？

**按加载阶段分类：**

**1. 网络传输优化**
- 启用 CDN（内容分发网络）
- 开启 Gzip/Brotli 压缩
- 使用 HTTP/2 或 HTTP/3
- 预加载关键资源
```html
<link rel="preload" href="style.css" as="style">
<link rel="prefetch" href="next-page.js">
```

**2. 资源优化**
- 代码分割（Code Splitting）
- Tree Shaking（删除死代码）
- 图片优化：WebP格式、懒加载、响应式图片
- 字体优化：使用字体子集、font-display: swap

**3. 渲染优化**
- 虚拟列表（大数据量）
- 防抖/节流控制事件触发频率
- requestAnimationFrame 代替 setTimeout
- CSS will-change 提示浏览器优化
- 避免强制同步布局（FSL）

**4. 运行时优化**
- 避免内存泄漏（解绑事件、清理定时器）
- 长任务拆分（使用 requestIdleCallback）
- Web Worker 处理复杂计算
- 虚拟滚动

**5. 缓存策略**
- 强缓存 + 协商缓存
- Service Worker 离线缓存
- LocalStorage 缓存数据

**6. 监控指标**
- Core Web Vitals：LCP、FID、CLS
- FCP、TTI、TBT
- 使用 Lighthouse 评估

---

### JS基础

#### 11. 原型链是怎么指向的？有哪些重要应用场景？

**原型链指向规则：**
```
对象 → 对象的__proto__ → 构造函数的prototype → 构造函数的__proto__ → ... → Object.prototype → null
```

**图解：**
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() {
  console.log('Hello, I am ' + this.name);
};

const person = new Person('Alice');

// 原型链
person.__proto__ === Person.prototype           // true
person.__proto__.__proto__ === Object.prototype // true
person.__proto__.__proto__.__proto__ === null   // true

// 属性查找过程
person.sayHello()
// 1. 在person对象上查找 → 没找到
// 2. 在person.__proto__(Person.prototype)上查找 → 找到了！
```

**重要应用场景：**

1. **继承实现**
```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.eat = function() {
  console.log(this.name + ' is eating');
};

function Dog(name, breed) {
  Animal.call(this, name);  // 借用构造函数
  this.breed = breed;
}

// 原型继承
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log('Woof!');
};
```

2. **方法扩展（如给Array添加方法）**
```javascript
// 不推荐直接修改原型，但可以理解原理
Array.prototype.myMap = function(fn) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(fn(this[i], i));
  }
  return result;
};
```

3. **判断对象类型**
```javascript
// instanceof 原理就是沿原型链查找
person instanceof Person  // true
person instanceof Object  // true

// 自己实现 instanceof
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  const prototype = right.prototype;

  while (proto) {
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

---

#### 12. JS的继承是怎么实现的？

**ES6之前（多种继承方式）：**

**1. 原型链继承**
```javascript
function Parent() {
  this.name = 'Parent';
}
Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child() {}
Child.prototype = new Parent();  // 关键

// 问题：引用类型属性会被所有实例共享
```

**2. 构造函数继承（借用构造函数）**
```javascript
function Child() {
  Parent.call(this);  // 关键
}

// 问题：无法继承原型上的方法
```

**3. 组合继承（原型链 + 构造函数）**
```javascript
function Child(name) {
  Parent.call(this, name);  // 继承实例属性
}
Child.prototype = new Parent();  // 继承原型方法
Child.prototype.constructor = Child;

// 问题：Parent构造函数被调用两次
```

**4. 寄生组合继承（最佳实践）**
```javascript
function inheritPrototype(Child, Parent) {
  const prototype = Object.create(Parent.prototype);
  prototype.constructor = Child;
  Child.prototype = prototype;
}

function Child(name) {
  Parent.call(this, name);
}
inheritPrototype(Child, Child);
```

**ES6 class继承：**
```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);  // 必须调用super
    this.age = age;
  }
  sayAge() {
    console.log(this.age);
  }
}
```

**extends本质：**
```javascript
// ES6 extends 的编译结果（简化版）
function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

// Object.create 创建中间对象，避免父类构造函数执行
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

---

#### 13. 事件循环是怎样的流程？

**完整流程图：**
```
┌─────────────────────┐
│   执行同步代码       │
│   (调用栈)          │
└──────────┬──────────┘
           │
           ▼
    ┌─────────────┐
    │ 栈空了吗？   │ ──否──→ 继续执行
    └──────┬──────┘
           │ 是
           ▼
    ┌─────────────┐
    │ 执行所有微任务 │ ──→ 清空微任务队列
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ 渲染页面     │ ───→ (浏览器环境，必要时)
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ 取下一个宏任务│
    └─────────────┘
           │
           └──────────────┐
                          ▼
              （循环回到第一步）
```

**宏任务（Macrotask / Task）：**
- `setTimeout` / `setInterval`
- `setImmediate`（Node.js）
- I/O 操作
- UI 渲染
- `requestAnimationFrame`（有些浏览器实现）

**微任务（Microtask / Job）：**
- `Promise.then` / `Promise.catch` / `Promise.finally`
- `process.nextTick`（Node.js，优先级高于其他微任务）
- `MutationObserver`
- `queueMicrotask()`

**执行顺序示例：**
```javascript
console.log('start');

setTimeout(() => console.log('timeout1'), 0);

Promise.resolve().then(() => console.log('promise1'));
Promise.resolve().then(() => {
  console.log('promise2');
  Promise.resolve().then(() => console.log('promise3'));
});

setTimeout(() => console.log('timeout2'), 0);

console.log('end');

// 输出：start → end → promise1 → promise2 → promise3 → timeout1 → timeout2
```

---

#### 14. 事件循环输出顺序代码题

**经典题目：**
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
```

**输出顺序：**
```
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```

**分析：**
1. 同步执行：`script start` → `setTimeout`(入宏队列) → `async1 start` → `async2` → `promise1` → `script end`
2. 微任务队列：`async1 end`（await后）、`promise2`
3. 执行微任务：`async1 end` → `promise2`
4. 执行宏任务：`setTimeout`

**await 本质：**
```javascript
// await 后面的代码相当于 Promise.then 的回调
await async2();
console.log('async1 end');

// 等价于
Promise.resolve(async2()).then(() => {
  console.log('async1 end');
});
```

---

#### 15. ES6相对ES5有哪些重要新特性？

**1. let / const**
- 块级作用域
- 暂时性死区（TDZ）
- const 声明常量

**2. 箭头函数**
```javascript
const fn = (a, b) => a + b;
// 没有 this、arguments、super
// 不能用作构造函数
```

**3. 模板字符串**
```javascript
const name = 'World';
const str = `Hello ${name}!`;
```

**4. 解构赋值**
```javascript
const { a, b } = obj;
const [x, y] = arr;
```

**5. 默认参数**
```javascript
function fn(a = 1, b = 2) {}
```

**6. 剩余参数 / 扩展运算符**
```javascript
function fn(...args) {}
const newArr = [...arr1, ...arr2];
```

**7. Promise**
```javascript
new Promise((resolve, reject) => {})
  .then(res => {})
  .catch(err => {});
```

**8. Class**
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  say() {}
}
```

**9. 模块化**
```javascript
export default {};
import { name } from './module';
```

**10. Symbol / BigInt**
```javascript
const sym = Symbol('description');
const bigInt = 9007199254740991n;
```

**11. 新增API**
- `Map` / `Set` / `WeakMap` / `WeakSet`
- `Proxy` / `Reflect`
- `Array.prototype.includes` / `Array.from` / `Array.of`
- `Object.assign` / `Object.keys` / `Object.values` / `Object.entries`
- `String.prototype.startsWith` / `endsWith` / `includes` / `repeat`

---

#### 16. Promise有哪几种状态？

**三种状态：**

| 状态 | 说明 | 特点 |
|------|------|------|
| **pending** | 等待中 | 初始状态 |
| **fulfilled** | 已成功 | 操作成功完成 |
| **rejected** | 已失败 | 操作失败 |

**状态转换规则：**
```
pending → fulfilled（不可逆）
pending → rejected（不可逆）
```

**状态特性：**
1. **不可逆**：一旦从 pending 变为其他状态，就不能再改变
2. **不可取消**：Promise 一旦创建，必须执行完成
3. **值传递**：成功/失败的值会传递给 then/catch

**示例：**
```javascript
// pending
const pending = new Promise((resolve, reject) => {
  // 还没有调用 resolve 或 reject
});

// fulfilled
const fulfilled = Promise.resolve('success');
fulfilled.then(v => console.log(v)); // success

// rejected
const rejected = Promise.reject('error');
rejected.catch(e => console.log(e)); // error

// 状态不可逆
const p = new Promise((resolve, reject) => {
  resolve('success');
  reject('error');  // 无效，状态已改变
});
p.then(v => console.log(v)); // success
```

---

#### 17. Promise有哪些常用方法及使用场景？

**1. Promise.all**
```javascript
// 所有 Promise 成功才成功，有一个失败就失败
Promise.all([p1, p2, p3])
  .then(values => {
    // values 是按顺序的数组
    console.log(values);
  })
  .catch(err => {
    // 第一个失败的错误
  });

// 场景：多个并行请求，需要全部完成
Promise.all([
  fetch('/user'),
  fetch('/posts'),
  fetch('/comments')
]).then(([user, posts, comments]) => {
  render({ user, posts, comments });
});
```

**2. Promise.race**
```javascript
// 谁先完成就返回谁（成功/失败都算）
Promise.race([p1, p2, p3])
  .then(value => console.log(value))
  .catch(err => console.log(err));

// 场景：请求超时控制
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}
```

**3. Promise.allSettled**
```javascript
// 等待所有 Promise 完成，不管成功失败
Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log(result.value);
      } else {
        console.log(result.reason);
      }
    });
  });

// 场景：批量操作，需要全部结果
Promise.allSettled([
  upload(file1),
  upload(file2),
  upload(file3)
]).then(results => {
  const success = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  console.log(`上传完成：${success}成功，${failed}失败`);
});
```

**4. Promise.any**
```javascript
// 第一个成功的 Promise，全部失败才 reject
Promise.any([p1, p2, p3])
  .then(value => console.log(value))
  .catch(err => {
    // err 是 AggregateError
    console.log('All failed');
  });

// 场景：多源备份，只要有一个成功即可
Promise.any([
  fetch('https://api1.com'),
  fetch('https://api2.com'),
  fetch('https://api3.com')
]).then(res => res.json());
```

**5. Promise.resolve / Promise.reject**
```javascript
// 快速创建已完成的 Promise
Promise.resolve(value).then(v => console.log(v));
Promise.reject(error).catch(e => console.log(e));

// 场景：统一返回格式
function getData() {
  const cache = getFromCache();
  if (cache) {
    return Promise.resolve(cache);  // 包装成 Promise
  }
  return fetch('/data');
}
```

---

#### 18. 手写Promise.all

```javascript
/**
 * 手写 Promise.all
 * @param {Iterable<Promise>} promises
 * @returns {Promise}
 */
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    // 参数校验
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }

    // 空数组直接返回
    if (promises.length === 0) {
      return resolve([]);
    }

    const results = [];
    let completedCount = 0;
    const length = promises.length;

    promises.forEach((promise, index) => {
      // 用 Promise.resolve 包装，确保处理非 Promise 值
      Promise.resolve(promise).then(
        value => {
          results[index] = value;
          completedCount++;

          // 全部完成
          if (completedCount === length) {
            resolve(results);
          }
        },
        error => {
          // 任何一个失败，立即 reject
          reject(error);
        }
      );
    });
  });
}

// 测试
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

promiseAll([p1, p2, p3]).then(console.log); // [1, 2, 3]

// 测试非 Promise 值
promiseAll([1, 2, 3]).then(console.log); // [1, 2, 3]

// 测试失败
promiseAll([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
]).catch(err => console.log(err)); // error
```

---

### CSS相关

#### 19. 手写单个div实现滑动开关组件

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 开关容器 */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

/* 隐藏原始 checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* 滑块轨道 */
.switch::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background-color: #ccc;
  border-radius: 30px;
  transition: background-color 0.3s;
}

/* 滑块按钮 */
.switch::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* 选中状态 */
.switch input:checked::before {
  background-color: #4CAF50;
}

.switch input:checked::after {
  transform: translateX(30px);
}

/* 禁用状态 */
.switch input:disabled::before {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.switch input:disabled::after {
  background-color: #bdbdbd;
}
</style>
</head>
<body>

<label class="switch">
  <input type="checkbox">
</label>

<!-- 禁用状态 -->
<label class="switch">
  <input type="checkbox" disabled>
</label>

<!-- 默认选中 -->
<label class="switch">
  <input type="checkbox" checked>
</label>

</body>
</html>
```

**React版本：**
```jsx
import React from 'react';
import './Switch.css';

function Switch({ checked, onChange, disabled }) {
  return (
    <label className={`switch ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  );
}
```

---

### 算法

#### 20. 找两个链表的交叉节点

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * 方法一：双指针法（最优）
 * 时间复杂度：O(m + n)
 * 空间复杂度：O(1)
 */
function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;

  let pA = headA;
  let pB = headB;

  // 两指针遍历，当pA到末尾时转向headB，pB同理
  // 如果有交叉，两指针会在交叉节点相遇
  // 如果无交叉，两指针会同时到达null
  while (pA !== pB) {
    pA = pA ? pA.next : headB;
    pB = pB ? pB.next : headA;
  }

  return pA; // 相交节点或null
}

/**
 * 方法二：哈希表法
 * 时间复杂度：O(m + n)
 * 空间复杂度：O(m) 或 O(n)
 */
function getIntersectionNodeHash(headA, headB) {
  const visited = new Set();

  let p = headA;
  while (p) {
    visited.add(p);
    p = p.next;
  }

  p = headB;
  while (p) {
    if (visited.has(p)) {
      return p;
    }
    p = p.next;
  }

  return null;
}

/**
 * 方法三：差值法
 * 先计算两链表长度差，让长链表先走差值步
 */
function getIntersectionNodeDiff(headA, headB) {
  // 获取链表长度
  function getLength(head) {
    let len = 0;
    while (head) {
      len++;
      head = head.next;
    }
    return len;
  }

  const lenA = getLength(headA);
  const lenB = getLength(headB);
  let diff = Math.abs(lenA - lenB);

  let pA = headA;
  let pB = headB;

  // 长链表先走 diff 步
  if (lenA > lenB) {
    while (diff--) pA = pA.next;
  } else {
    while (diff--) pB = pB.next;
  }

  // 同时前进，找到交叉点
  while (pA && pB) {
    if (pA === pB) return pA;
    pA = pA.next;
    pB = pB.next;
  }

  return null;
}

// 测试用例
function ListNode(val) {
  this.val = val;
  this.next = null;
}

// 构建相交链表
// 1→2→3
//       ↘
//         4→5→null
//       ↗
//     6→7
const common1 = new ListNode(4);
const common2 = new ListNode(5);
common1.next = common2;

const headA = new ListNode(1);
headA.next = new ListNode(2);
headA.next.next = new ListNode(3);
headA.next.next.next = common1;

const headB = new ListNode(6);
headB.next = new ListNode(7);
headB.next.next = common1;

console.log(getIntersectionNode(headA, headB)); // ListNode { val: 4 }
```

---

## 三面答案

### 基础/学习类

#### 1-3. 个人经历类问题（根据实际情况回答）

**回答框架：**

**为什么选择前端：**
- 可能是学校项目/实习接触
- 对可视化、交互效果产生兴趣
- 前端反馈即时，成就感强

**学习路径：**
- 打基础：HTML/CSS/JavaScript
- 选方向：React/Vue
- 做项目：把知识转化为实践
- 补原理：深入理解底层机制

**学习资源：**
- 官方文档
- 技术书籍（红宝书、犀牛书）
- 在线课程
- 技术博客/掘金/MDN

---

### 项目类

#### 4-6. 项目相关问题（根据实际项目回答）

**实习期间做的事情：**
- 负责具体模块开发
- 解决的性能问题
- 做的提效工具

**代表性项目展示：**
- 项目背景/目标
- 技术栈选择
- 遇到的难点及解决方案
- 最终成果/收益

**类ChatGPT项目要点：**
- 前端：流式输出处理、打字机效果
- 状态管理：对话历史管理
- 优化：Markdown渲染、代码高亮
- 体验：自动滚动、加载状态

---

### React原理类

#### 7. 讲一下你对Fiber概念的理解

**Fiber是什么？**
Fiber是React 16引入的新的协调算法（Reconciliation）实现，本质上是一个链表树结构。

**为什么需要Fiber？**
React 15的递归渲染存在问题：
- 一旦开始就无法中断，必须一次执行完
- 长任务会阻塞主线程，导致页面卡顿
- 无法利用浏览器的空闲时间

**Fiber的改进：**
```javascript
// Fiber节点结构
const fiberNode = {
  type: 'div',           // 节点类型
  key: null,             // key
  props: {},             // 属性
  stateNode: domNode,    // 对应的DOM节点
  return: parentFiber,   // 父节点
  child: firstChild,     // 第一个子节点
  sibling: nextSibling,  // 下一个兄弟节点
  alternate: oldFiber,   // 对应的旧Fiber（双缓存）
  effectTag: 'UPDATE',   // 副作用标记
};
```

**链表结构 vs 树结构：**
```
React 15（树，递归遍历）：
    A
   / \
  B   C
递归：A → B → 回A → C（无法中断）

React 16 Fiber（链表，循环遍历）：
A ↔ B ↔ C
↖______↙（每个节点有sibling指针，可以暂停）
```

---

#### 8. Fiber内部是怎么实现时间切片的？

**核心机制：利用 `requestIdleCallback` 或 `MessageChannel` 模拟**

**工作流程：**
```
1. 每个工作循环（work loop）处理一个Fiber节点
2. 处理完一个节点后检查是否用完时间片（约5ms）
3. 如果时间用完，交还控制权给浏览器
4. 等待浏览器空闲后继续处理
5. 重复直到Fiber树构建完成
```

**伪代码：**
```javascript
function workLoop(deadline) {
  // 有工作要做 且 还有时间
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // 工作完成，提交更新
  if (!nextUnitOfWork) {
    commitRoot();
  } else {
    // 还有工作，等待下一个空闲时间片
    requestIdleCallback(workLoop);
  }
}

function performUnitOfWork(fiber) {
  // 1. 处理当前Fiber
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 2. 处理子节点
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 3. 返回下一个工作单元
  if (fiber.child) {
    return fiber.child;
  }
  while (fiber) {
    if (fiber.sibling) {
      return fiber.sibling;
    }
    fiber = fiber.return;
  }
}
```

**优先级调度：**
- 同步优先级：用户交互（点击、输入）
- 高优先级：网络请求回调
- 普通优先级：定时器
- 低优先级：数据分析、隐藏页面渲染

---

#### 9. React Diff算法复杂度是什么样的？

**传统树Diff算法复杂度：O(n³)**
- 树对比：O(n²）
- 每个节点对比：O(n）
- 总计：O(n³）

**React Diff算法复杂度：O(n)**

**React优化的三个假设：**
1. 不同类型元素产生不同树
2. 开发者可以通过key指定哪些元素是稳定的
3. 只对同层级节点比较

**Diff策略：**

**1. 类型不同 → 直接替换**
```jsx
// 旧
<div>...</div>

// 新
<span>...</span>

// React会销毁div及其子节点，创建新的span
```

**2. 类型相同 → 复用节点，更新属性**
```jsx
// 旧
<div className="old">...</div>

// 新
<div className="new">...</div>

// React复用div，只更新className
```

**3. 子节点Diff（关键）**
```jsx
// 旧列表
[1, 2, 3]

// 新列表
[1, 3, 2]

// 没有key时的处理（按索引）：
// 索引0: 1 → 1（复用）
// 索引1: 2 → 3（更新）
// 索引2: 3 → 2（更新）
// 结果：两次DOM操作

// 有key时的处理：
// 1 → 1（复用）
// 3 → 3（移动）
// 2 → 2（移动）
// 结果：两次移动操作
```

---

#### 10. 复杂度是确定的还是会动态变化？

**基础复杂度：O(n)**

**但有动态因素：**

**1. 有key时**
```jsx
// key稳定 → O(n)
<ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>

// key用index → 可能退化到O(n²)的效果
// 因为无法识别节点移动，导致不必要的更新
```

**2. 无key时**
- 同层级比较：O(n)
- 但可能导致误判，产生额外的DOM操作

**3. 实际复杂度影响因素：**
```jsx
// 场景1：简单列表替换（O(n)）
// [A, B, C] → [A, B, D]

// 场景2：列表反转（O(n)遍历，但可能有O(n)的DOM操作）
// [A, B, C] → [C, B, A]

// 场景3：大量节点（性能问题主要在DOM操作，不在Diff）
// 10000个节点的列表，Diff是O(n)，但渲染很慢
```

**总结：**
- **Diff算法本身复杂度始终是O(n)**
- 但**实际性能**取决于key的使用、节点类型变化、DOM操作数量
- 长列表场景建议用虚拟滚动，而不是依赖Diff优化

---

#### 11. key是用来做什么的？

**key的作用：**
key是React用来识别哪些元素改变了、添加了、移除的辅助标识。

**工作原理：**
```jsx
// 旧列表
[
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
]

// 新列表（反转）
[
  { id: 2, name: 'B' },
  { id: 1, name: 'A' },
]

// 有key时的Diff过程：
1. key=1: 找到旧节点A → 移动到位置1
2. key=2: 找到旧节点B → 保持在位置0
结果：移动操作

// 无key时（用index）：
1. index=0: A → B（更新name）
2. index=1: B → A（更新name）
结果：两次更新操作
```

**key使用原则：**
```jsx
// ✅ 正确：使用稳定的唯一标识
{items.map(item => <li key={item.id}>{item.name}</li>)}

// ❌ 错误：使用index（列表会重排时）
{items.map((item, index) => <li key={index}>{item.name}</li>)}

// ❌ 错误：使用随机数（每次都变）
{items.map(item => <li key={Math.random()}>{item.name}</li>)}

// ❌ 错误：key重复
{items.map(item => <li key={item.type}>{item.name}</li>)}
```

**什么时候可以用index做key？**
- 列表**静态**，不会重新排序
- 列表**没有**插入/删除操作
- 列表只是整体替换

---

#### 12. 如果没有设置key，算法复杂度是多少？

**答案：**

**Diff算法复杂度仍然是O(n)**，但会产生额外性能问题。

**无key时的处理：**
```jsx
// React会用index作为默认key
{items.map(item => <div>{item.name}</div>)}
// 等价于
{items.map((item, index) => <div key={index}>{item.name}</div>)}
```

**问题场景：**

**1. 列表反转/重排**
```jsx
// 旧
[<div key="0">A</div>, <div key="1">B</div>, <div key="2">C</div>]

// 新（反转）
[<div key="0">C</div>, <div key="1">B</div>, <div key="2">A</div>]

// React的对比：
// key=0: A → C（更新内容）
// key=1: B → B（复用）
// key=2: C → A（更新内容）
// 结果：2次更新，而不是移动节点
```

**2. 插入到开头**
```jsx
// 旧
[A, B, C]

// 新
[D, A, B, C]

// React的对比：
// key=0: A → D（更新）
// key=1: B → A（更新）
// key=2: C → B（更新）
// 新增: D（新增）
// 结果：3次更新 + 1次新增
// 有正确key时：只需1次插入
```

**总结：**
- **算法复杂度**：始终O(n)
- **实际DOM操作**：无key可能产生更多不必要的更新
- **建议**：动态列表始终使用稳定唯一的key

---

### AI工具类

#### 13-15. AI相关问题（开放性问题）

**常用AI工具：**
- **编程助手**：GitHub Copilot、Cursor、Claude Code
- **问答工具**：ChatGPT、Claude
- **图像处理**：Midjourney、DALL-E
- **文档阅读**：ChatPDF、Kimi

**如何使用：**
- 解释代码逻辑
- 生成样板代码
- 调试错误信息
- 学习新技术概念
- 代码重构建议

**提升AI在code方面的效果：**
1. **更好的上下文**：提供完整的代码文件、项目结构
2. **清晰的描述**：具体说明需求，而非模糊的描述
3. **迭代交互**：多轮对话，逐步细化需求
4. **反馈纠错**：指出AI的错误，帮助学习
5. **RAG技术**：让AI了解特定项目的代码规范

**AI适合做什么：**
- ✅ 重复性工作（生成样板代码、写测试）
- ✅ 知识问答（API查询、概念解释）
- ✅ 代码建议（重构、优化方向）
- ✅ 语言翻译（代码注释、文档）

**AI不适合做什么：**
- ❌ 复杂架构设计（需要全局理解）
- ❌ 性能关键代码（可能不够优化）
- ❌ 安全敏感代码（可能有漏洞）
- ❌ 需要创造性解决方案（经验依赖）

---

### 手写代码类

#### 16. 算法题1：对象id去重

```javascript
/**
 * 对象数组根据id去重
 * @param {Array} arr - 对象数组
 * @param {string} key - 去重的键名，默认'id'
 * @returns {Array}
 */
function uniqueById(arr, key = 'id') {
  const map = new Map();

  return arr.filter(item => {
    const id = item[key];
    if (map.has(id)) {
      return false;  // 已存在，过滤掉
    }
    map.set(id, true);
    return true;  // 首次出现，保留
  });
}

// 测试
const data = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice-Dup' },  // id重复
  { id: 3, name: 'Charlie' },
  { id: 2, name: 'Bob-Dup' },    // id重复
];

console.log(uniqueById(data));
// [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' },
//   { id: 3, name: 'Charlie' }
// ]

// 保留最后一次出现的值
function uniqueByIdLast(arr, key = 'id') {
  const map = new Map();

  arr.forEach(item => {
    map.set(item[key], item);
  });

  return Array.from(map.values());
}

console.log(uniqueByIdLast(data));
// [
//   { id: 1, name: 'Alice-Dup' },
//   { id: 2, name: 'Bob-Dup' },
//   { id: 3, name: 'Charlie' }
// ]
```

---

#### 17. 算法题2：判断一棵树是否是另一棵树的子树

```javascript
/**
 * Definition for a binary tree node.
 */
function TreeNode(val, left, right) {
  this.val = val;
  this.left = left || null;
  this.right = right || null;
}

/**
 * 判断 subRoot 是否是 root 的子树
 * @param {TreeNode} root
 * @param {TreeNode} subRoot
 * @return {boolean}
 */
function isSubtree(root, subRoot) {
  if (!subRoot) return true;   // 空树是任何树的子树
  if (!root) return false;     // root为空但subRoot不为空

  // 检查当前节点是否匹配
  if (isSameTree(root, subRoot)) {
    return true;
  }

  // 递归检查左右子树
  return isSubtree(root.left, subRoot) ||
         isSubtree(root.right, subRoot);
}

/**
 * 判断两棵树是否相同
 */
function isSameTree(p, q) {
  if (!p && !q) return true;   // 都为空
  if (!p || !q) return false;  // 只有一个为空
  if (p.val !== q.val) return false; // 值不同

  return isSameTree(p.left, q.left) &&
         isSameTree(p.right, q.right);
}

// 测试用例
// 构建树
//       3
//      / \
//     4   5
//    / \
//   1   2
const root = new TreeNode(3);
root.left = new TreeNode(4);
root.right = new TreeNode(5);
root.left.left = new TreeNode(1);
root.left.right = new TreeNode(2);

// 子树
//     4
//    / \
//   1   2
const subRoot = new TreeNode(4);
subRoot.left = new TreeNode(1);
subRoot.right = new TreeNode(2);

console.log(isSubtree(root, subRoot)); // true

// 非子树
const notSub = new TreeNode(4);
notSub.left = new TreeNode(1);
notSub.right = new TreeNode(3); // 值不同

console.log(isSubtree(root, notSub)); // false
```

**复杂度分析：**
- 时间复杂度：O(m*n)，m是root节点数，n是subRoot节点数
- 空间复杂度：O(max(m, n))，递归栈深度
