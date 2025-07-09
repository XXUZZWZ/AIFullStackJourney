function CreateCounter(num) {
  // 对外的接口
  // 对内的私有
  this.num = num;
  // 私有变量
  // 私有的数据属性 private
  let count = 0;
  return {
    num,
    increment: function () {
      count++;
    },
    decrement: function () {
      count--;
    },
    getCount: function () {
      console.log("count value  is ", count);
      return count;
    },
  };
}

// let obj = new CreateCounter(1);
// obj.increment();
// console.log(obj.count); // undefined, 因为 count 是私有变量，不能直接

const counter = CreateCounter(1);
// console.log(counter.count); // undefined, 因为 count 是私有变量，不能直接访问
// 闭包延长了变量的生命周期
// 不直接操作它。
// counter.increment(); // 让方法来操作它
// console.log(counter.num); // 1
counter.getCount(); // count value is 1
