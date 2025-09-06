import OpenAI from "openai";
import { config } from "dotenv";

config();

// console.log(process.env.OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const messages = [
  {
    role: "system",
    content: "你是一个助教",
  },
];

// async function noMemoryChat() {
//   const res1 = await client.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "user",
//         content: "我的名字是AnyHone",
//       },
//     ],
//   });
//   console.log("第一次回复", res1.choices[0].message.content);
//   const res2 = await client.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "user",
//         content: "我的名字是？",
//       },
//     ],
//   });
//   console.log("第二次回复", res2.choices[0].message.content);
// }

async function memoryChat(userInput) {
  messages.push({
    role: "user",
    content: userInput,
  });
  const res = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  const reply = res.choices[0].message.content;
  messages.push({
    role: "assistant",
    content: reply,
  });
  console.log(reply);
  return reply;
}

async function demo() {
  await memoryChat("我的名字是AnyHone");
  await memoryChat("我的名字是？");
}

demo();
