# xss 跨站脚本攻击

- XSS 攻击者把恶意脚本注入页面中，让浏览器执行

- 存储型

  - 攻击者把恶意脚本存储到数据库中，当用户访问页面时，脚本会被浏览器执行
  - 拿到 cookie 发送到攻击者的网站
    - Cookie httpOnly 防止 Xss
    - 不能相信用户的输入，对用户的输入进行转义
    - <script> ===> &lt;script&gt; 这样就不会造成xss
    - html 转义 &lt;script&gt; 转义成 html 符号

- DOM 型 输入立即执行

- 反射型

  - https://victim.com/search?q="><script>alert(1)</script>
  - https://victim.com/?name=" onmouseover="alert(1)
  - https://victim.com/?msg=';alert(1);//
  - http://example.com/search?keyword=<script>alert('XSS')</script> const keyword = new URLSearchParams(location.search).get('keyword'); document.getElementById('result').innerHTML = 搜到 "${keyword}" 的结果;
  - 过滤或限制特殊字符<> &lt; &gt; 在服务器端对动态内容进行 Html 编码

- 在 encodeURI/encodeURIComponent

- vue /react
  - 前端转译为 DOMPurify
- cookie httpOnly 安全
