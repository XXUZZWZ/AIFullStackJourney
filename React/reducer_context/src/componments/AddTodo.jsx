import {
  useState//组件私有
}from 'react';
import {useTodoContext }from '../hook/useTodoContext';
const AddTodo = () => {
  const [text,setText] = useState('');
  // 跨层级 子组件消费父组件的数据
  const {addTodo} = useTodoContext();
  const handleSubmit = (e)=>{
     e.preventDefault();
     if(text.trim()){
      addTodo(text);
      setText('')
     }else{
      setText('');
     }
  }
  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input 
        className="todo-form__input"
        type="text" 
        value={text} 
        onChange={(e)=>setText(e.target.value)} 
        placeholder="输入待办事项"
      />
      <button className="todo-form__button" type="submit">提交</button>
    </form>
  )
} 

export default AddTodo;
