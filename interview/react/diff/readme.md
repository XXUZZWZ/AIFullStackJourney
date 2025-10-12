# diff 算法

- 给两颗虚拟 dom 树 Vnode Tree
- 要输出一个补丁(patches)列表 ，描述如何把 dom 从 crent 树构建出 wrokinprogress 树 操作变少

- 同层比较
- type 不同 直接删除
- 递归的方式比较 children
- 根据 key 比较 children 用移动代替修改 步骤越少越好

- props 比较
  - 通过合并新旧属性并逐一对比，统一打包为属性更新补丁，实现最小化更新。
