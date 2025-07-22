import { 
  useRef,
  useEffect,
  forwardRef,//支持传入子组件返回一个新的fc接收(props,ref);
 } from 'react'
import './App.css'
// 高阶组件HOC
const WrappGuang = forwardRef(Guang)
// forwardRef   返回一个全新的组件，可以传递ref 给子组件
function Guang(props,ref) {
  // console.log(props,ref);
  return (
    <div>
       <input 
         type="text" 
         id="inp" 
         ref={ref}
         placeholder='输入内容'
         style={
          {
            border: '1px solid red',
          }
         }
         />
    </div>
  )

}

function App() {
  // 父组件想持有ref
  const ref = useRef();
//  console.log(ref.current);
  
  useEffect(()=>{
    ref.current?.focus()
  },[])
  
  return (
    <div className='App'>
         
         {/* <input 
         type="text" 
         id="inp" 
         ref={ref}
         placeholder='输入内容'
         style={
          {
            border: '1px solid red',
          }
         }
         /> */}
        {/* // <Guang ref={ref}/> */}
        <WrappGuang ref={ref}/>
    </div>
  )
}

export default App
