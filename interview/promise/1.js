const p1 = Promise.resolve("p1");

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p2延时一秒");
  }, 1000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p3延时一秒");
  }, 1000);
});

// 并行
//
console.time("all");
Promise.all([p1, p2, p3])
  .then((res) => {
    console.log(res, "all p1 p2 p3 then");
    console.timeLog("all", "打印阶段完成");
  })
  .catch((err) => {
    console.log(err, "all p1 p2 p3 catch");
  })
  .finally(() => {
    console.timeEnd("all");
  });

const p4 = new Promise((resolve, reject) => {
  reject("p4 立即 reject");
});

const p5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("p5 reject延时一秒");
  }, 1000);
});

// Promise.all([p1, p2, p5, p4])
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err, "all p1 p2 p5 p4 catch");
//   });
