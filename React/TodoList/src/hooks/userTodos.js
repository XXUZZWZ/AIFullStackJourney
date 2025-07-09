import { useState, useEffect } from "react";
export const useTodos = () => {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem("todos")));

  useEffect(() => {
    console.log("todos发生变化了", todos);
    window.localStorage.setItem("todos", JSON.stringify(todos));
    return () => {
      console.log("清理函数");
      // 组件卸载的时候执行
    };
  }, [todos]);
  const addTodo = (title) => {
    // setTodo
    // 数据状态是数组的时候 必须完全变化
    setTodos([
      ...todos,
      {
        id: Date.now(),
        title,
        isCompleted: false,
      },
    ]);
  };
  const onToggle = (id) => {
    // const newTodos = todos.map((todo)=>{
    //   if(todo.id === id){
    //     todo.isCompleted = !todo.isCompleted;
    //   }
    // })
    // setTodos(newTodos)

    //state 是对象或数组的时候，setState 希望可以返回一个新的数组
    console.log(id);
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
    // setTodos(todos.map(())
  };
  const onDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  return {
    todos,
    addTodo,
    onToggle,
    onDelete,
  };
};
