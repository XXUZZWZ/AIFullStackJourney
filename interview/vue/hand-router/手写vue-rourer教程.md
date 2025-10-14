### 教程：手写一个迷你版 Vue Router（基于 Hash）

- **目标**: 理解你项目里手写路由的核心原理，能读懂、能扩展。
- **当前状态**: 已有 `Router` 容器、`RouterLink`、`RouterView`，且通过 provide/inject 在全局共享路由实例。

---

### 一、整体架构与职责

- **Router（路由实例）**: 保存 `routes`，在 `install(app)` 中做两件事：
  - `app.provide(ROUTER_KEY, this)` 共享实例
  - 注册全局组件 `router-link`、`router-view`
- **RouterLink**: 把 `to="/about"` 转成 `href="#/about"`，负责“跳转入口”
- **RouterView**: 计算当前 `hash` 对应的路由组件并渲染
- **useRouter()**: `inject(ROUTER_KEY)` 取到同一个路由实例

---

### 二、关键代码解读（你项目中的）

- `createRouter(options)`：返回 `new Router(options)`，核心是 `routes`
- `Router.install(app)`：完成 provide/inject 绑定与全局组件注册
- `RouterView.vue`（已修复）：
  - 用 `window.location.hash.slice(1)` 拿当前路径（默认为 `/`）
  - 在 `router.routes` 中 `find` 匹配，渲染对应的 `component`
- `RouterLink.vue`：渲染 `<a :href="'#' + props.to">`，点击改变 hash

---

### 三、渲染流程（从启动到显示页面）

1. `main.js` 中 `createApp(App).use(router).mount('#app')`
2. `router.install` 被调用，完成 provide 与全局组件注册
3. 页面里 `<router-link>` 负责跳转、`<router-view>` 负责显示
4. `<router-view>` 用计算属性根据 `location.hash` 找到匹配的 `route.component`
5. 组件被渲染到页面

---

### 四、Hash 路由的两个关键点

- **定位**: `window.location.hash` 存的是 `#/about`，去掉 `#` 就是路由路径
- **响应**: 需要监听 `hashchange` 事件来触发视图更新（建议做成 `ref`）

---

### 五、把“当前路径”做成响应式（建议改造）

下面是一段可借鉴的最小实现（教程示例，非必须 1:1 粘贴）：

```js
// 示例：实现一个简易的 createWebHashHistory + 响应式 currentPath

import { ref } from "vue";

export function createWebHashHistory() {
  const currentPath = ref(window.location.hash.slice(1) || "/");

  const update = () => {
    currentPath.value = window.location.hash.slice(1) || "/";
  };

  window.addEventListener("hashchange", update);
  // 可在 Router.install 卸载时移除监听，这里简化

  const push = (to) => {
    if (to.startsWith("#")) {
      window.location.hash = to;
    } else {
      window.location.hash = `#${to}`;
    }
  };

  return { currentPath, push };
}
```

在 `Router` 里使用它：

```js
class Router {
  constructor(options) {
    this.routes = options.routes;
    this.history = options.history; // { currentPath, push }
  }

  install(app) {
    app.provide("__router__", this);
    app.component("router-link", RouterLink);
    app.component("router-view", RouterView);
  }
}
```

在 `RouterView.vue` 中使用响应式的 `currentPath`：

```js
import { computed } from "vue";
import { useRouter } from "../grouter/index";

const router = useRouter();

const component = computed(() => {
  const current = router.history?.currentPath?.value || "/";
  const matched = router.routes.find((r) => r.path === current);
  return matched ? matched.component : null;
});
```

这样一来，只要 hash 变化，`currentPath` 就会变，`computed` 会自动刷新，`RouterView` 自动重渲染。

---

### 六、常见坑位与修复思路

- **属性名拼错**: `router.routers` 应为 `router.routes`
- **未定义变量**: 用了 `routeModule`，应直接用 `route`
- **不是响应式**: 只在计算里同步读取 `location.hash`，不监听 `hashchange`，不会自动更新
- **默认路径**: `''` 时要兜底成 `'/'`

---

### 七、建议的最小增强清单（循序渐进）

- **监听 hash**: 引入 `createWebHashHistory` 返回 `currentPath`（ref）与 `push`
- **API 补充**: 在 `router` 上暴露 `push('/about')`
- **active 高亮**: 在 `RouterLink` 里对比 `props.to` 与当前路径，加 `active` 类
- **404 兜底**: 未匹配路由时渲染一个 NotFound 组件
- **重定向**: 路由表支持 `{ path: '/', redirect: '/home' }`
- **嵌套路由**: `children` + 在子组件中再次使用 `router-view`
- **导航守卫**: 支持 `beforeEach((to, from, next) => {})`
- **history 模式**: 了解 `hash` 与 `history` 的差异（本项目先保留 hash）

---

### 八、练习题（动手巩固）

- 在 `RouterLink.vue` 中，根据当前路径为活动链接添加类名 `active`
- 在 `Router` 上新增 `push(to)` 方法，`<router-link>` 调用它而不是 `<a href>`
- 加一个 `NotFound.vue`，当 `find` 匹配不到时渲染它
- 实现简单的 `redirect`：当某条路由包含 `redirect` 时跳转到目标路径
- 尝试支持嵌套路由：`/about/team` 渲染 `About` 内部的 `Team`

---

如果你希望，我可以帮你把上述“响应式 history + push API + active 高亮 + 404 兜底”一次性改好，并保证不破坏你现有代码结构。
