console.log("start");

setTimeout(() => {
  console.log("timeout1");
}, 0);
Promise.resolve().then(() => {
  console.log("promise.resolve().then()1");
});
// 进程对象：process
// process.nextTick() 是 Node.js 的一个方法，用于在当前操作完成后立即执行回调函数,优先级高于一般微任务。
process.nextTick(() => {
  console.log("nextTick");
});
setTimeout(() => {
  console.log("timeout2");
  Promise.resolve().then(() => {
    console.log(" timeout2:promise.resolve().then()2");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("promise.resolve().then()2");
});
console.log("end");

/**
 *输出结果
start
end
nextTick
promise.resolve().then()1
promise.resolve().then()2
timeout1
timeout2
 */
