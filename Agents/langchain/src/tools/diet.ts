import { tool } from "@langchain/core/tools";
import * as z from "zod";

export const analyzeDietHabit = tool(
  (input) => {
    // 模拟分析逻辑
    // TODO: Connect to RAG or external nutrition database
    return `分析了用户提供的订单: ${input.orders.join(", ")}。\n发现高油高盐食物占比过高。建议减少油炸食品摄入。`;
  },
  {
    name: "analyze_diet_habit",
    description: "Analyze user's dietary habits based on a list of food orders.",
    schema: z.object({
      orders: z.array(z.string()).describe("List of food items or orders"),
    }),
  }
);

export const evaluateFoodItem = tool(
  (input) => {
    // 这里未来可以接入 RAG 知识库
    // TODO: Connect to RAG or external nutrition database
    return `正在评估: ${input.food_name}。这通常是一道高热量菜肴，建议作为欺骗餐偶尔食用，不要作为日常正餐。`;
  },
  {
    name: "evaluate_food_item",
    description: "Evaluate if a specific food item is healthy or suitable for weight loss.",
    schema: z.object({
      food_name: z.string().describe("Name of the food item"),
    }),
  }
);
