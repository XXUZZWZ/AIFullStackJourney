let summary = "用户的基本信息";

const messages = [];

async function smartChat(userInput) {
  messages.push({
    role: "user",
    content: userInput,
  });
  if (messages.length > 10) {
    const sumRes = await clientInformation.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "请你总结一下对话的关键信息" },
        ...messages,
      ],
    });
    summary = sumRes.choices[0].message.content;
    messages.splice(0, messages.length); // 清空老对话
    const res = await clientInformation.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个助教，这是目前对话总结 ：" + summary,
        },
        ...messages,
      ],
    });
  }
}
