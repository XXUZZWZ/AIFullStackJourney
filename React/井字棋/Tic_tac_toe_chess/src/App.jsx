import { useState, Fragment } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState({})
  const handleDelete = (id) => {
    todos.map((todo) => {
      if (todo.id === id) {
        return;
      } else {
        return todo
      }
    })
    setTodos(todos);
  }
  const handleAdd = () => {

    setTodos([...todos, { value: input }]);
  }
  return (
    <>
      <ul>
        {
          todos.map((todo) => (
            <Fragment key={Math.random() + todo.id}>
              <li>{todo.value}</li>
              <button
                onClick={(todo) => {
                  handleDelete(todo.id)
                }}
              >删除</button>
            </Fragment>
          ))
        }
      </ul>
      <input
        type="text"
        value={input}
        onChange={setInput}
      />
      <button
        onClick={
          handleAdd()
        }
      >增加</button>
    </>
  )
}

export default App
