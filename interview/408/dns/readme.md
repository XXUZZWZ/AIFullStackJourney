# dns

- 全称 Domain Name System 域名系统

- 把好理解和记忆的域名解析成 IP 地址的分布式数据库系统。浏览器在真正发起 HTTPS 请求前，通常会先进行一次 DNS 解析。

- 命令与流程

  - ping www.baidu.com 递归查找过程
  - 补充“URL 输入到页面显示”的第一个阶段
  - dns 浏览器缓存
    URL 输入 → 浏览器补全 → DNS 解析
    ├─ 浏览器 DNS 缓存 (chrome://net-internals/#dns)
    ├─ 操作系统 DNS 缓存 (ipconfig /displaydns)
    ├─ Hosts 文件手动配置
    └─ 本地 DNS 服务器递归查询 → 根 → TLD → 权威服务器

  - DNS 递归查询总结

    - 定义：客户端把域名交给本地递归解析器，由解析器“代劳到底”，返回最终记录或失败。
    - 流程：先查本地缓存 → 根（.）→ 顶级域（TLD）→ 权威 DNS → 返回记录并按 TTL 缓存。
    - 与迭代区别：递归由解析器跑全流程；迭代只给“下一跳”，由发起方自己继续问。
    - 优缺点：优—客户端简单、命中缓存快；缺—解析器负载高、放大攻击风险，需 DNSSEC 防缓存投毒。
    - 报文字段：RD（Recursion Desired，期望递归）、RA（Recursion Available，支持递归）。
    - 示例：查 www.example.com → 若无缓存：根 → .com → example.com 权威 → 得到 A/AAAA 记录。

  - 比如我们会把本机 IP 配公司域名，那么开发效果和线上效果一样
    那么开发效果就可以和线上域名一样，更安全
    开发中经常用
  - 如果浏览器缓存、操作系统缓存和 hosts 都没有命中
    - 分布式数据库：key => value（key 为域名，value 为 IP）
    - 递归解析器内置根服务器地址列表（IANA 公布的 13 组根服务器）
  - 根域名服务器（Root）
    - 返回对应顶级域（TLD，如 .com）服务器的地址
  - 顶级域名服务器（TLD）
    - 返回目标域名的权威 DNS 服务器地址（如 baidu.com 的权威）
  - 权威服务器（Authoritative）
    - 返回最终的记录（A/AAAA/CNAME 等，对应 IP 地址等）
  - 局域网 -> 城域网 (电信或移动服务商)

- 设备使用 IP 地址进行 TCP 三次握手，建立连接后通过 HTTP/HTTPS 发起请求，网页返回并渲染

- 如何做 dns 优化
  - `<link rel="dns-prefetch" href="//g.alicdn.com">`
    标签 作用 适用场景
  - dns-prefetch 仅提前解析域名 轻量优化，适合静态 CDN 域名
  - preconnect 提前建立 TCP + TLS + HTTP/2 连接 资源较大或重要时，能显著减少首包延迟
  - prefetch 预加载可能用到的资源（**低优先级**） 用户未来可能点击的页面资源
  - preload 强制预加载一定会用到的资源（**高优先级**）
  - 面试时可以顺手说一句：dns-prefetch 和 preconnect 经常配合使用。
    例如淘宝、京东等站点会写成：
    <link rel="dns-prefetch" href="//g.alicdn.com">
    <link rel="preconnect" href="//g.alicdn.com" crossorigin>
- 为啥要 ping www.shifen.com (183.2.172.177)
  - a.shifen.com 是什么意思？
    - 解释：`a.shifen.com` 是百度旗下域名 `shifen.com` 的子域，常作为 CNAME 目标（别名记录）。
    - 作用：用于流量调度/CDN 加速/多活部署，权威 DNS 会按地区/运营商/时段返回就近或更优的 A 记录 IP。
    - 现象：不同地区/运营商解析结果不同（如 183.2.172.177），属于负载均衡与就近接入的正常行为。
    - 命名：`a` 多为分片或业务前缀（也可能出现 `b`/`c` 等），用于区分线路、集群或策略。
    - 验证：`nslookup`/`dig` `www.baidu.com` 往往可见其 CNAME 到 `www.a.shifen.com`（或类似），再进一步解析到多条 A 记录。
  - 域名背后是一堆服务器（分布式，分布在多地机房）
  - 负载均衡
    - 目标：向客户端返回合适的 IP（就近/低延迟/健康可用）
    - 常见算法：随机、轮询、最少连接、加权、基于健康检查的优选
    - 目标效果：容灾、高可用、高性能
  - CDN 服务器
    - Content Delivery Network（内容分发网络）
    - 内容分发网络
    - 访问内容分成两部分
    - 动态的，走中央服务器
    - 静态的 css js jpg CDN
  - 双 11
    - 活动前就把相关内容放到各个 CDN
