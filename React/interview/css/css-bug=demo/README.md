# css 模块化

- Button AnotherButton 按钮组件
  - 自己写的组件
  - 还有别人写的组件
  - 还有第三方的组件，可能会冲突。
- 唯一的类名

  - 取名
  - css 模块化

- styles.module.scss
  - react vite
    - 默认开启 css 模块化
    - 实现原理:
    - 确保唯一
  - vue scoped
  - 可读性会受到影响吗？
    - 不会
    - 被模块化保护起来了，会对 classname 进行处理生成唯一类名。
    - 模块化
    - npm run build
- dev/build/product/test
  - dev 开发阶段 开发阶段注意可读性 \
    - babel preset-env es6 style.module.scss
    - import styles from './style.module.scss'
    - 使用类名 className = {styles.className}使用类名的方法
    - style.module.scss in js 对象的每个类名都可以面向对象,自动对每个类名添加 hash 部分。
  - build 构建阶段 可读性不需要处理
  - product 生产环境
  - test 测试环境
    - npm run test 测试一下
    - aliYun nginx 跑起来
