import { createAgent } from "langchain";
import { calculateBMI } from "./src/tools/bmi.js";
import { analyzeDietHabit, evaluateFoodItem } from "./src/tools/diet.js";
import { queryExerciseDatabase } from "./src/agents/workoutAgent.js";
import { getMotivationQuote } from "./src/agents/motivationAgent.js";
import { userSimAgent } from "./src/agents/userSimAgent.js";

// Common instruction for all agents
const STOP_INSTRUCTION = `
IMPORTANT:
You are participating in a roundtable discussion.
If you believe the current plan (Diet + Workout + Motivation) is COMPLETE, SAFE, and DOABLE, and you have NO further objections or additions, you MUST end your response with the exact string: "AGREE_TO_STOP".
Otherwise, continue to discuss, propose changes, or ask questions.
`;

// 1. Diet Agent
const dietAgent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [calculateBMI, analyzeDietHabit, evaluateFoodItem],
    systemPrompt: `You are a Diet & Nutrition Expert. Focus on food, calories, and nutrition.
    Critique the workout plan if it's too intense for the diet.
    Collaborate with the Workout Expert and Motivation Coach.
    ${STOP_INSTRUCTION}`
});

// 2. Workout Agent
const workoutAgent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [queryExerciseDatabase],
    systemPrompt: `You are a Fitness & Workout Expert. Focus on exercise, cardio, and strength training.
    Ensure the workout fits the user's diet energy levels.
    Be mindful of the Motivation Coach's advice on burnout.
    ${STOP_INSTRUCTION}`
});

// 3. Motivation Agent
const motivationAgent = createAgent({
    model: "claude-sonnet-4-5-20250929",
    tools: [getMotivationQuote],
    systemPrompt: `You are a Motivation & Psychology Coach. Focus on mental health, habits, and sustainability.
    If the Diet or Workout plans seem too strict, intervene!
    Encourage the user and other agents.
    ${STOP_INSTRUCTION}`
});

async function runDiscussion() {
    // Initial User Input
    const userQuery = "我身高175，体重90公斤，最近老点炸鸡吃，能不能帮我看看怎么减肥？我有空的时候是晚上。";
    
    // Global conversation history
    // We use a simple array of objects that we will pass to the agents
    // We format previous agents' outputs as "user" or "assistant" messages with prefixes
    let messages = [
        { role: "user", content: userQuery }
    ];
    
    console.log(`\n=== User: ${userQuery} ===\n`);

    const maxTurns = 20; // Safety break
    let turn = 0;

    while (turn < maxTurns) {
        turn++;
        console.log(`\n--- Round ${turn} ---\n`);
        
        // --- Agent 1: Diet ---
        const dietResponse = await dietAgent.invoke({ messages: messages });
        const dietMsg = dietResponse.messages[dietResponse.messages.length - 1];
        let dietContent = typeof dietMsg.content === 'string' ? dietMsg.content : JSON.stringify(dietMsg.content);
        console.log(`\n🍏 Diet Expert:\n${dietContent}`);
        messages.push({ role: "assistant", content: `[Diet Expert]: ${dietContent}` });


        // --- Agent 2: Workout ---
        const workoutResponse = await workoutAgent.invoke({ messages: messages });
        const workoutMsg = workoutResponse.messages[workoutResponse.messages.length - 1];
        let workoutContent = typeof workoutMsg.content === 'string' ? workoutMsg.content : JSON.stringify(workoutMsg.content);
        console.log(`\n💪 Workout Expert:\n${workoutContent}`);
        messages.push({ role: "assistant", content: `[Workout Expert]: ${workoutContent}` });

        // --- Agent 3: Motivation ---
        const motivationResponse = await motivationAgent.invoke({ messages: messages });
        const motMsg = motivationResponse.messages[motivationResponse.messages.length - 1];
        let motContent = typeof motMsg.content === 'string' ? motMsg.content : JSON.stringify(motMsg.content);
        console.log(`\n❤️ Motivation Coach:\n${motContent}`);
        messages.push({ role: "assistant", content: `[Motivation Coach]: ${motContent}` });

        // --- Agent 4: User Simulator ---
        // 用户听到以上专家的建议，做出反应
        // 注意：用户 Agent 的系统提示词已经包含了 "AGREE_TO_STOP" 的逻辑
        const userSimResponse = await userSimAgent.invoke({ messages: messages });
        const userMsg = userSimResponse.messages[userSimResponse.messages.length - 1];
        let userContent = typeof userMsg.content === 'string' ? userMsg.content : JSON.stringify(userMsg.content);
        console.log(`\n👤 User (Simulated):\n${userContent}`);
        messages.push({ role: "user", content: userContent });

        // --- Check for Consensus ---
        // 只有当所有专家 AND 用户都同意停止时，才停止
        const last4 = [dietContent, workoutContent, motContent, userContent];
        const allAgreed = last4.every(content => content.includes("AGREE_TO_STOP"));

        if (allAgreed) {
            console.log("\n\n✅ CONSENSUS REACHED: All agents AND the user agreed to stop.");
            break;
        } else {
             console.log("\n... Discussion continues ...");
        }
    }
    
    if (turn >= maxTurns) {
        console.log("\n\n⚠️ Max turns reached. Stopping discussion.");
    }
}

runDiscussion();
