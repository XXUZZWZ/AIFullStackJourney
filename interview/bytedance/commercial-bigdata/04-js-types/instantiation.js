// 1. 定义一个构造函数（就像一个模具）
function Person(name, age) {
    // 这里的 this 指向即将在实例化时创建的新对象
    this.name = name;
    this.age = age;
    
    // 通常构造函数没有 return，或者 return this
    // 如果 return 一个对象（引用类型），则会覆盖实例化的结果
}

// 在原型上添加方法，这样所有实例都可以共享，不用每次都复制一份
Person.prototype.sayHello = function() {
    console.log(`你好，我是 ${this.name}，今年 ${this.age} 岁。`);
};

console.log("=== 1. 使用原生 new 关键字 ===");
const p1 = new Person("小明", 18);
p1.sayHello();
console.log("p1 是 Person 的实例吗?", p1 instanceof Person);
console.log("p1.__proto__ === Person.prototype?", p1.__proto__ === Person.prototype);

console.log("\n=== 2. 模拟 new 关键字发生的 4 个步骤 ===");

/**
 * 模拟 new 操作符的行为
 * @param {Function} Constructor 构造函数
 * @param {...any} args 参数
 */
function myNew(Constructor, ...args) {
    // 步骤 1: 创建一个新的空对象
    // 这个对象就是未来的实例
    const obj = {};
    console.log("1. 创建新对象:", obj);

    // 步骤 2: 将新对象的原型链接到构造函数的 prototype 属性
    // 这一步让 obj 能访问 Person.prototype 上的方法（如 sayHello）
    Object.setPrototypeOf(obj, Constructor.prototype);
    // 或者写成: obj.__proto__ = Constructor.prototype;
    console.log("2. 链接原型:", obj.__proto__ === Constructor.prototype);

    // 步骤 3: 将构造函数中的 this 绑定到这个新对象，并执行构造函数
    // 这一步给 obj 添加属性（如 name, age）
    const result = Constructor.apply(obj, args);
    console.log("3. 执行构造函数，绑定 this，属性已添加:", obj);

    // 步骤 4: 返回结果
    // 如果构造函数显式返回了一个对象，则返回该对象；否则返回我们创建的新对象
    const finalResult = (typeof result === 'object' && result !== null) ? result : obj;
    console.log("4. 返回最终实例");
    return finalResult;
}

const p2 = myNew(Person, "小红", 20);
p2.sayHello();
console.log("p2 是 Person 的实例吗?", p2 instanceof Person);
