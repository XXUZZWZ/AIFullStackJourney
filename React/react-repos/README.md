# react repos

- api.github.io/users/XXUZZWZ/repos
- 综合 React 开发全家桶、项目级别、大型的、性能

## 路由设计

- react-router-dom
- /user/:username
- /repos/:id
- 懒加载
- 路由守卫
- hash or history routers
- useParams

## 数据管理

- App 数据管理
  - repos
  - useContext + useReducer+hooks
  - createContext + reducer + 自定义 useRepos 消费数据

## React

- 页面逻辑
- 组件的粒度

## api 负责网络请求

- axios
- 简介
  axios 是一个基于 Promise 的 HTTP 客户端，用于浏览器和 Node.js 环境，支持请求/响应拦截、自动转换 JSON 数据、取消请求等特性，简化了前端异步请求处理。
  axios http 请求
  axios.get('/api/users/XXUZZWZ/repos')
- 独立模块，所有的请求会从组件中分离到 api 目录下

## 项目的目录结构，项目架构

- api
  - 应用中所有的接口封装在这里
- main.jsx
  - 项目入口文件
  - 启动路由 SPA
  - 添加全局状态管理
  