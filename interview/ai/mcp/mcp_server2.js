// mcp-server2.js (HTTP 版本)
// 提供与 stdio 版本等价的工具能力，通过 HTTP 暴露：
// - GET /tools      列出可用工具
// - POST /call-tool 调用指定工具

import http from "node:http";

// 工具列表（与 stdio 版本一致）
const tools = [
  {
    name: "getTime",
    description: "返回当前时间（ISO 字符串）",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
];

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function notFound(res) {
  sendJson(res, 404, { error: "未找到请求的资源" });
}

function methodNotAllowed(res) {
  sendJson(res, 405, { error: "不支持的请求方法" });
}

async function readJsonBody(req) {
  return await new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      // 基础防护：限制请求体大小（1MB）
      if (raw.length > 1 * 1024 * 1024) {
        reject(new Error("请求体过大"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        const json = raw ? JSON.parse(raw) : {};
        resolve(json);
      } catch (e) {
        reject(new Error("无效的 JSON 请求体"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const { method, url } = req;

    if (url === "/tools") {
      if (method !== "GET") return methodNotAllowed(res);
      return sendJson(res, 200, { tools });
    }

    if (url === "/call-tool") {
      if (method !== "POST") return methodNotAllowed(res);
      const body = await readJsonBody(req);
      const name = body?.name;
      const args = body?.arguments ?? {};

      if (name === "getTime") {
        return sendJson(res, 200, {
          content: [
            { type: "text", text: `当前时间是: ${new Date().toISOString()}` },
          ],
          // 回显参数，便于调试（虽然本工具不需要）
          usedArgs: args,
        });
      }

      return sendJson(res, 400, { error: `未知工具: ${name}` });
    }

    return notFound(res);
  } catch (error) {
    return sendJson(res, 500, { error: String(error?.message || error) });
  }
});

const PORT = Number(process.env.PORT || 3000);
server.listen(PORT, () => {
  // 统一中文日志输出
  console.log(`HTTP MCP 服务器已启动: http://localhost:${PORT}`);
  console.log("可用接口: GET /tools, POST /call-tool");
});
