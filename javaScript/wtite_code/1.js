// /**
//  * new方法es5写法
//  */
// function objectFactory() {
//   let obj = new Object();
//   // 类数组没有数组方法，所以用call来写
//   var Constructor = Array.prototype.shift.call(arguments); // 构造函数
//   Constructor.apply(obj, arguments);
//   obj.__proto__ = Constructor.prototype;
//   var ret = Constructor.apply(obj, arguments);
//   //  ret||obj 处理ret为null的情况，仍然会返回obj
//   // typeof ret === "object"处理返回值式简单数据类型的情况
//   return typeof ret === "object" ? ret || obj : obj;
// }

/**
 * es6写法
 * @param {any} Constructor
 * @param  {...any} args
 * @returns 创建的实例
 */
function objectFactory(Constructor, ...args) {
  // var Constructor = Array.prototype.shift.call(arguments); // 构造函数
  let obj = new Object();

  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, args);
  return typeof ret === "object" ? ret || obj : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
  // 返回复杂类型就会替代本该返回的
  // this.name = name;
  // this.age = age;
  // return {
  //   name: name,
  //   age: 18,
  //   label: "hello",
  // };
  // 如果返回简单数据类型 会被忽略
  // return 1;
  return null;
}
Person.prototype.sayHi = function () {
  console.log(`my is ${this.name} ,my age is ${this.age}`);
};
let person = new Person("p1", 18);
// person.sayHi();
console.log(person);
let person2 = objectFactory(Person, "jtmd", 18);
console.log(person2);
person2.sayHi();
console.log(person2 instanceof Person);
// new Person("jtmd", 18)---> function [[consturct]] ->{}&&this->{} ->[[call]] --> {}.__proto__ --> Constructor.prototype----return {}
