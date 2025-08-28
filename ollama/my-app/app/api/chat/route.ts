import type { NextRequest } from "next/server";
import {
  Message,
  ChatRequest,
  ChatResponse
}from '@/types/chat'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/chat'
const MODEL_NAME = process.env.MODEL_NAME || 'deepseek-r1:1.5b'

export async function POST(request:NextRequest){
  try{
    const body:{messages:Message[]} = await request.json()
    // 解构出 消息列表
    console.log('body',body)
    const ollamaRequest:ChatRequest = {
      model:MODEL_NAME,
      messages:body.messages,
      stream:false
    }
    console.log('ollamaRequest',ollamaRequest)
    const response = await fetch(OLLAMA_URL,{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(ollamaRequest)
    })
    if(!response.ok){
      const errorText = await response.text()
      return Response.json(
        {
          error:'Failed to get response from ollama: '+ errorText
        },
        {
          status:response.status
        }
      )
    }
    const ollamaData:ChatResponse = await response.json()
    console.log('ollamaData',ollamaData)
    return Response.json(ollamaData)
  
  }catch(error){
     console.error('Error in chat API:',error)
     return Response.json(
      {
        status:500
      }
     )
  }
}