# HTTP 缓存机制详解

## 目录

- [URL 输入到页面显示的完整流程](#url-输入到页面显示的完整流程)
- [HTTP 缓存机制](#http-缓存机制)
- [重定向状态码详解](#重定向状态码详解)
- [实际应用示例](#实际应用示例)

## URL 输入到页面显示的完整流程

### 1. 浏览器多进程架构

- **多进程多线程是前提**：现代浏览器采用多进程架构，每个标签页独立进程
- **渲染进程**：负责页面渲染、JavaScript 执行
- **网络进程**：负责网络请求、缓存管理
- **浏览器进程**：负责用户界面、地址栏、书签等

### 2. URL 解析与 DNS 查询

```
协议://域名:端口/路径?查询参数#片段标识符
```

**URL 结构示例**：

- `https://www.baidu.com:443/index.html?name=value#section1`
- `http://localhost:3000/api/users?id=123`

**DNS 解析流程**：

1. 浏览器缓存 → 系统缓存 → 路由器缓存 → ISP DNS 服务器
2. 递归查询 → 根域名服务器 → 顶级域名服务器 → 权威域名服务器
3. 返回 IP 地址给浏览器

### 3. 建立连接与发送请求

- **TCP 三次握手**：建立可靠连接
- **TLS 握手**（HTTPS）：协商加密参数
- **构造 HTTP 请求**：
  ```
  GET /index.html HTTP/1.1
  Host: www.example.com
  User-Agent: Mozilla/5.0...
  Accept: text/html,application/xhtml+xml...
  ```

### 4. 缓存检查机制

**发送请求前的缓存检查**：

1. **强缓存检查**：根据 `Cache-Control` 和 `Expires` 判断
2. **协商缓存检查**：根据 `ETag` 和 `Last-Modified` 判断
3. **缓存命中**：直接使用本地副本，不发送网络请求
4. **缓存未命中**：发送请求到服务器

## HTTP 缓存机制

### 1. 强缓存（Freshness）

**特点**：直接用本地副本，不发请求

**关键响应头**：

- `Cache-Control: max-age=秒数` - 资源新鲜期
- `Cache-Control: immutable` - 内容不变性标识
- `Expires: HTTP-date` - 绝对过期时间

**缓存策略示例**：

```javascript
// 静态资源（带文件指纹）
Cache-Control: public, max-age=31536000, immutable

// HTML 页面（需要及时更新）
Cache-Control: no-cache, must-revalidate

// API 数据（短期缓存）
Cache-Control: public, max-age=60, stale-while-revalidate=30
```

**强缓存没有命中** 这个资源在服务器也不一定要改换，但是客户端缓存的资源可能被修改了，所以需要验证资源是否被修改了。

### 2. 协商缓存（Validation）

**特点**：发请求带验证器，命中返回 304

**关键响应头**：

- `ETag: "abc123"` - 内容指纹
- `Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT` - 最后修改时间

**请求头**：

- `If-None-Match: "abc123"` - 匹配 ETag
- `If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT` - 匹配修改时间

### 3. 缓存决策流程

```
1. 检查 Cache-Control
   ├─ no-store → 不缓存
   ├─ max-age > 0 且未过期 → 强缓存命中
   └─ 过期或 no-cache → 协商缓存

2. 协商缓存
   ├─ ETag 匹配 → 返回 304
   └─ 不匹配 → 返回 200 + 新内容
```

### 4. 实际测试示例

**强缓存测试**：

```javascript
// 服务端设置
response.writeHead(200, {
  "Content-Type": "text/javascript",
  "Cache-Control": "max-age=20,public",
});
//expires: new Date(Date.now() + 7 * 24 * 60 * 60* 1000),
// 可能客户端时间不准
// 浏览器行为
// 首次请求：200 OK，Size 显示实际大小
// 20秒内再次请求：from memory/disk cache
// 20秒后请求：重新发送网络请求
// http 1.1 升级到 cache-control
// 过期了要请求
```

## 重定向状态码详解

### 1. 核心区别对比

| 状态码 | 永久性 | 方法保持     | 缓存性 | SEO 权重传递 | 典型用途     |
| ------ | ------ | ------------ | ------ | ------------ | ------------ |
| 301    | 永久   | 可能改为 GET | 可缓存 | 传递         | 域名永久迁移 |
| 302    | 临时   | 可能改为 GET | 不缓存 | 不传递       | 临时跳转     |
| 307    | 临时   | 严格保持     | 不缓存 | 不传递       | 表单临时跳转 |
| 308    | 永久   | 严格保持     | 可缓存 | 传递         | API 永久迁移 |

### 2. 详细说明

#### 301 Moved Permanently（永久移动）

- **特点**：资源永久移动到新位置
- **行为**：浏览器可能将非 GET 请求改为 GET
- **缓存**：默认可被缓存
- **SEO**：搜索引擎权重会传递到新地址
- **适用场景**：域名迁移、路径永久调整

#### 302 Found（临时移动）

- **特点**：资源临时移动到新位置
- **行为**：浏览器可能将非 GET 请求改为 GET
- **缓存**：默认不可缓存
- **SEO**：搜索引擎权重不传递
- **适用场景**：临时跳转、AB 测试

#### 307 Temporary Redirect（临时重定向）

- **特点**：临时重定向，严格保持请求方法
- **行为**：POST 请求仍为 POST，保留请求体
- **缓存**：默认不可缓存
- **适用场景**：表单提交临时跳转、支付流程

#### 308 Permanent Redirect（永久重定向）

- **特点**：永久重定向，严格保持请求方法
- **行为**：POST 请求仍为 POST，保留请求体
- **缓存**：默认可被缓存
- **适用场景**：API 端点永久迁移

### 3. 选型建议

**页面永久迁移**：使用 301 或 308

```nginx
# Nginx 配置示例
location /old-page {
    return 301 /new-page;
}
```

**临时跳转**：使用 302 或 307

```nginx
# 临时跳转示例
location /temp {
    return 302 /new-location;
}
```

**表单提交跳转**：使用 307（临时）或 308（永久）

```javascript
// Node.js 示例
if (req.method === "POST") {
  res.writeHead(307, {
    Location: "/success-page",
  });
  res.end();
}
```

## 实际应用示例

### 1. 静态资源缓存策略

```javascript
// 带文件指纹的静态资源
app.get("/static/:hash.js", (req, res) => {
  res.set({
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Type": "application/javascript",
  });
  res.sendFile(`./static/${req.params.hash}.js`);
});

// HTML 页面（不缓存）
app.get("/", (req, res) => {
  res.set({
    "Cache-Control": "no-cache, must-revalidate",
    "Content-Type": "text/html",
  });
  res.sendFile("./index.html");
});
```

### 2. API 缓存策略

```javascript
// 可缓存的查询API
app.get("/api/users", (req, res) => {
  const etag = generateETag(users);

  if (req.headers["if-none-match"] === etag) {
    return res.status(304).end();
  }

  res.set({
    ETag: etag,
    "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
    "Content-Type": "application/json",
  });

  res.json(users);
});
```

### 3. 缓存测试方法

```bash
# 使用 curl 测试缓存
curl -I http://localhost:3000/static/app.js

# 测试协商缓存
curl -H "If-None-Match: \"abc123\"" -I http://localhost:3000/api/data

# 测试重定向
curl -I http://localhost:3000/old-page
```

### 4. 浏览器开发者工具观察

1. **Network 面板**：
   - Size 列显示 `(from memory cache)` 或 `(from disk cache)`
   - Status 列显示 `304 Not Modified`
2. **Application 面板**：
   - Storage → Cache Storage 查看缓存内容
   - Storage → Local Storage 查看本地存储

## 总结

### 缓存最佳实践

1. **静态资源**：使用长缓存 + 文件指纹
2. **HTML 页面**：使用协商缓存或短缓存
3. **API 数据**：根据数据更新频率设置合适的缓存策略
4. **敏感数据**：使用 `no-store` 禁止缓存

### 重定向最佳实践

1. **永久迁移**：使用 301 或 308
2. **临时跳转**：使用 302 或 307
3. **表单提交**：使用 307 或 308 保持方法
4. **SEO 考虑**：永久重定向传递权重，临时重定向不传递

### 性能优化建议

1. **合理设置缓存时间**：平衡新鲜度和性能
2. **使用 ETag**：减少不必要的网络传输
3. **配置 CDN**：利用边缘节点缓存
4. **监控缓存命中率**：持续优化缓存策略
