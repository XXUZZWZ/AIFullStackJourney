//生成器函数
// async 更好理解
// 内部函数是否有异步任务，可以控制

// es6 * + yeild
// 生成器函数
function* idGenerator() {
  let id = 1;
  while (id < 4) {
    yield id++;
  }
}

const gen = idGenerator();

// 迭代器
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value, gen.next().done);
console.log(gen.next().done, gen.next().done);
console.log(gen.next().value, gen.next().done);
