## deep-webpack 学习笔记

### 1. 浏览器缓存与版本更新

- **强缓存**：命中后直接使用本地缓存，不发请求。典型响应头：`Cache-Control: public, max-age=31536000, immutable`。
- **协商缓存**：先发请求，由服务器基于 `ETag` 或 `Last-Modified` 判断是否返回 304。
- **问题场景**：前端活动频繁上线，若产物始终叫 `index.js`，浏览器会长期命中强缓存，导致无法获取新版本。
- **解决思路**：为构建产物添加内容指纹（如 `[contenthash]`），URL 变化即绕过旧缓存；HTML 自身不强缓存，引用的新 URL 会被拉取。

### 2. Webpack 输出指纹与哈希策略

- `filename: "bundle.[contenthash].js"`：产物名带内容哈希，内容变更才变更，便于长效缓存与增量发布。
- 建议同时设置：
  - `chunkFilename: "[name].[contenthash:20].js"` 用于异步 chunk。
  - `optimization.runtimeChunk: "single"` 拆分 runtime，提升长效缓存命中率。
  - `optimization.splitChunks.chunks: "all"` 通用拆分策略。
  - `optimization.chunkIds/moduleIds: "deterministic"` 保证稳定 ID。
  - `output.clean: true` 保证构建目录整洁，避免“旧文件残留假冲突”。

### 3. 可能的“哈希冲突”与规避

- 现实中真正的哈希碰撞极小，但易出现“看起来冲突/重名/缓存乱序”：
  - 产物名过短或未含 `[name]`，多个入口/异步包观感“冲突”。
  - 未设置 `chunkFilename`，仅 `filename` 生效，异步 chunk 仍旧无指纹。
  - 并行构建写入同一目录或 CDN 旧文件未清。
- 规避手段：
  - 拉长哈希位数，如 `[contenthash:20~32]`。
  - 在文件名中包含 `[name]`，区分不同入口/chunk。
  - 构建前清理输出目录，并确保 CI 不并发写同一路径。
  - 如需更强哈希函数，可设 `hashFunction: "sha256"`（可选）。

### 4. 本项目关键文件与职责

- `webpack.config.js`

  - `entry: ./src/main.tsx`
  - `output.filename: bundle.[contenthash].js`，`output.clean: true`
  - `resolve.extensions: [".tsx", ".ts", ".jsx", ".js"]`
  - `module.rules`：
    - `babel-loader` 处理 `tsx/ts/jsx/js`，预设 `@babel/preset-react`、`@babel/preset-typescript`
    - `style-loader + css-loader` 处理 CSS
  - `HtmlWebpackPlugin` 基于 `public/index.html` 生成 `dist/index.html`
  - `devServer`：端口 3000、自动打开、HMR、`static: dist`

- `package.json`

  - 脚本：
    - `dev: webpack server --mode development`
    - `build: webpack --mode production`
    - `buildD: webpack --mode development`
  - 依赖：`react`、`react-dom`
  - 开发依赖：`webpack`、`webpack-dev-server`、`html-webpack-plugin`、`babel-loader`、各类 Babel 预设、`style-loader`、`css-loader`

- `src/main.tsx`

  - 使用 `react-dom/client` 的 `createRoot` 挂载到 `#app`
  - 引入组件 `Hello` 与样式 `main.css`

- `src/Hello.tsx`
  - 简单的 React 函数组件，返回一段文案

### 5. 构建产物与发布建议

- 产物路径：`dist/`，入口 HTML 自动注入带指纹的 JS。
- 生产环境建议：
  - HTML：`Cache-Control: no-cache` 或较短 `max-age`，保证引用更新。
  - JS/CSS 静态资源：`Cache-Control: public, max-age=31536000, immutable`。
  - CDN：开启基于 URL 的缓存策略；保证回源文件名含指纹。
  - 灰度/回滚：基于文件名指纹可并存多版本，便于快速切换。

### 6. 进一步可优化点（可选）

- 配置 `chunkFilename` 与 `splitChunks`/`runtimeChunk`。
- 开启 SourceMap（`devtool`）并根据环境差异化：开发 `eval-cheap-module-source-map`，生产 `source-map`。
- 图片/字体等静态资源改为 `asset`/`asset/resource` 统一管理。
- 结合 `TerserPlugin`/`CssMinimizerPlugin` 做生产压缩与 tree-shaking 可视化（`webpack-bundle-analyzer`）。
