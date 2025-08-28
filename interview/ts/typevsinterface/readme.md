# type 和 interface

[学习笔记：Type vs Interface 对比](./type-vs-interface-notes.md)

- 相同点
- 都可以用来声明类型，自定义类型

- 区别
- 当我们编写继承类的时候，interface 只要 extends 就可
- type 使用的是&符 合并类型声明
- type 可以定义基础类型，联合类型，元组类型，函数类型，类类型，interface 只能定义对象类型
- interface 只能描述对象结构 (函数，类)

- type 支持简单类型的别名 interface 不可以

- interface 和 type 在声明函数类型上有区别
