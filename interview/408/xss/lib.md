### 什么是 XSS

- **定义**: 跨站脚本攻击（Cross-Site Scripting），攻击者将恶意脚本注入到可信站点中，在其他用户的浏览器中执行，从而窃取数据、劫持会话或进行页面篡改等。

### 常见类型

- **反射型（Reflected）**: 恶意代码通过 URL 参数等“立刻反射”到响应中执行。需要受害者点击特制链接。
- **存储型（Stored）**: 恶意代码被持久化（数据库/评论/帖子），所有访问者都会被攻击。
- **DOM 型（DOM-based）**: 纯前端层面，JS 在浏览器对 `location` 等不可信数据处理不当导致注入。

### 典型危害

- **窃取身份**: 读取 `cookie`/`localStorage`、伪造请求。
- **页面控制**: 篡改 DOM、钓鱼表单、加载远程恶意脚本。
- **内网横移**: 利用受害者浏览器访问内网资源。
- **账户接管**: 结合 CSRF 或 API 调用操作账户。

### 触发与载荷示例

- **HTML 注入**:

```html
<input value="<img src=x onerror=alert(1)>" />
```

- **属性上下文**:

```html
<a href="javascript:alert(1)">x</a>
```

- **JS 字符串上下文**:

```html
<script>var s = "{PAYLOAD}";</script>  // 需要对引号与 </script> 转义
```

- **URL/DOM**:

```js
element.innerHTML = location.hash.slice(1); // 危险
```

### 产生原因（核心）

- 未对输出做“按上下文”的正确编码。
- 在 DOM 中使用危险 API 注入不可信内容（如 `innerHTML`）。
- 直接信任用户输入（存储/回显/富文本）。
- 关闭或绕过框架默认转义（如 React 的 `dangerouslySetInnerHTML`、Vue 的 `v-html`、Angular 的 `[innerHTML]`）。

### 防御要点（优先级从高到低）

- **输出编码（基于上下文）**
  - HTML 文本节点：转义 `& < > " '`
  - HTML 属性值：同上再避免换行、反引号
  - JS 字符串：转义引号、反斜杠与 `</script>`
  - URL 上下文：使用 `encodeURIComponent`/白名单协议（仅 `https:`、`/` 等）
  - CSS 上下文：避免将不可信数据放入 CSS，必要时严格白名单
- **避免危险 API**
  - 不用或极少用：`innerHTML`, `outerHTML`, `document.write`, `insertAdjacentHTML`, `Range.createContextualFragment`
  - 用安全替代：`textContent`, `setAttribute`, DOM 构建 API
- **模板框架安全使用**
  - React：默认安全；不要随便用 `dangerouslySetInnerHTML`
  - Vue：默认转义；谨慎 `v-html`
  - Angular：默认 Sanitization；避免 `[innerHTML]` 或用 `DomSanitizer` 严管来源
- **富文本安全**
  - 使用成熟库清洗：如 DOMPurify，并配置严格白名单
  - 服务端与客户端双重净化，避免仅客户端净化
- **内容安全策略（CSP）**
  - 开启严格 CSP，禁止内联脚本，限制脚本来源，结合 nonce/hash

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trust.cdn 'nonce-<random>'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
```

- **Cookie/会话保护**
  - `HttpOnly`、`Secure`、`SameSite=Lax/Strict`，减少被窃取与跨站滥用
- **输入校验与白名单**
  - 对期望是数字/枚举/URL 的字段做格式校验与协议白名单
- **安全头部**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` 或 `frame-ancestors`（在 CSP 中）
  - `Referrer-Policy`
- **最小权限与监控**
  - 错误上报、CSP 违规上报、WAF 规则、审计异常参数与 Referer

### 常见误区

- 仅做“输入过滤”而不做“输出编码”。（错误）
- 只在服务器端过滤，前端仍直接 `innerHTML`。
- 以为“转义一次万能”。必须按上下文编码，且每次输出都编码。
- 依赖黑名单拦截。应使用白名单与默认拒绝。
- 误用 `encodeURI` 替代 `encodeURIComponent`，前者不转义 `?&=#` 等。

### 简易自查清单

- 是否出现 `innerHTML/outerHTML/insertAdjacentHTML/document.write`？
- 是否使用了 `dangerouslySetInnerHTML/v-html/[innerHTML]`？
- 是否把不可信数据放入 JS 字符串、事件属性、`href="javascript:"`、`style`？
- 是否开启了严格 CSP、`HttpOnly+SameSite`？
- 富文本是否用 DOMPurify 且采用白名单？

### 简短最佳实践示例

- 安全插入文本：

```js
const div = document.createElement("div");
div.textContent = userInput;
```

- 安全构造链接：

```js
const a = document.createElement("a");
const url = new URL(userInputUrl, location.origin);
if (["https:", "http:"].includes(url.protocol)) a.href = url.toString();
```

- React 避免：

```jsx
// 避免：<div dangerouslySetInnerHTML={{ __html: userHtml }} />
// 优先：<div>{text}</div>
```

需要我结合你仓库里的具体示例（如 `interview/408/xss/readme.md`）补充演示代码与修复清单吗？

### 什么是反射型 XSS（Reflected XSS）

- **定义**：恶意脚本经由一次性请求参数（如 URL 查询、表单、HTTP 头）被服务器“原样反射”到响应中，并在用户浏览器中执行。通常需要受害者点击特制链接或提交恶意参数。
- **特点**：不落库、不持久；触发依赖一次交互；常见于搜索页、错误页、跳转页。

### 攻击流程（简化）

1. 攻击者构造恶意 URL（在参数中夹带脚本）
2. 受害者点击链接 → 请求发送到目标站点
3. 服务器把参数未经正确编码地回显到 HTML/JS 中
4. 浏览器解析并执行注入的脚本

### 常见注入上下文

- **HTML 文本节点**：参数被直接拼进页面文本
- **HTML 属性**：如 `value`/`title`/事件属性（更危险）
- **JS 字符串**：参数被拼进 `<script>` 内字符串
- **URL 上下文**：参数进入 `href/src` 等，引发 `javascript:` 协议或二次加载

### 典型载荷示例

- 查询参数直接回显：

```
https://victim.com/search?q="><script>alert(1)</script>
```

- 属性上下文破坏：

```
https://victim.com/?name=" onmouseover="alert(1)
```

- JS 字符串破坏：

```
https://victim.com/?msg=';alert(1);//
```

### 如何快速自测（黑盒）

- 在搜索/提示/错误页输入包含特殊字符：`< > " ' / ( ) ;`
- 观察返回 HTML 是否把你的输入“原样回显”且发生弹窗或脚本执行
- 用多种上下文变体测试：文本、属性、JS 字符串、URL

### 代码层面易错点

- 模板中直接输出未编码的参数（尤其自写模板引擎）
- 服务端拼接 HTML 片段返回（错误页、提示页）
- 在前端用 `innerHTML` 回显 `location.search/hash`
- 跳转页把 `next`/`redirect` 参数直接塞进 `location.href`

### 防御要点（针对反射型）

- **严格输出编码（按上下文）**
  - 文本节点：HTML 转义 `& < > " '`
  - 属性值：同上并避免换行与反引号
  - JS 字符串：转义引号、反斜杠与 `</script>`
  - URL：`encodeURIComponent`，并做协议白名单（拒绝 `javascript:`）
- **避免危险 API/拼接**
  - 服务端模板默认转义；不要手写字符串拼接 HTML
  - 前端回显用 `textContent`/安全 DOM API，避免 `innerHTML`
- **输入校验与白名单**
  - 枚举/格式约束（仅允许期望字符集与长度）
- **开启严格 CSP**
  - 禁止内联脚本，使用 `nonce`/`hash`，限制 `script-src`
- **错误页与搜索页特别加固**
  - 错误消息不直接回显原始参数；统一安全模板渲染

### 与存储型/DOM 型的区别（记忆点）

- **是否持久**：反射型不持久；存储型会落库；DOM 型发生在前端逻辑中
- **触发条件**：反射型通常需要“点击恶意链接”；存储型自动触发

需要我查看你 `interview/408/xss/1.html` 与 `2.html` 的具体实现，给出定向的易感点与修复建议吗？
