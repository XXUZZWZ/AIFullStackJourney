import { healthAgent } from "./src/agents/healthAgent.js";

async function main() {
  console.log("--- Health Agent initialized ---");
  
  try {
    const response = await healthAgent.invoke({
        messages: [
            { role: "user", content: "我身高175，体重90公斤，最近老点炸鸡吃，能不能帮我看看怎么减肥？我有空的时候是晚上。" }
        ]
    });
    console.log("\nAgent Response:");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Error running agent:", error);
  }
}

main();
