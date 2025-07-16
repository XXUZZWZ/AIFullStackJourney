# 单例模式

## 实现 Storage ,使得该对象为单例，基于 LoaclStorage 进行封装。实现方法 setItem,和 getItem

setItem(key,value),和 getItem(key)

- 分析题目

实现 Storage 类

- design pattern 设计模式
- 封装

## 单例模式

- 单例是一种设计模式(static getInstance),高级程序的交流语言，一个类只能实例化一次。

- 一个类只能实例化一次，通过 static 属性 ，持有我们唯一的一次实例

- getInstance 判断 instance 并返回。
- 实例化的时候用 getInstance
- 性能特别好，好管理

## 登陆弹窗

- 体验
  不用跳转路由，直接弹窗。
  z-index : display none|block
  - 性能
    90%用户 不登陆
  - Modal html css js 比较多
    - 推迟到第一次用的时候
    - 以后再加载，就加载之前的复用。
    - 单例
