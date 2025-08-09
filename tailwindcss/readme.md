# tailwindcss 原子 css

- 非常好用
- 几乎不用写 css
- AI 生成 代码 用的是 tailwindcss

- 文字行数限制
  - `webkit-line-clamp:3 ` 限制多少行
    配合 `webkit-box-orient:vertical`
    ` .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
`
  - display: -webkit-box; 浏览器内核一种弹性盒子 
  - overflow:hidden; 溢出的内容隐s藏
  - webkit 浏览器内核 用于 Chrome 和 safari
  - mozilla 浏览器内核 用于 Firefox 火狐浏览器代号
  - 实验阶段的属性 新的
