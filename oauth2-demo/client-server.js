const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

// 托管客户端静态文件
app.use(express.static(path.join(__dirname, 'client')));

// 默认路由重定向到index.html
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// 处理callback路由
app.get('/callback', (req, res) => {
  res.redirect('/callback.html' + req.url.replace('/callback', ''));
});

// 启动客户端服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  OAuth2客户端应用已启动                ║
║  端口: ${PORT}                            ║
╚════════════════════════════════════════╝
客户端地址: http://localhost:${PORT}

请确保授权服务器在端口3001运行
  `);
});