import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [title,setTitle] = useState('React');
  const [color,setColor] = useState('red');
  console.log('count', count);
  const hanldeClick = () => {
    // setCount(count + 1)
    // setCount(count + 1)
    // setCount(count + 1)
    // setCount(count + 1)
    // react 性能优化，会合并多次更新 统一处理
    // 重绘重排
    // 数据绑定， 所用界面都要更新
    // js引擎V8 ,渲染引擎 Blink
    // 重绘重排
    //setState 函数式更新语法，如果想要拿到更新过的值

    /**
     * let update = pendingQueue;
        while (update !== null) {
          const action = update.action;
          newState = typeof action === 'function' 
            ? action(newState) 
            : action;
          update = update.next;
  }
     */
    // 
    // 保证每一个更新都基于上一个最新的值
    // 界面的合并为一次的，不会阻塞JS引擎的执行。
    setCount(preCount=>preCount+1)
    setCount(preCount=>preCount+2)
    setCount(preCount=>preCount+3)
    setCount(count+1);
    setCount(preCount=>preCount+4)
    setCount(count+5);
    setCount(preCount=>preCount+3)
    
  }
  return (
    <>
      <p>当前{count}</p>
      <button onClick={hanldeClick}></button>
    </>
  )
}

export default App
