# Web 安全：跨域配置与安全防护

> 从跨域问题切入，讲解如何在解决跨域时避免 XSS、CSRF 等安全漏洞

---

## 目录

- [一、引言：跨域与安全的关系](#一引言跨域与安全的关系)
- [二、正确配置 CORS 避免安全漏洞](#二正确配置-cors-避免安全漏洞)
- [三、跨域场景下的 XSS 防护](#三跨域场景下的-xss-防护)
- [四、跨域场景下的 CSRF 防护](#四跨域场景下的-csrf-防护)
- [五、跨域方案安全对比](#五跨域方案安全对比)
- [六、安全配置最佳实践](#六安全配置最佳实践)
- [七、示例代码](#七示例代码)

---

## 一、引言：跨域与安全的关系

### 1.1 同源策略：浏览器安全基石

**同源策略 (Same-Origin Policy)** 是浏览器最核心的安全机制，它的存在是为了隔离恶意网站，防止攻击者利用用户在其他网站的登录状态进行恶意操作。

**同源判断标准：** 协议、域名、端口三者全部相同

```
http://www.example.com:80/path

协议:   http
域名:   www.example.com
端口:   80
```

**跨域示例：**

| 当前页面 | 目标URL | 是否跨域 | 原因 |
|---------|---------|---------|------|
| `http://a.com` | `http://a.com/api` | 否 | 同源 |
| `http://a.com` | `https://a.com/api` | 是 | 协议不同 |
| `http://a.com` | `http://b.com/api` | 是 | 域名不同 |
| `http://a.com:80` | `http://a.com:8080` | 是 | 端口不同 |

### 1.2 为什么需要"安全地"跨域？

同源策略虽然保护了用户安全，但也限制了合法的跨域需求（如前后端分离、微服务架构、CDN 资源加载等）。

**CORS (跨域资源共享)** 的设计理念是：**在安全的前提下，有条件地放松同源策略限制**。

**核心原则：**
- 跨域请求必须经过服务端明确允许
- 浏览器默认拒绝带凭证的跨域请求
- 敏感操作需要额外的安全验证

### 1.3 跨域配置不当的常见安全风险

| 错误配置 | 安全风险 | 影响 |
|---------|---------|------|
| `Access-Control-Allow-Origin: *` + `Credentials: true` | 浏览器会阻止请求 | 功能不可用 |
| `Access-Control-Allow-Origin: *` | 任何网站都可调用 API | 数据泄露、滥用 |
| 缺少 `Vary: Origin` | 缓存污染 | 用户可能获得错误的数据 |
| 缺少预检请求处理 | 复杂请求绕过检查 | 安全漏洞 |

---

## 二、正确配置 CORS 避免安全漏洞

### 2.1 白名单机制：拒绝通配符

**危险配置：**

```javascript
// 危险：允许任何域名访问
res.header('Access-Control-Allow-Origin', '*')

// 危险：携带凭证时使用通配符会导致浏览器报错
res.header('Access-Control-Allow-Origin', '*')
res.header('Access-Control-Allow-Credentials', 'true')
// 浏览器错误：The value of the 'Access-Control-Allow-Origin' header ...
// cannot be the wildcard '*' when the request's credentials mode is 'include'
```

**安全配置：**

```javascript
// 安全：白名单验证
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://example.com',
    'https://www.example.com',
    'https://admin.example.com'
  ]

  const origin = req.headers.origin

  // 验证请求来源是否在白名单中
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  // 重要：添加 Vary 头防止缓存污染
  res.header('Vary', 'Origin')

  next()
})
```

### 2.2 Credentials 与 Origin 的冲突问题

**核心原则：** 当 `Access-Control-Allow-Credentials` 为 `true` 时，`Access-Control-Allow-Origin` **必须是具体域名，不能是通配符**。

```javascript
// 正确配置：携带凭证时的 CORS
app.use((req, res, next) => {
  const origin = req.headers.origin

  // 必须是具体域名，不能是 *
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
  }

  next()
})

// 前端配置
fetch('https://api.example.com/data', {
  credentials: 'include'  // 携带 Cookie
})
```

**Cookie 跨域携带的三个条件：**

```javascript
// 1. 前端设置 credentials
fetch(url, { credentials: 'include' })

// 2. 服务端 CORS 允许凭证
res.header('Access-Control-Allow-Credentials', 'true')

// 3. Cookie 设置 SameSite 属性
res.cookie('sessionId', token, {
  sameSite: 'none',   // 允许跨域
  secure: true        // 必须配合 Secure (HTTPS)
})
```

### 2.3 预检请求的安全意义

**简单请求 vs 复杂请求：**

```
简单请求（直接发送）：
- 方法：GET、HEAD、POST
- Content-Type: application/x-www-form-urlencoded
              multipart/form-data
              text/plain

复杂请求（先发预检）：
- PUT、DELETE、PATCH 等方法
- Content-Type: application/json
- 自定义请求头（如 Authorization）
```

**预检请求 (OPTIONS) 流程：**

```
1. 浏览器自动发送 OPTIONS 请求
  OPTIONS /api/data HTTP/1.1
  Origin: https://example.com
  Access-Control-Request-Method: PUT
  Access-Control-Request-Headers: Content-Type, Authorization

2. 服务端返回是否允许
	HTTP/1.1 204 No Content
	Access-Control-Allow-Origin: https://example.com
	Access-Control-Allow-Methods: GET, POST, PUT, DELETE
	Access-Control-Allow-Headers: Content-Type, Authorization
	Access-Control-Max-Age: 86400

3. 允许后才发送实际请求
```

**安全配置预检请求：**

```javascript
app.options('*', (req, res) => {
  const origin = req.headers.origin

  if (!ALLOWED_ORIGINS.includes(origin)) {
    return res.sendStatus(403)
  }

  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Max-Age', '86400')  // 缓存预检结果 24 小时
  res.header('Access-Control-Allow-Credentials', 'true')

  res.sendStatus(204)
})
```

### 2.4 暴露响应头的安全风险

默认情况下，浏览器只能访问以下响应头：
- `Cache-Control`
- `Content-Language`
- `Content-Type`
- `Expires`
- `Last-Modified`
- `Pragma`

如需暴露自定义响应头：

```javascript
// 安全：只暴露必要的头
res.header('Access-Control-Expose-Headers', 'X-Total-Count, X-Request-ID')

// 危险：暴露敏感信息
res.header('Access-Control-Expose-Headers', 'X-Internal-Token, X-User-Data')
```

### 2.5 CORS 配置安全清单

```javascript
// 完整的安全 CORS 中间件
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []

    // 允许无 Origin 的请求（如移动端、服务器调用）
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('不允许的跨域请求'))
    }
  },
  credentials: true,           // 允许携带凭证
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400,               // 预检缓存时间
  optionsSuccessStatus: 204    // 兼容旧浏览器
}

app.use(cors(corsOptions))
```

---

## 三、跨域场景下的 XSS 防护

### 3.1 跨域请求与 XSS 的关系

**XSS（跨站脚本攻击）** 与跨域的关系：

| 场景 | 跨域影响 | 风险说明 |
|-----|---------|---------|
| 同站 XSS | 不涉及 | 同源策略不影响 |
| 跨域加载脚本 | 可加载任意域名脚本 | `<script src="https://evil.com/malicious.js">` |
| 跨域 fetch API | 受 CORS 限制 | 需要服务端允许才能读取响应 |
| 跨域 iframe | 受 CSP 限制 | 可通过 CSP frame-ancestors 控制 |

### 3.2 CSP 与 CORS 的协同防护

**CSP (Content Security Policy)** 是防御 XSS 的核心机制，与 CORS 协同工作：

```javascript
// CORS 配置：控制哪些域可以请求资源
res.header('Access-Control-Allow-Origin', 'https://trusted.com')

// CSP 配置：控制页面可以加载哪些资源
res.header('Content-Security-Policy', [
  "default-src 'self'",                    // 默认只允许同源
  "script-src 'self' https://cdn.trusted.com",  // 只允许指定 CDN
  "style-src 'self' 'unsafe-inline'",      // 样式限制
  "img-src 'self' data: https:",           // 图片限制
  "connect-src 'self' api.example.com",    // AJAX/fetch 目标限制
  "frame-ancestors 'none'",                // 禁止被 iframe 嵌入
  "form-action 'self'",                    // 表单提交限制
  "base-uri 'self'",                       // base 标签限制
  "require-trusted-types-for 'script'"     // 启用 Trusted Types
].join('; '))
```

**CSP 与 CORS 的区别：**

| 特性 | CSP | CORS |
|-----|-----|------|
| 作用 | 限制页面可加载哪些资源 | 限制哪些域可以请求 API |
| 防护对象 | XSS 攻击 | 跨域请求滥用 |
| 配置位置 | 页面的响应头或 meta 标签 | API 的响应头 |
| 检查时机 | 资源加载时检查 | 跨域请求时检查 |

### 3.3 HttpOnly Cookie 在跨域中的作用

**问题场景：**

```
1. 用户在 bank.com 登录，获得 HttpOnly Cookie
2. evil.com 存在 XSS 漏洞
3. 攻击者注入脚本窃取 Cookie

但！HttpOnly Cookie 无法被 document.cookie 读取
攻击者无法直接获取 Session ID
```

**跨域场景下的 Cookie 安全配置：**

```javascript
// 安全配置：敏感 Cookie
res.cookie('sessionId', token, {
  httpOnly: true,        // XSS 无法读取
  secure: true,          // 仅 HTTPS 传输
  sameSite: 'strict',    // 防止 CSRF
  path: '/',
  maxAge: 24 * 60 * 60 * 1000
})

// 非敏感配置：普通数据
res.cookie('preferences', JSON.stringify prefs), {
  // httpOnly: false,   // 可被 JS 读取
  sameSite: 'lax',
  secure: true
})
```

**Cookie 属性与安全威胁矩阵：**

| 威胁类型 | HttpOnly 防护 | Secure 防护 | SameSite 防护 |
|---------|--------------|------------|--------------|
| XSS 窃取 Cookie | ✅ 有效 | ❌ 无效 | ❌ 无效 |
| 中间人攻击 | ❌ 无效 | ✅ 有效 | ❌ 无效 |
| CSRF 攻击 | ❌ 无效 | ❌ 无效 | ✅ 有效 |

### 3.4 跨域资源加载的安全策略

**script 标签跨域加载：**

```html
<!-- 危险：加载任意第三方脚本 -->
<script src="https://untrusted-cdn.com/library.js"></script>

<!-- 安全：使用 Subresource Integrity (SRI) -->
<script src="https://cdn.trusted.com/library.js"
        integrity="sha384-abc123..."
        crossorigin="anonymous"></script>
```

**fetch 跨域请求防护：**

```javascript
// 安全：检查响应来源
async function safeFetch(url) {
  const response = await fetch(url, {
    credentials: 'include'
  })

  // 验证响应是否来自期望的源
  const responseOrigin = new URL(response.url).origin
  if (responseOrigin !== 'https://api.example.com') {
    throw new Error('响应来源异常')
  }

  return response.json()
}
```

---

## 四、跨域场景下的 CSRF 防护

### 4.1 跨域自动携带 Cookie 的机制与风险

**CSRF（跨站请求伪造）** 攻击利用了浏览器自动携带 Cookie 的机制：

```
用户在 bank.com 登录 → 浏览器保存 bank.com 的 Cookie

用户访问 evil.com → evil.com 页面向 bank.com 发起请求
                    ↓
         浏览器自动携带 bank.com 的 Cookie
                    ↓
         bank.com 认为请求来自用户本人
                    ↓
         恶意操作成功执行
```

**关键点：** CORS 的 `Access-Control-Allow-Credentials: true` 会**加剧** CSRF 风险，因为跨域请求可以携带并读取响应。

### 4.2 SameSite 属性：CORS 场景最佳防线

**SameSite** 是 Cookie 的属性，控制跨站请求时是否发送 Cookie。

```javascript
// Strict 模式：最严格
res.cookie('sessionId', token, {
  sameSite: 'strict'  // 任何跨站请求都不发送 Cookie
})

// Lax 模式：推荐（默认）
res.cookie('sessionId', token, {
  sameSite: 'lax'  // 只允许顶级导航 GET 请求携带 Cookie
})

// None 模式：允许跨域（需配合 Secure）
res.cookie('sessionId', token, {
  sameSite: 'none',  // 允许所有跨站请求
  secure: true       // 必须是 HTTPS
})
```

**SameSite 行为对比：**

| 请求类型 | Strict | Lax (默认) | None |
|---------|--------|-----------|------|
| 同站请求 | ✅ 发送 | ✅ 发送 | ✅ 发送 |
| 跨站链接 | ❌ 不发送 | ✅ 发送 | ✅ 发送 |
| 跨站表单 GET | ❌ 不发送 | ✅ 发送 | ✅ 发送 |
| 跨站表单 POST | ❌ 不发送 | ❌ 不发送 | ✅ 发送 |
| 跨站 AJAX/fetch | ❌ 不发送 | ❌ 不发送 | ✅ 发送 |
| 跨站 iframe | ❌ 不发送 | ❌ 不发送 | ✅ 发送 |

### 4.3 CSRF Token 在跨域中的实现

**传统 CSRF Token（同源表单）：**

```javascript
// 1. 服务端生成 Token
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex')
}

// 2. 存储到 Session
req.session.csrfToken = generateCSRFToken()

// 3. 表单中注入 Token
<form method="POST" action="/transfer">
  <input type="hidden" name="csrf_token" value="<%= csrfToken %>">
  <input name="to" placeholder="收款人">
  <button type="submit">转账</button>
</form>

// 4. 验证 Token
app.post('/transfer', (req, res) => {
  if (req.body.csrf_token !== req.session.csrfToken) {
    return res.status(403).send('CSRF Token 验证失败')
  }
  // 处理业务...
})
```

**跨域场景下的 CSRF Token：**

```javascript
// 1. 通过安全的方式获取 Token
app.get('/api/csrf-token', (req, res) => {
  const token = generateCSRFToken()
  req.session.csrfToken = token

  // 方式一：通过 Cookie 返回（不能 HttpOnly）
  res.cookie('XSRF-TOKEN', token, {
    sameSite: 'strict',
    // httpOnly: false  // 前端需要读取
  })

  // 方式二：通过响应头返回
  res.header('X-CSRF-Token', token)
  res.json({ csrfToken: token })
})

// 2. 前端在请求头中携带 Token
axios.interceptors.request.use(config => {
  // 从 Cookie 读取
  const csrfToken = getCookie('XSRF-TOKEN')

  // 或从 meta 标签读取
  // const csrfToken = document.querySelector('meta[name="csrf-token"]').content

  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})

// 3. 服务端验证
app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const headerToken = req.headers['x-csrf-token']
    const sessionToken = req.session.csrfToken

    if (!headerToken || headerToken !== sessionToken) {
      return res.status(403).json({ error: 'CSRF 验证失败' })
    }
  }
  next()
})
```

### 4.4 Origin/Referer 验证的重要性

**验证请求来源是防御 CSRF 的有效手段：**

```javascript
function validateOrigin(req) {
  const origin = req.headers.origin
  const referer = req.headers.referer

  // Origin 优先（更可靠）
  if (origin) {
    const allowedOrigins = ['https://example.com', 'https://www.example.com']
    return allowedOrigins.includes(origin)
  }

  // Referer 作为备选
  if (referer) {
    return referer.startsWith('https://example.com')
  }

  // 都没有则拒绝
  return false
}

// 在敏感操作中使用
app.post('/api/transfer', (req, res, next) => {
  if (!validateOrigin(req)) {
    return res.status(403).json({ error: '非法请求来源' })
  }
  next()
})
```

**Origin vs Referer：**

| 特性 | Origin | Referer |
|-----|--------|---------|
| 是否包含路径 | ❌ 只包含协议+域名+端口 | ✅ 包含完整路径 |
| 跨域发送 | ✅ 总是发送 | ❌ 可能被阻止 |
| 隐私性 | ✅ 不暴露具体页面 | ❌ 暴露访问路径 |
| 可伪造 | ❌ 浏览器保护 | ❌ 浏览器保护 |

---

## 五、跨域方案安全对比

### 5.1 CORS vs JSONP

| 特性 | CORS | JSONP |
|-----|------|-------|
| 支持的方法 | 所有 HTTP 方法 | 仅 GET |
| 安全性 | 高（服务端控制） | 低（任意脚本可调用） |
| 错误处理 | 标准 HTTP 状态码 | 困难（脚本加载失败） |
| 浏览器支持 | 现代浏览器全支持 | 已过时 |
| 推荐度 | ✅ 推荐 | ❌ 不推荐 |

**JSONP 安全问题：**

```javascript
// JSONP 实现原理（不安全）
function handleResponse(data) {
  console.log(data)
}

// 任何网站都可以调用这个 API
<script src="https://api.example.com/data?callback=handleResponse"></script>

// 服务端返回（可被恶意利用）
handleResponse({ secret: "sensitive data" })
```

### 5.2 CORS vs 代理服务器

**代理服务器方案：**

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://backend-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

**安全对比：**

| 特性 | CORS | 代理服务器 |
|-----|------|-----------|
| 部署复杂度 | 简单（服务端配置） | 需要额外代理层 |
| 安全性 | 高（浏览器级控制） | 取决于代理配置 |
| 适用场景 | 前后端完全分离 | 开发环境、同源部署 |
| 性能 | 有预检开销 | 额外转发开销 |

### 5.3 各方案适用场景与安全等级

```
┌─────────────────────────────────────────────────────────────┐
│                     跨域方案选择指南                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  开发环境                                                    │
│  ├── 前端开发 → 代理服务器 (vite/webpack proxy)              │
│  └── 测试调试 → CORS + 允许本地域名                          │
│                                                             │
│  生产环境                                                    │
│  ├── 前后端同域 → 无需跨域方案                               │
│  ├── 前后端分离 → CORS + 白名单                             │
│  ├── 多个子域名 → CORS + 二级域名共享 Cookie                 │
│  └── 第三方 API → JSONP (仅限遗留系统)                       │
│                                                             │
│  高安全要求                                                 │
│  ├── 金融支付 → SameSite=Strict + CSRF Token                │
│  ├── 用户数据 → CORS + HttpOnly + CSP                       │
│  └── 公共 API → CORS（无凭证）+ API Key + 限流              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 六、安全配置最佳实践

### 6.1 统一的安全检查清单

#### CORS 配置检查

- [ ] 使用白名单而非 `*` 通配符
- [ ] `Access-Control-Allow-Credentials: true` 时使用具体域名
- [ ] 设置 `Access-Control-Max-Age` 减少预检请求
- [ ] 正确处理 OPTIONS 预检请求
- [ ] 添加 `Vary: Origin` 防止缓存污染
- [ ] 只暴露必要的响应头 (`Access-Control-Expose-Headers`)

#### Cookie 安全检查

- [ ] 敏感 Cookie 设置 `httpOnly: true`
- [ ] 生产环境设置 `secure: true`
- [ ] 根据场景选择 `sameSite` 属性
- [ ] 设置适当的 `maxAge` 或 `expires`
- [ ] 敏感操作不依赖 Cookie 自动携带

#### XSS 防护检查

- [ ] 所有用户输出进行转义
- [ ] 使用 `textContent` 而非 `innerHTML`
- [ ] 实施 CSP 策略
- [ ] 使用 SRI 验证第三方脚本
- [ ] 启用 Trusted Types（如果支持）

#### CSRF 防护检查

- [ ] 状态变更操作使用 CSRF Token
- [ ] 设置 Cookie 的 `sameSite` 属性
- [ ] 验证请求的 `Origin`/`Referer`
- [ ] 重要操作二次确认（密码/验证码）

### 6.2 安全 HTTP 响应头配置

```javascript
// 使用 helmet 中间件（推荐）
const helmet = require('helmet')
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.trusted.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

// 或手动设置
app.use((req, res, next) => {
  // 防止点击劫持
  res.setHeader('X-Frame-Options', 'DENY')

  // 防止 MIME 类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // 启用浏览器 XSS 过滤
  res.setHeader('X-XSS-Protection', '1; mode=block')

  // 限制引用来源
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // 权限策略
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  next()
})
```

### 6.3 面试常问问题

**Q: 跨域是安全问题吗？**

A: 跨域不是安全问题，它是浏览器的同源策略保护。CORS 是用来安全地放松这个限制的机制。错误配置 CORS 才会引入安全问题。

**Q: 为什么 `Access-Control-Allow-Origin: *` 不能和 `Credentials: true` 一起使用？**

A: 因为这样配置会导致任何网站都能携带用户的凭证向你的 API 发起请求，并在收到响应后读取敏感数据，这是严重的安全隐患。

**Q: SameSite=none 有什么风险？**

A: `SameSite=none` 允许所有跨站请求携带 Cookie，这会降低对 CSRF 的防护。使用时必须配合 `Secure`（HTTPS），并确保有其他 CSRF 防护措施（如 CSRF Token）。

**Q: Cookie 的 `httpOnly`、`secure`、`sameSite` 各防什么？**

A:
- `httpOnly`: 防止 JavaScript 读取 Cookie，防御 XSS
- `secure`: 只在 HTTPS 下传输，防止中间人攻击
- `sameSite`: 防止跨站请求发送 Cookie，防御 CSRF

**Q: 前端 Token 应该存在哪里？**

A:
| 存储位置 | 防御 XSS | 防御 CSRF | 推荐度 |
|---------|---------|----------|--------|
| LocalStorage | ❌ | ✅ | 不推荐 |
| Cookie (HttpOnly) | ✅ | ❌ | 推荐（配合 SameSite） |
| Memory | ✅ | ✅ | 适合 SPA |

**Q: 如何在跨域场景防御 CSRF？**

A: 多层防护：
1. 设置 `SameSite=strict` 或 `SameSite=lax`
2. 使用 CSRF Token
3. 验证 `Origin`/`Referer` 头
4. 重要操作二次确认

**Q: CSP frame-ancestors 和 X-Frame-Options 的区别？**

A: 两者都用于防止点击劫持，但 CSP 更强大：
- `X-Frame-Options`: 只能设置 `DENY` 或 `SAMEORIGIN`
- `frame-ancestors`: 可以指定多个允许的域名

**Q: 简单请求和复杂请求的区别？**

A:
- **简单请求**：GET/HEAD/POST，Content-Type 为 `application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain`，直接发送
- **复杂请求**：其他方法、`application/json`、自定义头，先发 OPTIONS 预检请求

---

## 七、示例代码

### 文件夹结构

```
examples/
├── package.json          # 项目依赖配置
├── cors-demo.js          # 跨域 (CORS) 演示
├── xss-demo.html         # XSS 攻击交互演示
├── xss-defense.js        # XSS 防御工具函数
├── csrf-demo.js          # CSRF 攻击与防御演示
└── httponly-demo.js      # HttpOnly Cookie 演示
```

### 1. package.json

```json
{
  "name": "web-security-examples",
  "version": "1.0.0",
  "description": "Web 安全示例：跨域、XSS 攻击、CSRF 攻击演示与防御",
  "scripts": {
    "cors": "node cors-demo.js",
    "csrf": "node csrf-demo.js",
    "defense": "node xss-defense.js",
    "httponly": "node httponly-demo.js"
  },
  "dependencies": {
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "helmet": "^7.1.0"
  }
}
```

### 2. cors-demo.js - 安全的 CORS 配置演示

```javascript
/**
 * 安全的 CORS 配置演示
 *
 * 运行方式：
 * 1. npm install express cors
 * 2. node cors-demo.js
 * 3. 访问 http://localhost:3000
 */

const express = require('express')
const cors = require('cors')

const app = express()

// ============================================
// 安全的 CORS 白名单配置
// ============================================

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://example.com',
  'https://www.example.com'
]

const corsOptions = {
  origin: function (origin, callback) {
    // 允许无 Origin 的请求（服务器调用、移动端等）
    if (!origin) return callback(null, true)

    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log('被阻止的跨域请求:', origin)
      callback(new Error('不允许的跨域请求'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-Total-Count', 'X-Request-ID'],
  maxAge: 86400,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// ============================================
// API 路由
// ============================================

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>CORS 安全测试</title></head>
    <body>
      <h1>CORS 跨域安全测试</h1>
      <button onclick="testSimpleRequest()">简单请求 (GET)</button>
      <button onclick="testComplexRequest()">复杂请求 (PUT + JSON)</button>
      <button onclick="testWithCredentials()">携带凭证请求</button>
      <pre id="output"></pre>
      <script>
        const output = document.getElementById('output');

        async function testSimpleRequest() {
          output.textContent = '发送简单请求...';
          const res = await fetch('/api/data');
          const data = await res.json();
          output.textContent = JSON.stringify(data, null, 2);
        }

        async function testComplexRequest() {
          output.textContent = '发送复杂请求（会先触发 OPTIONS 预检）...';
          const res = await fetch('/api/data', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'test' })
          });
          const data = await res.json();
          output.textContent = JSON.stringify(data, null, 2);
        }

        async function testWithCredentials() {
          output.textContent = '发送携带凭证的请求...';
          const res = await fetch('/api/protected', {
            credentials: 'include'
          });
          const data = await res.json();
          output.textContent = JSON.stringify(data, null, 2);
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/api/data', (req, res) => {
  res.json({
    message: 'GET 请求成功',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

app.put('/api/data', (req, res) => {
  res.json({
    message: 'PUT 请求成功',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/protected', (req, res) => {
  res.json({
    message: '受保护的资源',
    hasCookie: !!req.headers.cookie
  });
});

app.listen(3000, () => console.log('CORS 演示服务器运行在 http://localhost:3000'));
```

### 3. xss-defense.js - XSS 防御工具

```javascript
/**
 * XSS 防御工具函数
 */

// HTML 转义
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;")
}

// JavaScript 转义
function escapeJs(unsafe) {
  if (typeof unsafe !== 'string') return unsafe
  return unsafe
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
}

// URL 转义
function escapeUrl(unsafe) {
  return encodeURIComponent(unsafe)
}

// 安全 Cookie 选项
function getSecureCookieOptions(options = {}) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
    ...options
  }
}

// CSP Header 生成器
function generateCSP(options = {}) {
  const {
    defaultSrc = ["'self'"],
    scriptSrc = ["'self'"],
    styleSrc = ["'self'", "'unsafe-inline'"],
    imgSrc = ["'self'", "data:", "https:"],
    connectSrc = ["'self'"],
  } = options

  return [
    `default-src ${defaultSrc.join(' ')}`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    `img-src ${imgSrc.join(' ')}`,
    `connect-src ${connectSrc.join(' ')}`,
    `frame-ancestors 'none'`,
    `form-action 'self'`
  ].join('; ')
}

// 安全响应头
function getSecurityHeaders() {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': generateCSP()
  }
}

module.exports = {
  escapeHtml,
  escapeJs,
  escapeUrl,
  getSecureCookieOptions,
  getSecurityHeaders,
  generateCSP
}
```

### 4. csrf-demo.js - CSRF 攻击与防御演示

```javascript
/**
 * CSRF 攻击与防御演示
 *
 * 运行方式：
 * 1. npm install express express-session cookie-parser
 * 2. node csrf-demo.js
 */

const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}))

// 模拟数据库
const db = {
  users: [
    { id: 1, username: 'alice', balance: 10000 }
  ],
  transfers: []
}

// 生成 CSRF Token
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex')
}

// CSRF 验证中间件
function csrfProtection(req, res, next) {
  if (req.method === 'GET') {
    if (!req.session.csrfToken) {
      req.session.csrfToken = generateCSRFToken()
    }
    return next()
  }

  const token = req.body.csrf_token || req.headers['x-csrf-token']
  const sessionToken = req.session.csrfToken

  if (!token || token !== sessionToken) {
    return res.status(403).send('CSRF Token 验证失败')
  }

  req.session.csrfToken = generateCSRFToken()
  next()
}

// 主页
app.get('/', (req, res) => {
  const user = req.session.user
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>CSRF 演示</title></head>
    <body>
      <h1>CSRF 攻击与防御演示</h1>
      ${user ? `<p>已登录: ${user.username}, 余额: ¥${user.balance}</p>` : '<p>请先登录</p>'}

      ${!user ? `
        <form method="POST" action="/login">
          <input name="username" value="alice" required>
          <input name="password" value="123456" required>
          <button type="submit">登录</button>
        </form>
      ` : `
        <h3>无保护的转账 (存在 CSRF 漏洞)</h3>
        <form method="POST" action="/transfer/vulnerable">
          <input name="to" value="attacker">
          <input name="amount" value="100">
          <button type="submit">转账 (无保护)</button>
        </form>

        <h3>受保护的转账 (CSRF Token)</h3>
        <form method="POST" action="/transfer/protected">
          <input type="hidden" name="csrf_token" value="${req.session.csrfToken || ''}">
          <input name="to" placeholder="收款人">
          <input name="amount" placeholder="金额">
          <button type="submit">转账 (受保护)</button>
        </form>

        <a href="/logout">退出登录</a>
      `}
    </body>
    </html>
  `)
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username === 'alice' && password === '123456') {
    req.session.user = db.users[0]
    req.session.csrfToken = generateCSRFToken()
    res.redirect('/')
  } else {
    res.send('登录失败')
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

app.post('/transfer/vulnerable', (req, res) => {
  const user = req.session.user
  if (!user) return res.status(401).send('请先登录')
  const { to, amount } = req.body
  user.balance -= parseInt(amount)
  res.send(`<p>向 ${to} 转账 ¥${amount} 成功！余额: ¥${user.balance}</p>`)
})

app.post('/transfer/protected', csrfProtection, (req, res) => {
  const user = req.session.user
  if (!user) return res.status(401).send('请先登录')
  const { to, amount } = req.body
  user.balance -= parseInt(amount)
  res.send(`<p>向 ${to} 转账 ¥${amount} 成功！余额: ¥${user.balance}</p>`)
})

app.listen(3000, () => console.log('CSRF 演示服务器运行在 http://localhost:3000'))
```

### 5. httponly-demo.js - HttpOnly Cookie 演示

```javascript
/**
 * HttpOnly Cookie 安全演示
 *
 * 运行方式：
 * 1. npm install express cookie-parser
 * 2. node httponly-demo.js
 */

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

const users = [
  { id: 1, username: 'alice', password: '123456' }
]

const sessions = new Map()

app.use((req, res, next) => {
  const sessionId = req.cookies.session_id
  if (sessionId && sessions.has(sessionId)) {
    req.user = users.find(u => u.id === sessions.get(sessionId).userId)
  }
  next()
})

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>HttpOnly Cookie 演示</title></head>
    <body>
      <h1>HttpOnly Cookie 安全演示</h1>
      ${req.user ? `<p>已登录: ${req.user.username}</p>` : '<p>请先登录</p>'}

      ${!req.user ? `
        <form method="POST" action="/login">
          <input name="username" value="alice" required>
          <input name="password" value="123456" required>
          <button type="submit">登录</button>
        </form>
      ` : `
        <h3>JavaScript 读取 Cookie 测试</h3>
        <button onclick="readCookie()">读取 Cookie</button>
        <pre id="cookie-result"></pre>
        <p><strong>注意：</strong>session_id 不会显示，因为它设置了 HttpOnly</p>
        <a href="/logout">退出登录</a>
      `}
      <script>
        function readCookie() {
          const cookies = document.cookie;
          document.getElementById('cookie-result').textContent =
            cookies || '(空)';
        }
      </script>
    </body>
    </html>
  `)
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) return res.send('登录失败')

  const sessionId = Buffer.from(`${user.id}-${Date.now()}`).toString('base64')
  sessions.set(sessionId, { userId: user.id, createdAt: Date.now() })

  // HttpOnly Cookie - JS 无法读取
  res.cookie('session_id', sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  })

  res.redirect('/')
})

app.get('/logout', (req, res) => {
  res.clearCookie('session_id')
  res.redirect('/')
})

app.listen(3002, () => console.log('HttpOnly 演示服务器运行在 http://localhost:3002'))
```

### 运行方式

```bash
cd examples
npm install

# 运行各个演示
npm run cors      # http://localhost:3000
npm run csrf      # http://localhost:3000
npm run httponly  # http://localhost:3002
```

---

> 💡 **提示**：安全是持续的过程，不是一次性配置。在解决跨域问题时，始终将安全放在首位！
