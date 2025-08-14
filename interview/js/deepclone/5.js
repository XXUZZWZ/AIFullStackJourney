const target = {
  a: 1,
};

Object.assign(target, null);
Object.assign(target, undefined);
console.log(target);

// const res = Object.assign(undefined, target);
// TypeError: Cannot convert undefined or null to object
console.log(res);

const obj = { name: "张三" };

const r =  Object.assign(obj);

console.log(r);
