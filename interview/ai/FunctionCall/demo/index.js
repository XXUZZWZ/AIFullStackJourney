// 引入 OpenAI SDK（ES Module 语法）
import OpenAI from "openai"; // es6 module

// 初始化 OpenAI 客户端
// 注意：apiKey 建议使用环境变量读取，避免明文出现在代码仓库中
// baseURL 指向代理/网关服务，也可以使用官方默认值
const client = new OpenAI({
  apiKey: "sk-h91KBBHUC30pbiviNhD9I5YnyC7gcdd4CzPCKJcMhnkm7IT9",
  baseURL: "https://api.302.ai/v1",
});
// 本地模拟的工具函数：根据城市返回天气信息
// 实际项目中可在此处调用第三方天气 API，然后把结果规范化返回
const getWeather = async (city) => {
  // 这里为了演示，直接返回固定的假数据
  return {
    weather: "晴天",
    temperature: 20,
  };
};
// 主流程：演示函数调用（Function Calling）的闭环
async function main() {
  // 1) 构造用户消息（用户问题）
  const userMessage = {
    role: "user",
    content: "今天抚州天气怎么样?",
  };
  // 2) 首次向模型发送请求，并声明可用的工具（tools）
  //    如果模型判断需要调用工具，它会在返回中附带 tool_calls
  const resp = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [userMessage],
    // LLM 使用的工具（声明模型可调用的函数）
    tools: [
      {
        // 工具类型为函数型
        type: "function",
        function: {
          // 工具名称（需要与实际本地实现对应）
          name: "getWeather",
          // 工具用途描述（帮助模型何时、如何使用该工具）
          description: "获取某个城市的天气",
          // 入参的 JSON Schema（约束工具可被如何调用）
          parameters: {
            type: "object",
            properties: {
              // 唯一必填参数：城市名
              city: {
                type: "string",
              },
            },
            required: ["city"],
          },
        },
      },
    ],
  });

  // 3) 读取模型返回，检查是否包含工具调用
  const choice = resp.choices?.[0];
  const message = choice?.message;
  // 没有拿到有效的消息，直接打印完整响应以便排查
  if (!message) {
    console.log("无有效消息：", resp);
    return;
  }
  // 可能有多个工具调用，这里只演示处理第一个
  const toolCall = message.tool_calls?.[0];
  // 模型没有触发工具调用，直接打印模型自然语言回复
  if (!toolCall) {
    console.log("未触发工具调用。模型回复：", message.content);
    return;
  }
  console.log("大模型想调用", toolCall);

  // 4) 解析模型给到的工具参数（字符串 JSON → 对象）
  let args = {};
  try {
    args = toolCall.function?.arguments
      ? JSON.parse(toolCall.function.arguments)
      : {};
  } catch (err) {
    console.log("解析工具参数失败：", toolCall.function?.arguments, err);
    return;
  }

  // 调用本地实现的工具函数，得到结构化结果
  const toolResult = await getWeather(args.city);

  // 5) 将工具结果作为 tool 消息回传，获取最终自然语言回答
  const followup = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      // 用户原始问题
      userMessage,
      // 上一步模型返回的 assistant 消息（携带 tool_calls）
      message, // assistant 携带 tool_calls 的消息
      {
        // 工具返回消息，需要带上对应的 tool_call_id
        role: "tool",
        tool_call_id: toolCall.id,
        // 一些网关/SDK会读取 name 字段用于路由，此处保持与声明一致
        name: toolCall.function.name,
        // 将结构化结果转成字符串放入 content
        content: JSON.stringify(toolResult),
      },
    ],
  });

  // 6) 输出最终自然语言回答（若未取到则打印原始对象便于排查）
  const finalMsg = followup.choices?.[0]?.message;
  console.log("最终回答：", finalMsg?.content ?? finalMsg);
}

main();
