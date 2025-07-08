import {
  useState // react 函数式编程 ，好用的以use 开头的函数 这个hook 是解决响应式数据更新的问题
}from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
const Todos = () =>{
  // 单向数据流，数据流管理
  // props传递数据，子组件通过props 自定义函数
  // 通知父组件
  const [todos,setTodos] = useState([
    {
      id:1,
      title:'学习react',
      isCompleted:false
    },
    {
      id:2,
      title:'学习vue',
      isCompleted:false
    }
  ]);
  const addTodo = ()=>{
    // setTodo 

  }
  return (
    <div className="app">
      <TodoForm
      // 自定义事件传递
      onAddTodo = {addTodo}
      />
      <TodoList
      todos = {todos}
      />
    </div>

  )
}

export default Todos;