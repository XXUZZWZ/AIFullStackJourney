Function.prototype.mybind1 = function (context, ...args) {
  return function () {
    return this.apply(context, args);
  };
};

/*
问题分析：

1. this 指向错误：
   - 在返回的函数中，this 指向的是返回的函数本身，而不是原始的 mybind 方法
   - 应该保存原始函数的引用：const originalFunc = this;

2. 函数调用错误：
   - 应该调用保存的原始函数，而不是 this
   - 应该改为：return originalFunc.apply(context, args);

3. 参数合并缺失：
   - 原生的 bind 方法支持后续传参
   - 返回的函数应该能接收额外参数并与 bind 时的参数合并
   - 应该改为：function (...newArgs) { return originalFunc.apply(context, [...args, ...newArgs]); }

4. context 处理不完整：
   - 当 context 为 null 或 undefined 时，应该指向全局对象
   - 应该改为：context || globalThis

5. 参数传递不完整：
   - 返回的函数应该能够接收额外的参数
   - 需要合并 args 和 newArgs
*/

Function.prototype.mybind2 = function (context, ...args) {
  const oriFn = this;
  return function (...newArgs) {
    return oriFn.apply(context || globalThis || null, [...args, ...newArgs]);
  };
};

/*
mybind2 问题分析：

1. 逻辑运算符使用错误：
   - 使用了 | (按位或) 而不是 || (逻辑或)
   - context | globalThis | null 会进行按位运算，结果可能不是预期的
   - 应该改为：context || globalThis

2. 其他方面基本正确：
   - ✅ 保存了原始函数引用 (oriFn = this)
   - ✅ 支持后续传参 (...newArgs)
   - ✅ 合并了参数 ([...args, ...newArgs])
   - ✅ 使用了 apply 方法

修复建议：
return oriFn.apply(context || globalThis, [...args, ...newArgs]);
*/

/*
关于 this 指向的解释：

在 Function.prototype.mybind2 中：
- 当调用 mybind2 时，this 指向调用 mybind2 的函数
- 例如：function test() {}.mybind2(obj) 
- 此时 this 指向 test 函数

在返回的匿名函数中：
- 当调用返回的函数时，this 指向调用该函数的上下文
- 例如：const boundFn = test.mybind2(obj); boundFn();
- 此时返回函数中的 this 指向 boundFn 函数本身，而不是原始的 test 函数

这就是为什么需要保存原始函数引用：
- const oriFn = this; // 保存原始的 test 函数
- 在返回的函数中调用 oriFn.apply() 而不是 this.apply()

示例：
function greet(name) { console.log(`Hello ${name}, I'm ${this.name}`); }
const person = { name: 'Alice' };
const boundGreet = greet.mybind2(person, 'Bob');
boundGreet(); // 这里返回函数中的 this 指向 boundGreet，而不是 greet
*/
