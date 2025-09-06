let summary = "用户的基本信息";

const messages = []

async function smartChat(userInput){
  messages.push({
    role:"user",
    content:userInput
  })
}