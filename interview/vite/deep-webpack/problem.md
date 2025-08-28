## deep-webpack 巩固题目（含参考答案）

### 一、选择题（单选）

1. 为了在生产中实现“内容变更才更新 URL”，下列文件名模板更推荐的是：

   - A. `bundle.[hash].js`
   - B. `bundle.[contenthash].js`
   - C. `bundle.[fullhash].js`
   - D. `bundle.[chunkhash].js`

   参考答案：B。`contenthash` 以最终内容为依据，更利于稳定长缓存。

2. 若只设置了 `output.filename`，但未设置 `output.chunkFilename`，更可能导致的问题是：

   - A. 入口文件无法生成
   - B. 异步 chunk 未指纹化，缓存策略不一致
   - C. devServer 无法启动
   - D. HMR 失效

   参考答案：B。

3. 下列哪项更有助于提升长效缓存与哈希稳定？

   - A. `optimization.runtimeChunk: "single"`
   - B. `devtool: "eval"`
   - C. `output.clean: false`
   - D. `optimization.chunkIds: "natural"`

   参考答案：A。

4. 遇到“看起来哈希冲突/重名”，以下哪项不是常见原因？

   - A. 输出目录未清理，旧文件残留
   - B. 未在文件名中包含 `[name]`
   - C. CDN 基于 URL 缓存
   - D. 未设置 `chunkFilename`

   参考答案：C。CDN 基于 URL 缓存是推荐做法，不是问题本身。

### 二、判断题（对/错）

1. 使用 `Cache-Control: public, max-age=31536000, immutable` 配合内容指纹，可以让 JS/CSS 基本“永久缓存”。（ ）

   参考答案：对。

2. 只要用了 `[hash]`，就能保证内容不变时文件名也绝不变化。（ ）

   参考答案：错。`[hash]` 可能受构建环境影响；`[contenthash]` 更稳。

3. 生产环境中，建议给 HTML 也设置很长的强缓存。（ ）

   参考答案：错。HTML 通常不强缓存，以便及时引用最新指纹资源。

### 三、简答题

1. 简述强缓存与协商缓存的区别及各自的典型响应头。

   - 参考要点：强缓存命中不发请求（`Cache-Control`），协商缓存需发请求判定 304（`ETag`/`Last-Modified`）。

2. 为什么推荐在生产构建中使用 `contenthash`？与 `hash`、`chunkhash` 的主要区别是什么？

   - 参考要点：`contenthash` 基于产物内容，稳定；`hash` 基于整体构建；`chunkhash` 基于 chunk 图，受依赖链影响更大。

3. 在什么情况下需要同时设置 `filename` 与 `chunkFilename`？示例说明不设置 `chunkFilename` 可能带来的问题。

   - 参考要点：存在代码拆分/动态 import；异步 chunk 不带指纹会影响缓存。

4. 结合本项目，说明从源码到产物的主要流程与关键工具插件的作用。
   - 参考要点：`babel-loader` + 预设编译 TS/JSX，`style-loader/css-loader` 处理样式，`HtmlWebpackPlugin` 注入产物，`devServer` 热更新与本地服务。

### 四、实践题（开放题）

1. 在当前 `webpack.config.js` 基础上补充：

   - 设置 `chunkFilename` 为 `[name].[contenthash:20].js`
   - 开启 `splitChunks` 与 `runtimeChunk: 'single'`
   - 在生产环境打开 `source-map`
   - 提交一段解释，说明这样做对缓存命中与调试体验的影响。

2. 在服务器/CDN 层分别给 HTML 与静态资源设置合理的缓存策略，并描述你的选择与理由。
