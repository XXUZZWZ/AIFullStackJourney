function CreateCounter(num) {
  // 公共变量
  this.num = num;
  // 私有变量
  let count = 0;
}

let obj = new CreateCounter(1);
