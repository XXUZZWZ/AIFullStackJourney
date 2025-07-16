import { TodoContext } from "../TodoContext";
import { useContext } from "react";

// 自定义hook ,方便后续消费
export function useTodoContext() {
  return useContext(TodoContext);
}
