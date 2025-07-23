import { useState } from 'react'
import { getTodos ,getRepos } from './api'
import './App.css'
import { useEffect } from 'react'

function App() {
  const [todos,setTodos] = useState([])
  const [repos,setRepos] = useState([])
 
  // useEffect(()=>{
  //   const fetchData = async ()=>{
  //   const res = await getTodos()
  //   console.log(res.data.data)
  //   setTodos(res.data.data)
  // }
  //   fetchData()
  // },[])
  useEffect(()=>{
    const fetchData = async ()=>{
    const res = await getRepos()
    console.log(res.data)
    setRepos(res.data)
    }
    fetchData();
  },[])
  return (
    <>
      <h1>你好</h1>
      {/* <ul>
        {
          todos.map(todo=>(
            <li key={todo.id}>{todo.title}</li>
          ))
        }
      </ul> */}
      <ul>
        {
          repos.map(repo=>
           ( <li key={repo.id+Date.now()}>{repo.name}</li>)
          )
        }
      </ul>
    </>
  )
}

export default App
