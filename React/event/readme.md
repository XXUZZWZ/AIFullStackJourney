# react 事件机制

- javascript 的事件机制
  - 异步
  - 监听一个事件
    - dom0 事件
      - <a onclick = "dosomething" ></a>
    - dom1 事件 dom 的版本，这里没有做 dom 的升级
    - dom2 事件
  - addEventListener(type,listener,useCapture)
    - callback 是异步处理的称呼
    - promise then
    - async await
      监听器
- useCapture // 是否使用捕获模式

  - 页面时浏览器渲染引擎像素点画出来的，通过点击位置判断那个元素被点击。
  - 默认是 false

    寻找 even.target
    为啥要有冒泡呢？
    dom 事件全阶段：根元素 -> 父元素 -> 子元素 -> 父元素 -> 根元素
    捕获阶段：根元素 ->父元素 -> 子元素 先触发父元素再触发子元素
    冒泡阶段：子元素 -> 父元素 -> 根元素 先触发子元素再触发父元素

渲染-->js 事件 ---> 事件委派

## 事件委托 //英文: event delegation

- 性能优化

  - 减少事件监听器数量
  - 将事件委托给最外层元素
  - react 是做大型项目的，事件类型特别多
  - 给我们的事件节点 event.target 元素添加一个唯一属性 data-set ,访问值 event.target.dataset.自定义属性

- 动态节点的事件
  - 滚动到底部，一次新增一堆的属性
  - 事件委托可以有效解决
- 给同一元素同一事件注册多次
  - dom 节点
  - event type
  - 监听器 (回调函数) 放到 even loop 里
    - 并给回调函数 event 对象 用 this 绑定
    - useCapture
    - event.preventDefault
      - form submit
      - a
    - event.stopPropagation //阻止冒泡
    - 用户交互的便利性
      - toggle 按钮
      - 点击页面任何地方
      - 点击弹窗外，弹 窗 消失
      - 显示区可以交互，不用关闭。
- SyntheticEvent 合成事件
  - 委托 #root
    - 性能优化框架帮我们办了
  - 事件池 Event pooling
    - 密集交互的大型应用
  - 最近的版本（React 17+ 的变革）可以安全使用了
