globalThis.num = 100;

const fn = function () {
  return {
    num: 200,
    innerFn: function () {
      console.log(this.num);
    },
    arrowFn: () => {
      console.log(this.num);
    },
  };
};

const obj = fn();
console.log(obj.innerFn(),'obj.innerFn()');
console.log(obj.arrowFn(),'obj.arrowFn()');

// 他说的方法
const fn1 = fn.call(obj);
fn1.arrowFn();
