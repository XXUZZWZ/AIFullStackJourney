global.gc();

console.log(process.memoryUsage());

const wm = new WeakMap();

let key = new Array(10 * 1024 * 1024);

wm.set(key, 1);
console.log(process.memoryUsage());
global.gc();
console.log(process.memoryUsage());

key = null;
global.gc();
console.log(process.memoryUsage());

for (let [k, v] of wm.entries()) {
  console.log("k:", k, "v:", v);
}
