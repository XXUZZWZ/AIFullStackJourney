# 单页应用(SPA)路由实现原理

## 原生JavaScript实现SPA

### 核心原理
1. **HTML5 History API**:
   - `history.pushState()`: 添加历史记录而不刷新页面
   - `history.replaceState()`: 替换当前历史记录
   - `popstate`事件: 监听浏览器前进/后退

2. **当前项目实现分析**:
```javascript
// 路由跳转(添加历史记录)
function navigate(path) {
  history.pushState({ path }, null, path)
  render(path)
}

// 路由替换(不添加历史记录) 
function replace(path) {
  history.replaceState({ path }, null, path)
  render(path)
}

// 监听浏览器前进后退
window.addEventListener('popstate', (event) => {
  render(event.state?.path || location.pathname)
})
```

### Node服务器配合要点
1. **服务器配置**:
```javascript
// 对所有路由返回index.html
server.createServer((req, res) => {
  if (req.method === "GET") {
    fs.readFile("index.html", (err, content) => {
      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(content)
    })
  }
})
```

2. **关键点**:
   - 服务器需配置为所有路径返回index.html
   - 前端处理路由逻辑
   - 避免硬刷新导致404

## React-router-dom源码与原生的相似性

### 核心相似点分析
1. **History API使用**:
```javascript
// 原生实现
history.pushState(state, null, path);
history.replaceState(state, null, path);

// react-router-dom源码 (BrowserRouter)
const history = createBrowserHistory();
history.push(path);
history.replace(path);
```

2. **事件监听机制**:
```javascript
// 原生实现
window.addEventListener('popstate', handler);

// react-router-dom源码
window.addEventListener('popstate', handlePop);
```

3. **路由状态管理**:
```javascript
// 原生实现
history.pushState({ path }, null, path);

// react-router-dom源码
const transitionManager = createTransitionManager();
transitionManager.push(location);
```

4. **核心流程相似性**:
   - 都使用History API管理路由状态
   - 都监听popstate事件处理浏览器导航
   - 都维护当前路由状态对象
   - 路由变更后都触发视图更新

### 主要差异点
1. **抽象层级**:
   - 原生: 直接操作History API
   - react-router: 封装成统一接口

2. **状态管理**:
   - 原生: 简单对象存储
   - react-router: 使用transitionManager管理复杂状态

3. **扩展能力**:
   - 原生: 功能有限
   - react-router: 支持中间件、路由守卫等

## 对比分析

| 特性                | 原生实现         | React-router-dom  |
|---------------------|----------------|-------------------|
| 路由类型            | 仅History API   | 支持多种路由类型  |
| 嵌套路由            | 需手动实现      | 内置支持          |
| 路由守卫            | 需手动实现      | 内置支持          |
| 懒加载              | 需手动实现      | 内置支持          |
| 代码复杂度          | 低             | 中                |
| 功能完整性          | 基础功能        | 企业级功能        |

## 最佳实践建议

1. **简单项目**: 原生实现足够
2. **复杂应用**: 使用React-router-dom
3. **服务器配置**: 始终确保返回index.html
4. **SEO考虑**: 需要服务端渲染(SSR)配合
