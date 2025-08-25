import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { type TodoStats } from '@/types';

/**
 * GET请求处理函数 - 获取Todo统计信息
 * 路由：GET /api/todos/stats
 */
export async function GET() {
  try {
    // 并行查询各种统计数据
    const [total, completed, pending] = await Promise.all([
      prisma.todo.count(),
      prisma.todo.count({ where: { completed: true } }),
      prisma.todo.count({ where: { completed: false } })
    ]);

    // 计算完成率
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const stats: TodoStats = {
      total,
      completed,
      pending,
      completionRate
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/todos/stats error:', error);
    return NextResponse.json(
      { error: "获取统计信息失败" }, 
      { status: 500 }
    );
  }
}
