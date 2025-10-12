# polyfill

- 什么是 polyfill
  - Polyfill 就是兼容补丁 ；当老浏览器不支持新特性(promise fetch array.include)
  - babel 怎么做 polyfill
  - @babel/core @babel/cli @babel/preset-env
  - babel 本身只转译语法 箭头函数--> 普通函数 但不补全 API
  - @babel/preset-env 配合 useBuiltIns:"useage" 根据 API 从 core.js 中引入对应的 polyfill
