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
  const addTodo = (title)=>{
    // setTodo 
    // 数据状态是数组的时候 必须完全变化
  setTodos([
     ...todos,
     {
       id:Date.now(),
       title,
       isCompleted:false
     }
   ])
  }
  const onToggle = (id)=>{
    // const newTodos = todos.map((todo)=>{
    //   if(todo.id === id){
    //     todo.isCompleted = !todo.isCompleted;
    //   }
    // })
    // setTodos(newTodos)
    
    //state 是对象或数组的时候，setState 希望可以返回一个新的数组 
    console.log(id);
    setTodos(todos.map((todo)=>todo.id===id?{...todo,isCompleted:!todo.isCompleted}:todo))
    // setTodos(todos.map(())
  }
  const onDelete = (id) =>{
    setTodos(todos.filter((todo)=>todo.id!==id))
  }
  return (
    <div className="app">
      <TodoForm
      // 自定义事件传递
      onAddTodo = {addTodo}
      />
      <TodoList
      todos = {todos}
      setTodos = {setTodos}
      onToggle = {onToggle}
      onDelete = {onDelete}
      />
    </div>

  )
}

export default Todos;