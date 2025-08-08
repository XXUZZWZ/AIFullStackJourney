const http = require("http");
const url = require("url");

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 解析请求 URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 只处理 /api/data 路径的 GET 请求
  if (req.method === "GET" && pathname === "/api/data") {
    // 获取回调函数名（默认使用 'callback'）
    const callbackName = parsedUrl.query.callback || "callback";

    // 模拟数据（实际应用中可能来自数据库或其他服务）
    const responseData = {
      status: "success",
      timestamp: Date.now(),
      data: {
        message: "Hello from JSONP API!",
        items: ["Apple", "Banana", "Orange"],
        random: Math.random(),
      },
    };

    // 将数据转为 JSON 字符串
    const jsonData = JSON.stringify(responseData);

    // 构建 JSONP 响应（包裹在回调函数中）
    const jsonpResponse = `${callbackName}(${jsonData})`;

    // 设置响应头
    res.writeHead(200, {
      "Content-Type": "application/javascript",
      Charset: "utf-8",
    });

    // 发送响应
    res.end(jsonpResponse);
  } else {
    // 处理其他路径
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSONP server running at http://localhost:${PORT}/`);
});
