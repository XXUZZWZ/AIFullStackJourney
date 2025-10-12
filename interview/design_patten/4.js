// 传统面向对象 static 方法
// 属于类的
class Singleton {
  static _instance = null;

  constructor(name) {
    if (Singleton._instance) {
      return Singleton._instance;
    }
    this.name = name || "ClassSingleton";
    Singleton._instance = this;
  }

  static getInstance(name) {
    if (!Singleton._instance) {
      Singleton._instance = new Singleton(name);
    }
    return Singleton._instance;
  }

  sayHello() {
    console.log(`Hello from ${this.name}`);
  }
}

const obj1 = Singleton.getInstance("obj1");
const obj2 = Singleton.getInstance("obj2");

console.log(obj1 === obj2);
obj1.sayHello();
obj2.sayHello();
