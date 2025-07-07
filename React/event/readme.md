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
