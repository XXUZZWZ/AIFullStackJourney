# CSR 和 SSR

- CSR

  - spa seo 不好 只有一个 `<div id = 'root'></div>`
  - 移动端时代，流量入口不在是百度,而是应用市场
  - webapp h5 开发快

- SSR

  - 服务器渲染
  - 解决 seo 问题
  - 解决首次加载慢
  - 页面渲染更快，SEO 好
  - Web Site
  - AI 类的 WEB Site 希望要在 Google/Baidu 搜索结果中排名靠前
  - AI 出海

- shadcn

  - https://ui.shadcn.com/
  - react-vant 组件库安装完项目后项目就变慢了，要按需加载
  - shadcn 更现代的前端框架，基于 tailwindcss 直接懒加载，直接把 components 放到 src 下
    - base color 主题风格 neutral 默认 dark 等
    - init
    - add
    - remove

- next.js 约定
  - app 可以不需要 src
  - app 表示应用目录 app router
    - 目录即路由
    - app/repos/page.tsx 就变成了路由
    - app/repos/[id]
- RESTful 是一种基于 HTTP 协议设计的软件架构风格，后端通过定义资源的 URI，利用 HTTP 动词（如 GET、POST、PUT、DELETE）对资源进行操作，实现前后端分离和接口的统一化管理。

- App Router

  - 自动配置路由，文件夹就是路由

- layout
  - 做布局
- page
  - 做页面
- 404
