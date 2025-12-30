/**
 * 练习：手写 new 操作符
 * 
 * 提示：new 操作符做了 4 件事：
 * 1. 创建一个新对象
 * 2. 链接原型
 * 3. 绑定 this 并执行构造函数
 * 4. 返回对象
 */

function myNew(Constructor, ...args) {
    
      // 在这里实现你的代码
    const obj = {};

    obj.__proto__ = Constructor.prototype;
    
    // Object.setPrototypeOf(obj, Constructor.prototype);

    const res =  Constructor.apply(obj,args);

    return res !== null && (typeof res === 'object' || typeof res === 'function') ? res : obj;

    
    
}

// === 测试用例 ===
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.sayHello = function() {
    console.log(`你好，我是 ${this.name}`);
}

// 你的实现完成后，取消下面的注释进行测试
const p = myNew(Person, "练习生", 18);
p.sayHello();
console.log(p instanceof Person); // 应该输出 true
