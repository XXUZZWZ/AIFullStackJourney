# 全栈开发

- 前端 react
- mock 前端伪接口
  - /api axios
- 后端 java,node,go

## 暂无后端的前端

- 用 mock 来先写数据来开发

## vite-plugin-mock

- mock
  前端在后端给出真实接口前，需要 mock 数据来开发。
  vite-plugin-mock 插件
  - mock 服务启动
  - /mock/test.js 根目录

```http
GET /api/todos/1 HTTP/1.1
Host: http://localhost:5173
```

返回数据

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Date: Mon, 21 Jul 2025 12:03:51 GMT
Connection: close
Content-Length: 194

{
  "code": 0,
  "data": [
    {
      "id": 1,
      "title": "todo1",
      "completed": false
    },
    {
      "id": 2,
      "title": "todo2",
      "completed": true
    },
    {
      "id": 3,
      "title": "todo3",
      "completed": false
    }
  ],
  "message": "获取todos success",
  "success": true
}

```

- 前后端联调
  - 开会立项
  - 前后端接口文档
  - api/todos
    定义返回数据类型和格式
    application/json
    [
    {
    "id": 1,
    "title": "todo1",
    "completed": false
    }
    ]
