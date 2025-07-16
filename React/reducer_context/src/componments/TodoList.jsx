import{
  useTodoContext,
}from '../hook/useTodoContext'
const TodoList =()=>{
  const {
    todos,
    toggleTodo,
    removeTodo
  } = useTodoContext()
  console.log(todos)
  return (
    <>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li className="todo-list__item" key={todo.id}>
            <span 
              className={`todo-list__text ${todo.done ? 'todo-list__text--completed' : ''}`}
              onClick={()=>toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button
              className="todo-list__delete-button"
              onClick={()=>removeTodo(todo.id)}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default TodoList
