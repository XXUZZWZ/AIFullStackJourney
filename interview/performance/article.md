# 前端性能优化实战与度量指南

本文基于本目录的示例页面 `1.html` 与笔记 `readme.md`，系统性梳理前端性能优化：从核心指标（Web Vitals），到渲染/脚本/资源/网络/框架层优化方法，以及如何用 Performance API 做可量化度量与调试。

## 为什么要做性能优化

- 用户直观体验由“快与稳”决定：越早“看到内容”、交互越“跟手”、布局越“稳定”，留存越高。
- 业务回报显著：转化率、搜索排名、可访问性评分都会受益。

## Web Vitals 核心指标

- LCP（Largest Contentful Paint）：最大内容绘制时间。目标 ≤ 2.5s。
  - 常见优化：压缩/懒加载大图、减少首屏阻塞 JS/CSS、CDN、关键渲染路径优化。
- INP（Interaction to Next Paint）：交互到下一帧渲染时延。目标 ≤ 200ms。
  - 常见优化：避免主线程长任务、对输入监听做节流/防抖、将重计算下放至 Web Worker。
- CLS（Cumulative Layout Shift）：累积布局偏移。目标 ≤ 0.1。
  - 常见优化：为媒体/广告位预留尺寸、避免首屏动态插入、稳定的字体加载策略。

> 在实际检测中（见 `readme.md` 记录），如果 LCP 偏慢或 CLS 偏大，应优先解决这两项，它们最直观影响“看得见的速度与稳定”。

## 渲染层：重绘与重排

- 重绘（Repaint）：样式变化不影响布局时的绘制（如颜色）。
- 重排（Reflow/Layout）：尺寸或位置变化导致布局重新计算。重排一定触发重绘。

实践要点：

- 批量合并样式写入，避免逐行改动触发多次布局

```javascript
// 不佳：逐条写入，可能触发多次重排
el.style.width = "100px";
el.style.height = "100px";
el.style.margin = "10px";

// 更好：一次性应用
el.className = "el";
// 或
el.style.cssText = "width:100px;height:100px;margin:10px;";

// 或放入下一帧统一处理
requestAnimationFrame(() => {
  el.style.width = "100px";
  el.style.height = "100px";
  el.style.margin = "10px";
});
```

- 使用 `DocumentFragment` 批量 DOM 操作

```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const node = document.createElement("div");
  node.textContent = `Item ${i}`;
  fragment.appendChild(node);
}
document.body.appendChild(fragment); // 仅一次重排/重绘
```

- 避免强制同步布局，分离“读”和“写”

```javascript
// 先读后写，避免交错产生的同步布局抖动
const width = el.offsetWidth;
const height = el.offsetHeight;
el.style.width = width + 10 + "px";
el.style.height = height + 10 + "px";
```

- 使用 transform 替代位置/尺寸动画（可启用 GPU）

```javascript
// 不佳：影响布局
el.style.top = el.offsetTop + 10 + "px";

// 更好：只重绘，GPU 友好
el.style.transform = "translateY(10px)";
```

## 资源加载与网络优化

- 图片：WebP/AVIF，合适尺寸，懒加载（`loading="lazy"`）。
- 代码分割：路由/组件级拆分，按需加载。
- 预取/预加载：`<link rel="prefetch">`（未来可能用），`<link rel="preload">`（首屏关键）。
- 脚本：`defer`（推荐，按顺序、DOMContentLoaded 前执行），`async`（独立脚本）。
- 字体：子集化，`font-display: swap`。
- 缓存：强缓存（Cache-Control）与协商缓存（ETag/Last-Modified）。
- 传输：CDN、Gzip/Brotli、HTTP/2、DNS 预解析。

## JS 执行与主线程

- 避免长任务：拆分任务、`requestIdleCallback` 在空闲期执行非关键计算。
- 动画与滚动：`requestAnimationFrame` 对齐渲染节奏，滚动回调做节流。

```javascript
// 滚动节流 + rAF
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateOnScroll();
      ticking = false;
    });
    ticking = true;
  }
});
```

- 重计算：放入 Web Worker（如复杂解析/压缩/排序等）。

## 框架层策略（以 React 为例）

- 避免不必要渲染：`memo`/`useMemo`/`useCallback`。
- 列表渲染：稳定的 `key`；超大列表用虚拟滚动。
- 组件库：按需加载（如基于按需导入的 UI 组件）。

## 首屏体验

- SSR/SSG：服务器先渲染 HTML，浏览器更快看到内容。
- 骨架屏：在数据/资源未就绪时提供视觉占位，降低感知等待。
- 关键资源内联与优先级：首屏关键 CSS 优先，延后非关键脚本。

## 度量与诊断：Performance API 实战

示例页面：`./1.html`，打开后可观察到以下度量点与日志。

核心用法：

```javascript
// 1) 标记与测量
performance.mark("pageLoadStart");
window.addEventListener("load", () => {
  performance.mark("pageLoadEnd");
  performance.measure("页面加载时间", "pageLoadStart", "pageLoadEnd");
});

// 2) 测试查询/插入等 DOM 操作的耗时
const t0 = performance.now();
document.querySelector("#mylist li");
const queryCostMs = performance.now() - t0;

// 插入元素测量
performance.mark("addItemStart");
ul.appendChild(li);
performance.mark("addItemEnd");
performance.measure("添加新项时间", "addItemStart", "addItemEnd");

// 3) 观察器统一捕获
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log("性能观察", entry.name, entry.duration || entry.startTime);
  }
}).observe({ entryTypes: ["measure", "mark", "navigation", "paint"] });
```

读取与展示：

```javascript
const measures = performance.getEntriesByType("measure");
// 例如：遍历展示 name / duration / startTime
```

建议阈值（可作为自检参考）：

- 页面加载时间 < 3s：优秀
- DOM 查询 < 1ms：优秀
- 新项插入 < 0.1ms：优秀

## 工具链

- Chrome Performance 面板：分析时间线、长任务、栈信息、布局/绘制热点。
- Lighthouse：从性能、无障碍、最佳实践、SEO 多维评分并给出可执行建议。

## 落地清单（优先级建议）

1. 首屏关键路径：压缩/内联关键 CSS，延后非关键脚本，图片懒加载。
2. 大资源：切图/懒加载/CDN，开启 Gzip/Brotli，HTTP/2 合并传输。
3. JS 执行：消除长任务，rAF/Idle 优化调度，Worker 迁移重计算。
4. 渲染：批量 DOM 操作、transform 动画、分离读写、虚拟列表。
5. 稳定性：为媒体预留尺寸，避免动态插入首屏 DOM，稳定字体策略。
6. 监控：接入 Web Vitals/Performance API 埋点，持续回归与预警。

---

参考与延伸：

- 本目录更多片段与说明见 `readme.md`
- 可直接运行 `1.html` 观察 Performance API 的度量日志与 DOM 操作耗时

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Performance API 性能测试示例</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
      }

      .container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      #mylist {
        margin: 20px 0;
        padding: 0;
        list-style: none;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      #mylist li {
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
        transition: background-color 0.3s;
      }

      #mylist li:hover {
        background-color: #f0f0f0;
      }

      #mylist li:last-child {
        border-bottom: none;
      }

      .metrics {
        margin: 20px 0;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 4px;
        font-family: monospace;
        white-space: pre-wrap;
      }

      button {
        padding: 10px 20px;
        margin: 5px;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
      }

      button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h1>Performance API 性能测试示例</h1>
      <p>这个示例展示了如何使用 Performance API 测量页面渲染和交互性能。</p>

      <ul id="mylist">
        <li>Item1 - 静态内容渲染测试</li>
        <li>Item2 - DOM 查询性能测试</li>
        <li>Item3 - 事件处理性能测试</li>
      </ul>

      <button onclick="addNewItem()">添加新项</button>
      <button onclick="clearMetrics()">清除性能数据</button>
      <button onclick="showDetailedMetrics()">显示详细性能指标</button>

      <div class="metrics" id="metricsDisplay">等待性能数据...</div>
    </div>

    <script>
      // 性能测试工具类
      class PerformanceTest {
        constructor() {
          this.metrics = [];
          this.init();
        }

        init() {
          // 标记页面加载开始时间
          performance.mark("pageLoadStart");

          // 监听页面加载完成
          window.addEventListener("load", () => {
            performance.mark("pageLoadEnd");
            performance.measure("页面加载时间", "pageLoadStart", "pageLoadEnd");
            this.displayMetrics();
          });

          // 监听 DOM 加载完成
          document.addEventListener("DOMContentLoaded", () => {
            this.testDOMQueryPerformance();
          });
        }

        // 测试 DOM 查询性能
        testDOMQueryPerformance() {
          performance.mark("domQueryStart");

          // 测试 querySelector 性能
          const startTime = performance.now();
          const firstLi = document.querySelector("#mylist li");
          const queryTime = performance.now() - startTime;

          performance.mark("domQueryEnd");
          performance.measure("DOM查询时间", "domQueryStart", "domQueryEnd");

          if (firstLi) {
            console.log(`✅ 第一个 li 元素查询耗时: ${queryTime.toFixed(3)}ms`);
          }

          this.displayMetrics();
        }

        // 添加新项并测量性能
        addItem(text) {
          performance.mark("addItemStart");

          const ul = document.getElementById("mylist");
          const li = document.createElement("li");
          li.textContent = text;

          // 测量 DOM 操作性能
          const startTime = performance.now();
          ul.appendChild(li);
          const domTime = performance.now() - startTime;

          performance.mark("addItemEnd");
          performance.measure("添加新项时间", "addItemStart", "addItemEnd");

          console.log(`➕ 添加新项 "${text}" 耗时: ${domTime.toFixed(3)}ms`);
          this.displayMetrics();
        }

        // 获取所有性能指标
        getAllMetrics() {
          const measures = performance.getEntriesByType("measure");
          const marks = performance.getEntriesByType("mark");

          return {
            measures: measures.map((m) => ({
              name: m.name,
              duration: m.duration.toFixed(3),
              startTime: m.startTime.toFixed(3),
            })),
            marks: marks.map((m) => ({
              name: m.name,
              startTime: m.startTime.toFixed(3),
            })),
          };
        }

        // 显示性能指标
        displayMetrics() {
          const metrics = this.getAllMetrics();
          const display = document.getElementById("metricsDisplay");

          let output = "=== 性能测试结果 ===\n\n";

          if (metrics.measures.length > 0) {
            output += "📊 测量指标:\n";
            metrics.measures.forEach((m) => {
              output += `  ${m.name}: ${m.duration}ms\n`;
            });
          }

          if (metrics.marks.length > 0) {
            output += "\n📍 标记点:\n";
            metrics.marks.forEach((m) => {
              output += `  ${m.name}: ${m.startTime}ms\n`;
            });
          }

          output += "\n🚀 性能建议:\n";
          output += "  - 页面加载时间 < 3s: 优秀\n";
          output += "  - DOM查询时间 < 1ms: 优秀\n";
          output += "  - 添加新项时间 < 0.1ms: 优秀\n";

          display.textContent = output;
        }

        // 清除性能数据
        clear() {
          performance.clearMarks();
          performance.clearMeasures();
          this.displayMetrics();
        }
      }

      // 初始化性能测试
      const perfTest = new PerformanceTest();

      // 全局函数
      function addNewItem() {
        const itemCount = document.querySelectorAll("#mylist li").length + 1;
        perfTest.addItem(`动态添加项 ${itemCount}`);
      }

      function clearMetrics() {
        perfTest.clear();
      }

      function showDetailedMetrics() {
        perfTest.displayMetrics();

        // 显示更多浏览器性能信息
        console.log("=== 浏览器性能信息 ===");
        console.log("📱 设备内存:", navigator.deviceMemory || "未知");
        console.log("💻 硬件并发数:", navigator.hardwareConcurrency || "未知");
        console.log(
          "🌐 连接类型:",
          navigator.connection ? navigator.connection.effectiveType : "未知"
        );
        console.log("🚀 导航类型:", performance.navigation.type);
        console.log(
          "📊 内存使用情况:",
          performance.memory
            ? {
                used:
                  (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) +
                  " MB",
                total:
                  (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(
                    2
                  ) + " MB",
                limit:
                  (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(
                    2
                  ) + " MB",
              }
            : "不可用"
        );
      }

      // 监听用户交互性能
      document.addEventListener("click", (e) => {
        performance.mark("clickStart");

        setTimeout(() => {
          performance.mark("clickEnd");
          performance.measure("点击处理时间", "clickStart", "clickEnd");
        }, 0);
      });

      // 性能观察器 - 监控所有性能条目
      if ("PerformanceObserver" in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log(
              "📊 性能观察:",
              entry.name,
              entry.duration ? entry.duration + "ms" : entry.startTime + "ms"
            );
          });
        });

        observer.observe({
          entryTypes: ["measure", "mark", "navigation", "paint"],
        });
      }
    </script>
  </body>
</html>
```
