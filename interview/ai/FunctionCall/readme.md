# Function Call

- LLM
  调用 API 有什么缺点
  - LLM 提前训练好的，只知道训练前的数据
  - 提供 知识库私有，更懂相关信息
  - 不安全 RAG
  - 给模型添加调用外部的能力
- Function Call

  - 简洁，强大

- Function Call 机会

- 根据 chat api 调用 变成两步
  - 根据 prompt 和 tools 中的 description 生成 function
  - 根据 function call 生成 json
  - 根据 json 调用 function
  - 函数调用
    - message.tools 返回格式比如： { "name": "get_current_weather", "arguments": { "location": "Boston, MA" } }
