import {
  useState // 组件的私有状态
}from 'react';
const TodoForm = ({onAddTodo}) =>{
  // 最外层一定要有父元素，否则会报错
  // jsx 一定要有最外层元素，react 是用树来定义的结构，必须要有唯一的根元素
  // props 参数数据
  // state 私有的数据
  // 单向数据流

  
  const [text,setText] = useState('')
  const handleSubmit = (e)=>{
    e.preventDefault();
    let result = text.trim();
    if(!result) return;
    onAddTodo(result);
    setText('');
    //对数据状态和界面状态一致要敏感
  }
  
  return (
    <>
      <h1 className='header'>TodoList</h1>
      <form 
      className='todo-input' 
      onSubmit={handleSubmit}
      >
      <input 
      type="text"
      value = {text} //数据绑定 
      onChange = {(e) => setText(e.target.value)}//维护数据的变化
      required
      placeholder = "请输入待办"
       />
       <button type="submit">Add</button>
      </form>
    </>
  )
}

export default TodoForm