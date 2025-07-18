// 如何遍历数组

// for(let i = 0; i < arr.length; i++) 计数循环，性能好。可读性不好，不是人脑逻辑。
// while (i < arr.length){i++;}
// Arr.forEach() 负责迭代处理数组
// map filter find some every
// for item of arr   迭代处理数组

let arr = Array.of("Alice", "Bob", "Tom", "David");
arr.forEach((item, index) => {
  console.log(item, index);
  if (item === "Tom") {
    console.log("找到Tom了");
    // break; SyntaxError: Illegal break statement
    return;
  }
});
// 无法在遍历到中间时停止遍历
