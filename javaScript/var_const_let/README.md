# var let const
# JS代码的执行机制
  - 有一段代码
   硬盘读入内存
   - v8引擎
    chrome 的心脏 
  -编译阶段
  代码执行环境
  ```js
  currentVariable{
    showName:' ',
    myName
  }
  ```
   - 作用域
    全局
    函数
    块级
    - 作用域链
      变量查找的路径  当前作用域 --> 父作用域 ---> 父作用域的父作用域 ---> 全局作用域
      嵌套关系
      进行冒泡查找 
 - 变量提升 hoisting
 - var 变量声明会被提升到作用域的顶部，但是执行阶段的赋值不会，所以是undefined 
  函数的提升是对函数的定义，不是函数的调用
 - let  cosnt 为啥不行？
  会进入词法作用域
  不会进入变量提升
  进入暂时性死区 TDZ 
  不会进入作用域链

  
  
