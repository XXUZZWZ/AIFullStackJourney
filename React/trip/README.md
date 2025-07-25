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
    - 灵活拓展各种平台和

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
- 自定义 hooks

  - useTitle

- tabbar
  - react-vant + @react-vant/icons
  - value + onChange 响应式
  - 直接点击链接分享 active 的设置
- es6 特性的使用

  - Tabbar 的高亮
  - arr.findIndex
  - string.startsWith

- 项目迭代
  - 功能由由浅入深
  - chatbot deepseek 简单 chat
  - deepseek-r1 推理模型
  - 流式输出
  - coze 工作流接口调用
  - 上下文 LRU
