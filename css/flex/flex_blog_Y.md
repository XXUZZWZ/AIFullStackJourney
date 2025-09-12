以下是为您整理好的 Flex 布局博客内容，结合了核心概念、实战案例和高级技巧：

````markdown
# Flex 布局深度解析

## 核心概念

- **弹性容器与项目**：通过`display: flex`创建弹性格式化上下文
- **主轴与交叉轴**：
  - 主轴(main-axis)：由`flex-direction`控制方向(默认水平)
  - 交叉轴(cross-axis)：与主轴垂直的方向
- **flex 复合属性**：`flex: <grow> <shrink> <basis>`的三值简写

## 实战案例

### 两列自适应布局

```css
.container {
  display: flex;
  width: 100vw; // 父元素必须要有宽度
  /* flex-direction: row 可省略 */
}

aside {
  flex: 1 1 400px; /* 收缩基准值400px */
}

main {
  flex: 1 2 500px; /* 更高收缩权重 */
}
```
````

### 动态比例分配

```css
.left {
  flex: 1 2 300px; /* 收缩权重2 */
}

.right {
  flex: 2 1 200px; /* 扩展权重2 */
}
```

## 高级技巧

### 1. 收缩/扩张计算公式

```
实际压缩量 = [(项目宽度 × shrink值) / Σ(所有项目宽度 × shrink值)] × 溢出量
实际扩张量 = [(当前元素grow值) / Σ(所有项目grow值)] × 剩余空间
实际宽度 = 原始宽度 ± (压缩/扩张量)
```

### 2. 响应式设计适配

```css
/* 移动端适配 */
.container {
  flex-direction: row;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    min-width: 200px;
    flex-shrink: 0; /* 禁止收缩 */
  }
}

/* 弹性边界控制 */
main {
  flex: 1;
  min-width: 300px; /* 最小宽度保障 */
  max-width: 1200px; /* 最大宽度限制 */
}
```

### 3. 布局优化原则

1. 使用`flex-wrap: wrap`实现流式布局
2. 组合`flex-basis`与`min/max-width`建立弹性区间
3. 通过`gap`属性替代 margin 实现等间距布局
   3.1. **等间距布局**：

```css:flex_blog.md
.container {
  display: flex;
  gap: 20px; /* 替代margin: 0 10px */
}
```

3.2 **避免外边距叠加**：
传统 margin 布局需要计算`margin-left/right`的叠加值，gap 自动处理间距计算

3.3 **双向间距控制**：
支持`row-gap`和`column-gap`分别控制行列间距

## 常见问题解决方案

1. **等高等宽**：`align-items: stretch`（默认值）
2. **底部对齐**：`justify-content: flex-end`
3. **内容截断**：设置`min-width: 0`触发压缩

```css
.item {
  min-width: 0; /* 解除默认min-width:auto限制 */
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## 交叉轴填充机制

### 基础实现

```css
.container {
  display: flex;
  height: 500px; /* 容器明确高度 */
}

.item {
  /* 自动继承容器高度 */
}
```

### 方向对应关系

| 主轴方向    | 交叉轴方向 |
| ----------- | ---------- |
| row（默认） | 垂直方向   |
| column      | 水平方向   |

### 特殊场景

```css
.container {
  flex-direction: column;
  width: 800px;
}

.item {
  width: auto; /* 水平方向填满容器 */
}

## 总结
Flex布局是现代Web开发中不可或缺的工具，通过灵活的属性组合，能够实现复杂的布局效果。深入理解Flex的核心概念和高级技巧，能够更好地应用和优化布局。希望以上内容能够帮助您更好地理解和应用Flex布局。

```
