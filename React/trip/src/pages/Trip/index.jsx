import useTitle from '@/hooks/useTitle'
import AISvgIcon from '@/components/AISvgIcon'
import {

  useEffect,
  useState
} from 'react'

import { chat, kimiChat } from '@/llm'
import {
  Input,
  Button,
  Loading,
  Toast,
  List,
  FloatingBall,
  Calendar,
  Overlay,
} from 'react-vant';
import styles from './trip.module.css';
import { ChatO, UserO } from '@react-vant/icons';
const AIAssistant = ({ open }) => {
  // 数据驱动界面
  // 静态界面
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState(
    [
      {
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },
      {
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
        id: 1,
        role: 'system',
        content: '你是一个旅游规划专家，请根据用户输入的场景，生成一个旅游规划方案，并给出详细规划内容。',
      },{
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
  return (
    <>
      {
        open && <div className='flex flex-col h-all'>

          <div className={`flex-1 ${styles.chatArea}`}>
            <div className='flex flex-col'>
              <List>
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
              </List>
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
      }
    </>
  )
}
const Trip = () => {
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [open, setOpen] = useState(true);
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
    <div>
      <Calendar
        style={{ height: 500 }}
        showConfirm={false}
        poppable={false}
      />
      <Overlay
        visible={open}
        customStyle={
          {
            backgroundColor: 'transparent'
          }
        }
      >
        <AIAssistant open={open} />
      </Overlay>

      <FloatingBall
        disabled={false}
      >
        <div onClick={() => { setOpen(pre => !pre) }} style={{ width: '80px', height: '80px', background: 'transparent' }}>
          <svg
            t="1753616872034"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4310"
            id="mx_n_1753616872035"
            width="80" height="80"
          >
            <path
              d="M603.904 244.992c134.4 0 243.3536 108.9536 243.3536 243.3536v202.8032c0 134.4-108.9536 243.3536-243.3536 243.3536H320c-134.4 0-243.3536-108.9536-243.3536-243.3536V488.3456c0-134.4 108.9536-243.3536 243.3536-243.3536h283.904z m0 81.1008H320c-89.6 0-162.2528 72.6528-162.2528 162.2528v202.8032c0 89.6 72.6528 162.2528 162.2528 162.2528h283.904c89.6 0 162.2528-72.6528 162.2528-162.2528V488.3456c0-89.6-72.6528-162.2528-162.2528-162.2528z" fill="#3f45ff" p-id="4311"></path><path d="M340.224 508.6208c27.0336 0 40.5504 13.5168 40.5504 40.5504v81.1008c0 27.0336-13.5168 40.5504-40.5504 40.5504-27.0336 0-40.5504-13.5168-40.5504-40.5504v-81.1008c0-27.0336 13.5168-40.5504 40.5504-40.5504zM583.2192 501.3504c15.2576-11.4176 36.864-8.3456 48.2816 6.912a34.4832 34.4832 0 0 1-6.912 48.2816l-44.3904 33.28 44.3904 33.28a34.53952 34.53952 0 0 1 9.472 44.3392l-2.56 3.9424c-11.4176 15.2576-33.024 18.3296-48.2816 6.912l-59.4944-44.5952c-13.7728-10.3424-21.9136-26.5728-21.9136-43.8272s8.0896-33.4848 21.9136-43.8272l59.4944-44.5952zM883.5072 261.12l-19.7632 47.3088c-2.7648 6.656-9.2672 10.9568-16.4864 10.9568s-13.6704-4.3008-16.4864-10.9568L811.008 261.12a44.416 44.416 0 0 0-19.7632-21.9648l-34.8672-19.0976c-5.7344-3.1232-9.2672-9.1136-9.2672-15.6672s3.5328-12.544 9.2672-15.6672l34.8672-19.0464a44.89728 44.89728 0 0 0 19.7632-21.9648l19.7632-47.3088c2.7648-6.656 9.2672-10.9568 16.4864-10.9568s13.6704 4.3008 16.4864 10.9568l19.7632 47.3088a44.416 44.416 0 0 0 19.7632 21.9648l34.8672 19.0976c5.7344 3.1232 9.2672 9.1136 9.2672 15.6672s-3.584 12.544-9.2672 15.6672l-34.8672 19.0464c-8.9088 4.864-15.872 12.6464-19.7632 21.9648z" fill="#3f45ff" p-id="4312"></path></svg>
        </div>
      </FloatingBall>
    </div>
  )
}
export default Trip