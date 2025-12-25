import { createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

// --- 健身子 Agent 的专用工具 ---

const queryExerciseDatabase = tool(
  (input) => {
    // 模拟查询动作库
    // 实际场景：可以查 RAG 或数据库
    const db = {
      "fat_loss": ["波比跳", "开合跳", "高抬腿", "游泳", "慢跑"],
      "muscle_gain": ["卧推", "深蹲", "硬拉", "引体向上"],
      "low_impact": ["快走", "游泳", "椭圆机", "瑜伽"]
    };
    
    // 简单的模拟逻辑
    if (input.goal === "fat_loss" && input.limitations?.includes("knee_pain")) {
        return JSON.stringify(["游泳", "椭圆机", "上半身力量训练"]);
    }
    return JSON.stringify(db[input.goal as keyof typeof db] || ["快走"]);
  },
  {
    name: "query_exercise_db",
    description: "Query specific exercises based on fitness goal and physical limitations.",
    schema: z.object({
      goal: z.enum(["fat_loss", "muscle_gain", "low_impact"]).describe("Fitness goal"),
      limitations: z.string().optional().describe("Physical limitations"),
    })
  }
);

// --- 健身子 Agent 定义 ---

export const workoutAgent = createAgent({
  model: "claude-sonnet-4-5-20250929", // 子 Agent 可以用更垂直或更小的模型，这里暂用同一个
  tools: [queryExerciseDatabase],
  systemPrompt: `你是一个专业的健身教练 Agent (Sub-Agent)。
你的唯一职责是制定详细的训练计划。
你需要根据用户的时间、目标和身体限制，查询动作库，然后组合成一个可执行的计划。
输出格式必须清晰，包含热身、正式训练和拉伸环节。
不要给饮食建议，只专注于运动。`
});
