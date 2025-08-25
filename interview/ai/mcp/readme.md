# mcp

## Functions call

- 可以让 LLM 突破自身知识和能力局限，通过调用外部工具来或 api 来获取实时·学习，执行计算或操作，从而获取最新数据或精确计算和外部系统交互的复杂任务

## mcp Model Context Protocol

- mcp 模型上下文协议

  - 是一个协议，web 开发的 restful 协议，讲如何讲外部资源暴露给 llm 的协议和编程风格
  - 是 Function Call 的升级版
  - 在 Function Call 比较乱的时候 mcp 统一的格式，让 llm 统一调用外部资源。
  - mcp 是 llm 和外界通信 调用地图 搜索引擎，mcp 规定了标准上下文交换方式
  - 让大模型能调用 API 一样去访问外部能力

- 支持 mcp 客户端 cline

## 举例

- 高德地图 mcp ，帮我规划从公司到机场都路线
- 模型根据高德地图 mcp 插件，获取实时交通工具和交通数据

## 意义

- LLM 输出更可靠
- 降低集成成本
- 数据安全可控
- 高德地图接入 mcp 就想 LLM 的眼睛和耳朵 ，让 AI 理解和使用实时世界

## mcp

- mcp server 是基于 mcp 协议的服务器软件
- 定义 tool
- LLM
- MCP Client cline/cursor
- 配置 mcp server
- LLM --> client --> server Transport 通信
