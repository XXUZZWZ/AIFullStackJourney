import { tool } from "@langchain/core/tools";
import * as z from "zod";

export const calculateBMI = tool(
  (input) => {
    const heightInMeters = input.height / 100;
    const bmi = input.weight / (heightInMeters * heightInMeters);
    let category = "";
    if (bmi < 18.5) category = "偏瘦 (Underweight)";
    else if (bmi < 24) category = "正常 (Normal weight)";
    else if (bmi < 28) category = "超重 (Overweight)";
    else category = "肥胖 (Obesity)";
    
    return JSON.stringify({
      bmi: bmi.toFixed(1),
      category: category,
      advice: category === "肥胖" || category === "超重" ? "建议控制饮食并增加运动。" : "继续保持健康的生活方式。"
    });
  },
  {
    name: "calculate_bmi",
    description: "Calculate BMI based on weight (kg) and height (cm). Use this when the user provides their physical stats.",
    schema: z.object({
      weight: z.number().describe("Weight in kg"),
      height: z.number().describe("Height in cm"),
    }),
  }
);
