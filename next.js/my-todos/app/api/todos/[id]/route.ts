import {NextResponse} from 'next/server';
// 导入Prisma客户端单例
import { prisma } from '@/lib/prisma';

export async function PATCH(req:Request,{params}:{params:{id:string}}){
  try {
    console.log('PATCH请求参数:', params.id);
    const body = await req.json();
    console.log('PATCH请求体:', body);
    const { completed } = body;

    // 先检查记录是否存在
    console.log('正在查找todo ID:', Number(params.id));
    const existingTodo = await prisma.todo.findUnique({
      where: { id: Number(params.id) }
    });

    console.log('找到的todo:', existingTodo);

    if (!existingTodo) {
      console.log('Todo不存在，返回404');
      return NextResponse.json({ error: "Todo不存在" }, { status: 404 });
    }
    
    console.log('正在更新todo:', { id: Number(params.id), completed });

    const todo = await prisma.todo.update({
      where:{
        id: Number(params.id)
      },
      data:{
        completed
      },
      include: {
        user: true
      }
    })

    console.log('更新后的todo:', todo);

    // 格式化返回数据
    const formattedTodo = {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
      user: todo.user ? {
        ...todo.user,
        createdAt: todo.user.createdAt ? todo.user.createdAt.toISOString() : null,
        updatedAt: todo.user.updatedAt ? todo.user.updatedAt.toISOString() : null,
        name: todo.user.name || ''
      } : null
    };

    // 调试信息
    console.log('PATCH返回的todo数据:', formattedTodo);
    console.log('PATCH返回的user数据:', formattedTodo.user);

    return NextResponse.json(formattedTodo);
  } catch (error) {
    console.error('PATCH /api/todos/[id] error:', error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(req:Request,{params}:{params:{id:string}}){
  try {
    // 先检查记录是否存在
    const existingTodo = await prisma.todo.findUnique({
      where: { id: Number(params.id) }
    });
    
    if (!existingTodo) {
      return NextResponse.json({ error: "Todo不存在" }, { status: 404 });
    }
    
    await prisma.todo.delete({
      where:{
        id: Number(params.id)
      }
    })
    return NextResponse.json({success: true});
  } catch (error) {
    console.error('DELETE /api/todos/[id] error:', error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}