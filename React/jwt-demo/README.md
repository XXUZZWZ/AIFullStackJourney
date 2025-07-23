# JWT JSON Web Token 登录鉴权

- isLogin ,user 全局状态 zustand
- mock 完成登录模拟

  - apifox api 请求模拟，不用写页面也可以发送请求

- 会话授权 session_id

  - 服务器知道我们是谁,给客户端的 cookie 放一个 session_id,session_id 为主键存储数据库，session_id 为外键关联用户表，用户表保存存数据库
  - 客户端每次请求时，从 cookie 中读取 session_id
  - 服务器每次响应时，将 session_id 放在 cookie 中
  - 这样服务器就知道我们是谁了。
  - http 是无状态的

- 登录和用户鉴权方案 JWT JSON Web Token

  - {id:112,username:'帅的胎动',level:4}
  - token = HS256( base64_URLcode(header) + '.' + base64_URLcode(payload) + '.' , base64(signature))
  - header: {alg: 'HS256', type: 'JWT'}
  - 登录成功，将 token 放在 cookie 中，并设置过期时间，比如 7 天。
  - decode 解码获取用户信息
    {id:112,username:'帅的胎动',level:4}
  - 后续一定要带上 token

- jsonwebtoken
  - npm i jsonwebtoken
  - jwt 鉴权的库
  - sign 颁发一个 token user secret
  - verify 验证 token user decode 验证 token user
  - decode 解码获取用户信息
  - sign 解决
  - HTTP 请求头 Authorization: Bearer token 带上 token
  - cookie 会自动带上而 token 需要手动设置
  - node 后端默认包的应用使用 commonjs 模块
  ```js
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMDAxIiwidXNlcm5hbWUiOiJhZG1pbiJ9LCJpYXQiOjE3NTMyMzkyOTUsImV4cCI6MTc1MzIzOTM4MX0.yN_llNwy-gGku4782Je0o8GVcuXTX3tff14caBA-Mys"
  ```
- 私钥
  - 私钥不能放在前端，放在后端
- Authraization: Bearer token
  - Authraization 字段规范，Bearer 表示持有者
- 前端的用户权限管理，流程
  - 登录数据 user useUserStore
  - 登录页面
    - 受控组件/非受控组件
  - 路由守卫
  - api 目录下
