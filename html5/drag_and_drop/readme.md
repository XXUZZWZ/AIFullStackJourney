# HTML5 Drag and Drop

- html5
  新的交互相关
- ipad 为何成功
  - 用户体验 拖拽 很简单 用户理解学习快
  - google 拖拽式上传
- 媒体查询
  - PC First 的设计
  - Mobile First 的设计 80% 体验是移动优先
  - 查询相关的设备 做适配
    - 使用@media (条件) {样式}
      - max-width<600px;移动
      - max-width<1024px;PC ipad
      - max-width>1600+px;大尺寸
  - 多设备适配 移动时代出现的
  - 适配
- drag and drop 细节
  - 有些元素有默认的拖拽特性，比如图片可以拖拽到新标签页打开
    - 在 dragstart preventDefault()
    - 元素添加 dragable="true" 支持 drag 功能 为 1 drag
    - 模拟现实中的用户体验，容器可以 drop
    - dragEnter preventDefault();添加一些样式反馈
    - dragOver preventDefault(); 阻止默认行为，以及让 div 也可作为放置目标
    - drop 删除 拖拽上传
    - dragLeave 删除样式
