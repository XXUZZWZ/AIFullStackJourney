# 浏览器

## 从 url 输入到浏览器渲染页面

- 看到一个学习者的知识体系

1. 网络
2. DNS 解析
3. 获取 HTML
4. 浏览器渲染
5. 浏览器进程和线程

## 多进程多线程架构 以 Chrome 内核为例

### 浏览器主要进程

- 浏览器主进程
- 渲染进程
- 网络进程
- 下载进程
- 插件进程 flash
- GPU 进程
- 进程间通信

### 要点

- 输入 url 到下载到 html ,切入多浏览器多进程的讲解
- 进程间的通信
- 浏览器多进程多线程架构

  - Browser 负责管理的各个进程
  - Browser 进程和其他进程的通信
  - GPU only one 如果使用 transform 3d opcity willchange 浏览器会开启 gpu 进程

- 要点
  - 每个 tab 都用自己的独立 Renderer 进程
  - 安全，互不·影响
  - 渲染进程会把渲染结果的 bitmap 给 Browser 来显示
  - js 引擎和 gui 进程互斥 如果 js 执行时间过长，就会造成页面渲染
  - event loop 涉及那些线程

### Mojo IPC（Chromium 进程间通信）

- 什么是 Mojo：Chromium 的跨进程通信框架（替代早期自定义 IPC），负责 Browser/Renderer/GPU/Network 等进程之间的消息传递。
- 核心抽象：
  - Message Pipe：全双工消息管道，两端都可收发消息。
  - Handles：可随消息传递的句柄（MessagePipe、DataPipe、SharedBuffer、PlatformHandle）。
  - 接口（.mojom）：定义强类型方法，代码生成 Proxy/Stub，调用方法=发消息，返回值=回消息。
- 通信模型：
  - 以异步为主，消息在绑定的任务队列上回调；支持请求-响应/单向消息。
  - DataPipe/SharedBuffer 支持大数据低/零拷贝传输；同一管道内消息有序。
- 建链与传输：
  - 父进程创建管道并把一端传给子进程，或通过 Invitation 建立连接。
  - 底层依平台（Windows Named Pipe、Unix Domain Socket、Mach ports），必要时经 Broker 转交句柄。
- 与 Web 层关系：
  - Web 开发者使用的是 postMessage、Worker、BroadcastChannel、IndexedDB 等；背后在浏览器内部常通过 Mojo/线程队列/共享内存实现跨进程/线程协作。
