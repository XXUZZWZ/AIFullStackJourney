# 性能优化

## 重绘重排

- 重绘
  - 当元素样式但不影响布局时，浏览器重新绘制元素的过程，比如改变颜色和背景但是不改变几何属性
- 重排
  - DOM 元素的尺寸位置发生变化时，浏览器要重新计算布局，影响其他元素位置的过程。
    重排一定会触发重绘，重绘不一定触发重排。

## DEMO1 批量更改 DOM

```javascript
/* 问题代码：逐行修改样式会触发多次重排/重绘 */
const el = document.getElementById("el");
// 每行都可能触发重排+重绘
// width、height、margin 都会改变元素几何属性，导致重排
el.style.width = "100px"; // 触发重排+重绘
el.style.height = "100px"; // 触发重排+重绘
el.style.margin = "10px"; // 触发重排+重绘

/* 优化方案1：使用类名一次性应用所有样式 */
// 只会触发一次重排+重绘
el.className = "el"; // CSS类中定义了所有样式

/* 优化方案2：使用cssText合并样式更改 */
// 只会触发一次重排+重绘
el.style.cssText = "width: 100px; height: 100px; margin: 10px;";

/* 优化方案3：使用requestAnimationFrame批量处理 */
requestAnimationFrame(() => {
  el.style.width = "100px";
  el.style.height = "100px";
  el.style.margin = "10px";
}); // 浏览器会在下一帧统一处理样式变更，只触发一次重排+重绘
```

## 其他优化方法

1. **使用文档片段**：

```javascript
// 使用DocumentFragment减少DOM操作
const fragment = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const el = document.createElement("div");
  el.textContent = `Item ${i}`;
  fragment.appendChild(el);
}
// 只触发一次重排+重绘
document.body.appendChild(fragment);
```

2. **脱离文档流进行操作**：

```javascript
// 操作前脱离文档流
const el = document.getElementById("el");
const originalDisplay = el.style.display;
const originalPosition = el.style.position;
el.style.position = "absolute";
el.style.display = "none";
el.style.display = "none"; // 脱离文档流，不会触发重排

// 多次修改DOM
el.style.width = "100px";
el.style.height = "100px";
el.style.margin = "10px";

// 恢复显示，只触发一次重排+重绘
el.style.display = originalDisplay;
el.style.position = originalPosition;
```

3. **避免强制同步布局**：

```javascript
// 不好的做法 - 强制同步布局
const box = document.getElementById("box");
box.style.width = "100px"; // 修改样式
console.log(box.offsetWidth); // 立即读取布局信息，触发强制同步布局

// 好的做法
const box = document.getElementById("box");
console.log(box.offsetWidth); // 先读取
box.style.width = "100px"; // 后修改
```

## DMO22 批量更改样式

- 批量更改样式使用 fragment

```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const el = document.createElement("div");
  el.textContent = `Item ${i}`;
  fragment.appendChild(el);
}
document.body.appendChild(fragment);
// 批量添加元素时，使用document.createDocumentFragment() 创建一个文档片段，然后使用 appendChild() 方法将元素添加到文档片段中，最后使用 appendChild() 方法将文档片段添加到 DOM 中。
```

## 更多优化方法

1. **使用 CSS3 硬件加速**：

```javascript
// 不好的做法 - 使用left/top进行动画
element.style.left = "100px"; // 触发重排+重绘

// 好的做法 - 使用transform代替
element.style.transform = "translateX(100px)"; // 只触发重绘，GPU加速
```

2. **防抖和节流**：

```javascript
// 滚动事件节流 - 防止过于频繁触发
let ticking = false;
window.addEventListener("scroll", function () {
  if (!ticking) {
    window.requestAnimationFrame(function () {
      // 处理滚动事件的代码
      updateElements();
      ticking = false;
    });
  }
  ticking = true;
});
```

3. **使用 will-change 提前告知浏览器**：

```css
/* 告诉浏览器该元素的transform属性即将发生变化 */
.animated-element {
  will-change: transform;
}
```

4. **减少 DOM 深度**：

```html
<!-- 减少DOM深度 - 扁平的DOM结构减少重排范围 -->
<div>
  <span>Item 1</span>
  <span>Item 2</span>
</div>

<!-- 而不是 -->
<div>
  <div>
    <div>
      <span>Item 1</span>
    </div>
  </div>
  <div>
    <div>
      <span>Item 2</span>
    </div>
  </div>
</div>
```

5. **分离读写操作**：

```javascript
// 不好的做法 - 交错读写导致多次重排
const width = element.offsetWidth; // 读取
element.style.width = width + 10 + "px"; // 写入
const height = element.offsetHeight; // 读取
element.style.height = height + 10 + "px"; // 写入

// 好的做法 - 先读后写
const width = element.offsetWidth; // 读取
const height = element.offsetHeight; // 读取
element.style.width = width + 10 + "px"; // 写入
element.style.height = height + 10 + "px"; // 写入
```

6. **使用 contain 属性隔离影响范围**：

```css
/* 告诉浏览器这个元素的内部变化不会影响外部布局 */
.independent-element {
  contain: layout paint;
}
```

7. **虚拟滚动**：

```javascript
// 只渲染可视区域内的元素
function renderVisibleItems() {
  const scrollTop = container.scrollTop;
  const visibleHeight = container.clientHeight;

  // 计算可见范围内的元素索引
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + visibleHeight) / itemHeight);

  // 只渲染可见范围内的元素
  for (let i = startIndex; i <= endIndex; i++) {
    if (i >= 0 && i < totalItems) {
      // 渲染第i个元素
    }
  }
}
```

8. **使用 缓存布局信息**

```javascript
// offsetTop 读取 ，但是每次读都会重新计算属性触发重排以获得盒子的布局信息
// 强制浏览器计算最新的布局信息，触发重排
for (let i = 0; i < 1000; i++) {
  el.style.top = el.offsetTop + i;
}

// 优化做法
let top = el.offsetTop;
for (let i = 0; i < 100; i++) {
  top += i;
}
el.style.top = top;
```

9. **使用 transfrom 来代替位置调整**

```javascript
// 触发重排 --> 重绘
el.style.top = el.offsetTop + "px";

// 只触发一次重绘
el.style.transform = `translateY(${el.offsetTop}px)`;
```

## 资源加载优化

- 图片懒加载
- 路由懒加载
  - 代码文件上会做一个代码分割，coding split 代码分割
  - 资源预加载
  - `<link ref="prefetch" href="xxx.js">` 预先加载未来可能用的·的·资源
  - `<link ref = "preload" href="xxx.js"> ` 提前解析 cdn,必须要的资源
  - script 资源加载
    - 默认没有
    - defer 延迟加载，html 解析完，再加载，在 DOMContentLoaded 事件前执行,一般适合需要依赖资源的脚本执行
    - async 并发 加载完立即执行，可能中断 html 解析，执行顺序不固定，适合无其他依赖的资源，独立脚本，广告，分析
    - module // 功能
