"use client"
// hooks
import {
  useChat
}from '@ai-sdk/react'
import ChatOutput from '@/components/ChatOutput/ChatOutput'
import ChatInput from '@/components/ChatInput/ChatInput'
import {ReactMarkdown} from 'react-markdown'

export default function Home() {
  // chat LLM  业务 抽离
  const {
    input,
    messages,// 消息列表
    status,// 状态
    handleInputChange,// 输入框变化
    handleSubmit, // 提交
  } = useChat() 
  return (
    <main className="max-w-3xl mx-auto p-4">
     <h1 className="text-xl font-semibold mb-4">PhoneGPT</h1>
     <div className="space-y-4 mb-4 max-h-[80vh] overflow-y-auto">
        <ChatOutput 
        messages={messages}
        status = {status}
        />
        <ChatInput
        input = {input}
        handleInputChange = {handleInputChange}
        handleSubmit = {handleSubmit}

        />
     </div>
    </main>
  );
}
