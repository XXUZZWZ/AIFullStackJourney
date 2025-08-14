// Object.defineProperty()

var obj = {
  num: 1,
  a: {
    b: 1,
  },
}; // 对象
// es5 提供的api 兼容性好
Object.defineProperty(obj, "num", {
  enumerable: true,
  configurable: true,
  writable: true,
  // set: function (newValue) {
  //   this.num = newValue;
  // },
  // get: function () {
  //   return this.num;
  // },
});
let num = 0;
Object.defineProperty(obj, "num", {
  get: function () {
    return num;
  },
  set: function (newValue) {
    num = newValue;
    return num;
  },
});

// obj.num = 10;
// console.log(obj.num);
// obj.num = 20;
// console.log(obj.num);

Object.defineProperty(obj, "num", { enumerable: false });
Object.defineProperty(obj, "a", { enumerable: false });

for (let key in obj) {
  console.log(key, "|||");
}

console.log(Object.keys(obj)); //这里的keys方法会返回对象中所有可枚举的属性名 因为没有可枚举的属性名 所以返回空数组
console.log("-----------------------------------------------------");
let keys = [];
console.log((keys = Object.getOwnPropertyNames(obj))); // 这里的getOwnPropertyNames方法会返回对象中所有属性名 包括不可枚举的属性名
for (let key of keys) {
  console.log(key, "|||", obj[key]);
}
console.log("-----------------------------------------------------");
Object.defineProperty(obj, "name", {
  writable: true,
});
obj.name = "newName";
console.log(obj.name);

for (let key in obj) {
  console.log(key, "|||", obj[key]);
}
