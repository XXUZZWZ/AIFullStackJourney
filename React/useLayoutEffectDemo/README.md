# useLayoutEffect

- useEffect
  - 渲染完成之后执行(挂载时)
  - update 时 [dependencies]变化时执行
  - return 的函数在 组件卸载时执行
- useLayoutEffect
  - 渲染完成之前执行(挂载时)
  - 会阻塞页面的渲染
- 能解决什么问题
  - 类似"同步"拿的未还被渲染的与元素的样式
  - 防止闪烁，用户体验 bug,短时间频繁更新页面，导致页面闪烁。
