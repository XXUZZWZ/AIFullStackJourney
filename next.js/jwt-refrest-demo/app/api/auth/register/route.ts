import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { emailRegex, passwordRegex } from '@/lib/regexp';

import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  // 注意容错 后端一定要稳定，面面俱到
  try {
    const { email, password } = await request.json();
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (existingUser) {
      console.error('User already exists');
      return NextResponse.json({ error: `User already exists` }, {
        status: 409
        // HTTP 状态码 409 表示 "Conflict"（冲突
      })
    }

    if (!email || !emailRegex.test(email)) {
      console.error('Email must be a valid email address');
      return NextResponse.json({ error: `Email and Password are required` }, {
        status: 400
      })
    }
    if (!password || !passwordRegex.test(password)) {
      console.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return NextResponse.json({ error: `Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character` }, {
        status: 400
      })
    }
    // 密码单向加密
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword', hashedPassword);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })
    return NextResponse.json({ message: `User registered successfully`, email: user.email }, {
      status: 201
      // HTTP 状态码 201 表示 "Created"（已创建）
    })
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json({ error: `Internal server error` }, {
      status: 500
    })
  } finally {
    // 释放数据库连接
    prisma.$disconnect();
  }
}