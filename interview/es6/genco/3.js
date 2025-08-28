// 🏃‍♂️ 15分钟强化训练
//训练1：Generator 纠错

// 修正这个有bug的代码
function* broken() {
  yield 1;
  yield 2;
  return 3;
  yield 4; // 这行会执行吗？
}

// 你的答案：__不会____

// 用5行代码实现runAsyncGenerator的核心逻辑
function miniRunner(gen) {
  // 你的5行代码
  const gen = gen();
  function next(res) {
    const { value, done } = next(res);
    if (done) {
      return value;
    }
    value.then((res) => next(res));
  }
  next();
}

// 看编译代码识别状态
function _context() {
  switch (_context.prev) {
    case 0:
      return fetch("/api");
    case 1:
      return _context.sent.json();
    case 2:
      return _context.sent;
  }
}
// 问：原始代码是什么？

fetch("api")
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
  });
