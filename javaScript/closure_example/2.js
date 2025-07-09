function debounce(fn, delay) {
  // let id = null;

  return function (args) {
    // fn 是自由变量
    // 函数也是一等对象
    // 给对象一个id 属性
    // if (fn.id) {
    //   clearTimeout(fn.id);
    // }
    let that = this; // 保存 this 上下文
    clearTimeout(fn.id);
    fn.id = setTimeout(() => {
      // this 丢失问题
      fn.call(that, args);
    }, delay);
  };
}

let obj = {
  count: 0,
  inc: debounce(function (val) {
    // this
    console.log(this, "||||");
    this.count += val;
    console.log(this.count);
  }, 500),
};

obj.inc(2);
