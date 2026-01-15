/**
 * XSS 防御工具函数
 *
 * 提供各种 XSS 防御方案的工具函数
 */

// ============================================
// 1. HTML 转义函数
// ============================================

/**
 * HTML 实体转义 - 防止 XSS
 * @param {string} unsafe - 未转义的字符串
 * @returns {string} 转义后的安全字符串
 */
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;")
}

/**
 * HTML 属性转义
 * @param {string} unsafe
 * @returns {string}
 */
function escapeHtmlAttribute(unsafe) {
  if (typeof unsafe !== 'string') return unsafe
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;")
}

// ============================================
// 2. JavaScript 转义
// ============================================

/**
 * JavaScript 字符串转义
 * 用于将数据安全地嵌入 JavaScript 代码
 * @param {string} unsafe
 * @returns {string}
 */
function escapeJs(unsafe) {
  if (typeof unsafe !== 'string') return unsafe
  return unsafe
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f")
    .replace(/\v/g, "\\v")
    .replace(/\0/g, "\\0")
}

// ============================================
// 3. URL 转义
// ============================================

/**
 * URL 参数转义
 * @param {string} unsafe
 * @returns {string}
 */
function escapeUrl(unsafe) {
  return encodeURIComponent(unsafe)
}

// ============================================
// 4. CSS 转义
// ============================================

/**
 * CSS 转义 - 防止 CSS 注入
 * @param {string} unsafe
 * @returns {string}
 */
function escapeCss(unsafe) {
  if (typeof unsafe !== 'string') return unsafe
  let escaped = ''
  for (let i = 0; i < unsafe.length; i++) {
    const char = unsafe.charCodeAt(i)
    if (char <= 0x1F || char >= 0x7F) {
      escaped += `\\${char.toString(16)} `
    } else {
      escaped += unsafe[i]
    }
  }
  return escaped
}

// ============================================
// 5. 白名单过滤
// ============================================

/**
 * 白名单验证 - 只允许指定字符
 * @param {string} input
 * @param {string} allowed - 允许的正则表达式
 * @returns {string}
 */
function whitelistFilter(input, allowed = '[a-zA-Z0-9._-]') {
  const regex = new RegExp(`(${allowed})*`)
  return input.match(regex)?.[0] || ''
}

/**
 * 移除所有 HTML 标签
 * @param {string} html
 * @returns {string}
 */
function stripTags(html) {
  return html.replace(/<[^>]*>/g, '')
}

// ============================================
// 6. CSP Header 生成器
// ============================================

/**
 * 生成 CSP 响应头
 * @param {Object} options - CSP 配置选项
 * @returns {string} CSP 策略字符串
 */
function generateCSP(options = {}) {
  const {
    defaultSrc = ["'self'"],
    scriptSrc = ["'self'"],
    styleSrc = ["'self'", "'unsafe-inline'"],
    imgSrc = ["'self'", "data:", "https:"],
    connectSrc = ["'self'"],
    fontSrc = ["'self'"],
    objectSrc = ["'none'"],
    mediaSrc = ["'self'"],
    frameSrc = ["'none'"],
    baseUri = ["'self'"],
    formAction = ["'self'"],
    frameAncestors = ["'none'"],
    reportUri = null,
    reportTo = null
  } = options

  const directives = []

  directives.push(`default-src ${defaultSrc.join(' ')}`)
  directives.push(`script-src ${scriptSrc.join(' ')}`)
  directives.push(`style-src ${styleSrc.join(' ')}`)
  directives.push(`img-src ${imgSrc.join(' ')}`)
  directives.push(`connect-src ${connectSrc.join(' ')}`)
  directives.push(`font-src ${fontSrc.join(' ')}`)
  directives.push(`object-src ${objectSrc.join(' ')}`)
  directives.push(`media-src ${mediaSrc.join(' ')}`)
  directives.push(`frame-src ${frameSrc.join(' ')}`)
  directives.push(`base-uri ${baseUri.join(' ')}`)
  directives.push(`form-action ${formAction.join(' ')}`)
  directives.push(`frame-ancestors ${frameAncestors.join(' ')}`)

  if (reportUri) directives.push(`report-uri ${reportUri}`)
  if (reportTo) directives.push(`report-to ${reportTo}`)

  return directives.join('; ')
}

// ============================================
// 7. 安全 Cookie 设置
// ============================================

/**
 * 生成安全的 Cookie 选项
 * @param {Object} options
 * @returns {Object}
 */
function getSecureCookieOptions(options = {}) {
  return {
    httpOnly: true,        // 防止 JavaScript 访问
    secure: true,          // 仅 HTTPS 传输
    sameSite: 'strict',    // 防止 CSRF
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 24小时
    ...options
  }
}

// ============================================
// 8. 安全响应头生成器
// ============================================

/**
 * 生成安全 HTTP 响应头
 * @returns {Object}
 */
function getSecurityHeaders() {
  return {
    // 防止点击劫持
    'X-Frame-Options': 'DENY',
    // 防止 MIME 类型嗅探
    'X-Content-Type-Options': 'nosniff',
    // 启用浏览器 XSS 过滤
    'X-XSS-Protection': '1; mode=block',
    // 限制引用来源
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // 权限策略
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    // CSP
    'Content-Security-Policy': generateCSP()
  }
}

// ============================================
// 9. Express 中间件
// ============================================

/**
 * XSS 防御中间件 - 自动转义响应
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
function xssProtection(req, res, next) {
  // 设置安全响应头
  const headers = getSecurityHeaders()
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  // 重写 res.json 和 res.send 以自动转义
  const originalJson = res.json.bind(res)
  const originalSend = res.send.bind(res)

  res.json = function(data) {
    // 递归转义对象中的字符串值
    const sanitized = sanitizeObject(data)
    return originalJson(sanitized)
  }

  res.send = function(data) {
    if (typeof data === 'string') {
      data = escapeHtml(data)
    }
    return originalSend(data)
  }

  next()
}

/**
 * 递归清理对象中的危险字符
 * @param {*} obj
 * @returns {*}
 */
function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return escapeHtml(obj)
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  if (obj && typeof obj === 'object') {
    const result = {}
    for (const [key, value] of Object.entries(obj)) {
      result[escapeHtml(key)] = sanitizeObject(value)
    }
    return result
  }
  return obj
}

// ============================================
// 10. 输入验证
// ============================================

/**
 * 验证并清理用户输入
 * @param {string} input
 * @param {Object} schema
 * @returns {Object}
 */
function validateInput(input, schema = {}) {
  const result = {
    valid: true,
    errors: [],
    sanitized: input
  }

  // 类型检查
  if (schema.type) {
    if (schema.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
      result.valid = false
      result.errors.push('Invalid email format')
    }
    if (schema.type === 'url' && !/^https?:\/\//.test(input)) {
      result.valid = false
      result.errors.push('Invalid URL format')
    }
  }

  // 长度检查
  if (schema.minLength && input.length < schema.minLength) {
    result.valid = false
    result.errors.push(`Minimum length is ${schema.minLength}`)
  }
  if (schema.maxLength && input.length > schema.maxLength) {
    result.valid = false
    result.errors.push(`Maximum length is ${schema.maxLength}`)
  }

  // 模式检查
  if (schema.pattern && !schema.pattern.test(input)) {
    result.valid = false
    result.errors.push('Input does not match required pattern')
  }

  // 转义输出
  if (schema.escape !== false) {
    result.sanitized = escapeHtml(input.trim())
  }

  return result
}

// ============================================
// 11. DOMPurify 替代品（简化版）
// ============================================

/**
 * 简化的 HTML 清理器
 * 注意：生产环境建议使用专业的 DOMPurify 库
 * @param {string} dirty
 * @param {Object} options
 * @returns {string}
 */
function sanitizeHtml(dirty, options = {}) {
  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    allowedAttributes = { a: ['href'] }
  } = options

  // 移除所有标签，只保留文本内容（简化版本）
  // 生产环境应使用 DOMPurify
  return stripTags(dirty)
}

// ============================================
// 导出所有函数
// ============================================

module.exports = {
  // 转义函数
  escapeHtml,
  escapeHtmlAttribute,
  escapeJs,
  escapeUrl,
  escapeCss,

  // 过滤函数
  whitelistFilter,
  stripTags,
  sanitizeHtml,
  sanitizeObject,

  // CSP
  generateCSP,

  // Cookie
  getSecureCookieOptions,

  // 响应头
  getSecurityHeaders,

  // 中间件
  xssProtection,

  // 验证
  validateInput
}

// ============================================
// 使用示例
// ============================================

if (require.main === module) {
  const express = require('express')
  const app = express()

  // 应用安全中间件
  app.use(xssProtection)

  // 解析请求体
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // 示例路由
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>XSS 防御示例</title>
      </head>
      <body style="font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px;">
        <h1>XSS 防御工具示例</h1>

        <h2>1. HTML 转义</h2>
        <form method="POST" action="/escape">
          <input type="text" name="input" placeholder="输入: &lt;script&gt;alert(1)&lt;/script&gt;" style="width: 300px; padding: 8px;">
          <button style="padding: 8px 16px;">转义</button>
        </form>

        <h2>2. CSP Header</h2>
        <pre style="background: #f5f5f5; padding: 10px;">${generateCSP()}</pre>

        <h2>3. 安全响应头</h2>
        <pre style="background: #f5f5f5; padding: 10px;">${JSON.stringify(getSecurityHeaders(), null, 2)}</pre>

        <h2>4. Cookie 选项</h2>
        <pre style="background: #f5f5f5; padding: 10px;">${JSON.stringify(getSecureCookieOptions(), null, 2)}</pre>
      </body>
      </html>
    `)
  })

  app.post('/escape', (req, res) => {
    const { input } = req.body
    const escaped = escapeHtml(input)
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>转义结果</title></head>
      <body style="font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px;">
        <h1>转义结果</h1>
        <h3>原始输入:</h3>
        <pre style="background: #f5f5f5; padding: 10px;">${input}</pre>
        <h3>转义后:</h3>
        <pre style="background: #e8f5e9; padding: 10px;">${escaped}</pre>
        <h3>渲染效果:</h3>
        <div style="border: 1px solid #ddd; padding: 10px;">${escaped}</div>
        <p><a href="/">返回</a></p>
      </body>
      </html>
    `)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`XSS 防御示例服务器运行在 http://localhost:${PORT}`)
  })
}
