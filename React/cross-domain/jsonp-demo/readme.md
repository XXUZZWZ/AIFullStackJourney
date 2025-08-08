# 封装的 JSONP

- 只能解决 get 请求的跨域请求
  - http://localhost:3000/say?callback=fn&wd=zf
- 需要后端配合，要改变后段输出的方式 要加 padding

- 不太安全
  - 全局挂载在一个 show callback 函数 容易被黑客利用
