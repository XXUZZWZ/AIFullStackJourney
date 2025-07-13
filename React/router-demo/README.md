# react-router-dom

- 路由
  - 后端路由
    暴露资源
  - 前端路由
    - 首页
    - 列表页
      ...
  - 前端的页面导航有前端路由负责
- react 开头
  - react 生态系统的一部分
  - react
    - 响应式，状态管理，组件等核心功能。
    - 体积大，笨重。
    - 页面就会慢。
    - 少即是多
  - react-router-dom
  - redux/mobx/zustand
  - axios

## react 开发全家桶

- react 19
- react-router-dom 7.6.3(大版本，小版本，补丁版本)
- Redux

## React 特色

- 全面组件化
  比 VUE 更组件化和函数化编程

- 动态路由
  https://juejin.cn/users/6844903604820910080?a=1&b=2#hash
  path /user/:id params

  ### restful 国际规范

  - 后端路由·暴露资源
    url 是 定义的核心部分
    GET /users/:id
    GET /posts/:id 显示某个资源
    POST /post 新建一个文章
    PUT /post/:id 整体替换文章
    PUT /avatar:id 修改用户头像
    PATCH /post/:id 修改部分文章
    DELETE /post/:id 删除文章
    HEAD /post/:id 获取文章的元信息
    api/users/:id
  - 后端路由
    早期只有后端路由
    server--->https--->路由--->静态资源--->前端页面
    传统的后端开发方式

    - 展示下一个页面，再来一个请求
      /
      /about
      / 逻辑，数据库，套页面 MVC 开发方式 Model (对数据库的封装)，View(视图)，Controller (处理逻辑)
      优点：简单
      缺点：

      1. 刷新页面 404,要重新获取数据
      2. 前后端耦合 ----> 前后分离

  - 前端路由
    - 前端当家做主
    - 前端也有了路由
    - react-router-dom
      /user/:id 页面级别组件
    - html 、css 、js
      useState useEffect
      fetch 后端 api 接口 ，拿到数据
      完成 web 应用
      PC/Mobile/App/微信小程序/desktop/小程序/H5 大前端。
  - 前后端分离 MVVM Model(fetch) View(JSX) ViewModel(视图模型层 useState,通过数据绑定 JSX)
    - 要做前端联调 api 开发文档 ，和后端联调。
    - 前后端分离开发，以开发文档为约定。
