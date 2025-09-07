# next.js 全栈

## 数据库 orm prisma

orm 工具
object relation mapping
User 表 --> User 类
一行 --> new User () 实例 映射到数据库 做了一次抽象
底层数据库被映射成 高级语言

## 数据库表结构

- users
- posts

## 核心亮点

- jwt 双 token 鉴权
- 虚拟列表
- 大文件上传
- ai 工程化
  - 流式输出
  - function call
  - mcp
- ai 搜索
  - 通过比较向量 cos 值 来匹配相似度

## 目录结构

- lib/db.ts 复用的 prisma cline

## 用户登陆

### 密码加密

- bcrypt.js 加密算法 单向加密 不会被解密

  register 加密一次
  login password 加密 一次
  比较加密后的串是否一样

- 状态码：
  200 ok
  201 created
  400 Bad Request
  401  401 未授权错误
  409 Conflict
  500 Inernal Server Error

### 双 token

- 单 token localStorage 同源可访问 不清除一直存在
- 双 token
- 安全 + 无感刷新
- accessToken 校验身份 重要 时间有效期变短 h 小时单位 cookie
- refreshToken 刷新 7d 时间长
  - 通过 refreshToken 得到 accessToken 无感刷新
- middleware 的概念
  - 中间件 配置一个列表 来验证请求和响应之间执行预处理逻辑，比如日志，验证等
  - dashboard
  - some startWith
  - response.next()
  - response.redirect() 跳转

