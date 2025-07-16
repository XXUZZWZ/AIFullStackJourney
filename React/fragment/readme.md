# fragment <></> 是什么？

- 解决了什么问题？
  - React 要求每个组件的返回值只能有一个根元素，是由它的数据结构决定的，dom 树只有一个根的元素
- 是什么？
  - React 中，<></> 是语法糖，它可以替换<React.Fragment></React.Fragment> 缩写，从而解决这个问题。
- <> </> 和 <React.Fragment></React.Fragment> 是什么关系？

- 功能
  - 避免多余的 dom 结构和层次和元素
  - 性能更好
  - fragment 可以有 key 属性
- 项目中一定安排 Fragment key 属性
