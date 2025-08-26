function creatCounter() {
  let count = 0;
  return {
    inc: () => count++,
    get: () => count,
  };
}

const counter = creatCounter();

counter.inc();
counter.inc();
console.log(counter.count);
console.log(counter.get());
