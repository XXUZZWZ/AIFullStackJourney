# 面试热题 跨域

- 大前端

  - 都是 js
  - React/Vue mvvm
  - node.js 后端
  - 移动端 (ios/android)
  - 桌面端 (electron) 比如 TS 写的 vscode
  - 嵌入式

- 前后端联调

  - 前后端分离 跨域
  - 前端 server 在 5174
  - 后端 server 在 8080
  - 同源
    || protocol://domain:port
    domain 不同肯定不属于同源政策
    http://localhost:5173 -> http://www.baidu.com/api/user; 不同源
    http://localhost:5173 -> https://localhost:5173/api/user; 不同源
    cross origin
    http://localhost:5173 -> http://localhost:8080/api/user; 不同源
    origin = http(s) + domain + port 不同源
    被 block 掉了
    浏览器抛弃了响应，请求已经发出去了，也响应了
    Cross-Origin Resource Sharing

    - 协议要一样
    - protocol 要一样
    - domain 域名相同
    - port 端口号相同
      如果有一个不同就会跨域
    - CORS policy 同源政策

- 为什么要学习跨域

  - 前端后端分离 是日常开发的形式，端口或域名不一样
  - CORS Policy 同源策略？
    - 浏览器的机制
    - 请求到了服务器端吗？
  - 怎么解决跨域？
  - 安全问题？
    - 前端千千万万的用户的安全
  - 怎么解决跨域？

  - 怎么解决跨域问题
    - 既拿到 cross origin 资源 ，同时又不违反 CORS 机制
    - fetch /xhr 被 cors 管着了
    - Cookie / localStorage
  - img 可以跨域
  - script link 可以跨域
  - 不用被管着的 fetch /xhr / axios 用 script 标签

- 使用 script 标签解决跨域问题 jsonp json with padding

  - script 标签的 src 属性 发送一个请求
  - src 地址返回 json 数据
  - json 前端需要后端提供的数据
  - Padding
    - 必须是 get 请求
    - 响应头中需要有 Content-Type: application/javascript
  - 前端想要的是 json 数据
  - 在前端放一个函数，后端返回一个 js 函数的执行，在执行的时候将数据传给函数
  - 需要后端配合

- JSONP 利用了 script 可以跨域进行访问

  - 前端使用 script 标签
  - 需要后端配合,返回的 json 外面包含着函数
  - 页面上有个函数在等待执行
  - 函数执行时，将数据传递给函数
  - 复杂，能不能封装一下？

- 手写 jsonp 获取动态数据，script 原来加载静态的 js 的逻辑
  - 后端配合解析 script url get 请求中的 callback 参数值
  - 请求 A,请求 B,请求 C,请求 D
  - 前端封装
