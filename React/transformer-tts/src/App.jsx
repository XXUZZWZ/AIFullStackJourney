import './App.css'
import {
  useState,
  useRef,
  useEffect
} from 'react'
import Progress from './components/Progress'
import AudioPlayer from './components/AudioPlayer'
import {
  DEFAULT_SPEAKER,
  SPEAKERS
} from './constants'

function App() {
  // 界面状态
  // llm ready 大模型准备好了不？
  const [ready, setReady] = useState(null)
  // 按钮是否点击，防止多次点击
  const [disabled, setDisabled] = useState(false)
  // 进度条数组
  const [progressItems, setProgressItems] = useState([])
  // 表单文本
  const [text, setText] = useState('I love you')
  // 音色
  const [selectSpeaker, setSelectSpeaker] = useState()
  // 输出
  const [output, setOutput] = useState(null)
  // 正在加载中
  const isLoading = ready === false

  const worker = useRef(null)

  useEffect(() => {
    // 引入 transformer
    // http://localhost/worker.js
    worker.current = new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module'
    })

    const onMessageReceived = (e) => {
      // console.log(e.data)
      switch (e.data.status) {
        case 'initiate':
          // llm ready 了吗
          setReady(false)
          setProgressItems(prev => [...prev, e.data])
          break
        case 'ready': setReady(true); break
        case 'download':
          break
        case 'progress':
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return {
                  ...item,
                  progress: e.data.progress
                }
              }
              return item
            })
          )
          break
        case 'done':
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          )
          break;

      }
    }
    worker.current.onmessage = onMessageReceived;

    return () => worker.current.removeEventListener('message', onMessageReceived)
  }, [])

  const handleGenerateSpeech = () => {
    setDisabled(true)
    worker.current.postMessage({
      text,
      speaker_id: selectSpeaker
    })
  }
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100'>
      {/* llm 初始化 */}
      <div className='absolute z-50 top-0 left-0 w-full h-full transition-all px-8 flex flex-col justify-center text-center'
        style={{
          opacity: isLoading ? 1 : 0,
          pointerEvents: isLoading ? 'all' : 'none',
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(8px)'
        }}
      >
        {
          isLoading && (
            <label className='text-white text-xl p-3'>
              loading model...
            </label>
          )
        }
        {
          progressItems.map(data => (
            <div key={`${data.name}/${data.file}`}>
              <Progress
                text={`${data.name}/${data.file}`}
                percentage={data.progress}
              />
            </div>
          ))
        }
      </div>
      {/* tts 功能区 */}
      <div className='bg-white p-8 rounded-lg w-full max-w-xl m-2'>
        <h1 className="text-3xl font-semibold text-gray-800 mb-1 text-center">In browser Text To Speech（端模型）</h1>
        <h2 className='text-base font-medium text-gray-700 mb-2 text-center'>
          Made with <a>Transformer.js</a >
        </h2>
        <div className='mb-4'>
          <label htmlFor="text-sm block font-medium text-gray-600">Text</label>
          <textarea
            name="text" id="text"
            className='border border-gray-300 rounded-md p-2 w-full'
            rows={4}
            placeholder='Enter text here...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          >
          </textarea>
          <div className='mb-4'>
            <label
              htmlFor="speaker"
              className='block font-medium text-gray-600'
            >
            </label>
            <select
              id="speaker"
              className='border border-gray-300 rounded-md p-2 w-full'
              value={selectSpeaker}
              onChange={e => setSelectSpeaker(e.target.value)}
            >
              {
                // 可迭代对象快速转换成数组 [[key:value],[key1:vlaue1],[key2:value2]]
                Object.entries(SPEAKERS).map(([key, value]) => (
                  <option key={key} value={value}>{key}</option>
                ))
              }
            </select>
          </div>
          <div className='flex justify-center'>
            <button
              className={`
              ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover-bg-blue-600'}
              text-white rounded-md px-4 py-2`
              }
              onClick={handleGenerateSpeech}
              disabled={disabled}
            >
              {disabled ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
        {
          output && <AudioPlayer
            audioUrl={output}
            mimeType={'audio/wav'}
          />
        }
      </div>
    </div>
  )
}

export default App