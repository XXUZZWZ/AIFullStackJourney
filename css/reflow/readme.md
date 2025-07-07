# 回流重绘

- 布局难点 列式布局和理解 BFC /FFC
  - html 根元素 最外层的的第一个 BFC 元素 Block Formatting Context 块级从上到下，行内从从左到右，格式化上下文。有了文档流。
  - float overflow:hidden flex
  - 有没有什么标签可以做列式布局
    - table 有 tr td
      为啥不用这个呢？
      - 触发太多回流和重绘
      - 不够灵活
      - 语义不合

## 回流和重绘

- 回流 reflow
- 重新计算样式并计算布局 reLayout
- 当 RenderTree 中部分或全部元素的尺寸，结构或某些熟悉发生改变时，浏览器重新渲染部分或全部文档的过程叫回流
  table 不适合布局的原因是只要局部改变，整个 table 都要回流重绘
  - 火烧赤壁
    display:none 不参与回流重绘，性能优化的一种方案
- 重绘 repaint 重新生成绘制指令，当页面元素改变并不影响它再文档流的位置
  如 color background-color visibility 不会回流重排 重绘 hidden 和 dshow
