import { useState } from 'react'
import './App.css'
import { 
  useEffect,
  useCallback,
  useMemo // 缓存一个复杂计算的值
 } from 'react';
import Button from '@/components/Button'

function App() {
  const [count, setCount] = useState(0)
  const [num,setNum] = useState(0);

  // 父组件重新渲染rerender，函数重新声明，handleClick 函数对象地址变化了,props变化。让React.memo() 缓存失效。
  // 可以利用 useCallback() 缓存函数对象，防止函数对象地址变化。

  const handleClick = useCallback(()=>{
      console.log('handleClick')
  },[]);
  // 当我们想让callback缓存失效，需要将num作为依赖项。
 // console.log('count', count);
  useEffect(() => {
    console.log('App useEffect count change');
  }, [count])
  useEffect(()=>{
    console.log('App useEffect num change');
  },[num])
  const expensiveComputation = (str)=>{
      for (let i = 0; i < 300; i++) {
        str+='expensiveComputation'
        console.log('expensiveComputation');
      }
      return str;
    }
  console.time('filter array');
  const expensiveComputationVal =  useMemo(
    ()=>{
      console.log('expensiveComputation');
      return expensiveComputation('sss');
    }
  ,[num])
  console.timeEnd('filter array end');
  
 // expensiveComputation("sdfs");

  return (
    <>
      <h1>你好</h1>
      <h2>{count}</h2>
      <h3>{expensiveComputationVal}</h3>
      <button onClick={() => setCount((count) => count + 1)} >count加一</button>
      <button onClick={() => setNum((num) => num + 1)} >num加一</button>
      <Button num = {num}
      onClick = {handleClick}
      > Click  </Button>
    </>
  )
}

export default App
