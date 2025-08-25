# 工程化

- 那些问题？ 工程一揽子方案
  - vite 启动过程：
    - 1.1 创建 HTTP 服务器
    - 1.2 创建静态文件服务器，设置中间件
    - 2.1 入口文件处理
    - 2.2 模块转化流程
    - 3.1 按需编译机制 模块依赖分析
    - 3.2 懒加载转换
    - 4.1 热模块 HMR 设置 建立 webSocket 连接
- 怎么介绍 vite
  - 兼容性问题 IE 11 不支持
  - web server 5173
  - index.html 首页 创建 http 服务模块？ express
  - tsx -> jsx ->js
  - styl -> css 文件
  - `vite 是一个基于原生es 模块化的开发工具 而有些浏览器不支持esm`
  - 按需编译实现冷启动 快 和 webSocket 热更新
  - main.tsx 入口文件，模块依赖
  - main.jsx --> App.jsx ---> App.css + react + components + router + api + store 整理这些模块之间的依赖关系
  - vite 要整理依赖关系链条
- 快？？？
  - 基于 es 模块，不需要打包所有模块，按需加载
- webback
  - 由于要支持老旧浏览器，不用 esm a->b->c->d，需要打包所有模块
  - 不用模块化
    - 先编译 d js 最上面
    - 再编译 c 放到 d 下面
    - 再编译 b 放到 c 下面
    - 再编译 a 放到 b 下面
- webpack 和 vite 的区别
- index.html 没有 type="module" 怕浏览器不支持 esm
  - 整理依赖关系，打包项目，面
- 适合大型项目 丰富的配置
  - 配置 entry 和 output 这是核心
  - plugins
    - html-webpack-plugin html template 在哪？
    - devServer
      - http server 细节
  - 一切皆可打包
  - web bundler 一切静态资源皆可打包
  - vite 快 不需要打包 ，生态定制性不然 webpack
  - webpack 打包，慢一点，但是兼容性好，生态丰富，可为大型项目定制，有很长的项目定制，有很长时间的业务验证。

```txt
流程图
1. 执行 vite dev 命令
   ↓
2. 解析 vite.config.js 配置
   ↓
3. 创建 HTTP 服务器 (端口 5173)
   ↓
4. 注册中间件栈
   ↓
5. 启动文件监听器
   ↓
6. 建立 WebSocket 连接 (HMR)
   ↓
7. 服务器就绪，等待请求
   ↓
8. 浏览器请求 index.html
   ↓
9. 返回 HTML，浏览器解析
   ↓
10. 浏览器请求 /src/main.tsx
    ↓
11. Vite 拦截请求，转换 TSX -> JS
    ↓
12. 返回转换后的代码
    ↓
13. 浏览器执行，应用启动完成
```
