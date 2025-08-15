# 深浅拷贝

- Object.assign()

  - 浅拷贝

- Object.assign() 方法用于将一个或多个源对象的所有**可枚举**属性复制到目标对象，并返回修改后的**目标对象**，常用于对象的浅拷贝或属性合并。

- 赋值操作 js 内存相关

- 拷贝简单数据类型 (number string boolean) 等于新复印了一份， 和引引用式赋值

- 不支持深拷贝
  比不了 深拷贝的 安全 对象比较深 值也是对象 管他有多深

- 怎么支持深拷贝
  - 简单的方法 ： JSON.parse(JSON.stringify(obj))
    - 缺点：
    - 优点：
- 面试官想法
- 中厂 深拷贝 浅拷贝 event loop js 类型判断
- 以 Object.assign()为例，浅拷贝 从这里切入
  - 表演时间 面试是当面展示自己
  - **API 细节 --> 业务场景 (怎么用) --->赋值+引用+ 浅拷贝 只拷贝一层---> 底层原理**
- 简单实现浅拷贝

  - JSON.parse(JSON.stringify(obj))
  - 不会拷贝函数，symbol 属性,undefined ,循环引用

  - 赋值和引用的概念
  - 引导对象考察手写深拷贝
    - 简单数据类型和复杂数据类型 内存分配不一样

- 如何拷贝，看业务

  - 如果是简单数据类型 = 就好
  - 如果是浅的对象或数组
    - Object.assign()
    - Array.prototype.slice()
    - Array.prototype.concat()
  - 简单深拷贝 JSON.parse(JSON.stringify())
  - 递归深拷贝 手写实现
  - 官方实现
  - Window 接口的 structuredClone() 方法使用结构化克隆算法将给定的值进行深拷贝。
  - 该方法还支持把原值中的可转移对象转移（而不是拷贝）到新对象上。可转移对象与原始对象分离并附加到新对象；它们将无法在原始对象中被访问。
  - 参数
    value
    被克隆的对象。可以是任何结构化克隆支持的类型。
    options 可选
    一个具有以下属性的对象：
    transfer
    一个可转移对象的数组，里面的对象将被移动而不是克隆到返回的对象上。

- 响应式底层

  - 怎么实现的？
    - Object.defineProperty
    - Proxy

- Vue 现代前端 mvvm 框架 早期用 Object.defineProperty 后期 用 Proxy
