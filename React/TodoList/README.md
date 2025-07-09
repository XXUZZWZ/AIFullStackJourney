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
- props 组件通信

  - 传递的状态
  - 传递自定义事件
  - 支持解构传值
  - 编写风格
  - 如果参数不多直接直接解构
  - 参数多的话可以
    const {
    todos // todos 数据
    ,onAddTodo // 添加 todos 数据
    } = props;

- 数据绑定
  - 变量
  - 数据状态
    - data binding **数据绑定** jsx 是就是静态的
    - {}数据绑定
    - 数据和界面的统一
    - 界面是有数据驱动的
    - 重点是维护数据和界面状态的一致性
    - 当数据发生 改变时，界面会自动更新,响应式的

## vue 和 react 区别

- vue 容易入门 api 文档好用
  - 以 api 为主
- react 框架 倾向于原生 js 入门难

  - hooks? 提供好用的函数而不是 api 以 use 开头
    vue:
    <input v-model="name"> vue 是双向绑定的
    react:
    <input value={name} onChange={(e) => setName(e.target.value)} />单向绑定

- localStorage 存储数据

  - html5 储存
    key:value
    api
  - localStorage.setItem('name',zff);
  - localStorage.getItem('name');
  - localStorage.removeItem('name');
  - localStorage.clear();

- BOM Browser Object Model 浏览器对象模型
  - window.alert('hello world');
  - DOM (Document Object Model) 文档对象模型
- 本地储存
  - localStorage 和 cookie 有什么异同
  - http 无状态 head cookie
  - cookie 太大 ,影响 http 性能 4kb
  - cookie 在服务器端和服务端都可以设置
    - 过期时间
    - 路径 domain 隔离 某个域名下才访问
  - localStorage 只在浏览器端
    - todos
    - 5~10MB
  - IndexDB 数据库 GB

## 自定义 hooks

- 自定义的
- use
- 某一项功能

  - 简单函数封装
  - 响应式状态
  - effect
  - todos

- 自定义 hooks

  - 现代 react app 的架构的一部分
  - hooks
    - 自定义 hooks
    - 框架只能能做 common 部分
    - ahooks 业务定制
  - 以 use 开头
    state,effect 逻辑封装复用
  - 可以 return 对象
    {
    todos,
    addTodo,
    removeTodo,
    updateTodo,
    clearCompleted,
    }
    函数式编程
  - 组件更好的聚焦于模板渲染
  - 全面 hooks 函数式编程

- 两个遗憾
  - ../../ 路径复杂 vite 配置一个短路径 vite.alias
  - toggle 、 delete 跨越组件层级有点多，useContext 。
