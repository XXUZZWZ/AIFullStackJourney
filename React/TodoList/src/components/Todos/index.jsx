import {
  useState ,// react 函数式编程 ，好用的以use 开头的函数 这个hook 是解决响应式数据更新的问题
  useEffect // 处理副作用
}from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useTodos} from '@/hooks/userTodos'
const Todos = () =>{
  // 单向数据流，数据流管理
  // props传递数据，子组件通过props 自定义函数
  // 通知父组件
 
  const {todos,addTodo,onToggle,onDelete} = useTodos();
 
  
  useEffect(()=>{
    console.log('todos发生变化了',todos);
     window.localStorage.setItem('todos',JSON.stringify(todos))
    return ()=>{
      console.log('清理函数');
      // 组件卸载的时候执行
    }
  },[todos])

  return (
    <div className="app">
      <TodoForm
      // 自定义事件传递
      onAddTodo = {addTodo}
      />
      <TodoList
      todos = {todos}

      onToggle = {onToggle}
      onDelete = {onDelete}
      />
    </div>

  )
}

export default Todos;