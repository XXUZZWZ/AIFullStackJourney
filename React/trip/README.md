# React 旅游 APP

### README IS IMPOREMENT 方便面试官

## 类型

- 移动 App
- 模仿 App
  - 喜欢的
  - 国外项目
  - 模仿，要有点改变
- 绝大多数考点
  - 都适用于任何 app

## 技术栈

- React 全家桶
  - React 组件开发+hooks
    - 组件封装
    - 受控和非受控组件
    - 第三方组件库
    - 全面 hooks 编程
    - 自定义 hooks 编程
  - React-router-dom
    - SPA
    - 路由守卫
    - 懒加载
  - zustand
- mock 接口模拟
- axios 请求拦截和处理响应
- jwt 登录
- module css
  - 弹性布局
  - transition transform ...
- vite 配置
- 性能优化
  - 防抖节流
  - useCallback(),useMemo(),React.memo()
- css 预处理器 stylus
- LLM
  - chat
  - 生成图片
  - 语音
  - coze 工作流 调用
  - 流式输出 SSE
- 移动端适配
  - rem 方案
- 单例模式 设计
- git 提交等编程风格

## 项目架构

- api
- components
- pages
- store
- hooks
- mock

## 开发前的准备

- 安装的一些包
  - 生产依赖
  - react-router-dom,zustand,axios
  - react-vant(UI 组件库)
  - lib-flexible 0.3.2
  - postcss postcss-pxtorem
  - 开发依赖
    - vite-plugin-mock jwt
- vite 配置

  - alias
  - mock
  - .env.local
    - llm api key
  - user-scalable=no

  - css 预处理
    - index.css reset
      - box-sizing font-family:-apply-system
    - App.css 全局通用样式
    - module.css 模块化样式
  - 移动端适配 rem
    - 不能用 px,要用相对单位 rem 相对于 html 的 16px
    - 不同的设备体验要一致
    - 不同尺寸手机 等比例缩放
    - 设计师设计稿 750px iphone 6 375pt\*2 = 750;
      - 小米
      - css 一行代码？会让其他尺寸大小不适应 html font-size 等比例
      - layout
      - flexible.js 阿里解决了在任何设备
        1 rem = 屏幕宽度/10
    - layout

- lib-flexible

  - 阿里开源
  - 设置 html fontSize = window.innerWidth/10;
  - css px 宽度 = 手机设备宽度 = 375
  - 1 个 px = 2 个发光源
  - 750 px 设计稿

- 设计稿查看盒子的大小？

  - 1px 不差的还原设计稿
  - 设计稿中像素单位
  - /75

## 项目亮点和难点

- 移动端适配
  - lib-flexible 1rem = 屏幕宽度的 1/10;
  - 设计稿 尺寸是 iphone 标准尺寸 750；
  - 前端的职责是还原设计稿
  - 频繁单位换算
  - 自动化? 安装 postcss postcss-pxtorem
  - postcss 是 css 预处理器，功能强大
  - vite 自动读取 postcss.config.js 将 css 内容编译
  - 自动把 px ==> rem
- 前端智能
  - chat 函数
  - 对各家模型比较感兴趣，升级为 kimichat,doubaochat
    - 随意切换大模型，通过参数抽象，实现切换。
    - 性能 能力 性价比
    - 灵活拓展各种平台
- 原子 css
  - App.css 里添加通用样式
  - 各自模块里 module.css
  - lib-flexible 移动端适配
  - postcss pxtorem 插件 快速还原设计稿
  - 原子类的 css
    - 一个元素按功能逻辑分成多个类，和原子一样
    - 元素的样式由这些原子类组合而成
    - 样式可以复用得更好，以后几乎可以不用写样式(积累足够的原子样式)
  - 文生图
    - 优化 prompt 设计
  - 智能生成图片
    - 产品
    - 冰球社群的宠物智能出图
    - 具有社交属性
    - 商业价值
    - 技术服务
    - coze 工作流 智能编排 AI 流程
    - API 调用
  - 设计工作流 ani_pic
    - 上传宠物照片，生成宠物并且冰球运动员
    - 代码节点
      - 参数校验和逻辑功能，返回运行结果
      - 图片生成流程
      - 图片理解插件 计算机视觉
      - 大模型特征提取
      - 结合 prompt
    - workflow_id:7533134717945561123
    - taken pat_ZQajpv00ut0C3wIBkcgPECPrW0FMpob2en9mujbwJadxElbUVDS2arT8wxmCCLWn
    - coze 图片要上传到 coze 存贮
    - 拿到 file_id
    - url + token + new FromData
    - append(file)
    - workflowUrl + workflow_id + token
      - 工作流需要的参数
- 用户体验
  - 搜索建议+防抖+useMemo 性能优化
  - 组件粒度划分
    - React.memo + useCallback 性能优化
  - 懒加载
  - 热门推荐 + 相关的商品(产品)
  - SPA
  - 骨架屏 不用用户等待
  - 文件上传 preview html5 FileReader 对象
- 语音输入发表文章
  - 字节的 tts
  - onMouseDown
  - BOM html5 API navigator.mediaDevices.getUserMedia({audio:true})
    - 用户隐私，要授权 getLocation()

## 项目遇到过什么问题？

- chat messages 遇到 message 覆盖问题
- 闭包陷阱问题
  - 一次事件里面 ，两次 setMessage 设置值，第二次会覆盖第一次。
- 升级的瀑布流？
  - 骨架屏
  - 瀑布流排布算法
    - 奇偶来分布可能出现一边多，另一边少，不好看
    - 优化，使用两个响应式数组，两个数组当前长度更低的高度就 添加元素进入数组。
  - 封装一个 intersectionObserver 用了两次， 不符合 dry 原则封装成 自定义 hooks

## git 提交规范

- 项目初始化

## 功能模块

- UI 组件库
  - React-vant 第三方组件库 70% 的组件已经有了
  - 选择一个适合业务的组件库，或者公司内部的组件库
- 配置路由和懒加载
  - 懒加载
  - 路由守卫
  - Layout 组件
  - Layout 组件
    - 嵌套路由 Outlet 分组路由配置
- chatbot

  - llm 模块
  - 迭代 chat ,支持任意模型。

- Search

  - 防抖
  - api
    - google suggest
  - localStorage

- 自定义 hooks

  - useTitle

- tabbar
  - react-vant + @react-vant/icons
  - value + onChange 响应式
  - 直接点击链接分享 active 的设置
- 瀑布流
  - 现代小红书等主流 app 的内容浏览用户体验产品
  - 图片高度不一致
  - 落差感
  - 滚动加载更多，图片懒加载
  - 接口
    - /api/images?page=${n} 支持翻页
    - 唯一 id page + index
    - 水及图片 高度随机
    - images 怎么放到两列中(奇偶来分配)？
    - 加载更多，位于盒子底部元素 通过使用
    - InterSectionObserver
    - 组件卸载时直接 使用 useEffect(()=>{return ()=>{
      disconnect();
      } },[])
      卸载观察器，防止内存泄漏
    - 观察了是否出现在视窗,性能更好，使用了观察者模式。
    - key id 下拉刷新
    - 使用 IntersectionObserver 再次图片懒加载 data-src 属性
- es6 特性的使用

  - Tabbar 的高亮
  - arr.findIndex
  - string.startsWith
  - promise
  - 瀑布流随机数据生成
    - Array.from({length:10},(\_,i)=>({id:i})) es6 添加了 map 方法

- toast 组件封装

  - 需要自定义 UI 组件库满足需求
  - UI props 属性 分别是 .....
  - 使用 js 来显示出来，可以跨层级通信
    - 订阅发布者
  - 使用 mitt 轻量级 event bus 事件总线
    - 实例化 mitt()
    - on(自定义事件名,回调函数)
    - emit(自定义事件名,参数)
    - 收到事件后，执行回调函数 bind(this,参数)
      组件通过监听一个自定义的事件，实现基于事件的组件通信

- 项目迭代
  - 功能由由浅入深
  - chatbot deepseek 简单 chat
  - deepseek-r1 推理模型
  - 流式输出
  - coze 工作流接口调用
  - 上下文 LRU

## 通用组件

- Loading
  - 相对视口 居中方案 。position: fixed; left: 0; right: 0; bottom: 0; top: 0; margin: auto;
  - React.memo 无状态的组件不重新渲染
  - animation

## AI 功能

- 智能前端(http 请求)
- 工作流接口调用+coze api
- ai 全新工作链路
- 自动化 Agent
