/**
 * CSRF 攻击与防御演示
 *
 * 运行方式：
 * 1. npm install express express-session cookie-parser
 * 2. node csrf-demo.js
 * 3. 访问 http://localhost:3000
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
    httpOnly: true,     // 防止 JavaScript 访问
    secure: false,      // 生产环境设为 true（需要 HTTPS）
    sameSite: 'strict', // CSRF 防御
    maxAge: 24 * 60 * 60 * 1000
  }
}))

// ============================================
// 模拟数据库
// ============================================
const db = {
  users: [
    { id: 1, username: 'alice', balance: 10000 },
    { id: 2, username: 'bob', balance: 5000 }
  ],
  transfers: []
}

// ============================================
// CSRF Token 生成与验证
// ============================================

/**
 * 生成 CSRF Token
 */
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * CSRF 验证中间件
 */
function csrfProtection(req, res, next) {
  // 跳过 GET 请求（通常不修改状态）
  if (req.method === 'GET') {
    // 为 GET 请求生成 Token（用于表单渲染）
    if (!req.session.csrfToken) {
      req.session.csrfToken = generateCSRFToken()
    }
    return next()
  }

  // 对于 POST/PUT/DELETE 请求，验证 Token
  const token = req.body.csrf_token || req.headers['x-csrf-token']
  const sessionToken = req.session.csrfToken

  if (!token || token !== sessionToken) {
    return res.status(403).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>CSRF 验证失败</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; }
          .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; border-left: 4px solid #f44336; }
        </style>
      </head>
      <body>
        <div class="error">
          <h2>CSRF Token 验证失败</h2>
          <p>非法的跨站请求伪造攻击被阻止！</p>
          <p><a href="/">返回首页</a></p>
        </div>
      </body>
      </html>
    `)
  }

  // 验证成功后重新生成 Token（一次性使用）
  req.session.csrfToken = generateCSRFToken()
  next()
}

// ============================================
// 路由：主页
// ============================================
app.get('/', (req, res) => {
  const user = req.session.user || null

  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CSRF 攻击与防御演示</title>
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
        h2 { color: #555; margin-top: 30px; }
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
        form { margin: 15px 0; }
        input, select {
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
        .btn-danger { background: #f44336; color: white; }
        .btn-success { background: #4CAF50; color: white; }
        .btn-primary { background: #2196F3; color: white; }
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
        .tabs { display: flex; border-bottom: 2px solid #ddd; margin-bottom: 15px; }
        .tab {
          padding: 10px 20px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
        }
        .tab.active { border-bottom-color: #2196F3; color: #2196F3; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; }
        .user-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #e3f2fd;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <h1>CSRF 攻击与防御演示</h1>

      ${user ? `
        <div class="user-info">
          <div>
            <strong>当前用户:</strong> ${user.username}
            <span style="margin: 0 15px;">|</span>
            <strong>余额:</strong> ¥${user.balance}
          </div>
          <a href="/logout" style="color: #2196F3;">退出登录</a>
        </div>
      ` : `
        <div class="alert alert-info">
          <strong>提示：</strong>请先登录以体验完整功能。使用账号 <code>alice</code> 密码 <code>123456</code>
        </div>
      `}

      <!-- 未登录时显示登录表单 -->
      ${!user ? `
        <div class="section">
          <h2>用户登录</h2>
          <form method="POST" action="/login">
            <input type="text" name="username" placeholder="用户名 (alice)" required>
            <input type="password" name="password" placeholder="密码 (123456)" required>
            <button type="submit" class="btn-primary">登录</button>
          </form>
        </div>
      ` : ''}

      <!-- CSRF 攻击演示 -->
      <div class="section">
        <h2>1. CSRF 攻击演示</h2>

        <div class="alert alert-warning">
          <strong>攻击场景：</strong>假设你已登录银行网站，然后访问了恶意网站 evil.com，该网站自动向银行发送转账请求。
        </div>

        <div class="tabs">
          <div class="tab active" onclick="showTab('attack', 'demo')">攻击模拟</div>
          <div class="tab" onclick="showTab('attack', 'evil')">恶意网站代码</div>
          <div class="tab" onclick="showTab('attack', 'explain')">原理说明</div>
        </div>

        <div id="attack-demo" class="tab-content active">
          <div class="box vulnerable">
            <span class="badge badge-danger">存在漏洞</span>
            <h3>无保护的转账接口</h3>
            <p>这个接口没有 CSRF Token，容易被攻击者利用。</p>
            ${user ? `
              <form method="POST" action="/transfer/vulnerable">
                <input type="text" name="to" value="attacker" placeholder="收款人">
                <input type="number" name="amount" value="100" placeholder="金额">
                <button type="submit" class="btn-danger">转账 (无保护)</button>
              </form>
            ` : '<p class="alert alert-info">请先登录</p>'}
          </div>

          <div class="box protected">
            <span class="badge badge-success">CSRF Token 保护</span>
            <h3>受保护的转账接口</h3>
            <p>这个接口使用 CSRF Token，攻击者无法伪造。</p>
            ${user ? `
              <form method="POST" action="/transfer/protected">
                <input type="hidden" name="csrf_token" value="${req.session.csrfToken || ''}">
                <input type="text" name="to" placeholder="收款人">
                <input type="number" name="amount" placeholder="金额">
                <button type="submit" class="btn-success">转账 (受保护)</button>
              </form>
            ` : '<p class="alert alert-info">请先登录</p>'}
          </div>
        </div>

        <div id="attack-evil" class="tab-content">
          <div class="code">
<span class="comment">&lt;!-- 恶意网站 evil.com 的代码 --&gt;</span>
&lt;h1&gt;恭喜你中奖了！&lt;/h1&gt;
&lt;p&gt;点击下方按钮领取奖品...&lt;/p&gt;

<span class="comment">&lt;!-- 隐藏的恶意表单 --&gt;</span>
&lt;form id="evil-form" action="http://localhost:3000/transfer/vulnerable" method="POST"&gt;
  &lt;input type="hidden" name="to" value="attacker"&gt;
  &lt;input type="hidden" name="amount" value="10000"&gt;
&lt;/form&gt;

<span class="comment">&lt;!-- 页面加载时自动提交 --&gt;</span>
&lt;script&gt;
  document.getElementById('evil-form').submit()

  <span class="comment">// 或者使用 fetch</span>
  fetch('http://localhost:3000/transfer/vulnerable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  <span class="comment">// 携带 Cookie</span>
    body: JSON.stringify({ to: 'attacker', amount: 10000 })
  })
&lt;/script&gt;
          </div>
        </div>

        <div id="attack-explain" class="tab-content">
          <div class="alert alert-danger">
            <strong>攻击流程：</strong>
            <ol>
              <li>用户登录 bank.com，服务器返回 Session Cookie</li>
              <li>用户访问恶意网站 evil.com</li>
              <li>evil.com 页面自动向 bank.com 发送请求</li>
              <li>浏览器自动携带 bank.com 的 Cookie</li>
              <li>bank.com 服务器认为是用户的合法操作</li>
              <li>转账成功！</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- 防御措施 -->
      <div class="section">
        <h2>2. CSRF 防御措施</h2>

        <table>
          <thead>
            <tr>
              <th>措施</th>
              <th>说明</th>
              <th>优先级</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CSRF Token</td>
              <td>表单中添加随机 Token，服务端验证</td>
              <td><span class="badge badge-danger">必须</span></td>
            </tr>
            <tr>
              <td>SameSite Cookie</td>
              <td>设置 Cookie 的 sameSite 属性</td>
              <td><span class="badge badge-danger">必须</span></td>
            </tr>
            <tr>
              <td>验证 Referer/Origin</td>
              <td>检查请求来源是否合法</td>
              <td><span class="badge badge-success">推荐</span></td>
            </tr>
            <tr>
              <td>双重 Cookie 验证</td>
              <td>将 Token 同时存放在 Cookie 和请求中</td>
              <td><span class="badge badge-success">推荐</span></td>
            </tr>
            <tr>
              <td>重要操作二次确认</td>
              <td>输入密码或验证码</td>
              <td><span class="badge badge-success">推荐</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SameSite 演示 -->
      <div class="section">
        <h2>3. SameSite Cookie 属性</h2>

        <div class="tabs">
          <div class="tab active" onclick="showTab('samesite', 'demo')">演示</div>
          <div class="tab" onclick="showTab('samesite', 'code')">代码</div>
        </div>

        <div id="samesite-demo" class="tab-content active">
          <div class="alert alert-info">
            <strong>当前 Cookie 配置：</strong><br>
            SameSite: <strong>Strict</strong> - 完全禁止第三方 Cookie 发送
          </div>

          <div class="box">
            <h3>测试跨站请求</h3>
            <p>点击下方按钮模拟从恶意网站发起的请求：</p>
            <button class="btn-danger" onclick="testCrossSiteRequest()">模拟恶意请求</button>
            <div id="cross-site-result" style="margin-top: 10px;"></div>
          </div>
        </div>

        <div id="samesite-code" class="tab-content">
          <div class="code">
<span class="comment">// Node.js / Express 设置 SameSite</span>
session({
  cookie: {
    sameSite: 'strict'  <span class="comment">// strict | lax | none</span>
  }
})

<span class="comment">// SameSite 属性说明：</span>
<span class="comment">// Strict - 最严格，任何跨站请求都不发送 Cookie</span>
<span class="comment">// Lax    - 允许顶级导航 GET 请求发送 Cookie (默认)</span>
<span class="comment">// None   - 必须配合 Secure，允许跨站发送</span>

<span class="comment">// 设置响应头</span>
res.setHeader('Set-Cookie', 'sessionId=xxx; SameSite=Strict; Secure; HttpOnly')
          </div>
        </div>
      </div>

      <!-- 交易记录 -->
      ${user ? `
        <div class="section">
          <h2>交易记录</h2>
          <table>
            <thead>
              <tr>
                <th>时间</th>
                <th>类型</th>
                <th>详情</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>-</td>
                <td>-</td>
                <td>暂无交易记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      ` : ''}

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

        function testCrossSiteRequest() {
          const resultDiv = document.getElementById('cross-site-result');

          fetch('/transfer/vulnerable', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ to: 'attacker', amount: 100 })
          })
          .then(res => res.text())
          .then(html => {
            resultDiv.innerHTML = '<span class="badge badge-success">请求成功</span> <small>(SameSite=Lax 时可能成功)</small>';
          })
          .catch(err => {
            resultDiv.innerHTML = '<span class="badge badge-danger">请求失败</span> <small>' + err.message + '</small>';
          });
        }
      </script>
    </body>
    </html>
  `);
})

// ============================================
// 路由：登录
// ============================================
app.post('/login', (req, res) => {
  const { username, password } = req.body

  // 简单验证
  if (username === 'alice' && password === '123456') {
    req.session.user = db.users[0]
    req.session.csrfToken = generateCSRFToken()
    res.redirect('/')
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>登录失败</title></head>
      <body style="font-family:Arial;max-width:500px;margin:50px auto;padding:20px;">
        <div style="background:#ffebee;color:#c62828;padding:15px;border-radius:5px;">
          <h2>登录失败</h2>
          <p>用户名或密码错误</p>
          <p><a href="/">返回登录</a></p>
        </div>
      </body>
      </html>
    `)
  }
})

// ============================================
// 路由：退出登录
// ============================================
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

// ============================================
// 路由：无保护的转账（存在 CSRF 漏洞）
// ============================================
app.post('/transfer/vulnerable', (req, res) => {
  const user = req.session.user
  if (!user) {
    return res.status(401).send('请先登录')
  }

  const { to, amount } = req.body

  // 执行转账
  const transferAmount = parseInt(amount)
  if (transferAmount > user.balance) {
    return res.send('余额不足')
  }

  user.balance -= transferAmount
  db.transfers.push({
    from: user.username,
    to,
    amount: transferAmount,
    time: new Date().toISOString()
  })

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="success">
        <h2>转账成功</h2>
        <p>向 <strong>${to}</strong> 转账 ¥${amount} 成功！</p>
        <p>当前余额: ¥${user.balance}</p>
        <p><a href="/">返回首页</a></p>
      </div>
    </body>
    </html>
  `)
})

// ============================================
// 路由：受保护的转账（CSRF Token 验证）
// ============================================
app.post('/transfer/protected', csrfProtection, (req, res) => {
  const user = req.session.user
  if (!user) {
    return res.status(401).send('请先登录')
  }

  const { to, amount } = req.body

  // 执行转账
  const transferAmount = parseInt(amount)
  if (transferAmount > user.balance) {
    return res.send('余额不足')
  }

  user.balance -= transferAmount
  db.transfers.push({
    from: user.username,
    to,
    amount: transferAmount,
    time: new Date().toISOString()
  })

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="success">
        <h2>转账成功</h2>
        <p>向 <strong>${to}</strong> 转账 ¥${amount} 成功！</p>
        <p>当前余额: ¥${user.balance}</p>
        <p><a href="/">返回首页</a></p>
      </div>
    </body>
    </html>
  `)
})

// ============================================
// 恶意网站模拟（用于演示攻击）
// ============================================
app.get('/evil', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>恶意网站 - 欢迎领取奖品</title>
      <style>
        body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
        .prize { background: #fff3cd; padding: 30px; border-radius: 10px; }
        h1 { color: #f44336; }
        button { padding: 15px 30px; font-size: 18px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="prize">
        <h1>恭喜你中奖了！</h1>
        <p>点击下方按钮领取 ¥10000 奖品</p>
        <button onclick="submitForm()">领取奖品</button>
      </div>

      <form id="evil-form" action="http://localhost:3000/transfer/vulnerable" method="POST" style="display:none;">
        <input type="hidden" name="to" value="attacker">
        <input type="hidden" name="amount" value="10000">
      </form>

      <script>
        function submitForm() {
          alert('点击按钮的同时，恶意转账请求已发送！');
          document.getElementById('evil-form').submit();
        }

        // 也可以自动提交，不需要用户点击
        // setTimeout(() => document.getElementById('evil-form').submit(), 2000);
      </script>
    </body>
    </html>
  `)
})

// 启动服务器
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`
  ============================================
   CSRF 演示服务器启动成功
  ============================================
  主页:        http://localhost:${PORT}
  恶意网站:    http://localhost:${PORT}/evil

  测试账号:    alice / 123456
  ============================================
  `)
})
