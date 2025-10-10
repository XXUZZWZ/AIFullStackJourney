# http & https

- Http 是超文本传输协议，是一种 用于传输超媒体应用层协议

- HTTPS 是 HTTP 的安全版本,多了一层 SSL/TLS 层

- OSI 七层

  - 应用层 GET 提供用户接口 GET /HTTP 还有 websocket 协议 还有 RPC 协议 FTP
  - 表示层
  - 会话层
  - 传输层 TCP/UDP 可靠到达 or 不可靠
  - 网络层 IP 确定目标
  - 数据链路层 MAC 确定源
  - 物理层 物理介质层

  - https 怎么建立的？
  - 中间人攻击
  - 对称加密 非对称加密

    - 私钥 公钥
    - 公钥 任何人都可以拿到
    - 对称加密
    - 非对称加密
    - 权威证书颁发机构
    - 对称加密 放心交出去
    - 以后都是用 对称加密

    - TLS 1.3 比较快

## TLS 1.3 握手与 HTTPS 时序图（含 TCP）

```mermaid
sequenceDiagram
    autonumber
    participant B as 浏览器/客户端
    participant D as DNS
    participant S as 服务器

    Note over B: 用户输入 https://example.com
    B->>D: 查询 A/AAAA (example.com)
    D-->>B: 返回 IP 和 TTL

    Note over B,S: TCP 三次握手（HTTP/1.1/2 情况）
    B->>S: SYN
    S-->>B: SYN-ACK
    B->>S: ACK

    Note over B,S: TLS 1.3 握手开始
    B->>S: ClientHello\n(SNI, ALPN, supported_groups, key_share, random)
    S-->>B: ServerHello\n(选择的套件/组, key_share, random)
    S-->>B: EncryptedExtensions\n(ALPN 等扩展)
    S-->>B: Certificate\n(证书链)
    S-->>B: CertificateVerify\n(用证书私钥对握手签名)
    S-->>B: Finished
    Note over B: 验证证书链/域名/有效期/撤销(OCSP Stapling)
    B->>S: Finished\n(派生会话密钥后)

    Note over B,S: 建立对称加密通道 (AEAD: AES-GCM/ChaCha20-Poly1305)\n前向保密：ECDHE
    B->>S: 加密的 HTTP 请求
    S-->>B: 加密的 HTTP 响应

    alt 会话恢复 / 0-RTT（可选）
        Note over B,S: 后续连接可使用会话票据减少往返\n0-RTT 仅适合幂等请求，存在重放风险
    end
```

## TLS 1.2 握手与 HTTPS 时序图（对比参考）

```mermaid
sequenceDiagram
    autonumber
    participant B as 浏览器/客户端
    participant D as DNS
    participant S as 服务器

    B->>D: 查询 A/AAAA (example.com)
    D-->>B: 返回 IP

    Note over B,S: TCP 三次握手
    B->>S: SYN
    S-->>B: SYN-ACK
    B->>S: ACK

    Note over B,S: TLS 1.2 握手开始
    B->>S: ClientHello\n(版本, 套件列表, 扩展)
    S-->>B: ServerHello\n(选择版本/套件)
    S-->>B: Certificate\n(证书链)
    opt ECDHE 情况
        S-->>B: ServerKeyExchange\n(椭圆曲线参数, 签名)
    end
    S-->>B: ServerHelloDone
    B->>S: ClientKeyExchange\n(密钥交换材料)
    B->>S: ChangeCipherSpec
    B->>S: Finished
    S-->>B: ChangeCipherSpec
    S-->>B: Finished

    Note over B,S: 后续 HTTP 为对称加密传输
```

## 备注

- SNI/ALPN：在 ClientHello/EncryptedExtensions 中协商域名与 HTTP 版本。
- OCSP Stapling：服务器附带 OCSP 响应，减少在线查询时延。
- HSTS：强制仅走 HTTPS，防降级与中间人引导。
- HTTP/3（QUIC）：基于 UDP，将 TLS 1.3 集成在传输层握手中，时序不同于上述 TCP 流程。
  - 公钥任何浏览
