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
