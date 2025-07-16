import { 
  useState,
  Fragment// 文档碎片组件
 } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Demo({items}) {
  const JsxArray = items.map(item => (
    <Fragment key={item.id}>
      <div>{item.title}</div>
      <div>{item.content}</div>
    </Fragment>))
  return (
        JsxArray
  )
  // 允许返回 Array[jsx1,jsx2,jsx3]
}
function App() {
  const [count, setCount] = useState(0)
  const items = [
    {
      id:1,
      title: '标题1',
      content: '内容1'
    },
    {
      id:2,
      title: '标题2',
      content: '内容'
    }
  ]
  return (
    <Fragment>
      
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1><Demo items={items} /></h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </Fragment>
  )
}

export default App
