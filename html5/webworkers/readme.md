# webworkers

- html5 特性
- js 做复杂、耗费计算性能、时间等任务、同时开启多线程。
  - 浏览器端跑大模型
- js 是单线程的
  - 不适合计算
  - Web Worker 解决这个问题
- 端模型是一个趋势

  - 电脑 手机 植入大模型

- api

  - new Worker(url)
  - postMessage(data) 发消息
  - onmessage(e) 接收消息

- 复杂任务实例
  - 图片压缩
  - js 不擅长 计算
  - 但是可以通过 Worker 线程来处理 浏览器支持 发消息通知一下
