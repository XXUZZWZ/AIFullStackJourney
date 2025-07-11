# React Router 面试指南：从基础到实战

## 引言

React Router 是 React 应用中处理路由的标准库，也是前端面试中的高频考点。本文将基于一个实际项目，从基础概念到实战应用，帮助你全面掌握 React Router 的核心知识点。

## 项目结构分析

我们的示例项目使用了以下技术栈：
- React 19.1.0
- React Router DOM 7.6.3
- Vite 6.3.5

```
router-demo/
├── src/
│   ├── App.jsx           # 主应用组件，配置路由
│   ├── main.jsx          # 应用入口
│   └── pages/
│       ├── Home/
│       │   └── index.jsx # 首页组件
│       └── About/
│           └── index.jsx # 关于页面组件
├── package.json
└── vite.config.js
```

## 一、基础概念（必考）

### 1. 核心组件解析

```jsx
import {
  BrowserRouter as Router, // 路由器组件，提供路由功能的上下文环境
  Routes, // 路由容器，用来包裹所有的路由规则
  Route // 单个路由规则，定义路径和对应的组件
} from 'react-router-dom'
```

**面试重点：**
- `BrowserRouter` vs `HashRouter` 的区别
- `Routes` 是 React Router v6+ 的新特性，替代了 v5 的 `Switch`
- `Route` 的 `element` 属性用法

### 2. 路由配置

```jsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
      </Routes>
    </Router>
  )
}
```

**面试问题：**
- Q: 为什么需要 `Router` 包裹整个应用？
- A: 提供路由上下文，让子组件可以访问路由信息和导航方法

## 二、导航实现（实战重点）

### 1. 声明式导航 - Link 组件

```jsx
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/about">Go to About</Link>
    </div>
  )
}
```

### 2. 编程式导航 - useNavigate Hook

```jsx
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/about')
  }
  
  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleClick}>Go to About</button>
    </div>
  )
}
```

**面试对比：**
- `Link` vs `<a>` 标签的区别
- `useNavigate` vs `useHistory`（v5）的变化

## 三、高级特性（进阶面试）

### 1. 路由参数

```jsx
// 动态路由
<Route path="/user/:id" element={<User />} />

// 获取参数
import { useParams } from 'react-router-dom'

const User = () => {
  const { id } = useParams()
  return <div>User ID: {id}</div>
}
```

### 2. 嵌套路由

```jsx
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="profile" element={<Profile />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

### 3. 路由守卫

```jsx
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}
```

## 四、常见面试问题与答案

### Q1: React Router 的工作原理是什么？

**答案：**
React Router 通过 HTML5 History API 或 Hash 来管理 URL，监听 URL 变化，根据当前 URL 匹配对应的组件进行渲染。核心是：
1. 路由监听：监听 URL 变化
2. 路由匹配：根据 URL 匹配对应的路由规则
3. 组件渲染：渲染匹配到的组件

### Q2: BrowserRouter 和 HashRouter 的区别？

**答案：**
- **BrowserRouter**: 使用 HTML5 History API，URL 更美观（/about），需要服务器配置
- **HashRouter**: 使用 URL hash（/#/about），不需要服务器配置，兼容性更好

### Q3: React Router v6 相比 v5 有哪些重要变化？

**答案：**
1. `Switch` 改为 `Routes`
2. `component` 和 `render` 改为 `element`
3. 新增 `useNavigate` 替代 `useHistory`
4. 路由匹配算法优化，支持相对路径
5. 嵌套路由更简洁

### Q4: 如何实现路由懒加载？

**答案：**
```jsx
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
```

## 五、性能优化要点

### 1. 路由懒加载
减少初始包大小，提高首屏加载速度

### 2. 预加载策略
```jsx
// 鼠标悬停时预加载
<Link 
  to="/about" 
  onMouseEnter={() => import('./pages/About')}
>
  About
</Link>
```

### 3. 路由缓存
使用 `React.memo` 避免不必要的重渲染

## 六、实战建议

### 1. 项目结构
```
src/
├── pages/          # 页面组件
├── components/     # 公共组件
├── hooks/         # 自定义 hooks
├── utils/         # 工具函数
└── routes/        # 路由配置
```

### 2. 路由配置管理
```jsx
// routes/index.js
export const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> }
]

// App.jsx
import { routes } from './routes'

function App() {
  return (
    <Router>
      <Routes>
        {routes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </Router>
  )
}
```

## 七、调试技巧

### 1. 使用 React DevTools
安装 React Router 相关的开发工具扩展

### 2. 路由调试
```jsx
import { useLocation } from 'react-router-dom'

const RouteDebugger = () => {
  const location = useLocation()
  console.log('Current route:', location)
  return null
}
```

## 总结

React Router 是 React 生态系统中不可或缺的一部分，掌握其核心概念和实战技巧对于前端开发者至关重要。本文从基础概念到高级特性，再到面试常见问题，全面覆盖了 React Router 的知识点。

**面试准备要点：**
1. 理解核心概念和工作原理
2. 熟练掌握基本用法和高级特性
3. 了解版本差异和最佳实践
4. 能够解决实际开发中的路由问题

通过本项目的实践和本文的学习，相信你已经具备了应对 React Router 相关面试题的能力。记住，理论与实践相结合，才能在面试中脱颖而出！