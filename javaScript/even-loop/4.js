console.log("同步start");

const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = new Promise((resolve) => {
  console.log("promise3");
  resolve(3);
});
promise1.then((value) => console.log(value));
promise2.then((value) => console.log(value));
promise3.then((value) => console.log(value));

setTimeout(() => {
  console.log("下一把相见");
  const promise4 = Promise.resolve(4);
  promise4.then((value) => console.log(value));
  setTimeout(() => {
    console.log("下下一把相见");
  }, 0);
}, 0);
console.log("同步end");
