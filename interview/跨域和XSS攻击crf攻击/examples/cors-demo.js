/**
 * 跨域演示代码
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
// 方式一：使用 cors 中间件（推荐）
// ============================================

// 基础用法 - 允许所有源
// app.use(cors())

// 允许指定源
app.use(cors({
  origin: ['http://localhost:3000', 'https://example.com'],
  credentials: true,
  optionsSuccessStatus: 200
}))

// ============================================
// 方式二：手动配置 CORS
// ============================================

/*
app.use((req, res, next) => {
  // 允许的源（可以是字符串、数组或函数）
  res.header('Access-Control-Allow-Origin', '*')

  // 动态设置允许的源
  // const allowedOrigins = ['http://localhost:3000', 'https://example.com']
  // const origin = allowedOrigins.includes(req.headers.origin)
  //   ? req.headers.origin
  //   : allowedOrigins[0]
  // res.header('Access-Control-Allow-Origin', origin)

  // 允许携带凭证 (Cookie 等)
  res.header('Access-Control-Allow-Credentials', 'true')

  // 允许的请求方法
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')

  // 允许的请求头
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  // 暴露的响应头（允许前端读取的响应头）
  res.header('Access-Control-Expose-Headers', 'X-Total-Count, X-Request-ID')

  // 预检请求缓存时间（秒）
  res.header('Access-Control-Max-Age', '86400') // 24小时

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})
*/

// ============================================
// 自定义 CORS 验证函数
// ============================================

const corsOptionsDelegate = (req, callback) => {
  const allowList = ['http://localhost:3000', 'https://example.com']
  const corsOptions = { origin: false }

  if (allowList.indexOf(req.header('Origin')) !== -1) {
    corsOptions.origin = true // 启用 CORS
  }

  callback(null, corsOptions)
}

// 为特定路由应用自定义 CORS
// app.get('/products', cors(corsOptionsDelegate), (req, res) => {
//   res.json({ products: [] })
// })

// ============================================
// 示例 API 路由
// ============================================

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CORS 测试</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
        .box { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>CORS 跨域测试</h1>

      <div class="box">
        <h3>当前源</h3>
        <p><code>${req.protocol}://${req.get('host')}</code></p>
      </div>

      <div class="box">
        <h3>测试 API</h3>
        <button onclick="testSimpleRequest()">简单请求 (GET)</button>
        <button onclick="testComplexRequest()">复杂请求 (PUT)</button>
        <button onclick="testWithCredentials()">携带凭证请求</button>
        <button onclick="testCustomHeader()">自定义请求头</button>
      </div>

      <div id="result" class="box" style="display:none;"></div>

      <script>
        const resultDiv = document.getElementById('result');

        function showResult(data, isSuccess = true) {
          resultDiv.style.display = 'block';
          resultDiv.className = 'box ' + (isSuccess ? 'success' : 'error');
          resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }

        // 简单请求
        async function testSimpleRequest() {
          try {
            const res = await fetch('/api/data');
            const data = await res.json();
            showResult(data);
          } catch (err) {
            showResult({ error: err.message }, false);
          }
        }

        // 复杂请求（会触发预检）
        async function testComplexRequest() {
          try {
            const res = await fetch('/api/data', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'test' })
            });
            const data = await res.json();
            showResult(data);
          } catch (err) {
            showResult({ error: err.message }, false);
          }
        }

        // 携带凭证
        async function testWithCredentials() {
          try {
            // 先设置 Cookie
            document.cookie = 'testCookie=hello; path=/';

            const res = await fetch('/api/protected', {
              credentials: 'include'
            });
            const data = await res.json();
            showResult(data);
          } catch (err) {
            showResult({ error: err.message }, false);
          }
        }

        // 自定义请求头
        async function testCustomHeader() {
          try {
            const res = await fetch('/api/custom', {
              headers: { 'X-Custom-Header': 'my-value' }
            });
            const data = await res.json();
            showResult(data);
          } catch (err) {
            showResult({ error: err.message }, false);
          }
        }

        // 显示当前 Cookie
        console.log('当前 Cookies:', document.cookie);
      </script>
    </body>
    </html>
  `);
});

// API 路由
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
    message: '受保护资源',
    cookies: req.headers.cookie,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/custom', (req, res) => {
  res.json({
    message: '自定义请求头接收成功',
    headers: req.headers
  });
});

// ============================================
// Vite 开发服务器代理配置示例
// ============================================

/*
// vite.config.js
export default {
  server: {
    proxy: {
      // 代理所有 /api 请求
      '/api': {
        target: 'http://backend-api.com',
        changeOrigin: true,
        // 重写路径
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // WebSocket 代理
      '/socket.io': {
        target: 'http://socket-server.com',
        ws: true
      }
    }
  }
}
*/

// 启动服务器
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
