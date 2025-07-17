# 大型 React 项目架构优化方案

## 核心架构考虑因素

1. **数据状态管理**

   - 推荐使用 Context API + useReducer 组合
   - 大型项目可考虑 Redux Toolkit

2. **网络请求管理**

   - 统一的 API 错误处理
   - 请求拦截器配置
   - 类型安全的 API 封装

3. **路由管理**

   - 动态路由加载
   - 路由守卫实现
   - 嵌套路由配置

4. **组件架构**
   - 清晰的组件分层
   - 合理的代码分割
   - 性能优化策略

## 优化实现方案

### 1. 增强型状态管理

```jsx
// context/GlobalContext.jsx
import { createContext, useReducer } from "react";

export const GlobalContext = createContext();

const initialState = {
  user: null,
  repos: [],
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_REPOS":
      return { ...state, repos: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
```

### 2. 完善的 API 封装

```js
// api/repos.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.github.com/",
  timeout: 10000,
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: process.env.REACT_APP_GITHUB_TOKEN,
  },
});

// 请求拦截器
api.interceptors.request.use((config) => {
  console.log("Request:", config);
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export const getRepos = async (username) => {
  try {
    return await api.get(`users/${username}/repos`);
  } catch (error) {
    throw error;
  }
};
```

### 3. 优化路由配置

```jsx
// App.jsx
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loading } from "./components/Loading";

// 动态导入页面组件
const RepoList = lazy(() => import("./pages/RepoList"));
const RepoDetail = lazy(() => import("./pages/RepoDetail"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/users/:username/repos" element={<RepoList />} />
        <Route path="/repos/:repoName" element={<RepoDetail />} />
        <Route path="/users/:username" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/users/octocat/repos" />} />
      </Routes>
    </Suspense>
  );
}
```

### 4. 推荐的目录结构

```
src/
├── api/                # API封装
│   ├── repos.js
│   └── users.js
├── assets/             # 静态资源
├── components/         # 通用组件
│   ├── Layout/
│   ├── UI/
│   └── Loading.jsx
├── context/            # 全局状态
│   └── GlobalContext.jsx
├── hooks/              # 自定义Hook
├── pages/              # 页面组件
│   ├── RepoList/
│   ├── RepoDetail/
│   └── UserProfile/
├── utils/              # 工具函数
└── App.jsx
```

在 `src/components/` 目录中，`Layout/` 和 `UI/` 子目录分别承担不同的职责，以下是详细解释和示例：

---

### 1. **`Layout/` 目录：页面布局组件**

**职责**：定义整个页面的**骨架结构**（如导航栏、侧边栏、页脚等），负责不同页面间的**公共布局框架**，通常包含多个子组件的组合。

**典型组件示例**：

- `MainLayout.jsx` - 基础布局框架

  ```jsx
  // src/components/Layout/MainLayout.jsx
  import Header from "./Header";
  import Footer from "./Footer";

  const MainLayout = ({ children }) => (
    <div className="app">
      <Header /> {/* 顶部导航栏 */}
      <main className="content">
        {children} {/* 动态插入页面内容 */}
      </main>
      <Footer /> {/* 底部版权信息 */}
    </div>
  );
  export default MainLayout;
  ```

- **使用场景**：在 `App.jsx` 中包裹所有页面

  ```jsx
  // src/App.jsx
  import MainLayout from "./components/Layout/MainLayout";
  import HomePage from "./pages/HomePage";

  function App() {
    return (
      <MainLayout>
        <HomePage /> {/* 页面内容嵌入布局的 children 区域 */}
      </MainLayout>
    );
  }
  ```

---

### 2. **`UI/` 目录：基础 UI 组件**

**职责**：提供可复用的**视觉交互元素**（如按钮、卡片、弹窗等），这些组件是“原子级”的，不依赖业务逻辑，可在任何地方调用。

**典型组件示例**：

- `Button.jsx` - 通用按钮
  ```jsx
  // src/components/UI/Button.jsx
  const Button = ({ onClick, children, variant = "primary" }) => (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
  export default Button;
  ```
- `Card.jsx` - 内容卡片容器
  ```jsx
  // src/components/UI/Card.jsx
  const Card = ({ title, children }) => (
    <div className="card">
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-body">{children}</div>
    </div>
  );
  export default Card;
  ```
- **使用场景**：在业务页面中组合使用

  ```jsx
  // src/pages/RepoList/RepoList.jsx
  import Button from "../UI/Button";
  import Card from "../UI/Card";

  const RepoList = () => (
    <Card title="仓库列表">
      <ul>{/* 仓库列表数据 */}</ul>
      <Button variant="success" onClick={() => alert("创建仓库")}>
        新建仓库
      </Button>
    </Card>
  );
  ```

---

### 关键区别总结

| **目录**  | **组件类型** | **职责**             | **是否依赖业务** | **示例**                   |
| --------- | ------------ | -------------------- | ---------------- | -------------------------- |
| `Layout/` | 布局组件     | 定义页面整体结构     | 与业务弱关联     | `MainLayout`, `AuthLayout` |
| `UI/`     | 基础 UI 组件 | 提供可复用的交互元素 | 完全独立于业务   | `Button`, `Card`, `Modal`  |

---

### 为什么这样分层？

- **复用性**：`UI/` 组件可在全项目复用（如 `Button` 用于表单、弹窗等场景）。
- **维护性**：修改布局（如调整导航栏）只需更新 `Layout/` 组件，不影响内部页面逻辑。
- **关注点分离**：业务页面（`pages/`）只关注数据与流程，UI 展示由基础组件处理。

通过这种结构，项目能保持高可维护性和扩展性。

## 最佳实践建议

1. 使用自定义 Hook 封装业务逻辑
2. 实现组件按需加载
3. 添加完善的错误边界处理
4. 使用环境变量管理敏感信息
5. 配置统一的代码风格和 lint 规则
6. 实现自动化测试策略
