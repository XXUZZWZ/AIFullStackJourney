// reduce 消灭数组，只留下一个
// [1,2,3,4,5]
// reduce 负责繁杂的case下只有一个唯一的对的状态产生
// 新的状态，基于上一个状态去生成
const arr = [1, 2, 3, 4, 5];
let res = arr.reduce((prev, curr) => {
  return prev + curr;
}, 0);
// prev 上一次回调函数的返回值
// curr 当前的元素
console.log(res);
// 结合 reduce 去理解 useReducer

