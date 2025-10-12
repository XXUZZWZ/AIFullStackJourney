好的，我们来深入讲讲 **JavaScript 的原型链**，这个是面试中非常高频的知识点，而且考察深度往往决定你是否能给面试官留下“对 JS 底层理解很扎实”的印象。

---

## 1. 基础概念：原型 (Prototype)

- 在 JavaScript 中，每个 **对象** 都有一个隐藏的属性（`[[Prototype]]`，通常通过 `__proto__` 来访问），指向另一个对象。
- 这个被指向的对象，就是它的 **原型**。
- 原型也是一个对象，它也可能有自己的原型，于是就形成了一个 **链条** —— 这就是 **原型链**。

---

## 2. 构造函数与原型

```js
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function () {
  console.log("Hello, I am " + this.name);
};

const p1 = new Person("Mike");
p1.sayHello(); // "Hello, I am Mike"
```

在这里：

1. `Person` 是构造函数。
2. `Person.prototype` 是构造函数的原型对象。
3. `p1.__proto__ === Person.prototype` （实例对象的 `__proto__` 指向构造函数的原型对象）。
4. `Person.prototype.constructor === Person` （原型对象有一个默认的 `constructor` 属性，指回构造函数）。

---

## 3. 原型链查找机制

当访问对象的某个属性时：

1. JS 引擎先在对象自身属性上查找。
2. 如果没有找到，就顺着 `__proto__`（即 `[[Prototype]]`）往上找。
3. 一直找，直到：

   - 找到该属性；
   - 或者到达 `Object.prototype`（顶层对象）。

4. 如果再找不到，就返回 `undefined`。

例子：

```js
console.log(p1.toString);
// p1 没有 toString
// p1.__proto__ (Person.prototype) 也没有
// 再往上找 Object.prototype.toString => 找到了
```

---

## 4. 原型链结构图

我们用链条表示：

```
p1 ---> Person.prototype ---> Object.prototype ---> null
```

更通用的情况：

```
实例对象.__proto__ === 构造函数.prototype
构造函数.prototype.__proto__ === Object.prototype
Object.prototype.__proto__ === null
```

---

## 5. 特殊对象的原型链

### ① Function

```js
function foo() {}
```

- `foo.__proto__ === Function.prototype`
- `Function.prototype.__proto__ === Object.prototype`

### ② Object

```js
const obj = {};
```

- `obj.__proto__ === Object.prototype`
- `Object.prototype.__proto__ === null`

### ③ Function 本身

`Function` 既是构造函数，也是函数对象：

```js
Function.__proto__ === Function.prototype;
```

这个比较“绕”，是 JS 原型链的一个特殊自指现象。

---

## 6. 手写 `instanceof` 原理

`instanceof` 的判断，就是顺着原型链向上找：

```js
function instanceOf(obj, constructor) {
  let proto = obj.__proto__;
  while (proto) {
    if (proto === constructor.prototype) return true;
    proto = proto.__proto__;
  }
  return false;
}

console.log(p1 instanceof Person); // true
```

---

## 7. 面试时的“深入回答”亮点

- **原型链的本质**：对象通过 `[[Prototype]]` 形成一个链式结构，解决了属性共享和继承的问题。
- **为什么要有原型链**：它是 JS 实现继承的核心机制（不像 Java/C++ 那样有 class 继承，JS 是基于原型的继承）。
- **顶点**：所有对象最终都继承自 `Object.prototype`，而 `Object.prototype.__proto__ === null`，这是原型链的终点。
- **易混点**：`prototype` 和 `__proto__` 的区别

  - `prototype` 是构造函数的属性
  - `__proto__` 是实例对象的属性，指向构造函数的 `prototype`

---

要不要我帮你画一个 **完整的 ASCII 原型链关系图**，把 `Object`、`Function`、自定义构造函数、实例对象的关系都放在一起？这样面试时你脑子里会很清晰。

好嘞，那我给你画一张 **ASCII 原型链关系图**。这张图把常见的几种对象 (`实例对象`、`构造函数`、`Object`、`Function`) 的原型链关系都串起来了。

---

### 🔗 原型链全景图

```
(实例对象 p1)
    |
    v
 __proto__
    |
(Person.prototype)  <-- prototype --  (构造函数 Person)
    |                                      |
    v                                      v
 __proto__                            __proto__
    |                                     |
(Object.prototype)  <-- prototype --  (Function)
    |                                      ^
    v                                      |
   null          (Function.prototype) ------
```

---

### 逐层解释

1. **实例对象 p1**

   - `p1.__proto__ === Person.prototype`

2. **构造函数 Person**

   - 它本身是个函数 → `Person.__proto__ === Function.prototype`
   - 它有一个原型对象 → `Person.prototype`

3. **原型对象 Person.prototype**

   - `Person.prototype.__proto__ === Object.prototype`
   - 它自带一个属性：`constructor` 指回 `Person`

4. **Function 构造函数**

   - `Function.__proto__ === Function.prototype` （特殊的“自指”关系）
   - 所以 Function 既是构造函数，又是函数对象

5. **Object 构造函数**

   - `Object.__proto__ === Function.prototype`
   - `Object.prototype.__proto__ === null`（原型链的尽头）

---

✅ 面试时，记住 **三句话口诀** 就能应付大部分追问：

1. **对象靠 `__proto__` 找原型**
2. **函数靠 `prototype` 挂原型对象**
3. **链条尽头是 `Object.prototype.__proto__ === null`**

---

要不要我接下来给你出两道 **原型链判断小题**（比如 `Function.__proto__` 等），让你自己来判断？这样能验证你是不是真正消化了。
