// commonjs
const http = require("http");
// js 异步  异步无阻塞
// node 天生性能好 相同用户访问数，使用的服务器数量少，更便宜
const server = http.createServer((req, res) => {
  if (req.url === "/api/hello" && req.method === "GET") {
    console.log("//////");
    res.writeHead(200, {
      // "Content-Type": "application/json",
      // 响应头是js
      "Content-type": "text/javascript",
    });
    // 要传递的json数据
    const data = { code: 0, msg: "字节我来啦" };
    // res.end(JSON.stringify({ message: "Hello from Node.js backend" }));
    // json with padding
    res.end(`
      console.log("hello world")
      callback(${JSON.stringify(data)})
      `);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// 服务器程序在8080端口上运行
server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
