//index.js
// 协商缓存示例：服务端返回文件时，利用响应头 ETag 验证资源是否被修改，提升缓存效率

const http = require("http");
const fs = require("fs");
const path = require("path");
// 注意：下面拼写错误，应该是 crypto
const crypto = require("crypto");

/**
 * 计算输入数据的 MD5 摘要值（常用于生成 ETag 或校验文件完整性）
 *
 * @param {string|Buffer} data - 需要加密的数据，可以是字符串或 Buffer
 * @returns {string} - 返回32位的十六进制 MD5 字符串
 *
 * 示例：
 *   const hash = md5("hello world");
 *   console.log(hash); // 输出: 5eb63bbbe01eeed093cb22bb8f5acdc3
 */
function md5(data) {
  // crypto.createHash("md5") 创建一个 md5 哈希对象
  // .update(data) 将数据写入哈希对象
  // .digest("hex") 以十六进制字符串输出最终的哈希值
  return require("crypto").createHash("md5").update(data).digest("hex");
}

// 使用样例
// const hash = md5("hello world");
// console.log(hash); // 5eb63bbbe01eeed093cb22bb8f5acdc3

http
  .createServer(function (request, response) {
    // 处理根路径请求，返回 HTML 页面
    if (request.url === "/") {
      // 同步读取 test.html 文件内容
      const html = fs.readFileSync("test.html", "utf-8");
      // 设置响应头，声明内容类型为 HTML
      response.writeHead(200, {
        "content-type": "text/html",
      });
      // 发送响应体
      response.end(html);
    }

    // 处理 /test.js 路由，请求静态 JS 文件，演示协商缓存
    if (request.url === "/test.js") {
      // 获取客户端请求头中的 If-None-Match 字段（上次缓存的 ETag）
      const noneMatch = request.headers["if-none-match"];
      // 拼接 test.js 文件的绝对路径
      const filePath = path.join(__dirname, "test.js");
      // 读取文件内容为 Buffer
      const buffer = fs.readFileSync(filePath);
      // 计算文件内容的 MD5 值，作为 ETag
      const fileMd5 = md5(buffer);

      // 如果客户端的 ETag 与当前文件的 MD5 一致，说明文件未被修改
      if (noneMatch === fileMd5) {
        // 返回 304 Not Modified，告知客户端直接使用本地缓存副本
        response.statusCode = 304;
        response.end();
        return;
      }

      // 注意：原代码有拼写错误 noneMath，应该是 noneMatch
      // 如果 ETag 不一致，说明文件已被修改，需要返回新内容
      if (noneMatch !== fileMd5) {
        // 设置状态码为 200，表示有新内容
        response.statusCode = 200;
        // 设置响应头：
        // - Content-Type: 声明 JS 类型
        // - Cache-Control: max-age=0，强制每次都走协商缓存
        // - ETag: 返回当前文件的 MD5 值，供下次校验
        response.setHeader("Content-Type", "text/javascript");
        response.setHeader("Cache-Control", "max-age=0");
        response.setHeader("ETag", fileMd5);

        // 以流的方式读取并返回文件内容，适合大文件
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
      }
    }
  })
  .listen(8888); // 监听 8888 端口，启动服务器

// 访问 http://127.0.0.1:8888/ 可测试 HTML 页面
// 访问 http://127.0.0.1:8888/test.js 可测试协商缓存效果
