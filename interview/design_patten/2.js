// 单例模式的写法
// 闭包写法
// 面向对象写法 static

// IIFE 创建闭包的手段
const Singleton = (function () {
  let instance = null;
  function createInstance() {
    return {
      name: "MySingleton",
      timestamp: Date.now(),
      sayHello() {
        console.log(
          `Hello, I am ${this.name} and the current timestamp is ${this.timestamp}`
        );
      },
    };
  }
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const obj1 = Singleton.getInstance();

const obj2 = Singleton.getInstance();

console.log(obj1 === obj2);
