import { useState } from 'react'
import  NamedExoticComponent  from './components/NamedExoticComponent.tsx';
import './App.css'

function App() {
  // js代码
  // const [name,setName] = useState("init name");
  // ts代码
  const [name,setName] = useState<string>("init name");
   
  // 单向数据流
  // typescript 除了内置的类型外，自定义类型 interface
  // React 提供的类型
  // 比如事件类型 ChangeEvent<HTMLInputElement>
  // React.ChangeEvent<HTMLTextAreaElement>
  // React.MouseEvent<HTMLButtonElement>
  // 
  // ts 要对重要的地方约束 ，让系统不容易出错

  const setUserName = (event :React.ChangeEvent<HTMLInputElement > ) =>{
    setName(event.target.value)
  }
  return (
    <>
     <NamedExoticComponent name={name } onChange={setUserName} />
    </>
  )
}

export default App
