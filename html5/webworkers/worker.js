// console.log(document.body);
// 不是js单线程 是worker 线程 使用复杂或耗费性能都计算
// 这个能力来自浏览器
// js 还是单线程，只不过在复杂计算的时候用worker 线程
// console.log("fdsfsfsfsf", window);
// window 对象也没有

// 线程 之间通信
console.log(this);
// DedicatedWorkerGlobalScope 这里的全局对象是

self.onmessage = function (e) {
  console.log("worker 正在打印", e.data);
  self.postMessage("worker 回复 我打印好了");
};
