import { useState } from 'react'
import { useUpdateEffect } from './hooks/useUpdateEffect'
import { usePrevious } from './hooks/usePrevious'
import {useRef} from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState<number>(0)
  const previousCount = usePrevious(count)
  const countRef = useRef(count)
  countRef.current = count
  console.log('App in  previousCount', previousCount)
  useUpdateEffect(()=>{
    console.log('count update', count)
  
  },[count])
  return (
    <>
      <h1>useUpdateEffect</h1>
      <h2>{count}</h2>
      <h2>{countRef.current}</h2>
      <h2>{previousCount as React.ReactNode}</h2>
      <button onClick={()=>setCount(count+1)}>+</button>
    </>
  )
}

export default App
