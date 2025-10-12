function bind(fn, that, ...args) {
  return function (...newArgs) {
    return fn.apply(that, [...args, ...newArgs]);
  };
}

function test() {
  this.a = 1;
  console.log(this);
}

test();

bind(test, { a: 3 })();
