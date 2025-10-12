const Singleton = (() =>{
  let instance = null;
  return ()=> instance || (instance = {
    name: "MySingleton",
    timestamp: Date.now(),
    sayHello(){
      console.log(`Hello, I am ${this.name} and the current timestamp is ${this.timestamp}`);
    }
  })
})();

const obj1 = Singleton();
const obj2 = Singleton();

console.log(obj1 === obj2);
obj1.sayHello();
obj2.sayHello();