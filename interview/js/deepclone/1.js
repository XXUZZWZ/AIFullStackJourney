// 有两个盒子 盒子A 放有钥匙 钱包

// 盒子B 放有实际，充电宝

const target = { a: 1, b: 666 }; // 后面的相同于源对象的属性会被后面的值覆盖
const source = { b: 2, c: { d: 3 } };
//Object.assign() 静态方法将一个或者多个源对象中所有可枚举的自有属性复制到目标对象，并返回修改后的目标对象。
// 常用于对象的浅拷贝和属性合并
const result = Object.assign(target, source);

console.log(result);
console.log(target);
console.log(source);
source.c.d = 999;
result.a = 888;
console.log(result);
console.log(target);
console.log(source);
