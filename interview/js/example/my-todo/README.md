- npx create-next-app@latest my-todo
  基于 create-react-app 创建一个 my-todo next.js 项目
- npx

  - 不用先安装，可以直接运行包的命令，
  - 不会留下痕迹，不影响全局
  - npm i - g create-next-app@latest my-todo
  - 尝试一些 又不行下载很方便

- CSR 和 SSR
  组件在客户端运行 模板编译 挂载 浏览器 (client) SPA 谈不上 SEO
  Next.js 在服务端渲染 SSR 组件的编译发生在服务器端 SEO 非常好
  爬虫爬取的是服务器返回的 html ,而 CSR 只有一个#root
  企业站，SEO 的
