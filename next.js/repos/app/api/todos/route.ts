import {
  NextResponse // response 对象
}from 'next/server'
import { Todos,Todo } from '@/app/types/todo'
// api server 开发




const todos:Todos = {
  todos:[
    {id:1,text:'todo1',completed:false},
    {id:2,text:'todo2',completed:false},
    {id:3,text:'todo3',completed:false},
    {id:4,text:'todo4',completed:false},
    {id:5,text:'todo5',completed:true}
  ]
}

// RestFul 一切皆资源
// 后端向用户暴露资源
// method + 资源 url 定义规则

/**
 * GET /api/todos
 * 
 */
export async function GET(){
  return NextResponse.json(todos.todos)
}

export async function POST(request:Request) {
  // 获取请求体 body json
  const data = await request.json()
  const newTodo:Todo = {
    id:+ Date.now(),
    // 核心的数据，返回值
    text:data.text,
    // 除了强类型之外，还有代码提升更好，写起来更快
    completed:false,
  }
  todos.todos.push(newTodo)
  return NextResponse.json(newTodo);

}

export async function PUT(request:Request) {
  const data = await request.json();
  todos.todos = todos.todos.map((todo)=>todo.id === data.id ? {...todo,completed:data.completed} : todo)
  return NextResponse.json(todos.todos);
}

export async function DELETE(request:Request) {
  const data = await request.json();
  todos.todos = todos.todos.filter(todo => todo.id !== data.id);
  return NextResponse.json(todos.todos)

}