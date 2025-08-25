import {
  NextResponse
} from 'next/server';
// 导入Prisma客户端单例
import { prisma } from '@/lib/prisma';

/**
 * GET请求处理函数 - 获取所有用户列表
 * 路由：GET /api/todos/user
 */
export async function GET(request:Request){
  // 查询所有用户记录
  const user = await prisma.user.findMany();
  return NextResponse.json(user);
}