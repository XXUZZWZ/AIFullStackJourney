import { useReducer, useEffect } from "react";
import axios from "axios";
import todoReducer from "../reducers/todoReducer";

// 参数默认值  ES6新特性
// {todos:todos}等同于 {todos,}
// `` 模板字符串
//  [] = [],{} = {}
// 展开运算符，rest 运算符
//

// 从localStorage读取初始数据
const getInitialTodos = () => {
  try {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error("读取localStorage失败:", error);
    return [];
  }
};

export function useTodos() {
  const [todos, dispatch] = useReducer(todoReducer, getInitialTodos());

  // 状态变化时保存到localStorage
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("保存到localStorage失败:", error);
    }
  }, [todos]);
  // 发送到后端
  const userInfo = {
    userId: "userId__" + Math.random().toString(32).substr(2) + Date.now(),
    todos: todos,
  };
  console.log(userInfo);
  useEffect(() => {
    axios.post("/api/uploadtodos", userInfo);
  }, [todos]);
  const addTodo = (text) => {
    dispatch({ type: "ADD_TODO", text });
  };
  const toggleTodo = (id) => {
    dispatch({ type: "TOGGLE_TODO", id });
  };
  const removeTodo = (id) => {
    dispatch({ type: "REMOVE_TODO", id });
  };
  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
  };
}
