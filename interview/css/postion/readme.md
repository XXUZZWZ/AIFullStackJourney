# position

- 五种属性值 准确 ，简洁

  - static 默认值 回到文档流。
  - relative 相对定位。 也是相对自身原来的位置定位不改变自身大小，不脱离文档流
  - absolute 绝对定位 相对最近的非 static 祖先定位 如果没有那么相对 body 定位
  - fixed 相对视窗定位
  - sticky 粘性定位，它让元素在滚动到特定阈值前 表现的像相对定位，达到阈值后实现类似吸顶或吸底的效果

- 业务场景

  - 结合 relative + absolute 消息提醒 在右上角
  - absolute + transform 水平垂直居中 模态框
  - fixed 回到顶部 ，聊天客服图标
  - sticky 粘连导航 不管页面有多长 导航在超出阀值后一直都在
    - 业务场景
      - 滚动到导航栏时自动吸顶，不用监听滚动事件；离开它所在的容器时会跟着消失（比如只在详情区固定）。
      - 表格表头固定 场景：表格内容很多，用户需要滚动查看数据，但希望表头一直可见。
      - 侧边目录 / 工具条 场景：文章阅读页面右侧有一个目录导航，随着正文滚动而跟随，但到页尾要停住。
      - 表单操作区固定场景：后台管理系统的表单很长，提交按钮希望用户随时能看到，但只在表单范围内固定。
  - 和 InersersectionObserver 有点像

  - 底层
    - 定位参照系
      - absolute 最近 position !== static 的祖先 || body
      - fiexd 就一定会相对视窗吗？ ？bug 不一定
        - 如果有祖先元素使用了 transform、filter 或 perspective → 会把 fixed 当成相对于这个这些个 transform 祖先元素等定位
        - 父元素使用了 contain: layout
        - iframe 内的 fixed 元素只相对于 iframe 可视区域 - sticky 会依赖滚动容器 - 独立图层渲染 ？？？

- 适当使用 transfrom : translate3d(0,0,0); 来独立渲染该流程 有利于性能优化 浏览器会使用 GPU 渲染

  - 但也不能乱用，过多的图层回增加内存 和管理开销。
  - 比如，登陆弹窗 ，transfrom /opcity 动画

- will-change

## position 有五个可选属性

- 应用场景的应用必须要知道
- 实际使用的坑比如 fixed 外层有元素 transform ,filter,perspective contain:layout
- sticky 依赖 滚动容器 定义阈值 ，如果滚动容器不在视口，sticky 元素 会消失，可以简化 js css 书写
