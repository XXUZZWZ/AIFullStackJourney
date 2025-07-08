import TodoItem from "./TodoItem"

const TodoList = (props) =>{
  const {
    todos,
    onToggle,
    onDelete,
  } = props;
  return (
   
     <div className="todo-list">
       {/* TodoList */}
       {
        todos.length>0?(
          todos.map((todo) =>
             <TodoItem
           key={todo.id}
           todo = {todo}
           onToggle = {()=>{onToggle(todo.id)}}
           onDelete = {()=>onDelete(todo.id)}
 >todo.title</TodoItem>
          )
        ):(
          <p>暂无待办事件</p>
        )
      }
      
     </div>
   
  )
}

export default TodoList