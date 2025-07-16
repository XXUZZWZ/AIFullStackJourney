const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 666;

// 使用 body-parser 中间件解析 JSON 请求体
app.use(bodyParser.json());

// 处理 POST 请求
app.post('/uploadtodos', (req, res) => {
  try {
    const { userId, todos } = req.body;
    
    // 验证请求体
    if (!userId || !todos) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // 处理 todos 数据
    const processedTodos = todos.map(todo => ({
      ...todo,
      processedAt: new Date().toISOString()
    }));

    // 返回处理结果
    const result = {
      status: 'success',
      userId,
      todos: processedTodos,
      receivedAt: new Date().toISOString()
    };
    res.json(result);
    console.log(`Received ${todos.length} todos from user ${userId}`);

    // 保存结果到JSON文件
    const filename = `todos_${userId}_${Date.now()}.json`;
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
    console.log(`Saved todos to ${filename}`);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
