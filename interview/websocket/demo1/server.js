const WebSocket = require("ws");
const http = require("http");

// 用户要先通过http 协议连接上服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
});

const wss = new WebSocket.Server({ server, path: "/ws" });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    console.log("Received message:", message);
    ws.send("Server received your message");
  });
});

server.listen(8080, (res, req) => {
  console.log("Server is running on port http://localhost:8080");
});
