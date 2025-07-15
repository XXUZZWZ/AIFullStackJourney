# deep router

## router

## 路由守卫 401 禁止访问

## 301 302 重定向

## 404 找不到

## 性能优化

## SPA 带来了优质的用户体验

### 切换快

### 减少白屏时间

## 不依赖于 http 去服务器请求页面

## 前端首先添加路由 开发 SPA 应用

React
ReactRouter
Redux

## 导航，封装

## 路由懒加载

- lazyLoad
- / home
- /about About
  最快加载出首页

## ES6 模块引入时的执行行为

在使用 ES6 的 `import` 引入模块时，模块的代码会在引入时立即执行。这是因为 ES6 模块是静态加载的，编译阶段就会确定模块的依赖关系，并在运行时按顺序执行模块代码。

### 注意事项

- 模块只会被加载和执行一次，后续的引入会直接使用缓存。
- 如果模块中有副作用代码（如全局变量修改），需要特别注意其执行顺序。
- 使用 `export` 和 `import` 时，模块的导出是实时绑定的，意味着导入的值会随导出值的变化而更新。

### 示例

```javascript
// moduleA.js
console.log("Module A is loaded");
export const value = 42;

// main.js
import { value } from "./moduleA.js";
console.log(value);
```

运行 `main.js` 时，控制台输出：

```
Module A is loaded
42
```

## 懒加载流程

1. 导入 {lazy,Suspense} from 'react'

- import es6 加载并执行太多非必要组件。
- 影响首页的加载数据，特别是页面多的时候。
- lazy 高阶组件，返回值是一个组件
- lazy(()=>import('./pages/Home')) 动态加载
- <Route/> 匹配到才会动态加载相应的组件
- Suspense 还未加载时，渲染 fallback(jsx)

2.
