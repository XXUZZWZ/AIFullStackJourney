import { createAgent } from "langchain";
import { calculateBMI } from "../tools/bmi.js";
import { analyzeDietHabit, evaluateFoodItem } from "../tools/diet.js";
import { designWorkoutPlan } from "../tools/workout.js";

// 定义 System Prompt
const SYSTEM_PROMPT = `你是一个专业的健康瘦身顾问 Agent。
你的目标是通过科学的数据分析，帮助肥胖人群改善健康状况。
请根据用户的具体情况调用合适的工具。
在给出建议时，要语气温和、鼓励，并且专业。
如果用户没有提供身高体重，请先礼貌询问以计算 BMI。
对于饮食建议，要结合用户的外卖习惯给出切实可行的替代方案。`;

export const healthAgent = createAgent({
  model: "claude-sonnet-4-5-20250929", 
  tools: [calculateBMI, analyzeDietHabit, evaluateFoodItem, designWorkoutPlan],
  systemPrompt: SYSTEM_PROMPT,
});
