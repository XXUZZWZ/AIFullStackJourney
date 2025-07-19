# JSX

- JSX 独立不能运行
- 要依赖工程化工具 vite
  - jsx -> React.createElement();
- React 环境中

- Babel 编译

  - make javaScript better
  - 大胆使用 JS 最新语法
  - es6 promise -> es8 async await
    babel
    自动转译
  - ()=>{} ---> function(){}

- 编译的流程
  - pnpm i @babel/core @babel/cli -D
    - @babel/core babel 核心
    - @babel/cli babel 命令行
    - babel 负责转码
    - -D 表示开发阶段的依赖 devDependencies,上线后是不用的。
    - babel.config.js 配置文件
- ./node_modules/.bin/babel src --out-dir dist
  - react -> IOS 代码
  - jsx --> js
  - es6+ --> es5
  - babel.config.js 配置文件
