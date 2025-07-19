import { 
  useState,
  useEffect
 } from 'react'
import './App.css'

function App() {
  const [todos,setTodos] = useState([
    {
      id:1,
      title:'标题1'
    },
    {
      id:2,
      title:'标题2'
    },
    {
      id:3,
      title:'标题3'
    },
  ]);
  useEffect(()=>{
    // setTodos( prev =>prev.map(todo=>(
    //   {...todo,title:todo.title+'1'}
    // )) )
   
    setInterval(()=>{
      setTodos(prev =>[{id:4+Date.now()+Math.random().toString(32),title:'标题4'},...prev])
    },1000)
  },[])

  return (
    <>
     {
      todos.map(todo=>(
        <li >{todo.title} </li>
      ))
     }
    </>
  )
}

export default App
