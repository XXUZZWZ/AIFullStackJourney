const obj = {
  name: "Andrew",
};

const arrow = () => console.log(this.name);
const normal = function () {
  console.log(this.name);
};
arrow.call(obj); // undefined  静态
normal.call(obj); // Andrew  动态
