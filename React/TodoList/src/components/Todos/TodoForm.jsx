import {
  useState // 组件的私有状态
}from 'react';
const TodoForm = () =>{
  // 最外层一定要有父元素，否则会报错
  // jsx 一定要有最外层元素，react 是用树来定义的结构，必须要有唯一的根元素
  return (
    <>
      <h1 className='header'>TodoForm</h1>
    </>
  )
}

export default TodoForm