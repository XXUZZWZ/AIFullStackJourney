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

## RepoList

- 功能模块
  - param 解析
    - 使用 useParam() 动态获取参数对象
    - 不要放到 useEffect 中,hook 中 hook 不能嵌套
    - 对数据进行校验 id,id 不合适的话跳转到首页，不要相信用户的任何提交。
    - navigate('/')最好放到 useEffect 中，处理副作用。
- 组件的开发模式
  - 页面组件负责页面 UI 显示,主要就是 hooks
  - state 逻辑处理使用封装好的 自定义 hooks,方便。
  - 全局状态管理应用层级 ，要用 context 来管理。
    - repos local error => context value
    - useReducer reducer 函数来改变状态
