import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  type UpdateUserRequest,
  type UserResponse 
} from '@/types';

/**
 * GET请求处理函数 - 获取单个用户信息
 * 路由：GET /api/users/[id]
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
      include: {
        todos: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" }, 
        { status: 404 }
      );
    }

    const response: UserResponse = { user };
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json(
      { error: "获取用户信息失败" }, 
      { status: 500 }
    );
  }
}

/**
 * PUT请求处理函数 - 更新用户信息
 * 路由：PUT /api/users/[id]
 * 请求体：UpdateUserRequest
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email }: UpdateUserRequest = await req.json();

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(params.id) }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "用户不存在" }, 
        { status: 404 }
      );
    }

    // 如果更新邮箱，检查是否与其他用户冲突
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "邮箱已被其他用户使用" }, 
          { status: 409 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        ...(name && { name }),
        ...(email && { email })
      }
    });

    const response: UserResponse = { user };
    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json(
      { error: "更新用户信息失败" }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE请求处理函数 - 删除用户
 * 路由：DELETE /api/users/[id]
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(params.id) }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "用户不存在" }, 
        { status: 404 }
      );
    }

    // 删除用户（会级联删除相关的todos）
    await prisma.user.delete({
      where: { id: Number(params.id) }
    });

    return NextResponse.json(
      { message: "用户删除成功" }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json(
      { error: "删除用户失败" }, 
      { status: 500 }
    );
  }
}
