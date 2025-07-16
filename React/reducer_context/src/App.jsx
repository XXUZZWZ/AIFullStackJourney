import{TodoContext} from './TodoContext'
import {useTodos} from './hook/useTodos'
import AddTodo from './componments/AddTodo'
import TodoList from './componments/TodoList'
import './global.styl'


function App() {
   const todosHook = useTodos()

  return (
   <TodoContext.Provider value = {todosHook} >
      <div className="todo-app">
        <h1 className="todo-app__title">待办清单</h1>
        <AddTodo/>
        <TodoList/>
      </div>
   </TodoContext.Provider>
  )
}

export default App
