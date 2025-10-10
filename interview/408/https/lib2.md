### HTTPS 链接全过程（精炼版）

- DNS 解析

  - 浏览器先查缓存，再向 DNS 服务器查询域名的 A/AAAA 记录，得到服务器 IP。
  - 可能还会查 CNAME、并缓存 TTL。

- 建立传输层连接

  - HTTPS over TCP(HTTP/1.1、HTTP/2)：进行 TCP 三次握手。
  - HTTPS over QUIC(HTTP/3)：基于 UDP，TLS 1.3 集成在 QUIC 中，无传统 TCP 握手。

- TLS 握手（核心）

  - 目标：协商协议版本与套件、验证服务器身份、建立对称加密会话密钥。
  - TLS 1.3（主流）典型流程：
    1. ClientHello：支持的 TLS 版本/套件、SNI(告诉服务端访问的域名)、ALPN(协商 HTTP/1.1 或 HTTP/2/3)、随机数、密钥交换参数。
    2. ServerHello：选择的版本/套件、随机数、密钥交换参数。
    3. EncryptedExtensions：附加扩展（如 ALPN 结果等）。
    4. Certificate：服务端证书链（站点证书 → 中间 CA → 根 CA）。
    5. CertificateVerify：服务端用私钥对握手数据签名，证明“证书持有者”确实是服务端。
    6. Finished：服务端发完成消息。
    7. 客户端验证证书链（受信任根 CA）、校验域名、有效期、撤销状态（OCSP/CRL，常用 OCSP Stapling）。
    8. 客户端计算主密钥，生成会话密钥，发送 Finished。
    9. 后续应用数据用对称密钥与 AEAD 算法（如 AES-GCM/ChaCha20-Poly1305）加密。
  - TLS 1.2（对比要点）：握手往返更多；消息包括 ServerHelloDone、ChangeCipherSpec；前向保密依赖 ECDHE；套件协商与密钥派生流程更复杂。

- 证书与身份校验

  - 验证证书链到本地受信根；匹配访问域名（含 SAN）；校验有效期与撤销状态；算法与密钥长度安全性。
  - 服务器可能启用 OCSP Stapling 减少在线查询时延。

- 建立对称加密通道

  - 使用 ECDHE 实现前向保密（PFS）：即使服务器私钥泄露，也解不开历史流量。
  - 双方基于握手材料派生读/写密钥，用于后续数据加密与完整性校验（MAC/AEAD）。

- 发送 HTTP 请求/响应（加密传输）

  - 浏览器发送加密的 HTTP 请求；服务端返回加密的 HTTP 响应。
  - HTTP/2 会多路复用流；HTTP/3 依赖 QUIC 的流复用与丢包不阻塞。

- 会话复用与 0-RTT

  - 会话恢复/票据（Session Resumption）：减少后续连接握手开销。
  - TLS 1.3 可用 0-RTT（早期数据），有重放风险，仅适合幂等请求。

- 安全增强点（常见）

  - HSTS：强制域名仅以 HTTPS 访问，防降级与中间人引导 http。
  - SNI：在同一 IP 上通过域名选择证书（TLS 1.3 中可配合 ESNI/Encrypted ClientHello 以隐藏域名，实际落地为 ECH）。
  - ALPN：协商使用 HTTP/1.1、HTTP/2 或 HTTP/3。
  - Mixed Content 防护：禁止或警告在 HTTPS 页面加载 http 资源。

- 常见性能优化
  - TLS 1.3 减少往返；会话复用、OCSP Stapling、HTTP/2/3 多路复用、ECDSA 证书（签名更快）、合理的密钥交换参数。

### 一句话总结

HTTPS 通过 DNS→TCP/QUIC→TLS 握手 → 证书校验 → 密钥协商 → 加密的 HTTP 传输，确保机密性、完整性与服务器身份可信；TLS 1.3 让握手更快、更安全，并支持会话复用与 0-RTT。

- 如果你需要，我可以画一张时序图（含 TLS 1.3 与 1.2 对比）或结合你当前 `interview/408/https` 下的笔记做结构化整理。
