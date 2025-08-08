const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader(`Access-Control-Allow-Origin`, "http://127.0.0.1:5502");
  res.setHeader(
    `Access-Control-Allow-Methods`,
    "PUT,PATCH,POST,DELETE,OPTIONS"
  );
  if (req.url === "/api/test" && req.method === "PATCH") {
    // const url = new URL(req.url, `http://${req.headers.host}`);
    res.writeHead(200, {
      "Content-type": "application/json",
      // "Access-Control-Allow-Origin": `${req.headers.origin}`,
    });
    res.end(
      JSON.stringify({
        message: "patch 搞定跨域！！！",
      })
    );
  }
  // 浏览器发送一个预检请求
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
});

server.listen(8080, () => {
  console.log("CORS Server is running at http://localhost:8080/");
});
