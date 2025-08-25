// 本页面为客户端组件，可使用浏览器事件、状态与副作用等功能
'use client' // client 编译
// 事件监听、生命周期等
// 导入 React 钩子，用于管理组件状态与副作用
import {
  useState,
  useEffect,
} from "react";

// 导入 UI 组件：按钮、卡片、输入框，用于页面展示
import {
  Button,
} from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import {
  Input,
} from '@/components/ui/input';
import { text } from "stream/consumers";
// 导入类型定义：Todo（单条待办）、Todos（待办列表）
import {
  type Todo,
  type Todos
}from '@/app/types/todo'
// 页面主组件：负责渲染 Todo 列表与增删改交互
export default function Home() {
  // 输入框中的新待办文案
  const [newTodo, setNewTodo] = useState('');
  // 当前展示的待办列表数据
  const [todos, setTodos] = useState<Todo[]>([]);

  // 拉取待办列表：
  // 1) 调用 GET /api/todos 拿到最新数据
  // 2) 将结果写入组件状态，以触发视图更新
  const fetchTodos = async() => {
    const response = await fetch('/api/todos')
    const data = await response.json()
    setTodos(data)
  };

  // 组件挂载时初始化加载一次待办列表
  useEffect(() => {
    fetchTodos()
  }, [])
  // 新增待办：
  // - 若输入为空直接返回，避免提交无效数据
  // - 调用 POST /api/todos 创建新待办
  // - 成功后清空输入框并刷新列表
  const addTodo = async() => {
    if(!newTodo) return

    await fetch('api/todos',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: newTodo
      })
    })

    setNewTodo('')
    fetchTodos()
  };
  // 删除待办：
  // - 调用 DELETE /api/todos，携带待删除的 id
  // - 成功后重新拉取最新列表
  const deleteTodo = async (id:number) =>{
    await fetch ('api/todos',{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(
        {id}
      )
    })
    fetchTodos()
  }
  // 切换完成状态：
  // - 调用 PUT /api/todos，提交 id 与目标 completed 状态
  // - 成功后刷新列表，保持 UI 与服务端一致
  const toggleTodo = async(id:number,completed:boolean)=>{
     await fetch('/api/todos',{
      method:'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        id,
        completed
      })
     })
     fetchTodos()
  }
  return (
    // 响应式容器：最大宽度 md，水平居中与内边距
    // xm md lg
    <main className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {/* 输入框：受控组件，value 与 newTodo 绑定；Enter 键触发 addTodo */}
            <Input
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            {/* 新增按钮：点击后调用 addTodo */}
            <Button onClick={addTodo}>Add</Button>
          </div>
          <div className="space-y-2">
            {
              /* 渲染列表：逐条渲染 todo 项，使用 id 作为 key */
              todos.map((todo: Todo) => (
                <div
                  key={todo.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    {/* 勾选框：切换 completed 状态，触发 toggleTodo */}
                    <input 
                      type="checkbox" 
                      onChange={(e)=>toggleTodo(todo.id,e.target.checked)}
                      checked={todo.completed}
                      className="w-4 h-4"
                    />
                    {/* 文本：已完成时加删除线样式 */}
                    <span className={todo.completed ? 'line-through' : ''}>{todo.text}</span>
                  </div>
                  {/* 删除按钮：点击后调用 deleteTodo */}
                  <Button
                    variant="destructive"
                    size='sm'
                    onClick={()=>deleteTodo(todo.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
      
    </main>
  );
}