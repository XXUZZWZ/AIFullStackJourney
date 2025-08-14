const target = {
  a: 1,
  b: 2,
};

const source = {
  b: 4,
  c: 5,
  huanxingtian: {
    name: "hxt",
    hobbies: ["football", "basketball", "valuolante"],
  },
};

Object.assign(target, source);

console.log(target);

source.huanxingtian.hobbies.push("swimming");
source.c = "hxt2"; // 改变 source.c 的值 不影响 target.c
console.log(target);
console.log(source.huanxingtian === target.huanxingtian);
