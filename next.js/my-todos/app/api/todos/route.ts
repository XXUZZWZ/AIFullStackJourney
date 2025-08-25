// 导入Next.js的响应处理工具
import {
  NextResponse
}from 'next/server';

// 导入Prisma客户端单例
import { prisma } from '@/lib/prisma';
import { 
  type CreateTodoRequest,
  type UpdateTodoRequest,
  type TodosResponse,
  type TodoResponse,
  type TodoStats,
  type QueryParams
} from '@/types';

/**
 * GET请求处理函数 - 获取所有todo列表
 * 路由：GET /api/todos
 * 支持查询参数：search, status, userId, page, limit, sortBy, sortOrder
 */
export async function GET(request: Request){
  try {
    const { searchParams } = new URL(request.url);
    
    // 解析查询参数
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // 构建查询条件
    const where: any = {};
    
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive'
      };
    }
    
    if (status === 'completed') {
      where.completed = true;
    } else if (status === 'pending') {
      where.completed = false;
    }
    
    if (userId) {
      where.userId = Number(userId);
    }
    
    // 计算分页
    const skip = (page - 1) * limit;
    
    // 查询todos
    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit,
        include: {
          user: true
        }
      }),
      prisma.todo.count({ where })
    ]);
    
    // 转换Date为string以匹配类型定义
    const formattedTodos = todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
      user: todo.user ? {
        ...todo.user,
        createdAt: todo.user.createdAt.toISOString(),
        updatedAt: todo.user.updatedAt.toISOString(),
        name: todo.user.name || ''
      } : null
    }));
    
    const response: TodosResponse = { todos: formattedTodos };
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/todos error:', error);
    return NextResponse.json(
      { error: "获取todo列表失败" }, 
      { status: 500 }
    );
  }
}

/**
 * POST请求处理函数 - 创建新的todo
 * 路由：POST /api/todos
 * 请求体：CreateTodoRequest
 */
export async function POST(req: Request){
  try {
    // 从请求体中解析数据
    const { title, userId }: CreateTodoRequest = await req.json();
    
    // 验证必填字段
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "标题不能为空" }, 
        { status: 400 }
      );
    }
    
    // 如果提供了userId，验证用户是否存在
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return NextResponse.json(
          { error: "指定的用户不存在" }, 
          { status: 404 }
        );
      }
    }
    
    // 创建新的todo记录
    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        userId: userId || null
      },
      include: {
        user: true
      }
    });
    
    // 格式化返回数据
    const formattedTodo = {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
      user: todo.user ? {
        ...todo.user,
        createdAt: todo.user.createdAt.toISOString(),
        updatedAt: todo.user.updatedAt.toISOString(),
        name: todo.user.name || ''
      } : null
    };
    
    const response: TodoResponse = { todo: formattedTodo };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/todos error:', error);
    return NextResponse.json(
      { error: "创建todo失败" }, 
      { status: 500 }
    );
  }
}