// webpack 配置文件
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口文件，Webpack 会从这里开始分析依赖关系，构建依赖图
  entry: "./src/main.jsx", // 入口文件路径

  // 输出配置，指定打包后文件的名称和存放目录
  output: {
    // 打包生成的文件名
    filename: "bundle.js",
    // 打包文件输出的绝对路径，__dirname 表示当前配置文件所在目录
    path: path.resolve(__dirname, "dist"),
    // 每次打包前清空输出目录，防止旧文件残留
    clean: true,
  },

  // 指定构建模式，development 为开发模式，便于调试，未压缩代码
  mode: "development", // 开发模式

  // 指定打包目标环境为 web 浏览器
  target: "web",

  // 模块规则：处理不同类型的资源
  module: {
    rules: [
      {
        // 处理 .css 文件
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        // 处理 .js/.jsx，支持 JSX 语法
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "defaults" }],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
    ],
  },

  // 解析后缀，支持省略 .js/.jsx
  resolve: {
    extensions: [".js", ".jsx"],
  },

  // 插件配置，这里使用 HtmlWebpackPlugin 自动生成 HTML 文件并引入打包后的 JS
  plugins: [
    new HtmlWebpackPlugin({
      // 指定 HTML 模板文件路径
      template: path.resolve(__dirname, "public/index.html"),
      // 生成的 HTML 文件名
      filename: "index.html",
    }),
  ],

  devServer: {
    // 配置开发服务器端口号，默认8080
    port: 8080,
    // 启动开发服务器后自动打开浏览器
    open: true,
    // 启用热模块替换（HMR），实现页面无刷新更新
    hot: true,
    // 配置静态资源服务，将 dist 目录作为静态文件根目录
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
  },
};
