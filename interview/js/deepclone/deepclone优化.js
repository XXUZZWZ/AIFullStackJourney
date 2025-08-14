target = {
  A: 1,
  B: 2,
  I: { A: 1, B: 2 },
  H: undefined,
};
target.G = target; // 循环引用

// Map() es6 新数据类型
function clone(target, map = new WeakMap()) {
  if (typeof target === "object") {
    let cloneTarget = Array.isArray(target) ? [] : {};
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    for (const key in target) {
      cloneTarget[key] = clone(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}

console.log(clone(target));
// RangeError: Maximum call stack size exceeded
// 递归深拷贝包含循环引用的对象，会爆栈
