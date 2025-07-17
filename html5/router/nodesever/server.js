const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3001;
const indexPath = path.join(__dirname, "index.html");

const server = http.createServer((req, res) => {
  // 处理所有路由请求返回index.html
  if (req.method === "GET") {
    fs.readFile(indexPath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
