import {useTodosStore} from '../../store/todo'

const TodoList = () => {
  const todos = useTodosStore(state => state.todos)
   return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
   )
}

export default  TodoList