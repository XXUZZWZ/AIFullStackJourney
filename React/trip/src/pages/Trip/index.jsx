import useTitle from '@/hooks/useTitle'
import {
  useEffect
}from 'react'
import {chat,kimiChat }from '@/llm'
const Trip = ()=>{
  useTitle('奶龙客服')
 useEffect(()=>{
  const fecthChat = async ()=>{
    const res = await kimiChat([
      {
        role: 'user',
        content: '请用中文回答，你叫什么名字？'
      }
    ])
    console.log(res)
  }
  fecthChat();
 })
  return (
    <div>
     Trip 
    </div>
  )
}
export default Trip