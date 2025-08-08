# 进阶跨域方案

- 日常用的最多的跨域解决方案
  jsonp 不跨域
  cors 跨域的
  浏览器会发送 **CORS** 请求，如果服务器的响应头中设置了 `Access-Control-Allow-Origin: *`
  后端实现了 CORS 跨域，可以跨域访问

  - `*`
  - 白名单 `http://localhost:8080`
  - 简单跨域请求

- cors 请求头设置方案
  - GET /POST /HEAD 请求 简单设置 Access-Control-Allow-Origin:` *` 就好 不会有预检请求
  - 请求头 Content-Type 为 text/plain mutipart/form-data application/x-www-form-urlencoded
    其他请求就会被认为是复杂请求
    Access-Control-Allow-Methods
    Access-Control-Allow-Headers 头里带别的东西 要在这里设置
    Access-Control-Max-Age
  - 其他复杂跨域请求
    - 其他的方法，安全升级
      - 预检请求
      - METHOD OPTIONS
    - 真正的请求跨域请求
