import { useState } from 'react'
import './App.css'

function App() {
  
//react 不能操作dom ,性能差，高速  v8 -> 渲染引擎  性能很差
// react 借鉴了DOM0的行内写法
// 相似，react event 并不是 原始事件 ，而是合成事件
// onClick 不是onClick 不是字符串，而是事件函数绑定
const handleClick = (event) => {
  // 事件模块是项目框架的核心部分，react性能,封装，优化。
  console.log("this",this)
  console.log("合成event",event)//SyntheticBaseEvent
  console.log("event.native",event.native)// react 对事件的原生事件封装
                                          // 事件代理 在#root元素上+元素唯一值 合成事件
  console.log('立即访问click',event)
  console.log("-----------------");
  setTimeout(()=>{
    console.log("延迟访问",event)
  },1000)                                    
 
}

  return (
    <>
     <button onClick={handleClick}>click</button>
    </>
  )
}

export default App
