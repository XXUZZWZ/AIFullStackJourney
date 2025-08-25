const http = require("http");
const fs = require("fs");

// 说明：
// 这个最小示例启动了一个 HTTP 服务器，监听 8888 端口。
// 当请求路径为 "/"（根路径）时，读取同目录下的 test.html 文件并返回给客户端。
// 关键点：
// 1) 仅处理根路径，其它路径当前没有响应逻辑（可能导致客户端等待直到超时）。
// 2) 采用 fs.readFileSync 同步读取文件，代码更直观，但会在读取期间阻塞事件循环。
// 3) 仅设置了 Content-Type 响应头，没有设置缓存相关头部（如 Cache-Control、ETag 等），
//    因此浏览器/中间层的缓存行为将取决于默认策略或启发式规则。
// 4) 为了演示缓存策略，后续可在 writeHead 中补充缓存头，但本示例保持原逻辑不改动。

http
  .createServer(function (request, response) {
    // 请求进入时的基本流程：
    // Step 1. Node.js 内置 HTTP 模块触发请求回调（每个连接/请求都会调用一次）。
    // Step 2. 通过 request.url 判断路由，这里仅处理 "/"。
    // Step 3. 命中根路径后，读取本地 HTML 文件并写入响应。
    // Step 4. 发送响应头（包含 Content-Type），随后发送响应体并结束响应。
    // Step 5. 其他路径未处理，客户端可能无响应（生产代码需补充 404 等）。
    if (request.url === "/") {
      // index.html
      // 异步读取 不会阻塞其他代码执行
      // fs.readFile("test.html", "utf-8", (err, data) => {});
      // 同步读取文件 Sync，会阻塞，但是流程控制更清晰
      const html = fs.readFileSync("test.html", "utf-8");
      response.writeHead(200, {
        "Content-Type": "text/html",
        // 注：此处仅声明了内容类型（MIME），并未声明缓存策略：
        // - 若要启用强缓存（Freshness），可添加：
        //   Cache-Control: public, max-age=60
        // - 若要启用协商缓存（Validation），需要生成并返回 ETag 或 Last-Modified，
        //   并在下次请求时根据 If-None-Match / If-Modified-Since 判定是否返回 304。
        // 但为保持示例原样，我们不改动任何行为，仅作说明。
      });

      response.end(html);
    }
    // 新增路由：/test.js
    // 用于演示“强缓存（Freshness）”的典型设置：Cache-Control: max-age=20, public
    // 含义说明：
    // - max-age=20：资源自响应被接收起的 20 秒内视为“新鲜”，浏览器可直接使用本地副本，不向服务器发请求。
    // - public：允许任何中间缓存（CDN、代理）存储该响应（与 private 相对，仅浏览器可存）。
    // 观测方式：
    // 1) 首次请求 /test.js → Network 显示 200，Size 为网络大小。
    // 2) 20 秒内再次请求 → 显示 from memory/disk cache（浏览器直接用强缓存，不走网络）。
    // 3) 超过 20 秒再请求 → 强缓存过期，浏览器会重新发网络请求获取最新副本（若未配置 ETag/Last-Modified，则直接 200）。
    if (request.url === "/test.js") {
      const testJs = fs.readFileSync("test.js", "utf-8");
      response.writeHead(200, {
        "Content-Type": "text/javascript",
        "Cache-Control": "max-age=20,public",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        // 注意：这里未设置 ETag/Last-Modified，所以过期后是直接重新获取（200）。
        // 如果想在过期后先做“协商缓存”，可配合：
        // - 生成 ETag：在响应头加上 ETag，并在下次请求中依据 If-None-Match 返回 304。
        // - 或使用 Last-Modified/If-Modified-Since。
        // 本示例仅展示强缓存的最小可行配置。
      });
      response.end(testJs);
      // 服务端20秒内
      // test.js	200	script	(索引):12	0 B	21 ms	(disk cache)
    }
  })
  .listen(8888);
console.log("Server running at http://127.0.0.1:8888/");
