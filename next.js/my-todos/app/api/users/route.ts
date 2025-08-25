import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  type CreateUserRequest, 
  type UpdateUserRequest,
  type UsersResponse,
  type UserResponse,
  type ApiResponse 
} from '@/types';

/**
 * GET请求处理函数 - 获取所有用户列表
 * 路由：GET /api/users
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        todos: {
          select: {
            id: true,
            title: true,
            completed: true
          }
        }
      }
    });

    const response: UsersResponse = { users };
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { error: "获取用户列表失败" }, 
      { status: 500 }
    );
  }
}

/**
 * POST请求处理函数 - 创建新用户
 * 路由：POST /api/users
 * 请求体：CreateUserRequest
 */
export async function POST(req: Request) {
  try {
    const { name, email }: CreateUserRequest = await req.json();

    // 验证必填字段
    if (!name || !email) {
      return NextResponse.json(
        { error: "姓名和邮箱为必填项" }, 
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "邮箱已存在" }, 
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email
      }
    });

    const response: UserResponse = { user };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json(
      { error: "创建用户失败" }, 
      { status: 500 }
    );
  }
}
