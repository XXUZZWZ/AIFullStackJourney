import {
  useState,
  useEffect
}from 'react'
import './App.css'

function App() {
  const [data,setData] = useState([])
  // 实例化一个控制器 
  const controller = new AbortController();
  useEffect(()=>{
    fetch(' http://localhost:5173/api/banners',{signal:controller.signal})
     .then(res=>res.json())
     .then(data =>{
      console.log(data);
      setData(data);
     })
  },[])
  const stop = ()=>{
    controller.abort();
  }
  return (
    <>
     {
      JSON.stringify(data)
      
     }
     <button
     onClick={stop}
     >stop</button>
    </>
  )
}

export default App
