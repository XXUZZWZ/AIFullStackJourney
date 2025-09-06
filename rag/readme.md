# rag

- MCP 定义了 LLM 和外部知识库检索

- RAG 给 LLM 提供 丰富的上下文
- 检索
  - 律师 ppt code 知识库
    prompt -> 知识库检索 embedding -> prompt + 知识库 + 返回结果
  - 如何在知识库了，根据 prompt 找道相关的那一段内容交给大模型
  - embedding
