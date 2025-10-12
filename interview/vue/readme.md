# 组件通信

- 父子组件通信
- 子父同行
- 兄弟
- 跨组件通信
- 全局共享
- 事件总线

## vue 选项式(Options) API (vue2)

- 选项式写法，非常傻瓜，好理解
  - `data (){} ` 里放数据
  - `props  ` 放参数
  - `methods` 放方法

## vue setup 组合式 API 函数式写法

- 组合式 api
  - 好处是新手喜欢
  - 但是会被类式写法限制 this 丢失问题
  - vue3 setup 组合式 API 借鉴 react 写法
  - provide/inject 跨组件通信
  - 订阅发布者模式
