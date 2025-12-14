# OAuth2 授权码流程演示

这是一个完整的OAuth2授权码模式（Authorization Code Flow）演示项目，展示了回调URL在OAuth2流程中的关键作用。

## 📋 目录

- [项目简介](#项目简介)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [OAuth2流程说明](#oauth2流程说明)
- [回调URL详解](#回调url详解)
- [测试说明](#测试说明)
- [常见问题](#常见问题)

## 📖 项目简介

本项目通过一个实际的登录授权场景，演示了OAuth2授权码模式的完整流程：

1. **用户访问客户端** - 用户想要登录客户端应用
2. **重定向到授权服务器** - 客户端将用户重定向到授权服务器
3. **用户登录并授权** - 用户在授权服务器登录并同意授权
4. **回调到客户端** - **关键步骤** - 授权服务器通过回调URL将授权码返回给客户端
5. **交换访问令牌** - 客户端使用授权码换取访问令牌
6. **访问受保护资源** - 客户端使用访问令牌访问用户数据

## 📁 项目结构

```
oauth2-demo/
├── server.js            # 授权服务器 + 资源服务器 (端口 3001)
├── client-server.js     # 客户端静态文件服务器 (端口 3000)
├── package.json         # 项目依赖配置
├── start.bat            # Windows启动脚本
├── start.sh             # Linux/Mac启动脚本
├── README.md            # 本文档
└── client/              # 客户端应用文件
    ├── index.html       # 主页
    ├── callback.html    # OAuth2回调处理页面
    ├── dashboard.html   # 登录后的用户仪表板
    ├── client.js        # 客户端JavaScript工具函数
    ├── callback.js      # 回调处理逻辑
    └── dashboard.js     # 仪表板逻辑
```

## 🚀 快速开始

### 方法1: 使用启动脚本（推荐）

**Windows用户:**
```bash
# 双击运行或在命令行执行
start.bat
```

**Linux/Mac用户:**
```bash
# 给脚本添加执行权限
chmod +x start.sh

# 运行脚本
./start.sh
```

### 方法2: 手动启动

1. **安装依赖**
```bash
npm install
```

2. **启动授权服务器**（终端1）
```bash
node server.js
```

3. **启动客户端应用**（终端2）
```bash
node client-server.js
```

4. **访问应用**
   - 客户端应用: http://localhost:3000
   - 授权服务器: http://localhost:3001

### 测试账号
- 管理员账号: `admin` / `password123`
- 普通用户: `user1` / `123456`

## 🔄 OAuth2流程说明

### 1. 授权请求
当用户点击"使用OAuth2登录"时，客户端会构造授权URL：

```
http://localhost:3001/auth/login?
  response_type=code&
  client_id=demo-client&
  redirect_uri=http://localhost:3000/callback.html&
  scope=profile&
  state=random_string
```

### 2. 用户授权
用户在授权服务器登录并同意授权。

### 3. 授权码回调（关键步骤）
授权成功后，授权服务器将用户重定向到预设的回调URL：

```
http://localhost:3000/callback.html?
  code=AUTHORIZATION_CODE&
  state=random_string
```

**回调URL的作用：**
- 将授权码安全地传递给客户端
- 通过state参数防止CSRF攻击
- 必须与预先注册的URL完全匹配

### 4. 令牌交换
客户端从回调URL中提取授权码，并向令牌端点发送请求：

```javascript
POST http://localhost:3001/auth/token
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

grant_type=authorization_code&
code=AUTHORIZATION_CODE&
redirect_uri=http://localhost:3000/callback.html
```

### 5. 访问资源
使用获取的访问令牌调用受保护的API：

```javascript
GET http://localhost:3001/api/userinfo
Authorization: Bearer ACCESS_TOKEN
```

## 🎯 回调URL详解

### 什么是回调URL？
回调URL（Redirect URI）是OAuth2流程中的一个关键组成部分，它是：
- 授权服务器将授权响应发送回客户端的地址
- 必须在客户端注册时预先指定
- 用于安全地传递授权码

### 回调URL的安全特性

1. **预注册验证**
   - 客户端必须在授权服务器预先注册回调URL
   - 实际回调URL必须与注册的URL匹配

2. **完整路径匹配**
   ```javascript
   // 正确: 完全匹配
   注册: http://localhost:3000/callback
   回调: http://localhost:3000/callback

   // 错误: 路径不匹配
   注册: http://localhost:3000/callback
   回调: http://localhost:3000/oauth/callback
   ```

3. **防止令牌泄露**
   - 使用HTTPS保护传输过程
   - 验证state参数防止CSRF

### 回调URL示例

**Web应用:**
```
http://localhost:3000/callback
https://yourapp.com/auth/oauth/callback
```

**移动应用:**
```
myapp://oauth/callback
```

### 本项目的回调URL配置

在 `server.js` 中定义：
```javascript
const clients = {
  'demo-client': {
    clientId: 'demo-client',
    clientSecret: 'demo-secret',
    redirectUris: ['http://localhost:3000/callback.html'],  // 注册的回调URL
    scopes: ['read', 'profile']
  }
};
```

在 `client.js` 中使用：
```javascript
const config = {
  redirectUri: 'http://localhost:3000/callback.html'  // 实际回调URL
};
```

## 🧪 测试说明

### 完整测试流程

1. **启动服务**
   - 运行启动脚本或手动启动两个服务

2. **访问客户端**
   - 打开 http://localhost:3000

3. **点击登录**
   - 观察URL跳转到授权服务器

4. **输入凭据**
   - 使用测试账号登录

5. **同意授权**
   - 勾选同意授权复选框

6. **观察回调过程**
   - 查看浏览器如何重定向到回调URL
   - 注意URL中的授权码参数

7. **查看令牌交换**
   - 回调页面自动处理授权码
   - 获取并显示访问令牌

8. **访问受保护资源**
   - 查看用户仪表板
   - 测试API调用

### 错误场景测试

1. **无效的回调URL**
   - 修改客户端配置使用未注册的回调URL
   - 观察错误响应

2. **缺少state参数**
   - 移除state参数的生成和验证
   - 了解CSRF风险

3. **授权码过期**
   - 等待1分钟（授权码有效期）
   - 尝试使用过期的授权码

4. **无效的客户端凭据**
   - 修改clientSecret并观察错误

## ❓ 常见问题

### Q: 为什么回调URL必须预注册？
A: 这是OAuth2的安全机制，防止攻击者将授权码重定向到恶意URL。

### Q: 可以使用localhost作为回调URL吗？
A: 可以，但仅用于开发和测试。生产环境必须使用HTTPS。

### Q: 回调URL可以包含查询参数吗？
A: 可以，但推荐使用路径参数。如果包含查询参数，必须完全匹配。

### Q: 如何处理多个回调URL？
A: 可以注册多个回调URL，授权时选择其中一个使用。

### Q: 回调URL和重定向URL有什么区别？
A: 它们是同一个概念，OAuth2规范中称为"redirect_uri"，常被称作回调URL。

## 📚 扩展学习

- [OAuth2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [OAuth2安全最佳实践](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [PKCE (RFC 7636)](https://tools.ietf.org/html/rfc7636) - 单页应用和移动应用推荐使用

## 📝 开发说明

本项目为了演示目的简化了一些实现：
- 使用内存存储（重启后数据丢失）
- 简化了令牌管理
- 没有实现刷新令牌机制
- 生产环境需要更强的安全措施

## 🤝 贡献

欢迎提交Issue和Pull Request！