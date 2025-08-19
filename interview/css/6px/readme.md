# 6px 字体问题与解决（含伪类/伪元素速查）

- 之前浏览器支持最小字体 12px ,现在可以支持更小字体
- 12px + tranfrom:scale(0.5);

- 1px
  - 来自移动端
  - 1px 边框有点粗，手机比较好
  - 浏览器不支持小数像素的绘制，硬件
  - 伪元素
    - 方便 content 必须
    - 定位 专职做下边框
    - tranfrom :scaleY(0.5)
    - tranfrom-origin center bottom

## 背景

- 移动端浏览器通常存在最小可渲染字体（多为 12px 左右）。当设置 `font-size: 6px` 等过小值时，可能被放大或直接不生效。

## 解决思路

- 推荐：用较大的字体 + `transform: scale()` 缩放视觉尺寸。
- 替代：用 SVG/图片/Canvas 渲染极小文本或标记。
- 可选但不推荐：`zoom: .5`（兼容性差，不标准）。
- 辅助：控制自动字体放大 `-webkit-text-size-adjust`。

### 方案一：scale 缩放（推荐）

```html
<style>
    .text-6px {
      font-size: 12px;      /* 使用浏览器可渲染的安全最小值 */
      line-height: 12px;
      display: inline-block;/* 便于缩放与布局控制 */
      transform: scale(0.5);
      transform-origin: left top;
    }
    /* 如果存在 iOS 自动放大，可在全局控制 */
    html { -webkit-text-size-adjust: 100%; }
    /* 或者针对小部件：.text-6px { -webkit-text-size-adjust: none; } */
  }
</style>

<span class="text-6px">这是一段视觉约 6px 的文本</span>
```

- 注意：`transform` 只改变视觉，不改变元素在文档流中的占位（仍按 12px 计算）。若需要严格 6px 占位，可以再包一层容器控制高度并根据需要裁剪：

```html
<span style="display:inline-flex;height:6px;overflow:hidden;">
  <span class="text-6px">6px</span>
</span>
```

### 方案二：SVG/图片/Canvas

- 当需要极小字号且保持清晰，可用 SVG 文本或将文案转为位图/Canvas 绘制。

### 方案三：`zoom`（不推荐）

- `zoom: .5` 可实现类似缩放，但非标准，Firefox 等支持较差。

## Demo 对应

- `2.html`：使用 `transform: scale(0.5)` 将 12px 视觉缩放至约 6px。
- `1.html`：演示伪元素 `::after` 叠层覆盖，可与小字号组件的装饰/遮罩等结合使用。

---

## 伪类（Pseudo-classes）速查

- 交互：`:hover`, `:active`, `:focus`, `:focus-visible`, `:focus-within`
- 链接：`:link`, `:visited`, `:any-link`
- 结构：`:first-child`, `:last-child`, `:only-child`, `:nth-child()`, `:nth-last-child()`, `:first-of-type`, `:last-of-type`, `:only-of-type`, `:nth-of-type()`, `:nth-last-of-type()`, `:empty`, `:root`, `:scope`
- 表单：`:enabled`, `:disabled`, `:read-only`, `:read-write`, `:placeholder-shown`, `:checked`, `:indeterminate`, `:default`, `:required`, `:optional`, `:valid`, `:invalid`, `:in-range`, `:out-of-range`
- 语言/方向/目标：`:lang()`, `:dir()`, `:target`, `:target-within`
- 选择器增强：`:not()`, `:is()`, `:where()`, `:has()`
- 环境：`:fullscreen`, `:picture-in-picture`, `:defined`

## 伪元素（Pseudo-elements）速查

- 文本：`::before`, `::after`, `::first-line`, `::first-letter`, `::selection`
- 占位/标记：`::placeholder`, `::marker`, `::file-selector-button`
- 幕布：`::backdrop`
- Shadow DOM：`::slotted()`, `::part()`
- 媒体/字幕：`::cue`, `::cue-region`
- 新特性（视兼容）：`::target-text`, `::highlight()`, `::view-transition-old`, `::view-transition-new`
- 厂商前缀（非标准）：`::-webkit-scrollbar` 及其子伪元素

## 可访问性建议

- 正文/可读内容尽量不低于 12–14px。6px 级文本仅用于徽标、角标、装饰等非核心信息。
