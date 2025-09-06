const fs = require("fs");
// 帮助我们读取文件
const path = require("path");

const { OpenAI } = require("openai");

require("dotenv").config();

// 模型选择
// ollama 模型选择
// 给他喂私有的知识库，不怕私有大模型训练了
// 安全
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const testQuestion = "我们有多少课程？";

const readCourseInfo = () => {
  // 读取本地文件
  try {
    const courseInfo = fs.readFileSync(
      path.resolve(__dirname, "./lesson.txt"),
      "utf-8"
    );
    return courseInfo;
  } catch (error) {
    console.error("读取课程信息失败", error);
    return "";
  }
};

async function answerQuestion(question) {
  // 检索
  const courseInfo = readCourseInfo();
  console.log(courseInfo);
  if (!courseInfo) return "无法读取课程信息，请确保文件是否存在";
  try {
    const prompt = `
      你是一个课程助手，请根据以下信息回答问题。
      只回答和课程信息相关的内容，如果内容和课程无关，
      请礼貌的说明和课程相关的问题
      课程信息：
      ${courseInfo}

      问题 ${question}
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个专业课程助手，请根据课程信息回答问题",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 200,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("回答问题失败", error);
    return "回答问题失败，请稍后重试";
  }
}

answerQuestion(testQuestion).then((res) => {
  console.log(res);
});
