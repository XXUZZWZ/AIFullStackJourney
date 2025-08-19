function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function red() {
  console.log("🔴 红灯");
  return delay(3000);
}
function green() {
  console.log("🟢 绿灯");
  return delay(2000);
}
function yellow() {
  console.log("🟡 黄灯");
  return delay(1000);
}

function trafficLight() {
  red().then(green).then(yellow).then(trafficLight); // 递归循环
}

trafficLight();
