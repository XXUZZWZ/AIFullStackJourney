// 深拷贝

const o1 = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
};

// 简单方法
const o2 = JSON.parse(JSON.stringify(o1));

console.log((o2.c = { str: "world" }));
console.log(o1);
console.log(o2 === o1);

// 常用的深拷贝
