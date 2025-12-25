import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { workoutAgent } from "../agents/workoutAgent.js";

export const designWorkoutPlan = tool(
  async (input) => {
    // 调用子 Agent 来生成计划
    // 这里我们将主 Agent 的工具调用参数转化为子 Agent 的输入
    const subAgentResponse = await workoutAgent.invoke({
        messages: [
            { 
                role: "user", 
                content: `请为我设计一个训练计划。可用时间: ${input.available_time}。身体限制: ${input.limitations || "无"}。目标: 减脂。` 
            }
        ]
    });

    // 提取子 Agent 的最终回复
    // 注意：不同的 Agent 实现返回结构可能不同，这里假设返回结构与主 Agent 类似
    const lastMessage = subAgentResponse.messages[subAgentResponse.messages.length - 1];
    return typeof lastMessage.content === 'string' ? lastMessage.content : JSON.stringify(lastMessage.content);
  },
  {
    name: "design_workout_plan",
    description: "Design a workout plan based on user's schedule and physical condition. Delegates to a specialized workout coach agent.",
    schema: z.object({
      available_time: z.string().describe("User's available time slots for workout"),
      limitations: z.string().optional().describe("Any physical limitations or injuries"),
    }),
  }
);
