# hash 冲突怎么解决

- 强缓存 和 协商缓存

  - Cache-Control :max-age = 60
  - 节日活动，修改，编译，打包，上线
  - 假如都叫 index.js
  - 不会请求，怎么更新

- bundle.[hash].js
  - 实现刷新强缓存，更新用户缓存
  - 使用 hash 表示不同版本，强制用户读取新文件。
  - hash 设置 ，既可以强缓存又随时刷新。
- js css code split

- react react-dom react-router-dom libs 单独打包 避免重复请求，因为这里的很少变动

reference:

### 可能的原因与处理办法（Webpack 构建产物哈希“冲突”）

- **加长哈希并换更强哈希函数**：降低理论碰撞概率  
  在 Webpack 5，默认 `xxhash64` 已很稳，但你可以改为 `sha256` 并拉长哈希长度。
- **带上名称，避免文件名语义冲突**：不同入口/异步 chunk 使用相同模板更易“看起来冲突”，在文件名里加 `[name]` 更直观、也更不易重名。
- **为异步 chunk 也设置 chunkFilename**：很多“冲突”发生在异步拆分产物上，仅改 `filename` 不够。
- **开启稳定且基于内容的哈希**：确保内容没变时哈希稳定、变了才变；避免环境差异导致“假变更”。
- **清理输出目录**：老文件残留会造成“冲突”错觉，构建前清理 `dist`。

### 建议的配置片段

```js
// webpack.config.js（片段）
module.exports = {
  // ...
  output: {
    // 给入口包：名称 + 内容哈希，拉长到 20（可按需调整）
    filename: "[name].[contenthash:20].js",
    // 给异步 chunk：同样处理
    chunkFilename: "[name].[contenthash:20].js",

    // 更强哈希函数（可选）
    hashFunction: "sha256",
    hashDigestLength: 32, // 或 20/24，位数越长碰撞概率越低

    // 当多个构建向同一目录输出时，用 uniqueName 隔离命名空间（可选）
    uniqueName: "deep-webpack-app",
    clean: true, // 构建前清理输出目录
  },
  optimization: {
    // Webpack 5 默认已是 deterministic，确保 chunkId/moduleId 稳定
    chunkIds: "deterministic",
    moduleIds: "deterministic",
    // 确保基于最终内容计算哈希（Webpack 5 默认开启）
    realContentHash: true,
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: "single", // 独立 runtime，提升长效缓存与哈希稳定
  },
};
```

### 排查小贴士

- 确认没有并行构建写入同一 `output.path`（CI 并发时常见）。
- CDN/代理层如果基于 URL 去缓存，确保文件名指纹化且设置了强缓存（如 `Cache-Control: public, max-age=31536000, immutable`）。
- 若只是浏览器缓存“看起来冲突”，强刷或改指纹长度即可验证。

如果你贴一下当前完整的 `webpack.config.js`，我可以按你的场景给出最小改动版。

### 目标

让 webpack 正确“标记已用导出”并在生产构建中删除未使用代码（Tree Shaking）。

### 必要前提

- 使用 ES Modules 语法（import/export），避免动态 `require`。
- 如果用 Babel，保持 ES Module 不被转成 CommonJS（`@babel/preset-env` 配置 `modules: false`）。

### 配置步骤

- **在 `package.json` 声明副作用**
  - 最狠：删除一切未引用代码

```json
{
  "sideEffects": false
}
```

- 如果样式/全局 polyfill 等有副作用，精确声明保留它们：

```json
{
  "sideEffects": ["*.css", "*.scss", "src/polyfills/**", "src/styles/**"]
}
```

- **在 `webpack.config.js` 开启树摇相关优化**
  - 生产模式已默认压缩与摇树，但可显式写清楚，便于在开发模式验证。

```js
// 关键片段示例
module.exports = {
  mode: "production", // 生产模式：默认启用压缩与摇树
  // devtool: false,               // 可选：去掉注释便于观察体积
  optimization: {
    usedExports: true, // 标记已用导出（你当前这行）
    minimize: true, // 使用 Terser 等压缩器移除未用代码
    concatenateModules: true, // 作用域提升（进一步减小包）
    innerGraph: true, // 更精细的依赖图分析，有助于摇树
  },
};
```

- **三方库的副作用声明**
  - 若引入的库没有正确声明 `sideEffects`，即使未用代码也可能保留。优先选择已正确声明的库版本，或只按需导入（如 `import { pick } from 'lodash-es'`）。

### 验证方式（任选其一）

- 看产物注释：构建后的 bundle 中应少见 `/* unused harmony export ... */`，或该导出被删除。
- 对比体积：生产构建前后对比 `dist` 体积。
- 打开 `stats` 报告或使用可视化插件（如 `webpack-bundle-analyzer`）查看未引用模块是否被剔除。

### 常见坑

- `sideEffects: false` 却把全局样式、polyfill 也摇掉：请把这些文件加回 `sideEffects` 白名单。
- Babel 把 ESModule 转成 CommonJS：设置 `modules: false`。
- 动态导入路径或 `require()` 条件判断：难以静态分析，影响摇树效果。

简言之：在 `webpack.config.js` 保持 `optimization.usedExports: true` 且 `mode: "production"`（含 `minimize`），并在 `package.json` 正确声明 `sideEffects`，即可稳定实现 Tree Shaking。
