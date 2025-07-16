function add(a, b) {
  return a + b;
}
// 不纯
let total = 0;
function NoPureAdd(a, b) {
  total += a + b;
  return total;
};
/**
 *
 * @param {*} a
 * @param {*} b
 * @param {*} obj
 * @returns
 */
function UnPureAdd(a, b, obj) {
  obj.a = a;
  //发请求
  fetch().then(() => {});
  document.getElementById("a").innerHTML = a;
  const reader = new FileReader();
  const file = document.getElementById("file").files[0];
  reader.readAsDataURL(file);
  return a + b;
}

// 纯函数
// 相同的输入一定会有一样的输出
// 没有副作用
// 用纯函数改变数据状态，全局状态更正确
// 不改变原来的变量，也不发生请求。
// 重要 很多地方都要使用
// 修改值也要遵从一定的修改规则

function PureAdd(a, b) {
  return a + b;
}
/*
 *核心原则：函数如同数学公式 f(x) = y
 *黄金法则：不改变世界，也不被世界改变
 *实践价值：构建可靠、可维护、可测试的代码基础
 */
export default add;
