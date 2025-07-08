const TodoItem = (props) =>{
  const {
    id,
    title,
    isCompleted,
    
  } = props.todo;
  const onToggle = props.onToggle;
  const onDelete = props.onDelete;
 
  return (
    <div key={id} className="todo-item">
      <input type="checkbox" checked={isCompleted} onChange={onToggle} />
     <span className= {isCompleted?'completed':''}>{title}</span>
     <button onClick={onDelete}  >Delete</button>
    </div>

  )
}

export default TodoItem;