## hooks todos

- 安排一个 css 亮点
  - stylus
    - css 超集
  - 拥有 vite 脚手架
    stylus 预编译只要安装了 stylus vite 自动会自动直接编译
    来自 vite vite 社区
  - react 组件设计
    - 开发任务单元
    - 设计组件
      - 状态
      - 界面功能
      - 行为
      - 响应式
  - 功能：
    - 新建 todo 需要一个表单
    - 修改 todo 列表
    - 删除 todo
    - 组件之间的关系
  - 按功能划分 粒度
    - from 表单
    - list 列表
      - Item 组件 便于维护 和性能

## 样式

- 字体
  - 设置多个，设备的支持的字体会被优先使用(对苹果设备做一个优化)
    - 苹果字体：font-family -apple-system 前端负责用户体验，字体也是体验的一部分
- rem
  - 相对单位 rem 相对 根元素的 font-size
  - 移动端的重要单位 ，少用这种 px 绝对参数，
    - 移动端 宽高不定 多用 vw / vh (viewport) ,em 相对自身的 font-size 等比例 这种相对单位
    - 使用相对单位可以在所有设备上适配
