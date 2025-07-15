# 路由

## history

## hash

## 传统开发

### 用户体验有问题

- 每个页面都要重新请求，基于传统开发，响应慢
- 需要去服务器端拿 html 重新渲染
  - 白屏
  - a 链接切换页面
- 相比于 react-router-dom(局部热更新)要绘制全部内容
- 前端路由去负责
- 减少白屏的时间，因为传统后端

- 新的 react-router-dom(局部热更新) SPA 单页应用(single page application)
  - 只有一个页面但是能带来多个页面效果。

## SPA

- Single Page Application
- 只有一个页面，只需要一个页面
  -react 组件
  - 页面级别的组件
  - 文档流中占位置
  - Routes/Route 声明，文档流中占位
  - Routes 外面，Outlet 外面不在更新范围
  - Routes 内部显示那个页面
    - 热更新
  - SPA 用户体验特别帮

## 核心

- url 切换
  - 事件 hashChange 事件
  - 事件 pushState ,popState 事件
  - 不能用 a
  - Link (将跳转变成事件来处理)- 根据当前 url 取出相关组件去替换原来的组件。 - 可以阻止默认行为，使用 js 动态加载，修改元素的 display 等属性。 - 体验：url 变化了，竟然不用渲染整个页面。
  - 不用再看白屏，页面非常快。
    - 不用去后端拿页面 About,Home 都在前端
    - 加载速度非常快
    - 巨大提升，空间换时间，用户提前下载。

## url 改变，但是不改变渲染的解决方式

- hash 的改变

  - 原来是做页面锚点的，用于长页面的电梯，很古的功能

  ```html
  <a name="top">锚链接</a>

  <a href="#top">回到顶部</a>
  ```

  - 会触发事件，hashchange,在事件监听里处理dom
