target = {
  A: 1,
  B: 2,
  H: undefined,
  I: {
    A: 1,
    B: { A: 1, B: 2 },
  },
};

// const clone = JSON.parse(JSON.stringify(target));
// console.log(clone);
// { A: 1, B: 2, I: { A: 1, B: 2 } }
//  H : undefined 没有输出，因为undefined 不是合法的json值

function clone(source) {
  if (typeof source !== "object") {
    let targetTarget = {}; // 分配新空间
    for (const key in source) {
      // 用for key in 遍历对象
      targetTarget[key] = clone(source[key]);
    }
    return targetTarget;
  } else {
    return target;
  }
}
// 递归加拷贝
// 对数组支持不好

console.log(clone(target));

const obj = clone(target);
obj.I.A = 999;
console.log(target);
