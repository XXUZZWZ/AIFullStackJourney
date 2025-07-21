import { useState ,useRef} from 'react'
import './App.css'
function ControlledInput ({onSubmit}){
  // 声明一个响应式状态
   const [value, setValue] = useState('')
   const [error,setError] = useState('')
   const handleSubmit = (e) =>{
    e.preventDefault()
    onSubmit(value)
    console.log(value)
   }
   const handleChange = (e) =>{
    setValue(e.target.value)
    // 频繁触发 实时判断可否合格
    if(e.target.value.trim().length < 6){
      setError('请输入至少六个字符')
      // setValue('');
    }else{
      setError('')
    }
   }

   return(
    <form onSubmit={handleSubmit}>
      <input 
      type="text" 
      id="controlled-input"  
      value={value} 
      onChange={handleChange}
      placeholder='输入内容'
      required
      />
      {error&& <p>{error}</p> }
      <label htmlFor="controlled-input">INPUT</label>
      <button type='submit' value= '提交' >submit</button>
    </form>
   )
}

function UncontrolledInput({onSubmit}){
  const inputRef = useRef(null);
    const handleSubmit = (e)=>{
    e.preventDefault()
    const value = inputRef.current.value;

    console.log(inputRef.current.value,"__value__",value)
    onSubmit(value)
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
      type="text"
      id="uncontrolled-input" 
      placeholder='输入内容' 
      ref={inputRef} 
      />
      <label htmlFor="uncontrolled-input">非受控组件</label>
      <button type='submit' value= '提交' >提交</button>
    </form>
  )
}
function App() {
  const handleSubmit = (value) => {
    // e.preventDefault()
    console.log("App use this value|||",value)
  }
  return (
    <>
       <ControlledInput onSubmit={handleSubmit}/>
       <UncontrolledInput onSubmit={handleSubmit}/>
       <input type="text" name="" id="dd" placeholder='输入内容' value={'dddddd'} />
       <label htmlFor="dd"></label>

    </>
  )
}

export default App
