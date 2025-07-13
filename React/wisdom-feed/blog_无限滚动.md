# 用 React 实现抖音风格的无限滚动

在这篇文章中，我们将探讨如何使用 React 实现类似抖音的无限滚动功能。无限滚动是一种常见的用户体验模式，尤其适用于内容流式加载的应用，例如社交媒体或视频平台。

## 功能概述

我们将实现以下功能：

1. 无限滚动加载内容。
2. 使用自定义 Hook 管理用户 ID。
3. 优化样式以模仿抖音的深色主题。

---

## 项目结构

以下是项目的主要文件结构：

- `App.jsx`：主应用组件。
- `TextList.jsx`：负责渲染内容列表。
- `TextItem.jsx`：单个内容项。
- `NavList.jsx`：顶部导航栏。
- `global.styl`：全局样式文件。

---

## 核心实现步骤

### 1. 创建 `TextList` 和 `TextItem` 组件

`TextList` 组件负责渲染内容列表，并监听滚动事件以加载更多内容。`TextItem` 组件用于显示单个内容项。

```jsx
import useUserId from "../../hooks/useUserId";
import TextItem from "./TextItem";
const TextList = function (props) {
  const { textList, onScroll, currentIndex, ref } = props;

  const userId = useUserId(); // Using the custom hook to get userId

  return (
    <div className="text-container" ref={ref} onScroll={onScroll}>
      {currentIndex === 0 && (
        <div className="isLoadingAll">scroll to top will reload all</div>
      )}
      {textList.map((text) => (
        <TextItem text={text} currentIndex={currentIndex} userId={userId} />
      ))}
    </div>
  );
};

export default TextList;
```

```jsx
const TextItem = function (props) {
  const { text, currentIndex, userId } = props;
  return (
    <div>
      <div className="text-item" key={currentIndex}>
        <div className="text">
          <h3> text: {text}</h3>
        </div>
        <div className="user-id">{userId}</div>
      </div>
    </div>
  );
};
export default TextItem;
```

### 2. 在 `App.jsx` 中实现滚动逻辑

我们使用 `useEffect` 和 `useCallback` 来监听滚动事件，并在用户接近底部时加载更多内容。

```jsx
import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TextList from "./components/TextList/TextList";
import { UserIdContext } from "./Context/UserIdContext";
import NavList from "./components/NavList/NavList";
function App() {
  const [textList, setTextList] = useState([
    "hello",
    "world",
    "hello",
    "world",
    "hello",
  ]);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState("12345"); // Example userId, replace with actual logic to fetch userId

  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      //  setTimeout(()=>{
      const newTextList = [
        ...textList,
        ...new Array(5).fill("helloCallback" + currentIndex),
      ];
      console.log("currentIndex", currentIndex);
      setTextList(newTextList);
      // },1)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setCurrentIndex((currentIndex) => currentIndex + 1);
        loadMore();
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore]);

  return (
    <UserIdContext.Provider value={userId}>
      <div className="App">
        <NavList />
        <TextList
          textList={textList}
          ref={containerRef}
          currentIndex={currentIndex}
        />
      </div>
    </UserIdContext.Provider>
  );
}

export default App;
```

### 3. 添加导航栏组件

`NavList` 组件提供顶部导航功能，并通过自定义 Hook 显示用户 ID。

```jsx
import useUserId from "../../hooks/useUserId";

const NavList = () => {
  const userId = useUserId(); // Accessing userId from context
  return (
    <div className="nav-list">
      <div className="nav-item">Home</div>
      <div className="nav-item">+</div>
      <div className="nav-item">Profile {userId}</div>
    </div>
  );
};
export default NavList;
```

### 4. 优化样式

我们在 `global.styl` 中定义了深色主题的全局样式，并为导航栏和内容项添加了交互效果。

```stylus
// ======================
// 抖音网页版色彩系统 (深色模式为主)
// ======================
$brand-primary = #ff0050
$brand-secondary = #00f2ea
$brand-gradient = linear-gradient(45deg, $brand-primary, $brand-secondary)

$bg-dark = #121212
$bg-card = #1e1e1e
$bg-hover = #2a2a2a
$divider = #3d3d3d

$text-primary = #ffffff
$text-secondary = #b3b3b3
$text-disabled = #707070

$radius-md = 8px
$shadow-sm = 0 2px 8px rgba(0, 0, 0, 0.25)
$shadow-brand = 0 0 12px rgba(255, 0, 80, 0.4)

// ======================
// 全局样式调整
// ======================
*
  margin 0
  padding 0
  box-sizing border-box

html, body
  touch-action: manipulation
  -ms-touch-action: manipulation
  background $bg-dark
  color $text-primary
  font-family "PingFang SC", "Microsoft YaHei", sans-serif

&::-webkit-scrollbar
  width 0
  scrollbar-width none
  scrollbar-color transparent

.App
  touch-action: none
  -ms-touch-action: none
  position fixed
  display flex
  align-items center
  justify-content center
  width 100vw
  height 100vh
  font-size 28px
  background $bg-dark
  .text-container
    margin-top 19vh
    display flex
    flex-direction column
    width 65%
    height 100vh
    overflow auto
    overflow-y scroll
    scroll-snap-type y mandatory
    background $bg-card
    border-radius $radius-md
    box-shadow $shadow-sm
    .text-item
      position relative
      justify-content center
      align-content center
      width 100%
      height 100vh
      font-weight 700
      text-align center
      color $text-primary
      background $brand-gradient
      border 1px solid $divider
      transition all 0.5s ease-in-out
      scroll-snap-align start
      scroll-snap-stop always
      &:hover
        transform scale(1.02)
        box-shadow $shadow-brand
      .text
        height 100vh
        font-size 2rem
        text-align center
        justify-content center

.nav-list
  position fixed
  top 0
  left 0
  margin 0
  margin-bottom 89vh
  width 100vw
  height 9.5vh
  background $bg-hover
  display flex
  justify-content space-around
  align-items center
  border-bottom 1px solid $divider
  box-shadow $shadow-sm
  z-index 10

  .nav-item
    color $text-primary
    font-size 1.2rem
    font-weight 600
    padding 0.5rem 1rem
    border-radius $radius-md
    transition all 0.3s ease-in-out
    cursor pointer
    &:hover
      background $brand-primary
      color $text-secondary
      transform scale(1.05)
```

---

## 关键代码解析

### 1. 滚动事件监听

在 `App.jsx` 中，我们通过 `useEffect` 添加滚动事件监听器，并在用户接近底部时调用 `loadMore` 函数。

```jsx
useEffect(() => {
  const container = containerRef.current;
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setCurrentIndex((currentIndex) => currentIndex + 1);
      loadMore();
    }
  };
  container.addEventListener("scroll", handleScroll);
  return () => {
    container.removeEventListener("scroll", handleScroll);
  };
}, [loadMore]);
```

### 2. 动态加载内容

`loadMore` 函数通过模拟 API 调用的方式，动态加载更多内容。

```jsx
const loadMore = useCallback(async () => {
  if (loading) return;
  setLoading(true);
  try {
    const newTextList = [
      ...textList,
      ...new Array(5).fill("helloCallback" + currentIndex),
    ];
    setTextList(newTextList);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}, [currentIndex]);
```

### 3. 样式优化

我们在 `global.styl` 中为 `.text-item` 和 `.nav-list` 添加了交互效果，例如悬停时的缩放和阴影。

```stylus
.text-item:hover
  transform scale(1.02)
  box-shadow $shadow-brand

.nav-item:hover
  background $brand-primary
  color $text-secondary
  transform scale(1.05)
```

---

## 总结

通过以上步骤，我们成功实现了一个具有抖音风格的无限滚动功能。该功能结合了 React 的组件化设计和现代前端样式技术，提供了流畅的用户体验。

你可以根据自己的需求进一步扩展，例如添加 API 调用、分页加载等功能。希望这篇文章对你有所帮助！
