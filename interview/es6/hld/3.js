// thenable

function light(color, ms) {
  console.log(color);
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function loop() {
  light("🔴卢的高傲", 1000)
    // 控制流程，异步变同步
    .then(() => light("🟡卢的高傲", 3000))
    // 当上一步的返回值是promise 的话 可以 继续.then
    .then(() => light("🟢卢的高傲", 4000))
    .then(() => loop());
}

loop();
