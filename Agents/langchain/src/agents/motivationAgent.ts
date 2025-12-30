import { createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

// 简单的心理鼓励语录库
const MOTIVATIONAL_QUOTES = [
  "坚持就是胜利！",
  "每一个微小的改变都算数。",
  "不要关注体重秤上的数字，要关注你的感受。",
  "自律给我自由。",
  "相信自己，你可以做到的！",
  "失败不是终点，放弃才是。",
  "种一棵树最好的时间是十年前，其次是现在。"
];

export const getMotivationQuote = tool(
  () => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    return randomQuote;
  },
  {
    name: "get_motivation_quote",
    description: "Get a random motivational quote to encourage the user.",
    schema: z.object({})
  }
);

export const motivationAgent = createAgent({
  model: "claude-sonnet-4-5-20250929",
  tools: [getMotivationQuote],
  systemPrompt: `你是一个专业的心理咨询师和动力教练 Agent。
你的职责是关注用户在减肥过程中的心理状态和动力维持。
你需要：
1. 观察其他专家的建议（饮食和运动），评估其对用户心理的压力。
2. 如果建议太难执行，提出异议，要求简化。
3. 提供心理支持技巧，如建立习惯、应对压力进食等。
4. 适时使用名言警句来鼓励大家。
你的目标是确保方案不仅科学，而且"反人性"程度低，容易坚持。`
});
