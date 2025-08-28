function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    const that = this; // 这里保存this是正确的，但可以使用箭头函数来避免这个问题
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(that, args); // 这里使用apply是正确的
    }, delay);
  };
}

// 潜在问题和改进建议：
// 1. 缺少参数验证：应该检查fn是否为函数，delay是否为有效数字
// 2. 可以使用箭头函数来避免this绑定问题
// 3. 可以考虑添加立即执行选项（immediate参数）
// 4. 可以考虑添加取消功能（cancel方法）
