const arr = new Array(5);
// console.log(arr[0]);
// console.log(arr);
// console.log(arr.length);
let obj = {
  name: "huluxiao",
};
let obj2 = {
  skill: "spout fire",
};
obj.__proto__ = obj2;

for (let key in obj) {
  console.log(key);
}

console.log(obj.hasOwnProperty("name"));
console.log(obj.hasOwnProperty("skill"));
console.log(obj.skill);
// console.log(arr.hasOwnProperty(0));
