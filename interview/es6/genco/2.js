// 用这个模板练习
function* practice() {
  const a = yield Promise.resolve("step1");
  const b = yield Promise.resolve(a + "-step2");
  return b + "-done";
}

// 你的任务：手写playGame(practice)

function playGame(gen) {
  const gen = gen();
  const res1 = gen.next().value;

  res1.then((res) => {
    gen.next(res).value.then((res) => {
      console.log(res + gen.next().value);
    });
  });
}
