import Editor from './editor/index'
import './App.css'
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'

function App() {
  

  return (
    <div style={{ height: '100vh' }}>
      <Allotment defaultSizes={[280, 720]}>
        <Allotment.Pane minSize={200} preferredSize={300} snap>
          <Editor />
        </Allotment.Pane>
        {/* <Allotment.Pane>
          <div style={{ height: '100%' }}>
            预览区 / 右侧内容
          </div>
        </Allotment.Pane> */}
      </Allotment>
    </div>
  )
}

export default App
