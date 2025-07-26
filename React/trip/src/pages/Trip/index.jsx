import   useTitle from '@/hooks/useTitle'

import {
  
  useEffect,
  useState
} from 'react'

import { chat, kimiChat } from '@/llm'
import {
  Input,
  Button,
  Loading,
  Toast
} from 'react-vant';
import styles from './trip.module.css';
import { ChatO, UserO } from '@react-vant/icons';
const Trip = () => {
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  // 数据驱动界面
  // 静态界面
  const [messages, setMessages] = useState(
    [
      {
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },
      {
        id: 2,
        role: 'user',
        content: '我要去上海，请给出详细规划内容。',
      },
    ]
  )
  const handleChat = async () => {
    if (text.trim() === "") {
      Toast.info({
        message: '请输入内容',
        duration: 2000,
        position: 'top',
      })
      return;
    }
    setIsSending(true);
    setText("");
    setMessages((pre) => (
      [
        ...pre,
        {
          id: pre.length + 1,
          role: 'user',
          content: text,
        },
      ]
    )
    )
    const newMessage = await chat([
      {
        role: 'user',
        content: text,
      }
    ])
    console.log(newMessage);
    setMessages((pre) => (
      [
        ...pre,
        {
          ...newMessage.data,
          id: messages.length + 1
        }
      ]
    ))
    setIsSending(false);

  }
  useTitle('奶龙客服')
  //   useEffect(()=>{
  //   const fecthChat = async ()=>{
  //     const res = await kimiChat([
  //       {
  //         role: 'user',
  //         content: '请用中文回答，你叫什么名字？'
  //       }
  //     ])
  //     console.log(res)
  //   }
  //   fecthChat();
  //  })
  useTitle('奶龙Trip')
  return (
    <div className='flex flex-col h-all'>
      <div className={`flex-1 ${styles.chatArea}`}>
        <div className='flex flex-col'>
          {
            messages.map((msg, index) => (
              <div key={index}
                className={
                  msg.role === 'user' ? styles.messageRight : styles.messageLeft

                }
              >
                {
                  msg.role === 'system' ? <ChatO /> : <UserO />
                }
                <div>{msg.content}</div>
              </div>
            ))
          }
        </div>
      </div>
      <div className={`flex ${styles.inputArea}`}>
        <Input
          value={text}
          onChange={e => setText(e)}
          placeholder='请输入内容'
          className={`flex-1 ${styles.input}`}
        >
        </Input>
        
        <Button
          disabled={isSending}
          type='primary'
          onClick={handleChat}
        >
          发送
        </Button>
      </div>
      {isSending && ((<div className='fixed-loading'>
        <Loading type='ball' />
      </div>))}
    </div>
  )
}
export default Trip