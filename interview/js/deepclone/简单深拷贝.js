let arr1 = [
  {
    name: "张",
    function() {
      console.log(this.name);
    },
  },
  1,
  2,
  3,
  4,
  [5, 6],
];

let arr2 = JSON.parse(JSON.stringify(arr1));

arr2[0].name = "张三";

arr2[0].hobbies = ["吃饭", "睡觉"];
console.log(arr1 === arr2);
console.log(arr1, arr2);
let arr3 = structuredClone(arr1);
console.log(arr3);
