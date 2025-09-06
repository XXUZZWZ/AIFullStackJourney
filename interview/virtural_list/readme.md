# 虚拟列表

- 一次性给你 10 w 条数据插入页面，你会怎么做？
  - 时间分片
  - 虚拟列表
    - 没有必要，只要加载视窗
    - container 高度 scroll
    - offsetTop 偏移量 transform translateY 移动
    - index start --> end
    - item height
- eventLoop
  - 浏览器会如何处理？
  - js 单线程开销肯定很大，页面的卡顿
  - 页面渲染开销也大
  - Layout 树的重新布局
  - 比如智慧城市这些
