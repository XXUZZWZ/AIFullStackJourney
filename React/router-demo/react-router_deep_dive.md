# React Router 源码深度剖析：从原理到实战的完整指南

## 前言

React Router 是 React 生态系统中最重要的路由库之一。本文将从源码层面深入分析 React Router 的实现原理，帮助开发者彻底理解其工作机制，解决面试中的深层次问题。

> 本文基于 React Router v6.x 进行源码分析，涵盖架构设计、核心算法、性能优化等多个维度。

## 目录

1. [React Router 架构设计](#架构设计)
2. [BrowserRouter 与 HashRouter 源码实现](#router-实现)
3. [Routes 路由匹配算法深度解析](#routes-匹配算法)
4. [Hooks 实现原理](#hooks-实现)
5. [History API 封装与状态管理](#history-封装)
6. [Link 组件优化策略](#link-优化)
7. [路由懒加载底层实现](#懒加载实现)
8. [性能优化源码剖析](#性能优化)
9. [面试高频问题源码级解答](#面试问题)

## 架构设计

### 核心设计理念

React Router 的设计遵循以下几个核心原则：

1. **组件化路由**：将路由作为 React 组件，融入 React 的组件树
2. **声明式配置**：通过 JSX 声明式地定义路由规则
3. **上下文传递**：通过 React Context 在组件树中传递路由信息
4. **History 抽象**：对浏览器 History API 进行封装和抽象

### 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                   React Router                      │
├─────────────────────────────────────────────────────┤
│  Components Layer                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ BrowserRouter│  │   Routes    │  │    Link     │  │
│  │ HashRouter  │  │   Route     │  │  NavLink    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────┤
│  Hooks Layer                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │useNavigate  │  │useLocation  │  │ useParams   │  │
│  │useHistory   │  │ useMatch    │  │ useRoutes   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────┤
│  Context Layer                                      │
│  ┌─────────────┐  ┌─────────────┐                   │
│  │NavigationCtx│  │ LocationCtx │                   │
│  │RouteContext │  │DataRouterCtx│                   │
│  └─────────────┘  └─────────────┘                   │
├─────────────────────────────────────────────────────┤
│  History Layer                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │createBrowser│  │createMemory │  │ createHash  │  │
│  │   History   │  │   History   │  │   History   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────┤
│  Utils Layer                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Path Utils  │  │Route Matcher│  │ URL Utils   │  │
│  │ compilePath │  │ matchPath   │  │ resolvePath │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

## BrowserRouter 与 HashRouter 源码实现 {#router-实现}

### BrowserRouter 核心实现

```typescript
// packages/react-router-dom/index.tsx
import { Router } from "react-router";
import { createBrowserHistory } from "history";

export function BrowserRouter({
  basename,
  children,
  window
}: BrowserRouterProps) {
  // 创建 history 实例，只在初始化时创建一次
  let historyRef = React.useRef<BrowserHistory>();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ 
      window, 
      v5Compat: true 
    });
  }

  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  // 监听 history 变化
  React.useLayoutEffect(() => {
    return history.listen(setState);
  }, [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
```

**核心实现要点：**

1. **单例模式**：使用 `useRef` 确保 history 实例只创建一次
2. **状态同步**：通过 `useState` 和 `useLayoutEffect` 同步 history 状态
3. **事件监听**：使用 `history.listen` 监听 URL 变化

### HashRouter 实现差异

```typescript
// packages/react-router-dom/index.tsx
export function HashRouter({
  basename,
  children,
  window
}: HashRouterProps) {
  let historyRef = React.useRef<HashHistory>();
  if (historyRef.current == null) {
    historyRef.current = createHashHistory({ 
      window, 
      v5Compat: true 
    });
  }

  // 其余实现与 BrowserRouter 相同
  // ...
}
```

### createBrowserHistory 深度解析

```typescript
// packages/history/index.ts
export function createBrowserHistory(
  options: BrowserHistoryOptions = {}
): BrowserHistory {
  let { window = document.defaultView! } = options;
  let globalHistory = window.history;

  function getIndexAndLocation(): [number, Location] {
    let {
      pathname,
      search,
      hash,
    } = window.location;

    let state = globalHistory.state || {};
    return [
      state.idx,
      {
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || "default",
      },
    ];
  }

  let blockedPopTx: Transition | null = null;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      let nextAction = Action.Pop;
      let [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          let delta = index - nextIndex;
          if (delta) {
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(delta * -1);
              },
            };
            go(delta);
            return;
          }
        }
      }

      applyTx(nextAction);
    }
  }

  // 监听 popstate 事件
  window.addEventListener("popstate", handlePop);

  let history: BrowserHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref(to) {
      return typeof to === "string" ? to : createPath(to);
    },
    push(to, state) {
      let nextAction = Action.Push;
      let nextLocation = getNextLocation(to, state);
      
      if (blockers.length) {
        let nextIndex = index + 1;
        let nextEntry = {
          pathname: nextLocation.pathname,
          search: nextLocation.search,
          hash: nextLocation.hash,
          state: nextLocation.state,
          key: nextLocation.key,
        };
        
        globalHistory.pushState(
          { usr: nextLocation.state, key: nextLocation.key, idx: nextIndex },
          "",
          createHref(nextLocation)
        );
        
        applyTx(nextAction, nextLocation);
      }
    },
    replace(to, state) {
      // 类似 push 实现
    },
    go(delta) {
      globalHistory.go(delta);
    },
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      return blockers.push(blocker);
    },
  };

  return history;
}
```

**关键实现细节：**

1. **状态管理**：使用 `history.state` 存储路由相关状态
2. **事件监听**：监听 `popstate` 事件处理浏览器前进后退
3. **阻塞机制**：支持路由跳转前的确认机制
4. **索引管理**：维护历史记录的索引，支持精确的前进后退

## Routes 路由匹配算法深度解析 {#routes-匹配算法}

### Routes 组件核心实现

```typescript
// packages/react-router/index.tsx
export function Routes({
  children,
  location
}: RoutesProps): React.ReactElement | null {
  let routes = createRoutesFromChildren(children);
  return useRoutes(routes, location);
}

function createRoutesFromChildren(
  children: React.ReactNode
): RouteObject[] {
  let routes: RouteObject[] = [];
  
  React.Children.forEach(children, (element) => {
    if (!React.isValidElement(element)) {
      return;
    }

    if (element.type === React.Fragment) {
      routes.push.apply(
        routes,
        createRoutesFromChildren(element.props.children)
      );
      return;
    }

    let route: RouteObject = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path,
    };

    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });

  return routes;
}
```

### useRoutes 核心匹配逻辑

```typescript
// packages/react-router/index.tsx
export function useRoutes(
  routes: RouteObject[],
  locationArg?: Partial<Location> | string
): React.ReactElement | null {
  let { matches } = React.useContext(RouteContext);
  let location = useLocation();
  let pathname = locationArg?.pathname || location.pathname;

  // 执行路由匹配
  let routeMatches = matchRoutes(routes, { pathname }, matches);

  return _renderMatches(routeMatches);
}

function matchRoutes(
  routes: RouteObject[],
  locationArg: Partial<Location> | string,
  basename = "/"
): RouteMatch[] | null {
  let location = typeof locationArg === "string" 
    ? parsePath(locationArg) 
    : locationArg;

  let pathname = stripBasename(location.pathname || "/", basename);
  
  if (pathname == null) {
    return null;
  }

  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);

  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], pathname);
  }

  return matches;
}
```

### 路由匹配核心算法

```typescript
// packages/react-router/index.tsx
function matchRouteBranch(
  branch: RouteBranch,
  pathname: string
): RouteMatch[] | null {
  let { routesMeta } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches: RouteMatch[] = [];

  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/"
      ? pathname
      : pathname.slice(matchedPathname.length) || "/";

    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
      remainingPathname
    );

    if (!match) return null;

    Object.assign(matchedParams, match.params);
    
    let route = meta.route;
    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(
        joinPaths([matchedPathname, match.pathnameBase])
      ),
      route,
    });

    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }

  return matches;
}
```

### matchPath 核心实现

```typescript
// packages/react-router/index.tsx
export function matchPath(
  pattern: PathPattern | string,
  pathname: string
): PathMatch | null {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }

  let [matcher, paramNames] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );

  let match = pathname.match(matcher);
  if (!match) return null;

  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params: Params = paramNames.reduce(
    (memo, paramName, index) => {
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname
          .slice(0, matchedPathname.length - splatValue.length)
          .replace(/(.)\/+$/, "$1");
      }

      memo[paramName] = safelyDecodeURIComponent(
        captureGroups[index] || "",
        paramName
      );
      return memo;
    },
    {}
  );

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern,
  };
}
```

### compilePath 路径编译

```typescript
// packages/react-router/index.tsx
function compilePath(
  path: string,
  caseSensitive = false,
  end = true
): [RegExp, string[]] {
  let paramNames: string[] = [];
  let regexpSource = "^" + path
    .replace(/\/*\*?$/, "")
    .replace(/^\/*/, "/")
    .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
    .replace(/\/:(\w+)(\??)/, (_, paramName, isOptional) => {
      paramNames.push(paramName);
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    });

  if (path.endsWith("*")) {
    paramNames.push("*");
    regexpSource += path === "*" || path === "/*" 
      ? "(.*)$"
      : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?=\\/|$)";
  }

  let flags = caseSensitive ? undefined : "i";
  let regexp = new RegExp(regexpSource, flags);

  return [regexp, paramNames];
}
```

**路由匹配算法核心特性：**

1. **分支排序**：通过 `rankRouteBranches` 对路由分支进行排序，确保匹配优先级
2. **渐进匹配**：从父路由到子路由逐步匹配，构建完整的匹配链
3. **参数提取**：通过正则表达式提取路径参数和通配符参数
4. **性能优化**：使用编译后的正则表达式，避免重复编译

## Hooks 实现原理 {#hooks-实现}

### useNavigate 实现原理

```typescript
// packages/react-router/index.tsx
export function useNavigate(): NavigateFunction {
  let { basename, navigator } = React.useContext(NavigationContext);
  let { matches } = React.useContext(RouteContext);
  let { pathname: locationPathname } = useLocation();

  let routePathnamesJson = JSON.stringify(
    matches.map((match) => match.pathnameBase)
  );

  let activeRef = React.useRef(false);
  React.useEffect(() => {
    activeRef.current = true;
  });

  let navigate: NavigateFunction = React.useCallback(
    (to: To | number, options: NavigateOptions = {}) => {
      if (!activeRef.current) {
        console.warn(
          `You should call navigate() in a useEffect, not when your component is first rendered.`
        );
      }

      if (typeof to === "number") {
        navigator.go(to);
        return;
      }

      let path = resolveTo(
        to,
        matches.slice(0, matches.findIndex(match => match.route.id === routeId) + 1),
        locationPathname,
        basename
      );

      if (options.replace) {
        navigator.replace(path, options.state);
      } else {
        navigator.push(path, options.state);
      }
    },
    [basename, navigator, routePathnamesJson, locationPathname]
  );

  return navigate;
}
```

### useLocation 实现

```typescript
// packages/react-router/index.tsx
export function useLocation(): Location {
  return React.useContext(LocationContext).location;
}

// LocationContext 的提供者
export function LocationProvider({ children, location }: LocationProviderProps) {
  let value = React.useMemo(
    () => ({ location }),
    [location]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
```

### useParams 实现

```typescript
// packages/react-router/index.tsx
export function useParams(): Readonly<Params> {
  let { matches } = React.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
```

### useMatch 实现

```typescript
// packages/react-router/index.tsx
export function useMatch(pattern: PathPattern | string): PathMatch | null {
  let { pathname } = useLocation();
  return React.useMemo(
    () => matchPath(pattern, pathname),
    [pathname, pattern]
  );
}
```

## History API 封装与状态管理 {#history-封装}

### History 状态管理机制

```typescript
// packages/history/index.ts
function createHistory(options: HistoryOptions): History {
  let listeners: Listener[] = [];
  let blockers: Blocker[] = [];
  let index = 0;
  let action = Action.Pop;
  let location = getInitialLocation();

  function applyTx(nextAction: Action, nextLocation?: Location) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    
    // 通知所有监听者
    listeners.forEach(listener => listener({
      action,
      location
    }));
  }

  function push(to: To, state?: any) {
    let nextAction = Action.Push;
    let nextLocation = getNextLocation(to, state);
    
    // 检查阻塞器
    if (blockers.length) {
      let nextIndex = index + 1;
      let blocker = blockers.find(blocker => blocker(nextAction, nextLocation));
      if (blocker) {
        // 阻塞导航
        return;
      }
    }

    // 执行导航
    globalHistory.pushState(
      { usr: nextLocation.state, key: nextLocation.key, idx: nextIndex },
      "",
      createHref(nextLocation)
    );

    applyTx(nextAction, nextLocation);
  }

  function replace(to: To, state?: any) {
    let nextAction = Action.Replace;
    let nextLocation = getNextLocation(to, state);
    
    globalHistory.replaceState(
      { usr: nextLocation.state, key: nextLocation.key, idx: index },
      "",
      createHref(nextLocation)
    );

    applyTx(nextAction, nextLocation);
  }

  return {
    get action() { return action; },
    get location() { return location; },
    push,
    replace,
    go(delta: number) { globalHistory.go(delta); },
    back() { globalHistory.back(); },
    forward() { globalHistory.forward(); },
    listen(listener: Listener) {
      return listeners.push(listener);
    },
    block(blocker: Blocker) {
      return blockers.push(blocker);
    }
  };
}
```

### 状态同步机制

```typescript
// packages/react-router-dom/index.tsx
function useHistoryState(history: History) {
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  // 同步状态更新
  React.useLayoutEffect(() => {
    let unlisten = history.listen(setState);
    return unlisten;
  }, [history]);

  return state;
}
```

## Link 组件优化策略 {#link-优化}

### Link 组件核心实现

```typescript
// packages/react-router-dom/index.tsx
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkWithRef(
    { 
      onClick, 
      replace = false, 
      state, 
      target, 
      to, 
      ...rest 
    },
    ref
  ) {
    let href = useHref(to);
    let internalOnClick = useLinkClickHandler(to, { replace, state, target });

    function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) {
        internalOnClick(event);
      }
    }

    return (
      <a
        {...rest}
        href={href}
        onClick={handleClick}
        ref={ref}
        target={target}
      />
    );
  }
);
```

### useLinkClickHandler 优化

```typescript
// packages/react-router-dom/index.tsx
export function useLinkClickHandler(
  to: To,
  {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative
  }: UseLinkClickHandlerOptions = {}
): (event: React.MouseEvent<Element>) => void {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, { relative });

  return React.useCallback(
    (event: React.MouseEvent<Element>) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();

        // 判断是否是同一个路径
        let replace = replaceProp !== undefined 
          ? replaceProp 
          : createPath(location) === createPath(path);

        navigate(to, {
          replace,
          state,
          preventScrollReset,
          relative
        });
      }
    },
    [navigate, location, path, replaceProp, state, target, to, preventScrollReset, relative]
  );
}

function shouldProcessLinkClick(
  event: React.MouseEvent,
  target?: string
): boolean {
  return (
    event.button === 0 && // 左键点击
    (!target || target === "_self") && // 当前窗口
    !isModifiedEvent(event) // 没有按住修饰键
  );
}

function isModifiedEvent(event: React.MouseEvent): boolean {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
```

### 预加载优化

```typescript
// packages/react-router-dom/index.tsx
export function PrefetchLink({ 
  to, 
  prefetch = "intent",
  ...props 
}: PrefetchLinkProps) {
  let navigate = useNavigate();
  let [shouldPrefetch, setShouldPrefetch] = React.useState(false);

  React.useEffect(() => {
    if (shouldPrefetch) {
      // 预加载路由代码
      prefetchRoute(to);
    }
  }, [shouldPrefetch, to]);

  let handleMouseEnter = React.useCallback(() => {
    if (prefetch === "intent") {
      setShouldPrefetch(true);
    }
  }, [prefetch]);

  let handleFocus = React.useCallback(() => {
    if (prefetch === "intent") {
      setShouldPrefetch(true);
    }
  }, [prefetch]);

  return (
    <Link
      {...props}
      to={to}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
    />
  );
}
```

## 路由懒加载底层实现 {#懒加载实现}

### React.lazy 与 Suspense 集成

```typescript
// 路由懒加载实现
const LazyRoute = React.lazy(() => import('./components/LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/lazy" element={<LazyRoute />} />
      </Routes>
    </Suspense>
  );
}
```

### 自定义路由懒加载

```typescript
// packages/react-router/index.tsx
interface LazyRouteFunction {
  (): Promise<{ default: React.ComponentType<any> }>;
}

function createLazyRoute(
  importFn: LazyRouteFunction,
  fallback: React.ComponentType = () => <div>Loading...</div>
): React.ComponentType {
  const LazyComponent = React.lazy(importFn);
  
  return function LazyRouteComponent(props: any) {
    return (
      <React.Suspense fallback={<fallback />}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

// 使用示例
const LazyHome = createLazyRoute(() => import('./Home'));
const LazyAbout = createLazyRoute(() => import('./About'));
```

### 路由级代码分割

```typescript
// 路由配置文件
export const routes = [
  {
    path: "/",
    element: React.lazy(() => import("./pages/Home")),
  },
  {
    path: "/about",
    element: React.lazy(() => import("./pages/About")),
  },
  {
    path: "/dashboard",
    element: React.lazy(() => import("./pages/Dashboard")),
    children: [
      {
        path: "profile",
        element: React.lazy(() => import("./pages/Profile")),
      },
      {
        path: "settings",
        element: React.lazy(() => import("./pages/Settings")),
      },
    ],
  },
];

// 路由渲染器
function RouteRenderer({ routes }: { routes: RouteObject[] }) {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <route.element />
            </React.Suspense>
          }
        >
          {route.children && <RouteRenderer routes={route.children} />}
        </Route>
      ))}
    </Routes>
  );
}
```

## 性能优化源码剖析 {#性能优化}

### 路由匹配性能优化

```typescript
// packages/react-router/index.tsx
function rankRouteBranches(branches: RouteBranch[]): void {
  branches.sort((a, b) =>
    a.score !== b.score
      ? b.score - a.score // 分数高的优先
      : compareIndexes(
          a.routesMeta.map((meta) => meta.childrenIndex),
          b.routesMeta.map((meta) => meta.childrenIndex)
        )
  );
}

function computeScore(path: string, index: boolean | undefined): number {
  let segments = path.split("/");
  let initialScore = segments.length;
  
  if (segments.some((s) => s === "*")) {
    initialScore += splatPenalty; // 通配符路由优先级降低
  }

  if (index) {
    initialScore += indexRouteBonus; // 索引路由优先级提高
  }

  return segments
    .filter((s) => s !== "")
    .reduce(
      (score, segment) =>
        score +
        (paramRe.test(segment)
          ? dynamicSegmentValue // 动态段
          : segment === ""
          ? emptySegmentValue // 空段
          : staticSegmentValue), // 静态段
      initialScore
    );
}
```

### 组件渲染优化

```typescript
// packages/react-router/index.tsx
function _renderMatches(
  matches: RouteMatch[] | null,
  parentMatches: RouteMatch[] = [],
  dataRouterState?: RemixRouter["state"]
): React.ReactElement | null {
  if (matches == null) {
    return null;
  }

  return matches.reduceRight((outlet, match, index) => {
    let error = match.route.errorElement || <DefaultErrorComponent />;
    let errorElement = dataRouterState?.errors?.[match.route.id] ? error : null;
    let element = match.route.element ?? <Outlet />;
    
    return (
      <RouteContext.Provider
        value={{
          outlet,
          matches: parentMatches.concat(matches.slice(0, index + 1)),
          isDataRoute: dataRouterState != null,
        }}
      >
        {errorElement || element}
      </RouteContext.Provider>
    );
  }, null as React.ReactElement | null);
}
```

### 内存泄漏防护

```typescript
// packages/react-router/index.tsx
export function useNavigate(): NavigateFunction {
  let activeRef = React.useRef(false);
  
  React.useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false; // 组件卸载时标记为非活跃
    };
  });

  let navigate: NavigateFunction = React.useCallback(
    (to: To | number, options: NavigateOptions = {}) => {
      // 防止在组件卸载后导航
      if (!activeRef.current) {
        console.warn(
          "You should call navigate() in a useEffect, not when your component is first rendered."
        );
        return;
      }

      // 执行导航逻辑
      // ...
    },
    [/* dependencies */]
  );

  return navigate;
}
```

## 面试高频问题源码级解答 {#面试问题}

### Q1: React Router 的工作原理是什么？

**源码级解答：**

React Router 的工作原理可以分为以下几个核心步骤：

1. **History 管理**：通过 `createBrowserHistory` 或 `createHashHistory` 创建 history 实例，封装浏览器的 History API
2. **路由匹配**：使用 `matchRoutes` 算法，将当前 URL 与路由配置进行匹配
3. **组件渲染**：根据匹配结果，使用 `_renderMatches` 渲染对应的组件
4. **状态传递**：通过 React Context 在组件树中传递路由状态

```typescript
// 核心流程
BrowserRouter -> createBrowserHistory -> 监听 URL 变化 -> 
触发 matchRoutes -> 计算匹配结果 -> _renderMatches -> 渲染组件
```

### Q2: BrowserRouter 和 HashRouter 的区别？

**源码级解答：**

两者的主要区别在于底层使用的 History API：

1. **BrowserRouter**：
   - 使用 `window.history.pushState` 和 `window.history.replaceState`
   - URL 格式：`https://example.com/path`
   - 需要服务器支持 HTML5 History API

2. **HashRouter**：
   - 使用 `window.location.hash`
   - URL 格式：`https://example.com/#/path`
   - 不需要服务器配置，兼容性更好

```typescript
// BrowserRouter 核心实现
globalHistory.pushState(
  { usr: nextLocation.state, key: nextLocation.key, idx: nextIndex },
  "",
  createHref(nextLocation)
);

// HashRouter 核心实现
window.location.hash = createHref(nextLocation);
```

### Q3: 路由匹配的优先级是如何确定的？

**源码级解答：**

路由匹配优先级通过 `rankRouteBranches` 函数计算：

1. **静态路由** > **动态路由** > **通配符路由**
2. **路径段数量**：段数多的优先级高
3. **索引路由**：有额外的优先级加成

```typescript
function computeScore(path: string, index: boolean | undefined): number {
  let segments = path.split("/");
  let initialScore = segments.length;
  
  // 通配符路由优先级降低
  if (segments.some((s) => s === "*")) {
    initialScore += splatPenalty;
  }

  // 索引路由优先级提高
  if (index) {
    initialScore += indexRouteBonus;
  }

  return segments
    .filter((s) => s !== "")
    .reduce(
      (score, segment) =>
        score +
        (paramRe.test(segment)
          ? dynamicSegmentValue // 动态段：/user/:id
          : segment === ""
          ? emptySegmentValue // 空段
          : staticSegmentValue), // 静态段：/user/profile
      initialScore
    );
}
```

### Q4: useNavigate 为什么不能在组件渲染期间调用？

**源码级解答：**

这是由于 React 的渲染机制导致的。在组件渲染期间调用 `navigate` 会触发新的渲染，可能导致无限循环。

```typescript
export function useNavigate(): NavigateFunction {
  let activeRef = React.useRef(false);
  
  React.useEffect(() => {
    activeRef.current = true; // 组件挂载后才标记为活跃
  });

  let navigate: NavigateFunction = React.useCallback(
    (to: To | number, options: NavigateOptions = {}) => {
      if (!activeRef.current) {
        console.warn(
          "You should call navigate() in a useEffect, not when your component is first rendered."
        );
        return;
      }
      // ...
    },
    [/* dependencies */]
  );

  return navigate;
}
```

### Q5: 如何实现路由级的代码分割？

**源码级解答：**

路由级代码分割通过 `React.lazy` 和 `Suspense` 实现：

```typescript
// 1. 使用 React.lazy 创建懒加载组件
const LazyHome = React.lazy(() => import('./Home'));

// 2. 使用 Suspense 包裹
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/" element={<LazyHome />} />
  </Routes>
</Suspense>

// 3. 高级用法：路由配置文件
const routes = [
  {
    path: "/",
    element: React.lazy(() => import("./pages/Home")),
  },
  {
    path: "/about",
    element: React.lazy(() => import("./pages/About")),
  },
];
```

### Q6: React Router 如何处理嵌套路由？

**源码级解答：**

嵌套路由通过递归匹配和渲染实现：

```typescript
function matchRouteBranch(
  branch: RouteBranch,
  pathname: string
): RouteMatch[] | null {
  let { routesMeta } = branch;
  let matches: RouteMatch[] = [];

  // 递归匹配每一层路由
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let remainingPathname = /* 计算剩余路径 */;
    
    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive },
      remainingPathname
    );

    if (!match) return null;

    matches.push({
      params: /* 合并参数 */,
      pathname: /* 构建完整路径 */,
      route: meta.route,
    });
  }

  return matches;
}
```

### Q7: 如何优化 React Router 的性能？

**源码级解答：**

React Router 内置了多种性能优化策略：

1. **路由匹配优化**：通过预编译和排序减少匹配时间
2. **组件懒加载**：按需加载路由组件
3. **内存泄漏防护**：防止在组件卸载后执行导航
4. **Context 优化**：使用多个 Context 避免不必要的重渲染

```typescript
// 路由匹配优化
let [matcher, paramNames] = compilePath(
  pattern.path,
  pattern.caseSensitive,
  pattern.end
);

// 组件懒加载
const LazyComponent = React.lazy(() => import('./Component'));

// 内存泄漏防护
React.useEffect(() => {
  activeRef.current = true;
  return () => {
    activeRef.current = false;
  };
});
```

## 总结

React Router 是一个设计精良、性能优异的路由库。通过本文的源码分析，我们深入了解了其：

1. **架构设计**：组件化、声明式、基于 Context 的设计理念
2. **核心算法**：路由匹配、优先级计算、递归渲染等算法
3. **性能优化**：匹配优化、懒加载、内存管理等优化策略
4. **最佳实践**：代码分割、预加载、错误处理等实践

掌握这些源码级的知识，不仅能帮助你在面试中脱颖而出，更能在实际开发中写出更高质量的代码。

---

*本文档持续更新中，如有问题或建议，欢迎提出。*