/**
 * HttpOnly Cookie 演示
 *
 * 演示 HttpOnly Cookie 如何防止 XSS 攻击窃取 Session ID
 *
 * 运行方式：
 * 1. npm install express cookie-parser
 * 2. node httponly-demo.js
 * 3. 访问 http://localhost:3002
 */

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// ============================================
// 模拟用户数据库
// ============================================
const users = [
  { id: 1, username: 'alice', password: '123456' },
  { id: 2, username: 'bob', password: '123456' }
]

// 模拟 Session 存储
const sessions = new Map()

// ============================================
// 中间件：Session 管理
// ============================================
app.use((req, res, next) => {
  const sessionId = req.cookies.session_id
  if (sessionId && sessions.has(sessionId)) {
    req.user = users.find(u => u.id === sessions.get(sessionId).userId)
  }
  next()
})

// ============================================
// 主页
// ============================================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HttpOnly Cookie 演示</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        h1 { color: #333; border-bottom: 3px solid #2196F3; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; font-size: 18px; }
        .section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .alert {
          padding: 12px 20px;
          border-radius: 5px;
          margin: 10px 0;
        }
        .alert-info { background: #e3f2fd; color: #1565c0; border-left: 4px solid #2196F3; }
        .alert-warning { background: #fff3cd; color: #856404; border-left: 4px solid #ffc107; }
        .alert-danger { background: #ffebee; color: #c62828; border-left: 4px solid #f44336; }
        .alert-success { background: #e8f5e9; color: #2e7d32; border-left: 4px solid #4CAF50; }
        .box {
          border: 2px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
        }
        .vulnerable { border-color: #f44336; background: #ffebee; }
        .protected { border-color: #4CAF50; background: #e8f5e9; }
        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin: 5px 0;
        }
        button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin: 5px 5px 5px 0;
        }
        .btn-primary { background: #2196F3; color: white; }
        .btn-danger { background: #f44336; color: white; }
        .btn-success { background: #4CAF50; color: white; }
        button:hover { opacity: 0.9; }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }
        .badge-danger { background: #f44336; }
        .badge-success { background: #4CAF50; }
        .code {
          background: #263238;
          color: #aed581;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
          font-family: 'Consolas', monospace;
          font-size: 13px;
          line-height: 1.5;
        }
        .comment { color: #78909c; }
        .string { color: #ffca28; }
        .keyword { color: #82b1ff; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; }
        .cookie-display {
          font-family: 'Consolas', monospace;
          font-size: 12px;
          word-break: break-all;
        }
        .tabs { display: flex; border-bottom: 2px solid #ddd; margin-bottom: 15px; }
        .tab {
          padding: 10px 20px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
        }
        .tab.active { border-bottom-color: #2196F3; color: #2196F3; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
      </style>
    </head>
    <body>
      <h1>HttpOnly Cookie 安全演示</h1>

      ${req.user ? `
        <div class="alert alert-success">
          <strong>已登录:</strong> ${req.user.username}
          <span style="margin: 0 15px;">|</span>
          <a href="/logout" style="color: #2e7d32;">退出登录</a>
        </div>
      ` : ''}

      <!-- ============================================ -->
      <!-- 什么是 HttpOnly -->
      <!-- ============================================ -->
      <div class="section">
        <h2>1. 什么是 HttpOnly Cookie？</h2>

        <div class="alert alert-info">
          <strong>HttpOnly</strong> 是 Cookie 的一个安全属性。设置为 <code>true</code> 后，
          JavaScript 无法通过 <code>document.cookie</code> 读取该 Cookie，
          从而有效防止 XSS 攻击窃取 Session ID。
        </div>

        <table>
          <thead>
            <tr>
              <th>特性</th>
              <th>说明</th>
              <th>防御目标</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>httpOnly</code></td>
              <td>禁止 JavaScript 读取 Cookie</td>
              <td>XSS 攻击</td>
            </tr>
            <tr>
              <td><code>secure</code></td>
              <td>只在 HTTPS 连接下传输</td>
              <td>中间人攻击</td>
            </tr>
            <tr>
              <td><code>sameSite</code></td>
              <td>阻止跨站请求发送 Cookie</td>
              <td>CSRF 攻击</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ============================================ -->
      <!-- 演示对比 -->
      <!-- ============================================ -->
      <div class="section">
        <h2>2. HttpOnly 效果对比演示</h2>

        <div class="tabs">
          <div class="tab active" onclick="showTab('demo', 'login')">登录设置</div>
          <div class="tab" onclick="showTab('demo', 'read')">读取 Cookie</div>
          <div class="tab" onclick="showTab('demo', 'xss')">XSS 攻击模拟</div>
          <div class="tab" onclick="showTab('demo', 'code')">代码示例</div>
        </div>

        <!-- 登录设置 -->
        <div id="demo-login" class="tab-content active">
          <div class="box protected">
            <span class="badge badge-success">安全登录</span>
            <h3>登录时设置 HttpOnly Cookie</h3>
            <p>点击登录后，服务端会设置带有 HttpOnly 属性的 Session Cookie。</p>

            ${!req.user ? `
              <form method="POST" action="/login">
                <input type="text" name="username" placeholder="用户名 (alice)" value="alice" required>
                <input type="password" name="password" placeholder="密码 (123456)" value="123456" required>
                <button type="submit" class="btn-primary">登录</button>
              </form>
            ` : '<p class="alert alert-success">您已登录！Session Cookie 已设置。</p>'}
          </div>
        </div>

        <!-- 读取 Cookie -->
        <div id="demo-read" class="tab-content">
          <div class="box">
            <h3>JavaScript 读取 Cookie 测试</h3>
            <p>点击下方按钮，尝试用 <code>document.cookie</code> 读取所有 Cookie：</p>
            <button class="btn-primary" onclick="readCookie()">读取 Cookie</button>
            <button class="btn-danger" onclick="readWithDevTools()">查看所有 Cookie (含 HttpOnly)</button>

            <div id="cookie-result" style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px; display: none;">
              <h4>JavaScript 可见的 Cookie:</h4>
              <pre class="cookie-display" id="visible-cookies"></pre>
              <hr style="margin: 10px 0;">
              <h4>说明:</h4>
              <p id="cookie-explanation"></p>
            </div>
          </div>

          <div class="alert alert-warning">
            <strong>注意：</strong>HttpOnly Cookie 不会出现在 <code>document.cookie</code> 中，
            但仍然会自动发送到服务端。你可以通过浏览器开发者工具的 Application → Cookies 查看。
          </div>
        </div>

        <!-- XSS 攻击模拟 -->
        <div id="demo-xss" class="tab-content">
          <div class="box vulnerable">
            <span class="badge badge-danger">XSS 攻击模拟</span>
            <h3>模拟 XSS 攻击窃取 Cookie</h3>
            <p>假设存在 XSS 漏洞，攻击者注入恶意代码尝试窃取 Cookie：</p>

            <button class="btn-danger" onclick="simulateXssAttack()">模拟 XSS 攻击</button>

            <div id="xss-result" style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px; display: none;">
              <h4>攻击者获取到的 Cookie:</h4>
              <pre class="cookie-display" id="stolen-cookies"></pre>
              <hr style="margin: 10px 0;">
              <h4>分析:</h4>
              <p id="xss-analysis"></p>
            </div>
          </div>

          <div class="alert alert-success">
            <strong>HttpOnly 的保护作用：</strong>即使 XSS 攻击成功执行，
            攻击者也无法窃取标记为 HttpOnly 的 Session Cookie！
            但注意：攻击者仍然可以在用户浏览器中执行其他恶意操作。
          </div>
        </div>

        <!-- 代码示例 -->
        <div id="demo-code" class="tab-content">
          <div class="code">
<span class="comment">// 设置 HttpOnly Cookie (Express 示例)</span>
res.cookie(<span class="string">'session_id'</span>, sessionId, {
  <span class="keyword">httpOnly</span>: <span class="keyword">true</span>,    <span class="comment">// JS 无法读取</span>
  <span class="keyword">secure</span>: <span class="keyword">true</span>,      <span class="comment">// 仅 HTTPS</span>
  <span class="keyword">sameSite</span>: <span class="string">'strict'</span>,  <span class="comment">// 防止 CSRF</span>
  <span class="keyword">maxAge</span>: <span class="string">24 * 60 * 60 * 1000</span>  <span class="comment">// 24小时</span>
})

<span class="comment">// 攻击者尝试用 JS 读取</span>
<span class="keyword">const</span> cookies = document.cookie
<span class="comment">// 结果: session_id 不会出现在这里！</span>

<span class="comment">// 但 Cookie 仍会自动发送到服务端</span>
fetch(<span class="string">'/api/data'</span>, {
  credentials: <span class="string">'include'</span>  <span class="comment">// 自动带上 HttpOnly Cookie</span>
})
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- Cookie 属性详解 -->
      <!-- ============================================ -->
      <div class="section">
        <h2>3. Cookie 安全属性详解</h2>

        <table>
          <thead>
            <tr>
              <th>属性</th>
              <th>类型</th>
              <th>说明</th>
              <th>推荐值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>httpOnly</code></td>
              <td>Boolean</td>
              <td>禁止 JavaScript 访问</td>
              <td><code>true</code> (敏感 Cookie)</td>
            </tr>
            <tr>
              <td><code>secure</code></td>
              <td>Boolean</td>
              <td>仅 HTTPS 传输</td>
              <td><code>true</code> (生产环境)</td>
            </tr>
            <tr>
              <td><code>sameSite</code></td>
              <td>String</td>
              <td>跨站请求控制</td>
              <td><code>'strict'</code> 或 <code>'lax'</code></td>
            </tr>
            <tr>
              <td><code>domain</code></td>
              <td>String</td>
              <td>Cookie 有效域</td>
              <td>不设置或当前域</td>
            </tr>
            <tr>
              <td><code>path</code></td>
              <td>String</td>
              <td>Cookie 有效路径</td>
              <td><code>'/'</code></td>
            </tr>
            <tr>
              <td><code>maxAge</code></td>
              <td>Number</td>
              <td>存活时间(毫秒)</td>
              <td>根据业务设置</td>
            </tr>
            <tr>
              <td><code>expires</code></td>
              <td>Date</td>
              <td>过期时间</td>
              <td>或使用 maxAge</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ============================================ -->
      <!-- HttpOnly 的局限性 -->
      <!-- ============================================ -->
      <div class="section">
        <h2>4. HttpOnly 的局限性</h2>

        <div class="alert alert-warning">
          <strong>重要：</strong>HttpOnly 不能完全防御 XSS 攻击！
        </div>

        <p>HttpOnly 只能防止 Cookie 被窃取，但 XSS 攻击仍可：</p>
        <ul>
          <li>篡改网页内容，显示虚假信息</li>
          <li>重定向到钓鱼网站</li>
          <li>监听用户键盘输入（窃取密码）</li>
          <li>执行恶意操作（如发送已认证的请求）</li>
          <li>窃取敏感的页面数据</li>
        </ul>

        <p><strong>结论：</strong>HttpOnly 是多层防御中的一层，需要配合 CSP、输出转义、输入验证等措施。</p>
      </div>

      <!-- ============================================ -->
      <!-- 面试题 -->
      <!-- ============================================ -->
      <div class="section">
        <h2>5. 常见面试题</h2>

        <div class="box">
          <p><strong>Q: 什么是 HttpOnly Cookie？</strong></p>
          <p>A: HttpOnly 是 Cookie 的安全属性，设为 true 后 JS 无法通过 document.cookie 读取，用于防止 XSS 窃取 Session ID。</p>

          <hr style="margin: 15px 0;">

          <p><strong>Q: HttpOnly 能完全防御 XSS 吗？</strong></p>
          <p>A: 不能。HttpOnly 只防止 Cookie 被窃取，XSS 仍可执行其他恶意操作，需要配合 CSP、输出转义等综合防御。</p>

          <hr style="margin: 15px 0;">

          <p><strong>Q: httpOnly、secure、sameSite 的区别？</strong></p>
          <p>A: httpOnly 防 XSS，secure 防 MITM，sameSite 防 CSRF。</p>

          <hr style="margin: 15px 0;">

          <p><strong>Q: 如何查看 HttpOnly Cookie？</strong></p>
          <p>A: 浏览器开发者工具 Application → Cookies，或 F12 → Network → 请求头中的 Cookie。</p>
        </div>
      </div>

      <script>
        function showTab(section, tab) {
          document.querySelectorAll('[id^="' + section + '-"]').forEach(el => {
            el.classList.remove('active');
          });
          document.getElementById(section + '-' + tab).classList.add('active');

          const tabs = event.target.parentElement.querySelectorAll('.tab');
          tabs.forEach(t => t.classList.remove('active'));
          event.target.classList.add('active');
        }

        function readCookie() {
          const cookies = document.cookie;
          const resultDiv = document.getElementById('cookie-result');
          const visibleCookies = document.getElementById('visible-cookies');
          const explanation = document.getElementById('cookie-explanation');

          resultDiv.style.display = 'block';
          visibleCookies.textContent = cookies || '(无可见 Cookie)';

          if (cookies.includes('user_info')) {
            explanation.innerHTML = '<span class="badge badge-success">可以看到</span> <code>user_info</code> Cookie（没有 httpOnly）';
          } else if (cookies === '') {
            explanation.innerHTML = '<span class="badge badge-success">安全！</span> JavaScript 无法读取任何敏感 Cookie。<br><small>Session ID 存在，但标记为 HttpOnly，所以 JS 读不到。</small>';
          } else {
            explanation.textContent = '可以看到这些 Cookie，但看不到 HttpOnly 的 Session Cookie。';
          }
        }

        function readWithDevTools() {
          alert('请按 F12 打开开发者工具，然后:\n\n1. 切换到 Application / 应用 标签\n2. 左侧找到 Cookies\n3. 点击当前域名\n\n你会看到所有 Cookie，包括 HttpOnly 的！');
        }

        function simulateXssAttack() {
          const cookies = document.cookie;
          const resultDiv = document.getElementById('xss-result');
          const stolenCookies = document.getElementById('stolen-cookies');
          const analysis = document.getElementById('xss-analysis');

          resultDiv.style.display = 'block';

          if (cookies) {
            stolenCookies.textContent = cookies;
            analysis.innerHTML = '<span class="badge badge-success">部分保护</span> 攻击者只能获取非 HttpOnly 的 Cookie。<br>Session ID 仍然是安全的！';
          } else {
            stolenCookies.textContent = '(空)';
            analysis.innerHTML = '<span class="badge badge-success">完全保护！</span> 攻击者无法窃取任何 Cookie。<br>所有敏感 Cookie 都设置了 HttpOnly 属性。';
          }

          // 模拟发送到攻击者服务器
          console.log('[模拟] 攻击者获取到的 Cookie:', cookies);
          console.log('[模拟] 发送到: https://evil.com/steal?cookie=' + encodeURIComponent(cookies));
        }
      </script>
    </body>
    </html>
  `);
})

// ============================================
// 登录
// ============================================
app.post('/login', (req, res) => {
  const { username, password } = req.body

  // 验证用户
  const user = users.find(u => u.username === username && u.password === password)

  if (!user) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>登录失败</title></head>
      <body style="font-family:Arial;max-width:500px;margin:50px auto;padding:20px;">
        <div style="background:#ffebee;color:#c62828;padding:15px;border-radius:5px;">
          <h3>登录失败</h3>
          <p>用户名或密码错误</p>
          <p><a href="/">返回</a></p>
        </div>
      </body>
      </html>
    `)
  }

  // 生成 Session ID
  const sessionId = Buffer.from(`${user.id}-${Date.now()}`).toString('base64')

  // 存储 Session
  sessions.set(sessionId, { userId: user.id, createdAt: Date.now() })

  // 设置多个 Cookie 演示区别
  // 1. HttpOnly Cookie - JS 无法读取
  res.cookie('session_id', sessionId, {
    httpOnly: true,
    secure: false,  // 演示用，生产环境应为 true
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  })

  // 2. 普通 Cookie - JS 可以读取
  res.cookie('user_info', JSON.stringify({ username: user.username }), {
    maxAge: 24 * 60 * 60 * 1000
  })

  res.redirect('/')
})

// ============================================
// 退出登录
// ============================================
app.get('/logout', (req, res) => {
  res.clearCookie('session_id')
  res.clearCookie('user_info')
  res.redirect('/')
})

// ============================================
// 检查登录状态 API
// ============================================
app.get('/api/me', (req, res) => {
  if (req.user) {
    res.json({
      logged_in: true,
      user: { username: req.user.username },
      session_id_from_cookie: req.cookies.session_id ? '存在' : '不存在'
    })
  } else {
    res.json({
      logged_in: false,
      message: '未登录或 Session 过期'
    })
  }
})

// 启动服务器
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`
  ============================================
   HttpOnly Cookie 演示服务器
  ============================================
  访问:        http://localhost:${PORT}

  测试账号:    alice / 123456

  说明:
  - 登录后会设置两个 Cookie
  - session_id (HttpOnly)  - JS 无法读取
  - user_info (普通)       - JS 可以读取
  ============================================
  `)
})
