import useTitle from '@/hooks/useTitle'
import {
  useEffect,
  useState
}from 'react'

import {chat,kimiChat }from '@/llm'
import {
  Input,
  Button,
  Loading
} from 'react-vant';
import styles from './trip.module.css';
const Trip = ()=>{
  const [text,setText] = useState('')
  const [isSending,setIsSending] = useState(false)
  const handleChat = ()=>{
    if(text.trim()==="") return
   setIsSending(true);
  }
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
    <div className='flex flex-col h-all'>
      <h1>Trip</h1>
     <div className={`flex-1 ${styles.chatArea}`}>
      
     </div>
     <div className={styles.inputArea}>
      <Input 
      value={text}
      onChange={e=>setText(e)}
      placeholder = '请输入内容'
      className = {`flex-1 ${styles.input}`}
      >
      </Input>
     
     </div>
      <Button
      disabled = {isSending}
      type = 'primary'
      onClick = {handleChat}
      >
        发送
      </Button>
      {isSending && (<Loading className='fixed-loading' type='ball'/>)}
    </div>
  )
}
export default Trip