const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
// const sleep3 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sleep2 = (ms) => {
  const now = Date.now();
  while (Date.now() - now < ms) {}
};
(async () => {
  console.log("start");
  await sleep(2000);
  console.log("end");
})();

sleep2(3001);
console.log("|||||||||");

async function trafficLight() {
  const seq = [
    { color: "🔴red", ms: 1000 },
    { color: "🟡yellow", ms: 3000 },
    { color: "🟢green", ms: 3000 },
  ];
  while (true) {
    for (const { color, ms } of seq) {
      console.log(color);
      await sleep(ms);
    }
  }
}
trafficLight();
