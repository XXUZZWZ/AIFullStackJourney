const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const qs = require('querystring');
const path = require('path');

const app = express();
const PORT = 3001;

// CORS中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 中间件
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// 模拟用户数据库
const users = {
  'admin': {
    password: 'password123',
    name: '管理员',
    email: 'admin@example.com'
  },
  'user1': {
    password: '123456',
    name: '张三',
    email: 'zhangsan@example.com'
  }
};

// 模拟注册的客户端
const clients = {
  'demo-client': {
    clientId: 'demo-client',
    clientSecret: 'demo-secret',
    redirectUris: ['http://localhost:3002/callback.html'],
    scopes: ['read', 'profile']
  }
};

// 模拟授权码存储
let authCodes = new Map();
let accessTokens = new Map();

// JWT密钥
const JWT_SECRET = 'oauth2-demo-secret-key';

// 生成随机字符串
function generateRandomString(length = 40) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 验证客户端
function authenticateClient(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="OAuth2 Server"');
    return res.status(401).json({ error: 'invalid_client' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [clientId, clientSecret] = credentials.split(':');

  const client = clients[clientId];
  if (!client || client.clientSecret !== clientSecret) {
    return res.status(401).json({ error: 'invalid_client' });
  }

  req.client = client;
  next();
}

// 登录页面
app.get('/auth/login', (req, res) => {
  const { client_id, redirect_uri, response_type, scope, state } = req.query;

  // 验证必需参数
  if (!client_id || !redirect_uri || response_type !== 'code') {
    return res.status(400).send('<h1>无效的授权请求</h1><p>缺少必需参数</p><a href="javascript:history.back()">返回</a>');
  }

  // 验证客户端
  const client = clients[client_id];
  if (!client) {
    return res.status(400).send('<h1>无效的客户端</h1>');
  }

  // 验证回调URL
  if (!client.redirectUris.includes(redirect_uri)) {
    return res.status(400).send('<h1>无效的回调URL</h1>');
  }

  // 生成登录页面
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>登录 - OAuth2演示</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
        .form-group { margin: 15px 0; }
        label { display: block; margin-bottom: 5px; }
        input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .info { background: #f8f9fa; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
        .demo-users { margin-top: 20px; padding: 10px; background: #e9ecef; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h2>授权登录</h2>
      <div class="info">
        <strong>应用:</strong> ${client_id}<br>
        <strong>请求权限:</strong> ${scope || '未指定'}<br>
        <strong>回调地址:</strong> ${redirect_uri}
      </div>

      <form method="POST" action="/auth/authorize">
        <input type="hidden" name="client_id" value="${client_id}">
        <input type="hidden" name="redirect_uri" value="${redirect_uri}">
        <input type="hidden" name="scope" value="${scope || ''}">
        <input type="hidden" name="state" value="${state || ''}">

        <div class="form-group">
          <label>用户名:</label>
          <input type="text" name="username" required>
        </div>

        <div class="form-group">
          <label>密码:</label>
          <input type="password" name="password" required>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" name="consent" value="yes" required>
            我同意授权该应用访问我的信息
          </label>
        </div>

        <button type="submit">授权并登录</button>
      </form>

      <div class="demo-users">
        <h4>测试账号:</h4>
        <p>用户名: admin | 密码: password123</p>
        <p>用户名: user1 | 密码: 123456</p>
      </div>
    </body>
    </html>
  `);
});

// 处理授权请求
app.post('/auth/authorize', (req, res) => {
  const { client_id, redirect_uri, scope, state, username, password, consent } = req.body;

  // 验证用户
  const user = users[username];
  if (!user || user.password !== password) {
    return res.send('<h1>用户名或密码错误</h1><a href="javascript:history.back()">返回</a>');
  }

  // 验证授权
  if (consent !== 'yes') {
    return res.send('<h1>必须同意授权才能继续</h1><a href="javascript:history.back()">返回</a>');
  }

  // 生成授权码
  const authCode = generateRandomString();
  authCodes.set(authCode, {
    clientId: client_id,
    userId: username,
    redirectUri: redirect_uri,
    scope: scope || 'read',
    expiresAt: Date.now() + 60000 // 1分钟过期
  });

  // 构建回调URL
  const callbackParams = { code: authCode };
  if (state) callbackParams.state = state;

  const callbackUrl = `${redirect_uri}?${qs.stringify(callbackParams)}`;

  // 显示授权成功页面
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>授权成功</title>
      <meta charset="utf-8">
      <meta http-equiv="refresh" content="3;url=${callbackUrl}">
      <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; text-align: center; }
        .success { color: #28a745; }
      </style>
    </head>
    <body>
      <h2 class="success">✓ 授权成功</h2>
      <p>正在重定向到客户端...</p>
      <p><small>3秒后自动跳转，或<a href="${callbackUrl}">立即点击</a></small></p>
      <div style="margin-top: 30px; padding: 10px; background: #f8f9fa; border-radius: 4px; text-align: left;">
        <h4>回调URL:</h4>
        <code style="word-break: break-all;">${callbackUrl}</code>
      </div>
    </body>
    </html>
  `);
});

// 令牌端点 - 用授权码换取访问令牌
app.post('/auth/token', authenticateClient, (req, res) => {
  const { grant_type, code, redirect_uri } = req.body;

  if (grant_type !== 'authorization_code') {
    return res.status(400).json({ error: 'unsupported_grant_type' });
  }

  // 验证授权码
  const authCodeData = authCodes.get(code);
  if (!authCodeData || authCodeData.expiresAt < Date.now()) {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // 验证客户端ID和回调URL
  if (authCodeData.clientId !== req.client.clientId ||
      authCodeData.redirectUri !== redirect_uri) {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // 生成访问令牌
  const accessToken = jwt.sign(
    { userId: authCodeData.userId, scope: authCodeData.scope },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // 存储访问令牌
  accessTokens.set(accessToken, {
    userId: authCodeData.userId,
    scope: authCodeData.scope
  });

  // 删除已使用的授权码
  authCodes.delete(code);

  // 返回令牌响应
  res.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: authCodeData.scope
  });
});

// 资源API端点 - 获取用户信息
app.get('/api/userinfo', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.setHeader('WWW-Authenticate', 'Bearer realm="OAuth2 Resource Server"');
    return res.status(401).json({ error: 'unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 验证令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users[decoded.userId];

    if (!user) {
      return res.status(401).json({ error: 'invalid_token' });
    }

    // 返回用户信息
    res.json({
      id: decoded.userId,
      name: user.name,
      email: user.email,
      scope: decoded.scope
    });
  } catch (err) {
    res.status(401).json({ error: 'invalid_token' });
  }
});

// 主页 - 显示服务器信息
app.get('/', (req, res) => {
  res.json({
    name: 'OAuth2演示授权服务器',
    port: PORT,
    endpoints: {
      authorize: 'GET /auth/authorize',
      login: 'GET /auth/login',
      token: 'POST /auth/token',
      userinfo: 'GET /api/userinfo'
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  OAuth2 授权服务器已启动              ║
║  端口: ${PORT}                            ║
╚════════════════════════════════════════╝
访问 http://localhost:${PORT} 查看API信息

授权端点: http://localhost:${PORT}/auth/login?client_id=demo-client&redirect_uri=http://localhost:3002/callback.html&response_type=code&scope=profile
  `);
});